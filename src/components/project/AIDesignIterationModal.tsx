import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Layers, 
  X, 
  Check, 
  RotateCcw, 
  Download, 
  Copy, 
  CheckCircle2, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  Building, 
  DollarSign, 
  Clock, 
  Leaf, 
  Maximize2, 
  FileText, 
  Sliders, 
  Wand2, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  Cpu, 
  Compass, 
  Image as ImageIcon,
  ExternalLink,
  ArrowLeftRight
} from 'lucide-react';
import { Project } from '../../types';
import { ArchitecturalDesignConcept, DesignIterationResponse } from '../../types/designIteration';
import { NormalizedProjectSpecs } from '../../utils/projectComparison';
import { useAuth } from '../../context/AuthContext';
import { usePlan } from '../../context/PlanContext';

interface AIDesignIterationModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  specs: NormalizedProjectSpecs;
  onApplyConcept?: (concept: ArchitecturalDesignConcept) => void;
  onConceptsGenerated?: (concepts: ArchitecturalDesignConcept[]) => void;
  onOpenBeforeAfter?: () => void;
}

const DIRECTIVE_OPTIONS = [
  {
    id: 'balanced',
    title: 'Strategic Spectrum',
    subtitle: '3 Distinct Structural Approaches',
    icon: Compass,
    color: 'from-blue-600/20 to-indigo-600/20 border-blue-500/40 text-blue-300'
  },
  {
    id: 'sustainable',
    title: 'Net-Zero & Biophilic',
    subtitle: 'Mass Timber & Low Carbon',
    icon: Leaf,
    color: 'from-emerald-600/20 to-teal-600/20 border-emerald-500/40 text-emerald-300'
  },
  {
    id: 'high_tech',
    title: 'Parametric & Steel',
    subtitle: 'Kinetic Facade & Open Spans',
    icon: Cpu,
    color: 'from-violet-600/20 to-purple-600/20 border-violet-500/40 text-violet-300'
  },
  {
    id: 'cost_optimized',
    title: 'Modular Cost-Optimized',
    subtitle: 'Value Engineered bays & Rapid Erection',
    icon: TrendingDown,
    color: 'from-amber-600/20 to-orange-600/20 border-amber-500/40 text-amber-300'
  },
  {
    id: 'minimalist_luxury',
    title: 'Monolithic Minimalist',
    subtitle: 'Pure volumes & Honed Stone',
    icon: Building,
    color: 'from-stone-600/20 to-neutral-600/20 border-stone-400/40 text-stone-300'
  }
];

