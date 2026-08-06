import React, { useState } from 'react';
import { Package, ArrowLeftRight, Check, X, ShieldCheck, DollarSign } from 'lucide-react';

export const AIMaterialAdvisor: React.FC = () => {
  const [activeComparison, setActiveComparison] = useState<'aac_vs_brick' | 'ppc_vs_opc' | 'fe500_vs_fe550' | 'vitrified_vs_marble'>('aac_vs_brick');

  const comparisons = {
    aac_vs_brick: {
      title: '6-inch AAC Blocks vs Traditional Red Clay Bricks',
      matA: {
        name: 'AAC Lightweight Blocks (6 inch)',
        costRange: '₹55 - ₹68 / block',
        durability: '50+ Years (High Thermal Insulation)',
        maintenance: 'Minimal (Low crack probability)',
        applications: 'High-rise apartment partitions & interior walls',
        pros: ['900 kg/m³ density reduces foundation dead load by 20%', '3x higher thermal resistance saves AC electricity', 'Faster wall masonry with thin-bed adhesive'],
        cons: ['Requires specialized thin-bed polymer mortar', 'Higher initial per-unit cost than raw clay bricks']
      },
      matB: {
        name: 'First-Class Red Clay Bricks',
        costRange: '₹9 - ₹12 / brick',
        durability: '30 - 40 Years (Vulnerable to efflorescence)',
        maintenance: 'Moderate (Prone to saltpeter dampness)',
        applications: 'Boundary walls & load-bearing masonry',
        pros: ['Locally available everywhere', 'Good sound dampening mass'],
        cons: ['Adds heavy 1900 kg/m³ dead load to structural beams', 'Requires thick cement mortar jointing', 'Uneven sizes increase plaster thickness requirement']
      }
    },
    ppc_vs_opc: {
      title: 'Portland Pozzolana Cement (PPC) vs Ordinary Portland Cement (OPC 53)',
      matA: {
        name: 'PPC Fly Ash Blended Cement',
        costRange: '₹360 - ₹395 / bag (50kg)',
        durability: 'Superior (Corrosion & Sulfate Resistant)',
        maintenance: 'Low heat of hydration prevents micro-cracks',
        applications: 'Residential slab casting, brickwork masonry & plastering',
        pros: ['Finer particles fill micro-pores for watertight concrete', 'Reduces risk of thermal shrinkage cracks during curing', 'Saves ₹20-30 per bag compared to OPC 53'],
        cons: ['Initial setting time slightly slower (starts after 30 mins)']
      },
      matB: {
        name: 'OPC 53 Grade Heavy Duty Cement',
        costRange: '₹390 - ₹430 / bag (50kg)',
        durability: 'High Compressive Strength (53 MPa in 28 days)',
        maintenance: 'Requires intensive 14-day water curing',
        applications: 'Bridge piers, heavy pre-cast beams & commercial foundations',
        pros: ['Rapid early strength gain for fast shuttering removal'],
        cons: ['Higher heat of hydration leads to surface micro-cracking if curing is missed', 'Vulnerable to chemical sulfate soil attack']
      }
    },
    fe500_vs_fe550: {
      title: 'Fe500D TMT Rebar Steel vs Fe550 Grade Rebar Steel',
      matA: {
        name: 'Fe500D Seismic Grade TMT Steel',
        costRange: '₹58,000 - ₹64,000 / Metric Ton',
        durability: 'High Ductility (>16% elongation)',
        maintenance: 'Zero maintenance when embedded in dense concrete',
        applications: 'Seismic Zone III, IV & V earthquake-resistant residential columns',
        pros: ['Superior energy absorption under earthquake tremors', 'Easy to bend at 180 degrees without micro-fracturing'],
        cons: ['Slightly higher price than standard Fe500']
      },
      matB: {
        name: 'Fe550 High Strength Rebar Steel',
        costRange: '₹56,000 - ₹61,000 / Metric Ton',
        durability: 'High Yield Strength (550 N/mm²)',
        maintenance: 'Zero maintenance',
        applications: 'Heavy bridges, industrial warehouses & tall towers',
        pros: ['Reduces total steel tonnage required by ~8%'],
        cons: ['Lower elongation flexibility under sudden seismic shock loads']
      }
    },
    vitrified_vs_marble: {
      title: 'Glazed Vitrified Slab Tiles (1200x2400) vs Italian Marble Slabs',
      matA: {
        name: 'GVT Glazed Vitrified Tiles',
        costRange: '₹75 - ₹160 / sq.ft',
        durability: 'Scratch-proof, Stain-proof & Zero Porosity',
        maintenance: 'Zero polishing required. Easy mop cleaning',
        applications: 'Living rooms, kitchens, bedrooms & high-traffic corridors',
        pros: ['Zero water absorption (<0.05%)', 'Consistent pattern batch matching', 'Ready to walk on within 24 hours of tile laying'],
        cons: ['Tile joint grid visible if grout color is not matched']
      },
      matB: {
        name: 'Italian Marble Slabs (Bottechino / Statuario)',
        costRange: '₹350 - ₹1,200 / sq.ft',
        durability: 'Lifetime Natural Stone Asset',
        maintenance: 'Requires epoxy net backing & periodic diamond polishing',
        applications: 'Luxury living rooms & executive suites',
        pros: ['Unique natural vein beauty', 'Seamless mirror polish finish'],
        cons: ['Porous surface stains easily from lemon/wine spillages', 'High installation labor cost (₹120/sq.ft laying & polishing)']
      }
    }
  };

  const comp = comparisons[activeComparison];

  return (
    <div className="space-y-6 text-xs">
      <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <span>AI Construction Material Advisor & Head-to-Head Comparison</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Compare material features, durability, maintenance, applications, estimated cost ranges, pros & cons.
          </p>
        </div>
      </div>

      {/* SELECT COMPARISON PAIR */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveComparison('aac_vs_brick')}
          className={`px-4 py-2.5 rounded-2xl font-bold cursor-pointer transition-all ${
            activeComparison === 'aac_vs_brick' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 border border-white/10'
          }`}
        >
          AAC Blocks vs Red Bricks
        </button>
        <button
          onClick={() => setActiveComparison('ppc_vs_opc')}
          className={`px-4 py-2.5 rounded-2xl font-bold cursor-pointer transition-all ${
            activeComparison === 'ppc_vs_opc' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 border border-white/10'
          }`}
        >
          PPC Cement vs OPC 53
        </button>
        <button
          onClick={() => setActiveComparison('fe500_vs_fe550')}
          className={`px-4 py-2.5 rounded-2xl font-bold cursor-pointer transition-all ${
            activeComparison === 'fe500_vs_fe550' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 border border-white/10'
          }`}
        >
          Fe500D Steel vs Fe550
        </button>
        <button
          onClick={() => setActiveComparison('vitrified_vs_marble')}
          className={`px-4 py-2.5 rounded-2xl font-bold cursor-pointer transition-all ${
            activeComparison === 'vitrified_vs_marble' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 border border-white/10'
          }`}
        >
          GVT Tiles vs Italian Marble
        </button>
      </div>

      {/* COMPARISON MATRIX */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-6">
        <h3 className="text-base font-black text-white flex items-center gap-2 border-b border-white/10 pb-3">
          <ArrowLeftRight className="w-5 h-5 text-amber-400" />
          <span>{comp.title}</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* MATERIAL A */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-4">
            <div className="flex justify-between items-start border-b border-white/10 pb-3">
              <div>
                <h4 className="font-black text-white text-sm">{comp.matA.name}</h4>
                <div className="text-amber-400 font-mono font-bold mt-0.5">{comp.matA.costRange}</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 font-bold text-[10px]">
                AI Recommended
              </span>
            </div>

            <div className="space-y-2 text-slate-300">
              <div><strong className="text-slate-400">Durability:</strong> {comp.matA.durability}</div>
              <div><strong className="text-slate-400">Maintenance:</strong> {comp.matA.maintenance}</div>
              <div><strong className="text-slate-400">Best Applications:</strong> {comp.matA.applications}</div>
            </div>

            <div className="pt-3 border-t border-white/10 space-y-1">
              <span className="text-emerald-400 font-bold uppercase text-[10px]">Pros:</span>
              {comp.matA.pros.map((p, i) => (
                <div key={i} className="flex items-start gap-1.5 text-slate-200">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <span className="text-rose-400 font-bold uppercase text-[10px]">Cons:</span>
              {comp.matA.cons.map((c, i) => (
                <div key={i} className="flex items-start gap-1.5 text-slate-400">
                  <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MATERIAL B */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-4">
            <div className="flex justify-between items-start border-b border-white/10 pb-3">
              <div>
                <h4 className="font-black text-white text-sm">{comp.matB.name}</h4>
                <div className="text-slate-300 font-mono font-bold mt-0.5">{comp.matB.costRange}</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-900 text-slate-400 font-bold text-[10px]">
                Standard Alternative
              </span>
            </div>

            <div className="space-y-2 text-slate-300">
              <div><strong className="text-slate-400">Durability:</strong> {comp.matB.durability}</div>
              <div><strong className="text-slate-400">Maintenance:</strong> {comp.matB.maintenance}</div>
              <div><strong className="text-slate-400">Best Applications:</strong> {comp.matB.applications}</div>
            </div>

            <div className="pt-3 border-t border-white/10 space-y-1">
              <span className="text-emerald-400 font-bold uppercase text-[10px]">Pros:</span>
              {comp.matB.pros.map((p, i) => (
                <div key={i} className="flex items-start gap-1.5 text-slate-200">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <span className="text-rose-400 font-bold uppercase text-[10px]">Cons:</span>
              {comp.matB.cons.map((c, i) => (
                <div key={i} className="flex items-start gap-1.5 text-slate-400">
                  <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
