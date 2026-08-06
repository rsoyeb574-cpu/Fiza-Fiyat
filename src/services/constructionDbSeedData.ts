import { 
  LocationCity,
  LocationState,
  LocationCountry,
  MaterialItem,
  MaterialCategory,
  LaborRateItem,
  FoundationType,
  ColumnType,
  BeamType,
  RoofType,
  SlabType,
  WallType,
  BrickType,
  BlockType,
  DoorType,
  WindowType,
  FinishCategoryItem,
  HousePlanItem,
  Model3DItem,
  ConstructionTipItem,
  ConstructionVideoItem,
  ProjectGalleryItem,
  CustomerReviewItem,
  FAQItem,
  SliderItem,
  UserAccount,
  SEOSetting
} from '../types/constructionDatabase';

export const initialCities: LocationCity[] = [
  { id: 'city-kolkata', name: 'Kolkata', state: 'West Bengal', country: 'India', costMultiplier: 1.0, laborRateMultiplier: 1.0, popular: true },
  { id: 'city-mumbai', name: 'Mumbai', state: 'Maharashtra', country: 'India', costMultiplier: 1.32, laborRateMultiplier: 1.4, popular: true },
  { id: 'city-delhi', name: 'Delhi NCR', state: 'Delhi', country: 'India', costMultiplier: 1.16, laborRateMultiplier: 1.18, popular: true },
  { id: 'city-bangalore', name: 'Bangalore', state: 'Karnataka', country: 'India', costMultiplier: 1.11, laborRateMultiplier: 1.12, popular: true },
  { id: 'city-hyderabad', name: 'Hyderabad', state: 'Telangana', country: 'India', costMultiplier: 1.08, laborRateMultiplier: 1.05, popular: true },
  { id: 'city-chennai', name: 'Chennai', state: 'Tamil Nadu', country: 'India', costMultiplier: 1.12, laborRateMultiplier: 1.10, popular: true },
  { id: 'city-pune', name: 'Pune', state: 'Maharashtra', country: 'India', costMultiplier: 1.20, laborRateMultiplier: 1.22, popular: true }
];

export const initialStates: LocationState[] = [
  { id: 'st-wb', name: 'West Bengal', code: 'WB', country: 'India' },
  { id: 'st-mh', name: 'Maharashtra', code: 'MH', country: 'India' },
  { id: 'st-dl', name: 'Delhi', code: 'DL', country: 'India' },
  { id: 'st-ka', name: 'Karnataka', code: 'KA', country: 'India' },
  { id: 'st-ts', name: 'Telangana', code: 'TS', country: 'India' }
];

export const initialCountries: LocationCountry[] = [
  { id: 'ctry-in', name: 'India', code: 'IN', currencySymbol: '₹', currencyCode: 'INR' },
  { id: 'ctry-ae', name: 'United Arab Emirates', code: 'AE', currencySymbol: 'AED', currencyCode: 'AED' },
  { id: 'ctry-us', name: 'United States', code: 'US', currencySymbol: '$', currencyCode: 'USD' }
];

export const initialMaterialCategories: MaterialCategory[] = [
  { id: 'mcat-structural', name: 'Structural & Masonry', slug: 'structural-masonry', description: 'Cement, steel rebar, aggregates, bricks, blocks, sand', icon: 'Building' },
  { id: 'mcat-finishes', name: 'Tiles, Stone & Finishes', slug: 'tiles-finishes', description: 'Vitrified tiles, marble, granites, wall paneling', icon: 'Grid' },
  { id: 'mcat-paints', name: 'Paints & Wall Coatings', slug: 'paints-coatings', description: 'Emulsion paints, primers, wall putty, weather proofing', icon: 'Palette' },
  { id: 'mcat-electrical', name: 'Electrical & Automation', slug: 'electrical-automation', description: 'FRLSH copper wires, conduits, MCBs, modular switches', icon: 'Zap' },
  { id: 'mcat-plumbing', name: 'Plumbing & Drainage', slug: 'plumbing-drainage', description: 'CPVC water supply pipes, SWR drainage fittings, pumps', icon: 'Droplet' },
  { id: 'mcat-doors', name: 'Doors, Windows & Glass', slug: 'doors-windows', description: 'uPVC profiles, teak wood, flush doors, toughened glass', icon: 'Compass' }
];

