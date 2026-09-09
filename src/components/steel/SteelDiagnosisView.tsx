import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  FileCheck,
  Search,
  Layers,
  Wrench,
  HelpCircle,
  Calculator,
  Download,
  Upload,
  RefreshCw,
  Eye,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  Info,
  Maximize2,
  Minimize2,
  Sparkles,
  ArrowRight,
  Printer,
  Compass,
  FileText,
  Activity,
  Zap,
  Check
} from 'lucide-react';
import {
  SteelInspectionReport,
  SteelDefectRecord,
  SteelMaterialType,
  SteelComponentType,
  SteelSeverityLevel,
  NDTMethodType
} from '../../types/steelDiagnosis';
import {
  STEEL_MATERIALS_DATABASE,
  STEEL_DEFECTS_DATABASE,
  NDT_METHODS_DATABASE
} from '../../data/steelKnowledgeBase';
import {
  calculateSectionLoss,
  calculateSheetWeight,
  STANDARD_GAUGE_TABLE,
  MATERIAL_DENSITIES,
  findNearestGauge
} from '../../utils/steelCalculations';
import { useAuth } from '../../context/AuthContext';

type ActiveTab = 
  | 'ai-inspector'
  | 'defect-library'
  | 'materials'
  | 'welding-ndt'
  | 'corrosion'
  | 'calculators'
  | 'technical-qa'
  | 'scenarios';

const SEVERITY_COLORS: Record<SteelSeverityLevel, { bg: string; text: string; border: string; badge: string }> = {
  LOW: {
    bg: 'bg-emerald-950/40',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  },
  MEDIUM: {
    bg: 'bg-amber-950/40',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  },
  HIGH: {
    bg: 'bg-orange-950/40',
    text: 'text-orange-400',
    border: 'border-orange-500/30',
    badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40'
  },
  CRITICAL: {
    bg: 'bg-rose-950/50',
    text: 'text-rose-400',
    border: 'border-rose-500/40',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/50'
  }
};

const COMPONENT_OPTIONS: SteelComponentType[] = [
  'I-Beam / Universal Beam',
  'Column / Stanchion',
  'Truss / Rafter / Purlin',
  'Hollow Section (SHS / RHS / CHS)',
  'Channel (ISMC / PFC)',
  'Angle Section (ISA)',
  'Gusset Plate / Base Plate',
  'Sheet Metal Panel (HR / CR / GI)',
  'Fabricated Welded Girder',
  'Bolted Connection',
  'Welded Joint',
  'Ducting / Enclosure',
  'Storage Tank / Silo Shell',
  'Other Metal Component'
];

