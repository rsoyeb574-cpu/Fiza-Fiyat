import React, { useState } from 'react';
import { 
  Building2, 
  Sofa, 
  Sun, 
  Compass, 
  FileCode, 
  Box, 
  Cuboid, 
  Image, 
  Video, 
  PenTool, 
  Clapperboard, 
  Film, 
  Wand2, 
  Sparkle, 
  Share2, 
  Shield, 
  Layout, 
  Smartphone, 
  TrendingUp, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight,
  Search
} from 'lucide-react';
import { Service } from '../types';

interface ServicesPageProps {
  services: Service[];
  setActivePage: (page: string) => void;
  onOpenCalculator: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  services,
  setActivePage,
  onOpenCalculator
}) => {
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categoriesList = Array.from(new Set(services.map(s => s.category)));

  const filteredServices = services.filter(s => {
    const matchesCategory = filterCategory === 'all' || s.category === filterCategory;
    const matchesQuery = !searchQuery || 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="pt-28 pb-20 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-blue-400 text-xs font-bold uppercase tracking-widest block">
          Full Capability Catalog
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          20 Enterprise Services
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed">
          From architectural blueprints and Revit BIM coordination to 8K raytraced renders, generative AI concepting, and luxury digital web hubs.
        </p>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-neutral-900/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
              filterCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-950 text-neutral-400 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                filterCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10 hover:border-blue-500/40 transition-all hover:-translate-y-1 flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">
                  {srv.category}
                </span>
                {srv.featured && (
                  <span className="text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                    Featured Service
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                {srv.title}
              </h3>

              <p className="text-neutral-400 text-xs leading-relaxed">
                {srv.description}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="space-y-1.5">
                {srv.features?.map((f) => (
                  <div key={f} className="text-[11px] text-neutral-300 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setActivePage('contact')}
                className="w-full py-2.5 rounded-xl bg-neutral-950 hover:bg-blue-600 text-neutral-300 hover:text-white border border-white/10 hover:border-blue-500 text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>Request Proposal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Estimator Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-950 via-neutral-900 to-indigo-950 border border-blue-500/30 text-center space-y-4">
        <h3 className="text-2xl font-bold text-white">Need an Instant Cost Estimation for Your Project?</h3>
        <p className="text-neutral-400 text-xs max-w-xl mx-auto">
          Calculate estimated architectural, BIM, and interior fitout investments dynamically using our interactive tool.
        </p>
        <button
          onClick={onOpenCalculator}
          className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-xl cursor-pointer"
        >
          Open Cost Calculator
        </button>
      </div>

    </div>
  );
};
