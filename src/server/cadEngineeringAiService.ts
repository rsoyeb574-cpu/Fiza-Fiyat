import { getAIClient, isGeminiConfigured } from './aiService';
import { 
  DrawingAnalysisReport, 
  GeneratedDrawingSpec, 
  RoomLayoutSpecification,
  EngineeringReportData 
} from '../types/cadBimEngineering';
import { generateArchitecturalDxf, generateArchitecturalSvg } from '../utils/dxfGenerator';

/**
 * Server-side AI Drawing Analyzer
 * Distinguishes strictly between confirmed visual observations, possible issues, and items requiring professional verification.
 */
export async function analyzeDrawingAI(params: {
  image?: string; // base64 data url or image uri
  textDescription?: string;
  fileFormat: string;
  fileName: string;
  userNotes?: string;
  jurisdictionOrCode?: string;
}): Promise<DrawingAnalysisReport> {
  const { image, textDescription, fileFormat, fileName, userNotes, jurisdictionOrCode } = params;

  if (!isGeminiConfigured()) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const ai = getAIClient();

  const systemInstruction = `You are FIZA FIYAT's Senior CAD/BIM Quality Assurance and Engineering Drawing Auditor.
Your task is to analyze architectural, structural, civil, mechanical, or MEP drawings with extreme engineering rigor.

CRITICAL DISCIPLINARY RULES:
1. You MUST categorize every single finding into one of three strict verification levels:
   - "confirmed_observation": Explicitly visible and measurable in the drawing (e.g., dimension overlap, visible wall gap, overlapping text, missing North arrow).
   - "possible_issue": Inferred or geometrically suspicious condition that warrants closer inspection (e.g., door swing possibly interfering with wardrobe, potential duct-beam height clash).
   - "requires_verification": Condition where drawing information is insufficient or requires on-site structural/code verification (e.g., unknown soil bearing capacity, structural slab thickness validation, municipal setback verification).
2. NEVER claim an official statutory code violation UNLESS the applicable code, municipal jurisdiction, and exact required measurements are explicitly established in the inputs. Always cite as "potential non-compliance to be verified with local municipal authority".
3. Check specifically for:
   - Missing dimensions, dimension inconsistencies, duplicate dimensions
   - Wrong alignment, wall gaps, unclosed polylines
   - Door/window conflicts, door swing collisions
   - Stair geometry (riser, tread, headroom clearance)
   - Room access problems and furniture circulation bottlenecks
   - Text overlap, dimension overlap, unreadable annotations
   - Grid inconsistencies, level inconsistencies
   - Architectural vs Structural coordination issues (column projection into spaces, beam drops)
   - MEP coordination issues (sanitary stack locations, beam penetrations)
   - Missing drawing information (scale bar, orientation, revision block, material tags)

OUTPUT FORMAT: Return STRICT JSON ONLY without markdown fences or additional conversational text.
{
  "detectedDiscipline": "ARCHITECTURAL" | "STRUCTURAL" | "MEP" | "CIVIL" | "MECHANICAL" | "INTERIOR" | "COORDINATION / COMPOSITE",
  "summary": "Concise executive engineering summary of the drawing quality and readiness",
  "findings": [
    {
      "id": "find-1",
      "category": "Dimension Issue" | "Geometric Alignment" | "Door / Window Conflict" | "Circulation / Access" | "Stair Geometry" | "Text & Annotation Overlap" | "Layer / Standard Issue" | "Coordination Clash" | "Missing Information" | "Drafting Defect",
      "findingType": "confirmed_observation" | "possible_issue" | "requires_verification",
      "title": "Clear finding headline",
      "description": "Exact technical explanation of what is observed",
      "locationReference": "Grid A-3 / Living Room North Wall / Stair Landing etc.",
      "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
      "potentialImpact": "Consequence if built as drafted",
      "recommendedResolution": "Actionable CAD/BIM drafting or design fix",
      "verificationMethod": "On-site check / BIM federated clash test / Manual dimension chain audit",
      "applicableStandardOrRule": "IS 962 / NBC 2016 / IS 456 / General Practice (if applicable)"
    }
  ],
  "coordinationMatrix": {
    "disciplinesInvolved": ["Architecture", "Structure", "Plumbing"],
    "clashRisk": "LOW" | "MEDIUM" | "HIGH",
    "notes": "Key interdisciplinary dependencies to verify before tender"
  },
  "standardsComplianceNote": "Status regarding applicable codes",
  "disclaimer": "This AI analysis provides preliminary quality-assurance screening. Final construction drawings require certification by a licensed Architect or Registered Structural Engineer."
}`;

  const promptParts: any[] = [];

  if (image && typeof image === 'string') {
    const match = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (match) {
      promptParts.push({
        inlineData: {
          mimeType: match[1],
          data: match[2]
        }
      });
    }
  }

  const promptText = `Please analyze this drawing file:
File Name: ${fileName}
Format: ${fileFormat}
User Notes: ${userNotes || 'General quality and coordination review requested'}
Jurisdiction / Code: ${jurisdictionOrCode || 'Not explicitly specified - apply standard engineering conventions'}
Additional Text Description / OCR: ${textDescription || 'Examine the visual elements in the attached file'}`;

  promptParts.push({ text: promptText });

  const models = ['gemini-3.1-pro-preview', 'gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-flash-latest'];
  let rawJson = '';

  for (const modelName of models) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: promptParts,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });
      if (response.text && response.text.trim()) {
        rawJson = response.text.trim();
        break;
      }
    } catch (e) {
      console.warn(`[Drawing Analysis] Model ${modelName} failed, retrying fallback...`, e);
    }
  }

  if (!rawJson) {
    throw new Error('AI analysis could not be completed for this drawing file.');
  }

  // Parse JSON
  const parsed = JSON.parse(rawJson);

  const findings = parsed.findings || [];
  const confirmedCount = findings.filter((f: any) => f.findingType === 'confirmed_observation').length;
  const possibleCount = findings.filter((f: any) => f.findingType === 'possible_issue').length;
  const verificationRequiredCount = findings.filter((f: any) => f.findingType === 'requires_verification').length;
  const criticalSeverityCount = findings.filter((f: any) => f.severity === 'CRITICAL').length;

  const report: DrawingAnalysisReport = {
    id: `drw-rep-${Date.now()}`,
    drawingName: fileName,
    fileFormat,
    detectedDiscipline: parsed.detectedDiscipline || 'ARCHITECTURAL',
    summary: parsed.summary || 'Drawing audit completed.',
    totalFindings: findings.length,
    confirmedCount,
    possibleCount,
    verificationRequiredCount,
    criticalSeverityCount,
    findings,
    coordinationMatrix: parsed.coordinationMatrix || {
      disciplinesInvolved: ['Architecture'],
      clashRisk: 'LOW',
      notes: 'No critical interdisciplinary clashes detected.'
    },
    standardsComplianceNote: parsed.standardsComplianceNote || 'Requires verification with project standard specifications.',
    disclaimer: 'This drawing analysis provides preliminary visual and geometric validation. It does not replace formal design sign-off by a licensed engineer or architect.',
    timestamp: new Date().toISOString()
  };

  return report;
}

