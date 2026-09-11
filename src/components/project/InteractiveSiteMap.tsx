import React, { useState, useRef, useMemo } from 'react';
import { 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Layers, 
  Building2, 
  Eye, 
  CheckCircle2, 
  Sun, 
  Sparkles, 
  Home, 
  Info,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Project } from '../../types';
import { SiteZone, ProjectSiteMapData, SiteZoneType } from '../../types/siteMap';
import { getProjectSiteMap } from '../../utils/siteMapGenerator';

interface InteractiveSiteMapProps {
  project: Project;
  customSiteMap?: ProjectSiteMapData;
  className?: string;
}

type ViewFilterType = 'all' | 'building' | 'amenity' | 'landscape' | 'infrastructure';
type MapThemeMode = 'blueprint' | 'orthophoto' | 'heatmap';

export const InteractiveSiteMap: React.FC<InteractiveSiteMapProps> = ({
  project,
  customSiteMap,
  className = ''
}) => {
  const siteMapData: ProjectSiteMapData = useMemo(() => {
    return customSiteMap || getProjectSiteMap(project);
  }, [project, customSiteMap]);

  const [activeZoneId, setActiveZoneId] = useState<string | null>(
    siteMapData.zones?.[0]?.id || null
  );
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<ViewFilterType>('all');
  const [mapTheme, setMapTheme] = useState<MapThemeMode>('blueprint');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Active or hovered zone
  const focusedZoneId = hoveredZoneId || activeZoneId || siteMapData.zones?.[0]?.id;
  const currentZone = useMemo(() => {
    return siteMapData.zones.find(z => z.id === focusedZoneId) || siteMapData.zones[0];
  }, [siteMapData, focusedZoneId]);

  // Filtered zones
  const visibleZones = useMemo(() => {
    if (filterType === 'all') return siteMapData.zones;
    if (filterType === 'building') {
      return siteMapData.zones.filter(z => z.type === 'building' || z.type === 'residential' || z.type === 'commercial' || z.type === 'podium');
    }
    if (filterType === 'amenity') {
      return siteMapData.zones.filter(z => z.type === 'amenity' || z.type === 'cultural');
    }
    if (filterType === 'landscape') {
      return siteMapData.zones.filter(z => z.type === 'landscape');
    }
    if (filterType === 'infrastructure') {
      return siteMapData.zones.filter(z => z.type === 'infrastructure' || z.type === 'circulation');
    }
    return siteMapData.zones;
  }, [siteMapData.zones, filterType]);

  // Pan / Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Primary button only
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  };

  return (
    <div className={`rounded-3xl bg-neutral-950 border border-white/10 overflow-hidden shadow-2xl ${className}`}>
      
      {/* 1. Header Toolbar */}
      <div className="p-4 sm:p-5 bg-neutral-900/80 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[11px] font-extrabold uppercase tracking-wider border border-blue-500/30">
              Interactive Master Plan
            </span>
            <span className="text-xs text-neutral-400 hidden sm:inline">
              SVG Architectural Vector Overlay
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
            {siteMapData.siteName}
          </h3>
          {siteMapData.tagline && (
            <p className="text-xs text-neutral-400 mt-0.5">{siteMapData.tagline}</p>
          )}
        </div>

        {/* Master Plan Key Metrics Chips */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          {siteMapData.totalSiteArea && (
            <div className="px-3 py-1.5 rounded-xl bg-neutral-800/80 border border-white/10 text-neutral-300">
              <span className="text-neutral-500 block text-[10px] uppercase font-bold">Site Area</span>
              <span className="font-semibold text-white">{siteMapData.totalSiteArea}</span>
            </div>
          )}
          {siteMapData.totalBuiltArea && (
            <div className="px-3 py-1.5 rounded-xl bg-neutral-800/80 border border-white/10 text-neutral-300">
              <span className="text-neutral-500 block text-[10px] uppercase font-bold">Total GFA</span>
              <span className="font-semibold text-white">{siteMapData.totalBuiltArea}</span>
            </div>
          )}
          {siteMapData.greenRatio && (
            <div className="px-3 py-1.5 rounded-xl bg-neutral-800/80 border border-white/10 text-neutral-300 hidden md:block">
              <span className="text-neutral-500 block text-[10px] uppercase font-bold">Green Ratio</span>
              <span className="font-semibold text-emerald-400">{siteMapData.greenRatio}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Sub-Toolbar: Mode Toggles & Layer Filters */}
      <div className="px-4 py-2.5 bg-neutral-900/40 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Layer Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <Filter className="w-3.5 h-3.5 text-neutral-500 mr-1 shrink-0" />
          {[
            { id: 'all', label: `All Zones (${siteMapData.zones.length})` },
            { id: 'building', label: 'Towers & Pavilions' },
            { id: 'amenity', label: 'Amenities & Spa' },
            { id: 'landscape', label: 'Greenery & Water' },
            { id: 'infrastructure', label: 'Access & Parking' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterType(item.id as ViewFilterType)}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                filterType === item.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-neutral-800/60 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Theme Styles & Canvas Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center p-0.5 rounded-lg bg-neutral-800/80 border border-white/10">
            <button
              onClick={() => setMapTheme('blueprint')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                mapTheme === 'blueprint' ? 'bg-neutral-700 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
              }`}
              title="Architectural Vector Blueprint"
            >
              Blueprint CAD
            </button>
            <button
              onClick={() => setMapTheme('orthophoto')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                mapTheme === 'orthophoto' ? 'bg-neutral-700 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
              }`}
              title="Aerial Orthophoto Base"
            >
              Aerial Overlay
            </button>
            <button
              onClick={() => setMapTheme('heatmap')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                mapTheme === 'heatmap' ? 'bg-neutral-700 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
              }`}
              title="Daylight Solar Heatmap"
            >
              Solar Heatmap
            </button>
          </div>

          <div className="flex items-center gap-1 bg-neutral-800/80 border border-white/10 rounded-lg p-0.5">
            <button
              onClick={handleZoomIn}
              className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-700 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-700 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetView}
              className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-700 cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Workspace: Interactive Map Stage (Left) & Zone Inspector / Associated Renderings (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[560px]">
        
        {/* Interactive SVG Stage (8 Columns on desktop) */}
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`lg:col-span-7 xl:col-span-8 relative bg-[#0a0d14] overflow-hidden select-none border-b lg:border-b-0 lg:border-r border-white/10 min-h-[420px] lg:min-h-[580px] flex items-center justify-center ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {/* Subtle Orthophoto or Blueprint Background */}
          {mapTheme === 'orthophoto' && (
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity pointer-events-none transition-opacity duration-500"
              style={{
                backgroundImage: `url(${project.coverImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'})`
              }}
            />
          )}

          {/* SVG Map Canvas */}
          <div 
            className="w-full h-full flex items-center justify-center transition-transform duration-75"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
              transformOrigin: 'center center'
            }}
          >
            <svg
              viewBox={siteMapData.viewBox || "0 0 1000 700"}
              className="w-full h-auto max-h-[620px] filter drop-shadow-2xl"
              style={{ overflow: 'visible' }}
            >
              <defs>
                {/* Architectural Grid Pattern */}
                <pattern id="cad-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                  <circle cx="0" cy="0" r="1.5" fill="rgba(255, 255, 255, 0.15)" />
                </pattern>

                {/* Diagonal Hatch for Parking/Infrastructure */}
                <pattern id="hatch-infrastructure" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="2" />
                </pattern>

                {/* Dot Grid for Landscape */}
                <pattern id="dot-landscape" width="16" height="16" patternUnits="userSpaceOnUse">
                  <circle cx="8" cy="8" r="1.5" fill="rgba(16, 185, 129, 0.3)" />
                </pattern>

                {/* Glow Filter for Active / Hovered Zones */}
                <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Grid */}
              <rect width="1000" height="700" fill="url(#cad-grid)" />

              {/* Site Property Boundary Line */}
              <rect 
                x="60" 
                y="60" 
                width="880" 
                height="580" 
                rx="24" 
                fill="none" 
                stroke="rgba(255, 255, 255, 0.18)" 
                strokeWidth="1.5" 
                strokeDasharray="8 6" 
              />
              <text x="75" y="85" fill="rgba(255, 255, 255, 0.35)" fontSize="10" fontWeight="bold" letterSpacing="1">
                PROPERTY SETBACK BOUNDARY (R.O.W. LIMIT)
              </text>

              {/* Organic Contour / Topography Curves */}
              <path 
                d="M 60 220 Q 300 180 500 240 T 940 180" 
                fill="none" 
                stroke="rgba(255, 255, 255, 0.08)" 
                strokeWidth="1.2" 
                strokeDasharray="4 4" 
              />
              <path 
                d="M 60 380 Q 280 340 520 410 T 940 360" 
                fill="none" 
                stroke="rgba(255, 255, 255, 0.08)" 
                strokeWidth="1.2" 
                strokeDasharray="4 4" 
              />
              <path 
                d="M 60 540 Q 320 500 550 560 T 940 510" 
                fill="none" 
                stroke="rgba(255, 255, 255, 0.08)" 
                strokeWidth="1.2" 
                strokeDasharray="4 4" 
              />

              {/* Circulation & Access Roads */}
              <path 
                d="M 80 345 L 210 345 Q 230 345 230 365 L 230 630" 
                fill="none" 
                stroke="rgba(255, 255, 255, 0.15)" 
                strokeWidth="16" 
                strokeLinecap="round" 
              />
              <path 
                d="M 80 345 L 210 345 Q 230 345 230 365 L 230 630" 
                fill="none" 
                stroke="rgba(255, 255, 255, 0.4)" 
                strokeWidth="1" 
                strokeDasharray="6 6" 
              />

              {/* Heatmap Overlay Simulation (if active) */}
              {mapTheme === 'heatmap' && (
                <g opacity="0.45" className="transition-opacity duration-500">
                  <circle cx="500" cy="300" r="180" fill="url(#heatGradient1)" />
                  <defs>
                    <radialGradient id="heatGradient1" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.5" />
                      <stop offset="80%" stopColor="#3b82f6" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                </g>
              )}

              {/* SVG Zones: Polygons & Accents */}
              {visibleZones.map((zone) => {
                const isSelected = activeZoneId === zone.id;
                const isHovered = hoveredZoneId === zone.id;
                const isHighlighted = isSelected || isHovered;

                return (
                  <g 
                    key={zone.id}
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredZoneId(zone.id)}
                    onMouseLeave={() => setHoveredZoneId(null)}
                    onClick={() => setActiveZoneId(zone.id)}
                  >
                    {/* Footprint polygon */}
                    <polygon
                      points={zone.polygonPoints}
                      fill={
                        isHighlighted 
                          ? zone.accentColor 
                          : (zone.type === 'landscape' ? 'url(#dot-landscape)' : zone.accentColor)
                      }
                      fillOpacity={isHighlighted ? 0.45 : (zone.fillOpacity || 0.2)}
                      stroke={isHighlighted ? (zone.strokeColor || '#ffffff') : (zone.strokeColor || zone.accentColor)}
                      strokeWidth={isHighlighted ? 3 : 1.8}
                      strokeDasharray={isHighlighted ? 'none' : 'none'}
                      filter={isHighlighted ? 'url(#glow-filter)' : undefined}
                      className="transition-all duration-300"
                    />

                    {/* Secondary structural hatching for emphasis */}
                    {zone.type === 'infrastructure' && (
                      <polygon
                        points={zone.polygonPoints}
                        fill="url(#hatch-infrastructure)"
                        opacity={0.6}
                        pointerEvents="none"
                      />
                    )}

                    {/* Zone Anchor Center Pin / Badge */}
                    <g 
                      transform={`translate(${zone.center.x}, ${zone.center.y})`}
                      className="pointer-events-none"
                    >
                      {/* Pulse circle on hover */}
                      {isHighlighted && (
                        <circle
                          r="22"
                          fill={zone.accentColor}
                          opacity="0.25"
                          className="animate-ping"
                        />
                      )}

                      {/* Main Badge Base */}
                      <circle
                        r="14"
                        fill={isHighlighted ? zone.accentColor : '#171717'}
                        stroke={isHighlighted ? '#ffffff' : zone.accentColor}
                        strokeWidth="2"
                        className="transition-all duration-300 shadow-md"
                      />

                      {/* Zone Code Label */}
                      <text
                        textAnchor="middle"
                        dy="4.5"
                        fill="#ffffff"
                        fontSize="10"
                        fontWeight="800"
                        fontFamily="monospace"
                      >
                        {zone.code}
                      </text>

                      {/* Zone Name Label Banner */}
                      <g transform="translate(0, 24)">
                        <rect
                          x={-zone.name.length * 3.6}
                          y="-9"
                          width={zone.name.length * 7.2}
                          height="18"
                          rx="9"
                          fill="rgba(10, 13, 20, 0.85)"
                          stroke={isHighlighted ? zone.accentColor : 'rgba(255, 255, 255, 0.2)'}
                          strokeWidth="1"
                        />
                        <text
                          textAnchor="middle"
                          dy="3.5"
                          fill={isHighlighted ? '#ffffff' : '#cbd5e1'}
                          fontSize="9.5"
                          fontWeight="700"
                        >
                          {zone.name}
                        </text>
                      </g>
                    </g>
                  </g>
                );
              })}

              {/* Professional Architectural North Arrow */}
              <g 
                transform={`translate(900, 110) rotate(${siteMapData.northAngle || 0})`}
                className="pointer-events-none"
              >
                <circle r="22" fill="rgba(23, 23, 23, 0.7)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" />
                <path d="M 0 -18 L 6 4 L 0 0 L -6 4 Z" fill="#ef4444" />
                <path d="M 0 18 L 6 -4 L 0 0 L -6 -4 Z" fill="#ffffff" opacity="0.3" />
                <text x="0" y="-24" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">N</text>
              </g>

              {/* CAD Scale Bar */}
              <g transform="translate(740, 640)" className="pointer-events-none text-xs">
                <rect x="0" y="0" width="160" height="6" fill="rgba(255, 255, 255, 0.1)" rx="2" />
                <rect x="0" y="0" width="80" height="6" fill="#3b82f6" rx="2" />
                <text x="0" y="-6" fill="rgba(255, 255, 255, 0.5)" fontSize="9">0m</text>
                <text x="80" y="-6" fill="rgba(255, 255, 255, 0.5)" fontSize="9">{(siteMapData.scaleBarMeters || 50) / 2}m</text>
                <text x="160" y="-6" fill="rgba(255, 255, 255, 0.7)" fontSize="9" fontWeight="bold">{siteMapData.scaleBarMeters || 50}m</text>
              </g>
            </svg>
          </div>

          {/* Quick Guidance Tag at Bottom Left */}
          <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-neutral-950/80 backdrop-blur-md border border-white/10 text-[11px] text-neutral-400 flex items-center gap-2 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Hover or click zones to inspect stats & renderings</span>
          </div>
        </div>

        {/* 4. Active Zone Inspector & Associated Rendering Showcase (4-5 Columns) */}
        <div className="lg:col-span-5 xl:col-span-4 p-5 sm:p-6 bg-neutral-900/90 flex flex-col justify-between space-y-6">
          
          {currentZone ? (
            <div className="space-y-5 animate-in fade-in duration-300">
              
              {/* Zone Header & Type Badge */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold tracking-wider text-white border"
                      style={{ 
                        backgroundColor: currentZone.accentColor,
                        borderColor: currentZone.strokeColor || currentZone.accentColor
                      }}
                    >
                      ZONE {currentZone.code}
                    </span>
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase">
                      {currentZone.type}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-white leading-snug">
                    {currentZone.name}
                  </h4>
                </div>

                <div 
                  className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: `${currentZone.accentColor}20`,
                    borderColor: `${currentZone.accentColor}50`
                  }}
                >
                  <Building2 className="w-5 h-5" style={{ color: currentZone.accentColor }} />
                </div>
              </div>

              {/* Associated Architectural Rendering Showcase */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-300 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    Associated Perspective Rendering
                  </span>
                  {currentZone.viewpointAngle && (
                    <span className="text-[10px] text-neutral-400 truncate max-w-[180px]">
                      {currentZone.viewpointAngle}
                    </span>
                  )}
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-white/10 group aspect-video bg-neutral-950">
                  <img
                    src={currentZone.renderingImage}
                    alt={currentZone.renderingTitle || currentZone.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Caption Overlay */}
                  <div className="absolute bottom-2.5 left-3 right-3 text-white pointer-events-none">
                    <p className="text-xs font-bold truncate">
                      {currentZone.renderingTitle || currentZone.name}
                    </p>
                    {currentZone.renderingCaption && (
                      <p className="text-[10px] text-neutral-300 line-clamp-1 mt-0.5">
                        {currentZone.renderingCaption}
                      </p>
                    )}
                  </div>

                  {/* Lightbox / Enlarge Button */}
                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                    title="Enlarge Rendering"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick Stats Matrix */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Architectural Specifications
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-neutral-800/60 border border-white/5">
                    <span className="text-[10px] text-neutral-400 block">Gross Area (GFA)</span>
                    <span className="font-bold text-white text-sm">{currentZone.stats.grossFloorArea}</span>
                  </div>

                  {currentZone.stats.heightOrFloors && (
                    <div className="p-2.5 rounded-xl bg-neutral-800/60 border border-white/5">
                      <span className="text-[10px] text-neutral-400 block">Height / Levels</span>
                      <span className="font-bold text-white text-sm">{currentZone.stats.heightOrFloors}</span>
                    </div>
                  )}

                  {currentZone.stats.structuralSystem && (
                    <div className="p-2.5 rounded-xl bg-neutral-800/60 border border-white/5 col-span-2">
                      <span className="text-[10px] text-neutral-400 block">Structural Framework</span>
                      <span className="font-medium text-blue-300">{currentZone.stats.structuralSystem}</span>
                    </div>
                  )}

                  {currentZone.stats.energyRating && (
                    <div className="p-2.5 rounded-xl bg-neutral-800/60 border border-white/5 col-span-2">
                      <span className="text-[10px] text-neutral-400 block">Sustainability & Energy</span>
                      <span className="font-medium text-emerald-400">{currentZone.stats.energyRating}</span>
                    </div>
                  )}

                  {currentZone.stats.completionPhase && (
                    <div className="p-2.5 rounded-xl bg-neutral-800/60 border border-white/5 col-span-2 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-neutral-400 block">Execution Phase</span>
                        <span className="font-semibold text-white">{currentZone.stats.completionPhase}</span>
                      </div>
                      {currentZone.stats.budgetShare && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                          {currentZone.stats.budgetShare}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950/40 p-3 rounded-xl border border-white/5">
                {currentZone.description}
              </p>

              {/* Key Architectural Highlights */}
              {currentZone.keyHighlights?.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Engineering Highlights
                  </span>
                  <ul className="space-y-1.5 text-xs text-neutral-300">
                    {currentZone.keyHighlights.map((hl, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Material Palette */}
              {currentZone.materials && currentZone.materials.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Specified Materials
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentZone.materials.map((mat, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 text-[10px] border border-white/5"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-neutral-400 space-y-2">
              <Info className="w-8 h-8 text-neutral-600 mx-auto" />
              <p className="text-sm font-semibold">No Zone Selected</p>
              <p className="text-xs">Select any zone on the map to inspect architectural parameters.</p>
            </div>
          )}

          {/* Directory of all zones in this project */}
          <div className="pt-3 border-t border-white/10">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
              Master Plan Directory ({siteMapData.zones.length} Zones)
            </span>
            <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto pr-1">
              {siteMapData.zones.map((z) => (
                <button
                  key={z.id}
                  onClick={() => setActiveZoneId(z.id)}
                  onMouseEnter={() => setHoveredZoneId(z.id)}
                  onMouseLeave={() => setHoveredZoneId(null)}
                  className={`px-2 py-1.5 rounded-lg text-left text-[11px] flex items-center justify-between transition-all cursor-pointer ${
                    (activeZoneId === z.id || hoveredZoneId === z.id)
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40 font-bold'
                      : 'bg-neutral-800/40 text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <span className="truncate">{z.code} - {z.name}</span>
                  <span 
                    className="w-2 h-2 rounded-full shrink-0 ml-1"
                    style={{ backgroundColor: z.accentColor }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for High-Res Associated Rendering */}
      {isLightboxOpen && currentZone && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div 
            className="relative max-w-5xl w-full bg-neutral-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video sm:aspect-[16/10] bg-black">
              <img
                src={currentZone.renderingImage}
                alt={currentZone.renderingTitle || currentZone.name}
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 transition-all cursor-pointer"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 pt-0 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  Zone {currentZone.code} • {currentZone.name}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {currentZone.renderingTitle || currentZone.name}
                </h3>
                {currentZone.renderingCaption && (
                  <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
                    {currentZone.renderingCaption}
                  </p>
                )}
              </div>

              <div className="text-right">
                <span className="text-xs text-neutral-400 block">Gross Floor Area</span>
                <span className="text-sm font-bold text-white">{currentZone.stats.grossFloorArea}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
