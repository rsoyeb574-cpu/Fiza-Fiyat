import { Category, Project, Service, BlogArticle, Testimonial, GalleryItem, WebsiteSettings, TeamMember, MediaAsset } from '../types';

export const initialCategories: Category[] = [
  {
    id: 'cat-arch',
    name: 'Architecture & Building',
    slug: 'architecture-building',
    description: 'Commercial & residential architectural blueprints, structural elevation, and urban design.',
    icon: 'Building2',
    order: 1
  },
  {
    id: 'cat-interior',
    name: 'Interior & Exterior',
    slug: 'interior-exterior',
    description: 'Luxury indoor spatial planning, parametric facade design, landscape, and lighting.',
    icon: 'Sparkles',
    order: 2
  },
  {
    id: 'cat-3d-bim',
    name: '3D Rendering & BIM',
    slug: '3d-rendering-bim',
    description: 'Photorealistic architectural visualizations, Revit BIM models, and AutoCAD drafting.',
    icon: 'Layers',
    order: 3
  },
  {
    id: 'cat-ai-creative',
    name: 'AI & Generative Media',
    slug: 'ai-generative-media',
    description: 'Next-gen AI concept generation, neural video synthesis, and AI interior styling.',
    icon: 'Cpu',
    order: 4
  },
  {
    id: 'cat-branding-motion',
    name: 'Branding & Motion',
    slug: 'branding-motion',
    description: 'Premium visual brand identity, high-impact motion graphics, and video production.',
    icon: 'Palette',
    order: 5
  },
  {
    id: 'cat-web-ui',
    name: 'Web & UI/UX Design',
    slug: 'web-ui-design',
    description: 'Luxury digital hubs, SaaS interfaces, and interactive web applications.',
    icon: 'Monitor',
    order: 6
  }
];

