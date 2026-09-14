import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  ShieldAlert,
  Wrench,
  Layers,
  Activity,
  Cpu,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  BookOpen,
  FileCheck,
  ChevronRight
} from 'lucide-react';
import { VisualKnowledgeArticle } from '../../types/visualKnowledge';
import { VisualTopicCard } from './VisualTopicCard';

interface MetalIntelligenceSectionProps {
  articles: VisualKnowledgeArticle[];
  onSelectArticle: (article: VisualKnowledgeArticle) => void;
  onLaunchInspector: () => void;
}

const METAL_SUB_TABS = [
  'All Metal Topics',
  'Metals & Steel Materials',
  'Sheet Metal',
  'Steel Sections',
  'Aluminium & Non-Ferrous',
  'Metal Fabrication',
  'Welding',
  'Welding Defects',
  'Corrosion & Metal Damage',
  'Fasteners & Connections',
  'Surface Treatment',
  'Metal Inspection'
] as const;

const QUICK_FILTER_CHIPS = [
  { label: 'IS 2062 Mild Steel', filterType: 'search', query: 'IS 2062' },
  { label: 'E350 High Strength', filterType: 'search', query: 'E350' },
  { label: 'Stainless Steel 304/316', filterType: 'search', query: 'Stainless Steel' },
  { label: 'Aluminium 6061-T6', filterType: 'search', query: 'Aluminium 6061' },
  { label: 'Galvanized Iron (GI)', filterType: 'search', query: 'Galvanized' },
  { label: 'K-Factor & Bending', filterType: 'search', query: 'K-Factor' },
  { label: 'HSFG Grade 8.8 / 10.9', filterType: 'search', query: 'HSFG' },
  { label: 'Base Plates & Grout', filterType: 'search', query: 'Base Plate' },
  { label: 'AWS D1.1 Weld Defects', filterType: 'search', query: 'Weld Defects' },
  { label: 'Porosity & Undercut', filterType: 'search', query: 'Porosity' },
  { label: 'ISO 12944 Sa 2.5', filterType: 'search', query: 'Sa 2.5' },
  { label: 'Ultrasonic (UT) Inspection', filterType: 'search', query: 'Ultrasonic' }
];

