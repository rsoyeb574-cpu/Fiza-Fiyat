import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { handleChatRequest, handleConstructionAIRequest, sanitizeErrorMessage } from './src/server/aiService';
import { verifyAndIncrementServerUsage, getUserServerProfile, ActionType } from './src/server/planEnforcer';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf.toString();
    }
  }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Fiza Hayat Business Hub API' });
  });

  // Razorpay Create Subscription Endpoint
  app.post('/api/payment/create-subscription', async (req, res) => {
    try {
      const { planTier, userId, userEmail } = req.body;
      if (planTier !== 'medium' && planTier !== 'pro') {
        return res.status(400).json({ status: 'error', error: 'Invalid plan tier requested. Must be medium or pro.' });
      }

      const { createRazorpaySubscription } = await import('./src/server/razorpayService');
      const subData = await createRazorpaySubscription(planTier, userId, userEmail);

      return res.json({ status: 'success', ...subData });
    } catch (error: any) {
      console.error('Razorpay Create Subscription Error:', error);
      return res.status(500).json({
        status: 'error',
        error: error.message || 'Failed to create Razorpay subscription'
      });
    }
  });

  // Razorpay Verify Subscription Endpoint
  app.post('/api/payment/verify-subscription', async (req, res) => {
    try {
      const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, planTier, userId, userEmail } = req.body;

      if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
        return res.status(400).json({ status: 'error', error: 'Missing required Razorpay verification payload parameters.' });
      }

      const { verifySubscriptionPayment } = await import('./src/server/razorpayService');
      const verification = await verifySubscriptionPayment({
        razorpay_payment_id,
        razorpay_subscription_id,
        razorpay_signature,
        planTier,
        userId,
        userEmail
      });

      return res.json({ status: 'success', ...verification });
    } catch (error: any) {
      console.error('Razorpay Verification Error:', error);
      return res.status(400).json({
        status: 'error',
        error: error.message || 'Razorpay payment verification failed.'
      });
    }
  });

  // Razorpay Webhook Endpoint
  app.post('/api/payment/webhook', async (req: any, res) => {
    try {
      const signature = req.headers['x-razorpay-signature'] as string;
      const rawBody = req.rawBody || JSON.stringify(req.body);

      if (!signature) {
        return res.status(400).json({ status: 'error', error: 'Missing x-razorpay-signature header' });
      }

      const { processRazorpayWebhook } = await import('./src/server/razorpayService');
      const result = await processRazorpayWebhook(rawBody, signature);

      return res.json({ status: 'ok', ...result });
    } catch (error: any) {
      console.error('Razorpay Webhook Error:', error);
      return res.status(400).json({ status: 'error', error: error.message || 'Webhook processing failed' });
    }
  });

  // Get current User Plan and Usage status
  app.post('/api/user/plan', async (req, res) => {
    try {
      const { userId, userEmail } = req.body || {};
      const profile = await getUserServerProfile(userId, userEmail);
      return res.json({ status: 'success', profile });
    } catch (error: any) {
      return res.status(500).json({ status: 'error', error: error.message });
    }
  });

  // Set User Plan (Admin / Internal / Testing)
  app.post('/api/user/set-plan', async (req, res) => {
    try {
      const { userId, userEmail, plan } = req.body || {};
      const { setUserServerPlan } = await import('./src/server/planEnforcer');
      const profile = await setUserServerPlan(userId, userEmail, plan || 'pro');
      return res.json({ status: 'success', profile });
    } catch (error: any) {
      return res.status(500).json({ status: 'error', error: error.message });
    }
  });

  // AI Chat Route using Gemini with Server-Side Usage Limits
  app.post('/api/chat', async (req, res) => {
    try {
      const { prompt, history, pageContext, userId, userEmail } = req.body;

      // Server-side entitlement check
      const usageCheck = await verifyAndIncrementServerUsage(userId, userEmail, 'ai_chat');
      if (!usageCheck.allowed) {
        return res.status(429).json(usageCheck.errorResponse);
      }

      const text = await handleChatRequest(prompt, history, pageContext);
      return res.json({ text, reply: text, status: 'success', usage: usageCheck.profile.usage });
    } catch (error: any) {
      console.error('Gemini API error in /api/chat:', error);
      return res.status(500).json({
        status: 'error',
        error: sanitizeErrorMessage(error) || 'Failed to generate AI response'
      });
    }
  });

  // Construction Intelligence AI Route using Gemini with Server-Side Usage Limits
  app.post('/api/construction-ai', async (req, res) => {
    try {
      const { userId, userEmail, actionType } = req.body || {};
      const type: ActionType = (actionType === 'estimate' || actionType === 'boq' || actionType === 'estimate') 
        ? actionType 
        : 'concept';

      // Server-side entitlement check
      const usageCheck = await verifyAndIncrementServerUsage(userId, userEmail, type);
      if (!usageCheck.allowed) {
        return res.status(429).json(usageCheck.errorResponse);
      }

      const result = await handleConstructionAIRequest(req.body);
      return res.json({ ...result, status: 'success', usage: usageCheck.profile.usage });
    } catch (error: any) {
      console.error('Gemini Construction AI error:', error);
      return res.status(500).json({
        status: 'error',
        error: sanitizeErrorMessage(error) || 'Failed to generate construction AI response'
      });
    }
  });

  // AI Image Generation Endpoint
  app.post('/api/ai/generate-image', async (req, res) => {
    try {
      const { generateAIImage } = await import('./src/server/mediaAiService');
      const result = await generateAIImage(req.body || {});
      if (result.status === 'error' && (result.code === 'LIMIT_REACHED' || result.error === 'LIMIT_REACHED')) {
        return res.status(429).json(result);
      }
      if (result.status === 'error') {
        return res.status(400).json(result);
      }
      return res.json(result);
    } catch (error: any) {
      console.error('API /api/ai/generate-image error:', error);
      return res.status(500).json({
        status: 'error',
        error: 'GENERATION_FAILED',
        message: error.message || 'Image generation failed.'
      });
    }
  });

  // AI Video Generation Initiation Endpoint
  app.post('/api/ai/generate-video', async (req, res) => {
    try {
      const { startAIVideoGeneration } = await import('./src/server/mediaAiService');
      const result = await startAIVideoGeneration(req.body || {});
      if (result.status === 'error' && (result.code === 'LIMIT_REACHED' || result.error === 'LIMIT_REACHED')) {
        return res.status(429).json(result);
      }
      if (result.status === 'error' && (result.code === 'QUOTA_EXHAUSTED' || result.error === 'QUOTA_EXHAUSTED')) {
        return res.status(503).json(result);
      }
      if (result.status === 'error') {
        return res.status(400).json(result);
      }
      return res.json(result);
    } catch (error: any) {
      console.error('API /api/ai/generate-video error:', error);
      const isQuota = error?.status === 429 || `${error?.message || ''}`.includes('RESOURCE_EXHAUSTED');
      return res.status(isQuota ? 503 : 500).json({
        status: 'error',
        code: isQuota ? 'QUOTA_EXHAUSTED' : 'GENERATION_FAILED',
        error: isQuota ? 'QUOTA_EXHAUSTED' : 'GENERATION_FAILED',
        message: isQuota
          ? 'AI video generation is temporarily unavailable because the video generation quota is exhausted. Please try again later or contact support.'
          : (error.message || 'Video generation failed.')
      });
    }
  });

  // AI Video Generation Status Polling Endpoint
  app.post('/api/ai/video-status', async (req, res) => {
    try {
      const { pollVideoGenerationStatus } = await import('./src/server/mediaAiService');
      const result = await pollVideoGenerationStatus(req.body || {});
      return res.json(result);
    } catch (error: any) {
      console.error('API /api/ai/video-status error:', error);
      const isQuota = error?.status === 429 || `${error?.message || ''}`.includes('RESOURCE_EXHAUSTED');
      return res.status(isQuota ? 503 : 500).json({
        status: 'error',
        done: true,
        code: isQuota ? 'QUOTA_EXHAUSTED' : 'POLLING_FAILED',
        error: isQuota ? 'QUOTA_EXHAUSTED' : 'POLLING_FAILED',
        message: isQuota
          ? 'AI video generation is temporarily unavailable because the video generation quota is exhausted. Please try again later or contact support.'
          : (error.message || 'Video status polling failed.')
      });
    }
  });

  // AI Video Download Stream Proxy Endpoint
  app.get('/api/ai/video-download', async (req, res) => {
    try {
      const operationName = req.query.op as string;
      const genId = req.query.genId as string;

      if (!operationName) {
        return res.status(400).json({ error: 'Missing operation identifier.' });
      }

      // Security check: Validate against Firestore record if genId provided
      if (genId) {
        try {
          const { doc, getDoc } = await import('firebase/firestore');
          const { db } = await import('./src/lib/firebase');
          const genRef = doc(db, 'aiGenerations', genId);
          const snap = await getDoc(genRef);

          if (snap.exists()) {
            const data = snap.data();
            if (data.operationName && data.operationName !== operationName) {
              return res.status(403).json({ error: 'Unauthorized operation access.' });
            }
          }
        } catch (dbErr) {
          console.warn('Generation validation lookup warning:', dbErr);
        }
      }

      const { GoogleGenAI, GenerateVideosOperation } = await import('@google/genai');
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'AI service configuration missing on server.' });
      }

      const ai = new GoogleGenAI({ apiKey });
      const op = new GenerateVideosOperation();
      op.name = operationName;

      const updated = await ai.operations.getVideosOperation({ operation: op });
      const uri = updated.response?.generatedVideos?.[0]?.video?.uri;

      if (!uri) {
        return res.status(404).json({ error: 'Video stream is not ready or has expired.' });
      }

      const videoRes = await fetch(uri, {
        headers: { 'x-goog-api-key': apiKey }
      });

      if (!videoRes.ok) {
        return res.status(videoRes.status).json({ error: 'Failed to retrieve media stream from provider.' });
      }

      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Content-Disposition', 'inline; filename="fiza_ai_video.mp4"');
      res.setHeader('Cache-Control', 'public, max-age=86400');

      if (videoRes.body) {
        const reader = videoRes.body.getReader();
        let aborted = false;

        req.on('close', () => {
          aborted = true;
          reader.cancel().catch(() => {});
        });

        while (!aborted) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        if (!aborted) {
          res.end();
        }
      } else {
        res.status(500).json({ error: 'Failed to open video stream buffer.' });
      }
    } catch (error: any) {
      console.error('API /api/ai/video-download error:', error);
      return res.status(500).json({ error: 'Video streaming service unavailable.' });
    }
  });

  // Get AI Generation History Endpoint
  app.post('/api/ai/generations', async (req, res) => {
    try {
      const { userId, projectId } = req.body || {};
      const { getUserGenerationHistory } = await import('./src/server/mediaAiService');
      const history = await getUserGenerationHistory(userId, projectId);
      return res.json({ status: 'success', history });
    } catch (error: any) {
      return res.status(500).json({ status: 'error', error: error.message });
    }
  });
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Fiza Hayat Business Hub server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
