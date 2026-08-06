import {
  DigitalProduct,
  SellerStore,
  CommunityPost,
  Course,
  JobListing,
  ProfessionalProfile,
  MarketplaceOrder
} from '../types/marketplace';

export const initialSellerStores: SellerStore[] = [
  {
    id: 'store-archviz',
    sellerUserId: 'user-archviz',
    sellerName: 'ArchStudio Pro',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    storeName: 'ArchStudio Pro Digital Assets',
    storeSlug: 'archstudio-pro',
    tagline: 'Premium Bim, Revit & CAD Architectural Collections',
    bio: 'Licensed architect team specializing in high-precision Revit models, DWG working drawings, and parametric BIM families.',
    storeLogo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80',
    storeBanner: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    verified: true,
    rating: 4.9,
    reviewCount: 142,
    followersCount: 890,
    totalSales: 412,
    revenue: 28900,
    location: 'London, UK & Global Remote',
    websiteUrl: 'https://archstudiopro.example.com',
    createdAt: '2025-01-15T00:00:00.000Z'
  },
  {
    id: 'store-lumina',
    sellerUserId: 'user-lumina',
    sellerName: 'Lumina Interior Lab',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    storeName: 'Lumina Interior & 3D Assets',
    storeSlug: 'lumina-interior-lab',
    tagline: 'Photorealistic Interior 3D Models & SketchUp Packages',
    bio: 'Interior designers & 3D visualizers creating turn-key SketchUp models, GLB/FBX assets, and material packs.',
    storeLogo: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=300&q=80',
    storeBanner: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1200&q=80',
    verified: true,
    rating: 4.8,
    reviewCount: 98,
    followersCount: 650,
    totalSales: 310,
    revenue: 19400,
    location: 'Milan, Italy',
    websiteUrl: 'https://luminainteriors.example.com',
    createdAt: '2025-02-01T00:00:00.000Z'
  },
  {
    id: 'store-constructai',
    sellerUserId: 'user-constructai',
    sellerName: 'BuildTech Media',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    storeName: 'BuildTech Construction Systems',
    storeSlug: 'buildtech-construction',
    tagline: 'BOQ Excel Sheets, AI Prompt Packs & Motion Templates',
    bio: 'Quantity surveyors, project managers, and digital creators delivering construction management tools.',
    storeLogo: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=300&q=80',
    storeBanner: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    verified: true,
    rating: 4.95,
    reviewCount: 210,
    followersCount: 1200,
    totalSales: 680,
    revenue: 42300,
    location: 'New York, USA',
    websiteUrl: 'https://buildtechmedia.example.com',
    createdAt: '2025-01-10T00:00:00.000Z'
  }
];

