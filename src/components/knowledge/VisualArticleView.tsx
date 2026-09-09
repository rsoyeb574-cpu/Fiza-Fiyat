import React, { useEffect } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Lightbulb, 
  ChevronRight,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { VisualKnowledgeArticle } from '../../types/visualKnowledge';
import { BeforeAfterVisual } from './BeforeAfterVisual';
import { StepVisualTutorial } from './StepVisualTutorial';
import { DefectVisualCard } from './DefectVisualCard';
import { VISUAL_KNOWLEDGE_ARTICLES } from '../../data/visualKnowledgeData';

interface VisualArticleViewProps {
  article: VisualKnowledgeArticle;
  onBack: () => void;
  onSelectArticle: (article: VisualKnowledgeArticle) => void;
}

export const VisualArticleView: React.FC<VisualArticleViewProps> = ({
  article,
  onBack,
  onSelectArticle
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [article.id]);

  const relatedArticles = VISUAL_KNOWLEDGE_ARTICLES.filter(
    (a) => article.relatedTopicIds?.includes(a.id) || (a.category === article.category && a.id !== article.id)
  ).slice(0, 3);

  return (
    <article className="max-w-5xl mx-auto space-y-12 pb-24 text-neutral-200">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between py-4 border-b border-white/10">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 text-xs font-bold flex items-center gap-2 border border-white/10 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Knowledge Hub</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400 font-mono">
            {article.category} • {article.id}
          </span>
        </div>
      </div>

      {/* 1. HERO SECTION */}
      <section className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-violet-600/20 text-violet-300 border border-violet-500/30">
              {article.category}
            </span>
            {article.subCategory && (
              <span className="text-xs text-neutral-400 font-medium">
                {article.subCategory}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
            {article.oneLineSummary}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 pt-1">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-violet-400" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-violet-400" />
              <span>{article.readTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-violet-400" />
              <span>Published {article.publishDate}</span>
            </div>
          </div>
        </div>

        {/* Hero Image with Overlay Badges */}
        <div className="relative h-[340px] sm:h-[460px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-950">
          <img
            src={article.heroImage}
            alt={article.heroImageAlt || article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent"></div>

          {/* Floating Standards Pill */}
          {article.relevantCodesAndStandards && article.relevantCodesAndStandards.length > 0 && (
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-white uppercase tracking-wider bg-black/70 px-3 py-1 rounded-xl backdrop-blur-md border border-white/10">
                Governing Standards:
              </span>
              {article.relevantCodesAndStandards.map((std, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl bg-emerald-950/80 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30 backdrop-blur-md"
                >
                  {std}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 2. QUICK OVERVIEW (3-5 Key Points) */}
      <section className="rounded-3xl bg-[#0F172A]/80 border border-violet-500/20 p-6 sm:p-8 backdrop-blur-xl space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-400" />
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Key Engineering Takeaways (Quick Overview)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {article.quickOverview.map((point, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-neutral-950/60 border border-white/5"
            >
              <div className="w-6 h-6 rounded-full bg-violet-600/20 border border-violet-500/40 text-violet-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {index + 1}
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {point}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. WHAT IS IT? (Explanation + Diagram/Image) */}
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="text-[11px] font-bold tracking-widest uppercase text-violet-400 block">
            Technical Fundamentals
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            What is {article.title}?
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6 space-y-4">
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
              {article.whatIsIt.description}
            </p>
          </div>

          <div className="lg:col-span-6 space-y-2">
            <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-neutral-950 group">
              <img
                src={article.whatIsIt.diagramImage}
                alt={article.whatIsIt.diagramImageAlt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-neutral-950/80 text-white text-[10px] font-semibold backdrop-blur-md border border-white/10">
                Figure 1.0 • Technical Blueprint
              </span>
            </div>
            {article.whatIsIt.diagramCaption && (
              <p className="text-xs text-neutral-400 italic px-1">
                {article.whatIsIt.diagramCaption}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (Step-by-step with visual sequence) */}
      {article.steps && article.steps.length > 0 && (
        <section className="space-y-4">
          <StepVisualTutorial
            title={article.stepsTitle || "How It Works: Step-by-Step Technical Execution"}
            steps={article.steps}
          />
        </section>
      )}

      {/* 5. PRACTICAL EXAMPLE */}
      {article.practicalExample && (
        <section className="space-y-6 rounded-3xl bg-[#0F172A]/70 border border-white/10 p-6 sm:p-8 backdrop-blur-xl">
          <div className="space-y-2">
            <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-400 block">
              Field Implementation
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Practical Example: {article.practicalExample.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-2">
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-950">
                <img
                  src={article.practicalExample.image}
                  alt={article.practicalExample.imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {article.practicalExample.description}
              </p>

              {/* Specifications Key-Value Table */}
              {article.practicalExample.specifications && (
                <div className="rounded-2xl bg-neutral-950/80 border border-white/10 p-4 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-violet-300 block">
                    Field Engineering Specifications:
                  </span>
                  <div className="space-y-1.5 text-xs">
                    {Object.entries(article.practicalExample.specifications).map(([key, val]) => (
                      <div key={key} className="flex justify-between items-center py-1 border-b border-white/5">
                        <span className="text-neutral-400 capitalize">{key}:</span>
                        <span className="font-mono text-white font-bold">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Takeaway */}
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>
                  <strong>Takeaway:</strong> {article.practicalExample.keyTakeaway}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. BEFORE / AFTER COMPARISON (DO / DON'T) */}
      {article.beforeAfter && (
        <section className="space-y-4">
          <BeforeAfterVisual data={article.beforeAfter} />
        </section>
      )}

      {/* 7. DEFECT ANALYSIS (If present for MS / Sheet Metal) */}
      {article.defectInfo && (
        <section className="space-y-4">
          <DefectVisualCard defect={article.defectInfo} />
        </section>
      )}

      {/* 8. SOFTWARE GUIDE (If present for AutoCAD, Revit, etc.) */}
      {article.softwareGuide && (
        <section className="space-y-6 rounded-3xl bg-[#0F172A]/90 border border-purple-500/30 p-6 sm:p-8 backdrop-blur-xl">
          <div className="space-y-2">
            <span className="text-[11px] font-bold tracking-widest uppercase text-purple-400 block">
              CAD / BIM Software Masterclass
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {article.softwareGuide.softwareName} Practical Workflow
            </h2>
          </div>

          {/* Workspace Visual */}
          <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-950">
            <img
              src={article.softwareGuide.workspaceImage}
              alt={`${article.softwareGuide.softwareName} Workspace`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-neutral-950/90 text-purple-300 text-xs font-bold border border-purple-500/40">
              Interactive Viewport & Coordinate System
            </div>
          </div>

          {/* Key Tools & Shortcuts */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300 block">
              Essential Tools & Command Shortcuts:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {article.softwareGuide.keyTools.map((tool, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-neutral-950/80 border border-white/10 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{tool.name}</span>
                    {tool.shortcut && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-900/40 text-purple-300 font-mono text-[10px] font-bold border border-purple-500/30">
                        {tool.shortcut}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-snug">{tool.purpose}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Common Software Errors & Fixes */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-300 block">
              Common Software Errors & Quick Fixes:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {article.softwareGuide.commonErrors.map((err, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-1 text-xs">
                  <span className="font-bold text-rose-300 block">⚠ {err.error}</span>
                  <p className="text-neutral-300"><strong className="text-emerald-300">Fix:</strong> {err.fix}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. COMMON PROBLEMS & ENGINEERING SOLUTIONS */}
      {article.problemSolution && (
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="text-[11px] font-bold tracking-widest uppercase text-amber-400 block">
              Field Troubleshooting
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Common Site Problem & Verified Solution
            </h2>
          </div>

          <div className="rounded-3xl bg-neutral-950/80 border border-white/10 p-5 sm:p-7 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Problem Visual & Info */}
              <div className="space-y-3">
                <div className="relative h-56 rounded-2xl overflow-hidden border border-rose-500/30 bg-neutral-900">
                  <img
                    src={article.problemSolution.problemImage}
                    alt={article.problemSolution.problemTitle}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-950/90 text-rose-300 text-xs font-bold border border-rose-500/40 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    Problem Identified
                  </span>
                </div>

                <h4 className="text-base font-bold text-white">{article.problemSolution.problemTitle}</h4>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {article.problemSolution.problemDescription}
                </p>

                <div className="text-xs text-neutral-300 space-y-1 pt-1">
                  <span className="text-[10px] font-bold uppercase text-neutral-400 block">
                    Possible Causes:
                  </span>
                  <ul className="space-y-1">
                    {article.problemSolution.possibleCauses.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Solution Visual & Info */}
              <div className="space-y-3">
                <div className="relative h-56 rounded-2xl overflow-hidden border border-emerald-500/30 bg-neutral-900">
                  <img
                    src={article.problemSolution.solutionImage}
                    alt={article.problemSolution.solutionTitle}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-950/90 text-emerald-300 text-xs font-bold border border-emerald-500/40 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Correct Engineering Solution
                  </span>
                </div>

                <h4 className="text-base font-bold text-emerald-300">{article.problemSolution.solutionTitle}</h4>
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                  {article.problemSolution.solutionDescription}
                </p>

                {article.problemSolution.bestPracticeTip && (
                  <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Best Practice:</strong> {article.problemSolution.bestPracticeTip}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 10. ENGINEERING TIPS & GUIDELINES */}
      {article.engineeringTips && article.engineeringTips.length > 0 && (
        <section className="rounded-3xl bg-neutral-950/70 border border-white/10 p-6 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-300 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            Field Engineer's Practical Checklist:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {article.engineeringTips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300 p-2 rounded-xl bg-white/5">
                <span className="text-violet-400 font-bold">•</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 11. RELATED TOPICS (Cards linking to related articles) */}
      {relatedArticles.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Related Visual Topics
            </h3>
            <span className="text-xs text-neutral-400">Expand Your Knowledge</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedArticles.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectArticle(rel)}
                className="group p-3 rounded-2xl bg-neutral-950/60 border border-white/10 hover:border-violet-500/50 transition-all cursor-pointer space-y-2.5"
              >
                <div className="relative h-36 rounded-xl overflow-hidden bg-neutral-900">
                  <img
                    src={rel.heroImage}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-bold text-violet-300 border border-white/10">
                    {rel.category}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-2">
                  {rel.title}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-neutral-400">
                  <span>{rel.readTime}</span>
                  <span className="text-violet-400 font-bold flex items-center gap-0.5">
                    Read <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
