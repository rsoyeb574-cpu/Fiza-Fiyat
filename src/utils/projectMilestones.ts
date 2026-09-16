import { Project, ProjectMilestoneProgress, ProjectMilestonePhase } from '../types';

/**
 * Returns or dynamically computes a comprehensive, realistic milestone and phase progress breakdown
 * tailored to the architectural, structural, and BIM parameters of the project.
 */
export function getProjectMilestones(project: Project): ProjectMilestoneProgress {
  if (project.milestones && project.milestones.phases?.length > 0) {
    return project.milestones;
  }

  const isInterior = project.categoryId === 'cat-interior' || project.title.toLowerCase().includes('interior') || project.title.toLowerCase().includes('penthouse');
  const isHighRise = (project.floors && parseInt(project.floors, 10) > 10) || project.title.toLowerCase().includes('tower') || project.title.toLowerCase().includes('commercial');
  const isLandscape = project.categoryId === 'cat-landscape' || project.title.toLowerCase().includes('park') || project.title.toLowerCase().includes('urban');

  let phases: ProjectMilestonePhase[] = [];

  if (isInterior) {
    phases = [
      {
        id: 'phase-int-1',
        phaseNumber: 1,
        shortCode: 'PH-01',
        name: 'Concept & Spatial Programming',
        category: 'Concept',
        completionPercentage: 100,
        status: 'completed',
        startDate: '2025-10-01',
        targetEndDate: '2025-11-15',
        actualEndDate: '2025-11-12',
        leadOwner: 'Elena Rostova (Lead Interior Architect)',
        budgetAllocated: '$28,000',
        criticalPath: true,
        riskLevel: 'low',
        description: 'Client briefing, 3D spatial moodboards, initial spatial layout schemes, and acoustic baseline testing.',
        keyDeliverables: [
          { id: 'del-int-1-1', title: 'Preliminary Spatial Layout Schemes & Moodboards', completed: true, deliverableType: 'Drawing' },
          { id: 'del-int-1-2', title: 'Client Aesthetic Direction & Colorway Sign-off', completed: true, deliverableType: 'Report' },
          { id: 'del-int-1-3', title: 'Initial Acoustic & Lighting Zoning Analysis', completed: true, deliverableType: 'Report' }
        ]
      },
      {
        id: 'phase-int-2',
        phaseNumber: 2,
        shortCode: 'PH-02',
        name: 'Schematic Design & Material Selection',
        category: 'Schematic',
        completionPercentage: 100,
        status: 'completed',
        startDate: '2025-11-16',
        targetEndDate: '2026-01-10',
        actualEndDate: '2026-01-08',
        leadOwner: 'Elena Rostova (Lead Interior Architect)',
        budgetAllocated: '$45,000',
        criticalPath: true,
        riskLevel: 'low',
        description: 'Material board fabrication, physical finish samples, bespoke joinery prototypes, and lighting fixtures schedule.',
        keyDeliverables: [
          { id: 'del-int-2-1', title: 'Physical Stone, Wood & Textile Sample Board', completed: true, deliverableType: 'Specification' },
          { id: 'del-int-2-2', title: 'Full 3D Photorealistic Renderings Package', completed: true, deliverableType: 'BIM Model' },
          { id: 'del-int-2-3', title: 'Preliminary Millwork Detail Drawings', completed: true, deliverableType: 'Drawing' }
        ]
      },
      {
        id: 'phase-int-3',
        phaseNumber: 3,
        shortCode: 'PH-03',
        name: 'Detailed Millwork & MEP Integration',
        category: 'Detailed Engineering',
        completionPercentage: 85,
        status: 'in_progress',
        startDate: '2026-01-11',
        targetEndDate: '2026-03-20',
        leadOwner: 'Tariq Al-Mansoor (BIM & MEP Lead)',
        budgetAllocated: '$62,000',
        criticalPath: true,
        riskLevel: 'medium',
        description: 'Bespoke cabinetry shop drawings, concealed HVAC diffuser coordination, smart home automation, and circuit layouts.',
        keyDeliverables: [
          { id: 'del-int-3-1', title: 'Cabinetry & Joinery Fabrication Shop Drawings', completed: true, deliverableType: 'Drawing' },
          { id: 'del-int-3-2', title: 'Lutron Smart Lighting & HVAC Integration Plan', completed: true, deliverableType: 'BIM Model' },
          { id: 'del-int-3-3', title: 'Plumbing & Concealed Wet Area Waterproofing Specs', completed: false, deliverableType: 'Specification' }
        ]
      },
      {
        id: 'phase-int-4',
        phaseNumber: 4,
        shortCode: 'PH-04',
        name: 'Procurement & Artisan Fabrication',
        category: 'Procurement',
        completionPercentage: 50,
        status: 'in_progress',
        startDate: '2026-02-15',
        targetEndDate: '2026-05-10',
        leadOwner: 'Marcus Vance (Procurement Specialist)',
        budgetAllocated: '$180,000',
        criticalPath: false,
        riskLevel: 'medium',
        description: 'Import of custom honed marble slabs, hand-finished wall paneling, Italian designer sanitaryware, and luminaire orders.',
        keyDeliverables: [
          { id: 'del-int-4-1', title: 'Marble Slab Lot Inspection & Quarantine Sign-off', completed: true, deliverableType: 'Site Inspection' },
          { id: 'del-int-4-2', title: 'Custom Yakisugi & Veneer Factory Acceptance Test', completed: false, deliverableType: 'Report' },
          { id: 'del-int-4-3', title: 'Architectural Hardware & Fixture Delivery Logs', completed: false, deliverableType: 'Report' }
        ]
      },
      {
        id: 'phase-int-5',
        phaseNumber: 5,
        shortCode: 'PH-05',
        name: 'Site Installation & Joinery Erection',
        category: 'Execution',
        completionPercentage: 20,
        status: 'in_progress',
        startDate: '2026-04-01',
        targetEndDate: '2026-06-30',
        leadOwner: 'Tariq Al-Mansoor (Site Superintendent)',
        budgetAllocated: '$140,000',
        criticalPath: true,
        riskLevel: 'high',
        description: 'On-site installation of flooring, acoustic partitions, custom ceiling baffles, stone cladding, and electrical trim.',
        keyDeliverables: [
          { id: 'del-int-5-1', title: 'Subfloor Leveling & Acoustic Underlayment Sign-off', completed: true, deliverableType: 'Site Inspection' },
          { id: 'del-int-5-2', title: 'Custom Floating Ceilings & Lighting Trough Erection', completed: false, deliverableType: 'Site Inspection' },
          { id: 'del-int-5-3', title: 'Feature Wall Marble Cladding & Mitred Joint Verification', completed: false, deliverableType: 'Site Inspection' }
        ]
      },
      {
        id: 'phase-int-6',
        phaseNumber: 6,
        shortCode: 'PH-06',
        name: 'Commissioning, Punch List & Handover',
        category: 'Handover',
        completionPercentage: 0,
        status: 'upcoming',
        startDate: '2026-07-01',
        targetEndDate: '2026-08-15',
        leadOwner: 'Fiza Hayat (Principal Architect)',
        budgetAllocated: '$25,000',
        criticalPath: true,
        riskLevel: 'low',
        description: 'Final lighting scene programming, HVAC balancing, white-glove punch list resolution, and client key ceremony.',
        keyDeliverables: [
          { id: 'del-int-6-1', title: 'Smart Home Automation & Lighting Scene Calibration', completed: false, deliverableType: 'Report' },
          { id: 'del-int-6-2', title: 'Architectural Zero-Defect Punch List Sign-off', completed: false, deliverableType: 'Site Inspection' },
          { id: 'del-int-6-3', title: 'As-Built Documentation & Warranty Dossier', completed: false, deliverableType: 'Specification' }
        ]
      }
    ];
  } else if (isHighRise) {
    phases = [
      {
        id: 'phase-hr-1',
        phaseNumber: 1,
        shortCode: 'PH-01',
        name: 'Feasibility, Geotechnical & Urban Zoning',
        category: 'Concept',
        completionPercentage: 100,
        status: 'completed',
        startDate: '2025-06-01',
        targetEndDate: '2025-08-30',
        actualEndDate: '2025-08-25',
        leadOwner: 'Fiza Hayat (Design Director)',
        budgetAllocated: '$95,000',
        criticalPath: true,
        riskLevel: 'low',
        description: 'Deep borehole geotechnical drilling, wind tunnel preliminary study, FAR optimization, and municipal master zoning.',
        keyDeliverables: [
          { id: 'del-hr-1-1', title: 'Deep Subsurface Geotechnical Soil Mechanics Report', completed: true, deliverableType: 'Report' },
          { id: 'del-hr-1-2', title: 'Boundary Wind Tunnel Simulation & Aeroelastic Assessment', completed: true, deliverableType: 'Report' },
          { id: 'del-hr-1-3', title: 'Urban Master Planning & Floor Area Ratio (FAR) Submission', completed: true, deliverableType: 'Permit' }
        ]
      },
      {
        id: 'phase-hr-2',
        phaseNumber: 2,
        shortCode: 'PH-02',
        name: 'Schematic Architecture & Core Optimization',
        category: 'Schematic',
        completionPercentage: 100,
        status: 'completed',
        startDate: '2025-09-01',
        targetEndDate: '2025-11-30',
        actualEndDate: '2025-11-28',
        leadOwner: 'Fiza Hayat (Design Director)',
        budgetAllocated: '$160,000',
        criticalPath: true,
        riskLevel: 'low',
        description: 'High-speed elevator core layout, structural outrigger concept, floor plate net-to-gross ratio, and iconic façade massing.',
        keyDeliverables: [
          { id: 'del-hr-2-1', title: 'Vertical Transportation & Elevator Peak Traffic Analysis', completed: true, deliverableType: 'Report' },
          { id: 'del-hr-2-2', title: 'Schematic Architectural Drawing Package (A01 - A40)', completed: true, deliverableType: 'Drawing' },
          { id: 'del-hr-2-3', title: 'Façade Parametric Solar Shading & Glass Study', completed: true, deliverableType: 'BIM Model' }
        ]
      },
      {
        id: 'phase-hr-3',
        phaseNumber: 3,
        shortCode: 'PH-03',
        name: 'Structural Engineering & LOD 350 BIM Model',
        category: 'Detailed Engineering',
        completionPercentage: 92,
        status: 'in_progress',
        startDate: '2025-12-01',
        targetEndDate: '2026-03-31',
        leadOwner: 'Tariq Al-Mansoor (Chief BIM Director)',
        budgetAllocated: '$240,000',
        criticalPath: true,
        riskLevel: 'medium',
        description: 'ETABS non-linear seismic simulation, reinforced concrete shear wall detailing, post-tensioned floor slabs, and MEP clash detection.',
        keyDeliverables: [
          { id: 'del-hr-3-1', title: 'Complete ETABS Seismic & Lateral Wind Load Calculation Dossier', completed: true, deliverableType: 'Report' },
          { id: 'del-hr-3-2', title: 'Central Reinforced Concrete Core Wall Shop Drawings', completed: true, deliverableType: 'Drawing' },
          { id: 'del-hr-3-3', title: 'Multi-Discipline LOD 350 Revit Federated Model & Clash Matrix', completed: true, deliverableType: 'BIM Model' },
          { id: 'del-hr-3-4', title: 'Outrigger Truss & Composite Column Connection Details', completed: false, deliverableType: 'Drawing' }
        ]
      },
      {
        id: 'phase-hr-4',
        phaseNumber: 4,
        shortCode: 'PH-04',
        name: 'Statutory Permitting & Environmental Clearance',
        category: 'Statutory Approvals',
        completionPercentage: 80,
        status: 'in_progress',
        startDate: '2026-01-15',
        targetEndDate: '2026-05-15',
        leadOwner: 'Amira Patel (Regulatory Compliance Lead)',
        budgetAllocated: '$75,000',
        criticalPath: true,
        riskLevel: 'high',
        description: 'Civil Defense fire and life safety approval, LEED Gold / Platinum precertification, and city building envelope permit issuance.',
        keyDeliverables: [
          { id: 'del-hr-4-1', title: 'Municipal Fire & Life Safety Egress Master Plan Sign-off', completed: true, deliverableType: 'Permit' },
          { id: 'del-hr-4-2', title: 'LEED Platinum Energy & Water Model Certification Dossier', completed: true, deliverableType: 'Report' },
          { id: 'del-hr-4-3', title: 'Full Superstructure Building Permit Issuance', completed: false, deliverableType: 'Permit' }
        ]
      },
      {
        id: 'phase-hr-5',
        phaseNumber: 5,
        shortCode: 'PH-05',
        name: 'Curtain Wall & Façade Engineering Package',
        category: 'Detailed Engineering',
        completionPercentage: 65,
        status: 'in_progress',
        startDate: '2026-02-01',
        targetEndDate: '2026-06-30',
        leadOwner: 'Marcus Vance (Façade Specialist)',
        budgetAllocated: '$190,000',
        criticalPath: false,
        riskLevel: 'medium',
        description: 'Unitized double skin glass façade engineering, wind-driven rain barrier testing, thermal break profiles, and building maintenance unit (BMU) tracks.',
        keyDeliverables: [
          { id: 'del-hr-5-1', title: 'Unitized Curtain Wall Extrusion & Bracket Engineering Calculations', completed: true, deliverableType: 'Drawing' },
          { id: 'del-hr-5-2', title: 'AAMA Façade Air, Water Infiltration & Dynamic Wind Mock-up Test', completed: true, deliverableType: 'Site Inspection' },
          { id: 'del-hr-5-3', title: 'BMU Roof Rig & Façade Access Rail Shop Drawings', completed: false, deliverableType: 'Drawing' }
        ]
      },
      {
        id: 'phase-hr-6',
        phaseNumber: 6,
        shortCode: 'PH-06',
        name: 'Deep Piling & Substructure Construction',
        category: 'Execution',
        completionPercentage: 45,
        status: 'in_progress',
        startDate: '2026-03-01',
        targetEndDate: '2026-09-30',
        leadOwner: 'Tariq Al-Mansoor (Lead Site Structural)',
        budgetAllocated: '$1,850,000',
        criticalPath: true,
        riskLevel: 'high',
        description: '1,200mm diameter bored cast-in-situ piles, 3.5m deep raft foundation pour, secant pile shoring wall, and 4-level basement excavation.',
        keyDeliverables: [
          { id: 'del-hr-6-1', title: 'Secant Piling Shoring & Ground Anchor Pre-Stressing Sign-off', completed: true, deliverableType: 'Site Inspection' },
          { id: 'del-hr-6-2', title: 'Deep Bored Pile Integrity Sonic Echo Testing (100% Piles)', completed: true, deliverableType: 'Report' },
          { id: 'del-hr-6-3', title: 'Monolithic Mass Raft Foundation Pour (7,500 m³ Concrete)', completed: false, deliverableType: 'Site Inspection' },
          { id: 'del-hr-6-4', title: 'Basement Subgrade Tanking & Waterproofing Membrane Verification', completed: false, deliverableType: 'Site Inspection' }
        ]
      },
      {
        id: 'phase-hr-7',
        phaseNumber: 7,
        shortCode: 'PH-07',
        name: 'Superstructure Jump-Form & Vertical MEP',
        category: 'Execution',
        completionPercentage: 0,
        status: 'upcoming',
        startDate: '2026-10-01',
        targetEndDate: '2027-08-30',
        leadOwner: 'Tariq Al-Mansoor (Superstructure Lead)',
        budgetAllocated: '$4,200,000',
        criticalPath: true,
        riskLevel: 'high',
        description: 'Self-climbing hydraulic jump-form core erection, 5-day cycle floor slabs, tower crane jumps, and main vertical MEP risers.',
        keyDeliverables: [
          { id: 'del-hr-7-1', title: 'Hydraulic Jump-Form Core Assembly & Level 10 Milestone', completed: false, deliverableType: 'Site Inspection' },
          { id: 'del-hr-7-2', title: 'Mid-Level Mechanical Plant Room (Floor 24) MEP Handover', completed: false, deliverableType: 'Report' },
          { id: 'del-hr-7-3', title: 'Structural Crown & Heli-pad Topping Out Ceremony', completed: false, deliverableType: 'Site Inspection' }
        ]
      },
      {
        id: 'phase-hr-8',
        phaseNumber: 8,
        shortCode: 'PH-08',
        name: 'Commissioning, Occupancy & Final Handover',
        category: 'Handover',
        completionPercentage: 0,
        status: 'upcoming',
        startDate: '2027-09-01',
        targetEndDate: '2027-12-15',
        leadOwner: 'Fiza Hayat (Design Director)',
        budgetAllocated: '$320,000',
        criticalPath: true,
        riskLevel: 'low',
        description: 'Smoke evacuation air balancing, elevator certification, smart BMS energy calibration, and municipal Certificate of Occupancy.',
        keyDeliverables: [
          { id: 'del-hr-8-1', title: 'Integrated Life Safety & Smoke Evacuation Cause-and-Effect Test', completed: false, deliverableType: 'Report' },
          { id: 'del-hr-8-2', title: 'Final Municipal Certificate of Occupancy (CoO)', completed: false, deliverableType: 'Permit' },
          { id: 'del-hr-8-3', title: 'LOD 500 As-Built Digital Twin Handover to Facilities Management', completed: false, deliverableType: 'BIM Model' }
        ]
      }
    ];
  } else {
    // Standard Luxury Residential / Architectural Villa / Building Project
    phases = [
      {
        id: 'phase-res-1',
        phaseNumber: 1,
        shortCode: 'PH-01',
        name: 'Feasibility, Site Survey & Environmental Analysis',
        category: 'Concept',
        completionPercentage: 100,
        status: 'completed',
        startDate: '2025-08-01',
        targetEndDate: '2025-09-15',
        actualEndDate: '2025-09-12',
        leadOwner: 'Fiza Hayat (Principal Architect)',
        budgetAllocated: '$32,000',
        criticalPath: true,
        riskLevel: 'low',
        description: 'Total station topographical boundary survey, solar irradiance mapping, microclimate wind study, and geotechnical soil load bearing capacity tests.',
        keyDeliverables: [
          { id: 'del-res-1-1', title: 'Topographical Drone LiDAR Point Cloud & 3D Terrain Model', completed: true, deliverableType: 'BIM Model' },
          { id: 'del-res-1-2', title: 'Geotechnical Soil Core Sampling & Allowable Bearing Pressure Report', completed: true, deliverableType: 'Report' },
          { id: 'del-res-1-3', title: 'Environmental Sun-Path, Shading & Microclimate Wind Assessment', completed: true, deliverableType: 'Report' }
        ]
      },
      {
        id: 'phase-res-2',
        phaseNumber: 2,
        shortCode: 'PH-02',
        name: 'Concept Architecture & Massing Development',
        category: 'Concept',
        completionPercentage: 100,
        status: 'completed',
        startDate: '2025-09-16',
        targetEndDate: '2025-11-10',
        actualEndDate: '2025-11-08',
        leadOwner: 'Fiza Hayat (Principal Architect)',
        budgetAllocated: '$48,000',
        criticalPath: true,
        riskLevel: 'low',
        description: 'Parametric massing iterations, view corridor framing, cantilever structural concepts, and primary spatial zoning drawings.',
        keyDeliverables: [
          { id: 'del-res-2-1', title: 'Master Spatial Layout & Massing Options (3 Concepts)', completed: true, deliverableType: 'Drawing' },
          { id: 'del-res-2-2', title: 'Photorealistic Exterior CGI Renders & Unreal Engine Cinematic', completed: true, deliverableType: 'BIM Model' },
          { id: 'del-res-2-3', title: 'Preliminary Structural Steel Cantilever Feasibility Study', completed: true, deliverableType: 'Report' }
        ]
      },
      {
        id: 'phase-res-3',
        phaseNumber: 3,
        shortCode: 'PH-03',
        name: 'Schematic Design & Statutory Permitting',
        category: 'Statutory Approvals',
        completionPercentage: 100,
        status: 'completed',
        startDate: '2025-11-11',
        targetEndDate: '2026-01-20',
        actualEndDate: '2026-01-18',
        leadOwner: 'Amira Patel (Regulatory Compliance Lead)',
        budgetAllocated: '$40,000',
        criticalPath: true,
        riskLevel: 'medium',
        description: 'City building department statutory drawings, environmental zoning compliance, tree conservation permits, and setback approvals.',
        keyDeliverables: [
          { id: 'del-res-3-1', title: 'Municipal Planning & Zoning Submission Drawing Set (1:100)', completed: true, deliverableType: 'Drawing' },
          { id: 'del-res-3-2', title: 'Environmental Protection & Natural Watercourse Buffer Sign-off', completed: true, deliverableType: 'Permit' },
          { id: 'del-res-3-3', title: 'Formal Municipal Building Permit Approval Notice', completed: true, deliverableType: 'Permit' }
        ]
      },
      {
        id: 'phase-res-4',
        phaseNumber: 4,
        shortCode: 'PH-04',
        name: 'Detailed Structural Engineering & LOD 400 BIM',
        category: 'Detailed Engineering',
        completionPercentage: 88,
        status: 'in_progress',
        startDate: '2026-01-21',
        targetEndDate: '2026-04-15',
        leadOwner: 'Tariq Al-Mansoor (Chief Structural Engineer)',
        budgetAllocated: '$65,000',
        criticalPath: true,
        riskLevel: 'medium',
        description: 'Post-tensioned concrete slab analysis, structural steel cantilever connections, seismic deflection modeling, and clash-free federated BIM coordinate system.',
        keyDeliverables: [
          { id: 'del-res-4-1', title: 'Post-Tensioned Concrete Slab Tendon Profiles & Rebar Schedules', completed: true, deliverableType: 'Drawing' },
          { id: 'del-res-4-2', title: 'Structural Steel Outrigger Cantilever Fabrication Shop Drawings', completed: true, deliverableType: 'Drawing' },
          { id: 'del-res-4-3', title: 'Autodesk Revit LOD 400 Architectural/Structural Model', completed: true, deliverableType: 'BIM Model' },
          { id: 'del-res-4-4', title: 'Navisworks Multi-Trade Zero-Clash Audit Report', completed: false, deliverableType: 'Report' }
        ]
      },
      {
        id: 'phase-res-5',
        phaseNumber: 5,
        shortCode: 'PH-05',
        name: 'Building Services (MEP), Solar & Smart Home',
        category: 'Detailed Engineering',
        completionPercentage: 70,
        status: 'in_progress',
        startDate: '2026-02-15',
        targetEndDate: '2026-05-30',
        leadOwner: 'Tariq Al-Mansoor (MEP Systems Lead)',
        budgetAllocated: '$55,000',
        criticalPath: false,
        riskLevel: 'medium',
        description: 'Geothermal heat pump loop, integrated solar roof wiring, concealed VRV acoustic HVAC ducts, rainwater harvesting, and smart automation hub.',
        keyDeliverables: [
          { id: 'del-res-5-1', title: 'High-Efficiency VRV Air Conditioning & Ventilation Layouts', completed: true, deliverableType: 'Drawing' },
          { id: 'del-res-5-2', title: 'Photovoltaic Array & Battery Storage Schematic Single-Line Diagram', completed: true, deliverableType: 'Drawing' },
          { id: 'del-res-5-3', title: 'Smart Home Automation KNX / Crestron Lighting & Security Topology', completed: false, deliverableType: 'Specification' }
        ]
      },
      {
        id: 'phase-res-6',
        phaseNumber: 6,
        shortCode: 'PH-06',
        name: 'Substructure & Concrete Shell Construction',
        category: 'Execution',
        completionPercentage: 45,
        status: 'in_progress',
        startDate: '2026-04-01',
        targetEndDate: '2026-08-30',
        leadOwner: 'Fiza Hayat (Site Supervision Lead)',
        budgetAllocated: '$680,000',
        criticalPath: true,
        riskLevel: 'high',
        description: 'Cliffside excavation, rock anchor micropiling, foundation pour, waterproof retaining walls, and monolithic architectural fair-faced concrete casting.',
        keyDeliverables: [
          { id: 'del-res-6-1', title: 'Foundation Micropile Load Test Verification (ASTM D1143)', completed: true, deliverableType: 'Site Inspection' },
          { id: 'del-res-6-2', title: 'Subterranean Waterproofing Membrane & Drain Mat Testing', completed: true, deliverableType: 'Site Inspection' },
          { id: 'del-res-6-3', title: 'Ground Floor Cantilevered Slab Concrete Core Compressive Strength Test', completed: false, deliverableType: 'Report' },
          { id: 'del-res-6-4', title: 'Architectural Board-Marked Concrete Finish Sample Panel Sign-off', completed: false, deliverableType: 'Site Inspection' }
        ]
      },
      {
        id: 'phase-res-7',
        phaseNumber: 7,
        shortCode: 'PH-07',
        name: 'Glazing, Envelope Enclosure & Millwork',
        category: 'Execution',
        completionPercentage: 10,
        status: 'in_progress',
        startDate: '2026-07-01',
        targetEndDate: '2026-11-30',
        leadOwner: 'Elena Rostova (Materials & Enclosure Lead)',
        budgetAllocated: '$540,000',
        criticalPath: true,
        riskLevel: 'medium',
        description: 'Triple-glazed motorized slimline curtain walls, weathering zinc fascia panels, infinity pool overflow tilework, and bespoke European millwork.',
        keyDeliverables: [
          { id: 'del-res-7-1', title: 'Motorized Sliding Glass Minimal Frames Factory Acceptance Test', completed: true, deliverableType: 'Report' },
          { id: 'del-res-7-2', title: 'Weathering Zinc Roof Standing Seam Installation', completed: false, deliverableType: 'Site Inspection' },
          { id: 'del-res-7-3', title: 'Cantilevered Infinity Glass Balustrade Wind Pressure Verification', completed: false, deliverableType: 'Site Inspection' }
        ]
      },
      {
        id: 'phase-res-8',
        phaseNumber: 8,
        shortCode: 'PH-08',
        name: 'Interior Furnishing, Testing & Client Handover',
        category: 'Handover',
        completionPercentage: 0,
        status: 'upcoming',
        startDate: '2026-11-15',
        targetEndDate: '2027-01-30',
        leadOwner: 'Fiza Hayat (Principal Architect)',
        budgetAllocated: '$220,000',
        criticalPath: true,
        riskLevel: 'low',
        description: 'Bespoke travertine furniture placement, climate system acoustic decibel balancing, smart lighting commissioning, and VIP client key handover.',
        keyDeliverables: [
          { id: 'del-res-8-1', title: 'Air-Tightness Blower Door Test (Passivhaus / LEED Standard)', completed: false, deliverableType: 'Report' },
          { id: 'del-res-8-2', title: 'Pre-Delivery Zero-Defect Architectural Punch List', completed: false, deliverableType: 'Site Inspection' },
          { id: 'del-res-8-3', title: 'Official Certificate of Occupancy & Digital BIM As-Built Twin Handover', completed: false, deliverableType: 'Permit' }
        ]
      }
    ];
  }

  // Calculate overall weighted completion
  const overallPercentage = calculateOverallProgress(phases);
  
  // Find current active phase
  const activePhase = phases.find(p => p.status === 'in_progress') || phases[phases.length - 1];
  const completedPhasesCount = phases.filter(p => p.status === 'completed').length;

  return {
    overallCompletionPercentage: overallPercentage,
    currentPhaseName: activePhase ? activePhase.name : 'Completed',
    currentPhaseNumber: activePhase ? activePhase.phaseNumber : phases.length,
    projectStatus: overallPercentage >= 50 ? 'on_track' : 'ahead',
    startDate: phases[0].startDate,
    targetHandoverDate: phases[phases.length - 1].targetEndDate,
    totalPhasesCount: phases.length,
    completedPhasesCount,
    phases,
    lastInspectionDate: '2026-03-12'
  };
}

