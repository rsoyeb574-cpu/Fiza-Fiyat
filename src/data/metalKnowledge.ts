/**
 * Fiza Hayat Engineering & Architectural Intelligence Platform
 * Authoritative Metal, Mild Steel & Sheet Metal Knowledge Base
 * 
 * Structured database of MS (Mild Steel), Structural Carbon Steel, and Sheet Metal
 * types (Hot Rolled, Cold Rolled, Galvanized, Stainless Steel, Hollow Sections) with
 * validated mechanical properties (Yield, Tensile, Ductility / Elongation),
 * dual mapping to Indian Standards (BIS) and International Codes (AISC / AWS / ASTM / EN),
 * plus export utilities designed to be directly consumed by the server-side AI service.
 */

export interface MechanicalProperties {
  yieldStrengthMpa: {
    min: number;
    typical: number;
    description: string;
  };
  tensileStrengthMpa: {
    min: number;
    typical: number;
    description: string;
  };
  elongationPercent: {
    min: number;
    typical: number;
    gaugeLength: string;
    ductilityRating: 'High' | 'Very High' | 'Exceptional' | 'Moderate' | 'Limited';
  };
  hardness: {
    scale: 'HRB' | 'HRC' | 'BHN' | 'HV';
    typicalValue: string;
  };
  modulusOfElasticityGpa: number; // Young's Modulus E (typically 200-210 GPa for steel)
  densityKgM3: number; // e.g. 7850 kg/m3 for carbon steel, 7930-8000 for stainless
  poissonsRatio: number; // typically 0.28 to 0.30
  shearModulusGpa?: number; // G typically ~77-81 GPa
  minBendRadius: {
    punchRadius: string;
    notes: string;
  };
  charpyImpactJoules?: {
    tempCelsius: number;
    energyJoules: number;
    testedStandard: string;
  };
}

export interface StandardMapping {
  bis: {
    standardNumber: string;
    gradeDesignation: string;
    title: string;
    designCode: string; // e.g. IS 800:2007 (LSD / WSD)
  };
  aisc: {
    specificationRef: string; // e.g. AISC 360-22 Table 2-4
    manualClassification: string;
    nominalYieldKsi: number;
    nominalTensileKsi: number;
  };
  aws: {
    codeRef: string; // e.g. AWS D1.1 (Structural) or AWS D1.3 (Sheet Steel) or AWS D1.6 (Stainless)
    prequalifiedGroup: string; // e.g. Group I, Group II, Category B
    recommendedElectrodeSMAW: string; // e.g. AWS E7018, E6013
    recommendedWireGMAW: string; // e.g. ER70S-6, ER308L
    preheatInterpassGuideline: string;
  };
  astm: {
    specNumber: string;
    grade: string;
  };
  enIso: {
    standardNumber: string;
    grade: string;
    isoCorrosionClass?: string; // e.g. ISO 12944 C1 to C5-M
  };
}

export interface FabricationGuidance {
  weldability: 'Excellent' | 'Good' | 'Fair' | 'Requires Preheat / Strict Procedure';
  cuttingMethods: string[]; // e.g. Laser (Fiber/CO2), CNC Plasma, Shearing, Waterjet
  formingCharacteristics: string;
  corrosionProtectionRequired: string;
  recommendedFinishes: string[];
  galvanizingSuitability: 'Recommended (Hot-Dip IS 2629 / ASTM A123)' | 'Pre-Galvanized' | 'Not Applicable (Stainless)' | 'Special Cleaning Required';
}

export interface MetalKnowledgeRecord {
  id: string;
  name: string;
  category: 
    | 'Mild Steel (MS) Structural'
    | 'Sheet Metal - Hot Rolled (HR/HRPO)'
    | 'Sheet Metal - Cold Rolled (CR/CRCA)'
    | 'Sheet Metal - Galvanized Iron (GI/GP)'
    | 'Stainless Steel Sheet & Plate'
    | 'Structural Hollow Sections (HSS / Pipe)';
  shortCode: string;
  typicalThicknessRangeMm: string;
  gaugeRange: string;
  surfaceCondition: string;
  chemicalCompositionTypical: {
    carbonMax: number;
    manganeseRange: string;
    siliconMax?: number;
    phosphorusMax: number;
    sulfurMax: number;
    chromiumRange?: string;
    nickelRange?: string;
    molybdenumRange?: string;
    carbonEquivalentMax?: number; // CE = C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15
  };
  mechanicalProperties: MechanicalProperties;
  standards: StandardMapping;
  fabrication: FabricationGuidance;
  primaryApplications: string[];
  engineeringFailureModes: string[];
  qualityAssuranceChecks: string[];
}

