import React from 'react';
import { SteelDiagnosisView } from '../components/steel/SteelDiagnosisView';
import { ArrowLeft, Cpu, ShieldCheck } from 'lucide-react';

interface SteelDiagnosisPageProps {
  onNavigate?: (page: string) => void;
}

export const SteelDiagnosisPage: React.FC<SteelDiagnosisPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 pt-28 pb-24 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/4 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate ? onNavigate('construction-intelligence') : window.history.back()}
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Intelligence Hub</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="hidden sm:inline">Discipline:</span>
            <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono border border-blue-500/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Structural Steel & Sheet Metal Metallurgy</span>
            </span>
          </div>
        </div>

        {/* Main Steel Diagnosis Component */}
        <SteelDiagnosisView />
      </div>
    </div>
  );
};
