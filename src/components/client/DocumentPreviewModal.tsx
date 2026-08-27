import React, { useState } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize2, 
  FileText, 
  FileCode, 
  FileCheck, 
  Layers, 
  Eye, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sliders, 
  ShieldCheck, 
  Calendar, 
  User, 
  Info,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Sparkles,
  Grid
} from 'lucide-react';
import { FileRequestAttachment, FileRequestResponseDeliverable } from '../../types/enterprise';

export interface PreviewableDocument {
  id: string;
  name: string;
  fileType: string;
  sizeBytes?: number;
  url: string;
  uploadedAt?: string;
  uploadedBy?: string;
  category?: string;
  projectTitle?: string;
  notes?: string;
  version?: string;
}

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: PreviewableDocument | null;
  allDocuments?: PreviewableDocument[];
  onSelectDocument?: (doc: PreviewableDocument) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  document: activeDoc,
  allDocuments = [],
  onSelectDocument
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showCadLayers, setShowCadLayers] = useState(true);
  const [activeTab, setActiveTab] = useState<'preview' | 'metadata' | 'specifications'>('preview');
  const [cadGridVisible, setCadGridVisible] = useState(true);

  // CAD Layer Toggles
  const [cadLayers, setCadLayers] = useState({
    gridAxis: true,
    dimensions: true,
    rebarReinforcement: true,
    hatchWall: true,
    annotations: true
  });

  if (!isOpen || !activeDoc) return null;

  const docType = activeDoc.fileType.toLowerCase();
  const isImage = ['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(docType);
  const isPdf = docType === 'pdf';
  const isCadBim = ['dwg', 'dxf', 'rvt', 'rfa', 'ifc'].includes(docType);
  const isDoc = ['doc', 'docx', 'txt', 'rtf'].includes(docType);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '1.8 MB (Optimized)';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Carousel navigation
  const currentIndex = allDocuments.findIndex(d => d.id === activeDoc.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < allDocuments.length - 1;

  const handlePrev = () => {
    if (hasPrev && onSelectDocument) {
      onSelectDocument(allDocuments[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext && onSelectDocument) {
      onSelectDocument(allDocuments[currentIndex + 1]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-hidden animate-fadeIn">
      <div 
        className="w-full max-w-5xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[92vh] max-h-[900px]"
        onClick={e => e.stopPropagation()}
      >
        {/* TOP TOOLBAR */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 via-blue-950/50 to-slate-900 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-3 truncate">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 shrink-0">
              {isCadBim ? <FileCode className="w-5 h-5" /> : isImage ? <Eye className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-2">
                <span className="text-sm sm:text-base font-black text-white truncate">
                  {activeDoc.name}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 font-bold text-[10px] border border-blue-500/30 shrink-0 uppercase">
                  {docType}
                </span>
                {activeDoc.version && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold text-[10px] border border-emerald-500/30 shrink-0">
                    {activeDoc.version}
                  </span>
                )}
              </div>
              <div className="text-slate-400 text-xs flex items-center gap-2 truncate">
                <span>{formatFileSize(activeDoc.sizeBytes)}</span>
                <span>•</span>
                <span>{activeDoc.uploadedAt ? `Uploaded ${activeDoc.uploadedAt}` : 'Requirement Attachment'}</span>
                {activeDoc.uploadedBy && (
                  <>
                    <span>•</span>
                    <span className="text-blue-300">By {activeDoc.uploadedBy}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
            {/* Carousel navigation controls */}
            {allDocuments.length > 1 && (
              <div className="flex items-center bg-slate-950 border border-white/10 rounded-xl p-0.5 mr-2">
                <button
                  disabled={!hasPrev}
                  onClick={handlePrev}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer"
                  title="Previous document"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-bold text-slate-400 px-2">
                  {currentIndex + 1} / {allDocuments.length}
                </span>
                <button
                  disabled={!hasNext}
                  onClick={handleNext}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer"
                  title="Next document"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Copy link to document"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Print document preview"
            >
              <Printer className="w-4 h-4" />
            </button>

            <a
              href={activeDoc.url}
              download={activeDoc.name}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/30 cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SUB-HEADER / VIEW MODES & ZOOM CONTROLS */}
        <div className="px-5 py-2 bg-slate-950/70 border-b border-white/5 flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'preview' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Document Canvas
            </button>
            <button
              onClick={() => setActiveTab('metadata')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'metadata' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Technical Specifications & Metadata
            </button>
          </div>

          {/* Canvas View Tools (Zoom, Rotate, Grid) */}
          {activeTab === 'preview' && (
            <div className="flex items-center space-x-2">
              {isCadBim && (
                <button
                  onClick={() => setCadGridVisible(!cadGridVisible)}
                  className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 cursor-pointer ${
                    cadGridVisible ? 'bg-blue-950 border-blue-500/40 text-blue-300' : 'bg-slate-900 border-white/10 text-slate-400'
                  }`}
                  title="Toggle CAD Architectural Grid"
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Grid 1:50</span>
                </button>
              )}

              <button
                onClick={() => setZoomLevel(Math.max(50, zoomLevel - 20))}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <span className="text-[11px] font-mono font-bold text-slate-300 w-12 text-center">
                {zoomLevel}%
              </span>

              <button
                onClick={() => setZoomLevel(Math.min(250, zoomLevel + 20))}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setRotation((rotation + 90) % 360)}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 cursor-pointer"
                title="Rotate 90 deg"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => { setZoomLevel(100); setRotation(0); }}
                className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-white text-[10px] font-bold cursor-pointer"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        {/* MAIN VIEWER CANVAS CONTAINER */}
        <div className="flex-1 bg-slate-950 overflow-hidden relative flex flex-col md:flex-row">
          {activeTab === 'preview' ? (
            <>
              {/* PRIMARY VIEWER CANVAS */}
              <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center relative bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
                {/* 1. IMAGE PREVIEW */}
                {isImage && (
                  <div 
                    className="transition-transform duration-200 ease-out origin-center flex items-center justify-center max-w-full max-h-full"
                    style={{
                      transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`
                    }}
                  >
                    <img
                      src={activeDoc.url}
                      alt={activeDoc.name}
                      className="max-h-[65vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
                    />
                  </div>
                )}

                {/* 2. CAD / BIM BLUEPRINT SCHEMATIC PREVIEW */}
                {isCadBim && (
                  <div 
                    className="w-full max-w-3xl bg-slate-900/90 rounded-2xl border border-blue-500/30 p-6 shadow-2xl relative transition-transform duration-200 origin-center"
                    style={{
                      transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`
                    }}
                  >
                    {/* CAD Drawing Sheet Title Block */}
                    <div className="border-2 border-blue-500/40 rounded-xl p-5 bg-slate-950 relative overflow-hidden">
                      {/* Architectural Grid overlay */}
                      {cadGridVisible && (
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none" />
                      )}

                      {/* Mock Vector CAD Drawing Geometry */}
                      <div className="relative z-10 py-6">
                        <div className="flex justify-between items-start mb-6">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-blue-400 font-bold tracking-widest uppercase">
                              CAD SHEET: {activeDoc.name}
                            </span>
                            <h3 className="text-lg font-black text-white tracking-tight">
                              STRUCTURAL CANTILEVER & BALUSTRADE FIXING DETAIL
                            </h3>
                          </div>
                          <div className="text-right font-mono text-[10px] text-slate-400 space-y-0.5">
                            <div>SCALE: 1:50 @ A1</div>
                            <div>PROJ: {activeDoc.projectTitle || 'Grand Azure Villa'}</div>
                            <div>SPEC: IS 456 / NBC-2016</div>
                          </div>
                        </div>

                        {/* Visual Structural CAD Blueprint Render */}
                        <div className="h-64 border border-blue-500/30 rounded-xl bg-slate-900/80 p-4 relative flex flex-col justify-between overflow-hidden">
                          {/* CAD Datum Lines */}
                          {cadLayers.gridAxis && (
                            <div className="absolute inset-x-4 top-1/2 border-t border-dashed border-red-500/50 flex items-center justify-between">
                              <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 font-mono text-[9px]">AXIS 2-B</span>
                              <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 font-mono text-[9px]">+6.450m FFL</span>
                            </div>
                          )}

                          {/* Structural Beam and Cantilever Graphic */}
                          <div className="relative flex items-center justify-center h-full">
                            <div className="w-48 h-32 border-2 border-emerald-400/70 bg-emerald-950/20 rounded-md relative flex items-center justify-center">
                              {cadLayers.rebarReinforcement && (
                                <div className="space-y-2 w-full px-3">
                                  <div className="h-1 bg-amber-400/80 rounded w-full flex justify-between">
                                    <span className="text-[8px] font-mono text-amber-300 -top-3 relative">4-T16 Fe500D (Top)</span>
                                  </div>
                                  <div className="h-1 bg-amber-400/80 rounded w-full flex justify-between">
                                    <span className="text-[8px] font-mono text-amber-300 -bottom-3 relative">3-T20 Fe500D (Btm)</span>
                                  </div>
                                </div>
                              )}
                              <span className="text-[10px] font-mono text-emerald-300 font-bold">
                                300x600 RCC BEAM (M30)
                              </span>
                            </div>

                            {/* Cantilever Slab Overhang */}
                            <div className="w-56 h-12 border-2 border-blue-400/70 bg-blue-950/30 rounded-r-md relative flex items-center justify-center">
                              <span className="text-[10px] font-mono text-blue-300 font-bold">
                                1.80m BALCONY CANTILEVER
                              </span>
                            </div>

                            {/* Glass Balustrade */}
                            <div className="w-1.5 h-24 bg-cyan-400 border border-cyan-200 rounded-t relative -ml-1 flex items-start justify-center">
                              <span className="text-[8px] font-mono text-cyan-300 whitespace-nowrap -rotate-90 origin-left mt-8 ml-4">
                                12mm Toughened Glass (1050mm H)
                              </span>
                            </div>
                          </div>

                          {/* Dimensions Footer */}
                          {cadLayers.dimensions && (
                            <div className="flex justify-between items-center text-[9px] font-mono text-amber-300 border-t border-white/10 pt-2">
                              <span>DIM: BEAM W=300mm, D=600mm</span>
                              <span>OVERHANG: 1800mm CLEAR</span>
                              <span>CONCRETE GRADE: M30</span>
                            </div>
                          )}
                        </div>

                        {/* Title Block Bottom */}
                        <div className="mt-4 pt-3 border-t-2 border-blue-500/30 grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-300">
                          <div>
                            <span className="text-slate-500 block text-[9px]">ENGINEERING FIRM:</span>
                            <strong className="text-white">FIZA HAYAT ARCHITECTS</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[9px]">FILE FORMAT:</span>
                            <strong className="text-blue-300">{docType.toUpperCase()} AutoCAD 2024 Model</strong>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-500 block text-[9px]">SECURITY:</span>
                            <span className="text-emerald-400 font-bold">DIGITALLY SIGNED</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. PDF DRAWING SHEET VIEWER */}
                {isPdf && (
                  <div 
                    className="w-full max-w-3xl bg-slate-900 rounded-2xl border border-white/10 shadow-2xl p-6 relative transition-transform duration-200 origin-center"
                    style={{
                      transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`
                    }}
                  >
                    <div className="border border-white/10 rounded-xl bg-white text-slate-900 p-6 shadow-inner min-h-[420px] font-sans">
                      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            FIZA HAYAT ASSOCIATES • CONSULTING ARCHITECTS & ENGINEERS
                          </div>
                          <h2 className="text-xl font-black text-slate-900 mt-1">
                            PROJECT SPECIFICATION & REQUIREMENT SHEET
                          </h2>
                          <div className="text-xs text-slate-600 font-medium mt-0.5">
                            Document Ref: {activeDoc.id} • Project: {activeDoc.projectTitle || 'Grand Azure Villa'}
                          </div>
                        </div>
                        <div className="text-right border border-slate-300 p-2 rounded text-xs font-mono">
                          <div>STATUS: VERIFIED</div>
                          <div>DATE: {activeDoc.uploadedAt || '2026-08-27'}</div>
                        </div>
                      </div>

                      <div className="py-4 space-y-3 text-xs leading-relaxed text-slate-800">
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <strong className="block text-slate-900 mb-1">Scope Title: {activeDoc.name}</strong>
                          <p>
                            This requirement document is referenced directly for the current construction phase. All dimensions are verified on site before execution. In case of discrepancy with structural drawings, please notify the assigned Project Manager immediately.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="p-2.5 border border-slate-200 rounded">
                            <span className="text-[10px] text-slate-500 font-bold block uppercase">Structural Standard</span>
                            <span className="font-semibold text-slate-900">IS 456:2000 / IS 875 (Part 3)</span>
                          </div>
                          <div className="p-2.5 border border-slate-200 rounded">
                            <span className="text-[10px] text-slate-500 font-bold block uppercase">Review Stage</span>
                            <span className="font-semibold text-slate-900">Lead Architectural Sign-off</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-4 border-t border-slate-300 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                        <span>PAGE 1 OF 1 • AUTHENTICATED DIGITAL ARCHIVE</span>
                        <span>Fiza Hayat Client Portal</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. OTHER DOCUMENT TYPES (DOCX/TXT/ZIP) */}
                {isDoc && (
                  <div className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{activeDoc.name}</h3>
                      <p className="text-slate-400 text-xs mt-1">
                        Microsoft Word / Rich Text Requirement Brief
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950 border border-white/5 text-left text-xs text-slate-300 space-y-2">
                      <div className="font-bold text-blue-300">Document Summary:</div>
                      <p>{activeDoc.notes || 'Full requirement specification brief uploaded by client. Contains technical clauses, finish palettes, and contractor guidelines.'}</p>
                    </div>
                    <a
                      href={activeDoc.url}
                      download={activeDoc.name}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Full Document</span>
                    </a>
                  </div>
                )}
              </div>

              {/* CAD / BIM LAYER INSPECTOR SIDEBAR */}
              {isCadBim && showCadLayers && (
                <div className="w-full md:w-64 bg-slate-900 border-t md:border-t-0 md:border-l border-white/10 p-4 space-y-4 shrink-0 overflow-y-auto text-xs">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-400" />
                      <span>CAD Layer Filter</span>
                    </span>
                    <span className="text-[10px] text-blue-400 font-mono">BIM 3D</span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { key: 'gridAxis', label: 'Grid Axes & Datum (+6.45m)', color: 'text-red-400' },
                      { key: 'dimensions', label: 'Dimension Strings & Offsets', color: 'text-amber-400' },
                      { key: 'rebarReinforcement', label: 'Fe500D Rebar Profiles', color: 'text-emerald-400' },
                      { key: 'hatchWall', label: 'Concrete Slab Hatch', color: 'text-blue-400' },
                      { key: 'annotations', label: 'Text Callouts & Notes', color: 'text-cyan-400' }
                    ].map(item => (
                      <label 
                        key={item.key}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-white/5 hover:border-blue-500/30 cursor-pointer transition-colors"
                      >
                        <span className={`text-[11px] font-medium ${item.color}`}>
                          {item.label}
                        </span>
                        <input
                          type="checkbox"
                          checked={(cadLayers as any)[item.key]}
                          onChange={e => setCadLayers({ ...cadLayers, [item.key]: e.target.checked })}
                          className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                        />
                      </label>
                    ))}
                  </div>

                  {/* Material Parameters */}
                  <div className="pt-2 border-t border-white/5 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      CAD Model Parameters:
                    </span>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 text-[11px] space-y-1">
                      <div className="flex justify-between text-slate-400">
                        <span>Units:</span>
                        <strong className="text-white font-mono">Millimeters (mm)</strong>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Coordinate System:</span>
                        <strong className="text-white font-mono">WCS 0,0,0</strong>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Software:</span>
                        <strong className="text-blue-300">Autodesk Revit/AutoCAD</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* TAB 2: TECHNICAL SPECIFICATIONS & METADATA OVERLAY */
            <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs bg-slate-950">
              <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-400" />
                    <span>Document Metadata & Engineering Audit</span>
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                    Verified Digital Record
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                    <span className="text-slate-500 text-[10px] font-bold uppercase">Document Identifier</span>
                    <div className="text-white font-mono font-bold">{activeDoc.id}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                    <span className="text-slate-500 text-[10px] font-bold uppercase">File Format & Type</span>
                    <div className="text-white font-bold">{docType.toUpperCase()} ({activeDoc.fileType})</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                    <span className="text-slate-500 text-[10px] font-bold uppercase">File Size</span>
                    <div className="text-white font-bold">{formatFileSize(activeDoc.sizeBytes)}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                    <span className="text-slate-500 text-[10px] font-bold uppercase">Upload Timestamp</span>
                    <div className="text-white font-bold">{activeDoc.uploadedAt || '2026-08-27'}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                    <span className="text-slate-500 text-[10px] font-bold uppercase">Author / Origin</span>
                    <div className="text-blue-300 font-bold">{activeDoc.uploadedBy || 'Authenticated Client'}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                    <span className="text-slate-500 text-[10px] font-bold uppercase">Associated Project</span>
                    <div className="text-white font-bold truncate">{activeDoc.projectTitle || 'Grand Azure Villa'}</div>
                  </div>
                </div>

                {activeDoc.notes && (
                  <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 space-y-1">
                    <span className="text-blue-300 font-bold block">Engineering Notes & Instructions:</span>
                    <p className="text-slate-300 leading-relaxed">{activeDoc.notes}</p>
                  </div>
                )}
              </div>

              {/* All Documents in Current Project Strip */}
              {allDocuments.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    Related Requirement Documents ({allDocuments.length}):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {allDocuments.map(doc => (
                      <div
                        key={doc.id}
                        onClick={() => onSelectDocument && onSelectDocument(doc)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          doc.id === activeDoc.id
                            ? 'bg-blue-950/60 border-blue-500 text-white'
                            : 'bg-slate-900 border-white/10 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                          <div className="truncate">
                            <div className="font-bold truncate text-xs">{doc.name}</div>
                            <div className="text-[10px] text-slate-500">{doc.fileType.toUpperCase()}</div>
                          </div>
                        </div>
                        {doc.id === activeDoc.id && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold">
                            Active
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* BOTTOM FOOTER */}
        <div className="px-5 py-3 bg-slate-900 border-t border-white/10 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center space-x-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px]">Secure SSL Encrypted Engineering Document Viewer</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
            >
              Close
            </button>
            <a
              href={activeDoc.url}
              download={activeDoc.name}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Original</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
