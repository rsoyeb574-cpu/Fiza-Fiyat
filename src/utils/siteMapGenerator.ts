import { ProjectSiteMapData, SiteZone } from '../types/siteMap';
import { Project } from '../types';

export function getProjectSiteMap(project: Project): ProjectSiteMapData {
  if (project.siteMap && project.siteMap.zones?.length) {
    return project.siteMap;
  }

  const title = (project.title || '').toLowerCase();
  const cat = (project.categoryName || '').toLowerCase();
  const img0 = project.images?.[0] || project.coverImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80';
  const img1 = project.images?.[1] || project.coverImage || img0;
  const img2 = project.images?.[2] || img1;
  const img3 = project.images?.[3] || img0;

  const isTower = cat.includes('bim') || cat.includes('3d') || title.includes('tower') || title.includes('skyscraper');
  const isInterior = cat.includes('interior') || title.includes('interior') || title.includes('penthouse');

  if (isTower) {
    const zones: SiteZone[] = [
      {
        id: 'zone-tower-core',
        code: 'T-01',
        name: 'Primary Skyscraper Diagrid Tower',
        type: 'building',
        polygonPoints: '370,140 630,140 650,420 350,420',
        center: { x: 500, y: 280 },
        accentColor: '#3b82f6',
        strokeColor: '#60a5fa',
        fillOpacity: 0.3,
        stats: {
          grossFloorArea: '1,280,000 sq.ft',
          footprintArea: '24,500 sq.ft',
          heightOrFloors: project.floors || '62 Floors (268m Height)',
          programmaticUse: 'Grade A Headquarters, Executive Suites & Sky Lounge',
          occupancyCapacity: '6,500 Occupants',
          structuralSystem: 'High-Strength Concrete Core with External Steel Diagrid',
          energyRating: 'LEED Platinum / BREEAM Outstanding',
          completionPhase: 'Superstructure Level 44',
          budgetShare: '58% of Total Budget'
        },
        description: 'The monumental mixed-use tower integrates seismic tuned mass damping with column-free floor plates.',
        renderingImage: img0,
        renderingTitle: 'Tower Massing & Diagrid Facade',
        renderingCaption: 'Parametric kinetic facade panels modulate natural daylight, reducing mechanical cooling loads by 38%.',
        viewpointAngle: 'North-East Civic Street View',
        keyHighlights: [
          '3,500-ton seismic tuned mass damper suspended on Floor 58',
          '3.0-meter floor-to-ceiling clear glazing across all office levels',
          'Double-deck destination-dispatch elevators with regenerative braking'
        ],
        materials: ['Structural Steel Diagrid', 'Unitized Double-Skin Glazing', 'Reinforced C80 Concrete']
      },
      {
        id: 'zone-tower-podium',
        code: 'P-01',
        name: 'Biophilic Retail & Cultural Podium',
        type: 'podium',
        polygonPoints: '220,380 780,380 760,550 240,550',
        center: { x: 500, y: 465 },
        accentColor: '#8b5cf6',
        strokeColor: '#a78bfa',
        fillOpacity: 0.25,
        stats: {
          grossFloorArea: '245,000 sq.ft',
          footprintArea: '48,000 sq.ft',
          heightOrFloors: '5 Terraced Podium Levels',
          programmaticUse: 'Luxury Retail, Performing Arts Theater & Public Food Hall',
          occupancyCapacity: '3,200 Persons',
          structuralSystem: 'Post-Tensioned Concrete Transfer Deck on Deep Caissons',
          energyRating: 'Green Mark Super Low Energy',
          completionPhase: 'Curtain Wall Installation',
          budgetShare: '22% of Total Budget'
        },
        description: 'Cascading landscaped rooftop garden terraces activate the streetscape and transition civic scale into the tower base.',
        renderingImage: img1,
        renderingTitle: 'Podium Terraces & Streetscape Concourse',
        renderingCaption: 'Pedestrian plaza featuring tiered native greenery, outdoor cafe spill-outs, and skylight atriums.',
        viewpointAngle: 'South Pedestrian Boulevard Perspective',
        keyHighlights: [
          'Multi-story central atrium welcoming over 12,000 visitors daily',
          'Direct underground connection to rapid mass transit network',
          'Extensive rainwater harvesting cisterns under basement slabs'
        ],
        materials: ['Terrazzo Aggregate Flooring', 'Curved Laminated Structural Glass', 'Living Green Walls']
      },
      {
        id: 'zone-tower-skybridge',
        code: 'S-01',
        name: 'Cantilevered Skybridge & Observatory',
        type: 'amenity',
        polygonPoints: '630,220 840,240 820,310 630,290',
        center: { x: 730, y: 265 },
        accentColor: '#ec4899',
        strokeColor: '#f472b6',
        fillOpacity: 0.3,
        stats: {
          grossFloorArea: '18,500 sq.ft',
          footprintArea: 'Suspended Span',
          heightOrFloors: 'Floor 32 Link (132m Elevation)',
          programmaticUse: 'Sky Fitness Club, Running Track & Meeting Lounge',
          occupancyCapacity: '350 Persons',
          structuralSystem: 'Stressed Steel Box Girder with Sliding Seismic Bearings',
          energyRating: '100% Daylight Autonomy',
          completionPhase: 'Tension Cable Rigging',
          budgetShare: '5% of Superstructure'
        },
        description: 'A daring 42-meter aerial skybridge suspended over the plaza, providing panoramic metropolitan vistas.',
        renderingImage: img2,
        renderingTitle: 'Skybridge Structural Span View',
        renderingCaption: 'Glass-bottom observation floor cantilevered over the public boulevard below.',
        viewpointAngle: 'Aerial 45-Degree High-Angle View',
        keyHighlights: [
          'Structural box truss strand-jacked into place in 48 hours',
          'Triple laminated glass walkway with interactive ambient floor lighting',
          'Biophilic hanging garden modules irrigated by AC condensation'
        ],
        materials: ['High-Tensile Steel Box Girders', 'Structural Laminated Floor Glass', 'Titanium Cladding']
      },
      {
        id: 'zone-tower-plaza',
        code: 'Z-01',
        name: 'Civic Amphitheater & Public Green Plaza',
        type: 'landscape',
        polygonPoints: '120,440 230,440 230,620 120,620',
        center: { x: 175, y: 530 },
        accentColor: '#10b981',
        strokeColor: '#34d399',
        fillOpacity: 0.3,
        stats: {
          grossFloorArea: '62,000 sq.ft Open Plaza',
          footprintArea: '62,000 sq.ft',
          heightOrFloors: 'Ground Level Civic Space',
          programmaticUse: 'Public Gatherings, Concerts & Water Fountain Displays',
          occupancyCapacity: '4,000 Public Capacity',
          structuralSystem: 'Reinforced Plaza Slab over Subterranean Logistics',
          energyRating: 'Zero Urban Heat Island Rating (High SRI Pavers)',
          completionPhase: 'Paving & Tree Planting Phase',
          budgetShare: '7% of Site Development'
        },
        description: 'A vibrant public plaza anchoring the civic frontage, equipped with interactive water jets and shade trees.',
        renderingImage: img3,
        renderingTitle: 'Public Amphitheater & Water Matrix',
        renderingCaption: 'Dry-deck fountain system capable of instantaneous transition into an event stage.',
        viewpointAngle: 'Pedestrian Eye-Level Concourse',
        keyHighlights: [
          'High solar-reflective stone paving reduces ground heat absorption by 6°C',
          '80 mature Zelkova serrata trees creating a continuous shade canopy',
          'Modular outdoor power outlets and WiFi beacons for public events'
        ],
        materials: ['Flamed Silver Granite Pavers', 'Weathering Corten Planters', 'Polished Stainless Fountain Jets']
      },
      {
        id: 'zone-tower-transit',
        code: 'M-01',
        name: 'Metro Intermodal Transit Terminal',
        type: 'infrastructure',
        polygonPoints: '770,440 890,440 890,620 770,620',
        center: { x: 830, y: 530 },
        accentColor: '#f59e0b',
        strokeColor: '#fbbf24',
        fillOpacity: 0.25,
        stats: {
          grossFloorArea: '185,000 sq.ft',
          footprintArea: '32,000 sq.ft',
          heightOrFloors: '3 Subterranean Transit Levels',
          programmaticUse: 'Subway Metro Station, Taxi Drop-Off & Bus Port',
          occupancyCapacity: '45,000 Daily Commuters',
          structuralSystem: 'Slurry Wall Diaphragms & Heavy Top-Down Construction',
          energyRating: 'Underground Natural Air Displacement Ventilation',
          completionPhase: 'MEP Tunnel Works',
          budgetShare: '8% of Infrastructure'
        },
        description: 'Direct multi-modal transit artery connecting the tower directly to the municipal subway lines.',
        renderingImage: img1,
        renderingTitle: 'Subway Portal & Sunken Light Well',
        renderingCaption: 'Conical glass skylight funneling daylight down 18 meters into the deepest train platform.',
        viewpointAngle: 'Station Gate Ingress View',
        keyHighlights: [
          'Weather-protected subterranean walkways to 6 adjacent city blocks',
          'Automated turnstiles and biometrically integrated security barriers',
          'Dedicated bicycle hub with secure lockers and repair workshops'
        ],
        materials: ['Porcelain Enamel Cladding Panels', 'Polished Quartz Flooring', 'Architectural Cast Concrete']
      }
    ];

    return {
      siteName: `${project.title} - Urban Site Master Plan`,
      tagline: 'High-Density Transit-Oriented Node • 3.8 Hectare Urban Block',
      viewBox: '0 0 1000 700',
      northAngle: 15,
      scaleBarMeters: 100,
      totalSiteArea: '3.8 Hectares (9.4 Acres)',
      totalBuiltArea: project.area || '1,728,000 sq.ft GFA',
      greenRatio: '34% Permeable Civic Realm',
      farRatio: '14.2 High-Density FAR',
      zones
    };
  }

  if (isInterior) {
    const zones: SiteZone[] = [
      {
        id: 'zone-pent-salon',
        code: 'S-1',
        name: 'Grand Living Salon & Panoramic Terrace',
        type: 'residential',
        polygonPoints: '220,180 580,180 580,380 220,380',
        center: { x: 400, y: 280 },
        accentColor: '#3b82f6',
        strokeColor: '#60a5fa',
        fillOpacity: 0.25,
        stats: {
          grossFloorArea: '1,850 sq.ft',
          footprintArea: '1,850 sq.ft',
          heightOrFloors: 'Double-Height 4.8m Volume',
          programmaticUse: 'Formal Reception, Fireside Lounge & Skyline Framing',
          occupancyCapacity: '20-30 Guests',
          structuralSystem: 'Post-Tensioned Floor Plate with Slimline Curtain Wall',
          energyRating: 'Smart Automated Shading & Climate Zoning',
          completionPhase: 'Finished Architectural Fit-Out',
          budgetShare: '35% of Interior Budget'
        },
        description: 'The core entertaining salon anchors the duplex penthouse, boasting 180-degree unobstructed horizon glazing and custom travertine hearth.',
        renderingImage: img0,
        renderingTitle: 'Double-Height Living Salon',
        renderingCaption: 'Minimalist travertine feature wall with integrated gas fireplace and concealed acoustic speakers.',
        viewpointAngle: 'Panoramic South-West View',
        keyHighlights: [
          'Full-height acoustic slatted white oak wall with concealed pivot doors',
          'Monolithic slab travertine floor with radiant underfloor heating',
          'Smart dynamic Lutron lighting scenes calibrated to solar elevation'
        ],
        materials: ['Silver Travertine', 'Acoustic White Oak Slats', 'Champagne Anodized Bronze', 'Ultra-Clear Glass']
      },
      {
        id: 'zone-pent-kitchen',
        code: 'K-1',
        name: 'Show Kitchen & Dining Pavilion',
        type: 'amenity',
        polygonPoints: '590,180 820,180 820,380 590,380',
        center: { x: 705, y: 280 },
        accentColor: '#f59e0b',
        strokeColor: '#fbbf24',
        fillOpacity: 0.25,
        stats: {
          grossFloorArea: '950 sq.ft',
          footprintArea: '950 sq.ft',
          heightOrFloors: 'Single Level (3.2m Ceiling)',
          programmaticUse: 'Gourmet Show Island, 12-Seater Dining & Butler Back-Kitchen',
          occupancyCapacity: '16 Persons',
          structuralSystem: 'Custom Steel Sub-framing for 4.2m Monolith Stone Island',
          energyRating: 'Induction Cooking & Variable HVAC Extraction',
          completionPhase: 'Cabinetry & Stone Complete',
          budgetShare: '25% of Interior Budget'
        },
        description: 'A showcase culinary gallery centering around a 4.2-meter single-slab honed quartzite kitchen counter.',
        renderingImage: img1,
        renderingTitle: 'Culinary Island & Dining Salon',
        renderingCaption: 'Custom walnut millwork with touch-to-open flush joinery and integrated wine cellaring.',
        viewpointAngle: 'Dining-Facing Elevation',
        keyHighlights: [
          'Single quarried quartzite island with waterfall edge detailing',
          'Concealed secondary prep scullery for private event catering',
          'Integrated Gaggenau 400 series induction suite'
        ],
        materials: ['Honed Taj Mahal Quartzite', 'Smoked Walnut Millwork', 'Patinated Brass Fixtures']
      },
      {
        id: 'zone-pent-master',
        code: 'M-1',
        name: 'Primary Master Suite & Spa Sanctuary',
        type: 'residential',
        polygonPoints: '220,390 520,390 520,580 220,580',
        center: { x: 370, y: 485 },
        accentColor: '#8b5cf6',
        strokeColor: '#a78bfa',
        fillOpacity: 0.25,
        stats: {
          grossFloorArea: '1,200 sq.ft',
          footprintArea: '1,200 sq.ft',
          heightOrFloors: 'Private Upper Wing',
          programmaticUse: 'Master Bedroom, Walk-In Dressing Gallery & Wet Room Spa',
          occupancyCapacity: '2 Persons',
          structuralSystem: 'Acoustic Decoupled Floating Floor & Sound-Isolated Studs',
          energyRating: 'Independent Clean Air Filter & HEPA Pressurization',
          completionPhase: 'Turnkey Complete',
          budgetShare: '26% of Interior Budget'
        },
        description: 'A secluded private retreat with panoramic dawn views, custom suede-paneled headboard wall, and freestanding stone tub.',
        renderingImage: img2,
        renderingTitle: 'Master Bedroom & Freestanding Bath',
        renderingCaption: 'Ensuite spa featuring monolithic carved marble tub positioned beside floor-to-ceiling glass.',
        viewpointAngle: 'East Morning Light View',
        keyHighlights: [
          'STC 65 sound insulation creating an ultra-quiet sleep environment',
          'Dual walk-in dressing rooms with backlit bronze wardrobes',
          'Chromotherapy steam shower with rain curtain and heated stone bench'
        ],
        materials: ['Calacatta Viola Marble', 'Bouclé Wall Upholstery', 'Micro-Topping Concrete']
      },
      {
        id: 'zone-pent-deck',
        code: 'D-1',
        name: 'Private Cantilevered Sky Terrace & Plunge Pool',
        type: 'amenity',
        polygonPoints: '530,390 820,390 820,580 530,580',
        center: { x: 675, y: 485 },
        accentColor: '#06b6d4',
        strokeColor: '#22d3ee',
        fillOpacity: 0.3,
        stats: {
          grossFloorArea: '820 sq.ft Outdoor Terrace',
          footprintArea: '820 sq.ft',
          heightOrFloors: 'High-Altitude Open Deck (Level 48)',
          programmaticUse: 'Al Fresco Dining, Heated Hydrotherapy Tub & Fire Lounge',
          occupancyCapacity: '15 Persons',
          structuralSystem: 'Post-Tensioned Cantilevered Balcony Slab',
          energyRating: 'Bio-Ethanol Clean-Burning Fireplaces',
          completionPhase: 'Decking Installed',
          budgetShare: '14% of Interior Budget'
        },
        description: 'An open-air aerial sanctuary perched 180 meters above the city, shielded from high-altitude wind currents by glass screens.',
        renderingImage: img3,
        renderingTitle: 'Sky Terrace & Plunge Pool',
        renderingCaption: 'Laminated glass balustrade creating an uninterrupted view over the illuminated skyline at night.',
        viewpointAngle: 'Terrace Sunset View',
        keyHighlights: [
          'Aerodynamic glass wind deflector tested in wind tunnel simulation',
          'Flush basalt pavers with concealed pedestal drainage systems',
          'Marine-grade 316 stainless steel fixtures throughout'
        ],
        materials: ['Flamed Basalt Pavers', 'Marine-Grade 316 Stainless', 'Teak Outdoor Joinery']
      }
    ];

    return {
      siteName: `${project.title} - Floor & Spatial Zoning Plan`,
      tagline: 'Duplex Penthouse Footprint • 4,820 sq.ft Spatial Master Layout',
      viewBox: '0 0 1000 700',
      northAngle: 60,
      scaleBarMeters: 20,
      totalSiteArea: '4,820 sq.ft Total Floor Area',
      totalBuiltArea: project.area || '4,820 sq.ft GFA',
      greenRatio: '22% Private Terrace Greenery',
      farRatio: 'Single Penthouse Floorplate',
      zones
    };
  }

  // DEFAULT / VILLA / ESTATE / CAMPUS MASTERPLAN
  const zones: SiteZone[] = [
    {
      id: 'zone-villa-main',
      code: 'A-1',
      name: 'Main Glass Residence Pavilion',
      type: 'residential',
      polygonPoints: '240,190 540,190 560,340 380,340 380,390 220,390 220,240',
      center: { x: 380, y: 270 },
      accentColor: '#3b82f6',
      strokeColor: '#60a5fa',
      fillOpacity: 0.25,
      stats: {
        grossFloorArea: '4,800 sq.ft',
        footprintArea: '2,900 sq.ft',
        heightOrFloors: '3 Levels (9.6m Height)',
        programmaticUse: 'Primary Living Quarters, Master Suite & Observation Salon',
        occupancyCapacity: '12-16 Persons',
        structuralSystem: 'Cantilevered Post-Tensioned Slabs & Slim Steel Columns',
        energyRating: 'LEED Platinum / Passive Solar Envelope',
        completionPhase: 'Structural Frame Complete',
        budgetShare: '48% of Civil Works'
      },
      description: 'The core residential pavilion frames floor-to-ceiling panoramic vistas through acoustic triple-glazed curtain walls.',
      renderingImage: img0,
      renderingTitle: 'Main Living Pavilion & Cantilevered Balcony',
      renderingCaption: 'West-facing elevation showcasing frameless thermal glass corners and ultra-slim structural mullions.',
      viewpointAngle: 'Sunset Ocean-Facing Perspective (West)',
      keyHighlights: [
        '6-meter unobstructed cantilever over limestone ledge',
        'Hidden motorized solar louvers recessed into the roof deck',
        'Triple acoustic laminated glass panels with Low-E thermal barrier'
      ],
      materials: ['Honed Travertine', 'Triple-Glazed Low-E Glass', 'Dark Anodized Aluminum', 'Weathering Zinc']
    },
    {
      id: 'zone-villa-pool',
      code: 'A-2',
      name: 'Cantilevered Infinity Pool & Sun Deck',
      type: 'amenity',
      polygonPoints: '560,200 780,200 780,290 560,290',
      center: { x: 670, y: 245 },
      accentColor: '#06b6d4',
      strokeColor: '#22d3ee',
      fillOpacity: 0.35,
      stats: {
        grossFloorArea: '1,450 sq.ft',
        footprintArea: '1,450 sq.ft',
        heightOrFloors: 'Single Level Cantilever Deck',
        programmaticUse: 'Saltwater Infinity Pool, Sunken Fire Pit & Lounging Deck',
        occupancyCapacity: '25 Persons',
        structuralSystem: 'Hydraulic Waterproof Concrete Shell with Post-Tensioned Tiebacks',
        energyRating: 'Geothermal Pool Heat Recovery System',
        completionPhase: 'Finishes & Tiling Phase',
        budgetShare: '16% of Exterior Works'
      },
      description: 'Projecting 4.2 meters outward toward the landscape, the 20-meter infinity pool appears to blend seamlessly with the horizon line.',
      renderingImage: img1,
      renderingTitle: 'Infinity Pool Horizon Perspective',
      renderingCaption: 'Edge detail featuring perimeter overflow troughs lined with dark volcanic basalt stone.',
      viewpointAngle: 'South-West Poolside Perspective',
      keyHighlights: [
        'Perimeter infinity weir with concealed surge tanks',
        'Integrated fiber-optic night lighting under-coping',
        'Sunken conversation pit with flush gas flame hearth'
      ],
      materials: ['Basalt Pool Coping', 'Ipe Hardwood Decking', 'Glass Mosaic Tiles']
    },
    {
      id: 'zone-villa-wellness',
      code: 'B-1',
      name: 'Subterranean Wellness Suite & Wine Vault',
      type: 'amenity',
      polygonPoints: '220,405 450,405 450,540 220,540',
      center: { x: 335, y: 472 },
      accentColor: '#8b5cf6',
      strokeColor: '#a78bfa',
      fillOpacity: 0.25,
      stats: {
        grossFloorArea: '1,850 sq.ft',
        footprintArea: '1,850 sq.ft',
        heightOrFloors: '1 Level Subterranean (-3.4m)',
        programmaticUse: 'Finnish Sauna, Plunge Pools, Tasting Salon & 1,200-Bottle Cellar',
        occupancyCapacity: '15 Persons',
        structuralSystem: 'Reinforced Waterproof Retaining Walls & Green Earth Berm',
        energyRating: 'High Thermal Inertia / Passive Cooling',
        completionPhase: 'MEP Installation',
        budgetShare: '14% of Total Construction'
      },
      description: 'Nestled into the natural rock topography, this serene retreat relies on the earth’s natural geothermal thermal mass for silent, stable cooling.',
      renderingImage: img2,
      renderingTitle: 'Subterranean Spa & Tasting Vault',
      renderingCaption: 'Textured board-formed architectural concrete accented with warm backlight coves and cedar slatted ceilings.',
      viewpointAngle: 'Interior Courtyard Light-Well View',
      keyHighlights: [
        'Natural bedrock exposed as decorative back wall feature',
        'Climatically isolated wine vault maintaining 13°C and 68% humidity',
        'Indirect skylight channel pulling daylight down from courtyard'
      ],
      materials: ['Board-Formed Concrete', 'Aromatic Cedar', 'Nero Marquina Marble']
    },
    {
      id: 'zone-villa-guest',
      code: 'C-1',
      name: 'Guest Pavilion & Creative Studio',
      type: 'residential',
      polygonPoints: '540,360 760,360 760,510 540,510',
      center: { x: 650, y: 435 },
      accentColor: '#10b981',
      strokeColor: '#34d399',
      fillOpacity: 0.25,
      stats: {
        grossFloorArea: '1,350 sq.ft',
        footprintArea: '1,350 sq.ft',
        heightOrFloors: '1 Level Pavilion',
        programmaticUse: 'Self-Sustaining 2-Bedroom Guest Suite & Architectural Studio',
        occupancyCapacity: '6 Persons',
        structuralSystem: 'Light-Gauge Steel Frame with Glulam Roof Beams',
        energyRating: '100% Rooftop Solar PV Coverage',
        completionPhase: 'Substantially Complete',
        budgetShare: '12% of Total Construction'
      },
      description: 'An independent architectural sanctuary for visiting collaborators and guests, connected to the primary estate via a covered timber colonnade.',
      renderingImage: img3,
      renderingTitle: 'Guest Pavilion & Garden Colonnade',
      renderingCaption: 'Minimalist post-and-beam pavilion with operable sliding screens and private bamboo courtyard.',
      viewpointAngle: 'North-East Forest Garden Angle',
      keyHighlights: [
        'Full autonomous kitchenette and private terrace',
        'Extensive native sedum green roof for stormwater retention',
        'Sliding cedar brise-soleil panels for solar modulation'
      ],
      materials: ['Glulam Timber', 'Charred Accoya Siding', 'Precast Concrete Pavers']
    },
    {
      id: 'zone-villa-landscape',
      code: 'D-1',
      name: 'Zen Courtyard & Sculptural Water Garden',
      type: 'landscape',
      polygonPoints: '390,340 535,340 535,395 390,395',
      center: { x: 462, y: 367 },
      accentColor: '#14b8a6',
      strokeColor: '#2dd4bf',
      fillOpacity: 0.35,
      stats: {
        grossFloorArea: '880 sq.ft',
        footprintArea: '880 sq.ft',
        heightOrFloors: 'Open-Air Central Atrium',
        programmaticUse: 'Central Micro-Climate Core, Reflecting Pool & Bonsai Specimen',
        occupancyCapacity: 'Open Space',
        structuralSystem: 'Integrated Drainage Matrix & Stone Retaining Kerbs',
        energyRating: 'Microclimate Evaporative Cooling',
        completionPhase: 'Landscape Rough-In',
        budgetShare: '4% of Site Works'
      },
      description: 'An open-sky architectural void at the center of the floor plan, acting as a contemplative lung providing natural cross-ventilation.',
      renderingImage: img0,
      renderingTitle: 'Central Atrium Zen Void',
      renderingCaption: 'A specimen Japanese black pine set within a mirror-finish black granite reflecting pool.',
      viewpointAngle: 'Internal Hallway Perspective',
      keyHighlights: [
        'Calibrated cross-ventilation channel reduces AC load by 22%',
        'Zero-depth water weir reflecting ambient sky colors',
        'Porous gravel sub-base prevents standing water'
      ],
      materials: ['Polished Black Granite', 'Crushed River Pebble', 'Bonsai Specimens']
    },
    {
      id: 'zone-villa-court',
      code: 'E-1',
      name: 'Arrival Court & Subterranean Auto Gallery',
      type: 'infrastructure',
      polygonPoints: '110,210 210,210 210,480 110,480',
      center: { x: 160, y: 345 },
      accentColor: '#f59e0b',
      strokeColor: '#fbbf24',
      fillOpacity: 0.25,
      stats: {
        grossFloorArea: '2,600 sq.ft',
        footprintArea: '2,600 sq.ft',
        heightOrFloors: 'Grade Arrival + Lower Auto Gallery',
        programmaticUse: 'Vehicular Turntable, 4-Car Climate Bay & EV Superchargers',
        occupancyCapacity: '4 Vehicles',
        structuralSystem: 'Cast-in-Place Concrete Slab with Flush Turntable',
        energyRating: 'Integrated 22kW Bi-Directional EV Charging',
        completionPhase: 'Civil Works Complete',
        budgetShare: '6% of Exterior Works'
      },
      description: 'The arrival threshold pairs monolithic stone privacy gates with a subterranean vehicle showcase gallery and turntable.',
      renderingImage: img1,
      renderingTitle: 'Arrival Gate & Turnaround Plaza',
      renderingCaption: 'Permeable basalt stone grid bordered by horizontal architectural concrete retaining fins.',
      viewpointAngle: 'East Arrival Driveway View',
      keyHighlights: [
        'Hydraulic vehicle turntable for effortless ingress and egress',
        'Heated driveway apron preventing winter frost buildup',
        'Permeable jointing allowing rainwater to recharge the water table'
      ],
      materials: ['Flamed Basalt Cobbles', 'Corten Entry Gates', 'Architectural Board Concrete']
    }
  ];

  return {
    siteName: `${project.title} - Master Site Plan`,
    tagline: 'Coastal Cliffside Topography • 2.4 Hectare Protected Parcel',
    viewBox: '0 0 1000 700',
    northAngle: 45,
    scaleBarMeters: 50,
    totalSiteArea: '2.4 Hectares (5.9 Acres)',
    totalBuiltArea: project.area || '9,450 sq.ft GFA',
    greenRatio: '68% Protected Coastal Flora',
    farRatio: '0.18 Low-Impact Density',
    zones
  };
}
