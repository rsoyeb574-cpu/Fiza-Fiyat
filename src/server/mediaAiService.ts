import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';
import { doc, setDoc, updateDoc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { checkServerMediaLimit, incrementServerMediaUsage, getUserServerProfile } from './planEnforcer';
import { MEDIA_COSTS } from '../config/plans';
import { AIGenerationRecord } from '../types/userProfile';

export const VEO_QUOTA_EXHAUSTED_MESSAGE =
  'AI video generation is temporarily unavailable because the video generation quota is exhausted. Please try again later or contact support.';

export function isQuotaExhaustedError(err: any): boolean {
  if (!err) return false;
  if (err.status === 429 || err.code === 429 || err.statusCode === 429) return true;
  const errStr = typeof err === 'string'
    ? err
    : `${err.message || ''} ${err.name || ''} ${err.status || ''} ${err.code || ''} ${JSON.stringify(err)}`;
  const lower = errStr.toLowerCase();
  return (
    lower.includes('resource_exhausted') ||
    lower.includes('quota') ||
    lower.includes('rate_limit') ||
    lower.includes('429') ||
    lower.includes('exhausted')
  );
}

function getAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

/**
 * Validate prompt relevance against project context
 */
export async function validateProjectContext(prompt: string, projectContext: string): Promise<{ isValid: boolean; reason?: string }> {
  try {
    const ai = getAIClient();
    const systemInstruction = `You are a strict project relevance validator for Fiza-Fiyat — an architectural, BIM engineering, interior design, and construction SaaS platform.
Compare the user's prompt against the selected project context.

Project Context: "${projectContext || 'General Construction & Architectural Design'}"
User Prompt: "${prompt}"

Your task is to determine if the prompt is relevant or plausible for an architectural visualization, interior/exterior design, floor plan, construction element, landscaping, building material, elevation, or civil engineering asset related to "${projectContext}".

Rule:
- If the prompt is completely unrelated (e.g. automobile like Ferrari/Tesla, celebrity, fantasy monster, space alien, cooking recipe, cryptocurrency, unrelated animal, general code, etc.) having NO connection to buildings, interior, exterior, architecture, civil construction, site, or design of "${projectContext}", set isValid = false.
- If it is reasonably related to architectural design, interior, exterior, construction, furniture, layout, lighting, structure, or building visualization for "${projectContext}", set isValid = true.

Respond in JSON ONLY:
{"isValid": boolean, "reason": "brief explanation if invalid"}`;

    let jsonText = '';
    const modelsToTry = ['gemini-3.7-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    for (const m of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: m,
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json'
          }
        });
        jsonText = response.text?.trim() || '';
        if (jsonText) break;
      } catch (mErr: any) {
        console.info(`[Validation Fallback] Model ${m} encountered issue: ${mErr?.message?.slice(0, 100) || 'busy'} -> trying next model`);
      }
    }
    if (jsonText) {
      const parsed = JSON.parse(jsonText);
      if (typeof parsed.isValid === 'boolean') {
        return {
          isValid: parsed.isValid,
          reason: parsed.reason || 'This request is not related to your current project. Please enter a prompt related to your selected project.'
        };
      }
    }
  } catch (err) {
    console.warn('Project context validation error, falling back to heuristic keyword check:', err);
    const text = prompt.toLowerCase();
    const forbiddenKeywords = ['ferrari', 'lamborghini', 'porsche', 'alien', 'spaceship', 'monster', 'recipe', 'bitcoin', 'crypto'];
    for (const kw of forbiddenKeywords) {
      if (text.includes(kw)) {
        return {
          isValid: false,
          reason: 'This request is not related to your current project. Please enter a prompt related to your selected project.'
        };
      }
    }
  }

  return { isValid: true };
}

/**
 * Server-side AI Image Generation
 */
