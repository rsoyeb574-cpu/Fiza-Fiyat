import { StructuralInspectionResult } from '../types/structuralInspector';

export interface SampleStructuralInspectionCase {
  id: string;
  title: string;
  structureType: string;
  thumbnailUrl: string;
  description: string;
  mockResult: StructuralInspectionResult;
}

export const SAMPLE_STRUCTURAL_CASES: SampleStructuralInspectionCase[] = [
  {
    id: 'sample-column-crack',
    title: 'RC Column Shear Crack near Joint',
    structureType: 'column',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80',
    description: 'Distinct 45-degree diagonal shear distress on reinforced concrete column near beam interface.',
    mockResult: {
      id: 'insp-sample-col-01',
      timestamp: new Date().toISOString(),
      mediaType: 'image',
      structureType: 'Column',
      detectedStructureType: 'RC Column & Beam Joint',
      overallAssessment: 'Significant diagonal shear crack observed traversing the upper third of the reinforced concrete column. Requires urgent structural evaluation.',
      severity: 'high',
      confidence: 'High',
      immediateProfessionalInspection: 'Strongly Recommended',
      summaryParagraph: 'The media reveals a distinct ~45° diagonal shear fracture on a load-bearing reinforced concrete column. This pattern typically indicates high principal tensile stresses exceeding concrete capacity, potentially exacerbated by seismic activity, overload, or inadequate transverse tie spacing.',
      findings: [
        {
          id: 'finding-1',
          problem: 'Diagonal Shear Crack across Column Core',
          location: 'Upper third section of RC column below beam soffit',
          severity: 'High concern',
          category: 'crack',
          evidence: 'Continuous 45-degree inclined fracture line visible across the plastered face with concrete surface flaking along the crack lip.',
          possibleCauses: [
            'Excessive shear stress during lateral load or seismic movement',
            'Inadequate transverse link (stirrup) spacing in column confinement zone',
            'Differential settlement inducing secondary shear moments'
          ],
          annotationId: 'ann-1',
          imageIndex: 0
        },
        {
          id: 'finding-2',
          problem: 'Localized Surface Delamination',
          location: 'Adjacent to primary shear crack plane',
          severity: 'Moderate concern',
          category: 'spalling',
          evidence: 'Cracking and bulging of cement plaster skin indicating internal shear slippage.',
          possibleCauses: [
            'Micro-cracking in concrete cover',
            'Bond degradation between plaster and structural concrete'
          ],
          annotationId: 'ann-2',
          imageIndex: 0
        }
      ],
      annotations: [
        {
          id: 'ann-1',
          type: 'crack',
          label: '[SHEAR CRACK]',
          box2d: [280, 320, 680, 720],
          severity: 'High concern',
          description: '45-degree diagonal shear fracture traversing column core',
          imageIndex: 0
        },
        {
          id: 'ann-2',
          type: 'spalling',
          label: '[DELAMINATION]',
          box2d: [480, 520, 720, 780],
          severity: 'Moderate concern',
          description: 'Surface plaster spalling along fracture line',
          imageIndex: 0
        }
      ],
      whatMayBeRequired: [
        'Immediate on-site structural audit by a licensed civil/structural engineer',
        'Temporary propping/shoring of adjacent floor slabs if live loads are active',
        'Ultrasonic Pulse Velocity (UPV) testing to measure crack depth penetration into core',
        'Optical crack gauge monitoring to verify if crack is active or dormant'
      ],
      possibleRepairApproaches: [
        {
          issueType: 'Structural Shear Crack in RC Column',
          repairClassification: 'Potential Structural Issue (Requires Professional Assessment)',
          steps: [
            'Erect temporary structural steel shoring to relieve floor dead and live load',
            'Low-pressure structural epoxy injection through surface entry ports',
            'Install carbon-fiber reinforced polymer (CFRP) confinement wrap around column perimeter',
            'Apply fire-retardant cementitious plaster over composite wrap'
          ],
          materialsInvolved: ['Low-viscosity Structural Epoxy', 'CFRP Unidirectional Fabric', 'Epoxy Saturant Resin'],
          professionalWarning: 'CRITICAL: Do NOT attempt superficial cosmetic patching. Column load capacity must be engineered by a licensed structural specialist.'
        }
      ],
      questionsForEngineer: [
        'Has the crack penetrated through the column core to the main vertical rebar?',
        'Is immediate temporary shoring required before further occupancy?',
        'Is high-pressure epoxy injection and CFRP jacketing sufficient to restore original shear capacity?',
        'Does the adjacent beam-column joint show secondary distress?'
      ],
      safetyDisclaimer: 'CRITICAL LIMITATION: This AI visual inspection is a preliminary screening based strictly on visible pixels. It CANNOT measure subsurface concrete strength, internal reinforcement corrosion, foundation settlement dynamics, or seismic compliance. An on-site physical inspection by a licensed structural engineer is mandatory before any repair, modification, or occupancy conclusion.',
      imageUrls: ['https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80']
    }
  },
  {
    id: 'sample-concrete-spalling',
    title: 'Slab Soffit Spalling & Exposed Rebar',
    structureType: 'slab',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    description: 'Carbonation-induced spalling of concrete cover with corroded, exposed tension rebar on slab underside.',
    mockResult: {
      id: 'insp-sample-slab-02',
      timestamp: new Date().toISOString(),
      mediaType: 'image',
      structureType: 'Slab',
      detectedStructureType: 'Reinforced Concrete Ceiling Slab',
      overallAssessment: 'Moderate to High distress with advanced concrete cover spalling and visible oxidized steel reinforcement.',
      severity: 'moderate',
      confidence: 'High',
      immediateProfessionalInspection: 'Recommended',
      summaryParagraph: 'The ceiling slab exhibits extensive delamination of the bottom concrete cover, exposing longitudinal steel bars with heavy brown iron oxide corrosion product. This is primarily caused by carbonation and moisture penetration breaking down the alkaline protective passivation layer.',
      findings: [
        {
          id: 'finding-1',
          problem: 'Concrete Cover Spalling with Exposed Rebar',
          location: 'Underside soffit of suspended floor slab',
          severity: 'High concern',
          category: 'spalling',
          evidence: 'Missing cover concrete measuring ~20-30mm depth with exposed rusted rebar displaying visible cross-sectional reduction.',
          possibleCauses: [
            'Carbonation-induced depassivation of reinforcing steel',
            'Water seepage from upper floor or plumbing line',
            'Inadequate initial cover thickness during construction'
          ],
          annotationId: 'ann-1',
          imageIndex: 0
        },
        {
          id: 'finding-2',
          problem: 'Rebar Corrosion & Rust Staining',
          location: 'Exposed bottom reinforcement grid',
          severity: 'Moderate concern',
          category: 'corrosion',
          evidence: 'Rust flaking (lamination) and orange-brown ferric oxide stains leaching onto surrounding plaster.',
          possibleCauses: [
            'Sustained high relative humidity and oxygen ingress',
            'Chlorides in mixing sand or coastal ambient environment'
          ],
          annotationId: 'ann-2',
          imageIndex: 0
        }
      ],
      annotations: [
        {
          id: 'ann-1',
          type: 'spalling',
          label: '[SPALLING & REBAR]',
          box2d: [300, 250, 750, 800],
          severity: 'High concern',
          description: 'Spalled concrete cover exposing oxidized tension steel',
          imageIndex: 0
        },
        {
          id: 'ann-2',
          type: 'corrosion',
          label: '[CORROSION]',
          box2d: [420, 320, 680, 680],
          severity: 'Moderate concern',
          description: 'Oxidized rebar with visible rust leaching',
          imageIndex: 0
        }
      ],
      whatMayBeRequired: [
        'Phenolphthalein carbonation depth spray test on freshly exposed concrete',
        'Caliper measurement of remaining steel bar cross-sectional area',
        'Half-cell potential corrosion survey of adjacent ceiling areas',
        'Moisture survey on the top surface of the slab to identify water source'
      ],
      possibleRepairApproaches: [
        {
          issueType: 'Slab Soffit Spalling & Corrosion',
          repairClassification: 'Potential Structural Issue (Requires Professional Assessment)',
          steps: [
            'Identify and seal any active water leakage from above',
            'Mechanically break back concrete 20mm behind corroded bars',
            'Grit blast or wire brush steel to remove all loose rust scale',
            'Apply zinc-rich anti-corrosion primer to steel reinforcement',
            'Apply polymer-modified structural repair mortar in layers',
            'Coat with anti-carbonation protective coating system'
          ],
          materialsInvolved: ['Zinc-rich Epoxy Primer', 'Polymer Modified Repair Mortar', 'Anti-Carbonation Acrylic Coating'],
          professionalWarning: 'If remaining bar diameter is reduced by more than 15-20%, supplementary reinforcement or sister bars must be welded/anchored per structural engineer specification.'
        }
      ],
      questionsForEngineer: [
        'Has steel cross-section loss compromised flexural safety?',
        'Is supplementary rebar needed before patching?',
        'What anti-carbonation coating specification is best suited for long-term protection?'
      ],
      safetyDisclaimer: 'CRITICAL LIMITATION: This AI visual inspection is a preliminary screening based strictly on visible pixels. It CANNOT measure subsurface concrete strength, internal reinforcement corrosion, foundation settlement dynamics, or seismic compliance. An on-site physical inspection by a licensed structural engineer is mandatory before any repair, modification, or occupancy conclusion.',
      imageUrls: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80']
    }
  },
  {
    id: 'sample-brick-settlement',
    title: 'Masonry Wall Diagonal Step Cracks',
    structureType: 'house',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=1200&q=80',
    description: 'Diagonal stair-step crack traversing along brick mortar joints indicating potential foundation settlement.',
    mockResult: {
      id: 'insp-sample-wall-03',
      timestamp: new Date().toISOString(),
      mediaType: 'image',
      structureType: 'Residential House',
      detectedStructureType: 'Load-Bearing Brick Masonry Wall',
      overallAssessment: 'Distinct diagonal stair-step crack following bed and head joints, indicative of localized differential foundation settlement.',
      severity: 'moderate',
      confidence: 'High',
      immediateProfessionalInspection: 'Recommended',
      summaryParagraph: 'The external masonry wall shows characteristic diagonal step cracks running through the mortar joints. This pattern typically emerges when one corner or sector of the building foundation subsides slightly due to soil moisture fluctuations, poor compaction, or tree root dehydration.',
      findings: [
        {
          id: 'finding-1',
          problem: 'Stair-Step Masonry Cracking',
          location: 'Exterior corner wall extending from window sill downward',
          severity: 'Moderate concern',
          category: 'masonry',
          evidence: 'Step-like separation along mortar lines with crack width tapering from wider at the top to narrower near the plinth.',
          possibleCauses: [
            'Differential foundation settlement at building corner',
            'Subsoil volume changes (expansive clay swelling/shrinkage)',
            'Plumbing or storm drain leak softening sub-base soil'
          ],
          annotationId: 'ann-1',
          imageIndex: 0
        }
      ],
      annotations: [
        {
          id: 'ann-1',
          type: 'masonry',
          label: '[STEP CRACK]',
          box2d: [200, 200, 750, 700],
          severity: 'Moderate concern',
          description: 'Diagonal stair-step settlement crack in brickwork',
          imageIndex: 0
        }
      ],
      whatMayBeRequired: [
        'Geotechnical soil check and drainage inspection around building perimeter',
        'Installation of glass or calibrated acrylic crack tell-tales for 60-day movement tracking',
        'Plinth level survey to quantify total differential settlement across building corners'
      ],
      possibleRepairApproaches: [
        {
          issueType: 'Masonry Settlement Step Cracks',
          repairClassification: 'Potential Structural Issue (Requires Professional Assessment)',
          steps: [
            'Monitor crack movement with tell-tales to ensure settlement has stabilized',
            'Improve perimeter storm water drainage away from foundation',
            'Rake out loose mortar in cracked joints to 30mm depth',
            'Install stainless steel helical stitch bars across cracks grouted with non-shrink thixotropic mortar',
            'Repoint with matching breathable lime/cement mortar'
          ],
          materialsInvolved: ['Stainless Steel Helical Crack Stitch Ties', 'High-strength Grout', 'Matching Mortar'],
          professionalWarning: 'Do NOT fill cracks before verifying that subsoil settlement has ceased, or cracks will promptly reopen.'
        }
      ],
      questionsForEngineer: [
        'Is the foundation settlement active or historic/dormant?',
        'Is underpinning or soil stabilization required, or is crack stitching sufficient?',
        'Does the roof or upper floor load distribution contribute to this movement?'
      ],
      safetyDisclaimer: 'CRITICAL LIMITATION: This AI visual inspection is a preliminary screening based strictly on visible pixels. It CANNOT measure subsurface concrete strength, internal reinforcement corrosion, foundation settlement dynamics, or seismic compliance. An on-site physical inspection by a licensed structural engineer is mandatory before any repair, modification, or occupancy conclusion.',
      imageUrls: ['https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=1200&q=80']
    }
  }
];
