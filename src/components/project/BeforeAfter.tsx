import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Sliders, 
  ArrowLeftRight, 
  Sparkles, 
  Eye, 
  Layers, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Check, 
  Copy, 
  Leaf, 
  Building, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Play, 
  Pause, 
  Wand2,
  ChevronRight
} from 'lucide-react';
import { Project } from '../../types';
import { NormalizedProjectSpecs, getProjectSpecs } from '../../utils/projectComparison';
import { ArchitecturalDesignConcept } from '../../types/designIteration';

export interface BeforeAfterScheme {
  id: string;
  schemeLetter: string;
  name: string;
  tagline: string;
  architecturalStyle: string;
  imageUrl: string;
  costDelta: string;
  costRationale: string;
  timelineDelta: string;
  energyRating: string;
  usableAreaDelta: string;
  structuralSystem: string;
  materialPalette: string[];
  keyEvolutions: string[];
  isCustomAiGenerated?: boolean;
}

// Alias for backward compatibility
export type ComparisonScheme = BeforeAfterScheme;

export interface BeforeAfterProps {
  /** Project data containing specifications and imagery */
  project?: Project;
  /** Normalized specifications (calculated automatically if project is provided) */
  specs?: NormalizedProjectSpecs;
  /** Direct baseline image URL if used outside a full project context */
  beforeImage?: string;
  /** Direct AI iteration image URL if used outside a full project context */
  afterImage?: string;
  /** Label for baseline design concept */
  beforeLabel?: string;
  /** Label for AI-suggested iteration */
  afterLabel?: string;
  /** Custom collection of AI architectural schemes to compare */
  schemes?: BeforeAfterScheme[];
  /** Dynamic concepts generated on-the-fly via Gemini */
  activeGeneratedConcepts?: ArchitecturalDesignConcept[];
  /** Default visual interaction mode: 'slider' or 'toggle' */
  initialMode?: 'slider' | 'toggle' | 'sideBySide' | 'blend';
  /** Whether user can switch between slider, toggle, and side-by-side views */
  allowModeSwitch?: boolean;
  /** Whether to show the architectural variance matrix */
  showMetrics?: boolean;
  /** Whether to show the iteration scheme selector pills */
  showSchemeSelector?: boolean;
  /** Callback triggered when user adopts an AI iteration */
  onAdoptIteration?: (scheme: BeforeAfterScheme) => void;
  /** Callback to trigger Gemini AI iteration modal */
  onOpenAiIterationModal?: () => void;
  /** Custom container class */
  className?: string;
  /** Canvas height class */
  heightClassName?: string;
}

