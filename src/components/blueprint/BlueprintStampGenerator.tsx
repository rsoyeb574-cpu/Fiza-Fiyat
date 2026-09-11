import React, { useState, useEffect, useRef } from 'react';
import { 
  QrCode, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Layers, 
  Building2, 
  Sparkles,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import QRCode from 'qrcode';
import { Project } from '../../types';
import { generateBlueprintQRPayload } from '../../utils/blueprintQR';

interface BlueprintStampGeneratorProps {
  projects: Project[];
  defaultProjectId?: string;
  onSelectProjectForScan?: (projectId: string) => void;
}

export const BlueprintStampGenerator: React.FC<BlueprintStampGeneratorProps> = ({
  projects,
  defaultProjectId,
  onSelectProjectForScan
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    defaultProjectId || (projects[0]?.id || 'proj-1')
  );
  const [sheetNumber, setSheetNumber] = useState<string>('A-101');
  const [sheetTitle, setSheetTitle] = useState<string>('GROUND FLOOR & ELEVATIONS PLAN');
  const [revision, setRevision] = useState<string>('REV-03');
  const [discipline, setDiscipline] = useState<string>('Architectural & BIM');
  const [scale, setScale] = useState<string>('1:100 @ A0');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const stampCardRef = useRef<HTMLDivElement>(null);

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  useEffect(() => {
    if (!activeProject) return;
    const payload = generateBlueprintQRPayload(activeProject, sheetNumber, revision, sheetTitle);
    QRCode.toDataURL(payload, {
      width: 320,
      margin: 1,
      color: {
        dark: '#031926',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Failed to generate QR code:', err));
  }, [activeProject, sheetNumber, revision, sheetTitle, discipline]);

  const handleCopyPayload = () => {
    if (!activeProject) return;
    const payload = generateBlueprintQRPayload(activeProject, sheetNumber, revision, sheetTitle);
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadStampPng = () => {
    if (!qrDataUrl || !activeProject) return;
    // Create a high-res canvas stamp to download as PNG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 360;

    // Blueprint background
    ctx.fillStyle = '#08182B';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border and CAD corner lines
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 3;
    ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

    // Inner subtle grid
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.lineWidth = 1;
    for (let x = 30; x < canvas.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 12);
      ctx.lineTo(x, canvas.height - 12);
      ctx.stroke();
    }
    for (let y = 30; y < canvas.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(12, y);
      ctx.lineTo(canvas.width - 12, y);
      ctx.stroke();
    }

    // Divider line
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(270, 12);
    ctx.lineTo(270, canvas.height - 12);
    ctx.stroke();

    // Draw QR code image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // White box for QR code
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(35, 35, 200, 200);
      ctx.drawImage(img, 40, 40, 190, 190);

      // QR label under QR box
      ctx.fillStyle = '#67E8F9';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SCAN FOR LIVE DIGITAL TWIN', 135, 260);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '11px sans-serif';
      ctx.fillText('FIZA HAYAT BIM PLATFORM', 135, 280);
      ctx.fillText(sheetNumber + ' • ' + revision, 135, 298);

      // Text section on right
      ctx.textAlign = 'left';
      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 13px monospace';
      ctx.fillText('FIZA HAYAT ARCHITECTS & BIM CONSULTING', 295, 48);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px sans-serif';
      const truncatedTitle = activeProject.title.length > 36 ? activeProject.title.substring(0, 34) + '...' : activeProject.title;
      ctx.fillText(truncatedTitle, 295, 80);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '13px sans-serif';
      ctx.fillText(`SHEET NO: ${sheetNumber}`, 295, 120);
      ctx.fillText(`REVISION: ${revision}`, 530, 120);

      ctx.fillText(`TITLE: ${sheetTitle.substring(0, 38)}`, 295, 150);
      ctx.fillText(`DISCIPLINE: ${discipline}`, 295, 180);
      ctx.fillText(`SCALE: ${scale}`, 530, 180);

      ctx.fillText(`CLIENT: ${activeProject.clientName || 'Private Office'}`, 295, 210);
      ctx.fillText(`LOCATION: ${activeProject.location || 'Global'}`, 530, 210);

      ctx.fillText(`BIM LEVEL: ${activeProject.bimLevel || 'LOD 400'}`, 295, 240);
      ctx.fillText(`DATE: ${new Date().toLocaleDateString()}`, 530, 240);

      // Bottom CAD authentication hash
      ctx.fillStyle = '#00F0FF';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`CAD-AUTH-HASH: FH-${activeProject.id.toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`, 295, 310);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText('VERIFIED AUTHENTIC BLUEPRINT TITLE BLOCK STAMP', 295, 328);

      // Trigger download
      const link = document.createElement('a');
      link.download = `blueprint-stamp-${activeProject.id}-${sheetNumber}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = qrDataUrl;
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Blueprint Title Block Stamp - ${activeProject?.title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #fff; padding: 20px; }
            .stamp-box { border: 3px solid #000; padding: 20px; display: flex; gap: 24px; max-width: 750px; }
            .qr-col { text-align: center; }
            .qr-img { width: 180px; height: 180px; }
            .info-col { flex: 1; font-size: 13px; line-height: 1.6; }
            h2 { margin: 0 0 8px 0; font-size: 18px; text-transform: uppercase; }
            .badge { display: inline-block; padding: 2px 8px; background: #eee; font-weight: bold; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="stamp-box">
            <div class="qr-col">
              <img class="qr-img" src="${qrDataUrl}" alt="Blueprint QR Code" />
              <div style="font-weight:bold; font-size:11px; margin-top:6px;">SCAN FOR 3D BIM & SPECS</div>
              <div style="font-size:10px; color:#666;">FH ARCHITECTS</div>
            </div>
            <div class="info-col">
              <div style="font-family: monospace; font-weight: bold; color: #444;">FIZA HAYAT ARCHITECTURAL & BIM STUDIO</div>
              <h2>${activeProject?.title}</h2>
              <div><strong>SHEET NO:</strong> ${sheetNumber} &nbsp;&nbsp;&nbsp; <strong>REVISION:</strong> ${revision}</div>
              <div><strong>SHEET TITLE:</strong> ${sheetTitle}</div>
              <div><strong>DISCIPLINE:</strong> ${discipline} &nbsp;&nbsp;&nbsp; <strong>SCALE:</strong> ${scale}</div>
              <div><strong>CLIENT:</strong> ${activeProject?.clientName || 'Private Office'}</div>
              <div><strong>LOCATION:</strong> ${activeProject?.location || 'Global'}</div>
              <div><strong>BIM LEVEL:</strong> ${activeProject?.bimLevel || 'LOD 400'}</div>
              <div style="margin-top: 10px; padding: 6px; background: #f5f5f5; font-family: monospace; font-size: 11px;">
                PROJECT ID: ${activeProject?.id} | STAMP ID: FH-CAD-${sheetNumber}
              </div>
            </div>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!activeProject) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900/60 p-4 rounded-2xl border border-white/10">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <QrCode className="w-4 h-4 text-cyan-400" />
            <span>Architectural Blueprint Title Block QR Generator</span>
          </h4>
          <p className="text-xs text-neutral-400 mt-0.5">
            Generate printable high-resolution CAD corner stamps for physical A0-A3 drawings. Scanning with the camera instantly loads the project.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadStampPng}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-600/30 cursor-pointer transition-all"
            title="Download high-resolution PNG stamp for AutoCAD / Revit title block overlay"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG Stamp</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center gap-1.5 border border-white/10 cursor-pointer transition-all"
            title="Print sheet stamp directly"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-300" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Project Selector */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
            Target Project
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full bg-neutral-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.id})
              </option>
            ))}
          </select>
        </div>

        {/* Sheet Number */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
            Sheet Number
          </label>
          <input
            type="text"
            value={sheetNumber}
            onChange={(e) => setSheetNumber(e.target.value.toUpperCase())}
            placeholder="e.g. A-101, S-202, MEP-301"
            className="w-full bg-neutral-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        {/* Revision Tag */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
            Drawing Revision
          </label>
          <input
            type="text"
            value={revision}
            onChange={(e) => setRevision(e.target.value.toUpperCase())}
            placeholder="e.g. REV-01, REV-03 (APPROVED)"
            className="w-full bg-neutral-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        {/* Sheet Title */}
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
            Drawing Sheet Title
          </label>
          <input
            type="text"
            value={sheetTitle}
            onChange={(e) => setSheetTitle(e.target.value.toUpperCase())}
            placeholder="e.g. GROUND FLOOR PLAN & SECTION AA"
            className="w-full bg-neutral-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        {/* Discipline & Scale */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
            Discipline & Scale
          </label>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              className="bg-neutral-900 border border-white/15 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Architectural & BIM">Architectural</option>
              <option value="Structural & Steel">Structural</option>
              <option value="Interior & Millwork">Interior</option>
              <option value="MEP & HVAC">MEP & HVAC</option>
              <option value="Civil & Landscape">Civil / Site</option>
            </select>
            <input
              type="text"
              value={scale}
              onChange={(e) => setScale(e.target.value)}
              placeholder="Scale (1:100)"
              className="bg-neutral-900 border border-white/15 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Stamp Preview Card (Styled like real physical blueprint title block) */}
      <div 
        ref={stampCardRef}
        className="relative overflow-hidden rounded-2xl border-2 border-cyan-500/40 bg-[#08182B] p-5 shadow-2xl shadow-cyan-950/60"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 240, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 240, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px'
        }}
      >
        {/* CAD Corner tick marks */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>

        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* QR Code Container */}
          <div className="shrink-0 flex flex-col items-center bg-white p-3 rounded-xl shadow-lg border border-cyan-400/50">
            {qrDataUrl ? (
              <img 
                src={qrDataUrl} 
                alt="Blueprint QR Code" 
                className="w-40 h-40 object-contain rounded"
              />
            ) : (
              <div className="w-40 h-40 flex items-center justify-center bg-neutral-100 text-neutral-400">
                <RefreshCw className="w-6 h-6 animate-spin text-neutral-500" />
              </div>
            )}
            <div className="mt-2 text-center">
              <span className="block text-[10px] font-mono font-extrabold text-neutral-900 tracking-wider">
                SCAN FOR 3D BIM MODEL
              </span>
              <span className="block text-[9px] text-neutral-600 font-mono">
                {sheetNumber} • {revision}
              </span>
            </div>
          </div>

          {/* Title Block Specs */}
          <div className="flex-1 space-y-3 text-left w-full">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/30 pb-2">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-extrabold uppercase">
                  Fiza Hayat Architectural & BIM Studio • Official Stamp
                </span>
                <h3 className="text-lg font-black text-white tracking-tight">
                  {activeProject.title}
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
                {activeProject.bimLevel || 'LOD 400'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-neutral-950/60 p-2.5 rounded-lg border border-cyan-500/20">
                <span className="text-[10px] text-neutral-400 block font-mono">SHEET NUMBER</span>
                <span className="font-extrabold text-white font-mono text-sm">{sheetNumber}</span>
              </div>
              <div className="bg-neutral-950/60 p-2.5 rounded-lg border border-cyan-500/20">
                <span className="text-[10px] text-neutral-400 block font-mono">REVISION</span>
                <span className="font-extrabold text-cyan-300 font-mono text-sm">{revision}</span>
              </div>
              <div className="bg-neutral-950/60 p-2.5 rounded-lg border border-cyan-500/20">
                <span className="text-[10px] text-neutral-400 block font-mono">DISCIPLINE</span>
                <span className="font-bold text-white text-xs">{discipline}</span>
              </div>
              <div className="bg-neutral-950/60 p-2.5 rounded-lg border border-cyan-500/20">
                <span className="text-[10px] text-neutral-400 block font-mono">SCALE</span>
                <span className="font-bold text-white font-mono text-xs">{scale}</span>
              </div>
            </div>

            <div className="space-y-1 text-xs text-neutral-300 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-neutral-400 font-mono text-[11px]">DRAWING TITLE:</span>
                <span className="font-semibold text-white font-mono text-xs">{sheetTitle}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-400 font-mono text-[11px]">CLIENT:</span>
                <span className="text-white font-medium">{activeProject.clientName}</span>
                <span className="text-neutral-500">•</span>
                <span className="text-neutral-400 font-mono text-[11px]">LOCATION:</span>
                <span className="text-white font-medium">{activeProject.location || 'Global'}</span>
              </div>
            </div>

            {/* Verification Hash & Action */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-cyan-500/20 text-[11px] text-neutral-400">
              <span className="font-mono text-cyan-400/80">
                AUTH: FH-{activeProject.id.toUpperCase()}-CAD-{sheetNumber}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyPayload}
                  className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-white/10 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Copy encoded QR string"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Payload'}</span>
                </button>
                {onSelectProjectForScan && (
                  <button
                    onClick={() => onSelectProjectForScan(activeProject.id)}
                    className="px-2.5 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Test In Scanner</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
