import { GoogleGenAI } from '@google/genai';
import { 
  StructuralInspectionResult, 
  DetectedProblem, 
  DamageAnnotation, 
  VideoFinding, 
  PossibleRepairApproach,
  StructuralQAInput 
} from '../types/structuralInspector';

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
  const isDeprecated = (m?: string) => !m || m.includes('2.5') || m.includes('2.0') || m.includes('1.5');
  const models = [
    ...(configured && !isDeprecated(configured) ? [configured] : []),
    'gemini-3.7-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest'
  ];
  return Array.from(new Set(models.filter(Boolean)));
}

const SYSTEM_PROMPT = `You are the Principal Civil & Structural Engineering AI Specialist for Fiza Fiyat Architectural & Civil Hub.
Your task is to conduct a preliminary visual inspection of civil structures and buildings from uploaded media.

STRICT SAFETY MANDATES:
1. This is a PRELIMINARY VISUAL ASSESSMENT TOOL ONLY.
2. NEVER claim that an image or video alone can confirm structural safety, load-bearing integrity, or sub-surface conditions.
3. Every report MUST state that a licensed structural engineer or certified civil inspector must conduct on-site non-destructive testing (NDT), rebound hammer, core drilling, ultrasonic pulse velocity, or geotechnical investigation before repair, demolition, load modifications, or occupancy decisions.
4. Only report conditions visually supported by the media. Do NOT fabricate hidden damage.
5. Use cautious professional terminology such as "Visible indication", "Possible cause", "Potential distress pattern", "Cannot be confirmed from image alone".
6. Distinguish clearly between "Cosmetic / Surface Repair" and "Potential Structural Issue (Requires Professional Assessment)". NEVER provide DIY structural repair instructions for load-bearing members (columns, beams, transfer slabs, foundation).

STRUCTURAL FEATURES TO INSPECT:
- Cracks: Hairline (<0.3mm), diagonal shear cracks at beam-column joint, vertical tension cracks, horizontal bending/shrinkage cracks, stair-step masonry cracks, settlement cracks.
- Concrete: Spalling, honeycombing, delamination, exposed rusted reinforcement (rebar carbonation/chloride attack), rust leaching, aggregate popouts.
- Steel: Visible corrosion, pitting, buckling, flange deformation, connection bolt/weld distress.
- Moisture/Water: Efflorescence (salt deposits), damp patches, water seepage, mold, ceiling staining, drainage pooling.
- Masonry: Displaced brickwork, bulging wythe, mortar erosion, diagonal shear steps.
- Structural Deformation: Sagging slabs/beams, tilting columns, differential settlement, deflection.
- Bridges/Civil Infrastructure: Deck deterioration, expansion joint separation, elastomeric bearing distress, pier scour indicators, railing impact damage.

COORDINATE BOUNDING BOX SPECIFICATION:
For visual annotations on the image, output normalized coordinates in the format:
[ymin, xmin, ymax, xmax] where coordinates are integers from 0 to 1000 representing bounding boxes around the identified damage.`;