/**
 * Calculates overall completion percentage across phases weighted equally or by deliverable counts
 */
export function calculateOverallProgress(phases: ProjectMilestonePhase[]): number {
  if (!phases || phases.length === 0) return 0;
  
  const totalWeight = phases.reduce((acc, p) => acc + p.completionPercentage, 0);
  return Math.round(totalWeight / phases.length);
}

/**
 * Helper to get styling attributes for phase status
 */
export function getPhaseStatusBadge(status: ProjectMilestonePhase['status']) {
  switch (status) {
    case 'completed':
      return {
        label: 'Completed',
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        badgeBg: 'bg-emerald-500',
        dot: 'bg-emerald-400'
      };
    case 'in_progress':
      return {
        label: 'In Progress',
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        border: 'border-blue-500/30',
        badgeBg: 'bg-blue-600',
        dot: 'bg-blue-400 animate-pulse'
      };
    case 'delayed':
      return {
        label: 'Delayed',
        bg: 'bg-rose-500/10',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
        badgeBg: 'bg-rose-600',
        dot: 'bg-rose-400'
      };
    case 'upcoming':
    default:
      return {
        label: 'Upcoming',
        bg: 'bg-neutral-800/60',
        text: 'text-neutral-400',
        border: 'border-white/10',
        badgeBg: 'bg-neutral-700',
        dot: 'bg-neutral-500'
      };
  }
}