export const initialMaterials: MaterialItem[] = [
  {
    id: 'mat-cement-ppc',
    name: 'Portland Pozzolana Cement (PPC)',
    categoryId: 'mcat-structural',
    categoryName: 'Structural & Masonry',
    brand: 'UltraTech Cement',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    description: 'Fly ash blended premium pozzolana cement offering high durability, low hydration heat, and resistance to chemical attacks.',
    purpose: 'Ideal for RCC foundations, column/beam casting, masonry brickwork mortar, and exterior plastering.',
    advantages: ['Reduces thermal micro-cracking', 'Superior resistance to sulfate and chloride attacks', 'Smooth plastic finish for plaster'],
    disadvantages: ['Initial setting time is slightly slower than OPC 53 grade'],
    lifeExpectancy: '80 - 100 Years',
    maintenance: 'Store off ground on plastic elevated pallets in dry weatherproof shed.',
    price: 375,
    priceUnit: 'Bag (50kg)',
    availableSizes: ['50 kg HDPE Bag'],
    strength: 'PPC Equivalent to 43/53 Grade',
    qualityGrade: 'Standard',
    recommendedUsage: 'Residential RCC columns, beams, slabs, brickwork, plastering',
    supplier: 'UltraTech Authorized Building Materials Dealer',
    country: 'India',
    warranty: 'IS 1489 Part 1 Certified Guarantee',
    alternativeMaterials: ['Ambuja PPC', 'Lafarge Concreto', 'ACC Gold'],
    relatedMaterials: ['Washed River Sand', '12mm-20mm Granite Stone Chips'],
    installationMethod: 'Mix with clean potable water (water-cement ratio 0.45-0.50). Water cure continuously for 14 days.',
    videoGuide: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    pdfGuide: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    id: 'mat-steel-rebar',
    name: 'Fe500D TMT Steel Rebar',
    categoryId: 'mcat-structural',
    categoryName: 'Structural & Masonry',
    brand: 'Tata Tiscon',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    description: 'High-ductility Thermo-Mechanically Treated (TMT) steel rebars with superior earthquake shock absorption.',
    purpose: 'Provides tensile and flexural bending strength in foundation footings, columns, beams, and roof slabs.',
    advantages: ['High elongation capacity (>16%) preventing brittle failure', 'Corrosion-resistant micro-structure', 'Ribbed surface provides strong bond with concrete'],
    disadvantages: ['Vulnerable to rust if clear cover is less than 40mm'],
    lifeExpectancy: '80+ Years',
    maintenance: 'Protect from direct rainwater exposure prior to binding.',
    price: 64,
    priceUnit: 'Kg',
    availableSizes: ['8mm', '10mm', '12mm', '16mm', '20mm', '25mm'],
    strength: 'Fe500D Grade (Yield Strength > 500 N/mm²)',
    qualityGrade: 'Premium',
    recommendedUsage: 'Primary structural framing for seismic Zone III, IV, and V',
    supplier: 'Tata Tiscon Direct Distributor',
    country: 'India',
    warranty: 'Bureau of Indian Standards IS 1786 Guarantee',
    alternativeMaterials: ['JSW Neosteel Fe500D', 'Jindal Panther Fe550D', 'SRMB 500+'],
    relatedMaterials: ['Binding Wire (18 Gauge)', 'Plastic Cover Blocks (25mm/40mm)'],
    installationMethod: 'Cut and bend as per structural bar bending schedule. Bind tight with double annealed binding wire.',
    videoGuide: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    pdfGuide: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    id: 'mat-aac-blocks',
    name: 'Autoclaved Aerated Concrete (AAC) Light Blocks',
    categoryId: 'mcat-structural',
    categoryName: 'Structural & Masonry',
    brand: 'Magicrete AAC',
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-lightweight eco-friendly masonry blocks manufactured from fly ash, lime, and aluminum powder expansion agent.',
    purpose: 'Exterior and interior partition walls reducing dead load by up to 20%.',
    advantages: ['3x lighter than clay bricks', 'High R-value thermal insulation cutting AC power consumption', 'Requires 50% less mortar plaster'],
    disadvantages: ['Requires specialized thin-bed polymer adhesive instead of thick cement-sand mortar'],
    lifeExpectancy: '100+ Years',
    maintenance: 'Keep outer plaster sealed with water repellent paint coat.',
    price: 65,
    priceUnit: 'Piece',
    availableSizes: ['600x200x100mm (4")', '600x200x150mm (6")', '600x200x200mm (8")'],
    strength: 'Compressive Strength >= 4 N/mm²',
    qualityGrade: 'Premium',
    recommendedUsage: 'High-rise & multi-story residential building partition walls',
    supplier: 'Magicrete Building Solutions',
    country: 'India',
    warranty: 'Green Building Certified Material Guarantee',
    alternativeMaterials: ['Red Clay Bricks', 'Fly Ash Solid Bricks'],
    relatedMaterials: ['Polymer Block Jointing Adhesive', 'Fiberglass Crack Mesh'],
    installationMethod: 'Apply 3mm polymer mortar adhesive layer. Lay blocks in staggered bond.',
    videoGuide: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: 'mat-vitrified-tiles',
    name: 'Glazed Vitrified Floor Tiles (800x800mm)',
    categoryId: 'mcat-finishes',
    categoryName: 'Tiles, Stone & Finishes',
    brand: 'Kajaria Ceramics',
    image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-durable, non-porous vitrified floor tiles with high abrasion resistance and digital marble vein prints.',
    purpose: 'Flooring across living rooms, master bedrooms, dining spaces, and corridors.',
    advantages: ['Water absorption < 0.05%', 'Scratch, stain, and acid resistant', 'Large format creates spacious seamless ambiance'],
    disadvantages: ['Requires smooth level screed and skilled tile laying labor'],
    lifeExpectancy: '30 Years',
    maintenance: 'Clean with neutral liquid floor wash. Re-grout expansion joints if needed.',
    price: 65,
    priceUnit: 'Sq.Ft',
    availableSizes: ['600x600mm', '800x800mm', '1200x600mm', '1200x1800mm'],
    strength: 'PEI Abrasion Rating 4 / Mohs Hardness 6',
    qualityGrade: 'Luxury',
    recommendedUsage: 'Indoor living and bedroom flooring',
    supplier: 'Kajaria World Showroom',
    country: 'India',
    warranty: '10 Year Structural Surface Guarantee',
    alternativeMaterials: ['Somany Double Charged Vitrified Tiles', 'Italian Marble Slabs'],
    relatedMaterials: ['Polymer Tile Adhesive (Type 2)', 'Epoxy Tile Grout'],
    installationMethod: 'Use 2mm plastic tile spacers. Apply polymer tile adhesive using notched trowel.'
  },
  {
    id: 'mat-royal-emulsion',
    name: 'Royale Luxury Acrylic Interior Emulsion Paint',
    categoryId: 'mcat-paints',
    categoryName: 'Paints & Wall Coatings',
    brand: 'Asian Paints',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
    description: 'Teflon surface protected low-VOC luxury interior washable acrylic paint providing rich sheen finish.',
    purpose: 'Decorative interior wall and ceiling finishing.',
    advantages: ['100% washable finish allowing stain cleaning', 'Anti-bacterial & anti-fungal formula', 'Zero toxic odor'],
    disadvantages: ['Requires complete surface sanding and 2 coats acrylic wall putty base'],
    lifeExpectancy: '8 - 10 Years',
    maintenance: 'Wipe off stains using soft damp sponge and mild detergent.',
    price: 280,
    priceUnit: 'Liter',
    availableSizes: ['1 L', '4 L', '10 L', '20 L Bucket'],
    strength: 'Teflon Surface Protection Shield',
    qualityGrade: 'Luxury',
    recommendedUsage: 'Luxury living rooms, bedrooms, and dining halls',
    supplier: 'Asian Paints Authorized Color Dealer',
    country: 'India',
    warranty: '7 Year Sheen Guarantee',
    alternativeMaterials: ['Berger Silk Glamor', 'Nerolac Impression Ultra'],
    relatedMaterials: ['Acrylic Wall Putty', 'Decoprime Interior Wall Primer'],
    installationMethod: 'Apply 2 coats putty, 1 coat primer, and 2 coats Royale Emulsion diluted 40% with water.'
  }
];

