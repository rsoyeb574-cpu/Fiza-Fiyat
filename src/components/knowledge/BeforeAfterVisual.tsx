import React, { useState, useRef, useCallback } from 'react';
import { Columns2, SlidersHorizontal, Info } from 'lucide-react';
import { BeforeAfterPair } from '../../types/visualKnowledge';

interface BeforeAfterVisualProps {
  data: BeforeAfterPair;
}

export const BeforeAfterVisual: React.FC<BeforeAfterVisualProps> = ({ data }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let position = (x / rect.width) * 100;
    if (position < 0) position = 0;
    if (position > 100) position = 100;
    setSliderPosition(position);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <div className="space-y-4 rounded-3xl bg-[#0F172A]/80 border border-indigo-500/20 p-5 sm:p-6 backdrop-blur-xl">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <span className="text-[11px] font-bold tracking-widest uppercase text-violet-400 block">
            Visual Comparison • Do / Don't
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white">
            {data.title}
          </h3>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1.5 bg-neutral-950/80 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('slider')}
            className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'slider'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Interactive Slider</span>
          </button>
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'side-by-side'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>
        </div>
      </div>

      {/* Slider View */}
      {viewMode === 'slider' ? (
        <div className="space-y-3">
          <div
            ref={containerRef}
            className="relative w-full h-[360px] sm:h-[440px] rounded-2xl overflow-hidden border border-white/10 select-none cursor-ew-resize group bg-neutral-950"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onTouchMove={handleTouchMove}
          >
            {/* After Image (Full background) */}
            <img
              src={data.afterImage}
              alt={data.afterLabel}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-emerald-950/90 backdrop-blur-md text-emerald-300 text-xs font-bold border border-emerald-500/40 shadow-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {data.afterLabel}
            </div>

            {/* Before Image (Clipped Left Layer) */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={data.beforeImage}
                alt={data.beforeLabel}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%' }}
                loading="lazy"
              />
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-rose-950/90 backdrop-blur-md text-rose-300 text-xs font-bold border border-rose-500/40 shadow-lg flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                {data.beforeLabel}
              </div>
            </div>

            {/* Draggable Divider Line */}
            <div
              className="absolute inset-y-0 w-1 bg-white shadow-[0_0_20px_rgba(255,255,255,0.9)] z-10 flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-9 h-9 rounded-full bg-white text-neutral-950 flex items-center justify-center font-extrabold text-xs shadow-2xl border-2 border-violet-600">
                ↔
              </div>
            </div>
          </div>

          {/* Annotations beneath slider */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs space-y-1">
              <span className="font-bold text-rose-300 block">{data.beforeLabel}</span>
              <p className="text-neutral-300 leading-relaxed">{data.beforeNotes}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
              <span className="font-bold text-emerald-300 block">{data.afterLabel}</span>
              <p className="text-neutral-300 leading-relaxed">{data.afterNotes}</p>
            </div>
          </div>
        </div>
      ) : (
        /* Side by Side View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 rounded-2xl overflow-hidden bg-neutral-950 border border-rose-500/30 p-3">
            <div className="relative h-64 rounded-xl overflow-hidden">
              <img
                src={data.beforeImage}
                alt={data.beforeLabel}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-950/90 text-rose-300 text-xs font-bold border border-rose-500/40">
                ✕ {data.beforeLabel}
              </span>
            </div>
            <div className="p-2 text-xs text-neutral-300 leading-relaxed">
              {data.beforeNotes}
            </div>
          </div>

          <div className="space-y-2 rounded-2xl overflow-hidden bg-neutral-950 border border-emerald-500/30 p-3">
            <div className="relative h-64 rounded-xl overflow-hidden">
              <img
                src={data.afterImage}
                alt={data.afterLabel}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-950/90 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                ✓ {data.afterLabel}
              </span>
            </div>
            <div className="p-2 text-xs text-neutral-300 leading-relaxed">
              {data.afterNotes}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
