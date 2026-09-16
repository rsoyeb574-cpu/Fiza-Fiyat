import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Heart, 
  Calendar, 
  User, 
  MapPin, 
  FileCode, 
  Sparkles, 
  ChevronRight,
  Video,
  ArrowLeftRight,
  DollarSign,
  Building,
  ShieldCheck,
  Wrench,
  Layers,
  CheckCircle2,
  Move3d,
  Image as ImageIcon,
  Sliders,
  Compass,
  FileText,
  Printer,
  Check,
  Loader2,
  Wand2,
  MessageSquare,
  QrCode,
  Flag,
  TrendingUp
} from 'lucide-react';
import { Project } from '../types';
import { BeforeAfterSlider } from '../components/common/BeforeAfterSlider';
import { ArchitecturalModelViewer } from '../components/common/ArchitecturalModelViewer';
import { Bim3DViewer } from '../components/bim/Bim3DViewer';
import { ProjectResourceAllocationView } from '../components/project/ProjectResourceAllocationView';
import { ProjectMilestoneTracker } from '../components/project/ProjectMilestoneTracker';
import { AIDesignVariationModal } from '../components/project/AIDesignVariationModal';
import { AIDesignIterationModal } from '../components/project/AIDesignIterationModal';
import { BeforeAfter, BeforeAfterScheme } from '../components/project/BeforeAfter';
import { InteractiveSiteMap } from '../components/project/InteractiveSiteMap';
import { ProjectRevisionChat } from '../components/project/ProjectRevisionChat';
import { ArchitecturalDesignConcept } from '../types/designIteration';
import { getProjectSpecs } from '../utils/projectComparison';
import { getProjectMilestones } from '../utils/projectMilestones';
import { downloadProjectSummaryPdf, openProjectSummaryPrintView } from '../utils/projectPdfGenerator';

