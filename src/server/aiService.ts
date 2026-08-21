import { GoogleGenAI } from '@google/genai';

export interface ChatMessageInput {
  sender?: 'user' | 'ai' | 'model';
  role?: 'user' | 'model' | 'assistant';
  text?: string;
  parts?: { text: string }[];
  content?: string;
}

export function isGeminiConfigured(): boolean {
  const apiKey = process.env.GEMINI_API_KEY;
  return Boolean(apiKey && apiKey.trim());
}

export function getConfiguredModel(): string {
  return process.env.GEMINI_MODEL?.trim() || 'gemini-3.7-flash';
}

export function getAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  return new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

function getModelCandidates(): string[] {
  const configured = process.env.GEMINI_MODEL?.trim();
  // Filter out any deprecated model strings that would return 404
  const isDeprecated = (m?: string) => !m || m.includes('2.5') || m.includes('2.0') || m.includes('1.5');

  const models = [
    ...(configured && !isDeprecated(configured) ? [configured] : []),
    'gemini-3.7-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest'
  ];
  return Array.from(new Set(models.filter(Boolean)));
}

async function generateWithModelFallback(params: {
  contents: any;
  config?: any;
}): Promise<string> {
  const ai = getAIClient();
  let lastError: any = null;
  const models = getModelCandidates();

  for (const modelName of models) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: params.contents,
        config: params.config
      });

      const text = response.text;
      if (text && text.trim()) {
        return text.trim();
      }
    } catch (err: any) {
      const errMsg = err?.message || (typeof err === 'string' ? err : 'Service temporary issue');
      console.info(`[AI Fallback] Model ${modelName} encountered: ${errMsg.slice(0, 100)} -> trying next available model.`);
      lastError = err;
      // Brief 150ms pause before trying next fallback model to relieve instantaneous spikes
      await new Promise(r => setTimeout(r, 150));
    }
  }

  throw lastError || new Error('All Gemini AI model attempts failed.');
}

export type AIPersonality = 'architectural' | 'creative' | 'engineering' | string;

export function getPersonalitySystemInstruction(personality?: AIPersonality, pageContext?: string): string {
  const norm = (personality || 'architectural').toLowerCase();

  let personalityProfile = '';

  if (norm.includes('creative') || norm.includes('concept')) {
    personalityProfile = `You are Fiza AI in 'Creative Conceptualist' mode — an avant-garde design visionary, experiential spatial artist, and creative director for Fiza Hayat.
Tone & Persona:
- Inspiring, innovative, imaginative, and visually descriptive.
- Focus on emotional ambiance, avant-garde sculptural forms, biophilic integration, dynamic natural & accent lighting, rich color palettes, and transformative architectural storytelling.
- Offer daring, out-of-the-box conceptual ideas and artistic spatial solutions while maintaining luxury craftsmanship.`;
  } else if (norm.includes('engineer') || norm.includes('specialist') || norm.includes('structural')) {
    personalityProfile = `You are Fiza AI in 'Engineering Specialist' mode — a senior structural engineer, civil technologist, and construction systems specialist for Fiza Hayat.
Tone & Persona:
- Rigorous, analytical, precise, code-compliant, and metric-oriented.
- Focus on structural load paths, seismic & wind resistance (IS 1893/IS 456, ACI/Eurocode), material specifications (Fe500D TMT, PPC/OPC cement, AAC blocks, M25/M30 concrete), foundation integrity, MEP/BIM coordination, and BOQ/cost optimization.
- Provide actionable engineering data, calculation formulas, standard tolerances, and construction best practices.`;
  } else {
    // Default: Architectural Professional
    personalityProfile = `You are Fiza AI in 'Architectural Professional' mode — a senior principal architect and BIM design consultant for Fiza Hayat — an elite digital architectural hub specializing in luxury residential & commercial architecture, Revit BIM modeling (LOD 300 to 500), and 8K photorealistic visualization.
Tone & Persona:
- Refined, articulate, authoritative, polite, and thoroughly structured.
- Balance elegant spatial ergonomics, zoning, circulation flows, luxury material palettes (e.g. Travertine, Champagne Bronze, Fluted Oak), and client-ready architectural advice.
- Provide clear, professional recommendations formatted with clean bullet points.`;
  }

  return `${personalityProfile}

Core Directives:
1. Provide direct, conversational, polite, and highly accurate answers to the user's specific question according to your active personality mode.
2. For greetings like "Hi", "Hello", "Hey", give a warm, natural greeting reflecting your active tone without repeating lengthy sales pitches.
3. For building, interior, structural, or estimation questions, deliver structured, clear, and informative insights.
4. Keep formatting clean with bullet points or numbered lists where appropriate.
${pageContext ? `Current Active Page Context: ${pageContext}` : ''}`;
}

