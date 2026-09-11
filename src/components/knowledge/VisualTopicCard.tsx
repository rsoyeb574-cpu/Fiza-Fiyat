import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { VisualKnowledgeArticle } from '../../types/visualKnowledge';
import { SafeImage } from '../common/SafeImage';

interface VisualTopicCardProps {
  article: VisualKnowledgeArticle;
  onSelect: (article: VisualKnowledgeArticle) => void;
}

export const VisualTopicCard: React.FC<VisualTopicCardProps> = ({ article, onSelect }) => {
  const categoryTheme: Record<string, string> = {
    Architecture: 'from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30',
    'Civil Engineering': 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30',
    'Structural Engineering': 'from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/30',
    'Interior Design': 'from-pink-500/20 to-rose-500/20 text-pink-300 border-pink-500/30',
    MEP: 'from-sky-500/20 to-indigo-500/20 text-sky-300 border-sky-500/30',
    'MEP Systems': 'from-sky-500/20 to-indigo-500/20 text-sky-300 border-sky-500/30',
    Mechanical: 'from-slate-500/20 to-zinc-500/20 text-slate-300 border-slate-500/30',
    'METALS & SHEET METAL': 'from-orange-500/20 to-red-500/20 text-orange-300 border-orange-500/30',
    'MS & Sheet Metal': 'from-orange-500/20 to-red-500/20 text-orange-300 border-orange-500/30',
    'Welding & Defects': 'from-rose-500/20 to-orange-500/20 text-rose-300 border-rose-500/30',
    CAD: 'from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/30',
    'CAD & Software': 'from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/30',
    BIM: 'from-indigo-500/20 to-violet-500/20 text-indigo-300 border-indigo-500/30',
    '3D Visualization': 'from-fuchsia-500/20 to-purple-500/20 text-fuchsia-300 border-fuchsia-500/30',
    Construction: 'from-yellow-500/20 to-amber-500/20 text-yellow-300 border-yellow-500/30',
    Materials: 'from-teal-500/20 to-emerald-500/20 text-teal-300 border-teal-500/30',
    'Drawing Standards': 'from-blue-500/20 to-indigo-500/20 text-blue-300 border-blue-500/30',
    'Inspection & Damage': 'from-red-500/20 to-orange-500/20 text-red-300 border-red-500/30',
    'Software Guides': 'from-violet-500/20 to-purple-500/20 text-violet-300 border-violet-500/30',
    Calculators: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30',
    'Project Guides': 'from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/30',
  };

  const currentTheme = categoryTheme[article.category] || 'from-violet-500/20 to-indigo-500/20 text-violet-300 border-violet-500/30';

  return (
    <div
      onClick={() => onSelect(article)}
      className="group rounded-3xl bg-[#0F172A]/80 hover:bg-[#0F172A] border border-white/10 hover:border-violet-500/50 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-violet-600/10 cursor-pointer overflow-hidden backdrop-blur-xl"
    >
      <div className="space-y-4">
        {/* Card Image with Badges */}
        <div className="relative h-48 sm:h-52 rounded-2xl overflow-hidden bg-neutral-950 border border-white/5">
          <SafeImage
            src={article.heroImage}
            alt={article.heroImageAlt || article.title}
            topicType={`${article.category} ${article.subCategory || ''} ${article.title}`}
            fallbackTitle={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10 pointer-events-none">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md border bg-gradient-to-r ${currentTheme}`}>
              {article.category}
            </span>
            {article.heroBadge && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white/90 bg-black/60 backdrop-blur-md border border-white/10">
                {article.heroBadge}
              </span>
            )}
          </div>

          {/* Feature indicators */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] text-white/90 z-10 pointer-events-none">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md border border-white/10">
              <Clock className="w-3 h-3 text-violet-400" />
              <span>{article.readTime}</span>
            </div>

            <div className="flex items-center gap-1.5">
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
                  Tools & Commands
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="space-y-2">
          {article.subCategory && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-violet-400 block">
              {article.subCategory}
            </span>
          )}
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h3>
          <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed font-normal">
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
          <span>Explore Technical Guide</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};

