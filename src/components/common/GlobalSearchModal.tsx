import React, { useState } from 'react';
import { Search, X, Building2, BookOpen, Package, Sparkles, Video, HelpCircle, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { Project, Service, BlogArticle } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  services: Service[];
  blogs: BlogArticle[];
  onSelectProject?: (id: string) => void;
  onSelectService?: (id: string) => void;
  onSelectBlog?: (id: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
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
  const [activeCategory, setActiveCategory] = useState<'all' | 'projects' | 'services' | 'blogs' | 'materials' | 'faqs'>('all');

  if (!isOpen) return null;

  const lower = query.toLowerCase();

  const filteredProjects = projects.filter(p => p.title.toLowerCase().includes(lower) || p.description.toLowerCase().includes(lower) || p.location.toLowerCase().includes(lower));
  const filteredServices = services.filter(s => s.title.toLowerCase().includes(lower) || s.description.toLowerCase().includes(lower));
  const filteredBlogs = blogs.filter(b => b.title.toLowerCase().includes(lower) || b.excerpt.toLowerCase().includes(lower));

  const sampleMaterials = [
    { name: 'UltraTech PPC Cement', category: 'Civil', rate: '₹375 / bag', desc: 'Fly ash blended cement with zero micro-cracking risk' },
    { name: 'Tata Tiscon Fe500D Rebar', category: 'Steel', rate: '₹62,000 / ton', desc: 'Seismic grade high elongation steel rebar' },
    { name: 'Magicrete 6" AAC Blocks', category: 'Masonry', rate: '₹62 / block', desc: 'Lightweight thermal block reducing foundation dead weight' }
  ].filter(m => m.name.toLowerCase().includes(lower) || m.desc.toLowerCase().includes(lower));

  const sampleFAQs = [
    { q: 'How long does a 3D BIM model take?', a: 'Typically 5 to 7 business days for LOD 300 to LOD 500 Revit modeling.' },
    { q: 'What is the cost per square foot for residential turnkey building?', a: 'Standard grade construction starts at ₹1,850/sq.ft in regional India.' }
  ].filter(f => f.q.toLowerCase().includes(lower) || f.a.toLowerCase().includes(lower));

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn text-xs"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* SEARCH HEADER */}
        <div className="p-4 bg-slate-950 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search across Projects, Blogs, Materials, Services, Gallery, Videos & FAQs..."
            className="flex-1 bg-transparent text-white font-bold text-sm focus:outline-none placeholder-slate-500"
          />
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CATEGORY TABS */}
        <div className="px-4 py-2 bg-slate-900 border-b border-white/10 flex flex-wrap gap-2">
          {(['all', 'projects', 'services', 'blogs', 'materials', 'faqs'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] cursor-pointer transition-all ${
                activeCategory === cat ? 'bg-cyan-600 text-white' : 'bg-slate-950 text-slate-400 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* RESULTS BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* PROJECTS */}
          {(activeCategory === 'all' || activeCategory === 'projects') && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-cyan-400" /> Projects ({filteredProjects.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredProjects.map(p => (
                  <div 
                    key={p.id} 
                    onClick={() => { onSelectProject?.(p.id); onClose(); }}
                    className="p-3 rounded-2xl bg-slate-950 border border-white/10 hover:border-cyan-500/40 cursor-pointer flex gap-3 items-center"
                  >
                    <img src={p.heroImage} alt={p.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                    <div>
                      <div className="text-white font-bold text-xs">{p.title}</div>
                      <div className="text-slate-400 text-[10px]">{p.location} • {p.year}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SERVICES */}
          {(activeCategory === 'all' || activeCategory === 'services') && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Services ({filteredServices.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredServices.map(s => (
                  <div 
                    key={s.id}
                    onClick={() => { onSelectService?.(s.id); onClose(); }}
                    className="p-3 rounded-2xl bg-slate-950 border border-white/10 hover:border-amber-500/40 cursor-pointer"
                  >
                    <div className="text-white font-bold text-xs">{s.title}</div>
                    <div className="text-slate-400 text-[10px] truncate">{s.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MATERIALS */}
          {(activeCategory === 'all' || activeCategory === 'materials') && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                <Package className="w-4 h-4 text-emerald-400" /> Building Materials DB ({sampleMaterials.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sampleMaterials.map((m, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-slate-950 border border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">{m.name}</span>
                      <span className="text-emerald-400 font-mono font-bold text-[10px]">{m.rate}</span>
                    </div>
                    <p className="text-slate-400 text-[10px]">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQS */}
          {(activeCategory === 'all' || activeCategory === 'faqs') && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-indigo-400" /> FAQs & Guidance ({sampleFAQs.length})
              </h4>
              <div className="space-y-2">
                {sampleFAQs.map((f, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-slate-950 border border-white/10">
                    <div className="text-white font-bold text-xs">Q: {f.q}</div>
                    <p className="text-slate-300 text-[11px] mt-0.5">A: {f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