export const initialServices: Service[] = [
  {
    id: 'srv-1',
    title: 'Building Design & Planning',
    slug: 'building-design',
    description: 'Comprehensive architectural plans, structural engineering, site layout, and permit drawings tailored for luxury residences and commercial high-rises.',
    icon: 'Building',
    features: ['Structural Blueprints', 'Site Planning', 'Regulatory Compliance', 'Elevation Diagrams'],
    category: 'Architecture',
    order: 1,
    featured: true
  },
  {
    id: 'srv-2',
    title: 'Luxury Interior Design',
    slug: 'interior-design',
    description: 'Bespoke spatial design, custom furniture curation, acoustic lighting, and sustainable material specification.',
    icon: 'Sofa',
    features: ['3D Spatial Layout', 'Material Specification', 'Custom Millwork', 'Lighting Schemes'],
    category: 'Interior Design',
    order: 2,
    featured: true
  },
  {
    id: 'srv-3',
    title: 'Parametric Exterior Design',
    slug: 'exterior-design',
    description: 'Innovative facade engineering, climate-responsive exterior cladding, and landscape integration.',
    icon: 'Sun',
    features: ['Facade Engineering', 'Landscape Design', 'Outdoor Lighting', 'Cladding Systems'],
    category: 'Architecture',
    order: 3,
    featured: true
  },
  {
    id: 'srv-4',
    title: 'Architectural Design',
    slug: 'architectural-design',
    description: 'End-to-end architectural conceptualization, master planning, and sustainable building systems.',
    icon: 'Compass',
    features: ['Master Planning', 'Sustainable Design', 'Feasibility Studies', 'Concept Development'],
    category: 'Architecture',
    order: 4
  },
  {
    id: 'srv-5',
    title: 'AutoCAD Drafting',
    slug: 'autocad-drafting',
    description: 'High-precision 2D CAD drafting for structural, electrical, plumbing (MEP), and floor plan layouts.',
    icon: 'FileCode',
    features: ['2D Floor Plans', 'MEP Drawings', 'Structural Details', 'As-Built Drawings'],
    category: 'Drafting',
    order: 5,
    featured: true
  },
  {
    id: 'srv-6',
    title: 'Revit BIM Modeling',
    slug: 'revit-modeling',
    description: 'LOD 300 to LOD 500 Building Information Modeling in Autodesk Revit for clash detection and estimation.',
    icon: 'Box',
    features: ['3D BIM Coordination', 'Clash Detection', 'Quantity Takeoff', 'Parametric Families'],
    category: 'BIM',
    order: 6,
    featured: true
  },
  {
    id: 'srv-7',
    title: '3D Modeling & CGI',
    slug: '3d-modeling',
    description: 'Intricate 3D polygonal and surface modeling for products, architectural geometry, and assets.',
    icon: 'Cuboid',
    features: ['Asset Modeling', 'Hard Surface Geometry', 'Topology Optimization', 'Texturing'],
    category: '3D & CG',
    order: 7
  },
  {
    id: 'srv-8',
    title: 'Photorealistic 3D Rendering',
    slug: '3d-rendering',
    description: 'Ultra-clear 8K ray-traced architectural and product visualization using Unreal Engine 5 & V-Ray.',
    icon: 'Image',
    features: ['8K Still Renders', 'Cinematic Lighting', 'Ray-traced Textures', 'Day/Night Visuals'],
    category: '3D & CG',
    order: 8,
    featured: true
  },
  {
    id: 'srv-9',
    title: '3D Walkthrough Animation',
    slug: '3d-animation',
    description: 'Immersive cinematic video walkthroughs and virtual fly-through animations for real estate.',
    icon: 'Video',
    features: ['Cinematic Camera Work', 'Ambient Audio Sync', 'VR Readiness', '4K Video Render'],
    category: 'Animation',
    order: 9,
    featured: true
  },
  {
    id: 'srv-10',
    title: 'Graphic Design & Brand Asset Creation',
    slug: 'graphic-design',
    description: 'Sophisticated typography, layout design, marketing collateral, and digital asset production.',
    icon: 'PenTool',
    features: ['Brand Style Guides', 'Print Collateral', 'Digital Assets', 'Vector Illustration'],
    category: 'Creative Design',
    order: 10
  },
  {
    id: 'srv-11',
    title: 'Motion Graphics Design',
    slug: 'motion-graphics',
    description: 'Captivating 2D & 3D motion graphics for product launches, logo intros, and promotional videos.',
    icon: 'Clapperboard',
    features: ['Logo Animations', 'Explainer Motion', 'Visual Effects', '3D Typography'],
    category: 'Motion',
    order: 11
  },
  {
    id: 'srv-12',
    title: 'Professional Video Editing',
    slug: 'video-editing',
    description: 'Commercial video post-production, color grading, sound design, and promotional cutdowns.',
    icon: 'Film',
    features: ['Color Grading (LOG)', 'Audio Mastering', 'Multi-cam Editing', 'Social Media Cuts'],
    category: 'Video',
    order: 12
  },
  {
    id: 'srv-13',
    title: 'AI Image Generation & Concepting',
    slug: 'ai-image-generation',
    description: 'Ultra-fast concept generation using customized Midjourney and Stable Diffusion neural pipelines.',
    icon: 'Wand2',
    features: ['Rapid Concepting', 'Custom Neural Style', 'Texture Synthesis', 'Style Transfer'],
    category: 'AI Services',
    order: 13,
    featured: true
  },
  {
    id: 'srv-14',
    title: 'AI Video Production',
    slug: 'ai-video-production',
    description: 'Generative AI video campaigns, synthetic avatar creation, and temporal video enhancement.',
    icon: 'Sparkle',
    features: ['Generative Video clips', 'AI Voiceover', 'Video Upscaling', 'Concept Reels'],
    category: 'AI Services',
    order: 14,
    featured: true
  },
  {
    id: 'srv-15',
    title: 'Social Media Design Strategy',
    slug: 'social-media-design',
    description: 'High-converting visual social kits for Instagram, LinkedIn, YouTube, and Pinterest campaigns.',
    icon: 'Share2',
    features: ['Grid Layout Systems', 'Carousel Templates', 'Ad Creatives', 'Content Calendar'],
    category: 'Marketing',
    order: 15
  },
  {
    id: 'srv-16',
    title: 'Brand Identity Systems',
    slug: 'brand-identity',
    description: 'Complete brand DNA design: logo system, brand voice, color matrix, guidelines, and packaging.',
    icon: 'Shield',
    features: ['Logo Suite', 'Brand Guidelines', 'Typography Hierarchy', 'Packaging Mockups'],
    category: 'Creative Design',
    order: 16,
    featured: true
  },
  {
    id: 'srv-17',
    title: 'Luxury Website Design',
    slug: 'website-design',
    description: 'Apple-inspired minimalist web design, custom interaction systems, and high-conversion landing pages.',
    icon: 'Layout',
    features: ['Custom Webflow/React', 'Micro-Interactions', 'CMS Integration', 'Ultra-fast Speed'],
    category: 'Digital Hub',
    order: 17,
    featured: true
  },
  {
    id: 'srv-18',
    title: 'UI/UX Mobile & Web Design',
    slug: 'ui-ux-design',
    description: 'User-centric wireframing, high-fidelity Figma prototypes, and design systems for mobile & web apps.',
    icon: 'Smartphone',
    features: ['User Journey Mapping', 'Figma Design Systems', 'Interactive Prototypes', 'Usability Audits'],
    category: 'Digital Hub',
    order: 18
  },
  {
    id: 'srv-19',
    title: 'Digital Marketing & Growth Strategy',
    slug: 'digital-marketing',
    description: 'Data-driven PPC performance marketing, technical SEO, and conversion funnel optimization.',
    icon: 'TrendingUp',
    features: ['SEO Audits', 'Performance Ads', 'Funnel Optimization', 'Analytics Dashboard'],
    category: 'Marketing',
    order: 19
  },
  {
    id: 'srv-20',
    title: 'Digital & Architectural Consulting',
    slug: 'consulting',
    description: 'Expert advisory for construction tech, BIM adoption, AI integration in creative workflows, and branding.',
    icon: 'Briefcase',
    features: ['Workflow Audits', 'BIM Implementation', 'AI Tooling Strategy', 'Design Review'],
    category: 'Consulting',
    order: 20
  }
];

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'The Obsidian Glass Villa - Coastal Estate',
    slug: 'obsidian-glass-villa',
    description: 'An ultra-modern luxury glass and steel cantilevered residence situated over coastal cliffs.',
    fullContent: 'Designed for a private international client, the Obsidian Glass Villa represents the pinnacle of parametric architecture and climate-responsive engineering. Featuring seamless triple-glazed curtain walls, hidden solar roofs, and an integrated infinity pool jutting over natural stone terrain.',
    categoryId: 'cat-arch',
    categoryName: 'Architecture & Building',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80'
    ],
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-villa-surrounded-by-a-garden-42611-large.mp4',
    softwareUsed: ['Autodesk Revit', 'Rhino 3D', '3ds Max', 'V-Ray', 'Unreal Engine 5'],
    tags: ['Architecture', 'Luxury Villa', 'Modern Glass', 'Parametric', 'Ray Tracing'],
    projectDate: '2026-03-15',
    clientName: 'Aura Capital Group - Zurich',
    location: 'Zurich, Switzerland',
    downloads: [
      { label: 'Architectural Brochure PDF', url: '#', size: '14.2 MB' },
      { label: 'Sample CAD Elevation DWG', url: '#', size: '8.1 MB' }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80'
    ],
    beforeAfter: {
      before: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
      after: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      labelBefore: 'Raw Site & Wireframe Layout',
      labelAfter: 'Completed Glass Villa Render'
    },
    featured: true,
    views: 1420,
    likes: 389,
    createdAt: '2026-03-20T10:00:00Z'
  },
  {
    id: 'proj-2',
    title: 'Aura Minimal Penthouse Interior',
    slug: 'aura-minimal-penthouse',
    description: 'Monochromatic warm minimalist interior design with acoustic slatted timber and stone accents.',
    fullContent: 'This 4,500 sq.ft penthouse interior in Dubai Downtown blends natural travertine marble, brushed bronze fixtures, and intelligent ambient lighting controls. Every piece of furniture was custom modeled in 3D and synthesized before procurement.',
    categoryId: 'cat-interior',
    categoryName: 'Interior & Exterior',
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1600&q=80'
    ],
    coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
    softwareUsed: ['3ds Max', 'Corona Renderer', 'Photoshop', 'AutoCAD'],
    tags: ['Interior Design', 'Penthouse', 'Minimalism', '3D Rendering', 'Travertine'],
    projectDate: '2026-02-10',
    clientName: 'Al-Hashemi Private Office',
    location: 'Downtown Dubai, UAE',
    gallery: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80'
    ],
    beforeAfter: {
      before: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      after: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      labelBefore: 'Before (Bare Shell)',
      labelAfter: 'After (Minimal Luxury)'
    },
    featured: true,
    views: 980,
    likes: 245,
    createdAt: '2026-02-15T12:00:00Z'
  },
  {
    id: 'proj-3',
    title: 'Kore AI - Generative Brand Identity & Motion',
    slug: 'kore-ai-branding',
    description: 'Complete visual identity, 3D motion package, and UI design for a Next-Gen Robotics startup.',
    fullContent: 'Kore AI required a futuristic brand identity that communicates precision, speed, and intelligence. We created a dynamic liquid-metal visual language, parametric vector logo system, and responsive UI dashboard.',
    categoryId: 'cat-branding-motion',
    categoryName: 'Branding & Motion',
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1600&q=80'
    ],
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    softwareUsed: ['Figma', 'Adobe After Effects', 'Cinema 4D', 'Illustrator'],
    tags: ['Brand Identity', 'Motion Graphics', 'UI UX', 'AI Branding', '3D Motion'],
    projectDate: '2026-01-22',
    clientName: 'Kore Robotics Inc. - San Francisco',
    location: 'San Francisco, CA',
    featured: true,
    views: 2150,
    likes: 512,
    createdAt: '2026-01-25T08:00:00Z'
  },
  {
    id: 'proj-4',
    title: 'Neo-Tokyo Parametric Tower - Revit BIM & CAD',
    slug: 'neo-tokyo-parametric-tower',
    description: 'Comprehensive LOD 400 BIM model and structural CAD drawings for a 62-story mixed-use skyscraper.',
    fullContent: 'Developing structural CAD detailing and BIM coordination for high-density earthquake resistant towers. Included clash detection reports, steel joining blueprints, and MEP spatial routing.',
    categoryId: 'cat-3d-bim',
    categoryName: '3D Rendering & BIM',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1600&q=80'
    ],
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    softwareUsed: ['Autodesk Revit', 'AutoCAD', 'Navisworks', 'Tekla Structures'],
    tags: ['Revit BIM', 'AutoCAD', 'Skyscraper', 'Structural Engineering', 'Clash Detection'],
    projectDate: '2026-04-02',
    clientName: 'Mori Building Construction Corp',
    location: 'Tokyo, Japan',
    downloads: [
      { label: 'Sample Revit Structural BIM RVT', url: '#', size: '42.5 MB' },
      { label: 'AutoCAD Detail Sheet PDF', url: '#', size: '18.3 MB' }
    ],
    featured: false,
    views: 890,
    likes: 198,
    createdAt: '2026-04-05T09:00:00Z'
  },
  {
    id: 'proj-5',
    title: 'AI Neural Concept Synthesis - Cyberpunk Spatial Design',
    slug: 'ai-neural-concept-synthesis',
    description: 'Exploration of AI-driven prompt-to-3D volumetric spatial generation for commercial futuristic retail.',
    fullContent: 'Utilizing custom-trained generative diffusion models alongside 3D Gaussian Splatting to convert text prompts into real-time renderable interior retail spaces within minutes.',
    categoryId: 'cat-ai-creative',
    categoryName: 'AI & Generative Media',
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1600&q=80'
    ],
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=80',
    softwareUsed: ['Midjourney v6', 'Stable Diffusion XL', 'ComfyUI', 'Runway Gen-2', 'Blender'],
    tags: ['AI Art', 'Generative Architecture', 'AI Video', 'Prompt Engineering', 'Concept Art'],
    projectDate: '2026-04-20',
    clientName: 'Metaverse Creative Lab',
    location: 'London, UK',
    featured: true,
    views: 3100,
    likes: 742,
    createdAt: '2026-04-22T14:00:00Z'
  },
  {
    id: 'proj-6',
    title: 'Hyperion Luxury Digital Web Platform',
    slug: 'hyperion-luxury-digital-platform',
    description: 'An Apple-inspired high-performance digital web application for a global real estate investment group.',
    fullContent: 'Crafted with React, Tailwind CSS, and WebGL shader animations, Hyperion provides ultra-smooth 60fps property tours, live financial yield calculators, and client portfolio management.',
    categoryId: 'cat-web-ui',
    categoryName: 'Web & UI/UX Design',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80'
    ],
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
    softwareUsed: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Figma'],
    tags: ['Web Design', 'UI UX', 'React', 'Dark Theme', 'SaaS Platform'],
    projectDate: '2026-03-30',
    clientName: 'Hyperion Global Holdings',
    location: 'New York, NY',
    featured: true,
    views: 1850,
    likes: 420,
    createdAt: '2026-04-01T11:00:00Z'
  }
];

