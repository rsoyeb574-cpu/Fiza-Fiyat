import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

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
      const { prompt } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.json({ 
          reply: "Fiza Hayat specializes in end-to-end luxury building design, Revit BIM modeling, photorealistic 8K rendering, and AI concept generation. Would you like to view our latest portfolio or generate an instant cost estimate?" 
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are Fiza AI, the architectural and design intelligence assistant for Fiza Hayat - a world-class digital business hub for building design, interior design, Revit BIM modeling, 8K rendering, and generative AI creative media. Answer concisely, professionally, and elegantly to: ${prompt}`,
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error('Gemini API error:', error);
      res.json({ 
        reply: "Fiza Hayat specializes in end-to-end luxury building design, Revit BIM modeling, photorealistic 8K rendering, and AI concept generation." 
      });
    }
  });

  // Vite middleware for development vs static serve for production
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
