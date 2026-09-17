import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  Trophy, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  DollarSign, 
  Leaf, 
  RefreshCw, 
  HelpCircle, 
  Send, 
  Lightbulb, 
  Cpu, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { Project } from '../../types';
import { NormalizedProjectSpecs } from '../../utils/projectComparison';

interface ProjectComparisonAIAdvisorProps {
  project1: Project;
  project2: Project;
  specs1: NormalizedProjectSpecs;
  specs2: NormalizedProjectSpecs;
}

export interface AIComparativeAnalysis {
  recommendationTitle: string;
  recommendedOption: 1 | 2 | 0;
  executiveVerdict: string;
  keyTradeoffs: string[];
  costBenefitAnalysis: string;
  structuralAndBimAssessment: string;
  sustainabilityVerdict: string;
  hybridRecommendations: string[];
  clientSuitability: {
    project1BestFor: string;
    project2BestFor: string;
  };
}

const PRESET_QUESTIONS = [
  'Which project offers faster capital return & lower construction risk?',
  'How can we integrate Project 2’s facade with Project 1’s structural grid?',
  'Compare long-term maintenance costs and operational lifecycle.',
  'Which project is better suited for seismic and harsh environmental zones?'
];

export const ProjectComparisonAIAdvisor: React.FC<ProjectComparisonAIAdvisorProps> = ({
  project1,
  project2,
  specs1,
  specs2
}) => {
  const [analysis, setAnalysis] = useState<AIComparativeAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [focusArea, setFocusArea] = useState<'holistic' | 'financial' | 'structural' | 'sustainability'>('holistic');
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [lastPrompt, setLastPrompt] = useState<string>('');

  const fetchAIAnalysis = async (focus = focusArea, question = '') => {
    setIsLoading(true);
    setError(null);
    setLastPrompt(question || focus);

    try {
      const res = await fetch('/api/project/compare-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project1: {
            title: project1.title,
            categoryName: project1.categoryName,
            location: project1.location,
            specs: specs1
          },
          project2: {
            title: project2.title,
            categoryName: project2.categoryName,
            location: project2.location,
            specs: specs2
          },
          focusArea: focus,
          customQuestion: question.trim() || undefined
        })
      });

      const data = await res.json();
      if (data.status === 'success' && data.recommendationTitle) {
        setAnalysis(data);
      } else {
        setError(data.error || 'Unable to generate comparative AI analysis.');
      }
    } catch (err: any) {
      console.error('Failed to fetch AI comparison analysis:', err);
      setError(err?.message || 'Network error communicating with AI comparison service.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!analysis && !isLoading) {
      fetchAIAnalysis('holistic');
    }
  }, [project1.id, project2.id]);

  const handleFocusChange = (newFocus: 'holistic' | 'financial' | 'structural' | 'sustainability') => {
    setFocusArea(newFocus);
    fetchAIAnalysis(newFocus);
  };

  const handleAskPreset = (preset: string) => {
    setCustomQuestion(preset);
    fetchAIAnalysis(focusArea, preset);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    fetchAIAnalysis(focusArea, customQuestion);
  };

  return (
    <div className="space-y-5" id="ai-comparison-advisor-panel">
      
      {/* HEADER CONTROLS BAR */}
      <div className="bg-[#111A2E] p-4 rounded-2xl border border-violet-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-violet-950/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-violet-600/30 shrink-0">
            <Sparkles className="w-5 h-5 text-violet-100 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white tracking-tight">
                Gemini Architectural Comparative Advisor
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/40 text-[10px] font-extrabold uppercase text-violet-300">
                AI Powered
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Evaluates trade-offs, financial return, structural feasibility, and hybrid opportunities between both schemes.
            </p>
          </div>
        </div>

        {/* FOCUS TABS */}
        <div className="flex items-center gap-1.5 bg-[#090D1A] p-1 rounded-xl border border-slate-800 self-start md:self-auto overflow-x-auto max-w-full">
          {[
            { id: 'holistic', label: 'Holistic' },
            { id: 'financial', label: 'Financial / ROI' },
            { id: 'structural', label: 'Structural & BIM' },
            { id: 'sustainability', label: 'Sustainability' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleFocusChange(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                focusArea === tab.id
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => fetchAIAnalysis(focusArea, customQuestion)}
            disabled={isLoading}
            title="Re-run AI synthesis"
            className="p-1.5 rounded-lg text-slate-400 hover:text-violet-300 hover:bg-violet-900/30 transition-all cursor-pointer ml-1 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-violet-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* ERROR NOTICE */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center justify-between text-xs text-red-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchAIAnalysis(focusArea)}
            className="px-3 py-1 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-white font-bold cursor-pointer transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* LOADING STATE */}
      {isLoading && (
        <div className="bg-[#0D1527] p-8 rounded-2xl border border-violet-500/20 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 animate-spin">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Synthesizing Comparative Architectural Parameters...</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Analyzing structural matrices, cost per sq.ft variance, and environmental specifications with Gemini AI.
            </p>
          </div>
        </div>
      )}

      {/* MAIN ANALYSIS CONTENT */}
      {!isLoading && analysis && (
        <div className="space-y-5 animate-fadeIn">
          
          {/* 1. EXECUTIVE VERDICT HERO CARD */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#121B30] via-[#0E172A] to-[#121B30] border border-violet-500/40 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-violet-600/20 text-violet-300">
                  <Trophy className="w-4 h-4" />
                </span>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-violet-400">
                  Executive Verdict
                </span>
              </div>

              {/* RECOMMENDED BADGE */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                {analysis.recommendedOption === 1 ? (
                  <span className="px-3 py-1 rounded-full bg-violet-600/30 border border-violet-500/50 text-violet-200 text-xs font-black flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                    Preferred Strategic Choice: {project1.title}
                  </span>
                ) : analysis.recommendedOption === 2 ? (
                  <span className="px-3 py-1 rounded-full bg-blue-600/30 border border-blue-500/50 text-blue-200 text-xs font-black flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    Preferred Strategic Choice: {project2.title}
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    Balanced Typology Fit (Context-Dependent)
                  </span>
                )}
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mb-2">
              {analysis.recommendationTitle}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {analysis.executiveVerdict}
            </p>
          </div>

          {/* 2. KEY COMPARATIVE TRADEOFFS */}
          <div className="bg-[#0F172A] p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Critical Architectural & Commercial Trade-Offs
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {analysis.keyTradeoffs.map((tradeoff, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#141E36]/70 border border-indigo-500/20 text-xs text-slate-300 space-y-1 relative"
                >
                  <span className="text-[10px] font-black text-indigo-400 block uppercase">
                    Trade-Off #{idx + 1}
                  </span>
                  <p className="leading-relaxed font-medium">{tradeoff}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. FOUR DEEP-DIVE STRATEGIC VECTORS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* VECTOR 1: FINANCIAL & PROCUREMENT */}
            <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <DollarSign className="w-4 h-4" />
                <span>Financial & Capex Analysis</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysis.costBenefitAnalysis}
              </p>
            </div>

            {/* VECTOR 2: STRUCTURAL & BIM */}
            <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
                <Cpu className="w-4 h-4" />
                <span>Structural System & BIM Detailing</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysis.structuralAndBimAssessment}
              </p>
            </div>

            {/* VECTOR 3: SUSTAINABILITY & PERFORMANCE */}
            <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-teal-400 text-xs font-bold">
                <Leaf className="w-4 h-4" />
                <span>Sustainability & Carbon Footprint</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysis.sustainabilityVerdict}
              </p>
            </div>

            {/* VECTOR 4: HYBRID INTEGRATION OPPORTUNITY */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#121B30] to-[#15233E] border border-violet-500/30 space-y-2">
              <div className="flex items-center gap-2 text-violet-300 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span>Hybrid Design Synergy (Best of Both)</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {analysis.hybridRecommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* 4. CLIENT SUITABILITY MATRIX */}
          <div className="p-4 rounded-2xl bg-[#0E1526] border border-slate-800 space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-violet-400" />
              Optimal Client & Site Typology Allocation
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-500/30 space-y-1">
                <span className="font-bold text-violet-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                  {project1.title} is Best Suited For:
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {analysis.clientSuitability.project1BestFor}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-1">
                <span className="font-bold text-blue-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  {project2.title} is Best Suited For:
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {analysis.clientSuitability.project2BestFor}
                </p>
              </div>
            </div>
          </div>

          {/* 5. INTERACTIVE INQUIRY SECTION (ASK AI ABOUT THESE 2 PROJECTS) */}
          <div className="p-4 rounded-2xl bg-[#111A2E] border border-violet-500/25 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-violet-400" />
                Ask Specific Questions About These Two Projects
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                Analyzed live with Gemini AI
              </span>
            </div>

            {/* PRESET CHIPS */}
            <div className="flex flex-wrap gap-1.5">
              {PRESET_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskPreset(q)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-violet-900/40 border border-slate-700 hover:border-violet-500/40 text-[11px] text-slate-300 hover:text-white transition-all text-left cursor-pointer disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* CUSTOM INPUT */}
            <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="Ask any custom comparative question (e.g. Which facade requires less maintenance in coastal zones?)"
                className="flex-1 bg-[#090D1A] border border-slate-700 focus:border-violet-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={isLoading || !customQuestion.trim()}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-violet-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ask AI</span>
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
};
