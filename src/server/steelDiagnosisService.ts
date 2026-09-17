import { GoogleGenAI } from '@google/genai';
import {
  SteelInspectionReport,
  SteelDiagnosticFinding,
  SteelAnnotation,
  SteelQAInput,
  SteelQAResponse,
  SteelSeverityLevel
} from '../types/steelDiagnosis';
import { STEEL_DEFECTS_DATABASE, NDT_METHODS_DATABASE } from '../data/steelKnowledgeBase';
import { getMetalKnowledgeContextForAI, METAL_KNOWLEDGE_DATABASE } from '../data/metalKnowledge';

function getAIClient(): GoogleGenAI {
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

function getCandidateModels(): string[] {
  const configured = process.env.GEMINI_MODEL?.trim();
  const validConfigured = (configured && !configured.includes('gemini-2.') && !configured.includes('gemini-1.') && !configured.includes('pro'))
    ? configured
    : null;
  const models = [
    ...(validConfigured ? [validConfigured] : []),
    'gemini-3.8-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest'
  ];
  return Array.from(new Set(models.filter(Boolean)));
}

const STEEL_SYSTEM_INSTRUCTION = `You are the Principal Metallurgical & Structural Steel Engineering Specialist for Fiza Fiyat Architectural & Civil Hub.
Your task is to conduct an authoritative, preliminary engineering visual diagnosis of structural steel, mild steel (MS), carbon steel, sheet metal (HR, CR, GI), stainless steel, aluminium, and welded connections.

CRITICAL DIRECTIVES & SAFETY CONSTRAINTS:
1. PRELIMINARY VISUAL ASSESSMENT ONLY: Never state that an image alone confirms complete structural adequacy or proves absence of subsurface defects.
2. PREVENT FALSE CERTAINTY: Use cautious, rigorous engineering language: "Preliminary visual assessment indicates...", "Visual signs consistent with...", "Physical ultrasonic thickness (UT) / caliper measurement is required to confirm section loss", "Cannot be confirmed from image alone".
3. STRICT PROHIBITION: Do NOT generate images, diagrams, or call image generation APIs. This is strictly a diagnostic image-analysis and engineering text reporting system.
4. DEFECT RECOGNITION DATABASE: Ground your diagnosis in standard defect classifications:
   - Corrosion: Surface Rust, Atmospheric Corrosion, Pitting Corrosion, Section Loss, Galvanizing Damage (White Rust / Bare spots).
   - Cracking: Surface Crack, Longitudinal Crack, Transverse Crack, Weld Crack (Toe / Root / HAZ), Edge Crack (Cold sheared notch).
   - Deformation: Waviness (Oil canning), Buckling (Flange / Web / Column Euler), Plastic Bending (Sag), Warping (Torsion), Mechanical Dent, Hole (Corrosion / Burn-through / Unauthorized), Tear (Block shear / Bolt tear-out).
   - Welding Defects: Porosity, Undercut, Overlap (Cold lap), Lack of Fusion, Lack of Penetration, Excessive Reinforcement, Weld Distortion, Poor Weld Profile, Arc Strike, Burn-Through, Spatter.
   - Surface & Coatings: Plate Lamination, Hydrogen Blister, Scab (Rolled-in scale), Coating Failure, Peeling Paint, Delamination.
   - Connections: Loose Bolts, Missing Bolts, Connection Deformation (Prying action, gusset distortion).
5. NON-DESTRUCTIVE TESTING (NDT): Recommend specific testing methods:
   - VT (Visual Testing): Surface profile, welds, loose bolts.
   - PT (Liquid Dye Penetrant): Surface-breaking cracks, pinholes, plate edge tears.
   - MT (Magnetic Particle): Surface and near-subsurface cracks in ferromagnetic steel (Mild Steel, Carbon Steel).
   - UT (Ultrasonic Testing): Subsurface flaws, laminations, complete joint penetration verification, and calibrated remaining wall thickness for section loss.
   - RT (Radiographic Testing): Volumetric weld defects (porosity, slag, incomplete penetration) with permanent film record.
6. CODES & STANDARDS: Cite authoritative Indian and International standards:
   - BIS: IS 2062 (Steel Grades), IS 800:2007 (General Construction in Steel - Code of Practice), IS 808 (Structural Sections), IS 2629 (Hot-dip Galvanizing), IS 9595 (Metal Arc Welding), IS 1367 / IS 4000 (Bolts and HSFG Connections).
   - International: AISC 360 (Specification for Structural Steel Buildings), AWS D1.1 (Structural Welding Code - Steel), ISO 12944 (Corrosion Protection of Steel Structures), ASTM A36 / A992 / A123.
7. STOP-WORK & SAFETY ESCALATION:
   - Instruct IMMEDIATELY to STOP WORK, CLEAR THE AREA, and INSTALL EMERGENCY SHORING if:
     * Active buckling of column or compression flange is visible.
     * Severe connection deformation (distorted end-plate, sheared bolts, buckled gusset).
     * Cracks in primary tension members, moment welds, or crane girders.
     * Section loss visibly exceeding 25-30% on primary load-bearing members.
   - Mandate review by a Licensed Structural Engineer or Certified Welding Inspector (AWS CWI / CSWIP).
8. BOUNDING BOX ANNOTATIONS:
   Provide normalized coordinates [ymin, xmin, ymax, xmax] (0 to 1000) for every distinct visible defect detected in the image.`;

export async function analyzeSteelMedia(params: {
  image: string; // base64 or data URL
  userNotes?: string;
  componentHint?: string;
}): Promise<SteelInspectionReport> {
  const { image, userNotes, componentHint } = params;

  let mimeType = 'image/jpeg';
  let base64Data = image;

  if (image.startsWith('data:')) {
    const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      mimeType = matches[1];
      base64Data = matches[2];
    }
  }

  const promptText = `Conduct a rigorous structural steel / mild steel / sheet metal / welding diagnostic analysis on the provided image.
${componentHint ? `User Specified Component Hint: "${componentHint}".` : ''}
${userNotes ? `User Field Notes: "${userNotes}".` : ''}

You MUST return a strictly valid JSON object matching this schema:
{
  "materialInferred": "Mild Steel (IS 2062 E250 / ASTM A36)" | "High-Strength Structural Steel (E350 / ASTM A992)" | "Hot Rolled (HR) Steel Sheet / Plate" | "Cold Rolled (CR) Steel Sheet" | "Galvanized Iron (GI / GP) Sheet" | "Carbon Steel (Medium / High Carbon)" | "Stainless Steel (SS 304 / SS 316)" | "Aluminium Sheet (1xxx / 3xxx / 5xxx / 6xxx)" | "Unknown / Coated Metal",
  "componentType": "I-Beam / Universal Beam" | "Column / Stanchion" | "Truss / Rafter / Purlin" | "Hollow Section (SHS / RHS / CHS)" | "Channel (ISMC / PFC)" | "Angle Section (ISA)" | "Gusset Plate / Base Plate" | "Sheet Metal Panel (HR / CR / GI)" | "Fabricated Welded Girder" | "Bolted Connection" | "Welded Joint" | "Ducting / Enclosure" | "Storage Tank / Silo Shell" | "Other Metal Component",
  "overallSeverity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "title": "Short descriptive engineering diagnostic title",
  "preliminaryAssessmentNote": "Comprehensive preliminary visual assessment narrative explaining observed conditions, metal texture, degradation stage, and context.",
  "confidenceNotes": "Clear note on what can be visually concluded vs what requires physical gauge measurement or lab metallography.",
  "findings": [
    {
      "id": "finding-1",
      "primaryDefect": "Exact defect name from database (e.g. Surface Rust, Section Loss, Weld Toe Crack, Undercut, Porosity, Buckling, Loose Bolts, etc.)",
      "alternativeDefects": ["Alternative plausible defect 1", "Alternative plausible defect 2"],
      "componentType": "Same or specific component part (e.g. Bottom Flange, Web near support, Weld Bead, Gusset Plate)",
      "materialInferred": "Inferred material",
      "defectLocation": "Precise location (e.g. Weld toe on upper flange, Bottom 200mm of column base)",
      "affectedAreaPercentage": "Estimated affected area percentage (e.g. Approx 15% of flange face)",
      "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
      "possibleCauses": ["Specific root cause 1", "Root cause 2"],
      "recommendedInspection": ["Inspection action 1 (e.g. Scrape and measure remaining thickness with ultrasonic gauge)", "Inspection action 2"],
      "recommendedNextAction": ["Immediate step 1", "Step 2"],
      "repairGuidance": ["Specific code-compliant repair procedure 1", "Repair procedure 2"],
      "preventionGuidance": ["Preventive maintenance 1", "Protective coating specification per ISO 12944"],
      "whenToStopWork": "Specific conditions under which work/load must be immediately halted",
      "whenEngineerRequired": "Explicit criteria when a Licensed Structural Engineer or AWS CWI is mandatory",
      "annotationId": "box-1"
    }
  ],
  "annotations": [
    {
      "id": "box-1",
      "defectName": "Defect name",
      "category": "corrosion" | "welding" | "cracking" | "deformation" | "surface" | "connection",
      "box2d": [ymin, xmin, ymax, xmax],
      "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
      "description": "Short label of what is at this box",
      "confidence": 85
    }
  ],
  "ndtRecommendations": [
    {
      "method": "VT" | "PT" | "MT" | "UT" | "RT",
      "rationale": "Why this specific NDT test is recommended for this defect and component",
      "priority": "Immediate" | "Recommended" | "Routine"
    }
  ],
  "safetyAlerts": {
    "stopWorkRecommended": true | false,
    "structuralEngineerRequired": true | false,
    "message": "Direct safety directive regarding occupancy, load restrictions, or work continuation"
  },
  "applicableStandards": ["IS 800:2007", "AWS D1.1", "IS 2062", "ISO 12944", "AISC 360"],
  "disclaimer": "This is a preliminary visual assessment based solely on uploaded 2D imagery. An image alone cannot determine internal structural stress, microscopic hydrogen embrittlement, or exact remaining load capacity. Physical verification via calibrated ultrasonic thickness gauging, NDT, and consultation with a licensed structural engineer is required before any structural decisions or load modifications."
}

Return ONLY raw JSON, with no markdown code fences.`;

  const ai = getAIClient();
  const models = getCandidateModels();

  let rawJson = '';
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: base64Data
                  }
                },
                { text: promptText }
              ]
            }
          ],
          config: {
            systemInstruction: STEEL_SYSTEM_INSTRUCTION,
            temperature: 0.2, // Low temperature for high engineering consistency
            responseMimeType: 'application/json'
          }
        });

        rawJson = response.text || '';
        if (rawJson.trim()) {
          break;
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = err?.message || (typeof err === 'string' ? err : 'Error');
        const is503 = err?.status === 503 || err?.code === 503 || errMsg.includes('503') || errMsg.includes('high demand');
        if (is503 && attempt === 1) {
          console.info(`[Steel AI] Model ${model} experiencing high demand (503), retrying in 600ms...`);
          await new Promise(r => setTimeout(r, 600));
          continue;
        }
        console.warn(`Model ${model} failed for analyzeSteelMedia, trying next:`, errMsg.slice(0, 100));
        await new Promise(r => setTimeout(r, 300));
        break;
      }
    }
    if (rawJson.trim()) break;
  }

  if (!rawJson || !rawJson.trim()) {
    throw new Error(lastError?.message || 'Failed to generate steel diagnostic report from AI service.');
  }

  try {
    const cleaned = rawJson.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleaned);

    const report: SteelInspectionReport = {
      id: `FH-STEEL-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title: parsed.title || 'Structural Steel & Metal Preliminary Assessment',
      mediaType: 'image',
      imageUrl: image.startsWith('data:') ? image : undefined,
      materialInferred: parsed.materialInferred || 'Mild Steel (IS 2062 E250 / ASTM A36)',
      componentType: parsed.componentType || 'Other Metal Component',
      overallSeverity: (parsed.overallSeverity as SteelSeverityLevel) || 'MEDIUM',
      preliminaryAssessmentNote: parsed.preliminaryAssessmentNote || 'Preliminary visual evaluation conducted on steel component.',
      confidenceNotes: parsed.confidenceNotes || 'Physical ultrasonic thickness and on-site NDT required to confirm subsurface conditions.',
      findings: Array.isArray(parsed.findings) ? parsed.findings : [],
      annotations: Array.isArray(parsed.annotations) ? parsed.annotations : [],
      ndtRecommendations: Array.isArray(parsed.ndtRecommendations) ? parsed.ndtRecommendations : [
        { method: 'VT', rationale: 'Direct visual confirmation using gauges and illumination', priority: 'Immediate' },
        { method: 'UT', rationale: 'Ultrasonic thickness measurement to confirm exact remaining section', priority: 'Recommended' }
      ],
      safetyAlerts: parsed.safetyAlerts || {
        stopWorkRecommended: parsed.overallSeverity === 'CRITICAL',
        structuralEngineerRequired: parsed.overallSeverity === 'HIGH' || parsed.overallSeverity === 'CRITICAL',
        message: parsed.overallSeverity === 'CRITICAL'
          ? 'CRITICAL DEFECT DETECTED: Cease load application and arrange immediate structural engineering review.'
          : 'Preliminary assessment completed. Proceed with recommended testing.'
      },
      applicableStandards: Array.isArray(parsed.applicableStandards) ? parsed.applicableStandards : ['IS 800:2007', 'AWS D1.1', 'IS 2062'],
      disclaimer: parsed.disclaimer || 'Preliminary visual assessment only. Physical verification by a licensed structural engineer is mandatory.'
    };

    return report;
  } catch (parseError: any) {
    console.error('Failed to parse steel diagnostic JSON:', parseError, rawJson);
    throw new Error('Malformed engineering diagnostic response from AI model.');
  }
}

/**
 * Technical Q&A handler for MS, Mild Steel, Sheet Metal, Structural Steel, Welding, and Corrosion inquiries.
 * Strictly adheres to the requested 10-point standardized response format.
 * Fluidly supports English, Hindi, and Hinglish.
 */
export async function handleSteelQA(input: SteelQAInput): Promise<SteelQAResponse> {
  const { question, language = 'en', inspectionContext, conversationHistory = [] } = input;

  const historyPrompt = conversationHistory.length > 0
    ? `Recent Conversation Context:\n${conversationHistory.map(c => `${c.sender.toUpperCase()}: ${c.text}`).join('\n')}\n`
    : '';

  const contextPrompt = inspectionContext
    ? `Active Inspection Context:\nComponent: ${inspectionContext.componentType || 'Steel member'}\nMaterial: ${inspectionContext.materialInferred || 'Mild steel'}\nSeverity: ${inspectionContext.overallSeverity || 'Unknown'}\nKey Note: ${inspectionContext.preliminaryAssessmentNote || 'None'}\n`
    : '';

  const metalKnowledgeContext = getMetalKnowledgeContextForAI(question);

  const promptText = `${historyPrompt}${contextPrompt}
User Technical Question: "${question}"

Metallurgical & Engineering Standards Reference Data:
${metalKnowledgeContext}

Respond to this inquiry in ${language === 'hi' ? 'Hindi' : language === 'hinglish' ? 'Hinglish (Natural conversational Hindi written in Latin script with standard English engineering terms)' : 'English'}.

You MUST strictly structure your answer using the following 10 sections with their exact icons and headings:

🔎 Observation:
[Concise summary of what is observed or being inquired about]

🧱 Material:
[Relevant metal type, grade, e.g. Mild Steel IS 2062, Carbon Steel, HR/CR/GI Sheet, Stainless Steel, Aluminium, with relevant mechanical properties]

⚠️ Possible Problem:
[Specific defect diagnosis. Note: Clearly distinguish between surface rust vs structural section loss, or weld cosmetic spatter vs crack/lack of fusion]

📊 Severity:
[LOW | MEDIUM | HIGH | CRITICAL - with clear engineering justification]

🔍 Possible Causes:
[Bullet points of primary root causes, metallurgical factors, or fabrication errors]

🧪 Recommended Inspection:
[Step-by-step physical tests: Visual VT, Dye Penetrant PT, Magnetic Particle MT, Ultrasonic UT, Radiographic RT, caliper/micrometer gauge]

🔧 Possible Corrective Action:
[Code-compliant repair procedures. For minor: cleaning, grinding, priming. For structural: welding procedure WPS, sister plating, or section replacement]

🛡 Prevention:
[Long-term preventative maintenance, storage, and protective coating systems e.g. ISO 12944 / Hot-dip galvanizing]

👷 Professional Review:
[Explicit statement on when a Licensed Structural Engineer or Certified Welding Inspector (AWS CWI / CSWIP) is legally/contractually mandatory]

⚠️ Safety Note:
[Mandatory safety disclaimer: Preliminary assessment only. Never declare a load-bearing member 100% safe from an image or chat description alone. Include stop-work warning if severity is high/critical.]

IMPORTANT: Do NOT generate images. Provide thorough, authoritative engineering text strictly following the format above.`;

  const ai = getAIClient();
  const models = getCandidateModels();

  let responseText = '';
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: promptText }] }],
        config: {
          systemInstruction: STEEL_SYSTEM_INSTRUCTION,
          temperature: 0.3
        }
      });

      responseText = response.text || '';
      if (responseText.trim()) {
        break;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} failed for handleSteelQA, trying next:`, err?.message || err);
    }
  }

  if (!responseText || !responseText.trim()) {
    throw new Error(lastError?.message || 'Failed to generate technical steel response from AI service.');
  }

  // Parse sections from standardized output
  const extractSection = (headingRegex: RegExp): string => {
    const match = responseText.match(headingRegex);
    return match && match[1] ? match[1].trim() : '';
  };

  const observation = extractSection(/🔎\s*Observation:?\s*([\s\S]*?)(?=🧱|$)/i) || 'Visual evaluation of steel condition.';
  const material = extractSection(/🧱\s*Material:?\s*([\s\S]*?)(?=⚠️\s*Possible Problem|$)/i) || 'Mild Steel / Carbon Steel (IS 2062).';
  const possibleProblem = extractSection(/⚠️\s*Possible Problem:?\s*([\s\S]*?)(?=📊|$)/i) || 'Steel surface or joint condition under review.';
  const severityStr = extractSection(/📊\s*Severity:?\s*([\s\S]*?)(?=🔍|$)/i);
  const possibleCausesStr = extractSection(/🔍\s*Possible Causes:?\s*([\s\S]*?)(?=🧪|$)/i);
  const inspectionStr = extractSection(/🧪\s*Recommended Inspection:?\s*([\s\S]*?)(?=🔧|$)/i);
  const correctiveStr = extractSection(/🔧\s*Possible Corrective Action:?\s*([\s\S]*?)(?=🛡|$)/i);
  const preventionStr = extractSection(/🛡\s*Prevention:?\s*([\s\S]*?)(?=👷|$)/i);
  const professionalReview = extractSection(/👷\s*Professional Review:?\s*([\s\S]*?)(?=⚠️\s*Safety Note|$)/i) || 'Structural engineer review recommended if member is load-bearing.';
  const safetyNote = extractSection(/⚠️\s*Safety Note:?\s*([\s\S]*?)$/i) || 'Preliminary visual assessment only. Physical inspection by a qualified professional is required.';

  let severity: SteelSeverityLevel = 'MEDIUM';
  if (severityStr.toUpperCase().includes('CRITICAL')) severity = 'CRITICAL';
  else if (severityStr.toUpperCase().includes('HIGH')) severity = 'HIGH';
  else if (severityStr.toUpperCase().includes('LOW')) severity = 'LOW';

  const parseBullets = (text: string): string[] => {
    return text
      .split('\n')
      .map(line => line.replace(/^[-*•\d.]+\s*/, '').trim())
      .filter(line => line.length > 0);
  };

  return {
    observation,
    material,
    possibleProblem,
    severity,
    possibleCauses: parseBullets(possibleCausesStr),
    recommendedInspection: parseBullets(inspectionStr),
    possibleCorrectiveAction: parseBullets(correctiveStr),
    prevention: parseBullets(preventionStr),
    professionalReview,
    safetyNote,
    rawText: responseText
  };
}