export const initialDigitalProducts: DigitalProduct[] = [
  {
    id: 'prod-modern-villa-plan',
    title: 'Ultra-Modern Minimalist Villa 2-Story CAD & Revit Package',
    slug: 'modern-villa-plan-cad-revit',
    description: 'Complete architectural working drawing set including 3D BIM Revit model, structural DWG files, and high-res PDF presentation floor plans.',
    fullDetails: 'Includes full structural details, HVAC layouts, electrical plans, door & window schedules, 3D Revit file (.RVT), AutoCAD (.DWG), and 4K renders.',
    category: 'House Plans',
    price: 149.00,
    discountPrice: 99.00,
    fileFormats: ['DWG', 'RVT', 'PDF', 'ZIP', 'PNG'],
    fileSize: '485 MB',
    fileUrl: 'https://example.com/downloads/modern-villa-bundle.zip',
    previewImages: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],
    previewVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    sellerId: 'user-archviz',
    sellerName: 'ArchStudio Pro',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    storeId: 'store-archviz',
    storeName: 'ArchStudio Pro Digital Assets',
    storeVerified: true,
    rating: 4.9,
    reviewCount: 48,
    salesCount: 184,
    tags: ['House Plan', 'Revit', 'AutoCAD', 'BIM', 'Villa'],
    featured: true,
    inventoryStatus: 'in_stock',
    discountActive: true,
    createdAt: '2025-02-10T00:00:00.000Z'
  },
  {
    id: 'prod-autocad-details-library',
    title: 'Master Architectural AutoCAD Construction Detail Library (500+ Blocks)',
    slug: 'autocad-detail-library-500-blocks',
    description: 'Universal DWG block library featuring foundations, curtain walls, waterproofing, staircases, roofing, and structural joints.',
    fullDetails: 'Clean, layered DWG files formatted for AutoCAD 2018-2026. Pre-scaled hatchings, dimensions, annotations, and title block templates.',
    category: 'AutoCAD Drawings',
    price: 79.00,
    fileFormats: ['DWG', 'PDF', 'ZIP'],
    fileSize: '120 MB',
    fileUrl: 'https://example.com/downloads/autocad-master-blocks.zip',
    previewImages: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80'
    ],
    sellerId: 'user-archviz',
    sellerName: 'ArchStudio Pro',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    storeId: 'store-archviz',
    storeName: 'ArchStudio Pro Digital Assets',
    storeVerified: true,
    rating: 5.0,
    reviewCount: 62,
    salesCount: 310,
    tags: ['AutoCAD', 'DWG', 'Details', 'Construction', 'Blocks'],
    featured: true,
    inventoryStatus: 'in_stock',
    createdAt: '2025-02-12T00:00:00.000Z'
  },
  {
    id: 'prod-luxury-penthouse-sketchup',
    title: 'Luxury Contemporary Penthouse SketchUp Model + V-Ray Preset',
    slug: 'luxury-penthouse-sketchup-vray',
    description: 'Fully furnished SketchUp (.SKP) interior model complete with custom lighting, realistic PBR materials, and V-Ray 6 render settings.',
    fullDetails: 'Optimized polygon count, grouped components, materials labeled. Compatible with SketchUp 2021+, V-Ray, Enscape, and Twinmotion.',
    category: 'SketchUp Models',
    price: 65.00,
    fileFormats: ['SKP', 'OBJ', 'FBX', 'ZIP'],
    fileSize: '340 MB',
    fileUrl: 'https://example.com/downloads/penthouse-sketchup.zip',
    previewImages: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1200&q=80'
    ],
    sellerId: 'user-lumina',
    sellerName: 'Lumina Interior Lab',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    storeId: 'store-lumina',
    storeName: 'Lumina Interior & 3D Assets',
    storeVerified: true,
    rating: 4.85,
    reviewCount: 32,
    salesCount: 145,
    tags: ['SketchUp', 'V-Ray', 'Penthouse', 'Interior', '3D Model'],
    featured: true,
    inventoryStatus: 'in_stock',
    createdAt: '2025-02-14T00:00:00.000Z'
  },
  {
    id: 'prod-construction-boq-estimator',
    title: 'Automated Construction BOQ & Quantity Estimation Excel System',
    slug: 'construction-boq-estimator-excel',
    description: 'Dynamic spreadsheet system for material cost estimation, labor rate calculation, waste ratios, and automated client quotation generators.',
    fullDetails: 'Pre-loaded formulas for concrete volume, steel weight, masonry, plastering, painting, plumbing, and electrical item rates.',
    category: 'Quantity Estimation Templates',
    price: 49.00,
    discountPrice: 29.00,
    fileFormats: ['PDF', 'ZIP'],
    fileSize: '15 MB',
    fileUrl: 'https://example.com/downloads/boq-estimation-sheet.zip',
    previewImages: [
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80'
    ],
    sellerId: 'user-constructai',
    sellerName: 'BuildTech Media',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    storeId: 'store-constructai',
    storeName: 'BuildTech Construction Systems',
    storeVerified: true,
    rating: 4.95,
    reviewCount: 110,
    salesCount: 520,
    tags: ['Estimation', 'BOQ', 'Quantity Survey', 'Excel', 'Budgeting'],
    featured: true,
    inventoryStatus: 'in_stock',
    discountActive: true,
    createdAt: '2025-01-20T00:00:00.000Z'
  },
  {
    id: 'prod-archviz-ai-prompts',
    title: 'Midjourney v6 & DALL-E 3 Architectural Prompt Engineering Pack',
    slug: 'midjourney-architectural-prompts-pack',
    description: 'Over 300+ battle-tested AI prompts for generating photo-realistic exterior facades, interior lighting concepts, and landscape designs.',
    fullDetails: 'Includes camera lens settings, lighting keywords, materials syntax, style references, and step-by-step PDF usage manual.',
    category: 'AI Prompt Packs',
    price: 25.00,
    fileFormats: ['PDF', 'ZIP'],
    fileSize: '8 MB',
    fileUrl: 'https://example.com/downloads/archviz-ai-prompts.zip',
    previewImages: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
    ],
    sellerId: 'user-constructai',
    sellerName: 'BuildTech Media',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    storeId: 'store-constructai',
    storeName: 'BuildTech Construction Systems',
    storeVerified: true,
    rating: 4.9,
    reviewCount: 88,
    salesCount: 390,
    tags: ['AI Prompts', 'Midjourney', 'ArchViz', 'Generative Design'],
    featured: false,
    inventoryStatus: 'in_stock',
    createdAt: '2025-02-18T00:00:00.000Z'
  },
  {
    id: 'prod-revit-parametric-furniture-pack',
    title: 'Nordic Modern Parametric Revit Furniture & Lighting Family Pack',
    slug: 'revit-parametric-furniture-pack',
    description: '120+ parametric Revit (.RVT / .RFA) families with customizable materials, dimensions, and LOD 350 BIM metadata.',
    fullDetails: 'Includes chairs, tables, sofas, pendant lights, and decorative objects. Fully tagged and compatible with Revit 2020 through 2026.',
    category: 'Revit Projects',
    price: 85.00,
    fileFormats: ['RVT', 'ZIP'],
    fileSize: '210 MB',
    fileUrl: 'https://example.com/downloads/revit-furniture-pack.zip',
    previewImages: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80'
    ],
    sellerId: 'user-archviz',
    sellerName: 'ArchStudio Pro',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    storeId: 'store-archviz',
    storeName: 'ArchStudio Pro Digital Assets',
    storeVerified: true,
    rating: 4.88,
    reviewCount: 29,
    salesCount: 112,
    tags: ['Revit', 'BIM', 'Families', 'Furniture', 'RFA'],
    featured: false,
    inventoryStatus: 'in_stock',
    createdAt: '2025-02-20T00:00:00.000Z'
  }
];

