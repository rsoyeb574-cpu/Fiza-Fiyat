import React, { useState } from 'react';
import { 
  Search, 
  Grid, 
  List, 
  Filter, 
  Heart, 
  Eye, 
  ChevronRight, 
  Download, 
  Sparkles, 
  Building2 
} from 'lucide-react';
import { Project, Category } from '../types';

interface PortfolioPageProps {
  projects: Project[];
  categories: Category[];
  onSelectProject: (id: string) => void;
  onToggleFavorite: (project: Project) => void;
  isFavorite: (id: string) => boolean;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  projects,
  categories,
  onSelectProject,
  onToggleFavorite,
  isFavorite
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSoftware, setSelectedSoftware] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Extract all software used across projects
  const allSoftware = Array.from(new Set(projects.flatMap(p => p.softwareUsed || [])));

  const filteredProjects = projects.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesSoft = selectedSoftware === 'all' || (p.softwareUsed && p.softwareUsed.includes(selectedSoftware));
    const matchesQuery = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCat && matchesSoft && matchesQuery;
  });

  return (
    <div className="pt-28 pb-20 space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Page Title */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-blue-400 text-xs font-bold uppercase tracking-widest block">
          Global Portfolio
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Project Showcases & Case Studies
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Explore our portfolio of architectural projects, luxury interior fitouts, Revit BIM coordinates, 8K CGI renders, motion graphics, and AI concept experiments.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-neutral-900/60 p-4 rounded-3xl border border-white/10 space-y-4 backdrop-blur-md">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, software, client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Software Filter */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-neutral-400 text-xs font-medium whitespace-nowrap">Software:</span>
            <select
              value={selectedSoftware}
              onChange={(e) => setSelectedSoftware(e.target.value)}
              className="px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white text-xs focus:outline-none cursor-pointer"
            >
              <option value="all">All Software</option>
              {allSoftware.map((sw) => (
                <option key={sw} value={sw}>{sw}</option>
              ))}
            </select>

            {/* Grid / List toggle */}
            <div className="flex bg-neutral-950 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs cursor-pointer ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-neutral-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs cursor-pointer ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-neutral-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-neutral-950 text-neutral-400 hover:text-white'
            }`}
          >
            All Projects ({projects.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Projects View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="group rounded-3xl bg-neutral-900/80 border border-white/10 overflow-hidden hover:border-blue-500/40 transition-all hover:-translate-y-1 flex flex-col justify-between"
            >
              <div 
                className="relative h-64 overflow-hidden cursor-pointer"
                onClick={() => onSelectProject(proj.id)}
              >
                <img
                  src={proj.coverImage}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent"></div>
                
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md text-blue-400 text-[10px] font-bold border border-blue-500/30">
                  {proj.categoryName}
                </span>

                <button
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(proj); }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-neutral-950/80 backdrop-blur-md text-white hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${isFavorite(proj.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 
                    onClick={() => onSelectProject(proj.id)}
                    className="text-base font-bold text-white group-hover:text-blue-400 transition-colors cursor-pointer line-clamp-1"
                  >
                    {proj.title}
                  </h3>
                  <p className="text-neutral-400 text-xs line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                {/* Software Badges */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {proj.softwareUsed?.slice(0, 3).map((sw) => (
                    <span key={sw} className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-400 text-[10px]">
                      {sw}
                    </span>
                  ))}
                  {proj.softwareUsed && proj.softwareUsed.length > 3 && (
                    <span className="text-[10px] text-neutral-500">+{proj.softwareUsed.length - 3}</span>
                  )}
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>Client: <strong className="text-neutral-200">{proj.clientName}</strong></span>
                  <button
                    onClick={() => onSelectProject(proj.id)}
                    className="text-blue-400 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    View Details <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj.id)}
              className="p-4 rounded-3xl bg-neutral-900/80 border border-white/10 hover:border-blue-500/40 transition-all flex flex-col md:flex-row items-center gap-6 cursor-pointer group"
            >
              <img
                src={proj.coverImage}
                alt={proj.title}
                className="w-full md:w-48 h-32 object-cover rounded-2xl shrink-0"
              />
              <div className="flex-1 space-y-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold text-[10px]">
                  {proj.categoryName}
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  {proj.title}
                </h3>
                <p className="text-neutral-400 line-clamp-2">{proj.description}</p>
                <div className="flex flex-wrap gap-2 pt-1 text-neutral-400">
                  <span>Client: <strong className="text-white">{proj.clientName}</strong></span>
                  <span>• Date: {proj.projectDate}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0 hidden md:block" />
            </div>
          ))}
        </div>
      )}

      {filteredProjects.length === 0 && (
        <div className="text-center py-16 text-neutral-400">
          No projects found matching the selected filter criteria.
        </div>
      )}

    </div>
  );
};
