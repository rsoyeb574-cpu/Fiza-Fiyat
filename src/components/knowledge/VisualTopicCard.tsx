import React from 'react';
import { ArrowRight, Clock, Layers, ShieldAlert, Sparkles, Wrench } from 'lucide-react';
import { VisualKnowledgeArticle } from '../../types/visualKnowledge';

interface VisualTopicCardProps {
  article: VisualKnowledgeArticle;
  onSelect: (article: VisualKnowledgeArticle) => void;
}

export const VisualTopicCard: React.FC<VisualTopicCardProps> = ({ article, onSelect }) => {
  const categoryTheme = {
    Architecture: 'from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30',
    'Structural Engineering': 'from-blue-500/20 to-indigo-500/20 text-blue-300 border-blue-500/30',
    'Civil Engineering': 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30',
    'Interior Design': 'from-fuchsia-500/20 to-pink-500/20 text-fuchsia-300 border-fuchsia-500/30',
    'MEP Systems': 'from-cyan-500/20 to-sky-500/20 text-cyan-300 border-cyan-500/30',
    'CAD & Software': 'from-purple-500/20 to-violet-500/20 text-purple-300 border-purple-500/30',
    'MS & Sheet Metal': 'from-rose-500/20 to-red-500/20 text-rose-300 border-rose-500/30',
    'Welding & Defects': 'from-orange-500/20 to-amber-500/20 text-orange-300 border-orange-500/30',
  }[article.category] || 'from-violet-500/20 to-indigo-500/20 text-violet-300 border-violet-500/30';

  return (
    <div
      onClick={() => onSelect(article)}
      className="group rounded-3xl bg-[#0F172A]/70 hover:bg-[#0F172A] border border-white/10 hover:border-violet-500/50 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-violet-600/10 cursor-pointer overflow-hidden backdrop-blur-xl"
    >
      <div className="space-y-4">
        {/* Card Image with Badges */}
        <div className="relative h-48 sm:h-52 rounded-2xl overflow-hidden bg-neutral-950 border border-white/5">
          <img
            src={article.heroImage}
            alt={article.heroImageAlt || article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md border bg-gradient-to-r ${categoryTheme}`}>
              {article.category}
            </span>
          </div>

          {/* Feature indicators */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] text-white/90">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md border border-white/10">
              <Clock className="w-3 h-3 text-violet-400" />
              <span>{article.readTime}</span>
            </div>

            {article.beforeAfter && (
              <div className="px-2 py-1 rounded-full bg-violet-950/90 text-violet-300 text-[10px] font-bold border border-violet-500/30 backdrop-blur-md">
                Before / After
              </div>
            )}
            {article.defectInfo && (
              <div className="px-2 py-1 rounded-full bg-rose-950/90 text-rose-300 text-[10px] font-bold border border-rose-500/30 backdrop-blur-md">
                Failure Analysis
              </div>
            )}
            {article.softwareGuide && (
              <div className="px-2 py-1 rounded-full bg-purple-950/90 text-purple-300 text-[10px] font-bold border border-purple-500/30 backdrop-blur-md">
                Tools & Shortcuts
              </div>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="space-y-2">
          {article.subCategory && (
            <span className="text-[11px] font-semibold text-violet-400 block tracking-wide">
              {article.subCategory}
            </span>
          )}
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h3>
          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
            {article.oneLineSummary || article.quickOverview[0] || article.whatIsIt.description}
          </p>
        </div>
      </div>

      {/* Footer info & tags */}
      <div className="pt-4 mt-4 border-t border-white/5 space-y-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {article.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-lg bg-white/5 text-[10px] text-neutral-400 font-medium"
            >
              #{tag}
            </span>
          ))}
          {article.relevantCodesAndStandards && article.relevantCodesAndStandards[0] && (
            <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-semibold border border-emerald-500/20">
              {article.relevantCodesAndStandards[0]}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between text-xs font-bold text-violet-400 group-hover:text-violet-300 pt-1">
          <span>Explore Visual Guide</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