export const initialMarketplaceOrders: MarketplaceOrder[] = [
  {
    id: 'ord-1001',
    orderNumber: 'FH-ORD-892101',
    buyerUserId: 'buyer-demo',
    buyerName: 'Alex Mercer',
    buyerEmail: 'alex.mercer@example.com',
    items: [
      {
        productId: 'prod-modern-villa-plan',
        productTitle: 'Ultra-Modern Minimalist Villa 2-Story CAD & Revit Package',
        category: 'House Plans',
        price: 99.00,
        fileUrl: 'https://example.com/downloads/modern-villa-bundle.zip',
        fileFormats: ['DWG', 'RVT', 'PDF', 'ZIP', 'PNG'],
        sellerId: 'user-archviz',
        sellerName: 'ArchStudio Pro',
        previewImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
      }
    ],
    totalAmount: 99.00,
    paymentMethod: 'Credit Card / Stripe',
    paymentStatus: 'paid',
    transactionId: 'txn_3Mv9810X928120',
    invoiceUrl: '#',
    refundRequested: false,
    createdAt: '2025-02-25T14:30:00.000Z'
  }
];

export const initialCommunityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    title: 'How do you optimize large Revit BIM models for faster V-Ray rendering?',
    content: 'We are working on a 15-story commercial complex BIM model. The file size is currently around 800MB and viewport rendering stutters. What are your top tips for purging unused families, reducing polygon counts, and setting up proxy objects?',
    postType: 'question',
    category: 'Revit & BIM',
    authorUserId: 'user-david',
    authorName: 'David K., Lead Architect',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    authorRole: 'Architectural Engineer',
    answers: [
      {
        id: 'ans-1',
        postId: 'post-1',
        authorUserId: 'user-archviz',
        authorName: 'ArchStudio Pro',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        content: '1. Use Purge Unused twice before saving.\n2. Convert detailed 3D furniture into V-Ray VRMesh proxy files.\n3. Turn off high-res procedural materials in workshare view mode.',
        likesCount: 14,
        likedByUsers: [],
        isAccepted: true,
        createdAt: '2025-02-26T10:15:00.000Z'
      }
    ],
    likesCount: 24,
    likedByUsers: [],
    bookmarksCount: 9,
    bookmarkedByUsers: [],
    isReported: false,
    isResolved: true,
    createdAt: '2025-02-26T08:00:00.000Z'
  },
  {
    id: 'post-2',
    title: 'Discussion: AI vs Traditional CAD drafting speed in 2026',
    content: 'Are you using AI plugins inside AutoCAD or Revit for instant room labeling and dimensioning? Share your experience on accuracy vs manual drafting.',
    postType: 'discussion',
    category: 'AI & Automation',
    authorUserId: 'user-constructai',
    authorName: 'BuildTech Media',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    authorRole: 'BIM Automation Specialist',
    answers: [],
    likesCount: 18,
    likedByUsers: [],
    bookmarksCount: 5,
    bookmarkedByUsers: [],
    isReported: false,
    createdAt: '2025-02-27T11:00:00.000Z'
  }
];

