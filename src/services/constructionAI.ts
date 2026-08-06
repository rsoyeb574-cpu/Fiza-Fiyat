// Construction Intelligence AI Features Service

export interface AISuggestionRequest {
  type: 
    | 'materials'
    | 'budget_options'
    | 'premium_options'
    | 'economy_options'
    | 'interior_theme'
    | 'exterior_theme'
    | 'color_combination'
    | 'tile_combination'
    | 'paint_combination'
    | 'furniture_layout';
  plotSize?: string;
  location?: string;
  budgetINR?: number;
  qualityLevel?: string;
  promptExtra?: string;
}

export interface AISuggestionResponse {
  title: string;
  summary: string;
  recommendations: string[];
  suggestedMaterials?: string[];
  colorPalette?: { name: string; hex: string; usage: string }[];
  layoutAdvice?: string[];
  estimatedCostImpact?: string;
}

export async function generateConstructionAISuggestion(
  req: AISuggestionRequest
): Promise<AISuggestionResponse> {
  try {
    const res = await fetch('/api/construction-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.title) return data;
    }
  } catch (err) {
    console.warn('Backend AI API endpoint notice, returning rule-based AI recommendation:', err);
  }

  // Smart Rule-Based Fallback Engine
  return generateRuleBasedAISuggestion(req);
}

