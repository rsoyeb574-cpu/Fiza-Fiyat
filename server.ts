import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { handleChatRequest, handleConstructionAIRequest } from './src/server/aiService';
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
        error: error.message || 'Failed to generate AI response'
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
        error: error.message || 'Failed to generate construction AI response'
      });
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
