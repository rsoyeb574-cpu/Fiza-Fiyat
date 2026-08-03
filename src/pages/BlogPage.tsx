import React, { useState } from 'react';
import { Search, BookOpen, Calendar, Clock, User, ArrowRight, Sparkles } from 'lucide-react';
import { BlogArticle } from '../types';

interface BlogPageProps {
  blogs: BlogArticle[];
  onSelectBlog: (id: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ blogs, onSelectBlog }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categoriesList = Array.from(new Set(blogs.map(b => b.category)));

  const filteredBlogs = blogs.filter(b => {
    const matchesCat = selectedCategory === 'all' || b.category === selectedCategory;
    const matchesQuery = !searchQuery || 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="pt-28 pb-20 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Title */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-blue-400 text-xs font-bold uppercase tracking-widest block">
          Insights & Research
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Fiza Hayat Journal
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed">
          In-depth articles covering generative AI in architecture, Revit BIM workflows, luxury spatial planning, and commercial engineering trends.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-neutral-900/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
        
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search journal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-950 text-neutral-400 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-950 text-neutral-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((b) => (
          <div
            key={b.id}
            onClick={() => onSelectBlog(b.id)}
            className="p-6 rounded-3xl bg-neutral-900/60 border border-white/10 hover:border-blue-500/40 cursor-pointer group transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-48 rounded-2xl overflow-hidden relative">
                <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
        <div className="text-center py-16 text-neutral-400">
          No journal articles found matching the query.
        </div>
      )}

    </div>
  );
};