export const initialBlogs: BlogArticle[] = [
  {
    id: 'blog-1',
    title: 'How Generative AI is Transforming Architectural Rendering in 2026',
    slug: 'ai-transforming-architectural-rendering-2026',
    excerpt: 'Discover how neural diffusion models and AI prompt workflows are accelerating 3D architectural visualization cycles from weeks to hours.',
    content: `Architectural visualization has reached a pivotal tipping point. With the integration of custom-trained neural diffusion pipelines, studio artists and architects are now synthesizing initial lighting, materials, and spatial moods in real-time.

### The Shift from Manual Texturing to AI Synthesis
Traditionally, texturing a 50,000 sq.ft commercial space in 3ds Max or V-Ray required tedious material mapping, UV unwrapping, and hours of rendering calculations. Today, AI-guided depth maps allow architects to apply photorealistic textures dynamically onto basic 3D blockout geometry.

### Key Advantages for Global Clients
1. **Instant Concept Iteration**: Clients can explore 20 distinct aesthetic themes during live consultations.
2. **Reduced Pre-production Costs**: Early spatial feasibility is evaluated before heavy BIM modeling begins.
3. **Hyper-Realistic Material Prototyping**: Synthetic AI materials mimic rare stone grains and custom patinas with pinpoint accuracy.

At **Fiza Hayat**, we seamlessly combine traditional BIM precision with custom generative AI pipelines to deliver unprecedented visual speed and design quality for our international clients.`,
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    category: 'AI & Architecture',
    tags: ['AI Architecture', '3D Rendering', 'Design Tech', 'Generative AI'],
    author: 'Fiza Hayat Team',
    readTime: '4 min read',
    published: true,
    createdAt: '2026-03-12T09:00:00Z'
  },
  {
    id: 'blog-2',
    title: 'The Principles of Apple-Inspired Minimalism in Luxury Interior Design',
    slug: 'principles-apple-inspired-minimalism-interior-design',
    excerpt: 'Exploring the mathematical spatial harmony, flush architectural details, and hidden lighting systems of modern luxury homes.',
    content: `Minimalism in modern luxury interior architecture is not about empty space—it is about intentional precision. Every wall transition, flush baseboard, and concealed door frame requires exact millimeter tolerance.

### 1. Spatial Rhythm and Negative Space
Uncluttered floor plans allow key monolithic materials—such as honed travertine or black basalt—to act as focal points. Negative space gives the eye room to rest.

### 2. Concealed Engineering
The true mark of modern luxury is invisible technology. From frameless acoustic glass doors to ceiling slot diffusers that hide HVAC systems, seamless design is achieved through painstaking detail drafting.`,
    coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
    category: 'Interior Architecture',
    tags: ['Minimalism', 'Interior Design', 'Luxury Homes', 'Spatial Planning'],
    author: 'Fiza Hayat',
    readTime: '5 min read',
    published: true,
    createdAt: '2026-02-28T14:00:00Z'
  },
  {
    id: 'blog-3',
    title: 'Revit LOD 500 & BIM Coordination: Avoiding Costly On-Site Construction Errors',
    slug: 'revit-lod500-bim-coordination-on-site-construction',
    excerpt: 'How integrated Revit BIM modeling and clash detection save up to 25% on commercial construction site budgets.',
    content: `Clashes between structural steel beams and MEP ductwork on a construction site can cause project delays costing tens of thousands of dollars per day.

By leveraging Autodesk Revit at Level of Development (LOD) 400 and 500, Fiza Hayat generates unified digital twin models that resolve every spatial conflict long before ground breaking.`,
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    category: 'BIM & Engineering',
    tags: ['Revit BIM', 'AutoCAD', 'Construction', 'Clash Detection'],
    author: 'Engineering Division',
    readTime: '6 min read',
    published: true,
    createdAt: '2026-01-18T11:00:00Z'
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Marcus Vance',
    role: 'Managing Director',
    company: 'Vance International Property Group',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    content: 'Fiza Hayat delivered an extraordinary 3D walkthrough and architectural blueprint package for our luxury cliffside resort in Zurich. The level of detail and photorealism completely mesmerized our investment partners.',
    rating: 5,
    location: 'Zurich, Switzerland'
  },
  {
    id: 'test-2',
    name: 'Sarah Al-Maktoum',
    role: 'Lead Architect & Founder',
    company: 'Aura Studio Dubai',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    content: 'Working with Fiza Hayat on our Revit BIM modeling and AutoCAD drafting was seamless. Their team understands international building codes, precision tolerances, and elegant design language.',
    rating: 5,
    location: 'Dubai, UAE'
  },
  {
    id: 'test-3',
    name: 'David Chen',
    role: 'Chief Technology Officer',
    company: 'Kore Robotics',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    content: 'The branding identity, 3D motion graphics, and UI design created by Fiza Hayat set our robotics startup apart globally. True master craftsmanship from concept to deployment.',
    rating: 5,
    location: 'San Francisco, CA'
  }
];

