import { VisualKnowledgeArticle, DrawingAnalysisSample } from '../types/visualKnowledge';

export const VISUAL_KNOWLEDGE_ARTICLES: VisualKnowledgeArticle[] = [
  // =========================================================================
  // 1. ARCHITECTURE - FLOOR PLAN
  // =========================================================================
  {
    id: 'arch-floor-plan',
    slug: 'how-to-read-and-design-floor-plans',
    title: 'Architectural Floor Plan: Symbology, Wall Thickness & Circulation',
    category: 'Architecture',
    subCategory: 'Working Drawings',
    oneLineSummary: 'Master the technical anatomy of 2D floor plans: load-bearing vs partition walls, door swings, window dimensions, and optimal human circulation paths.',
    author: 'Ar. Fiza Hayat & Technical Design Team',
    readTime: '6 min read',
    publishDate: '2026-03-15',
    tags: ['Floor Plan', 'Architecture', 'CAD Drafting', 'Circulation', 'Residential Design'],
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    heroImageAlt: 'Architectural modern residence floor plan conceptual model and drafting studio',
    heroBadge: 'Core Architecture',

    quickOverview: [
      'Standard exterior masonry walls are 200mm–230mm (8"–9"), while interior partition walls measure 100mm–115mm (4"–4.5").',
      'Door swings must always open into rooms against adjacent walls, never blocking hallways or furniture pathways.',
      'Dimension strings must follow a 3-tier hierarchy: overall building dimension, room-to-room centers, and opening/pier details.',
      'Primary circulation hallways require a minimum clear width of 900mm (3 ft) for residential and 1500mm (5 ft) for accessible commercial routes.'
    ],

    whatIsIt: {
      description: 'An architectural floor plan is a scaled orthographic projection viewed from above, representing a horizontal slice through a building taken typically at 1.2 meters (4 feet) above finished floor level. It reveals wall geometries, door clearances, window placements, built-in joinery, and horizontal room relationships.',
      diagramImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Architectural floor plan blueprint linework with dimension strings and room zoning',
      diagramCaption: 'Orthographic horizontal cut at 1.2m above finished floor line, illustrating door swings, wall poché, and circulation zoning.'
    },

    stepsTitle: 'How to Read & Draft a Professional Floor Plan in 4 Steps',
    steps: [
      {
        stepNumber: 1,
        title: 'Establish Structural Grid & Exterior Boundary',
        description: 'Set up coordinate grid lines (letters on X-axis, numbers on Y-axis) passing through column centers. Lay out outer perimeter load-bearing walls at true exterior thickness.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Draftsman plotting structural coordinate grid lines on CAD workstation',
        tips: ['Use distinct CAD layers: A-WALL-EXTR with 0.50mm line weight for clear contrast.']
      },
      {
        stepNumber: 2,
        title: 'Define Room Zoning & Internal Partitions',
        description: 'Separate public zones (living, foyer), semi-private zones (kitchen, dining), and private zones (bedrooms, ensuite baths). Draw partition walls at 100mm–115mm.',
        image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Interior architectural space planning layout with zoning boundaries',
        tips: ['Keep plumbing walls back-to-back between bathrooms and utility ducts to streamline MEP piping.']
      },
      {
        stepNumber: 3,
        title: 'Insert Doors, Windows & Swing Arcs',
        description: 'Show accurate door openings with a 90-degree swing arc at 0.18mm line weight. Specify window sill heights and head levels with schedule tags (e.g., D1, W1).',
        image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'CAD drawing showing door swing clearance and window schedule callouts',
        tips: ['Standard bedroom doors: 900x2100mm; bathroom doors: 750x2100mm; main entrance: 1000-1200x2400mm.']
      },
      {
        stepNumber: 4,
        title: 'Annotate Dimensions, Levels & Room Tags',
        description: 'Place room names, finished floor levels (+0.00 FFL), calculated square footage, and a 3-tier external dimension chain before cross-referencing section callout lines.',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Annotated floor plan blueprint showing dimension chains and finished floor level tags',
        tips: ['Verify that inner room dimensions sum exactly to the overall exterior structural footprint.']
      }
    ],

    practicalExample: {
      title: 'Modern 3-Bedroom Courtyard Villa Floor Plan',
      description: 'A 2,800 sq.ft single-story layout centered around a landscaped courtyard. The design separates active family living from quiet sleeping quarters while maximizing natural cross-ventilation.',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Finished luxury courtyard villa floor plan and spatial layout',
      specifications: {
        'Total Built-Up Area': '2,800 sq.ft (260 sq.m)',
        'Exterior Wall Material': '230mm Autoclaved Aerated Concrete (AAC)',
        'Primary Hallway Width': '1,200mm clear width',
        'Ceiling Height': '3,300mm FFL to soffit'
      },
      keyTakeaway: 'Centering circulation around an internal open court eliminates dead corridors and floods interior spaces with diffused daylight.'
    },

    problemSolution: {
      problemTitle: 'Common Mistake: Dead-End Corridors & Obstructed Door Swings',
      problemDescription: 'Long dark hallways consume costly square footage without adding usable value. Doors opening into circulation paths create collision hazards with moving occupants.',
      problemImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      possibleCauses: [
        'Placing bedrooms at opposite ends without a central buffer zone',
        'Failing to align door hinges against adjacent perpendicular wall faces',
        'Neglecting furniture clearance envelopes when drafting room footprints'
      ],
      solutionTitle: 'Corrected Layout: Clustered Circulation & Wall-Hugging Swings',
      solutionDescription: 'Eliminate secondary corridors by integrating circulation into open-concept living/dining spaces. Position door frames 100mm away from corners to allow full 90-degree swings against walls.',
      solutionImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Always test 1:50 furniture block templates (bed, wardrobe, desk) inside rooms before finalizing partition wall locations.'
    },

    beforeAfter: {
      title: 'Floor Plan Optimization: Fragmented vs Open Efficient Layout',
      beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
      beforeLabel: 'Before: Cramped & Cluttered',
      beforeNotes: 'Narrow 800mm hallway, door clashes with wardrobe, poor daylight reach in dining area.',
      afterImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      afterLabel: 'After: Flowing & Open Concept',
      afterNotes: '1,200mm continuous circulation spine, pocket sliding doors, continuous courtyard sightlines.'
    },

    engineeringTips: [
      'Maintain continuous vertical plumbing stacks between floors to avoid horizontal pipe drops in suspended ceilings.',
      'Check local egress code: bedroom emergency escape windows must have minimum 0.5 sq.m clear openable area with sill ≤ 1100mm from floor.',
      'Show column positions inside wall intersections so structural piers do not create awkward internal room protrusions.'
    ],
    relevantCodesAndStandards: ['IBC Section 1005 (Means of Egress)', 'BS 9999 (Fire Safety in Design)', 'IS 1256 (Code of Practice for Building Byelaws)'],
    relatedTopicIds: ['arch-elevation', 'arch-section', 'struct-column-reinforcement', 'software-autocad', 'software-revit']
  },

  // =========================================================================
  // 2. ARCHITECTURE - ELEVATION & FACADE
  // =========================================================================
  {
    id: 'arch-elevation',
    slug: 'architectural-elevation-drawing-and-facade-design',
    title: 'Architectural Elevation: Facade Proportions, Material Callouts & Heights',
    category: 'Architecture',
    subCategory: 'Working Drawings',
    oneLineSummary: 'Understand orthographic exterior elevations, vertical datum levels, shadow projection line weights, and climate-responsive facade engineering.',
    author: 'Ar. Fiza Hayat & Technical Design Team',
    readTime: '5 min read',
    publishDate: '2026-03-16',
    tags: ['Elevation', 'Facade Design', 'Architectural Drawing', 'Materials', 'Exterior'],
    heroImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80',
    heroImageAlt: 'Modern contemporary villa exterior elevation with cantilevered louvers and glass curtain wall',
    heroBadge: 'Working Drawing',

    quickOverview: [
      'Elevations are orthographic projections showing vertical exterior surfaces without perspective convergence.',
      'Floor-to-floor datum lines (Ground Level, Plinth Level, Sill, Lintel, Slab Soffit, Parapet) must align across all 4 elevations.',
      'Line weight rules: foreground planes have heaviest outlines (0.35mm–0.50mm), receding planes use fine linework (0.13mm–0.18mm).',
      'Solar shading louvers and overhang depths must correlate with sun path angles for east, south, and west facades.'
    ],

    whatIsIt: {
      description: 'An architectural elevation drawing shows one exterior or interior vertical facade of a building as viewed perpendicular to the surface. It provides precise vertical measurements, material specifications, window/door heights, and decorative facade elements necessary for construction and planning approval.',
      diagramImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Technical elevation drawing showing vertical datum dimensions and material textures',
      diagramCaption: 'South elevation showing vertical height benchmarks, ventilated rainscreen cladding, and cantilevered sunshade fins.'
    },

    stepsTitle: 'How to Produce an Accurate Technical Elevation Drawing',
    steps: [
      {
        stepNumber: 1,
        title: 'Project Vertical Projection Lines from Floor Plan',
        description: 'Align the floor plan horizontally above your drafting space and project vertical guide lines downwards from all corners, column edges, and window openings.',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Projecting vertical construction lines from floor plan onto elevation plane',
        tips: ['Lock your reference plan on an underlay layer so projection guides remain perfectly perpendicular.']
      },
      {
        stepNumber: 2,
        title: 'Establish Datum Levels (GL, FFL, Lintel, Parapet)',
        description: 'Draw horizontal benchmark lines: Natural Ground Level (NGL 0.00), Plinth Level (+450mm), First Floor FFL (+3300mm), and Roof Parapet (+6900mm).',
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Architectural level datum markers on technical CAD drawing',
        tips: ['Use standardized level target symbols (circle with alternating quarters) on the outer dimension spine.']
      },
      {
        stepNumber: 3,
        title: 'Apply Depth Hierarchy & Line Weights',
        description: 'Apply heavier linework to elements closest to the viewer (e.g., entrance portico or front balcony) and thinner linework to background planes.',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Architectural facade lineweight hierarchy illustration',
        tips: ['Add subtle 45-degree sun shadows under eaves and sills to convey 3D depth on a flat 2D sheet.']
      },
      {
        stepNumber: 4,
        title: 'Specify Finishes, Cladding & Glass Specs',
        description: 'Call out materials using leader notes: e.g., "3mm Fluted Terracotta Tile Cladding on Sub-Frame", "Double-Glazed Low-E Glass (SHGC 0.28)", "Brushed Bronze Coping".',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Material callout annotations on luxury facade detail',
        tips: ['Ensure material tags match your project specification master sheet to avoid on-site contractor disputes.']
      }
    ],

    practicalExample: {
      title: 'Climate-Adaptive Parametric South Facade',
      description: 'An executive office building elevation featuring deep horizontal concrete louvers designed for high-sun solar shading, combined with vertical automated bronze fins that track morning and afternoon glare.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'High-rise commercial facade with integrated passive solar shading fins',
      specifications: {
        'Facade Type': 'Unitized Curtain Wall with External Aluminum Fins',
        'Thermal Performance': 'U-value = 1.4 W/m²K',
        'Shading Depth': '450mm projection at lintel level',
        'Glazing': 'Acoustic Laminated Low-Iron Glass (STC 42)'
      },
      keyTakeaway: 'Integrating solar angles directly into facade geometry slashes active air-conditioning cooling loads by up to 32%.'
    },

    problemSolution: {
      problemTitle: 'Common Elevation Error: Flat Linework with Missing Depth Cues',
      problemDescription: 'Drawings where all lines share a single line weight appear flat and confusing. Contractors cannot discern whether a wall plane is 2 meters forward or 5 meters recessed.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: [
        'Exporting raw 3D wireframe models without applying 2D CAD pen-weight tables (CTB)',
        'Omitting cast shadows and vertical floor-level benchmark annotations',
        'Failing to indicate roof drainage slope directions and rainwater downpipe locations'
      ],
      solutionTitle: 'Multi-Tier Pen Weight Hierarchy & Sectional Break Lines',
      solutionDescription: 'Establish three distinct line weights: 0.50mm for silhouette/perimeter cut lines, 0.25mm for intermediate window/door frames, and 0.09mm for surface hatch textures.',
      solutionImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Always include true ground slope lines (hatched earth symbol) so foundation plinth exposure is evident to site excavators.'
    },

    beforeAfter: {
      title: 'Facade Elevation: Monolithic Flat Wall vs Sculpted Textured Facade',
      beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
      beforeLabel: 'Before: Flat Uniform Wall',
      beforeNotes: 'No shadow relief, zero sun control, monotonous window grid with no material hierarchy.',
      afterImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80',
      afterLabel: 'After: Sculpted Louvers & Stone Rainscreen',
      afterNotes: '300mm cantilevered canopy, fluted limestone accents, recessed thermally broken glazing.'
    },

    engineeringTips: [
      'Indicate rainwater downpipes (RWDP) and expansion joint locations on all long facade elevations over 30 meters.',
      'Check parapet flashing: ensure coping stones have a minimum 1:20 inward slope and drip groove (throating) to avoid wall staining.',
      'Verify that all window head levels align with door lintels to maintain a cohesive horizontal visual datum.'
    ],
    relevantCodesAndStandards: ['ASHRAE 90.1 (Building Envelope Energy Standard)', 'ASTM E1300 (Glass Load Resistance)', 'BS 8200 (Design of Non-Loadbearing Enclosures)'],
    relatedTopicIds: ['arch-floor-plan', 'arch-section', 'software-revit', 'software-3dsmax']
  },

  // =========================================================================
  // 3. ARCHITECTURE - SECTION DRAWING
  // =========================================================================
  {
    id: 'arch-section',
    slug: 'architectural-building-section-drawings-and-vertical-details',
    title: 'Building Sections: Vertical Volumes, Slab Assemblies & Foundation Steps',
    category: 'Architecture',
    subCategory: 'Working Drawings',
    oneLineSummary: 'Learn to read and draw architectural sections: slab thickness, dropped ceilings, stair headroom clearances, foundation transitions, and water-barrier continuity.',
    author: 'Ar. Fiza Hayat & Technical Design Team',
    readTime: '6 min read',
    publishDate: '2026-03-17',
    tags: ['Building Section', 'Vertical Details', 'Staircase Drawing', 'Ceiling Plan', 'Working Drawing'],
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
    heroImageAlt: 'Architectural section showing double-height atrium volume and structural floor build-ups',
    heroBadge: 'Core Drawing',

    quickOverview: [
      'A building section is a vertical cut revealing interior volumes, structural floor slabs, foundation details, and roof build-up.',
      'Section lines on floor plans must indicate the cut location and viewing direction arrows (e.g., Section A-A).',
      'Minimum staircase headroom clearance is 2000mm (6 ft 8 in) measured vertically from the nosing line to the ceiling soffit.',
      'Cut elements (concrete slabs, foundation walls) receive heavy cut lines (0.50mm) and solid or standard material hatch patterns.'
    ],

    whatIsIt: {
      description: 'An architectural building section is a vertical plane cutting through a structure from roof to foundation. Unlike elevations which only display outer skins, a section uncovers internal ceiling heights, structural slab depths, MEP plenum voids, thermal insulation layers, and vertical circulation paths such as stairs, elevators, and shafts.',
      diagramImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Cross-section drawing through multi-story building showing floor build-ups and stairwell',
      diagramCaption: 'Transverse building section illustrating slab cast details, acoustic ceiling cavity, waterproofing membrane, and foundation steps.'
    },

    stepsTitle: 'How to Construct a Flawless Building Section',
    steps: [
      {
        stepNumber: 1,
        title: 'Locate Section Cut Line on Plan',
        description: 'Choose cut planes through the most critical vertical zones: main stairwells, double-height volumes, roof changes, and window openings.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Draftsman checking section cut line across floor plan layout',
        tips: ['Never cut through thin columns longitudinally; offset section cuts slightly to show spatial relationships.']
      },
      {
        stepNumber: 2,
        title: 'Establish Structural Slabs & Foundation Plinth',
        description: 'Draw top of footing, grade beam, plinth slab (with DPC barrier), intermediate suspended RCC slabs (typically 150mm–200mm), and roof slab.',
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Technical section detailing concrete slab thickness and rebar layers',
        tips: ['Include screed (50mm), acoustic underlay, and tile finish above the structural slab.']
      },
      {
        stepNumber: 3,
        title: 'Detail Staircases, Landings & Risers',
        description: 'Plot equal risers (150mm–175mm) and treads (280mm–300mm). Verify that 2R + T = 600mm to 640mm for ideal human ergonomics.',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Detailed architectural stair section with riser and tread calculation tags',
        tips: ['Check diagonal headroom at each step to avoid painful low-soffit head strikes.']
      },
      {
        stepNumber: 4,
        title: 'Hatch Cut Materials & Add Level Heights',
        description: 'Apply standardized ANSI concrete dots/triangles to cut RCC, diagonal hatching to masonry, and insulation squiggles. Label all finished floor levels.',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Hatched building section with level annotations and callout bubbles',
        tips: ['Call out detail bubbles (e.g., Detail 1/A-501) for parapet flashing and foundation damp proofing.']
      }
    ],

    practicalExample: {
      title: 'Cantilevered Villa Section with Hidden MEP Plenum',
      description: 'Cross-section through a 3-story luxury villa showing how a 450mm dropped ceiling cavity conceals ducted VRF fan-coil units without compromising the 3.2m clear living room height.',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Modern villa interior sectional perspective showcasing spatial heights',
      specifications: {
        'Clear Ceiling Height': '3,200mm ground floor, 3,000mm first floor',
        'Structural Slab': '200mm Two-Way Post-Tensioned Flat Plate',
        'MEP Plenum Void': '450mm acoustic drop zone',
        'Stair Tread / Riser': '300mm tread / 165mm riser (comfort ratio 630mm)'
      },
      keyTakeaway: 'Coordinating structural slab drops in the section drawing prevents on-site surprises where ductwork drops below door frames.'
    },

    problemSolution: {
      problemTitle: 'Critical Section Flaw: Inadequate Stair Headroom & Missing DPC',
      problemDescription: 'Contractors discover on site that the upper floor slab encroaches over the stair landing, reducing clear headroom to 1,750mm and violating safety codes.',
      problemImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      possibleCauses: [
        'Calculating stair tread runs without accounting for the upper slab edge beam depth',
        'Omitting damp proof course (DPC) line at plinth level in the foundation detail',
        'Drawing ceilings without modeling duct crossings and lighting recesses'
      ],
      solutionTitle: 'Slab Opening Trimming & Continuous Waterproofing Detail',
      solutionDescription: 'Recess the upper slab edge trimmer beam back by at least 2 treads to maintain > 2,100mm clear vertical headroom throughout the stair flight.',
      solutionImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Always draft an imaginary 2,000mm vertical clearance line along the stair rake slope to catch header beam clashes.'
    },

    engineeringTips: [
      'Ensure roof waterproofing membrane turns up the parapet wall by a minimum of 300mm before being anchored in a raggle groove.',
      'Show weep holes and subterranean drainage pipes behind retaining walls on basement section cuts.',
      'Verify that thermal insulation is continuous from exterior wall to roof slab to prevent cold thermal bridging.'
    ],
    relevantCodesAndStandards: ['IBC Section 1011 (Stairways)', 'BS 5395 (Stairs, Ladders and Walkways)', 'ACI 318 (Building Code for Structural Concrete)'],
    relatedTopicIds: ['arch-floor-plan', 'struct-beam-rebar', 'struct-column-reinforcement', 'mep-hvac-ducts']
  },

  // =========================================================================
  // 4. STRUCTURAL - FOUNDATION & FOOTINGS
  // =========================================================================
  {
    id: 'struct-foundation-footing',
    slug: 'structural-footing-foundation-design-and-rebar-detailing',
    title: 'RCC Footing & Foundation: Soil Bearing, Rebar Mesh & Column Starter Bars',
    category: 'Structural Engineering',
    subCategory: 'Substructure',
    oneLineSummary: 'Comprehensive engineering guide to isolated, combined, and raft foundations: soil bearing capacity calculation, two-way shear punching checks, and starter bar lap lengths.',
    author: 'Er. Fiza Hayat & Structural Engineering Division',
    readTime: '7 min read',
    publishDate: '2026-03-18',
    tags: ['Foundation', 'Footing', 'RCC', 'Rebar Mesh', 'Soil Mechanics', 'Structural Engineering'],
    heroImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1600&q=80',
    heroImageAlt: 'Heavy reinforced concrete foundation footing construction site with steel rebar mesh cage',
    heroBadge: 'Structural Core',

    quickOverview: [
      'Footing area = Total Column Axial Load (including 10% self-weight) / Safe Bearing Capacity (SBC) of soil.',
      'Punching shear (two-way shear) occurs at a critical perimeter d/2 from the column face and dictates footing thickness.',
      'Bottom rebar mesh must have a minimum clear cover of 50mm (or 75mm if poured against unformed ground).',
      'Column starter bars (dowels) must extend into the footing with standard 90-degree development hooks resting on the bottom mesh.'
    ],

    whatIsIt: {
      description: 'An RCC footing is a structural substructure element that transmits concentrated loads from columns and walls down to the underlying soil or bedrock at pressures that do not exceed the soil\'s Safe Bearing Capacity (SBC), while preventing uneven differential settlement.',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Structural detail diagram of isolated RCC footing showing reinforcement cage and column dowel hooks',
      diagramCaption: 'Section through isolated trapezoidal footing showing bottom flexural mesh, 75mm clear cover, column starter bars, and PCC bed.'
    },

    stepsTitle: 'Step-by-Step RCC Footing Construction & Inspection',
    steps: [
      {
        stepNumber: 1,
        title: 'Excavation & Plain Cement Concrete (PCC) Sub-Base',
        description: 'Excavate to hard strata per geotechnical report. Compact the soil and pour a 100mm lean concrete (PCC 1:4:8 or M10) leveling bed to provide a clean, dry working surface.',
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Foundation pit excavation with leveled PCC sub-base poured',
        tips: ['Never place structural reinforcement directly on raw earth; PCC protects rebar from ground moisture.']
      },
      {
        stepNumber: 2,
        title: 'Lay Bottom Rebar Mesh with Concrete Cover Blocks',
        description: 'Place deformed high-yield rebar (Fe 500 / Grade 60) in both directions. Space bars using heavy-duty precast 50mm or 75mm concrete cover blocks.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Steel reinforcement mesh tied with binding wire on foundation footing bed',
        tips: ['Use cover blocks matching the structural concrete grade; never use broken bricks or wood scraps.']
      },
      {
        stepNumber: 3,
        title: 'Position Column Starter Dowels & Stirrups',
        description: 'Center the column reinforcement cage over the footing. Flare starter bar tails outward with 90-degree hooks (minimum 300mm length) securely tied to the bottom mesh.',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Column starter dowel bars secured vertically inside footing reinforcement cage',
        tips: ['Add at least 3 column lateral ties inside the footing depth to prevent dowel displacement during casting.']
      },
      {
        stepNumber: 4,
        title: 'Concrete Pouring, Compaction & Wet Curing',
        description: 'Pour M25/M30 grade concrete continuously. Use needle vibrators (60mm diameter) to eliminate honeycombs around rebar, followed by 14 days of continuous pond curing.',
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Pouring and vibrating concrete in foundation footing with pump pipe',
        tips: ['Avoid over-vibrating beyond 15 seconds in one spot to prevent aggregate segregation and surface bleed water.']
      }
    ],

    practicalExample: {
      title: 'Isolated Footing for 5-Story Residential Frame',
      description: 'Design of an isolated pad footing supporting an internal column with an axial load of 1,200 kN on soil with SBC of 200 kN/m².',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Cast concrete pad footing with column pier protruding ready for backfilling',
      specifications: {
        'Footing Size': '2.6m x 2.6m x 600mm depth',
        'Concrete Grade': 'M30 (30 MPa characteristic compressive strength)',
        'Steel Grade': 'Fe 500D (Yield strength 500 N/mm²)',
        'Reinforcement': 'T16 @ 150mm c/c both ways bottom mesh',
        'Clear Cover': '75mm against unformed ground'
      },
      keyTakeaway: 'Adequate footing depth (600mm) satisfies punching shear without requiring costly diagonal shear stirrups.'
    },

    problemSolution: {
      problemTitle: 'Catastrophic Defect: Punching Shear Failure & Rebar Corrosion',
      problemDescription: 'Inadequate footing thickness causes the column to punch directly through the foundation slab under heavy load, causing sudden building tilt. Inadequate concrete cover allows groundwater salts to oxidize rebar.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: [
        'Calculating one-way beam shear while neglecting two-way punching shear stress',
        'Using 20mm cover blocks instead of required 75mm substructure ground cover',
        'Pouring concrete directly over mud or uncompacted loose backfill'
      ],
      solutionTitle: 'Punching Shear Verification & Substructure Waterproofing',
      solutionDescription: 'Ensure nominal shear stress τv < 0.25√fck at d/2 perimeter. Apply bituminous or crystalline waterproofing membranes to all foundation faces before backfilling with granular soil.',
      solutionImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Always check that column starter dowel development length Ld ≥ 48 x bar diameter into the footing body.'
    },

    beforeAfter: {
      title: 'Foundation Integrity: Porous Honeycombed Footing vs Solid Cast Concrete',
      beforeImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
      beforeLabel: 'Before: Honeycombed & Corroded',
      beforeNotes: 'Exposed rebar, inadequate cover, soil contamination inside the footing concrete core.',
      afterImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1000&q=80',
      afterLabel: 'After: Dense M30 Pour with Bitumen Coat',
      afterNotes: 'Zero voids, 75mm clear cover blocks, sealed with heavy-duty elastomeric bituminous primer.'
    },

    engineeringTips: [
      'If two adjacent footings overlap by more than 20% of their area, combine them into a single continuous combined or strap footing.',
      'Check for expansive clay soils (Black Cotton Soil): require minimum 1.5m depth or under-reamed pile foundations.',
      'Always order slump tests (100–120mm for pumpable mixes) and cast 6 test cubes per 50 m³ of foundation concrete.'
    ],
    relevantCodesAndStandards: ['IS 456:2000 (Plain and Reinforced Concrete)', 'ACI 318-19 (Structural Concrete Building Code)', 'BS 8004 (Code of Practice for Foundations)'],
    relatedTopicIds: ['struct-column-reinforcement', 'struct-beam-rebar', 'civil-site-grading', 'software-etabs']
  },

  // =========================================================================
  // 5. STRUCTURAL - COLUMN REINFORCEMENT & TIES
  // =========================================================================
  {
    id: 'struct-column-reinforcement',
    slug: 'rcc-column-reinforcement-longitudinal-bars-and-confinement-ties',
    title: 'RCC Column Reinforcement: Longitudinal Steel, Seismic Ties & Lap Splices',
    category: 'Structural Engineering',
    subCategory: 'Superstructure',
    oneLineSummary: 'Essential structural guide to column detailing: steel percentage limits (0.8% to 6%), seismic confinement tie spacing, 135° hook bends, and mid-height lap splices.',
    author: 'Er. Fiza Hayat & Structural Engineering Division',
    readTime: '6 min read',
    publishDate: '2026-03-19',
    tags: ['Column', 'RCC', 'Rebar', 'Seismic Ties', 'Stirrups', 'Structural Detailing'],
    heroImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1600&q=80',
    heroImageAlt: 'Vertical reinforced concrete column steel cage with closely spaced seismic lateral ties',
    heroBadge: 'Structural Detail',

    quickOverview: [
      'Longitudinal steel ratio must be between 0.8% (minimum for creep/shrinkage) and 4% (practical maximum to prevent congestion).',
      'Lateral ties must terminate in 135-degree seismic hooks with a minimum 10d (or 75mm) extension into the core.',
      'Column lap splices must be staggered and located in the middle half of clear column height, NEVER within the plastic hinge zone near beam-column joints.',
      'Tie spacing must be reduced (typically ≤ 100mm c/c) over a distance of \'lo\' (greater of column depth or H/6) near joints.'
    ],

    whatIsIt: {
      description: 'An RCC column is a vertical structural member subjected primarily to axial compressive forces, often combined with bending moments caused by wind, earthquakes, or eccentric gravity loads. Longitudinal rebar carries tensile and excess compressive stresses, while lateral ties prevent rebar buckling and provide vital concrete core confinement during seismic events.',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Cross section of rectangular and circular RCC column detailing longitudinal bars and confinement ties',
      diagramCaption: 'Column cross-section showing 8-T20 main bars, 40mm clear cover, 8mm master tie, and internal diamond cross-tie with 135° hooks.'
    },

    stepsTitle: 'How to Assemble and Inspect Column Reinforcement',
    steps: [
      {
        stepNumber: 1,
        title: 'Check Bar Count & Diameters Against Schedule',
        description: 'Verify the structural drawing: ensure exact bar counts (minimum 4 for rectangular columns, 6 for circular columns) and bar sizes (e.g., 4-T25 corner + 4-T20 face bars).',
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Structural engineer inspecting rebar diameter and count on column steel cage',
        tips: ['Use a vernier caliper to spot-check rebar diameters before tying.']
      },
      {
        stepNumber: 2,
        title: 'Bend Lateral Ties with 135° Seismic Hooks',
        description: 'Fabricate stirrup ties with 135-degree inward hooks. Never allow contractors to bend ties at 90 degrees, which pop open under earthquake cyclic loading.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Bending rebar stirrup ties with accurate 135 degree hook extensions',
        tips: ['Alternate hook positions around the column corners to prevent creating a continuous line of weakness.']
      },
      {
        stepNumber: 3,
        title: 'Space Ties According to Confining Zone Rules',
        description: 'Set tie spacing to 75mm–100mm in the critical end zones (top and bottom 600mm of column height). Expand tie spacing to 150mm–200mm in the middle zone.',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Variable tie spacing along column vertical height showing dense end confinement',
        tips: ['Securely tie every intersection with double-strand galvanized binding wire.']
      },
      {
        stepNumber: 4,
        title: 'Attach Concrete Cover Spacers & Align Formwork',
        description: 'Fasten 40mm circular concrete cover spacers on all 4 faces at 1-meter vertical intervals to guarantee adequate fire and corrosion protection.',
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Circular concrete cover wheel spacers clipped onto column rebar cage',
        tips: ['Check column plumbness with a heavy plumb bob before and after clamping steel column shuttering.']
      }
    ],

    practicalExample: {
      title: 'Corner Column in Seismic Zone IV Commercial Tower',
      description: '450mm x 600mm column carrying 2,800 kN axial force and 140 kN-m biaxial bending moment, detailed to ductile earthquake standards (IS 13920 / ACI 318 Chapter 18).',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'High-density seismic column reinforcement installed in commercial multi-story building',
      specifications: {
        'Column Dimensions': '450mm x 600mm',
        'Main Reinforcement': '8 nos. T25 (Fe 500D) - 1.45% steel ratio',
        'Confinement Stirrups': 'T10 @ 80mm c/c in plastic hinge zone; T10 @ 150mm c/c mid-span',
        'Concrete Grade': 'M35 Self-Compacting Concrete (SCC)'
      },
      keyTakeaway: 'Closely spaced confinement ties increase the compressive ductility of concrete by over 300% under severe lateral ground motions.'
    },

    problemSolution: {
      problemTitle: 'Fatal Flaw: 90° Stirrup Openings & Lap Splicing at Floor Joint',
      problemDescription: 'Ties with 90-degree bends unwrap during earthquake shaking, causing main vertical bars to buckle outward like a birdcage and leading to instant building collapse.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: [
        'Contractors taking shortcuts with site rebar bending machines',
        'Lapping 100% of column bars at the floor level where bending moments are at maximum',
        'Omitting internal cross-ties when column face width exceeds 300mm'
      ],
      solutionTitle: 'Ductile Detailing with 135° Hooks & Staggered Mid-Splices',
      solutionDescription: 'Enforce 135° hook bends with 10d tails. Splice bars only in the middle zone (between H/4 and 3H/4) with minimum 50d lap length, and stagger splices by at least 600mm.',
      solutionImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Use mechanical rebar couplers instead of lap splices for bars larger than 25mm diameter to prevent rebar congestion.'
    },

    beforeAfter: {
      title: 'Column Reinforcement: Non-Ductile 90° Stirrup vs Seismic 135° Confinement',
      beforeImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
      beforeLabel: 'Before: Non-Compliant 90° Ties',
      beforeNotes: 'Wide 250mm spacing throughout, 90° open hooks, bars bunched without spacer blocks.',
      afterImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1000&q=80',
      afterLabel: 'After: Ductile Seismic Confinement',
      afterNotes: '135° hooks alternating corners, 75mm spacing near joint, 40mm heavy-duty cover blocks.'
    },

    engineeringTips: [
      'Maximum longitudinal bar spacing around the column perimeter should not exceed 300mm.',
      'Ensure clear spacing between adjacent parallel bars is at least the maximum aggregate size + 5mm (typically 25mm–30mm).',
      'Always clean the column base (hack off latency, remove sawdust, apply cement slurry) before placing the next lift of concrete.'
    ],
    relevantCodesAndStandards: ['IS 13920:2016 (Ductile Design and Detailing of RCC)', 'ACI 318-19 Section 10 & 25', 'Eurocode 2: EN 1992-1-1'],
    relatedTopicIds: ['struct-foundation-footing', 'struct-beam-rebar', 'software-etabs', 'software-staad']
  },

  // =========================================================================
  // 6. STRUCTURAL - BEAM REBAR & SHEAR STIRRUPS
  // =========================================================================
  {
    id: 'struct-beam-rebar',
    slug: 'rcc-beam-reinforcement-detailing-flexure-shear-stirrups',
    title: 'RCC Beam Detailing: Top/Bottom Flexural Bars, Shear Stirrups & Anchorage',
    category: 'Structural Engineering',
    subCategory: 'Superstructure',
    oneLineSummary: 'Master RCC beam reinforcement: tension rebar at mid-span, negative rebar over supports, shear stirrup spacing calculations, and development length into columns.',
    author: 'Er. Fiza Hayat & Structural Engineering Division',
    readTime: '6 min read',
    publishDate: '2026-03-20',
    tags: ['Beam', 'RCC', 'Shear Stirrups', 'Flexure', 'Rebar Detailing', 'Structural Engineering'],
    heroImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1600&q=80',
    heroImageAlt: 'Overhead view of heavily reinforced concrete beam and slab rebar mesh ready for concrete casting',
    heroBadge: 'Structural Detail',

    quickOverview: [
      'Positive bending (sagging) causes tension at the bottom of mid-span; negative bending (hogging) causes tension at the top over supports.',
      'Shear stress is highest near column supports and decreases toward the center, dictating closer stirrup spacing at beam ends.',
      'Beam main longitudinal rebar must anchor into column cores with development length Ld (typically 48d to 50d) plus 90° downward hooks.',
      'Minimum clear concrete cover for beams is 25mm (or bar diameter, whichever is greater).'
    ],

    whatIsIt: {
      description: 'An RCC beam is a horizontal structural element designed primarily to resist lateral bending moments and vertical shear forces transferred from floor slabs, walls, and superimposed live loads. Top and bottom high-yield steel bars resist bending stresses, while vertical two-legged or four-legged stirrups resist diagonal shear tension cracks.',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Longitudinal profile and cross sections of RCC continuous beam showing top curtailment and shear stirrup spacing',
      diagramCaption: 'Longitudinal beam elevation showing bottom bars continuous through supports, top negative bars curtailed at L/3, and dense shear links near columns.'
    },

    stepsTitle: 'Beam Reinforcement Placement & Inspection Sequence',
    steps: [
      {
        stepNumber: 1,
        title: 'Verify Bottom Tension Rebar & Spacers',
        description: 'Place main tension bars on beam bottom formwork. If multiple layers are required, use 25mm spacer cross-bars between layers to allow concrete flow.',
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Bottom rebar layers spaced with steel spacer pins inside beam shuttering',
        tips: ['Ensure bottom bars extend at least 150mm past column centerline into the support.']
      },
      {
        stepNumber: 2,
        title: 'Position Shear Stirrups (Links)',
        description: 'Slide two-legged stirrups over bottom bars. Position first stirrup no further than 50mm from the column face, followed by dense spacing (e.g., 100mm c/c) for length 2d.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Worker tying vertical stirrup links with uniform spacing along beam cage',
        tips: ['Alternate stirrup closure hooks between left and right top corners to distribute anchorage grip.']
      },
      {
        stepNumber: 3,
        title: 'Insert Top Negative Rebar Over Columns',
        description: 'Thread top bars through column cages. Extend extra negative bars at least 0.30L (one-third of clear span) past the column face into each adjacent span.',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Top negative rebar crossing column node into adjacent beam spans',
        tips: ['Tie top hanger bars (minimum 2-T12) to hold stirrups firmly in position.']
      },
      {
        stepNumber: 4,
        title: 'Check Beam-Column Joint Anchorage & Ties',
        description: 'Verify that beam bars pass inside column vertical bars and terminate with a 90-degree hook inside the far column face. Maintain column ties inside the joint void.',
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Reinforcement intersection at beam-column joint showing horizontal confinement ties',
        tips: ['Never omit column ties inside the beam-column joint; this is where seismic shear failure occurs.']
      }
    ],

    practicalExample: {
      title: 'Continuous Perimeter Spandrel Beam (300mm x 600mm)',
      description: 'A 6.5-meter clear span continuous beam supporting a 150mm two-way slab and 200mm exterior brick wall load, engineered for high ductility and serviceability deflection limits.',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Perimeter spandrel beam reinforcement cage integrated into floor slab deck',
      specifications: {
        'Beam Cross-Section': '300mm width x 600mm total depth',
        'Mid-Span Bottom Steel': '3 nos. T20 (Fe 500D)',
        'Support Top Steel': '4 nos. T20 (2 continuous + 2 extra curtailed at 0.3L)',
        'Shear Stirrups': '2L-T8 @ 100mm c/c for first 1.2m; 2L-T8 @ 175mm c/c at mid-span',
        'Nominal Clear Cover': '25mm with high-density fiber-reinforced concrete blocks'
      },
      keyTakeaway: 'Curtailing 50% of top bars past 0.3L saves up to 18% of beam steel tonnage without reducing safety margins.'
    },

    problemSolution: {
      problemTitle: 'Severe Beam Failure: 45° Diagonal Shear Cracking Near Column',
      problemDescription: 'Wide 45-degree diagonal tension cracks develop near the support face and propagate upward, leading to sudden brittle shear collapse without warning.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: [
        'Excessive stirrup spacing (e.g., spacing links at 250mm where shear force demands 100mm)',
        'Placing the first stirrup 200mm away from the column instead of within 50mm',
        'Inadequate anchorage of stirrup ends causing hooks to pull out under diagonal tension'
      ],
      solutionTitle: 'Engineered Stirrup Spacing & 135° Hook Closures',
      solutionDescription: 'Calculate shear capacity: Vc + Vs ≥ Vu. Provide closed stirrups with 135° hooks spaced at ≤ d/4 in seismic zones, with first stirrup positioned 50mm from support.',
      solutionImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Ensure side-face reinforcement (skin reinforcement) of 0.1% web area is added if total beam depth exceeds 750mm to control torsion cracks.'
    },

    beforeAfter: {
      title: 'Beam Reinforcement: Sagging Beam Congestion vs Clean Staggered Detailing',
      beforeImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
      beforeLabel: 'Before: Congested & Unspaced',
      beforeNotes: 'Rebar touching without horizontal gaps, concrete unable to penetrate, missing joint ties.',
      afterImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1000&q=80',
      afterLabel: 'After: Clean 2-Layer Layout with Spacers',
      afterNotes: '30mm clear horizontal gap between bars, 25mm spacer pins, continuous column joint ties.'
    },

    engineeringTips: [
      'Never weld high-yield deformed bars on site unless they are certified weldable grade (e.g., Fe 500D with controlled carbon equivalent ≤ 0.42%).',
      'If MEP pipes must penetrate a beam, place sleeves strictly in the middle third of the beam span at the neutral axis (mid-depth). Never penetrate near supports.',
      'Check beam deflection span-to-depth ratios: cantilever ≤ 7, simply supported ≤ 20, continuous ≤ 26 for spans up to 10m.'
    ],
    relevantCodesAndStandards: ['IS 456:2000 Clause 26.5.1', 'ACI 318-19 Chapter 9 (Beams)', 'BS 8110 (Structural Concrete)'],
    relatedTopicIds: ['struct-column-reinforcement', 'struct-foundation-footing', 'software-etabs', 'software-autocad']
  },

  // =========================================================================
  // 7. CIVIL ENGINEERING - SITE GRADING & DRAINAGE
  // =========================================================================
  {
    id: 'civil-site-grading',
    slug: 'civil-site-development-grading-contours-and-drainage',
    title: 'Site Development: Topographic Contours, Cut/Fill Grading & Storm Drainage',
    category: 'Civil Engineering',
    subCategory: 'Site Works',
    oneLineSummary: 'Essential civil engineering guide: contour interpolation, balancing earthwork cut and fill volumes, surface swales, and stormwater retention sizing.',
    author: 'Er. Fiza Hayat & Civil Engineering Division',
    readTime: '6 min read',
    publishDate: '2026-03-21',
    tags: ['Civil Engineering', 'Site Development', 'Contour Lines', 'Drainage', 'Earthwork', 'Surveying'],
    heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80',
    heroImageAlt: 'Civil engineering topographic earthwork grading with surveying total station on site',
    heroBadge: 'Civil Infrastructure',

    quickOverview: [
      'Contour lines connect points of equal elevation; spacing indicates slope steepness (close = steep, wide = gentle).',
      'Aim for a balanced cut-and-fill volume on site to eliminate the high expense of exporting or importing haulage soil.',
      'Maintain a minimum 2% (1:50) slope away from building foundations for at least 3 meters (10 ft) to prevent basement water ingress.',
      'Stormwater retention ponds must store peak 10-year or 25-year 24-hour storm runoff volumes based on regional hydrology.'
    ],

    whatIsIt: {
      description: 'Civil site development involves transforming natural raw topography into a functional, stable, and well-drained building pad. It encompasses boundary surveying, contour mapping, cut-and-fill volume calculations, road corridor alignment, and underground storm sewer design to protect human structures from flooding and soil erosion.',
      diagramImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Civil site plan drawing showing topographic contours, spot elevations, and drainage swale arrows',
      diagramCaption: 'Grading plan with existing contours (dashed gray) and proposed finished contours (solid red) indicating swale diversion paths.'
    },

    stepsTitle: 'How to Engineer a Stable Site Grading & Drainage Plan',
    steps: [
      {
        stepNumber: 1,
        title: 'Conduct Topographic Survey with Total Station / LiDAR',
        description: 'Capture spot elevation grids and break-lines (ridges, valleys, curbs, trees). Generate an accurate Digital Terrain Model (DTM) with 0.5m contour intervals.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Surveyor using robotic total station and GPS prism pole on raw terrain',
        tips: ['Establish permanent benchmark (TBM) tied to municipal mean sea level datum.']
      },
      {
        stepNumber: 2,
        title: 'Establish Building Finished Pad Elevation (FPE)',
        description: 'Set building pad at least 450mm–600mm above adjacent 100-year flood road crown level to guarantee gravity runoff away from finished floor entries.',
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Heavy bulldozer grading earthwork to laser-leveled building pad elevation',
        tips: ['Use laser-guided grading blades on earthmovers to achieve ±15mm leveling tolerance.']
      },
      {
        stepNumber: 3,
        title: 'Calculate & Optimize Cut vs Fill Volumes',
        description: 'Use the Average End Area or Civil 3D TIN Surface Volume method. Adjust pad elevation iteratively until net earthwork volume is near zero.',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Civil 3D software showing cut and fill elevation color heat map',
        tips: ['Account for soil compaction shrinkage factor (typically 10%–15% for compacted fills).']
      },
      {
        stepNumber: 4,
        title: 'Design Surface Swales, Catch Basins & Outfalls',
        description: 'Channel overland runoff via parabolic grassed swales (1%–3% longitudinal slope) into perforated catch basins connected to municipal storm mains.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Concrete catch basin and underground corrugated stormwater drainage pipe installation',
        tips: ['Line swales with rip-rap stone or erosion-control geotextile mats where flow velocity exceeds 1.5 m/s.']
      }
    ],

    practicalExample: {
      title: 'Commercial Park 12-Acre Master Grading Scheme',
      description: 'Redevelopment of a sloped 12-acre industrial site balancing 45,000 m³ of cut and fill, with an integrated 3,200 m³ bio-retention wetland basin.',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Engineered commercial site grading with paved parking and bio-swale landscaping',
      specifications: {
        'Total Site Area': '12.4 Acres (50,200 m²)',
        'Net Earthwork Balance': 'Cut 45,200 m³ / Fill 44,800 m³ (Near Zero Export)',
        'Storm Runoff Peak Q': 'Rational Method Q = C x I x A (C = 0.75 post-development)',
        'Retention Pond Volume': '3,200 m³ with gravity control weir'
      },
      keyTakeaway: 'Balancing earthwork cuts and fills on site saved the client $340,000 in soil haulage and landfill disposal tipping fees.'
    },

    problemSolution: {
      problemTitle: 'Civil Failure: Reverse Slope Runoff & Foundation Water Flooding',
      problemDescription: 'Site graded flat or sloping towards the structure causes heavy rains to pond against exterior walls, penetrating basements and softening foundation subgrade soil.',
      problemImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      possibleCauses: [
        'Failing to verify final landscaping topsoil thickness (which often raises perimeter grades by 150mm)',
        'Undersized drainage culverts designed for 2-year rain events instead of 25-year storms',
        'Directing neighboring plot surface runoff directly onto building footings without interceptor swales'
      ],
      solutionTitle: 'Perimeter French Drains & Positive 2% Crown Slope',
      solutionDescription: 'Regrade ground to slope away from walls at minimum 2% for 3 meters. Install a perimeter gravel-wrapped perforated French drain pipe discharging to gravity storm outfalls.',
      solutionImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Always compact backfill in 150mm (6-inch) loose lifts to 95% Standard Proctor density to avoid post-construction settlement.'
    },

    engineeringTips: [
      'Locate underground utility trenches (water, electric, gas, storm) with minimum 1.0m horizontal separation to avoid cross-contamination.',
      'Check retaining wall requirements whenever cut slopes exceed 1:2 (50% slope) in granular soils or 1:1.5 in cohesive soils.',
      'Install silt fences and sediment traps at low points before commencing any major earthmoving operations.'
    ],
    relevantCodesAndStandards: ['AASHTO Geometric Design of Highways and Streets', 'EPA Stormwater Management Manual', 'IS 1498 (Classification of Soils)'],
    relatedTopicIds: ['struct-foundation-footing', 'mep-plumbing-layout', 'software-civil3d', 'arch-floor-plan']
  },

  // =========================================================================
  // 8. INTERIOR DESIGN - LUXURY LIVING ROOM & LIGHTING
  // =========================================================================
  {
    id: 'interior-living-room-lighting',
    slug: 'interior-design-living-room-spatial-layout-and-layered-lighting',
    title: 'Luxury Living Room: Spatial Zones, Furniture Clearance & 3-Tier Lighting',
    category: 'Interior Design',
    subCategory: 'Spatial Layouts',
    oneLineSummary: 'Master interior architecture: conversational seating clusters, ergonomic walkways (900mm), TV viewing angles, and the 3-tier lighting formula (ambient, task, accent).',
    author: 'Ar. Fiza Hayat & Interior Design Studio',
    readTime: '5 min read',
    publishDate: '2026-03-22',
    tags: ['Interior Design', 'Living Room', 'Lighting Design', 'Furniture Layout', '3D Rendering'],
    heroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
    heroImageAlt: 'Modern warm minimalist luxury living room with custom sofa and layered cove lighting',
    heroBadge: 'Interior Architecture',

    quickOverview: [
      'Maintain a minimum 450mm (18 in) distance between coffee table edge and sofa cushion for comfortable legroom.',
      'Primary circulation walkways across the room require 900mm–1000mm (3–3.5 ft) clear passage.',
      'Apply the 3-tier lighting matrix: Ambient (2700K indirect coves), Task (reading lamps 400 lux), and Accent (narrow 24° beam art spots).',
      'Scale area rugs generously: all front legs of sofas and armchairs must rest firmly on the rug to anchor the spatial conversation zone.'
    ],

    whatIsIt: {
      description: 'Luxury living room interior design orchestrates spatial ergonomics, bespoke millwork, tactile material palettes, and architectural lighting to transform a raw architectural volume into an inviting, high-functioning environment for living and entertaining.',
      diagramImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Living room furniture layout dimension plan showing clearance circles and lighting zones',
      diagramCaption: '2D Furniture clearance plan with dimension radii, TV eye-level sightline, and reflected ceiling lighting points.'
    },

    stepsTitle: 'How to Plan an Exemplary Luxury Living Room in 4 Steps',
    steps: [
      {
        stepNumber: 1,
        title: 'Establish the Architectural Focal Point',
        description: 'Identify the anchor wall—whether a floor-to-ceiling travertine fireplace, panoramic glass garden view, or a custom media unit with integrated acoustic timber slats.',
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Modern living room with floor to ceiling honed stone fireplace focal wall',
        tips: ['Orient primary seating towards the view, with secondary seating forming an intimate U or L shape.']
      },
      {
        stepNumber: 2,
        title: 'Draft Furniture Envelopes with Ergonomic Clearances',
        description: 'Maintain 900mm for main entry routes and 450mm between coffee tables and seating. Ensure TV center is placed at seated eye level (approx. 1050mm from FFL).',
        image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Furniture spatial clearance layout showing sofa groupings and side table reach',
        tips: ['For a 75-inch 4K TV, optimal viewing distance is 2.3m to 2.8m.']
      },
      {
        stepNumber: 3,
        title: 'Layer the Reflected Ceiling Lighting Plan (RCP)',
        description: 'Position perimeter warm LED cove strips (2700K, 95+ CRI) for diffuse ambient wash. Add 10W magnetic track spotlights aimed at art and coffee table surfaces.',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Architectural ceiling with concealed LED cove lighting and minimal recessed spotlights',
        tips: ['Separate lighting circuits onto independent 0-10V or DALI dimming channels for distinct mood presets.']
      },
      {
        stepNumber: 4,
        title: 'Curate Material Palette & Acoustic Soft Furnishings',
        description: 'Balance hard reflective surfaces (marble, glass, micro-cement) with sound-absorbing acoustic elements (wool bouclé, velvet, heavy linen drapes, fluted wood paneling).',
        image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Interior designer flat-lay sample board with stone, wood slats, fabric swatches and metal trim',
        tips: ['Aim for an acoustic reverberation time (RT60) of 0.4 to 0.6 seconds for comfortable conversational speech.']
      }
    ],

    practicalExample: {
      title: 'Duplex Penthouse Living Lounge (60 sq.m)',
      description: 'Double-height living space featuring monolithic honed Italian silver travertine, smoked European oak wall paneling, and an integrated modular seating island with 360-degree conversation reach.',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Completed luxury penthouse living room with custom furniture and ambient lighting',
      specifications: {
        'Room Dimensions': '10.0m x 6.0m x 5.8m double-height ceiling',
        'Flooring': 'Large-format (1200x2400mm) Italian Silver Travertine',
        'Lighting Scheme': 'DALI Intelligent 4-Scene Automation (Morning, Evening, Lounge, Cinema)',
        'Color Temperature': '2700K Warm White with CRI 97'
      },
      keyTakeaway: 'Concealing light sources inside architectural reveals makes ceilings appear higher and eliminates harsh glare.'
    },

    problemSolution: {
      problemTitle: 'Common Interior Flaw: The "Furniture Island" with Glaring Downlights',
      problemDescription: 'Centering all furniture too far from walls creates awkward dead space, while a single central grid of harsh 4000K downlights causes unflattering shadows on human faces.',
      problemImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      possibleCauses: [
        'Pushing all seating against perimeter walls or floating a tiny rug in the center',
        'Relying exclusively on direct downward spotlights instead of indirect vertical wall washing',
        'Buying cool-white commercial bulbs that make luxurious natural materials look cold and sterile'
      ],
      solutionTitle: 'Anchored Zonal Seating & Perimeter Warm Wall-Washing',
      solutionDescription: 'Size the rug to anchor all seating pieces. Replace harsh center spotlights with continuous indirect LED cove perimeter lighting and low-level floor lamps.',
      solutionImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Never place downlights directly over human seating heads; position them to wash walls or illuminate tabletop surfaces.'
    },

    beforeAfter: {
      title: 'Living Room Transformation: Bare Frigid Space vs Warm Minimalist Luxury',
      beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
      beforeLabel: 'Before: Cold & Disconnected',
      beforeNotes: 'Exposed wires, harsh 5000K bulb, undersized rug, cramped furniture walkway.',
      afterImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
      afterLabel: 'After: Warm Layered Sophistication',
      afterNotes: 'Custom oak wall unit, concealed 2700K cove, 1200mm walkway, sound-absorbing wool bouclé.'
    },

    engineeringTips: [
      'Locate electrical wall sockets 300mm above finished floor level, with dedicated high-amperage outlets inside TV credenzas.',
      'Ensure acoustic door sweeps and acoustic insulation are placed in partition walls between home theaters and bedrooms.',
      'Provide a 100mm recessed curtain pocket in the false ceiling to completely hide motorized motorized drapery tracks.'
    ],
    relevantCodesAndStandards: ['IESNA Lighting Handbook (Recommended Illuminance Levels)', 'CIBSE Code for Lighting', 'ADA Standards for Accessible Design'],
    relatedTopicIds: ['arch-floor-plan', 'mep-electrical-schematic', 'software-3dsmax', 'software-sketchup']
  },

  // =========================================================================
  // 9. MEP SYSTEMS - HVAC DUCTWORK & AIR DISTRIBUTION
  // =========================================================================
  {
    id: 'mep-hvac-ducts',
    slug: 'mep-hvac-ductwork-design-sizing-and-diffuser-placement',
    title: 'HVAC Ductwork Engineering: Airflow CFM, Duct Sizing & Diffuser Placement',
    category: 'MEP Systems',
    subCategory: 'Mechanical Systems',
    oneLineSummary: 'Complete mechanical engineering guide: calculating cooling load (CFM), Equal Friction duct sizing method, aspect ratio limits, and acoustic silencer placement.',
    author: 'Er. Fiza Hayat & MEP Engineering Division',
    readTime: '6 min read',
    publishDate: '2026-03-23',
    tags: ['HVAC', 'MEP Systems', 'Duct Sizing', 'Mechanical Engineering', 'Air Conditioning', 'Revit MEP'],
    heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80',
    heroImageAlt: 'Industrial galvanized sheet metal HVAC ductwork installation in ceiling plenum',
    heroBadge: 'MEP Engineering',

    quickOverview: [
      'Airflow rule of thumb: 1 Ton of refrigeration = 12,000 BTU/hr = approx. 400 CFM (Cubic Feet per Minute).',
      'The Equal Friction Method (typically 0.08 to 0.10 in. wg per 100 ft of duct) is the industry standard for commercial duct sizing.',
      'Keep rectangular duct aspect ratios (Width : Depth) below 4:1 to avoid high turbulence friction and vibration noise.',
      'Maintain maximum air velocities: main trunk duct ≤ 1,200 FPM (commercial), branch run-outs ≤ 800 FPM, and diffusers ≤ 500 FPM.'
    ],

    whatIsIt: {
      description: 'An HVAC air distribution system conveys conditioned (cooled or heated) air from Air Handling Units (AHUs) or Fan Coil Units (FCUs) through sealed ductwork networks, distributing it evenly into occupied rooms through linear slot diffusers, swirl grilles, or perforated registers, while returning stale air back to the plant.',
      diagramImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Revit MEP 3D model drawing showing supply air duct in blue and return air duct in magenta with diffusers',
      diagramCaption: 'Coordinated HVAC layout showing supply trunk sizing, acoustic flexible duct transitions, and ceiling diffuser throw patterns.'
    },

    stepsTitle: 'How to Size and Route HVAC Ductwork in 4 Steps',
    steps: [
      {
        stepNumber: 1,
        title: 'Calculate Thermal Space Heat Gain & Total CFM',
        description: 'Perform cooling load calculation (ASHRAE RTS Method) factoring solar glass heat gain, occupant sensible heat (75W/person), and equipment loads to determine required room CFM.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Mechanical engineer calculating thermal load parameters on workstation',
        tips: ['Use formula: CFM = Sensible Heat (BTU/hr) / (1.08 x ΔT), where ΔT is room temp minus supply air temp.']
      },
      {
        stepNumber: 2,
        title: 'Size Ducts Using Ductulator or Equal Friction Rule',
        description: 'Input CFM and friction rate (0.1 in. wg/100 ft) into a standard ductulator. Select rectangular dimensions that fit within the architectural ceiling void without exceeding 3:1 aspect ratio.',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Galvanized sheet metal rectangular duct cross section with turning vanes',
        tips: ['Round spiral ducts have 15% lower friction loss than rectangular ducts for equivalent cross-sectional area.']
      },
      {
        stepNumber: 3,
        title: 'Position Diffusers & Verify Air Throw Distances',
        description: 'Locate supply diffusers so their air throw reaches 75% across the room without colliding with opposing jets or washing directly against exterior glass windows.',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Architectural linear slot diffuser integrated into modern false ceiling reveal',
        tips: ['Maintain a minimum 1.8m separation between supply diffusers and return air grilles to prevent short-circuiting.']
      },
      {
        stepNumber: 4,
        title: 'Incorporate Fire Dampers & Acoustic Silencers',
        description: 'Install UL-listed motorized fire/smoke dampers wherever ductwork crosses rated 1-hour or 2-hour fire barriers. Place acoustic duct attenuators immediately downstream of fans.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Motorized fire smoke damper installed inside galvanized duct crossing concrete firewall',
        tips: ['Ensure access doors are detailed directly beneath fire dampers for annual maintenance testing.']
      }
    ],

    practicalExample: {
      title: 'Commercial Executive Boardroom HVAC Design',
      description: 'Low-noise (NC-25) air distribution system for a 24-person conference room requiring 1,600 CFM conditioned air delivered via continuous architectural linear slot diffusers.',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Finished corporate boardroom with flush linear slot diffuser integrated into ceiling architecture',
      specifications: {
        'Room Airflow': '1,600 CFM (4.0 Tons cooling capacity)',
        'Main Trunk Size': '500mm x 250mm Galvanized Iron (GI) 22-Gauge',
        'Noise Criterion': 'NC-25 (Acoustic silencer with 50mm fiberglass lining)',
        'Diffuser Type': 'Continuous 3-Slot Linear Diffusers (150mm width x 4m length)'
      },
      keyTakeaway: 'Limiting diffuser neck air velocity to 400 FPM achieves whisper-quiet NC-25 acoustics essential for teleconferencing.'
    },

    problemSolution: {
      problemTitle: 'HVAC Failure: Excessive Duct Whistle Noise & Air Short-Circuiting',
      problemDescription: 'Occupants complain of loud whistling noise from vents, while one side of the room remains freezing cold and the far corner stays stuffy and warm.',
      problemImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      possibleCauses: [
        'Air velocity exceeding 1,500 FPM due to abrupt duct neck pinch without smooth transitions',
        'Placing return grilles right next to supply diffusers, sucking cold air out before it mixes',
        'Missing aerodynamic turning vanes in 90-degree square duct elbows causing vortex turbulence'
      ],
      solutionTitle: 'Turning Vanes, Diffuser Separation & Acoustic Flexible Runouts',
      solutionDescription: 'Install double-wall turning vanes in all sharp elbows. Limit flexible duct run-outs to maximum 1.5m length with smooth bends, and space return grilles across the room.',
      solutionImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Always seal all transverse duct joints with UL 181A mastic paste and fiberglass mesh to achieve SMACNA Class A air tightness (< 1% leakage).'
    },

    beforeAfter: {
      title: 'HVAC Installation: Leaky Sagging Ducts vs SMACNA Sealed Rigid Ductwork',
      beforeImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
      beforeLabel: 'Before: Kinked & Uninsulated',
      beforeNotes: 'Long sagging flex ducts (3m+), unsealed tape peeling off, heavy condensation dripping.',
      afterImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
      afterLabel: 'After: Rigid GI Ducts with Foil Insulation',
      afterNotes: '50mm closed-cell nitrile insulation, rigid trapeze hangers @ 2.4m, mastic sealed joints.'
    },

    engineeringTips: [
      'Wrap all cold supply air ducts with closed-cell elastomeric or foil-faced mineral wool insulation (minimum R-6) to prevent condensation sweating.',
      'Check structural beam depths early in 3D BIM coordination to ensure ductwork never clashes with structural girders.',
      'Provide manual volume control dampers (VCD) with locking quadrant handles on every branch take-off for air balancing (TAB).'
    ],
    relevantCodesAndStandards: ['ASHRAE Standard 62.1 (Ventilation for Acceptable Indoor Air Quality)', 'SMACNA HVAC Duct Construction Standards', 'NFPA 90A (Installation of Air Conditioning and Ventilating Systems)'],
    relatedTopicIds: ['arch-section', 'struct-beam-rebar', 'software-revit', 'ms-defect-sheet-metal']
  },

  // =========================================================================
  // 10. SOFTWARE - AUTOCAD
  // =========================================================================
  {
    id: 'software-autocad',
    slug: 'autocad-architectural-drafting-layer-standards-and-xrefs',
    title: 'Autodesk AutoCAD: Professional 2D Architectural Drafting & Layer Management',
    category: 'CAD & Software',
    subCategory: '2D Drafting',
    oneLineSummary: 'Master production AutoCAD workflows: AIA layer naming standards, dynamic blocks with stretch parameters, external reference (Xref) coordination, and paper space viewports.',
    author: 'Er. Fiza Hayat & CAD Division',
    readTime: '6 min read',
    publishDate: '2026-03-24',
    tags: ['AutoCAD', 'CAD & Software', '2D Drafting', 'Working Drawings', 'Layers', 'Xrefs'],
    heroImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
    heroImageAlt: 'AutoCAD technical drawing interface displaying floor plan blueprint with color-coded layers',
    heroBadge: 'Software Guide',

    quickOverview: [
      'Model Space is always 1:1 scale (1 unit = 1 mm or 1 inch); scaling is handled exclusively in Paper Space layout viewports.',
      'Adopt AIA Layer Naming conventions: A-WALL-FULL (Walls), A-DOOR (Doors), A-GLAZ (Windows), S-COLS (Columns), M-DUCT (MEP).',
      'Use Dynamic Blocks with stretch actions and visibility states to reduce library bloat by over 80%.',
      'Overlay multi-discipline drawings using External References (XREFs) set to "Overlay" rather than "Attach" to prevent circular reference loops.'
    ],

    whatIsIt: {
      description: 'Autodesk AutoCAD is the global industry benchmark for precision computer-aided drafting (CAD). It enables architects, structural engineers, and fabricators to create geometrically exact 2D vector working drawings, fabrication details, dimensioned floor plans, and schedules.',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'AutoCAD user interface showing drawing canvas, command line, layer properties manager, and tool palette',
      diagramCaption: 'AutoCAD 2026 workspace showing model tab, color-dependent plot style (CTB) manager, and Xref tree.'
    },

    stepsTitle: 'Core Production AutoCAD Workflow in 4 Steps',
    steps: [
      {
        stepNumber: 1,
        title: 'Setup Units, Limits & Standard Layer Template',
        description: 'Set drawing units to Millimeters (or Architectural feet/inches). Load your studio standard DWT template with pre-configured AIA layers, linetypes, and text styles.',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'AutoCAD Layer Properties Manager dialogue window with standardized color coding',
        tips: ['Assign colors by layer (BYLAYER); never override individual entity colors manually.']
      },
      {
        stepNumber: 2,
        title: 'Draft Geometry Using Snaps & Construction Guides',
        description: 'Utilize Object Snaps (OSNAP: Endpoint, Midpoint, Perpendicular, Intersection) with Object Snap Tracking (F11) to draft exact geometry without guess-clicking.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Cursor snapping precisely to endpoint intersection in AutoCAD workspace',
        tips: ['Use POLYLINE (PL) for continuous wall contours to allow instant area calculations and solid hatch fills.']
      },
      {
        stepNumber: 3,
        title: 'Insert Parametric Dynamic Blocks & Tags',
        description: 'Insert doors and windows as Dynamic Blocks with flip, alignment, and stretch parameters, allowing a single block to fit any opening size effortlessly.',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Dynamic door block being stretched and flipped in AutoCAD drawing',
        tips: ['Attach block attributes (ATTDEF) for automated door/window schedule extraction.']
      },
      {
        stepNumber: 4,
        title: 'Configure Paper Space Viewports & Annotations',
        description: 'Switch to Layout tab. Create rectangular viewports (MVIEW) at standardized scales (1:50, 1:100). Lock viewports and use Annotative dimensions for consistent text sizing.',
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Paper Space title block sheet with multi-scale detail viewports',
        tips: ['Always lock the viewport display property (Display Locked = Yes) to prevent accidental zooming.']
      }
    ],

    practicalExample: {
      title: 'Complete 2-Story Residential Construction Drawing Set',
      description: 'A 14-sheet AutoCAD construction documentation package including architectural plans, elevations, sections, structural foundation layout, and door/window schedules.',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Printed A1 architectural working drawing sheet from AutoCAD layout with title block',
      specifications: {
        'Drawing Format': 'Autodesk DWG 2026 / Exported Vector PDF',
        'Standard Scale': '1:50 Plans, 1:20 Kitchen/Bath details, 1:100 Site Plan',
        'Plot Style': 'Monochrome.ctb (Line weights 0.13mm to 0.70mm)',
        'Layer Standard': 'AIA CAD Layer Guidelines (US National CAD Standard)'
      },
      keyTakeaway: 'Using Annotative Text and Dimensions guarantees that text plotted at 1:50 and 1:20 prints at the exact same 2.5mm readable physical size.'
    },

    problemSolution: {
      problemTitle: 'AutoCAD Disaster: Missing XREFs & Entity Color Overrides',
      problemDescription: 'Opening a drawing sent by a consultant results in missing xref warning popups, while all lines print as a thick black smudge because colors were set to "Color 7" instead of BYLAYER.',
      problemImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      possibleCauses: [
        'Saving XREFs with absolute drive paths (e.g. C:\\Users\\Name\\...) instead of relative paths',
        'Drafters overriding color and line weight directly in the properties panel instead of ByLayer',
        'Exploding blocks and hatch patterns, causing file size to inflate to 150MB+'
      ],
      solutionTitle: 'Set Relative Xref Paths, ByLayer Standards & Run PURGE / AUDIT',
      solutionDescription: 'Run the ETRANSMIT command to bundle all referenced files, fonts, and CTB plot tables into a single clean zip archive. Use SETBYLAYER command to restore standards.',
      solutionImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Run AUDIT and PURGE (-PURGE with "Regapps" option) weekly to remove orphan data and cut file sizes by up to 70%.'
    },

    softwareGuide: {
      softwareName: 'Autodesk AutoCAD',
      discipline: '2D Architectural & Engineering Drafting',
      workspaceImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      heroImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
      whatIsIt: 'The industry-standard precision 2D and 3D computer-aided drafting suite utilized globally for construction documentation and manufacturing schematics.',
      whatCanYouCreate: [
        'Architectural Floor Plans, Elevations, and Sections',
        'Structural Foundation and Reinforcement Schedules',
        'Mechanical, Electrical, and Plumbing (MEP) Schematics',
        'Site Grading and Municipal Submission Drawings',
        'Fabrication and Shop Drawings for Steel and Millwork'
      ],
      drawingExamples: [
        { title: 'Architectural Floor Plan', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80', description: 'Fully dimensioned residential plan with door/window schedule callouts.' },
        { title: 'Structural Section', image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=600&q=80', description: 'RCC beam and column connection detail with rebar hook specifications.' },
        { title: 'MEP Schematic', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80', description: 'Single-line electrical diagram and HVAC duct routing layout.' }
      ],
      keyTools: [
        { name: 'Line / Polyline', shortcut: 'L / PL', purpose: 'Primary vector linework creation with continuous vertices.' },
        { name: 'Offset', shortcut: 'O', purpose: 'Parallel replication of lines for instant wall thickness layout.' },
        { name: 'Trim / Extend', shortcut: 'TR / EX', purpose: 'Quick intersection cleanup and boundary cutting.' },
        { name: 'Dynamic Block Editor', shortcut: 'BEDIT', purpose: 'Configuring parametric stretch, flip, and visibility parameters.' },
        { name: 'External Reference Manager', shortcut: 'XREF', purpose: 'Linking background architectural, structural, or survey base files.' },
        { name: 'Paper Space Viewport', shortcut: 'MVIEW', purpose: 'Creating scaled sheet windows for plotting.' }
      ],
      standardWorkflow: [
        { step: 'Project Inception', details: 'Import survey DXF, align structural grid on 0.00 coordinate origin.' },
        { step: 'Core Drafting', details: 'Draft exterior/interior walls using polylines on dedicated AIA layers.' },
        { step: 'Block Insertion', details: 'Place dynamic doors, windows, structural columns, and furniture blocks.' },
        { step: 'Annotation & Dimensions', details: 'Apply annotative dimension styles, level markers, and room tags.' },
        { step: 'Layout & Publishing', details: 'Set up Paper Space title sheets, link CTB plot style, and batch plot to PDF.' }
      ],
      commonErrors: [
        { error: 'Drawing is sluggish and 100MB+ in size', fix: 'Run -PURGE command with "R" (Regapps) to remove corrupted registry blocks.' },
        { error: 'Lineweights look the same thickness when plotting', fix: 'Enable "Plot with plot styles" in Plot dialogue and verify CTB table mapping.' },
        { error: 'Xref files not found on opening', fix: 'Select all references in XREF palette, right click and choose "Change Path Type -> Relative".' }
      ],
      exampleProject: {
        title: 'Modern High-End Villa Working Drawing Package',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
        summary: 'Complete multi-disciplinary AutoCAD submission package delivering 100% code approval with zero on-site dimensional clashes.'
      },
      relatedSoftware: ['Autodesk Revit', 'Civil 3D', 'AutoCAD Architecture', 'Tekla Structures']
    },

    engineeringTips: [
      'Never place entities on "Defpoints" or Layer "0" for permanent design elements; Layer 0 is strictly for block authoring.',
      'Always maintain UCS (User Coordinate System) aligned with World Coordinates to ensure consultants can cross-reference files accurately.',
      'Use the OVERKILL command periodically to delete duplicate overlapping lines that cause double-printing smudges.'
    ],
    relevantCodesAndStandards: ['US National CAD Standard (NCS v6)', 'ISO 128 (Technical Drawings)', 'BS 1192 (Collaborative Production of Information)'],
    relatedTopicIds: ['software-revit', 'arch-floor-plan', 'arch-elevation', 'struct-beam-rebar']
  },

  // =========================================================================
  // 11. SOFTWARE - AUTODESK REVIT (BIM)
  // =========================================================================
  {
    id: 'software-revit',
    slug: 'autodesk-revit-bim-parametric-modeling-and-clash-detection',
    title: 'Autodesk Revit: BIM Parametric Modeling, Families & Clash Coordination',
    category: 'CAD & Software',
    subCategory: 'BIM Modeling',
    oneLineSummary: 'Essential Revit BIM guide: parametric family creation, Level of Development (LOD 200 to LOD 400), phased modeling, schedules, and multidisciplinary clash detection.',
    author: 'Ar. Fiza Hayat & BIM Engineering Division',
    readTime: '7 min read',
    publishDate: '2026-03-25',
    tags: ['Revit', 'BIM', 'CAD & Software', 'Parametric Modeling', 'Clash Detection', '3D Model'],
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    heroImageAlt: 'Revit BIM 3D model perspective showing integrated architectural curtain wall, structural steel frame and MEP ducts',
    heroBadge: 'BIM Platform',

    quickOverview: [
      'In Revit, you model intelligent building elements (walls, doors, slabs, beams) rich with metadata, not just dumb 2D lines.',
      'Every floor plan, section, elevation, and 3D view is a live dynamic window into a single unified database.',
      'Level of Development (LOD) standards range from LOD 100 (conceptual massing) up to LOD 400 (fabrication-ready shop models).',
      'Clash detection in Navisworks or Revit Interference Check identifies pipe/beam collisions months before ground breaking.'
    ],

    whatIsIt: {
      description: 'Autodesk Revit is the premier Building Information Modeling (BIM) platform worldwide. It unifies architectural design, structural engineering, and MEP systems into a single parametric 3D model where changes to any element automatically synchronize across all plans, elevations, sections, and material schedules in real time.',
      diagramImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Revit multi-discipline BIM model showing structural columns, floor slabs, and HVAC ducts in 3D wireframe',
      diagramCaption: 'Revit 3D coordination view displaying architectural envelope, structural framing, and MEP ductwork without clashes.'
    },

    stepsTitle: 'Building a High-Fidelity Revit BIM Model in 4 Steps',
    steps: [
      {
        stepNumber: 1,
        title: 'Establish Project Base Point, Grids & Levels',
        description: 'Set shared georeferenced coordinates. Establish elevation Levels (Ground Floor, L1, L2, Roof) and create the structural coordinate grid.',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Setting up levels and grids in Revit elevation view',
        tips: ['Lock grid intersections so accidental drag moves do not disrupt linked consultant models.']
      },
      {
        stepNumber: 2,
        title: 'Model Compound Walls & Structural Floors',
        description: 'Configure compound wall assemblies with specific material layers: structure (concrete 200mm), thermal insulation (50mm), air cavity (25mm), and exterior cladding.',
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Revit wall assembly dialog showing composite material layers and thermal properties',
        tips: ['Assign accurate thermal conductivity values to calculate automated whole-building energy models.']
      },
      {
        stepNumber: 3,
        title: 'Build Parametric Families with Shared Parameters',
        description: 'Create custom door, window, and furniture families (.rfa) using reference planes and dimensions tied to shared parameters for automated scheduling.',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Revit Family Editor workspace showing parametric constraints and reference planes',
        tips: ['Keep family geometry lightweight: avoid complex CAD mesh imports that bloat project file size.']
      },
      {
        stepNumber: 4,
        title: 'Run Interference Check & Extract Live Schedules',
        description: 'Run the Interference Check tool between Structural Framing and MEP Ducting. Generate instant door, room finish, and concrete volume schedules.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Revit Interference Check dialogue highlighting clash between steel girder and supply air duct',
        tips: ['Export live clash reports to Navisworks Manage for BCF (BIM Collaboration Format) task tracking with engineers.']
      }
    ],

    practicalExample: {
      title: 'LOD 350 Commercial Hospital Tower BIM Model',
      description: 'A 14-story hospital project in Revit containing over 18,000 coordinated elements. Coordinated architectural envelope, surgical suite MEP layouts, and post-tensioned structural slabs.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Multi-story commercial hospital BIM model cutaway view showing complex building systems',
      specifications: {
        'BIM Level of Development': 'LOD 350 (Model elements modeled with accurate size, shape, and connection interfaces)',
        'Clash Free Coordination': 'Over 1,240 potential site clashes resolved digitally prior to procurement',
        'Model File Size': 'Central model kept below 250MB using worksharing worksets',
        'Software Suite': 'Autodesk Revit 2026, Navisworks Manage, BIM 360 / Construction Cloud'
      },
      keyTakeaway: 'Digital twin BIM coordination reduced on-site construction change orders by 92% compared to traditional 2D workflows.'
    },

    problemSolution: {
      problemTitle: 'BIM Issue: Major Clashes Between Structural Beams & MEP Ducts',
      problemDescription: 'On a traditional 2D site, the contractor discovers that a 600mm main HVAC supply duct collides with a 500mm deep concrete transfer girder, halting work for 2 weeks.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: [
        'Architects and structural engineers working in disconnected 2D CAD files without unified Z-heights',
        'Failing to link structural models into Revit with Shared Coordinates',
        'Neglecting MEP duct insulation thickness when modeling duct bounding boxes'
      ],
      solutionTitle: 'Live Revit Link & Automated Clash Detection Matrix',
      solutionDescription: 'Link the structural model directly into Revit. Run automated Interference Checks weekly. Where penetrations are unavoidable, model reinforced web openings per engineer design.',
      solutionImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Split the model into distinct Worksets (Arch-Exterior, Arch-Interior, Struct-Framing, MEP-HVAC) to enable simultaneous team collaboration.'
    },

    beforeAfter: {
      title: 'BIM Clash Resolution: Uncoordinated Pipe Clash vs Resolved Web Sleeve',
      beforeImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
      beforeLabel: 'Before: Physical Collision',
      beforeNotes: 'HVAC duct intersecting structural steel flange, zero clearance for insulation.',
      afterImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1000&q=80',
      afterLabel: 'After: Coordinated & Sleeved',
      afterNotes: 'Duct rerouted through engineered beam penetration with 50mm acoustic clearance.'
    },

    engineeringTips: [
      'Never import raw SketchUp or 3D DWG meshes directly into Revit project files; always clean them in a family (.rfa) template first.',
      'Maintain Room bounding properties carefully on walls to ensure automatic square footage calculations are accurate.',
      'Compact the Central Model weekly (File -> Save As -> Options -> Compact Central Model) to clean up revision history bloat.'
    ],
    relevantCodesAndStandards: ['ISO 19650 (Organization and Digitization of Information about Buildings/BIM)', 'BIMForum Level of Development (LOD) Specification', 'AIA Document E203 (Building Information Modeling Protocol)'],
    relatedTopicIds: ['software-autocad', 'mep-hvac-ducts', 'struct-beam-rebar', 'arch-floor-plan']
  },

  // =========================================================================
  // 12. MS & SHEET METAL - DEFECTS: RUST, CORROSION & WELDING CRACKS
  // =========================================================================
  {
    id: 'ms-defect-sheet-metal',
    slug: 'mild-steel-and-sheet-metal-defects-rust-cracking-porosity-prevention',
    title: 'Mild Steel & Sheet Metal: Corrosion, Bending Cracks, Welding Defects & Prevention',
    category: 'MS & Sheet Metal',
    subCategory: 'Materials & Quality',
    oneLineSummary: 'Industrial failure analysis guide: identifying rust pitting, minimum bend radius cracking, weld porosity, undercut, and zinc-coating failure with corrective actions.',
    author: 'Er. Fiza Hayat & Metallurgy & Fabrication Division',
    readTime: '7 min read',
    publishDate: '2026-03-26',
    tags: ['Mild Steel', 'Sheet Metal', 'Welding & Defects', 'Corrosion', 'Rust', 'Fabrication'],
    heroImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1600&q=80',
    heroImageAlt: 'Industrial steel fabrication workshop with sparks from welding and sheet metal press brake',
    heroBadge: 'Metallurgy & QC',

    quickOverview: [
      'Atmospheric rust occurs when iron reacts with oxygen and moisture to form hydrated ferric oxide (Fe₂O₃·nH₂O).',
      'Sheet metal bending cracks occur when the internal bend radius (R) is smaller than the minimum allowable radius (typically 1T to 2T of sheet thickness).',
      'Weld porosity is caused by entrapped shielding gas bubbles resulting from contaminated base metal (oil, rust) or windy draft conditions.',
      'Weld undercut is an edge groove melted into the parent plate that was not filled by weld metal, creating severe stress concentration notches.'
    ],

    whatIsIt: {
      description: 'Mild Steel (MS) and sheet metal fabrication encompasses forming, cutting, bending, and welding carbon steel plates, galvanized iron (GI), cold-rolled (CR), and hot-rolled (HR) sheets. Understanding defect mechanisms—from microscopic weld porosity to macroscopic bending tears and galvanic oxidation—is vital for structural safety and lifespan.',
      diagramImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      diagramImageAlt: 'Macro photograph showing welded steel joint cross section with undercut, lack of fusion, and porosity defects labeled',
      diagramCaption: 'Weld cross-section macrograph indicating root gap, heat-affected zone (HAZ), undercut notch, and gas porosity pores.'
    },

    stepsTitle: 'Defect Inspection & Quality Assurance Procedure in 4 Steps',
    steps: [
      {
        stepNumber: 1,
        title: 'Incoming Sheet Metal Thickness & Surface Inspection',
        description: 'Measure sheet gauge thickness with a micrometer. Inspect surface for mill scale, oil contamination, rust pitting, or edge laminations.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Inspector measuring steel sheet thickness with digital micrometer caliper',
        tips: ['Check material test certificates (MTC) for yield strength (minimum 250 MPa for IS 2062 Gr E250 / ASTM A36).']
      },
      {
        stepNumber: 2,
        title: 'Press Brake Bend Radius & Grain Direction Alignment',
        description: 'Always bend sheet metal perpendicular to the rolling grain direction whenever possible. Verify that the punch nose radius R ≥ 1.5 x thickness.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'CNC press brake bending sheet metal panel along precise V-die tool',
        tips: ['Bending parallel to sheet rolling grain increases edge micro-cracking risk by over 400%.']
      },
      {
        stepNumber: 3,
        title: 'Weld Joint Preparation & Shielding Gas Verification',
        description: 'Grind joint edges to clean bright metal for 25mm on both sides. Verify Argon/CO₂ gas flow rate (15–20 L/min) and check for drafts.',
        image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'MIG welding seam on mild steel plate with uniform bead ripple formation',
        tips: ['Use wire brush or acetone to remove all mill scale and lubricants prior to striking the arc.']
      },
      {
        stepNumber: 4,
        title: 'Non-Destructive Testing (Visual, DPT & Magnetic Particle)',
        description: 'Perform visual inspection (VT) with a weld gauge to measure throat thickness. Conduct Dye Penetrant Testing (DPT) on critical joints to reveal surface cracks.',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        imageAlt: 'Red dye penetrant inspection showing micro-cracks on welded steel bracket',
        tips: ['Red bleed indications on white developer powder instantly expose otherwise invisible surface fissures.']
      }
    ],

    practicalExample: {
      title: 'Structural Steel Column Base Plate & Anchor Gusset Assembly',
      description: 'Fabrication of heavy 25mm MS base plates welded to 300 UC column sections using multi-pass flux-cored arc welding (FCAW), detailed to AWS D1.1 structural standards.',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Heavy structural steel column base plate with clean fillet welds and pre-drilled anchor bolt holes',
      specifications: {
        'Steel Grade': 'IS 2062 Grade E250 / ASTM A36 (Killed Carbon Steel)',
        'Welding Process': 'FCAW (Flux-Cored Arc Welding) with E71T-1C wire',
        'Fillet Weld Size': '10mm continuous fillet weld both sides',
        'Protective Coating': 'Hot-Dip Galvanizing (85 microns / 600 g/m²) + Epoxy Primer'
      },
      keyTakeaway: 'Preheating thick 25mm plates to 100°C prior to welding eliminates thermal shock and hydrogen-induced cold cracking.'
    },

    problemSolution: {
      problemTitle: 'Severe Defect: Weld Undercut & Hydrogen Cold Cracking',
      problemDescription: 'Undercut grooving along weld toes reduces effective plate thickness, creating intense stress concentrations that cause sudden brittle fatigue failure under dynamic loads.',
      problemImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      possibleCauses: [
        'Excessive welding voltage and too-fast travel speed drawing an elongated unstable arc',
        'Improper torch angle tilting too far toward the vertical plate',
        'Failure to preheat thick steel plates (> 20mm), trapping diffusible hydrogen in the heat-affected zone'
      ],
      solutionTitle: 'Controlled Travel Speed, Proper Electrode Angle & Preheating',
      solutionDescription: 'Reduce travel speed and pause briefly at the weld toe to allow filler metal to fill the molten groove completely. Maintain a 45-degree torch angle and preheat thick sections.',
      solutionImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      bestPracticeTip: 'Gouge out cracked or deeply undercut welds using carbon-arc gouging or grinding, then re-weld with low-hydrogen electrodes.'
    },

    beforeAfter: {
      title: 'Steel Weld Quality: Defective Porous Undercut vs Sound Full-Penetration Weld',
      beforeImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
      beforeLabel: 'Before: Porous & Undercut',
      beforeNotes: 'Surface pinholes (porosity), sharp undercut notch along toe, spatter contamination.',
      afterImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80',
      afterLabel: 'After: Sound Uniform Weld Bead',
      afterNotes: 'Zero undercut, smooth ripple transition, complete fusion, wire-brushed clean.'
    },

    defectInfo: {
      defectName: 'Weld Undercut & Pinhole Porosity',
      material: 'Mild Steel (IS 2062 / ASTM A36 / CR4)',
      severity: 'Critical',
      normalImage: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      damagedImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      whatHappened: 'A continuous groove was melted into the base metal edge without filler metal compensation, accompanied by clusters of trapped nitrogen/carbon gas bubbles.',
      possibleCauses: [
        'Excessive welding current and excessively high arc travel speed',
        'Wind drafts blowing away protective shielding gas envelope on site',
        'Moisture, rust, cutting oil, or paint remaining on joint edges prior to welding'
      ],
      whatToCheck: [
        'Measure undercut depth with an undercut fillet gauge (maximum allowable is 0.5mm to 1.0mm per AWS D1.1)',
        'Check shielding gas flow rate at the torch nozzle using a portable flowmeter',
        'Perform dye penetrant examination (DPT) to verify if the undercut has formed root micro-cracks'
      ],
      correctiveActions: [
        'Grind out the defective weld zone down to sound parent metal using a grinding disc',
        'Clean surfaces thoroughly with acetone or wire brush',
        'Re-deposit a cosmetic cover pass with slightly lower amperage and a slower side-to-side weave motion'
      ],
      preventionTips: [
        'Erect windbreak barriers around welding stations when working outdoors to protect shielding gas',
        'Store low-hydrogen electrodes (e.g., E7018) in holding ovens at 120°C to keep them completely dry',
        'Ensure proper joint gap: 2mm–3mm root opening with a 2mm root face for complete joint penetration'
      ]
    },

    engineeringTips: [
      'For outdoor structural steel, specify hot-dip galvanizing with minimum 85-micron coating thickness (ISO 1461) for 50+ year maintenance-free lifespan.',
      'Never bend high-strength steel when plate temperature is below 10°C; cold brittle cracking can occur instantaneously.',
      'Always test paint film thickness with a magnetic dry film thickness (DFT) gauge to verify compliance with specification.'
    ],
    relevantCodesAndStandards: ['AWS D1.1 (Structural Welding Code - Steel)', 'ISO 5817 (Quality Levels for Imperfections in Welding)', 'ASTM A123 (Zinc Coatings on Iron and Steel Products)'],
    relatedTopicIds: ['struct-beam-rebar', 'software-autocad', 'software-revit', 'mep-hvac-ducts']
  }
];

// =========================================================================
// SAMPLE DRAWING ANALYSIS DATA FOR THE DRAWING ANALYZER TOOL
// =========================================================================
export const SAMPLE_DRAWING_ANALYSES: DrawingAnalysisSample[] = [
  {
    id: 'sample-floor-plan-1',
    title: 'Executive Residential 3-BHK Floor Plan Analysis',
    drawingType: 'Floor Plan',
    category: 'Architecture',
    originalImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    summary: 'Automated architectural analysis identified 3 non-compliant conditions: a door swing conflict into master bedroom wardrobe, narrow guest toilet circulation (720mm), and missing secondary fire egress from kitchen.',
    issueCount: 3,
    annotations: [
      {
        id: 'ann-1',
        xPercent: 34,
        yPercent: 42,
        widthPercent: 12,
        heightPercent: 10,
        type: 'conflict',
        title: 'Door Swing Conflict with Wardrobe Door',
        severity: 'Medium',
        description: 'Bedroom entrance door swing arc collides with master wardrobe sliding unit by 180mm.',
        recommendation: 'Shift bedroom door frame 200mm towards hallway or utilize a pocket sliding door assembly.',
        codeStandard: 'IBC Section 1008.1.1 (Door Clearance Envelopes)'
      },
      {
        id: 'ann-2',
        xPercent: 68,
        yPercent: 28,
        widthPercent: 10,
        heightPercent: 9,
        type: 'egress',
        title: 'Sub-Standard Hallway Width (720mm)',
        severity: 'High',
        description: 'Passage leading to guest powder room narrows down to 720mm, violating minimum clear width.',
        recommendation: 'Widen hallway to a minimum 900mm (36 in) to allow wheelchair and stretcher accessibility.',
        codeStandard: 'ADA Standards Section 403 (Walking Surfaces)'
      },
      {
        id: 'ann-3',
        xPercent: 82,
        yPercent: 70,
        widthPercent: 11,
        heightPercent: 11,
        type: 'mep',
        title: 'Kitchen Exhaust Duct Conflict with Window Lintel',
        severity: 'Low',
        description: 'Range hood 150mm exhaust vent penetrates structural lintel directly above kitchen window.',
        recommendation: 'Re-route exhaust duct horizontally through dedicated utility chase to exterior wall.',
        codeStandard: 'IMC Section 505 (Domestic Kitchen Exhaust)'
      }
    ]
  },
  {
    id: 'sample-structural-beam-1',
    title: 'Reinforced Concrete Beam-Column Joint Rebar Analysis',
    drawingType: 'Structural Detail',
    category: 'Structural Engineering',
    originalImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=1200&q=80',
    summary: 'Structural inspection engine detected excessive rebar congestion in top beam layer (clear spacing 18mm < 25mm aggregate size), missing joint confinement ties, and insufficient anchorage hook length.',
    issueCount: 3,
    annotations: [
      {
        id: 'ann-s1',
        xPercent: 45,
        yPercent: 35,
        widthPercent: 14,
        heightPercent: 12,
        type: 'structural',
        title: 'Severe Rebar Congestion in Beam Top Layer',
        severity: 'Critical',
        description: 'Horizontal gap between T25 bars is only 18mm. 20mm coarse aggregate will form honeycombs and air voids.',
        recommendation: 'Bundle bars into pairs or place steel in 2 distinct layers separated by 25mm spacer cross-pins.',
        codeStandard: 'IS 456 Clause 26.3.2 / ACI 318 Section 25.2'
      },
      {
        id: 'ann-s2',
        xPercent: 52,
        yPercent: 58,
        widthPercent: 12,
        heightPercent: 14,
        type: 'structural',
        title: 'Missing Column Confinement Ties Inside Joint Core',
        severity: 'Critical',
        description: 'Column ties terminate beneath beam soffit; zero horizontal confinement ties exist inside the beam-column node.',
        recommendation: 'Install at least 3 nos. T10 horizontal ties with 135° hooks inside the joint core depth.',
        codeStandard: 'IS 13920:2016 Clause 8.2 / ACI 318-19 Section 18.8'
      },
      {
        id: 'ann-s3',
        xPercent: 20,
        yPercent: 78,
        widthPercent: 10,
        heightPercent: 8,
        type: 'dimension',
        title: 'Short Development Hook Length (220mm < 300mm)',
        severity: 'Medium',
        description: 'T20 bottom bar 90° anchorage hook into column measures 220mm, failing 16d (320mm) requirement.',
        recommendation: 'Extend vertical hook tail to minimum 320mm into the far side of the column core.',
        codeStandard: 'ACI 318-19 Section 25.4.3 (Standard Hooks)'
      }
    ]
  },
  {
    id: 'sample-mep-clash-1',
    title: 'HVAC Duct & Structural Girder Ceiling Clash Analysis',
    drawingType: 'MEP Ducting',
    category: 'MEP Systems',
    originalImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    summary: 'Automated clash detection identified a direct physical intersection between a 600x300mm supply air duct and a 450mm deep concrete perimeter girder, along with uninsulated chilled water pipe proximity.',
    issueCount: 2,
    annotations: [
      {
        id: 'ann-m1',
        xPercent: 40,
        yPercent: 48,
        widthPercent: 16,
        heightPercent: 12,
        type: 'conflict',
        title: 'Physical Collision: 600x300 Duct Clashes with Girder',
        severity: 'Critical',
        description: 'Main supply air trunk duct centerline penetrates 200mm into the bottom flange of structural beam B-14.',
        recommendation: 'Split duct into two 400x200mm parallel branches to pass beneath beam soffit, or cast an engineered pipe sleeve at mid-depth.',
        codeStandard: 'BIMForum LOD 350 Clash Resolution Matrix'
      },
      {
        id: 'ann-m2',
        xPercent: 65,
        yPercent: 32,
        widthPercent: 10,
        heightPercent: 10,
        type: 'mep',
        title: 'Thermal Bridging: Chilled Water Pipe Touching Electrical Conduit',
        severity: 'High',
        description: 'Chilled water supply pipe with wet insulation touches main 415V electrical wire tray.',
        recommendation: 'Enforce minimum 150mm clearance between chilled water piping and electrical conduits.',
        codeStandard: 'NEC Article 300 / ASHRAE 90.1'
      }
    ]
  }
];

export const QUICK_SEARCH_SUGGESTIONS: string[] = [
  'Beam crack',
  'AutoCAD floor plan',
  'Revit family',
  'Sheet metal welding',
  'Foundation',
  'Interior lighting',
  'HVAC CFM'
];