export const initialCourses: Course[] = [
  {
    id: 'course-revit-mastery',
    title: 'Complete Masterclass: Parametric BIM & Revit 2026 Architectural Engineering',
    slug: 'revit-architectural-masterclass',
    description: 'Learn step-by-step how to construct complex parametric buildings, generate automated BOQs, and create photorealistic V-Ray renders.',
    category: 'Architecture & BIM',
    level: 'Intermediate',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    price: 120.00,
    creatorId: 'user-archviz',
    creatorName: 'ArchStudio Pro',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    lessons: [
      {
        id: 'les-1',
        title: 'Module 1: Setting up Grids, Levels, and Structural Columns',
        duration: '22 mins',
        type: 'video',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
      },
      {
        id: 'les-2',
        title: 'Module 2: Architectural Wall Families & Curtain Wall Details',
        duration: '35 mins',
        type: 'video',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
      },
      {
        id: 'les-3',
        title: 'BIM Standards & Structural Code Handbook',
        duration: 'PDF Handbook',
        type: 'pdf_notes',
        pdfUrl: '#'
      },
      {
        id: 'les-4',
        title: 'Knowledge Check: BIM LOD Standards Quiz',
        duration: '10 mins',
        type: 'quiz',
        quizQuestions: [
          {
            question: 'Which LOD level represents detailed fabrication and assembly details?',
            options: ['LOD 100', 'LOD 200', 'LOD 350 / 400', 'LOD 500'],
            correctIndex: 2
          }
        ]
      }
    ],
    totalDuration: '8 Hours 45 Mins',
    enrolledStudentsCount: 420,
    rating: 4.9,
    reviewCount: 76,
    certificateProvided: true,
    createdAt: '2025-01-20T00:00:00.000Z'
  }
];