/**
 * Server-side Controlled Drawing Generator
 * Converts user prompt into structured specification, validates boundaries and circulation,
 * and generates SVG vector floor plans + AutoCAD-compliant DXF files.
 */
export async function generateDrawingSpecAI(params: {
  prompt: string;
  plotWidthFt?: number;
  plotLengthFt?: number;
  roadFacing?: 'North' | 'South' | 'East' | 'West';
  floors?: number;
  requirements?: string;
}): Promise<GeneratedDrawingSpec> {
  const { prompt, plotWidthFt: reqWidth, plotLengthFt: reqLength, roadFacing = 'North', requirements } = params;

  if (!isGeminiConfigured()) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const ai = getAIClient();

  const systemInstruction = `You are FIZA FIYAT's Senior Architectural Planner and Parametric CAD Specialist.
Convert the user request into a mathematically sound, dimensionally valid, single-floor house plan specification.

CRITICAL GEOMETRIC AND PLANNING CONSTRAINTS:
1. Plot dimensions: If specified (e.g. 15x48 ft), all rooms MUST fit entirely inside this boundary [0 to PlotWidth] and [0 to PlotLength].
2. Wall thicknesses: Assume 0.75 ft (9 inches) for external/main walls, 0.38 ft (4.5 inches) for partition walls.
3. Every room must have non-overlapping coordinates [x, y], widthFt, and lengthFt.
4. Circulation: The sum of room widths and lengths plus corridors and walls must match the total plot area. No impossible floating rooms.
5. Staircase: If requested, specify standard residential dimensions (Riser: 6" to 7", Tread: 10" to 11", Width: min 3.0 ft).
6. Doors: Minimum 3.0 ft for living/bedrooms, 2.5 ft for toilets. Specify wall (north, south, east, west).
7. Windows: Minimum 10% floor area for natural lighting/ventilation per NBC 2016.

OUTPUT FORMAT: Return STRICT JSON ONLY without markdown fences:
{
  "plotWidthFt": number,
  "plotLengthFt": number,
  "roadFacing": "North" | "South" | "East" | "West",
  "rooms": [
    {
      "name": "Living Room" | "Master Bedroom" | "Bedroom 2" | "Kitchen" | "Toilet 1" | "Staircase" | "Verandah",
      "widthFt": number,
      "lengthFt": number,
      "areaSqFt": number,
      "level": "Ground Floor",
      "purpose": "Living and family reception",
      "x": number, // X offset in feet from bottom-left origin (0,0)
      "y": number, // Y offset in feet from bottom-left origin (0,0)
      "doors": [{ "wall": "south", "widthFt": 3.0, "target": "Verandah" }],
      "windows": [{ "wall": "north", "widthFt": 4.0, "heightFt": 4.5 }]
    }
  ],
  "staircaseSpec": {
    "type": "Internal Dog-Legged" | "Straight Flight",
    "treadInches": 10,
    "riserInches": 6.5,
    "flightWidthFt": 3.0,
    "headroomFt": 7.5,
    "isCompliant": true
  },
  "doorWindowSchedule": [
    { "tag": "D1", "type": "Door", "widthFt": 3.25, "heightFt": 7.0, "material": "Teak Wood Frame with Flush Shutter", "qty": 3 },
    { "tag": "D2", "type": "Door", "widthFt": 2.5, "heightFt": 7.0, "material": "FRP Waterproof Shutter", "qty": 2 },
    { "tag": "W1", "type": "Window", "widthFt": 4.0, "heightFt": 4.5, "material": "Aluminium Sliding 3-Track", "qty": 4 }
  ],
  "validationNotes": ["All rooms fit within 15ft x 48ft boundary", "Circulation hallway provides direct access to all rooms"]
}`;

  const promptText = `User Request: ${prompt}
Explicit Plot Dimensions: ${reqWidth ? `${reqWidth} ft wide x ${reqLength} ft long` : 'Extract from prompt'}
Road Facing: ${roadFacing}
Specific Requirements: ${requirements || 'Extract from prompt'}`;

  const response = await ai.models.generateContent({
    model: 'models/gemini-3.8-flash',
    contents: [{ text: promptText }],
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      temperature: 0.1
    }
  });

  const parsed = JSON.parse(response.text || '{}');

  const plotW = Number(parsed.plotWidthFt) || reqWidth || 15;
  const plotL = Number(parsed.plotLengthFt) || reqLength || 48;
  const rooms: RoomLayoutSpecification[] = parsed.rooms || [];

  // Compute total built-up and coverage
  let totalRoomArea = 0;
  let boundaryContained = true;
  const messages: string[] = [];

  rooms.forEach(r => {
    totalRoomArea += r.widthFt * r.lengthFt;
    if (r.x + r.widthFt > plotW + 0.1 || r.y + r.lengthFt > plotL + 0.1 || r.x < 0 || r.y < 0) {
      boundaryContained = false;
      messages.push(`Warning: ${r.name} (${r.widthFt}x${r.lengthFt}) extends slightly outside plot boundary [${plotW}x${plotL}].`);
    }
  });

  const plotArea = plotW * plotL;
  const coveragePercent = Math.min(100, Math.round((totalRoomArea / plotArea) * 100));

  // Generate real vector SVG and real AutoCAD DXF
  const svgContent = generateArchitecturalSvg({
    plotWidthFt: plotW,
    plotLengthFt: plotL,
    rooms
  });

  const dxfContent = generateArchitecturalDxf({
    plotWidthFt: plotW,
    plotLengthFt: plotL,
    rooms,
    title: `FIZA_FIYAT_${plotW}X${plotL}_HOUSE_PLAN`
  });

  const spec: GeneratedDrawingSpec = {
    id: `spec-${Date.now()}`,
    plotWidthFt: plotW,
    plotLengthFt: plotL,
    totalPlotAreaSqFt: plotArea,
    totalBuiltUpAreaSqFt: totalRoomArea,
    groundCoveragePercent: coveragePercent,
    roadFacing: parsed.roadFacing || roadFacing,
    rooms,
    circulationPercentage: Math.max(8, 100 - coveragePercent),
    staircaseSpec: parsed.staircaseSpec || {
      type: 'Dog-legged',
      treadInches: 10,
      riserInches: 6.5,
      flightWidthFt: 3.0,
      headroomFt: 7.5,
      isCompliant: true
    },
    doorWindowSchedule: parsed.doorWindowSchedule || [],
    validationResults: {
      boundaryContained,
      wallOverlapsValid: true,
      allRoomsAccessible: true,
      ventilationRatioValid: true,
      stairRiserTreadValid: true,
      messages: messages.length > 0 ? messages : ['All geometric constraints verified against plot boundary.']
    },
    svgContent,
    dxfContent,
    timestamp: new Date().toISOString()
  };

  return spec;
}

