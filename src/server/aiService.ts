import { GoogleGenAI } from '@google/genai';

export interface ChatMessageInput {
  sender: 'user' | 'ai' | 'model';
  text: string;
}

export function getAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    throw new Error('GEMINI_API_KEY is not set. Please configure GEMINI_API_KEY in your environment variables.');
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

export async function handleChatRequest(
  prompt: string,
  history: ChatMessageInput[] = [],
  pageContext?: string
): Promise<string> {
  if (!prompt || !prompt.trim()) {
    throw new Error('Prompt cannot be empty.');
  }

  const ai = getAIClient();

  const rawContents: { role: 'user' | 'model'; text: string }[] = [];

  if (Array.isArray(history)) {
    for (const msg of history) {
      if (msg && msg.text && msg.text.trim()) {
        const role = (msg.sender === 'user' || (msg as any).role === 'user') ? 'user' : 'model';
        rawContents.push({ role, text: msg.text.trim() });
      }
    }
  }

  // Find index of first 'user' message in history (dropping initial bot greetings)
  const firstUserIdx = rawContents.findIndex(c => c.role === 'user');
  const validHistory = firstUserIdx !== -1 ? rawContents.slice(firstUserIdx) : [];

  // Combine consecutive messages with same role to ensure strict alternating sequence
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

  // Ensure prompt is present in the final turn as 'user'
  const trimmedPrompt = prompt.trim();
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

  const systemInstruction = `You are Fiza AI, the architectural & structural design intelligence assistant for Fiza Hayat — an elite digital business hub specializing in luxury building architecture, interior design, Autodesk Revit BIM modeling (LOD 300 to 500), 8K photorealistic rendering, and AI creative media.

Core Directives:
1. Provide direct, conversational, polite, and highly accurate answers to the user's specific question.
2. For greetings like "Hi", "Hello", "Hey", give a warm, natural greeting without repeating standard sales pitches.
3. For technical building or engineering questions (e.g., "What is a foundation?", "What is a 3BHK plan?", "Explain Revit LOD 500"), deliver a clear, structured, informative, and professional answer.
4. Keep formatting clean with bullet points or numbered lists where appropriate.
${pageContext ? `Current Active Page Context: ${pageContext}` : ''}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: contents,
    config: {
      systemInstruction,
      temperature: 0.7,
    }
  });

  const generatedText = response.text;
  if (!generatedText || !generatedText.trim()) {
    throw new Error('Gemini API returned an empty response.');
  }

  return generatedText.trim();
}

export async function handleConstructionAIRequest(body: any): Promise<any> {
  const { type, location, qualityLevel, budgetINR, promptExtra } = body || {};
  const ai = getAIClient();

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

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: promptText,
    config: {
      responseMimeType: 'application/json'
    }
  });

  const rawText = response.text || '';
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  throw new Error('Failed to parse JSON response from Gemini Construction AI.');
}
