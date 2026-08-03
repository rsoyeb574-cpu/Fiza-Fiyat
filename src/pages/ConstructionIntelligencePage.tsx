import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  Compass, 
  Package, 
  DollarSign, 
  BookOpen, 
  Calendar, 
  FileText, 
  Sofa, 
  Building2, 
  Layers, 
  Home, 
  Box, 
  Grid, 
  Zap, 
  Droplet, 
  ShieldCheck, 
  Palette, 
  DoorClosed, 
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  Download,
  Printer,
  ChevronRight,
  Info,
  Maximize2,
  RefreshCw,
  Sliders,
  MapPin,
  TrendingUp,
  Cpu,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { 
  ConstructionGuideItem, 
  ConstructionPlotPlan, 
  RegionalRate,
  MaterialEstimateItem 
} from '../types/construction';
import { 
  getConstructionGuides, 
  getConstructionPlotPlans, 
  getRegionalRates 
} from '../services/db';
import { calculateConstructionPlan } from '../utils/constructionCalculator';

export const ConstructionIntelligencePage: React.FC = () => {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<string>('calculator');

  // Input State for Plot Calculator
  const [plotWidth, setPlotWidth] = useState<number>(20);
  const [plotLength, setPlotLength] = useState<number>(20);
  const [location, setLocation] = useState<string>('Kolkata');
  const [floors, setFloors] = useState<'Ground Floor' | 'G+1' | 'G+2' | 'G+3'>('Ground Floor');
  const [budget, setBudget] = useState<number>(1000000);

  // Firestore DB Data State
  const [guides, setGuides] = useState<ConstructionGuideItem[]>([]);
  const [presetPlans, setPresetPlans] = useState<ConstructionPlotPlan[]>([]);
  const [regionalRates, setRegionalRates] = useState<RegionalRate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Current Generated Plan
  const [currentPlan, setCurrentPlan] = useState<ConstructionPlotPlan | null>(null);

  // Selected Material for Modal / Deep Dive
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialEstimateItem | null>(null);

  // Active Guide Slug for Guide View
  const [activeGuideSlug, setActiveGuideSlug] = useState<string>('foundation-guide');

  // Load Firestore DB Data on Mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [g, p, r] = await Promise.all([
        getConstructionGuides(),
        getConstructionPlotPlans(),
        getRegionalRates()
      ]);
      setGuides(g);
      setPresetPlans(p);
      setRegionalRates(r);

      // Generate default plan (20x20 Kolkata Ground Floor ₹10,00,000)
      const defaultPlan = calculateConstructionPlan(20, 20, 'Kolkata', 'Ground Floor', 1000000, r);
      setCurrentPlan(defaultPlan);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Handle Recalculate
  const handleCalculate = () => {
    const plan = calculateConstructionPlan(plotWidth, plotLength, location, floors, budget, regionalRates);
    setCurrentPlan(plan);
  };

  // Preset Load Helper
  const loadPreset = (preset: ConstructionPlotPlan) => {
    setPlotWidth(preset.plotWidthFt);
    setPlotLength(preset.plotLengthFt);
    setLocation(preset.location);
    setFloors(preset.floors);
    setBudget(preset.budgetINR);
    setCurrentPlan(preset);
  };

  // Nav Items definition
  const mainNavItems = [
    { id: 'calculator', label: 'Construction Calculator', icon: Calculator, desc: 'Smart Plot Plan & Estimate Generator' },
    { id: 'house-planning', label: 'House Planning & 2D/3D', icon: Compass, desc: '2D Floor Plans & 3D Renderings' },
    { id: 'material-estimator', label: 'Material Estimator', icon: Package, desc: 'Cement, Steel, Bricks & Sand Formulas' },
    { id: 'cost-estimator', label: 'Construction Cost Estimator', icon: DollarSign, desc: 'Detailed Cost Distribution' },
    { id: 'building-knowledge', label: 'Building Knowledge Hub', icon: BookOpen, desc: 'Engineering Rationale & Standards' },
    { id: 'timeline', label: 'Construction Timeline', icon: Calendar, desc: 'Phase-by-Phase Execution Schedule' },
    { id: 'boq-generator', label: 'BOQ Generator', icon: FileText, desc: 'Bill of Quantities Detailed PDF/Print' },
    { id: 'interior-cost', label: 'Interior Cost Estimator', icon: Sofa, desc: 'Kitchen, Wardrobes & Lighting' },
    { id: 'exterior-cost', label: 'Exterior Cost Estimator', icon: Building2, desc: 'Elevation, Cladding & Gate' },
    { id: 'design-gallery', label: 'Modern Design Gallery', icon: ImageIcon, desc: '3D Renderings & Floor Plan Archive' }
  ];

  const guideNavItems = [
    { id: 'foundation-guide', label: 'Foundation Guide', slug: 'foundation-guide', icon: Layers },
    { id: 'roof-guide', label: 'Roof Guide', slug: 'roof-guide', icon: Home },
    { id: 'brick-guide', label: 'Brick Guide', slug: 'brick-guide', icon: Box },
    { id: 'column-guide', label: 'Column Guide', slug: 'column-guide', icon: Grid },
    { id: 'beam-guide', label: 'Beam Guide', slug: 'beam-guide', icon: SlidersHorizontal },
    { id: 'slab-guide', label: 'Slab Guide', slug: 'slab-guide', icon: Layers },
    { id: 'electrical-guide', label: 'Electrical Guide', slug: 'electrical-guide', icon: Zap },
    { id: 'plumbing-guide', label: 'Plumbing Guide', slug: 'plumbing-guide', icon: Droplet },
    { id: 'waterproofing-guide', label: 'Waterproofing Guide', slug: 'waterproofing-guide', icon: ShieldCheck },
    { id: 'paint-guide', label: 'Paint Guide', slug: 'paint-guide', icon: Palette },
    { id: 'tile-guide', label: 'Tile Guide', slug: 'tile-guide', icon: Grid },
    { id: 'doors-windows-guide', label: 'Doors & Windows Guide', slug: 'doors-windows-guide', icon: DoorClosed }
  ];

  // Helper to open guide view
  const openGuide = (slug: string) => {
    setActiveGuideSlug(slug);
    setActiveTab(slug);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const currentGuide = guides.find(g => g.slug === activeGuideSlug) || guides[0];

  return (
    <div className="min-h-screen bg-[#020408] text-slate-100 pt-28 pb-24 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-500 selection:text-white">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/4 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Module Header Banner */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 mb-10 border border-white/10 relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-slate-950/90 to-blue-950/40 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 mb-4">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                Civil & Structural Engineering Consultant
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3">
                Construction <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">Intelligence</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                Professional architectural engineering platform providing real-time material estimation, structural load recommendations, 2D/3D floor planning, cost breakdowns, and in-depth construction guides.
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => setActiveTab('calculator')}
                className="px-5 py-3 rounded-xl font-medium text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                Plot Calculator
              </button>
              <button 
                onClick={() => setActiveTab('building-knowledge')}
                className="px-5 py-3 rounded-xl font-medium text-sm text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-blue-400" />
                Knowledge Base
              </button>
            </div>
          </div>

          {/* Preset Quick Loader Bar */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Quick Dynamic Examples:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setPlotWidth(20); setPlotLength(20); setLocation('Kolkata'); setFloors('Ground Floor'); setBudget(1000000);
                  const p = calculateConstructionPlan(20, 20, 'Kolkata', 'Ground Floor', 1000000, regionalRates);
                  setCurrentPlan(p);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/40 text-slate-200 transition-all"
              >
                20 ft × 20 ft | Kolkata (₹10 Lakh)
              </button>
              <button
                onClick={() => {
                  setPlotWidth(30); setPlotLength(40); setLocation('Mumbai'); setFloors('G+1'); setBudget(3200000);
                  const p = calculateConstructionPlan(30, 40, 'Mumbai', 'G+1', 3200000, regionalRates);
                  setCurrentPlan(p);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/40 text-slate-200 transition-all"
              >
                30 ft × 40 ft | Mumbai G+1 (₹32 Lakh)
              </button>
              <button
                onClick={() => {
                  setPlotWidth(50); setPlotLength(60); setLocation('Delhi NCR'); setFloors('G+2'); setBudget(7500000);
                  const p = calculateConstructionPlan(50, 60, 'Delhi NCR', 'G+2', 7500000, regionalRates);
                  setCurrentPlan(p);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/40 text-slate-200 transition-all"
              >
                50 ft × 60 ft | Delhi G+2 (₹75 Lakh)
              </button>
            </div>
          </div>
        </div>

        {/* Module Sub-Navigation Bar */}
        <div className="mb-8 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
          <div className="flex items-center gap-2 min-w-max p-1.5 glass-card rounded-2xl border border-white/10 bg-slate-900/80">
            {mainNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Construction Guides Sub-Navigation Dropdown / Pills */}
        <div className="mb-8 p-4 glass-card rounded-2xl border border-white/10 bg-slate-900/60">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Structural & MEP Educational Guides (Why / Pros & Cons / Maintenance):
            </span>
            <span className="text-xs text-slate-400 font-mono">12 Structural Guides Available</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {guideNavItems.map(guide => {
              const Icon = guide.icon;
              const isActive = activeTab === guide.slug;
              return (
                <button
                  key={guide.id}
                  onClick={() => openGuide(guide.slug)}
                  className={`p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all text-left ${
                    isActive 
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 border border-cyan-400/40' 
                      : 'bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-cyan-400'}`} />
                  <span className="truncate">{guide.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN TAB CONTENT RENDERER */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: CONSTRUCTION CALCULATOR */}
          {activeTab === 'calculator' && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Calculator Inputs Card */}
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 bg-slate-900/80">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Interactive Construction Parameter Inputs</h2>
                    <p className="text-xs text-slate-400">Specify plot size, location, floor height, and target budget to generate an automated engineering report.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-6">
                  {/* Plot Width */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-2">Plot Width (Feet)</label>
                    <input 
                      type="number"
                      value={plotWidth}
                      onChange={(e) => setPlotWidth(Math.max(10, Number(e.target.value)))}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Plot Length */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-2">Plot Length (Feet)</label>
                    <input 
                      type="number"
                      value={plotLength}
                      onChange={(e) => setPlotLength(Math.max(10, Number(e.target.value)))}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Location Selector */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-2">Project Location</label>
                    <select 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
                    >
                      <option value="Kolkata">Kolkata (₹1,850/sq.ft)</option>
                      <option value="Mumbai">Mumbai (₹2,450/sq.ft)</option>
                      <option value="Delhi NCR">Delhi NCR (₹2,150/sq.ft)</option>
                      <option value="Bangalore">Bangalore (₹2,050/sq.ft)</option>
                    </select>
                  </div>

                  {/* Floor Level */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-2">Floors Configuration</label>
                    <select 
                      value={floors}
                      onChange={(e) => setFloors(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
                    >
                      <option value="Ground Floor">Ground Floor Only</option>
                      <option value="G+1">Ground + 1st Floor (G+1)</option>
                      <option value="G+2">Ground + 2 Floors (G+2)</option>
                      <option value="G+3">Ground + 3 Floors (G+3)</option>
                    </select>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-2">Target Budget (₹ INR)</label>
                    <input 
                      type="number"
                      step={50000}
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
                  <div className="text-xs text-slate-400">
                    Plot Area: <span className="text-white font-bold font-mono">{plotWidth * plotLength} sq.ft</span> | 
                    Built-up Area: <span className="text-blue-400 font-bold font-mono">{currentPlan?.builtUpAreaSqFt || 0} sq.ft</span>
                  </div>

                  <button
                    onClick={handleCalculate}
                    className="px-6 py-3 rounded-xl font-medium text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Calculate & Update Plan
                  </button>
                </div>
              </div>

              {/* GENERATED EXAMPLE OVERVIEW DASHBOARD */}
              {currentPlan && (
                <div className="space-y-8">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="glass-card rounded-2xl p-5 border border-white/10 bg-slate-900/60">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Plot Dimensions</span>
                        <Maximize2 className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="text-2xl font-bold text-white font-mono">
                        {currentPlan.plotWidthFt} ft × {currentPlan.plotLengthFt} ft
                      </div>
                      <div className="text-xs text-slate-400 mt-1">Total Plot: {currentPlan.totalAreaSqFt} sq.ft</div>
                    </div>

                    <div className="glass-card rounded-2xl p-5 border border-white/10 bg-slate-900/60">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Built-Up Area</span>
                        <Building2 className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="text-2xl font-bold text-cyan-300 font-mono">
                        {currentPlan.builtUpAreaSqFt} <span className="text-sm font-sans text-slate-400">sq.ft</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">Floors: {currentPlan.floors}</div>
                    </div>

                    <div className="glass-card rounded-2xl p-5 border border-white/10 bg-slate-900/60">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Regional Construction Rate</span>
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-2xl font-bold text-emerald-400 font-mono">
                        ₹{currentPlan.costPerSqFtINR.toLocaleString()} <span className="text-xs font-sans text-slate-400">/ sq.ft</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">Location: {currentPlan.location}</div>
                    </div>

                    <div className="glass-card rounded-2xl p-5 border border-white/10 bg-slate-900/60">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Estimated Total Budget</span>
                        <DollarSign className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-2xl font-bold text-amber-400 font-mono">
                        ₹{currentPlan.budgetINR.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">Complete Turnkey Estimate</div>
                    </div>
                  </div>

                  {/* 2D Floor Plan & 3D Architectural Preview Split */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 2D Floor Plan SVG Drawing Canvas */}
                    <div className="glass-card rounded-3xl p-6 border border-white/10 bg-slate-900/80">
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <Compass className="w-5 h-5 text-blue-400" />
                          <h3 className="font-bold text-white text-base">Interactive 2D Floor Plan Layout</h3>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                          {currentPlan.plotWidthFt}′ × {currentPlan.plotLengthFt}′ Grid
                        </span>
                      </div>

                      {/* SVG Canvas */}
                      <div className="w-full bg-slate-950 rounded-2xl p-6 border border-white/10 relative overflow-hidden flex flex-col items-center justify-center min-h-[320px]">
                        {/* Blueprint grid lines background */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-40"></div>

                        <svg viewBox="0 0 420 320" className="w-full h-full max-h-[300px] relative z-10">
                          {/* Plot Boundary Wall */}
                          <rect x="10" y="10" width="400" height="280" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="6,4" />
                          <text x="200" y="25" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">NORTH FACING (ENTRY ROAD)</text>

                          {/* Rooms */}
                          {currentPlan.floorPlan2DData?.rooms.map((rm, idx) => (
                            <g key={idx}>
                              <rect 
                                x={rm.x} 
                                y={rm.y} 
                                w={rm.w} 
                                h={rm.h} 
                                fill={rm.color} 
                                stroke="#60a5fa" 
                                strokeWidth="2" 
                                rx="4" 
                              />
                              <text x={rm.x + rm.w / 2} y={rm.y + rm.h / 2 - 4} fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                                {rm.name}
                              </text>
                              {rm.doors && rm.doors.length > 0 && (
                                <text x={rm.x + rm.w / 2} y={rm.y + rm.h / 2 + 10} fill="#38bdf8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                                  [{rm.doors[0]}]
                                </text>
                              )}
                            </g>
                          ))}

                          {/* Water Tank & Septic Tank Position Markers */}
                          <circle cx="380" cy="40" r="14" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                          <text x="380" y="43" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">WATER</text>

                          <rect x="20" y="250" width="40" height="25" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" rx="3" />
                          <text x="40" y="265" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">SEPTIC</text>
                        </svg>

                        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 relative z-10">
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-500"></span> Living / Hall</span>
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-slate-800"></span> Bedroom</span>
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-indigo-950"></span> Kitchen</span>
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-sky-600"></span> Water Tank</span>
                        </div>
                      </div>
                    </div>

                    {/* 3D Architectural Exterior View */}
                    <div className="glass-card rounded-3xl p-6 border border-white/10 bg-slate-900/80">
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-cyan-400" />
                          <h3 className="font-bold text-white text-base">3D Architectural Rendering Preview</h3>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                          Photorealistic BIM Render
                        </span>
                      </div>

                      <div className="relative rounded-2xl overflow-hidden border border-white/10 group min-h-[320px] flex items-center justify-center bg-slate-950">
                        <img 
                          src={currentPlan.exterior3DImageUrl} 
                          alt={currentPlan.title}
                          className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl glass-card border border-white/10 backdrop-blur-md">
                          <div className="text-sm font-bold text-white mb-1">{currentPlan.title}</div>
                          <div className="text-xs text-slate-300">Modern facade rendering with thermal glass fenestration, wood louvers, and LED accent strips.</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Room-by-Room Interior Renderings */}
                  <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 bg-slate-900/80">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          <Sofa className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Room-by-Room Interior Design Concepts</h3>
                          <p className="text-xs text-slate-400">Architectural interior spatial planning with lighting and material specifications.</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                      {currentPlan.interiorImages.map((item, idx) => (
                        <div key={idx} className="glass-card rounded-2xl overflow-hidden border border-white/10 bg-slate-950/60 hover:border-blue-500/40 transition-all">
                          <div className="h-44 overflow-hidden relative">
                            <img src={item.imageUrl} alt={item.room} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-white border border-white/10">
                              {item.room}
                            </div>
                          </div>
                          <div className="p-4">
                            <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Material Estimation Breakdown Table */}
                  <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 bg-slate-900/80">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Estimated Material Quantities & Purpose Breakdown</h3>
                          <p className="text-xs text-slate-400">Click any material row for engineering rationale, life expectancy, pros/cons, and cost saving advice.</p>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-white/5">
                            <th className="p-3.5 rounded-l-xl">Material Name</th>
                            <th className="p-3.5">Estimated Quantity</th>
                            <th className="p-3.5">Rate (₹)</th>
                            <th className="p-3.5">Total Cost (₹)</th>
                            <th className="p-3.5">Primary Purpose & Why Used</th>
                            <th className="p-3.5 rounded-r-xl text-right">Details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {currentPlan.materials.map(mat => (
                            <tr key={mat.id} className="hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelectedMaterial(mat)}>
                              <td className="p-3.5 font-semibold text-white flex items-center gap-2">
                                <Box className="w-4 h-4 text-blue-400" />
                                {mat.name}
                              </td>
                              <td className="p-3.5 text-cyan-300 font-mono font-medium">
                                {mat.quantity.toLocaleString()} {mat.unit}
                              </td>
                              <td className="p-3.5 text-slate-300 font-mono">₹{mat.ratePerUnitINR.toLocaleString()}</td>
                              <td className="p-3.5 text-emerald-400 font-mono font-bold">₹{mat.totalCostINR.toLocaleString()}</td>
                              <td className="p-3.5 text-xs text-slate-300 max-w-xs truncate">{mat.purpose}</td>
                              <td className="p-3.5 text-right">
                                <button className="px-3 py-1 rounded-lg text-xs font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 transition-all border border-blue-500/20">
                                  View Rationale
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Structural & MEP Engineering Recommendations */}
                  <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 bg-slate-900/80">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Structural & Engineering Recommendations</h3>
                        <p className="text-xs text-slate-400">IS 456:2000 compliant specifications generated specifically for this plot footprint.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {/* Foundation Rec */}
                      <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                        <div className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="w-4 h-4" /> Foundation System
                        </div>
                        <div className="text-sm font-bold text-white">{currentPlan.recommendations.foundation.type}</div>
                        <p className="text-xs text-slate-300">{currentPlan.recommendations.foundation.whyRecommended}</p>
                        <div className="text-[11px] text-cyan-300 font-mono pt-1">Depth: {currentPlan.recommendations.foundation.depthFt}ft | {currentPlan.recommendations.foundation.rebarSpec}</div>
                      </div>

                      {/* Column Rec */}
                      <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                        <div className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Grid className="w-4 h-4" /> Column Specifications
                        </div>
                        <div className="text-sm font-bold text-white">{currentPlan.recommendations.columnSize.spec}</div>
                        <p className="text-xs text-slate-300">{currentPlan.recommendations.columnSize.whyRecommended}</p>
                        <div className="text-[11px] text-cyan-300 font-mono pt-1">{currentPlan.recommendations.columnSize.rebarDetails}</div>
                      </div>

                      {/* Roof Rec */}
                      <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                        <div className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Home className="w-4 h-4" /> Roof Slab Specification
                        </div>
                        <div className="text-sm font-bold text-white">{currentPlan.recommendations.roof.type}</div>
                        <p className="text-xs text-slate-300">{currentPlan.recommendations.roof.whyRecommended}</p>
                        <div className="text-[11px] text-cyan-300 font-mono pt-1">Grade: {currentPlan.recommendations.roof.concreteGrade}</div>
                      </div>

                      {/* Water & Septic Tank Position Rec */}
                      <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                        <div className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Droplet className="w-4 h-4" /> Water & Septic Tank Position
                        </div>
                        <div className="text-sm font-bold text-white">Water: {currentPlan.recommendations.waterTankPosition.location}</div>
                        <div className="text-xs text-slate-300">Septic Tank: {currentPlan.recommendations.septicTankPosition.location} ({currentPlan.recommendations.septicTankPosition.distanceFromFoundationFt}ft away)</div>
                        <p className="text-xs text-slate-400">{currentPlan.recommendations.septicTankPosition.whyRecommended}</p>
                      </div>

                      {/* Electrical & Plumbing Rec */}
                      <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                        <div className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Zap className="w-4 h-4" /> Electrical & Plumbing Layout
                        </div>
                        <div className="text-sm font-bold text-white">{currentPlan.recommendations.electricalLayout.circuits}</div>
                        <p className="text-xs text-slate-300">{currentPlan.recommendations.plumbingLayout.whyRecommended}</p>
                      </div>

                      {/* Color & Tiles Rec */}
                      <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                        <div className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Palette className="w-4 h-4" /> Color Palette & Tiles
                        </div>
                        <div className="text-sm font-bold text-white">{currentPlan.recommendations.colorTheme.paletteName}</div>
                        <p className="text-xs text-slate-300">{currentPlan.recommendations.tileSuggestions.whyRecommended}</p>
                      </div>
                    </div>
                  </div>

                  {/* Construction Timeline Phase Breakdown */}
                  <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 bg-slate-900/80">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                      <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Estimated Execution Timeline & Quality Checks</h3>
                        <p className="text-xs text-slate-400">Sequential construction phase scheduling with critical quality control checkpoints.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {currentPlan.timeline.map((phase, idx) => (
                        <div key={phase.id} className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                              0{idx + 1}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white mb-1">{phase.phaseName}</h4>
                              <p className="text-xs text-slate-300 mb-2">{phase.description}</p>
                              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                                {phase.qualityChecklist.map((chk, i) => (
                                  <span key={i} className="px-2.5 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                    {chk}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0 border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-6">
                            <div className="text-sm font-bold font-mono text-cyan-300">{phase.estimatedDays} Days</div>
                            <div className="text-[11px] text-slate-400">Est. Duration</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB: HOUSE PLANNING & 2D/3D */}
          {activeTab === 'house-planning' && currentPlan && (
            <motion.div
              key="house-planning"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div className="glass-card rounded-3xl p-8 border border-white/10 bg-slate-900/80">
                <h2 className="text-2xl font-bold text-white mb-2">Architectural House Planning & Spatial Layout</h2>
                <p className="text-xs text-slate-400 mb-6">In-depth spatial layout breakdown with Vastu guidelines, door-window clearances, and plumbing shaft positioning.</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Detailed 2D Blueprint */}
                  <div className="p-6 rounded-2xl bg-slate-950 border border-white/10">
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-blue-400" /> 2D Vector CAD Plan ({currentPlan.plotWidthFt}′ × {currentPlan.plotLengthFt}′)
                    </h3>
                    <div className="bg-slate-900 rounded-xl p-4 border border-white/10 min-h-[300px] flex items-center justify-center">
                      <svg viewBox="0 0 400 300" className="w-full h-auto">
                        <rect x="5" y="5" width="390" height="290" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,4" />
                        {currentPlan.floorPlan2DData?.rooms.map((rm, i) => (
                          <g key={i}>
                            <rect x={rm.x} y={rm.y} width={rm.w} height={rm.h} fill={rm.color} stroke="#60a5fa" strokeWidth="1.5" rx="3" />
                            <text x={rm.x + rm.w/2} y={rm.y + rm.h/2} fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">{rm.name}</text>
                          </g>
                        ))}
                      </svg>
                    </div>
                  </div>

                  {/* Spatial Principles */}
                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl bg-slate-950 border border-white/10">
                      <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">North-East Vastu Compliance</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">Entrance placed in North/North-East quadrant to capture positive early morning sunlight. Kitchen anchored in South-East (Agni corner) and Master Bedroom in South-West (Nairutya corner).</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-950 border border-white/10">
                      <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Clearance Passage Loops</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">3-foot clear walkway passage maintained along primary room axis. Furniture placed to eliminate awkward door swings or obstructed window access.</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-950 border border-white/10">
                      <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Plumbing Shaft Alignment</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">Bathroom and kitchen aligned along same vertical wall shaft to isolate noise and streamline drainage piping directly to septic tank.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: MATERIAL ESTIMATOR */}
          {activeTab === 'material-estimator' && currentPlan && (
            <motion.div
              key="material-estimator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div className="glass-card rounded-3xl p-8 border border-white/10 bg-slate-900/80">
                <h2 className="text-2xl font-bold text-white mb-2">Material Quantity Estimator</h2>
                <p className="text-xs text-slate-400 mb-6">Material quantities calculated using IS code consumption constants per sq.ft of built-up area.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentPlan.materials.map(mat => (
                    <div key={mat.id} className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{mat.name}</span>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 font-mono font-bold">{mat.quantity} {mat.unit}</span>
                      </div>
                      <div className="text-xs text-emerald-400 font-mono font-bold">Total Est: ₹{mat.totalCostINR.toLocaleString()} (@ ₹{mat.ratePerUnitINR}/{mat.unit})</div>
                      <p className="text-xs text-slate-300">{mat.purpose}</p>
                      
                      <div className="pt-2 border-t border-white/10 text-[11px] text-slate-400 space-y-1">
                        <div><strong className="text-slate-200">Why Used:</strong> {mat.whyUsed}</div>
                        <div><strong className="text-slate-200">Life Expectancy:</strong> {mat.lifeExpectancyYears}</div>
                        <div><strong className="text-amber-400">Cost Tip:</strong> {mat.costSavingTip}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: COST ESTIMATOR */}
          {activeTab === 'cost-estimator' && currentPlan && (
            <motion.div
              key="cost-estimator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div className="glass-card rounded-3xl p-8 border border-white/10 bg-slate-900/80">
                <h2 className="text-2xl font-bold text-white mb-2">Construction Cost Distribution Analysis</h2>
                <p className="text-xs text-slate-400 mb-6">Percentage cost breakdown across civil, finishing, MEP, interior, and contingency heads.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    {currentPlan.costBreakdown.map((cat, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                        <div className="flex items-center justify-between text-sm font-bold text-white">
                          <span>{cat.category}</span>
                          <span className="text-blue-400 font-mono">{cat.percentage}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${cat.percentage}%` }}></div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                          <span>{cat.description}</span>
                          <span className="font-mono text-emerald-400 font-bold">₹{cat.amountINR.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white mb-2">Budgeting Advice & Contingency Reserve</h3>
                      <p className="text-xs text-slate-300 leading-relaxed mb-4">Always reserve 5-7% of total funds for unforeseen material price fluctuations or site modifications during excavation.</p>
                      <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                        <li>Lock in cement & steel prices via advance bulk booking.</li>
                        <li>Maintain turnkey contractor milestones based on completion stage.</li>
                        <li>Ensure structural design approval before purchasing materials.</li>
                      </ul>
                    </div>

                    <div className="pt-6 border-t border-white/10 text-center">
                      <span className="text-xs text-slate-400">Total Projected Turnkey Investment</span>
                      <div className="text-3xl font-bold text-emerald-400 font-mono mt-1">₹{currentPlan.budgetINR.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: BUILDING KNOWLEDGE HUB */}
          {activeTab === 'building-knowledge' && (
            <motion.div
              key="building-knowledge"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div className="glass-card rounded-3xl p-8 border border-white/10 bg-slate-900/80">
                <h2 className="text-2xl font-bold text-white mb-2">Building Knowledge & Engineering Library</h2>
                <p className="text-xs text-slate-400 mb-6">Select any structural or finishing component to explore deep engineering rationale, advantages, life expectancy, maintenance, and budget options.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {guides.map(guide => (
                    <div 
                      key={guide.id}
                      onClick={() => openGuide(guide.slug)}
                      className="glass-card rounded-2xl p-6 border border-white/10 bg-slate-950/80 hover:border-blue-500/50 hover:scale-[1.02] transition-all cursor-pointer space-y-3"
                    >
                      <div className="h-40 rounded-xl overflow-hidden relative">
                        <img src={guide.coverImage} alt={guide.title} className="w-full h-full object-cover" />
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-blue-400 border border-blue-500/20">
                          {guide.category}
                        </div>
                      </div>
                      <h3 className="text-base font-bold text-white leading-snug">{guide.title}</h3>
                      <p className="text-xs text-slate-300 line-clamp-2">{guide.summary}</p>
                      <div className="flex items-center justify-between text-xs text-blue-400 pt-2 border-t border-white/10">
                        <span>Read Full Guide</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: TIMELINE */}
          {activeTab === 'timeline' && currentPlan && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div className="glass-card rounded-3xl p-8 border border-white/10 bg-slate-900/80">
                <h2 className="text-2xl font-bold text-white mb-2">Construction Execution Schedule</h2>
                <p className="text-xs text-slate-400 mb-6">Sequential project timeline with quality control checklists for each phase.</p>

                <div className="space-y-6">
                  {currentPlan.timeline.map((phase, idx) => (
                    <div key={phase.id} className="p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 font-mono text-xs font-bold flex items-center justify-center border border-blue-500/30">
                            {idx + 1}
                          </span>
                          <h3 className="text-base font-bold text-white">{phase.phaseName}</h3>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                          Duration: {phase.estimatedDays} Days
                        </span>
                      </div>

                      <p className="text-xs text-slate-300">{phase.description}</p>
                      <div className="text-xs text-slate-400"><strong className="text-slate-200">Why This Order:</strong> {phase.whyThisOrder}</div>

                      <div className="pt-2 border-t border-white/10 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-emerald-400">Quality Checks:</span>
                        {phase.qualityChecklist.map((chk, i) => (
                          <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-white/5 text-slate-200 border border-white/10 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {chk}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: BOQ GENERATOR */}
          {activeTab === 'boq-generator' && currentPlan && (
            <motion.div
              key="boq-generator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div className="glass-card rounded-3xl p-8 border border-white/10 bg-slate-900/80">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Bill of Quantities (BOQ) Official Estimate</h2>
                    <p className="text-xs text-slate-400">Official itemized schedule of quantities and cost rates for contractor tendering.</p>
                  </div>
                  <button onClick={() => window.print()} className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center gap-2">
                    <Printer className="w-4 h-4" /> Print / Export PDF
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div><span className="text-slate-400">Project:</span> <strong className="text-white block">{currentPlan.title}</strong></div>
                    <div><span className="text-slate-400">Location:</span> <strong className="text-white block">{currentPlan.location}</strong></div>
                    <div><span className="text-slate-400">Built-Up Area:</span> <strong className="text-white block">{currentPlan.builtUpAreaSqFt} sq.ft</strong></div>
                    <div><span className="text-slate-400">Date:</span> <strong className="text-white block">{new Date().toLocaleDateString()}</strong></div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider bg-white/5">
                          <th className="p-3">#</th>
                          <th className="p-3">Description of Item</th>
                          <th className="p-3">Quantity</th>
                          <th className="p-3">Unit Rate (₹)</th>
                          <th className="p-3 text-right">Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {currentPlan.materials.map((m, idx) => (
                          <tr key={m.id}>
                            <td className="p-3 font-mono">{idx + 1}</td>
                            <td className="p-3 font-medium text-white">{m.name}</td>
                            <td className="p-3 font-mono text-cyan-300">{m.quantity} {m.unit}</td>
                            <td className="p-3 font-mono">₹{m.ratePerUnitINR}</td>
                            <td className="p-3 font-mono text-emerald-400 font-bold text-right">₹{m.totalCostINR.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex justify-between items-center text-sm font-bold text-white">
                    <span>Total Estimated BOQ Value:</span>
                    <span className="text-xl font-mono text-emerald-400">₹{currentPlan.budgetINR.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: INTERIOR COST ESTIMATOR */}
          {activeTab === 'interior-cost' && currentPlan && (
            <motion.div
              key="interior-cost"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div className="glass-card rounded-3xl p-8 border border-white/10 bg-slate-900/80">
                <h2 className="text-2xl font-bold text-white mb-2">Interior Design Cost Estimator</h2>
                <p className="text-xs text-slate-400 mb-6">Room-by-room interior millwork, kitchen cabinets, false ceilings, and lighting budget breakdown.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2"><Sofa className="w-4 h-4 text-blue-400" /> Modular Kitchen & Dining</h3>
                    <p className="text-xs text-slate-300">L-shaped acrylic cabinets, quartz counter, tandem drawers & auto-clean chimney.</p>
                    <div className="text-sm font-bold text-emerald-400 font-mono pt-2">Est: ₹1,80,000 - ₹2,40,000</div>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2"><Sofa className="w-4 h-4 text-blue-400" /> Master Bedroom Wardrobes</h3>
                    <p className="text-xs text-slate-300">Full-height floor-to-ceiling floor wardrobes with HDMR inner laminate & soft-close hinges.</p>
                    <div className="text-sm font-bold text-emerald-400 font-mono pt-2">Est: ₹1,20,000 - ₹1,60,000</div>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2"><Sofa className="w-4 h-4 text-blue-400" /> False Ceiling & LED Cove</h3>
                    <p className="text-xs text-slate-300">Saint-Gobain gypsum false ceiling with warm white LED strip cove and COB spotlights.</p>
                    <div className="text-sm font-bold text-emerald-400 font-mono pt-2">Est: ₹65,000 - ₹95,000</div>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2"><Sofa className="w-4 h-4 text-blue-400" /> Bathroom Vanities & Glass Partition</h3>
                    <p className="text-xs text-slate-300">Wall-hung vanity cabinet, toughened glass shower partition & LED mirror.</p>
                    <div className="text-sm font-bold text-emerald-400 font-mono pt-2">Est: ₹45,000 - ₹70,000</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: EXTERIOR COST ESTIMATOR */}
          {activeTab === 'exterior-cost' && currentPlan && (
            <motion.div
              key="exterior-cost"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div className="glass-card rounded-3xl p-8 border border-white/10 bg-slate-900/80">
                <h2 className="text-2xl font-bold text-white mb-2">Exterior Elevation & Facade Cost Estimator</h2>
                <p className="text-xs text-slate-400 mb-6">Facade cladding panels, compound wall, main gate, and outdoor architectural lighting.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2"><Building2 className="w-4 h-4 text-cyan-400" /> Facade Cladding & Weather Paint</h3>
                    <p className="text-xs text-slate-300">Exterior HPL wood texture panels with Apex Ultima weather-shield silicone paint.</p>
                    <div className="text-sm font-bold text-emerald-400 font-mono pt-2">Est: ₹95,000 - ₹1,40,000</div>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2"><Building2 className="w-4 h-4 text-cyan-400" /> Glass Railings & Balcony</h3>
                    <p className="text-xs text-slate-300">12mm toughened glass balcony railing with stainless steel 304 grade top channel.</p>
                    <div className="text-sm font-bold text-emerald-400 font-mono pt-2">Est: ₹55,000 - ₹85,000</div>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2"><Building2 className="w-4 h-4 text-cyan-400" /> Compound Wall & Main Gate</h3>
                    <p className="text-xs text-slate-300">6ft brick compound wall with MS motorized sliding main gate & intercom system.</p>
                    <div className="text-sm font-bold text-emerald-400 font-mono pt-2">Est: ₹1,10,000 - ₹1,50,000</div>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2"><Building2 className="w-4 h-4 text-cyan-400" /> Architectural Outdoor Lighting</h3>
                    <p className="text-xs text-slate-300">IP65 waterproof warm white up-down exterior wall sconces & garden spike lights.</p>
                    <div className="text-sm font-bold text-emerald-400 font-mono pt-2">Est: ₹25,000 - ₹40,000</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: MODERN DESIGN GALLERY */}
          {activeTab === 'design-gallery' && (
            <motion.div
              key="design-gallery"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div className="glass-card rounded-3xl p-8 border border-white/10 bg-slate-900/80">
                <h2 className="text-2xl font-bold text-white mb-2">Modern Architectural Design Gallery</h2>
                <p className="text-xs text-slate-400 mb-6">Photorealistic 3D architectural renders, elevation concepts, and floor plan presets.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: 'Contemporary Glass & Wood Villa', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', category: '3D Exterior' },
                    { title: 'Minimalist Off-White Urban Residence', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', category: '3D Exterior' },
                    { title: 'Luxury Open-Plan Living & Dining', url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80', category: 'Interior' },
                    { title: 'Ergonomic Master Bedroom Design', url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80', category: 'Interior' },
                    { title: 'Acrylic Modular Kitchen Layout', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80', category: 'Interior' },
                    { title: 'Modern Anti-Skid Bathroom Suite', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80', category: 'Interior' }
                  ].map((img, i) => (
                    <div key={i} className="glass-card rounded-2xl overflow-hidden border border-white/10 bg-slate-950/80 group">
                      <div className="h-52 overflow-hidden relative">
                        <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-white border border-white/10">
                          {img.category}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-bold text-white">{img.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* DYNAMIC INDIVIDUAL STRUCTURAL GUIDES VIEW */}
          {guideNavItems.some(g => g.slug === activeTab) && currentGuide && (
            <motion.div
              key={currentGuide.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div className="glass-card rounded-3xl p-8 border border-white/10 bg-slate-900/80 space-y-8">
                {/* Guide Title & Cover */}
                <div className="relative rounded-2xl overflow-hidden h-64 border border-white/10">
                  <img src={currentGuide.coverImage} alt={currentGuide.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 mb-2 inline-block">
                      {currentGuide.category} Engineering Guide
                    </span>
                    <h2 className="text-3xl font-bold text-white mb-2">{currentGuide.title}</h2>
                    <p className="text-xs text-slate-300 max-w-3xl">{currentGuide.summary}</p>
                  </div>
                </div>

                {/* Educational Sections Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* WHY Used & WHY Recommended */}
                  <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
                    <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                      <Info className="w-4 h-4" /> Why Used & Engineering Rationale
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed"><strong className="text-white">Why Used:</strong> {currentGuide.whyUsed}</p>
                    <p className="text-xs text-slate-300 leading-relaxed"><strong className="text-white">Why Recommended:</strong> {currentGuide.whyRecommended}</p>
                  </div>

                  {/* Life Expectancy & Maintenance */}
                  <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Life Expectancy & Maintenance
                    </h3>
                    <div className="text-sm font-bold font-mono text-emerald-400">Life Expectancy: {currentGuide.lifeExpectancy}</div>
                    <p className="text-xs text-slate-300 leading-relaxed"><strong className="text-white">Maintenance Protocol:</strong> {currentGuide.maintenance}</p>
                  </div>

                  {/* Advantages */}
                  <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Key Advantages
                    </h3>
                    <ul className="text-xs text-slate-300 space-y-2">
                      {currentGuide.advantages.map((adv, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Disadvantages */}
                  <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
                    <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Disadvantages & Limitations
                    </h3>
                    <ul className="text-xs text-slate-300 space-y-2">
                      {currentGuide.disadvantages.map((dis, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span>{dis}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Premium vs Budget Options */}
                  <div className="p-6 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3 md:col-span-2">
                    <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <DollarSign className="w-4 h-4" /> Premium Option vs Budget Option
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/30">
                        <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider block mb-1">Premium Tier Option</span>
                        <div className="text-sm font-bold text-white mb-1">{currentGuide.premiumOption.name}</div>
                        <div className="text-xs text-emerald-400 font-mono font-bold mb-2">{currentGuide.premiumOption.costRange}</div>
                        <p className="text-xs text-slate-300">{currentGuide.premiumOption.advantages}</p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900 border border-white/10">
                        <span className="text-[10px] font-bold uppercase text-blue-400 tracking-wider block mb-1">Budget Value Option</span>
                        <div className="text-sm font-bold text-white mb-1">{currentGuide.budgetOption.name}</div>
                        <div className="text-xs text-cyan-300 font-mono font-bold mb-2">{currentGuide.budgetOption.costRange}</div>
                        <p className="text-xs text-slate-300">{currentGuide.budgetOption.advantages}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* MATERIAL RATIONALE MODAL */}
        {selectedMaterial && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setSelectedMaterial(null)}>
            <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-white/10 bg-slate-900 space-y-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-bold text-white">{selectedMaterial.name}</h3>
                <button onClick={() => setSelectedMaterial(null)} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">✕</button>
              </div>

              <div className="space-y-3 text-xs">
                <div><strong className="text-blue-400 block mb-1">Primary Purpose:</strong> <span className="text-slate-300">{selectedMaterial.purpose}</span></div>
                <div><strong className="text-cyan-400 block mb-1">Why Used:</strong> <span className="text-slate-300">{selectedMaterial.whyUsed}</span></div>
                <div><strong className="text-emerald-400 block mb-1">Life Expectancy:</strong> <span className="text-slate-200 font-mono">{selectedMaterial.lifeExpectancyYears}</span></div>
                <div><strong className="text-amber-400 block mb-1">Cost Saving Advice:</strong> <span className="text-slate-300">{selectedMaterial.costSavingTip}</span></div>
              </div>

              <div className="pt-4 border-t border-white/10 text-right">
                <button onClick={() => setSelectedMaterial(null)} className="px-5 py-2.5 rounded-xl font-medium text-xs text-white bg-blue-600 hover:bg-blue-500">
                  Close Details
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