export const SteelDiagnosisView: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('ai-inspector');

  // AI Inspector State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [componentHint, setComponentHint] = useState<SteelComponentType>('I-Beam / Universal Beam');
  const [userNotes, setUserNotes] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [report, setReport] = useState<SteelInspectionReport | null>(null);
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Defect Library State
  const [defectSearch, setDefectSearch] = useState<string>('');
  const [defectCategoryFilter, setDefectCategoryFilter] = useState<string>('all');
  const [selectedDefectModal, setSelectedDefectModal] = useState<SteelDefectRecord | null>(null);

  // Calculators State
  const [nominalThickness, setNominalThickness] = useState<number>(12);
  const [measuredThickness, setMeasuredThickness] = useState<number>(9.8);
  const sectionLossResult = calculateSectionLoss({
    nominalThicknessMm: nominalThickness,
    measuredThicknessMm: measuredThickness
  });

  const [sheetMaterial, setSheetMaterial] = useState<'mild_steel' | 'stainless_steel' | 'aluminium' | 'galvanized_iron'>('mild_steel');
  const [sheetLength, setSheetLength] = useState<number>(2440); // 8 ft standard
  const [sheetWidth, setSheetWidth] = useState<number>(1220); // 4 ft standard
  const [sheetThickness, setSheetThickness] = useState<number>(1.63); // 16 gauge
  const [sheetQty, setSheetQty] = useState<number>(10);
  const sheetWeightResult = calculateSheetWeight({
    material: sheetMaterial,
    lengthMm: sheetLength,
    widthMm: sheetWidth,
    thicknessMm: sheetThickness,
    quantity: sheetQty
  });

  // Technical Q&A State
  const [qaQuestion, setQaQuestion] = useState<string>('');
  const [qaLanguage, setQaLanguage] = useState<'en' | 'hi' | 'hinglish'>('en');
  const [isQALoading, setIsQALoading] = useState<boolean>(false);
  const [qaError, setQaError] = useState<string | null>(null);
  const [qaAnswer, setQaAnswer] = useState<any | null>(null);

  // Sample Scenarios
  const PRESET_SCENARIOS = [
    {
      title: 'MS I-Beam Flange Rust',
      summary: 'Heavy surface rust with flaking mill scale on a bottom tension flange.',
      question: 'My MS beam in an industrial warehouse has noticeable reddish-brown rust on the bottom flange. How do I know if it is just surface rust or dangerous section loss, and what is the inspection procedure?',
      category: 'Corrosion'
    },
    {
      title: 'Crack Near Weld Toe',
      summary: 'Fine hairline crack visible adjacent to beam-to-column moment weld bead.',
      question: 'There is a visible hairline crack right next to the weld bead connecting an I-beam to a column flange. Can I simply grind and paint it, or what non-destructive testing is required?',
      category: 'Welding Defect'
    },
    {
      title: 'Sheet Metal Distortion Post-Welding',
      summary: '1.6mm MS sheet panels buckled and wavy after continuous seam welding.',
      question: 'Our 1.6mm (16 gauge) MS sheet metal enclosure panels warped with significant oil canning and waviness after MIG welding. What caused this thermal distortion and how can we prevent/rectify it?',
      category: 'Deformation'
    },
    {
      title: 'GI Sheet White Rust & Holes',
      summary: 'Galvanized iron roofing sheet exhibits chalky white powdery deposit and pinpoint perforations.',
      question: 'Our GI roofing sheets have developed a white chalky powder and tiny pinholes near the lap joints. Is this normal oxidation, and what corrective action is needed to prevent total perforation?',
      category: 'Galvanizing'
    }
  ];

  // Image Upload Handler
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setAnalysisError('Please upload a valid image file (JPG, PNG, or WEBP).');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setAnalysisError('Image size exceeds 15 MB. Please select a smaller file.');
      return;
    }

    setAnalysisError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setReport(null);
    };
    reader.readAsDataURL(file);
  };

  // Run AI Inspection Analysis
  const runInspection = async () => {
    if (!selectedImage) {
      setAnalysisError('Please select or upload a metal/steel image first.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const res = await fetch('/api/steel/inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: selectedImage,
          componentHint,
          userNotes,
          userId: user?.uid,
          userEmail: user?.email
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete steel visual diagnosis.');
      }

      setReport(data.report);
      if (data.report.annotations && data.report.annotations.length > 0) {
        setSelectedBoxId(data.report.annotations[0].id);
      }
    } catch (err: any) {
      console.error('Inspection error:', err);
      setAnalysisError(err.message || 'An unexpected error occurred during visual analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run Technical Q&A
  const runQA = async (queryText?: string) => {
    const q = queryText || qaQuestion;
    if (!q.trim()) return;

    setIsQALoading(true);
    setQaError(null);

    try {
      const res = await fetch('/api/steel/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q.trim(),
          language: qaLanguage,
          inspectionContext: report ? {
            componentType: report.componentType,
            materialInferred: report.materialInferred,
            overallSeverity: report.overallSeverity,
            preliminaryAssessmentNote: report.preliminaryAssessmentNote
          } : undefined,
          userId: user?.uid,
          userEmail: user?.email
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to retrieve technical engineering answer.');
      }

      setQaAnswer(data.response);
    } catch (err: any) {
      console.error('QA error:', err);
      setQaError(err.message || 'Failed to retrieve response.');
    } finally {
      setIsQALoading(false);
    }
  };

  // Filtered Defects
  const filteredDefects = STEEL_DEFECTS_DATABASE.filter(d => {
    const matchesCategory = defectCategoryFilter === 'all' || d.category === defectCategoryFilter;
    const matchesSearch = !defectSearch.trim() || 
      d.name.toLowerCase().includes(defectSearch.toLowerCase()) ||
      d.aliases.some(a => a.toLowerCase().includes(defectSearch.toLowerCase())) ||
      d.description.toLowerCase().includes(defectSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 text-slate-100 font-sans">
      {/* Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#0d1424] via-[#121c33] to-[#0d1424] border border-indigo-500/20 p-6 md:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wide uppercase">
              <Zap className="w-3.5 h-3.5" />
              <span>IS 800:2007 • IS 2062 • AWS D1.1 • AISC 360 • ISO 12944</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              MS & Structural Steel Knowledge & Diagnostic Hub
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Professional metallurgical and structural steel diagnostic engine for Mild Steel (MS), Sheet Metal (HR, CR, GI), Stainless Steel, Aluminium, Welded Connections, and Bolted Joints.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 sm:gap-3 shrink-0">
            <div className="bg-[#151B2E]/90 border border-indigo-500/20 px-4 py-2.5 rounded-xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Defect Database</div>
                <div className="text-sm font-bold text-white">35+ Classifications</div>
              </div>
            </div>

            <div className="bg-[#151B2E]/90 border border-indigo-500/20 px-4 py-2.5 rounded-xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">NDT Methods</div>
                <div className="text-sm font-bold text-white">VT, PT, MT, UT, RT</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin border-b border-indigo-500/20">
        {[
          { id: 'ai-inspector', label: 'AI Visual Inspector', icon: Eye },
          { id: 'defect-library', label: 'Defect Library', icon: Search },
          { id: 'materials', label: 'Material Guide', icon: Layers },
          { id: 'welding-ndt', label: 'Welding & NDT Guide', icon: Wrench },
          { id: 'corrosion', label: 'Corrosion & Protection', icon: ShieldAlert },
          { id: 'calculators', label: 'Steel Calculators', icon: Calculator },
          { id: 'technical-qa', label: 'Technical Q&A', icon: HelpCircle },
          { id: 'scenarios', label: 'Practical Scenarios', icon: Compass }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400/40'
                  : 'bg-[#121829] text-slate-400 hover:text-white hover:bg-[#182035] border border-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================
          TAB 1: AI IMAGE INSPECTOR
         ============================================================ */}
      {activeTab === 'ai-inspector' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Upload & Controls */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#0f1628] border border-indigo-500/20 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Upload className="w-4 h-4 text-blue-400" />
                    <span>Upload Steel / Metal Photo</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">JPG, PNG, WEBP</span>
                </div>

                {/* Upload Zone */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleImageFile(e.target.files[0]);
                    }
                  }}
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleImageFile(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                    selectedImage
                      ? 'border-blue-500/50 bg-blue-950/10'
                      : 'border-slate-700 hover:border-blue-500/40 hover:bg-[#151c30]'
                  }`}
                >
                  {selectedImage ? (
                    <div className="space-y-3">
                      <div className="relative mx-auto max-h-56 overflow-hidden rounded-lg border border-slate-700">
                        <img
                          src={selectedImage}
                          alt="Selected steel component"
                          className="w-full object-contain max-h-56"
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2 text-xs text-blue-400">
                        <Check className="w-4 h-4" />
                        <span>Image loaded. Click to replace.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 py-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mx-auto flex items-center justify-center">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Click or drag & drop steel photo</p>
                        <p className="text-xs text-slate-400 mt-1">Beams, welds, columns, sheets, connections, or rust areas</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Component Type Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Component Type (Optional Guidance)
                  </label>
                  <select
                    value={componentHint}
                    onChange={(e) => setComponentHint(e.target.value as SteelComponentType)}
                    className="w-full bg-[#151c30] border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                  >
                    {COMPONENT_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* User Field Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Field Notes & Environmental Context (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                    placeholder="e.g. Coastal industrial atmosphere for 5 years, weld done with 7018 rod, vibration noticed..."
                    className="w-full bg-[#151c30] border border-slate-700 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
                  />
                </div>

                {analysisError && (
                  <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                    <p>{analysisError}</p>
                  </div>
                )}

                {/* Run Diagnostic Button */}
                <button
                  disabled={!selectedImage || isAnalyzing}
                  onClick={runInspection}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all cursor-pointer"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing Steel Microstructure & Surface...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Run Visual Diagnostic Analysis</span>
                    </>
                  )}
                </button>

                {/* Safety Precaution Disclaimer */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-300">Preliminary Visual Assessment:</strong> AI image analysis evaluates visible surface texture, geometry, and color. It cannot replace on-site calibrated ultrasonic thickness gauging or review by a Licensed Structural Engineer or Certified Welding Inspector.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Diagnostic Results Display */}
            <div className="lg:col-span-7 space-y-6">
              {!report && !isAnalyzing && (
                <div className="h-full min-h-[420px] rounded-2xl border border-dashed border-slate-800 bg-[#0c1222]/50 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Compass className="w-8 h-8" />
                  </div>
                  <div className="max-w-md space-y-1.5">
                    <h4 className="text-base font-bold text-white">Visual Diagnostic Workspace</h4>
                    <p className="text-xs text-slate-400">
                      Upload an image of your steel beam, plate, column, weld, or sheet metal component to identify defects, section loss risk, and recommended NDT testing per IS 800:2007 & AWS D1.1.
                    </p>
                  </div>
                </div>
              )}

              {isAnalyzing && (
                <div className="h-full min-h-[420px] rounded-2xl border border-indigo-500/20 bg-[#0f1628] flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
                    <Sparkles className="w-6 h-6 text-blue-400 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white">Conducting Metallurgical & Visual Analysis</h4>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Scanning for surface rust, pitting depth indicators, weld undercut, cracks, distortion, and section loss...
                    </p>
                  </div>
                </div>
              )}

              {report && !isAnalyzing && (
                <div className="space-y-6">
                  
                  {/* Visual Bounding Box Canvas Overlay */}
                  {selectedImage && report.annotations && report.annotations.length > 0 && (
                    <div className="bg-[#0f1628] border border-indigo-500/20 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-300 flex items-center gap-2">
                          <Eye className="w-4 h-4 text-blue-400" />
                          <span>Identified Defect Locations ({report.annotations.length})</span>
                        </span>
                        <span className="text-[11px] text-slate-400">Click a box to inspect</span>
                      </div>

                      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-black flex items-center justify-center">
                        <img
                          src={selectedImage}
                          alt="Inspected steel"
                          className="max-h-[380px] w-auto object-contain"
                        />
                        
                        {/* SVG Overlay for Bounding Boxes */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                          {report.annotations.map((ann) => {
                            const [ymin, xmin, ymax, xmax] = ann.box2d;
                            const isSelected = selectedBoxId === ann.id;
                            const strokeColor = ann.severity === 'CRITICAL' ? '#f43f5e' : ann.severity === 'HIGH' ? '#f97316' : ann.severity === 'MEDIUM' ? '#eab308' : '#10b981';
                            return (
                              <g key={ann.id} className="pointer-events-auto cursor-pointer" onClick={() => setSelectedBoxId(ann.id)}>
                                <rect
                                  x={xmin}
                                  y={ymin}
                                  width={Math.max(20, xmax - xmin)}
                                  height={Math.max(20, ymax - ymin)}
                                  fill={isSelected ? `${strokeColor}33` : `${strokeColor}1A`}
                                  stroke={strokeColor}
                                  strokeWidth={isSelected ? 5 : 3}
                                  strokeDasharray={isSelected ? undefined : '6 3'}
                                  rx={6}
                                />
                                <text
                                  x={xmin + 6}
                                  y={Math.max(25, ymin - 8)}
                                  fill="#ffffff"
                                  fontSize="24"
                                  fontWeight="bold"
                                  filter="drop-shadow(0px 1px 2px rgba(0,0,0,0.8))"
                                >
                                  {ann.defectName} ({ann.severity})
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      </div>

                      {/* Box Selectors */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {report.annotations.map((ann) => {
                          const isSelected = selectedBoxId === ann.id;
                          const color = SEVERITY_COLORS[ann.severity];
                          return (
                            <button
                              key={ann.id}
                              onClick={() => setSelectedBoxId(ann.id)}
                              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                                isSelected ? color.badge : 'bg-[#151c30] text-slate-400 border-slate-700 hover:border-slate-600'
                              }`}
                            >
                              <span className={`w-2 h-2 rounded-full ${ann.severity === 'CRITICAL' ? 'bg-rose-500' : ann.severity === 'HIGH' ? 'bg-orange-500' : ann.severity === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                              <span>{ann.defectName}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Safety Alert Banner */}
                  {report.safetyAlerts && (
                    <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                      report.safetyAlerts.stopWorkRecommended
                        ? 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                        : report.safetyAlerts.structuralEngineerRequired
                        ? 'bg-amber-950/50 border-amber-500/40 text-amber-200'
                        : 'bg-blue-950/40 border-blue-500/30 text-blue-200'
                    }`}>
                      <ShieldAlert className={`w-5 h-5 shrink-0 mt-0.5 ${
                        report.safetyAlerts.stopWorkRecommended ? 'text-rose-400' : 'text-amber-400'
                      }`} />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold tracking-tight">
                            {report.safetyAlerts.stopWorkRecommended
                              ? 'SAFETY ESCALATION: STOP-WORK DIRECTIVE'
                              : report.safetyAlerts.structuralEngineerRequired
                              ? 'STRUCTURAL ENGINEER REVIEW REQUIRED'
                              : 'PRELIMINARY INSPECTION SUMMARY'}
                          </h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${SEVERITY_COLORS[report.overallSeverity].badge}`}>
                            {report.overallSeverity} SEVERITY
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed opacity-90">{report.safetyAlerts.message}</p>
                      </div>
                    </div>
                  )}

                  {/* Metadata Bar */}
                  <div className="bg-[#0f1628] border border-indigo-500/20 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">Inferred Material</div>
                      <div className="text-xs font-bold text-white mt-0.5 truncate">{report.materialInferred}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">Component Type</div>
                      <div className="text-xs font-bold text-white mt-0.5 truncate">{report.componentType}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">Overall Severity</div>
                      <div className={`text-xs font-bold mt-0.5 ${SEVERITY_COLORS[report.overallSeverity].text}`}>
                        {report.overallSeverity}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">Report Reference</div>
                      <div className="text-xs font-mono text-blue-400 mt-0.5 truncate">{report.id}</div>
                    </div>
                  </div>

                  {/* Assessment Narrative */}
                  <div className="bg-[#0f1628] border border-indigo-500/20 rounded-2xl p-5 space-y-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <span>Preliminary Visual Evaluation</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {report.preliminaryAssessmentNote}
                    </p>
                    <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                      <strong className="text-slate-300">Confidence Note:</strong> {report.confidenceNotes}
                    </div>
                  </div>

                  {/* Findings Cards */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Activity className="w-4 h-4 text-indigo-400" />
                      <span>Detailed Diagnostic Findings ({report.findings.length})</span>
                    </h4>

                    {report.findings.map((f, idx) => (
                      <div
                        key={f.id || idx}
                        className="bg-[#0f1628] border border-indigo-500/20 rounded-2xl p-5 space-y-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">{f.primaryDefect}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${SEVERITY_COLORS[f.severity].badge}`}>
                                {f.severity}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              Location: <span className="text-slate-200">{f.defectLocation}</span> • Affected Area: <span className="text-slate-200">{f.affectedAreaPercentage}</span>
                            </div>
                          </div>
                        </div>

                        {f.alternativeDefects && f.alternativeDefects.length > 0 && (
                          <div className="text-[11px] text-slate-400">
                            <span className="font-semibold text-slate-300">Plausible Alternative Conditions: </span>
                            {f.alternativeDefects.join(', ')}
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          {/* Root Causes */}
                          <div className="p-3 rounded-xl bg-[#141b2f] border border-slate-800 space-y-1.5">
                            <span className="font-semibold text-slate-200 block">Probable Root Causes:</span>
                            <ul className="space-y-1 text-slate-300">
                              {f.possibleCauses.map((c, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-blue-400">•</span>
                                  <span>{c}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Recommended Inspection */}
                          <div className="p-3 rounded-xl bg-[#141b2f] border border-slate-800 space-y-1.5">
                            <span className="font-semibold text-slate-200 block">Recommended Inspection:</span>
                            <ul className="space-y-1 text-slate-300">
                              {f.recommendedInspection.map((ins, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-emerald-400">•</span>
                                  <span>{ins}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Repair & Prevention Guidance */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="p-3 rounded-xl bg-[#141b2f] border border-slate-800 space-y-1.5">
                            <span className="font-semibold text-slate-200 block">Corrective Repair Procedure:</span>
                            <ul className="space-y-1 text-slate-300">
                              {f.repairGuidance.map((r, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-amber-400">•</span>
                                  <span>{r}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-3 rounded-xl bg-[#141b2f] border border-slate-800 space-y-1.5">
                            <span className="font-semibold text-slate-200 block">Long-Term Prevention:</span>
                            <ul className="space-y-1 text-slate-300">
                              {f.preventionGuidance.map((p, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="text-indigo-400">•</span>
                                  <span>{p}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Engineer & Stop Work Requirements */}
                        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] space-y-1 text-slate-300">
                          <div><strong className="text-rose-400">When to Stop Work:</strong> {f.whenToStopWork}</div>
                          <div><strong className="text-amber-400">When Engineer Required:</strong> {f.whenEngineerRequired}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* NDT Recommendations */}
                  {report.ndtRecommendations && report.ndtRecommendations.length > 0 && (
                    <div className="bg-[#0f1628] border border-indigo-500/20 rounded-2xl p-5 space-y-3">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-blue-400" />
                        <span>Recommended Non-Destructive Testing (NDT) Protocol</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {report.ndtRecommendations.map((ndt, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-[#141b2f] border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-xs font-mono">
                                {ndt.method} Testing
                              </span>
                              <span className="text-[10px] text-slate-400 uppercase font-medium">{ndt.priority}</span>
                            </div>
                            <p className="text-xs text-slate-300 pt-1 leading-normal">{ndt.rationale}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Export & Print */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 rounded-xl bg-[#151c30] hover:bg-[#1a233c] border border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-400" />
                      <span>Print Inspection Summary</span>
                    </button>

                    <button
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${report.id}.json`;
                        a.click();
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs font-medium text-blue-300 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export JSON Diagnostic Data</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 2: DEFECT LIBRARY (35+ DEFECTS)
         ============================================================ */}
      {activeTab === 'defect-library' && (
        <div className="space-y-6">
          {/* Search & Filters */}
          <div className="bg-[#0f1628] border border-indigo-500/20 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={defectSearch}
                  onChange={(e) => setDefectSearch(e.target.value)}
                  placeholder="Search 35+ defects by name, Hindi alias (जंग, दरार, छिद्र), or symptoms..."
                  className="w-full bg-[#151c30] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'All Defects' },
                  { id: 'corrosion', label: 'Corrosion' },
                  { id: 'welding', label: 'Welding' },
                  { id: 'cracking', label: 'Cracking' },
                  { id: 'deformation', label: 'Deformation' },
                  { id: 'surface', label: 'Surface & Coating' },
                  { id: 'connection', label: 'Connections' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setDefectCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      defectCategoryFilter === cat.id
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-[#151c30] text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Defect Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDefects.map((defect) => (
              <div
                key={defect.id}
                onClick={() => setSelectedDefectModal(defect)}
                className="bg-[#0f1628] border border-indigo-500/20 rounded-2xl p-5 space-y-3.5 hover:border-blue-500/40 hover:bg-[#121a30] transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-blue-400 font-mono">
                      {defect.category}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {defect.inspection_methods.join(', ')}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                    {defect.name}
                  </h4>

                  {defect.aliases && defect.aliases.length > 0 && (
                    <div className="text-xs text-slate-400 font-medium">
                      Aliases: <span className="text-slate-300">{defect.aliases.join(' • ')}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {defect.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Standards: {defect.standards_references[0] || 'IS 800:2007'}</span>
                  <span className="text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                    Details <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Defect Detail Modal */}
          {selectedDefectModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#0f1628] border border-indigo-500/30 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-blue-400 font-bold">
                      {selectedDefectModal.category} Defect Specification
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
                      {selectedDefectModal.name}
                    </h3>
                    {selectedDefectModal.aliases.length > 0 && (
                      <div className="text-xs text-slate-400 mt-1">
                        Multilingual Aliases: <span className="text-slate-200">{selectedDefectModal.aliases.join(' • ')}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedDefectModal(null)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs md:text-sm text-slate-300 leading-relaxed">
                  <div>
                    <strong className="text-white block mb-1">Description:</strong>
                    <p>{selectedDefectModal.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-[#141b2f] border border-slate-800 space-y-2">
                      <strong className="text-white block">Visual Signs & Morphology:</strong>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {selectedDefectModal.visual_signs.map((s, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-blue-400">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#141b2f] border border-slate-800 space-y-2">
                      <strong className="text-white block">Common Causes:</strong>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {selectedDefectModal.common_causes.map((c, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-400">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Severity Criteria Table */}
                  <div className="space-y-2">
                    <strong className="text-white block">Engineering Severity Levels:</strong>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedDefectModal.severity_levels.map((sev, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-[#141b2f] border border-slate-800 text-xs">
                          <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${SEVERITY_COLORS[sev.level].badge}`}>
                            {sev.level}
                          </span>
                          <p className="text-slate-300 mt-1.5 leading-normal">{sev.criteria}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Inspection Methods & Repairs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-[#141b2f] border border-slate-800 space-y-1.5">
                      <strong className="text-white block">Mandated NDT Testing:</strong>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedDefectModal.inspection_methods.map((m) => (
                          <span key={m} className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 font-bold font-mono text-xs">
                            {m} Testing
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#141b2f] border border-slate-800 space-y-1.5">
                      <strong className="text-white block">Applicable Codes & Standards:</strong>
                      <div className="text-xs text-slate-300">
                        {selectedDefectModal.standards_references.join(', ')}
                      </div>
                    </div>
                  </div>

                  {/* Stop Work & Safety Directives */}
                  <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs space-y-1.5">
                    <div><strong className="text-rose-300">When to Stop Work:</strong> {selectedDefectModal.when_to_stop_work}</div>
                    <div><strong className="text-amber-300">When Engineer Required:</strong> {selectedDefectModal.when_engineer_required}</div>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedDefectModal(null)}
                    className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    Close Defect Specification
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          TAB 3: MATERIAL GUIDE
         ============================================================ */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          <div className="bg-[#0f1628] border border-indigo-500/20 rounded-2xl p-6 space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <span>Authoritative Steel & Sheet Metal Specifications</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Grounded in Bureau of Indian Standards (BIS) and international specifications (IS 2062, IS 1079, IS 513, IS 277, ASTM A36, ASTM A992, ASTM A240).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {STEEL_MATERIALS_DATABASE.map((mat) => (
              <div
                key={mat.id}
                className="bg-[#0f1628] border border-indigo-500/20 rounded-2xl p-6 space-y-4 hover:border-blue-500/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-mono text-blue-400 font-semibold">{mat.standard}</span>
                    <h4 className="text-base font-bold text-white mt-0.5">{mat.name}</h4>
                    <div className="text-xs text-slate-400 mt-0.5">Grade: {mat.grade}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 font-mono text-xs">
                    {mat.densityKgM3} kg/m³
                  </span>
                </div>

                {/* Mechanical Properties Bar */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#141b2f] border border-slate-800 text-center">
                  <div>
                    <div className="text-[10px] text-slate-400">Yield Strength</div>
                    <div className="text-xs font-bold text-white mt-0.5">{mat.yieldStrengthMpa} MPa</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Tensile Strength</div>
                    <div className="text-xs font-bold text-white mt-0.5">{mat.tensileStrengthMpa} MPa</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Elongation</div>
                    <div className="text-xs font-bold text-white mt-0.5">{mat.elongationPercent}%</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Typical Thickness:</span>
                    <span className="font-mono text-white">{mat.typicalThicknessRangeMm}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Weldability:</span>
                    <span className="text-emerald-400 font-medium">{mat.weldability}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Corrosion Resistance:</span>
                    <span className="text-amber-400 font-medium">{mat.corrosionResistance}</span>
                  </div>
                </div>

                {/* Applications */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="text-xs font-semibold text-slate-300">Common Civil & Architectural Applications:</div>
                  <ul className="space-y-1 text-xs text-slate-400">
                    {mat.commonApplications.map((app, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-blue-400">•</span>
                        <span>{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Fabrication Note */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                  <strong className="text-slate-200">Fabrication Notes: </strong>
                  {mat.fabricationNotes}
                </div>

                <div className="text-[10px] font-mono text-slate-500 pt-1">
                  BIS: {mat.indianStandardRef} | Int: {mat.internationalRef}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 4: WELDING & NDT GUIDE
         ============================================================ */}
      {activeTab === 'welding-ndt' && (
        <div className="space-y-8">
          {/* NDT Methods Comparison Table */}
          <div className="bg-[#0f1628] border border-indigo-500/20 rounded-2xl p-6 space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-400" />
                <span>Non-Destructive Testing (NDT) Method Selection Guide</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Comparison of inspection methods mandated by AWS D1.1, IS 800:2007, and ASME Section V for structural steel and weldment verification.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {NDT_METHODS_DATABASE.map((ndt) => (
                <div
                  key={ndt.code}
                  className="bg-[#141b2f] border border-slate-800 rounded-2xl p-5 space-y-3.5 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-xl bg-blue-500/20 text-blue-300 font-extrabold text-sm font-mono border border-blue-500/30">
                        {ndt.code}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{ndt.hindiName}</span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{ndt.fullName}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{ndt.description}</p>
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
                    <div>
                      <strong className="text-emerald-400 block mb-1">Detectable Flaws:</strong>
                      <p className="text-slate-300">{ndt.detectableDefects.join(', ')}</p>
                    </div>

                    <div>
                      <strong className="text-rose-400 block mb-1">Physical Limitations:</strong>
                      <p className="text-slate-300">{ndt.limitations.join('; ')}</p>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 pt-1">
                      Code: {ndt.standardReference}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Welding Defects Quick Reference */}
          <div className="bg-[#0f1628] border border-indigo-500/20 rounded-2xl p-6 space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Critical Weld Defect Summary (AWS D1.1 / IS 9595)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {[
                { name: 'Weld Toe / Root Crack', severity: 'CRITICAL', ndt: 'PT, MT, UT', note: 'Never weld over. Requires 100% gouging, grinding, and re-welding under WPS.' },
                { name: 'Undercut (Groove at toe)', severity: 'HIGH', ndt: 'VT, Weld gauge', note: 'Stress riser in fatigue. Weld buildup with low heat input if depth > 1.0mm.' },
                { name: 'Weld Porosity (Gas pockets)', severity: 'MEDIUM', ndt: 'VT, RT, UT', note: 'Caused by moisture or contaminated shielding gas. Reject if exceeds AWS cluster limits.' },
                { name: 'Lack of Fusion (Cold Lap)', severity: 'HIGH', ndt: 'UT, RT', note: 'Subsurface planar flaw. High risk of brittle failure under cyclic bending.' }
              ].map((w, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#141b2f] border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{w.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${SEVERITY_COLORS[w.severity as SteelSeverityLevel].badge}`}>
                      {w.severity}
                    </span>
                  </div>
                  <div className="text-[11px] text-blue-400 font-mono">Test: {w.ndt}</div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{w.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 5: CORROSION & PROTECTION
         ============================================================ */}
      {activeTab === 'corrosion' && (
        <div className="space-y-6">
          {/* Surface Rust vs Section Loss Comparison */}
          <div className="bg-[#0f1628] border border-indigo-500/20 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <span>Surface Rust vs. Structural Section Loss: Fundamental Engineering Distinction</span>
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              One of the most frequent misdiagnoses on construction sites is confusing harmless aesthetic surface flash rust with structural section loss that degrades moment and axial capacity.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-emerald-300">Surface Flash Rust</h4>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold">LOW SEVERITY</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Microscopic oxidation depth (less than 0.1 mm). Member thickness is fully intact.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Does NOT impair Section Modulus (Z), Moment of Inertia (I), or Euler buckling capacity.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Remedy: Power wire brushing (SSPC-SP3) followed by zinc phosphate or red oxide primer.</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-rose-300">Structural Section Loss</h4>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-xs font-bold">HIGH / CRITICAL</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>Deep laminar flaking, cratered pitting, or perforation reducing wall thickness by &gt;10-30%.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>Critically impairs compression flange local buckling (b/t ratio) and shear web capacity per IS 800:2007 Clause 8.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>Remedy: Physical ultrasonic thickness grid mapping, structural calculation, and sister-plate reinforcement.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ISO 12944 Environmental Classification */}
          <div className="bg-[#0f1628] border border-indigo-500/20 rounded-2xl p-6 space-y-4">
            <h4 className="text-base font-bold text-white">ISO 12944 Atmospheric Corrosivity Categories</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {[
                { cat: 'C1 - Very Low', env: 'Heated buildings with clean atmospheres (offices, schools).', sys: 'Alkyd primer + topcoat (80 µm).' },
                { cat: 'C2 - Low', env: 'Unheated rural storage buildings, low pollution areas.', sys: 'Epoxy primer + polyurethane (120 µm).' },
                { cat: 'C3 - Medium', env: 'Urban & industrial atmospheres, moderate SO2, coastal areas with low salinity.', sys: 'High-build epoxy + polyurethane (160 µm).' },
                { cat: 'C4 - High', env: 'Industrial areas and coastal areas with moderate salinity.', sys: 'Zinc-rich epoxy + 2x epoxy barrier + PU (240 µm).' },
                { cat: 'C5 - Very High', env: 'Industrial zones with high humidity and aggressive chemical atmosphere.', sys: 'Inorganic zinc silicate + high-build epoxy + PU (320 µm).' },
                { cat: 'CX - Extreme', env: 'Offshore platforms, tidal splash zones, severe marine exposure.', sys: 'Hot-dip galvanizing + duplex epoxy/polyurethane system.' }
              ].map((c, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-[#141b2f] border border-slate-800 space-y-1.5">
                  <div className="font-bold text-blue-400 font-mono">{c.cat}</div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{c.env}</p>
                  <div className="text-[10px] text-emerald-400 pt-1 border-t border-slate-800">
                    System: {c.sys}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 6: STEEL CALCULATORS
         ============================================================ */}
      {activeTab === 'calculators' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Calculator 1: Section Loss */}
            <div className="bg-[#0f1628] border border-indigo-500/20 rounded-2xl p-6 space-y-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono">
                  PHYSICAL MEASUREMENTS
                </div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-blue-400" />
                  <span>Section Loss & Capacity Depletion Calculator</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Calculates actual remaining wall thickness from ultrasonic gauge or caliper measurements.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Nominal Thickness (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="150"
                    value={nominalThickness}
                    onChange={(e) => setNominalThickness(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#151c30] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-500">As-designed or uncorroded</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Measured Thickness (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="150"
                    value={measuredThickness}
                    onChange={(e) => setMeasuredThickness(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#151c30] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-500">From UT gauge or caliper</span>
                </div>
              </div>

              {/* Calculation Output Box */}
              <div className={`p-4 rounded-xl border space-y-3 ${SEVERITY_COLORS[sectionLossResult.severity].bg} ${SEVERITY_COLORS[sectionLossResult.severity].border}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Computed Section Loss:</span>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${SEVERITY_COLORS[sectionLossResult.severity].badge}`}>
                    {sectionLossResult.sectionLossPercentage}% LOSS ({sectionLossResult.lossMm} mm)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400">Remaining Thickness:</span>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">
                      {sectionLossResult.measuredThicknessMm} mm ({Math.round(sectionLossResult.remainingThicknessRatio * 100)}%)
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Severity Assessment:</span>
                    <div className={`text-sm font-bold mt-0.5 ${SEVERITY_COLORS[sectionLossResult.severity].text}`}>
                      {sectionLossResult.severity}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800/60">
                  {sectionLossResult.engineeringEvaluation}
                </p>

                <div className="p-2.5 rounded-lg bg-black/40 text-[11px] text-slate-300 leading-normal">
                  <strong className="text-amber-400">Action: </strong> {sectionLossResult.structuralWarning}
                </div>

                <div className="text-[10px] text-slate-400 italic">
                  Source: {sectionLossResult.sourceType}
                </div>
              </div>
            </div>

            {/* Calculator 2: Sheet Metal Weight */}
            <div className="bg-[#0f1628] border border-indigo-500/20 rounded-2xl p-6 space-y-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                  FABRICATION ESTIMATION
                </div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Sheet Metal Weight & Gauge Calculator</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Computes exact mass for Mild Steel, GI, Stainless Steel, and Aluminium sheets.
                </p>
              </div>

              {/* Material Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Material Alloy</label>
                <select
                  value={sheetMaterial}
                  onChange={(e) => setSheetMaterial(e.target.value as any)}
                  className="w-full bg-[#151c30] border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="mild_steel">Mild Steel / Carbon Steel (7850 kg/m³)</option>
                  <option value="stainless_steel">Stainless Steel SS 304 / 316 (8000 kg/m³)</option>
                  <option value="galvanized_iron">Galvanized Iron GI Sheet (7850 kg/m³)</option>
                  <option value="aluminium">Aluminium AA 3003 / 5052 (2700 kg/m³)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Length (mm)</label>
                  <input
                    type="number"
                    value={sheetLength}
                    onChange={(e) => setSheetLength(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#151c30] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-500">e.g. 2440 mm (8 ft)</span>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Width (mm)</label>
                  <input
                    type="number"
                    value={sheetWidth}
                    onChange={(e) => setSheetWidth(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#151c30] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-500">e.g. 1220 mm (4 ft)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Thickness (mm)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={sheetThickness}
                    onChange={(e) => setSheetThickness(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#151c30] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-400">
                    Closest: SWG {findNearestGauge(sheetThickness).gauge} ({findNearestGauge(sheetThickness).thicknessMm} mm)
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Quantity (Sheets)</label>
                  <input
                    type="number"
                    min="1"
                    value={sheetQty}
                    onChange={(e) => setSheetQty(parseInt(e.target.value) || 1)}
                    className="w-full bg-[#151c30] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Standard Gauge Selector Chips */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-semibold text-slate-400 block">Quick Standard Wire Gauge (SWG) Selector:</label>
                <div className="flex flex-wrap gap-1.5">
                  {STANDARD_GAUGE_TABLE.slice(2, 10).map((g) => (
                    <button
                      key={g.gauge}
                      onClick={() => setSheetThickness(g.thicknessMm)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono border transition-all cursor-pointer ${
                        Math.abs(sheetThickness - g.thicknessMm) < 0.05
                          ? 'bg-blue-600 text-white border-blue-400'
                          : 'bg-[#151c30] text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      {g.gauge} Ga ({g.thicknessMm}mm)
                    </button>
                  ))}
                </div>
              </div>

              {/* Result Summary */}
              <div className="p-4 rounded-xl bg-[#141b2f] border border-slate-800 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400">Single Sheet Weight:</span>
                    <div className="text-sm font-bold text-white font-mono mt-0.5">
                      {sheetWeightResult.singleWeightKg} kg
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Total Batch Weight ({sheetQty} pcs):</span>
                    <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                      {sheetWeightResult.totalWeightKg} kg ({(sheetWeightResult.totalWeightKg / 1000).toFixed(3)} tonnes)
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Single Sheet Area: {sheetWeightResult.areaSqM} m²</span>
                  <span>Density: {sheetWeightResult.densityKgM3} kg/m³</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 7: TECHNICAL Q&A ASSISTANT
         ============================================================ */}
      {activeTab === 'technical-qa' && (
        <div className="space-y-6">
          <div className="bg-[#0f1628] border border-indigo-500/20 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-400" />
                  <span>Structural Steel & Welding Technical Q&A</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  10-point standardized engineering responses adhering to IS 800:2007, IS 2062, and AWS D1.1.
                </p>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#151c30] border border-slate-700">
                {[
                  { id: 'en', label: 'English' },
                  { id: 'hi', label: 'हिंदी' },
                  { id: 'hinglish', label: 'Hinglish' }
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setQaLanguage(lang.id as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      qaLanguage === lang.id
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                'Surface rust vs structural section loss difference?',
                'Crack near weld toe of I-beam flange - immediate procedure?',
                'Why does sheet metal bend after welding and how to fix?',
                'GI sheet white rust prevention in humid coastal climate?'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQaQuestion(chip);
                    runQA(chip);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#151c30] hover:bg-[#1a243d] border border-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="flex gap-2.5">
              <input
                type="text"
                value={qaQuestion}
                onChange={(e) => setQaQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runQA()}
                placeholder="Ask any question regarding Mild Steel, welding defects, corrosion, or code compliance..."
                className="flex-1 bg-[#151c30] border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
              />
              <button
                disabled={isQALoading || !qaQuestion.trim()}
                onClick={() => runQA()}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all shrink-0"
              >
                {isQALoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Ask AI</span>
              </button>
            </div>

            {qaError && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
                {qaError}
              </div>
            )}
          </div>

          {/* Answer Display */}
          {qaAnswer && (
            <div className="bg-[#0f1628] border border-indigo-500/20 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">Engineering Diagnostic Response</span>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${SEVERITY_COLORS[qaAnswer.severity].badge}`}>
                    {qaAnswer.severity} SEVERITY
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">10-Point Technical Format</span>
              </div>

              {/* 10-Point Standardized Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* 1. Observation */}
                <div className="p-4 rounded-xl bg-[#141b2f] border border-slate-800 space-y-1">
                  <div className="font-bold text-blue-400 flex items-center gap-1.5">
                    <span>🔎 Observation</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{qaAnswer.observation}</p>
                </div>

                {/* 2. Material */}
                <div className="p-4 rounded-xl bg-[#141b2f] border border-slate-800 space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <span>🧱 Material</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{qaAnswer.material}</p>
                </div>

                {/* 3. Possible Problem */}
                <div className="p-4 rounded-xl bg-[#141b2f] border border-slate-800 space-y-1">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <span>⚠️ Possible Problem</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{qaAnswer.possibleProblem}</p>
                </div>

                {/* 4. Severity */}
                <div className="p-4 rounded-xl bg-[#141b2f] border border-slate-800 space-y-1">
                  <div className="font-bold text-indigo-400 flex items-center gap-1.5">
                    <span>📊 Severity Justification</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Evaluated as <strong className={SEVERITY_COLORS[qaAnswer.severity].text}>{qaAnswer.severity}</strong> based on structural risk factors.
                  </p>
                </div>
              </div>

              {/* Causes & Inspection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#141b2f] border border-slate-800 space-y-2">
                  <div className="font-bold text-slate-200">🔍 Possible Root Causes:</div>
                  <ul className="space-y-1 text-slate-300">
                    {qaAnswer.possibleCauses.map((c: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-blue-400">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#141b2f] border border-slate-800 space-y-2">
                  <div className="font-bold text-slate-200">🧪 Recommended Inspection (NDT):</div>
                  <ul className="space-y-1 text-slate-300">
                    {qaAnswer.recommendedInspection.map((ins: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">•</span>
                        <span>{ins}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Corrective Action & Prevention */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#141b2f] border border-slate-800 space-y-2">
                  <div className="font-bold text-slate-200">🔧 Possible Corrective Action:</div>
                  <ul className="space-y-1 text-slate-300">
                    {qaAnswer.possibleCorrectiveAction.map((act: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400">•</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#141b2f] border border-slate-800 space-y-2">
                  <div className="font-bold text-slate-200">🛡 Long-Term Prevention:</div>
                  <ul className="space-y-1 text-slate-300">
                    {qaAnswer.prevention.map((prev: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-indigo-400">•</span>
                        <span>{prev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Professional Review & Safety Note */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <span>👷 Professional Review Requirement</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{qaAnswer.professionalReview}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-1 text-rose-300">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    <span>⚠️ Safety Note & Disclaimer</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{qaAnswer.safetyNote}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          TAB 8: PRACTICAL SCENARIOS
         ============================================================ */}
      {activeTab === 'scenarios' && (
        <div className="space-y-6">
          <div className="bg-[#0f1628] border border-indigo-500/20 rounded-2xl p-6 space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-400" />
              <span>Real-World Site Engineering Scenarios</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Click any scenario to immediately populate and launch the diagnostic Q&A engine with pre-configured metallurgical parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PRESET_SCENARIOS.map((sc, i) => (
              <div
                key={i}
                className="bg-[#0f1628] border border-indigo-500/20 rounded-2xl p-6 space-y-3.5 hover:border-blue-500/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 font-mono">
                      {sc.category}
                    </span>
                    <span className="text-xs text-slate-400">Scenario {i + 1}</span>
                  </div>
                  <h4 className="text-base font-bold text-white">{sc.title}</h4>
                  <p className="text-xs text-slate-400">{sc.summary}</p>
                  <p className="text-xs text-slate-300 italic pt-1 border-t border-slate-800">
                    "{sc.question}"
                  </p>
                </div>

                <button
                  onClick={() => {
                    setQaQuestion(sc.question);
                    setActiveTab('technical-qa');
                    runQA(sc.question);
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs font-semibold text-blue-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Solve This Scenario in Q&A</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
