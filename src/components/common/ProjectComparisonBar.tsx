import React from 'react';
import { ArrowLeftRight, X, Sparkles, Check, ChevronUp, ChevronDown } from 'lucide-react';
import { Project } from '../../types';

interface ProjectComparisonBarProps {
  compareList: Project[];
  onRemoveProject: (id: string) => void;
  onClearAll: () => void;
  onOpenCompareModal: () => void;
}

export const ProjectComparisonBar: React.FC<ProjectComparisonBarProps> = ({
  compareList,
  onRemoveProject,
  onClearAll,
  onOpenCompareModal
}) => {
  const [collapsed, setCollapsed] = React.useState(false);

  if (compareList.length === 0) return null;

  const p1 = compareList[0];
  const p2 = compareList[1] || null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-3xl animate-bounce-short">
      <div className="bg-[#0F172A]/95 border border-violet-500/40 rounded-3xl p-3 sm:p-4 shadow-2xl backdrop-blur-2xl text-white">
        
        {/* TOP BAR / TOGGLE */}
        <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-violet-600/30 text-violet-300">
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white tracking-wide text-xs">
              Project Comparison Tray ({compareList.length}/2 Selected)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={collapsed ? "Expand comparison tray" : "Minimize"}
            >
              {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <button
              onClick={onClearAll}
              className="text-[11px] text-slate-400 hover:text-red-400 font-semibold px-2 py-0.5 rounded-md hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>
        </div>

        {!collapsed && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* SELECTED SLOTS */}
            <div className="grid grid-cols-2 gap-2.5 w-full sm:w-auto flex-1">
              
              {/* SLOT 1 */}
              <div className="flex items-center gap-2.5 bg-[#15203B] p-2 rounded-2xl border border-violet-500/30">
                <img
                  src={p1.coverImage}
                  alt={p1.title}
                  className="w-10 h-10 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-violet-400 block uppercase">Project 1</span>
                  <h4 className="text-xs font-bold text-white truncate">{p1.title}</h4>
                </div>
                <button
                  onClick={() => onRemoveProject(p1.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Remove from comparison"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* SLOT 2 */}
              {p2 ? (
                <div className="flex items-center gap-2.5 bg-[#15203B] p-2 rounded-2xl border border-blue-500/30">
                  <img
                    src={p2.coverImage}
                    alt={p2.title}
                    className="w-10 h-10 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-blue-400 block uppercase">Project 2</span>
                    <h4 className="text-xs font-bold text-white truncate">{p2.title}</h4>
                  </div>
                  <button
                    onClick={() => onRemoveProject(p2.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Remove from comparison"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center p-2 rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 text-slate-400 text-xs text-center">
                  <span className="text-[11px] font-medium text-slate-400">
                    + Click "Compare" on a 2nd project card
                  </span>
                </div>
              )}

            </div>

            {/* ACTION BUTTON */}
            <div className="w-full sm:w-auto">
              <button
                onClick={onOpenCompareModal}
                disabled={compareList.length < 2}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                  compareList.length === 2
                    ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-violet-600/40 hover:-translate-y-0.5'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <ArrowLeftRight className="w-4 h-4" />
                {compareList.length === 2 ? 'Compare Now (2/2)' : 'Select 1 More to Compare'}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
