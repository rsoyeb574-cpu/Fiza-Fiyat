import React, { useState, useEffect, useId } from 'react';
import {
  Sparkles,
  Target,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Layers,
  DollarSign,
  Clock,
  Leaf,
  Building2,
  ShieldCheck,
  Cpu,
  Copy,
  Check,
  ArrowRight,
  RefreshCw,
  Plus,
  X,
  Sliders,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  TrendingUp,
  FileCheck2,
  Compass
} from 'lucide-react';
import { Project } from '../../types';
import { NormalizedProjectSpecs } from '../../utils/projectComparison';

interface ProjectInsightsSectionProps {
  project1: Project;
  project2: Project;
  specs1: NormalizedProjectSpecs;
  specs2: NormalizedProjectSpecs;
  onInquireProject?: (project: Project, contextNote?: string) => void;
  onViewProjectDetails?: (id: string) => void;
}

export interface EvaluatedGoal {
  goal: string;
  project1Assessment: string;
  project1Rating: 'superior' | 'adequate' | 'compromised';
  project2Assessment: string;
  project2Rating: 'superior' | 'adequate' | 'compromised';
  winningProject: 1 | 2 | 0;
}

export interface ProjectInsightsData {
  recommendationTitle: string;
  recommendedOption: 1 | 2 | 0;
  winnerProjectTitle: string;
  fitScores: {
    project1Score: number;
    project2Score: number;
  };
  executiveVerdict: string;
  userGoalsEvaluated: EvaluatedGoal[];
  keyTradeoffs: string[];
  strategicRationale: string;
  costBenefitAnalysis?: string;
  structuralAndBimAssessment?: string;
  sustainabilityVerdict?: string;
  actionableNextSteps: string[];
  hybridRecommendations?: string[];
  clientSuitability?: {
    project1BestFor: string;
    project2BestFor: string;
  };
}

const PRESET_GOALS = [
  {
    id: 'capex-efficiency',
    label: 'Strict Capex & Unit Cost Control',
    icon: DollarSign,
    desc: 'Minimize upfront construction capex and square-footage cost rate'
  },
  {
    id: 'schedule-velocity',
    label: 'Fast-Track Handover & Tight Timeline',
    icon: Clock,
    desc: 'Accelerate construction schedule and prioritize rapid operational occupancy'
  },
  {
    id: 'sustainability-netzero',
    label: 'LEED Platinum / Net-Zero Target',
    icon: Leaf,
    desc: 'Optimize thermal envelope, minimize embodied carbon, and maximize energy rating'
  },
  {
    id: 'iconic-landmark',
    label: 'Iconic Architectural Landmark & Prestige',
    icon: Building2,
    desc: 'Distinctive aesthetic footprint, high visual impact, and premium asset value'
  },
  {
    id: 'spatial-scale',
    label: 'Maximum Usable Floor Area (FAR / GFA)',
    icon: Layers,
    desc: 'Expand volumetric capacity, gross floor space, and commercial leasing density'
  },
  {
    id: 'bim-precision',
    label: 'BIM LOD 400 Digital Fabrication',
    icon: Cpu,
    desc: 'Comprehensive clash resolution, digital prefabrication, and low field-change orders'
  },
  {
    id: 'structural-resilience',
    label: 'Seismic & Severe Climate Resilience',
    icon: ShieldCheck,
    desc: 'Heavy-duty structural framework resistant to high lateral wind loads and seismic events'
  },
  {
    id: 'opex-minimization',
    label: 'Low Lifecycle Maintenance & Opex',
    icon: TrendingUp,
    desc: 'Durable, long-lasting facade and MEP systems with reduced recurring lifecycle upkeep'
  }
];