export const initialLaborRates: LaborRateItem[] = [
  { id: 'lab-mason', role: 'Mason', dailyRate: 850, experienceYears: 8, availability: 'Immediate', city: 'Kolkata', contactInfo: '+91 98300 12345', skills: ['Brickwork', 'Concrete Casting', 'Wall Plastering'], rating: 4.8 },
  { id: 'lab-carpenter', role: 'Carpenter', dailyRate: 900, experienceYears: 10, availability: 'Immediate', city: 'Kolkata', contactInfo: '+91 98300 23456', skills: ['Shuttering Formwork', 'Doors & Windows', 'Modular Cabinets'], rating: 4.9 },
  { id: 'lab-electrician', role: 'Electrician', dailyRate: 800, experienceYears: 6, availability: 'Within 3 Days', city: 'Kolkata', contactInfo: '+91 98300 34567', skills: ['Concealed Piping', 'DB Wiring', 'Smart Automation'], rating: 4.7 },
  { id: 'lab-painter', role: 'Painter', dailyRate: 700, experienceYears: 7, availability: 'Immediate', city: 'Kolkata', contactInfo: '+91 98300 45678', skills: ['Wall Putty', 'Spray Paint', 'Texture Finish'], rating: 4.8 },
  { id: 'lab-plumber', role: 'Plumber', dailyRate: 800, experienceYears: 9, availability: 'Immediate', city: 'Kolkata', contactInfo: '+91 98300 56789', skills: ['CPVC Lines', 'SWR Drainage', 'Concealed Diverters'], rating: 4.9 },
  { id: 'lab-welder', role: 'Welder', dailyRate: 850, experienceYears: 5, availability: 'Within 3 Days', city: 'Kolkata', contactInfo: '+91 98300 67890', skills: ['MS Grill Welding', 'Structural Steel Fabrication'], rating: 4.6 },
  { id: 'lab-pop', role: 'POP Worker', dailyRate: 750, experienceYears: 6, availability: 'Immediate', city: 'Kolkata', contactInfo: '+91 98300 78901', skills: ['False Ceiling Gypsum', 'Molding Design'], rating: 4.7 },
  { id: 'lab-tile', role: 'Tile Installer', dailyRate: 900, experienceYears: 8, availability: 'Immediate', city: 'Kolkata', contactInfo: '+91 98300 89012', skills: ['Vitrified Tile Laying', 'Epoxy Grouting', 'Marble Polishing'], rating: 4.9 },
  { id: 'lab-steelfixer', role: 'Steel Fixer', dailyRate: 800, experienceYears: 7, availability: 'Immediate', city: 'Kolkata', contactInfo: '+91 98300 90123', skills: ['Rebar Binding', 'Column Cages', 'Slab Rebar Mesh'], rating: 4.8 }
];

