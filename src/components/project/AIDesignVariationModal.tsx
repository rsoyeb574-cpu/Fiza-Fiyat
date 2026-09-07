import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Wand2, 
  X, 
  Check, 
  RotateCcw, 
  Download, 
  Layers, 
  Sun, 
  Moon, 
  CloudSun, 
  Building, 
  Sliders, 
  Eye, 
  Loader2, 
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { Project } from '../../types';
import { BeforeAfterSlider } from '../common/BeforeAfterSlider';
import { useAuth } from '../../context/AuthContext';
import { usePlan } from '../../context/PlanContext';

interface AIDesignVariationModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  currentImage: string;
  onApplyVariationImage?: (newImageUrl: string) => void;
}

export type DesignStyleId = 'modernist' | 'minimalist' | 'industrial' | 'brutalist' | 'scandinavian' | 'custom';

interface StyleConfig {
  id: DesignStyleId;
  name: string;
  tagline: string;
  description: string;
  badgeColor: string;
  defaultMaterials: string[];
  lighting: string;
}

const STYLE_OPTIONS: StyleConfig[] = [
  {
    id: 'modernist',
    name: 'Modernist',
    tagline: 'Cantilevers & Continuous Glazing',
    description: 'Crisp horizontal cantilevered slabs, ribbon windows, expansive curtain walls, and refined white architectural concrete.',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    defaultMaterials: ['Low-E Glass Curtains', 'White Concrete', 'Black Aluminum Frames'],
    lighting: 'Crisp Daylight'
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    tagline: 'Monolithic Purity & Seamless Surfaces',
    description: 'Pure geometric volumes, concealed structural joints, seamless light micro-cement, subdued neutral tones, and hidden linear illumination.',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    defaultMaterials: ['Seamless Micro-Cement', 'Frameless Structural Glass', 'Honed Limestone'],
    lighting: 'Soft Diffuse Natural'
  },
  {
    id: 'industrial',
    name: 'Industrial',
    tagline: 'Exposed Steel & Reclaimed Brick',
    description: 'Blackened structural I-beams, textured dark reclaimed brickwork, Crittall steel grid windows, polished concrete, and weathered zinc accents.',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    defaultMaterials: ['Weathered Zinc Panels', 'Structural Black Steel', 'Reclaimed Dark Brick'],
    lighting: 'Dusk / Accent Warm Spotlighting'
  },
  {
    id: 'brutalist',
    name: 'Brutalist',
    tagline: 'Sculptural Board-Formed Massing',
    description: 'Monolithic board-marked raw concrete volumes, bold geometric overhangs, deep solar reveals, and tactile monolithic presence.',
    badgeColor: 'bg-stone-500/10 text-stone-300 border-stone-500/30',
    defaultMaterials: ['Board-Marked Concrete', 'Bronze Accents', 'Deep-Set Glazing'],
    lighting: 'Dramatic High-Contrast Shadow'
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian',
    tagline: 'Warm Timber Louvers & Nordic Calm',
    description: 'Vertical thermo-wood slats, pale Nordic oak cladding, biophilic green roof elements, and light-filled spatial serenity.',
    badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    defaultMaterials: ['Natural Timber Louvers', 'Nordic White Ash', 'Triple Glazing'],
    lighting: 'Golden Hour Dusk'
  }
];

const LIGHTING_PRESETS = [
  { id: 'Crisp Daylight', label: 'Crisp Daylight', icon: Sun },
  { id: 'Golden Hour Dusk', label: 'Golden Hour Sunset', icon: CloudSun },
  { id: 'Night Architectural', label: 'Night Illumination', icon: Moon }
];

