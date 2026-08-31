import React, { useState, useRef, useEffect } from 'react';
import { 
  Eye, 
  Layers, 
  Download, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Info,
  ZoomIn,
  ZoomOut,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { DamageAnnotation, DetectedProblem } from '../../types/structuralInspector';

interface AnnotatedMediaViewerProps {
  imageUrls: string[];
  annotations: DamageAnnotation[];
  findings?: DetectedProblem[];
  structureType?: string;
  onSelectFinding?: (findingId: string) => void;
  selectedFindingId?: string | null;
}

export const AnnotatedMediaViewer: React.FC<AnnotatedMediaViewerProps> = ({
  imageUrls,
  annotations,
  findings = [],
  structureType = 'Building',
  onSelectFinding,
  selectedFindingId
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const [hoveredAnnotationId, setHoveredAnnotationId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const currentImageUrl = imageUrls[activeImageIndex] || imageUrls[0];

  // Filter annotations for current image index
  const currentAnnotations = annotations.filter(a => 
    typeof a.imageIndex === 'undefined' || a.imageIndex === activeImageIndex
  );

  const getSeverityBadgeColor = (severity: string) => {
    if (severity.includes('Critical')) return { bg: '#ef4444', text: '#ffffff', border: '#b91c1c' };
    if (severity.includes('High')) return { bg: '#f97316', text: '#ffffff', border: '#c2410c' };
    if (severity.includes('Moderate')) return { bg: '#eab308', text: '#000000', border: '#a16207' };
    return { bg: '#3b82f6', text: '#ffffff', border: '#1d4ed8' };
  };

  const getAnnotationColor = (type: string, severity: string) => {
    if (severity.includes('Critical')) return '#ef4444';
    if (severity.includes('High')) return '#f97316';
    if (type === 'crack') return '#ef4444';
    if (type === 'spalling' || type === 'honeycombing') return '#f59e0b';
    if (type === 'corrosion') return '#d97706';
    if (type === 'water_moisture') return '#06b6d4';
    if (type === 'deformation') return '#a855f7';
    return '#3b82f6';
  };

  // Export composite annotated image
  const handleDownloadAnnotatedImage = async () => {
    if (!imageRef.current) return;
    setIsExporting(true);

    try {
      const img = imageRef.current;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.naturalWidth || 1200;
      canvas.height = img.naturalHeight || 800;

      // Draw original image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (showAnnotations) {
        // Draw annotations onto canvas
        currentAnnotations.forEach((ann, idx) => {
          const [ymin, xmin, ymax, xmax] = ann.box2d;
          const x = (xmin / 1000) * canvas.width;
          const y = (ymin / 1000) * canvas.height;
          const w = ((xmax - xmin) / 1000) * canvas.width;
          const h = ((ymax - ymin) / 1000) * canvas.height;

          const color = getAnnotationColor(ann.type, ann.severity);

          // Bounding Box
          ctx.strokeStyle = color;
          ctx.lineWidth = Math.max(3, Math.round(canvas.width * 0.003));
          ctx.strokeRect(x, y, w, h);

          // Semi-transparent fill
          ctx.fillStyle = color + '22';
          ctx.fillRect(x, y, w, h);

          // Corner brackets for technical look
          const cornerLen = Math.min(20, w * 0.2, h * 0.2);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = Math.max(2, Math.round(canvas.width * 0.002));
          // Top-left
          ctx.beginPath();
          ctx.moveTo(x, y + cornerLen);
          ctx.lineTo(x, y);
          ctx.lineTo(x + cornerLen, y);
          ctx.stroke();

          // Label pill
          const label = `${ann.label} (${ann.severity})`;
          const fontSize = Math.max(14, Math.round(canvas.width * 0.016));
          ctx.font = `bold ${fontSize}px sans-serif`;
          const textWidth = ctx.measureText(label).width;
          const pillPadding = 8;
          const pillHeight = fontSize + 10;

          ctx.fillStyle = color;
          ctx.fillRect(x, Math.max(0, y - pillHeight - 4), textWidth + pillPadding * 2, pillHeight);

          ctx.fillStyle = '#ffffff';
          ctx.fillText(label, x + pillPadding, Math.max(fontSize, y - 8));
        });

        // Watermark
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px sans-serif';
        ctx.fillText(`FIZA FIYAT AI Structural Damage Inspection • Preliminary Visual Audit Only`, 14, canvas.height - 10);
      }

      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `AI_Annotated_Damage_${structureType}_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to export annotated image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/90 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2">
          {/* Toggle View Mode */}
          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              showAnnotations 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                : 'bg-white/10 text-slate-300 hover:text-white'
            }`}
          >
            {showAnnotations ? <Sparkles className="w-3.5 h-3.5 text-amber-300" /> : <Eye className="w-3.5 h-3.5" />}
            {showAnnotations ? 'AI Analysis (Annotated)' : 'Original Image'}
          </button>

          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            {currentAnnotations.length} {currentAnnotations.length === 1 ? 'indicator' : 'indicators'} marked
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Multi-image indicators */}
          {imageUrls.length > 1 && (
            <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-white/10">
              <button
                onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : imageUrls.length - 1))}
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title="Previous Image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-300 font-mono px-1">
                {activeImageIndex + 1}/{imageUrls.length}
              </span>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev < imageUrls.length - 1 ? prev + 1 : 0))}
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title="Next Image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Download Annotated PNG */}
          <button
            onClick={handleDownloadAnnotatedImage}
            disabled={isExporting}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Download Annotated Image"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Save Annotated Image</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-2 rounded-xl text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Open Fullscreen Inspector"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Image & Overlay Canvas Container */}
      <div 
        ref={containerRef}
        className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-white/10 group flex items-center justify-center min-h-[360px] max-h-[550px]"
      >
        <img
          ref={imageRef}
          src={currentImageUrl}
          alt={`Structural Inspection - ${structureType}`}
          className="w-full h-auto max-h-[550px] object-contain select-none transition-all duration-300"
          crossOrigin="anonymous"
        />

        {/* SVG Annotations Overlay */}
        {showAnnotations && (
          <svg 
            viewBox="0 0 1000 1000" 
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-auto"
          >
            {currentAnnotations.map((ann) => {
              const [ymin, xmin, ymax, xmax] = ann.box2d;
              const w = Math.max(15, xmax - xmin);
              const h = Math.max(15, ymax - ymin);
              const isHovered = hoveredAnnotationId === ann.id;
              const isSelected = selectedFindingId === ann.id || findings.find(f => f.annotationId === ann.id)?.id === selectedFindingId;
              const color = getAnnotationColor(ann.type, ann.severity);

              return (
                <g 
                  key={ann.id}
                  className="cursor-pointer transition-transform duration-150"
                  onMouseEnter={() => setHoveredAnnotationId(ann.id)}
                  onMouseLeave={() => setHoveredAnnotationId(null)}
                  onClick={() => {
                    const matchedFinding = findings.find(f => f.annotationId === ann.id);
                    if (matchedFinding && onSelectFinding) {
                      onSelectFinding(matchedFinding.id);
                    }
                  }}
                >
                  {/* Bounding Box Area */}
                  <rect
                    x={xmin}
                    y={ymin}
                    width={w}
                    height={h}
                    fill={isSelected || isHovered ? `${color}33` : `${color}15`}
                    stroke={color}
                    strokeWidth={isSelected || isHovered ? 4 : 2.5}
                    strokeDasharray={isSelected ? '6 3' : 'none'}
                    rx="6"
                  />

                  {/* Corner Targets */}
                  <line x1={xmin} y1={ymin} x2={xmin + 20} y2={ymin} stroke="#ffffff" strokeWidth="2.5" />
                  <line x1={xmin} y1={ymin} x2={xmin} y2={ymin + 20} stroke="#ffffff" strokeWidth="2.5" />
                  <line x1={xmin + w} y1={ymin + h} x2={xmin + w - 20} y2={ymin + h} stroke="#ffffff" strokeWidth="2.5" />
                  <line x1={xmin + w} y1={ymin + h} x2={xmin + w} y2={ymin + h - 20} stroke="#ffffff" strokeWidth="2.5" />

                  {/* Visual Label Tag in SVG */}
                  <g transform={`translate(${xmin}, ${Math.max(25, ymin - 8)})`}>
                    <rect
                      x="0"
                      y="-22"
                      width={ann.label.length * 9.5 + 40}
                      height="24"
                      fill={color}
                      rx="5"
                    />
                    <text
                      x="8"
                      y="-6"
                      fill="#ffffff"
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {ann.label}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        )}

        {/* Hover / Selected Info Tooltip */}
        {showAnnotations && hoveredAnnotationId && (
          (() => {
            const ann = currentAnnotations.find(a => a.id === hoveredAnnotationId);
            const matchedFinding = findings.find(f => f.annotationId === ann?.id);
            if (!ann) return null;
            return (
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl glass-card bg-slate-900/95 border border-white/20 backdrop-blur-md z-30 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150 pointer-events-none">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                      {ann.label}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {matchedFinding?.problem || ann.description}
                    </span>
                  </div>
                  <span className="text-xs text-amber-300 font-medium">
                    {ann.severity}
                  </span>
                </div>
                {matchedFinding && (
                  <p className="text-xs text-slate-300 line-clamp-2">
                    <strong>Evidence:</strong> {matchedFinding.evidence}
                  </p>
                )}
              </div>
            );
          })()
        )}
      </div>

      {/* Multi-image Thumbnail Strip (if multiple photos provided) */}
      {imageUrls.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto p-2 bg-slate-900/50 rounded-xl border border-white/5">
          <span className="text-xs text-slate-400 font-semibold px-2">Views:</span>
          {imageUrls.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`relative rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                activeImageIndex === idx ? 'border-blue-500 scale-105 shadow-md shadow-blue-500/30' : 'border-white/10 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={url} alt={`View ${idx + 1}`} className="w-16 h-12 object-cover" />
              <div className="absolute bottom-0 right-0 px-1 text-[9px] font-bold bg-black/70 text-white">
                #{idx + 1}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Inspector Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white">High-Resolution Structural Damage Inspection Canvas</h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {structureType}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAnnotations(!showAnnotations)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                  showAnnotations ? 'bg-blue-600 text-white' : 'bg-white/10 text-slate-300'
                }`}
              >
                {showAnnotations ? 'Overlay On' : 'Overlay Off'}
              </button>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 relative flex items-center justify-center overflow-hidden rounded-2xl bg-slate-950 border border-white/10">
            <img
              src={currentImageUrl}
              alt="Fullscreen Inspection"
              className="max-w-full max-h-full object-contain"
            />
            {showAnnotations && (
              <svg 
                viewBox="0 0 1000 1000" 
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full"
              >
                {currentAnnotations.map((ann) => {
                  const [ymin, xmin, ymax, xmax] = ann.box2d;
                  const w = Math.max(15, xmax - xmin);
                  const h = Math.max(15, ymax - ymin);
                  const color = getAnnotationColor(ann.type, ann.severity);
                  return (
                    <g key={ann.id}>
                      <rect
                        x={xmin}
                        y={ymin}
                        width={w}
                        height={h}
                        fill={`${color}22`}
                        stroke={color}
                        strokeWidth="3.5"
                        rx="6"
                      />
                      <g transform={`translate(${xmin}, ${Math.max(25, ymin - 8)})`}>
                        <rect
                          x="0"
                          y="-22"
                          width={ann.label.length * 10 + 40}
                          height="24"
                          fill={color}
                          rx="5"
                        />
                        <text
                          x="8"
                          y="-6"
                          fill="#ffffff"
                          fontSize="13"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          {ann.label} ({ann.severity})
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