export const initialGallery: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Glass Pavilion Sunset Lighting',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
    category: 'Architecture',
    createdAt: '2026-03-20'
  },
  {
    id: 'gal-2',
    title: 'Modern Minimal Living Space',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
    category: 'Interior',
    createdAt: '2026-02-15'
  },
  {
    id: 'gal-3',
    title: 'Skyscraper Structural Wireframe 3D',
    type: '3d',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    category: 'BIM & CAD',
    createdAt: '2026-04-05'
  },
  {
    id: 'gal-4',
    title: 'AI Cyberpunk Architecture Reel',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-modern-villa-surrounded-by-a-garden-42611-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
    category: 'AI Media',
    createdAt: '2026-04-22'
  }
];

export const initialTeamMembers: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Fiza Hayat',
    role: 'Principal Architect & Creative Director',
    bio: 'Lead architect with over 10 years of experience in luxury parametric residential design, urban master planning, and AI creative workflows.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    email: 'fiza@fizahayat.com',
    specialization: 'Parametric Architecture & Luxury Estates',
    experienceYears: 10,
    order: 1
  },
  {
    id: 'team-2',
    name: 'Tariq Al-Mansoor',
    role: 'Chief Structural Engineer & BIM Lead',
    bio: 'Specialist in high-rise earthquake resistance, LOD 500 Revit BIM coordination, and steel facade engineering.',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    email: 'tariq@fizahayat.com',
    specialization: 'Revit BIM LOD 500 & Structural Steel',
    experienceYears: 12,
    order: 2
  },
  {
    id: 'team-3',
    name: 'Elena Rostova',
    role: 'Senior 3D Visualizer & AI Media Director',
    bio: 'Unreal Engine 5 specialist crafting 8K ray-traced walkthroughs and generative AI concept synthesis pipelines.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    email: 'elena@fizahayat.com',
    specialization: '3D CGI Rendering & Generative AI',
    experienceYears: 8,
    order: 3
  }
];

