import { Project, ProjectResourceAllocation, ProjectTeamMemberAllocation, ProjectMaterialRequirement } from '../types';

/**
 * Returns or dynamically computes a professional, realistic resource allocation breakdown
 * for a project including dedicated team members and materials requirements.
 */
export function getProjectResourceAllocation(project: Project): ProjectResourceAllocation {
  if (project.resourceAllocation && project.resourceAllocation.team?.length > 0) {
    return project.resourceAllocation;
  }

  // Generate tailored team members based on project characteristics
  const isBimHeavy = (project.softwareUsed || []).some(s => s.toLowerCase().includes('revit') || s.toLowerCase().includes('bim')) ||
                     (project.bimLevel || '').includes('LOD');
  const isResidential = project.categoryId === 'cat-arch' || project.title.toLowerCase().includes('villa') || project.title.toLowerCase().includes('residence');
  const isInterior = project.categoryId === 'cat-interior' || project.title.toLowerCase().includes('interior') || project.title.toLowerCase().includes('penthouse');
  
  const team: ProjectTeamMemberAllocation[] = [
    {
      id: 'team-alloc-1',
      name: 'Fiza Hayat',
      role: 'Principal Architect & Design Director',
      discipline: 'Architecture',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      allocationPercent: 85,
      hoursCommitted: 320,
      assignedTasks: ['Parametric Concept Design', 'Client Milestone Presentations', 'Design Coordination'],
      status: 'active'
    },
    {
      id: 'team-alloc-2',
      name: 'Tariq Al-Mansoor',
      role: isBimHeavy ? 'Chief BIM Director & Structural Lead' : 'Lead Structural Engineer',
      discipline: isBimHeavy ? 'BIM & 3D' : 'Structural',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
      allocationPercent: 100,
      hoursCommitted: 460,
      assignedTasks: ['LOD 350/400 Revit Coordination', 'Structural Load & Seismic Simulation', 'MEP Clash Detection'],
      status: 'active'
    },
    {
      id: 'team-alloc-3',
      name: 'Elena Rostova',
      role: isInterior ? 'Lead Interior Architect' : 'Senior Spatial & Materials Architect',
      discipline: 'Interior',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
      allocationPercent: 70,
      hoursCommitted: 280,
      assignedTasks: ['Material Specifications Schedule', 'Bespoke Millwork Details', 'Acoustic & Lighting Integration'],
      status: isInterior ? 'active' : 'completed'
    },
    {
      id: 'team-alloc-4',
      name: 'Marcus Vance',
      role: 'Senior 3D Visualizer & VR Developer',
      discipline: 'BIM & 3D',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      allocationPercent: 60,
      hoursCommitted: 210,
      assignedTasks: ['Real-Time Unreal Engine 5 Twin', '4K Ray-Traced Walkthroughs', 'VR Spatial Experience'],
      status: 'completed'
    },
    {
      id: 'team-alloc-5',
      name: 'David K. Lindholm',
      role: 'Construction Administration & Cost Estimator',
      discipline: 'Project Management',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      allocationPercent: 50,
      hoursCommitted: 190,
      assignedTasks: ['Bill of Quantities (BOQ) Audit', 'Contractor Procurement QA', 'LEED Compliance Verification'],
      status: 'active'
    }
  ];

  // Derive Material Requirements from project.materials or defaults
  const projectMaterialsList = (project.materials && project.materials.length > 0)
    ? project.materials
    : ['Structural Concrete M35', 'Acoustic Triple Glazing', 'Zinc Architectural Cladding', 'Honed Travertine Marble'];

  const materialsDatabase: Record<string, Partial<ProjectMaterialRequirement>> = {
    'Acoustic Triple-Glazed Glass': {
      category: 'Enclosure & Glass',
      specification: 'Low-E Argon Filled 12-16-12mm with Thermal Break Aluminum Frame',
      quantity: '4,200',
      unit: 'sq.ft',
      estimatedCost: 185000,
      sustainabilityRating: 'A+',
      procurementStatus: 'In Fabrication'
    },
    'Honed Travertine Marble': {
      category: 'Interior & Finishes',
      specification: 'Navona Classico 30mm Slab, Matte Honed Anti-Slip Sealer',
      quantity: '3,100',
      unit: 'sq.ft',
      estimatedCost: 95000,
      sustainabilityRating: 'A',
      procurementStatus: 'Procured'
    },
    'Dark Weathering Zinc': {
      category: 'Metals & Hardware',
      specification: 'VMZINC Anthra-Zinc Standing Seam Pre-Weathered Panels',
      quantity: '2,800',
      unit: 'sq.ft',
      estimatedCost: 112000,
      sustainabilityRating: 'A+',
      procurementStatus: 'Delivered'
    },
    'Charred Yakisugi Cedar': {
      category: 'Interior & Finishes',
      specification: 'Gendai Surface-Burnt Japanese Cedar Cladding with Natural Oil',
      quantity: '1,450',
      unit: 'sq.ft',
      estimatedCost: 48000,
      sustainabilityRating: 'A+',
      procurementStatus: 'Procured'
    },
    'Post-Tensioned Concrete & Cantilevered Steel': {
      category: 'Structural',
      specification: 'Grade 50 High-Strength Post-Tensioned Tendons & C35/45 Self-Compacting Mix',
      quantity: '850',
      unit: 'cu.yd',
      estimatedCost: 260000,
      sustainabilityRating: 'B',
      procurementStatus: 'Delivered'
    }
  };

  const materials: ProjectMaterialRequirement[] = projectMaterialsList.map((matName, idx) => {
    // Check known database or generate realistic values
    const match = Object.entries(materialsDatabase).find(([k]) => 
      matName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(matName.toLowerCase())
    );

    if (match) {
      return {
        id: `mat-${idx + 1}`,
        name: matName,
        category: match[1].category || 'Structural',
        specification: match[1].specification || 'Architectural Grade Specification',
        quantity: match[1].quantity || '2,400',
        unit: match[1].unit || 'units',
        estimatedCost: match[1].estimatedCost || (50000 + idx * 25000),
        sustainabilityRating: match[1].sustainabilityRating || 'A',
        procurementStatus: match[1].procurementStatus || 'Specified'
      };
    }

    // Dynamic generation for custom materials
    const isGlass = matName.toLowerCase().includes('glass') || matName.toLowerCase().includes('glazing');
    const isWood = matName.toLowerCase().includes('timber') || matName.toLowerCase().includes('cedar') || matName.toLowerCase().includes('wood');
    const isMetal = matName.toLowerCase().includes('steel') || matName.toLowerCase().includes('zinc') || matName.toLowerCase().includes('aluminum');
    const isStone = matName.toLowerCase().includes('marble') || matName.toLowerCase().includes('granite') || matName.toLowerCase().includes('concrete');

    let category: ProjectMaterialRequirement['category'] = 'Structural';
    let unit = 'sq.ft';
    let qty = '3,200';
    let cost = 65000 + (idx * 22000);
    let rating: ProjectMaterialRequirement['sustainabilityRating'] = 'A';
    let status: ProjectMaterialRequirement['procurementStatus'] = idx % 2 === 0 ? 'Procured' : 'In Fabrication';

    if (isGlass) {
      category = 'Enclosure & Glass';
      unit = 'sq.ft';
      qty = '3,600';
      cost = 145000;
      rating = 'A+';
    } else if (isWood) {
      category = 'Interior & Finishes';
      unit = 'linear ft';
      qty = '2,100';
      cost = 58000;
      rating = 'A+';
    } else if (isMetal) {
      category = 'Metals & Hardware';
      unit = 'tons';
      qty = '42';
      cost = 175000;
      rating = 'A';
    } else if (isStone) {
      category = 'Structural';
      unit = 'cu.yd';
      qty = '750';
      cost = 210000;
      rating = 'B';
    }

    return {
      id: `mat-${idx + 1}`,
      name: matName,
      category,
      specification: `High-Performance Grade Architectural ${category} Specification`,
      quantity: qty,
      unit,
      estimatedCost: cost,
      sustainabilityRating: rating,
      procurementStatus: status
    };
  });

  const totalTeamHours = team.reduce((acc, member) => acc + member.hoursCommitted, 0);
  const totalMaterialsBudget = materials.reduce((acc, m) => acc + m.estimatedCost, 0);

  return {
    team,
    materials,
    totalTeamHours,
    totalMaterialsBudget
  };
}