export const METAL_KNOWLEDGE_DATABASE: MetalKnowledgeRecord[] = [
  // =========================================================================
  // 1. MILD STEEL (MS) STRUCTURAL - IS 2062 E250 / ASTM A36
  // =========================================================================
  {
    id: 'ms-is2062-e250',
    name: 'Mild Steel (IS 2062 Gr. E250 / Fe 410 W)',
    category: 'Mild Steel (MS) Structural',
    shortCode: 'MS-E250',
    typicalThicknessRangeMm: '1.6mm - 63mm+',
    gaugeRange: '16 Gauge up to heavy 50mm+ plate',
    surfaceCondition: 'Mill scale as hot-rolled; requires abrasive blast cleaning (SSPC-SP10 / Sa 2.5) for high-performance coatings',
    chemicalCompositionTypical: {
      carbonMax: 0.22,
      manganeseRange: '0.40 - 1.50%',
      siliconMax: 0.40,
      phosphorusMax: 0.045,
      sulfurMax: 0.045,
      carbonEquivalentMax: 0.42
    },
    mechanicalProperties: {
      yieldStrengthMpa: {
        min: 250,
        typical: 260,
        description: '250 MPa minimum yield for thickness <= 20mm; drops to 240 MPa for 20-40mm per IS 2062'
      },
      tensileStrengthMpa: {
        min: 410,
        typical: 440,
        description: '410 - 540 MPa ultimate tensile strength'
      },
      elongationPercent: {
        min: 23,
        typical: 26,
        gaugeLength: '5.65√S0 (approx 50mm GL)',
        ductilityRating: 'High'
      },
      hardness: {
        scale: 'HRB',
        typicalValue: '65 - 75 HRB (~120 - 140 BHN)'
      },
      modulusOfElasticityGpa: 200,
      densityKgM3: 7850,
      poissonsRatio: 0.30,
      shearModulusGpa: 77,
      minBendRadius: {
        punchRadius: '1.5t (for t <= 25mm), 2.0t (for t > 25mm)',
        notes: 'Capable of 180° cold bend around pin diameter 2t for Quality A/B'
      },
      charpyImpactJoules: {
        tempCelsius: 0,
        energyJoules: 27,
        testedStandard: 'IS 2062 Quality B (tested at 0°C), Quality BR (tested at room temp)'
      }
    },
    standards: {
      bis: {
        standardNumber: 'IS 2062:2011',
        gradeDesignation: 'E250 (Fe 410 W Quality A, B, C)',
        title: 'Hot Rolled Medium and High Tensile Structural Steel',
        designCode: 'IS 800:2007 (General Construction in Steel - Code of Practice)'
      },
      aisc: {
        specificationRef: 'AISC 360-22 Section A3.1 & Table 2-4',
        manualClassification: 'Carbon Structural Steel (Fy = 36 ksi / 250 MPa, Fu = 58 ksi / 400 MPa)',
        nominalYieldKsi: 36,
        nominalTensileKsi: 58
      },
      aws: {
        codeRef: 'AWS D1.1 / D1.1M Structural Welding Code - Steel',
        prequalifiedGroup: 'Group I Base Metal (Table 5.3 / 3.1)',
        recommendedElectrodeSMAW: 'AWS A5.1 E7018 / E6013 low-hydrogen or rutile for non-critical joints',
        recommendedWireGMAW: 'AWS A5.18 ER70S-6 (Shielding: 80/20 Ar/CO2 or 100% CO2)',
        preheatInterpassGuideline: 'None required for thickness <= 25mm with low-hydrogen electrodes when base metal > 0°C. For thickness > 25mm, maintain 50°C - 65°C minimum preheat.'
      },
      astm: {
        specNumber: 'ASTM A36 / A36M',
        grade: 'A36 Structural Steel'
      },
      enIso: {
        standardNumber: 'EN 10025-2',
        grade: 'S275JR / S275J0 (1.0044)',
        isoCorrosionClass: 'ISO 12944 C2 to C4 (dependent on paint system)'
      }
    },
    fabrication: {
      weldability: 'Excellent',
      cuttingMethods: ['CNC Fiber Laser (with O2/N2)', 'CNC Oxy-Fuel (for t > 16mm)', 'CNC High-Def Plasma', 'Cold Mechanical Shearing'],
      formingCharacteristics: 'Readily rolled into cylinders and press-braked without cracking when inner radius >= 1.5t.',
      corrosionProtectionRequired: 'Mandatory in atmospheric exposure: zinc phosphate primer (35-50µm) + epoxy intermediate + polyurethane topcoat (total DFT 120-160µm) or hot-dip galvanizing.',
      recommendedFinishes: ['Red Oxide Zinc Chromate Primer', 'Epoxy High-Build Micaceous Iron Oxide (MIO)', 'Hot Dip Galvanized (IS 2629)', 'Polyurethane Enamel Topcoat'],
      galvanizingSuitability: 'Recommended (Hot-Dip IS 2629 / ASTM A123)'
    },
    primaryApplications: [
      'Structural building columns, beams (ISMB / ISMC / ISA angle profiles)',
      'Roof trusses, purlins, industrial warehouse sheds, and PEB canopy structures',
      'Base plates, stiffeners, gusset plates, and shear connection brackets',
      'General architectural metalwork, stair stringers, boundary railings, and entry gates'
    ],
    engineeringFailureModes: [
      'Elastic/Inelastic flexural-torsional buckling in unbraced compression flanges',
      'Atmospheric rust flaking and uniform cross-sectional loss when unpainted',
      'Lamellar tearing in thick (>32mm) welded T-joints subject to through-thickness tensile stress',
      'Weld root cracking if contaminated with oil, grease, or moisture during field welding'
    ],
    qualityAssuranceChecks: [
      'Verify Mill Test Certificate (MTC) confirms IS 2062 E250 with CE < 0.42%',
      'Visual Inspection (VT) of all weld profiles per AWS D1.1 Table 8.1',
      'Ultrasonic testing (UT) on full penetration moment welds and plates > 25mm',
      'Magnetic particle inspection (MT) or Dye Penetrant (PT) on critical fillet welds'
    ]
  },

  // =========================================================================
  // 2. HIGH STRENGTH STRUCTURAL STEEL - IS 2062 E350 / ASTM A572 Gr 50 / A992
  // =========================================================================
  {
    id: 'ms-is2062-e350',
    name: 'High-Strength Structural Steel (IS 2062 Gr. E350 / Fe 490)',
    category: 'Mild Steel (MS) Structural',
    shortCode: 'MS-E350',
    typicalThicknessRangeMm: '3.0mm - 80mm+',
    gaugeRange: '10 Gauge up to heavy 80mm transfer girder plates',
    surfaceCondition: 'Hot-rolled mill scale; mandatory blast cleaning prior to welding/painting',
    chemicalCompositionTypical: {
      carbonMax: 0.20,
      manganeseRange: '1.00 - 1.65%',
      siliconMax: 0.45,
      phosphorusMax: 0.040,
      sulfurMax: 0.040,
      carbonEquivalentMax: 0.45
    },
    mechanicalProperties: {
      yieldStrengthMpa: {
        min: 350,
        typical: 365,
        description: '350 MPa minimum yield up to 20mm; 330-340 MPa for 20-40mm thickness'
      },
      tensileStrengthMpa: {
        min: 490,
        typical: 520,
        description: '490 - 630 MPa ultimate tensile strength'
      },
      elongationPercent: {
        min: 22,
        typical: 24,
        gaugeLength: '5.65√S0',
        ductilityRating: 'High'
      },
      hardness: {
        scale: 'HRB',
        typicalValue: '78 - 88 HRB (~145 - 175 BHN)'
      },
      modulusOfElasticityGpa: 205,
      densityKgM3: 7850,
      poissonsRatio: 0.30,
      shearModulusGpa: 78,
      minBendRadius: {
        punchRadius: '2.0t (t <= 20mm), 2.5t (t > 20mm)',
        notes: 'Higher yield strength requires 25-30% more press brake tonnage and springback compensation'
      },
      charpyImpactJoules: {
        tempCelsius: -20,
        energyJoules: 27,
        testedStandard: 'IS 2062 E350 Quality C (tested at -20°C) / Quality B (at 0°C)'
      }
    },
    standards: {
      bis: {
        standardNumber: 'IS 2062:2011',
        gradeDesignation: 'E350 (Fe 490 Quality A, B, C)',
        title: 'Hot Rolled Medium and High Tensile Structural Steel',
        designCode: 'IS 800:2007 Limit State Design (Steel Section Properties)'
      },
      aisc: {
        specificationRef: 'AISC 360-22 Table 2-4 / ASTM A992',
        manualClassification: 'High-Strength Low-Alloy (HSLA) Steel (Fy = 50 ksi / 345 MPa, Fu = 65 ksi / 450 MPa)',
        nominalYieldKsi: 50,
        nominalTensileKsi: 65
      },
      aws: {
        codeRef: 'AWS D1.1 Structural Welding Code - Steel',
        prequalifiedGroup: 'Group II Base Metal (Table 5.3)',
        recommendedElectrodeSMAW: 'AWS A5.5 E8018-G / E7018-1 low-hydrogen (H4 moisture resistance)',
        recommendedWireGMAW: 'AWS A5.28 ER80S-D2 / AWS A5.18 ER70S-6',
        preheatInterpassGuideline: 'Preheat 65°C for 20mm-40mm; 100°C for > 40mm thickness. Strict low-hydrogen procedure required.'
      },
      astm: {
        specNumber: 'ASTM A572 Gr. 50 / ASTM A992 (Wide Flange)',
        grade: 'Grade 50 / A992'
      },
      enIso: {
        standardNumber: 'EN 10025-2',
        grade: 'S355J2 / S355JR (1.0577)',
        isoCorrosionClass: 'ISO 12944 C3 to C5-I'
      }
    },
    fabrication: {
      weldability: 'Good',
      cuttingMethods: ['High-Definition CNC Plasma', 'CNC Fiber Laser', 'Oxy-Fuel with controlled beveling'],
      formingCharacteristics: 'Can be cold formed; requires pre-checking for longitudinal edge gouges and larger bend radiuses to avoid outer fiber tears.',
      corrosionProtectionRequired: 'Zinc-rich epoxy primer (minimum 80% zinc in dry film, 60-75µm) + MIO epoxy tie coat + aliphatic polyurethane finish.',
      recommendedFinishes: ['Inorganic Zinc Silicate Primer', 'Epoxy High Build MIO Intermediate', 'Aliphatic Polyurethane Topcoat'],
      galvanizingSuitability: 'Recommended (Hot-Dip IS 2629 / ASTM A123)'
    },
    primaryApplications: [
      'Multi-story commercial steel structural framing and high-load portal frames',
      'Heavy crane gantry girders, transfer trusses, and long-span space frames',
      'Bridge deck girders, industrial mezzanine primary beams, and heavy seismic frames',
      'Pre-Engineered Building (PEB) tapered rafter flanges and heavy base assemblies'
    ],
    engineeringFailureModes: [
      'Hydrogen-assisted delayed cold cracking (HACC) in heat affected zone (HAZ) if non-low-hydrogen electrodes are used',
      'Web crippling and web buckling under concentrated wheel or post loads',
      'Fatigue cracking in cyclic crane runway girder connections'
    ],
    qualityAssuranceChecks: [
      'Mandatory 100% UT (Ultrasonic Testing) of full penetration groove welds',
      'Diffusible hydrogen test on weld consumables (< 4ml/100g deposit)',
      'Charpy impact verification for low temperature or dynamic seismic service'
    ]
  },

  // =========================================================================
  // 3. SHEET METAL - HOT ROLLED (HR & HRPO) - IS 1079 / ASTM A1011
  // =========================================================================
  {
    id: 'sheet-hr-is1079',
    name: 'Hot Rolled Steel Sheet / Strip (IS 1079 Gr. HR1/HR4 & HRPO)',
    category: 'Sheet Metal - Hot Rolled (HR/HRPO)',
    shortCode: 'HR-IS1079',
    typicalThicknessRangeMm: '1.6mm - 12.0mm',
    gaugeRange: '16 Gauge (1.6mm) up to 1/2" (12.7mm) plate-sheet',
    surfaceCondition: 'Standard HR: Blue-grey tight magnetite mill scale (Fe3O4). HRPO (Pickled & Oiled): Acid-pickled, scale-free clean metallic finish with protective oil film.',
    chemicalCompositionTypical: {
      carbonMax: 0.15,
      manganeseRange: '0.30 - 0.60%',
      siliconMax: 0.10,
      phosphorusMax: 0.040,
      sulfurMax: 0.040,
      carbonEquivalentMax: 0.35
    },
    mechanicalProperties: {
      yieldStrengthMpa: {
        min: 235,
        typical: 250,
        description: '235 - 275 MPa typical yield depending on HR grade (HR1 Commercial vs HR4 Structural)'
      },
      tensileStrengthMpa: {
        min: 370,
        typical: 410,
        description: '370 - 450 MPa tensile range'
      },
      elongationPercent: {
        min: 24,
        typical: 28,
        gaugeLength: 'Lo = 50mm / Lo = 80mm',
        ductilityRating: 'High'
      },
      hardness: {
        scale: 'HRB',
        typicalValue: '60 - 72 HRB'
      },
      modulusOfElasticityGpa: 200,
      densityKgM3: 7850,
      poissonsRatio: 0.29,
      shearModulusGpa: 77,
      minBendRadius: {
        punchRadius: '1.0t (along rolling direction), 1.5t (transverse to rolling)',
        notes: 'Excellent press brake formability. HRPO yields cleaner bend corners with zero die wear from scale.'
      }
    },
    standards: {
      bis: {
        standardNumber: 'IS 1079:2017',
        gradeDesignation: 'HR1 (Commercial), HR2 (Drawing), HR4 (Structural Fe 410)',
        title: 'Hot Rolled Carbon Steel Sheet and Strip',
        designCode: 'IS 800:2007 (Steel Structures) & IS 801:1975 (Cold-formed Light Gauge Steel)'
      },
      aisc: {
        specificationRef: 'AISC 360-22 Specification for Structural Steel Buildings',
        manualClassification: 'Hot-Rolled Sheet Steel for Plate Elements and Gussets',
        nominalYieldKsi: 36,
        nominalTensileKsi: 52
      },
      aws: {
        codeRef: 'AWS D1.3 / D1.3M Structural Welding Code - Sheet Steel',
        prequalifiedGroup: 'Category B (Sheet to Sheet & Sheet to Supporting Member)',
        recommendedElectrodeSMAW: 'AWS A5.1 E6013 / E7018 (3.15mm or 2.5mm for thinner sheets)',
        recommendedWireGMAW: 'AWS A5.18 ER70S-6 wire (0.8mm - 1.0mm diameter)',
        preheatInterpassGuideline: 'Preheat usually not required under standard shop ambient conditions (> 10°C).'
      },
      astm: {
        specNumber: 'ASTM A1011 / A1011M',
        grade: 'CS Type B / SS Grade 36'
      },
      enIso: {
        standardNumber: 'EN 10111 / EN 10025-2',
        grade: 'DD11 (EN 10111) / S235JR (EN 10025-2)',
        isoCorrosionClass: 'Requires industrial paint system for external exposure'
      }
    },
    fabrication: {
      weldability: 'Excellent',
      cuttingMethods: ['CNC Fiber Laser (HRPO cuts up to 30% faster than black HR)', 'CNC Plasma', 'Mechanical Guillotine Shear'],
      formingCharacteristics: 'Good bendability up to 90° and 135°. Scale on black HR can chip during tight radius bending; specify HRPO for painted show surfaces.',
      corrosionProtectionRequired: 'Standard HR must be sandblasted or pickled before powder coating. Powder coat or liquid epoxy system required.',
      recommendedFinishes: ['Thermosetting Pure Polyester Powder Coating (60-80µm)', 'Epoxy-Polyester Hybrid Powder', 'Industrial Synthetic Enamel'],
      galvanizingSuitability: 'Recommended (Hot-Dip IS 2629 / ASTM A123)'
    },
    primaryApplications: [
      'Gusset connection plates, beam splice end-plates, and base shoes',
      'Structural C & Z purlin clips, sag rod brackets, and rafter cleats',
      'Heavy machinery frames, generator acoustic enclosure skids, and electrical transformer tanks',
      'Storage racking upright bases, warehouse pallet rack connectors, and conveyor side rails'
    ],
    engineeringFailureModes: [
      'Poor paint adhesion and delamination due to unremoved mill scale',
      'Burn-through during manual welding on thicknesses < 2.0mm',
      'Notch sensitivity and tearing at corners if internal bend radius < 1.0t'
    ],
    qualityAssuranceChecks: [
      'Surface scale inspection: check for mill scale pitting, rolled-in defects, or gouges',
      'Sheet thickness tolerance verification per IS 1079 Table 4',
      'Bend test: 180° cold bend without cracking on the outside of the bent portion'
    ]
  },

  // =========================================================================
  // 4. SHEET METAL - COLD ROLLED (CR / CRCA) - IS 513 / ASTM A1008
  // =========================================================================
  {
    id: 'sheet-cr-is513',
    name: 'Cold Rolled Close Annealed (CR / CRCA) Sheet (IS 513 Gr. CR1/CR3)',
    category: 'Sheet Metal - Cold Rolled (CR/CRCA)',
    shortCode: 'CRCA-IS513',
    typicalThicknessRangeMm: '0.40mm - 3.20mm',
    gaugeRange: '28 Gauge (0.4mm) to 10 Gauge (3.2mm)',
    surfaceCondition: 'Smooth, scale-free, matte finish (Ra 0.8 - 1.5 µm); light oil coating to prevent transit corrosion (slushing oil)',
    chemicalCompositionTypical: {
      carbonMax: 0.12,
      manganeseRange: '0.20 - 0.50%',
      siliconMax: 0.05,
      phosphorusMax: 0.035,
      sulfurMax: 0.035,
      carbonEquivalentMax: 0.28
    },
    mechanicalProperties: {
      yieldStrengthMpa: {
        min: 190,
        typical: 215,
        description: '190 - 240 MPa for CR1 (Commercial); 140 - 180 MPa for CR3 (Deep Drawing)'
      },
      tensileStrengthMpa: {
        min: 320,
        typical: 350,
        description: '320 - 410 MPa ultimate tensile strength'
      },
      elongationPercent: {
        min: 28,
        typical: 34,
        gaugeLength: 'Lo = 80mm',
        ductilityRating: 'Very High'
      },
      hardness: {
        scale: 'HRB',
        typicalValue: '45 - 60 HRB (Dead Soft Annealed to Commercial Quality)'
      },
      modulusOfElasticityGpa: 205,
      densityKgM3: 7850,
      poissonsRatio: 0.29,
      shearModulusGpa: 78,
      minBendRadius: {
        punchRadius: '0.5t (for CR1) to 0.0t / flat-hem (for CR3/CR4 drawing grades)',
        notes: 'Exceptional press-brake formability; zero flaking, sharp corners and hemming achievable.'
      }
    },
    standards: {
      bis: {
        standardNumber: 'IS 513 (Part 1):2016',
        gradeDesignation: 'CR1 (Commercial), CR2 (Drawing), CR3 (Deep Drawing), CR4 (Extra Deep Drawing)',
        title: 'Cold Reduced Low Carbon Steel Sheet and Strip - Part 1: Cold Forming and Drawing Steel',
        designCode: 'IS 801:1975 (Code of Practice for Use of Cold-Formed Light Gauge Steel Members)'
      },
      aisc: {
        specificationRef: 'AISI S100 / AISC Specification for Cold-Formed Steel Structural Members',
        manualClassification: 'Cold-Formed Light Gauge Sheet Metal',
        nominalYieldKsi: 30,
        nominalTensileKsi: 45
      },
      aws: {
        codeRef: 'AWS D1.3 / D1.3M Structural Welding Code - Sheet Steel',
        prequalifiedGroup: 'Sheet Steel Welded with GMAW / GTAW / Resistance Spot Welding',
        recommendedElectrodeSMAW: 'Not recommended for < 1.2mm (burn-through); use AWS E6013 2.0mm for 1.6-3.2mm',
        recommendedWireGMAW: 'AWS A5.18 ER70S-6 (0.8mm diameter with 82/18 Ar/CO2 short-circuit transfer)',
        preheatInterpassGuideline: 'Preheat strictly forbidden to avoid heat-distortion and grain growth.'
      },
      astm: {
        specNumber: 'ASTM A1008 / A1008M',
        grade: 'CS Type B / DS Type B / DDS'
      },
      enIso: {
        standardNumber: 'EN 10130',
        grade: 'DC01 (Commercial) / DC03 (Deep Drawing) / DC04 (EDD)',
        isoCorrosionClass: 'Indoor non-condensing only unless high-grade coated'
      }
    },
    fabrication: {
      weldability: 'Excellent',
      cuttingMethods: ['CNC High-Speed Fiber Laser (N2 assist for burr-free edges)', 'CNC Turret Punching', 'Precision Shearing'],
      formingCharacteristics: 'Superb drawability and bending. Minimal springback compared to high-strength steels. Capable of seamless pressing and tight hems.',
      corrosionProtectionRequired: 'Very prone to rapid atmospheric surface flash rusting if unprotected. Mandatory 7-tank or 9-tank chemical pre-treatment (zinc phosphating or nano-zirconium) before electrostatic powder coating.',
      recommendedFinishes: ['Thermoset Polyester / Epoxy Powder Coat (60-90µm)', 'Automotive Electro-Deposition (CED / ED) Coating', 'Liquid Polyurethane Enamel'],
      galvanizingSuitability: 'Special Cleaning Required'
    },
    primaryApplications: [
      'Electrical control panels, switchgear cubicles, and MCC / PLC panels',
      'HVAC air handling unit (AHU) double-skin casings, fan coil chassis, and precision duct dampers',
      'Architectural metal doors, partition frames, fire-rated hollow metal doors, and ceiling tiles',
      'Server racks, telecom enclosures, kiosk cabinets, and domestic appliance bodies'
    ],
    engineeringFailureModes: [
      'Oil canning / sheet waviness when large un-stiffened panels (> 600mm) lack cross-breaking (X-creasing) or stiffener hats',
      'Rapid oxidation and spider-web rusting beneath paint film if chemical phosphating is substandard',
      'Heat warpage during continuous welding: joints must be stitch-welded or resistance spot-welded'
    ],
    qualityAssuranceChecks: [
      'Thickness micrometer check across sheet width per IS 513 tolerance class',
      'Surface finish Ra measurement (0.8 - 1.5 µm) and zero roll mark defect check',
      'Cross-hatch adhesion test (ASTM D3359 / IS 101) of cured powder coating (Class 4B/5B mandatory)'
    ]
  },

  // =========================================================================
  // 5. SHEET METAL - GALVANIZED IRON (GI / GP) - IS 277 / ASTM A653
  // =========================================================================
  {
    id: 'sheet-gi-is277',
    name: 'Galvanized Plain Steel Sheet (IS 277 Gr. GP / 120-275 GSM)',
    category: 'Sheet Metal - Galvanized Iron (GI/GP)',
    shortCode: 'GI-IS277',
    typicalThicknessRangeMm: '0.50mm - 3.00mm',
    gaugeRange: '26 Gauge (0.50mm) to 11 Gauge (3.0mm)',
    surfaceCondition: 'Continuous hot-dip zinc coating with regular spangle, minimized spangle, or zero spangle; passivated / chromated to resist storage wet-stain (white rust)',
    chemicalCompositionTypical: {
      carbonMax: 0.15,
      manganeseRange: '0.25 - 0.60%',
      siliconMax: 0.05,
      phosphorusMax: 0.040,
      sulfurMax: 0.040,
      carbonEquivalentMax: 0.30
    },
    mechanicalProperties: {
      yieldStrengthMpa: {
        min: 240,
        typical: 260,
        description: '240 - 280 MPa yield strength for commercial and lock-forming grades'
      },
      tensileStrengthMpa: {
        min: 350,
        typical: 380,
        description: '350 - 450 MPa ultimate tensile strength'
      },
      elongationPercent: {
        min: 20,
        typical: 25,
        gaugeLength: 'Lo = 50mm / Lo = 80mm',
        ductilityRating: 'High'
      },
      hardness: {
        scale: 'HRB',
        typicalValue: '55 - 68 HRB'
      },
      modulusOfElasticityGpa: 200,
      densityKgM3: 7850,
      poissonsRatio: 0.29,
      shearModulusGpa: 77,
      minBendRadius: {
        punchRadius: '1.0t (lock-forming quality), 1.5t (standard GP)',
        notes: 'Coating adherence: zinc layer must not flake or peel during 180° bend around mandrel equal to sheet thickness (1t).'
      }
    },
    standards: {
      bis: {
        standardNumber: 'IS 277:2018',
        gradeDesignation: 'GP (General Purpose), LF (Lock Forming), G120 / G180 / G275 (Coating mass gsm)',
        title: 'Galvanized Steel Sheets (Plain and Corrugated) - Specification',
        designCode: 'IS 801:1975 & IS 277 Table 4 for zinc coating mass class'
      },
      aisc: {
        specificationRef: 'AISC 360 / AISI S100 North American Cold-Formed Steel Specification',
        manualClassification: 'Zinc-Coated (Galvanized) Sheet Metal',
        nominalYieldKsi: 33,
        nominalTensileKsi: 48
      },
      aws: {
        codeRef: 'AWS D1.3 / D1.3M Structural Welding Code - Sheet Steel',
        prequalifiedGroup: 'Coated Sheet Steel Welding',
        recommendedElectrodeSMAW: 'AWS A5.1 E6010 / E6011 (cellulose for burning through thin zinc) or E7018 with zinc ground off',
        recommendedWireGMAW: 'AWS A5.18 ER70S-6 or flux-cored E71T-GS / E71T-11 (self-shielded for galvanized)',
        preheatInterpassGuideline: 'CRITICAL SAFETY: Fume extraction MANDATORY. Welding zinc releases zinc oxide fumes causing metal fume fever ("galvie flu"). Grind off zinc 25mm from weld seam.'
      },
      astm: {
        specNumber: 'ASTM A653 / A653M',
        grade: 'CS Type B / G60 (180 gsm) / G90 (275 gsm)'
      },
      enIso: {
        standardNumber: 'EN 10346',
        grade: 'DX51D+Z (Commercial) / S250GD+Z (Structural)',
        isoCorrosionClass: 'ISO 12944 C2 (G120) to C3 (G275); sacrificial zinc protection protects cut edges'
      }
    },
    fabrication: {
      weldability: 'Good',
      cuttingMethods: ['CNC Fiber Laser (High-pressure N2 assist to prevent zinc dross)', 'CNC Punching / Nibbling', 'Mechanical Shearing'],
      formingCharacteristics: 'Excellent roll forming and Pittsburgh lock-seam forming for ductwork without zinc coating peeling.',
      corrosionProtectionRequired: 'Inherently protected by sacrificial zinc coating (galvanic action). Cut edges up to 1.5mm thick are self-protected by zinc ion migration.',
      recommendedFinishes: ['Bare Galvanized (Natural Spangle)', 'Zinc-Rich Cold Galvanizing Spray (95% zinc on weld seams)', 'Vinyl / Polyurethane Paint over Etch Primer (IS 2074)'],
      galvanizingSuitability: 'Pre-Galvanized'
    },
    primaryApplications: [
      'HVAC air distribution ductwork (rectangular, spiral round, and oval ducts per SMACNA / IS 655)',
      'Perforated cable trays, ladder racks, and electrical trunking channels',
      'Drywall steel stud and track framing (IS 277 G120), ceiling suspended grids',
      'PEB secondary cold-formed members (light purlins, eave struts, downspouts, flashing gutters)'
    ],
    engineeringFailureModes: [
      'White Rust (Wet storage stain: basic zinc carbonate / hydroxide) when stored tightly stacked in humid or damp conditions without air circulation',
      'Zinc embrittlement and weld porosity (wormholes) if welded without stripping zinc coating',
      'Galvanic corrosion when fastened directly against stainless steel or copper in wet environments without neoprene / EPDM isolating washers'
    ],
    qualityAssuranceChecks: [
      'Zinc coating thickness / mass test using magnetic elcometer or gravimetric stripping test (IS 6745 / IS 277)',
      'Adhesion bend test: 180° bend test around 1t pin; zero flaking of zinc under 10x magnification',
      'Inspection for absence of black spots, dross lumps, or white rust formation'
    ]
  },

  // =========================================================================
  // 6. STAINLESS STEEL SHEET & PLATE - SS 304 / 304L - IS 6911 / ASTM A240
  // =========================================================================
  {
    id: 'stainless-ss304-is6911',
    name: 'Austenitic Stainless Steel (SS 304 / 304L / 1.4301)',
    category: 'Stainless Steel Sheet & Plate',
    shortCode: 'SS-304',
    typicalThicknessRangeMm: '0.60mm - 25.0mm+',
    gaugeRange: '24 Gauge (0.6mm) up to heavy 25mm structural flange plate',
    surfaceCondition: 'Available in 2B (cold-rolled, smooth reflective matte), No. 4 / Hairline (directional 180-240 grit architectural brush), and No. 8 Mirror (super-buffed); protected by laser-guard PVC film',
    chemicalCompositionTypical: {
      carbonMax: 0.03, // 304L max 0.03% to prevent sensitization; standard 304 max 0.07%
      manganeseRange: '1.50 - 2.00%',
      siliconMax: 0.75,
      phosphorusMax: 0.045,
      sulfurMax: 0.030,
      chromiumRange: '18.0 - 20.0%',
      nickelRange: '8.0 - 10.5%'
    },
    mechanicalProperties: {
      yieldStrengthMpa: {
        min: 215,
        typical: 240,
        description: '215 MPa min (for 304) / 205 MPa min (for 304L) 0.2% proof stress; work-hardens rapidly under cold deformation'
      },
      tensileStrengthMpa: {
        min: 520,
        typical: 620,
        description: '520 - 720 MPa high ultimate tensile strength'
      },
      elongationPercent: {
        min: 45,
        typical: 55,
        gaugeLength: 'Lo = 50mm',
        ductilityRating: 'Exceptional'
      },
      hardness: {
        scale: 'HRB',
        typicalValue: '75 - 88 HRB (~160 - 180 BHN)'
      },
      modulusOfElasticityGpa: 193,
      densityKgM3: 7930,
      poissonsRatio: 0.29,
      shearModulusGpa: 75,
      minBendRadius: {
        punchRadius: '1.0t (up to 3mm), 1.5t to 2.0t (above 3mm)',
        notes: 'Cold forming requires 50% more machine tonnage than mild steel due to rapid austenitic work-hardening; springback is 2x to 3x higher than carbon steel.'
      }
    },
    standards: {
      bis: {
        standardNumber: 'IS 6911:2017',
        gradeDesignation: 'X04Cr19Ni9 (SS 304) / X02Cr19Ni10 (SS 304L)',
        title: 'Stainless Steel Plate, Sheet and Strip - Specification',
        designCode: 'AISC Design Guide 27 (Structural Stainless Steel) & SEI/ASCE 8-02'
      },
      aisc: {
        specificationRef: 'AISC Design Guide 27 / AISC 370-21 (Structural Stainless Steel)',
        manualClassification: 'Austenitic Stainless Steel (Non-Magnetic in Annealed State)',
        nominalYieldKsi: 30,
        nominalTensileKsi: 75
      },
      aws: {
        codeRef: 'AWS D1.6 / D1.6M Structural Welding Code - Stainless Steel',
        prequalifiedGroup: 'Austenitic Stainless Steel Base Metal Group',
        recommendedElectrodeSMAW: 'AWS A5.4 E308L-16 / E308L-17 (Low carbon to prevent carbide precipitation)',
        recommendedWireGMAW: 'AWS A5.9 ER308L (TIG/MIG with 98% Ar / 2% CO2 or 97.5% Ar / 2.5% CO2)',
        preheatInterpassGuideline: 'Preheat strictly forbidden. Maintain interpass temperature < 150°C to avoid chromium carbide precipitation and intergranular corrosion.'
      },
      astm: {
        specNumber: 'ASTM A240 / A240M & ASTM A666',
        grade: 'Type 304 / Type 304L (UNS S30400 / S30403)'
      },
      enIso: {
        standardNumber: 'EN 10088-2',
        grade: '1.4301 (X5CrNi18-10) / 1.4307 (X2CrNi18-9)',
        isoCorrosionClass: 'ISO 12944 C3 to C4 (Urban/Industrial atmospheric; not recommended for splash marine zones)'
      }
    },
    fabrication: {
      weldability: 'Excellent',
      cuttingMethods: ['CNC Fiber Laser with High-Pressure N2 (prevents oxidized edge)', 'Abrasive Waterjet', 'High-speed CNC Band Saw'],
      formingCharacteristics: 'High ductility enables deep spinning, pressing, and tight bending. Strict requirement: use polyurethane-padded tooling to prevent tool carbon-steel cross-contamination.',
      corrosionProtectionRequired: 'Forms spontaneous self-healing chromium-oxide (Cr2O3) passive layer. Post-weld chemical pickling and passivation (ASTM A380 / A967) mandatory to remove heat tint (temper colors).',
      recommendedFinishes: ['No. 4 Satin Hairline Brush', 'No. 8 Mirror Polish', 'Electropolished (Ra < 0.3 µm)', 'Bead Blasted Matte'],
      galvanizingSuitability: 'Not Applicable (Stainless)'
    },
    primaryApplications: [
      'Architectural luxury facade cladding, exterior curtain-wall trims, and elevator door skins',
      'Staircase railings, glass-supporting balustrades, handrail tubes, and canopies',
      'Commercial kitchen hoods, food preparation tables, and dairy / pharmaceutical equipment',
      'Cleanroom wall paneling, architectural column wraps, and sanitary plumbing fixtures'
    ],
    engineeringFailureModes: [
      'Pitting and crevice corrosion in stagnant chloride (salt/bleach) environments',
      'Intergranular corrosion (weld decay) along HAZ if non-low-carbon grade (304 vs 304L) is exposed to 450-850°C',
      'Bimetallic galvanic corrosion if carbon steel grinding dust deposits on stainless surfaces ("ferroxyl test failure")',
      'Stress corrosion cracking (SCC) at sustained tensile stresses in chloride environments > 60°C'
    ],
    qualityAssuranceChecks: [
      'Chemical analysis check: confirming Cr >= 18.0% and Ni >= 8.0%',
      'Ferroxyl chemical swab test (ASTM A380) to detect free iron surface contamination',
      'Pickling & passivation inspection: verify 100% removal of weld heat tint discoloration'
    ]
  },

  // =========================================================================
  // 7. MARINE-GRADE STAINLESS STEEL - SS 316 / 316L - IS 6911 / ASTM A240
  // =========================================================================
  {
    id: 'stainless-ss316-is6911',
    name: 'Marine-Grade Austenitic Stainless Steel (SS 316 / 316L / 1.4404)',
    category: 'Stainless Steel Sheet & Plate',
    shortCode: 'SS-316',
    typicalThicknessRangeMm: '0.80mm - 30.0mm+',
    gaugeRange: '22 Gauge (0.8mm) up to 30mm heavy marine plate',
    surfaceCondition: '2B cold-rolled or No. 4 architectural brush; enhanced with 2.0-2.5% Molybdenum for supreme chloride resistance',
    chemicalCompositionTypical: {
      carbonMax: 0.03, // 316L
      manganeseRange: '1.50 - 2.00%',
      siliconMax: 0.75,
      phosphorusMax: 0.045,
      sulfurMax: 0.030,
      chromiumRange: '16.5 - 18.5%',
      nickelRange: '10.0 - 13.0%',
      molybdenumRange: '2.0 - 2.5%'
    },
    mechanicalProperties: {
      yieldStrengthMpa: {
        min: 220,
        typical: 250,
        description: '220 MPa 0.2% proof stress (205 MPa for 316L)'
      },
      tensileStrengthMpa: {
        min: 530,
        typical: 600,
        description: '530 - 680 MPa tensile strength'
      },
      elongationPercent: {
        min: 40,
        typical: 50,
        gaugeLength: 'Lo = 50mm',
        ductilityRating: 'Exceptional'
      },
      hardness: {
        scale: 'HRB',
        typicalValue: '78 - 90 HRB (~165 - 190 BHN)'
      },
      modulusOfElasticityGpa: 193,
      densityKgM3: 8000,
      poissonsRatio: 0.29,
      shearModulusGpa: 75,
      minBendRadius: {
        punchRadius: '1.0t (t <= 3mm), 2.0t (t > 3mm)',
        notes: 'High work-hardening rate; ensure rigid clamping to avoid chatter during shearing or milling.'
      }
    },
    standards: {
      bis: {
        standardNumber: 'IS 6911:2017',
        gradeDesignation: 'X02Cr17Ni12Mo2 (SS 316L) / X04Cr17Ni12Mo2 (SS 316)',
        title: 'Stainless Steel Plate, Sheet and Strip - Specification',
        designCode: 'AISC Design Guide 27 / SEI/ASCE 8-02'
      },
      aisc: {
        specificationRef: 'AISC Design Guide 27 / AISC 370-21',
        manualClassification: 'Molybdenum-Alloyed Austenitic Stainless Steel',
        nominalYieldKsi: 30,
        nominalTensileKsi: 75
      },
      aws: {
        codeRef: 'AWS D1.6 / D1.6M Structural Welding Code - Stainless Steel',
        prequalifiedGroup: 'Austenitic Molybdenum Alloy Group',
        recommendedElectrodeSMAW: 'AWS A5.4 E316L-16 / E316L-17',
        recommendedWireGMAW: 'AWS A5.9 ER316L (TIG/MIG with 98% Ar / 2% CO2 or Ar/He mix)',
        preheatInterpassGuideline: 'No preheat. Max interpass 150°C. Shield root with 99.99% argon purge gas to prevent "sugaring" (severe back-side oxidation).'
      },
      astm: {
        specNumber: 'ASTM A240 / A240M',
        grade: 'Type 316 / Type 316L (UNS S31600 / S31603)'
      },
      enIso: {
        standardNumber: 'EN 10088-2',
        grade: '1.4401 (X5CrNiMo17-12-2) / 1.4404 (X2CrNiMo17-12-2)',
        isoCorrosionClass: 'ISO 12944 C5-M (Marine coastal atmospheric and splash zones)'
      }
    },
    fabrication: {
      weldability: 'Excellent',
      cuttingMethods: ['High-Pressure N2 CNC Fiber Laser', 'Abrasive Waterjet', 'Plasma with Argon-Hydrogen mix'],
      formingCharacteristics: 'Superb formability; withstands deep drawing and complex spinning.',
      corrosionProtectionRequired: 'Immune to normal atmospheric corrosion. Mandatory chemical passivation (ASTM A967 Citric or Nitric acid bath) post-welding.',
      recommendedFinishes: ['No. 4 Satin Brush', 'Electro-Polished', 'Bead Blasted'],
      galvanizingSuitability: 'Not Applicable (Stainless)'
    },
    primaryApplications: [
      'Coastal architecture, beachfront canopies, yacht railings, and marine promenades',
      'Swimming pool indoor structures, spa HVAC diffusers, and chemical handling ducts',
      'Pharmaceutical sterile process piping, bio-reactor vessels, and hospital cleanrooms',
      'Exterior signage and spider-glass curtain wall fittings in polluted coastal cities (Mumbai, Chennai, Goa)'
    ],
    engineeringFailureModes: [
      'Crevice corrosion beneath unsealed rubber gaskets or bolt heads in stagnant warm seawater',
      'Sugaring and root porosity if back-purging is omitted during TIG pipe/tube welding',
      'Contamination by ferrous tool contact causing superficial rust spots'
    ],
    qualityAssuranceChecks: [
      'Positive Material Identification (PMI) using XRF analyzer to verify Molybdenum 2.0-2.5%',
      'Borescope inspection of internal TIG welds to verify full root penetration and zero sugaring',
      'Passivation testing per ASTM A967 (Water immersion or copper sulfate test)'
    ]
  },

  // =========================================================================
  // 8. STRUCTURAL HOLLOW SECTIONS (SHS / RHS / CHS) - IS 4923 / ASTM A500
  // =========================================================================
  {
    id: 'hss-is4923-yst310',
    name: 'Structural Steel Hollow Sections (SHS / RHS / CHS) - IS 4923 YSt 310',
    category: 'Structural Hollow Sections (HSS / Pipe)',
    shortCode: 'HSS-YST310',
    typicalThicknessRangeMm: '2.0mm - 12.0mm',
    gaugeRange: 'Square 25x25mm up to 300x300mm; Rectangular up to 400x200mm',
    surfaceCondition: 'Hot-finished or cold-formed electric resistance welded (ERW); mill scale with protective transit rust-preventative varnish',
    chemicalCompositionTypical: {
      carbonMax: 0.20,
      manganeseRange: '0.50 - 1.30%',
      siliconMax: 0.35,
      phosphorusMax: 0.040,
      sulfurMax: 0.040,
      carbonEquivalentMax: 0.40
    },
    mechanicalProperties: {
      yieldStrengthMpa: {
        min: 310,
        typical: 330,
        description: '310 MPa minimum yield for YSt 310 grade (also available in YSt 210 and YSt 355)'
      },
      tensileStrengthMpa: {
        min: 450,
        typical: 480,
        description: '450 MPa minimum ultimate tensile strength'
      },
      elongationPercent: {
        min: 15,
        typical: 18,
        gaugeLength: 'Lo = 5.65√So',
        ductilityRating: 'Moderate'
      },
      hardness: {
        scale: 'HRB',
        typicalValue: '75 - 85 HRB'
      },
      modulusOfElasticityGpa: 205,
      densityKgM3: 7850,
      poissonsRatio: 0.30,
      shearModulusGpa: 78,
      minBendRadius: {
        punchRadius: '2.0t to 3.0t (corner radius built into tube)',
        notes: 'Outer corner radius is typically 2.0t to 3.0t per IS 4923 corner geometry standards.'
      }
    },
    standards: {
      bis: {
        standardNumber: 'IS 4923:2017 (Rectangular & Square) / IS 1161:2014 (Circular)',
        gradeDesignation: 'YSt 210, YSt 310, YSt 355',
        title: 'Hollow Steel Sections for Structural Use - Specification',
        designCode: 'IS 800:2007 (Chapter 10: Special Considerations for Hollow Section Connections)'
      },
      aisc: {
        specificationRef: 'AISC 360-22 Chapter K (Additional Requirements for HSS and Box-Member Connections)',
        manualClassification: 'Cold-Formed Welded Carbon Steel Hollow Structural Sections (HSS)',
        nominalYieldKsi: 46,
        nominalTensileKsi: 58
      },
      aws: {
        codeRef: 'AWS D1.1 / D1.1M Chapter 9 (Tubular Structures)',
        prequalifiedGroup: 'Tubular Connections (T-, Y-, K-joints)',
        recommendedElectrodeSMAW: 'AWS A5.1 E7018 / E7016 low hydrogen',
        recommendedWireGMAW: 'AWS A5.18 ER70S-6 (GMAW) or E71T-1M (Flux-Cored FCAW)',
        preheatInterpassGuideline: 'Preheat 50°C if wall thickness > 10mm or joint is heavily restrained.'
      },
      astm: {
        specNumber: 'ASTM A500 / A500M',
        grade: 'Grade B (Fy = 46 ksi) / Grade C (Fy = 50 ksi)'
      },
      enIso: {
        standardNumber: 'EN 10219 (Cold Formed) / EN 10210 (Hot Finished)',
        grade: 'S355J2H / S275J2H',
        isoCorrosionClass: 'Internal void must be hermetically sealed with end caps to prevent internal corrosion'
      }
    },
    fabrication: {
      weldability: 'Excellent',
      cuttingMethods: ['3D CNC Tube Laser with multi-axis beveling', 'Cold Circular Carbide Sawing', 'Band Saw'],
      formingCharacteristics: 'High torsional rigidity (polar moment of inertia 20-30x greater than equivalent open I-beams). Excellent column strength in both axes (rx = ry for SHS).',
      corrosionProtectionRequired: 'CRITICAL RULE: Both ends of hollow members MUST be fully seal-welded with cap plates. Unsealed tubes suffer condensation and hidden internal corrosion.',
      recommendedFinishes: ['Shop Primer + Polyurethane Topcoat', 'Hot-Dip Galvanized inside and out (requires vent and drain holes per IS 2629)'],
      galvanizingSuitability: 'Recommended (Hot-Dip IS 2629 / ASTM A123)'
    },
    primaryApplications: [
      'Architectural exposed structural steel (AESS) columns, tree columns, and canopy space trusses',
      'Sports stadium roof trusses, airport passenger terminal canopies, and toll plaza superstructures',
      'Industrial pipe racks, pedestrian foot over-bridges (FOB), and spiral staircase center posts',
      'Earthmoving vehicle chassis, telecommunication mast towers, and automated warehouse shelving'
    ],
    engineeringFailureModes: [
      'Punching shear and chord plastification at welded branch-to-chord connections (AISC Chapter K failure modes)',
      'Hidden internal corrosion due to missing or unsealed cap plates',
      'Corner cracking during hot-dip galvanizing if cold-formed corner strain was excessive'
    ],
    qualityAssuranceChecks: [
      'Weld seam ultrasonic testing (UT) or eddy current testing at mill per IS 4923',
      'Corner radius and wall thickness tolerance measurement (IS 4923 Clause 8)',
      'Pressure air-leak test or visual inspection of seal-welded end caps to verify 100% airtight closure'
    ]
  }
];