export const initialMediaAssets: MediaAsset[] = [
  {
    id: 'media-1',
    title: 'Obsidian Villa Blueprint - Full Structural PDF',
    type: 'pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '14.2 MB',
    category: 'Blueprints & Drawings',
    description: 'Complete architectural floor plans, elevation sheets, and structural foundation specifications.',
    createdAt: '2026-03-20'
  },
  {
    id: 'media-2',
    title: 'Glass Pavilion Sunset Lighting 8K Render',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
    fileSize: '8.4 MB',
    category: 'Architecture Renders',
    description: 'High-resolution exterior render showcasing twilight lighting and glass reflection.',
    createdAt: '2026-03-20'
  },
  {
    id: 'media-3',
    title: 'Modern Villa Walkthrough Flyover Video',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-modern-villa-surrounded-by-a-garden-42611-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    fileSize: '32.1 MB',
    category: 'Video Walkthroughs',
    description: '4K cinematic drone walkthrough video of estate property.',
    createdAt: '2026-03-22'
  }
];

export const initialSettings: WebsiteSettings = {
  heroTitle: 'Building the Future with Design, Creativity & AI',
  heroSubtitle: 'World-Class Digital Business Hub showcasing architectural engineering, luxury interiors, 3D BIM rendering, AI generative media, motion branding, and bespoke web platforms.',
  heroTypingTexts: [
    'Architectural Design & Planning',
    '3D Rendering & Virtual Walkthroughs',
    'AutoCAD & Revit BIM Engineering',
    'AI Generative Concept Production',
    'Brand Identity & Motion Graphics',
    'Luxury Web & UI/UX Platforms'
  ],
  companyStory: 'Fiza Hayat was founded with a singular visionary goal: to bridge the boundaries of physical architectural craftsmanship, advanced BIM engineering, and cutting-edge generative AI technology. Operating as an international digital business hub, we partner with clients across Europe, the Middle East, North America, and Asia.',
  mission: 'To deliver flawless, end-to-end design, engineering, and digital solutions that empower visionary builders, architects, and brands to shape the future.',
  vision: 'To pioneer the next era of architectural intelligence, setting global benchmarks in photorealistic 3D visualization, BIM automation, and AI-driven creative design.',
  companyEmail: 'contact@fizahayat.com',
  companyPhone: '',
  whatsappNumber: '',
  whatsappGroupLink: 'https://chat.whatsapp.com/GsNwCBMQP5zJWbvocLdWg2',
  address: 'Executive Tower 4, Downtown Business Bay, Dubai / Geneva, Switzerland',
  googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.17851002432!2d55.2721877!3d25.1868882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f682def22a275%3A0x6b772b1684c3e395!2sBusiness%20Bay%20Dubai!5e0!3m2!1sen!2sae!4v1700000000000',
  statsProjects: 145,
  statsClients: 82,
  statsCountries: 24,
  statsYears: 10,
  socialLinks: {
    instagram: 'https://instagram.com/fizahayat',
    linkedin: 'https://linkedin.com/company/fizahayat',
    youtube: 'https://youtube.com/fizahayat',
    behance: 'https://behance.net/fizahayat',
    github: 'https://github.com/fizahayat'
  }
};
