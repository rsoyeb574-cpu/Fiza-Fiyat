import React, { useState } from 'react';
import { 
  X, 
  ArrowLeftRight, 
  DollarSign, 
  Building, 
  Layers, 
  Calendar, 
  ShieldCheck, 
  Wrench, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  ChevronRight,
  TrendingUp,
  Maximize2,
  FileSpreadsheet,
  Share2,
  Check
} from 'lucide-react';
import { Project } from '../../types';
import { getProjectSpecs, calculateComparisonDelta } from '../../utils/projectComparison';

interface ProjectComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  project1: Project | null;
  project2: Project | null;
  allProjects: Project[];
  onSelectProject1: (project: Project) => void;
  onSelectProject2: (project: Project) => void;
  onViewProjectDetails: (id: string) => void;
  onOpenCalculator?: () => void;
  onInquireProject?: (project: Project) => void;
}

export const ProjectComparisonModal: React.FC<ProjectComparisonModalProps> = ({
  isOpen,
  onClose,
  project1,
  project2,
  allProjects,
  onSelectProject1,
  onSelectProject2,
  onViewProjectDetails,
  onOpenCalculator,
  onInquireProject
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !project1 || !project2) return null;

  const specs1 = getProjectSpecs(project1);
  const specs2 = getProjectSpecs(project2);
  const delta = calculateComparisonDelta(project1, project2);

  const handleSwap = () => {
    const temp = project1;
    onSelectProject1(project2);
    onSelectProject2(temp);
  };

  const handleShareComparison = () => {
    const url = `${window.location.origin}/#compare?p1=${project1.id}&p2=${project2.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="bg-[#0F172A] border border-indigo-500/25 rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-neutral-200 relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-6 border-b border-indigo-500/20 bg-[#131E36]/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-600/30">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
                  Side-by-Side Analysis
                </span>
                <span className="text-[10px] text-slate-400">Architectural & Financial Matrix</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Project Specification & Cost Comparison
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={handleSwap}
              title="Swap Column 1 and Column 2"
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Swap</span>
            </button>

            <button
              onClick={handleShareComparison}
              title="Share comparison link"
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-red-500/20 hover:text-red-400 border border-slate-700 text-slate-400 transition-all cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE COMPARISON BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* PROJECT SELECTOR & HERO CARDS HEADER */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative">
            
            {/* VS BADGE IN CENTER */}
            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-violet-600 text-white font-black text-xs items-center justify-center shadow-xl border-2 border-[#0F172A]">
              VS
            </div>

            {/* COLUMN 1: PROJECT 1 */}
            <div className="bg-[#15203B]/90 border border-violet-500/30 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase text-violet-400">Project A</span>
                  {/* Quick Dropdown selector to switch Project 1 */}
                  <select
                    value={project1.id}
                    onChange={(e) => {
                      const found = allProjects.find(p => p.id === e.target.value);
                      if (found) onSelectProject1(found);
                    }}
                    className="bg-[#0B1020] border border-violet-500/30 text-white text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-violet-500 max-w-[200px] cursor-pointer"
                  >
                    {allProjects.map((p) => (
                      <option key={p.id} value={p.id} disabled={p.id === project2.id}>
                        {p.title} {p.id === project2.id ? '(Project B)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative h-44 rounded-xl overflow-hidden group mb-3">
                  <img
                    src={project1.coverImage}
                    alt={project1.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-violet-300 border border-violet-500/30">
                    {project1.categoryName}
                  </span>
                  {project1.location && (
                    <span className="absolute bottom-2.5 left-2.5 text-[11px] font-medium text-slate-200 flex items-center gap-1">
                      <Building className="w-3 h-3 text-violet-400" />
                      {project1.location}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white leading-snug line-clamp-2">
                  {project1.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {project1.description}
                </p>
              </div>

              {/* Key Highlights Card */}
              <div className="pt-3 border-t border-slate-700/60 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#0B1020]/70 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Estimated Total Cost</span>
                  <span className="text-sm font-black text-emerald-400">{specs1.estimatedCost}</span>
                </div>
                <div className="bg-[#0B1020]/70 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Cost / Unit</span>
                  <span className="text-sm font-bold text-slate-200">{specs1.costPerSqFt}</span>
                </div>
                <div className="bg-[#0B1020]/70 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Scale / Area</span>
                  <span className="text-xs font-semibold text-slate-200">{specs1.area}</span>
                </div>
                <div className="bg-[#0B1020]/70 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Timeline Duration</span>
                  <span className="text-xs font-semibold text-violet-300">{specs1.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onViewProjectDetails(project1.id);
                  }}
                  className="flex-1 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-violet-500/30"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Case Study
                </button>
                {onInquireProject && (
                  <button
                    onClick={() => onInquireProject(project1)}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-all cursor-pointer"
                  >
                    Inquire
                  </button>
                )}
              </div>
            </div>

            {/* COLUMN 2: PROJECT 2 */}
            <div className="bg-[#15203B]/90 border border-blue-500/30 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase text-blue-400">Project B</span>
                  {/* Quick Dropdown selector to switch Project 2 */}
                  <select
                    value={project2.id}
                    onChange={(e) => {
                      const found = allProjects.find(p => p.id === e.target.value);
                      if (found) onSelectProject2(found);
                    }}
                    className="bg-[#0B1020] border border-blue-500/30 text-white text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-blue-500 max-w-[200px] cursor-pointer"
                  >
                    {allProjects.map((p) => (
                      <option key={p.id} value={p.id} disabled={p.id === project1.id}>
                        {p.title} {p.id === project1.id ? '(Project A)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative h-44 rounded-xl overflow-hidden group mb-3">
                  <img
                    src={project2.coverImage}
                    alt={project2.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-blue-300 border border-blue-500/30">
                    {project2.categoryName}
                  </span>
                  {project2.location && (
                    <span className="absolute bottom-2.5 left-2.5 text-[11px] font-medium text-slate-200 flex items-center gap-1">
                      <Building className="w-3 h-3 text-blue-400" />
                      {project2.location}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white leading-snug line-clamp-2">
                  {project2.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {project2.description}
                </p>
              </div>

              {/* Key Highlights Card */}
              <div className="pt-3 border-t border-slate-700/60 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#0B1020]/70 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Estimated Total Cost</span>
                  <span className="text-sm font-black text-emerald-400">{specs2.estimatedCost}</span>
                </div>
                <div className="bg-[#0B1020]/70 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Cost / Unit</span>
                  <span className="text-sm font-bold text-slate-200">{specs2.costPerSqFt}</span>
                </div>
                <div className="bg-[#0B1020]/70 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Scale / Area</span>
                  <span className="text-xs font-semibold text-slate-200">{specs2.area}</span>
                </div>
                <div className="bg-[#0B1020]/70 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Timeline Duration</span>
                  <span className="text-xs font-semibold text-blue-300">{specs2.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onViewProjectDetails(project2.id);
                  }}
                  className="flex-1 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-blue-500/30"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Case Study
                </button>
                {onInquireProject && (
                  <button
                    onClick={() => onInquireProject(project2)}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-all cursor-pointer"
                  >
                    Inquire
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* DELTA SUMMARY BANNER */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-blue-950/40 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Cost Variance Delta
                </span>
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {delta.costDiffFormatted} Difference ({delta.costDiffPercent}% Delta)
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {delta.higherCostProject === 1 
                  ? `"${project1.title}" reflects a higher architectural scope and capital investment than "${project2.title}".`
                  : delta.higherCostProject === 2
                  ? `"${project2.title}" reflects a higher architectural scope and capital investment than "${project1.title}".`
                  : `Both projects are within comparable capital budgeting brackets.`
                }
              </p>
            </div>

            {onOpenCalculator && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCalculator();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-violet-600/30 transition-all cursor-pointer whitespace-nowrap"
              >
                Custom Cost Calculator
              </button>
            )}
          </div>

          {/* DETAILED SPECIFICATIONS & COSTS MATRIX */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-violet-400" />
              Detailed Specifications Matrix
            </h4>

            <div className="bg-[#111A2E] rounded-2xl border border-indigo-500/20 overflow-hidden text-xs">
              
              {/* SECTION: FINANCIALS & COST BREAKDOWN */}
              <div className="bg-indigo-950/40 px-4 py-2 font-bold text-indigo-300 text-xs border-b border-indigo-500/20 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                Cost Breakdown & Budgeting
              </div>

              <div className="divide-y divide-slate-800">
                <div className="grid grid-cols-12 p-3 hover:bg-white/5 transition-colors">
                  <div className="col-span-4 font-semibold text-slate-400">Total Project Estimate</div>
                  <div className="col-span-4 font-bold text-emerald-400">{specs1.estimatedCost}</div>
                  <div className="col-span-4 font-bold text-emerald-400">{specs2.estimatedCost}</div>
                </div>

                <div className="grid grid-cols-12 p-3 hover:bg-white/5 transition-colors">
                  <div className="col-span-4 font-semibold text-slate-400">Cost Rate / Unit</div>
                  <div className="col-span-4 text-slate-200">{specs1.costPerSqFt}</div>
                  <div className="col-span-4 text-slate-200">{specs2.costPerSqFt}</div>
                </div>

                <div className="grid grid-cols-12 p-3 hover:bg-white/5 transition-colors">
                  <div className="col-span-4 font-semibold text-slate-400">Architectural & Blueprints</div>
                  <div className="col-span-4 text-slate-300">{specs1.costBreakdown.architectural}</div>
                  <div className="col-span-4 text-slate-300">{specs2.costBreakdown.architectural}</div>
                </div>

                <div className="grid grid-cols-12 p-3 hover:bg-white/5 transition-colors">
                  <div className="col-span-4 font-semibold text-slate-400">3D Renders & BIM Modeling</div>
                  <div className="col-span-4 text-slate-300">{specs1.costBreakdown.bimAnd3d}</div>
                  <div className="col-span-4 text-slate-300">{specs2.costBreakdown.bimAnd3d}</div>
                </div>

                <div className="grid grid-cols-12 p-3 hover:bg-white/5 transition-colors">
                  <div className="col-span-4 font-semibold text-slate-400">Structural & MEP Engineering</div>
                  <div className="col-span-4 text-slate-300">{specs1.costBreakdown.engineering}</div>
                  <div className="col-span-4 text-slate-300">{specs2.costBreakdown.engineering}</div>
                </div>

                <div className="grid grid-cols-12 p-3 hover:bg-white/5 transition-colors">
                  <div className="col-span-4 font-semibold text-slate-400">Execution / Fit-out Estimate</div>
                  <div className="col-span-4 text-slate-300">{specs1.costBreakdown.constructionEst}</div>
                  <div className="col-span-4 text-slate-300">{specs2.costBreakdown.constructionEst}</div>
                </div>
              </div>

              {/* SECTION: ARCHITECTURAL & PHYSICAL SPECIFICATIONS */}
              <div className="bg-indigo-950/40 px-4 py-2 font-bold text-indigo-300 text-xs border-y border-indigo-500/20 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" />
                Physical & Architectural Parameters
              </div>

              <div className="divide-y divide-slate-800">
                <div className="grid grid-cols-12 p-3 hover:bg-white/5 transition-colors">
                  <div className="col-span-4 font-semibold text-slate-400">Category & Typology</div>
                  <div className="col-span-4 text-violet-300 font-medium">{project1.categoryName}</div>
                  <div className="col-span-4 text-blue-300 font-medium">{project2.categoryName}</div>
                </div>

                <div className="grid grid-cols-12 p-3 hover:bg-white/5 transition-colors">
                  <div className="col-span-4 font-semibold text-slate-400">Location</div>
                  <div className="col-span-4 text-slate-200">{project1.location || 'International'}</div>
                  <div className="col-span-4 text-slate-200">{project2.location || 'International'}</div>
                </div>

                <div className="grid grid-cols-12 p-3 hover:bg-white/5 transition-colors">
                  <div className="col-span-4 font-semibold text-slate-400">Built-Up Area / Scale</div>
                  <div className="col-span-4 font-semibold text-white">{specs1.area}</div>
                  <div className="col-span-4 font-semibold text-white">{specs2.area}</div>
                </div>

                <div className="grid grid-cols-12 p-3 hover:bg-white/5 transition-colors">
                  <div className="col-span-4 font-semibold text-slate-400">Duration / Project Cycle</div>
                  <div className="col-span-4 text-slate-200">{specs1.duration}</div>
                  <div className="col-span-4 text-slate-200">{specs2.duration}</div>
                </div>

                <div className="grid grid-cols-12 p-3 hover:bg-white/5 transition-colors">
                  <div className="col-span-4 font-semibold text-slate-400">Structural System</div>
                  <div className="col-span-4 text-slate-200 leading-relaxed">{specs1.structuralType}</div>
                  <div className="col-span-4 text-slate-200 leading-relaxed">{specs2.structuralType}</div>
                </div>

                <div className="grid grid-cols-12 p-3 hover:bg-white/5 transition-colors">
                  <div className="col-span-4 font-semibold text-slate-400">Levels / Floors</div>
                  <div className="col-span-4 text-slate-300">{specs1.floors}</div>
                  <div className="col-span-4 text-slate-300">{specs2.floors}</div>
                </div>

                <div className="grid grid-cols-12 p-3 hover:bg-white/5 transition-colors">
                  <div className="col-span-4 font-semibold text-slate-400">Energy & Sustainability</div>
                  <div className="col-span-4 text-emerald-400 font-medium">{specs1.energyRating}</div>
                  <div className="col-span-4 text-emerald-400 font-medium">{specs2.energyRating}</div>
                </div>

                <div className="grid grid-cols-12 p-3 hover:bg-white/5 transition-colors">
                  <div className="col-span-4 font-semibold text-slate-400">BIM Level of Development</div>
                  <div className="col-span-4 text-slate-300">{specs1.bimLevel}</div>
                  <div className="col-span-4 text-slate-300">{specs2.bimLevel}</div>
                </div>
              </div>

              {/* SECTION: MATERIALS & FINISHES */}
              <div className="bg-indigo-950/40 px-4 py-2 font-bold text-indigo-300 text-xs border-y border-indigo-500/20 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Primary Materials & Finishes
              </div>

              <div className="grid grid-cols-12 p-3 gap-3">
                <div className="col-span-4 font-semibold text-slate-400">Material Specification</div>
                <div className="col-span-4">
                  <div className="flex flex-wrap gap-1.5">
                    {specs1.materials.map((m, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-violet-950/60 border border-violet-500/30 text-violet-200 text-[10px]">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-span-4">
                  <div className="flex flex-wrap gap-1.5">
                    {specs2.materials.map((m, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-blue-950/60 border border-blue-500/30 text-blue-200 text-[10px]">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION: SOFTWARE & ENGINEERING TECH STACK */}
              <div className="bg-indigo-950/40 px-4 py-2 font-bold text-indigo-300 text-xs border-y border-indigo-500/20 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" />
                Software & Tooling Stack
              </div>

              <div className="grid grid-cols-12 p-3 gap-3">
                <div className="col-span-4 font-semibold text-slate-400">Software Used</div>
                <div className="col-span-4">
                  <div className="flex flex-wrap gap-1.5">
                    {specs1.softwareUsed.map((sw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px]">
                        {sw}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-span-4">
                  <div className="flex flex-wrap gap-1.5">
                    {specs2.softwareUsed.map((sw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px]">
                        {sw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION: DELIVERABLES & DRAWING PACKAGES */}
              <div className="bg-indigo-950/40 px-4 py-2 font-bold text-indigo-300 text-xs border-y border-indigo-500/20 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Deliverables & Included Documentation
              </div>

              <div className="grid grid-cols-12 p-3 gap-3">
                <div className="col-span-4 font-semibold text-slate-400">Key Deliverables</div>
                <div className="col-span-4 space-y-1">
                  {specs1.deliverables.map((d, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
                <div className="col-span-4 space-y-1">
                  {specs2.deliverables.map((d, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 border-t border-indigo-500/20 bg-[#131E36]/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 text-center sm:text-left">
            Need a tailored quotation combining features from both projects?
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold transition-all cursor-pointer"
            >
              Close
            </button>
            {onOpenCalculator && (
              <button
                onClick={() => {
                  onClose();
                  onOpenCalculator();
                }}
                className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
              >
                Launch Cost Calculator
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
