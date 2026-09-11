export interface SampleBlueprintSheet {
  id: string;
  projectId: string;
  sheetNumber: string;
  sheetTitle: string;
  discipline: 'Architectural' | 'Structural' | 'Interior & FF&E' | 'Revit BIM & CAD' | 'MEP & Environmental';
  scale: string;
  drawnBy: string;
  checkedBy: string;
  date: string;
  revision: string;
  projectTitle: string;
  location: string;
  description: string;
  payload: {
    app: string;
    projectId: string;
    sheetNumber: string;
    sheetTitle: string;
    revision: string;
    discipline: string;
    bimLevel: string;
  };
}

export const SAMPLE_BLUEPRINT_SHEETS: SampleBlueprintSheet[] = [
  {
    id: 'sheet-a101',
    projectId: 'proj-1',
    sheetNumber: 'A-101',
    sheetTitle: 'GROUND FLOOR PLAN & CANTILEVER POOL SECTION',
    discipline: 'Architectural',
    scale: '1:100 @ A0',
    drawnBy: 'Eng. Fiza Hayat, PE',
    checkedBy: 'Ar. Rohit Verma',
    date: '2026-03-15',
    revision: 'REV-03 (APPROVED FOR CONST)',
    projectTitle: 'The Obsidian Glass Villa - Coastal Estate',
    location: 'Zurich, Switzerland',
    description: 'Post-tensioned cantilevered slab details with triple-glazed thermal break curtain wall interface.',
    payload: {
      app: 'Fiza Hayat Architects & BIM Studio',
      projectId: 'proj-1',
      sheetNumber: 'A-101',
      sheetTitle: 'GROUND FLOOR PLAN & CANTILEVER POOL SECTION',
      revision: 'REV-03',
      discipline: 'Architectural & BIM',
      bimLevel: 'LOD 400'
    }
  },
  {
    id: 'sheet-s201',
    projectId: 'proj-4',
    sheetNumber: 'S-201',
    sheetTitle: 'SEISMIC DIAGRID NODE & SHEAR CORE JUNCTION',
    discipline: 'Revit BIM & CAD',
    scale: '1:50 @ A0',
    drawnBy: 'Eng. Kenji Sato, SE',
    checkedBy: 'Eng. Fiza Hayat, PE',
    date: '2026-04-02',
    revision: 'REV-04 (MEP CLASH-FREE)',
    projectTitle: 'Neo-Tokyo Parametric Tower - Revit BIM & CAD',
    location: 'Tokyo, Japan',
    description: 'LOD 400 fabrication detailing for 62-story composite diagrid node with damper connections.',
    payload: {
      app: 'Fiza Hayat Architects & BIM Studio',
      projectId: 'proj-4',
      sheetNumber: 'S-201',
      sheetTitle: 'SEISMIC DIAGRID NODE & SHEAR CORE JUNCTION',
      revision: 'REV-04',
      discipline: 'Structural Engineering & BIM',
      bimLevel: 'LOD 400 / LOD 500'
    }
  },
  {
    id: 'sheet-id301',
    projectId: 'proj-2',
    sheetNumber: 'ID-301',
    sheetTitle: 'PENTHOUSE FOYER TRAVERTINE & ACOUSTIC TIMBER',
    discipline: 'Interior & FF&E',
    scale: '1:25 @ A1',
    drawnBy: 'Natasha Khan, AIA Int.',
    checkedBy: 'Eng. Fiza Hayat',
    date: '2026-02-10',
    revision: 'REV-02 (CLIENT SIGNED-OFF)',
    projectTitle: 'Aura Minimal Penthouse Interior',
    location: 'Downtown Dubai, UAE',
    description: 'Bespoke travertine book-matched cladding with recessed warm LED channels and KNX automation sensor points.',
    payload: {
      app: 'Fiza Hayat Architects & BIM Studio',
      projectId: 'proj-2',
      sheetNumber: 'ID-301',
      sheetTitle: 'PENTHOUSE FOYER TRAVERTINE & ACOUSTIC TIMBER',
      revision: 'REV-02',
      discipline: 'Interior Architecture & FF&E',
      bimLevel: 'LOD 350'
    }
  }
];