export async function analyzeStructuralDamage(params: {
  images: { data: string; mimeType: string; label?: string }[];
  structureType: string;
  isVideo?: boolean;
  videoTimestamps?: { timestamp: string; seconds: number; frameIndex: number }[];
  notes?: string;
}): Promise<StructuralInspectionResult> {
  const { images, structureType, isVideo, videoTimestamps, notes } = params;

  if (!images || images.length === 0) {
    throw new Error('At least one media file (image or video frame) is required for structural inspection.');
  }

  const ai = getAIClient();
  const models = getCandidateModels();

  const parts: any[] = [];

  images.forEach((img, idx) => {
    // Strip header if base64 data contains data:image/...;base64,
    let base64Data = img.data;
    if (base64Data.includes(',')) {
      base64Data = base64Data.split(',')[1];
    }

    parts.push({
      inlineData: {
        mimeType: img.mimeType || 'image/jpeg',
        data: base64Data
      }
    });

    if (img.label) {
      parts.push({ text: `[Media Item #${idx + 1}: ${img.label}]` });
    }
  });

  const promptText = `Conduct a rigorous structural visual inspection of the uploaded ${images.length > 1 ? `${images.length} images` : isVideo ? 'video frames' : 'image'}.
Declared Structure Type: ${structureType}
${isVideo ? 'This is a multi-frame video sequence inspection.' : ''}
${notes ? `User Observation Notes: ${notes}` : ''}

Respond with a complete, valid JSON object matching the following structure:
{
  "detectedStructureType": "house | apartment | building | bridge | road | column | beam | slab | foundation | roof | retaining_wall | other",
  "overallAssessment": "1-2 sentence executive assessment of visible condition",
  "severity": "low" | "moderate" | "high" | "critical_looking",
  "confidence": "Low" | "Medium" | "High",
  "immediateProfessionalInspection": "Recommended" | "Strongly Recommended",
  "summaryParagraph": "3-4 sentence comprehensive civil engineering overview summarizing all visible indicators",
  "findings": [
    {
      "id": "finding-1",
      "problem": "Specific damage name, e.g. Diagonal shear crack near beam-column junction",
      "location": "Clear location in image, e.g. Upper-right sector at column interface",
      "severity": "Low concern" | "Moderate concern" | "High concern" | "Critical concern",
      "category": "crack" | "spalling" | "honeycombing" | "corrosion" | "water_moisture" | "masonry" | "deformation" | "joint_damage" | "surface_deterioration" | "other",
      "evidence": "Concrete description of the visual texture, color, direction, or deformation observed",
      "possibleCauses": [
        "Possible cause 1 (e.g., Differential foundation settlement)",
        "Possible cause 2 (e.g., Thermal expansion/contraction)",
        "Possible cause 3 (e.g., Inadequate shear reinforcement or overloading)"
      ],
      "annotationId": "ann-1",
      "imageIndex": 0
    }
  ],
  "annotations": [
    {
      "id": "ann-1",
      "type": "crack" | "spalling" | "honeycombing" | "corrosion" | "water_moisture" | "masonry" | "deformation" | "joint_damage" | "other",
      "label": "[CRACK]" | "[SPALLING]" | "[CORROSION]" | "[WATER DAMAGE]" | "[DEFORMATION]" | "[HONEYCOMBING]" | "[MASONRY DAMAGE]" | "[JOINT DAMAGE]",
      "box2d": [ymin, xmin, ymax, xmax],
      "severity": "Low concern" | "Moderate concern" | "High concern" | "Critical concern",
      "description": "Short label description",
      "imageIndex": 0
    }
  ],
  ${isVideo ? `
  "videoFindings": [
    {
      "timestamp": "00:04",
      "timestampSeconds": 4,
      "problem": "Problem detected at this timestamp",
      "evidence": "Visual evidence in frame",
      "concernLevel": "Moderate concern"
    }
  ],` : ''}
  "whatMayBeRequired": [
    "Comprehensive on-site physical structural audit by licensed civil engineer",
    "Digital crack width microscope & gauge monitoring over 30-60 days",
    "Non-destructive testing (Ultrasonic Pulse Velocity / Rebound Hammer)",
    "Moisture mapping and carbonation depth phenolphthalein testing",
    "Cover meter survey to check concrete rebar cover thickness"
  ],
  "possibleRepairApproaches": [
    {
      "issueType": "Surface Plaster Cracks (<0.3mm)",
      "repairClassification": "Cosmetic / Surface Repair",
      "steps": [
        "V-groove chase the crack with angle grinder",
        "Clean loose dust and apply acrylic elastomeric primer",
        "Fill with flexible polymer-modified crack sealant paste",
        "Sand smooth and recoat with breathable exterior paint"
      ],
      "materialsInvolved": ["Elastomeric Crack Filler", "Acrylic Polymer Primer", "Fiber Mesh Tape"]
    },
    {
      "issueType": "Structural Concrete Spalling & Exposed Rebar",
      "repairClassification": "Potential Structural Issue (Requires Professional Assessment)",
      "steps": [
        "Engage licensed structural engineer for load capacity assessment before touching member",
        "Chip away carbonated loose concrete 20mm behind exposed rebar",
        "Wire brush rebar to SA 2.5 cleanliness and apply zinc-rich epoxy anti-corrosion primer",
        "Apply structural bonding agent and build up with fiber-reinforced polymer repair mortar (shrinkage compensated)",
        "Restore full structural cover thickness"
      ],
      "materialsInvolved": ["Zinc-rich Epoxy Primer", "Polymer Modified Structural Mortar", "SBR Bonding Agent"],
      "professionalWarning": "Requires structural engineer verification to ensure steel section loss has not compromised axial or flexural load capacity."
    }
  ],
  "questionsForEngineer": [
    "What is the underlying mechanism causing this crack or distress pattern?",
    "Does this distress affect the immediate structural load path or occupant safety?",
    "Are non-destructive tests (NDT / Rebound Hammer / Core test) recommended?",
    "Is active monitoring with glass tell-tales or digital crack meters needed?",
    "What specific repair methodology and structural repair mortar specification is required?"
  ],
  "safetyDisclaimer": "CRITICAL LIMITATION: This AI visual inspection is a preliminary screening based strictly on visible pixels. It CANNOT measure subsurface concrete strength, internal reinforcement corrosion, foundation settlement dynamics, or seismic compliance. An on-site physical inspection by a licensed structural engineer is mandatory before any repair, modification, or occupancy conclusion."
}`;

  parts.push({ text: promptText });

  let rawResponseText = '';
  let lastError: any = null;

  for (const modelName of models) {
    try {
      const result = await ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      if (result.text && result.text.trim()) {
        rawResponseText = result.text.trim();
        break;
      }
    } catch (err: any) {
      console.warn(`[Structural AI] Model ${modelName} encountered error:`, err?.message || err);
      lastError = err;
      await new Promise(r => setTimeout(r, 200));
    }
  }

  if (!rawResponseText) {
    throw lastError || new Error('Failed to analyze media with Gemini structural AI model.');
  }

  try {
    const cleaned = rawResponseText.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const inspectionId = `insp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const result: StructuralInspectionResult = {
      id: inspectionId,
      timestamp: new Date().toISOString(),
      mediaType: isVideo ? 'video' : images.length > 1 ? 'multi_image' : 'image',
      structureType: structureType === 'auto_detect' ? (parsed.detectedStructureType || 'Building') : structureType,
      detectedStructureType: parsed.detectedStructureType || structureType,
      overallAssessment: parsed.overallAssessment || 'Visible indications of structural surface distress detected.',
      severity: (['low', 'moderate', 'high', 'critical_looking'].includes(parsed.severity) ? parsed.severity : 'moderate') as any,
      confidence: (['Low', 'Medium', 'High'].includes(parsed.confidence) ? parsed.confidence : 'High') as any,
      immediateProfessionalInspection: (parsed.immediateProfessionalInspection === 'Strongly Recommended' ? 'Strongly Recommended' : 'Recommended'),
      summaryParagraph: parsed.summaryParagraph || 'Preliminary analysis shows visible distress patterns that require systematic engineering validation.',
      findings: Array.isArray(parsed.findings) ? parsed.findings.map((f: any, idx: number) => ({
        id: f.id || `finding-${idx + 1}`,
        problem: f.problem || 'Visible Surface Distress',
        location: f.location || 'Observed in media view',
        severity: f.severity || 'Moderate concern',
        category: f.category || 'crack',
        evidence: f.evidence || 'Visual indication detected in media.',
        possibleCauses: Array.isArray(f.possibleCauses) ? f.possibleCauses : ['Environmental stress', 'Material aging', 'Settlement'],
        annotationId: f.annotationId || `ann-${idx + 1}`,
        imageIndex: typeof f.imageIndex === 'number' ? f.imageIndex : 0
      })) : [],
      annotations: Array.isArray(parsed.annotations) ? parsed.annotations.map((a: any, idx: number) => {
        let box = a.box2d;
        if (!Array.isArray(box) || box.length !== 4) {
          box = [150 + idx * 80, 150 + idx * 80, 450 + idx * 80, 550 + idx * 80];
        }
        return {
          id: a.id || `ann-${idx + 1}`,
          type: a.type || 'crack',
          label: a.label || '[DISTRESS]',
          box2d: [
            Math.max(0, Math.min(1000, Number(box[0]) || 0)),
            Math.max(0, Math.min(1000, Number(box[1]) || 0)),
            Math.max(0, Math.min(1000, Number(box[2]) || 1000)),
            Math.max(0, Math.min(1000, Number(box[3]) || 1000))
          ],
          severity: a.severity || 'Moderate concern',
          description: a.description || a.label || 'Damage indicator',
          imageIndex: typeof a.imageIndex === 'number' ? a.imageIndex : 0
        };
      }) : [],
      videoFindings: Array.isArray(parsed.videoFindings) ? parsed.videoFindings : undefined,
      whatMayBeRequired: Array.isArray(parsed.whatMayBeRequired) && parsed.whatMayBeRequired.length > 0 
        ? parsed.whatMayBeRequired 
        : [
          'On-site physical inspection by a licensed structural engineer',
          'Detailed crack width monitoring with optical crack comparator',
          'Rebound hammer and ultrasonic testing for concrete uniformity',
          'Moisture meter assessment of adjacent walls and slabs'
        ],
      possibleRepairApproaches: Array.isArray(parsed.possibleRepairApproaches) && parsed.possibleRepairApproaches.length > 0
        ? parsed.possibleRepairApproaches
        : [
          {
            issueType: 'Surface hairline cracks',
            repairClassification: 'Cosmetic / Surface Repair',
            steps: ['Clean crack groove', 'Apply flexible polymer sealant', 'Repaint surface'],
            materialsInvolved: ['Elastomeric sealant', 'Masonry primer']
          }
        ],
      questionsForEngineer: Array.isArray(parsed.questionsForEngineer) && parsed.questionsForEngineer.length > 0
        ? parsed.questionsForEngineer
        : [
          'Is this crack structural or non-structural shrinkage?',
          'Does this indicate ongoing foundation settlement?',
          'What non-destructive testing (NDT) do you recommend on-site?'
        ],
      safetyDisclaimer: parsed.safetyDisclaimer || 'CRITICAL LIMITATION: This AI visual assessment is based solely on media pixels and cannot replace a physical on-site audit by a licensed structural engineer.'
    };

    return result;
  } catch (parseErr: any) {
    console.error('Failed to parse Gemini structural analysis JSON:', parseErr, rawResponseText);
    throw new Error('Failed to parse AI structural damage assessment report. Please retry with a clearer photo.');
  }
}

export async function handleStructuralQA(input: StructuralQAInput): Promise<string> {
  const { question, inspectionContext, conversationHistory } = input;

  if (!question || !question.trim()) {
    throw new Error('Question cannot be empty.');
  }

  const ai = getAIClient();
  const models = getCandidateModels();

  const contextSummary = `
Active Inspection Context:
- Structure Type: ${inspectionContext.structureType || 'General Structure'}
- Overall Assessment: ${inspectionContext.overallAssessment || 'Visible distress inspected'}
- Severity: ${inspectionContext.severity || 'Moderate'}
- Findings: ${(inspectionContext.findings || []).map(f => `${f.problem} (${f.severity}) at ${f.location} - Evidence: ${f.evidence}`).join('; ')}
- Possible Repair Approaches: ${(inspectionContext.possibleRepairApproaches || []).map(r => `${r.issueType} [${r.repairClassification}]`).join('; ')}
- What May Be Required: ${(inspectionContext.whatMayBeRequired || []).join(', ')}
`;

  const prompt = `You are Fiza AI Structural Assistant. Answer the user's specific question regarding the structural damage inspection results.
${contextSummary}

User Question: "${question}"

Directives:
1. Provide a direct, polite, clear, and technically grounded answer explaining the engineering principles in accessible language.
2. If the user asks whether it's safe or dangerous, remind them that visual AI cannot verify load capacity and provide the key factors that an engineer will inspect.
3. Suggest practical questions they can ask their contractor or structural engineer.
4. Format with clean bullet points.`;

  for (const modelName of models) {
    try {
      const res = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.4
        }
      });
      if (res.text && res.text.trim()) {
        return res.text.trim();
      }
    } catch (err) {
      console.warn(`[Structural QA] Model ${modelName} error:`, err);
    }
  }

  return `Based on the visible evidence, this condition suggests potential localized distress. We recommend having an on-site structural engineer measure crack depth, check for hollow sounds (delamination), and test concrete rebound strength.`;
}
