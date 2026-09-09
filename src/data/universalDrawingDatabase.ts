import { UniversalDrawingTypeRecord } from '../types/cadBimEngineering';

export const UNIVERSAL_DRAWING_DATABASE: UniversalDrawingTypeRecord[] = [
  // ==================== ARCHITECTURAL ====================
  {
    id: 'arch-site-plan',
    discipline: 'ARCHITECTURAL',
    name: 'Site Plan',
    purpose: 'Illustrates the total plot boundary, building footprint, property setbacks, easements, adjacent roads, vehicular access, landscape, and civil tie-in points.',
    standard_scales: ['1:200', '1:500', '1:1000'],
    mandatory_contents: ['True North / Solar Arrow', 'Property Boundary Dimensions & Bearings', 'Municipal Front/Rear/Side Setbacks', 'Finished Ground Level (FGL)', 'Road Widths & Entry Gates', 'Stormwater Discharge Direction'],
    typical_layers: ['A-SITE-PROP', 'A-SITE-BLDG', 'A-SITE-ROAD', 'A-SITE-STBK', 'A-SITE-VEGE', 'A-ANNO-DIMS'],
    key_dimensions: ['Front setback (min 3m-6m)', 'Rear setback', 'Side yard clearances', 'Driveway curb radius (min 4.5m)'],
    standards_references: ['NBC 2016 Part 3 Development Control Rules', 'Local Municipal Master Plan Zoning Bylaws'],
    coordination_checks: ['Verify alignment with Civil Survey Plan boundary coordinates', 'Confirm municipal sewer and water connection invert levels'],
    common_drafting_errors: ['Omitting True North arrow', 'Failing to dimension required fire tender turning radius (min 9m-11m)', 'Discrepancy between architectural footprint and structural column centerlines']
  },
  {
    id: 'arch-floor-plan',
    discipline: 'ARCHITECTURAL',
    name: 'Architectural Floor Plan',
    purpose: 'Core architectural layout showing wall thicknesses, room dimensions, door/window openings, vertical circulation, finished floor levels, and functional spatial flow.',
    standard_scales: ['1:50', '1:100'],
    mandatory_contents: ['Grid Reference Lines (Numbers/Letters)', 'Overall, Center-to-Center, and Wall/Opening Dimension Strings', 'Room Names with Carpet Area (sq.m / sq.ft)', 'Door and Window Tags (D1, W1)', 'Finished Floor Level (FFL / SSL)', 'Section Cut Callout Lines'],
    typical_layers: ['A-WALL-FULL', 'A-WALL-PRTN', 'A-DOOR', 'A-GLAZ', 'A-COLS', 'A-FLOR-LEVL', 'A-ANNO-TEXT'],
    key_dimensions: ['Clear room widths/lengths', 'Wall thickness (230mm/115mm or 9"/4.5")', 'Door clear openings (min 900mm for main, 750mm for toilet)'],
    standards_references: ['NBC 2016 Part 3 Clause 4.2 Minimum Room Sizes', 'IS 962 Code of Architectural & Building Drawings'],
    coordination_checks: ['Ensure structural columns match structural column layout exactly', 'Verify plumbing shafts (ducts) align vertically between floors'],
    common_drafting_errors: ['Missing door swing direction or door swinging into corridor flow', 'Window sill/lintel heights not designated', 'Unclosed wall boundary lines causing hatching failure']
  },
  {
    id: 'arch-furniture-plan',
    discipline: 'ARCHITECTURAL',
    name: 'Furniture & Spatial Plan',
    purpose: 'Demonstrates functional ergonomics, furniture placement, human scale circulation paths, and spatial livability for clients and interior contractors.',
    standard_scales: ['1:50', '1:100'],
    mandatory_contents: ['Accurate-scale furniture blocks (Bed, Sofa, Dining, Wardrobe)', 'Clear circulation paths (min 900mm main, 600mm secondary)', 'Television viewing distances', 'Wardrobe and cabinet door swing clearances'],
    typical_layers: ['A-FURN', 'A-FURN-FIXT', 'A-FLOR-PATH', 'A-ANNO-TEXT'],
    key_dimensions: ['Bedside clearance (min 600mm)', 'Dining chair pull-out depth (min 750mm)', 'Kitchen working counter triangle clearance (min 1050mm)'],
    standards_references: ['Ergonomics in Architecture (Architectural Graphic Standards / Neufert)'],
    coordination_checks: ['Coordinate electrical switchboards and socket outlets with bed headboards and work desks', 'Verify AC indoor unit (IDU) does not blow directly onto bed pillows'],
    common_drafting_errors: ['Using undersized "cheater" furniture blocks to make small rooms look spacious', 'Placing beds directly in front of primary operable windows']
  },
  {
    id: 'arch-dimension-plan',
    discipline: 'ARCHITECTURAL',
    name: 'Dimension & Setting-Out Plan',
    purpose: 'Dedicated construction drawing containing zero graphical clutter, exclusively focused on exact three-tier dimension strings for mason setting out.',
    standard_scales: ['1:50', '1:100'],
    mandatory_contents: ['Exterior 3-tier dimension chains (Overall, Column grid, Openings & Piers)', 'Interior room-by-room clear dimension strings', 'Wall thickness callouts', 'Diagonal squaring dimensions for non-orthogonal rooms'],
    typical_layers: ['A-WALL-CORE', 'A-GRID', 'A-ANNO-DIMS-EXT', 'A-ANNO-DIMS-INT'],
    key_dimensions: ['Every masonry pier width (min 200mm beside door frames)', 'Wall offset from structural grid lines'],
    standards_references: ['IS 962:1989 Architectural and Building Drawings'],
    coordination_checks: ['Ensure cumulative dimension string equals the total overall boundary dimension exactly (no rounding gap)'],
    common_drafting_errors: ['Dimension strings overlapping text labels', 'Missing masonry return distance at room corners', 'Using non-associative exploding dimension lines']
  },
  {
    id: 'arch-ceiling-plan',
    discipline: 'ARCHITECTURAL',
    name: 'Reflected Ceiling Plan (RCP)',
    purpose: 'Mirrored ceiling view detailing false ceiling levels, gypsum drops, cove lighting, AC diffusers, sprinkler heads, and ceiling fixture locations.',
    standard_scales: ['1:50', '1:100'],
    mandatory_contents: ['Ceiling level datum tags (+2700mm, +2400mm FFL)', 'Gypsum board / modular tile grid boundaries', 'Recessed downlight, strip cove, and chandelier centers', 'AC supply and return air diffusers', 'Access trapdoor panels (min 450x450mm)'],
    typical_layers: ['A-CLNG-GRID', 'A-CLNG-LEVL', 'E-LITE-CLNG', 'M-HVAC-DIFF', 'F-FIRE-SPRN'],
    key_dimensions: ['Cove depth (100mm-150mm)', 'Drop height from structural slab', 'Downlight spacing pitch (typically 1.2m - 1.8m c/c)'],
    standards_references: ['IS 2441 Ceiling Suspended Construction Practices'],
    coordination_checks: ['Check HVAC duct drop clearance above false ceiling level', 'Ensure sprinkler heads do not align directly behind ceiling baffles'],
    common_drafting_errors: ['Confusing plan view with reflected view (reversing left/right orientation)', 'Forgetting to provide access hatches for concealed AC fan coil units (FCU)']
  },
  {
    id: 'arch-elevation',
    discipline: 'ARCHITECTURAL',
    name: 'Building Elevation',
    purpose: 'Orthographic vertical view of building exterior showing architectural massing, facade materials, floor levels, fenestration patterns, and parapet treatments.',
    standard_scales: ['1:50', '1:100'],
    mandatory_contents: ['Ground Line (GL), Plinth Level, Finished Floor Levels for each story', 'Parapet Top and Machine Room Heights', 'Material cladding notations (Stone, HPL, Paint, Glazing, Louvers)', 'Rainwater downpipe (RWDP) chases', 'Sunshade (Chajja) projections'],
    typical_layers: ['A-ELEV-LINE-HEAVY', 'A-ELEV-LINE-MED', 'A-ELEV-PATT', 'A-ELEV-TEXT', 'A-FLOR-LEVL'],
    key_dimensions: ['Floor-to-floor height (typically 3000mm - 3600mm)', 'Window sill and lintel heights', 'Parapet safety height (min 1050mm)'],
    standards_references: ['NBC 2016 Part 3 Parapet and Handrail Safety Requirements'],
    coordination_checks: ['Verify window and door positions align exactly with floor plan cuts', 'Confirm structural beam depths are completely concealed behind facade lintels'],
    common_drafting_errors: ['Flat monotonous line weight without depth hierarchy (foreground must be bold, background light)', 'Missing floor level datum markers']
  },
  {
    id: 'arch-section',
    discipline: 'ARCHITECTURAL',
    name: 'Building Section',
    purpose: 'Vertical cut through the building revealing interior floor-to-ceiling heights, slab thicknesses, staircase riser/tread geometry, foundation depth, and roof waterproofing buildup.',
    standard_scales: ['1:50', '1:100'],
    mandatory_contents: ['Cut line designation matching Floor Plan indicator', 'Staircase profile with riser count and tread dimensions', 'Full architectural build-up notes (Tiles + Screed + RCC Slab + Plaster)', 'Clear headroom below beams and stair flights (min 2100mm)', 'Waterproofing details at sunken slabs and terraces'],
    typical_layers: ['A-SECT-CUT', 'A-SECT-ELEV', 'A-SECT-HATCH', 'A-SECT-LEVL', 'A-ANNO-TEXT'],
    key_dimensions: ['Clear floor height', 'Plinth height above road level (min 450mm)', 'Staircase headroom (min 2100mm)', 'Sunken toilet slab depth (typically 300mm-350mm)'],
    standards_references: ['IS 962:1989 Sectional Conventions', 'NBC 2016 Part 4 Fire and Life Safety Exit Staircases'],
    coordination_checks: ['Confirm beam drop depths match structural beam schedule', 'Check plumbing drain pipe slope space inside sunken slab'],
    common_drafting_errors: ['Drawing staircase landings without required structural support beams', 'Failing to show earth backfilling and anti-termite barrier under ground floor slab']
  },
  {
    id: 'arch-door-window-schedule',
    discipline: 'ARCHITECTURAL',
    name: 'Door & Window Schedule',
    purpose: 'Comprehensive tabular catalog and elevation diagrams of all doors, windows, and ventilators specifying dimensions, frame materials, glazing specs, and hardware.',
    standard_scales: ['1:20', '1:25', '1:50'],
    mandatory_contents: ['Mark / Tag (D1, D2, W1, V1)', 'Width x Height overall nominal dimension', 'Sill and Lintel heights', 'Frame material (Teak, Sal, Aluminium 6063-T6, UPVC)', 'Glazing specification (e.g., 6mm toughened DGU with Low-E coating)', 'Hardware schedule (Hinges, Mortise lock, Tower bolts, Door closers)'],
    typical_layers: ['A-DOOR-SCHD', 'A-GLAZ-SCHD', 'A-ANNO-TABL'],
    key_dimensions: ['Frame section profile (e.g. 100mm x 65mm or 4" x 2.5")', 'Clear opening daylight width'],
    standards_references: ['IS 4021 Timber Door & Window Frames', 'IS 1081 Fixing & Glazing of Metal Doors & Windows'],
    coordination_checks: ['Verify total counted quantities match floor plan tags precisely', 'Check that masonry rough opening (MO) allows 10mm installation tolerance around frame'],
    common_drafting_errors: ['Listing door dimensions as frame outer size instead of clear masonry opening', 'Forgetting to specify fire rating for emergency fire escape doors (min 2 hours)']
  },

  // ==================== STRUCTURAL ====================
  {
    id: 'struct-foundation-layout',
    discipline: 'STRUCTURAL',
    name: 'Foundation & Footing Layout',
    purpose: 'Directs site excavation and setting out for isolated, combined, or raft footings, retaining walls, plinth beams, and column starter stub bars.',
    standard_scales: ['1:50', '1:100'],
    mandatory_contents: ['Grid lines tied to permanent site benchmark', 'Footing marks (F1, F2, CF1, Mat)', 'Centerline offsets from grid', 'Foundation depth below Natural Ground Level (NGL)', 'Safe Bearing Capacity (SBC) noted on drawing in kN/sq.m', 'Plain Cement Concrete (PCC 1:4:8) offset (typically 75mm-100mm)'],
    typical_layers: ['S-GRID', 'S-FTNG-CONC', 'S-FTNG-PCC', 'S-COLS', 'S-ANNO-DIMS'],
    key_dimensions: ['Footing length, width, and total depth (D)', 'Pedestal size and stub bar protrusion length (50 x rebar diameter)'],
    standards_references: ['IS 456:2000 Plain and Reinforced Concrete', 'IS 1904 Structural Safety of Foundations'],
    coordination_checks: ['Check footings do not cross property boundary lines unless designed as eccentric/strap footings', 'Coordinate sewer line depth to ensure drains do not pierce footings'],
    common_drafting_errors: ['Missing clear cover specification (typically 50mm for footing cast against earth with PCC)', 'Ignoring overlapping stress bulbs in closely spaced footings']
  },
  {
    id: 'struct-column-layout',
    discipline: 'STRUCTURAL',
    name: 'Column Layout & Schedule',
    purpose: 'Specifies the exact spatial location, orientation, concrete grade, longitudinal rebar count, and shear link spacing for all vertical structural members.',
    standard_scales: ['1:50', '1:100'],
    mandatory_contents: ['Grid intersections with dual dimensional coordinates', 'Column sizes (e.g., 230x450mm, 300x600mm)', 'Longitudinal rebar (e.g., 8-T20 Fe500D)', 'Confining lateral ties / stirrups spacing (e.g., 8mm @ 100mm c/c at ends, 150mm mid-height per IS 13920)', 'Concrete grade (M25, M30, M40) per floor level'],
    typical_layers: ['S-GRID', 'S-COLS', 'S-REBAR', 'S-ANNO-TEXT', 'S-ANNO-DIMS'],
    key_dimensions: ['Clear cover (min 40mm)', 'Lap length (typically 50d to 55d for Fe500D)', 'Confinement zone height (min 450mm or hc)'],
    standards_references: ['IS 13920:2016 Ductile Design and Detailing of Reinforced Concrete Structures', 'IS 456:2000 Clause 26.5.3'],
    coordination_checks: ['Verify column orientation does not project into architectural room door paths or bedroom wardrobe recesses', 'Check column sizes align with upper-floor setbacks'],
    common_drafting_errors: ['Lapping 100% of rebar at the same horizontal plane (must stagger laps by 50%)', 'Missing cross ties in columns with more than 4 longitudinal bars']
  },
  {
    id: 'struct-beam-layout',
    discipline: 'STRUCTURAL',
    name: 'Beam Layout & Framing Plan',
    purpose: 'Defines the structural floor skeleton, beam marks (PB, FB), cross-sectional depths/widths, drop locations, and slab support edges for each floor level.',
    standard_scales: ['1:50', '1:100'],
    mandatory_contents: ['Beam mark labels (e.g. B101 - 230x450mm)', 'Grid reference lines', 'Slab span direction arrows (One-way / Two-way)', 'Slab depth callout (e.g., 125mm thk M25 slab)', 'Slab opening and cutout boundaries for shafts/stairs'],
    typical_layers: ['S-BEAM-CONC', 'S-BEAM-HIDD', 'S-SLAB-EDGE', 'S-GRID', 'S-ANNO-TEXT'],
    key_dimensions: ['Beam width and overall depth', 'Bottom elevation relative to finished floor level'],
    standards_references: ['IS 456:2000 Clause 26.5.1 Beam Detailing', 'IS 13920:2016 Clause 6 Ductile Beams'],
    coordination_checks: ['Verify beam bottom clearance above door/window frames', 'Check MEP duct and pipe penetration holes through beam webs'],
    common_drafting_errors: ['Missing beam drops in sunken bathroom areas', 'Drawing secondary beams deeper than the primary girder supporting them']
  },
  {
    id: 'struct-bbs',
    discipline: 'STRUCTURAL',
    name: 'Bar Bending Schedule (BBS)',
    purpose: 'Tabular cut-and-bend instruction sheet for steel fixers, detailing bar marks, diameters, cutting lengths, bending shapes, and total tonnage per grade.',
    standard_scales: ['Not to Scale (Tabular Data)'],
    mandatory_contents: ['Member Identifier (Footing, Column, Beam, Slab)', 'Bar Mark Number', 'Bar Diameter (8, 10, 12, 16, 20, 25, 32 mm)', 'Cut-Length formula accounting for bend deductions (1d for 45°, 2d for 90°, 3d for 135°)', 'Total Quantity of Bars', 'Total Weight in Kilograms (D^2 / 162.28 kg/m)'],
    typical_layers: ['S-REBAR-SCHD', 'S-ANNO-TABL'],
    key_dimensions: ['Hook lengths (10d for 135° seismic stirrup hook)', 'Development length (Ld)'],
    standards_references: ['IS 2502:1963 Code of Practice for Bending and Fixing of Bars for Concrete Reinforcement', 'SP 34:1987 Handbook on Concrete Reinforcement and Detailing'],
    coordination_checks: ['Ensure total steel weight tallies with BOQ budget allocation (+3% rolling and wastage margin)'],
    common_drafting_errors: ['Failing to subtract bend elongation deduction, leading to over-length steel that does not fit within formwork', 'Using 90° hooks instead of 135° hooks for seismic column ties']
  },

  // ==================== MEP ====================
  {
    id: 'mep-electrical-layout',
    discipline: 'MEP',
    name: 'Electrical Lighting & Power Layout',
    purpose: 'Specifies the layout of lighting fixtures, convenience sockets, power points for heavy appliances, switchboards, conduit paths, and distribution boards.',
    standard_scales: ['1:50', '1:100'],
    mandatory_contents: ['Standard electrical legend symbols (Single pole switch, 6A/16A socket, Ceiling fan, Exhaust)', 'Switchboard heights (typically 1200mm AFF) and socket heights (450mm AFF)', 'Conduit homerun circuits tagged to Distribution Board (DB) with circuit numbers (e.g. R1, Y1, B1)', 'Phase balancing allocations (3-Phase 415V / 1-Phase 230V)'],
    typical_layers: ['E-LITE-FIXT', 'E-POWR-SOCK', 'E-CIRC-HMRN', 'E-SWBD', 'E-ANNO-TEXT'],
    key_dimensions: ['Switchboard offset from door frame (min 150mm)', 'Kitchen countertop socket height (min 150mm above counter)'],
    standards_references: ['IS 732 Code of Practice for Electrical Wiring Installations', 'National Electrical Code (NEC) India 2023'],
    coordination_checks: ['Verify switchboards are located on the strike-side of door swings, never behind opening doors', 'Ensure high-power sockets are provided for geysers, ACs, and induction hobs'],
    common_drafting_errors: ['Placing electrical outlets inside the splash zone of bathroom sinks or showers (< 600mm from water source)', 'Overloading single circuits beyond 800 Watts or 10 points']
  },
  {
    id: 'mep-plumbing-layout',
    discipline: 'MEP',
    name: 'Water Supply & Sanitary Drainage Layout',
    purpose: 'Guides the installation of potable hot/cold water supply pipes, soil and waste drainage pipes, vent stacks, inspection chambers, and intercepting traps.',
    standard_scales: ['1:50', '1:100'],
    mandatory_contents: ['Cold Water (CPVC/PPR) and Hot Water lines differentiated by line type/color', 'Soil Waste Pipes (110mm PVC) and Wastewater Pipes (75mm PVC)', 'Slope arrows for horizontal drainage (min 1:50 for 75mm, 1:100 for 110mm)', 'Inspection Chambers (IC), Gully Traps (GT), and Manholes at changes of direction', 'Overhead Tank (OHT) and Underground Sump (UGT) capacities and booster pump sets'],
    typical_layers: ['P-WATR-COLD', 'P-WATR-HOT', 'P-SANR-SOIL', 'P-SANR-WAST', 'P-SANR-VENT', 'P-FIXT'],
    key_dimensions: ['Pipe diameters in mm or inches', 'Invert levels of drainage chambers'],
    standards_references: ['IS 1742 Code of Practice for Building Drainage', 'Uniform Plumbing Code (UPC) India'],
    coordination_checks: ['Ensure plumbing stacks align with dedicated vertical utility shafts without crossing structural columns or beams', 'Check drainage invert levels connect by gravity to municipal sewer main'],
    common_drafting_errors: ['Connecting toilet soil pipe (WC) into wastewater gully trap without P-trap (causing sewer gas odor)', 'Omitting vertical vent stacks causing trap water siphonage']
  },
  {
    id: 'mep-hvac-duct-layout',
    discipline: 'MEP',
    name: 'HVAC Duct & Equipment Layout',
    purpose: 'Coordinates supply air, return air, and fresh air duct routing, volume control dampers, sound attenuators, and FCU/AHU placements.',
    standard_scales: ['1:50', '1:100'],
    mandatory_contents: ['Duct cross-sectional sizes in Width x Depth (e.g. 400x250mm)', 'Airflow volume in CFM (Cubic Feet per Minute) or CMH', 'Air velocities (max 1200 FPM in main, 800 FPM in branch for noise control)', 'Fire dampers at 2-hour compartment wall penetrations', 'Condensate drain pipe routes with gravity slope'],
    typical_layers: ['M-HVAC-SUPP', 'M-HVAC-RETN', 'M-HVAC-DAMP', 'M-HVAC-EQUP', 'M-ANNO-TEXT'],
    key_dimensions: ['Duct bottom of duct (BOD) elevation AFF', 'Diffuser neck and face sizes'],
    standards_references: ['ISHRAE / ASHRAE 62.1 Ventilation for Acceptable Indoor Air Quality', 'SMACNA HVAC Duct Construction Standards'],
    coordination_checks: ['Clash check with structural concrete drop beams', 'Verify ceiling access panel exists directly beneath motorized fire dampers and filter access'],
    common_drafting_errors: ['Duct aspect ratios exceeding 4:1 causing high friction losses and whistling noise', 'Omitting acoustic lining near AHU discharge']
  },

  // ==================== CIVIL ====================
  {
    id: 'civil-survey-plan',
    discipline: 'CIVIL',
    name: 'Topographic Survey & Contour Plan',
    purpose: 'Maps existing site ground elevations, natural slopes, benchmarks, boundary fences, mature trees, rock outcrops, and municipal utilities.',
    standard_scales: ['1:200', '1:500', '1:1000'],
    mandatory_contents: ['Contour lines with elevation labels (typically 0.5m or 1.0m interval)', 'Total Station point numbers and spot levels', 'Permanent Benchmark (TBM / GTS) description and exact RL (Reduced Level)', 'North arrow and geo-referenced coordinates (WGS84 / UTM / State Plane)', 'Overhead electrical power lines and utility poles'],
    typical_layers: ['C-TOPO-MAJR', 'C-TOPO-MINR', 'C-TOPO-SPOT', 'C-BNDY', 'C-TREE', 'C-ANNO-TEXT'],
    key_dimensions: ['Spot level elevations to 3 decimal places', 'Tree girth diameter and canopy spread radius'],
    standards_references: ['IS 3952 Code of Practice for Topographical Surveys', 'Survey of India Mapping Conventions'],
    coordination_checks: ['Check that architectural site plan matches survey perimeter dimensions and angles exactly'],
    common_drafting_errors: ['Assuming site is flat without a contour survey, resulting in unexpected excavation cost overruns', 'Misinterpreting assumed local datum as Mean Sea Level (MSL)']
  },
  {
    id: 'civil-road-profile',
    discipline: 'CIVIL',
    name: 'Road Alignment Plan & Profile',
    purpose: 'Details horizontal curves, vertical parabolic crest/sag curves, sight distances, road crossfalls, and storm ditch inverts for road infrastructure.',
    standard_scales: ['Horizontal 1:1000 / Vertical 1:100 (Exaggerated 10x)'],
    mandatory_contents: ['Chainage stations (e.g. Ch 0+000, 0+020, 0+040)', 'Existing ground profile line vs Proposed finished road crown profile line', 'Gradient percentages (+1.5%, -2.0%)', 'Vertical Curve Data: PVI, K-value, Length of vertical curve (Lvc)', 'Superelevation and camber cross-fall (typically 2.5% for asphalt)'],
    typical_layers: ['C-ROAD-CNTR', 'C-ROAD-EDGE', 'C-PROF-EXGD', 'C-PROF-PROP', 'C-ANNO-STTN'],
    key_dimensions: ['Carriageway width (3.75m per lane)', 'Shoulder width (1.5m-2.5m)', 'Stopping Sight Distance (SSD)'],
    standards_references: ['IRC:73 Geometric Design of Roads', 'AASHTO A Policy on Geometric Design of Highways and Streets'],
    coordination_checks: ['Verify culvert crossings do not choke stormwater runoff', 'Ensure road entrance gradient does not scrape vehicle undercarriages (max 10-12% slope)'],
    common_drafting_errors: ['Creating sag vertical curves in cut sections without adequate longitudinal drainage ditch slope', 'Violating minimum vertical curve length K-values']
  },

  // ==================== MECHANICAL ====================
  {
    id: 'mech-manufacturing-drawing',
    discipline: 'MECHANICAL',
    name: 'Machined Part / Manufacturing Drawing',
    purpose: 'Complete production drawing with orthographic first/third angle projections, section views, surface finish Ra symbols, and Geometric Dimensioning & Tolerancing (GD&T).',
    standard_scales: ['1:1', '2:1', '1:2', '1:5'],
    mandatory_contents: ['Title Block with Material Spec (e.g. Mild Steel AISI 1018, SS 304, Al 6061-T6)', 'Geometric Dimensioning and Tolerancing (GD&T feature control frames for Flatness, Perpendicularity, Position, Runout)', 'Surface Roughness Ra callouts (e.g., Ra 0.8, Ra 3.2)', 'General Tolerances (ISO 2768-mK)', 'Heat treatment / plating specifications (e.g. Case harden 0.5mm, Zinc Plate 10µm)'],
    typical_layers: ['M-PART-GEOM', 'M-PART-HIDD', 'M-PART-CNTR', 'M-PART-DIMS', 'M-PART-GDT'],
    key_dimensions: ['Critical shaft/bore fits (e.g. Ø25 H7/g6)', 'Chamfer sizes and fillet radii'],
    standards_references: ['ASME Y14.5-2018 Geometric Dimensioning and Tolerancing', 'ISO 1101 Geometrical product specifications'],
    coordination_checks: ['Verify fits and clearances with mating components in master assembly', 'Ensure internal corners have tool cutter radii (never sharp zero-radius inside corners)'],
    common_drafting_errors: ['Double-dimensioning closed loops creating tolerance conflicts', 'Missing datum reference frame letters on GD&T callouts']
  },
  {
    id: 'mech-sheet-metal-drawing',
    discipline: 'MECHANICAL',
    name: 'Sheet Metal Fabrication & Flat Pattern Drawing',
    purpose: 'Directs sheet shearing, laser/plasma cutting, press brake bending, punching, and welding, containing both formed 3D views and unbent 2D flat patterns with bend lines.',
    standard_scales: ['1:1', '1:2', '1:5'],
    mandatory_contents: ['Flat Pattern perimeter with CNC cutting profile', 'Bend Lines with direction (UP 90° R=2.0, DOWN 45° R=1.5)', 'Material gauge and nominal sheet thickness (e.g., 2.0mm Mild Steel IS 2062)', 'K-Factor or Bend Deduction Table applied', 'Corner relief cuts (Round/Rectangular) to prevent tearing at bend intersections', 'Hardware PEM nut and stud locations'],
    typical_layers: ['M-SHMT-FLAT', 'M-SHMT-BEND', 'M-SHMT-CUTS', 'M-ANNO-TEXT'],
    key_dimensions: ['Flange lengths (inside or outside dimension indicated)', 'Minimum distance from hole edge to bend line (min 2.5t + R)'],
    standards_references: ['DIN 6935 Cold Bending of Flat Rolled Steel', 'IS 2062 / ASTM A36 Sheet Metal Standards'],
    coordination_checks: ['Ensure bend reliefs prevent adjacent flange collision on press brake tooling', 'Check that hole diameters equal or exceed sheet thickness to avoid punch breakage'],
    common_drafting_errors: ['Placing punched holes too close to bend lines, resulting in distorted oval holes after bending', 'Specifying zero bend radius which causes sheet cracking']
  },

  // ==================== INTERIOR ====================
  {
    id: 'int-joinery-wardrobe',
    discipline: 'INTERIOR',
    name: 'Interior Millwork & Wardrobe Drawing',
    purpose: 'Fabrication and assembly drawing for custom modular wardrobes, TV consoles, and kitchen cabinets, detailing carcass materials, shutters, internal divisions, and hardware.',
    standard_scales: ['1:20', '1:25'],
    mandatory_contents: ['Front Elevation with shutter dimensions and gap reveals (typically 2-3mm)', 'Internal Section showing hanging rods, drawers, shelves, and shoe racks', 'Carcass core material (18mm BWR/BWP Plywood, MDF, or Particle Board)', 'Edge banding specification (2mm PVC hot-melt edge band)', 'Hardware specs (Soft-close concealed European hinges, full-extension drawer slides, handles)'],
    typical_layers: ['I-JOIN-CARC', 'I-JOIN-SHTR', 'I-JOIN-HDWR', 'I-ANNO-DIMS'],
    key_dimensions: ['Wardrobe internal depth (min 600mm for coat hangers, 450mm for folded clothes)', 'Long coat hanging clear height (min 1400mm)', 'Drawer height (150mm - 250mm)'],
    standards_references: ['IS 710 Marine Grade Plywood', 'IS 303 Moisture Resistant Plywood Standards'],
    coordination_checks: ['Ensure wardrobe shutters do not collide with ceiling downlights, AC grilles, or bedroom doors', 'Verify electric supply point exists for internal LED sensor wardrobe lights'],
    common_drafting_errors: ['Drawing shelves wider than 900mm without intermediate vertical dividers, leading to sagging under book/clothes weight', 'Missing skirting base plinth (typically 75mm-100mm) causing door shutters to drag on carpets']
  },
  {
    id: 'int-false-ceiling-detail',
    discipline: 'INTERIOR',
    name: 'Interior False Ceiling & Lighting Drawing',
    purpose: 'Execution drawing detailing gypsum board suspension framing, decorative acoustic wooden baffles, cove profiles, and lighting fixture coordinates.',
    standard_scales: ['1:25', '1:50'],
    mandatory_contents: ['Ceiling grid setting out dimensions from main entrance walls', 'Section details of perimeter shadow gap / reveals (15x15mm)', 'Cove lighting channel section with LED driver access', 'Suspension framework pitch (Main channels @ 900mm c/c, Ceiling sections @ 450mm c/c)', 'Fixture schedule indicating luminaire model, wattage, beam angle, and correlated color temperature (CCT 3000K / 4000K)'],
    typical_layers: ['I-CLNG-GYPS', 'I-CLNG-FRAM', 'I-LITE-FIXT', 'I-ANNO-DIMS'],
    key_dimensions: ['Shadow line reveal gap (12mm-20mm)', 'Cove lip height (50mm-75mm) to prevent direct LED diode glare'],
    standards_references: ['IS 2095 Gypsum Plaster Boards', 'NBC 2016 Interior Acoustic and Lighting Norms'],
    coordination_checks: ['Verify heavy chandeliers and ceiling fans are anchored directly to RCC structural slab with threaded rod, never supported by gypsum boards alone'],
    common_drafting_errors: ['Placing downlights directly above ceiling fan blades, causing a sickening strobe flickering shadow effect', 'Omitting acoustic sealant at perimeter joints']
  }
];
