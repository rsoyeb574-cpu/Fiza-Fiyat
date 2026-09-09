export interface SoftwareErrorRecord {
  id: string;
  software: string;
  errorCodeOrTitle: string;
  errorSnippet: string;
  likelyCause: string;
  howToTroubleshoot: string[];
  whatToCheck: string[];
  possibleFix: string;
}

export const SOFTWARE_ERROR_DATABASE: SoftwareErrorRecord[] = [
  // AutoCAD
  {
    id: 'acad-err-1',
    software: 'AutoCAD',
    errorCodeOrTitle: 'FATAL ERROR: Unhandled Access Violation',
    errorSnippet: 'FATAL ERROR: Unhandled Access Violation Reading 0x0000 at address 0x...',
    likelyCause: 'Corrupt DWG drawing header, outdated GPU display drivers, damaged custom hatch pattern, or conflicting DirectX 11/12 settings.',
    howToTroubleshoot: [
      'Launch AutoCAD in safe mode or disable hardware acceleration.',
      'Check if the error happens with all drawings or only this specific file.',
      'Check the Windows Event Viewer under Application Logs for acad.exe crash signatures.'
    ],
    whatToCheck: ['GRAPHICSCONFIG hardware acceleration setting', 'Presence of unpurged DGN linetypes', 'Display driver version (NVIDIA / AMD)'],
    possibleFix: 'Type GRAPHICSCONFIG -> Turn Off Hardware Acceleration. Then open drawing using RECOVER command instead of OPEN. Type -PURGE -> Regapps, then AUDIT -> Yes to fix database anomalies.'
  },
  {
    id: 'acad-err-2',
    software: 'AutoCAD',
    errorCodeOrTitle: 'XREF Unresolved / Missing Path',
    errorSnippet: 'External Reference "A-GRID.dwg" is unreferenced or missing',
    likelyCause: 'The linked drawing file was moved, renamed, deleted, or stored with an absolute hardcoded drive path (e.g. D:\\Projects) that does not exist on this computer.',
    howToTroubleshoot: ['Open XREF palette (XR command)', 'Examine the "Saved Path" column vs "Found At" column.'],
    whatToCheck: ['Project directory file structure', 'Network shared drive permissions'],
    possibleFix: 'Right-click the unresolved reference in the External References palette -> Select "Select New Path" -> Browse to the moved file -> Right click again and choose "Change Path Type" -> "Make Relative".'
  },

  // Revit
  {
    id: 'revit-err-1',
    software: 'Revit',
    errorCodeOrTitle: 'Elements Are Joined But Do Not Intersect',
    errorSnippet: 'Highlighted elements are joined but do not intersect or share a common face.',
    likelyCause: 'Two wall segments, floor slabs, or structural framing members have an automated geometry join constraint, but a subsequent dimension or level move shifted them out of physical contact.',
    howToTroubleshoot: [
      'Click "Show" in the error dialog to zoom directly to the offending elements.',
      'Note the Element IDs displayed in the warning dialog.'
    ],
    whatToCheck: ['Wall end join grip condition', 'Slab edge offsets', 'Level constraints'],
    possibleFix: 'Select one of the highlighted walls -> Click "Unjoin Geometry" on the Modify ribbon, or right-click the wall blue end grip and select "Disallow Join", then manually re-align with the AL tool.'
  },
  {
    id: 'revit-err-2',
    software: 'Revit',
    errorCodeOrTitle: 'Local File Out of Date With Central Model',
    errorSnippet: 'Your local file is not up to date with the central model. You must reload latest before synchronizing.',
    likelyCause: 'Another team member synchronized changes that modified shared elements or worksets borrowed by your session.',
    howToTroubleshoot: ['Check the Worksharing Monitor or Collaborate ribbon status.'],
    whatToCheck: ['Unsaved work in current view', 'Network connectivity to BIM 360 / ACC cloud or local Revit Server'],
    possibleFix: 'Click the "Reload Latest" button on the Collaborate ribbon. Review any newly merged geometry. Once reloaded without conflicts, press "Synchronize with Central" (Ctrl+S or Synchronize icon).'
  },

  // 3ds Max
  {
    id: 'max-err-1',
    software: '3ds Max',
    errorCodeOrTitle: 'System Out of Memory During Render',
    errorSnippet: 'V-Ray / Corona Exception: System out of memory while compiling geometry / building embree BVH',
    likelyCause: 'Scene exceeded physical RAM / VRAM due to un-instanced high-poly CAD imports, 8K uncompressed texture maps, or excessive displacement subdivisions.',
    howToTroubleshoot: [
      'Open Windows Task Manager -> Performance -> Memory to check commit charge.',
      'Check Polygon count (Press 7 in 3ds Max viewport).'
    ],
    whatToCheck: ['Displacement modifier edge length', 'Presence of high-poly 3D trees and cars as raw editable meshes rather than proxies'],
    possibleFix: 'Convert repeated geometry (furniture, trees, light fixtures) to V-Ray/Corona Proxies (.vrmesh/.cgeo). In render settings, increase Dynamic Memory Limit to match your RAM (e.g. 24000 MB), and set displacement edge length >= 2.0 pixels.'
  },

  // SketchUp
  {
    id: 'skp-err-1',
    software: 'SketchUp',
    errorCodeOrTitle: 'Unexpected File Format / Unable to Open File',
    errorSnippet: 'This does not appear to be a valid SketchUp model or the file version is newer.',
    likelyCause: 'The .skp file was saved in a newer version of SketchUp than the one currently installed, or the file was corrupted during an abrupt computer crash/power cut.',
    howToTroubleshoot: [
      'Check the file extension and verify if a .skb (backup file) exists in the same folder.',
      'Check file size (if file size is 0 KB, file is empty/corrupt).'
    ],
    whatToCheck: ['Software release year (e.g. SketchUp 2024 vs 2021)', 'Backup .skb file in directory'],
    possibleFix: 'Rename the automatic backup file from "project.skb" to "project_recovered.skp" and open it. If version incompatibility, open the file in the free SketchUp Web or modern SketchUp and choose "Save As" -> select the earlier target version.'
  },

  // SolidWorks
  {
    id: 'sw-err-1',
    software: 'SolidWorks',
    errorCodeOrTitle: 'Sketch is Over Defined',
    errorSnippet: 'The sketch is over defined. Consider deleting one or more of the following constraints or dimensions: [Red / Yellow Dimensions]',
    likelyCause: 'Conflicting geometric relations (e.g., specifying both a Horizontal constraint and an Angle dimension, or redundant smart dimensions on coincident endpoints).',
    howToTroubleshoot: [
      'Look for bright red (conflicting) and yellow (redundant) dimensions.',
      'Click the red warning icon in the bottom status bar.'
    ],
    whatToCheck: ['Automatic tangent/horizontal relations created during sketching', 'External in-context references'],
    possibleFix: 'Click "SketchXpert" in the PropertyManager -> Click "Diagnose" -> Cycle through the solver solutions and click "Accept" to delete the conflicting redundant relation.'
  },

  // STAAD.Pro
  {
    id: 'staad-err-1',
    software: 'STAAD.Pro',
    errorCodeOrTitle: 'Zero Stiffness Detected / Structural Instability',
    errorSnippet: '**WARNING: ZERO STIFFNESS DETECTED AT NODE 42 DOF RY. POSSIBLE INSTABILITY.**',
    likelyCause: 'A structural node has no rotational or translational restraint, such as a beam released at both ends for torsional rotation (MX/MY/MZ) or an unbraced cantilever mechanism.',
    howToTroubleshoot: [
      'Open STAAD Output Viewer (.ANL file)',
      'Search for "ZERO STIFFNESS" or "INSTABILITY" to locate node numbers.'
    ],
    whatToCheck: ['MEMBER RELEASE commands', 'Pinned vs Fixed support definitions', 'Node connectivity'],
    possibleFix: 'Inspect the reported node in the modeling view. Ensure members are not released for torsion (never release both ends of a beam in MZ and MX simultaneously), and verify the node is properly framed into the structure.'
  },

  // ETABS
  {
    id: 'etabs-err-1',
    software: 'ETABS',
    errorCodeOrTitle: 'Modal Mass Participation Under 90%',
    errorSnippet: 'Warning: Modal Participating Mass Ratio in UX/UY is 78.4% (Below required 90.0% code limit)',
    likelyCause: 'Insufficient number of modes calculated to capture higher vibration mode shapes, or localized flexible elements (stair slabs or cantilevers) consuming modes.',
    howToTroubleshoot: [
      'Open Display -> Show Tables -> Modal Participating Mass Ratios.',
      'Check which modes are contributing the most mass.'
    ],
    whatToCheck: ['Total number of requested modes in Modal Case definition', 'Presence of flexible modeling artifacts'],
    possibleFix: 'Go to Define -> Modal Cases -> Modify Case -> Increase the number of modes from default 12 to 24 or 36. Switch from Eigenvectors to Ritz Vectors using lateral load patterns (Acceleration UX, UY, RZ) as starting vectors for faster convergence.'
  },

  // Tekla Structures
  {
    id: 'tekla-err-1',
    software: 'Tekla Structures',
    errorCodeOrTitle: 'Part Overlaps / Clash in Assembly',
    errorSnippet: 'Clash detected between Part [B104] and Column Flange [C101] - Penetration Volume 4500 mm³',
    likelyCause: 'Beam copes/notches are missing at the connection joint, or connection component parameters have insufficient clearance offset.',
    howToTroubleshoot: ['Run Clash Check (Tools -> Clash Check Manager) -> Double click clash to zoom in.'],
    whatToCheck: ['Fitting and cut commands', 'Connection component parameter settings'],
    possibleFix: 'Apply a "Fitting" (Line cut) on the incoming beam or adjust the "Clearance" parameter inside the Beam-to-Column component dialog (e.g. Component 144 or 182) to automatically notch the flange.'
  },

  // Adobe Photoshop
  {
    id: 'ps-err-1',
    software: 'Adobe Photoshop',
    errorCodeOrTitle: 'Scratch Disks Are Full',
    errorSnippet: 'Could not complete your request because the scratch disks are full.',
    likelyCause: 'Temporary disk cache from large multi-layer architectural rendering documents (PSB/PSD) exhausted free space on the C: drive.',
    howToTroubleshoot: ['Check Windows File Explorer -> Drive C: free space.'],
    whatToCheck: ['Document dimensions (e.g. accidentally created 4000 inches instead of 4000 pixels)', 'History states count in Preferences'],
    possibleFix: 'Hold Ctrl+Alt while launching Photoshop to immediately bring up Scratch Disk preferences, and select a secondary hard drive (e.g. D: or E:) with ample free gigabytes. Set History States to 30-50 instead of 100.'
  },

  // Adobe Illustrator
  {
    id: 'ai-err-1',
    software: 'Adobe Illustrator',
    errorCodeOrTitle: 'Can\'t Open the Illustration (PDF / CAD Import)',
    errorSnippet: 'Can\'t open the illustration. The file is damaged or was generated by an unrecognized CAD translator.',
    likelyCause: 'Importing a DXF/DWG file saved in an overly new AutoCAD format (e.g. 2024 binary) or corrupted PDF font encodings.',
    howToTroubleshoot: ['Check the DWG/DXF source version in AutoCAD.'],
    whatToCheck: ['AutoCAD save version (R12, 2000, 2013, 2018)'],
    possibleFix: 'In AutoCAD, run WBLOCK -> Save file as "AutoCAD 2004/2007 DXF", or in AutoCAD print/plot the drawing as an Adobe PDF with "TrueType as Text" enabled, then open the clean vector PDF in Illustrator.'
  }
];
