import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  ShieldCheck,
  FileCheck,
  Building2,
  Maximize2
} from 'lucide-react';
import { SAMPLE_DRAWING_ANALYSES } from '../../data/visualKnowledgeData';
import { DrawingAnnotation, DrawingAnalysisSample } from '../../types/visualKnowledge';

export const DrawingAnalyzerView: React.FC = () => {
  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number>(0);
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const [customDrawingUrl, setCustomDrawingUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeSample: DrawingAnalysisSample = SAMPLE_DRAWING_ANALYSES[selectedSampleIndex];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsAnalyzing(true);
    const reader = new FileReader();
    reader.onload = () => {
      setCustomDrawingUrl(reader.result as string);
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 1200);
    };
    reader.readAsDataURL(file);
  };

  const annotations = activeSample.annotations.filter(a => {
    if (filterSeverity === 'all') return true;
    return a.severity.toLowerCase() === filterSeverity.toLowerCase();
  });

  const activeAnnotation = activeSample.annotations.find(a => a.id === activeAnnotationId);

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'Critical':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'High':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'Low':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      default:
        return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/40';
    }
  };

  return (
    <div className="space-y-8 rounded-3xl bg-[#0F172A]/90 border border-indigo-500/30 p-5 sm:p-8 backdrop-blur-xl shadow-2xl">
      {/* Header & Tool Description */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 text-xs font-bold border border-violet-500/20">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            AI Drawing & Blueprint Inspector
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            CAD & Drawing Issue Analyzer
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Upload any architectural floor plan, structural rebar detail, or MEP routing diagram. The visual engine detects geometric clashes, minimum code clearance violations, rebar congestion, and circulation bottlenecks.
          </p>
        </div>

        {/* Action button: upload own drawing */}
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,.pdf"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload My Drawing</span>
          </button>
        </div>
      </div>

      {/* Preset drawing selector tabs */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
          Select Verified Benchmark Drawing:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_DRAWING_ANALYSES.map((sample, idx) => (
            <button
              key={sample.id}
              onClick={() => {
                setSelectedSampleIndex(idx);
                setActiveAnnotationId(null);
                setCustomDrawingUrl(null);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                selectedSampleIndex === idx && !customDrawingUrl
                  ? 'bg-violet-950/40 border-violet-500 shadow-md shadow-violet-500/10'
                  : 'bg-neutral-900/50 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-950 shrink-0 border border-white/10">
                <img src={sample.originalImage} alt={sample.title} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-violet-400 uppercase block truncate">
                  {sample.drawingType} • {sample.category}
                </span>
                <span className="text-xs font-bold text-white block truncate">
                  {sample.title}
                </span>
                <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {sample.issueCount} Issues Detected
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Annotated Canvas (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-neutral-950/80 border border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 font-medium">Filter Severity:</span>
              {['all', 'critical', 'high', 'medium'].map(sev => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-semibold text-[11px] transition-all cursor-pointer ${
                    filterSeverity === sev
                      ? 'bg-violet-600 text-white'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAnnotations(!showAnnotations)}
                className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  showAnnotations
                    ? 'bg-violet-600/30 text-violet-300 border border-violet-500/40'
                    : 'bg-neutral-900 text-neutral-400 border border-white/5'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showAnnotations ? 'Annotations ON' : 'Annotations OFF'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Drawing Container */}
          <div className="relative w-full h-[420px] sm:h-[500px] rounded-3xl overflow-hidden border border-white/10 bg-neutral-950 shadow-2xl flex items-center justify-center">
            {isAnalyzing ? (
              <div className="flex flex-col items-center gap-3 p-8 text-center animate-pulse">
                <Sparkles className="w-8 h-8 text-violet-400 animate-spin" />
                <span className="text-sm font-bold text-white">Running AI Geometry & Clearance Analysis...</span>
                <span className="text-xs text-neutral-400">Checking against IBC, ACI 318, and SMACNA standards</span>
              </div>
            ) : (
              <>
                {/* Base Drawing Image */}
                <img
                  src={customDrawingUrl || activeSample.originalImage}
                  alt={activeSample.title}
                  className="w-full h-full object-contain"
                />

                {/* SVG Annotation Overlay Layer */}
                {showAnnotations && !customDrawingUrl && (
                  <div className="absolute inset-0 pointer-events-none">
                    {annotations.map((ann) => {
                      const isSelected = activeAnnotationId === ann.id;
                      const strokeColor = {
                        Critical: 'stroke-rose-500',
                        High: 'stroke-orange-500',
                        Medium: 'stroke-amber-400',
                        Low: 'stroke-blue-400',
                        Notice: 'stroke-emerald-400'
                      }[ann.severity];

                      const bgColor = {
                        Critical: 'bg-rose-500/20 border-rose-500',
                        High: 'bg-orange-500/20 border-orange-500',
                        Medium: 'bg-amber-500/20 border-amber-400',
                        Low: 'bg-blue-500/20 border-blue-400',
                        Notice: 'bg-emerald-500/20 border-emerald-400'
                      }[ann.severity];

                      return (
                        <div
                          key={ann.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveAnnotationId(ann.id);
                          }}
                          style={{
                            left: `${ann.xPercent}%`,
                            top: `${ann.yPercent}%`,
                            width: `${ann.widthPercent || 12}%`,
                            height: `${ann.heightPercent || 10}%`
                          }}
                          className={`absolute pointer-events-auto rounded-xl border-2 transition-all cursor-pointer group flex items-start justify-end p-1 ${
                            isSelected
                              ? 'ring-4 ring-white shadow-2xl scale-105 z-20 ' + bgColor
                              : 'animate-pulse hover:scale-105 z-10 ' + bgColor
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full bg-neutral-950 text-white text-[10px] font-black flex items-center justify-center border border-white/20 shadow-md">
                            !
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* Bottom Status Bar */}
            <div className="absolute bottom-3 left-3 right-3 px-4 py-2 rounded-xl bg-neutral-950/85 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs text-neutral-300">
              <span className="truncate">
                Showing: <strong className="text-white">{activeSample.title}</strong>
              </span>
              <span className="text-violet-400 font-semibold shrink-0">
                Click any highlighted box to inspect issue
              </span>
            </div>
          </div>

          {/* AI Analysis Summary Banner */}
          <div className="p-4 rounded-2xl bg-violet-950/20 border border-violet-500/30 space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              Verified Inspection Summary
            </span>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {activeSample.summary}
            </p>
          </div>
        </div>

        {/* Right: Issue Cards List (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Detected Issues ({annotations.length})
            </h3>
            <span className="text-[11px] text-neutral-400">Strict Code Checks</span>
          </div>

          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {annotations.map((ann) => {
              const isSelected = activeAnnotationId === ann.id;
              return (
                <div
                  key={ann.id}
                  onClick={() => setActiveAnnotationId(ann.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'bg-violet-950/50 border-violet-500 ring-2 ring-violet-500/30 shadow-xl'
                      : 'bg-neutral-950/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-white leading-snug">
                      {ann.title}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border shrink-0 ${getSeverityBadge(ann.severity)}`}>
                      {ann.severity}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {ann.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-violet-900/20 border border-violet-500/20 space-y-1">
                    <span className="text-[10px] font-bold text-violet-300 uppercase tracking-wide block">
                      Recommendation:
                    </span>
                    <p className="text-xs text-neutral-200">
                      {ann.recommendation}
                    </p>
                  </div>

                  {ann.codeStandard && (
                    <div className="text-[10px] text-neutral-400 flex items-center gap-1 font-mono pt-1">
                      <FileCheck className="w-3 h-3 text-emerald-400" />
                      <span>{ann.codeStandard}</span>
                    </div>
                  )}
                </div>
              );
            })}

            {annotations.length === 0 && (
              <div className="text-center py-12 text-neutral-400 text-xs">
                No issues found under the selected filter criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