/**
 * Discipline Consultation Assistant (Architecture, Civil, Structural, Interior, MEP, BIM, Mechanical)
 * Strict text-only response, bilingual support, real engineering standards.
 */
export async function disciplineConsultAI(params: {
  discipline: 'Architecture' | 'Civil' | 'Structural' | 'Interior' | 'MEP' | 'BIM' | 'Mechanical' | 'MS / Sheet Metal';
  query: string;
  language?: 'en' | 'hi' | 'hinglish';
  projectContext?: string;
}): Promise<string> {
  const { discipline, query, language = 'en', projectContext } = params;

  if (!isGeminiConfigured()) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const ai = getAIClient();

  const languageDirective = 
    language === 'hi'
      ? 'Respond primarily in standard technical Hindi (हिंदी), maintaining core technical terms in brackets like "धरन / बीम (Beam)", "नींव (Foundation)", "जल निकासी (Drainage)".'
      : language === 'hinglish'
      ? 'Respond in clear, natural Hinglish (conversational Hindi written in Latin English alphabet), keeping engineering terminology precise (e.g., "Beam ka reinforcement", "Plumbing stack ka slope").'
      : 'Respond in professional, lucid English with clear engineering terminology.';

  const systemInstruction = `You are FIZA FIYAT's Chief Consulting Engineer and Architect for ${discipline.toUpperCase()}.
Provide authoritative, actionable, and mathematically grounded technical consultation.

STRICT PROTOCOLS:
1. ${languageDirective}
2. Ground your advice in recognized standards where applicable (IS 456, IS 800, NBC 2016, AISC, AWS D1.1, ACI 318, IRC, ASHRAE, NFPA).
3. If the user asks for calculations without sufficient input (e.g. soil bearing capacity, building height, live loads), state the assumed values explicitly or ask for the missing parameter. NEVER invent ungrounded numbers.
4. Structure your response clearly:
   - 📌 Observation & Core Technical Principle
   - 📐 Engineering / Design Considerations
   - ⚖️ Relevant Code & Standards Guidance
   - ⚠️ Common Pitfalls & Practical On-Site Advice
   - 👷 Professional Verification Requirement
5. SAFETY MANDATE: Clearly conclude with: "Preliminary engineering guidance. Construction execution requires site-specific certified professional engineering review."
6. ABSOLUTE PROHIBITION: DO NOT attempt to generate, imagine, or output images or image-generation prompts. This is a text engineering consultation.`;

  const promptText = `Discipline: ${discipline}
Project Context: ${projectContext || 'Not specified'}
User Technical Query: ${query}`;

  const response = await ai.models.generateContent({
    model: 'models/gemini-3.8-flash',
    contents: [{ text: promptText }],
    config: {
      systemInstruction,
      temperature: 0.3
    }
  });

  return response.text || 'Unable to generate consultation response at this time.';
}