export const ProjectInsightsSection: React.FC<ProjectInsightsSectionProps> = ({
  project1,
  project2,
  specs1,
  specs2,
  onInquireProject,
  onViewProjectDetails
}) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Strict Capex & Unit Cost Control',
    'Fast-Track Handover & Tight Timeline',
    'LEED Platinum / Net-Zero Target'
  ]);
  const [customGoalInput, setCustomGoalInput] = useState('');
  const [primaryPriority, setPrimaryPriority] = useState<'balanced' | 'financial' | 'speed' | 'sustainability' | 'scale'>('balanced');
  const [insights, setInsights] = useState<ProjectInsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState(false);
  const customGoalInputId = useId();

  // Run initial analysis or re-run when requested
  const runInsightsAnalysis = async (goalsToUse = selectedGoals) => {
    if (goalsToUse.length === 0) {
      setError('Please select at least one goal or type a custom goal to evaluate.');
      return;
    }

    setIsLoading(true);
    setError(null);

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
          userGoals: goalsToUse,
          focusArea: primaryPriority !== 'balanced' ? primaryPriority : undefined
        })
      });

      const data = await res.json();
      if (data.status === 'success' && data.recommendationTitle) {
        setInsights(data);
      } else {
        setError(data.error || 'Unable to generate Project Insights from Gemini.');
      }
    } catch (err: any) {
      console.error('Project Insights fetch error:', err);
      setError(err?.message || 'Network error communicating with the Gemini comparison service.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-run on first load if not loaded yet
  useEffect(() => {
    if (!insights && !isLoading) {
      runInsightsAnalysis(selectedGoals);
    }
  }, [project1.id, project2.id]);

  const togglePresetGoal = (goalLabel: string) => {
    let updated: string[];
    if (selectedGoals.includes(goalLabel)) {
      if (selectedGoals.length <= 1) {
        return; // Keep at least one
      }
      updated = selectedGoals.filter((g) => g !== goalLabel);
    } else {
      updated = [...selectedGoals, goalLabel];
    }
    setSelectedGoals(updated);
  };

  const handleAddCustomGoal = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customGoalInput.trim();
    if (!trimmed) return;
    if (!selectedGoals.includes(trimmed)) {
      const updated = [...selectedGoals, trimmed];
      setSelectedGoals(updated);
      setCustomGoalInput('');
    }
  };

  const removeGoal = (goalToRemove: string) => {
    if (selectedGoals.length <= 1) return;
    setSelectedGoals(selectedGoals.filter((g) => g !== goalToRemove));
  };

  const handleCopyInsights = () => {
    if (!insights) return;
    const text = `FIZA ARCHITECTURAL & CIVIL HUB - PROJECT INSIGHTS
Comparison: ${project1.title} vs ${project2.title}
Recommendation: ${insights.winnerProjectTitle || (insights.recommendedOption === 1 ? project1.title : project2.title)}
Fit Scores: ${project1.title} (${insights.fitScores?.project1Score || 85}%) vs ${project2.title} (${insights.fitScores?.project2Score || 75}%)

Verdict:
${insights.executiveVerdict}

Goal-by-Goal Evaluation:
${(insights.userGoalsEvaluated || []).map(g => `• ${g.goal}: ${g.winningProject === 1 ? project1.title : g.winningProject === 2 ? project2.title : 'Equal'} (P1: ${g.project1Rating}, P2: ${g.project2Rating})`).join('\n')}

Key Trade-Offs:
${(insights.keyTradeoffs || []).map(t => `• ${t}`).join('\n')}

Next Steps:
${(insights.actionableNextSteps || []).map(s => `• ${s}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const winningProjectObj = insights?.recommendedOption === 2 ? project2 : project1;
  const p1Score = insights?.fitScores?.project1Score || 82;
  const p2Score = insights?.fitScores?.project2Score || 74;

  return (
    <div id="project-insights-section" className="space-y-6">
      {/* SECTION HEADER WITH GEMINI BRANDING */}
      <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 text-xs font-black uppercase tracking-wider border border-purple-500/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                Gemini Goal-Fit Engine
              </span>
              <span className="text-[11px] text-slate-400">
                Architectural Multi-Factor Reasoning
              </span>
            </div>
            <h3 className="text-xl font-black text-white flex items-center gap-2.5">
              <Target className="w-5 h-5 text-purple-400" />
              Project Insights
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Select or define your specific strategic goals (budget limits, schedule requirements, sustainability targets, or spatial density). Gemini analyzes the technical blueprints of both projects to identify which one delivers the highest operational and financial alignment.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => runInsightsAnalysis(selectedGoals)}
              disabled={isLoading || selectedGoals.length === 0}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Synthesizing...' : 'Re-Analyze Alignment'}</span>
            </button>
          </div>
        </div>

        {/* INTERACTIVE GOAL SELECTOR PANEL */}
        <div className="mt-5 pt-5 border-t border-purple-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-purple-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              Define & Customize Your Evaluation Goals
            </span>
            <span className="text-[11px] text-slate-400">
              {selectedGoals.length} goal{selectedGoals.length === 1 ? '' : 's'} active
            </span>
          </div>

          {/* Preset Goal Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {PRESET_GOALS.map((preset) => {
              const Icon = preset.icon;
              const isSelected = selectedGoals.includes(preset.label);
              return (
                <button
                  key={preset.id}
                  onClick={() => togglePresetGoal(preset.label)}
                  className={`px-3 py-2.5 rounded-xl text-left text-xs transition-all border flex items-start gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-purple-900/40 border-purple-400/60 text-white shadow-sm shadow-purple-900/40'
                      : 'bg-[#111A2E]/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                  title={preset.desc}
                >
                  <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                    isSelected ? 'bg-purple-500/30 text-purple-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold leading-tight line-clamp-1">{preset.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{preset.desc}</div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Custom Goal Input Row */}
          <form onSubmit={handleAddCustomGoal} className="mt-3 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <label htmlFor={customGoalInputId} className="sr-only">
                Add custom goal or site constraint
              </label>
              <input
                id={customGoalInputId}
                type="text"
                value={customGoalInput}
                onChange={(e) => setCustomGoalInput(e.target.value)}
                placeholder="Type a custom priority or constraint (e.g., 'Target construction budget below $40M with high-end curtain wall glazing')..."
                className="w-full bg-[#0E1726] border border-purple-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={!customGoalInput.trim()}
              className="px-4 py-2 bg-purple-800/60 hover:bg-purple-700/80 border border-purple-500/40 text-purple-200 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Goal</span>
            </button>
          </form>

          {/* Active Goals Tags List */}
          {selectedGoals.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                Active Targets:
              </span>
              {selectedGoals.map((goal, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30 text-[11px] font-medium"
                >
                  <Target className="w-3 h-3 text-purple-400" />
                  <span className="max-w-[240px] truncate">{goal}</span>
                  <button
                    onClick={() => removeGoal(goal)}
                    className="text-purple-400 hover:text-white cursor-pointer ml-0.5"
                    title="Remove goal"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ERROR DISPLAY */}
      {error && (
        <div className="bg-red-950/40 border border-red-500/30 text-red-200 rounded-xl p-4 text-xs flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">Insight Synthesis Error: </span>
            {error}
          </div>
          <button
            onClick={() => runInsightsAnalysis(selectedGoals)}
            className="text-xs underline text-red-300 hover:text-white"
          >
            Retry
          </button>
        </div>
      )}

      {/* LOADING STATE */}
      {isLoading && (
        <div className="bg-[#111A2E] rounded-2xl border border-purple-500/20 p-8 text-center space-y-4 shadow-xl">
          <div className="relative w-14 h-14 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/30 border-t-purple-400 animate-spin"></div>
            <Sparkles className="w-6 h-6 text-purple-400 absolute inset-0 m-auto animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Gemini is Analyzing Project Alignment</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Evaluating structural typologies, BIM precision, capex velocity, and lifecycle maintenance against your defined objectives...
            </p>
          </div>
        </div>
      )}

      {/* INSIGHTS RESULTS */}
      {!isLoading && insights && (
        <div className="space-y-6">
          {/* WINNER RECOMMENDATION CALLOUT */}
          <div className="bg-gradient-to-br from-[#121b33] via-[#10172a] to-[#151229] rounded-2xl border border-purple-500/30 p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              {/* Left: Verdict & Winner */}
              <div className="space-y-2 flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Strategic Best Fit: {insights.winnerProjectTitle || winningProjectObj.title}</span>
                </div>

                <h4 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {insights.recommendationTitle}
                </h4>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                  {insights.executiveVerdict}
                </p>
              </div>

              {/* Right: Comparative Fit Scores */}
              <div className="bg-[#0B111F]/90 border border-slate-800 rounded-xl p-4 lg:w-72 shrink-0 space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Goal Alignment Score
                </span>

                {/* Project 1 Score */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-white truncate max-w-[170px]" title={project1.title}>
                      {project1.title}
                    </span>
                    <span className={`font-black ${insights.recommendedOption === 1 ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {p1Score}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        insights.recommendedOption === 1
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : 'bg-slate-500'
                      }`}
                      style={{ width: `${Math.min(100, p1Score)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Project 2 Score */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-white truncate max-w-[170px]" title={project2.title}>
                      {project2.title}
                    </span>
                    <span className={`font-black ${insights.recommendedOption === 2 ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {p2Score}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        insights.recommendedOption === 2
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : 'bg-slate-500'
                      }`}
                      style={{ width: `${Math.min(100, p2Score)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 pt-1 text-center">
                  Synthesized across {selectedGoals.length} criteria by Gemini
                </div>
              </div>

            </div>

            {/* Quick action bar */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyInsights}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Insights Copied!' : 'Copy Insights'}</span>
                </button>

                <button
                  onClick={() => setExpandedDetails(!expandedDetails)}
                  className="px-3 py-1.5 rounded-lg bg-purple-950/50 hover:bg-purple-900/50 text-purple-300 border border-purple-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>{expandedDetails ? 'Hide Deep Engineering Breakdown' : 'View Deep Engineering Breakdown'}</span>
                  {expandedDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {onInquireProject && (
                <button
                  onClick={() => onInquireProject(winningProjectObj, `Project Insights Recommendation: ${insights.recommendationTitle}`)}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-900/30"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Consult Architect on {winningProjectObj.title}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* GOAL-BY-GOAL COMPARATIVE BREAKDOWN */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                Goal-by-Goal Alignment Analysis
              </h4>
              <span className="text-xs text-slate-400">
                Head-to-head performance on each active criterion
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(insights.userGoalsEvaluated || []).map((item, index) => {
                const winnerIsP1 = item.winningProject === 1;
                const winnerIsP2 = item.winningProject === 2;
                const isTie = item.winningProject === 0;

                return (
                  <div
                    key={index}
                    className="bg-[#111A2E] border border-slate-800 hover:border-purple-500/30 rounded-xl p-4 transition-all space-y-3 shadow-md"
                  >
                    {/* Goal Title & Winning Tag */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold flex items-center justify-center border border-purple-500/30 shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-xs font-bold text-white">
                          {item.goal}
                        </span>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 border ${
                        winnerIsP1
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                          : winnerIsP2
                          ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {winnerIsP1 ? `${project1.title} Leads` : winnerIsP2 ? `${project2.title} Leads` : 'Equal Fit'}
                      </span>
                    </div>

                    {/* Side by side evaluation */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {/* Project 1 Assessment */}
                      <div className={`p-2.5 rounded-lg border space-y-1 ${
                        winnerIsP1
                          ? 'bg-indigo-950/40 border-indigo-500/30'
                          : 'bg-[#0B111F] border-slate-800'
                      }`}>
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                          <span className="truncate" title={project1.title}>{project1.title}</span>
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                            item.project1Rating === 'superior'
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : item.project1Rating === 'adequate'
                              ? 'text-amber-400 bg-amber-500/10'
                              : 'text-rose-400 bg-rose-500/10'
                          }`}>
                            {item.project1Rating}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-snug">
                          {item.project1Assessment}
                        </p>
                      </div>

                      {/* Project 2 Assessment */}
                      <div className={`p-2.5 rounded-lg border space-y-1 ${
                        winnerIsP2
                          ? 'bg-teal-950/40 border-teal-500/30'
                          : 'bg-[#0B111F] border-slate-800'
                      }`}>
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                          <span className="truncate" title={project2.title}>{project2.title}</span>
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                            item.project2Rating === 'superior'
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : item.project2Rating === 'adequate'
                              ? 'text-amber-400 bg-amber-500/10'
                              : 'text-rose-400 bg-rose-500/10'
                          }`}>
                            {item.project2Rating}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-snug">
                          {item.project2Assessment}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* KEY TRADEOFFS & STRATEGIC RATIONALE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Key Trade-offs */}
            <div className="bg-[#111A2E] rounded-2xl border border-slate-800 p-5 space-y-3">
              <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Critical Project Trade-Offs
              </h5>
              <p className="text-xs text-slate-400">
                What you gain vs what you compromise when selecting between these schemes:
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                {(insights.keyTradeoffs || []).map((tradeoff, i) => (
                  <li key={i} className="flex items-start gap-2 bg-[#0B111F] p-2.5 rounded-lg border border-slate-800/80">
                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{tradeoff}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Strategic Rationale & Next Steps */}
            <div className="bg-[#111A2E] rounded-2xl border border-slate-800 p-5 space-y-3">
              <h5 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-purple-400" />
                Strategic Rationale & Action Plan
              </h5>
              <div className="bg-purple-950/20 border border-purple-500/20 p-3 rounded-xl text-xs text-purple-200 leading-relaxed">
                {insights.strategicRationale}
              </div>

              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Actionable Engineering Next Steps:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {(insights.actionableNextSteps || []).map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* OPTIONAL EXPANDABLE: DEEP ENGINEERING & HYBRID SYNTHESIS */}
          {expandedDetails && (
            <div className="bg-[#111A2E] rounded-2xl border border-purple-500/20 p-5 space-y-4 animate-in fade-in duration-200">
              <h5 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                Deep Engineering Discipline Synthesis
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {insights.costBenefitAnalysis && (
                  <div className="bg-[#0B111F] p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5" />
                      Financial & Capex Lifecycle
                    </span>
                    <p className="text-slate-300 leading-relaxed">{insights.costBenefitAnalysis}</p>
                  </div>
                )}

                {insights.structuralAndBimAssessment && (
                  <div className="bg-[#0B111F] p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                    <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      Structural Load & BIM Maturation
                    </span>
                    <p className="text-slate-300 leading-relaxed">{insights.structuralAndBimAssessment}</p>
                  </div>
                )}

                {insights.sustainabilityVerdict && (
                  <div className="bg-[#0B111F] p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                    <span className="font-bold text-teal-400 flex items-center gap-1.5">
                      <Leaf className="w-3.5 h-3.5" />
                      Embodied Carbon & Thermal Envelope
                    </span>
                    <p className="text-slate-300 leading-relaxed">{insights.sustainabilityVerdict}</p>
                  </div>
                )}
              </div>

              {insights.hybridRecommendations && insights.hybridRecommendations.length > 0 && (
                <div className="bg-gradient-to-r from-purple-950/40 to-indigo-950/40 border border-purple-500/30 p-4 rounded-xl space-y-2">
                  <span className="font-bold text-purple-200 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    Recommended Hybrid Scheme Adaptation
                  </span>
                  <p className="text-xs text-slate-300">
                    How to borrow the best elements from both schemes for a 100% optimized project:
                  </p>
                  <ul className="space-y-1.5 text-xs text-purple-100">
                    {insights.hybridRecommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ArrowRight className="w-3 h-3 text-purple-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
};
