/**
 * Authentic SVG Technical Diagrams & Engineering Illustrations
 * Used for zero-latency, razor-sharp technical visuals and as guaranteed topic-aware fallbacks.
 * Each diagram uses real engineering linework, dimension lines, and architectural styling.
 */

export function getTopicFallbackSvg(topicType: string, title?: string): string {
  const norm = (topicType + ' ' + (title || '')).toLowerCase();

  // 1. BEAM (RCC / Steel I-Beam)
  if (norm.includes('beam') || norm.includes('girder') || norm.includes('lintel')) {
    return `
      <svg viewBox="0 0 600 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
        <defs>
          <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0F172A"/>
            <stop offset="100%" stop-color="#1E293B"/>
          </linearGradient>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" stroke-width="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="600" height="400" fill="url(#beamGrad)"/>
        <rect width="600" height="400" fill="url(#grid)"/>
        
        <!-- RCC Beam Cross-Section -->
        <g transform="translate(60, 40)">
          <!-- Concrete Outer Boundary (300 x 450) scaled -->
          <rect x="0" y="0" width="180" height="270" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5" rx="3"/>
          <!-- Stirrup (Ties) -->
          <rect x="18" y="18" width="144" height="234" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4,2" rx="6"/>
          <!-- 135 deg Hooks -->
          <path d="M 18 35 L 35 18 M 162 35 L 145 18" stroke="#f59e0b" stroke-width="2"/>
          
          <!-- Top Rebars (Hanger Bars: 2-T12) -->
          <circle cx="30" cy="30" r="7" fill="#ef4444" stroke="#ffffff" stroke-width="1.5"/>
          <circle cx="150" cy="30" r="7" fill="#ef4444" stroke="#ffffff" stroke-width="1.5"/>
          
          <!-- Bottom Main Tension Bars (3-T20) -->
          <circle cx="30" cy="240" r="10" fill="#ef4444" stroke="#ffffff" stroke-width="1.5"/>
          <circle cx="90" cy="240" r="10" fill="#ef4444" stroke="#ffffff" stroke-width="1.5"/>
          <circle cx="150" cy="240" r="10" fill="#ef4444" stroke="#ffffff" stroke-width="1.5"/>
          
          <!-- Concrete Hatching Lines -->
          <path d="M 40 80 L 60 70 M 120 120 L 140 110 M 70 180 L 85 170" stroke="#64748b" stroke-width="1.5"/>
          <circle cx="70" cy="110" r="3" fill="#64748b"/>
          <circle cx="110" cy="150" r="4" fill="#64748b"/>
          
          <!-- Dimensions -->
          <line x1="0" y1="285" x2="180" y2="285" stroke="#94a3b8" stroke-width="1"/>
          <path d="M 0 280 L 0 290 M 180 280 L 180 290" stroke="#94a3b8" stroke-width="1.5"/>
          <text x="90" y="300" fill="#94a3b8" font-size="11" font-family="monospace" text-anchor="middle">WIDTH: 300mm</text>
          
          <line x1="-15" y1="0" x2="-15" y2="270" stroke="#94a3b8" stroke-width="1"/>
          <path d="M -20 0 L -10 0 M -20 270 L -10 270" stroke="#94a3b8" stroke-width="1.5"/>
          <text x="-25" y="140" fill="#94a3b8" font-size="11" font-family="monospace" text-anchor="middle" transform="rotate(-90 -25 140)">DEPTH: 450mm</text>
        </g>
        
        <!-- Longitudinal Elevation & Bending Moment -->
        <g transform="translate(300, 70)">
          <!-- Beam Span -->
          <rect x="0" y="40" width="240" height="50" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
          <!-- Supports (Triangles) -->
          <polygon points="10,90 25,120 -5,120" fill="#64748b" stroke="#94a3b8" stroke-width="1.5"/>
          <polygon points="230,90 245,120 215,120" fill="#64748b" stroke="#94a3b8" stroke-width="1.5"/>
          <!-- Ground hash -->
          <line x1="-15" y1="120" x2="35" y2="120" stroke="#64748b" stroke-width="2"/>
          <line x1="205" y1="120" x2="255" y2="120" stroke="#64748b" stroke-width="2"/>
          
          <!-- UDL Load Arrows -->
          <path d="M 20 15 L 20 38 M 60 15 L 60 38 M 100 15 L 100 38 M 140 15 L 140 38 M 180 15 L 180 38 M 220 15 L 220 38" stroke="#ef4444" stroke-width="1.5"/>
          <polygon points="20,38 17,30 23,30" fill="#ef4444"/>
          <polygon points="120,38 117,30 123,30" fill="#ef4444"/>
          <polygon points="220,38 217,30 223,30" fill="#ef4444"/>
          <line x1="15" y1="15" x2="225" y2="15" stroke="#ef4444" stroke-width="1.5"/>
          <text x="120" y="8" fill="#ef4444" font-size="11" font-family="monospace" text-anchor="middle">DESIGN LOAD (w kN/m)</text>
          
          <!-- Bending Moment Parabola -->
          <path d="M 10 170 Q 120 240 230 170" fill="none" stroke="#10b981" stroke-width="2.5" stroke-dasharray="3,2"/>
          <text x="120" y="210" fill="#10b981" font-size="11" font-family="monospace" text-anchor="middle">M_max = wL²/8</text>
          <text x="120" y="260" fill="#38bdf8" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">RCC FLEXURAL BEAM DETAIL</text>
        </g>
      </svg>
    `;
  }

  // 2. COLUMN (Rebar Cage, Ties, Compression)
  if (norm.includes('column') || norm.includes('pillar') || norm.includes('pier')) {
    return `
      <svg viewBox="0 0 600 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="400" fill="#090D1A"/>
        <!-- Column Cross Section -->
        <g transform="translate(80, 60)">
          <!-- Square Concrete Section 220x220 -->
          <rect x="0" y="0" width="200" height="200" fill="#1E293B" stroke="#06B6D4" stroke-width="3" rx="4"/>
          <!-- Lateral Tie (Hoop) with 135 deg seismic hook -->
          <rect x="22" y="22" width="156" height="156" fill="none" stroke="#F59E0B" stroke-width="2.5" rx="10"/>
          <path d="M 22 45 L 50 22 M 178 45 L 150 22 M 22 155 L 50 178 M 178 155 L 150 178" stroke="#F59E0B" stroke-width="2"/>
          
          <!-- 8 Longitudinal Main Reinforcement Bars -->
          <circle cx="32" cy="32" r="9" fill="#EF4444" stroke="#FFF" stroke-width="1.5"/>
          <circle cx="100" cy="32" r="9" fill="#EF4444" stroke="#FFF" stroke-width="1.5"/>
          <circle cx="168" cy="32" r="9" fill="#EF4444" stroke="#FFF" stroke-width="1.5"/>
          <circle cx="32" cy="100" r="9" fill="#EF4444" stroke="#FFF" stroke-width="1.5"/>
          <circle cx="168" cy="100" r="9" fill="#EF4444" stroke="#FFF" stroke-width="1.5"/>
          <circle cx="32" cy="168" r="9" fill="#EF4444" stroke="#FFF" stroke-width="1.5"/>
          <circle cx="100" cy="168" r="9" fill="#EF4444" stroke="#FFF" stroke-width="1.5"/>
          <circle cx="168" cy="168" r="9" fill="#EF4444" stroke="#FFF" stroke-width="1.5"/>
          
          <text x="100" y="240" fill="#94A3B8" font-size="12" font-family="monospace" text-anchor="middle">400mm x 400mm (8-T20 Fe500D)</text>
        </g>
        
        <!-- Column Elevation with Tie Spacing -->
        <g transform="translate(360, 40)">
          <rect x="30" y="0" width="80" height="300" fill="#1E293B" stroke="#06B6D4" stroke-width="2"/>
          <!-- Closely spaced ties in confinement zone (L0) -->
          <line x1="30" y1="20" x2="110" y2="20" stroke="#F59E0B" stroke-width="1.5"/>
          <line x1="30" y1="35" x2="110" y2="35" stroke="#F59E0B" stroke-width="1.5"/>
          <line x1="30" y1="50" x2="110" y2="50" stroke="#F59E0B" stroke-width="1.5"/>
          <line x1="30" y1="65" x2="110" y2="65" stroke="#F59E0B" stroke-width="1.5"/>
          
          <!-- Normal spacing middle zone -->
          <line x1="30" y1="100" x2="110" y2="100" stroke="#F59E0B" stroke-width="1.5"/>
          <line x1="30" y1="140" x2="110" y2="140" stroke="#F59E0B" stroke-width="1.5"/>
          <line x1="30" y1="180" x2="110" y2="180" stroke="#F59E0B" stroke-width="1.5"/>
          
          <!-- Bottom confinement zone -->
          <line x1="30" y1="235" x2="110" y2="235" stroke="#F59E0B" stroke-width="1.5"/>
          <line x1="30" y1="250" x2="110" y2="250" stroke="#F59E0B" stroke-width="1.5"/>
          <line x1="30" y1="265" x2="110" y2="265" stroke="#F59E0B" stroke-width="1.5"/>
          <line x1="30" y1="280" x2="110" y2="280" stroke="#F59E0B" stroke-width="1.5"/>
          
          <text x="130" y="45" fill="#F59E0B" font-size="10" font-family="monospace">@ 100mm c/c (L0)</text>
          <text x="130" y="145" fill="#94A3B8" font-size="10" font-family="monospace">@ 200mm c/c</text>
          <text x="130" y="260" fill="#F59E0B" font-size="10" font-family="monospace">@ 100mm c/c (L0)</text>
          <text x="70" y="340" fill="#38BDF8" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">DUCTILE SEISMIC DETAILING</text>
        </g>
      </svg>
    `;
  }

  // 3. FOUNDATION / FOOTING / SOIL
  if (norm.includes('foundation') || norm.includes('footing') || norm.includes('soil') || norm.includes('raft') || norm.includes('pile')) {
    return `
      <svg viewBox="0 0 600 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="400" fill="#0C1322"/>
        <g transform="translate(100, 50)">
          <!-- Ground Line -->
          <line x1="-40" y1="40" x2="440" y2="40" stroke="#10B981" stroke-width="2.5"/>
          <text x="430" y="32" fill="#10B981" font-size="11" font-family="monospace" text-anchor="end">GL (GROUND LEVEL 0.00)</text>
          
          <!-- Column Stem -->
          <rect x="160" y="40" width="80" height="110" fill="#1E293B" stroke="#38BDF8" stroke-width="2"/>
          
          <!-- Trapezoidal / Stepped Footing Base -->
          <polygon points="160,150 240,150 320,210 320,250 80,250 80,210" fill="#1E293B" stroke="#38BDF8" stroke-width="2.5"/>
          
          <!-- PCC Blinding Bed (100mm) -->
          <rect x="60" y="250" width="280" height="25" fill="#334155" stroke="#64748B" stroke-width="1.5"/>
          <text x="200" y="267" fill="#CBD5E1" font-size="10" font-family="monospace" text-anchor="middle">PCC 1:4:8 M10 (100mm)</text>
          
          <!-- Foundation Rebar Mesh (Bidirectional) -->
          <line x1="95" y1="238" x2="305" y2="238" stroke="#EF4444" stroke-width="3"/>
          <circle cx="115" cy="238" r="4" fill="#F59E0B"/>
          <circle cx="145" cy="238" r="4" fill="#F59E0B"/>
          <circle cx="175" cy="238" r="4" fill="#F59E0B"/>
          <circle cx="200" cy="238" r="4" fill="#F59E0B"/>
          <circle cx="225" cy="238" r="4" fill="#F59E0B"/>
          <circle cx="255" cy="238" r="4" fill="#F59E0B"/>
          <circle cx="285" cy="238" r="4" fill="#F59E0B"/>
          
          <!-- Dowel L-Bends (Development Length Ld) -->
          <path d="M 175 60 L 175 235 L 125 235 M 225 60 L 225 235 L 275 235" fill="none" stroke="#EF4444" stroke-width="2.5"/>
          
          <!-- Soil Pressure Arrows upward -->
          <g stroke="#10B981" stroke-width="1.5" fill="#10B981">
            <line x1="90" y1="310" x2="90" y2="285"/><polygon points="90,285 86,292 94,292"/>
            <line x1="145" y1="310" x2="145" y2="285"/><polygon points="145,285 141,292 149,292"/>
            <line x1="200" y1="310" x2="200" y2="285"/><polygon points="200,285 196,292 204,292"/>
            <line x1="255" y1="310" x2="255" y2="285"/><polygon points="255,285 251,292 259,292"/>
            <line x1="310" y1="310" x2="310" y2="285"/><polygon points="310,285 306,292 314,292"/>
          </g>
          <text x="200" y="330" fill="#10B981" font-size="11" font-family="monospace" text-anchor="middle">SAFE BEARING CAPACITY (SBC: 200 kN/m²)</text>
        </g>
      </svg>
    `;
  }

  // 4. SHEET METAL & PRESS BRAKE BENDING / GAUGES
  if (norm.includes('sheet') || norm.includes('plate') || norm.includes('gauge') || norm.includes('press brake') || norm.includes('bending')) {
    return `
      <svg viewBox="0 0 600 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="400" fill="#0B1120"/>
        <!-- Sheet Metal 90-degree V-Bend Geometry -->
        <g transform="translate(100, 60)">
          <!-- Upper Punch -->
          <polygon points="160,0 200,0 183,100 177,100" fill="#3B82F6" stroke="#93C5FD" stroke-width="2"/>
          <text x="180" y="-10" fill="#93C5FD" font-size="11" font-family="monospace" text-anchor="middle">CNC PRESS PUNCH (R=1.5mm)</text>
          
          <!-- Bent Sheet Metal Section (t=2.0mm) -->
          <path d="M 40 105 L 160 105 A 20 20 0 0 1 190 135 L 190 240" fill="none" stroke="#F59E0B" stroke-width="12" stroke-linecap="round"/>
          
          <!-- Neutral Axis (Dashed Centerline) -->
          <path d="M 40 105 L 160 105 A 16 16 0 0 1 184 135 L 184 240" fill="none" stroke="#EF4444" stroke-width="1.5" stroke-dasharray="4,2"/>
          
          <!-- Lower V-Die Block -->
          <polygon points="120,130 180,180 240,130 270,130 270,260 90,260 90,130" fill="#1E293B" stroke="#64748B" stroke-width="2"/>
          <text x="180" y="225" fill="#94A3B8" font-size="11" font-family="monospace" text-anchor="middle">V-DIE OPENING (8x t)</text>
          
          <!-- K-Factor & Bend Allowance Label -->
          <g transform="translate(260, 40)">
            <rect x="0" y="0" width="180" height="100" fill="#1E293B" stroke="#F59E0B" stroke-width="1.5" rx="8"/>
            <text x="15" y="25" fill="#F59E0B" font-size="11" font-family="sans-serif" font-weight="bold">SHEET METAL PARAMS</text>
            <text x="15" y="45" fill="#CBD5E1" font-size="10" font-family="monospace">• Thickness (t): 16G (1.5mm)</text>
            <text x="15" y="65" fill="#CBD5E1" font-size="10" font-family="monospace">• K-Factor: k = 0.44</text>
            <text x="15" y="85" fill="#10B981" font-size="10" font-family="monospace">• BA = π(R + K·t)(A/180)</text>
          </g>
        </g>
      </svg>
    `;
  }

  // 5. STRUCTURAL SECTIONS: RHS / SHS / CHS / I-BEAM / CHANNEL / ANGLE
  if (norm.includes('rhs') || norm.includes('shs') || norm.includes('chs') || norm.includes('section') || norm.includes('channel') || norm.includes('angle') || norm.includes('h beam') || norm.includes('pipe')) {
    return `
      <svg viewBox="0 0 600 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="400" fill="#0A0F1D"/>
        <!-- Multi-Section Structural Steel Palette -->
        <!-- 1. I-Beam / Universal Column -->
        <g transform="translate(60, 70)">
          <path d="M 0 0 L 110 0 L 110 18 L 63 18 L 63 142 L 110 142 L 110 160 L 0 160 L 0 142 L 47 142 L 47 18 L 0 18 Z" fill="#1E293B" stroke="#38BDF8" stroke-width="2"/>
          <text x="55" y="190" fill="#38BDF8" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">ISMB / UB BEAM</text>
          <text x="55" y="205" fill="#94A3B8" font-size="10" font-family="monospace" text-anchor="middle">Flange & Web</text>
        </g>
        
        <!-- 2. RHS / SHS (Rectangular & Square Hollow Section) -->
        <g transform="translate(220, 70)">
          <rect x="0" y="0" width="110" height="160" fill="#1E293B" stroke="#10B981" stroke-width="2" rx="12"/>
          <rect x="14" y="14" width="82" height="132" fill="#0A0F1D" stroke="#10B981" stroke-width="1.5" rx="6"/>
          <text x="55" y="190" fill="#10B981" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">RHS / SHS</text>
          <text x="55" y="205" fill="#94A3B8" font-size="10" font-family="monospace" text-anchor="middle">IS 4923 HSS Tube</text>
        </g>
        
        <!-- 3. CHS / Pipe (Circular Hollow Section) -->
        <g transform="translate(380, 70)">
          <circle cx="80" cy="80" r="75" fill="#1E293B" stroke="#F59E0B" stroke-width="2"/>
          <circle cx="80" cy="80" r="62" fill="#0A0F1D" stroke="#F59E0B" stroke-width="1.5"/>
          <text x="80" y="190" fill="#F59E0B" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">CHS PIPE</text>
          <text x="80" y="205" fill="#94A3B8" font-size="10" font-family="monospace" text-anchor="middle">Torsional Efficiency</text>
        </g>
        
        <!-- 4. Angle / Channel Bottom Strip -->
        <g transform="translate(100, 260)">
          <!-- Equal Angle ISA -->
          <path d="M 0 0 L 16 0 L 16 70 L 80 70 L 80 86 L 0 86 Z" fill="#1E293B" stroke="#A855F7" stroke-width="2"/>
          <text x="40" y="105" fill="#A855F7" font-size="11" font-family="sans-serif" font-weight="bold" text-anchor="middle">EQUAL ANGLE (ISA)</text>
          
          <!-- Channel ISMC -->
          <g transform="translate(180, 0)">
            <path d="M 0 0 L 70 0 L 70 16 L 18 16 L 18 70 L 70 70 L 70 86 L 0 86 Z" fill="#1E293B" stroke="#EC4899" stroke-width="2"/>
            <text x="40" y="105" fill="#EC4899" font-size="11" font-family="sans-serif" font-weight="bold" text-anchor="middle">CHANNEL (ISMC)</text>
          </g>
          
          <!-- T-Section -->
          <g transform="translate(320, 0)">
            <path d="M 0 0 L 80 0 L 80 16 L 48 16 L 48 86 L 32 86 L 32 16 L 0 16 Z" fill="#1E293B" stroke="#3B82F6" stroke-width="2"/>
            <text x="40" y="105" fill="#3B82F6" font-size="11" font-family="sans-serif" font-weight="bold" text-anchor="middle">TEE SECTION</text>
          </g>
        </g>
      </svg>
    `;
  }

  // 6. WELDING / WELD DEFECT / POROSITY / CRACK
  if (norm.includes('weld') || norm.includes('porosity') || norm.includes('undercut') || norm.includes('fusion') || norm.includes('defect') || norm.includes('slag') || norm.includes('penetration')) {
    return `
      <svg viewBox="0 0 600 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="400" fill="#100F17"/>
        <g transform="translate(100, 80)">
          <!-- Base Plates (Tee Joint) -->
          <!-- Vertical Plate -->
          <rect x="180" y="10" width="30" height="140" fill="#1E293B" stroke="#64748B" stroke-width="2"/>
          <!-- Horizontal Base Plate -->
          <rect x="20" y="150" width="360" height="30" fill="#1E293B" stroke="#64748B" stroke-width="2"/>
          
          <!-- Fillet Weld Bead (Right Side - Normal) -->
          <path d="M 210 150 L 255 150 Q 240 120 210 105 Z" fill="#F59E0B" opacity="0.85" stroke="#FDE68A" stroke-width="2"/>
          <text x="260" y="125" fill="#10B981" font-size="10" font-family="monospace">Sound Throat (a)</text>
          
          <!-- Fillet Weld Bead (Left Side - Defective with Porosity & Undercut) -->
          <path d="M 180 150 L 135 150 Q 155 125 180 110 Z" fill="#EF4444" opacity="0.8" stroke="#FCA5A5" stroke-width="2"/>
          
          <!-- Gas Pores (Porosity Bubbles) -->
          <circle cx="165" cy="138" r="4.5" fill="#000000" stroke="#EF4444" stroke-width="1.5"/>
          <circle cx="155" cy="143" r="3" fill="#000000" stroke="#EF4444" stroke-width="1.5"/>
          <circle cx="170" cy="146" r="3.5" fill="#000000" stroke="#EF4444" stroke-width="1.5"/>
          <circle cx="160" cy="130" r="2.5" fill="#000000" stroke="#EF4444" stroke-width="1.5"/>
          
          <!-- Undercut Notch Groove -->
          <path d="M 178 108 Q 174 114 180 118" stroke="#F87171" stroke-width="3" fill="none"/>
          
          <!-- Heat Affected Zone (HAZ) Dashed Boundary -->
          <path d="M 180 95 Q 115 110 115 150" fill="none" stroke="#F97316" stroke-dasharray="3,3" stroke-width="1.5"/>
          
          <!-- Annotations -->
          <line x1="165" y1="138" x2="90" y2="70" stroke="#EF4444" stroke-width="1.5"/>
          <circle cx="90" cy="70" r="3" fill="#EF4444"/>
          <text x="80" y="55" fill="#EF4444" font-size="11" font-family="monospace" text-anchor="end">WELD POROSITY (GAS TRAP)</text>
          
          <line x1="178" y1="110" x2="110" y2="30" stroke="#F87171" stroke-width="1.5"/>
          <text x="100" y="25" fill="#F87171" font-size="11" font-family="monospace" text-anchor="end">UNDERCUT GROOVE (STRESS RISER)</text>
          
          <text x="200" y="230" fill="#CBD5E1" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">FILLET WELD METALLURGY & DEFECT PROFILE</text>
        </g>
      </svg>
    `;
  }

  // 7. CORROSION / RUST / PITTING / SURFACE TREATMENT
  if (norm.includes('rust') || norm.includes('corrosion') || norm.includes('pitting') || norm.includes('galvan') || norm.includes('coating') || norm.includes('paint') || norm.includes('anodiz')) {
    return `
      <svg viewBox="0 0 600 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="400" fill="#140E0A"/>
        <g transform="translate(80, 70)">
          <!-- Unprotected Steel Substrate -->
          <rect x="20" y="100" width="400" height="110" fill="#292524" stroke="#78716C" stroke-width="2"/>
          <text x="220" y="160" fill="#A8A29E" font-size="13" font-family="monospace" text-anchor="middle">CARBON STEEL SUBSTRATE (Fe)</text>
          
          <!-- Zinc Galvanized Layer (Left Half - Protected) -->
          <rect x="20" y="80" width="200" height="20" fill="#38BDF8" opacity="0.8" stroke="#BAE6FD" stroke-width="1.5"/>
          <text x="120" y="70" fill="#38BDF8" font-size="10" font-family="monospace" text-anchor="middle">ZINC COATING (ASTM A123)</text>
          
          <!-- Corroded Rust Pit (Right Half - Oxidation & Section Loss) -->
          <path d="M 220 100 Q 240 100 250 115 Q 265 140 280 145 Q 295 140 310 110 Q 330 100 420 100" fill="#7C2D12" stroke="#EA580C" stroke-width="2.5"/>
          <circle cx="280" cy="130" r="6" fill="#451A03"/>
          <circle cx="265" cy="120" r="4" fill="#451A03"/>
          
          <!-- Flaking Rust Crust (Fe2O3·nH2O) -->
          <path d="M 240 85 Q 270 70 310 88 Q 350 72 380 92 Q 410 75 420 90" fill="none" stroke="#F97316" stroke-width="5" stroke-linecap="round"/>
          <text x="330" y="55" fill="#F97316" font-size="11" font-family="monospace" text-anchor="middle">EXPANDED RUST SCALE</text>
          
          <!-- Loss Measurement Arrows -->
          <line x1="280" y1="100" x2="280" y2="145" stroke="#EF4444" stroke-width="2"/>
          <polygon points="280,100 276,108 284,108" fill="#EF4444"/>
          <polygon points="280,145 276,137 284,137" fill="#EF4444"/>
          <text x="345" y="130" fill="#EF4444" font-size="10" font-family="monospace">SECTION LOSS Δt</text>
          
          <text x="220" y="250" fill="#FDBA74" font-size="13" font-family="sans-serif" font-weight="bold" text-anchor="middle">GALVANIC COATING VS LOCALIZED PITTING CORROSION</text>
        </g>
      </svg>
    `;
  }

  // 8. ALUMINIUM & PROFILES
  if (norm.includes('alumin') || norm.includes('extru') || norm.includes('mullion') || norm.includes('curtain wall')) {
    return `
      <svg viewBox="0 0 600 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="400" fill="#0C1527"/>
        <g transform="translate(140, 60)">
          <!-- Architectural Aluminium Extruded Window Mullion Profile -->
          <path d="M 50 0 L 170 0 L 170 35 L 140 35 L 140 180 L 170 180 L 170 215 L 50 215 L 50 180 L 80 180 L 80 35 L 50 35 Z" fill="#1E293B" stroke="#38BDF8" stroke-width="2.5"/>
          <!-- Thermal Break Polyamide Strip -->
          <rect x="90" y="85" width="40" height="45" fill="#0284C7" stroke="#38BDF8" stroke-width="1.5" rx="3"/>
          <text x="110" y="112" fill="#FFFFFF" font-size="9" font-family="monospace" text-anchor="middle">THERMAL BREAK</text>
          
          <!-- Screw Flutes -->
          <circle cx="110" cy="18" r="6" fill="#0C1527" stroke="#38BDF8" stroke-width="1.5"/>
          <circle cx="110" cy="197" r="6" fill="#0C1527" stroke="#38BDF8" stroke-width="1.5"/>
          
          <!-- Glass Panes Glazing Pocket -->
          <rect x="-10" y="60" width="55" height="18" fill="#10B981" opacity="0.7"/>
          <text x="15" y="52" fill="#10B981" font-size="9" font-family="monospace">DGU GLASS</text>
          
          <!-- Anodizing specs badge -->
          <g transform="translate(210, 40)">
            <rect x="0" y="0" width="180" height="130" fill="#1E293B" stroke="#38BDF8" stroke-width="1.5" rx="8"/>
            <text x="15" y="25" fill="#38BDF8" font-size="11" font-family="sans-serif" font-weight="bold">6063-T6 ALUMINIUM</text>
            <text x="15" y="50" fill="#CBD5E1" font-size="10" font-family="monospace">• Extruded Mullion</text>
            <text x="15" y="70" fill="#CBD5E1" font-size="10" font-family="monospace">• 25 Micron Anodized</text>
            <text x="15" y="90" fill="#CBD5E1" font-size="10" font-family="monospace">• E = 70 GPa (Lightweight)</text>
            <text x="15" y="110" fill="#10B981" font-size="10" font-family="monospace">• Density: 2700 kg/m³</text>
          </g>
          
          <text x="110" y="250" fill="#E2E8F0" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">THERMALLY BROKEN ALUMINIUM PROFILE</text>
        </g>
      </svg>
    `;
  }

  // 9. AUTOCAD / CAD / 2D DRAFTING / BLUEPRINT
  if (norm.includes('cad') || norm.includes('autocad') || norm.includes('civil 3d') || norm.includes('drawing') || norm.includes('draft') || norm.includes('blueprint') || norm.includes('xref')) {
    return `
      <svg viewBox="0 0 600 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="400" fill="#001B3A"/>
        <!-- Blueprint Grid -->
        <defs>
          <pattern id="cadGrid" width="25" height="25" patternUnits="userSpaceOnUse">
            <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#003B73" stroke-width="0.75"/>
          </pattern>
        </defs>
        <rect width="600" height="400" fill="url(#cadGrid)"/>
        
        <!-- Drafting Entities -->
        <g transform="translate(60, 40)">
          <!-- Border Line & Title Block -->
          <rect x="0" y="0" width="480" height="320" fill="none" stroke="#00FFFF" stroke-width="2"/>
          <rect x="280" y="240" width="200" height="80" fill="#002244" stroke="#00FFFF" stroke-width="1.5"/>
          <text x="290" y="260" fill="#00FFFF" font-size="11" font-family="monospace" font-weight="bold">FIZA FIYAT CAD STUDIO</text>
          <text x="290" y="280" fill="#E2E8F0" font-size="9" font-family="monospace">SCALE: 1:100 | LAYER: A-WALL</text>
          <text x="290" y="300" fill="#FDE047" font-size="9" font-family="monospace">STATUS: GFC WORKING DRAWING</text>
          
          <!-- Architectural Linework -->
          <!-- Exterior Walls -->
          <rect x="30" y="30" width="220" height="180" fill="none" stroke="#FFFFFF" stroke-width="3"/>
          <rect x="42" y="42" width="196" height="156" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>
          <!-- Door Opening & Swing Arc -->
          <line x1="80" y1="210" x2="130" y2="210" stroke="#001B3A" stroke-width="5"/>
          <line x1="80" y1="210" x2="80" y2="160" stroke="#00FFFF" stroke-width="2"/>
          <path d="M 80 160 A 50 50 0 0 1 130 210" fill="none" stroke="#00FFFF" stroke-width="1.5" stroke-dasharray="3,2"/>
          
          <!-- Column Marker Grids -->
          <circle cx="30" cy="30" r="10" fill="#FF0055" stroke="#FFFFFF" stroke-width="1.5"/>
          <text x="30" y="34" fill="#FFF" font-size="10" font-family="monospace" font-weight="bold" text-anchor="middle">A1</text>
          
          <circle cx="250" cy="30" r="10" fill="#FF0055" stroke="#FFFFFF" stroke-width="1.5"/>
          <text x="250" y="34" fill="#FFF" font-size="10" font-family="monospace" font-weight="bold" text-anchor="middle">A2</text>
          
          <!-- Dimensions String -->
          <line x1="30" y1="15" x2="250" y2="15" stroke="#00FFFF" stroke-width="1.5"/>
          <path d="M 26 11 L 34 19 M 246 11 L 254 19" stroke="#00FFFF" stroke-width="2"/>
          <text x="140" y="10" fill="#00FFFF" font-size="10" font-family="monospace" text-anchor="middle">5500 mm</text>
        </g>
      </svg>
    `;
  }

  // 10. REVIT / BIM / 3DS MAX / 3D VISUALIZATION
  if (norm.includes('revit') || norm.includes('bim') || norm.includes('3ds max') || norm.includes('sketchup') || norm.includes('lumion') || norm.includes('blender') || norm.includes('enscape') || norm.includes('twinmotion') || norm.includes('tekla') || norm.includes('navisworks')) {
    return `
      <svg viewBox="0 0 600 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="400" fill="#080F1E"/>
        <g transform="translate(120, 50)">
          <!-- 3D Parametric Wireframe Isometric Building -->
          <!-- Ground Base -->
          <polygon points="180,240 320,180 180,120 40,180" fill="#1E293B" stroke="#475569" stroke-width="1.5"/>
          
          <!-- Extruded Prism Core -->
          <polygon points="40,180 180,240 180,80 40,20" fill="#0F172A" opacity="0.8" stroke="#6366F1" stroke-width="2"/>
          <polygon points="180,240 320,180 320,20 180,80" fill="#1E1B4B" opacity="0.85" stroke="#818CF8" stroke-width="2"/>
          <polygon points="40,20 180,80 320,20 180,-40" fill="#312E81" opacity="0.9" stroke="#A5B4FC" stroke-width="2"/>
          
          <!-- BIM Curtain Wall Mullion Grids -->
          <line x1="40" y1="100" x2="180" y2="160" stroke="#38BDF8" stroke-width="1.5"/>
          <line x1="180" y1="160" x2="320" y2="100" stroke="#38BDF8" stroke-width="1.5"/>
          
          <line x1="90" y1="50" x2="90" y2="200" stroke="#38BDF8" stroke-width="1"/>
          <line x1="140" y1="65" x2="140" y2="220" stroke="#38BDF8" stroke-width="1"/>
          <line x1="230" y1="65" x2="230" y2="220" stroke="#38BDF8" stroke-width="1"/>
          <line x1="280" y1="50" x2="280" y2="200" stroke="#38BDF8" stroke-width="1"/>
          
          <!-- BIM Level Markers -->
          <g transform="translate(-50, 0)">
            <line x1="0" y1="20" x2="80" y2="20" stroke="#F59E0B" stroke-dasharray="3,2" stroke-width="1.5"/>
            <polygon points="0,20 -15,14 -15,26" fill="#F59E0B"/>
            <text x="-20" y="24" fill="#F59E0B" font-size="10" font-family="monospace" text-anchor="end">L3 ROOF (+7.20m)</text>
            
            <line x1="0" y1="100" x2="80" y2="100" stroke="#F59E0B" stroke-dasharray="3,2" stroke-width="1.5"/>
            <polygon points="0,100 -15,94 -15,106" fill="#F59E0B"/>
            <text x="-20" y="104" fill="#F59E0B" font-size="10" font-family="monospace" text-anchor="end">L2 FLOOR (+3.60m)</text>
          </g>
          
          <text x="180" y="280" fill="#C7D2FE" font-size="13" font-family="sans-serif" font-weight="bold" text-anchor="middle">PARAMETRIC BIM COORDINATION (LOD 350)</text>
        </g>
      </svg>
    `;
  }

  // 11. MEP (Electrical, Plumbing, HVAC, Fire Safety)
  if (norm.includes('mep') || norm.includes('electric') || norm.includes('plumb') || norm.includes('hvac') || norm.includes('fire') || norm.includes('drain')) {
    return `
      <svg viewBox="0 0 600 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="400" fill="#0A1118"/>
        <!-- MEP Coordinated System Matrix -->
        <g transform="translate(80, 50)">
          <!-- HVAC Duct (Blue Double-line with Airflow Arrow) -->
          <rect x="0" y="40" width="440" height="50" fill="#1E293B" stroke="#06B6D4" stroke-width="2.5"/>
          <line x1="0" y1="65" x2="440" y2="65" stroke="#06B6D4" stroke-width="1" stroke-dasharray="6,4"/>
          <!-- Diffuser Takeoff -->
          <polygon points="200,90 240,90 260,130 180,130" fill="#0E7490" stroke="#06B6D4" stroke-width="2"/>
          <text x="220" y="118" fill="#FFF" font-size="10" font-family="monospace" text-anchor="middle">SUPPLY AIR DIFFUSER</text>
          
          <!-- Plumbing Water Supply & Drainage Pipe (Green & Brown) -->
          <!-- Domestic Cold Water (Green) -->
          <path d="M 40 180 L 160 180 L 160 270 L 400 270" fill="none" stroke="#10B981" stroke-width="5" stroke-linecap="round"/>
          <text x="90" y="170" fill="#10B981" font-size="10" font-family="monospace">POTABLE WATER (CW 25mm)</text>
          
          <!-- Electrical Cable Tray & Conduit (Orange Zigzag) -->
          <path d="M 20 220 L 440 220" fill="none" stroke="#F59E0B" stroke-width="4" stroke-dasharray="10,5"/>
          <circle cx="200" cy="220" r="10" fill="#B45309" stroke="#FDE68A" stroke-width="2"/>
          <text x="200" y="245" fill="#F59E0B" font-size="10" font-family="monospace" text-anchor="middle">JUNCTION BOX (A-ELEC)</text>
          
          <!-- Fire Sprinkler Line (Red) -->
          <line x1="0" y1="10" x2="440" y2="10" stroke="#EF4444" stroke-width="3"/>
          <circle cx="100" cy="10" r="5" fill="#EF4444"/>
          <circle cx="340" cy="10" r="5" fill="#EF4444"/>
          <text x="220" y="6" fill="#EF4444" font-size="10" font-family="monospace" text-anchor="middle">FIRE SPRINKLER MAIN (NFPA 13)</text>
          
          <text x="220" y="310" fill="#94A3B8" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">MEP CLASH-FREE COORDINATION BLUEPRINT</text>
        </g>
      </svg>
    `;
  }

  // 12. FASTENERS & CONNECTIONS (HSFG Bolts, Nuts, Washers, Anchors, Rivets)
  if (norm.includes('bolt') || norm.includes('nut') || norm.includes('washer') || norm.includes('fastener') || norm.includes('anchor') || norm.includes('rivet') || norm.includes('screw') || norm.includes('threaded') || norm.includes('hsfg')) {
    return `
      <svg viewBox="0 0 600 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="400" fill="#0A0F1D"/>
        <!-- Structural Bolted Lap / Flange Joint Detail -->
        <g transform="translate(90, 60)">
          <!-- Top Connecting Plate (t=16mm) -->
          <rect x="20" y="70" width="280" height="30" fill="#1E293B" stroke="#38BDF8" stroke-width="2"/>
          <!-- Bottom Connecting Plate (t=16mm) -->
          <rect x="60" y="100" width="280" height="30" fill="#1E293B" stroke="#38BDF8" stroke-width="2"/>
          
          <!-- HSFG Bolt (Grade 8.8 / 10.9) Section -->
          <!-- Hex Head -->
          <polygon points="120,40 180,40 170,70 130,70" fill="#475569" stroke="#94A3B8" stroke-width="2"/>
          <text x="150" y="30" fill="#FDE047" font-size="10" font-family="monospace" text-anchor="middle">GRADE 10.9 HEAD</text>
          
          <!-- Hardened Plain Washer (Top) -->
          <rect x="115" y="66" width="70" height="6" fill="#64748B" stroke="#CBD5E1" stroke-width="1.5"/>
          
          <!-- Bolt Shank (d=20mm M20) -->
          <rect x="135" y="70" width="30" height="60" fill="#334155" stroke="#94A3B8" stroke-width="1.5"/>
          <!-- Threaded Section -->
          <g stroke="#94A3B8" stroke-width="1">
            <line x1="135" y1="130" x2="165" y2="133"/>
            <line x1="135" y1="138" x2="165" y2="141"/>
            <line x1="135" y1="146" x2="165" y2="149"/>
            <line x1="135" y1="154" x2="165" y2="157"/>
            <line x1="135" y1="162" x2="165" y2="165"/>
            <line x1="135" y1="170" x2="165" y2="173"/>
          </g>
          
          <!-- Hardened Washer (Bottom) -->
          <rect x="115" y="130" width="70" height="6" fill="#64748B" stroke="#CBD5E1" stroke-width="1.5"/>
          
          <!-- Heavy Hex Nut -->
          <polygon points="125,136 175,136 185,166 115,166" fill="#475569" stroke="#94A3B8" stroke-width="2"/>
          <!-- Protruding Bolt Tip (min 2 threads) -->
          <rect x="138" y="166" width="24" height="18" fill="#334155" stroke="#94A3B8" stroke-width="1.5"/>
          
          <!-- Friction-Grip Clamping Force Arrows -->
          <g stroke="#10B981" stroke-width="2" fill="#10B981">
            <line x1="110" y1="50" x2="110" y2="85"/><polygon points="110,85 106,77 114,77"/>
            <line x1="190" y1="50" x2="190" y2="85"/><polygon points="190,85 186,77 194,77"/>
            <line x1="110" y1="185" x2="110" y2="150"/><polygon points="110,150 106,158 114,158"/>
            <line x1="190" y1="185" x2="190" y2="150"/><polygon points="190,150 186,158 194,158"/>
          </g>
          <text x="75" y="125" fill="#10B981" font-size="10" font-family="monospace">Preload T_0</text>
          
          <!-- Fastener Engineering Callout Box -->
          <g transform="translate(230, 20)">
            <rect x="0" y="0" width="180" height="150" fill="#1E293B" stroke="#38BDF8" stroke-width="1.5" rx="6"/>
            <text x="12" y="24" fill="#38BDF8" font-size="11" font-family="sans-serif" font-weight="bold">HSFG M20 SPECIFICATION</text>
            <text x="12" y="46" fill="#CBD5E1" font-size="9.5" font-family="monospace">• Standard: IS 3757 / ASTM F3125</text>
            <text x="12" y="66" fill="#CBD5E1" font-size="9.5" font-family="monospace">• Proof Load: 147 kN</text>
            <text x="12" y="86" fill="#CBD5E1" font-size="9.5" font-family="monospace">• Torque: 450-550 N·m</text>
            <text x="12" y="106" fill="#CBD5E1" font-size="9.5" font-family="monospace">• Slip Factor (μ): 0.50 (Sa 2.5)</text>
            <text x="12" y="126" fill="#10B981" font-size="9.5" font-family="monospace">• Type: Friction Grip (No Shear)</text>
          </g>
          
          <text x="180" y="225" fill="#93C5FD" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">HSFG PRELOADED BOLTED CONNECTION</text>
        </g>
      </svg>
    `;
  }

  // 13. BASE PLATE & FOUNDATION CONNECTIONS
  if (norm.includes('base plate') || norm.includes('grout') || norm.includes('holding down') || norm.includes('anchor rod')) {
    return `
      <svg viewBox="0 0 600 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="400" fill="#0A101D"/>
        <g transform="translate(100, 40)">
          <!-- Steel Column Stem (UC / ISMB) -->
          <rect x="150" y="10" width="60" height="120" fill="#1E293B" stroke="#38BDF8" stroke-width="2"/>
          <line x1="180" y1="10" x2="180" y2="130" stroke="#38BDF8" stroke-width="1.5"/>
          
          <!-- Gusset Stiffeners -->
          <polygon points="150,50 110,130 150,130" fill="#334155" stroke="#38BDF8" stroke-width="1.5"/>
          <polygon points="210,50 250,130 210,130" fill="#334155" stroke="#38BDF8" stroke-width="1.5"/>
          
          <!-- Steel Base Plate (t=25-32mm) -->
          <rect x="70" y="130" width="220" height="22" fill="#475569" stroke="#E2E8F0" stroke-width="2" rx="2"/>
          <text x="295" y="145" fill="#E2E8F0" font-size="10" font-family="monospace">BASE PLATE 28mm</text>
          
          <!-- Non-Shrink High-Strength Grout Bed (30-50mm) -->
          <rect x="60" y="152" width="240" height="25" fill="#334155" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="4,2"/>
          <text x="305" y="168" fill="#F59E0B" font-size="10" font-family="monospace">NON-SHRINK GROUT (60 MPa)</text>
          
          <!-- RCC Pedestal Foundation -->
          <rect x="40" y="177" width="280" height="110" fill="#1E293B" stroke="#64748B" stroke-width="2"/>
          <text x="180" y="270" fill="#94A3B8" font-size="11" font-family="monospace" text-anchor="middle">CONCRETE PEDESTAL (M35)</text>
          
          <!-- Cast-in Anchor Rods with Hook/Plate Embedment -->
          <!-- Left Anchor -->
          <rect x="85" y="105" width="10" height="150" fill="#94A3B8" stroke="#F87171" stroke-width="1.5"/>
          <path d="M 90 255 L 70 255" stroke="#F87171" stroke-width="5" stroke-linecap="round"/>
          <circle cx="90" cy="115" r="7" fill="#F59E0B"/>
          <!-- Right Anchor -->
          <rect x="265" y="105" width="10" height="150" fill="#94A3B8" stroke="#F87171" stroke-width="1.5"/>
          <path d="M 270 255 L 290 255" stroke="#F87171" stroke-width="5" stroke-linecap="round"/>
          <circle cx="270" cy="115" r="7" fill="#F59E0B"/>
          
          <text x="180" y="315" fill="#38BDF8" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">STRUCTURAL BASE PLATE & ANCHOR ROD DETAIL</text>
        </g>
      </svg>
    `;
  }

  // 14. FABRICATION (Laser Cutting, Press Brake, CNC Machining, Drilling, Rolling)
  if (norm.includes('cutting') || norm.includes('laser') || norm.includes('plasma') || norm.includes('drill') || norm.includes('punch') || norm.includes('machin') || norm.includes('roll') || norm.includes('fabricat')) {
    return `
      <svg viewBox="0 0 600 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="400" fill="#0A0F1E"/>
        <g transform="translate(90, 60)">
          <!-- CNC Fiber Laser Cutting Head & Kerf Section -->
          <polygon points="120,20 160,20 145,90 135,90" fill="#3B82F6" stroke="#60A5FA" stroke-width="2"/>
          <rect x="135" y="90" width="10" height="15" fill="#93C5FD"/>
          <text x="140" y="12" fill="#93C5FD" font-size="10" font-family="monospace" text-anchor="middle">FIBER LASER NOZZLE (1.5mm)</text>
          
          <!-- Focused Laser Beam -->
          <line x1="140" y1="105" x2="140" y2="135" stroke="#EF4444" stroke-width="2.5"/>
          <circle cx="140" cy="135" r="4" fill="#FDE047"/>
          
          <!-- Steel Plate being cut -->
          <rect x="20" y="135" width="118" height="30" fill="#1E293B" stroke="#94A3B8" stroke-width="2"/>
          <rect x="142" y="135" width="160" height="30" fill="#1E293B" stroke="#94A3B8" stroke-width="2"/>
          <line x1="140" y1="135" x2="140" y2="165" stroke="#F59E0B" stroke-width="3" stroke-dasharray="2,2"/>
          
          <!-- Assist Gas Stream & Molten Ejection Sparks -->
          <path d="M 137 165 L 125 210 M 140 165 L 140 220 M 143 165 L 155 210" stroke="#F59E0B" stroke-width="1.5"/>
          <text x="140" y="235" fill="#F59E0B" font-size="9" font-family="monospace" text-anchor="middle">N2 / O2 EJECTION</text>
          
          <!-- Technical Specs Card -->
          <g transform="translate(230, 20)">
            <rect x="0" y="0" width="180" height="150" fill="#1E293B" stroke="#3B82F6" stroke-width="1.5" rx="6"/>
            <text x="12" y="24" fill="#60A5FA" font-size="11" font-family="sans-serif" font-weight="bold">CNC FABRICATION PARAMS</text>
            <text x="12" y="46" fill="#CBD5E1" font-size="9.5" font-family="monospace">• Kerf Width: 0.25 - 0.40mm</text>
            <text x="12" y="66" fill="#CBD5E1" font-size="9.5" font-family="monospace">• Cut Speed: 1.8 - 4.5 m/min</text>
            <text x="12" y="86" fill="#CBD5E1" font-size="9.5" font-family="monospace">• Tolerance: ±0.15 mm</text>
            <text x="12" y="106" fill="#CBD5E1" font-size="9.5" font-family="monospace">• Assist Gas: High-Purity N2</text>
            <text x="12" y="126" fill="#10B981" font-size="9.5" font-family="monospace">• HAZ Band: &lt; 0.15mm</text>
          </g>
          
          <text x="180" y="260" fill="#93C5FD" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">PRECISION CNC METAL FABRICATION PROCESS</text>
        </g>
      </svg>
    `;
  }

  // 15. SURFACE TREATMENT & COATINGS (Galvanizing, Powder Coating, Sand Blasting Sa 2.5)
  if (norm.includes('surface') || norm.includes('coating') || norm.includes('blasting') || norm.includes('sand blast') || norm.includes('powder') || norm.includes('paint') || norm.includes('anodiz')) {
    return `
      <svg viewBox="0 0 600 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="400" fill="#0C1322"/>
        <g transform="translate(80, 60)">
          <!-- Duplex Coating Layers Diagram per ISO 12944 -->
          <!-- Substrate: Steel Plate with Sa 2.5 profile -->
          <path d="M 20 180 L 420 180 L 420 230 L 20 230 Z" fill="#292524" stroke="#78716C" stroke-width="2"/>
          <!-- Sa 2.5 Blast Profile Peak-to-Valley (50-75 microns) -->
          <path d="M 20 180 Q 25 174 30 180 Q 35 186 40 180 Q 45 174 50 180 Q 55 186 60 180 L 420 180" stroke="#F59E0B" stroke-width="2" fill="none"/>
          <text x="220" y="210" fill="#CBD5E1" font-size="11" font-family="monospace" text-anchor="middle">STEEL SUBSTRATE (Sa 2.5 BLASTED, Rz = 60μm)</text>
          
          <!-- Layer 1: Zinc-Rich Primer (60-80 μm) -->
          <rect x="20" y="145" width="400" height="30" fill="#0284C7" opacity="0.85" stroke="#38BDF8" stroke-width="1.5"/>
          <text x="30" y="164" fill="#E0F2FE" font-size="10" font-family="monospace">LAYER 1: Zinc-Rich Epoxy Primer (75μm DFT)</text>
          
          <!-- Layer 2: Epoxy MIO Intermediate Barrier (100-125 μm) -->
          <rect x="20" y="105" width="400" height="35" fill="#4338CA" opacity="0.85" stroke="#818CF8" stroke-width="1.5"/>
          <text x="30" y="127" fill="#E0E7FF" font-size="10" font-family="monospace">LAYER 2: Epoxy MIO High-Build Barrier (125μm DFT)</text>
          
          <!-- Layer 3: Aliphatic Polyurethane (PU) Topcoat (50-60 μm) -->
          <rect x="20" y="70" width="400" height="30" fill="#059669" opacity="0.85" stroke="#34D399" stroke-width="1.5"/>
          <text x="30" y="90" fill="#D1FAE5" font-size="10" font-family="monospace">LAYER 3: Aliphatic PU UV-Resistant Finish (60μm DFT)</text>
          
          <!-- Total System Bracket -->
          <line x1="435" y1="70" x2="435" y2="180" stroke="#FDE047" stroke-width="2"/>
          <text x="445" y="130" fill="#FDE047" font-size="10" font-family="monospace">TOTAL DFT: 260μm (C5-M High Durability)</text>
          
          <text x="220" y="260" fill="#38BDF8" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">MULTI-LAYER PROTECTIVE COATING SYSTEM ARCHITECTURE</text>
        </g>
      </svg>
    `;
  }

  // 16. NDT & METAL INSPECTION (Ultrasonic, Magnetic Particle, Dye Penetrant, Radiography)
  if (norm.includes('ndt') || norm.includes('inspect') || norm.includes('ultrasonic') || norm.includes('penetrant') || norm.includes('magnetic') || norm.includes('gauge') || norm.includes('radiograph')) {
    return `
      <svg viewBox="0 0 600 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="400" fill="#080F1E"/>
        <g transform="translate(80, 50)">
          <!-- Ultrasonic Testing (UT) Probe on Welded Plate -->
          <rect x="20" y="140" width="400" height="40" fill="#1E293B" stroke="#64748B" stroke-width="2"/>
          
          <!-- Angle Beam Transducer (45° / 60° / 70° Shear Wave) -->
          <polygon points="100,100 150,100 135,140 105,140" fill="#F59E0B" stroke="#FDE68A" stroke-width="2"/>
          <text x="125" y="90" fill="#FDE68A" font-size="10" font-family="monospace" text-anchor="middle">UT PROBE (4 MHz 60°)</text>
          
          <!-- Ultrasonic Sound Path Ray bouncing to defect -->
          <line x1="120" y1="140" x2="160" y2="180" stroke="#38BDF8" stroke-width="2" stroke-dasharray="3,2"/>
          <line x1="160" y1="180" x2="200" y2="155" stroke="#38BDF8" stroke-width="2" stroke-dasharray="3,2"/>
          
          <!-- Internal Flaw (Lack of Fusion / Crack) -->
          <line x1="195" y1="150" x2="208" y2="162" stroke="#EF4444" stroke-width="4"/>
          <circle cx="202" cy="156" r="8" fill="none" stroke="#EF4444" stroke-width="1.5"/>
          <text x="220" y="150" fill="#EF4444" font-size="9" font-family="monospace">INTERNAL CRACK</text>
          
          <!-- A-Scan CRT Display Screen -->
          <g transform="translate(260, 20)">
            <rect x="0" y="0" width="160" height="100" fill="#001B3A" stroke="#38BDF8" stroke-width="2" rx="6"/>
            <!-- Baseline Grid -->
            <line x1="10" y1="80" x2="150" y2="80" stroke="#005599" stroke-width="1"/>
            <!-- Initial Pulse -->
            <path d="M 15 80 L 20 20 L 25 80" fill="none" stroke="#00FFFF" stroke-width="2"/>
            <!-- Flaw Echo Spike -->
            <path d="M 75 80 L 82 35 L 89 80" fill="none" stroke="#EF4444" stroke-width="2.5"/>
            <!-- Backwall Echo Spike -->
            <path d="M 130 80 L 136 25 L 142 80" fill="none" stroke="#00FFFF" stroke-width="2"/>
            <text x="82" y="25" fill="#EF4444" font-size="8.5" font-family="monospace" text-anchor="middle">DEFECT ECHO</text>
            <text x="80" y="95" fill="#93C5FD" font-size="8" font-family="monospace" text-anchor="middle">TIME-OF-FLIGHT (mm)</text>
          </g>
          
          <text x="220" y="240" fill="#38BDF8" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle">ULTRASONIC NON-DESTRUCTIVE TESTING (UT A-SCAN)</text>
        </g>
      </svg>
    `;
  }

  // 17. DEFAULT ENGINEERING BLUEPRINT / SCHEMATIC
  return `
    <svg viewBox="0 0 600 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="baseGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" stroke-width="0.75"/>
        </pattern>
      </defs>
      <rect width="600" height="400" fill="#0B132B"/>
      <rect width="600" height="400" fill="url(#baseGrid)"/>
      
      <g transform="translate(60, 50)">
        <!-- Precision Engineering Frame -->
        <rect x="0" y="0" width="480" height="290" fill="none" stroke="#38BDF8" stroke-width="2" rx="4"/>
        <line x1="0" y1="240" x2="480" y2="240" stroke="#38BDF8" stroke-width="1.5"/>
        
        <!-- Center Technical Geometric Emblem -->
        <circle cx="240" cy="120" r="60" fill="none" stroke="#818CF8" stroke-width="2" stroke-dasharray="6,4"/>
        <polygon points="240,65 288,148 192,148" fill="none" stroke="#F59E0B" stroke-width="2"/>
        <circle cx="240" cy="120" r="6" fill="#38BDF8"/>
        
        <!-- Axis Crosshairs -->
        <line x1="140" y1="120" x2="340" y2="120" stroke="#64748B" stroke-width="1"/>
        <line x1="240" y1="30" x2="240" y2="210" stroke="#64748B" stroke-width="1"/>
        
        <!-- Title bar text -->
        <text x="24" y="265" fill="#38BDF8" font-size="12" font-family="sans-serif" font-weight="bold">${(title || 'ENGINEERING TECHNICAL DATA').toUpperCase()}</text>
        <text x="24" y="280" fill="#94A3B8" font-size="10" font-family="monospace">FIZA FIYAT • ARCHITECTURAL & STRUCTURAL INTELLIGENCE</text>
      </g>
    </svg>
  `;
}
