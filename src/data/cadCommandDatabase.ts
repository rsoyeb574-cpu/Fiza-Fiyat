export interface CadCommandRecord {
  id: string;
  software: string;
  name: string;
  shortcut: string;
  category: 'Drafting' | 'Modeling' | 'Annotation' | 'Modification' | 'Management' | 'Analysis';
  purpose: string;
  howToUse: string;
  commonMistake: string;
  example: string;
}

export const CAD_COMMAND_DATABASE: CadCommandRecord[] = [
  // AutoCAD
  {
    id: 'cmd-acad-xref',
    software: 'AutoCAD',
    name: 'XREF (External Reference)',
    shortcut: 'XR',
    category: 'Management',
    purpose: 'Attaches external DWG plans (architectural background, structural grids, MEP layouts) as referenced overlays without inflating file size.',
    howToUse: 'Type XR and hit Enter. Click the "Attach DWG" icon in the palette. Select file. Choose "Overlay" mode (prevents circular nesting) and set Path Type to "Relative Path".',
    commonMistake: 'Using "Attachment" instead of "Overlay", which causes circular references when consultant drawings reference each other.',
    example: 'Attaching "Grid_Master.dwg" to all structural floor framing sheets.'
  },
  {
    id: 'cmd-acad-overkill',
    software: 'AutoCAD',
    name: 'OVERKILL (Delete Duplicate Geometry)',
    shortcut: 'OVERKILL',
    category: 'Modification',
    purpose: 'Cleans up CAD drawings by purging overlapping, duplicated, or co-linear lines, arcs, and polylines.',
    howToUse: 'Type OVERKILL -> Select all drawing objects or press Ctrl+A -> Press Enter -> Set tolerance (default 0.000001) -> Check "Optimize segments within polylines" -> Click OK.',
    commonMistake: 'Running OVERKILL without checking layer differences, inadvertently deleting lines meant for different layer weights.',
    example: 'Cleaning up an exported Revit DWG plan before sending to CNC or laser cutting.'
  },
  {
    id: 'cmd-acad-dimstyle',
    software: 'AutoCAD',
    name: 'DIMSTYLE (Dimension Style Manager)',
    shortcut: 'D',
    category: 'Annotation',
    purpose: 'Creates and modifies dimension standards including architectural tick marks, text font, arrowheads, scale factors, and unit precision.',
    howToUse: 'Type D -> Press Enter -> Click "New" or "Modify" -> Under "Lines" set color ByLayer -> Under "Symbols & Arrows" select Architectural Tick -> Under "Primary Units" set Architectural (0\'-0 1/8") or Decimal (0.00).',
    commonMistake: 'Scaling dimension text manually rather than using Annotative scale or Fit scale factor.',
    example: 'Configuring standard 1:100 architectural millimeter dimensions with 2.5mm text height.'
  },
  {
    id: 'cmd-acad-fillet',
    software: 'AutoCAD',
    name: 'FILLET (Radius / Clean Corner Join)',
    shortcut: 'F',
    category: 'Modification',
    purpose: 'Creates rounded corners or instantly joins two non-parallel lines into a sharp, perfect 90° intersection when radius is set to zero.',
    howToUse: 'Type F -> Press Enter. Type R -> Enter 0 for sharp corner. Click first line, click second line.',
    commonMistake: 'Leaving a non-zero radius active and accidentally creating curved corners on square building walls.',
    example: 'Closing open wall lines at room corners by setting Radius=0.'
  },

  // Revit
  {
    id: 'cmd-revit-align',
    software: 'Revit',
    name: 'Align',
    shortcut: 'AL',
    category: 'Modification',
    purpose: 'Aligns an element face or reference plane with another target reference, with an optional padlock to permanently lock geometric constraints.',
    howToUse: 'Press AL. Click the stationary target reference line or face. Click the element you wish to shift into alignment.',
    commonMistake: 'Clicking the padlock on elements across different worksets or phases, leading to circular constraint locks.',
    example: 'Aligning drywall partition finished face to structural column concrete face.'
  },
  {
    id: 'cmd-revit-copy-monitor',
    software: 'Revit',
    name: 'Copy/Monitor',
    shortcut: 'Collaborate -> Copy/Monitor',
    category: 'Management',
    purpose: 'Coordinates levels, grids, and columns between linked Architectural and Structural Revit models, generating alerts whenever one team alters a datum.',
    howToUse: 'Go to Collaborate -> Copy/Monitor -> Select Link -> Click linked model -> Click "Copy" -> Select grids/levels -> Click Finish.',
    commonMistake: 'Ignoring Coordination Review warnings when structural engineers adjust level heights.',
    example: 'Monitoring Level 1 and Level 2 datum elevations against the structural engineer\'s model.'
  },
  {
    id: 'cmd-revit-view-range',
    software: 'Revit',
    name: 'View Range',
    shortcut: 'VR',
    category: 'Drafting',
    purpose: 'Controls horizontal cutting plane height, top boundary, bottom boundary, and view depth for plan views.',
    howToUse: 'In Plan View properties, click View Range (VR). Typical architectural setting: Top = +2300mm, Cut Plane = +1200mm, Bottom = 0.0mm, View Depth = 0.0mm.',
    commonMistake: 'Setting Cut Plane below window sill height (e.g. at 600mm), causing high windows not to cut properly on plan.',
    example: 'Adjusting View Range to +1800mm to cut high clerestory or bathroom ventilator windows.'
  },

  // SketchUp
  {
    id: 'cmd-skp-followme',
    software: 'SketchUp',
    name: 'Follow Me',
    shortcut: 'Tools -> Follow Me',
    category: 'Modeling',
    purpose: 'Extrudes a 2D profile face along a custom 3D path of edges, perfect for classical cornices, skirtings, pipes, and handrails.',
    howToUse: 'Pre-select the path of edges. Click the Follow Me tool. Click the 2D cross-sectional face.',
    commonMistake: 'Trying to manually drag the face along the path, which causes twisting and misalignment (always pre-select the path first).',
    example: 'Extruding a crown molding profile around a living room ceiling perimeter.'
  },
  {
    id: 'cmd-skp-make-group',
    software: 'SketchUp',
    name: 'Make Group / Component',
    shortcut: 'G',
    category: 'Management',
    purpose: 'Isolates geometric geometry into a distinct object, preventing raw edges and faces from "sticking" to adjacent walls.',
    howToUse: 'Triple-click raw geometry to select all connected faces. Press G (Component) or Right Click -> Make Group.',
    commonMistake: 'Leaving raw ungrouped walls and floors in contact, creating geometry tears when editing.',
    example: 'Grouping each wall segment into an independent component before punching window openings.'
  },

  // SolidWorks
  {
    id: 'cmd-sw-hole-wizard',
    software: 'SolidWorks',
    name: 'Hole Wizard',
    shortcut: 'Features -> Hole Wizard',
    category: 'Modeling',
    purpose: 'Creates standardized mechanical holes including tapped threads, counterbores, countersinks, and clearance holes for standard bolts.',
    howToUse: 'Click Hole Wizard -> Choose Hole Type (Counterbore, Tapped) -> Select standard (ISO, ANSI) and bolt size (e.g. M12) -> Switch to "Positions" tab and click faces to place hole centers.',
    commonMistake: 'Manually sketching and revolving circular holes rather than using Hole Wizard, losing automated cosmetic thread callouts in 2D drawings.',
    example: 'Creating M16 clearance holes on a steel base plate for anchor bolts.'
  },
  {
    id: 'cmd-sw-mate',
    software: 'SolidWorks',
    name: 'Mate (Standard & Advanced)',
    shortcut: 'Paperclip Icon',
    category: 'Modeling',
    purpose: 'Applies kinematic and geometric constraints between components in an assembly (Coincident, Concentric, Distance, Angle, Width).',
    howToUse: 'Click Mate. Click cylindrical face of shaft, click cylindrical face of hole -> Automatically applies Concentric mate. Click face of collar, click face of housing -> Applies Coincident mate.',
    commonMistake: 'Over-constraining parts with duplicate mates causing red rebuild solver conflicts.',
    example: 'Constraining an electrical motor shaft concentric with a gearbox bore.'
  },

  // Adobe Illustrator
  {
    id: 'cmd-ai-shape-builder',
    software: 'Adobe Illustrator',
    name: 'Shape Builder Tool',
    shortcut: 'Shift+M',
    category: 'Modification',
    purpose: 'Interactively unites or subtracts overlapping vector shapes created by raw imported CAD line work.',
    howToUse: 'Select all intersecting vector lines/shapes. Press Shift+M. Click and drag across regions to combine them, or hold Alt and click to delete an unwanted segment.',
    commonMistake: 'Forgetting to select the vector objects before activating the tool.',
    example: 'Trimming overlapping CAD wall corners into clean, filled architectural wall masses.'
  }
];
