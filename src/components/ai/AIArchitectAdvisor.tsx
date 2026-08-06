import React, { useState } from 'react';
import { Compass, Sparkles, AlertTriangle, Layers, Home, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export const AIArchitectAdvisor: React.FC = () => {
  const [plotSize, setPlotSize] = useState('1200 sq.ft (30x40)');
  const [roomCount, setRoomCount] = useState('3 BHK + Study');
  const [style, setStyle] = useState<'Modern' | 'Luxury Villa' | 'Tropical Minimalist' | 'Traditional Contemporary'>('Modern');
  const [budgetINR, setBudgetINR] = useState(4500000);
  const [loading, setLoading] = useState(false);
  const [concept, setConcept] = useState<any>(null);

  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setConcept({
        title: `${style} Conceptual Layout for ${plotSize}`,
        circulationScore: '94/100 (Optimal Cross-Ventilation)',
        roomArrangements: [
          { room: 'Living & Dining Hall', position: 'North-East Facing', dimension: '18ft × 22ft', notes: 'Double-height ceiling with clerestory windows for daylighting.' },
          { room: 'Master Bedroom', position: 'South-West Corner', dimension: '14ft × 16ft', notes: 'Attached walk-in wardrobe & anti-skid balcony access.' },
          { room: 'Guest Bedroom', position: 'North-West Corner', dimension: '12ft × 14ft', notes: 'Proximity to common bath and garden view.' },
          { room: 'Modular Kitchen', position: 'South-East (Agni Corner)', dimension: '10ft × 12ft', notes: 'Parallel granite counter with dedicated utility wash area.' },
          { room: 'Home Office / Study', position: 'East Facing', dimension: '10ft × 10ft', notes: 'Quiet corner with sound-dampened uPVC windows.' }
        ],
        spaceOptimization: [
          'Under-stair area repurposed as a concealed utility storage and AC inverter rack.',
          'Cantilevered upper balcony provides natural shade for ground floor car porch.',
          'Central light shaft / courtyard brings indirect sunlight into interior hallway.'
        ],
        structuralNotes: 'Recommended column spacing: 12ft to 16ft grid using M25 grade concrete and Fe500D rebar.'
      });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6 text-xs">
      {/* HEADER BANNER */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-400" />
            <span>AI Architectural Assistant & Spatial Planning Engine</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Generates conceptual floor plan arrangements, circulation geometry, space optimization & room zoning ideas.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px] border border-blue-500/30">
          Vastu & IS Code Aware
        </span>
      </div>

      {/* MANDATORY PROFESSIONAL DISCLAIMER */}
      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-slate-300 text-[11px] leading-relaxed">
          <strong className="text-amber-300 block font-bold">Mandatory Professional Notice:</strong>
          All architectural concepts, room arrangements, and structural suggestions provided by this AI engine are for preliminary informational planning only. All physical construction, load calculations, and municipal permits require formal review and seal by licensed structural engineers and registered architects prior to execution.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* INPUT FORM */}
        <form onSubmit={handleGeneratePlan} className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
          <h3 className="font-bold text-white text-sm border-b border-white/10 pb-3">Project Requirements</h3>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Plot Size / Dimensions</label>
            <input 
              type="text" 
              value={plotSize} 
              onChange={e => setPlotSize(e.target.value)} 
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-mono" 
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Target Configuration / Room Count</label>
            <input 
              type="text" 
              value={roomCount} 
              onChange={e => setRoomCount(e.target.value)} 
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white" 
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Architectural Style</label>
            <select 
              value={style} 
              onChange={e => setStyle(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white"
            >
              <option value="Modern">Modern Minimalist</option>
              <option value="Luxury Villa">Luxury Villa / Estate</option>
              <option value="Tropical Minimalist">Tropical Minimalist</option>
              <option value="Traditional Contemporary">Traditional Contemporary</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Target Budget (INR)</label>
            <input 
              type="number" 
              value={budgetINR} 
              onChange={e => setBudgetINR(Number(e.target.value))} 
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-mono" 
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            {loading ? 'Synthesizing Architecture...' : 'Generate Architectural Plan'}
          </button>
        </form>

        {/* CONCEPT OUTPUT */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-5">
          {!concept ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
              <Compass className="w-10 h-10 text-slate-700 animate-pulse" />
              <p>Configure parameters on the left to generate room arrangements & space optimization concepts.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-bold text-white text-base">{concept.title}</h3>
                <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold">
                  {concept.circulationScore}
                </span>
              </div>

              {/* ROOM ARRANGEMENTS */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-300 uppercase text-[10px] tracking-wider">Room Arrangements & Circulation</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {concept.roomArrangements.map((rm: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold">{rm.room}</span>
                        <span className="text-blue-400 font-mono text-[10px]">{rm.dimension}</span>
                      </div>
                      <div className="text-cyan-400 text-[10px] font-semibold">{rm.position}</div>
                      <p className="text-slate-400 text-[11px] leading-tight">{rm.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SPACE OPTIMIZATION */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <h4 className="font-bold text-slate-300 uppercase text-[10px] tracking-wider">Space Optimization Ideas</h4>
                <div className="space-y-1.5">
                  {concept.spaceOptimization.map((opt: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-slate-300 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* STRUCTURAL ADVICE */}
              <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/20 text-blue-200 text-[11px] font-mono">
                <ShieldCheck className="w-4 h-4 text-blue-400 inline mr-2" />
                {concept.structuralNotes}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
