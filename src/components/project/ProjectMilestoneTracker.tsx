import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Layers, 
  Flag, 
  AlertCircle, 
  ChevronRight, 
  Sparkles, 
  FileCheck, 
  Building2, 
  Check, 
  ArrowRight, 
  RotateCcw, 
  Printer, 
  Share2, 
  Search, 
  SlidersHorizontal,
  BarChart3,
  CalendarDays,
  ListTodo,
  TrendingUp,
  ShieldCheck,
  Zap,
  Info,
  Download,
  Award,
  Loader2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  Cell 
} from 'recharts';
import { Project, ProjectMilestonePhase, ProjectMilestoneProgress } from '../../types';
import { getProjectMilestones, getPhaseStatusBadge } from '../../utils/projectMilestones';
import { downloadMilestoneProgressPdf } from '../../utils/milestonePdfGenerator';
import { ProjectChronologicalTimeline } from './ProjectChronologicalTimeline';

interface ProjectMilestoneTrackerProps {
  project: Project;
  className?: string;
}

export const ProjectMilestoneTracker: React.FC<ProjectMilestoneTrackerProps> = ({ 
  project, 
  className = '' 
}) => {
  // Baseline data initialized from project or tailored generator
  const initialMilestones = useMemo(() => getProjectMilestones(project), [project]);
  
  // Interactive state allowing live client simulation of deliverable completions
  const [phases, setPhases] = useState<ProjectMilestonePhase[]>(initialMilestones.phases);
  const [activeViewMode, setActiveViewMode] = useState<'stepper' | 'chronological' | 'cards' | 'analytics'>('stepper');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress' | 'upcoming'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>(
    initialMilestones.phases.find(p => p.status === 'in_progress')?.id || initialMilestones.phases[0]?.id || ''
  );
  const [hasModified, setHasModified] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Recalculate dynamic milestone statistics
  const currentStats = useMemo(() => {
    const total = phases.length;
    if (total === 0) {
      return {
        overallPercentage: 0,
        completedPhasesCount: 0,
        inProgressCount: 0,
        upcomingCount: 0,
        totalDeliverables: 0,
        completedDeliverables: 0,
        activePhase: null
      };
    }

    let totalDeliverables = 0;
    let completedDeliverables = 0;
    let totalPhasePercentage = 0;

    phases.forEach(phase => {
      totalPhasePercentage += phase.completionPercentage;
      totalDeliverables += phase.keyDeliverables.length;
      completedDeliverables += phase.keyDeliverables.filter(d => d.completed).length;
    });

    const overallPercentage = Math.round(totalPhasePercentage / total);
    const completedPhasesCount = phases.filter(p => p.completionPercentage === 100 || p.status === 'completed').length;
    const inProgressCount = phases.filter(p => p.status === 'in_progress').length;
    const upcomingCount = phases.filter(p => p.status === 'upcoming').length;
    const activePhase = phases.find(p => p.status === 'in_progress') || phases[phases.length - 1];

    return {
      overallPercentage,
      completedPhasesCount,
      inProgressCount,
      upcomingCount,
      totalDeliverables,
      completedDeliverables,
      activePhase
    };
  }, [phases]);

  // Handle interactive deliverable checkbox toggle
  const handleToggleDeliverable = (phaseId: string, deliverableId: string) => {
    let completedPhaseName: string | null = null;

    setPhases(prevPhases => {
      return prevPhases.map(phase => {
        if (phase.id !== phaseId) return phase;

        const updatedDeliverables = phase.keyDeliverables.map(del => {
          if (del.id !== deliverableId) return del;
          return { ...del, completed: !del.completed };
        });

        const completedCount = updatedDeliverables.filter(d => d.completed).length;
        const totalCount = updatedDeliverables.length;
        const newPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        let newStatus: ProjectMilestonePhase['status'] = phase.status;
        let newActualEndDate = phase.actualEndDate;
        if (newPercentage === 100) {
          newStatus = 'completed';
          if (!newActualEndDate) {
            newActualEndDate = new Date().toISOString().split('T')[0];
          }
          if (phase.completionPercentage < 100) {
            completedPhaseName = phase.name;
          }
        } else if (newPercentage > 0) {
          newStatus = 'in_progress';
        } else {
          newStatus = 'upcoming';
        }

        return {
          ...phase,
          keyDeliverables: updatedDeliverables,
          completionPercentage: newPercentage,
          status: newStatus,
          actualEndDate: newActualEndDate
        };
      });
    });

    setHasModified(true);
    if (completedPhaseName) {
      setToastMessage(`Phase 100% Completed: "${completedPhaseName}" has attained full delivery sign-off!`);
      setTimeout(() => setToastMessage(null), 4500);
    } else {
      setToastMessage('Milestone progress metrics recalculated in real-time');
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  // Export Milestone Progress as official PDF summary
  const handleExportPdf = async () => {
    if (isExportingPdf) return;
    setIsExportingPdf(true);
    try {
      await downloadMilestoneProgressPdf(project, phases, currentStats);
      setExportSuccess(true);
      setToastMessage('Milestone progress dossier successfully generated & downloaded');
      setTimeout(() => {
        setExportSuccess(false);
        setToastMessage(null);
      }, 3500);
    } catch (err) {
      console.error('Failed to export milestone progress PDF:', err);
      setToastMessage('Export failed. Please try again.');
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Reset to original baseline
  const handleResetBaseline = () => {
    setPhases(initialMilestones.phases);
    setHasModified(false);
    setToastMessage('Milestone timeline reset to baseline schedule');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered phases based on search and status
  const filteredPhases = useMemo(() => {
    return phases.filter(phase => {
      if (statusFilter !== 'all') {
        if (statusFilter === 'completed' && phase.completionPercentage !== 100 && phase.status !== 'completed') return false;
        if (statusFilter === 'in_progress' && phase.status !== 'in_progress') return false;
        if (statusFilter === 'upcoming' && phase.status !== 'upcoming' && phase.completionPercentage > 0) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = phase.name.toLowerCase().includes(q);
        const matchesCategory = phase.category.toLowerCase().includes(q);
        const matchesOwner = phase.leadOwner.toLowerCase().includes(q);
        const matchesCode = phase.shortCode.toLowerCase().includes(q);
        const matchesDeliverables = phase.keyDeliverables.some(d => d.title.toLowerCase().includes(q));
        return matchesName || matchesCategory || matchesOwner || matchesCode || matchesDeliverables;
      }

      return true;
    });
  }, [phases, statusFilter, searchQuery]);

  // Data for Recharts Bar Chart
  const chartData = useMemo(() => {
    return phases.map(p => ({
      name: p.shortCode,
      fullName: p.name,
      completion: p.completionPercentage,
      status: p.status,
      category: p.category
    }));
  }, [phases]);

  // Selected phase details
  const activeSelectedPhase = useMemo(() => {
    return phases.find(p => p.id === selectedPhaseId) || phases[0];
  }, [phases, selectedPhaseId]);

  return (
    <div id="project-milestones-tracker" className={`space-y-6 pt-6 border-t border-white/10 ${className}`}>
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold">
            <Flag className="w-3.5 h-3.5 text-blue-400" />
            <span>Project Delivery Roadmap & Milestone Tracking</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Milestone Progress Tracker</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 font-bold">
              {phases.length} Phases
            </span>
          </h3>
          <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
            Monitor real-time completion percentages across design, engineering, statutory permits, and site execution phases with verifiable deliverables and critical path tracking.
          </p>
        </div>

        {/* View Switcher & Action Controls */}
        <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
          {/* Export Milestone Progress PDF Button */}
          <button
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/30 cursor-pointer disabled:opacity-60"
            title="Export full milestone progress report & phase matrix as PDF summary"
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                <span>Exporting PDF...</span>
              </>
            ) : exportSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>PDF Exported!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-white" />
                <span>Export Milestone PDF</span>
              </>
            )}
          </button>

          {hasModified && (
            <button
              onClick={handleResetBaseline}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Reset progress to official baseline schedule"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Baseline</span>
            </button>
          )}

          <div className="inline-flex p-1 rounded-xl bg-neutral-900/80 border border-white/10 text-xs font-medium">
            <button
              onClick={() => setActiveViewMode('stepper')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeViewMode === 'stepper'
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Interactive Roadmap Stepper"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Roadmap</span>
            </button>

            <button
              onClick={() => setActiveViewMode('chronological')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeViewMode === 'chronological'
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Chronological timeline visualization: Expected vs. Actual delivery dates & schedule variance"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span className="flex items-center gap-1.5">
                <span>Expected vs Actual</span>
                <span className="hidden sm:inline text-[9px] px-1.5 py-0.2 rounded bg-white/15 text-white font-bold uppercase">Timeline</span>
              </span>
            </button>

            <button
              onClick={() => setActiveViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeViewMode === 'cards'
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>Phases</span>
            </button>

            <button
              onClick={() => setActiveViewMode('analytics')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeViewMode === 'analytics'
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. High-Level Metrics Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Overall Project Completion % with Visual Ring Gauge */}
        <div className="p-4 rounded-3xl bg-neutral-900/70 border border-white/10 flex items-center gap-4 relative overflow-hidden backdrop-blur-md">
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            {/* SVG Circular Progress Ring */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/10"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-blue-500 transition-all duration-700 ease-out"
                strokeDasharray={`${currentStats.overallPercentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-sm font-black text-white">
              {currentStats.overallPercentage}%
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
              Total Progress
            </span>
            <div className="text-sm font-black text-white">
              {currentStats.overallPercentage >= 100 ? 'Fully Delivered' : `${currentStats.overallPercentage}% Complete`}
            </div>
            <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Project on schedule</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Current Active Stage */}
        <div className="p-4 rounded-3xl bg-neutral-900/70 border border-white/10 space-y-1 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              Active Project Stage
            </span>
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          </div>
          <div className="text-sm font-bold text-white truncate" title={currentStats.activePhase?.name || 'Complete'}>
            {currentStats.activePhase ? currentStats.activePhase.name : 'All Completed'}
          </div>
          <div className="text-[11px] text-blue-400 font-medium">
            {currentStats.activePhase ? `${currentStats.activePhase.completionPercentage}% Phase Complete` : 'Handover Done'}
          </div>
        </div>

        {/* Metric 3: Phases Status Counts */}
        <div className="p-4 rounded-3xl bg-neutral-900/70 border border-white/10 space-y-1 backdrop-blur-md">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
            Phase Breakdown
          </span>
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400 font-black">{currentStats.completedPhasesCount}</span> Done
            <span className="text-neutral-500">•</span>
            <span className="text-blue-400 font-black">{currentStats.inProgressCount}</span> Active
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-400 font-black">{currentStats.upcomingCount}</span> Next
          </div>
          <div className="text-[11px] text-neutral-400">
            Out of {phases.length} scheduled phases
          </div>
        </div>

        {/* Metric 4: Target Handover Countdown */}
        <div className="p-4 rounded-3xl bg-neutral-900/70 border border-white/10 space-y-1 backdrop-blur-md">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
            Target Handover
          </span>
          <div className="text-sm font-bold text-white flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-violet-400" />
            <span>{initialMilestones.targetHandoverDate}</span>
          </div>
          <div className="text-[11px] text-violet-300">
            {currentStats.completedDeliverables} of {currentStats.totalDeliverables} deliverables verified
          </div>
        </div>
      </div>

      {/* 3. VIEW 1: INTERACTIVE TIMELINE STEPPER (ROADMAP) */}
      {activeViewMode === 'stepper' && (
        <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0F172A]/90 to-neutral-950 border border-white/10 shadow-xl space-y-8 backdrop-blur-md">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h4 className="text-white font-bold text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span>Multi-Phase Architectural Delivery Stepper</span>
              </h4>
              <p className="text-neutral-400 text-xs mt-0.5">
                Click any milestone node to view phase-specific specifications, owners, and active deliverables.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveViewMode('chronological')}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1 rounded-xl border border-blue-500/20 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="View chronological expected vs actual delivery timeline"
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Expected vs Actual</span>
              </button>
              <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20 hidden sm:inline">
                Interactive Roadmap
              </span>
            </div>
          </div>

          {/* Stepper Horizontal Scroll Container */}
          <div className="overflow-x-auto pb-4 pt-2 scrollbar-thin scrollbar-thumb-neutral-800">
            <div className="min-w-[760px] relative px-4">
              {/* Connected Background Track Line */}
              <div className="absolute top-5 left-8 right-8 h-1 bg-neutral-800 rounded-full z-0" />
              
              {/* Dynamic Completed Track Line */}
              <div 
                className="absolute top-5 left-8 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500 rounded-full z-0 transition-all duration-700 ease-out"
                style={{
                  width: `${Math.min(100, Math.max(0, (currentStats.completedPhasesCount / (phases.length - 1)) * 90))}%`
                }}
              />

              {/* Stepper Nodes */}
              <div className="relative z-10 flex items-start justify-between">
                {phases.map((phase) => {
                  const isCompleted = phase.completionPercentage === 100 || phase.status === 'completed';
                  const isInProgress = phase.status === 'in_progress';
                  const isSelected = phase.id === selectedPhaseId;

                  return (
                    <div 
                      key={phase.id} 
                      onClick={() => setSelectedPhaseId(phase.id)}
                      className="flex flex-col items-center cursor-pointer group max-w-[95px] text-center"
                    >
                      {/* Node Circle with Completed Indicator / Notification Badge */}
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border-2 ${
                          isCompleted 
                            ? 'bg-emerald-500 text-neutral-950 border-emerald-300 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/30' 
                            : isInProgress 
                              ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/40 ring-4 ring-blue-500/20 scale-110' 
                              : 'bg-neutral-900 text-neutral-400 border-neutral-700 group-hover:border-neutral-500'
                        } ${isSelected ? 'ring-2 ring-white scale-115' : ''}`}>
                          {isCompleted ? (
                            <Check className="w-5 h-5 stroke-[2.5]" />
                          ) : (
                            <span>{phase.phaseNumber}</span>
                          )}
                        </div>

                        {/* Completed 100% Visual Notification Icon Pill */}
                        {isCompleted && (
                          <div 
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-300 text-neutral-950 flex items-center justify-center shadow-md shadow-emerald-400/50 ring-2 ring-neutral-900 animate-in zoom-in-50"
                            title="Phase 100% Completed & Verified"
                          >
                            <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                          </div>
                        )}
                      </div>

                      {/* Percentage Badge */}
                      <span className={`mt-2 text-[10px] font-black px-1.5 py-0.5 rounded-md border flex items-center gap-0.5 ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/10'
                          : isInProgress
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : 'bg-neutral-800 text-neutral-400 border-white/5'
                      }`}>
                        {isCompleted && <Award className="w-2.5 h-2.5 text-emerald-400 shrink-0" />}
                        <span>{phase.completionPercentage}%</span>
                      </span>

                      {/* Node Label */}
                      <span className={`mt-1 text-[11px] font-bold line-clamp-2 leading-tight transition-colors ${
                        isSelected ? 'text-white font-extrabold' : 'text-neutral-400 group-hover:text-neutral-200'
                      }`}>
                        {phase.shortCode}
                      </span>
                      <span className="text-[9px] text-neutral-500 truncate w-full mt-0.5">
                        {phase.category}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Focused Phase Detail Card Under Stepper */}
          {activeSelectedPhase && (
            <div className="p-5 rounded-2xl bg-neutral-900/90 border border-blue-500/30 space-y-4 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 font-mono text-xs font-bold border border-blue-500/30">
                      {activeSelectedPhase.shortCode}
                    </span>
                    <span className="text-xs text-neutral-400 font-medium">
                      {activeSelectedPhase.category}
                    </span>
                    {activeSelectedPhase.criticalPath && (
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[10px] font-bold border border-rose-500/20">
                        Critical Path
                      </span>
                    )}
                  </div>
                  <h5 className="text-base font-bold text-white mt-1">
                    {activeSelectedPhase.name}
                  </h5>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-neutral-400">Phase Completion</div>
                    <div className="text-lg font-black text-white">
                      {activeSelectedPhase.completionPercentage}%
                    </div>
                  </div>
                  <div className="w-24 bg-neutral-800 h-2.5 rounded-full overflow-hidden border border-white/10">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        activeSelectedPhase.completionPercentage === 100 
                          ? 'bg-emerald-500' 
                          : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                      }`}
                      style={{ width: `${activeSelectedPhase.completionPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 100% Completed Indicator Banner */}
              {activeSelectedPhase.completionPercentage === 100 && (
                <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-emerald-900/30 to-neutral-950 border border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-950/40 animate-in fade-in">
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex items-center justify-center">
                      <span className="w-4 h-4 rounded-full bg-emerald-400/40 animate-ping absolute" />
                      <div className="w-7 h-7 rounded-xl bg-emerald-500 text-neutral-950 flex items-center justify-center font-black relative z-10 shadow-sm shadow-emerald-400/50">
                        <Check className="w-4 h-4 stroke-[3.5]" />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-black text-white flex items-center gap-1.5">
                        <span>Phase Sign-Off Verified (100% Completed)</span>
                        <Award className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="text-[11px] text-emerald-300/80">
                        All statutory approvals, LOD 400 models, and field milestone deliverables are fulfilled.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold uppercase shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Certified</span>
                  </div>
                </div>
              )}

              <p className="text-xs text-neutral-300 leading-relaxed">
                {activeSelectedPhase.description}
              </p>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">Lead Owner</span>
                  <span className="text-neutral-200 font-medium truncate block">{activeSelectedPhase.leadOwner}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">Timeline Window</span>
                  <span className="text-neutral-200 font-medium block">{activeSelectedPhase.startDate} → {activeSelectedPhase.targetEndDate}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">Phase Budget</span>
                  <span className="text-emerald-400 font-medium block">{activeSelectedPhase.budgetAllocated || 'Included in Prime Contract'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-950/60 border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">Risk Matrix</span>
                  <span className={`font-bold capitalize block ${
                    activeSelectedPhase.riskLevel === 'high' ? 'text-rose-400' : activeSelectedPhase.riskLevel === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {activeSelectedPhase.riskLevel || 'Low'} Risk
                  </span>
                </div>
              </div>

              {/* Key Deliverables Interactive Checklist for this Phase */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    Key Phase Deliverables & Sign-offs:
                  </span>
                  <span className="text-neutral-400 text-[11px]">
                    Click checkbox to simulate delivery updates
                  </span>
                </div>

                <div className="space-y-2">
                  {activeSelectedPhase.keyDeliverables.map((del) => (
                    <div
                      key={del.id}
                      onClick={() => handleToggleDeliverable(activeSelectedPhase.id, del.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        del.completed
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-neutral-200'
                          : 'bg-neutral-950/60 border-white/5 text-neutral-400 hover:border-blue-500/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                          del.completed
                            ? 'bg-emerald-500 border-emerald-400 text-neutral-950 font-bold'
                            : 'border-neutral-600 bg-neutral-900'
                        }`}>
                          {del.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className={`text-xs ${del.completed ? 'text-white font-medium' : 'text-neutral-300'}`}>
                          {del.title}
                        </span>
                      </div>

                      {del.deliverableType && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-neutral-400 border border-white/5 shrink-0">
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
      )}

      {/* 4. VIEW: CHRONOLOGICAL TIMELINE (EXPECTED VS. ACTUAL DELIVERY DATES) */}
      {activeViewMode === 'chronological' && (
        <ProjectChronologicalTimeline
          project={project}
          phases={phases}
          selectedPhaseId={selectedPhaseId}
          onSelectPhase={(id) => setSelectedPhaseId(id)}
        />
      )}

      {/* 5. VIEW 2: PHASE CARDS LIST & FILTERABLE BREAKDOWN */}
      {activeViewMode === 'cards' && (
        <div className="space-y-6">
          {/* Search & Status Filters */}
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search phases or deliverables (e.g. BIM, Permit, Concrete)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto text-xs">
              {(['all', 'completed', 'in_progress', 'upcoming'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl font-semibold capitalize cursor-pointer transition-all ${
                    statusFilter === filter
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-neutral-950 text-neutral-400 hover:text-white border border-white/5'
                  }`}
                >
                  {filter === 'all' ? 'All Phases' : filter.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPhases.map((phase) => {
              const statusStyle = getPhaseStatusBadge(phase.status);
              const isDone = phase.completionPercentage === 100;

              return (
                <div
                  key={phase.id}
                  className={`p-5 rounded-3xl bg-neutral-900/70 border transition-all space-y-4 flex flex-col justify-between ${
                    isDone 
                      ? 'border-emerald-500/20 hover:border-emerald-500/40' 
                      : phase.status === 'in_progress' 
                        ? 'border-blue-500/30 ring-1 ring-blue-500/20' 
                        : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[11px] font-bold">
                            {phase.shortCode}
                          </span>
                          <span className="text-[11px] text-neutral-400">
                            {phase.category}
                          </span>
                          {phase.criticalPath && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 font-bold border border-rose-500/20">
                              Critical
                            </span>
                          )}
                          {isDone && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/40 shadow-sm shadow-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <Award className="w-3 h-3 text-emerald-400" />
                              <span>Completed</span>
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white">
                          {phase.name}
                        </h4>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0 ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                        {statusStyle.label}
                      </span>
                    </div>

                    {/* Prominent Visual Indicator Banner for 100% Completed Phases */}
                    {isDone && (
                      <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-neutral-950/40 border border-emerald-500/40 text-emerald-300 text-xs shadow-sm shadow-emerald-950/30">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm shadow-emerald-500/30">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                            <div className="text-[11px] font-black text-white flex items-center gap-1.5">
                              <span>Phase 100% Completed</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-300 font-bold uppercase">Sign-Off Done</span>
                            </div>
                            <div className="text-[10px] text-emerald-400/80">
                              All {phase.keyDeliverables.length} required technical deliverables verified
                            </div>
                          </div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0 mr-1" />
                      </div>
                    )}

                    {/* Progress Bar with Percentage Display */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-neutral-400 text-[11px]">Phase Completion</span>
                        <span className={`font-bold ${isDone ? 'text-emerald-400' : 'text-blue-400'}`}>
                          {phase.completionPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-white/5">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isDone 
                              ? 'bg-emerald-500' 
                              : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                          }`}
                          style={{ width: `${phase.completionPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    {phase.description && (
                      <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                        {phase.description}
                      </p>
                    )}

                    {/* Interactive Key Deliverables */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                        Deliverables Checklist ({phase.keyDeliverables.filter(d => d.completed).length}/{phase.keyDeliverables.length}):
                      </span>
                      <div className="space-y-1">
                        {phase.keyDeliverables.map((del) => (
                          <div
                            key={del.id}
                            onClick={() => handleToggleDeliverable(phase.id, del.id)}
                            className="flex items-center gap-2 text-xs py-1 px-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                          >
                            <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                              del.completed ? 'bg-emerald-500 border-emerald-400 text-black font-bold' : 'border-neutral-600 bg-neutral-950'
                            }`}>
                              {del.completed && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className={`text-[11px] truncate ${del.completed ? 'text-neutral-300 line-through opacity-80' : 'text-neutral-200'}`}>
                              {del.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Meta */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-neutral-400">
                    <span className="truncate max-w-[180px]">Lead: {phase.leadOwner.split('(')[0]}</span>
                    <span className="font-mono">{phase.targetEndDate}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPhases.length === 0 && (
            <div className="text-center py-12 rounded-2xl bg-neutral-900/40 border border-white/10 text-neutral-400 text-xs">
              No project phases found matching your criteria.
            </div>
          )}
        </div>
      )}

      {/* 5. VIEW 3: ANALYTICS & RECHARTS GANTT-STYLE COMPARISON */}
      {activeViewMode === 'analytics' && (
        <div className="p-6 rounded-3xl bg-neutral-900/70 border border-white/10 space-y-6 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-white font-bold text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span>Phase Progress Distribution & Critical Path Analysis</span>
              </h4>
              <p className="text-neutral-400 text-xs mt-0.5">
                Comparative completion percentages across all architectural, structural, and site construction phases.
              </p>
            </div>
            <span className="text-xs text-neutral-400">
              Average Completion: <strong className="text-white">{currentStats.overallPercentage}%</strong>
            </span>
          </div>

          {/* Recharts Bar Chart */}
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11} 
                  domain={[0, 100]} 
                  unit="%" 
                  tickLine={false}
                />
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 rounded-xl bg-neutral-950 border border-white/10 shadow-2xl text-xs space-y-1">
                          <div className="font-bold text-white">{data.fullName}</div>
                          <div className="text-blue-400 font-black">{data.completion}% Complete</div>
                          <div className="text-neutral-400 capitalize">Category: {data.category}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="completion" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.completion === 100 ? '#10b981' : entry.status === 'in_progress' ? '#3b82f6' : '#475569'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 pt-2 border-t border-white/5 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>100% Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-600" />
              <span>Upcoming</span>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Toast Feedback when deliverables are toggled */}
      {toastMessage && (
        <div className="fixed bottom-20 left-6 z-50 animate-in slide-in-from-bottom-3 fade-in duration-200">
          <div className="px-4 py-2.5 rounded-xl bg-neutral-900/95 border border-blue-500/40 text-white text-xs font-bold shadow-2xl flex items-center gap-2 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};
