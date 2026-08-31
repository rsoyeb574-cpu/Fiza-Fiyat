import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Sofa, 
  Cpu, 
  Layers, 
  Sparkles, 
  Calculator, 
  ArrowRight, 
  Check, 
  Info, 
  Clock, 
  FileText, 
  DollarSign, 
  Share2, 
  MessageCircle,
  TrendingUp,
  Sliders,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { CONTACT_CONFIG } from '../../config/contact';

export type QuickEstimateProjectType = 'architecture' | 'interior' | 'ai-studio' | 'turnkey-bim';
export type QuickEstimateTier = 'standard' | 'luxury' | 'ultra';

interface ProjectTypeConfig {
  id: QuickEstimateProjectType;
  name: string;
  shortLabel: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  baseRates: {
    standard: number; // rate per sq ft in USD
    luxury: number;
    ultra: number;
  };
  inrMultiplier: number; // approx INR conversion rate for dual-currency clarity
  turnaroundDays: {
    min: number;
    max: number;
  };
  deliverables: string[];
  color: string;
  badge: string;
}

export const PROJECT_TYPES: ProjectTypeConfig[] = [
  {
    id: 'architecture',
    name: 'Architecture & Structural Engineering',
    shortLabel: 'Architecture',
    tagline: 'Complete 2D/3D blueprints, structural load calculations, elevation designs & municipal drawings',
    icon: Building2,
    baseRates: {
      standard: 1.8, // Design & engineering rate per sq.ft ($1.80/sq.ft)
      luxury: 3.5,
      ultra: 6.2
    },
    inrMultiplier: 85,
    turnaroundDays: { min: 14, max: 28 },
    deliverables: [
      'Architectural Floor Plans & Section Cuts',
      'Structural RCC & Steel Beam Details',
      'Elevation Renders & Material Specs',
      'Municipal Approval Set Documentation'
    ],
    color: 'from-blue-500 to-cyan-500',
    badge: 'Core Architectural'
  },
  {
    id: 'interior',
    name: 'Luxury Interior Architecture & Fitout',
    shortLabel: 'Interior Design',
    tagline: 'Bespoke space planning, lighting layout, false ceiling details, joinery & VR walkthroughs',
    icon: Sofa,
    baseRates: {
      standard: 2.2,
      luxury: 4.8,
      ultra: 8.5
    },
    inrMultiplier: 85,
    turnaroundDays: { min: 10, max: 21 },
    deliverables: [
      'Custom Millwork & Cabinetry Details',
      'Electrical, Plumbing & HVAC Coordination',
      '3D Photorealistic Interior Views',
      'Complete FF&E Bill of Quantities (BOQ)'
    ],
    color: 'from-amber-500 to-orange-500',
    badge: 'Interior Craft'
  },
  {
    id: 'ai-studio',
    name: 'AI Generative Studio & 3D Visualization',
    shortLabel: 'AI Visualization',
    tagline: '8K generative architectural rendering, virtual staging, solar shadow study & AI walkthroughs',
    icon: Cpu,
    baseRates: {
      standard: 0.9,
      luxury: 1.9,
      ultra: 3.4
    },
    inrMultiplier: 85,
    turnaroundDays: { min: 4, max: 10 },
    deliverables: [
      '8K Ultra-HD Photorealistic Renders',
      'Daylight & Artificial Lighting Studies',
      'Cinematic Animation & 360° Panorama',
      'AI Generative Material Explorations'
    ],
    color: 'from-violet-500 to-purple-500',
    badge: 'AI Accelerated'
  },
  {
    id: 'turnkey-bim',
    name: 'Integrated Architecture + Revit BIM + AI',
    shortLabel: 'Integrated BIM & AI',
    tagline: 'Comprehensive LOD 400 BIM model, structural validation, clash detection & complete documentation',
    icon: Layers,
    baseRates: {
      standard: 3.2,
      luxury: 6.8,
      ultra: 11.5
    },
    inrMultiplier: 85,
    turnaroundDays: { min: 21, max: 45 },
    deliverables: [
      'Autodesk Revit LOD 350-400 BIM Model',
      'Full Navisworks Clash Detection Report',
      'Structural Analysis & PE Stamp Ready',
      'Parametric AI Cost Schedule & Quantity Takeoff'
    ],
    color: 'from-emerald-500 to-teal-500',
    badge: 'Full Suite'
  }
];