// =========================================================================
// AI SERVICE CONSUMPTION UTILITIES & DATA EXTRACTORS
// =========================================================================

/**
 * Returns a comprehensive, structured text context block formatted specifically
 * for Gemini AI system prompts, construction chatbots, or diagnostic analyzers.
 */
export function getMetalKnowledgeContextForAI(filterTopic?: string): string {
  const norm = (filterTopic || '').toLowerCase();

  const relevant = METAL_KNOWLEDGE_DATABASE.filter(m => {
    if (!norm) return true;
    return (
      m.name.toLowerCase().includes(norm) ||
      m.category.toLowerCase().includes(norm) ||
      m.shortCode.toLowerCase().includes(norm) ||
      m.standards.bis.standardNumber.toLowerCase().includes(norm) ||
      m.standards.aisc.specificationRef.toLowerCase().includes(norm) ||
      m.standards.aws.codeRef.toLowerCase().includes(norm)
    );
  });

  const datasetToFormat = relevant.length > 0 ? relevant : METAL_KNOWLEDGE_DATABASE;

  return `=== AUTHORITATIVE MILD STEEL & SHEET METAL ENGINEERING KNOWLEDGE BASE ===
Scope: Governed by Indian Standards (BIS), AISC 360, AWS D1.1/D1.3/D1.6, and ASTM.

${datasetToFormat
  .map(m => {
    return `[MATERIAL: ${m.name}] (Code: ${m.shortCode})
- Category: ${m.category} | Thickness Range: ${m.typicalThicknessRangeMm} (${m.gaugeRange})
- Mechanical Properties:
  * Yield Strength: ${m.mechanicalProperties.yieldStrengthMpa.min} MPa (Typical: ${m.mechanicalProperties.yieldStrengthMpa.typical} MPa) - ${m.mechanicalProperties.yieldStrengthMpa.description}
  * Tensile Strength: ${m.mechanicalProperties.tensileStrengthMpa.min} MPa (Typical: ${m.mechanicalProperties.tensileStrengthMpa.typical} MPa)
  * Ductility (Elongation): ${m.mechanicalProperties.elongationPercent.min}% min (Typical: ${m.mechanicalProperties.elongationPercent.typical}%) [Rating: ${m.mechanicalProperties.elongationPercent.ductilityRating}]
  * Hardness: ${m.mechanicalProperties.hardness.typicalValue}
  * Young's Modulus: ${m.mechanicalProperties.modulusOfElasticityGpa} GPa | Density: ${m.mechanicalProperties.densityKgM3} kg/m³ | Poisson's: ${m.mechanicalProperties.poissonsRatio}
  * Min Bend Radius: ${m.mechanicalProperties.minBendRadius.punchRadius} (${m.mechanicalProperties.minBendRadius.notes})
- Standards Mapping:
  * BIS (India): ${m.standards.bis.standardNumber} (${m.standards.bis.gradeDesignation}) - Design Code: ${m.standards.bis.designCode}
  * AISC (USA): ${m.standards.aisc.specificationRef} (Fy = ${m.standards.aisc.nominalYieldKsi} ksi, Fu = ${m.standards.aisc.nominalTensileKsi} ksi)
  * AWS (Welding): ${m.standards.aws.codeRef} [Prequalified: ${m.standards.aws.prequalifiedGroup}]
    - Recommended SMAW: ${m.standards.aws.recommendedElectrodeSMAW}
    - Recommended GMAW/MIG: ${m.standards.aws.recommendedWireGMAW}
    - Preheat & Procedure: ${m.standards.aws.preheatInterpassGuideline}
  * ASTM Equivalent: ${m.standards.astm.specNumber} ${m.standards.astm.grade}
  * EN / ISO Equivalent: ${m.standards.enIso.standardNumber} (${m.standards.enIso.grade}) [${m.standards.enIso.isoCorrosionClass || ''}]
- Fabrication & Protection:
  * Weldability: ${m.fabrication.weldability}
  * Forming: ${m.fabrication.formingCharacteristics}
  * Corrosion Protection: ${m.fabrication.corrosionProtectionRequired}
  * Hot-Dip Galvanizing: ${m.fabrication.galvanizingSuitability}
- Applications: ${m.primaryApplications.slice(0, 3).join('; ')}
- Critical Engineering Failure Modes: ${m.engineeringFailureModes.join('; ')}
- Quality Assurance / Testing: ${m.qualityAssuranceChecks.join('; ')}
`;
  })
  .join('\n------------------------------------------------------------\n')}
=== END OF KNOWLEDGE BASE ===`;
}

