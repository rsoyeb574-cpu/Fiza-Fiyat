export interface EngineeringStandardRecord {
  id: string;
  code: string;
  title: string;
  organization: 'BIS / Indian Standards' | 'NBC India' | 'AISC' | 'AWS' | 'ACI' | 'ASCE' | 'ISO' | 'ASTM' | 'Eurocodes' | 'NFPA';
  scope: string;
  keyClausesOrPrinciples: { clause?: string; topic: string; summary: string }[];
  primaryDiscipline: 'Structural RCC' | 'Structural Steel' | 'Seismic' | 'Architecture' | 'Fire Safety' | 'BIM & Information' | 'Materials' | 'Loading';
  whenToConsult: string;
}

export const ENGINEERING_STANDARDS_DATABASE: EngineeringStandardRecord[] = [
  // BIS / NBC
  {
    id: 'is-456-2000',
    code: 'IS 456:2000',
    title: 'Plain and Reinforced Concrete - Code of Practice',
    organization: 'BIS / Indian Standards',
    scope: 'General structural use of plain and reinforced concrete in buildings, foundations, and civil infrastructure across India.',
    primaryDiscipline: 'Structural RCC',
    whenToConsult: 'Designing beams, columns, slabs, footings, mix designs, concrete cover, and limit state design checks.',
    keyClausesOrPrinciples: [
      { clause: 'Table 5', topic: 'Minimum Cement & Max W/C Ratio', summary: 'Defines minimum cement content, max water-cement ratio, and minimum concrete grade across Mild, Moderate, Severe, Very Severe, and Extreme environmental exposures.' },
      { clause: 'Clause 26.4', topic: 'Nominal Concrete Cover', summary: 'Prescribes minimum clear cover to reinforcement: Footings 50mm, Columns 40mm, Beams 25mm, Slabs 15-20mm.' },
      { clause: 'Clause 26.5.3', topic: 'Column Longitudinal Rebar Limits', summary: 'Minimum longitudinal reinforcement is 0.8% of gross cross-sectional area; maximum is 6.0% (practically limited to 4.0% to avoid congestion at lap zones).' },
      { clause: 'Clause 23.2', topic: 'Deflection Control Spans', summary: 'Basic span-to-effective-depth ratios: Cantilever = 7, Simply Supported = 20, Continuous = 26.' }
    ]
  },
  {
    id: 'is-13920-2016',
    code: 'IS 13920:2016',
    title: 'Ductile Design and Detailing of Reinforced Concrete Structures Subjected to Seismic Forces',
    organization: 'BIS / Indian Standards',
    scope: 'Mandatory seismic ductile detailing provisions for reinforced concrete buildings located in Seismic Zones III, IV, and V.',
    primaryDiscipline: 'Seismic',
    whenToConsult: 'Detailing column confining hoops, beam stirrups, beam-column joints, and shear wall boundary elements in earthquake zones.',
    keyClausesOrPrinciples: [
      { clause: 'Clause 6.2', topic: 'Beam Longitudinal Steel Ratios', summary: 'Minimum tension steel ratio rho_min = 0.24 * sqrt(fck) / fy. Maximum steel ratio rho_max = 2.5%.' },
      { clause: 'Clause 7.6', topic: 'Column Special Confining Reinforcement', summary: 'Mandates closely spaced 135° hook hoops with 10d extension in potential plastic hinge zones at column ends (length >= 450mm or larger column dimension).' },
      { clause: 'Clause 8.1', topic: 'Beam-Column Joint Confinement', summary: 'Confining hoops must continue through the beam-column joint core even where beams frame into the column.' },
      { clause: 'Clause 10', topic: 'Special Structural Shear Walls', summary: 'Requires boundary elements when maximum extreme fiber stress under design earthquake loads exceeds 0.2 fck.' }
    ]
  },
  {
    id: 'is-800-2007',
    code: 'IS 800:2007',
    title: 'General Construction in Steel - Code of Practice (Limit State Design)',
    organization: 'BIS / Indian Standards',
    scope: 'Design, fabrication, and erection of structural steelwork utilizing Limit State Design philosophy.',
    primaryDiscipline: 'Structural Steel',
    whenToConsult: 'Sizing structural steel members, trusses, portals, gantry girders, bolted HSFG and welded joints.',
    keyClausesOrPrinciples: [
      { clause: 'Section 5', topic: 'Limit State Design Requirements', summary: 'Governs Partial safety factors for materials: gamma_m0 = 1.10 for yield, gamma_m1 = 1.25 for ultimate, gamma_mb = 1.25 for shop bolts.' },
      { clause: 'Section 7', topic: 'Design of Compression Members', summary: 'Column buckling curves a, b, c, d based on cross-section geometry, residual stress distribution, and non-dimensional slenderness ratio lambda.' },
      { clause: 'Section 8', topic: 'Design of Members Subjected to Bending', summary: 'Lateral Torsional Buckling (LTB) capacity calculation and web local buckling/crippling checks.' },
      { clause: 'Section 10', topic: 'Connections', summary: 'Minimum bolt pitch (2.5d), minimum edge distance (1.5d for rolled, 1.7d for sheared edges), and fillet weld design.' }
    ]
  },
  {
    id: 'is-1893-2016',
    code: 'IS 1893 (Part 1):2016',
    title: 'Criteria for Earthquake Resistant Design of Structures - General Provisions and Buildings',
    organization: 'BIS / Indian Standards',
    scope: 'Seismic zoning, design lateral forces, dynamic analysis, and building irregularity limitations.',
    primaryDiscipline: 'Seismic',
    whenToConsult: 'Computing seismic design base shear (Vb), response spectrum analysis, story drift limits, and structural irregularities.',
    keyClausesOrPrinciples: [
      { clause: 'Clause 6.4.2', topic: 'Design Horizontal Seismic Coefficient (Ah)', summary: 'Ah = (Z/2) * (I/R) * (Sa/g). Z is seismic zone factor (Zone II=0.10, III=0.16, IV=0.24, V=0.36).' },
      { clause: 'Clause 7.1', topic: 'Structural Irregularities', summary: 'Categorizes Plan Irregularities (Torsional, Re-entrant corners) and Vertical Irregularities (Stiffness soft story, Mass irregularity, Strength weak story).' },
      { clause: 'Clause 7.11.1', topic: 'Storey Drift Limitation', summary: 'Story drift under design lateral force must not exceed 0.004 times the story height (0.4%).' }
    ]
  },
  {
    id: 'nbc-2016',
    code: 'National Building Code of India (NBC 2016)',
    title: 'National Building Code of India 2016',
    organization: 'NBC India',
    scope: 'National regulatory framework for architectural design, spatial norms, fire and life safety, structural design, and building services.',
    primaryDiscipline: 'Architecture',
    whenToConsult: 'Room dimensions, ceiling heights, staircase widths, fire exits, occupant loads, setbacks, and ventilation ratios.',
    keyClausesOrPrinciples: [
      { clause: 'Part 3 Clause 4.2', topic: 'Habitable Room Norms', summary: 'Minimum carpet area for habitable room = 9.5 sq.m (with min width 2.4m); clear ceiling height >= 2.75m.' },
      { clause: 'Part 4 Fire Safety', topic: 'Means of Egress & Staircases', summary: 'Residential exit staircase min width = 1.0m (1.5m for commercial/educational); maximum riser height = 150mm (residential 190mm), min tread = 300mm (residential 250mm).' },
      { clause: 'Part 8 Building Services', topic: 'Ventilation & Daylighting', summary: 'Aggregate opening area of windows/ventilators must be at least 1/10th (10%) of the floor area in hot-dry climates.' }
    ]
  },

  // US & INTERNATIONAL STANDARDS
  {
    id: 'aisc-360-16',
    code: 'AISC 360-16 / AISC 341',
    title: 'Specification for Structural Steel Buildings & Seismic Provisions',
    organization: 'AISC',
    scope: 'American standard for design, fabrication, and erection of structural steel frame buildings.',
    primaryDiscipline: 'Structural Steel',
    whenToConsult: 'International steel projects, PEB buildings designed under US codes, moment frame and braced frame connections.',
    keyClausesOrPrinciples: [
      { clause: 'Chapter B & F', topic: 'Member Flexure & Local Buckling', summary: 'Classifies cross-sections into Compact, Noncompact, and Slender based on width-to-thickness ratios (b/t and h/tw).' },
      { clause: 'Chapter J', topic: 'Connections', summary: 'Design of bolted and welded connections, prying action in tensile tee-hangers, and block shear rupture.' }
    ]
  },
  {
    id: 'aws-d1-1',
    code: 'AWS D1.1 / D1.1M:2020',
    title: 'Structural Welding Code - Steel',
    organization: 'AWS',
    scope: 'Welding requirements for any type of welded structure made from carbon and low-alloy construction steels.',
    primaryDiscipline: 'Structural Steel',
    whenToConsult: 'Welding procedure specification (WPS), Welder qualification, non-destructive testing (NDT), weld defects evaluation.',
    keyClausesOrPrinciples: [
      { clause: 'Clause 5', topic: 'Prequalified WPS', summary: 'Specifies prequalified groove and fillet joint geometries, backing requirements, and root openings.' },
      { clause: 'Clause 8', topic: 'Visual & NDT Acceptance Criteria', summary: 'Limits allowable undercut (max 1mm for statically loaded, 0.25mm for cyclically loaded), porosity, and lack of fusion.' }
    ]
  },
  {
    id: 'aci-318-19',
    code: 'ACI 318-19',
    title: 'Building Code Requirements for Structural Concrete',
    organization: 'ACI',
    scope: 'Authoritative American structural concrete design standard widely adopted throughout the Americas, Middle East, and Asia.',
    primaryDiscipline: 'Structural RCC',
    whenToConsult: 'Designing concrete frames for international developers, seismic force-resisting systems (SFRS), shear strength calculation.',
    keyClausesOrPrinciples: [
      { clause: 'Chapter 18', topic: 'Earthquake-Resistant Structures', summary: 'Detailing rules for Special Moment Frames (SMF) and Special Structural Walls (SSW).' },
      { clause: 'Chapter 22', topic: 'Sectional Strength', summary: 'Nominal flexural, axial, and one-way and two-way punching shear capacity equations.' }
    ]
  },
  {
    id: 'iso-19650',
    code: 'ISO 19650-1 / ISO 19650-2:2018',
    title: 'Organization and digitization of information about buildings and civil engineering works, including BIM',
    organization: 'ISO',
    scope: 'Global international standard for managing information over the life cycle of a built asset using Building Information Modeling (BIM).',
    primaryDiscipline: 'BIM & Information',
    whenToConsult: 'Setting up Common Data Environments (CDE), BIM Execution Plans (BEP), Employer Information Requirements (EIR), and file naming standards.',
    keyClausesOrPrinciples: [
      { clause: 'CDE Concept', topic: 'Common Data Environment States', summary: 'Defines information container states: Work in Progress (WIP) -> Shared -> Published -> Archived.' },
      { clause: 'National Annex', topic: 'Information Container Naming Convention', summary: 'Mandatory field format: [Project]-[Originator]-[Volume/System]-[Level]-[Type]-[Role]-[Number].' }
    ]
  },
  {
    id: 'nfpa-101',
    code: 'NFPA 101 / NFPA 13',
    title: 'Life Safety Code & Standard for Installation of Sprinkler Systems',
    organization: 'NFPA',
    scope: 'Global benchmark for occupant safety, fire compartmentalization, emergency egress, and automatic fire suppression.',
    primaryDiscipline: 'Fire Safety',
    whenToConsult: 'Designing fire protection systems, commercial building staircases, emergency lighting, travel distance limits.',
    keyClausesOrPrinciples: [
      { clause: 'Chapter 7', topic: 'Means of Egress', summary: 'Maximum travel distance to an exit (typically 60m with automatic sprinklers, 45m without), exit capacity factors, and illuminated signage.' },
      { clause: 'NFPA 13', topic: 'Sprinkler Coverage Spacing', summary: 'Standard spray upright and pendent sprinklers: maximum protection area per head = 12.1 sq.m (Light Hazard) to 9.3 sq.m (Ordinary Hazard).' }
    ]
  }
];
