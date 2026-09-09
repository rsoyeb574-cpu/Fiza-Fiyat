export interface ComprehensiveMaterialRecord {
  id: string;
  name: string;
  category: string;
  properties: {
    density: string;
    strength?: string;
    thermalConductivity?: string;
    durabilityRating: 'Moderate' | 'High' | 'Very High' | 'Exceptional' | string;
    fireRating?: string;
  };
  uses: string[];
  advantages: string[];
  disadvantages: string[];
  typical_applications: string[];
  common_problems: string[];
  maintenance: string[];
  compatibility: {
    compatibleWith: string[];
    incompatibleWith: string[];
    notes: string;
  };
  selection_considerations: string[];
  standardsRef?: string;
}

export const ENGINEERING_MATERIALS_DATABASE: ComprehensiveMaterialRecord[] = [
  // 1. CONCRETE
  {
    id: 'mat-concrete-rcc',
    name: 'Reinforced Concrete (RCC M25 / M30)',
    category: 'Concrete & Masonry',
    properties: {
      density: '2400 - 2500 kg/m³',
      strength: 'Characteristic Compressive Strength fck = 25 - 30 N/mm² at 28 days',
      thermalConductivity: '1.2 - 1.7 W/m·K',
      durabilityRating: 'Exceptional',
      fireRating: 'Class A1 Non-combustible (up to 4 hours fire resistance depending on cover)'
    },
    uses: ['Structural foundations', 'Columns', 'Beams', 'Floor slabs', 'Water retaining structures', 'Bridges and flyovers'],
    advantages: ['High compressive strength and moldability into complex geometries', 'Monolithic structural action offering superior seismic and wind resistance', 'Excellent fire and weathering resistance when properly compacted and cured'],
    disadvantages: ['Low tensile strength (approx 10% of compressive strength), necessitating steel reinforcement', 'Heavy self-weight requiring extensive formwork and foundation bearing capacity', 'Susceptible to shrinkage cracking and chemical attack if water-cement ratio is too high'],
    typical_applications: ['Multi-story building frames', 'Raft foundations', 'Precast structural elements', 'Industrial grade slabs'],
    common_problems: ['Honeycomb voids due to inadequate needle vibrator compaction', 'Plastic shrinkage cracks from rapid surface evaporation in hot winds', 'Cold joints from delays between batch pours'],
    maintenance: ['Apply silane/siloxane water-repellent sealers on exposed exterior concrete', 'Inspect periodically for carbonation and chloride-induced rebar corrosion staining', 'Epoxy grout or polyurethane pressure injection for structural cracks'],
    compatibility: {
      compatibleWith: ['TMT Rebar (Fe500D)', 'Fly ash', 'Silica fume', 'Polypropylene microfibers'],
      incompatibleWith: ['Acidic soil or groundwater (requires Sulfate Resistant Cement SRC)', 'Unwashed sea sand containing free chlorides'],
      notes: 'Ensure minimum 40mm cover for columns and 50mm for foundations to avoid premature galvanic carbonation corrosion.'
    },
    selection_considerations: ['Specify maximum water-cement ratio <= 0.45 for severe exposure per IS 456 Table 5', 'Use Ready-Mix Concrete (RMC) for consistent batch quality control on sites with tight footprints.'],
    standardsRef: 'IS 456:2000, ACI 318-19, EN 1992-1-1'
  },

  // 2. CEMENT
  {
    id: 'mat-cement-opc-ppc',
    name: 'Portland Pozzolana Cement (PPC) & OPC 53 Grade',
    category: 'Concrete & Masonry',
    properties: {
      density: '1440 kg/m³ (loose bulk density)',
      strength: 'Compressive strength >= 33, 43, or 53 MPa at 28 days',
      durabilityRating: 'Very High',
      fireRating: 'Non-combustible'
    },
    uses: ['Structural concrete', 'Brick and block masonry mortar', 'Interior and exterior plastering', 'Tile fixing screeds'],
    advantages: ['PPC produces lower heat of hydration, reducing thermal shrinkage cracks in mass concrete', 'Higher long-term strength and lower permeability due to secondary pozzolanic C-S-H gel reaction', 'Resistant to sulfate and chemical attack in coastal environments'],
    disadvantages: ['PPC has slower initial setting and early 7-day strength gain compared to OPC 53', 'Requires extended wet curing (min 10-14 days) to achieve maximum strength'],
    typical_applications: ['PPC: Mass concrete, residential housing, plastering, masonry', 'OPC 53: Precast concrete, high-rise slip-form towers, pre-stressed girders'],
    common_problems: ['Air-setting / hydration lump formation when bags are stored in damp warehouses', 'Cracking in plaster when neat cement slurry (gholi) is applied over-thickly'],
    maintenance: ['Store bags stacked on wooden pallets 150mm off floor and 600mm away from walls in airtight sheds; consume within 90 days of manufacturing.'],
    compatibility: {
      compatibleWith: ['Clean river sand / manufactured M-Sand (Zone II)', 'Crushed granite aggregate', 'Fly ash', 'Superplasticizers'],
      incompatibleWith: ['Water containing organic matter, sulfates (>400 ppm), or chlorides (>2000 ppm for plain, >500 ppm for RCC)'],
      notes: 'Never mix different brands or grades of cement in a single structural pour.'
    },
    selection_considerations: ['Choose PPC for crack-resistant plastering and durability; choose OPC 53 when rapid formwork stripping (3 to 7 days) is economically crucial.'],
    standardsRef: 'IS 1489 (Part 1):2015 for PPC, IS 269:2015 for OPC 53'
  },

  // 3. STEEL REBAR
  {
    id: 'mat-steel-tmt-rebar',
    name: 'TMT Reinforcement Bars (Fe500D / Fe550D)',
    category: 'Structural Metals',
    properties: {
      density: '7850 kg/m³',
      strength: 'Yield Strength fy >= 500 N/mm²; Ultimate Tensile Strength >= 565 N/mm²; Elongation >= 16%',
      durabilityRating: 'Exceptional (when protected by concrete alkaline passivation)',
      fireRating: 'Retains strength up to 400°C; yield falls rapidly above 600°C'
    },
    uses: ['Tension and shear reinforcement in RCC beams, slabs, columns, and foundations', 'Retaining walls and pile cages'],
    advantages: ['Thermo-Mechanically Treated (TMT) process creates a hard tempered martensite outer rim and ductile ferrite-pearlite inner core', '"D" grade guarantees high uniform elongation for superior earthquake energy dissipation', 'Excellent bendability and weldability without preheating'],
    disadvantages: ['Vulnerable to rapid oxidation (rusting) if stored outdoors in open air or rain', 'Requires strict concrete cover and crack-width control to prevent carbonation degradation'],
    typical_applications: ['All seismic zone (III, IV, V) building projects', 'Deep underground basements', 'Bridges and marine docks'],
    common_problems: ['Excessive surface rust scale (pitted rust) before installation reducing effective bond area', 'Cracking at rebar bends caused by tight bend pin diameters'],
    maintenance: ['Store off the ground on wooden battens under waterproof tarpaulins; apply zinc-phosphate or epoxy rebar coatings for marine sites.'],
    compatibility: {
      compatibleWith: ['Concrete (M25 and above)', 'Binding wire (16-18 gauge annealed GI wire)', 'Concrete cover blocks'],
      incompatibleWith: ['Direct contact with dissimilar metals (copper, aluminum) causing galvanic corrosion cells'],
      notes: 'Ensure bend mandrel diameter is at least 4x bar diameter for bars up to 25mm per IS 13920.'
    },
    selection_considerations: ['Always insist on primary steel manufacturers (e.g. TATA Tiscon, SAIL, JSW Neosteel) with mill test certificates guaranteeing Fe500D specifications.'],
    standardsRef: 'IS 1786:2008, ASTM A615 / A706'
  },

  // 4. MILD STEEL / STRUCTURAL STEEL
  {
    id: 'mat-structural-steel-is2062',
    name: 'Structural Mild Steel (IS 2062 E250 / ASTM A36)',
    category: 'Structural Metals',
    properties: {
      density: '7850 kg/m³',
      strength: 'Yield Strength fy = 250 MPa; Tensile Strength = 410 MPa; Elongation = 23%',
      durabilityRating: 'High (requires coating protection)',
      fireRating: 'Critical structural temperature 550°C (requires intumescent paint or vermiculite encasement for 2hr rating)'
    },
    uses: ['Industrial shed portals', 'Trusses', 'I-beams (ISMB/ISMC)', 'Columns (Built-up / H-sections)', 'Stairs and canopies'],
    advantages: ['Extremely high strength-to-weight ratio enabling long column-free architectural spans', 'Off-site shop prefabrication reduces on-site construction schedules by 40-50%', 'Fully recyclable and ductile under cyclic seismic loading'],
    disadvantages: ['Prone to atmospheric rusting if left unpainted or exposed to moisture', 'Requires fireproofing insulation to prevent catastrophic thermal buckling in building fires'],
    typical_applications: ['Pre-Engineered Buildings (PEB)', 'Multi-story composite steel frames', 'Mezzanine platforms', 'Crane gantry girders'],
    common_problems: ['Welding distortion and residual stress warping in asymmetrical built-up sections', 'Lamellar tearing in thick rolled plates subjected to through-thickness tensile stresses'],
    maintenance: ['Apply 2 coats of zinc chromate or zinc phosphate epoxy primer (75µm DFT) followed by polyurethane topcoat (100µm DFT); recoat every 5-8 years.'],
    compatibility: {
      compatibleWith: ['High-Strength Friction Grip (HSFG) Grade 8.8 / 10.9 Bolts', 'E7018 low-hydrogen electrodes'],
      incompatibleWith: ['Acidic condensation or untreated wastewater environments'],
      notes: 'Ensure weld preparation conforms strictly to AWS D1.1 prequalified joint details.'
    },
    selection_considerations: ['Select IS 2062 Grade B or C with impact Charpy V-notch testing for structures exposed to sub-zero temperatures or heavy dynamic crane fatigue.'],
    standardsRef: 'IS 2062:2011, IS 800:2007, AISC 360-16'
  },

  // 5. GALVANIZED IRON (GI) & COATED SHEETS
  {
    id: 'mat-galvanized-iron-gi',
    name: 'Galvanized Iron (GI) Sheets & Pre-Painted Galvalume (PPGL)',
    category: 'Sheet Metals & Roofing',
    properties: {
      density: '7850 kg/m³ base steel + zinc/alu-zinc coating mass (120 - 275 g/m²)',
      strength: 'Yield 240 - 550 MPa (depending on temper and base substrate)',
      durabilityRating: 'Very High',
      fireRating: 'Class A Non-combustible'
    },
    uses: ['Industrial roofing and wall cladding', 'HVAC ductwork', 'Drywall partition steel studs', 'Cable trays and rainwater downpipes'],
    advantages: ['Sacrificial zinc galvanic protection prevents steel substrate corrosion even if surface is scratched', 'Galvalume (55% Al, 43.4% Zn, 1.6% Si) offers 3-4x longer lifespan than standard hot-dip galvanized in industrial atmospheres', 'Lightweight and rapid to install with self-drilling EPDM washer screws'],
    disadvantages: ['Thermal transmission is high; requires insulation (rockwool or glasswool) to prevent interior solar heating', 'Can produce loud acoustic noise during heavy torrential downpours'],
    typical_applications: ['Warehouse roofing', 'Ducting runs', 'Electrical enclosures', 'Perimeter site hoarding'],
    common_problems: ['White rust (wet storage stain) if packaged sheets are stored tightly without ventilation in moist ambient air', 'Dissimilar metal corrosion when installed with standard carbon steel screws instead of coated bi-metal or stainless fasteners'],
    maintenance: ['Wash accumulated industrial dirt and coastal salt deposits annually with low-pressure fresh water; touch up cut edges with zinc-rich cold galvanizing compound.'],
    compatibility: {
      compatibleWith: ['Aluminium', 'Stainless steel 304/316 fasteners', 'EPDM rubber gaskets'],
      incompatibleWith: ['Direct contact with copper pipes or wet treated timber (CCA preservative)', 'Porous wet concrete touching bare GI'],
      notes: 'Never use graphite pencils to mark cutting lines on Galvalume; graphite accelerates zinc pitting.'
    },
    selection_considerations: ['Specify minimum AZ150 coating (150 g/m² Alu-Zinc) for coastal zones within 5km of the sea.'],
    standardsRef: 'IS 277 (GI), IS 15965 (Galvalume), ASTM A653 / A792'
  },

  // 6. ALUMINIUM
  {
    id: 'mat-aluminium-alloys',
    name: 'Architectural Aluminium (Alloy 6063-T6 / 5052)',
    category: 'Metals & Fenestration',
    properties: {
      density: '2700 kg/m³ (approx 1/3 the weight of steel)',
      strength: 'Yield Strength 160 - 215 MPa; Tensile Strength 195 - 240 MPa',
      thermalConductivity: '200 W/m·K',
      durabilityRating: 'Exceptional',
      fireRating: 'Melts at approx 660°C; non-combustible'
    },
    uses: ['Window and door frame extrusions', 'Unitized curtain walls', 'Aluminium Composite Panels (ACP)', 'Architectural louvers and pergolas'],
    advantages: ['Naturally forms a protective self-healing aluminium oxide film preventing progressive atmospheric corrosion', 'Easily extruded into intricate thermal-break hollow profiles for high-performance fenestration', 'Lightweight reduces structural dead load on high-rise facades'],
    disadvantages: ['High coefficient of thermal expansion (23 x 10^-6 /K), requiring intentional expansion joints in curtain wall mullions', 'Severe galvanic corrosion if placed in direct physical contact with mild steel or copper in damp environments'],
    typical_applications: ['Commercial office glazing', 'Residential sliding windows', 'Facade fins', 'Solar panel mounting brackets'],
    common_problems: ['Bimetallic galvanic corrosion from uninsulated steel anchor brackets', 'Pitting corrosion in aggressive marine environments if anodizing thickness is under 15 microns'],
    maintenance: ['Clean quarterly with mild neutral pH detergent; never use abrasive alkaline or acidic scouring pads that destroy the anodized / powder-coated finish.'],
    compatibility: {
      compatibleWith: ['EPDM gaskets', 'Structural silicone (Dow Corning 983 / Sika)', 'Stainless steel (304/316) screws'],
      incompatibleWith: ['Wet mortar / alkaline wet plaster (causes etching and white pitting)', 'Uninsulated carbon steel'],
      notes: 'Use nylon or neoprene isolation shims between aluminium mullions and galvanized steel cast-in anchor channels.'
    },
    selection_considerations: ['Specify minimum 25-micron architectural hard anodizing or 60-80 micron D2000 fluoropolymer / PVDF powder coating for external facades.'],
    standardsRef: 'IS 733, IS 1285, ASTM B221'
  },

  // 7. BRICKS & AAC BLOCKS
  {
    id: 'mat-autoclaved-aerated-concrete-aac',
    name: 'Autoclaved Aerated Concrete (AAC) Blocks & Red Clay Bricks',
    category: 'Concrete & Masonry',
    properties: {
      density: 'AAC: 550 - 650 kg/m³ (vs Clay Brick: 1800 - 2000 kg/m³)',
      strength: 'Compressive Strength: AAC 3.0 - 4.5 N/mm²; First Class Clay Brick >= 10.5 N/mm²',
      thermalConductivity: 'AAC: 0.16 - 0.24 W/m·K (superior thermal insulation)',
      durabilityRating: 'High',
      fireRating: 'Class A1 (up to 4 hours fire barrier rating for 200mm block wall)'
    },
    uses: ['Non-load-bearing external building envelope walls', 'Internal room partitions', 'Fire separation walls'],
    advantages: ['AAC blocks reduce structural dead load by up to 50%, saving RCC column and foundation steel costs', 'High thermal insulation lowers interior air conditioning electricity consumption by 25-30%', 'Large modular dimensions (600x200x150/200mm) accelerate masonry construction speed 3x compared to small clay bricks'],
    disadvantages: ['AAC has higher water absorption and lower shear/impact resistance than dense burnt clay bricks', 'Requires specialized thin-bed polymer mortar adhesive (2-3mm) and joint mesh to prevent hairline cracks'],
    typical_applications: ['High-rise apartment infill walls', 'Hospital and hotel acoustic partitions', 'Commercial office perimeter walls'],
    common_problems: ['Step hairline cracks at block joints if laid using conventional thick sand-cement mortar instead of thin-bed adhesive', 'Chipping at block edges during rough site transport'],
    maintenance: ['Ensure walls are plastered with polymer-modified plaster or gypsum finish; avoid chasing walls with heavy sledgehammers (use electrical groove cutters).'],
    compatibility: {
      compatibleWith: ['Thin-bed block adhesive', 'Fiberglass mesh at RCC-masonry joints', 'Control joint expansion strips'],
      incompatibleWith: ['Heavy cantilevered point loads without reinforced concrete bond beams or chemical toggle anchors'],
      notes: 'Install continuous RCC lintel bands and coping bands above 3m wall heights per NBC 2016.'
    },
    selection_considerations: ['Choose AAC blocks for RCC framed structures to minimize structural tonnage; choose high-strength fly ash/wire-cut clay bricks for load-bearing low-rise construction.'],
    standardsRef: 'IS 2185 (Part 3):1984 for AAC, IS 1077 for Burnt Clay Bricks'
  },

  // 8. NATURAL STONE (GRANITE, MARBLE, SANDSTONE)
  {
    id: 'mat-granite-natural-stone',
    name: 'Natural Granite & Marble',
    category: 'Finishes & Stone',
    properties: {
      density: 'Granite: 2650 - 2750 kg/m³; Marble: 2500 - 2700 kg/m³',
      strength: 'Granite Compressive Strength >= 100 - 180 MPa; Mohs Hardness: Granite 6-7, Marble 3-4',
      durabilityRating: 'Exceptional',
      fireRating: 'Class A Non-combustible'
    },
    uses: ['Kitchen countertops', 'High-traffic commercial lobby flooring', 'Staircase treads and risers', 'Exterior dry cladding facades'],
    advantages: ['Granite is virtually scratch-proof, stain-resistant, and immune to kitchen food acids (citric acid, vinegar)', 'Marble offers unmatched natural veining luxury and cool surface temperature underfoot', 'Lifespan exceeds 100+ years with proper periodic crystalline polishing'],
    disadvantages: ['Marble is porous calcite-based stone, easily etched and permanently stained by acidic substances like lemon juice or toilet cleaners', 'Heavy dead weight requires sturdy cabinet sub-bases and high-grade polymer-modified adhesive'],
    typical_applications: ['Countertops, vanity tops, elevator door architraves, memorial plazas, luxury residential floors'],
    common_problems: ['Yellowing of white marble (e.g. Makrana / Thassos) when laid with grey cement instead of white cement and damp-proof backing sealers', 'Hollow sounding tiles when laid with poor adhesive coverage'],
    maintenance: ['Apply penetrating fluoropolymer stone sealer every 12-24 months; clean exclusively with pH-neutral stone soaps; never use acidic harpic or bleach.'],
    compatibility: {
      compatibleWith: ['Type 2 / Type 3 polymer-modified stone adhesives (IS 15477)', 'Epoxy joint grout', 'Mechanical SS 304 dry cladding anchors'],
      incompatibleWith: ['Direct laying over green, moist concrete without moisture barrier', 'Hydrochloric and muriatic acids'],
      notes: 'Always coat bottom and sides of white marble slabs with anti-efflorescence moisture barrier primer before fixing.'
    },
    selection_considerations: ['Always select dense flamed or leather-finish granite for outdoor wet areas for slip resistance; choose polished granite for high-wear kitchen counters.'],
    standardsRef: 'IS 3316 (Granite), IS 1130 (Marble), ASTM C615'
  },

  // 9. WOOD & TIMBER
  {
    id: 'mat-timber-teak-sal',
    name: 'Hardwood Timber (Teak / Sal / Sheesham)',
    category: 'Timber & Joinery',
    properties: {
      density: 'Teak: 650 - 720 kg/m³; Sal: 850 - 950 kg/m³',
      strength: 'Bending Strength: Teak 95 - 110 N/mm²; Sal 140 N/mm²',
      durabilityRating: 'Very High',
      fireRating: 'Charring rate approx 0.65 mm/min (fire retardant intumescent coatings can elevate to Class 1)'
    },
    uses: ['Main entrance doors and door frames (chowkhats)', 'Fine furniture and bespoke cabinetry', 'Hardwood flooring and wall paneling'],
    advantages: ['Teak contains natural silica and essential oils making it naturally resistant to white ants (termites) and fungal rot', 'Exceptional dimensional stability with minimal seasonal expansion/contraction when seasoned to 10-12% moisture content', 'Rich aesthetic grain patterns that enhance with age and natural polishing'],
    disadvantages: ['High cost and scarcity of sustainably harvested mature heartwood', 'Requires skilled carpenters and meticulous seasoning; unseasoned wood warps and splits within months'],
    typical_applications: ['Luxury door shutters, window frames, balustrades, heritage restorations'],
    common_problems: ['Termite infestation in non-teak woods (like un-treated rubberwood or mango wood)', 'Swelling of doors during humid monsoon seasons causing latch jamming'],
    maintenance: ['Sand and apply polyurethane (PU) or melamine polish every 3-5 years; treat unexposed frame ends touching masonry with anti-termite coal tar creosote.'],
    compatibility: {
      compatibleWith: ['Brass and stainless steel hinges (SS 304)', 'PVA wood glue (D3/D4 water resistant)', 'Polyurethane finishes'],
      incompatibleWith: ['Direct embedding in un-waterproofed wet ground or leaking masonry walls'],
      notes: 'All timber frames must be seasoned in kilns to 10-12% moisture content per IS 1141 before cutting.'
    },
    selection_considerations: ['Insist on plantation-certified seasoned CP Teak or Burma Teak heartwood with straight grain and zero sapwood for exterior door frames.'],
    standardsRef: 'IS 883 Code of Practice for Design of Structural Timber, IS 1141 Timber Seasoning'
  },

  // 10. GLASS & GLAZING
  {
    id: 'mat-architectural-glass',
    name: 'Architectural Glazing (Toughened & Double Glazed Units - DGU)',
    category: 'Finishes & Fenestration',
    properties: {
      density: '2500 kg/m³',
      strength: 'Toughened glass surface compression >= 90 - 100 MPa (4-5x stronger than annealed glass)',
      thermalConductivity: 'DGU with Low-E: U-Value <= 1.8 - 2.8 W/m²·K (vs Single Clear: 5.7 W/m²·K)',
      durabilityRating: 'Exceptional',
      fireRating: 'Standard glass shatters at 250°C; Fire-rated glass with intumescent interlayers (Pyrostop) provides up to 120min insulation'
    },
    uses: ['Building curtain walls and structural spider glazing', 'Frameless shower cubicles and sliding patio doors', 'Glass balcony balustrades', 'Storefront windows'],
    advantages: ['Toughened glass fractures into small, blunt, dice-like granular pieces, drastically mitigating serious laceration hazard', 'DGU insulated glass with argon gas filling cuts exterior traffic noise by 35-42 dB and lowers solar heat gain (SHGC <= 0.30)', '100% immune to corrosion, moisture, and chemical oxidation'],
    disadvantages: ['Cannot be cut, drilled, or edged after thermal tempering (all fabrication must precede tempering process)', 'Susceptible to rare spontaneous breakage from microscopic nickel sulfide (NiS) inclusions if not Heat-Soak Tested (HST)'],
    typical_applications: ['High-rise facade glazing, entrance lobbies, skylights, acoustic meeting rooms'],
    common_problems: ['Seal failure in poorly manufactured DGU units resulting in internal condensation fogging between panes', 'Thermal stress fracture in dark tinted annealed glass subjected to partial shading'],
    maintenance: ['Clean with non-abrasive glass cleaner and squeegee; inspect perimeter structural silicone and EPDM gaskets every 5 years for weathering.'],
    compatibility: {
      compatibleWith: ['Neutral-cure structural silicone sealants (ASTM C1184)', 'EPDM setting blocks', 'PVB / SentryGlas (SG) interlayers'],
      incompatibleWith: ['Acid-cure (acetoxy) silicone which corrodes PVB laminates and DGU edge seals'],
      notes: 'All glass in railings, doors, and floor-to-ceiling windows below 800mm FFL must be Toughened Laminated safety glass per NBC 2016.'
    },
    selection_considerations: ['Specify Heat-Soak Tested (HST) Toughened glass for all overhead skylights and spandrel panels to eliminate spontaneous breakage risk.'],
    standardsRef: 'IS 2553 (Part 1):1990 Safety Glass, NBC 2016 Part 6 Section 8'
  },

  // 11. CERAMIC & VITRIFIED TILES
  {
    id: 'mat-vitrified-tiles',
    name: 'Full Body & Glazed Vitrified Tiles (GVT / PGVT)',
    category: 'Finishes & Stone',
    properties: {
      density: '2400 kg/m³',
      strength: 'Modulus of Rupture >= 35 N/mm²; Breaking Strength >= 1300 N; Water Absorption < 0.05%',
      durabilityRating: 'Very High',
      fireRating: 'Class A1 Non-combustible'
    },
    uses: ['Residential and commercial interior flooring', 'Bathroom and kitchen wall dados', 'Exterior building facade cladding (dry/wet system)', 'Heavy duty parking areas (industrial full body)'],
    advantages: ['Near-zero water absorption (<0.05%) prevents efflorescence, water staining, and frost spalling', 'Hard, impervious vitrified glaze resists scratching, household stains, and abrasive wear', 'Available in large format slabs (e.g. 1200x1800mm, 800x1600mm) creating seamless, minimal-grout floors'],
    disadvantages: ['Requires specialized polymer-modified cementitious adhesives (Type 2 per IS 15477) due to zero mechanical suction bonding with plain cement mortar', 'Polished glossy tiles (PGVT) become dangerously slippery when wet'],
    typical_applications: ['Living room floors, commercial retail malls, corporate offices, exterior walkways'],
    common_problems: ['Tile de-bonding and tenting (buckling up) when laid without minimum 2-3mm expansion grout spacers in large areas', 'Lippage (uneven joint edges) in large format tiles on uneven screeds'],
    maintenance: ['Mop regularly with warm water and neutral detergent; clean grout joints with nylon brushes; re-apply epoxy grout if cementitious grout erodes.'],
    compatibility: {
      compatibleWith: ['Polymer-modified tile adhesive (IS 15477 Type 2/Type 3)', 'Epoxy joint grout (3-component resin+hardener+filler)', 'Self-leveling underlayment screeds'],
      incompatibleWith: ['Direct fixing with traditional neat cement slurry over dry cured concrete without adhesive'],
      notes: 'Always maintain minimum 2mm-3mm tile spacer joints and perimeter expansion joints every 6m to absorb building thermal movements.'
    },
    selection_considerations: ['Use Matt finish with Anti-Skid R-Rating >= R10 for bathrooms and balconies; use Full Body tiles for high-traffic supermarket corridors.'],
    standardsRef: 'IS 15622:2017, ISO 13006 Group BIa'
  },

  // 12. PAINTS & PROTECTIVE COATINGS
  {
    id: 'mat-architectural-paints',
    name: 'Architectural Paints (Acrylic Emulsion & Silicone Exterior)',
    category: 'Finishes & Paints',
    properties: {
      density: '1.25 - 1.45 kg/L',
      durabilityRating: 'High',
      fireRating: 'Class 0 / Class 1 surface flame spread rating'
    },
    uses: ['Interior wall and ceiling decoration', 'Exterior facade weatherproofing', 'Metal and woodwork protection (PU and Enamels)'],
    advantages: ['Premium exterior acrylic emulsions with cross-linking polymers provide 8-12 years anti-fungal and UV-resistant color retention', 'Interior washable emulsions offer low Volatile Organic Compounds (VOC < 50 g/L) for healthy indoor air quality', 'Elastomeric paints can bridge dynamic structural hairline cracks up to 1.0mm'],
    disadvantages: ['Fails rapidly (peeling, bubbling, flaking) if applied over moist masonry walls with rising dampness or water leakage', 'Requires thorough surface preparation (putty, sanding, alkali-resistant primer)'],
    typical_applications: ['Interior bedrooms and living rooms, high-rise building facades, damp-prone exterior balconies'],
    common_problems: ['Efflorescence (white powdery salt patches) pushing paint off walls due to untreated moisture behind plaster', 'Flaking and chalking under severe UV sunlight exposure'],
    maintenance: ['Wipe interior walls with damp sponge and mild soap; recoat exterior facades every 5-7 years to maintain waterproofing protection.'],
    compatibility: {
      compatibleWith: ['Acrylic wall putty', 'Water-based penetrating primers', 'Microfiber rollers'],
      incompatibleWith: ['Wet walls with moisture content > 12%', 'Surfaces contaminated with oil or un-neutralized acidic cleaning residues'],
      notes: 'Never apply paint until masonry plaster has cured for at least 28 days and wall moisture meter reads under 10%.'
    },
    selection_considerations: ['Specify 100% acrylic exterior emulsion with silicone additives for high-rainfall regions to ensure water-beading lotus-leaf effect.'],
    standardsRef: 'IS 15489 Plastic Emulsion Paint, IS 5410'
  },

  // 13. GYPSUM & FALSE CEILING
  {
    id: 'mat-gypsum-plasterboard',
    name: 'Gypsum Plasterboards & Plaster of Paris (POP)',
    category: 'Interior & Drywall',
    properties: {
      density: '750 - 850 kg/m³',
      thermalConductivity: '0.16 W/m·K',
      durabilityRating: 'High (Interior dry areas)',
      fireRating: 'Type X Fire-shield boards achieve up to 2-hour fire-rated barrier'
    },
    uses: ['Suspended false ceilings', 'Drywall partitions in commercial offices', 'Interior wall lining and acoustic baffling'],
    advantages: ['Contains approx 21% chemically combined crystalline water, releasing steam in fires to dramatically retard flame spread', 'Smooth monolithic finish that takes paint flawlessly without sand-cement plastering shrinkage cracks', 'Lightweight system (approx 12-15 kg/m²) imposes minimal dead load on structural slabs'],
    disadvantages: ['Vulnerable to water saturation and sagging if exposed to roof leaks or plumbing pipe drips', 'Standard boards harbor mold if kept continuously damp (requires Moisture Resistant MR green boards in toilets/kitchens)'],
    typical_applications: ['Living room cove ceilings, corporate workstation partitions, cinema sound-damping walls'],
    common_problems: ['Cracks along board butt joints if jointing tape and compound are applied carelessly without paper tape', 'Sagging ceilings caused by exceeding 450mm center-to-center framework spacing'],
    maintenance: ['Avoid hanging heavy ceiling fans directly from gypsum framework (anchor fan rods to RCC slab with anchor fasteners); clean with dry microfiber duster.'],
    compatibility: {
      compatibleWith: ['Galvanized steel ceiling framework (IS 277 80gsm)', 'Self-tapping drywall screws (3.5x25mm)', 'Jointing tape and joint compound'],
      incompatibleWith: ['Continuous wet shower areas or outdoor open canopies without weather-shield cement boards'],
      notes: 'Use Moisture Resistant (MR) green boards for bathroom ceilings and Fire Resistant (FR) pink boards for electrical shafts.'
    },
    selection_considerations: ['Specify 12.5mm tapered-edge gypsum boards with 0.50mm BMT galvanized steel framing for durable residential ceilings.'],
    standardsRef: 'IS 2095 (Part 1):2011, ASTM C1396'
  },

  // 14. PLYWOOD & ENGINEERED BOARDS (MDF / HDF)
  {
    id: 'mat-plywood-bwp-mdf',
    name: 'Plywood (BWP / BWR Grade IS 710) & HDF Boards',
    category: 'Timber & Joinery',
    properties: {
      density: 'BWP Plywood: 650 - 750 kg/m³; HDF: 800 - 900 kg/m³',
      durabilityRating: 'High to Very High',
      fireRating: 'Class 3 (can be chemically treated to achieve Class 1 Fire Retardant IS 5509)'
    },
    uses: ['Modular kitchen base and overhead cabinets', 'Bed frames, wardrobes, and TV consoles', 'Flush door shutter cores', 'Wall paneling and acoustic substrate'],
    advantages: ['BWP (Boiling Water Proof) grade uses unextended phenol formaldehyde synthetic resin, withstanding 72 hours boiling water test without delamination', 'Cross-laminated grain veneers provide balanced strength in both longitudinal and transverse directions', 'Superior screw-holding capacity on face and edges compared to particle board'],
    disadvantages: ['Low-grade commercial plywood (MR grade) readily delaminates when exposed to sink plumbing leaks', 'MDF/HDF core fibers swell irreversibly if moisture penetrates unbanded cut edges'],
    typical_applications: ['Kitchen carcass, bathroom vanities, wardrobe shutters, luxury interior furniture'],
    common_problems: ['Borer and termite infestation in unbranded local plywood', 'Warping of tall wardrobe shutters (> 2.1m) if single-sided laminate is pasted without balancing backer laminate'],
    maintenance: ['Ensure all cut edges in wet areas are sealed with hot-melt PVC edge banding or marine varnish; keep base cabinets raised on 100mm adjustable PVC legs.'],
    compatibility: {
      compatibleWith: ['Decorative laminates (1.0mm Sunmica)', 'Natural wood veneers', 'Contact adhesives (Fevicol Marine / HeatX)', 'PVC edge bands'],
      incompatibleWith: ['Prolonged standing water submersion for non-BWP grades'],
      notes: 'Always paste balancing laminate of identical thickness (0.8mm) on the rear face of cabinet shutters to prevent cupping/warping.'
    },
    selection_considerations: ['Always specify calibrated 100% gurjan or eucalyptus core IS 710 BWP plywood for kitchen and vanity cabinetry.'],
    standardsRef: 'IS 710 (Marine Plywood), IS 303 (MR/BWR Plywood), IS 14587 (Pre-laminated MDF)'
  },

  // 15. WATERPROOFING CHEMICALS & MEMBRANES
  {
    id: 'mat-waterproofing-app-pu',
    name: 'Waterproofing (APP Bituminous Membrane & 2K Polyurethane Coating)',
    category: 'Waterproofing & Insulation',
    properties: {
      density: 'APP Membrane: 3mm - 4mm thickness, 3.5 - 4.5 kg/m²',
      strength: 'Elongation at break: PU Coating > 400 - 600%; Tensile Strength > 2.0 N/mm²',
      durabilityRating: 'Exceptional',
      fireRating: 'Flame retardant varieties available'
    },
    uses: ['RCC terrace roofs and podium slabs', 'Sunken bathroom and toilet floors', 'Basement retaining walls and elevator pits', 'Swimming pools and overhead water tanks'],
    advantages: ['Liquid PU membrane cures into a continuous, joint-free, elastomeric waterproof rubber skin with zero seams', 'APP (Atactic Polypropylene) torch-on membranes offer high puncture resistance and withstand standing ponding water', 'Accommodates building thermal expansion and bridges dynamic substrate cracks up to 2mm'],
    disadvantages: ['Requires impeccably clean, dry, sound substrate with rounded coving (chamfers) at all 90° wall-floor junctions', 'Torching APP membranes requires skilled flame application; improper lap welding causes catastrophic hidden leaks'],
    typical_applications: ['Terrace waterproofing, basement tanking, podium landscapes, sunken slabs'],
    common_problems: ['Waterproofing failure caused by puncturing of membrane during subsequent tile fixing or solar panel installation', 'Blistering caused by moisture vapor pressure when applied over wet concrete without primer'],
    maintenance: ['Always protect horizontal waterproof membranes with geotextile separation layer and 50mm M20 protective screed before letting other trades work.'],
    compatibility: {
      compatibleWith: ['Polymer modified repair mortars', 'Non-woven polypropylene geotextile', 'Bituminous primers'],
      incompatibleWith: ['Sharp aggregate edges touching bare membrane without protection layer', 'Porous un-grouted pipe penetrations'],
      notes: 'Carry waterproofing vertically up parapet walls and bathroom walls by at least 300mm above finished floor level (coving termination).'
    },
    selection_considerations: ['Use food-grade epoxy/polyurethane coatings for drinking water tanks; use UV-resistant aliphatic PU or torch-on APP with slate mineral flakes for exposed roofs.'],
    standardsRef: 'IS 1346 Waterproofing of Roofs, IS 16098'
  },

  // 16. THERMAL & ACOUSTIC INSULATION
  {
    id: 'mat-insulation-rockwool-xps',
    name: 'Extruded Polystyrene (XPS) & Rockwool Insulation',
    category: 'Waterproofing & Insulation',
    properties: {
      density: 'XPS: 32 - 38 kg/m³; Rockwool: 48 - 144 kg/m³',
      thermalConductivity: 'XPS: 0.028 - 0.032 W/m·K; Rockwool: 0.034 - 0.040 W/m·K',
      durabilityRating: 'Very High',
      fireRating: 'Rockwool: Non-combustible Class A1 (melting point > 1000°C); XPS: Flame retardant B1'
    },
    uses: ['Over-deck terrace roof thermal insulation', 'Acoustic infill in drywall partitions and theater ceilings', 'Cavity wall insulation in extreme climate zones', 'HVAC duct thermal and acoustic wrap'],
    advantages: ['XPS closed-cell structure absorbs < 1% water, retaining thermal insulation efficiency even under wet rooftop ballast', 'Rockwool delivers exceptional sound transmission loss (STC >= 50-55 dB in double-stud drywalls) and absolute firestop integrity', 'Reduces summer air conditioning load by up to 30-40% when placed over roof slabs'],
    disadvantages: ['XPS degrades under direct UV solar exposure and must be shielded beneath screed or pavers', 'Rockwool fibers require PPE (gloves, dust masks, goggles) during installation to prevent skin itching and lung irritation'],
    typical_applications: ['Green roof systems, cold storage walls, server room partitions, auditorium acoustic cladding'],
    common_problems: ['Thermal bridging when insulation boards are laid with loose, un-staggered gaps', 'Crushing of low-density foam under heavy rooftop HVAC chillers'],
    maintenance: ['Keep sealed behind moisture barriers or protective screeds; inspect perimeter parapet flashings to prevent water logging.'],
    compatibility: {
      compatibleWith: ['Concrete, gypsum boards, steel studs, geotextile membranes'],
      incompatibleWith: ['Solvent-based paints or aromatic hydrocarbon adhesives touching XPS (causes chemical melting of polystyrene)'],
      notes: 'Stagger insulation board joints and tape seams to eliminate thermal bridging paths.'
    },
    selection_considerations: ['Select XPS (minimum 300 kPa compressive strength) for over-deck roof installations; choose Rockwool (64 or 96 kg/m³) for fireproof acoustic wall insulation.'],
    standardsRef: 'IS 8183 Bonded Mineral Wool, ASTM C578 (XPS)'
  },

  // 17. FASTENERS, ANCHORS & WELDING CONSUMABLES
  {
    id: 'mat-fasteners-welding-consumables',
    name: 'High-Tensile Structural Fasteners & Low-Hydrogen Welding Electrodes',
    category: 'Structural Metals',
    properties: {
      density: '7850 kg/m³',
      strength: 'Grade 8.8: Tensile 800 MPa, Yield 640 MPa; Grade 10.9: Tensile 1040 MPa, Yield 940 MPa; E7018: Tensile >= 490 MPa',
      durabilityRating: 'Exceptional',
      fireRating: 'Matches structural steel'
    },
    uses: ['Structural steel beam-column moment and shear connections', 'Base plate anchor bolting into concrete pedestals', 'Facade curtain wall bracket anchoring', 'Heavy machinery foundation fastening'],
    advantages: ['High-Strength Friction Grip (HSFG) bolts transfer shear through friction between clamped steel plates, eliminating hole play and bolt fatigue failure', 'E7018 low-hydrogen electrodes prevent hydrogen-induced underbead cold cracking in heavy structural steel sections', 'Chemical capsule / injection anchors provide high load capacity without creating expansion burst stresses in thin concrete edges'],
    disadvantages: ['HSFG bolts require calibrated torque wrenches or Direct Tension Indicators (DTI washers) to guarantee specified clamping tension', 'E7018 electrodes must be baked in holding ovens at 250-300°C before use to drive out moisture'],
    typical_applications: ['Seismic frame connections, overhead crane rails, tower crane tie-ins, precast column splices'],
    common_problems: ['Hydrogen cracking in weld heat-affected zone (HAZ) caused by using damp welding rods', 'Bolt shear failure resulting from using commercial Grade 4.6 mild steel bolts where High-Tensile 8.8 was specified'],
    maintenance: ['Hot-dip galvanize (min 45µm) or Dacromet-coat fasteners exposed to exterior atmospheric environments; inspect bolted connections for torque loss after seismic events.'],
    compatibility: {
      compatibleWith: ['Hardened steel washers (ASTM F436 / IS 6649)', 'Structural steel IS 2062 / ASTM A992'],
      incompatibleWith: ['Re-using torqued HSFG bolts that have undergone yield deformation'],
      notes: 'Ensure concrete has reached minimum 28-day design strength before torquing chemical or expansion anchors.'
    },
    selection_considerations: ['Use Grade 8.8/10.9 HSFG bolts for all primary seismic frame connections per IS 800; use stainless steel A4-70 anchors for marine coastal facades.'],
    standardsRef: 'IS 3757 (HSFG Bolts), IS 814 (Covered Electrodes), AWS D1.1, EN 14399'
  }
];
