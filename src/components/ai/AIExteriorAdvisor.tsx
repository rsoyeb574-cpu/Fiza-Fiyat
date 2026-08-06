import React, { useState } from 'react';
import { Building2, Sparkles, Sun, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AIExteriorAdvisor: React.FC = () => {
  const [selectedStyle, setSelectedStyle] = useState<'Modern' | 'Luxury' | 'Minimal' | 'Traditional' | 'Contemporary' | 'Industrial' | 'Scandinavian' | 'Mediterranean'>('Modern');

  const exteriorConcepts = {
    Modern: {
      tagline: 'Crisp cantilevers, floor-to-ceiling thermal glass & dark slate accents',
      elevation: 'White silicone-coated cantilever slabs projecting over dark graphite stone cladding.',
      materials: ['Ultra-smooth Weathercoat White Paint', 'Graphite Slate Tiles', 'Slimline Thermal-Break Aluminum Frames'],
      shading: 'Vertical aluminum composite wood-grained louvers over upper floor bedroom windows.',
      lighting: 'Recessed warm 3000K LED strip lighting under cantilever soffits & up-down wall sconces.'
    },
    Luxury: {
      tagline: 'Double-height entrance portal, imported marble cladding & golden brass reveals',
      elevation: 'Grand travertine marble entrance arch with motorized double teakwood door.',
      materials: ['Italian Beige Travertine Slabs', 'Champagne Anodized Metal Paneling', 'Double Glazed Reflexive Glass'],
      shading: 'Motorized exterior drop awnings with wind sensors.',
      lighting: 'Custom architectural landscape spotlights illuminating palm trees & water fountain.'
    },
    Minimal: {
      tagline: 'Seamless plaster geometry, hidden gutter channels & monolithic purity',
      elevation: 'Pure off-white micro-cement stucco exterior with flush frameless window glazing.',
      materials: ['White Micro-Cement Stucco', 'Concealed Rainwater Gutters', 'Frosted Architectural Glass'],
      shading: 'Recessed interior motor blinds behind flush window pockets.',
      lighting: 'Subtle perimeter ground LED wash lights.'
    },
    Traditional: {
      tagline: 'Classic terracotta tiled roofs, carved stone columns & arched verandas',
      elevation: 'Slanted pitched roof with red clay roof tiles, exposed brick columns, and ornate railings.',
      materials: ['Terracotta Roof Tiles', 'Exposed Red Clay Bricks', 'Teak Wood Window Frames'],
      shading: 'Deep overhanging roof eaves protecting brick walls from heavy rain.',
      lighting: 'Warm lantern-style wall lights along open veranda arches.'
    },
    Contemporary: {
      tagline: 'Asymmetric volume play, green vertical gardens & glass balconies',
      elevation: 'Dynamic interlocked cube volumes with integrated living plant green walls.',
      materials: ['Fiber Cement Board Paneling', 'Toughened Glass Balustrades', 'Corten Steel Panels'],
      shading: 'Perforated Corten steel solar screens creating dramatic shadow patterns.',
      lighting: 'Programmable RGBW smart architectural facade lighting.'
    },
    Industrial: {
      tagline: 'Raw concrete formwork, exposed steel beams & black grid fenestration',
      elevation: 'Board-formed exposed concrete finish with matte black steel beam framing.',
      materials: ['Board-Formed Exposed Concrete', 'Matte Black Steel Beams', 'Clear Industrial Grid Glass'],
      shading: 'Exposed steel awning canopies over entryway doors.',
      lighting: 'Industrial vintage filament wall lanterns & spotlight tracks.'
    },
    Scandinavian: {
      tagline: 'Warm pine wood siding, steep gabled roof & flood of natural light',
      elevation: 'A-frame steep gabled roof line clad in light Scandinavian pine weatherboards.',
      materials: ['Pine Wood Weatherboarding', 'Charcoal Standing-Seam Zinc Roof', 'Triple Pane Argon Windows'],
      shading: 'Deep roof gables providing solar shading during summer months.',
      lighting: 'Warm cozy window perimeter lighting.'
    },
    Mediterranean: {
      tagline: 'Sun-washed terracotta stucco, wrought iron balconies & arched arcades',
      elevation: 'Warm Spanish tile roof with textured ochre stucco walls and ornate wrought iron grills.',
      materials: ['Textured Ochre Stucco', 'Wrought Iron Railings', 'Spanish Barrel Roof Tiles'],
      shading: 'Archway arcades providing cool shaded outdoor walkways.',
      lighting: 'Hand-forged iron sconces along courtyard walls.'
    }
  };

  const current = exteriorConcepts[selectedStyle];

  return (
    <div className="space-y-6 text-xs">
      <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <span>AI Exterior Facade Designer & Elevation Assistant</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Generates 8 architectural exterior styles: Modern, Luxury, Minimal, Traditional, Contemporary, Industrial, Scandinavian & Mediterranean.
          </p>
        </div>
      </div>

      {/* STYLE SELECTION PILLS */}
      <div className="flex flex-wrap items-center gap-2">
        {(['Modern', 'Luxury', 'Minimal', 'Traditional', 'Contemporary', 'Industrial', 'Scandinavian', 'Mediterranean'] as const).map(st => (
          <button
            key={st}
            onClick={() => setSelectedStyle(st)}
            className={`px-4 py-2.5 rounded-2xl font-bold transition-all cursor-pointer ${
              selectedStyle === st ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30' : 'bg-slate-900 text-slate-400 hover:text-white border border-white/10'
            }`}
          >
            {st} Style
          </button>
        ))}
      </div>

      {/* CONCEPT DISPLAY */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-black text-white">{selectedStyle} Exterior Elevation Concept</h3>
            <p className="text-cyan-400 font-medium text-xs mt-0.5">{current.tagline}</p>
          </div>
          <span className="px-3.5 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold">
            Facade Specs
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
            <h4 className="font-bold text-white text-xs flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" /> Elevation Geometry & Composition
            </h4>
            <p className="text-slate-300 text-xs leading-relaxed">{current.elevation}</p>

            <div className="pt-3 border-t border-white/10 space-y-2">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Recommended Facade Materials</span>
              <div className="space-y-1">
                {current.materials.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-4">
            <div>
              <h4 className="font-bold text-white text-xs flex items-center gap-2 mb-1">
                <Sun className="w-4 h-4 text-amber-400" /> Solar Shading & Fenestration
              </h4>
              <p className="text-slate-300 text-xs">{current.shading}</p>
            </div>

            <div className="pt-3 border-t border-white/10">
              <h4 className="font-bold text-white text-xs flex items-center gap-2 mb-1">
                <Layers className="w-4 h-4 text-indigo-400" /> Night Facade Lighting Scheme
              </h4>
              <p className="text-slate-300 text-xs">{current.lighting}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