export const AIDesignVariationModal: React.FC<AIDesignVariationModalProps> = ({
  isOpen,
  onClose,
  project,
  currentImage,
  onApplyVariationImage
}) => {
  const { user } = useAuth();
  const { refreshPlan } = usePlan();

  const [selectedStyle, setSelectedStyle] = useState<DesignStyleId>('modernist');
  const [customStyleName, setCustomStyleName] = useState('');
  const [selectedLighting, setSelectedLighting] = useState('Crisp Daylight');
  const [materialFocus, setMaterialFocus] = useState<string[]>(['Low-E Glass Curtains', 'White Concrete']);
  const [customPromptDetails, setCustomPromptDetails] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStage, setProgressStage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Results
  const [generatedVariation, setGeneratedVariation] = useState<string | null>(null);
  const [variationHistory, setVariationHistory] = useState<Array<{ style: string; imageUrl: string; timestamp: string }>>([]);
  const [appliedNotification, setAppliedNotification] = useState(false);

  // Update default materials when style changes
  useEffect(() => {
    const found = STYLE_OPTIONS.find(s => s.id === selectedStyle);
    if (found) {
      setMaterialFocus(found.defaultMaterials);
      setSelectedLighting(found.lighting);
    }
  }, [selectedStyle]);

  // Loading steps simulation
  useEffect(() => {
    let timer: any;
    if (isGenerating) {
      setProgressStage(1);
      timer = setInterval(() => {
        setProgressStage(prev => {
          if (prev < 4) return prev + 1;
          return prev;
        });
      }, 1600);
    } else {
      setProgressStage(0);
    }
    return () => clearInterval(timer);
  }, [isGenerating]);

  if (!isOpen) return null;

  const activeStyleConfig = STYLE_OPTIONS.find(s => s.id === selectedStyle);
  const effectiveStyleName = selectedStyle === 'custom' ? (customStyleName || 'Custom Architectural') : (activeStyleConfig?.name || 'Modernist');

  const handleToggleMaterial = (mat: string) => {
    setMaterialFocus(prev => 
      prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    const materialsText = materialFocus.length > 0 ? `prioritizing ${materialFocus.join(', ')}` : '';
    const lightingText = `under ${selectedLighting} illumination`;
    const promptComposition = `Re-render architectural imagery in distinctive ${effectiveStyleName} architectural design. ${materialsText}. ${lightingText}. ${customPromptDetails ? `Specific requirements: ${customPromptDetails}.` : ''} High-fidelity architectural render with realistic materials, environmental reflections, clean structural lines, and spatial depth.`;

    try {
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.uid || null,
          userEmail: user?.email || null,
          projectId: project.id,
          projectContext: `${project.title} - ${project.categoryId || 'Architecture'} located in ${project.location || 'Urban'}`,
          prompt: promptComposition,
          referenceImage: currentImage,
          style: effectiveStyleName,
          aspectRatio: '16:9',
          resolution: '1K'
        })
      });

      const data = await response.json();

      if (data.status === 'success' && data.data?.resultUrl) {
        const newUrl = data.data.resultUrl;
        setGeneratedVariation(newUrl);
        setVariationHistory(prev => [
          { style: effectiveStyleName, imageUrl: newUrl, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
          ...prev
        ]);
        if (refreshPlan) refreshPlan();
      } else if (data.status === 'error') {
        setError(data.message || data.error || 'Failed to generate variation. Please try another style or prompt.');
      } else {
        setError('The AI service returned an unexpected response. Please try again.');
      }
    } catch (err: any) {
      console.error('Error generating design variation:', err);
      setError(err.message || 'Network error communicating with AI variation service.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyToPage = () => {
    if (generatedVariation && onApplyVariationImage) {
      onApplyVariationImage(generatedVariation);
      setAppliedNotification(true);
      setTimeout(() => setAppliedNotification(false), 3000);
    }
  };

  const handleDownload = () => {
    if (!generatedVariation) return;
    const link = document.createElement('a');
    link.href = generatedVariation;
    link.download = `${project.slug || 'project'}-${effectiveStyleName.toLowerCase()}-variation.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-neutral-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>Generate Design Variation</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] uppercase font-bold tracking-wider">
                    AI Assistant
                  </span>
                </h3>
              </div>
              <p className="text-xs text-neutral-400">
                Re-render <strong className="text-white">{project.title}</strong> across architectural style parameters
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TOP SECTION: REFERENCE PREVIEW VS RESULT */}
          {generatedVariation ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-bold text-white">
                    Generated {effectiveStyleName} Variation
                  </span>
                  <span className="text-xs text-neutral-400">• Drag center divider to compare before & after</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleApplyToPage}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply to Project View</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-400" />
                    <span>Download HD</span>
                  </button>

                  <button
                    onClick={() => setGeneratedVariation(null)}
                    className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold text-xs flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Change Parameters</span>
                  </button>
                </div>
              </div>

              {appliedNotification && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Applied this variation to the active project gallery view! You can view it directly on the page.</span>
                </div>
              )}

              {/* Interactive Before/After Comparison */}
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <BeforeAfterSlider
                  beforeImage={currentImage}
                  afterImage={generatedVariation}
                  labelBefore="Original Project"
                  labelAfter={`${effectiveStyleName} AI Variation`}
                />
              </div>

              {/* Variation History Quick Switcher */}
              {variationHistory.length > 1 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-neutral-400">Session Variations:</span>
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {variationHistory.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setGeneratedVariation(item.imageUrl)}
                        className={`group relative rounded-xl overflow-hidden border-2 shrink-0 w-28 h-18 cursor-pointer transition-all ${
                          generatedVariation === item.imageUrl ? 'border-blue-500 scale-105' : 'border-white/10 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={item.imageUrl} alt={item.style} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                          <span className="text-[10px] text-white font-bold truncate">{item.style}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* CONFIGURATION FORM */
            <div className="space-y-6">
              
              {/* CURRENT REFERENCE IMAGE SUMMARY */}
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-neutral-950/60 border border-white/5">
                <img 
                  src={currentImage} 
                  alt={project.title} 
                  className="w-20 h-14 rounded-xl object-cover border border-white/10 shrink-0" 
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Base Project Image</span>
                    <span className="text-[10px] text-neutral-400">• Structural Geometry Reference</span>
                  </div>
                  <div className="text-xs text-neutral-300 font-semibold truncate">{project.title}</div>
                  <div className="text-[11px] text-neutral-500">
                    The AI will preserve core proportions and perspective while transforming style textures and materials.
                  </div>
                </div>
              </div>

              {/* 1. SELECT ARCHITECTURAL STYLE PARAMETER */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span>Choose Architectural Style Parameter</span>
                  </span>
                  <span className="text-[11px] font-normal text-neutral-400">Select preset or custom aesthetic</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {STYLE_OPTIONS.map((style) => {
                    const isSelected = selectedStyle === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setSelectedStyle(style.id)}
                        className={`p-4 rounded-2xl text-left border transition-all cursor-pointer space-y-2 flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-600/10 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                            : 'bg-neutral-950/50 border-white/5 text-neutral-300 hover:border-white/20 hover:bg-neutral-950'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-white">{style.name}</span>
                            {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                          </div>
                          <p className="text-[11px] font-medium text-blue-300/80">{style.tagline}</p>
                          <p className="text-[11px] text-neutral-400 leading-relaxed line-clamp-2">
                            {style.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1 pt-1">
                          {style.defaultMaterials.slice(0, 2).map((m, i) => (
                            <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-400 font-mono">
                              {m}
                            </span>
                          ))}
                        </div>
                      </button>
                    );
                  })}

                  {/* Custom Style Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedStyle('custom')}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer space-y-2 flex flex-col justify-between ${
                      selectedStyle === 'custom'
                        ? 'bg-blue-600/10 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                        : 'bg-neutral-950/50 border-white/5 text-neutral-300 hover:border-white/20 hover:bg-neutral-950'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">Custom Style</span>
                        {selectedStyle === 'custom' && <Check className="w-4 h-4 text-blue-400" />}
                      </div>
                      <p className="text-[11px] font-medium text-purple-300/80">User-Defined Aesthetic</p>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Specify unique architectural styles like Biophilic, Neo-Futuristic, Art Deco, or Japanese Wabi-Sabi.
                      </p>
                    </div>
                  </button>
                </div>

                {/* Custom Style Name Input */}
                {selectedStyle === 'custom' && (
                  <div className="p-4 rounded-2xl bg-neutral-950 border border-purple-500/30 space-y-2 animate-in fade-in">
                    <label className="text-xs font-bold text-purple-300">Custom Architectural Style Name</label>
                    <input
                      type="text"
                      value={customStyleName}
                      onChange={(e) => setCustomStyleName(e.target.value)}
                      placeholder="e.g. Neo-Futuristic Parametric Glass, Mediterranean Earth Plaster..."
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                )}
              </div>

              {/* 2. LIGHTING & ATMOSPHERE PARAMETER */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Atmospheric Lighting & Environment</span>
                  </span>
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {LIGHTING_PRESETS.map((lp) => {
                    const Icon = lp.icon;
                    const isSelected = selectedLighting === lp.id;
                    return (
                      <button
                        key={lp.id}
                        type="button"
                        onClick={() => setSelectedLighting(lp.id)}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500/50 text-white'
                            : 'bg-neutral-950/50 border-white/5 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-neutral-500'}`} />
                        <span className="text-xs font-medium">{lp.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. MATERIAL RE-SKIN PRIORITY */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Material Focus & Facade Palette</span>
                  </span>
                  <span className="text-[11px] font-normal text-neutral-400">Click to toggle materials</span>
                </label>

                <div className="flex flex-wrap gap-2">
                  {[
                    'Low-E Glass Curtains',
                    'White Concrete',
                    'Black Aluminum Frames',
                    'Seamless Micro-Cement',
                    'Frameless Structural Glass',
                    'Honed Limestone',
                    'Weathered Zinc Panels',
                    'Structural Black Steel',
                    'Reclaimed Dark Brick',
                    'Board-Marked Concrete',
                    'Natural Timber Louvers',
                    'Nordic White Ash'
                  ].map((mat) => {
                    const active = materialFocus.includes(mat);
                    return (
                      <button
                        key={mat}
                        type="button"
                        onClick={() => handleToggleMaterial(mat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                          active
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                            : 'bg-neutral-950/50 border-white/5 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {active && <Check className="w-3 h-3 text-emerald-400" />}
                        <span>{mat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. OPTIONAL PROMPT REFINEMENT */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-blue-400" />
                    <span>Additional Architectural Notes (Optional)</span>
                  </span>
                </label>
                <textarea
                  value={customPromptDetails}
                  onChange={(e) => setCustomPromptDetails(e.target.value)}
                  placeholder="e.g. Add an outdoor cantilevered wooden deck with recessed warm step lights and lush perimeter landscaping..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-neutral-950 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                />
              </div>

              {/* ERROR ALERT */}
              {error && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="block font-bold">Generation Issue</strong>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* PROGRESS STATE DISPLAY */}
              {isGenerating && (
                <div className="p-5 rounded-2xl bg-blue-950/30 border border-blue-500/30 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-300 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                      <span>Synthesizing {effectiveStyleName} Architectural Variation...</span>
                    </span>
                    <span className="text-blue-400 font-mono text-[11px]">Step {progressStage} of 4</span>
                  </div>

                  <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progressStage * 25, 95)}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-neutral-400 italic">
                    {progressStage === 1 && 'Analyzing structural massing, camera framing, and perspective...'}
                    {progressStage === 2 && `Synthesizing ${effectiveStyleName} material palette and facade systems...`}
                    {progressStage === 3 && `Simulating ${selectedLighting} environmental reflections and ambient shadows...`}
                    {progressStage >= 4 && 'Finalizing high-resolution architectural variation render...'}
                  </p>
                </div>
              )}

            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        {!generatedVariation && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-neutral-950/60 shrink-0">
            <div className="text-[11px] text-neutral-400 hidden sm:block">
              Selected Style: <strong className="text-white">{effectiveStyleName}</strong> • {selectedLighting}
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={isGenerating}
                className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Rendering Variation...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate {effectiveStyleName} Variation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