export const initialJobListings: JobListing[] = [
  {
    id: 'job-1',
    title: 'Senior Architectural Revit / BIM Specialist',
    companyName: 'Apex Urban Designs',
    companyLogo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80',
    employerUserId: 'emp-apex',
    jobType: 'Full-time',
    category: 'Architecture',
    location: 'London, UK (Hybrid)',
    salaryRange: '$85,000 - $110,000 / yr',
    description: 'Looking for a seasoned BIM Manager to lead Revit modeling for high-rise commercial developments.',
    requirements: [
      '5+ years experience in Revit & Navisworks',
      'Proven expertise in clash detection & LOD 400',
      'Degree in Architecture or Civil Engineering'
    ],
    servicesRequested: ['Revit Modeling', 'Navisworks Clash Detection', 'Working Drawings'],
    applicantsCount: 12,
    status: 'open',
    createdAt: '2025-02-20T00:00:00.000Z'
  },
  {
    id: 'job-2',
    title: 'Freelance 3D Visualizer - Luxury Hotel Suite Renders',
    companyName: 'Lumina Interior Lab',
    companyLogo: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=300&q=80',
    employerUserId: 'user-lumina',
    jobType: 'Freelance',
    category: '3D Visualization',
    location: 'Remote Global',
    salaryRange: '$2,500 Fixed Project Budget',
    description: 'Need 6 photorealistic 4K interior renders in 3ds Max + Corona or SketchUp + V-Ray based on provided CAD files.',
    requirements: [
      'Exceptional lighting & texture realism portfolio',
      'Turnaround time: 10 business days'
    ],
    servicesRequested: ['3D Modeling', 'Photorealistic Rendering'],
    applicantsCount: 28,
    status: 'open',
    createdAt: '2025-02-25T00:00:00.000Z'
  }
];

export const initialProfessionalProfiles: ProfessionalProfile[] = [
  {
    id: 'prof-1',
    userId: 'user-archviz',
    name: 'ArchStudio Pro (Fiza Hayat Certified)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    title: 'Principal Architectural & BIM Engineer',
    profession: 'Architect',
    location: 'London, United Kingdom',
    experienceYears: 12,
    rating: 4.95,
    reviewCount: 140,
    hourlyRate: '$85 / hr',
    verified: true,
    bio: 'Chartered architect specializing in luxury residential estates, sustainable structural design, and BIM coordination.',
    services: ['Architectural House Plans', 'Revit BIM Modeling', 'AutoCAD Working Drawings', 'Building Permits'],
    softwareSkills: ['Revit', 'AutoCAD', 'V-Ray', 'Rhino 3D', 'Photoshop'],
    portfolioImages: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
    ],
    contactEmail: 'contact@archstudiopro.example.com',
    phone: '+44 20 7946 0912'
  },
  {
    id: 'prof-2',
    userId: 'user-lumina',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    title: 'Senior Interior Design & 3D Artist',
    profession: 'Interior Designer',
    location: 'Milan, Italy',
    experienceYears: 8,
    rating: 4.88,
    reviewCount: 92,
    hourlyRate: '$70 / hr',
    verified: true,
    bio: 'Italian interior designer focused on contemporary, minimalist, and luxury hospitality spaces.',
    services: ['Interior Design Packages', '3D Photorealistic Rendering', 'Material Moodboards', 'Lighting Plans'],
    softwareSkills: ['SketchUp', '3ds Max', 'V-Ray', 'Enscape', 'Indesign'],
    portfolioImages: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'
    ],
    contactEmail: 'elena@luminainteriors.example.com'
  },
  {
    id: 'prof-3',
    userId: 'user-constructai',
    name: 'Marcus Vance, PE',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    title: 'Civil & Quantity Surveying Engineer',
    profession: 'Engineer',
    location: 'New York, USA',
    experienceYears: 15,
    rating: 4.98,
    reviewCount: 185,
    hourlyRate: '$95 / hr',
    verified: true,
    bio: 'Licensed structural engineer providing BOQ quantity estimations, site management advice, and structural audits.',
    services: ['BOQ Cost Estimation', 'Structural Calculations', 'Site Inspection', 'Project Documentation'],
    softwareSkills: ['AutoCAD', 'ETABS', 'Primavera P6', 'MS Excel'],
    portfolioImages: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80'
    ],
    contactEmail: 'marcus.vance@example.com'
  }
];