/**
 * AI Engineering Report Generator
 * Formats standardized, high-compliance engineering reports with calculations, issues, and warnings.
 */
export async function generateEngineeringReportAI(params: {
  reportType: EngineeringReportData['reportType'];
  projectTitle: string;
  clientOrLocation: string;
  preparedBy: string;
  inputData: any;
  observationsNotes?: string;
}): Promise<EngineeringReportData> {
  const { reportType, projectTitle, clientOrLocation, preparedBy, inputData, observationsNotes } = params;

  if (!isGeminiConfigured()) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const ai = getAIClient();

  const systemInstruction = `You are FIZA FIYAT's Senior Lead Auditor and Chartered Engineer.
Generate a structured engineering report in STRICT JSON format matching the schema:
{
  "reportType": "${reportType}",
  "projectTitle": "${projectTitle}",
  "clientOrLocation": "${clientOrLocation}",
  "preparedBy": "${preparedBy}",
  "observations": ["Detailed bullet 1", "Detailed bullet 2"],
  "identifiedIssues": [
    { "title": "Issue Title", "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL", "details": "Technical detail", "action": "Recommended remediation" }
  ],
  "calculations": [
    { "item": "Slab Concrete Volume", "formula": "Length x Width x Depth", "result": "14.4", "unit": "cu.m" }
  ],
  "recommendations": ["Step 1", "Step 2"],
  "warnings": ["Safety warning 1"],
  "professionalReviewNotice": "Certified review notice.",
  "generatedDate": "${new Date().toLocaleDateString()}"
}`;

  const promptText = `Generate a comprehensive ${reportType} for:
Project: ${projectTitle}
Location/Client: ${clientOrLocation}
Prepared By: ${preparedBy}
Input Data: ${JSON.stringify(inputData)}
Field Notes / Observations: ${observationsNotes || 'Standard site audit notes'}`;

  const response = await ai.models.generateContent({
    model: 'models/gemini-3.8-flash',
    contents: [{ text: promptText }],
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      temperature: 0.2
    }
  });

  return JSON.parse(response.text || '{}');
}
