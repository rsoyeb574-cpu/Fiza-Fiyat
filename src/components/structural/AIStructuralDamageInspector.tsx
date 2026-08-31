import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Upload, 
  Image as ImageIcon, 
  Film, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon,
  Download, 
  Share2, 
  RefreshCw, 
  HelpCircle, 
  Layers, 
  Building2, 
  Home, 
  Maximize2, 
  X, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronRight, 
  ExternalLink,
  Info,
  Sliders,
  Compass,
  Zap,
  Check
} from 'lucide-react';
import { 
  StructuralInspectionResult, 
  StructureType, 
  DetectedProblem,
  DamageAnnotation,
  VideoFinding 
} from '../../types/structuralInspector';
import { AnnotatedMediaViewer } from './AnnotatedMediaViewer';
import { VideoFindingsTimeline } from './VideoFindingsTimeline';
import { StructuralInspectionQABox } from './StructuralInspectionQABox';
import { downloadStructuralInspectionPdf } from '../../utils/structuralPdfReport';
import { SAMPLE_STRUCTURAL_CASES, SampleStructuralInspectionCase } from '../../data/sampleStructuralInspections';
import { useAuth } from '../../context/AuthContext';
import { usePlan } from '../../context/PlanContext';

const STRUCTURE_TYPES: { id: StructureType; label: string; icon: string }[] = [
  { id: 'auto_detect', label: 'Auto Detect', icon: '✨' },
  { id: 'house', label: 'Residential House', icon: '🏠' },
  { id: 'apartment', label: 'Apartment Building', icon: '🏢' },
  { id: 'building', label: 'Commercial Complex', icon: '🏬' },
  { id: 'column', label: 'Column / Pillar', icon: '🏛️' },
  { id: 'beam', label: 'Beam / Lintel', icon: '📐' },
  { id: 'slab', label: 'Ceiling / Floor Slab', icon: '🔲' },
  { id: 'foundation', label: 'Foundation / Plinth', icon: '🧱' },
  { id: 'roof', label: 'Roof / Parapet', icon: '🏘️' },
  { id: 'retaining_wall', label: 'Retaining Wall', icon: '🛡️' },
  { id: 'boundary_wall', label: 'Boundary Wall / Fence', icon: '🧱' },
  { id: 'bridge', label: 'Bridge / Flyover', icon: '🌉' },
  { id: 'road', label: 'Road / Pavement', icon: '🛣️' },
  { id: 'staircase', label: 'Staircase / Ramp', icon: '🪜' },
  { id: 'parking', label: 'Parking Structure', icon: '🅿️' },
  { id: 'industrial', label: 'Industrial / Warehouse', icon: '🏭' },
  { id: 'other', label: 'Other Civil Structure', icon: '🏗️' }
];

const LOADING_STAGES = [
  { text: 'Uploading media securely...', progress: 15 },
  { text: 'Scanning with Computer Vision & Civil AI...', progress: 40 },
  { text: 'Detecting cracks, spalling, corrosion & distress...', progress: 65 },
  { text: 'Synthesizing visual bounding boxes & engineering causes...', progress: 85 },
  { text: 'Finalizing comprehensive structural damage report...', progress: 98 }
];