function generateRuleBasedAISuggestion(req: AISuggestionRequest): AISuggestionResponse {
  const loc = req.location || 'Kolkata / Regional India';
  const qual = req.qualityLevel || 'Standard';

  switch (req.type) {
    case 'materials':
      return {
        title: `AI Material Optimization Guide for ${loc} (${qual} Grade)`,
        summary: `Based on climatic humidity, soil bearing capacity, and thermal exposure in ${loc}, our AI recommends selecting fly ash blended PPC cement and Fe500D rebar for primary structural longevity.`,
        recommendations: [
          'Use UltraTech or Lafarge PPC Cement for 15% reduction in micro-cracks during curing.',
          'Specify Fe500D TMT rebar with high elongation (>16%) for superior seismic shock absorption.',
          'Replace heavy red clay bricks with 6-inch AAC blocks for interior partitions to lower building dead load by 20%.',
          'Opt for GVT (Glazed Vitrified) 800x800mm tiles with polymer tile adhesive for stain-proof living room floors.'
        ],
        suggestedMaterials: [
          'UltraTech PPC Cement',
          'Tata Tiscon Fe500D TMT Rebar',
          'Magicrete 6" AAC Blocks',
          'Kajaria 800x800mm Glazed Vitrified Tiles',
          'Asian Paints Royale Luxury Emulsion'
        ],
        estimatedCostImpact: 'Saves 12% on raw material wastage and structural steel weight.'
      };

    case 'budget_options':
    case 'economy_options':
      return {
        title: `AI Value Engineering & Economy Options for ${loc}`,
        summary: 'Smart cost reduction strategies designed to decrease upfront civil investment without compromising structural safety or code compliance.',
        recommendations: [
          'Use Isolated Stepped Footings with Plinth Tie Beams rather than full Raft foundation on firm soils.',
          'Use Manufactured Sand (M-Sand) instead of River Sand to save up to 25% fine aggregate cost.',
          'Standardize bedroom door and window frame sizes (4ft × 4ft) to order factory mass-produced uPVC profiles.',
          'Apply 2 coats of acrylic wall putty + 1 coat primer before painting to double paint coverage yield per liter.'
        ],
        suggestedMaterials: ['PPC Grade Cement', 'M-Sand Aggregate', 'Standard 800x800mm Double Charged Vitrified Tiles', 'Tractor Emulsion Paint'],
        estimatedCostImpact: 'Reduces overall construction budget by 18% - 22%.'
      };

    case 'premium_options':
      return {
        title: `AI Luxury & High-Performance Specification Guide`,
        summary: 'Top-tier architectural specifications engineered for maximum thermal comfort, acoustic dampening, and long-term durability.',
        recommendations: [
          'Construct Raft Foundation with APP Modified Elastomeric Waterproof Membrane Tanking.',
          'Install System Slimline uPVC Windows with 6mm Toughened Double Glazed Glass (DGU) for 35dB noise reduction.',
          'Incorporate Post-Tensioned Flat Slab ceilings for long, column-free interior spans.',
          'Lay Italian Marble or 1200x2400mm GVT Slab Tiles with Epoxy Tile Grouting.'
        ],
        suggestedMaterials: ['Post-Tensioned Slab', 'Italian Marble Slabs', 'Thermal-Break Slimline Windows', 'PU Roof Waterproofing Membrane'],
        estimatedCostImpact: 'Adds 30% - 40% initial asset value and delivers 50+ year maintenance-free lifespan.'
      };

    case 'interior_theme':
      return {
        title: `AI Minimalist Warm Luxury Interior Concept`,
        summary: 'A balanced interior spatial theme pairing neutral off-white walls, warm oak wood veneer accents, and ambient 3000K recessed LED lighting.',
        recommendations: [
          'Keep living room layout open-concept with a low-profile sectional sofa and floating media wall.',
          'Use 800x800mm beige marble-veined vitrified tiles with matched epoxy grout for invisible tile joints.',
          'Integrate indirect gypsum cove lighting in false ceiling to eliminate harsh ceiling glare.'
        ],
        colorPalette: [
          { name: 'Warm Cream', hex: '#FDFBF7', usage: 'Primary Wall Paint Base' },
          { name: 'Soft Charcoal', hex: '#262626', usage: 'Accent Window Frames & Furniture Metalwork' },
          { name: 'Muted Oak', hex: '#D4A373', usage: 'Wall Paneling & Wood Veneer' },
          { name: 'Champagne Brass', hex: '#C5A880', usage: 'Hardware Fittings & Light Fixtures' }
        ],
        layoutAdvice: [
          'Maintain clear 3.5 ft walkway clearance between sofa and dining table.',
          'Position TV unit opposite window to prevent afternoon glare reflections.'
        ]
      };

    case 'exterior_theme':
      return {
        title: `AI Modern Tropical Villa Facade Concept`,
        summary: 'A striking contemporary exterior elevation blending crisp white cantilevered slabs, dark slate gray accent grooves, and warm louvers.',
        recommendations: [
          'Use 2-coat silicone-modified anti-dirt exterior emulsion for self-cleaning rain protection.',
          'Incorporate vertical aluminum composite wood-finish louvers over upper windows for solar shading.',
          'Highlight building entry facade with warm 3000K up-down architectural wall sconces.'
        ],
        colorPalette: [
          { name: 'Arctic White', hex: '#F8FAFC', usage: 'Main Elevation Cantilever Slabs' },
          { name: 'Slate Gray', hex: '#334155', usage: 'Recessed Accent Grooves & Column Frames' },
          { name: 'Teak Wood', hex: '#8C5221', usage: 'Exterior Wall Louvers' }
        ]
      };

    case 'color_combination':
    case 'paint_combination':
      return {
        title: `AI Harmonious Architectural Paint Palette`,
        summary: 'Professionally curated paint combination pairing high-sheen interior washable emulsion with durable exterior weather coatings.',
        recommendations: [
          'Living Room: Soft Warm Cream for 3 main walls with 1 Muted Sage Green focal accent wall.',
          'Master Bedroom: Calm Morning Mist Blue for relaxed circadian sleep rhythm.',
          'Exterior Wall: Weather-shield Silicone White with Charcoal Gray parapet trim.'
        ],
        colorPalette: [
          { name: 'Soft Warm Cream', hex: '#F7F4EF', usage: 'Living Room Primary' },
          { name: 'Muted Sage Green', hex: '#8A9A86', usage: 'Living Room Feature Accent' },
          { name: 'Morning Mist Blue', hex: '#D0E1D4', usage: 'Master Bedroom' },
          { name: 'Charcoal Parapet', hex: '#2C3539', usage: 'Exterior Trim' }
        ]
      };

    case 'tile_combination':
      return {
        title: `AI Cohesive Flooring & Bathroom Tile Scheme`,
        summary: 'Calculated tile pairing ensuring anti-skid safety in wet areas and high-gloss elegance in living zones.',
        recommendations: [
          'Living & Dining: 800x800mm High Gloss Vitrified Marble Effect Tiles with 2mm epoxy grout.',
          'Bathroom Floor: 300x300mm Anti-Skid Matte Vitrified Tiles with 1:100 drainage slope towards drain trap.',
          'Bathroom Wall: 300x600mm Glazed Ceramic Highlight Tiles up to 7ft lintel door height.'
        ],
        suggestedMaterials: [
          'Kajaria 800x800mm Vitrified Living Room Tile',
          'Somany 300x300mm Anti-Skid Bathroom Floor Tile',
          'Epoxy Waterproof Tile Grout'
        ]
      };

    case 'furniture_layout':
    default:
      return {
        title: `AI Ergonomic Furniture & Spatial Layout Guide`,
        summary: 'Optimal spatial arrangement maximizing natural sunlight, cross-ventilation, and human circulation flow.',
        recommendations: [
          'Living Room: L-Shaped sectional sofa anchored along North wall facing East entertainment console.',
          'Dining Space: 4-Seater compact dining table set adjacent to modular kitchen counter window.',
          'Master Bedroom: King bed positioned against West solid wall with East window for morning sunlight daylighting.'
        ],
        layoutAdvice: [
          'Ensure minimum 3 feet clearance around bed perimeters.',
          'Align sofa seating line with natural cross-breeze airflow direction.'
        ]
      };
  }
}