export const SQFT_PRESETS = [
  { label: 'Compact Flat', value: 1200 },
  { label: 'Luxury Villa', value: 3500 },
  { label: 'Estate Mansion', value: 7500 },
  { label: 'Commercial Complex', value: 15000 }
];

interface QuickEstimateSliderProps {
  onOpenCalculator?: () => void;
  onInquireProject?: (details: string) => void;
  className?: string;
}

export const QuickEstimateSlider: React.FC<QuickEstimateSliderProps> = ({
  onOpenCalculator,
  onInquireProject,
  className = ''
}) => {
  const [selectedType, setSelectedType] = useState<QuickEstimateProjectType>('architecture');
  const [squareFootage, setSquareFootage] = useState<number>(3500);
  const [tier, setTier] = useState<QuickEstimateTier>('luxury');
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const activeConfig = useMemo(() => {
    return PROJECT_TYPES.find(p => p.id === selectedType) || PROJECT_TYPES[0];
  }, [selectedType]);

  // Calculations
  const calculations = useMemo(() => {
    const ratePerSqFtUSD = activeConfig.baseRates[tier];
    const baseTotalUSD = squareFootage * ratePerSqFtUSD;

    // Approximate cost range (+/- 10% for dynamic flexibility)
    const minUSD = Math.round(baseTotalUSD * 0.92);
    const maxUSD = Math.round(baseTotalUSD * 1.14);

    const minINR = Math.round(minUSD * activeConfig.inrMultiplier);
    const maxINR = Math.round(maxUSD * activeConfig.inrMultiplier);

    const ratePerSqFtINR = Math.round(ratePerSqFtUSD * activeConfig.inrMultiplier);

    // Dynamic timeline estimate scaling with area
    const scaleFactor = Math.max(1, Math.log10(squareFootage / 1000) * 0.8 + 1);
    const estDaysMin = Math.round(activeConfig.turnaroundDays.min * scaleFactor);
    const estDaysMax = Math.round(activeConfig.turnaroundDays.max * scaleFactor);

    return {
      ratePerSqFtUSD,
      ratePerSqFtINR,
      minUSD,
      maxUSD,
      minINR,
      maxINR,
      estDaysMin,
      estDaysMax
    };
  }, [activeConfig, squareFootage, tier]);

  // Formatted Cost String
  const displayCostRange = useMemo(() => {
    if (currency === 'INR') {
      return `₹${calculations.minINR.toLocaleString('en-IN')} – ₹${calculations.maxINR.toLocaleString('en-IN')}`;
    }
    return `$${calculations.minUSD.toLocaleString('en-US')} – $${calculations.maxUSD.toLocaleString('en-US')}`;
  }, [currency, calculations]);

  const displayRate = useMemo(() => {
    if (currency === 'INR') {
      return `₹${calculations.ratePerSqFtINR} / sq.ft`;
    }
    return `$${calculations.ratePerSqFtUSD.toFixed(2)} / sq.ft`;
  }, [currency, calculations]);

  // Estimate details summary for inquiry or sharing
  const estimateSummaryText = `Fiza Hayat Quick Estimate:
• Project: ${activeConfig.name} (${tier.toUpperCase()} Tier)
• Area: ${squareFootage.toLocaleString()} Sq.Ft
• Rate: ${displayRate}
• Est. Budget Range: ${displayCostRange} ${currency}
• Est. Delivery: ${calculations.estDaysMin}-${calculations.estDaysMax} Business Days`;

  const handleCopySummary = () => {
    navigator.clipboard.writeText(estimateSummaryText);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const handleWhatsAppConsultation = () => {
    const message = encodeURIComponent(`Hello Fiza Hayat Team, I calculated an estimate on your website:
• Service: ${activeConfig.name}
• Estimated Area: ${squareFootage.toLocaleString()} sq.ft
• Quality Tier: ${tier.toUpperCase()}
• Estimated Budget: ${displayCostRange} ${currency}

I'd like to schedule a formal consultation to discuss next steps.`);
    if (CONTACT_CONFIG.whatsappGroupLink) {
      window.open(CONTACT_CONFIG.whatsappGroupLink, '_blank');
    } else {
      window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
    }
  };

  return (
    <section className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="relative rounded-3xl bg-gradient-to-b from-[#151B2E] via-[#121727] to-[#0D1220] border border-indigo-500/25 p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden backdrop-blur-xl">
        
        {/* Ambient background glow accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -z-0"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

        {/* SECTION HEADER */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-indigo-500/20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-3">
              <Sliders className="w-3.5 h-3.5 text-violet-400" />
              <span>Interactive Budget Estimator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Quick Project <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400">Cost Estimator</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mt-1.5 leading-relaxed">
              Select your design domain and slide the total square footage to view dynamic, transparent design and engineering budget benchmarks instantly.
            </p>
          </div>

          {/* Currency Switcher */}
          <div className="flex items-center gap-2 bg-[#0B1020] p-1.5 rounded-2xl border border-indigo-500/20 shrink-0 self-start md:self-auto">
            <span className="text-[11px] font-bold text-slate-400 px-2 uppercase tracking-wider">Currency:</span>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currency === 'USD'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency('INR')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currency === 'INR'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              INR (₹)
            </button>
          </div>
        </div>

        {/* MAIN INTERACTIVE GRID */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-start">
          
          {/* LEFT CONTROLS: Type Selection + Slider + Tiers (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. PROJECT TYPE SELECTOR */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center justify-between">
                <span>1. Select Project Domain</span>
                <span className="text-slate-400 text-[11px] font-normal lowercase">4 specialized engineering categories</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PROJECT_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;

                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between gap-3 group relative overflow-hidden ${
                        isSelected
                          ? 'bg-[#1A2238] border-violet-500 shadow-lg shadow-violet-600/20 ring-1 ring-violet-500/50'
                          : 'bg-[#0F1424] border-indigo-500/15 hover:border-indigo-500/40 hover:bg-[#13192B]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className={`p-2.5 rounded-xl border ${
                          isSelected 
                            ? 'bg-violet-600/20 border-violet-400/40 text-violet-300' 
                            : 'bg-[#151B2E] border-white/5 text-slate-400 group-hover:text-slate-200'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          isSelected
                            ? 'bg-violet-500/20 text-violet-300 border-violet-500/30'
                            : 'bg-slate-900 text-slate-400 border-white/5'
                        }`}>
                          {type.badge}
                        </span>
                      </div>

                      <div>
                        <div className={`font-bold text-sm leading-tight transition-colors ${
                          isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'
                        }`}>
                          {type.shortLabel}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                          {type.tagline}
                        </p>
                      </div>

                      {/* Active indicator bar */}
                      {isSelected && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 via-indigo-400 to-cyan-400"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. SQUARE FOOTAGE INTERACTIVE SLIDER */}
            <div className="p-5 rounded-2xl bg-[#0F1424] border border-indigo-500/20 space-y-4 shadow-inner">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>2. Estimated Square Footage (Area)</span>
                </label>
                
                {/* Live Area Badge with editable input */}
                <div className="flex items-center gap-1.5 bg-[#151B2E] px-3 py-1 rounded-xl border border-violet-500/30 shadow-md">
                  <input
                    type="number"
                    min="300"
                    max="50000"
                    step="50"
                    value={squareFootage}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val)) setSquareFootage(Math.max(100, Math.min(100000, val)));
                    }}
                    className="w-20 bg-transparent text-right font-extrabold font-mono text-base text-cyan-300 focus:outline-none"
                  />
                  <span className="text-xs font-bold text-slate-300">sq.ft</span>
                </div>
              </div>

              {/* Slider Component */}
              <div className="space-y-2 pt-2">
                <input
                  type="range"
                  min="500"
                  max="25000"
                  step="100"
                  value={squareFootage}
                  onChange={(e) => setSquareFootage(parseInt(e.target.value, 10))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500 transition-all hover:bg-slate-700"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 0%, #38bdf8 ${(squareFootage - 500) / (25000 - 500) * 100}%, #1e293b ${(squareFootage - 500) / (25000 - 500) * 100}%, #1e293b 100%)`
                  }}
                />
                
                <div className="flex justify-between text-[10px] font-mono text-slate-400 px-1">
                  <span>500 sq.ft</span>
                  <span>5,000 sq.ft</span>
                  <span>15,000 sq.ft</span>
                  <span>25,000+ sq.ft</span>
                </div>
              </div>

              {/* Quick Area Preset Buttons */}
              <div className="pt-2 flex flex-wrap gap-2 items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Quick Presets:</span>
                {SQFT_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setSquareFootage(preset.value)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                      squareFootage === preset.value
                        ? 'bg-violet-600 text-white border-violet-400 shadow-sm'
                        : 'bg-[#151B2E] text-slate-300 border-white/5 hover:border-violet-500/30 hover:text-white'
                    }`}
                  >
                    {preset.label} ({preset.value.toLocaleString()} sq.ft)
                  </button>
                ))}
              </div>
            </div>

            {/* 3. QUALITY / EXECUTION TIER */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center justify-between">
                <span>3. Quality & Complexity Tier</span>
                <span className="text-slate-400 text-[11px] font-normal">Affects detailing depth & LOD standard</span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'standard', label: 'Standard', desc: 'LOD 200 • Standard Spec' },
                  { id: 'luxury', label: 'Luxury Executive', desc: 'LOD 350 • Custom Details' },
                  { id: 'ultra', label: 'Ultra Prestige', desc: 'LOD 400 • Bespoke Master' }
                ].map((t) => {
                  const isSelected = tier === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTier(t.id as QuickEstimateTier)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#1C2542] to-[#151B2E] border-violet-400 text-white shadow-md ring-1 ring-violet-400/40'
                          : 'bg-[#0F1424] border-indigo-500/15 text-slate-400 hover:text-slate-200 hover:bg-[#13192B]'
                      }`}
                    >
                      <div className={`font-bold text-xs ${isSelected ? 'text-violet-300' : 'text-slate-300'}`}>
                        {t.label}
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5 truncate">
                        {t.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: DYNAMIC COST ESTIMATION BREAKDOWN CARD (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-gradient-to-b from-[#182038] via-[#141B30] to-[#0E1322] border border-violet-500/30 p-6 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden">
              
              {/* Highlight ribbon */}
              <div className="flex items-center justify-between pb-4 border-b border-indigo-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white tracking-tight">
                      Calculated Estimate
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      Live dynamic architectural pricing model
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                  {displayRate}
                </span>
              </div>

              {/* ESTIMATED RANGE HERO CALLOUT */}
              <div className="p-5 rounded-2xl bg-[#0B1020]/90 border border-emerald-500/30 text-center space-y-1.5 shadow-inner">
                <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                  Approximate Design & Engineering Budget
                </div>
                
                <div className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 font-mono">
                  {displayCostRange}
                </div>

                <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
                  Based on <span className="text-white font-bold">{squareFootage.toLocaleString()} sq.ft</span> with {tier.toUpperCase()} tier specifications.
                </p>
              </div>

              {/* ESTIMATE METRICS BREAKDOWN */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#0F1424] border border-white/5 space-y-1">
                  <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3 text-violet-400" /> Timeline
                  </div>
                  <div className="text-white font-bold text-xs sm:text-sm">
                    {calculations.estDaysMin} – {calculations.estDaysMax} Days
                  </div>
                  <div className="text-[9px] text-slate-400">Phased stage releases</div>
                </div>

                <div className="p-3 rounded-xl bg-[#0F1424] border border-white/5 space-y-1">
                  <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" /> Assurance
                  </div>
                  <div className="text-white font-bold text-xs sm:text-sm">
                    100% Guaranteed
                  </div>
                  <div className="text-[9px] text-slate-400">Unlimited revisions</div>
                </div>
              </div>

              {/* DELIVERABLES CHECKLIST */}
              <div className="space-y-2 pt-2 border-t border-indigo-500/20">
                <div className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider flex items-center justify-between">
                  <span>Included in this Scope:</span>
                  <span className="text-[10px] font-normal text-slate-400">{activeConfig.deliverables.length} core assets</span>
                </div>
                
                <div className="space-y-1.5">
                  {activeConfig.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => {
                    if (onInquireProject) {
                      onInquireProject(estimateSummaryText);
                    } else if (onOpenCalculator) {
                      onOpenCalculator();
                    }
                  }}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95"
                >
                  <FileText className="w-4 h-4" />
                  <span>Lock In This Estimate & Inquire</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleWhatsAppConsultation}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Send estimate to WhatsApp directly"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp Quote</span>
                  </button>

                  <button
                    onClick={handleCopySummary}
                    className="py-2.5 px-3 rounded-xl bg-[#0B1020] hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Copy full estimate details to clipboard"
                  >
                    {copiedNotification ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Summary</span>
                      </>
                    )}
                  </button>
                </div>

                {onOpenCalculator && (
                  <button
                    onClick={onOpenCalculator}
                    className="w-full text-center text-xs text-indigo-400 hover:text-indigo-300 font-semibold pt-1 block cursor-pointer"
                  >
                    Need civil materials, brickwork & BOQ breakdown? <span className="underline">Open Full Civil Calculator</span>
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
