import React from 'react';
import { StructuralAdviceItem } from '../../types/aiPlanning';
import { ShieldAlert, CheckCircle2, Building, Layers, Shield, Columns, Flame, Droplets, Zap, Compass, AlertTriangle } from 'lucide-react';

interface StructuralAdviceViewerProps {
  structuralAdviceList: StructuralAdviceItem[];
}

export const StructuralAdviceViewer: React.FC<StructuralAdviceViewerProps> = ({ structuralAdviceList }) => {
  return (
    <div className="space-y-6 text-xs">
      {/* MANDATORY LEGAL & ENGINEERING DISCLAIMER BANNER */}
      <div className="p-5 rounded-3xl bg-amber-950/60 border-2 border-amber-500/50 shadow-2xl flex items-start space-x-4">
        <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 shrink-0">
          <AlertTriangle className="w-6 h-6 animate-bounce" />
        </div>
        <div className="space-y-1.5">
          <h4 className="text-sm font-black text-amber-300 uppercase tracking-wider">
            Mandatory Engineering & Code Review Notice
          </h4>
          <p className="text-amber-100 text-xs leading-relaxed">
            The structural specifications, column orientations, foundation guidelines, and load estimations below are <strong className="underline text-white">conceptual planning estimates only</strong>. Before undertaking physical site excavation or concrete pouring, all structural drawings and rebar schedules <strong className="underline text-white font-bold">must be formally prepared, calculated, stamped, and approved by a licensed structural engineer and registered architect</strong> according to IS 456, IS 1893 (Seismic Code), and local municipal building bylaws.
          </p>
        </div>
      </div>

      {/* GUIDANCE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {structuralAdviceList.map((item, index) => (
          <div key={index} className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4 hover:border-blue-500/40 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-blue-400 font-bold uppercase tracking-wider text-[10px]">{item.category} Specification</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{item.title}</h4>
                </div>
                {item.codeReference && (
                  <span className="px-2.5 py-1 rounded-full bg-slate-950 border border-white/10 text-slate-400 font-mono text-[10px]">
                    {item.codeReference}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
                  <span className="text-amber-400 font-bold text-[10px] uppercase tracking-wider block">Recommended Strategy:</span>
                  <p className="text-slate-200 text-xs leading-relaxed font-semibold">{item.recommendation}</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
                  <span className="text-cyan-400 font-bold text-[10px] uppercase tracking-wider block">Technical Specification & Rebar Detail:</span>
                  <p className="text-slate-300 text-xs leading-relaxed">{item.specification}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" /> Conceptual Guideline
              </span>
              <span>Requires Engineer Stamp</span>
            </div>
          </div>
        ))}
      </div>

      {/* ADDITIONAL STRUCTURAL & MEP CHECKLIST */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
          <Shield className="w-4 h-4 text-purple-400" />
          <span>Additional MEP, Safety & Environmental Recommendations</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-slate-300 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-1.5">
            <div className="text-blue-400 font-bold flex items-center gap-1.5">
              <Droplets className="w-4 h-4" /> Rainwater Harvesting System
            </div>
            <p className="text-slate-400 text-[11px]">Direct roof runoff water through 100mm PVC pipes to a 3-stage gravel-sand filter pit for groundwater recharge.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-1.5">
            <div className="text-amber-400 font-bold flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> Electrical Conduit & Grounding
            </div>
            <p className="text-slate-400 text-[11px]">Install copper plate earthing pit with salt-charcoal fill. Route FRLSH concealed PVC conduits with separate neutral wire.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-1.5">
            <div className="text-red-400 font-bold flex items-center gap-1.5">
              <Flame className="w-4 h-4" /> Earthquake & Fire Resistance
            </div>
            <p className="text-slate-400 text-[11px]">Provide 135-degree seismic hooks on all column stirrups according to IS 13920. Mount ABC dry powder extinguisher in kitchen.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
