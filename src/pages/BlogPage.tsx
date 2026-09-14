import React, { useState, useMemo } from 'react';
import { 
  Search, 
  BookOpen, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  DraftingCompass, 
  Zap, 
  Activity, 
  Cpu, 
  ArrowLeft,
  Filter
} from 'lucide-react';
import { BlogArticle } from '../types';
import { QUICK_SEARCH_SUGGESTIONS } from '../data/visualKnowledgeData';
import { VisualKnowledgeArticle, KnowledgeCategory } from '../types/visualKnowledge';
import { VisualTopicCard } from '../components/knowledge/VisualTopicCard';
import { VisualArticleView } from '../components/knowledge/VisualArticleView';
import { DrawingAnalyzerView } from '../components/knowledge/DrawingAnalyzerView';
import { MetalIntelligenceSection } from '../components/knowledge/MetalIntelligenceSection';
import { SteelDiagnosisView } from '../components/steel/SteelDiagnosisView';
import { getAllKnowledgeArticles } from '../services/knowledgeAdapter';

interface BlogPageProps {
  blogs: BlogArticle[];
  onSelectBlog: (id: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ blogs, onSelectBlog }) => {
  // Tabs: 'visual', 'metal', 'inspector', 'analyzer', 'journal'
  const [activeTab, setActiveTab] = useState<'visual' | 'metal' | 'inspector' | 'analyzer' | 'journal'>('visual');
  const [selectedArticle, setSelectedArticle] = useState<VisualKnowledgeArticle | null>(null);

  // Search & Filter State for Visual tab
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Master articles from the unified knowledge adapter
  const allArticles = useMemo(() => {
    return getAllKnowledgeArticles();
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allArticles.length };
    allArticles.forEach((art) => {
      counts[art.category] = (counts[art.category] || 0) + 1;
    });
    return counts;
  }, [allArticles]);

  // Metal articles count
  const metalArticlesCount = useMemo(() => {
    return allArticles.filter((a) => {
      const c = (a.category || '').toLowerCase();
      const s = (a.subCategory || '').toLowerCase();
      return (
        c.includes('metal') ||
        c.includes('steel') ||
        c.includes('welding') ||
        s.includes('metal') ||
        s.includes('steel') ||
        s.includes('sheet') ||
        s.includes('welding') ||
        s.includes('fastener') ||
        s.includes('corrosion') ||
        s.includes('inspection')
      );
    }).length;
  }, [allArticles]);

  // Filtered Visual Articles
  const filteredArticles = useMemo(() => {
    return allArticles.filter((article) => {
      const matchesCategory =
        selectedCategory === 'all' || article.category.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        (article.subCategory && article.subCategory.toLowerCase().includes(q)) ||
        article.oneLineSummary.toLowerCase().includes(q) ||
        article.tags.some((t) => t.toLowerCase().includes(q)) ||
        article.category.toLowerCase().includes(q) ||
        (article.relevantCodesAndStandards && article.relevantCodesAndStandards.some((s) => s.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [allArticles, searchQuery, selectedCategory]);

  // Filtered Traditional Blog Articles (Preserved)
  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q);
      return matchesSearch;
    });
  }, [blogs, searchQuery]);

  const handleApplySuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    setSelectedCategory('all');
    setActiveTab('visual');
    setSelectedArticle(null);
  };

  // If a visual article is selected, display the full visual article view
  if (selectedArticle) {
    return (
      <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <VisualArticleView
          article={selectedArticle}
          onBack={() => setSelectedArticle(null)}
          onSelectArticle={(newArticle) => setSelectedArticle(newArticle)}
          onLaunchInspector={() => {
            setSelectedArticle(null);
            setActiveTab('inspector');
          }}
        />
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Platform Header Hero */}
      <div className="text-center space-y-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 text-violet-400 text-xs font-bold border border-violet-500/20 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Architecture & Engineering Visual Learning Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Visual Knowledge & Blueprint Hub
        </h1>

        <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
          Every technical topic explained through blueprints, step-by-step CAD workflows, interactive Before/After sliders, failure diagnostics, and international engineering standards.
        </p>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center justify-center pt-2">
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-neutral-950/80 border border-white/10 shadow-2xl backdrop-blur-xl flex-wrap justify-center">
            {/* Tab 1: Visual Knowledge */}
            <button
              onClick={() => {
                setActiveTab('visual');
                setSelectedArticle(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'visual'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Visual Knowledge ({allArticles.length})</span>
            </button>

            {/* Tab 2: Metal Intelligence & Machine Learning (NEW PREMIUM TAB) */}
            <button
              onClick={() => {
                setActiveTab('metal');
                setSelectedArticle(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'metal'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-neutral-950 font-black shadow-lg shadow-amber-500/30'
                  : 'text-amber-300/90 hover:text-amber-200 bg-amber-500/10 border border-amber-500/20'
              }`}
            >
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Metal Intelligence & ML ({metalArticlesCount})</span>
            </button>

            {/* Tab 3: AI Metal Inspector (Machine Vision) */}
            <button
              onClick={() => {
                setActiveTab('inspector');
                setSelectedArticle(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'inspector'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>AI Metal Inspector</span>
            </button>

            {/* Tab 4: Drawing Analyzer */}
            <button
              onClick={() => {
                setActiveTab('analyzer');
                setSelectedArticle(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'analyzer'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <DraftingCompass className="w-4 h-4" />
              <span>Drawing Analyzer</span>
            </button>

            {/* Tab 5: Traditional Journal */}
            <button
              onClick={() => {
                setActiveTab('journal');
                setSelectedArticle(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'journal'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Articles & Journal ({blogs.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: METAL INTELLIGENCE & MACHINE LEARNING (PREMIUM VIEW) */}
      {activeTab === 'metal' && (
        <MetalIntelligenceSection
          articles={allArticles}
          onSelectArticle={(article) => setSelectedArticle(article)}
          onLaunchInspector={() => setActiveTab('inspector')}
        />
      )}

      {/* VIEW 2: AI METAL INSPECTOR (FULL MACHINE VISION WORKFLOW) */}
      {activeTab === 'inspector' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-900/80 border border-white/10">
            <button
              onClick={() => setActiveTab('metal')}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Metal Intelligence</span>
            </button>
            <span className="text-xs text-amber-400 font-bold flex items-center gap-1.5">
              <Zap className="w-4 h-4 fill-amber-400" />
              Live Computer Vision Model: Gemini 2.5 Structural NDT
            </span>
          </div>

          <SteelDiagnosisView />
        </div>
      )}

      {/* VIEW 3: DRAWING ANALYZER VIEW */}
      {activeTab === 'analyzer' && (
        <DrawingAnalyzerView />
      )}

      {/* VIEW 4: VISUAL KNOWLEDGE PLATFORM (DEFAULT) */}
      {activeTab === 'visual' && (
        <div className="space-y-8">
          {/* Search Bar & Visual Suggestions (Requirement 12) */}
          <div className="rounded-3xl bg-[#0F172A]/80 border border-white/10 p-5 sm:p-6 backdrop-blur-xl space-y-4 shadow-xl">
            <div className="relative">
              <Search className="w-4 h-4 text-violet-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search visual topics (e.g. beam crack, AutoCAD floor plan, Revit family, sheet metal welding)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-neutral-950/80 rounded-2xl border border-white/10 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                Quick Suggestions:
              </span>
              {QUICK_SEARCH_SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  onClick={() => handleApplySuggestion(sug)}
                  className={`px-3 py-1 rounded-full text-xs transition-all cursor-pointer border ${
                    searchQuery.toLowerCase() === sug.toLowerCase()
                      ? 'bg-violet-600 text-white border-violet-400 shadow-md shadow-violet-600/30'
                      : 'bg-neutral-900/80 text-neutral-300 hover:text-white hover:border-violet-500/40 border-white/5'
                  }`}
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Category Filter Pills */}
            <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border border-white/5'
                }`}
              >
                All Topics ({categoryCounts.all || 0})
              </button>

              {/* Special Prominent Metal Intelligence Button */}
              <button
                onClick={() => setActiveTab('metal')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20"
              >
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>Metal Intelligence & ML</span>
                <span className="text-[10px] opacity-75">({metalArticlesCount})</span>
              </button>

              {([
                'Architecture',
                'Structural Engineering',
                'Civil Engineering',
                'Interior Design',
                'MEP Systems',
                'CAD & Software',
                'Drawing Standards',
                'Inspection & Damage'
              ] as KnowledgeCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                      : 'bg-neutral-950 text-neutral-400 hover:text-white border border-white/5'
                  }`}
                >
                  <span>{cat}</span>
                  <span className="text-[10px] opacity-70">({categoryCounts[cat] || 0})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Visual Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <VisualTopicCard
                key={article.id}
                article={article}
                onSelect={(selected) => setSelectedArticle(selected)}
              />
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-20 rounded-3xl bg-neutral-950/60 border border-white/10 space-y-3">
              <Search className="w-8 h-8 text-neutral-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No visual topics found</h3>
              <p className="text-xs text-neutral-400">
                Try searching for another keyword or clear filters to view all disciplines.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* VIEW 5: TRADITIONAL JOURNAL BLOGS (Preserved existing design & content) */}
      {activeTab === 'journal' && (
        <div className="space-y-8">
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/10 backdrop-blur-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search journal articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Preserved Blog Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((b) => (
              <div
                key={b.id}
                onClick={() => onSelectBlog(b.id)}
                className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10 hover:border-blue-500/40 cursor-pointer group transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-48 rounded-2xl overflow-hidden relative">
                    <img
                      src={b.coverImage}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-neutral-950/80 text-blue-400 text-[10px] font-bold border border-blue-500/30">
                      {b.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                    {b.title}
                  </h3>

                  <p className="text-neutral-400 text-xs line-clamp-3 leading-relaxed">
                    {b.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-400" /> {b.readTime || '4 min'}
                  </span>
                  <span className="text-blue-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredBlogs.length === 0 && (
            <div className="text-center py-16 text-neutral-400 text-xs">
              No journal articles found matching the query.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