export const initialFoundationTypes: FoundationType[] = [
  { id: 'fnd-isolated', name: 'Isolated Trapezoidal Footing', description: 'Individual RCC footings under each column with plinth tie beams.', costUnit: 'Sq.Ft', baseRateINR: 210, bearingCapacityReq: '> 150 kN/m²', depthFt: 5, advantages: ['Cost-effective for single to G+2 structures', 'Easy excavation and rebar binding'], disadvantages: ['Not suitable for soft waterlogged clay soil'], recommendedFor: 'Standard residential plots on firm soil' },
  { id: 'fnd-raft', name: 'Raft / Mat Foundation', description: 'Continuous reinforced concrete slab covering the entire building footprint.', costUnit: 'Sq.Ft', baseRateINR: 380, bearingCapacityReq: '< 100 kN/m²', depthFt: 4, advantages: ['Prevents differential settlement in soft soils', 'Waterproof monolithic barrier'], disadvantages: ['High steel and concrete consumption'], recommendedFor: 'Soft soil or high groundwater table sites' }
];

export const initialColumnTypes: ColumnType[] = [
  { id: 'col-9x12', name: 'Standard 9" × 12" Column', description: '6 longitudinal 16mm Fe500D steel rebars with 8mm stirrups at 150mm spacing.', costUnit: 'Rft', baseRateINR: 360, rebarSpec: '6 Nos 16mm TMT', concreteGrade: 'M20 / M25', advantages: ['Optimum footprint for residential homes', 'High load capacity for up to G+2'], disadvantages: ['Requires careful vibration during casting'], recommendedFor: 'Ground floor to G+2 residential villas' },
  { id: 'col-9x15', name: 'Heavy 9" × 15" Column', description: '8 longitudinal 16mm/20mm steel rebars for multi-story load transfer.', costUnit: 'Rft', baseRateINR: 480, rebarSpec: '8 Nos 16mm/20mm TMT', concreteGrade: 'M25 / M30', advantages: ['Supports higher vertical loads for G+3 and above', 'High seismic shear resistance'], disadvantages: ['Larger structural protrusion in rooms'], recommendedFor: 'G+3 multi-story apartment structures' }
];

