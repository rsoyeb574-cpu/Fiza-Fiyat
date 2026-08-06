import React, { useState } from 'react';
import { Calendar, FileCheck, CheckCircle2, ShieldCheck, Clock, Layers } from 'lucide-react';

export const AIProjectAdvisor: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sequence' | 'approvals' | 'quality' | 'maintenance'>('sequence');

  const sequenceSteps = [
    { phase: 'Phase 1: Soil Test & Land Survey', timeline: 'Week 1 - 2', desc: 'Conduct soil bearing capacity (SBC) test and total station boundary contour survey.' },
    { phase: 'Phase 2: Architectural & Structural Drawings', timeline: 'Week 2 - 4', desc: 'Finalize 2D floor plans, 3D BIM models, column centerline grid & municipal submission drawings.' },
    { phase: 'Phase 3: Excavation & Footing Concrete', timeline: 'Week 5 - 8', desc: 'Excavate foundation pits, lay 4" PCC bed, position footings & rebar cages, pour M25 grade concrete.' },
    { phase: 'Phase 4: Plinth Beams & Backfilling', timeline: 'Week 9 - 12', desc: 'Cast plinth tie beams, apply anti-termite chemical soil treatment, backfill and compact sand.' },
    { phase: 'Phase 5: Columns, Beams & Roof Slab Casting', timeline: 'Week 13 - 20', desc: 'Erect RCC columns, shuttering for roof beam & slab, lay M25 concrete with vibrator compaction.' },
    { phase: 'Phase 6: Brick Masonry & Electrical/Plumbing Conduits', timeline: 'Week 21 - 28', desc: 'Construct AAC block masonry walls, chase wall grooves for PVC electrical and CPVC water pipes.' },
    { phase: 'Phase 7: Plastering & Waterproofing', timeline: 'Week 29 - 36', desc: 'Apply 2-coat cement plaster (1:4), liquid elastomeric waterproofing in toilets & roof terrace.' },
    { phase: 'Phase 8: Flooring, Paint & Key Handover', timeline: 'Week 37 - 48', desc: 'Lay vitrified floor tiles, apply acrylic putty, 2 coats emulsion paint, fix fixtures & client handover.' }
  ];

  const approvalsList = [
    { title: 'Municipal Sanction Plan Approval', dept: 'Local Municipal Corporation / KMC / DDA', status: 'Mandatory before excavation' },
    { title: 'Structural Safety Stability Certificate', dept: 'Registered Chartered Structural Engineer', status: 'Required for bank loan & approval' },
    { title: 'NOC from Fire Department', dept: 'State Fire Service', status: 'Required for G+3 & high-rise buildings' },
    { title: 'Environmental & Pollution Control Clearance', dept: 'State Pollution Control Board', status: 'For commercial / large built-up sites' },
    { title: 'Temporary Electricity & Water Connection', dept: 'State Electricity Board & Water Supply Dept', status: 'Required before site mobilization' }
  ];

  const qualityCheckpoints = [
    { code: 'IS 456:2000', check: 'Concrete Cube Testing', detail: 'Compressive strength check at 7 days (67%) and 28 days (100%).' },
    { code: 'IS 1786:2008', check: 'Rebar Steel Elongation Test', detail: 'Verification of Fe500D yield strength and bend/re-bend ductility.' },
    { code: 'IS 269:2015', check: 'Cement Setting Time Test', detail: 'Initial setting time (>30 mins) and final setting time (<600 mins).' },
    { code: 'IS 383:2016', check: 'Coarse & Fine Aggregate Silt Test', detail: 'Silt content in river/M-sand must not exceed 8% by volume.' }
  ];

  const maintenancePlan = [
    { period: 'Every 6 Months', task: 'Roof Terrace Drain Cleaning', detail: 'Clear rainwater spouts and inspect elastomeric membrane for cracks.' },
    { period: 'Every 2 Years', task: 'External Wall Silicone Paint Touchup', detail: 'Inspect parapet joints and re-seal hairline cracks with acrylic sealant.' },
    { period: 'Every 5 Years', task: 'Waterproofing Integrity Re-Audit', detail: 'Check bathroom ceiling soffits for moisture dampness spots.' }
  ];

  return (
    <div className="space-y-6 text-xs">
      <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span>AI Project Execution Advisor & Quality Checkpoints</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Construction sequence, timelines, municipal approvals, IS code quality checks & maintenance schedule.
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveTab('sequence')}
          className={`px-4 py-2.5 rounded-2xl font-bold cursor-pointer transition-all ${
            activeTab === 'sequence' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 border border-white/10'
          }`}
        >
          Construction Sequence & Timeline
        </button>
        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-2.5 rounded-2xl font-bold cursor-pointer transition-all ${
            activeTab === 'approvals' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 border border-white/10'
          }`}
        >
          Municipal Approvals & NOCs
        </button>
        <button
          onClick={() => setActiveTab('quality')}
          className={`px-4 py-2.5 rounded-2xl font-bold cursor-pointer transition-all ${
            activeTab === 'quality' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 border border-white/10'
          }`}
        >
          IS Code Quality Checkpoints
        </button>
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`px-4 py-2.5 rounded-2xl font-bold cursor-pointer transition-all ${
            activeTab === 'maintenance' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 border border-white/10'
          }`}
        >
          Maintenance Planning
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
        {activeTab === 'sequence' && (
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm border-b border-white/10 pb-3">Phase-by-Phase Execution Timeline</h3>
            {sequenceSteps.map((s, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-white font-bold text-xs">{s.phase}</div>
                  <p className="text-slate-400 text-[11px] mt-0.5">{s.desc}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 font-mono font-bold text-[10px] shrink-0 border border-indigo-500/30">
                  {s.timeline}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'approvals' && (
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm border-b border-white/10 pb-3">Required Permits & Municipal Approvals</h3>
            {approvalsList.map((a, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex justify-between items-center">
                <div>
                  <div className="text-white font-bold text-xs">{a.title}</div>
                  <div className="text-slate-400 text-[10px]">Department: {a.dept}</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-950 text-blue-300 font-bold text-[10px]">
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'quality' && (
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm border-b border-white/10 pb-3">Indian Standards (IS) Quality Control Tests</h3>
            {qualityCheckpoints.map((q, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex justify-between items-center">
                <div>
                  <div className="text-white font-bold text-xs">{q.check} ({q.code})</div>
                  <div className="text-slate-400 text-[11px]">{q.detail}</div>
                </div>
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm border-b border-white/10 pb-3">Building Maintenance Schedule</h3>
            {maintenancePlan.map((m, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex justify-between items-center">
                <div>
                  <div className="text-white font-bold text-xs">{m.task}</div>
                  <div className="text-slate-400 text-[11px]">{m.detail}</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-950 text-amber-300 font-bold text-[10px]">
                  {m.period}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