export async function generateAIImage(params: {
  userId: string | null;
  userEmail: string | null;
  projectId: string;
  projectContext: string;
  prompt: string;
  style?: string;
  aspectRatio?: string;
  resolution?: string;
}): Promise<any> {
  const { userId, userEmail, projectId, projectContext, prompt, style = 'Photorealistic', aspectRatio = '1:1', resolution = '1K' } = params;

  // 1. Validate project context
  const validation = await validateProjectContext(prompt, projectContext);
  if (!validation.isValid) {
    return {
      status: 'error',
      error: 'UNRELATED_PROMPT',
      message: 'This request is not related to your current project. Please enter a prompt related to your selected project.'
    };
  }

  // 2. Check Plan & Limits
  const limitCheck = await checkServerMediaLimit(userId, userEmail, 'image', { resolution });
  if (!limitCheck.allowed) {
    return limitCheck.errorResponse;
  }

  // 3. Select Gemini Image Model
  const ai = getAIClient();
  const isHighRes = resolution === '4K' || limitCheck.profile.plan === 'pro';
  const modelName = isHighRes ? 'gemini-3.1-flash-image' : 'gemini-3.1-flash-lite-image';

  // Map aspect ratio for Gemini SDK
  let mappedAspectRatio = '1:1';
  if (aspectRatio === '16:9') mappedAspectRatio = '16:9';
  else if (aspectRatio === '9:16') mappedAspectRatio = '9:16';
  else if (aspectRatio === '4:5' || aspectRatio === '3:4') mappedAspectRatio = '3:4';

  const fullPrompt = `Architectural & Design Visualization: ${prompt}. Project Context: ${projectContext}. Visual Style: ${style}. Rendered with high architectural fidelity, precise lighting, materials, and realistic structural depth.`;

  try {
    const config: any = {
      imageConfig: {
        aspectRatio: mappedAspectRatio
      }
    };

    if (resolution === '1K' || resolution === '2K' || resolution === '4K') {
      config.imageConfig.imageSize = resolution;
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [{ text: fullPrompt }]
      },
      config
    });

    let imageUrl = '';
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      throw new Error('Image model did not return image data.');
    }

    // 4. Save record to Firestore
    const creditsUsed = resolution === '4K' ? MEDIA_COSTS.IMAGE_4K_COST : MEDIA_COSTS.IMAGE_STANDARD_COST;
    const genId = `gen_img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const uid = userId || 'anonymous_guest_user';

    const record: AIGenerationRecord = {
      id: genId,
      userId: uid,
      projectId: projectId || 'default',
      projectContext,
      type: 'image',
      prompt,
      style,
      aspectRatio,
      resolution,
      model: modelName,
      status: 'completed',
      resultUrl: imageUrl,
      creditsUsed,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'aiGenerations', genId), record);
    } catch (dbErr) {
      console.warn('Firestore write aiGenerations warning:', dbErr);
    }

    // 5. Deduct credit ONLY after successful generation
    await incrementServerMediaUsage(userId, userEmail, 'image');

    return {
      status: 'success',
      data: record
    };
  } catch (err: any) {
    console.error('Image generation error:', err);
    return {
      status: 'error',
      error: 'GENERATION_FAILED',
      message: err.message || 'AI image generation failed. Your generation credit was not deducted.'
    };
  }
}

/**
 * Server-side AI Video Generation (Veo)
 */
export async function startAIVideoGeneration(params: {
  userId: string | null;
  userEmail: string | null;
  projectId: string;
  projectContext: string;
  prompt: string;
  referenceImage?: string; // base64
  aspectRatio?: string;
  includeAudio?: boolean;
}): Promise<any> {
  const { userId, userEmail, projectId, projectContext, prompt, referenceImage, aspectRatio = '16:9', includeAudio = false } = params;

  // 1. Validate project context
  const validation = await validateProjectContext(prompt, projectContext);
  if (!validation.isValid) {
    return {
      status: 'error',
      error: 'UNRELATED_PROMPT',
      message: 'This request is not related to your current project. Please enter a prompt related to your selected project.'
    };
  }

  // 2. Check Plan & Limits
  const limitCheck = await checkServerMediaLimit(userId, userEmail, 'video', { includeAudio });
  if (!limitCheck.allowed) {
    return limitCheck.errorResponse;
  }

  // 3. Initiate Veo Video Generation
  const ai = getAIClient();
  const modelName = 'veo-3.1-lite-generate-preview';
  const fullPrompt = `Architectural 3D Walkthrough Animation: ${prompt}. Context: ${projectContext}. Smooth camera panning, photorealistic lighting and textures.`;

  try {
    const videoConfig: any = {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9'
    };

    const videoParams: any = {
      model: modelName,
      prompt: fullPrompt,
      config: videoConfig
    };

    if (referenceImage) {
      const base64Clean = referenceImage.replace(/^data:image\/\w+;base64,/, '');
      videoParams.image = {
        imageBytes: base64Clean,
        mimeType: 'image/png'
      };
    }

    const operation = await ai.models.generateVideos(videoParams);

    if (!operation || !operation.name) {
      throw new Error('Failed to initiate video generation operation.');
    }

    const genId = `gen_vid_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const uid = userId || 'anonymous_guest_user';
    const creditsUsed = includeAudio ? MEDIA_COSTS.VIDEO_AUDIO_COST : MEDIA_COSTS.VIDEO_STANDARD_COST;

    const record: AIGenerationRecord = {
      id: genId,
      userId: uid,
      projectId: projectId || 'default',
      projectContext,
      type: 'video',
      prompt,
      aspectRatio,
      resolution: '720p',
      model: modelName,
      status: 'pending',
      operationName: operation.name,
      creditsUsed,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'aiGenerations', genId), record);
    } catch (dbErr) {
      console.warn('Firestore write video aiGenerations warning:', dbErr);
    }

    return {
      status: 'success',
      generationId: genId,
      operationName: operation.name,
      record
    };
  } catch (err: any) {
    // 7. Log detailed provider error ONLY on server
    console.error('[Veo Video Generation Provider Error in startAIVideoGeneration]:', err);

    const isQuota = isQuotaExhaustedError(err);
    const genId = `gen_vid_failed_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const uid = userId || 'anonymous_guest_user';

    // 3. Mark the generation as failed in Firestore & do not deduct credit
    try {
      await setDoc(doc(db, 'aiGenerations', genId), {
        id: genId,
        userId: uid,
        projectId: projectId || 'default',
        projectContext,
        type: 'video',
        prompt,
        aspectRatio,
        resolution: '720p',
        model: modelName,
        status: 'failed',
        error: isQuota ? 'QUOTA_EXHAUSTED' : 'GENERATION_FAILED',
        errorMessage: isQuota
          ? VEO_QUOTA_EXHAUSTED_MESSAGE
          : (err.message || 'AI video generation failed to start.'),
        creditsUsed: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (dbErr) {
      console.warn('Firestore write failed video record warning:', dbErr);
    }

    if (isQuota) {
      return {
        status: 'error',
        code: 'QUOTA_EXHAUSTED',
        error: 'QUOTA_EXHAUSTED',
        message: VEO_QUOTA_EXHAUSTED_MESSAGE
      };
    }

    return {
      status: 'error',
      error: 'GENERATION_FAILED',
      message: err.message || 'AI video generation failed to start. Your video credit was not deducted.'
    };
  }
}

/**
 * Poll status of Veo Video Generation operation
 */
export async function pollVideoGenerationStatus(params: {
  userId: string | null;
  userEmail: string | null;
  operationName: string;
  generationId: string;
}): Promise<any> {
  const { userId, userEmail, operationName, generationId } = params;

  try {
    const ai = getAIClient();
    const op = new GenerateVideosOperation();
    op.name = operationName;

    const updated = await ai.operations.getVideosOperation({ operation: op });

    // Check if operation returned an error payload from provider
    if (updated.error) {
      console.error('[Veo Provider Error in pollVideoGenerationStatus]:', updated.error);
      const isQuota = isQuotaExhaustedError(updated.error);

      if (generationId) {
        await updateDoc(doc(db, 'aiGenerations', generationId), {
          status: 'failed',
          error: isQuota ? 'QUOTA_EXHAUSTED' : 'OPERATION_FAILED',
          errorMessage: isQuota
            ? VEO_QUOTA_EXHAUSTED_MESSAGE
            : 'Video rendering encountered an error.',
          updatedAt: new Date().toISOString()
        }).catch(() => {});
      }

      return {
        status: 'error',
        done: true,
        code: isQuota ? 'QUOTA_EXHAUSTED' : 'OPERATION_FAILED',
        error: isQuota ? 'QUOTA_EXHAUSTED' : 'OPERATION_FAILED',
        message: isQuota
          ? VEO_QUOTA_EXHAUSTED_MESSAGE
          : 'Video rendering failed during processing. Your video credit was not deducted.'
      };
    }

    if (!updated.done) {
      return {
        status: 'pending',
        done: false,
        message: 'Video rendering in progress...'
      };
    }

    // Video completed!
    const generatedVideos = updated.response?.generatedVideos;
    const videoObj = generatedVideos?.[0]?.video;

    if (!videoObj || !videoObj.uri) {
      // Mark record failed
      if (generationId) {
        await updateDoc(doc(db, 'aiGenerations', generationId), {
          status: 'failed',
          errorMessage: 'Video generation completed without video URI.',
          updatedAt: new Date().toISOString()
        }).catch(() => {});
      }
      return {
        status: 'error',
        done: true,
        message: 'Video generation completed without video URI. Your credit was not deducted.'
      };
    }

    // Direct proxy download URL for client
    const proxyVideoUrl = `/api/ai/video-download?op=${encodeURIComponent(operationName)}&genId=${encodeURIComponent(generationId || '')}`;

    // Update record in Firestore idempotently
    if (generationId) {
      const genRef = doc(db, 'aiGenerations', generationId);
      const snap = await getDoc(genRef).catch(() => null);
      const prevData = snap && snap.exists() ? snap.data() : null;

      if (prevData?.status === 'completed') {
        // Already processed and credited once
        return {
          status: 'completed',
          done: true,
          resultUrl: prevData.resultUrl || proxyVideoUrl
        };
      }

      await updateDoc(genRef, {
        status: 'completed',
        resultUrl: proxyVideoUrl,
        updatedAt: new Date().toISOString()
      }).catch(() => {});

      // Deduct credit ONLY ONCE after initial transition to completed
      await incrementServerMediaUsage(userId, userEmail, 'video');
    }

    return {
      status: 'completed',
      done: true,
      resultUrl: proxyVideoUrl
    };
  } catch (err: any) {
    console.error('[Veo Polling Exception in pollVideoGenerationStatus]:', err);
    const isQuota = isQuotaExhaustedError(err);

    if (generationId) {
      await updateDoc(doc(db, 'aiGenerations', generationId), {
        status: 'failed',
        error: isQuota ? 'QUOTA_EXHAUSTED' : 'POLLING_FAILED',
        errorMessage: isQuota
          ? VEO_QUOTA_EXHAUSTED_MESSAGE
          : (err.message || 'Failed to retrieve video status.'),
        updatedAt: new Date().toISOString()
      }).catch(() => {});
    }

    return {
      status: 'error',
      done: true,
      code: isQuota ? 'QUOTA_EXHAUSTED' : 'POLLING_FAILED',
      error: isQuota ? 'QUOTA_EXHAUSTED' : 'POLLING_FAILED',
      message: isQuota
        ? VEO_QUOTA_EXHAUSTED_MESSAGE
        : (err.message || 'Failed to retrieve video status. Your video credit was not deducted.')
    };
  }
}

/**
 * Fetch generation history for user/project
 */
export async function getUserGenerationHistory(userId: string | null, projectId?: string): Promise<AIGenerationRecord[]> {
  const uid = userId || 'anonymous_guest_user';
  try {
    const q = query(
      collection(db, 'aiGenerations'),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(30)
    );
    const snap = await getDocs(q);
    const list: AIGenerationRecord[] = [];
    snap.forEach(docSnap => {
      list.push(docSnap.data() as AIGenerationRecord);
    });
    return list;
  } catch (err) {
    console.warn('Error fetching generation history:', err);
    return [];
  }
}