export async function handleChatRequest(
  promptOrMessage: string,
  history: ChatMessageInput[] = [],
  pageContext?: string,
  personality?: AIPersonality
): Promise<string> {
  if (!promptOrMessage || !promptOrMessage.trim()) {
    throw new Error('Message parameter is required and cannot be empty.');
  }

  const rawContents: { role: 'user' | 'model'; text: string }[] = [];

  if (Array.isArray(history)) {
    for (const msg of history) {
      if (!msg) continue;
      
      let text = '';
      if (typeof msg.text === 'string' && msg.text.trim()) {
        text = msg.text.trim();
      } else if (typeof msg.content === 'string' && msg.content.trim()) {
        text = msg.content.trim();
      } else if (Array.isArray(msg.parts) && msg.parts.length > 0) {
        text = msg.parts.map(p => p.text || '').join('\n').trim();
      }

      if (text) {
        const isUser = msg.sender === 'user' || msg.role === 'user';
        rawContents.push({
          role: isUser ? 'user' : 'model',
          text
        });
      }
    }
  }

  // Gemini API requires the conversation to start with a 'user' turn.
  // Find index of first 'user' message in history (dropping initial bot greetings)
  const firstUserIdx = rawContents.findIndex(c => c.role === 'user');
  const validHistory = firstUserIdx !== -1 ? rawContents.slice(firstUserIdx) : [];

  // Combine consecutive messages with same role to ensure strictly alternating turns (user, model, user, model...)
  const contents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];

  for (const item of validHistory) {
    if (contents.length === 0) {
      contents.push({
        role: item.role,
        parts: [{ text: item.text }]
      });
    } else {
      const last = contents[contents.length - 1];
      if (last.role === item.role) {
        last.parts[0].text += `\n${item.text}`;
      } else {
        contents.push({
          role: item.role,
          parts: [{ text: item.text }]
        });
      }
    }
  }

  // Ensure user's prompt is present in the final turn as 'user'
  const trimmedPrompt = promptOrMessage.trim();
  if (contents.length === 0) {
    contents.push({
      role: 'user',
      parts: [{ text: trimmedPrompt }]
    });
  } else {
    const last = contents[contents.length - 1];
    if (last.role === 'user') {
      if (!last.parts[0].text.includes(trimmedPrompt)) {
        last.parts[0].text = trimmedPrompt;
      }
    } else {
      contents.push({
        role: 'user',
        parts: [{ text: trimmedPrompt }]
      });
    }
  }

  const systemInstruction = getPersonalitySystemInstruction(personality, pageContext);

  return await generateWithModelFallback({
    contents,
    config: {
      systemInstruction,
      temperature: personality?.toLowerCase().includes('creative') ? 0.85 : 0.65,
    }
  });
}

export function sanitizeErrorMessage(err: any): string {
  if (!err) return 'An unexpected error occurred.';
  let msg = typeof err === 'string' ? err : (err.message || String(err));
  try {
    const parsed = JSON.parse(msg);
    if (parsed && parsed.error && parsed.error.message) {
      msg = parsed.error.message;
    }
  } catch {}

  // Strip sensitive terms if any
  if (msg.includes('AIzaSy') || msg.includes('API_KEY')) {
    return 'Authentication error occurred while contacting AI service.';
  }

  return msg;
}

export async function handleConstructionAIRequest(body: any): Promise<any> {
  const { type, location, qualityLevel, budgetINR, promptExtra } = body || {};

  const promptText = `You are the lead AI Structural Engineer and Interior Design Specialist for Fiza Hayat Construction Intelligence Platform.

User Request Type: ${type || 'general'}
Location: ${location || 'India'}
Quality Level: ${qualityLevel || 'Standard'}
Budget: ${budgetINR ? '₹' + budgetINR : 'Standard'}
Additional Context: ${promptExtra || 'None'}

Return a valid JSON object matching this schema:
{
  "title": "Clear Title",
  "summary": "1-2 sentence engineering summary",
  "recommendations": ["4 bullet points"],
  "suggestedMaterials": ["3-5 recommended material names"],
  "estimatedCostImpact": "1 sentence cost impact"
}`;

  try {
    const rawText = await generateWithModelFallback({
      contents: promptText,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const cleanText = rawText.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (err: any) {
    console.warn('Gemini Construction AI JSON parsing error, returning fallback schema:', err?.message || err);
  }

  return {
    title: `AI Recommendation for ${location || 'Project'}`,
    summary: `Engineered structural and material guidance for ${qualityLevel || 'Standard'} quality construction.`,
    recommendations: [
      'Utilize PPC grade cement for enhanced durability and crack resistance.',
      'Specify high-ductility Fe500D TMT bars for seismic resilience.',
      'Incorporate thermal-efficient AAC blocks to reduce dead loads.',
      'Apply waterproofing coatings to foundations and exposed roof slabs.'
    ],
    suggestedMaterials: ['PPC Cement', 'Fe500D TMT Rebar', 'AAC Blocks', 'Polymer Adhesive'],
    estimatedCostImpact: 'Optimizes raw material usage by up to 10-12%.'
  };
}

