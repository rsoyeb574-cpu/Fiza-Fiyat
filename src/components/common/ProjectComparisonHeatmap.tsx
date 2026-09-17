import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Flame, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  DollarSign, 
  Clock, 
  Maximize2, 
  Cpu, 
  Leaf, 
  FileText,
  Equal,
  ChevronRight,
  Info
} from 'lucide-react';
import { Project } from '../../types';
import { NormalizedProjectSpecs, parseCostNumber } from '../../utils/projectComparison';

interface ProjectComparisonHeatmapProps {
  project1: Project;
  project2: Project;
  specs1: NormalizedProjectSpecs;
  specs2: NormalizedProjectSpecs;
}

export type HeatmapCategory = 'all' | 'financial' | 'technical' | 'delivery';

interface MetricEvaluation {
  id: string;
  category: 'financial' | 'technical' | 'delivery';
  name: string;
  categoryLabel: string;
  description: string;
  val1Display: string;
  val2Display: string;
  score1: number; // 0 - 100 for visual bar
  score2: number; // 0 - 100 for visual bar
  winner: 1 | 2 | 0; // 1 = p1, 2 = p2, 0 = tie
  diffText: string;
  badge1?: string;
  badge2?: string;
  icon: React.ElementType;
}

/**
 * Extracts a numeric value from string representations like "$240 / sq.ft", "6,000 sq.ft", "12 Months"
 */
function extractNumber(str: string | undefined): number {
  if (!str) return 0;
  const cleaned = str.replace(/[^0-9.]/g, '');
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
}

/**
 * Extracts BIM LOD number (e.g. "LOD 400" -> 400, "LOD 350" -> 350)
 */
function extractBimLod(str: string | undefined): number {
  if (!str) return 300;
  const match = str.match(/LOD\s*(\d+)/i);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return 300;
}

/**
 * Quantifies sustainability standards into a 0-100 benchmark
 */
function quantifySustainability(str: string | undefined): number {
  const s = (str || '').toLowerCase();
  if (s.includes('platinum') || s.includes('net-zero') || s.includes('carbon-neutral')) return 98;
  if (s.includes('gold') || s.includes('breeam excellent')) return 88;
  if (s.includes('silver') || s.includes('breeam very good')) return 78;
  if (s.includes('knx') || s.includes('smart') || s.includes('eco') || s.includes('high-efficiency')) return 72;
  return 60;
}