interface ProjectDetailPageProps {
  project: Project;
  relatedProjects: Project[];
  onBack: () => void;
  onSelectProject: (id: string) => void;
  onOpenShare: (project: Project) => void;
  onToggleFavorite: (project: Project) => void;
  isFavorite: (id: string) => boolean;
  onToggleCompare?: (project: Project) => void;
  isComparing?: (id: string) => boolean;
  onOpenBlueprintScanner?: (initialTab?: 'camera' | 'upload' | 'samples' | 'stamp', preselectedProjectId?: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project,
  relatedProjects,
  onBack,
  onSelectProject,
  onOpenShare,
  onToggleFavorite,
  isFavorite,
  onToggleCompare,
  isComparing = () => false,
  onOpenBlueprintScanner
}) => {
  const [mediaViewMode, setMediaViewMode] = useState<'3d' | 'gallery' | 'video' | 'beforeAfter' | 'siteMap' | 'revisionsChat'>('3d');
  const [viewerEngine, setViewerEngine] = useState<'webgl' | 'architectural'>('webgl');
  const [activeImage, setActiveImage] = useState<string>(project.coverImage || project.images?.[0]);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isVariationModalOpen, setIsVariationModalOpen] = useState(false);
  const [isIterationModalOpen, setIsIterationModalOpen] = useState(false);
  const [generatedConcepts, setGeneratedConcepts] = useState<ArchitecturalDesignConcept[]>([]);
  const [adoptedScheme, setAdoptedScheme] = useState<BeforeAfterScheme | null>(null);
  const [adoptNotification, setAdoptNotification] = useState<string | null>(null);

  const specs = getProjectSpecs(project);
  const milestones = useMemo(() => getProjectMilestones(project), [project]);
  const comparing = isComparing(project.id);

  const handleDownloadSummary = async () => {
    if (isDownloadingPdf) return;
    setIsDownloadingPdf(true);
    try {
      await downloadProjectSummaryPdf(project);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('Error generating project summary PDF:', err);
      // Fallback to high-res printable preview if direct canvas export encountered an issue
      openProjectSummaryPrintView(project);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="pt-28 pb-20 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 text-xs font-semibold cursor-pointer transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Portfolio</span>
      </button>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
              {project.categoryName}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
              {project.title}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            {onToggleCompare && (
              <button
                onClick={() => onToggleCompare(project)}
                className={`px-4 py-3 rounded-2xl font-semibold text-xs flex items-center space-x-2 shadow-lg cursor-pointer transition-all ${
                  comparing
                    ? 'bg-violet-600 text-white shadow-violet-600/30'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-white/10 hover:border-violet-500/40'
                }`}
                title={comparing ? "Remove from comparison" : "Compare this project"}
              >
                <ArrowLeftRight className={`w-4 h-4 ${comparing ? 'text-white' : 'text-violet-400'}`} />
                <span>{comparing ? 'In Comparison Tray' : 'Compare Project'}</span>
              </button>
            )}

            {/* AI Generate Design Iteration Button */}
            <button
              id="generate-design-iteration-btn"
              onClick={() => setIsIterationModalOpen(true)}
              className="px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs flex items-center space-x-2 border border-purple-400/30 shadow-lg shadow-purple-600/25 cursor-pointer transition-all"
              title="Suggest alternative architectural design concepts based on current project parameters using Gemini API"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>Generate Design Iteration</span>
              <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase">
                AI
              </span>
            </button>

            <button
              onClick={handleDownloadSummary}
              disabled={isDownloadingPdf}
              className={`px-4 py-3 rounded-2xl font-semibold text-xs flex items-center space-x-2 shadow-lg cursor-pointer transition-all ${
                downloadSuccess
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/20'
              } disabled:opacity-60`}
              title="Download Polished PDF Project Summary (Specs, Imagery, Cost Breakdown)"
            >
              {isDownloadingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Generating PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Summary Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-white" />
                  <span>Download Summary</span>
                </>
              )}
            </button>

            {onOpenBlueprintScanner && (
              <button
                onClick={() => onOpenBlueprintScanner('stamp', project.id)}
                className="px-4 py-3 rounded-2xl bg-cyan-950/50 hover:bg-cyan-900/70 text-cyan-300 font-semibold text-xs flex items-center space-x-2 border border-cyan-500/40 shadow-lg cursor-pointer transition-all group"
                title="Generate physical CAD Blueprint QR Stamp or scan drawing sheets"
              >
                <QrCode className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>Blueprint QR Stamp</span>
              </button>
            )}

            <button
              onClick={() => onToggleFavorite(project)}
              className="p-3 rounded-2xl bg-neutral-900 border border-white/10 text-white hover:text-red-400 cursor-pointer transition-all"
              title="Bookmark Project"
            >
              <Heart className={`w-5 h-5 ${isFavorite(project.id) ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              onClick={() => onOpenShare(project)}
              className="px-4 py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center space-x-2 border border-white/10 shadow-lg cursor-pointer transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Project</span>
            </button>
          </div>
        </div>

        {/* Quick Meta */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400 pt-2 border-t border-white/10">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-blue-400" />
            <span>Client: <strong className="text-white">{project.clientName}</strong></span>
          </div>
          {project.location && (
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Location: <strong className="text-white">{project.location}</strong></span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>Completed: <strong className="text-white">{project.projectDate}</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Est. Budget: <strong className="text-emerald-400">{specs.estimatedCost}</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-violet-400" />
            <span>Scale: <strong className="text-white">{specs.area}</strong></span>
          </div>
        </div>
      </div>

      {/* Media Mode View Switcher */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/10">
          <div className="flex items-center space-x-2 p-1 rounded-2xl bg-neutral-900 border border-white/10 text-xs">
            <button
              onClick={() => setMediaViewMode('3d')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all ${
                mediaViewMode === '3d'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Move3d className="w-4 h-4 text-blue-300" />
              <span>Interactive 3D BIM Model</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/30 animate-pulse">
                Live 3D
              </span>
            </button>

            <button
              onClick={() => setMediaViewMode('gallery')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all ${
                mediaViewMode === 'gallery'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Photo Showcase ({project.images?.length || 1})</span>
            </button>

            {project.videoUrl && (
              <button
                onClick={() => setMediaViewMode('video')}
                className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all ${
                  mediaViewMode === 'video'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Motion Reel</span>
              </button>
            )}

            {/* Concept vs AI Iteration Before/After Tab */}
            <button
              onClick={() => setMediaViewMode('beforeAfter')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all ${
                mediaViewMode === 'beforeAfter'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
              title="Interactive Before/After comparison of Original Concept vs AI Iterations"
            >
              <Sliders className="w-4 h-4 text-purple-300" />
              <span>Concept vs AI Iteration</span>
              <span className="px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-extrabold border border-purple-500/30">
                Before / After
              </span>
            </button>

            {/* Site Master Plan Tab */}
            <button
              onClick={() => setMediaViewMode('siteMap')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all ${
                mediaViewMode === 'siteMap'
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-600/30'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
              title="Interactive Site Master Plan with SVG Zoning Overlay and Associated Renderings"
            >
              <Compass className="w-4 h-4 text-teal-300" />
              <span>Site Master Plan</span>
              <span className="px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-extrabold border border-teal-500/30">
                SVG Map
              </span>
            </button>

            {/* Real-time Project Revision Chat Tab */}
            <button
              onClick={() => setMediaViewMode('revisionsChat')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all ${
                mediaViewMode === 'revisionsChat'
                  ? 'bg-gradient-to-r from-blue-600 via-teal-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
              title="Real-time Client & Designer Revision Chat directly within project view"
            >
              <MessageSquare className="w-4 h-4 text-blue-300" />
              <span>Revision Discussions</span>
              <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-extrabold border border-blue-500/30">
                Live Collab
              </span>
            </button>

            {/* Project Milestone Progress Tracker Quick Nav Button */}
            <button
              onClick={() => {
                const el = document.getElementById('project-milestones-tracker');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-4 py-2 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all text-neutral-400 hover:text-white hover:bg-white/5"
              title="Inspect Project Milestone Progress & Phase Delivery Tracker"
            >
              <Flag className="w-4 h-4 text-blue-400" />
              <span>Milestones</span>
              <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-extrabold border border-blue-500/30">
                {milestones.overallCompletionPercentage}%
              </span>
            </button>

            {/* AI Design Iteration Modal Trigger */}
            <button
              onClick={() => setIsIterationModalOpen(true)}
              className="px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all bg-gradient-to-r from-purple-950/70 to-indigo-950/70 hover:from-purple-900 hover:to-indigo-900 text-purple-200 border border-purple-500/30 shadow-md shadow-purple-950/40"
              title="Suggest alternative architectural design concepts based on current project parameters using Gemini API"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>Design Iteration</span>
              <span className="px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-extrabold border border-purple-500/30">
                AI
              </span>
            </button>
          </div>

          <span className="text-xs text-neutral-400 hidden sm:inline">
            Use mouse/touch to orbit, zoom, slice slabs, and inspect architectural rebar specifications.
          </span>
        </div>

        {/* 1. INTERACTIVE 3D BIM MODEL VIEWER */}
        {mediaViewMode === '3d' && (
          <div className="space-y-3 animate-in fade-in duration-300">
            {/* 3D Engine Sub-Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-neutral-900/60 p-2.5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Move3d className="w-3.5 h-3.5 text-blue-400" />
                  <span>3D Engine:</span>
                </span>
                <button
                  onClick={() => setViewerEngine('webgl')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    viewerEngine === 'webgl'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white border border-white/5'
                  }`}
                >
                  WebGL 3D (glTF / GLB)
                </button>
                <button
                  onClick={() => setViewerEngine('architectural')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    viewerEngine === 'architectural'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white border border-white/5'
                  }`}
                >
                  Architectural Schematic
                </button>
              </div>

              <span className="text-[11px] text-neutral-400 hidden md:inline">
                {viewerEngine === 'webgl' 
                  ? 'WebGL glTF/GLB Engine with live floor section slicing, PBR shaders & file upload' 
                  : 'Multi-layer isometric massing with lighting and material rebar schedules'}
              </span>
            </div>

            {viewerEngine === 'webgl' ? (
              <Bim3DViewer project={project} />
            ) : (
              <ArchitecturalModelViewer project={project} />
            )}
          </div>
        )}

        {/* 2. PHOTO GALLERY VIEW */}
        {mediaViewMode === 'gallery' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="w-full h-[400px] sm:h-[550px] rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl">
              <img
                src={activeImage}
                alt={project.title}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Floating Variation Shortcut */}
              <button
                onClick={() => setIsVariationModalOpen(true)}
                className="absolute bottom-4 right-4 px-3.5 py-2 rounded-2xl bg-neutral-950/85 backdrop-blur-md border border-purple-500/30 text-white text-xs font-bold flex items-center gap-2 hover:bg-neutral-900 hover:border-purple-400 cursor-pointer transition-all shadow-2xl group"
              >
                <Sparkles className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform" />
                <span>Re-render in Style</span>
              </button>
            </div>

            {/* Thumbnail Strip */}
            {project.images && project.images.length > 1 && (
              <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                {project.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`w-24 h-20 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer transition-all ${
                      activeImage === img ? 'border-blue-500 scale-105' : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. VIDEO WALKTHROUGH VIEW */}
        {mediaViewMode === 'video' && project.videoUrl && (
          <div className="p-6 rounded-3xl bg-neutral-900/80 border border-white/10 space-y-4 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-400" />
              3D Walkthrough & Motion Reel
            </h3>
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <video
                src={project.videoUrl}
                controls
                autoPlay
                className="w-full max-h-[500px] object-cover"
              />
            </div>
          </div>
        )}

        {/* 4. BEFORE & AFTER ARCHITECTURAL CONCEPT COMPARISON VIEW */}
        {mediaViewMode === 'beforeAfter' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <BeforeAfter
              project={project}
              specs={specs}
              onOpenAiIterationModal={() => setIsIterationModalOpen(true)}
              activeGeneratedConcepts={generatedConcepts}
              onAdoptIteration={(scheme) => {
                setAdoptedScheme(scheme);
                setAdoptNotification(`Adopted Scheme ${scheme.schemeLetter}: ${scheme.name} as preferred architectural scheme!`);
                setTimeout(() => setAdoptNotification(null), 4000);
              }}
            />
          </div>
        )}

        {/* 5. INTERACTIVE SITE MASTER PLAN SVG OVERLAY */}
        {mediaViewMode === 'siteMap' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <InteractiveSiteMap project={project} />
          </div>
        )}

        {/* 6. REAL-TIME CLIENT & DESIGNER REVISION CHAT WORKSPACE */}
        {mediaViewMode === 'revisionsChat' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <ProjectRevisionChat project={project} />
          </div>
        )}
      </div>

      {/* Project Writeup & Software Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Full Text Description */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-4 text-xs text-neutral-300 leading-relaxed">
            <h3 className="text-xl font-bold text-white">Architectural & Engineering Summary</h3>
            <p className="text-sm">{project.description}</p>
            {project.fullContent && (
              <div className="pt-4 border-t border-white/10 whitespace-pre-line space-y-3">
                {project.fullContent}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Technical Meta */}
        <div className="space-y-6">
          
          {/* Specifications & Cost Summary */}
          <div className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Building className="w-4 h-4 text-violet-400" />
                Technical Specifications
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                {specs.estimatedCost}
              </span>
            </h4>

            <div className="divide-y divide-white/5 text-xs">
              <div className="py-2 flex justify-between">
                <span className="text-neutral-400">Rate / Unit</span>
                <span className="text-white font-medium">{specs.costPerSqFt}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-neutral-400">Total Scale</span>
                <span className="text-white font-medium">{specs.area}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-neutral-400">Timeline</span>
                <span className="text-violet-300 font-medium">{specs.duration}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-neutral-400">Structural System</span>
                <span className="text-white font-medium text-right max-w-[170px] truncate">{specs.structuralType}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-neutral-400">Floors</span>
                <span className="text-white font-medium">{specs.floors}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-neutral-400">Sustainability</span>
                <span className="text-emerald-400 font-medium text-right max-w-[170px] truncate">{specs.energyRating}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-neutral-400">BIM Level</span>
                <span className="text-blue-300 font-medium">{specs.bimLevel}</span>
              </div>
              <div className="py-2 flex justify-between items-center">
                <span className="text-neutral-400">Milestone Progress</span>
                <button
                  onClick={() => {
                    const el = document.getElementById('project-milestones-tracker');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Scroll down to Milestone Progress Tracker"
                >
                  <span>{milestones.overallCompletionPercentage}% ({milestones.currentPhaseNumber}/{milestones.totalPhasesCount})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Key Materials */}
            {specs.materials && specs.materials.length > 0 && (
              <div className="pt-2 border-t border-white/5 space-y-1.5">
                <span className="text-[11px] font-bold text-neutral-300 block">Specified Materials:</span>
                <div className="flex flex-wrap gap-1.5">
                  {specs.materials.map((mat, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 text-[10px]">
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Generate Design Iterations Trigger inside Technical Specs */}
            <button
              onClick={() => setIsIterationModalOpen(true)}
              className="w-full mt-4 py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>Generate Design Iterations</span>
              <span className="px-1.5 py-0.5 rounded-full bg-purple-500/30 text-[9px] font-extrabold uppercase text-purple-200">
                AI
              </span>
            </button>
          </div>
          
          {/* Software Used */}
          <div className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Software Stack</h4>
            <div className="flex flex-wrap gap-2">
              {project.softwareUsed?.map((sw) => (
                <span key={sw} className="px-3 py-1.5 rounded-xl bg-neutral-800 text-blue-400 text-xs font-medium border border-blue-500/20">
                  {sw}
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Keywords & Tags</h4>
            <div className="flex flex-wrap gap-1.5">
              {project.tags?.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-400 text-[11px]">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Official Project Summary Dossier Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-blue-950/40 via-neutral-900/80 to-neutral-900/90 border border-blue-500/20 space-y-3.5 shadow-xl">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                Project Summary Dossier
              </h4>
              <span className="text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded font-bold">
                PDF Report
              </span>
            </div>
            
            <p className="text-neutral-400 text-xs leading-relaxed">
              Official architectural report compiling complete technical specifications, high-res renders, structural parameters, LOD rating, and full cost distribution.
            </p>

            <div className="space-y-2 pt-1">
              <button
                onClick={handleDownloadSummary}
                disabled={isDownloadingPdf}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/20 disabled:opacity-60"
              >
                {isDownloadingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Compiling PDF Report...</span>
                  </>
                ) : downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>PDF Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-white" />
                    <span>Download Project Summary (PDF)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => openProjectSummaryPrintView(project)}
                className="w-full py-2 px-3 rounded-xl bg-neutral-950/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                title="Open high-resolution printable report in browser tab"
              >
                <Printer className="w-3.5 h-3.5 text-neutral-400" />
                <span>Open Print / Web Preview</span>
              </button>
            </div>
          </div>

          {/* Downloadable Project Files */}
          {project.downloads && project.downloads.length > 0 && (
            <div className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-3">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Download className="w-4 h-4 text-blue-400" />
                Project Downloads
              </h4>
              <div className="space-y-2">
                {project.downloads.map((dl, idx) => (
                  <a
                    key={idx}
                    href={dl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-white/5 hover:border-blue-500/40 text-xs flex items-center justify-between text-neutral-300 hover:text-white transition-all cursor-pointer"
                  >
                    <span className="truncate pr-2">{dl.label}</span>
                    <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded shrink-0">
                      {dl.size || 'Download'}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Dedicated Interactive Before/After Architectural Comparison Section */}
      {mediaViewMode !== 'beforeAfter' && (
        <div id="architectural-concept-comparison" className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>Architectural Evolution: Original Concept vs. AI Iterations</span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-[11px] font-bold">
                  Interactive Toggle
                </span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Assess original baseline geometry against generative structural variations with the interactive before/after comparative engine.
              </p>
            </div>
            <button
              onClick={() => {
                setMediaViewMode('beforeAfter');
                window.scrollTo({ top: 320, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold cursor-pointer transition-all self-start sm:self-auto"
            >
              <span>Focus in Main Showcase</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <BeforeAfter
            project={project}
            specs={specs}
            onOpenAiIterationModal={() => setIsIterationModalOpen(true)}
            activeGeneratedConcepts={generatedConcepts}
            onAdoptIteration={(scheme) => {
              setAdoptedScheme(scheme);
              setAdoptNotification(`Adopted Scheme ${scheme.schemeLetter}: ${scheme.name} as preferred architectural scheme!`);
              setTimeout(() => setAdoptNotification(null), 4000);
            }}
          />
        </div>
      )}

      {/* Dedicated Interactive Site Master Plan & Zoning Breakdown Section */}
      {mediaViewMode !== 'siteMap' && (
        <div id="interactive-site-plan" className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>Interactive Site Master Plan & Spatial Zoning</span>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 text-[11px] font-bold">
                  SVG Vector Overlay
                </span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Hover over discrete building footprints, plazas, and pavilions to inspect real-time GFA metrics, structural systems, and associated perspective renderings.
              </p>
            </div>
            <button
              onClick={() => {
                setMediaViewMode('siteMap');
                window.scrollTo({ top: 320, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/40 text-xs font-bold cursor-pointer transition-all self-start sm:self-auto"
            >
              <span>Focus in Main Showcase</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <InteractiveSiteMap project={project} />
        </div>
      )}

      {/* Project Milestone Progress Tracker (Phase Completion Percentages & Roadmap) */}
      <ProjectMilestoneTracker project={project} />

      {/* Resource Allocation Breakdown (Staffing & Materials Schedule) */}
      <ProjectResourceAllocationView project={project} />

      {/* Dedicated Real-Time Client & Designer Revisions Deliberations Section */}
      {mediaViewMode !== 'revisionsChat' && (
        <div id="project-revisions-section" className="space-y-4 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>Client & Designer Revision Deliberations</span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 text-[11px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                  Real-Time Workspace
                </span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Authorized clients and lead architects/engineers collaborate in real-time on ongoing drawing revisions, cantilever adjustments, material selections, and formal BIM sign-offs.
              </p>
            </div>
            <button
              onClick={() => {
                setMediaViewMode('revisionsChat');
                window.scrollTo({ top: 320, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold cursor-pointer transition-all self-start sm:self-auto"
            >
              <span>Focus in Main Showcase</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <ProjectRevisionChat project={project} />
        </div>
      )}

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">Related Projects</h3>
            <span className="text-xs text-neutral-400">Select to explore or compare</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProjects.slice(0, 3).map((rel) => {
              const relSpecs = getProjectSpecs(rel);
              const relComparing = isComparing(rel.id);

              return (
                <div
                  key={rel.id}
                  onClick={() => onSelectProject(rel.id)}
                  className={`p-4 rounded-3xl bg-neutral-900/60 border hover:border-blue-500/40 cursor-pointer group transition-all space-y-3 flex flex-col justify-between ${
                    relComparing ? 'border-violet-500 ring-2 ring-violet-500/30' : 'border-white/10'
                  }`}
                >
                  <div>
                    <div className="relative h-36 rounded-2xl overflow-hidden mb-2">
                      <img src={rel.coverImage} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 text-violet-300 text-[10px] font-bold">
                        {rel.categoryName}
                      </span>
                    </div>
                    <h4 className="text-white font-bold text-xs group-hover:text-blue-400 truncate">{rel.title}</h4>
                    <p className="text-neutral-400 text-[11px] line-clamp-2 mt-1">{rel.description}</p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-400 font-bold">{relSpecs.estimatedCost}</span>
                    {onToggleCompare && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleCompare(rel);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                          relComparing ? 'bg-violet-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:text-white'
                        }`}
                      >
                        <ArrowLeftRight className="w-3 h-3" />
                        {relComparing ? 'Comparing' : 'Compare'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Design Variation Modal */}
      <AIDesignVariationModal
        isOpen={isVariationModalOpen}
        onClose={() => setIsVariationModalOpen(false)}
        project={project}
        currentImage={activeImage}
        onApplyVariationImage={(newImageUrl) => {
          setActiveImage(newImageUrl);
          setMediaViewMode('gallery');
        }}
      />

      {/* AI Design Iteration Modal (Gemini API Concepts Generator) */}
      <AIDesignIterationModal
        isOpen={isIterationModalOpen}
        onClose={() => setIsIterationModalOpen(false)}
        project={project}
        specs={specs}
        onConceptsGenerated={(concepts) => {
          setGeneratedConcepts(concepts);
        }}
        onOpenBeforeAfter={() => {
          setMediaViewMode('beforeAfter');
          window.scrollTo({ top: 320, behavior: 'smooth' });
        }}
        onApplyConcept={(concept) => {
          setAdoptNotification(`Scheme ${concept.schemeLetter}: ${concept.conceptName} adopted for active exploration.`);
          setTimeout(() => setAdoptNotification(null), 4000);
        }}
      />

      {/* Adoption Feedback Toast */}
      {adoptNotification && (
        <div className="fixed bottom-20 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="px-5 py-3.5 rounded-2xl bg-neutral-900/95 border border-purple-500/40 text-white text-xs font-bold shadow-2xl shadow-purple-950/80 flex items-center gap-3 backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{adoptNotification}</span>
          </div>
        </div>
      )}

      {/* Floating Action Pill to Jump to Revisions Chat */}
      {mediaViewMode !== 'revisionsChat' && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => {
              const el = document.getElementById('project-revisions-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                setMediaViewMode('revisionsChat');
                window.scrollTo({ top: 320, behavior: 'smooth' });
              }
            }}
            className="px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-bold text-xs shadow-2xl shadow-blue-600/40 border border-white/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Open real-time client & designer revision deliberations"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Revisions Chat</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold">
              Live
            </span>
          </button>
        </div>
      )}

    </div>
  );
};
