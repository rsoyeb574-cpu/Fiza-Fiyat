import { GoogleGenAI } from '@google/genai';
import { getMetalKnowledgeContextForAI } from '../data/metalKnowledge';

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
  return process.env.GEMINI_MODEL?.trim() || 'gemini-3.8-flash';
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
  const models = [
    ...(configured ? [configured] : []),
    'gemini-3.8-flash',
    'gemini-3.1-flash-lite',
    'gemini-2.5-flash',
    'gemini-flash-latest',
    'gemini-3.1-pro-preview'
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
    for (let attempt = 1; attempt <= 2; attempt++) {
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
        lastError = err;
        const errMsg = err?.message || (typeof err === 'string' ? err : 'Service temporary issue');
        const is503 = err?.status === 503 || err?.code === 503 || errMsg.includes('503') || errMsg.includes('high demand');

        if (is503 && attempt === 1) {
          console.info(`[AI Retry] Model ${modelName} experiencing high demand (503), retrying in 600ms...`);
          await new Promise(r => setTimeout(r, 600));
          continue;
        }

        console.info(`[AI Fallback] Model ${modelName} encountered: ${errMsg.slice(0, 100)} -> trying next available model.`);
        await new Promise(r => setTimeout(r, 300));
        break;
      }
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
5. You are a TEXT-BASED architectural and construction conversational assistant. Provide thorough, descriptive textual answers, specifications, and layout descriptions. Do NOT attempt or promise to generate images or call external image generation tools in this chat. Image and video generation is handled exclusively in the dedicated AI Media Studio.
6. MS & STRUCTURAL STEEL KNOWLEDGE PROTOCOL:
When users ask about Mild Steel (MS), Carbon Steel, Structural Steel sections (ISMB, ISMC, ISA, SHS/RHS), Sheet Metal (HR, CR, GI), Welding (SMAW, MIG, TIG, SAW), Weld Defects (Porosity, Undercut, Cracks, Lack of Fusion), Corrosion/Rust, or Bolted Connections:
- Differentiate clearly between surface rust and structural section loss.
- Reference authoritative engineering standards: BIS (IS 2062, IS 800:2007, IS 808, IS 2629, IS 9595), AWS D1.1, AISC 360, and ISO 12944.
- Recommend Non-Destructive Testing (VT, PT, MT, UT, RT) where applicable.
- Emphasize safety: note that chat advice is a preliminary assessment and cannot substitute for on-site physical ultrasonic thickness gauging or review by a licensed structural engineer / certified welding inspector. If critical instability (buckling, joint tear-out) is described, advise immediate stop-work.
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

  let systemInstruction = getPersonalitySystemInstruction(personality, pageContext);

  const metalKeywords = ['steel', 'metal', 'ms', 'mild steel', 'sheet', 'galvanized', 'stainless', 'welding', 'weld', 'aisc', 'aws', 'bis', 'is 2062', 'is 1079', 'is 513', 'is 277', 'is 6911', 'astm a36', 'astm a572', 'yield strength', 'tensile strength', 'ductility', 'elongation'];
  const isMetalQuery = metalKeywords.some(kw => trimmedPrompt.toLowerCase().includes(kw) || (pageContext && pageContext.toLowerCase().includes(kw)));
  if (isMetalQuery) {
    const metalContext = getMetalKnowledgeContextForAI(trimmedPrompt);
    systemInstruction += `\n\nAUTHORITATIVE STRUCTURAL METAL & SHEET METAL METALLURGICAL DATABASE:\n${metalContext}`;
  }

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
  const { type, location, qualityLevel, budgetINR, plotSize, promptExtra } = body || {};

  const promptText = `You are the lead AI Structural Engineer, BOQ Specialist, and Interior Design Architect for Fiza Hayat Construction Intelligence Platform.

Request Details:
- Analysis Type: ${type || 'materials'}
- Location: ${location || 'Regional India'}
- Quality Level: ${qualityLevel || 'Standard'}
- Budget: ${budgetINR ? '₹' + Number(budgetINR).toLocaleString('en-IN') : 'Standard market rate'}
- Plot Size / Area: ${plotSize || 'Standard Residential Unit'}
- Context / Specific User Notes: ${promptExtra || 'Standard civil engineering & architectural guidance'}

Return a valid, well-structured JSON object matching this schema:
{
  "title": "Precise, professional engineering/design title",
  "summary": "2-3 sentence technical and realistic summary",
  "recommendations": ["4-5 detailed, highly specific, code-compliant bullet points"],
  "suggestedMaterials": ["4-6 specific branded or grade-specified construction materials"],
  "colorPalette": [
    { "name": "Color Name", "hex": "#HEXCODE", "usage": "Specific architectural or interior location" }
  ],
  "layoutAdvice": ["2-3 ergonomic and spatial circulation recommendations"],
  "estimatedCostImpact": "Realistic cost optimization or budget impact sentence"
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
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.title && Array.isArray(parsed.recommendations)) {
        return parsed;
      }
    }
  } catch (err: any) {
    console.warn('Gemini Construction AI JSON parsing error, returning fallback schema:', err?.message || err);
  }

  return {
    title: `AI Structural & Material Specification for ${location || 'Project'}`,
    summary: `Engineered structural and material guidance for ${qualityLevel || 'Standard'} quality construction complying with national building codes.`,
    recommendations: [
      'Utilize PPC grade cement (IS 1489) for enhanced durability, low heat of hydration, and crack resistance.',
      'Specify high-ductility Fe500D TMT bars (IS 1786) for seismic resilience with >16% elongation.',
      'Incorporate thermal-efficient AAC blocks to reduce structural dead loads by 20% compared to red bricks.',
      'Apply 2-coat polymer modified cementitious elastomeric waterproofing membrane to foundations and exposed roof slabs.'
    ],
    suggestedMaterials: ['UltraTech / ACC PPC Cement', 'Tata Tiscon Fe500D TMT Rebar', 'Magicrete 6" AAC Blocks', 'Dr. Fixit Fastflex Elastomeric Waterproofing'],
    colorPalette: [
      { name: 'Warm Cream Base', hex: '#F8F6F0', usage: 'Primary Interior Walls' },
      { name: 'Slate Gray Accent', hex: '#334155', usage: 'Window Frames & Architectural Grooves' },
      { name: 'Natural Teak Wood', hex: '#8C5221', usage: 'Main Entry Doors & Louvers' }
    ],
    layoutAdvice: [
      'Maintain clear 3.5 ft circulation paths between main living furniture and dining entrances.',
      'Position master bedroom on the southern or south-western corner for optimal ventilation.'
    ],
    estimatedCostImpact: 'Optimizes raw material procurement and reduces structural wastage by 10-14%.'
  };
}