export const AIStructuralDamageInspector: React.FC = () => {
  const { user } = useAuth();
  const { plan, usage, refreshPlan } = usePlan();

  // Mode & Media State
  const [activeMediaType, setActiveMediaType] = useState<'image' | 'video'>('image');
  const [uploadedImages, setUploadedImages] = useState<{ data: string; mimeType: string; name: string }[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [extractedVideoFrames, setExtractedVideoFrames] = useState<{ data: string; mimeType: string; label: string; seconds: number }[]>([]);

  // Form State
  const [structureType, setStructureType] = useState<StructureType>('auto_detect');
  const [notes, setNotes] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Execution & Output State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [loadingStageIndex, setLoadingStageIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [inspectionResult, setInspectionResult] = useState<StructuralInspectionResult | null>(null);
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Cycle through loading steps during analysis
  useEffect(() => {
    let timer: any;
    if (isAnalyzing) {
      setLoadingStageIndex(0);
      timer = setInterval(() => {
        setLoadingStageIndex(prev => (prev < LOADING_STAGES.length - 1 ? prev + 1 : prev));
      }, 1800);
    }
    return () => clearInterval(timer);
  }, [isAnalyzing]);

  // File Upload Handlers
  const handleImageFiles = (files: FileList | File[]) => {
    setError(null);
    const validFiles = Array.from(files).filter(f => {
      const isImg = f.type.startsWith('image/');
      if (!isImg) return false;
      if (f.size > 15 * 1024 * 1024) {
        setError(`Image "${f.name}" exceeds 15MB limit.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setUploadedImages(prev => [
          ...prev,
          { data: dataUrl, mimeType: file.type, name: file.name }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoFile = async (file: File) => {
    setError(null);
    if (!file.type.startsWith('video/')) {
      setError('Please upload a valid MP4 or MOV video file.');
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      setError('Video file exceeds 30MB maximum limit.');
      return;
    }

    setVideoFile(file);
    const videoUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(videoUrl);

    // Extract 3-4 key frames client-side for fast preview & AI analysis
    try {
      const frames = await extractKeyframesFromVideo(file, [0.5, 3.0, 6.0, 9.0]);
      setExtractedVideoFrames(frames);
    } catch (err) {
      console.warn('Keyframe extraction notice:', err);
    }
  };

  // Helper to extract frames from video element using canvas
  const extractKeyframesFromVideo = (videoFile: File, timestamps: number[]): Promise<{ data: string; mimeType: string; label: string; seconds: number }[]> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = URL.createObjectURL(videoFile);
      video.muted = true;
      video.playsInline = true;

      const frames: { data: string; mimeType: string; label: string; seconds: number }[] = [];

      video.onloadedmetadata = async () => {
        const duration = video.duration || 10;
        const validTimestamps = timestamps.filter(t => t < duration);
        if (validTimestamps.length === 0) validTimestamps.push(Math.min(1, duration * 0.5));

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        for (let i = 0; i < validTimestamps.length; i++) {
          const sec = validTimestamps[i];
          await new Promise<void>((res) => {
            video.currentTime = sec;
            video.onseeked = () => {
              canvas.width = Math.min(1280, video.videoWidth || 800);
              canvas.height = Math.min(720, video.videoHeight || 600);
              if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
                frames.push({
                  data: dataUrl,
                  mimeType: 'image/jpeg',
                  label: `Timestamp ${Math.floor(sec / 60).toString().padStart(2, '0')}:${Math.floor(sec % 60).toString().padStart(2, '0')}`,
                  seconds: sec
                });
              }
              res();
            };
          });
        }
        resolve(frames);
      };

      video.onerror = () => resolve([]);
    });
  };

  // Run AI Inspection
  const handleStartInspection = async () => {
    setError(null);
    const mediaToAnalyze = activeMediaType === 'video'
      ? extractedVideoFrames.map(f => ({ data: f.data, mimeType: f.mimeType, label: f.label }))
      : uploadedImages.map(img => ({ data: img.data, mimeType: img.mimeType, label: img.name }));

    if (mediaToAnalyze.length === 0) {
      setError('Please upload at least one image or a video to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setInspectionResult(null);

    try {
      const response = await fetch('/api/structural-inspection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: mediaToAnalyze,
          structureType,
          isVideo: activeMediaType === 'video',
          videoTimestamps: activeMediaType === 'video' ? extractedVideoFrames.map((f, i) => ({
            timestamp: `00:0${Math.round(f.seconds)}`,
            seconds: f.seconds,
            frameIndex: i
          })) : undefined,
          notes: notes.trim(),
          userId: user?.id,
          userEmail: user?.email
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to complete structural damage inspection.');
      }

      // Attach client image URLs for viewer
      const clientImageUrls = activeMediaType === 'video'
        ? extractedVideoFrames.map(f => f.data)
        : uploadedImages.map(img => img.data);

      const completeResult: StructuralInspectionResult = {
        ...data,
        imageUrls: clientImageUrls
      };

      setInspectionResult(completeResult);
      if (refreshPlan) refreshPlan();

      // Scroll to result view
      setTimeout(() => {
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error('Inspection error:', err);
      setError(err.message || 'An unexpected error occurred during inspection. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Load Preset Case
  const handleLoadPreset = (sampleCase: SampleStructuralInspectionCase) => {
    setError(null);
    setInspectionResult(sampleCase.mockResult);
    setActiveMediaType('image');
    setUploadedImages([{
      data: sampleCase.thumbnailUrl,
      mimeType: 'image/jpeg',
      name: sampleCase.title
    }]);
    setStructureType(sampleCase.structureType as any);
    setTimeout(() => {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }, 100);
  };

  const handleCopyReportSummary = () => {
    if (!inspectionResult) return;
    const text = `FIZA FIYAT AI STRUCTURAL DAMAGE INSPECTION REPORT
Structure: ${inspectionResult.structureType}
Severity: ${inspectionResult.severity.toUpperCase()}
Confidence: ${inspectionResult.confidence}
On-Site Inspection: ${inspectionResult.immediateProfessionalInspection}

Assessment:
${inspectionResult.overallAssessment}

Detected Findings:
${inspectionResult.findings.map((f, i) => `${i + 1}. ${f.problem} (${f.severity}) - Evidence: ${f.evidence}`).join('\n')}

Disclaimer: Preliminary visual assessment only. Physical on-site inspection by a licensed structural engineer is required.`;

    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical_looking':
        return { label: 'Critical-Looking Distress', bg: 'bg-red-500/20 text-red-400 border-red-500/40', icon: AlertOctagon };
      case 'high':
        return { label: 'High Concern', bg: 'bg-orange-500/20 text-orange-400 border-orange-500/40', icon: AlertTriangle };
      case 'moderate':
        return { label: 'Moderate Concern', bg: 'bg-amber-500/20 text-amber-400 border-amber-500/40', icon: AlertTriangle };
      default:
        return { label: 'Low / Surface Concern', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', icon: CheckCircle2 };
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Welcome & Legal Safety Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-blue-950/40 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 mb-3">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
              Computer Vision & Civil Engineering AI
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              AI Structural <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">Damage Inspector</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mt-2 leading-relaxed">
              Upload photos or videos of residential buildings, columns, beams, slabs, foundations, bridges, or retaining walls. AI detects visible distress, annotates suspected damage, identifies potential causes, and recommends engineering audits.
            </p>
          </div>

          {/* Critical Non-Negotiable Safety Callout */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 md:max-w-xs shrink-0 backdrop-blur-md">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Engineering Safety Rule
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Preliminary visual tool only. Media pixels alone cannot confirm load safety. A licensed structural engineer must perform on-site testing before any repair or occupancy decisions.
            </p>
          </div>
        </div>

        {/* Quick Example Presets Strip */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Try Pre-loaded Field Cases:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {SAMPLE_STRUCTURAL_CASES.map(sample => (
              <button
                key={sample.id}
                onClick={() => handleLoadPreset(sample)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/40 text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{sample.title}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* INPUT & UPLOAD WORKBENCH */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 bg-slate-900/80 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Step 1: Upload Media & Specify Structure</h3>
              <p className="text-xs text-slate-400">Provide clear, well-lit photos or a video showing the damaged area from multiple angles.</p>
            </div>
          </div>

          {/* Media Format Toggle */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => { setActiveMediaType('image'); setError(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMediaType === 'image' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Analyze Photos
            </button>
            <button
              onClick={() => { setActiveMediaType('video'); setError(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMediaType === 'video' ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              Analyze Video
            </button>
          </div>
        </div>

        {/* DRAG & DROP UPLOAD ZONE */}
        {activeMediaType === 'image' ? (
          <div className="space-y-4">
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files) handleImageFiles(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[180px] ${
                isDragOver ? 'border-blue-500 bg-blue-500/10 scale-[1.01]' : 'border-white/15 hover:border-blue-500/50 bg-slate-950/60 hover:bg-slate-950/90'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) handleImageFiles(e.target.files);
                }}
              />
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-3">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-white mb-1">
                Drop high-resolution damage photos here, or <span className="text-blue-400 underline">browse files</span>
              </div>
              <div className="text-xs text-slate-400 max-w-md">
                Supports JPG, PNG, WEBP up to 15MB each. You can upload multiple angles (e.g. Overview, Close-up of crack, Column base).
              </div>
            </div>

            {/* Uploaded Images Preview Strip */}
            {uploadedImages.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span>Selected Photos ({uploadedImages.length}):</span>
                  <button
                    onClick={() => setUploadedImages([])}
                    className="text-red-400 hover:text-red-300 text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Clear All
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-white/10 bg-black aspect-video">
                      <img src={img.data} alt={img.name} className="w-full h-full object-cover" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedImages(prev => prev.filter((_, i) => i !== idx));
                        }}
                        className="absolute top-1 right-1 p-1 rounded-md bg-red-600/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="absolute bottom-0 inset-x-0 p-1 bg-black/60 text-[9px] text-white truncate px-1.5">
                        #{idx + 1} {img.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div
              onClick={() => videoInputRef.current?.click()}
              className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-500/60 rounded-2xl p-8 sm:p-10 text-center transition-all cursor-pointer bg-slate-950/60 hover:bg-slate-950/90 flex flex-col items-center justify-center min-h-[180px]"
            >
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/mov"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleVideoFile(e.target.files[0]);
                }}
              />
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-3">
                <Film className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-white mb-1">
                Upload structural inspection walkthrough video (MP4 / MOV)
              </div>
              <div className="text-xs text-slate-400 max-w-md">
                Max 30MB. AI extracts key walkthrough timestamps automatically to spot cracks and distress across the structure.
              </div>
            </div>

            {videoFile && (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-white font-bold truncate max-w-xs">{videoFile.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({(videoFile.size / (1024 * 1024)).toFixed(1)} MB)</span>
                  </div>
                  <button
                    onClick={() => {
                      setVideoFile(null);
                      setVideoPreviewUrl(null);
                      setExtractedVideoFrames([]);
                    }}
                    className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>

                {extractedVideoFrames.length > 0 && (
                  <div>
                    <div className="text-[11px] text-slate-400 mb-2">Sampled Walkthrough Frames for AI Inspection:</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {extractedVideoFrames.map((frame, idx) => (
                        <div key={idx} className="rounded-xl overflow-hidden border border-white/10 bg-black relative">
                          <img src={frame.data} alt={frame.label} className="w-full h-24 object-cover" />
                          <div className="absolute bottom-0 inset-x-0 p-1 bg-slate-900/80 text-[10px] text-cyan-300 font-mono text-center">
                            {frame.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: STRUCTURE TYPE SELECTOR */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Structure Type / Member Classification:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {STRUCTURE_TYPES.map(type => {
              const isSelected = structureType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setStructureType(type.id)}
                  className={`p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-400'
                      : 'bg-slate-950/70 hover:bg-white/5 border border-white/5 text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="text-base">{type.icon}</span>
                  <span className="truncate">{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional User Observation Notes */}
        <div className="pt-2">
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Field Notes / Specific Observations <span className="text-slate-500">(Optional)</span>:
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Crack appeared after heavy rain; water dripping from slab corner; hairline width ~1mm..."
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Start Inspection Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>Server-side encrypted Gemini multi-modal civil analysis</span>
          </div>

          <button
            onClick={handleStartInspection}
            disabled={isAnalyzing || (activeMediaType === 'image' ? uploadedImages.length === 0 : !videoFile)}
            className="px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Inspecting Structure...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Run AI Structural Damage Inspection</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* MULTI-STAGE LOADING SPINNER */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8 sm:p-12 border border-blue-500/30 bg-slate-900/90 text-center space-y-6 max-w-xl mx-auto shadow-2xl"
        >
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
            <ShieldAlert className="w-8 h-8 text-blue-400 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h4 className="text-xl font-bold text-white">
              {LOADING_STAGES[loadingStageIndex].text}
            </h4>
            <p className="text-xs text-slate-400">
              Examining structural stress markers, material degradation, and safety risks...
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
              initial={{ width: '10%' }}
              animate={{ width: `${LOADING_STAGES[loadingStageIndex].progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      )}

      {/* INSPECTION RESULTS DASHBOARD */}
      {inspectionResult && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Action Bar (Top of Report) */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-card border border-white/10 bg-slate-900/90">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Inspection Report Ready &bull; #{inspectionResult.id}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyReportSummary}
                className="px-3.5 py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-blue-400" />}
                <span>{copySuccess ? 'Copied Summary!' : 'Copy Summary'}</span>
              </button>

              <button
                onClick={() => downloadStructuralInspectionPdf(inspectionResult)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Report (PDF)
              </button>

              <button
                onClick={() => {
                  setInspectionResult(null);
                  setUploadedImages([]);
                  setVideoFile(null);
                  setExtractedVideoFrames([]);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                New Inspection
              </button>
            </div>
          </div>

          {/* MAIN 2-COLUMN INSPECTION LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN (5 cols): Media Viewer & Visual Annotations */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-card rounded-3xl p-5 sm:p-6 border border-white/10 bg-slate-900/80 space-y-4 sticky top-24">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <h3 className="font-bold text-white text-base">Visual Inspection Canvas</h3>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                    {inspectionResult.structureType}
                  </span>
                </div>

                {/* Annotated Media Viewer Component */}
                <AnnotatedMediaViewer
                  imageUrls={inspectionResult.imageUrls || []}
                  annotations={inspectionResult.annotations}
                  findings={inspectionResult.findings}
                  structureType={inspectionResult.structureType}
                  selectedFindingId={selectedFindingId}
                  onSelectFinding={(fId) => setSelectedFindingId(fId)}
                />

                {/* If Video: Keyframe Timeline */}
                {inspectionResult.videoFindings && inspectionResult.videoFindings.length > 0 && (
                  <VideoFindingsTimeline findings={inspectionResult.videoFindings} />
                )}
              </div>
            </div>

            {/* RIGHT COLUMN (7 cols): Findings, Severity, Causes, Repair & Next Steps */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Overall Assessment Banner */}
              <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 bg-slate-900/80 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Preliminary Civil Diagnosis
                    </span>
                    <h3 className="text-xl font-bold text-white mt-0.5">Overall Assessment</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Severity Badge */}
                    {(() => {
                      const badge = getSeverityBadge(inspectionResult.severity);
                      const Icon = badge.icon;
                      return (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border ${badge.bg}`}>
                          <Icon className="w-3.5 h-3.5" />
                          {badge.label}
                        </span>
                      );
                    })()}

                    {/* Confidence */}
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-slate-300">
                      Confidence: <strong className="text-cyan-400">{inspectionResult.confidence}</strong>
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {inspectionResult.overallAssessment}
                </p>

                {inspectionResult.summaryParagraph && (
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-white/5">
                    {inspectionResult.summaryParagraph}
                  </p>
                )}

                {/* Immediate Audit Callout */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-slate-200">On-Site Professional Engineering Audit:</span>
                  </div>
                  <span className={`font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                    inspectionResult.immediateProfessionalInspection === 'Strongly Recommended' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {inspectionResult.immediateProfessionalInspection}
                  </span>
                </div>
              </div>

              {/* DETECTED PROBLEMS LIST */}
              <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 bg-slate-900/80 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                      <AlertOctagon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">Detected Visible Distress Patterns</h4>
                      <p className="text-xs text-slate-400">{inspectionResult.findings.length} observed issues categorized by civil risk</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {inspectionResult.findings.map((f, idx) => {
                    const isSelected = selectedFindingId === f.id;
                    return (
                      <div
                        key={f.id}
                        onClick={() => setSelectedFindingId(isSelected ? null : f.id)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                          isSelected
                            ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/20'
                            : 'bg-slate-950/70 hover:bg-slate-950 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-sm font-bold text-white">{f.problem}</span>
                          </div>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                            f.severity.includes('Critical') || f.severity.includes('High')
                              ? 'bg-red-500/20 text-red-400 border-red-500/30'
                              : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          }`}>
                            {f.severity}
                          </span>
                        </div>

                        <div className="text-xs text-slate-400">
                          <strong>Location:</strong> <span className="text-slate-200">{f.location}</span>
                        </div>

                        <div className="text-xs text-slate-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">
                          <strong>Visible Evidence:</strong> {f.evidence}
                        </div>

                        {/* Expandable Possible Causes */}
                        <div className="space-y-1.5 pt-1">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                            <span>Possible Contributing Causes:</span>
                            <span className="text-slate-500 font-normal">(Subject to on-site testing)</span>
                          </div>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
                            {f.possibleCauses.map((cause, cIdx) => (
                              <li key={cIdx} className="flex items-start gap-1.5 bg-white/5 p-2 rounded-lg border border-white/5">
                                <span className="text-cyan-400 font-bold shrink-0">&bull;</span>
                                <span>{cause}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RECOMMENDED INVESTIGATIONS & WHAT MAY BE REQUIRED */}
              <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 bg-slate-900/80 space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Recommended Engineering Tests & Next Steps</h4>
                    <p className="text-xs text-slate-400">Standard field investigations required to measure severity accurately</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {inspectionResult.whatMayBeRequired.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-white/10 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-200 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* POSSIBLE REPAIR APPROACHES */}
              <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 bg-slate-900/80 space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Possible Repair Methodologies</h4>
                    <p className="text-xs text-slate-400">Differentiating cosmetic surface works from engineered structural rehabilitation</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {inspectionResult.possibleRepairApproaches.map((repair, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-bold text-white">{repair.issueType}</span>
                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          repair.repairClassification.includes('Potential Structural')
                            ? 'bg-red-500/20 text-red-300 border-red-500/40'
                            : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        }`}>
                          {repair.repairClassification}
                        </span>
                      </div>

                      <div className="text-xs text-slate-300 space-y-1">
                        <span className="text-slate-400 font-semibold">Typical Sequential Procedure:</span>
                        <ol className="list-decimal list-inside space-y-1 pl-1 text-slate-300">
                          {repair.steps.map((step, sIdx) => (
                            <li key={sIdx}>{step}</li>
                          ))}
                        </ol>
                      </div>

                      {repair.materialsInvolved && repair.materialsInvolved.length > 0 && (
                        <div className="text-xs text-slate-400 pt-1">
                          <strong>Typical Materials:</strong> <span className="text-cyan-300">{repair.materialsInvolved.join(', ')}</span>
                        </div>
                      )}

                      {repair.professionalWarning && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                          ⚠ {repair.professionalWarning}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* QUESTIONS FOR STRUCTURAL ENGINEER */}
              <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 bg-slate-900/80 space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Key Questions for Your Structural Engineer</h4>
                    <p className="text-xs text-slate-400">Bring these specific questions to the on-site physical inspection</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {inspectionResult.questionsForEngineer.map((q, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex items-start gap-2 text-xs text-slate-200">
                      <span className="text-blue-400 font-bold font-mono">Q{idx + 1}.</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* INTERACTIVE AI Q&A CHAT */}
              <StructuralInspectionQABox inspectionResult={inspectionResult} />

              {/* MANDATORY LEGAL & SAFETY DISCLAIMER CARD */}
              <div className="p-5 rounded-2xl bg-red-950/30 border border-red-500/30 space-y-2">
                <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider">
                  <AlertOctagon className="w-4 h-4" />
                  <span>Mandatory Engineering & Safety Notice</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {inspectionResult.safetyDisclaimer}
                </p>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
