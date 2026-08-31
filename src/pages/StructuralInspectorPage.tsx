import React from 'react';
import { AIStructuralDamageInspector } from '../components/structural/AIStructuralDamageInspector';
import { ShieldAlert, Cpu, ArrowLeft, BookOpen, Calculator, Sparkles } from 'lucide-react';

interface StructuralInspectorPageProps {
  onNavigate?: (page: string) => void;
}

export const StructuralInspectorPage: React.FC<StructuralInspectorPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#020408] text-slate-100 pt-28 pb-24 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-500 selection:text-white">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/4 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate ? onNavigate('construction') : window.history.back()}
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Construction Intelligence</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="hidden sm:inline">Module:</span>
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono border border-blue-500/20">
              Civil Computer Vision
            </span>
          </div>
        </div>

        {/* Main Component */}
        <AIStructuralDamageInspector />
      </div>
    </div>
  );
};
