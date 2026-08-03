import React, { useState } from 'react';
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
  Video
} from 'lucide-react';
import { Project } from '../types';
import { BeforeAfterSlider } from '../components/common/BeforeAfterSlider';

interface ProjectDetailPageProps {
  project: Project;
  relatedProjects: Project[];
  onBack: () => void;
  onSelectProject: (id: string) => void;
  onOpenShare: (project: Project) => void;
  onToggleFavorite: (project: Project) => void;
  isFavorite: (id: string) => boolean;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project,
  relatedProjects,
  onBack,
  onSelectProject,
  onOpenShare,
  onToggleFavorite,
  isFavorite
}) => {
  const [activeImage, setActiveImage] = useState<string>(project.coverImage || project.images?.[0]);

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
            <button
              onClick={() => onToggleFavorite(project)}
              className="p-3 rounded-2xl bg-neutral-900 border border-white/10 text-white hover:text-red-400 cursor-pointer transition-all"
              title="Bookmark Project"
            >
              <Heart className={`w-5 h-5 ${isFavorite(project.id) ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              onClick={() => onOpenShare(project)}
              className="px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg cursor-pointer transition-all"
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
        </div>
      </div>

      {/* Main Image Gallery Showcase */}
      <div className="space-y-4">
        <div className="w-full h-[400px] sm:h-[550px] rounded-3xl overflow-hidden border border-white/10 relative">
          <img
            src={activeImage}
            alt={project.title}
            className="w-full h-full object-cover transition-all duration-300"
          />
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

      {/* Video Player Section */}
      {project.videoUrl && (
        <div className="p-6 rounded-3xl bg-neutral-900/80 border border-white/10 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-blue-400" />
            3D Walkthrough & Motion Reel
          </h3>
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <video
              src={project.videoUrl}
              controls
              className="w-full max-h-[500px] object-cover"
            />
          </div>
        </div>
      )}

      {/* Before / After Slider (If Available) */}
      {project.beforeAfter && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Before vs After Transformation</h3>
          <BeforeAfterSlider
            beforeImage={project.beforeAfter.before}
            afterImage={project.beforeAfter.after}
            labelBefore={project.beforeAfter.labelBefore}
            labelAfter={project.beforeAfter.labelAfter}
          />
        </div>
      )}

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

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-white/10">
          <h3 className="text-2xl font-bold text-white">Related Projects</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProjects.slice(0, 3).map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectProject(rel.id)}
                className="p-4 rounded-2xl bg-neutral-900/60 border border-white/10 hover:border-blue-500/40 cursor-pointer group transition-all space-y-3"
              >
                <img src={rel.coverImage} alt={rel.title} className="w-full h-36 object-cover rounded-xl" />
                <h4 className="text-white font-bold text-xs group-hover:text-blue-400 truncate">{rel.title}</h4>
                <p className="text-neutral-400 text-[11px] line-clamp-2">{rel.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
