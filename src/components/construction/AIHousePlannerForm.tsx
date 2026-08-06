import React, { useState } from 'react';
import { 
  Building2, 
  Compass, 
  MapPin, 
  IndianRupee, 
  Layers, 
  Bed, 
  Bath, 
  Sparkles, 
  ChevronRight, 
  ShieldCheck, 
  SlidersHorizontal,
  Utensils,
  Maximize2,
  Car,
  Trees,
  Sun,
  Shield,
  Zap
} from 'lucide-react';
import { AIHousePlannerInput, QualityLevel, KitchenType, StairType, RoadDirection } from '../../types/aiPlanning';

interface AIHousePlannerFormProps {
  onSubmit: (input: AIHousePlannerInput) => void;
  isLoading: boolean;
}

export const AIHousePlannerForm: React.FC<AIHousePlannerFormProps> = ({ onSubmit, isLoading }) => {
  const [plotWidthFt, setPlotWidthFt] = useState<number>(30);
  const [plotLengthFt, setPlotLengthFt] = useState<number>(40);
  const [roadDirection, setRoadDirection] = useState<RoadDirection>('North');
  const [northDirection, setNorthDirection] = useState<RoadDirection>('North');
  const [locationCity, setLocationCity] = useState<string>('Kolkata');
  const [targetBudgetINR, setTargetBudgetINR] = useState<number>(4500000);
  const [numberOfFloors, setNumberOfFloors] = useState<'Ground Floor' | 'G+1' | 'G+2' | 'G+3'>('G+1');
  const [numberOfBedrooms, setNumberOfBedrooms] = useState<number>(3);
  const [numberOfBathrooms, setNumberOfBathrooms] = useState<number>(3);
  const [kitchenType, setKitchenType] = useState<KitchenType>('Closed L-Shaped');
  const [livingRoom, setLivingRoom] = useState<boolean>(true);
  const [diningRoom, setDiningRoom] = useState<boolean>(true);
  const [parkingSpots, setParkingSpots] = useState<number>(1);
  const [hasGarden, setHasGarden] = useState<boolean>(true);
  const [hasBalcony, setHasBalcony] = useState<boolean>(true);
  const [hasTerrace, setHasTerrace] = useState<boolean>(true);
  const [hasLift, setHasLift] = useState<boolean>(false);
  const [stairType, setStairType] = useState<StairType>('Internal Dog-Legged');
  const [qualityLevel, setQualityLevel] = useState<QualityLevel>('Standard');

  const plotAreaSqFt = plotWidthFt * plotLengthFt;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      plotWidthFt,
      plotLengthFt,
      roadDirection,
      northDirection,
      locationCity,
      targetBudgetINR,
      numberOfFloors,
      numberOfBedrooms,
      numberOfBathrooms,
      kitchenType,
      livingRoom,
      diningRoom,
      parkingSpots,
      hasGarden,
      hasBalcony,
      hasTerrace,
      hasLift,
      stairType,
      qualityLevel
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-xs">
      {/* HEADER BANNER */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-500/20 shadow-2xl space-y-3">
        <div className="flex items-center space-x-2 text-blue-400 font-bold uppercase tracking-wider text-[11px]">
          <Sparkles className="w-4 h-4 animate-pulse text-amber-400" />
          <span>Professional AI Architect & Quantity Surveyor</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          AI House Planner & Engineering Consultant
        </h2>
        <p className="text-slate-300 text-xs max-w-2xl leading-relaxed">
          Specify plot geometry, orientation, floor counts, and living preferences. Our AI engine generates 2D floor plans, 3D style concepts, structural guidelines, itemized materials, and cost estimates tailored to local construction codes.
        </p>
      </div>

      {/* SECTION 1: PLOT & LOCATION */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
          <Maximize2 className="w-4 h-4 text-blue-400" />
          <span>1. Plot Dimensions & Location Geometry</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Plot Width (Feet)</label>
            <div className="flex items-center space-x-2">
              <input 
                type="number" 
                min={15} 
                max={200} 
                value={plotWidthFt} 
                onChange={e => setPlotWidthFt(Number(e.target.value))} 
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-bold"
              />
              <span className="text-slate-400 font-mono">ft</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Plot Length (Feet)</label>
            <div className="flex items-center space-x-2">
              <input 
                type="number" 
                min={15} 
                max={200} 
                value={plotLengthFt} 
                onChange={e => setPlotLengthFt(Number(e.target.value))} 
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-bold"
              />
              <span className="text-slate-400 font-mono">ft</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Road Direction</label>
            <select 
              value={roadDirection} 
              onChange={e => setRoadDirection(e.target.value as RoadDirection)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-medium"
            >
              {['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'].map(d => (
                <option key={d} value={d}>{d} Road Facing</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">City Location</label>
            <select 
              value={locationCity} 
              onChange={e => setLocationCity(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-medium"
            >
              {['Kolkata', 'Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Ahmedabad', 'Jaipur'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-500/20 flex items-center justify-between">
          <span className="text-slate-300">Total Calculated Plot Area:</span>
          <span className="text-blue-400 font-black text-sm">{plotAreaSqFt.toLocaleString()} Sq.Ft ({Math.round(plotAreaSqFt / 435.6)} Katha / {Math.round(plotAreaSqFt / 10.764)} Sq.M)</span>
        </div>
      </div>

      {/* SECTION 2: FLOORS & BUDGET */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
          <Building2 className="w-4 h-4 text-emerald-400" />
          <span>2. Floors, Budget & Construction Quality</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Number of Floors</label>
            <select 
              value={numberOfFloors} 
              onChange={e => setNumberOfFloors(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-medium"
            >
              <option value="Ground Floor">Ground Floor Only (G)</option>
              <option value="G+1">Ground + 1 Floor (G+1)</option>
              <option value="G+2">Ground + 2 Floors (G+2)</option>
              <option value="G+3">Ground + 3 Floors (G+3)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Construction Quality Level</label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['Budget', 'Standard', 'Premium', 'Luxury'] as QualityLevel[]).map(q => (
                <button
                  type="button"
                  key={q}
                  onClick={() => setQualityLevel(q)}
                  className={`py-2 px-2 rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${
                    qualityLevel === q 
                      ? 'bg-blue-600 border-blue-400 text-white shadow-md' 
                      : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Target Budget (INR)</label>
            <div className="flex items-center space-x-2">
              <span className="text-emerald-400 font-bold text-sm">₹</span>
              <input 
                type="number" 
                step={100000}
                value={targetBudgetINR} 
                onChange={e => setTargetBudgetINR(Number(e.target.value))} 
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-bold"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">₹{(targetBudgetINR / 100000).toFixed(1)} Lakhs</p>
          </div>
        </div>
      </div>

      {/* SECTION 3: ROOMS & AMENITIES */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
          <Bed className="w-4 h-4 text-purple-400" />
          <span>3. Room Requirements & Interior Amenities</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Bedrooms Count</label>
            <div className="flex items-center space-x-3 bg-slate-950 p-2 rounded-xl border border-white/10">
              <button type="button" onClick={() => setNumberOfBedrooms(Math.max(1, numberOfBedrooms - 1))} className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold cursor-pointer">-</button>
              <span className="flex-1 text-center text-white font-bold text-sm">{numberOfBedrooms} Bedrooms</span>
              <button type="button" onClick={() => setNumberOfBedrooms(Math.min(8, numberOfBedrooms + 1))} className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold cursor-pointer">+</button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Bathrooms Count</label>
            <div className="flex items-center space-x-3 bg-slate-950 p-2 rounded-xl border border-white/10">
              <button type="button" onClick={() => setNumberOfBathrooms(Math.max(1, numberOfBathrooms - 1))} className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold cursor-pointer">-</button>
              <span className="flex-1 text-center text-white font-bold text-sm">{numberOfBathrooms} Bathrooms</span>
              <button type="button" onClick={() => setNumberOfBathrooms(Math.min(8, numberOfBathrooms + 1))} className="w-7 h-7 rounded-lg bg-slate-800 text-white font-bold cursor-pointer">+</button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Kitchen Layout Type</label>
            <select 
              value={kitchenType} 
              onChange={e => setKitchenType(e.target.value as KitchenType)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-medium"
            >
              <option value="Open American">Open American with Island</option>
              <option value="Closed L-Shaped">Closed L-Shaped Counter</option>
              <option value="Parallel Galley">Parallel Galley Kitchen</option>
              <option value="U-Shaped Island">U-Shaped Kitchen</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Staircase Design</label>
            <select 
              value={stairType} 
              onChange={e => setStairType(e.target.value as StairType)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-medium"
            >
              <option value="Internal Dog-Legged">Internal Dog-Legged RCC</option>
              <option value="External Cantilever">External Cantilevered</option>
              <option value="Helical Spiral">Helical Spiral Stairs</option>
              <option value="Straight Flight">Straight Single Flight</option>
            </select>
          </div>
        </div>

        {/* TOGGLE BADGES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <label className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${hasGarden ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-slate-950 border-white/10 text-slate-400'}`}>
            <span className="font-semibold flex items-center gap-1.5"><Trees className="w-3.5 h-3.5" /> Garden Space</span>
            <input type="checkbox" checked={hasGarden} onChange={e => setHasGarden(e.target.checked)} className="rounded" />
          </label>

          <label className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${hasBalcony ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300' : 'bg-slate-950 border-white/10 text-slate-400'}`}>
            <span className="font-semibold flex items-center gap-1.5"><Sun className="w-3.5 h-3.5" /> Balconies</span>
            <input type="checkbox" checked={hasBalcony} onChange={e => setHasBalcony(e.target.checked)} className="rounded" />
          </label>

          <label className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${hasTerrace ? 'bg-purple-950/40 border-purple-500/40 text-purple-300' : 'bg-slate-950 border-white/10 text-slate-400'}`}>
            <span className="font-semibold flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Open Terrace</span>
            <input type="checkbox" checked={hasTerrace} onChange={e => setHasTerrace(e.target.checked)} className="rounded" />
          </label>

          <label className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${hasLift ? 'bg-amber-950/40 border-amber-500/40 text-amber-300' : 'bg-slate-950 border-white/10 text-slate-400'}`}>
            <span className="font-semibold flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Elevator / Lift</span>
            <input type="checkbox" checked={hasLift} onChange={e => setHasLift(e.target.checked)} className="rounded" />
          </label>
        </div>
      </div>

      {/* CTA BUTTON */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing Architectural Calculation...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Generate Complete AI Architectural & Cost Plan</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
