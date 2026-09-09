import { CadSoftwareRecord } from '../types/cadBimEngineering';

export const CAD_SOFTWARE_DATABASE: CadSoftwareRecord[] = [
  // ==================== ARCHITECTURE / BIM ====================
  {
    software_name: 'AutoCAD',
    category: 'Architecture / BIM',
    purpose: 'Industry-standard 2D drafting, geometric detailing, site master planning, and DWG-based working drawings across architecture and civil disciplines.',
    common_file_formats: ['.dwg', '.dxf', '.dwt', '.bak'],
    drawing_types: ['Floor Plans', 'Elevations', 'Building Sections', 'Site Plans', 'Door/Window Details', 'Structural Layouts'],
    workflow: [
      '1. Setup drawing template (DWT) with standardized units (UNITS) and limits (LIMITS).',
      '2. Define layer standard (AIA / IS) with designated colors, line types, and line weights.',
      '3. Draw structural grid lines and primary exterior walls using Polyline (PL) or Mline.',
      '4. Insert standard dynamic blocks for doors, windows, and fixtures on dedicated layers.',
      '5. Apply associative annotations, text styles, and dimension styles (DIMSTYLE).',
      '6. Configure Paperspace layouts (Layout tabs), create viewports (MVIEW), set standard plot scales, and publish to PDF/DWF.'
    ],
    tools: ['Object Snap (OSNAP)', 'Dynamic Input', 'Properties Palette', 'DesignCenter (ADC)', 'Tool Palettes', 'Sheet Set Manager'],
    commands: [
      { name: 'XREF', shortcut: 'XR', purpose: 'External Reference Manager to link architectural background plans without file bloat.', howToUse: 'Type XR -> Press Enter -> Choose DWG/PDF to attach -> Set Overlay or Attachment mode.', commonMistake: 'Using absolute file paths instead of Relative paths, causing broken links when moving directories.' },
      { name: 'PURGE', shortcut: 'PU', purpose: 'Removes unused named objects like layers, linetypes, dimension styles, and empty blocks.', howToUse: 'Type PU -> Select "Purge All" or inspect unreferenced items to purge.', commonMistake: 'Forgetting to check nested items or purging needed company template layers.' },
      { name: 'OVERKILL', shortcut: 'OVERKILL', purpose: 'Deletes duplicate or overlapping lines, arcs, and polylines.', howToUse: 'Select entire drawing geometry -> Run OVERKILL -> Set numeric tolerance (0.0001).', commonMistake: 'Ignoring layer differences and unintentionally merging geometries on different layers.' },
      { name: 'AUDIT', shortcut: 'AUDIT', purpose: 'Evaluates the integrity of the active drawing and fixes database header errors.', howToUse: 'Type AUDIT -> Enter Y to fix any errors detected.', commonMistake: 'Failing to run AUDIT before sending drawings to structural consultants or clients.' },
      { name: 'WBLOCK', shortcut: 'W', purpose: 'Writes selected objects to a new, clean external DWG file, stripping drawing corruption.', howToUse: 'Type W -> Select Objects -> Pick base point -> Specify output folder.', commonMistake: 'Not defining a logical insertion base point (e.g. leaving at 0,0,0 far from geometry).' }
    ],
    common_errors: [
      { errorCode: 'FATAL_ERROR_ACCESS_VIOLATION', message: 'Fatal Error: Unhandled Access Violation Reading 0x0000', cause: 'Display driver incompatibility, corrupt DWG database, or damaged hatch pattern.', fix: 'Start AutoCAD with hardware acceleration disabled (GRAPHICSCONFIG), run RECOVER on the file, or insert the drawing into a fresh blank DWT via EXPLODE block.' },
      { errorCode: 'XREF_UNRESOLVED', message: 'External Reference Unresolved', cause: 'Linked reference file path was moved, renamed, or saved on a network drive with a different drive letter.', fix: 'Open XREF palette, select the unresolved reference, right-click and set "Select New Path", then switch path type to "Make Relative".' },
      { errorCode: 'PROXY_OBJECT_WARNING', message: 'The drawing you are opening contains one or more Proxy Objects', cause: 'Drawing was created in Civil 3D, AutoCAD Architecture, or MEP with specialized object enablers missing in standard AutoCAD.', fix: 'Download and install the official Autodesk Object Enabler corresponding to the source product and release year.' }
    ],
    common_problems: ['Sluggish cursor and massive file size due to orphaned DGN linetypes', 'Annotations displaying wrong size in paperspace viewports', 'Hatch boundary cannot be determined'],
    solutions: [
      'Use -PURGE -> Orphaned data -> Regapps purge and delete bloated scale lists with SCALELISTSUPPORT.',
      'Set ANNOALLVISIBLE=1, ensure Viewport Scale matches the Annotative Scale assigned to text/dims.',
      'Ensure polylines are fully closed or increase HPGAPTOL (Hatch Gap Tolerance) to 1.0.'
    ],
    best_practices: [
      'Never draw in paperspace layout tabs; always keep geometric models in Model Space at 1:1 scale.',
      'Maintain strict Layer Zero (0) etiquette: only draw reusable block geometry on layer 0 so it inherits host layer attributes.',
      'Use ByLayer for color, linetype, and lineweight across all entities.'
    ],
    export_formats: ['.pdf', '.dwf', '.dxf', '.fbx', '.ifc (via architectural vertical)', '.sat'],
    compatibility: ['Revit (Import/Link DWG)', 'SketchUp (Vector DXF/DWG import)', '3ds Max (File Link Manager)', 'Civil 3D'],
    AI_assistance: ['Automated drafting error checks', 'Dimension discrepancy auditing', 'Layer standard compliance enforcement']
  },
  {
    software_name: 'Revit Architecture',
    category: 'Architecture / BIM',
    purpose: 'Object-oriented Building Information Modeling (BIM) for parametric architectural design, coordinated 3D models, automatic floor plans, sections, and schedules.',
    common_file_formats: ['.rvt', '.rfa', '.rte', '.rft'],
    drawing_types: ['BIM Coordinated Floor Plans', 'Building & Wall Sections', 'Interior Elevations', 'Door/Window Quantity Schedules', 'Material Takeoffs'],
    workflow: [
      '1. Define Project Base Point, Survey Point, True North, and Project Levels/Grids.',
      '2. Link Structural and MEP RVT models with Shared Coordinates.',
      '3. Model primary exterior composite walls, curtain walls, and structural columns.',
      '4. Insert parametric door, window, and fixture families (RFA) with manufacturer properties.',
      '5. Create room tags, calculate occupancies, and generate dynamic door/finishing schedules.',
      '6. Assemble documentation sheets with title blocks, keynote legends, and revision schedules.'
    ],
    tools: ['Family Editor', 'Worksharing / Central Model', 'Phasing & Design Options', 'Visibility/Graphic Overrides (VG)', 'View Templates', 'Schedule / Quantity Tool'],
    commands: [
      { name: 'Wall', shortcut: 'WA', purpose: 'Creates parametric layered architectural or structural wall assembly.', howToUse: 'Press WA -> Select wall type -> Set Base and Top Constraints -> Draw centerline or finished face.', commonMistake: 'Not constraining wall top to the upper Level, causing manual rework when floor-to-floor height changes.' },
      { name: 'Door', shortcut: 'DR', purpose: 'Places hosted parametric door opening in a host wall.', howToUse: 'Press DR -> Select family instance -> Click host wall -> Tap Spacebar to flip swing.', commonMistake: 'Attempting to place a door in empty space without a host wall element.' },
      { name: 'Align', shortcut: 'AL', purpose: 'Aligns an element face or line with another reference element and optionally locks constraint.', howToUse: 'Press AL -> Click destination target reference -> Click element to move.', commonMistake: 'Accidentally locking constraints between elements across different worksets, causing circular dependency errors.' },
      { name: 'Visibility/Graphics', shortcut: 'VG / VV', purpose: 'Controls layer/category visibility, color overrides, and cut patterns in the active view.', howToUse: 'Press VG -> Locate Model/Annotation Categories -> Toggle check or set line/fill override.', commonMistake: 'Overriding graphics element-by-element instead of using reusable View Templates.' }
    ],
    common_errors: [
      { errorCode: 'CIRCULAR_JOIN_ERROR', message: 'Highlighted elements are joined but do not intersect', cause: 'Two wall instances or floor slabs have conflicting edge join definitions or micro-misalignments.', fix: 'Disallow wall join (right click wall end grip -> Disallow Join), align precisely using AL, then manually execute Join Geometry.' },
      { errorCode: 'LOCAL_MODEL_OUT_OF_SYNC', message: 'Your local file is not up to date with the Central Model', cause: 'Another team member synchronized changes that modified borrowed elements in workshared models.', fix: 'Perform "Reload Latest" immediately before synchronizing, review conflicting elements, and commit your changes with "Synchronize with Central".' },
      { errorCode: 'CANNOT_CUT_HOST', message: 'Can not cut opening in wall / Can not find host', cause: 'Attempted to host a family on a curtain wall panel or wall layer where family geometry exceeds host boundary.', fix: 'Check host category type, edit family opening geometry, or use a non-hosted face-based family.' }
    ],
    common_problems: ['View showing elements invisible due to crop region, discipline filter, or view range', 'Central model file corruption', 'Slow file sync times with remote teams'],
    solutions: [
      'Click the lightbulb icon (Reveal Hidden Elements), check View Range (VR), discipline setting, and Phasing filters.',
      'Audit Central Model via File -> Open -> Check "Audit" box, purge unreferenced families and materials.',
      'Compact the central model regularly and implement Revit Cloud Worksharing (ACC/BIM 360).'
    ],
    best_practices: [
      'Always bind levels and grids to shared coordinates established by the project surveyor or civil engineer.',
      'Limit in-place families; build loadable (.RFA) families to keep the database fast and parametric.',
      'Enforce view templates on all construction document sheets.'
    ],
    export_formats: ['.ifc', '.dwg', '.dxf', '.nwc', '.fbx', '.pdf', '.gbxml'],
    compatibility: ['Navisworks (NWC export)', 'Revit Structure & MEP (Direct linking)', 'AutoCAD', 'Twinmotion', 'Enscape'],
    AI_assistance: ['Clash detection review', 'Spatial adjacency optimization', 'Automated door/window schedule verification']
  },
  {
    software_name: 'Archicad',
    category: 'Architecture / BIM',
    purpose: 'Virtual building BIM software renowned for intuitive architectural design, Teamwork collaboration, GDL parametric objects, and OpenBIM IFC integration.',
    common_file_formats: ['.pln', '.pla', '.mod', '.gsm'],
    drawing_types: ['Comprehensive Architectural Floor Plans', '3D Cutaways', 'Building Details', 'Interactive Schedules', 'BIMx Interactive Models'],
    workflow: [
      '1. Setup Story settings (elevations and floor-to-floor heights) and Project Location.',
      '2. Model load-bearing and partition walls using Composite Structures with accurate building materials.',
      '3. Place doors and windows using intelligent GDL library parts with built-in nominal framing.',
      '4. Generate elevations, interior elevations, and detail markers linked dynamically to the 3D model.',
      '5. Publish to BIMx hyper-models for interactive site navigation on mobile tablets.'
    ],
    tools: ['BIMcloud Teamwork', 'Morph Tool', 'Curtain Wall System', 'Stair & Railing Tool', 'CineRender Engine', 'Graphic Overrides'],
    commands: [
      { name: 'Suspend Groups', shortcut: 'Alt+G', purpose: 'Temporarily unlocks grouped elements so individual members can be moved or adjusted.', howToUse: 'Press Alt+G to toggle group lock on or off.', commonMistake: 'Forgetting groups are suspended and accidentally desynchronizing modular unit layouts.' },
      { name: 'Trace & Reference', shortcut: 'Alt+F2', purpose: 'Overlays any floor, section, or drawing sheet under the active view with ghost opacity.', howToUse: 'Right click target view in Navigator -> Show as Trace Reference.', commonMistake: 'Drawing on the active view mistaking ghost trace lines for active editable geometry.' },
      { name: 'Measure', shortcut: 'M', purpose: 'Instantly reads distance, angle, and area between clicked points.', howToUse: 'Press M -> Click first node -> Hover or click subsequent nodes to read perimeter/area tracker.', commonMistake: 'Snapping to incorrect Z-depth node in 3D perspective views.' }
    ],
    common_errors: [
      { errorCode: 'STAIR_SOLVER_CONFLICT', message: 'Stair baseline geometry conflict - unable to resolve riser and going rules', cause: 'Requested stair path length violates the configured Blondel walking line formula (2R + G = 63cm).', fix: 'Open Stair Settings -> Adjust allowed riser range or walking line offset, or convert landing segments to winders.' }
    ],
    common_problems: ['Intersection priorities causing messy wall corner junctions', 'Missing GDL library parts showing up as black dots'],
    solutions: [
      'Adjust Building Material Intersection Priority (BMIP) number; higher number cuts lower number.',
      'Load missing library folders via File -> Libraries and Objects -> Library Manager.'
    ],
    best_practices: ['Use composites for walls and slabs to automatically propagate hatching and thermal insulation boundaries.', 'Maintain clean OpenBIM IFC mapping for MEP consultants.'],
    export_formats: ['.ifc', '.dwg', '.bimx', '.obj', '.pdf', '.3ds'],
    compatibility: ['Solibri (IFC validation)', 'Revit (via IFC 4.0)', 'AutoCAD', 'Rhino / Grasshopper Live Connection'],
    AI_assistance: ['IFC property mapping validation', 'Plan regulatory code checking', 'BIMx navigation optimization']
  },
  {
    software_name: 'SketchUp',
    category: 'Architecture / BIM',
    purpose: 'Rapid 3D conceptual modeling, massing studies, interior design visualizations, and LayOut-driven 2D documentation.',
    common_file_formats: ['.skp', '.layout'],
    drawing_types: ['Concept Massing', 'Schematic Axonometrics', 'Interior Perspectives', 'LayOut Presentation Drawings'],
    workflow: [
      '1. Import 2D CAD floor plan or satellite terrain mesh as drawing reference.',
      '2. Push/Pull (P) 2D footprints into 3D massing and room enclosures.',
      '3. Group all geometries immediately into Components or Groups with explicit Tags (Layers).',
      '4. Assign PBR materials, textures, and 3D Warehouse furniture assets.',
      '5. Set camera perspectives, FOV (Field of View: 45-60 deg), and configure Shadows with true Solar North.',
      '6. Send to LayOut for scaled title block presentations and dimensioning.'
    ],
    tools: ['Push/Pull', 'Follow Me', 'Tape Measure', 'Outliner Palette', 'Tags System', '3D Warehouse'],
    commands: [
      { name: 'Make Component', shortcut: 'G', purpose: 'Creates an instanced 3D component where modifying one updates all copies across the project.', howToUse: 'Triple-click geometry -> Press G -> Name component -> Define gluing/axis plane.', commonMistake: 'Leaving loose raw geometry ungrouped, causing sticky geometry errors when walls touch.' },
      { name: 'Push/Pull', shortcut: 'P', purpose: 'Extrudes planar faces into 3D solids or punches window openings through double walls.', howToUse: 'Press P -> Click face -> Move mouse along normal vector -> Type exact dimension (e.g. 10\').', commonMistake: 'Pushing across un-coplanar split faces, resulting in hollow geometry.' }
    ],
    common_errors: [
      { errorCode: 'REVERSED_FACE_TEXTURE_GLITCH', message: 'Blue/Gray Back Faces Showing in Renders', cause: 'Faces oriented inside-out; rendering engines ignore back-face texture coordinates.', fix: 'Select blue-gray face, right-click -> "Reverse Faces", or select model and click "Orient Faces".' }
    ],
    common_problems: ['Model sluggishness from overly dense 3D trees and high-polygon furniture models from 3D Warehouse', 'LayOut viewport rendering blurry'],
    solutions: [
      'Run Window -> Model Info -> Statistics -> Purge Unused, use CleanUp3 plugin to reduce poly count.',
      'In LayOut, change Viewport rendering mode from "Raster" to "Hybrid" or "Vector" for crisp lines.'
    ],
    best_practices: ['Never leave raw edges and faces un-grouped.', 'Use Tags strictly for visibility toggles, not for geometric containment.'],
    export_formats: ['.skp', '.dae', '.obj', '.dwg', '.fbx', '.ifc', '.kmz'],
    compatibility: ['V-Ray for SketchUp', 'Enscape', 'Lumion', 'Twinmotion', 'Revit'],
    AI_assistance: ['3D spatial massing generation', 'Automated geometry cleanup', 'Texture & lighting prompt generation']
  },
  {
    software_name: '3ds Max',
    category: 'Architecture / BIM',
    purpose: 'High-end architectural visualization, cinematic flythrough animations, complex organic poly-modeling, and physically accurate lighting simulation.',
    common_file_formats: ['.max', '.mat', '.chr'],
    drawing_types: ['Photorealistic Hero Renders', 'Cinematic Walkthroughs', 'Night Lighting Studies', 'Architectural Section Box Renders'],
    workflow: [
      '1. Import or File Link Revit/CAD models using the File Link Manager with layer presets.',
      '2. Model bespoke interior millwork, soft furnishings, and complex geometric organic canopies.',
      '3. Apply physical materials (V-Ray / Corona / Arnold Physical Material) with displacement maps.',
      '4. Position photometric lights (IES profiles) matching real luminaire specifications and HDRI environment domes.',
      '5. Configure physical camera settings (Exposure Value EV, Shutter Speed, F-Stop, Depth of Field).',
      '6. Render with high-performance engines and output multi-channel EXR render elements.'
    ],
    tools: ['Modifier Stack (Edit Poly, UVW Map, TurboSmooth)', 'Slate Material Editor (SME)', 'Physical Camera', 'Forest Pack', 'RailClone'],
    commands: [
      { name: 'Isolate Selection', shortcut: 'Alt+Q', purpose: 'Hides all other objects in the scene to focus on a single piece of furniture or structural node.', howToUse: 'Select object -> Press Alt+Q -> Press Exit Isolation button when finished.', commonMistake: 'Forgetting isolation is active and wondering why the rest of the project disappeared.' }
    ],
    common_errors: [
      { errorCode: 'SYSTEM_OUT_OF_MEMORY', message: 'V-Ray / Corona Exception: Out of GPU/CPU Memory during rendering', cause: 'Scene geometry exceeded VRAM or RAM capacity due to uncompressed 8K textures or un-instanced geometry.', fix: 'Convert repeated geometry to V-Ray/Corona Proxies (.vrmesh/.cgeo), optimize texture resolution with Bitmap Pager, and reduce displacement subdivisions.' }
    ],
    common_problems: ['Gamma 2.2 color mismatch making textures washed out', 'Flickering in interior animation walkthroughs'],
    solutions: ['Ensure Color Management is set to ACEScg or Gamma 2.2 in Preferences.', 'Enable Light Cache pre-calculation and animation flythrough mode to freeze irradiance cache.'],
    best_practices: ['Always collapse modifier stacks on static objects to conserve RAM.', 'Use instanced copies rather than unique copies for modular elements.'],
    export_formats: ['.fbx', '.obj', '.abc (Alembic)', '.dwg', '.exr', '.png'],
    compatibility: ['V-Ray', 'Corona Renderer', 'Chaos Vantage', 'Unreal Engine (Datasmith)'],
    AI_assistance: ['Lighting mood synthesis', 'Material prompt calibration', 'Render post-production refinement']
  },

  // ==================== STRUCTURAL ====================
  {
    software_name: 'STAAD.Pro',
    category: 'Structural',
    purpose: 'Comprehensive 3D finite element analysis and structural design software for reinforced concrete, steel, and timber buildings, industrial plant structures, and bridges.',
    common_file_formats: ['.std', '.spdx'],
    drawing_types: ['Bending Moment Diagrams (BMD)', 'Shear Force Diagrams (SFD)', 'Axial Load Diagrams', 'Steel Member Sizing Tables', 'RCC Column Design Schedules'],
    workflow: [
      '1. Create structural geometry using analytical wireframe (nodes and beam elements).',
      '2. Assign material properties (Steel IS 2062, Concrete M25/M30) and member specifications (Prismatic/Steel Tables).',
      '3. Define boundary conditions (Fixed, Pinned, Springs for soil-structure interaction).',
      '4. Formulate load definitions: Dead Load (Selfweight), Live Load (IS 875 Part 2), Wind (IS 875 Part 3), Seismic (IS 1893:2016 Response Spectrum).',
      '5. Generate load combinations per limit state (ULS / SLS per IS 456 / IS 800 / AISC 360).',
      '6. Perform linear/P-Delta analysis, verify member unity check ratios (< 1.0), and design reinforcement.'
    ],
    tools: ['STAAD Editor (Text Command Input)', 'Section Wizard', 'Physical Modeler', 'Steel Connection Design (RAM Connection)', 'Foundation Advanced'],
    commands: [
      { name: 'PERFORM ANALYSIS', shortcut: 'PERFORM ANALYSIS PRINT ALL', purpose: 'Instructs the solver engine to compute nodal displacements, member forces, and support reactions.', howToUse: 'Add as text command at end of load combination deck in STAAD Editor.', commonMistake: 'Placing PERFORM ANALYSIS before load combinations, which outputs uncombined results.' }
    ],
    common_errors: [
      { errorCode: 'ZERO_STIFFNESS_WARNING', message: 'WARNING: ZERO STIFFNESS DETECTED AT NODE XXX DOF RY', cause: 'Node has no rotational or translational restraint, causing structural instability/mechanism.', fix: 'Inspect beam releases; ensure beams are not released at both ends for torsion, and verify member connectivity.' },
      { errorCode: 'MEMBER_FAILED_CODE_CHECK', message: 'ERROR: Member XXX failed unity check (Ratio = 1.42)', cause: 'Applied combined bending and axial forces exceed member design capacity under governing load combination.', fix: 'Increase section modulus (e.g. from ISMB 300 to ISMB 400), reduce unbraced length with intermediate stiffeners, or modify structural framing.' }
    ],
    common_problems: ['Orphaned nodes that are not connected to any beam elements causing calculation anomalies', 'Displacement warnings under lateral wind loads'],
    solutions: ['Run Tools -> Check Multiple Nodes -> Check Orphan Nodes -> Delete Orphan Nodes.', 'Increase lateral moment-resisting frame stiffness or introduce diagonal chevron/X-bracings.'],
    best_practices: ['Master the STAAD Editor syntax; scripting is 5x faster than graphical point-and-click modeling.', 'Always verify equilibrium: Total applied vertical load must match the sum of support reactions.'],
    export_formats: ['.std', '.dxf', '.cis/2', '.ifc', '.bim'],
    compatibility: ['AutoCAD (DXF wireframe import/export)', 'Revit Structure (via ISM)', 'Tekla Structures'],
    AI_assistance: ['Structural framing optimization', 'Code compliance verification', 'Failure mode diagnosis']
  },
  {
    software_name: 'ETABS',
    category: 'Structural',
    purpose: 'Premier building-specific structural analysis and design package tailored for multi-story RCC and steel buildings, shear walls, and seismic resilience.',
    common_file_formats: ['.edb', 'e2k', '.$et'],
    drawing_types: ['Story Drift Plots', 'Shear Wall Pier Reinforcement Plans', 'Beam/Column Capacity Ratios', 'Seismic Mass Participation Tables'],
    workflow: [
      '1. Define Story Data (Heights, Master/Similar Story logic) and Grid systems.',
      '2. Define Material Properties (Concrete M30/M40, Rebar Fe500D) and Frame/Shell Sections.',
      '3. Draw columns, beams, shear wall piers, and rigid diaphragm floor slabs.',
      '4. Assign Mass Source for seismic calculation per IS 1893 (100% Dead + 25%/50% Live).',
      '5. Execute modal analysis, check 90%+ mass participation ratio in first 12 modes.',
      '6. Run design check, extract rebar percentages (0.8% to 4.0% for columns per IS 456), and evaluate inter-story drift limits (0.004 h).'
    ],
    tools: ['Section Designer', 'Pier/Spandrel Labeling', 'Response Spectrum Function', 'Nonlinear Pushover Solver', 'Diaphragm Assignment'],
    commands: [
      { name: 'Assign Diaphragm', shortcut: 'Assign -> Shell -> Diaphragms', purpose: 'Constrains all slab nodes at a floor level to act as a rigid in-plane body distributing lateral wind/seismic forces.', howToUse: 'Select all floor slabs at Story -> Assign -> Shell -> Diaphragms -> Select D1 (Rigid).', commonMistake: 'Assigning a rigid diaphragm to slabs with large interior cutouts/atria instead of a Semi-Rigid diaphragm.' }
    ],
    common_errors: [
      { errorCode: 'DRIFT_LIMIT_EXCEEDED', message: 'Story Drift Ratio exceeds allowable limit of 0.004', cause: 'Lateral stiffness of the tower is insufficient for lateral seismic or wind demands.', fix: 'Add concrete shear walls (piers) at perimeter, thicken core walls, or increase column cross-sections.' },
      { errorCode: 'TORSIONAL_IRREGULARITY', message: 'Torsional Irregularity Ratio > 1.2', cause: 'Center of Rigidity is eccentrically separated from Center of Mass, causing excessive dynamic twisting.', fix: 'Rebalance shear wall layout symmetrically around building geometric center.' }
    ],
    common_problems: ['Mesh errors in irregular curved shell slabs', 'Negative eigen-values during modal analysis'],
    solutions: ['Use Auto Mesh Options -> Set maximum element size to 1.0m for slabs.', 'Check for unconstrained flying beams or disconnected nodes.'],
    best_practices: ['Always verify that the building base shear calculated by Response Spectrum matches or exceeds dynamic empirical base shear per code.', 'Label all shear walls as Piers before running concrete wall design.'],
    export_formats: ['.edb', '.dxf', '.ifc', '.xml', '.s2k'],
    compatibility: ['SAFE (Direct floor slab export for foundation/mat design)', 'Revit Structure (CSiXRevit)', 'AutoCAD'],
    AI_assistance: ['Seismic drift compliance auditing', 'Shear wall placement guidance', 'Rebar ratio optimization']
  },
  {
    software_name: 'Tekla Structures',
    category: 'Structural',
    purpose: 'Advanced 3D structural steel and precast concrete detailing software producing fabrication-ready shop drawings, CNC machine codes, and erection plans.',
    common_file_formats: ['.db1', '.xs', '.nc1'],
    drawing_types: ['Single Part Shop Drawings (W)', 'Assembly Drawings (A)', 'Cast-in-Place Concrete Drawings (C)', 'Erection GA Plans (G)', 'Bill of Materials (BOM)'],
    workflow: [
      '1. Import architectural and structural design wireframe or IFC coordination models.',
      '2. Model high-fidelity structural steel members (columns, beams, trusses, girts, purlins).',
      '3. Apply automated parametric steel connections (base plates, shear tabs, moment end plates).',
      '4. Run clash checks between steel members, bolts, stiffeners, and anchor bolts.',
      '5. Number all parts and assemblies automatically per project prefixing rules.',
      '6. Generate automated shop drawings with weld symbols, bolt schedules, and CNC NC1 files for fabrication.'
    ],
    tools: ['Component Catalog (Applications & Components)', 'Clash Check Manager', 'Drawing Manager', 'Phase Manager', 'Custom Component Editor'],
    commands: [
      { name: 'Numbering', shortcut: 'Drawings & Reports -> Perform Numbering', purpose: 'Assigns unique mark numbers to every single part and assembly based on geometry, holes, and cuts.', howToUse: 'Click Perform Numbering -> Select "Number Series of Selected Objects".', commonMistake: 'Generating shop drawings before numbering, which leads to blank or incorrect mark numbers.' }
    ],
    common_errors: [
      { errorCode: 'BOLT_EDGE_DISTANCE_VIOLATION', message: 'Warning: Bolt edge distance less than minimum code requirement (1.5d)', cause: 'Hole center is placed too close to plate or profile sheared edge, risking tear-out failure under tension.', fix: 'Increase plate dimensions or adjust bolt pitch/edge distance in the Connection Component Dialog to meet AISC/IS 800 minimums.' }
    ],
    common_problems: ['Clashes between beam web stiffeners and connection bolts', 'Drawings losing associative dimensions after minor model modification'],
    solutions: ['Run Clash Check Manager on entire assembly before drawing generation.', 'Lock drawing marks and configure Dimensioning Rules to anchor to reference grids.'],
    best_practices: ['Never model connections with raw dummy solids; always use parametric components to preserve CNC data.', 'Regularly save incremental model backups and compact the project database.'],
    export_formats: ['.nc1 (DSTV for CNC cutting/drilling)', '.dxf', '.dwg', '.ifc', '.step', '.pdf'],
    compatibility: ['STAAD.Pro (Structural forces transfer)', 'Revit Structure', 'Navisworks', 'FabTrol / Steel Management ERP'],
    AI_assistance: ['Connection selection recommendation', 'Fabrication clash prediction', 'Erection sequence optimization']
  },

  // ==================== CIVIL ====================
  {
    software_name: 'Civil 3D',
    category: 'Civil',
    purpose: 'Civil engineering design and documentation software for land development, roadway corridors, grading, storm drainage, and volumetric earthworks.',
    common_file_formats: ['.dwg', '.dwt', '.xml (LandXML)'],
    drawing_types: ['Topographic Survey Plans', 'Road Plan and Profile Sheets', 'Longitudinal Sections', 'Cross Sections with Cut/Fill', 'Stormwater Drainage Networks'],
    workflow: [
      '1. Import survey point cloud or total station data (.csv/.txt) with point groups and descriptions.',
      '2. Build Triangulated Irregular Network (TIN) surface representing existing ground (EG).',
      '3. Establish horizontal road alignments (PI, curves, spirals, design speeds per IRC/AASHTO).',
      '4. Generate existing ground surface profiles and design vertical alignment (PVI with parabolic curves).',
      '5. Build parametric Road Corridors using Subassemblies (lanes, curbs, daylight slopes).',
      '6. Compute Earthwork volumes using Average End Area method and output Cut/Fill mass haul diagrams.'
    ],
    tools: ['Prospector Palette', 'Toolspace', 'Subassembly Composer', 'Pipe Network Vistas', 'Grading Creation Tools', 'Stage Storage Tool'],
    commands: [
      { name: 'Create TIN Surface', shortcut: 'Toolspace -> Surfaces -> Create Surface', purpose: 'Generates triangulated mathematical surface from contours, point groups, or breaklines.', howToUse: 'Expand Toolspace -> Right-click Surfaces -> Create Surface -> Select TIN Surface -> Add Point Group.', commonMistake: 'Failing to add breaklines along retaining walls and curbs, creating unrealistic triangulated slope spikes.' }
    ],
    common_errors: [
      { errorCode: 'CORRIDOR_TARGET_NOT_FOUND', message: 'Corridor subassembly failed to target daylight surface', cause: 'Corridor assembly cut/fill daylight link has no assigned target ground surface.', fix: 'Select Corridor -> Edit Targets -> Map the "Surface Targets" parameter to the Existing Ground (EG) TIN surface.' }
    ],
    common_problems: ['Excessive cut/fill imbalance inflating project haul costs', 'Pipe network invert levels clashing with road subgrade'],
    solutions: ['Adjust vertical profile PVI elevations to balance mass haul diagrams.', 'Run Interference Check on the gravity pipe network against corridor solid surfaces.'],
    best_practices: ['Use Data Shortcuts (XML) to share surfaces and alignments across multiple drawing files, keeping file sizes manageable.', 'Always set breaklines on ridges, valleys, and paved edges.'],
    export_formats: ['.landxml', '.dwg', '.dxf', '.sdf', '.shp', '.pdf'],
    compatibility: ['InfraWorks', 'AutoCAD', 'Revit (Site shared coordinates)', 'GIS / QGIS'],
    AI_assistance: ['Earthwork cut/fill balance calculation', 'Storm drainage flow velocity validation', 'Road curvature speed checking']
  },

  // ==================== MECHANICAL / CAD ====================
  {
    software_name: 'SolidWorks',
    category: 'Mechanical / CAD',
    purpose: 'Parametric 3D feature-based mechanical CAD software for machine design, sheet metal enclosures, weldments, assemblies, and manufacturing drawings.',
    common_file_formats: ['.sldprt', '.sldasm', '.slddrw'],
    drawing_types: ['Machined Part Drawings (with GD&T)', 'Assembly Exploded Views', 'Sheet Metal Flat Patterns', 'Weldment Cut Lists', 'Bill of Materials (BOM)'],
    workflow: [
      '1. Create fully constrained 2D sketches on standard planes (Front/Top/Right) with smart dimensions.',
      '2. Apply 3D features: Extrude, Revolve, Sweep, Loft, Fillet, Hole Wizard.',
      '3. Assemble components into sub-assemblies using standard and mechanical mates (Coincident, Concentric, Gear).',
      '4. Generate sheet metal parts with K-factors, bend deductions, and check unbent flat patterns.',
      '5. Run interference detection and motion studies to verify clearance during movement.',
      '6. Create 2D manufacturing drawings with orthographic views, section cuts, GD&T, and associative BOM.'
    ],
    tools: ['Smart Dimension', 'Hole Wizard', 'Sheet Metal Gauge Table', 'Weldments Module', 'Evaluate -> Interference Detection', 'Pack and Go'],
    commands: [
      { name: 'Mate', shortcut: 'Mate (Paperclip icon)', purpose: 'Applies geometric constraints between components in an assembly.', howToUse: 'Click Mate -> Select Face 1 -> Select Face 2 -> Choose mate condition (Concentric/Coincident).', commonMistake: 'Over-constraining assemblies with redundant mates, leading to rebuild errors.' }
    ],
    common_errors: [
      { errorCode: 'SHEET_METAL_BEND_RADIUS_TOO_SMALL', message: 'The bend radius is too small for the selected material thickness; tearing may occur', cause: 'Inside bend radius is less than minimum recommended for the sheet gauge, causing excessive outer fiber stretching.', fix: 'Set inside bend radius equal to or greater than the sheet thickness (R >= t for mild steel, R >= 1.5t for aluminum).' },
      { errorCode: 'CIRCULAR_REFERENCE_ERROR', message: 'Warning: Circular reference detected between Part A and Part B', cause: 'Part A dimension depends on Part B geometry, which in turn references Part A geometry in an in-context assembly.', fix: 'Break external references via File -> External References -> Break/Lock Reference, and dimension from fixed assembly planes.' }
    ],
    common_problems: ['Rebuild tree errors (red and yellow warning flags)', 'Drawing views out of date when parts change'],
    solutions: ['Use Rollback Bar to locate the first failing feature, edit sketch constraints, and rebuild (Ctrl+Q).', 'Enable automatic view updates in System Options -> Drawings.'],
    best_practices: ['Always fully define sketches (all geometry turned black, no blue under-defined lines).', 'Use Pack and Go whenever sharing or archiving projects to include all part dependencies.'],
    export_formats: ['.step', '.iges', '.dxf (Flat pattern for laser cutting)', '.stl (3D Printing)', '.pdf', '.x_t (Parasolid)'],
    compatibility: ['AutoCAD', 'Mastercam', 'Ansys FEA', 'Fusion 360', 'KeyShot'],
    AI_assistance: ['Sheet metal flat pattern validation', 'K-factor & bend deduction calculation', 'Assembly tolerance stack-up review']
  },

  // ==================== GRAPHIC / PRESENTATION ====================
  {
    software_name: 'Adobe Illustrator',
    category: 'Graphic / Presentation',
    purpose: 'Vector graphic design, architectural presentation board layouts, site plan diagrammatic vector rendering, and marketing infographics.',
    common_file_formats: ['.ai', '.eps', '.svg', '.pdf'],
    drawing_types: ['Architectural Competition Presentation Boards', 'Conceptual Diagrammatic Axonometrics', 'Color-Coded Master Plan Maps', 'Infographics'],
    workflow: [
      '1. Export clean vector PDF or DWG line work from AutoCAD, Revit, or Rhino.',
      '2. Open in Illustrator, organize into hierarchical layers (Cut Lines, Furniture, Trees, Shadows, Text).',
      '3. Assign customized stroke weights (0.1pt hairline to 2.0pt cut profile) and distinctive color palettes.',
      '4. Apply vector gradient fills, textures (grass, water, wood flooring, pavers), and soft drop shadows.',
      '5. Add diagrammatic circulation arrows, typography with strict typographic scale, and scale bars.',
      '6. Export CMYK high-resolution PDF for print or sRGB for client digital presentation.'
    ],
    tools: ['Pen Tool (P)', 'Shape Builder (Shift+M)', 'Appearance Palette', 'Swatches / Pattern Fills', 'Layers Panel', 'Artboard Tool'],
    commands: [
      { name: 'Shape Builder', shortcut: 'Shift+M', purpose: 'Quickly merges or deletes overlapping vector shapes created by intersecting CAD lines.', howToUse: 'Select intersecting shapes -> Press Shift+M -> Drag across regions to unite, or Alt+Click to subtract.', commonMistake: 'Not selecting all bounding geometries before activating the tool.' }
    ],
    common_errors: [
      { errorCode: 'MISSING_FONT_WARNING', message: 'Some fonts are missing and have been substituted', cause: 'The project file uses a specialized typeface not installed on the current operating system.', fix: 'Install the requested font family or outline all typography (Ctrl+Shift+O) before sending files to print shops.' }
    ],
    common_problems: ['CAD line import bringing in millions of individual broken segments slowing down performance', 'Colors looking desaturated when printed'],
    solutions: ['Select lines -> Object -> Path -> Join (Ctrl+J) or use Pathfinder to unite.', 'Verify Document Color Mode is set to CMYK for physical print presentations.'],
    best_practices: ['Keep CAD line drawings strictly vector; avoid rasterizing vector floor plans.', 'Use Global Swatches so updating one color automatically updates the entire presentation.'],
    export_formats: ['.pdf', '.svg', '.png', '.jpg', '.eps', '.tiff'],
    compatibility: ['AutoCAD (PDF/DWG import)', 'Revit', 'Photoshop (Smart Objects)', 'InDesign'],
    AI_assistance: ['Architectural color palette generation', 'Diagrammatic hierarchy critique', 'Typography pairing guidance']
  },
  {
    software_name: 'Adobe Photoshop',
    category: 'Graphic / Presentation',
    purpose: 'Raster image post-production, architectural rendering collage, composite photo integration, texture generation, and lighting enhancement.',
    common_file_formats: ['.psd', '.psb', '.tif'],
    drawing_types: ['Photorealistic Render Post-Production', 'Atmospheric Collage Renderings', 'Site Aerial Composites', 'Architectural Section Material Collages'],
    workflow: [
      '1. Render base pass and multi-channel utility passes (Depth Z-Pass, WireColor/MaterialID, Ambient Occlusion, Reflection) from 3ds Max/V-Ray.',
      '2. Open base pass in 32-bit/16-bit color depth.',
      '3. Use MaterialID pass with Magic Wand / Color Range to isolate specific materials without manual selection.',
      '4. Composite realistic skies, landscape entourage, people, vegetation, and realistic weathered textures.',
      '5. Apply non-destructive adjustment layers (Curves, Color Balance, Camera Raw Filter) for mood and grading.',
      '6. Add atmospheric light blooms, lens flares, and export for high-resolution portfolio and web delivery.'
    ],
    tools: ['Camera Raw Filter', 'Layer Masks', 'Curves Adjustment', 'Clone Stamp (S)', 'Smart Objects', 'Color Range Selection'],
    commands: [
      { name: 'Camera Raw Filter', shortcut: 'Ctrl+Shift+A', purpose: 'Applies photographic exposure, temperature, clarity, dehaze, and vignette adjustments non-destructively.', howToUse: 'Select Smart Object layer -> Press Ctrl+Shift+A -> Adjust sliders -> Click OK.', commonMistake: 'Applying Camera Raw on a rasterized layer instead of a Smart Object, destroying editability.' }
    ],
    common_errors: [
      { errorCode: 'SCRATCH_DISKS_FULL', message: 'Could not complete your request because the scratch disks are full', cause: 'Temporary cache from massive multi-layer architectural PSD files exhausted primary drive storage.', fix: 'Go to Edit -> Preferences -> Scratch Disks -> Assign a secondary hard drive with at least 50GB free space.' }
    ],
    common_problems: ['Scale of cut-out people and trees mismatched with building horizon line', 'Halos around trees and people cutouts'],
    solutions: ['Match the eye-level horizon line of entourage assets with the 3D camera horizon line.', 'Use Layer -> Matting -> Defringe (1-2 pixels) to remove fringe artifacts.'],
    best_practices: ['Never paint directly onto the base render; always work non-destructively using Layer Masks and Smart Filters.', 'Organize layers into labeled groups (Atmosphere, Foreground, Architecture, Entourage).'],
    export_formats: ['.jpg', '.png', '.tiff', '.pdf', '.webp'],
    compatibility: ['3ds Max', 'SketchUp', 'Illustrator', 'InDesign', 'Lightroom'],
    AI_assistance: ['Contextual background synthesis', 'Material wear and patina guidance', 'Atmospheric lighting prompts']
  },

  // ==================== MEP ====================
  {
    software_name: 'Revit MEP',
    category: 'MEP',
    purpose: 'Integrated Building Information Modeling for Mechanical (HVAC), Electrical, and Plumbing engineering, duct sizing, and clash coordination.',
    common_file_formats: ['.rvt', '.rfa'],
    drawing_types: ['HVAC Ductwork Layouts', 'Electrical Lighting & Power Circuits', 'Domestic Water Supply & Sanitary Drainage Plans', 'Equipment Schedules'],
    workflow: [
      '1. Link architectural and structural RVT models with Copy/Monitor for levels and grids.',
      '2. Define Spaces and Zones, calculate heating/cooling loads per ASHRAE / ISHRAE standards.',
      '3. Place mechanical equipment (AHUs, Chillers, VAV boxes) in plant rooms and ceiling voids.',
      '4. Route ductwork and piping systems with parametric fittings, slope (for gravity drainage 1:50 or 1:100).',
      '5. Place electrical distribution boards, lighting fixtures, and generate panel schedules automatically.',
      '6. Execute Interference Check against structural beams and ceiling grids, then produce coordinated construction sheets.'
    ],
    tools: ['Duct / Pipe Sizing Tool', 'System Browser', 'Panel Schedules', 'Interference Check', 'Space / Zone Creator'],
    commands: [
      { name: 'Duct', shortcut: 'DT', purpose: 'Routes parametric supply, return, or exhaust air ductwork with automatic elbow and transition insertion.', howToUse: 'Press DT -> Select duct system and cross section (Rectangular/Round) -> Set offset elevation -> Draw route.', commonMistake: 'Routing ducts without checking structural beam bottom elevations, leading to severe clashes.' }
    ],
    common_errors: [
      { errorCode: 'NO_CLOSED_DRAINAGE_LOOP', message: 'Slope cannot be applied to selected pipe fitting', cause: 'Piping run was drawn without continuous direction, causing opposing gravity slope vectors.', fix: 'Delete problematic elbow, route pipe downstream to upstream maintaining continuous 1% or 2% slope direction.' }
    ],
    common_problems: ['Ductwork clashing with structural drop beams in low-ceiling floor heights', 'Electrical circuits exceeding maximum allowed voltage drop'],
    solutions: ['Coordinate web penetrations through steel beams or introduce horizontal duct splits/offsets.', 'Increase wire cross-sectional gauge (AWG / mm2) or redistribute circuits across closer sub-panels.'],
    best_practices: ['Color-code all MEP systems clearly (Supply = Blue, Return = Pink, Drainage = Brown, Domestic Cold = Cyan, Fire = Red).', 'Always maintain minimum 150mm vertical clearance above suspended ceilings for duct maintenance.'],
    export_formats: ['.ifc', '.dwg', '.nwc', '.pdf', '.gbxml'],
    compatibility: ['Navisworks (Federated clash detection)', 'AutoCAD MEP', 'Revit Architecture', 'Carrier HAP / Trane TRACE'],
    AI_assistance: ['MEP-Structural clash resolution suggestions', 'Duct aspect ratio airflow optimization', 'Electrical load schedule balancing']
  }
];
