import React, { useState } from 'react';
import { Design3DStyleConcept } from '../../types/aiPlanning';
import { Sparkles, Eye, Layers, Palette, Sun, Maximize2, Check, ExternalLink } from 'lucide-react';

interface Design3DViewerProps {
  concepts: Design3DStyleConcept[];
}

export const Design3DViewer: React.FC<Design3DViewerProps> = ({ concepts }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeConcept, setActiveConcept] = useState<Design3DStyleConcept | null>(null);

  const categories = ['All', 'Exterior', 'Interior Living', 'Interior Bedroom', 'Interior Kitchen'];

  const filteredConcepts = activeCategory === 'All' 
    ? concepts 
    : concepts.filter(c => c.category === activeCategory || c.styleName === activeCategory);

  return (
    <div className="space-y-6 text-xs">
      {/* HEADER & CATEGORY TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-white/10">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>3D Architectural Elevation & Interior Visualization</span>
          </h3>
          <p className="text-slate-400 text-[11px]">Explore 3D exterior facade concepts, interior room finishes, ambient lighting schemes & landscape palettes.</p>
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* CONCEPT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConcepts.map(item => (
          <div 
            key={item.id} 
            className="group rounded-3xl bg-slate-900/80 border border-white/10 overflow-hidden shadow-xl hover:border-blue-500/40 transition-all flex flex-col justify-between"
          >
            <div>
              {/* IMAGE HEADER */}
              <div className="relative h-52 overflow-hidden bg-slate-950">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90"></div>
                
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 font-bold text-[10px] border border-amber-500/30">
                    {item.styleName} Style
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-blue-950/80 backdrop-blur-md text-blue-300 font-bold text-[10px] border border-blue-500/30">
                    {item.category}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h4 className="text-sm font-bold text-white drop-shadow-md">{item.title}</h4>
                </div>
              </div>

              {/* CARD CONTENT */}
              <div className="p-5 space-y-4">
                <p className="text-slate-300 text-xs leading-relaxed">{item.description}</p>

                {/* KEY MATERIALS */}
                <div className="space-y-1.5">
                  <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block">Key Finish Materials:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(item.keyMaterials || []).map((m, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-950 border border-white/10 text-slate-300 text-[10px]">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* COLOR PALETTE SWATCHES */}
                <div className="space-y-1.5">
                  <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block">Palette Colors:</span>
                  <div className="flex items-center space-x-2">
                    {(item.colorPalette || []).map((col, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-xl border border-white/10">
                        <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: col.hex }}></span>
                        <span className="text-slate-300 font-mono text-[10px]">{col.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* BUTTON FOOTER */}
            <div className="p-4 bg-slate-950/60 border-t border-white/5 flex items-center justify-between">
              <span className="text-slate-400 text-[10px]">3D Render Preview</span>
              <button 
                onClick={() => setActiveConcept(item)}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Full Render Spec</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FULL CONCEPT MODAL */}
      {activeConcept && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setActiveConcept(null)}>
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-3xl w-full space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">{activeConcept.styleName} • {activeConcept.category}</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{activeConcept.title}</h3>
              </div>
              <button onClick={() => setActiveConcept(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800">✕</button>
            </div>

            <div className="rounded-2xl overflow-hidden h-72 bg-slate-950">
              <img src={activeConcept.imageUrl} alt={activeConcept.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-white font-bold mb-1">Architectural Concept Description</h4>
                <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-2xl border border-white/5">{activeConcept.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                  <h5 className="text-blue-400 font-bold flex items-center gap-1.5"><Sun className="w-4 h-4" /> Lighting Concept & Lumens</h5>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{activeConcept.lightingAdvice}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                  <h5 className="text-amber-400 font-bold flex items-center gap-1.5"><Palette className="w-4 h-4" /> Key Finish Materials</h5>
                  <ul className="text-slate-300 text-[11px] space-y-1 list-disc list-inside">
                    {(activeConcept.keyMaterials || []).map((mat, i) => (
                      <li key={i}>{mat}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button onClick={() => setActiveConcept(null)} className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold">
                Close Concept Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
