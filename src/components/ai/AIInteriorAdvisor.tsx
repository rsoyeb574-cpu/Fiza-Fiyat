import React, { useState } from 'react';
import { Sofa, Sparkles, Palette, Sun, Box, Layers, CheckCircle2 } from 'lucide-react';

export const AIInteriorAdvisor: React.FC = () => {
  const [style, setStyle] = useState('Modern Japandi / Warm Luxury');
  const [roomType, setRoomType] = useState('Master Living Room & Dining');
  const [colorPalette, setColorPalette] = useState('Warm Cream, Charcoal & Oak Veneer');
  const [budgetINR, setBudgetINR] = useState(1200000);
  const [lifestyle, setLifestyle] = useState('Family with Kids & Remote Work Desk');

  const [moodBoard, setMoodBoard] = useState<any>({
    title: 'Modern Japandi Warm Luxury Interior',
    colors: [
      { name: 'Warm Cream', hex: '#FDFBF7', usage: 'Primary Wall Base Paint' },
      { name: 'Muted Oak Veneer', hex: '#D4A373', usage: 'Fluted Wall Paneling' },
      { name: 'Charcoal Black', hex: '#262626', usage: 'Accent Metal Trims & Window Frames' },
      { name: 'Champagne Brass', hex: '#C5A880', usage: 'Pendant Lights & Hardware Fixtures' }
    ],
    furniture: [
      'Low-profile L-shaped performance fabric sectional sofa in light beige.',
      'Floating marble-top coffee table with fluted wood cylinder base.',
      'Ergonomic oak wood dining table with 6 upholstered chairs.'
    ],
    lighting: [
      '3000K warm indirect recessed LED COB cove lighting in gypsum ceiling.',
      'Architectural magnetic track lights over media entertainment wall.',
      'Hand-blown brass glass drop pendant above dining table.'
    ],
    materials: [
      '800x800mm Beige Vitrified Marble Slab Tiles with Epoxy Grout',
      'Matte PU Polyurethane lacquer finish on wardrobe shutters',
      'Acoustic felt backing behind fluted wood slats'
    ],
    storage: [
      'Hidden push-to-open entryway shoe cabinet beneath floating foyer bench.',
      'Full-height concealed storage wall in dining zone with wine glass rack.'
    ]
  });

  return (
    <div className="space-y-6 text-xs">
      <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <Sofa className="w-5 h-5 text-indigo-400" />
            <span>AI Interior Designer & Mood Board Synthesizer</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Generates mood boards, furniture layouts, indirect lighting schemes, color combinations & custom storage ideas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* INPUTS */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
          <h3 className="font-bold text-white text-sm border-b border-white/10 pb-3">Interior Preferences</h3>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Room Type</label>
            <input 
              type="text" 
              value={roomType} 
              onChange={e => setRoomType(e.target.value)} 
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white" 
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Design Style</label>
            <input 
              type="text" 
              value={style} 
              onChange={e => setStyle(e.target.value)} 
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white" 
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Color Palette Theme</label>
            <input 
              type="text" 
              value={colorPalette} 
              onChange={e => setColorPalette(e.target.value)} 
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white" 
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Interior Budget (INR)</label>
            <input 
              type="number" 
              value={budgetINR} 
              onChange={e => setBudgetINR(Number(e.target.value))} 
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-mono" 
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Lifestyle Needs</label>
            <input 
              type="text" 
              value={lifestyle} 
              onChange={e => setLifestyle(e.target.value)} 
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white" 
            />
          </div>

          <button
            onClick={() => alert('Interior mood board re-synthesized!')}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-300" /> Re-Synthesize Concept
          </button>
        </div>

        {/* MOOD BOARD & SPECIFICATIONS */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h3 className="font-bold text-white text-base">{moodBoard.title}</h3>
              <p className="text-slate-400 text-xs">{roomType} • Budget: ₹{(budgetINR / 100000).toFixed(1)} Lakhs</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-950 border border-indigo-500/30 text-indigo-300 font-mono text-[10px] font-bold">
              AI Mood Board
            </span>
          </div>

          {/* COLOR PALETTE SWATCHES */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-300 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-indigo-400" /> Color Combinations
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {moodBoard.colors.map((c: any, i: number) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                  <div className="h-10 rounded-xl border border-white/10 shadow-inner" style={{ backgroundColor: c.hex }}></div>
                  <div>
                    <div className="text-white font-bold text-[11px]">{c.name}</div>
                    <div className="text-slate-400 text-[10px]">{c.usage}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FURNITURE & LIGHTING */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                <Box className="w-4 h-4 text-indigo-400" /> Furniture Suggestions
              </h4>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                {moodBoard.furniture.map((f: string, i: number) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-400" /> Architectural Lighting Ideas
              </h4>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                {moodBoard.lighting.map((l: string, i: number) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* MATERIALS & STORAGE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" /> Material Recommendations
              </h4>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                {moodBoard.materials.map((m: string, i: number) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                <Box className="w-4 h-4 text-emerald-400" /> Space & Storage Solutions
              </h4>
              <ul className="space-y-1.5 text-slate-300 text-[11px]">
                {moodBoard.storage.map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
