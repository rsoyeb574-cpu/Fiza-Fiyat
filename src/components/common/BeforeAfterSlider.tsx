import React, { useState, useRef, useCallback } from 'react';

interface BeforeAfterProps {
  beforeImage: string;
  afterImage: string;
  labelBefore?: string;
  labelAfter?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterProps> = ({
  beforeImage,
  afterImage,
  labelBefore = 'Before / CAD Blueprint',
  labelAfter = 'After / Finished 3D Render'
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
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
    <div 
      ref={containerRef}
      className="relative w-full h-[380px] sm:h-[480px] rounded-2xl overflow-hidden border border-white/10 select-none cursor-ew-resize group"
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={() => setIsDragging(true)}
      onTouchEnd={() => setIsDragging(false)}
      onTouchMove={handleTouchMove}
    >
      {/* After Image (Background full) */}
      <img 
        src={afterImage} 
        alt={labelAfter}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md text-blue-400 text-xs font-semibold border border-blue-500/30">
        {labelAfter}
      </div>

      {/* Before Image (Clipped overlay) */}
      <div 
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src={beforeImage} 
          alt={labelBefore}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%' }}
        />
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md text-amber-400 text-xs font-semibold border border-amber-500/30">
          {labelBefore}
        </div>
      </div>

      {/* Slider Divider Bar */}
      <div 
        className="absolute inset-y-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10 flex items-center justify-center pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="w-8 h-8 rounded-full bg-white text-neutral-950 flex items-center justify-center font-bold text-xs shadow-2xl border-2 border-blue-600">
          ↔
        </div>
      </div>
    </div>
  );
};
