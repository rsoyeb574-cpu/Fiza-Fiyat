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

  // Construction Intelligence AI Route using Gemini
  app.post('/api/construction-ai', async (req, res) => {
    try {
      const { type, location, qualityLevel, budgetINR, promptExtra } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(200).json({ status: 'fallback' });
      }

      const ai = new GoogleGenAI({ apiKey });
      const promptText = `You are the lead AI Structural Engineer and Interior Design Specialist for Fiza Hayat Construction Intelligence Platform.
User Request Type: ${type}
Location: ${location || 'India'}
Quality Level: ${qualityLevel || 'Standard'}
Budget: ${budgetINR ? '₹' + budgetINR : 'Standard'}
Additional Context: ${promptExtra || 'None'}

Return a structured JSON with:
{
  "title": "Clear Title",
  "summary": "1-2 sentence engineering summary",
  "recommendations": ["4 bullet points"],
  "suggestedMaterials": ["3-5 recommended material names"],
  "estimatedCostImpact": "1 sentence cost impact"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptText,
      });

      const rawText = response.text || '';
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return res.json(parsed);
      }
      return res.status(200).json({ status: 'fallback' });
    } catch (error) {
      console.error('Gemini Construction AI error:', error);
      return res.status(200).json({ status: 'fallback' });
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
