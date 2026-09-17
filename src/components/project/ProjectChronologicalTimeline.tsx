import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Award, 
  Filter, 
  CalendarDays,
  Layers,
  ChevronRight,
  Info,
  Check
} from 'lucide-react';
import { Project, ProjectMilestonePhase } from '../../types';
import { 
  getTimelineBounds, 
  calculateScheduleVariance, 
  getPhaseStatusBadge 
} from '../../utils/projectMilestones';

interface ProjectChronologicalTimelineProps {
  project: Project;
  phases: ProjectMilestonePhase[];
  onSelectPhase?: (phaseId: string) => void;
  selectedPhaseId?: string;
  className?: string;
}

export const ProjectChronologicalTimeline: React.FC<ProjectChronologicalTimelineProps> = ({
  project,
  phases,
  onSelectPhase,
  selectedPhaseId,
  className = ''
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'critical' | 'completed' | 'in_progress'>('all');
  const [sortOrder, setSortOrder] = useState<'chronological' | 'variance'>('chronological');
  const [expandedPhaseId, setExpandedPhaseId] = useState<string | null>(selectedPhaseId || null);

  // Calculate chronological timeline boundaries and month markers
  const bounds = useMemo(() => getTimelineBounds(phases), [phases]);

  // Filter & sort phases
  const processedPhases = useMemo(() => {
    let list = [...phases];

    if (filterMode === 'critical') {
      list = list.filter(p => p.criticalPath);
    } else if (filterMode === 'completed') {
      list = list.filter(p => p.status === 'completed' || p.completionPercentage === 100);
    } else if (filterMode === 'in_progress') {
      list = list.filter(p => p.status === 'in_progress');
    }

    if (sortOrder === 'variance') {
      list.sort((a, b) => {
        const varA = calculateScheduleVariance(a).varianceDays;
        const varB = calculateScheduleVariance(b).varianceDays;
        return varA - varB; // Most ahead first
      });
    } else {
      list.sort((a, b) => {
        const timeA = new Date(a.startDate).getTime();
        const timeB = new Date(b.startDate).getTime();
        return timeA - timeB;
      });
    }

    return list;
  }, [phases, filterMode, sortOrder]);

  // Overall schedule variance metrics
  const varianceMetrics = useMemo(() => {
    let totalNetVarianceDays = 0;
    let completedOnTimeCount = 0;
    let completedCount = 0;
    let aheadCount = 0;
    let delayedCount = 0;

    phases.forEach(p => {
      const variance = calculateScheduleVariance(p);
      if (p.status === 'completed' || p.completionPercentage === 100) {
        completedCount++;
        totalNetVarianceDays += variance.varianceDays;
        if (variance.varianceDays <= 0) {
          completedOnTimeCount++;
        }
        if (variance.varianceDays < 0) aheadCount++;
        if (variance.varianceDays > 0) delayedCount++;
      } else if (p.status === 'in_progress') {
        totalNetVarianceDays += variance.varianceDays;
        if (variance.varianceDays < 0) aheadCount++;
        if (variance.varianceDays > 0) delayedCount++;
      }
    });

    const onTimeRate = completedCount > 0 ? Math.round((completedOnTimeCount / completedCount) * 100) : 100;

    return {
      totalNetVarianceDays,
      completedOnTimeCount,
      completedCount,
      onTimeRate,
      aheadCount,
      delayedCount
    };
  }, [phases]);

  // Helper to calculate percentage position on timeline ruler
  const getPercentPosition = (dateStr: string): number => {
    const time = new Date(dateStr).getTime();
    if (isNaN(time)) return 0;
    const totalSpan = bounds.maxDateMs - bounds.minDateMs;
    if (totalSpan <= 0) return 0;
    const percent = ((time - bounds.minDateMs) / totalSpan) * 100;
    return Math.max(0, Math.min(100, percent));
  };

  // Format short date for badges
  const formatShortDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 1. Header & Timeline Analytics Metrics */}
      <div className="p-5 rounded-3xl bg-neutral-900/80 border border-white/10 backdrop-blur-md space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold mb-1">
              <CalendarDays className="w-3.5 h-3.5 text-blue-400" />
              <span>Chronological Delivery Schedule Analysis</span>
            </div>
            <h4 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <span>Expected vs. Actual Delivery Timeline</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 font-bold">
                {phases.length} Total Phases
              </span>
            </h4>
            <p className="text-xs text-neutral-400 max-w-xl">
              Compare baseline contract milestones against certified actual deliveries, forecast variances, and critical path schedules.
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-neutral-950/70 border border-white/5 space-y-1">
              <div className="text-[10px] text-neutral-400 uppercase font-extrabold tracking-wider">Schedule Status</div>
              <div className="text-sm font-black text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{varianceMetrics.totalNetVarianceDays <= 0 ? 'Ahead of Schedule' : 'Schedule Drift'}</span>
              </div>
              <div className="text-[10px] text-neutral-500">
                {Math.abs(varianceMetrics.totalNetVarianceDays)} days net {varianceMetrics.totalNetVarianceDays <= 0 ? 'gain' : 'delay'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-950/70 border border-white/5 space-y-1">
              <div className="text-[10px] text-neutral-400 uppercase font-extrabold tracking-wider">On-Time Accuracy</div>
              <div className="text-sm font-black text-blue-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span>{varianceMetrics.onTimeRate}%</span>
              </div>
              <div className="text-[10px] text-neutral-500">
                {varianceMetrics.completedOnTimeCount} of {varianceMetrics.completedCount} phases on/ahead
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-neutral-950/70 border border-white/5 space-y-1">
              <div className="text-[10px] text-neutral-400 uppercase font-extrabold tracking-wider">Delivery Window</div>
              <div className="text-xs font-bold text-white font-mono truncate">
                {formatShortDate(bounds.startDateFormatted)} - {formatShortDate(bounds.endDateFormatted)}
              </div>
              <div className="text-[10px] text-neutral-500">
                ~{bounds.totalDays} calendar days span
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Controls Toolbar */}
        <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <span className="text-neutral-500 font-bold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </span>
            {(['all', 'critical', 'completed', 'in_progress'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`px-2.5 py-1 rounded-xl font-medium cursor-pointer transition-all ${
                  filterMode === mode
                    ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-600/30'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border border-white/5'
                }`}
              >
                {mode === 'all' ? 'All Phases' : mode === 'critical' ? 'Critical Path' : mode === 'completed' ? 'Completed (100%)' : 'In Progress'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-neutral-500 font-bold">Sort:</span>
            <button
              onClick={() => setSortOrder(sortOrder === 'chronological' ? 'variance' : 'chronological')}
              className="px-2.5 py-1 rounded-xl bg-neutral-950 text-neutral-300 hover:text-white border border-white/5 font-medium cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>{sortOrder === 'chronological' ? 'Chronological Date' : 'Variance / Performance'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Visual Timeline Gantt & Dual Track Matrix */}
      <div className="p-5 rounded-3xl bg-neutral-900/70 border border-white/10 space-y-5 overflow-hidden backdrop-blur-md">
        {/* Timeline Header Ruler (Months and Intervals) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-mono pb-1 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="font-bold text-white">Project Inception:</span>
              <span>{bounds.startDateFormatted}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-bold text-white">Projected Handover:</span>
              <span>{bounds.endDateFormatted}</span>
            </div>
          </div>

          {/* Month Tick Ruler Bar */}
          <div className="relative h-7 bg-neutral-950/80 rounded-xl border border-white/5 overflow-hidden px-4 hidden md:block">
            {bounds.monthMarkers.map((marker, idx) => (
              <div 
                key={idx}
                className="absolute top-0 bottom-0 flex flex-col items-center justify-center -translate-x-1/2 text-[10px] font-mono text-neutral-400"
                style={{ left: `${marker.percent}%` }}
              >
                <div className="h-2 w-px bg-white/20 mb-0.5" />
                <span>{marker.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between flex-wrap gap-3 text-xs bg-neutral-950/50 p-3 rounded-2xl border border-white/5">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-2 rounded-sm bg-neutral-700 border border-neutral-500 border-dashed" />
              <span className="text-neutral-400 text-[11px]">Expected Target Window</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-2 rounded-sm bg-emerald-500 shadow-sm shadow-emerald-500/30" />
              <span className="text-neutral-300 text-[11px] font-medium">Actual Delivery (Completed)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-2 rounded-sm bg-blue-500 shadow-sm shadow-blue-500/30" />
              <span className="text-neutral-300 text-[11px] font-medium">Active Forecast Track</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-2 rounded-sm bg-amber-500 shadow-sm shadow-amber-500/30" />
              <span className="text-neutral-300 text-[11px] font-medium">Schedule Variance / Slip</span>
            </div>
          </div>

          <div className="text-[11px] text-neutral-400 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>Click any phase row to inspect deliverables & verification status</span>
          </div>
        </div>

        {/* Chronological Phase Rows */}
        <div className="space-y-3.5">
          {processedPhases.map((phase) => {
            const isCompleted = phase.status === 'completed' || phase.completionPercentage === 100;
            const isInProgress = phase.status === 'in_progress';
            const variance = calculateScheduleVariance(phase);
            const isExpanded = expandedPhaseId === phase.id;

            // Compute positions
            const startPercent = getPercentPosition(phase.startDate);
            const targetEndPercent = getPercentPosition(phase.targetEndDate);
            const actualEndPercent = phase.actualEndDate 
              ? getPercentPosition(phase.actualEndDate)
              : phase.projectedEndDate 
                ? getPercentPosition(phase.projectedEndDate)
                : targetEndPercent;

            const expectedWidth = Math.max(3, targetEndPercent - startPercent);
            const actualWidth = Math.max(3, actualEndPercent - startPercent);

            return (
              <div 
                key={phase.id}
                onClick={() => {
                  setExpandedPhaseId(isExpanded ? null : phase.id);
                  onSelectPhase?.(phase.id);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isExpanded
                    ? 'bg-neutral-950 border-blue-500/50 shadow-xl shadow-blue-950/30 ring-1 ring-blue-500/20'
                    : isCompleted
                      ? 'bg-neutral-950/60 border-white/5 hover:border-emerald-500/30 hover:bg-neutral-950/80'
                      : 'bg-neutral-950/60 border-white/5 hover:border-white/20 hover:bg-neutral-950/80'
                }`}
              >
                {/* Top Row: Meta, Status, and Variance Badges */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 pb-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-xs font-bold">
                      {phase.shortCode}
                    </span>

                    <h5 className="text-sm font-black text-white flex items-center gap-1.5">
                      <span>{phase.name}</span>
                      {phase.criticalPath && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-extrabold uppercase">
                          Critical Path
                        </span>
                      )}
                    </h5>

                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/40">
                        <Award className="w-3 h-3 text-emerald-400" />
                        <span>100% Completed</span>
                      </span>
                    )}

                    {isInProgress && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black border border-blue-500/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                        <span>In Progress ({phase.completionPercentage}%)</span>
                      </span>
                    )}
                  </div>

                  {/* Schedule Variance Pill & Date Values */}
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1 ${variance.badgeBg} ${variance.badgeText} ${variance.badgeBorder}`}>
                      {variance.status === 'ahead' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : variance.status === 'delayed' ? (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                      )}
                      <span>{variance.label}</span>
                    </span>

                    <span className="text-[11px] text-neutral-400 font-mono hidden sm:inline">
                      Target: <strong className="text-white">{formatShortDate(phase.targetEndDate)}</strong>
                      {phase.actualEndDate && (
                        <> | Actual: <strong className="text-emerald-400">{formatShortDate(phase.actualEndDate)}</strong></>
                      )}
                    </span>
                  </div>
                </div>

                {/* Timeline Gantt Track Comparison Bar */}
                <div className="space-y-1.5 pt-1">
                  {/* Visual Dual Tracks */}
                  <div className="relative h-10 bg-neutral-900/90 rounded-xl p-1.5 border border-white/5 overflow-hidden">
                    {/* Background Month Guide Gridlines */}
                    {bounds.monthMarkers.map((marker, idx) => (
                      <div 
                        key={idx}
                        className="absolute top-0 bottom-0 w-px bg-white/5 pointer-events-none"
                        style={{ left: `${marker.percent}%` }}
                      />
                    ))}

                    {/* 1. Expected Target Bar (Top Track) */}
                    <div 
                      className="absolute top-1.5 h-3 rounded-md bg-neutral-800 border border-neutral-600 border-dashed z-10 transition-all group flex items-center px-1"
                      style={{ 
                        left: `${startPercent}%`, 
                        width: `${expectedWidth}%` 
                      }}
                      title={`Expected: ${phase.startDate} to ${phase.targetEndDate}`}
                    >
                      <span className="text-[8px] font-mono text-neutral-400 truncate opacity-90 hidden sm:inline">
                        Target: {formatShortDate(phase.targetEndDate)}
                      </span>
                    </div>

                    {/* 2. Actual or Forecasted Bar (Bottom Track) */}
                    <div 
                      className={`absolute bottom-1.5 h-3.5 rounded-md z-20 transition-all flex items-center px-1.5 shadow-sm ${
                        isCompleted
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-400 text-neutral-950 font-black shadow-emerald-500/20'
                          : isInProgress
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-bold shadow-blue-500/20'
                            : 'bg-neutral-800 text-neutral-400'
                      }`}
                      style={{ 
                        left: `${startPercent}%`, 
                        width: `${actualWidth}%` 
                      }}
                      title={phase.actualEndDate ? `Actual Delivered: ${phase.actualEndDate}` : `Target: ${phase.targetEndDate}`}
                    >
                      <span className="text-[8px] font-mono truncate">
                        {isCompleted 
                          ? `Delivered ${formatShortDate(phase.actualEndDate || phase.targetEndDate)}` 
                          : isInProgress 
                            ? `${phase.completionPercentage}% Complete` 
                            : 'Upcoming'}
                      </span>
                    </div>

                    {/* Pin Marker on Actual Date */}
                    {phase.actualEndDate && (
                      <div 
                        className="absolute bottom-1 w-2 h-4 rounded bg-emerald-300 z-30 shadow-md shadow-emerald-400/50"
                        style={{ left: `${actualEndPercent}%` }}
                        title={`Actual Delivery Point: ${phase.actualEndDate}`}
                      />
                    )}
                  </div>

                  {/* Micro Timeline Legend for this Phase */}
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono px-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-neutral-500" />
                      <span>Start: {formatShortDate(phase.startDate)}</span>
                    </span>

                    <div className="flex items-center gap-3">
                      <span className="text-neutral-400">
                        Expected: <strong className="text-neutral-300">{formatShortDate(phase.targetEndDate)}</strong>
                      </span>
                      {phase.actualEndDate ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                          <Check className="w-3 h-3" />
                          <span>Actual: {formatShortDate(phase.actualEndDate)}</span>
                        </span>
                      ) : (
                        <span className="text-blue-400 font-bold">
                          Forecast: {formatShortDate(phase.projectedEndDate || phase.targetEndDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="mt-4 pt-3.5 border-t border-white/10 space-y-3 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                      <div className="p-2.5 rounded-xl bg-neutral-900 border border-white/5">
                        <div className="text-[10px] text-neutral-400 uppercase font-bold">Lead Responsible</div>
                        <div className="text-white font-medium mt-0.5 truncate">{phase.leadOwner}</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-neutral-900 border border-white/5">
                        <div className="text-[10px] text-neutral-400 uppercase font-bold">Phase Discipline</div>
                        <div className="text-white font-medium mt-0.5">{phase.category}</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-neutral-900 border border-white/5">
                        <div className="text-[10px] text-neutral-400 uppercase font-bold">Budget Allocated</div>
                        <div className="text-emerald-400 font-mono font-bold mt-0.5">{phase.budgetAllocated || 'N/A'}</div>
                      </div>
                    </div>

                    {phase.description && (
                      <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-900/40 p-3 rounded-xl border border-white/5">
                        {phase.description}
                      </p>
                    )}

                    {/* Deliverables Checklist for this Phase */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-neutral-300 flex items-center justify-between">
                        <span>Phase Deliverables & Verification Checklist ({phase.keyDeliverables.filter(d => d.completed).length}/{phase.keyDeliverables.length}):</span>
                        <span className="text-blue-400">{phase.completionPercentage}% Delivered</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {phase.keyDeliverables.map((del) => (
                          <div 
                            key={del.id}
                            className={`p-2 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                              del.completed 
                                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' 
                                : 'bg-neutral-900 border-white/5 text-neutral-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                                del.completed ? 'bg-emerald-500 border-emerald-400 text-neutral-950 font-bold' : 'border-neutral-600 bg-neutral-950'
                              }`}>
                                {del.completed && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="truncate">{del.title}</span>
                            </div>
                            {del.deliverableType && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/5 shrink-0">
                                {del.deliverableType}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {processedPhases.length === 0 && (
          <div className="text-center py-10 rounded-2xl bg-neutral-950/40 border border-white/10 text-neutral-400 text-xs">
            No milestones match the current filter.
          </div>
        )}
      </div>
    </div>
  );
};