export const AIDesignIterationModal: React.FC<AIDesignIterationModalProps> = ({
  isOpen,
  onClose,
  project,
  specs,
  onApplyConcept,
  onConceptsGenerated,
  onOpenBeforeAfter
}) => {
  const { user } = useAuth();
  const { refreshPlan } = usePlan();

  // State
  const [selectedDirective, setSelectedDirective] = useState<string>('balanced');
  const [customRequirements, setCustomRequirements] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  // Iteration Results
  const [iterationResponse, setIterationResponse] = useState<DesignIterationResponse | null>(null);
  const [activeConceptIndex, setActiveConceptIndex] = useState<number>(0);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [copiedBrief, setCopiedBrief] = useState<boolean>(false);

  // In-concept image rendering states
  const [renderingImageConceptId, setRenderingImageConceptId] = useState<string | null>(null);
  const [conceptRenderedImages, setConceptRenderedImages] = useState<Record<string, string>>({});
  const [renderError, setRenderError] = useState<string | null>(null);

  // Step loading simulation
  useEffect(() => {
    let timer: any;
    if (isGenerating) {
      setGenerationStep(1);
      timer = setInterval(() => {
        setGenerationStep(prev => (prev < 4 ? prev + 1 : prev));
      }, 1500);
    } else {
      setGenerationStep(1);
    }
    return () => clearInterval(timer);
  }, [isGenerating]);

  if (!isOpen) return null;

  const handleGenerateIterations = async () => {
    setIsGenerating(true);
    setError(null);
    setRenderError(null);

    try {
      const response = await fetch('/api/project/design-iterations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          projectTitle: project.title,
          categoryName: project.categoryName,
          clientName: project.clientName,
          location: project.location,
          currentSpecs: {
            estimatedCost: specs.estimatedCost,
            area: specs.area,
            structuralType: specs.structuralType,
            floors: specs.floors,
            energyRating: specs.energyRating,
            bimLevel: specs.bimLevel,
            materials: specs.materials,
            softwareUsed: specs.softwareUsed
          },
          projectDescription: project.description,
          iterationDirective: selectedDirective,
          customRequirements: customRequirements.trim(),
          referenceImageUrl: project.coverImage || project.images?.[0],
          userId: user?.uid || null,
          userEmail: user?.email || null
        })
      });

      const data: DesignIterationResponse = await response.json();

      if (data.status === 'success' && data.concepts && data.concepts.length > 0) {
        setIterationResponse(data);
        setActiveConceptIndex(0);
        onConceptsGenerated?.(data.concepts);
        if (refreshPlan) refreshPlan();
      } else {
        setError(data.message || data.error || 'Failed to synthesize architectural iterations.');
      }
    } catch (err: any) {
      console.error('Error generating design iterations:', err);
      setError(err.message || 'Network error communicating with Gemini architectural engine.');
    } finally {
      setIsGenerating(false);
    }
  };

  const currentConcept: ArchitecturalDesignConcept | undefined = 
    iterationResponse?.concepts?.[activeConceptIndex];

  // Render Visual Architectural Image for a Concept
  const handleRenderConceptImage = async (concept: ArchitecturalDesignConcept) => {
    if (renderingImageConceptId) return;
    setRenderingImageConceptId(concept.id);
    setRenderError(null);

    try {
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.uid || null,
          userEmail: user?.email || null,
          projectId: project.id,
          projectContext: `${project.title} - ${concept.conceptName} architectural iteration in ${concept.architecturalStyle}`,
          prompt: concept.visualRenderPrompt,
          referenceImage: project.coverImage || project.images?.[0],
          style: concept.architecturalStyle,
          aspectRatio: '16:9',
          resolution: '1K'
        })
      });

      const data = await response.json();

      if (data.status === 'success' && data.data?.resultUrl) {
        setConceptRenderedImages(prev => ({
          ...prev,
          [concept.id]: data.data.resultUrl
        }));
        if (refreshPlan) refreshPlan();
      } else {
        setRenderError(data.message || data.error || 'Unable to generate visual render.');
      }
    } catch (err: any) {
      console.error('Error rendering concept visual:', err);
      setRenderError(err.message || 'Failed to generate visual render for concept.');
    } finally {
      setRenderingImageConceptId(null);
    }
  };

  const handleCopyPrompt = (concept: ArchitecturalDesignConcept) => {
    navigator.clipboard.writeText(concept.visualRenderPrompt);
    setCopiedPromptId(concept.id);
    setTimeout(() => setCopiedPromptId(null), 2500);
  };

  const handleCopyFullBrief = () => {
    if (!currentConcept) return;
    const briefText = `# ARCHITECTURAL DESIGN ITERATION BRIEF: ${currentConcept.conceptName}
Project: ${project.title} (${project.categoryName})
Base Scale: ${specs.area} | Base Budget: ${specs.estimatedCost} | Baseline Structure: ${specs.structuralType}

## SCHEME OVERVIEW
- Scheme: ${currentConcept.schemeLetter}
- Style: ${currentConcept.architecturalStyle}
- Tagline: ${currentConcept.tagline}

## DESIGN PHILOSOPHY & SPATIAL NARRATIVE
${currentConcept.designPhilosophy}

## SPATIAL MASSING STRATEGY
${currentConcept.spatialMassingStrategy}

## STRUCTURAL ENGINEERING & ENVELOPE
- Structural System: ${currentConcept.structuralEngineeringSystem}
- Facade & Building Envelope: ${currentConcept.facadeAndEnvelope}
- Material Palette: ${currentConcept.materialPalette.join(', ')}

## PARAMETER COMPARISON VS BASELINE
- Estimated Cost Impact: ${currentConcept.parameterComparison.estimatedCostVariance}
- Cost Rationale: ${currentConcept.parameterComparison.costRationale}
- Timeline Impact: ${currentConcept.parameterComparison.constructionTimelineVariance}
- Energy & Sustainability Rating: ${currentConcept.parameterComparison.energyAndSustainabilityRating}
- Usable Floor Area Impact: ${currentConcept.parameterComparison.usableAreaImpact}

## KEY ADVANTAGES
${currentConcept.keyAdvantages.map(adv => `- ${adv}`).join('\n')}

## CONSIDERATIONS & TRADEOFFS
${currentConcept.potentialTradeoffs.map(t => `- ${t}`).join('\n')}

## REGULATORY & BIM WORKFLOW
- Code & Zoning: ${currentConcept.buildingCodeAndZoningNotes}
- Recommended BIM Pipeline: ${currentConcept.recommendedBimWorkflow}

Generated by FIZA FIYAT Gemini Architectural Studio
`;
    navigator.clipboard.writeText(briefText);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-6xl rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-neutral-950/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-600/30 via-indigo-600/30 to-blue-600/30 text-purple-300 border border-purple-500/40 shadow-inner">
              <Sparkles className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                  <span>Generate Design Iteration</span>
                  <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 text-purple-300 text-[10px] uppercase font-extrabold tracking-wider">
                    Gemini AI
                  </span>
                </h3>
              </div>
              <p className="text-xs text-neutral-400">
                Synthesize alternative architectural design concepts based on <strong className="text-white">{project.title}</strong> parameters
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

        {/* CURRENT PARAMETERS BAR */}
        <div className="bg-neutral-950/80 px-6 py-3 border-b border-white/10 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-neutral-400">
              <Building className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-neutral-300">Active Baseline:</span>
              <span className="text-white font-bold">{project.title}</span>
              <span className="text-neutral-500">•</span>
              <span className="text-blue-400 font-medium">{project.categoryName}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="px-2.5 py-1 rounded-xl bg-neutral-900 border border-white/10 text-neutral-300 text-[11px] font-medium">
                Area: <strong className="text-white">{specs.area}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-neutral-900 border border-white/10 text-neutral-300 text-[11px] font-medium">
                Budget: <strong className="text-emerald-400">{specs.estimatedCost}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-neutral-900 border border-white/10 text-neutral-300 text-[11px] font-medium">
                Structure: <strong className="text-white">{specs.structuralType}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-neutral-900 border border-white/10 text-neutral-300 text-[11px] font-medium">
                Levels: <strong className="text-white">{specs.floors}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* MODAL CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TOP CONTROLS: DIRECTIVE SELECTION & GENERATION TRIGGER */}
          <div className="p-5 rounded-3xl bg-neutral-950/60 border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-purple-400" />
                  <span>Iteration Strategic Directive</span>
                </h4>
                <p className="text-[11px] text-neutral-400">
                  Select an architectural priority to steer Gemini's conceptual generation
                </p>
              </div>

              {iterationResponse && (
                <button
                  onClick={() => setIterationResponse(null)}
                  className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Configure New Query</span>
                </button>
              )}
            </div>

            {/* Strategic Directive Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {DIRECTIVE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedDirective === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedDirective(opt.id)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-600/15 ring-1 ring-purple-500/40'
                        : 'bg-neutral-900/60 border-white/5 text-neutral-400 hover:text-white hover:bg-neutral-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-purple-300' : 'text-neutral-500'}`} />
                      {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white leading-tight">{opt.title}</div>
                      <div className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">{opt.subtitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Optional Architect Requirements */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-semibold text-neutral-300 flex items-center justify-between">
                <span>Specific Architectural Requirements or Site Constraints (Optional):</span>
                <span className="text-[10px] text-neutral-500">e.g. earthquake resistance, central water feature, double-height studio</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customRequirements}
                  onChange={(e) => setCustomRequirements(e.target.value)}
                  placeholder="e.g. Prioritize cantilevered balconies, integrated solar PV roof, and natural cross-ventilation stack effect..."
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-neutral-900 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={handleGenerateIterations}
                  disabled={isGenerating}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/25 cursor-pointer disabled:opacity-50 shrink-0 transition-all"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Concepts...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-purple-200" />
                      <span>Generate Design Iterations</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Progress State During Generation */}
            {isGenerating && (
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-purple-300 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                    <span>Gemini is synthesizing 3 architectural design concepts...</span>
                  </span>
                  <span className="text-purple-400 font-mono text-[11px]">Step {generationStep} of 4</span>
                </div>

                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(generationStep * 25, 95)}%` }}
                  />
                </div>

                <p className="text-[11px] text-neutral-400 italic">
                  {generationStep === 1 && `Evaluating current baseline: ${specs.area} floor plate, ${specs.estimatedCost} target budget...`}
                  {generationStep === 2 && `Formulating distinct massing geometries, structural cores, and solar orientations...`}
                  {generationStep === 3 && `Calculating realistic cost variance, schedule deltas, and embodied carbon indices...`}
                  {generationStep >= 4 && `Finalizing architectural specifications, BIM workflows, and render prompts...`}
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="block font-bold">Generation Issue</strong>
                  <span>{error}</span>
                </div>
              </div>
            )}
          </div>

          {/* RESULTS DISPLAY: 3 CONCEPTS COMPARISON & SELECTION */}
          {iterationResponse && iterationResponse.concepts && iterationResponse.concepts.length > 0 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Concept Tabs Navigation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    Generated Alternative Schemes ({iterationResponse.concepts.length})
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Click a scheme to inspect full structural & architectural parameters
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {iterationResponse.concepts.map((concept, idx) => {
                    const isActive = activeConceptIndex === idx;
                    const schemeAccent = 
                      idx === 0 ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' :
                      idx === 1 ? 'border-violet-500/40 text-violet-400 bg-violet-500/10' :
                      'border-amber-500/40 text-amber-400 bg-amber-500/10';

                    return (
                      <button
                        key={concept.id || idx}
                        type="button"
                        onClick={() => setActiveConceptIndex(idx)}
                        className={`p-4 rounded-2xl text-left border transition-all cursor-pointer relative flex flex-col justify-between space-y-3 ${
                          isActive
                            ? 'bg-neutral-900 border-purple-500 shadow-xl shadow-purple-950/50 ring-2 ring-purple-500/30'
                            : 'bg-neutral-950/60 border-white/10 hover:border-white/20 hover:bg-neutral-900/60 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${schemeAccent}`}>
                              Scheme {concept.schemeLetter}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                              {concept.parameterComparison.estimatedCostVariance}
                            </span>
                          </div>

                          <div>
                            <h5 className="text-sm font-bold text-white line-clamp-1">{concept.conceptName}</h5>
                            <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                              {concept.tagline}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-neutral-400">
                          <span className="truncate max-w-[150px]">{concept.architecturalStyle}</span>
                          <span className="text-purple-400 font-semibold flex items-center gap-1">
                            Inspect <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ACTIVE SCHEME DETAILED SPECIFICATION CARD */}
              {currentConcept && (
                <div className="p-6 sm:p-8 rounded-3xl bg-neutral-950/80 border border-white/10 shadow-2xl space-y-6">
                  
                  {/* SCHEME HERO HEADER */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 text-xs font-extrabold">
                          SCHEME {currentConcept.schemeLetter}
                        </span>
                        <span className="px-3 py-1 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                          {currentConcept.architecturalStyle}
                        </span>
                      </div>
                      <h4 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                        {currentConcept.conceptName}
                      </h4>
                      <p className="text-xs sm:text-sm font-medium text-purple-300/90">
                        {currentConcept.tagline}
                      </p>
                    </div>

                    {/* Quick Brief Copy / Export Actions */}
                    <div className="flex items-center gap-2 self-start lg:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={handleCopyFullBrief}
                        className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                        title="Copy complete architectural specification brief to clipboard"
                      >
                        {copiedBrief ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Brief Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-neutral-400" />
                            <span>Copy Full Brief</span>
                          </>
                        )}
                      </button>

                      {onOpenBeforeAfter && (
                        <button
                          type="button"
                          onClick={() => {
                            onOpenBeforeAfter();
                            onClose();
                          }}
                          className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                          title="Open interactive Before/After comparator between Original Concept and this AI Scheme"
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5 text-purple-400" />
                          <span>Compare Before/After</span>
                        </button>
                      )}

                      {onApplyConcept && (
                        <button
                          type="button"
                          onClick={() => {
                            onApplyConcept(currentConcept);
                            onClose();
                          }}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/20 cursor-pointer transition-all"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Adopt Scheme</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 1. PARAMETER DELTA COMPARISON METRICS */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-blue-400" />
                      <span>Parameter Variations vs. Current Baseline</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {/* Cost Delta */}
                      <div className="p-4 rounded-2xl bg-neutral-900/90 border border-white/10 space-y-1">
                        <div className="flex items-center justify-between text-xs text-neutral-400">
                          <span>Cost Variance</span>
                          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <div className="text-base font-extrabold text-emerald-400">
                          {currentConcept.parameterComparison.estimatedCostVariance}
                        </div>
                        <p className="text-[10px] text-neutral-400 leading-tight">
                          {currentConcept.parameterComparison.costRationale}
                        </p>
                      </div>

                      {/* Schedule Delta */}
                      <div className="p-4 rounded-2xl bg-neutral-900/90 border border-white/10 space-y-1">
                        <div className="flex items-center justify-between text-xs text-neutral-400">
                          <span>Timeline Variance</span>
                          <Clock className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                        <div className="text-base font-extrabold text-blue-400">
                          {currentConcept.parameterComparison.constructionTimelineVariance}
                        </div>
                        <p className="text-[10px] text-neutral-400 leading-tight">
                          Impact on overall mobilization & construction sequence
                        </p>
                      </div>

                      {/* Sustainability / Energy */}
                      <div className="p-4 rounded-2xl bg-neutral-900/90 border border-white/10 space-y-1">
                        <div className="flex items-center justify-between text-xs text-neutral-400">
                          <span>Energy & Carbon</span>
                          <Leaf className="w-3.5 h-3.5 text-teal-400" />
                        </div>
                        <div className="text-sm font-extrabold text-teal-300 line-clamp-1">
                          {currentConcept.parameterComparison.energyAndSustainabilityRating}
                        </div>
                        <p className="text-[10px] text-neutral-400 leading-tight">
                          LEED / passivhaus orientation & operational energy impact
                        </p>
                      </div>

                      {/* Usable Area */}
                      <div className="p-4 rounded-2xl bg-neutral-900/90 border border-white/10 space-y-1">
                        <div className="flex items-center justify-between text-xs text-neutral-400">
                          <span>Net Usable Area</span>
                          <Maximize2 className="w-3.5 h-3.5 text-purple-400" />
                        </div>
                        <div className="text-base font-extrabold text-purple-300">
                          {currentConcept.parameterComparison.usableAreaImpact}
                        </div>
                        <p className="text-[10px] text-neutral-400 leading-tight">
                          Efficiency gained via perimeter column & wall optimization
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 2. DESIGN PHILOSOPHY & MASSING STRATEGY */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 rounded-2xl bg-neutral-900/60 border border-white/5 space-y-2.5">
                      <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span>Design Philosophy & Spatial Narrative</span>
                      </h5>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {currentConcept.designPhilosophy}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-neutral-900/60 border border-white/5 space-y-2.5">
                      <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-blue-400" />
                        <span>Spatial Massing Strategy</span>
                      </h5>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {currentConcept.spatialMassingStrategy}
                      </p>
                    </div>
                  </div>

                  {/* 3. STRUCTURAL SYSTEM, ENVELOPE & MATERIALS */}
                  <div className="p-5 rounded-2xl bg-neutral-900/60 border border-white/5 space-y-4">
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Structural Engineering & Enclosure Systems</span>
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-neutral-400 font-semibold block mb-1">Structural Framing Core:</span>
                        <p className="text-white font-medium bg-neutral-950 p-3 rounded-xl border border-white/5 leading-relaxed">
                          {currentConcept.structuralEngineeringSystem}
                        </p>
                      </div>

                      <div>
                        <span className="text-neutral-400 font-semibold block mb-1">Facade & Thermal Envelope:</span>
                        <p className="text-white font-medium bg-neutral-950 p-3 rounded-xl border border-white/5 leading-relaxed">
                          {currentConcept.facadeAndEnvelope}
                        </p>
                      </div>
                    </div>

                    {/* Material Palette Chips */}
                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                        Specified Material Palette:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {currentConcept.materialPalette.map((material, mIdx) => (
                          <span
                            key={mIdx}
                            className="px-3 py-1 rounded-xl bg-neutral-950 border border-white/10 text-neutral-200 text-xs font-medium flex items-center gap-1.5"
                          >
                            <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                            <span>{material}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 4. ADVANTAGES VS TRADEOFFS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2.5">
                      <h5 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Key Advantages ({currentConcept.keyAdvantages.length})</span>
                      </h5>
                      <ul className="space-y-2 text-xs text-neutral-300">
                        {currentConcept.keyAdvantages.map((adv, aIdx) => (
                          <li key={aIdx} className="flex items-start gap-2">
                            <span className="text-emerald-400 mt-0.5">•</span>
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-2.5">
                      <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                        <span>Considerations & Trade-offs</span>
                      </h5>
                      <ul className="space-y-2 text-xs text-neutral-300">
                        {currentConcept.potentialTradeoffs.map((tro, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-2">
                            <span className="text-amber-400 mt-0.5">•</span>
                            <span>{tro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 5. CODES & BIM PIPELINE */}
                  <div className="p-4 rounded-2xl bg-neutral-900/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-300">
                    <div className="space-y-0.5">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                        <span>Code & Zoning Notes:</span>
                      </span>
                      <span className="text-neutral-400">{currentConcept.buildingCodeAndZoningNotes}</span>
                    </div>

                    <div className="space-y-0.5 sm:text-right shrink-0">
                      <span className="font-bold text-white block">Recommended BIM Workflow:</span>
                      <span className="text-purple-300 font-mono text-[11px]">{currentConcept.recommendedBimWorkflow}</span>
                    </div>
                  </div>

                  {/* 6. VISUAL RENDERING STUDIO FOR THIS CONCEPT */}
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-neutral-950 border border-purple-500/30 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <h5 className="text-sm font-bold text-white flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-purple-300" />
                          <span>AI Visual Concept Render Studio</span>
                        </h5>
                        <p className="text-xs text-neutral-400">
                          Synthesize a photorealistic rendering for Scheme {currentConcept.schemeLetter} using the AI render engine
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyPrompt(currentConcept)}
                          className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 border border-white/10 cursor-pointer transition-all"
                          title="Copy visualization prompt for Midjourney / Stable Diffusion"
                        >
                          {copiedPromptId === currentConcept.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Prompt Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-neutral-400" />
                              <span>Copy Render Prompt</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRenderConceptImage(currentConcept)}
                          disabled={renderingImageConceptId === currentConcept.id}
                          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-600/30 cursor-pointer transition-all disabled:opacity-50"
                        >
                          {renderingImageConceptId === currentConcept.id ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Synthesizing Render...</span>
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-3.5 h-3.5" />
                              <span>{conceptRenderedImages[currentConcept.id] ? 'Re-Render Image' : 'Render Visual Concept'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Display Rendered Concept Image if available */}
                    {conceptRenderedImages[currentConcept.id] ? (
                      <div className="space-y-3 pt-2">
                        <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl max-h-[420px] group">
                          <img
                            src={conceptRenderedImages[currentConcept.id]}
                            alt={currentConcept.conceptName}
                            className="w-full h-full object-cover max-h-[420px]"
                          />
                          <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                            Scheme {currentConcept.schemeLetter} • {currentConcept.architecturalStyle}
                          </div>
                          <a
                            href={conceptRenderedImages[currentConcept.id]}
                            download={`${project.slug || 'project'}-scheme-${currentConcept.schemeLetter.toLowerCase()}.png`}
                            className="absolute bottom-3 right-3 px-3.5 py-2 rounded-xl bg-black/80 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20 shadow-xl transition-all"
                          >
                            <Download className="w-3.5 h-3.5 text-blue-400" />
                            <span>Download Render</span>
                          </a>
                        </div>
                      </div>
                    ) : (
                      /* Prompt Preview */
                      <div className="p-3.5 rounded-xl bg-neutral-950 border border-white/5 space-y-1">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                          Generated Architectural Visualization Prompt:
                        </span>
                        <p className="text-xs text-neutral-300 font-mono leading-relaxed line-clamp-2">
                          "{currentConcept.visualRenderPrompt}"
                        </p>
                      </div>
                    )}

                    {renderError && (
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{renderError}</span>
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-neutral-950/70 shrink-0">
          <div className="text-[11px] text-neutral-400 hidden sm:block">
            Powered by <strong className="text-white">Gemini 3.8 Flash</strong> • Multidisciplinary Architectural Optimization
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold cursor-pointer"
            >
              Close
            </button>

            {!iterationResponse && (
              <button
                type="button"
                onClick={handleGenerateIterations}
                disabled={isGenerating}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer disabled:opacity-50 transition-all"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Concepts...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-purple-200" />
                    <span>Generate Design Iterations</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
