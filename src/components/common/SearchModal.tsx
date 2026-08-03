import React, { useState, useEffect } from 'react';
import { Search, X, Folder, ArrowRight, Sparkles, Building2, BookOpen } from 'lucide-react';
import { Project, Service, BlogArticle } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  services: Service[];
  blogs: BlogArticle[];
  onSelectProject: (id: string) => void;
  onSelectService: (id: string) => void;
  onSelectBlog: (id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  projects,
  services,
  blogs,
  onSelectProject,
  onSelectService,
  onSelectBlog
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open search modal
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProjects = query.trim()
    ? projects.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(query.toLowerCase()) ||
        p.softwareUsed.some(s => s.toLowerCase().includes(query.toLowerCase())) ||
        p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 4)
    : projects.slice(0, 3);

  const filteredServices = query.trim()
    ? services.filter(s => 
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase()) ||
        s.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4)
    : services.slice(0, 3);

  const filteredBlogs = query.trim()
    ? blogs.filter(b => 
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.excerpt.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-neutral-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="p-4 border-b border-white/10 flex items-center space-x-3 bg-neutral-950/50">
          <Search className="w-5 h-5 text-blue-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search projects, CAD models, BIM services, or articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-neutral-500 text-sm focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-neutral-400 hover:text-white text-xs">
              Clear
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-1 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results */}
        <div className="p-4 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Projects section */}
          {filteredProjects.length > 0 && (
            <div>
              <h4 className="text-neutral-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 text-[11px]">
                <Building2 className="w-3.5 h-3.5 text-blue-400" /> Projects ({filteredProjects.length})
              </h4>
              <div className="space-y-2">
                {filteredProjects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => { onSelectProject(proj.id); onClose(); }}
                    className="p-2.5 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 border border-white/5 hover:border-blue-500/30 flex items-center space-x-3 cursor-pointer group transition-all"
                  >
                    <img 
                      src={proj.coverImage} 
                      alt={proj.title}
                      className="w-12 h-12 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium group-hover:text-blue-400 transition-colors truncate">
                        {proj.title}
                      </div>
                      <div className="text-neutral-400 text-[11px] truncate">{proj.categoryName} • {proj.clientName}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services Section */}
          {filteredServices.length > 0 && (
            <div>
              <h4 className="text-neutral-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Services & Capabilities
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredServices.map((srv) => (
                  <div
                    key={srv.id}
                    onClick={() => { onSelectService(srv.id); onClose(); }}
                    className="p-2.5 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 border border-white/5 hover:border-blue-500/30 cursor-pointer group transition-all"
                  >
                    <div className="text-white font-medium group-hover:text-blue-400 transition-colors">
                      {srv.title}
                    </div>
                    <div className="text-neutral-400 text-[11px] line-clamp-1 mt-0.5">{srv.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blogs Section */}
          {filteredBlogs.length > 0 && (
            <div>
              <h4 className="text-neutral-400 font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5 text-[11px]">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" /> Articles & Reports
              </h4>
              <div className="space-y-2">
                {filteredBlogs.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => { onSelectBlog(b.id); onClose(); }}
                    className="p-2.5 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 border border-white/5 cursor-pointer group transition-all"
                  >
                    <div className="text-white font-medium group-hover:text-blue-400">{b.title}</div>
                    <div className="text-neutral-400 text-[11px] line-clamp-1">{b.excerpt}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {query.trim() && filteredProjects.length === 0 && filteredServices.length === 0 && filteredBlogs.length === 0 && (
            <div className="text-center py-8 text-neutral-400">
              No matching projects or services found for "{query}".
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-neutral-950 border-t border-white/10 text-neutral-500 text-[11px] flex items-center justify-between">
          <span>Press ESC or click outside to dismiss</span>
          <span>FIZA HAYAT Business Hub Search</span>
        </div>
      </div>
    </div>
  );
};