export const MetalIntelligenceSection: React.FC<MetalIntelligenceSectionProps> = ({
  articles,
  onSelectArticle,
  onLaunchInspector
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<string>('All Metal Topics');
  const [selectedMaterialFilter, setSelectedMaterialFilter] = useState<string>('all');

  // Filter dedicated metal articles
  const metalArticles = useMemo(() => {
    return articles.filter((art) => {
      const cat = (art.category || '').toLowerCase();
      const sub = (art.subCategory || '').toLowerCase();
      return (
        cat.includes('metal') ||
        cat.includes('steel') ||
        cat.includes('welding') ||
        sub.includes('metal') ||
        sub.includes('steel') ||
        sub.includes('sheet') ||
        sub.includes('welding') ||
        sub.includes('fastener') ||
        sub.includes('corrosion') ||
        sub.includes('inspection')
      );
    });
  }, [articles]);

  // Subcategory counts
  const subCategoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All Metal Topics': metalArticles.length };
    metalArticles.forEach((art) => {
      const sub = art.subCategory || 'Other';
      counts[sub] = (counts[sub] || 0) + 1;
    });
    return counts;
  }, [metalArticles]);

  // Filtered dataset matching search, subcategory, materials, applications, problems & solutions
  const filteredMetalArticles = useMemo(() => {
    return metalArticles.filter((article) => {
      // 1. Subcategory filter
      if (activeSubTab !== 'All Metal Topics') {
        const targetSub = activeSubTab.toLowerCase();
        const artSub = (article.subCategory || '').toLowerCase();
        const artTags = article.tags.map((t) => t.toLowerCase());

        let matchesSub = artSub.includes(targetSub) || targetSub.includes(artSub);
        if (!matchesSub) {
          if (targetSub.includes('aluminium') && (artTags.includes('aluminium') || artTags.includes('copper') || artTags.includes('brass'))) matchesSub = true;
          if (targetSub.includes('welding') && (artSub.includes('weld') || artTags.includes('welding'))) matchesSub = true;
          if (targetSub.includes('corrosion') && (artSub.includes('corrosion') || artTags.includes('rust') || artTags.includes('pitting'))) matchesSub = true;
          if (targetSub.includes('fastener') && (artSub.includes('fastener') || artTags.includes('bolts') || artTags.includes('base plate'))) matchesSub = true;
          if (targetSub.includes('surface') && (artSub.includes('surface') || artTags.includes('coating') || artTags.includes('paint'))) matchesSub = true;
          if (targetSub.includes('inspection') && (artSub.includes('inspection') || artTags.includes('ndt') || artTags.includes('ultrasonic'))) matchesSub = true;
          if (targetSub.includes('sheet') && (artSub.includes('sheet') || artTags.includes('crca') || artTags.includes('hrpo'))) matchesSub = true;
          if (targetSub.includes('sections') && (artSub.includes('sections') || artTags.includes('ismb') || artTags.includes('ismc') || artTags.includes('isa'))) matchesSub = true;
          if (targetSub.includes('fabrication') && (artSub.includes('fabrication') || artTags.includes('k-factor') || artTags.includes('press brake'))) matchesSub = true;
        }

        if (!matchesSub) return false;
      }

      // 2. Specific Material filter
      if (selectedMaterialFilter !== 'all') {
        const mat = selectedMaterialFilter.toLowerCase();
        const hasMaterial =
          article.tags.some((t) => t.toLowerCase().includes(mat)) ||
          article.title.toLowerCase().includes(mat) ||
          (article.practicalExample?.specifications &&
            Object.values(article.practicalExample.specifications).some((v) => v.toLowerCase().includes(mat)));
        if (!hasMaterial) return false;
      }

      // 3. Search query filter across all fields: title, summary, tags, material, application, problem, solution
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();

      // Title & One-line summary
      if (article.title.toLowerCase().includes(q)) return true;
      if (article.oneLineSummary.toLowerCase().includes(q)) return true;
      if (article.whatIsIt?.description.toLowerCase().includes(q)) return true;

      // Tags & Category
      if (article.tags.some((t) => t.toLowerCase().includes(q))) return true;
      if ((article.subCategory || '').toLowerCase().includes(q)) return true;

      // Relevant Codes & Standards
      if (article.relevantCodesAndStandards?.some((code) => code.toLowerCase().includes(q))) return true;

      // Material fields
      if (article.practicalExample?.specifications) {
        for (const [key, val] of Object.entries(article.practicalExample.specifications)) {
          if (key.toLowerCase().includes(q) || val.toLowerCase().includes(q)) return true;
        }
      }

      // Application fields
      if (article.practicalExample?.title.toLowerCase().includes(q)) return true;
      if (article.practicalExample?.description.toLowerCase().includes(q)) return true;
      if (article.quickOverview.some((o) => o.toLowerCase().includes(q))) return true;

      // Problem fields
      if (article.problemSolution?.problemTitle.toLowerCase().includes(q)) return true;
      if (article.problemSolution?.problemDescription.toLowerCase().includes(q)) return true;
      if (article.problemSolution?.possibleCauses.some((c) => c.toLowerCase().includes(q))) return true;

      // Solution fields
      if (article.problemSolution?.solutionTitle.toLowerCase().includes(q)) return true;
      if (article.problemSolution?.solutionDescription.toLowerCase().includes(q)) return true;
      if (article.problemSolution?.bestPracticeTip?.toLowerCase().includes(q)) return true;

      return false;
    });
  }, [metalArticles, activeSubTab, selectedMaterialFilter, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveSubTab('All Metal Topics');
    setSelectedMaterialFilter('all');
  };

  return (
    <div className="space-y-10">
      {/* 1. HERO BANNER: METAL INTELLIGENCE & MACHINE LEARNING */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/40 via-neutral-950 to-neutral-900 border border-amber-500/30 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>Metal Intelligence & Machine Learning</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
              Metals, Steel, Sheet Metal, Welding, Fabrication & AI Inspection
            </h2>

            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
              Industrial metallurgy reference and machine vision diagnostics: hot-rolled coils, CRCA precision forming, IS 808 beam and channel structural calculations, AWS D1.1 weld flaw classification, and ASTM corrosion mitigation.
            </p>

            {/* Quick Metrics Bar */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-white/5">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Catalog Topics</span>
                <span className="text-lg font-black text-white">{metalArticles.length} Modules</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-white/5">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Governing Codes</span>
                <span className="text-lg font-black text-amber-400">IS / AWS / ASTM</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-white/5">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">NDT Techniques</span>
                <span className="text-lg font-black text-emerald-400">UT, MT, PT, VT</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-white/5">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">AI Vision Engine</span>
                <span className="text-lg font-black text-violet-400">Gemini 2.5 NDT</span>
              </div>
            </div>
          </div>

          {/* AI Inspection Call-to-Action Card */}
          <div className="shrink-0 w-full lg:w-80 p-5 rounded-2xl bg-neutral-950/90 border border-amber-500/30 shadow-xl space-y-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">AI Steel & Weld Inspector</h3>
                <span className="text-[11px] text-amber-300">Live Machine Vision</span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Upload photos of steel members, rust, sheet metal bends, or weld seams for instant defect classification and structural remediation codes.
            </p>

            <button
              onClick={onLaunchInspector}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-neutral-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-neutral-950" />
              <span>Launch AI Inspector</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. ADVANCED SEARCH & FILTER CONTROL SYSTEM */}
      <div className="rounded-3xl bg-[#0B0F17]/90 border border-white/10 p-5 sm:p-6 backdrop-blur-xl space-y-5 shadow-xl">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search metal topics, materials (IS 2062, E350), applications (purlins, base plates), problems (porosity, undercut), solutions, or codes (AWS D1.1)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-24 py-3 bg-neutral-950/80 rounded-2xl border border-white/10 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400 hover:text-white bg-white/5 px-2.5 py-1 rounded-lg border border-white/10"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Filter Search Chips */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3 h-3 text-amber-400" />
              Quick Engineering Queries:
            </span>
            {(searchQuery || activeSubTab !== 'All Metal Topics' || selectedMaterialFilter !== 'all') && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            {QUICK_FILTER_CHIPS.map((chip) => (
              <button
                key={chip.label}
                onClick={() => {
                  setSearchQuery(chip.query);
                  setActiveSubTab('All Metal Topics');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer border flex items-center gap-1.5 ${
                  searchQuery.toLowerCase() === chip.query.toLowerCase()
                    ? 'bg-amber-500 text-neutral-950 font-bold border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-neutral-900/80 text-neutral-300 hover:text-white hover:border-amber-500/40 border-white/5'
                }`}
              >
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Subcategory Filter Tabs */}
        <div className="pt-3 border-t border-white/5">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-800">
            {METAL_SUB_TABS.map((sub) => {
              const count = subCategoryCounts[sub] || 0;
              const isActive = activeSubTab === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setActiveSubTab(sub)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-neutral-950 shadow-md shadow-amber-500/20'
                      : 'bg-neutral-950 text-neutral-400 hover:text-white border border-white/5'
                  }`}
                >
                  <span>{sub}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/20 text-neutral-900' : 'bg-white/5 text-neutral-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. ARTICLES RESULT COUNT & ACTIVE FILTER PILLS */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400 px-1">
        <div className="flex items-center gap-2">
          <span>Showing</span>
          <span className="text-white font-bold text-sm">{filteredMetalArticles.length}</span>
          <span>technical metal intelligence articles</span>
          {searchQuery && (
            <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
              Keyword: "{searchQuery}"
            </span>
          )}
        </div>

        <span className="text-[11px] text-neutral-400">
          Click any card to read full technical breakdown with diagrams and problem/solution engineering.
        </span>
      </div>

      {/* 4. VISUAL TOPIC CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMetalArticles.map((article) => (
          <VisualTopicCard
            key={article.id}
            article={article}
            onSelect={(selected) => onSelectArticle(selected)}
          />
        ))}
      </div>

      {/* 5. EMPTY STATE WHEN NO ARTICLES MATCH */}
      {filteredMetalArticles.length === 0 && (
        <div className="text-center py-20 rounded-3xl bg-neutral-950/80 border border-white/10 space-y-4 max-w-xl mx-auto p-8">
          <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No metal topics found</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            No articles match your current search query <strong>"{searchQuery}"</strong> in category <strong>"{activeSubTab}"</strong>. 
            Try searching across material grades like IS 2062, E350, SS 304, or defects like undercut, porosity, and cracks.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 text-xs font-bold cursor-pointer hover:bg-amber-400 transition-colors"
            >
              Reset All Filters
            </button>
            <button
              onClick={onLaunchInspector}
              className="px-4 py-2 rounded-xl bg-neutral-900 border border-amber-500/30 text-amber-300 text-xs font-bold cursor-pointer hover:bg-neutral-800 transition-colors"
            >
              Use AI Metal Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