export const BeforeAfter: React.FC<BeforeAfterProps> = ({
  project,
  specs: providedSpecs,
  beforeImage: explicitBeforeImage,
  afterImage: explicitAfterImage,
  beforeLabel = 'Original Design Concept',
  afterLabel = 'AI-Suggested Iteration',
  schemes: customSchemes,
  activeGeneratedConcepts,
  initialMode = 'slider',
  allowModeSwitch = true,
  showMetrics = true,
  showSchemeSelector = true,
  onAdoptIteration,
  onOpenAiIterationModal,
  className = '',
  heightClassName = 'h-[440px] sm:h-[560px]'
}) => {
  // Resolve baseline specs
  const specs = providedSpecs || (project ? getProjectSpecs(project) : {
    area: '45,000 sq.ft',
    estimatedCost: '$12,500,000',
    duration: '18 Months',
    energyRating: 'LEED Gold Standard',
    structuralType: 'Reinforced Concrete & Steel Composite'
  });

  // Resolve original baseline image
  const originalImageUrl = 
    explicitBeforeImage || 
    project?.beforeAfter?.before || 
    project?.coverImage || 
    project?.images?.[0] || 
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80';

  // Default architectural schemes tailored to project archetype
  const fallbackSchemes: BeforeAfterScheme[] = [
    {
      id: 'scheme-a-biophilic',
      schemeLetter: 'A',
      name: 'Biophilic Mass-Timber & Solar Cantilever',
      tagline: 'Net-Zero Ready • Organic Light Wells & Low-Carbon Glulam',
      architecturalStyle: 'Contemporary Biophilic Timber',
      imageUrl: explicitAfterImage || project?.images?.[1] || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
      costDelta: '-4% (Offsite Timber Prefab)',
      costRationale: 'Prefabricated timber cassettes and modular glulam reduce on-site crane and labor duration.',
      timelineDelta: '-6 Weeks offsite sequence',
      energyRating: 'LEED Platinum / Net-Zero Ready',
      usableAreaDelta: '+240 sq.ft net area',
      structuralSystem: 'Hybrid Mass Timber: Glulam columns & CLT floor diaphragms with central core',
      materialPalette: ['Austrian Glulam Timber', 'Triple Low-E Glass', 'Charred Accoya Siding', 'Honed Limestone'],
      keyEvolutions: [
        'Replaces heavy embodied concrete slabs with renewable carbon-sequestering CLT',
        'Deep passive solar overhangs cut summer cooling solar heat gain by 35%',
        'Integrated central daylight atrium delivers natural illuminance deep into interior floor plates'
      ]
    },
    {
      id: 'scheme-b-parametric',
      schemeLetter: 'B',
      name: 'Parametric Kinetic Facade & High-Tech Steel Shell',
      tagline: 'Smart Climate Envelope • Responsive Diagrid Framework',
      architecturalStyle: 'Neo-Futurist Parametric Steel',
      imageUrl: project?.images?.[2] || 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=80',
      costDelta: '+6% (Capital Investment)',
      costRationale: 'Higher initial investment for kinetic louvers offset by 42% lower annual HVAC utility costs.',
      timelineDelta: '+2 Weeks commissioning',
      energyRating: 'BREEAM Outstanding',
      usableAreaDelta: '+420 sq.ft open span',
      structuralSystem: 'Exposed structural steel diagrid with composite metal decking',
      materialPalette: ['Matte Black Steel Diagrid', 'Anodized Champagne Aluminum', 'Dynamic Smart Glass', 'Terrazzo'],
      keyEvolutions: [
        'External diagrid perimeter eliminates interior load-bearing columns for total layout freedom',
        'Kinetic perforated aluminum panels dynamically track sunlight to eliminate glare',
        'High-contrast futuristic aesthetic creates a memorable civic landmark presence'
      ]
    },
    {
      id: 'scheme-c-modular',
      schemeLetter: 'C',
      name: 'Rationalized Modular Monolith & Value Engineered',
      tagline: 'Accelerated Schedule • Precast Modular Bays & Pure Volumes',
      architecturalStyle: 'Minimalist Monolithic Contemporary',
      imageUrl: project?.images?.[3] || project?.beforeAfter?.after || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      costDelta: '-11% (Direct Cost Savings)',
      costRationale: 'Standardized 6-meter bays and precast formwork minimize material waste and labor.',
      timelineDelta: '-8 Weeks rapid precast',
      energyRating: 'High Thermal Mass Eco-Standard',
      usableAreaDelta: '+180 sq.ft net area',
      structuralSystem: 'Standardized precast reinforced concrete modular bays with post-tensioned slabs',
      materialPalette: ['Honed Crema Limestone', 'Ultra-Smooth Micro-Cement', 'Frameless Structural Glazing', 'Dark Bronze'],
      keyEvolutions: [
        'Rationalized orthogonal geometry maximizes material utilization efficiency',
        'High thermal mass concrete naturally stabilizes interior day/night temperatures',
        'Timeless, clean gallery-grade minimalist volumes with low ongoing maintenance'
      ]
    }
  ];

  // Dynamic schemes from Gemini AI
  const dynamicSchemes: BeforeAfterScheme[] = (activeGeneratedConcepts || []).map((c, idx) => ({
    id: c.id || `custom-ai-${idx}`,
    schemeLetter: c.schemeLetter || String.fromCharCode(65 + idx),
    name: c.conceptName,
    tagline: c.tagline,
    architecturalStyle: c.architecturalStyle,
    imageUrl: project?.images?.[(idx + 1) % (project?.images?.length || 1)] || originalImageUrl,
    costDelta: c.parameterComparison?.estimatedCostVariance || '±0%',
    costRationale: c.parameterComparison?.costRationale || 'Optimized structural configuration',
    timelineDelta: c.parameterComparison?.constructionTimelineVariance || 'Standard sequence',
    energyRating: c.parameterComparison?.energyAndSustainabilityRating || 'LEED Gold Compliant',
    usableAreaDelta: c.parameterComparison?.usableAreaImpact || 'No net area change',
    structuralSystem: c.structuralEngineeringSystem || 'Hybrid Structural System',
    materialPalette: c.materialPalette || ['Architectural Concrete', 'Curtain Glazing'],
    keyEvolutions: c.keyAdvantages?.slice(0, 3) || ['Enhanced spatial efficiency', 'Optimized daylight penetration'],
    isCustomAiGenerated: true
  }));

  const availableSchemes = customSchemes || (dynamicSchemes.length > 0 ? [...dynamicSchemes, ...fallbackSchemes] : fallbackSchemes);

  // Active scheme selection
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(availableSchemes[0]?.id || 'scheme-a-biophilic');
  const activeScheme = availableSchemes.find(s => s.id === selectedSchemeId) || availableSchemes[0] || fallbackSchemes[0];

  // Primary visual modes: 'slider' or 'toggle' (also supports 'sideBySide' and 'blend')
  const [viewMode, setViewMode] = useState<'slider' | 'toggle' | 'sideBySide' | 'blend'>(initialMode);

  // Slider interaction state
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // Toggle interaction state
  const [toggleSide, setToggleSide] = useState<'before' | 'after'>('after');
  const [isAutoPulsing, setIsAutoPulsing] = useState<boolean>(false);

  // Ghost opacity fader state
  const [blendOpacity, setBlendOpacity] = useState<number>(50);

  // Zoom & Fullscreen
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const componentRootRef = useRef<HTMLDivElement>(null);

  // Toast / Copy
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Auto-pulse effect for instant visual flip demonstration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPulsing && viewMode === 'toggle') {
      interval = setInterval(() => {
        setToggleSide(prev => (prev === 'before' ? 'after' : 'before'));
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [isAutoPulsing, viewMode]);

  // Handle slider drag interaction
  const handleMove = useCallback((clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let position = (x / rect.width) * 100;
    if (position < 0) position = 0;
    if (position > 100) position = 100;
    setSliderPosition(position);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  // Keyboard shortcut: Space toggles between original concept and AI iteration
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && viewMode === 'toggle') {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setToggleSide(prev => (prev === 'before' ? 'after' : 'before'));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode]);

  const handleCopyMetrics = () => {
    const text = `ARCHITECTURAL COMPARISON: ORIGINAL DESIGN vs AI-SUGGESTED ITERATION
Project: ${project?.title || 'Architectural Project'}
Active AI Scheme: Scheme ${activeScheme.schemeLetter} - ${activeScheme.name} (${activeScheme.architecturalStyle})

ORIGINAL DESIGN CONCEPT BASELINE:
- Scale: ${specs.area}
- Budget: ${specs.estimatedCost}
- Structural Framing: ${specs.structuralType}
- Sustainability: ${specs.energyRating}

AI-SUGGESTED ITERATION (SCHEME ${activeScheme.schemeLetter}):
- Cost Variance: ${activeScheme.costDelta} (${activeScheme.costRationale})
- Timeline Impact: ${activeScheme.timelineDelta}
- Sustainability Rating: ${activeScheme.energyRating}
- Usable Area Impact: ${activeScheme.usableAreaDelta}
- Structural Engineering: ${activeScheme.structuralSystem}
- Material Palette: ${activeScheme.materialPalette.join(', ')}

KEY ARCHITECTURAL EVOLUTIONS:
${activeScheme.keyEvolutions.map(e => `- ${e}`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div 
      ref={componentRootRef}
      id="before-after-comparison-component"
      className={`rounded-3xl bg-neutral-950 border border-white/10 overflow-hidden shadow-2xl space-y-6 ${className} ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none overflow-y-auto p-4 sm:p-8 bg-neutral-950' : 'p-4 sm:p-7'
      }`}
    >
      
      {/* 1. COMPONENT HEADER & INTERACTION MODE SELECTOR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-extrabold uppercase tracking-wider">
              Before / After Comparison
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>Original Concept vs AI Iteration</span>
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{beforeLabel} vs. {afterLabel}</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Compare baseline concept against AI generative proposals using interactive slider curtain wipe or instant toggle A/B switch.
          </p>
        </div>

        {/* View Mode Switcher Pills (Slider vs Toggle vs Side-by-Side vs Blend) */}
        {allowModeSwitch && (
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto shrink-0">
            <div className="p-1 rounded-2xl bg-neutral-900 border border-white/10 flex items-center gap-1">
              
              {/* SLIDER INTERACTION BUTTON */}
              <button
                id="btn-before-after-slider-mode"
                onClick={() => setViewMode('slider')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'slider'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
                title="Slider interaction: Drag curtain divider to reveal comparison"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Slider</span>
              </button>

              {/* TOGGLE INTERACTION BUTTON */}
              <button
                id="btn-before-after-toggle-mode"
                onClick={() => setViewMode('toggle')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'toggle'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
                title="Toggle interaction: Instant A/B switch between original and AI iteration"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Toggle</span>
              </button>

              {/* SIDE-BY-SIDE DUAL VIEW BUTTON */}
              <button
                id="btn-before-after-dual-mode"
                onClick={() => setViewMode('sideBySide')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'sideBySide'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
                title="Side-by-side synchronized view"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Side-by-Side</span>
              </button>

              {/* GHOST BLEND OPACITY BUTTON */}
              <button
                id="btn-before-after-blend-mode"
                onClick={() => setViewMode('blend')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'blend'
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
                title="Ghost blend: Smooth opacity overlay fader"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ghost Blend</span>
              </button>
            </div>

            {/* Fullscreen Expand/Collapse */}
            <button
              onClick={() => setIsFullscreen(prev => !prev)}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {/* 2. AI ITERATION SCHEME SELECTOR */}
      {showSchemeSelector && availableSchemes.length > 1 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-blue-400" />
              <span>Select AI Iteration Scheme to Compare</span>
            </span>

            {onOpenAiIterationModal && (
              <button
                onClick={onOpenAiIterationModal}
                className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate New Scheme with Gemini</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {availableSchemes.map((scheme) => {
              const isSelected = selectedSchemeId === scheme.id;
              return (
                <button
                  key={scheme.id}
                  id={`scheme-tab-${scheme.id}`}
                  onClick={() => setSelectedSchemeId(scheme.id)}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-neutral-900 border-purple-500 shadow-lg shadow-purple-950/40 ring-1 ring-purple-500/30'
                      : 'bg-neutral-900/40 border-white/5 text-neutral-400 hover:text-white hover:bg-neutral-900/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                      isSelected 
                        ? 'bg-purple-600/20 border-purple-500/40 text-purple-300' 
                        : 'bg-neutral-800 border-white/5 text-neutral-400'
                    }`}>
                      Scheme {scheme.schemeLetter}
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-400">
                      {scheme.costDelta}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white line-clamp-1">{scheme.name}</div>
                    <div className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">{scheme.tagline}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. INTERACTIVE VISUAL DISPLAY STAGE */}
      <div className="space-y-3">
        
        {/* Sub-bar: Specific Controls for Active Interaction Mode */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-900/80 px-4 py-2.5 rounded-2xl border border-white/5 text-xs">
          
          {/* SLIDER CONTROLS: Reveal Preset Buttons */}
          {viewMode === 'slider' && (
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 font-medium">Curtain Reveal:</span>
              {[0, 25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setSliderPosition(pct)}
                  className={`px-2 py-0.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    Math.abs(sliderPosition - pct) < 5
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {pct}%
                </button>
              ))}
              <span className="text-[11px] text-neutral-400 ml-2 hidden md:inline">
                Drag divider left/right or click presets to compare
              </span>
            </div>
          )}

          {/* TOGGLE CONTROLS: Instant Switch, Auto-Pulse & Spacebar Hint */}
          {viewMode === 'toggle' && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="p-1 rounded-xl bg-neutral-950 border border-white/10 flex items-center gap-1">
                <button
                  id="btn-toggle-to-before"
                  onClick={() => setToggleSide('before')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    toggleSide === 'before'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {beforeLabel}
                </button>
                <button
                  id="btn-toggle-to-after"
                  onClick={() => setToggleSide('after')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    toggleSide === 'after'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Scheme {activeScheme.schemeLetter} (AI Iteration)
                </button>
              </div>

              {/* Auto-Pulse Loop Button */}
              <button
                id="btn-toggle-auto-pulse"
                onClick={() => setIsAutoPulsing(prev => !prev)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isAutoPulsing
                    ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-sm'
                    : 'bg-neutral-800 border-white/10 text-neutral-400 hover:text-white'
                }`}
                title="Automatically alternate every 1.8s for rapid optical eye test"
              >
                {isAutoPulsing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isAutoPulsing ? 'Pulsing Loop' : 'Auto-Pulse'}</span>
              </button>

              <span className="text-[11px] text-neutral-400 hidden sm:inline">
                Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-white border border-white/10 font-mono text-[10px]">Space</kbd> or click image to toggle
              </span>
            </div>
          )}

          {/* SIDE-BY-SIDE VIEW TITLE */}
          {viewMode === 'sideBySide' && (
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 font-medium">Perspective:</span>
              <span className="text-white font-bold">Dual Synchronized View</span>
            </div>
          )}

          {/* GHOST BLEND CONTROLS: Smooth Range Input */}
          {viewMode === 'blend' && (
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <span className="text-amber-400 font-bold shrink-0 text-[11px]">Original (0%)</span>
              <input
                type="range"
                min="0"
                max="100"
                value={blendOpacity}
                onChange={(e) => setBlendOpacity(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <span className="text-purple-400 font-bold shrink-0 text-[11px]">AI Iteration ({blendOpacity}%)</span>
            </div>
          )}

          {/* Zoom In / Zoom Out Controls */}
          <div className="flex items-center gap-1.5 ml-auto">
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 1))}
              disabled={zoomLevel <= 1}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] text-neutral-300 px-1">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2))}
              disabled={zoomLevel >= 2}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoomLevel > 1 && (
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 1. SLIDER INTERACTION STAGE (SPLIT-CURTAIN DRAGGABLE REVEAL) */}
        {/* ============================================================ */}
        {viewMode === 'slider' && (
          <div 
            ref={sliderContainerRef}
            id="before-after-slider-container"
            className={`relative w-full ${heightClassName} rounded-3xl overflow-hidden border border-white/10 select-none cursor-ew-resize group bg-neutral-950 shadow-2xl`}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onTouchMove={handleTouchMove}
          >
            {/* Background Canvas: AI-Suggested Iteration */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img 
                src={activeScheme.imageUrl} 
                alt={activeScheme.name}
                className="w-full h-full object-cover transition-transform duration-150"
                style={{ transform: `scale(${zoomLevel})` }}
              />
              <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-2xl bg-neutral-950/85 backdrop-blur-md text-purple-300 text-xs font-bold border border-purple-500/40 shadow-xl flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>{afterLabel} (Scheme {activeScheme.schemeLetter})</span>
              </div>

              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-xl bg-neutral-950/80 backdrop-blur-md text-[11px] font-semibold text-neutral-300 border border-white/10 hidden sm:block">
                {activeScheme.architecturalStyle}
              </div>
            </div>

            {/* Foreground Clipped Canvas: Original Design Concept */}
            <div 
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img 
                src={originalImageUrl} 
                alt={beforeLabel}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-150 max-w-none"
                style={{ 
                  width: sliderContainerRef.current ? `${sliderContainerRef.current.offsetWidth}px` : '100%',
                  transform: `scale(${zoomLevel})`
                }}
              />
              <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-2xl bg-neutral-950/85 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-500/40 shadow-xl flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-amber-400" />
                <span>{beforeLabel}</span>
              </div>

              <div className="absolute bottom-4 left-4 px-3 py-1 rounded-xl bg-neutral-950/80 backdrop-blur-md text-[11px] font-semibold text-neutral-300 border border-white/10 hidden sm:block">
                {project?.title || 'Baseline Model'}
              </div>
            </div>

            {/* Slider Divider Line & Glow Handle */}
            <div 
              className="absolute inset-y-0 w-1 bg-white shadow-[0_0_16px_rgba(255,255,255,0.9)] z-20 flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-9 h-9 rounded-full bg-white text-neutral-950 flex items-center justify-center font-extrabold text-xs shadow-2xl border-2 border-purple-600 transition-transform group-hover:scale-110">
                ↔
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 2. TOGGLE INTERACTION STAGE (INSTANT A/B FLIP WITH AUTO-PULSE)*/}
        {/* ============================================================ */}
        {viewMode === 'toggle' && (
          <div 
            id="before-after-toggle-container"
            onClick={() => setToggleSide(prev => prev === 'before' ? 'after' : 'before')}
            className={`relative w-full ${heightClassName} rounded-3xl overflow-hidden border border-white/10 cursor-pointer group bg-neutral-950 shadow-2xl`}
            title="Click anywhere or press Spacebar to toggle between Original and AI Iteration"
          >
            <img 
              src={toggleSide === 'before' ? originalImageUrl : activeScheme.imageUrl} 
              alt={toggleSide === 'before' ? beforeLabel : activeScheme.name}
              className="w-full h-full object-cover transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            />

            {/* Active View Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              {toggleSide === 'before' ? (
                <div className="px-4 py-2 rounded-2xl bg-neutral-950/85 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-500/40 shadow-2xl flex items-center gap-2">
                  <Building className="w-4 h-4 text-amber-400" />
                  <span>Viewing: {beforeLabel}</span>
                </div>
              ) : (
                <div className="px-4 py-2 rounded-2xl bg-neutral-950/85 backdrop-blur-md text-purple-300 text-xs font-bold border border-purple-500/40 shadow-2xl flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Viewing: Scheme {activeScheme.schemeLetter} ({activeScheme.name})</span>
                </div>
              )}
            </div>

            {/* Quick Click-to-Flip Helper Pill */}
            <div className="absolute bottom-4 inset-x-0 mx-auto w-fit px-4 py-2 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-medium border border-white/20 shadow-2xl flex items-center gap-2 pointer-events-none">
              <span>Click image or press <kbd className="font-mono bg-white/20 px-1.5 py-0.5 rounded text-[10px]">Space</kbd> to flip</span>
              <ArrowLeftRight className="w-3.5 h-3.5 text-purple-300" />
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 3. SIDE-BY-SIDE DUAL VIEW STAGE                               */}
        {/* ============================================================ */}
        {viewMode === 'sideBySide' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Original Design Concept */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 h-[340px] sm:h-[480px] bg-neutral-900 shadow-xl group">
              <img 
                src={originalImageUrl} 
                alt={beforeLabel}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                style={{ transform: `scale(${zoomLevel})` }}
              />
              <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-2xl bg-neutral-950/85 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-500/40 shadow-xl flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-amber-400" />
                <span>{beforeLabel}</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-neutral-950/80 backdrop-blur-md border border-white/10 text-xs text-neutral-300">
                <div className="font-bold text-white">{project?.title || 'Baseline Design'}</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  Structure: {specs.structuralType} • Budget: {specs.estimatedCost}
                </div>
              </div>
            </div>

            {/* Right: AI Iteration Scheme */}
            <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 h-[340px] sm:h-[480px] bg-neutral-900 shadow-xl group">
              <img 
                src={activeScheme.imageUrl} 
                alt={activeScheme.name}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                style={{ transform: `scale(${zoomLevel})` }}
              />
              <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-2xl bg-neutral-950/85 backdrop-blur-md text-purple-300 text-xs font-bold border border-purple-500/40 shadow-xl flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Scheme {activeScheme.schemeLetter}: {activeScheme.name}</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-neutral-950/80 backdrop-blur-md border border-white/10 text-xs text-neutral-300">
                <div className="font-bold text-purple-300">{activeScheme.architecturalStyle}</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  Cost Variance: <strong className="text-emerald-400">{activeScheme.costDelta}</strong> • Timeline: <strong className="text-blue-300">{activeScheme.timelineDelta}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 4. GHOST OPACITY BLEND STAGE                                  */}
        {/* ============================================================ */}
        {viewMode === 'blend' && (
          <div className={`relative w-full ${heightClassName} rounded-3xl overflow-hidden border border-white/10 select-none bg-neutral-950 shadow-2xl`}>
            {/* Base: Original Concept */}
            <img 
              src={originalImageUrl} 
              alt={beforeLabel}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ transform: `scale(${zoomLevel})` }}
            />

            {/* Overlay: AI Iteration with variable opacity */}
            <img 
              src={activeScheme.imageUrl} 
              alt={activeScheme.name}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-100"
              style={{ 
                opacity: blendOpacity / 100,
                transform: `scale(${zoomLevel})`
              }}
            />

            <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-2xl bg-neutral-950/85 backdrop-blur-md text-xs font-bold border border-white/10 shadow-xl flex items-center gap-2">
              <span className="text-amber-400">Original (100%)</span>
              <span className="text-neutral-500">→</span>
              <span className="text-purple-300">Iteration ({blendOpacity}%)</span>
            </div>

            <div className="absolute bottom-4 inset-x-0 mx-auto w-fit px-4 py-2 rounded-full bg-black/80 backdrop-blur-md text-neutral-300 text-xs font-medium border border-white/10">
              Ghosting reveal exposes perimeter massing, floor slab alignments & cantilever changes
            </div>
          </div>
        )}

      </div>

      {/* ============================================================ */}
      {/* 4. ARCHITECTURAL METRIC VARIANCE MATRIX                      */}
      {/* ============================================================ */}
      {showMetrics && (
        <div className="p-5 sm:p-6 rounded-3xl bg-neutral-900/70 border border-white/10 space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>Architectural Parameter Variance Matrix</span>
              </h4>
              <p className="text-[11px] text-neutral-400">
                Comparative engineering, financial and sustainability impact of Scheme {activeScheme.schemeLetter} against baseline
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-copy-comparison-metrics"
                onClick={handleCopyMetrics}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
                title="Copy comparison summary to clipboard"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Copy Metrics</span>
                  </>
                )}
              </button>

              {onAdoptIteration && (
                <button
                  id="btn-adopt-active-scheme"
                  onClick={() => onAdoptIteration(activeScheme)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Adopt Scheme {activeScheme.schemeLetter}</span>
                </button>
              )}
            </div>
          </div>

          {/* 4-Metric Comparative Delta Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* 1. Capital Cost Delta */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Capital Budget</span>
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs text-neutral-400">Baseline: <strong className="text-white">{specs.estimatedCost}</strong></div>
                <div className="text-sm font-extrabold text-emerald-400">{activeScheme.costDelta}</div>
              </div>
              <p className="text-[10px] text-neutral-400 line-clamp-2 leading-tight">
                {activeScheme.costRationale}
              </p>
            </div>

            {/* 2. Construction Timeline */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Construction Schedule</span>
                <Clock className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs text-neutral-400">Baseline: <strong className="text-white">{specs.duration}</strong></div>
                <div className="text-sm font-extrabold text-blue-300">{activeScheme.timelineDelta}</div>
              </div>
              <p className="text-[10px] text-neutral-400 leading-tight">
                Mobilization, offsite prefabrication and erection sequencing
              </p>
            </div>

            {/* 3. Energy & Embodied Carbon */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Energy & Carbon</span>
                <Leaf className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs text-neutral-400">Baseline: <strong className="text-white">{specs.energyRating}</strong></div>
                <div className="text-sm font-extrabold text-teal-300 line-clamp-1">{activeScheme.energyRating}</div>
              </div>
              <p className="text-[10px] text-neutral-400 leading-tight">
                Operational efficiency, thermal envelope and LEED credit
              </p>
            </div>

            {/* 4. Structural Framing & Usable Area */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Structural System</span>
                <Building className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs text-neutral-400">Baseline: <strong className="text-white">{specs.structuralType}</strong></div>
                <div className="text-sm font-extrabold text-purple-300">{activeScheme.usableAreaDelta}</div>
              </div>
              <p className="text-[10px] text-neutral-400 line-clamp-2 leading-tight">
                {activeScheme.structuralSystem}
              </p>
            </div>

          </div>

          {/* Key Architectural Evolutions */}
          <div className="pt-3 border-t border-white/5 space-y-2">
            <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider block">
              Key Architectural Evolutions (Scheme {activeScheme.schemeLetter}):
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              {activeScheme.keyEvolutions.map((evo, eIdx) => (
                <div key={eIdx} className="p-3 rounded-xl bg-neutral-950 border border-white/5 text-neutral-300 flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{evo}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

// Aliases for maximum compatibility
export const BeforeAfterComparison = BeforeAfter;
export default BeforeAfter;
