import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { handleChatRequest, handleConstructionAIRequest } from './src/server/aiService';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Fiza Hayat Business Hub API' });
  });

  // AI Chat Route using Gemini
  app.post('/api/chat', async (req, res) => {
    try {
      const { prompt, history, pageContext } = req.body;
      const text = await handleChatRequest(prompt, history, pageContext);
      return res.json({ text, reply: text, status: 'success' });
    } catch (error: any) {
      console.error('Gemini API error in /api/chat:', error);
      return res.status(500).json({
        status: 'error',
        error: error.message || 'Failed to generate AI response'
      });
    }
  });

  // Construction Intelligence AI Route using Gemini
  app.post('/api/construction-ai', async (req, res) => {
    try {
      const result = await handleConstructionAIRequest(req.body);
      return res.json({ ...result, status: 'success' });
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