export const initialBeamTypes: BeamType[] = [
  { id: 'bm-plinth-9x12', name: 'Plinth Tie Beam (9" × 12")', description: 'Ground level ring beam locking footing columns together and supporting ground brick walls.', costUnit: 'Rft', baseRateINR: 320, plinthOrRoof: 'Plinth Beam', rebarSpec: '4 Nos 12mm + 2 Nos 10mm TMT', advantages: ['Prevents differential settlement cracks', 'Damp proof barrier base'], disadvantages: ['Requires earth backfilling before casting'], recommendedFor: 'All residential ground floors' },
  { id: 'bm-roof-9x12', name: 'Roof Downstand Beam (9" × 12")', description: 'Horizontal RCC beam integrated into roof slab to carry span bending moments.', costUnit: 'Rft', baseRateINR: 340, plinthOrRoof: 'Roof Beam', rebarSpec: '4 Nos 16mm + 2 Nos 12mm TMT', advantages: ['High bending strength', 'Monolithic roof tie'], disadvantages: ['Visible ceiling projection unless concealed by false ceiling'], recommendedFor: 'Roof spans above 12 feet' }
];

export const initialRoofTypes: RoofType[] = [
  { id: 'rf-rcc-5in', name: '5-Inch RCC Slab with Elastomeric Membrane', description: 'Monolithic M20 concrete slab cast with two-way steel rebar mesh and waterproof liquid coating.', costUnit: 'Sq.Ft', baseRateINR: 160, thermalRating: 'R-3.5', waterproofMethod: '2-Coat PU Polymer Slurry + Brickbat Coba', advantages: ['Cyclone and fire resistant', 'Allows vertical expansion for future floors'], disadvantages: ['Requires 14-day water curing'], recommendedFor: 'All permanent residential buildings' }
];

export const initialSlabTypes: SlabType[] = [
  { id: 'slb-twoway-5in', name: 'Two-Way RCC Slab (5 Inches)', description: 'Reinforced slab spanning in both directions supported by 4 perimeter beams.', costUnit: 'Sq.Ft', baseRateINR: 150, thicknessInches: 5, spanLimitFt: 18, advantages: ['Thin profile with minimal deflection', 'Uniform load distribution'], disadvantages: ['Requires two-way bottom and top rebar cranking'], recommendedFor: 'Square and rectangular room spans' }
];

export const initialWallTypes: WallType[] = [
  { id: 'wal-brick-9in', name: '9-Inch External Red Brick Wall', description: 'Double brick wall laid in 1:4 cement sand mortar for exterior weather enclosure.', costUnit: 'Sq.Ft', baseRateINR: 65, thicknessInches: 9, thermalRValue: 'R-2.2', advantages: ['High thermal mass', 'Excellent weather protection'], disadvantages: ['Heavy dead load'], recommendedFor: 'Building perimeter exterior walls' },
  { id: 'wal-aac-6in', name: '6-Inch AAC Block Partition Wall', description: 'Autoclaved aerated concrete block wall bonded with polymer thin-bed adhesive.', costUnit: 'Sq.Ft', baseRateINR: 75, thicknessInches: 6, thermalRValue: 'R-4.1', advantages: ['3x lighter than clay bricks', 'Superior thermal insulation'], disadvantages: ['Requires specialized jointing adhesive'], recommendedFor: 'Interior partition walls and high-rise structures' }
];