/**
 * Look up a metal record by ID
 */
export function findMetalById(id: string): MetalKnowledgeRecord | undefined {
  return METAL_KNOWLEDGE_DATABASE.find(m => m.id === id || m.shortCode.toLowerCase() === id.toLowerCase());
}

/**
 * Filter metal records by category
 */
export function findMetalsByCategory(category: MetalKnowledgeRecord['category']): MetalKnowledgeRecord[] {
  return METAL_KNOWLEDGE_DATABASE.filter(m => m.category === category);
}

/**
 * Find metal records matching an Indian or International standard query (e.g. "IS 2062", "AWS D1.1", "AISC 360", "IS 513")
 */
export function lookupMetalByStandard(query: string): MetalKnowledgeRecord[] {
  const q = query.toLowerCase().trim();
  return METAL_KNOWLEDGE_DATABASE.filter(m => {
    return (
      m.standards.bis.standardNumber.toLowerCase().includes(q) ||
      m.standards.bis.gradeDesignation.toLowerCase().includes(q) ||
      m.standards.bis.designCode.toLowerCase().includes(q) ||
      m.standards.aisc.specificationRef.toLowerCase().includes(q) ||
      m.standards.aws.codeRef.toLowerCase().includes(q) ||
      m.standards.astm.specNumber.toLowerCase().includes(q) ||
      m.standards.enIso.standardNumber.toLowerCase().includes(q) ||
      m.standards.enIso.grade.toLowerCase().includes(q)
    );
  });
}

