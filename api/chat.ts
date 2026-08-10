import { handleChatRequest } from '../src/server/aiService';

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
    const { prompt, history, pageContext } = req.body || {};
    const text = await handleChatRequest(prompt, history, pageContext);
    return res.status(200).json({ text, reply: text, status: 'success' });
  } catch (error: any) {
    console.error('Vercel Serverless Gemini Error in /api/chat:', error);
    return res.status(500).json({
      status: 'error',
      error: error.message || 'Failed to generate AI response'
    });
  }
}
