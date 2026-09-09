export interface ProjectWorkflowStep {
  stepNumber: number;
  stageName: string;
  discipline: string;
  deliverables: string[];
  keyActions: string[];
  standardsToCheck: string[];
  whatToDoNext: string;
}

export interface ProjectWorkflowRecord {
  id: string;
  projectType: string;
  description: string;
  estimatedDurationWeeks: string;
  stages: ProjectWorkflowStep[];
}

export const PROJECT_WORKFLOW_DATABASE: ProjectWorkflowRecord[] = [
  {
    id: 'workflow-residential-house',
    projectType: 'Residential House Project (G+1 / G+2)',
    description: 'Complete end-to-end design, regulatory approval, coordination, and construction sequence for private residential homes.',
    estimatedDurationWeeks: '36 - 48 weeks',
    stages: [
      {
        stepNumber: 1,
        stageName: 'Client Brief & Site Survey',
        discipline: 'Architecture / Civil',
        deliverables: ['Total Station Site Survey (.dwg)', 'Soil Investigation Geotechnical Report (SBC)', 'Client Spatial Requirement Matrix'],
        keyActions: [
          'Verify true site plot boundaries and physical road widths against deed documents.',
          'Conduct minimum 2 soil boreholes to determine Safe Bearing Capacity (SBC) and water table depth.',
          'Map municipal setbacks, Floor Space Index (FSI/FAR), and maximum permissible height.'
        ],
        standardsToCheck: ['IS 1892 (Subsurface Investigation)', 'Local Municipal Building Bylaws'],
        whatToDoNext: 'Proceed to Concept Space Planning and Schematic Floor Plans.'
      },
      {
        stepNumber: 2,
        stageName: 'Architectural Concept & Space Planning',
        discipline: 'Architecture',
        deliverables: ['Schematic 2D Floor Plans', '3D Massing Study', 'Room Carpet Area Schedule'],
        keyActions: [
          'Arrange functional zoning: public living vs private bedrooms vs service areas (kitchen/toilets).',
          'Optimize natural sun path (solar orientation) and prevailing wind cross-ventilation.',
          'Validate minimum room dimensions and staircase riser/tread geometry per NBC 2016.'
        ],
        standardsToCheck: ['NBC 2016 Part 3 (Development Control Rules & Room Norms)'],
        whatToDoNext: 'Lock client approval on layout and transfer plans to Structural Engineer.'
      },
      {
        stepNumber: 3,
        stageName: 'Structural Framing & Soil Coordination',
        discipline: 'Structural Engineering',
        deliverables: ['Column Layout Plan', 'Footing / Foundation Drawing', 'Preliminary Member Sizing (Beams & Slabs)'],
        keyActions: [
          'Establish column grid lines ensuring columns do not punch into doors or living areas.',
          'Design foundation type (Isolated vs Combined vs Raft) matching soil test SBC.',
          'Model structural frames in STAAD.Pro or ETABS for gravity and lateral seismic loads.'
        ],
        standardsToCheck: ['IS 456:2000', 'IS 1893:2016', 'IS 13920:2016'],
        whatToDoNext: 'Coordinate MEP service shaft openings and structural slab drops.'
      },
      {
        stepNumber: 4,
        stageName: 'MEP Coordination & Working Drawings',
        discipline: 'MEP / Architecture',
        deliverables: ['Electrical Conduit & Power Plan', 'Plumbing & Drainage Layout', 'Door & Window Schedule', 'Sanction / Municipal Approval Drawings'],
        keyActions: [
          'Align plumbing vertical stacks with internal service ducts; verify drainage slope (1:50).',
          'Position electrical switchboards on strike side of doors (1200mm AFF).',
          'Assemble municipal sanction set with FSI calculations and fire safety setbacks.'
        ],
        standardsToCheck: ['IS 732 (Electrical)', 'IS 1742 (Building Drainage)', 'NBC 2016 Part 4'],
        whatToDoNext: 'Submit for statutory municipal building permit and prepare Bill of Quantities (BOQ).'
      },
      {
        stepNumber: 5,
        stageName: 'BOQ, Tender & Contractor Award',
        discipline: 'Quantity Surveying',
        deliverables: ['Detailed Bill of Quantities (BOQ)', 'Material Specifications Document', 'Item-Rate Construction Contract'],
        keyActions: [
          'Calculate accurate quantities: Concrete volume (m³), Steel rebar (MT), Brickwork (m³), Flooring (m²).',
          'Procure competitive bids from vetted civil contractors with track records.',
          'Finalize milestone payment schedule linked to verified site stages (Plinth, Slabs, Finishing).'
        ],
        standardsToCheck: ['IS 1200 (Methods of Measurement of Building and Civil Engineering Works)'],
        whatToDoNext: 'Mobilize site, establish temporary electrical/water connections, and commence earthwork excavation.'
      },
      {
        stepNumber: 6,
        stageName: 'Substructure & Foundation Execution',
        discipline: 'Site Civil Engineering',
        deliverables: ['Excavation Inspection Sign-off', 'PCC Pour Record', 'Footing & Plinth Beam Rebar Checklists'],
        keyActions: [
          'Set out centerlines using total station from permanent corner benchmarks.',
          'Excavate to hard strata; compact soil and lay 75mm PCC (1:4:8).',
          'Fix footing rebar with 50mm cover blocks; inspect column stub starter cage placement.',
          'Pour M25 concrete, ensure continuous mechanical vibration, and wet-cure for minimum 10-14 days.'
        ],
        standardsToCheck: ['IS 456:2000 Clause 26.4', 'IS 1904'],
        whatToDoNext: 'Backfill foundation trenches with non-expansive soil and erect plinth beams.'
      },
      {
        stepNumber: 7,
        stageName: 'Superstructure RCC Framing & Masonry',
        discipline: 'Site Civil Engineering',
        deliverables: ['Column Cast Records', 'Slab Shuttering & Rebar Pre-pour Checklist', 'Masonry Setting-out Sign-off'],
        keyActions: [
          'Cast columns floor-by-floor using sturdy steel formwork and plumb bob checks.',
          'Erect slab centering, prop spacing (max 1.0m c/c), and lay beam bottom rebar, chairs, and fan box conduits.',
          'Conduct comprehensive pre-pour inspection before placing concrete.',
          'Lay exterior 200mm and interior 100mm masonry walls with continuous RCC lintel bands.'
        ],
        standardsToCheck: ['IS 456:2000', 'IS 13920:2016 (Confining ties)', 'IS 2185'],
        whatToDoNext: 'Initiate plumbing/electrical conduit chiseling and interior plastering.'
      },
      {
        stepNumber: 8,
        stageName: 'Finishing, Testing & Handover',
        discipline: 'Interior & MEP / Project Management',
        deliverables: ['Pressure Test Records (Water & Drainage)', 'Electrical Insulation Resistance Test', 'As-Built Drawings & Snag List'],
        keyActions: [
          'Pressure test plumbing supply lines at 7-10 bar for 24 hours prior to concealing inside plaster.',
          'Waterproof bathroom sunken slabs and test with 72-hour standing water ponding test.',
          'Install flooring tiles, doors, windows, paint, and sanitaryware fixtures.',
          'Prepare snag list, conduct deep cleaning, and hand over occupancy keys with As-Built drawing set.'
        ],
        standardsToCheck: ['IS 1346 (Waterproofing)', 'IS 15477 (Tile Adhesives)'],
        whatToDoNext: 'Project completed; transfer maintenance manual and warranty certificates to owner.'
      }
    ]
  }
];