export const initialHousePlans: HousePlanItem[] = [
  {
    id: 'hplan-20x20',
    title: 'Compact Luxury Villa Plan (20 ft × 20 ft)',
    plotWidthFt: 20,
    plotLengthFt: 20,
    totalAreaSqFt: 400,
    builtUpAreaSqFt: 360,
    floors: 'Ground Floor',
    bedrooms: 1,
    bathrooms: 1,
    style: 'Modern',
    estimatedCostINR: 1000000,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    features: ['Ergonomic 1BHK Layout', 'Vastu Compliant North-East Entry', 'L-Shaped Modular Kitchen', 'Spacious Living Room with Natural Ventilation']
  },
  {
    id: 'hplan-30x40',
    title: 'Contemporary Duplex Residence (30 ft × 40 ft)',
    plotWidthFt: 30,
    plotLengthFt: 40,
    totalAreaSqFt: 1200,
    builtUpAreaSqFt: 2100,
    floors: 'G+1',
    bedrooms: 3,
    bathrooms: 3,
    style: 'Contemporary',
    estimatedCostINR: 4200000,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    features: ['3 BHK Duplex Layout', 'Double Height Living Room', 'Private Balcony Terrace', 'Car Parking Garage']
  }
];

export const initial3DModels: Model3DItem[] = [
  { id: 'mod3d-villa-1', title: '3D Photorealistic Villa Render', category: 'Exterior Design', thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', description: 'Interactive 3D BIM architectural render with realistic lighting and texture mapping.', viewCount: 1420 },
  { id: 'mod3d-interior-1', title: '3D Luxury Living Room Concept', category: 'Interior Design', thumbnailUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80', description: 'Photorealistic 8K interior render detailing lighting temperature and furniture arrangement.', viewCount: 980 }
];

export const initialCustomerReviews: CustomerReviewItem[] = [
  { id: 'rev-1', name: 'Debashis Mukherjee', city: 'Kolkata', rating: 5, comment: 'The Construction Cost Engine gave us an accurate itemized breakdown down to cement bags and rebar weight. Saved us over ₹1.5 Lakhs during procurement!', projectType: '20x20 Villa Construction', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', createdAt: '2026-07-15' },
  { id: 'rev-2', name: 'Priya Sharma', city: 'Delhi NCR', rating: 5, comment: 'Incredible database platform. The structural guidelines and labor rate directory helped us hire verified plumbers and carpenters effortlessly.', projectType: 'Duplex Home Interior', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', createdAt: '2026-07-28' }
];

export const initialFAQs: FAQItem[] = [
  { id: 'faq-1', question: 'How is the Smart Construction Cost Engine calculated?', answer: 'The engine dynamically pulls real-time material unit prices and local daily labor rates from our verified Firebase Firestore collections based on your plot dimensions, city location, floor count, and quality level.', category: 'Cost Engine', order: 1 },
  { id: 'faq-2', question: 'Can I edit prices and labor rates from the Firebase Admin Panel?', answer: 'Yes! Authorized administrators can instantly manage, update, add, or delete materials, prices, labor rates, house plans, and categories in real-time from the Firebase Admin Dashboard.', category: 'Admin & Database', order: 2 },
  { id: 'faq-3', question: 'What is the recommended ratio for RCC concrete casting?', answer: 'For standard residential columns, beams, and roof slabs, M20 grade concrete (1 part cement : 1.5 parts coarse sand : 3 parts 20mm aggregate) with a water-cement ratio of 0.45 is recommended as per IS 456:2000.', category: 'Structural Engineering', order: 3 }
];

export const initialSliders: SliderItem[] = [
  { id: 'slide-1', title: 'Next-Gen Construction Intelligence Platform', subtitle: 'Real-Time Material Rates, Labor Directory, Smart Cost Estimation & AI Architectural Advice', imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80', ctaText: 'Explore Construction Engine', ctaLink: '#smart-cost-engine', order: 1, active: true }
];

export const initialSEOSettings: SEOSetting[] = [
  { id: 'seo-home', page: 'home', metaTitle: 'Fiza Hayat | Construction Intelligence & Architecture Platform', metaDescription: 'World-Class Construction Intelligence Platform with dynamic Firestore material database, labor rates, smart cost engine, and BIM rendering.', keywords: 'construction database, material rates, labor rates, cost calculator, architecture design' }
];
