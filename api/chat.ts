import { handleChatRequest, sanitizeErrorMessage } from '../src/server/aiService';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const rawMessage = req.body?.prompt ?? req.body?.message ?? req.body?.text;
    if (!rawMessage || typeof rawMessage !== 'string' || !rawMessage.trim()) {
      return res.status(400).json({
        success: false,
        status: 'error',
        error: 'Message parameter is required and cannot be empty.'
      });
    }

    const { history, pageContext, personality } = req.body || {};
    const text = await handleChatRequest(rawMessage.trim(), history, pageContext, personality);
    return res.status(200).json({
      success: true,
      text,
      reply: text,
      status: 'success'
    });
  } catch (error: any) {
    console.error('Vercel Serverless Gemini Error in /api/chat:', error);
    return res.status(500).json({
      success: false,
      status: 'error',
      error: sanitizeErrorMessage ? sanitizeErrorMessage(error) : (error.message || 'Failed to generate AI response')
    });
  }
}