/**
 * Summary matrix comparing mechanical properties across all metal grades
 */
export function getMechanicalPropertiesComparison() {
  return METAL_KNOWLEDGE_DATABASE.map(m => ({
    id: m.id,
    name: m.name,
    category: m.category,
    yieldMpa: m.mechanicalProperties.yieldStrengthMpa.min,
    tensileMpa: m.mechanicalProperties.tensileStrengthMpa.min,
    elongationPct: m.mechanicalProperties.elongationPercent.min,
    ductility: m.mechanicalProperties.elongationPercent.ductilityRating,
    hardness: m.mechanicalProperties.hardness.typicalValue,
    density: m.mechanicalProperties.densityKgM3,
    bisStandard: m.standards.bis.standardNumber,
    aiscEquivalent: m.standards.aisc.specificationRef,
    awsCode: m.standards.aws.codeRef
  }));
}

/**
 * Standard Mapping lookup table for quick reference in engineering audits
 */
export function getStandardsMappingTable() {
  return METAL_KNOWLEDGE_DATABASE.map(m => ({
    materialId: m.id,
    materialName: m.name,
    bisStandard: `${m.standards.bis.standardNumber} (${m.standards.bis.gradeDesignation})`,
    bisDesignCode: m.standards.bis.designCode,
    aiscRef: m.standards.aisc.specificationRef,
    awsCode: m.standards.aws.codeRef,
    astmEquivalent: `${m.standards.astm.specNumber} ${m.standards.astm.grade}`,
    enEquivalent: `${m.standards.enIso.standardNumber} ${m.standards.enIso.grade}`
  }));
}