export const ProjectComparisonHeatmap: React.FC<ProjectComparisonHeatmapProps> = ({
  project1,
  project2,
  specs1,
  specs2
}) => {
  const [activeCategory, setActiveCategory] = useState<HeatmapCategory>('all');
  const [hoveredMetricId, setHoveredMetricId] = useState<string | null>(null);

  // Compute metric evaluations dynamically
  const metrics: MetricEvaluation[] = useMemo(() => {
    const list: MetricEvaluation[] = [];

    // 1. Capital Budget Accessibility (Total Estimated Cost)
    // In capital budgeting, lower investment barrier is considered an advantage for cost accessibility.
    const cost1 = specs1.costNumeric || parseCostNumber(specs1.estimatedCost);
    const cost2 = specs2.costNumeric || parseCostNumber(specs2.estimatedCost);
    const maxCost = Math.max(cost1, cost2, 1);
    const minCost = Math.min(cost1, cost2);
    // Lower cost gets higher accessibility score
    const costScore1 = maxCost > 0 ? Math.round(100 - (cost1 / maxCost) * 45) : 50;
    const costScore2 = maxCost > 0 ? Math.round(100 - (cost2 / maxCost) * 45) : 50;
    const costWinner: 1 | 2 | 0 = cost1 < cost2 ? 1 : cost2 < cost1 ? 2 : 0;
    const costDiffPct = maxCost > 0 ? Math.round((Math.abs(cost1 - cost2) / maxCost) * 100) : 0;

    list.push({
      id: 'cost-accessibility',
      category: 'financial',
      categoryLabel: 'Financial',
      name: 'Capital Budget Accessibility',
      description: 'Lower initial financial outlay and capital barrier for project initiation',
      val1Display: specs1.estimatedCost,
      val2Display: specs2.estimatedCost,
      score1: costScore1,
      score2: costScore2,
      winner: costWinner,
      diffText: costDiffPct > 0 ? `${costDiffPct}% Capital Variance` : 'Equal Investment',
      badge1: costWinner === 1 ? 'Budget Friendly' : undefined,
      badge2: costWinner === 2 ? 'Budget Friendly' : undefined,
      icon: DollarSign
    });

    // 2. Unit Rate Economy (Cost per sq.ft)
    const rate1 = extractNumber(specs1.costPerSqFt);
    const rate2 = extractNumber(specs2.costPerSqFt);
    const maxRate = Math.max(rate1, rate2, 1);
    const rateScore1 = rate1 > 0 ? Math.round(100 - (rate1 / maxRate) * 50) : 60;
    const rateScore2 = rate2 > 0 ? Math.round(100 - (rate2 / maxRate) * 50) : 60;
    const rateWinner: 1 | 2 | 0 = rate1 > 0 && rate2 > 0 ? (rate1 < rate2 ? 1 : rate2 < rate1 ? 2 : 0) : 0;
    const rateDiffPct = maxRate > 0 ? Math.round((Math.abs(rate1 - rate2) / maxRate) * 100) : 0;

    list.push({
      id: 'unit-rate',
      category: 'financial',
      categoryLabel: 'Financial',
      name: 'Unit Area Cost Rate',
      description: 'Economic efficiency measured by estimated construction expenditure per square foot',
      val1Display: specs1.costPerSqFt,
      val2Display: specs2.costPerSqFt,
      score1: rateScore1,
      score2: rateScore2,
      winner: rateWinner,
      diffText: rateDiffPct > 0 ? `${rateDiffPct}% Rate Delta` : 'Comparable Rates',
      badge1: rateWinner === 1 ? 'Higher Economy' : undefined,
      badge2: rateWinner === 2 ? 'Higher Economy' : undefined,
      icon: TrendingUp
    });

    // 3. Spatial Scale & Gross Area
    const area1 = extractNumber(specs1.area);
    const area2 = extractNumber(specs2.area);
    const maxArea = Math.max(area1, area2, 1);
    const areaScore1 = maxArea > 0 ? Math.max(25, Math.round((area1 / maxArea) * 100)) : 50;
    const areaScore2 = maxArea > 0 ? Math.max(25, Math.round((area2 / maxArea) * 100)) : 50;
    const areaWinner: 1 | 2 | 0 = area1 > area2 ? 1 : area2 > area1 ? 2 : 0;
    const areaDiffPct = maxArea > 0 ? Math.round((Math.abs(area1 - area2) / maxArea) * 100) : 0;

    list.push({
      id: 'spatial-scale',
      category: 'technical',
      categoryLabel: 'Spatial Scale',
      name: 'Built-Up Gross Footprint',
      description: 'Total usable physical envelope and constructed spatial volume',
      val1Display: specs1.area,
      val2Display: specs2.area,
      score1: areaScore1,
      score2: areaScore2,
      winner: areaWinner,
      diffText: areaDiffPct > 0 ? `${areaDiffPct}% Larger Scale` : 'Equal Area',
      badge1: areaWinner === 1 ? 'Greater Floor Area' : undefined,
      badge2: areaWinner === 2 ? 'Greater Floor Area' : undefined,
      icon: Maximize2
    });

    // 4. Delivery Speed & Project Duration
    const dur1 = extractNumber(specs1.duration);
    const dur2 = extractNumber(specs2.duration);
    const maxDur = Math.max(dur1, dur2, 1);
    // Shorter duration = faster turnaround / better agility
    const durScore1 = maxDur > 0 ? Math.round(100 - (dur1 / maxDur) * 45) : 60;
    const durScore2 = maxDur > 0 ? Math.round(100 - (dur2 / maxDur) * 45) : 60;
    const durWinner: 1 | 2 | 0 = dur1 < dur2 ? 1 : dur2 < dur1 ? 2 : 0;
    const durDiffMonths = Math.abs(dur1 - dur2);

    list.push({
      id: 'delivery-speed',
      category: 'delivery',
      categoryLabel: 'Turnaround',
      name: 'Time to Market / Duration',
      description: 'Total projected schedule from concept design to final handover',
      val1Display: specs1.duration,
      val2Display: specs2.duration,
      score1: durScore1,
      score2: durScore2,
      winner: durWinner,
      diffText: durDiffMonths > 0 ? `${durDiffMonths} Mo. Difference` : 'Same Timeline',
      badge1: durWinner === 1 ? 'Faster Rollout' : undefined,
      badge2: durWinner === 2 ? 'Faster Rollout' : undefined,
      icon: Clock
    });

    // 5. BIM Level of Development (LOD) & Precision
    const lod1 = extractBimLod(specs1.bimLevel);
    const lod2 = extractBimLod(specs2.bimLevel);
    const lodScore1 = Math.min(100, Math.round((lod1 / 450) * 100));
    const lodScore2 = Math.min(100, Math.round((lod2 / 450) * 100));
    const lodWinner: 1 | 2 | 0 = lod1 > lod2 ? 1 : lod2 > lod1 ? 2 : 0;

    list.push({
      id: 'bim-lod',
      category: 'technical',
      categoryLabel: 'Engineering',
      name: 'BIM Level of Development (LOD)',
      description: 'Model geometry accuracy, clash coordination depth, and digital fabrication detail',
      val1Display: specs1.bimLevel.split('(')[0].trim(),
      val2Display: specs2.bimLevel.split('(')[0].trim(),
      score1: lodScore1,
      score2: lodScore2,
      winner: lodWinner,
      diffText: lodWinner === 0 ? 'Equal LOD Standards' : `LOD ${Math.max(lod1, lod2)} Lead`,
      badge1: lodWinner === 1 ? 'Advanced BIM Depth' : undefined,
      badge2: lodWinner === 2 ? 'Advanced BIM Depth' : undefined,
      icon: Cpu
    });

    // 6. Sustainability & Eco Energy Rating
    const sus1 = quantifySustainability(specs1.energyRating);
    const sus2 = quantifySustainability(specs2.energyRating);
    const susWinner: 1 | 2 | 0 = sus1 > sus2 ? 1 : sus2 > sus1 ? 2 : 0;

    list.push({
      id: 'sustainability',
      category: 'delivery',
      categoryLabel: 'Eco Standards',
      name: 'Environmental & Energy Rating',
      description: 'Energy conservation envelope, carbon-neutral readiness, and green building standard',
      val1Display: specs1.energyRating.split('/')[0].trim(),
      val2Display: specs2.energyRating.split('/')[0].trim(),
      score1: sus1,
      score2: sus2,
      winner: susWinner,
      diffText: susWinner === 0 ? 'Verified Eco Compliance' : 'Superior Rating',
      badge1: susWinner === 1 ? 'High Efficiency' : undefined,
      badge2: susWinner === 2 ? 'High Efficiency' : undefined,
      icon: Leaf
    });

    // 7. Deliverables & Drawing Coverage
    const delCount1 = specs1.deliverables.length;
    const delCount2 = specs2.deliverables.length;
    const maxDel = Math.max(delCount1, delCount2, 1);
    const delScore1 = Math.round((delCount1 / maxDel) * 100);
    const delScore2 = Math.round((delCount2 / maxDel) * 100);
    const delWinner: 1 | 2 | 0 = delCount1 > delCount2 ? 1 : delCount2 > delCount1 ? 2 : 0;

    list.push({
      id: 'deliverables-scope',
      category: 'technical',
      categoryLabel: 'Documentation',
      name: 'Deliverables & Drawing Scope',
      description: 'Number of included permit sheets, 3D renderings, and specifications packages',
      val1Display: `${delCount1} Packages`,
      val2Display: `${delCount2} Packages`,
      score1: delScore1,
      score2: delScore2,
      winner: delWinner,
      diffText: delCount1 === delCount2 ? 'Equal Package Count' : `${Math.abs(delCount1 - delCount2)} More Deliverables`,
      badge1: delWinner === 1 ? 'Broader Scope' : undefined,
      badge2: delWinner === 2 ? 'Broader Scope' : undefined,
      icon: FileText
    });

    // 8. Software Tooling Breadth
    const sw1 = specs1.softwareUsed.length;
    const sw2 = specs2.softwareUsed.length;
    const maxSw = Math.max(sw1, sw2, 1);
    const swScore1 = Math.round((sw1 / maxSw) * 100);
    const swScore2 = Math.round((sw2 / maxSw) * 100);
    const swWinner: 1 | 2 | 0 = sw1 > sw2 ? 1 : sw2 > sw1 ? 2 : 0;

    list.push({
      id: 'tooling-stack',
      category: 'technical',
      categoryLabel: 'Tech Stack',
      name: 'Computational & Tooling Stack',
      description: 'Multi-disciplinary CAD, BIM, simulation, and rendering software integrated',
      val1Display: `${sw1} Tools (${specs1.softwareUsed.slice(0, 2).join(', ')}...)`,
      val2Display: `${sw2} Tools (${specs2.softwareUsed.slice(0, 2).join(', ')}...)`,
      score1: swScore1,
      score2: swScore2,
      winner: swWinner,
      diffText: sw1 === sw2 ? 'Equally Modern Stack' : 'Expanded Stack',
      badge1: swWinner === 1 ? 'Integrated Pipeline' : undefined,
      badge2: swWinner === 2 ? 'Integrated Pipeline' : undefined,
      icon: Layers
    });

    return list;
  }, [specs1, specs2]);

  // Aggregate tally
  const tallyP1Wins = metrics.filter(m => m.winner === 1).length;
  const tallyP2Wins = metrics.filter(m => m.winner === 2).length;
  const tallyTies = metrics.filter(m => m.winner === 0).length;

  const filteredMetrics = useMemo(() => {
    if (activeCategory === 'all') return metrics;
    return metrics.filter(m => m.category === activeCategory);
  }, [metrics, activeCategory]);

  return (
    <div className="space-y-4" id="project-comparison-heatmap-section">
      {/* SECTION HEADER WITH SCORECARD TALLY & LEGEND */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#162344] to-[#0D152A] border border-violet-500/30 shadow-xl space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Flame className="w-4 h-4" />
              </span>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Performance & Feasibility Heatmap
              </h4>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Visual side-by-side indicator matrix comparing commercial efficiency, technical BIM depth, and project execution parameters.
            </p>
          </div>

          {/* QUICK WINS SCORECARD */}
          <div className="flex items-center gap-2 bg-[#0A0E1A]/80 p-2 rounded-xl border border-slate-800 self-start md:self-auto">
            {/* Project 1 Lead Tally */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-950/60 border border-violet-500/40 text-violet-200 text-xs font-bold">
              <Trophy className="w-3.5 h-3.5 text-violet-400" />
              <span className="hidden sm:inline">Proj A Leads:</span>
              <span className="text-violet-300 font-extrabold">{tallyP1Wins}</span>
            </div>

            {/* Ties */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 text-xs font-semibold">
              <Equal className="w-3 h-3 text-slate-400" />
              <span className="hidden sm:inline">Ties:</span>
              <span>{tallyTies}</span>
            </div>

            {/* Project 2 Lead Tally */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-500/40 text-blue-200 text-xs font-bold">
              <Trophy className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Proj B Leads:</span>
              <span className="text-blue-300 font-extrabold">{tallyP2Wins}</span>
            </div>
          </div>
        </div>

        {/* CATEGORY FILTER TABS & COLOR LEGEND */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
            {[
              { id: 'all', label: 'All Metrics', count: metrics.length },
              { id: 'financial', label: 'Commercial & Budget', count: metrics.filter(m => m.category === 'financial').length },
              { id: 'technical', label: 'BIM & Technical', count: metrics.filter(m => m.category === 'technical').length },
              { id: 'delivery', label: 'Speed & Eco', count: metrics.filter(m => m.category === 'delivery').length }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as HeatmapCategory)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === cat.id
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                    : 'bg-[#0B1020] text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>{cat.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 font-bold">
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Color Indicators Legend */}
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-400 shadow-sm shadow-emerald-500/50"></span>
              <span className="text-emerald-300 font-medium">Leading / Best Performing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-700 border border-slate-600"></span>
              <span>Runner-Up / Alternative</span>
            </div>
            <div className="flex items-center gap-1.5 hidden md:flex">
              <span className="w-3 h-3 rounded-full bg-indigo-500/40 border border-indigo-400"></span>
              <span>Equivalent Parity</span>
            </div>
          </div>
        </div>

      </div>

      {/* HEATMAP COMPARISON TABLE / MATRIX */}
      <div className="bg-[#10192E] rounded-2xl border border-indigo-500/20 overflow-hidden shadow-lg">
        
        {/* TABLE COLUMN HEADERS */}
        <div className="grid grid-cols-12 bg-indigo-950/60 px-4 py-3 border-b border-indigo-500/30 text-xs font-bold text-slate-300">
          <div className="col-span-12 md:col-span-4 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>EVALUATION PARAMETER</span>
          </div>

          <div className="hidden md:flex col-span-4 items-center justify-between px-2 text-violet-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-400"></span>
              <span>PROJECT A: {project1.title.slice(0, 20)}</span>
            </div>
            <span className="text-[10px] font-normal text-slate-400">Heat Level</span>
          </div>

          <div className="hidden md:flex col-span-4 items-center justify-between px-2 text-blue-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span>PROJECT B: {project2.title.slice(0, 20)}</span>
            </div>
            <span className="text-[10px] font-normal text-slate-400">Heat Level</span>
          </div>
        </div>

        {/* METRIC ROWS */}
        <div className="divide-y divide-slate-800/70 text-xs">
          {filteredMetrics.map((metric) => {
            const IconComponent = metric.icon;
            const isHovered = hoveredMetricId === metric.id;
            const isP1Winner = metric.winner === 1;
            const isP2Winner = metric.winner === 2;
            const isTie = metric.winner === 0;

            return (
              <div
                key={metric.id}
                onMouseEnter={() => setHoveredMetricId(metric.id)}
                onMouseLeave={() => setHoveredMetricId(null)}
                className={`grid grid-cols-12 p-3.5 sm:p-4 gap-3 items-center transition-all ${
                  isHovered ? 'bg-white/5' : 'hover:bg-white/[0.02]'
                }`}
              >
                {/* 1. METRIC LABEL & DESCRIPTION */}
                <div className="col-span-12 md:col-span-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg shrink-0 ${
                      isP1Winner 
                        ? 'bg-violet-950/60 text-violet-400 border border-violet-500/30' 
                        : isP2Winner 
                        ? 'bg-blue-950/60 text-blue-400 border border-blue-500/30' 
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-white text-xs block">
                        {metric.name}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        {metric.categoryLabel}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-8 leading-snug">
                    {metric.description}
                  </p>
                </div>

                {/* 2. PROJECT 1 HEATMAP CELL */}
                <div className="col-span-6 md:col-span-4 px-2">
                  <div className={`p-3 rounded-xl border transition-all ${
                    isP1Winner 
                      ? 'bg-gradient-to-r from-emerald-950/60 to-emerald-900/30 border-emerald-500/50 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                      : isTie
                      ? 'bg-slate-900/50 border-slate-700/60'
                      : 'bg-[#0B1020]/60 border-slate-800/80 opacity-80'
                  }`}>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[10px] font-semibold uppercase text-slate-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                        Project A
                      </span>

                      {isP1Winner && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-extrabold uppercase">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                          Leading
                        </span>
                      )}
                      {isTie && (
                        <span className="text-[9px] font-semibold text-slate-400 px-1.5 py-0.2 rounded bg-slate-800">
                          Parity
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline justify-between gap-2">
                      <span className={`text-sm font-bold truncate ${
                        isP1Winner ? 'text-emerald-300' : 'text-slate-200'
                      }`}>
                        {metric.val1Display}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {metric.score1}%
                      </span>
                    </div>

                    {/* HEAT INTENSITY BAR */}
                    <div className="w-full bg-slate-900/90 h-2 rounded-full overflow-hidden mt-2 p-0.5 border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isP1Winner
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-400/50'
                            : isTie
                            ? 'bg-indigo-500'
                            : 'bg-slate-600'
                        }`}
                        style={{ width: `${Math.max(8, metric.score1)}%` }}
                      ></div>
                    </div>

                    {metric.badge1 && isP1Winner && (
                      <span className="mt-2 inline-block text-[10px] font-bold text-emerald-400">
                        ★ {metric.badge1}
                      </span>
                    )}
                  </div>
                </div>

                {/* 3. PROJECT 2 HEATMAP CELL */}
                <div className="col-span-6 md:col-span-4 px-2">
                  <div className={`p-3 rounded-xl border transition-all ${
                    isP2Winner 
                      ? 'bg-gradient-to-r from-emerald-950/60 to-emerald-900/30 border-emerald-500/50 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                      : isTie
                      ? 'bg-slate-900/50 border-slate-700/60'
                      : 'bg-[#0B1020]/60 border-slate-800/80 opacity-80'
                  }`}>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[10px] font-semibold uppercase text-slate-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                        Project B
                      </span>

                      {isP2Winner && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-extrabold uppercase">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                          Leading
                        </span>
                      )}
                      {isTie && (
                        <span className="text-[9px] font-semibold text-slate-400 px-1.5 py-0.2 rounded bg-slate-800">
                          Parity
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline justify-between gap-2">
                      <span className={`text-sm font-bold truncate ${
                        isP2Winner ? 'text-emerald-300' : 'text-slate-200'
                      }`}>
                        {metric.val2Display}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {metric.score2}%
                      </span>
                    </div>

                    {/* HEAT INTENSITY BAR */}
                    <div className="w-full bg-slate-900/90 h-2 rounded-full overflow-hidden mt-2 p-0.5 border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isP2Winner
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-400/50'
                            : isTie
                            ? 'bg-indigo-500'
                            : 'bg-slate-600'
                        }`}
                        style={{ width: `${Math.max(8, metric.score2)}%` }}
                      ></div>
                    </div>

                    {metric.badge2 && isP2Winner && (
                      <span className="mt-2 inline-block text-[10px] font-bold text-emerald-400">
                        ★ {metric.badge2}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* BOTTOM SYNTHESIS & STRATEGIC RECOMMENDATION */}
        <div className="p-4 bg-gradient-to-r from-[#0C1322] via-[#0E172A] to-[#0C1322] border-t border-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-300">
            <Info className="w-4 h-4 text-violet-400 shrink-0" />
            <span>
              <strong>Strategic Fit:</strong>{' '}
              {tallyP1Wins > tallyP2Wins ? (
                <>
                  <span className="text-violet-300 font-bold">{project1.title}</span> leads across {tallyP1Wins} performance vectors, offering superior commercial or fast-track advantages.
                </>
              ) : tallyP2Wins > tallyP1Wins ? (
                <>
                  <span className="text-blue-300 font-bold">{project2.title}</span> leads across {tallyP2Wins} performance vectors, offering superior scale, BIM depth, or environmental standards.
                </>
              ) : (
                <>Both projects offer balanced performance tailored for different typology tiers and site constraints.</>
              )}
            </span>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
            <span>Evaluated on 8 normalized architectural KPIs</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </div>
        </div>

      </div>
    </div>
  );
};
