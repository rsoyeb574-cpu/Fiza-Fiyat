import React, { useState } from 'react';
import { FloorPlanData, RoomLayout2D } from '../../types/aiPlanning';
import { Layers, Maximize2, ZoomIn, ZoomOut, Compass, Info, CheckCircle2, Download } from 'lucide-react';

interface FloorPlan2DViewerProps {
  floorPlans: FloorPlanData[];
  plotWidthFt: number;
  plotLengthFt: number;
}

export const FloorPlan2DViewer: React.FC<FloorPlan2DViewerProps> = ({ floorPlans, plotWidthFt, plotLengthFt }) => {
  const [selectedFloorIndex, setSelectedFloorIndex] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedRoom, setSelectedRoom] = useState<RoomLayout2D | null>(null);

  const currentFloor = floorPlans[selectedFloorIndex] || floorPlans[0];

  return (
    <div className="space-y-6 text-xs">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-white/10">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Interactive 2D Blueprint & Furniture Layout</span>
          </h3>
          <p className="text-slate-400 text-[11px]">Precision architectural layout with room dimensions, door/window positions & furniture zoning.</p>
        </div>

        {/* FLOOR SELECTOR TABS */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(floorPlans || []).map((plan, idx) => (
            <button
              key={plan.floorName}
              onClick={() => {
                setSelectedFloorIndex(idx);
                setSelectedRoom(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedFloorIndex === idx 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {plan.floorName}
            </button>
          ))}
        </div>
      </div>

      {/* SVG CANVAS CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-slate-950 rounded-3xl border border-white/10 p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[460px]">
          {/* FLOATING ZOOM CONTROLS */}
          <div className="absolute top-4 right-4 z-10 flex items-center space-x-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
            <button onClick={() => setZoomLevel(Math.max(0.8, zoomLevel - 0.2))} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono text-slate-300 font-bold px-2">{Math.round(zoomLevel * 100)}%</span>
            <button onClick={() => setZoomLevel(Math.min(1.8, zoomLevel + 0.2))} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* COMPASS ROSSETTE */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-cyan-400 font-bold text-[10px]">
            <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '20s' }} />
            <span>N ↑ (North Facing)</span>
          </div>

          {/* BLUEPRINT SVG GRAPHIC */}
          <div 
            className="w-full max-w-2xl transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-auto drop-shadow-2xl select-none">
              {/* PLOT OUTER WALL BOUNDARY */}
              <rect x="2" y="2" width="96" height="96" fill="none" stroke="#3b82f6" strokeWidth="1.2" strokeDasharray="2,2" rx="2" />

              {/* GRID BLUEPRINT PATTERN */}
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect x="2" y="2" width="96" height="96" fill="url(#grid)" />

              {/* ROOM BOXES */}
              {(currentFloor?.rooms || []).map((room) => {
                const isSelected = selectedRoom?.id === room.id;
                return (
                  <g key={room.id} onClick={() => setSelectedRoom(room)} className="cursor-pointer group">
                    {/* Room Fill & Outer Wall */}
                    <rect
                      x={room.x}
                      y={room.y}
                      width={room.width}
                      height={room.height}
                      fill={room.colorHex}
                      fillOpacity={isSelected ? "0.9" : "0.5"}
                      stroke={isSelected ? "#38bdf8" : "#94a3b8"}
                      strokeWidth={isSelected ? "1.5" : "0.8"}
                      rx="1"
                      className="transition-all duration-200 group-hover:fill-opacity-80"
                    />

                    {/* Room Title */}
                    <text
                      x={room.x + room.width / 2}
                      y={room.y + room.height / 2 - 2}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="3.2"
                      fontWeight="bold"
                    >
                      {room.name}
                    </text>

                    {/* Room Dimension Label */}
                    <text
                      x={room.x + room.width / 2}
                      y={room.y + room.height / 2 + 3}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="2.4"
                      fontFamily="monospace"
                    >
                      {room.dimensionsFt}
                    </text>

                    {/* DOORS GRAPHIC */}
                    {(room.doors || []).map((d, idx) => {
                      let dx = room.x + (room.width * d.posPercent) / 100;
                      let dy = room.y;
                      if (d.wall === 'bottom') dy = room.y + room.height;
                      if (d.wall === 'left') { dx = room.x; dy = room.y + (room.height * d.posPercent) / 100; }
                      if (d.wall === 'right') { dx = room.x + room.width; dy = room.y + (room.height * d.posPercent) / 100; }

                      return (
                        <circle key={idx} cx={dx} cy={dy} r="1.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="0.4" />
                      );
                    })}

                    {/* WINDOWS GRAPHIC */}
                    {(room.windows || []).map((w, idx) => {
                      let wx = room.x + (room.width * w.posPercent) / 100;
                      let wy = room.y;
                      if (w.wall === 'bottom') wy = room.y + room.height;
                      if (w.wall === 'left') { wx = room.x; wy = room.y + (room.height * w.posPercent) / 100; }
                      if (w.wall === 'right') { wx = room.x + room.width; wy = room.y + (room.height * w.posPercent) / 100; }

                      return (
                        <rect key={idx} x={wx - 2} y={wy - 1} width="4" height="2" fill="#06b6d4" rx="0.3" />
                      );
                    })}
                  </g>
                );
              })}

              {/* DIMENSION LINES */}
              <text x="50" y="99" textAnchor="middle" fill="#64748b" fontSize="2.8" fontFamily="monospace">← Frontage: {plotWidthFt} FT →</text>
              <text x="1" y="50" textAnchor="middle" fill="#64748b" fontSize="2.8" fontFamily="monospace" transform="rotate(-90, 1, 50)">← Depth: {plotLengthFt} FT →</text>
            </svg>
          </div>

          <div className="mt-4 flex items-center justify-between w-full text-[10px] text-slate-400 px-4">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Door Swing</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-cyan-500 inline-block"></span> uPVC Window Glazing</span>
            <span className="text-slate-300 font-bold">Built-up Floor Area: {currentFloor.builtUpSqFt} Sq.Ft</span>
          </div>
        </div>

        {/* SIDEBAR ROOM DETAIL INSPECTOR */}
        <div className="bg-slate-900 rounded-3xl border border-white/10 p-5 space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Info className="w-4 h-4 text-blue-400" />
            <span>Room Specification & Zoning</span>
          </h4>

          {selectedRoom ? (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-950 border border-white/10">
                <div className="text-blue-400 font-bold text-xs">{selectedRoom.name}</div>
                <div className="text-white font-mono text-sm font-bold mt-1">{selectedRoom.dimensionsFt}</div>
                <div className="text-slate-400 text-[10px] uppercase tracking-wider mt-1">Type: {selectedRoom.type}</div>
              </div>

              <div className="space-y-2 text-slate-300 text-[11px]">
                <div className="font-semibold text-white">Furniture & Fixtures:</div>
                <ul className="space-y-1 text-slate-400 list-disc list-inside">
                  {(selectedRoom.furnitureItems || []).map((f, i) => (
                    <li key={i}>{f.name}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 inline mr-1 text-emerald-400" />
                <span>Complies with NBC Light & Ventilation standards (min 1/10th floor area window opening).</span>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Layers className="w-8 h-8 mx-auto opacity-40 text-blue-400" />
              <p className="text-xs">Click any room on the 2D floor blueprint to view architectural dimensions, window specs & furniture arrangement.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
