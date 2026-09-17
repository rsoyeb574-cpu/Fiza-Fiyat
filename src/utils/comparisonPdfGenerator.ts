import { jsPDF } from 'jspdf';
import { Project } from '../types';
import { NormalizedProjectSpecs, calculateComparisonDelta } from './projectComparison';

interface GenerateComparisonPdfOptions {
  project1: Project;
  project2: Project;
  specs1: NormalizedProjectSpecs;
  specs2: NormalizedProjectSpecs;
}

/**
 * Loads an image from a URL or Data URL with cross-origin handling and timeout
 */
function loadImageWithTimeout(url: string, timeoutMs = 4000): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (!url.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }
    const timer = setTimeout(() => {
      reject(new Error('Image loading timed out'));
    }, timeoutMs);

    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };
    img.onerror = (e) => {
      clearTimeout(timer);
      reject(e);
    };
    img.src = url;
  });
}

/**
 * Converts a loaded image element into a clean, scaled base64 JPEG data URL via off-screen canvas
 */
function convertImageToDataUrl(img: HTMLImageElement, maxWidth = 1000, maxHeight = 600): string {
  const canvas = document.createElement('canvas');
  let w = img.naturalWidth || 800;
  let h = img.naturalHeight || 500;

  if (w > maxWidth) {
    h = Math.round((h * maxWidth) / w);
    w = maxWidth;
  }
  if (h > maxHeight) {
    w = Math.round((w * maxHeight) / h);
    h = maxHeight;
  }

  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas 2d context');

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);

  return canvas.toDataURL('image/jpeg', 0.85);
}

/**
 * Generates an architectural blueprint illustration as fallback if remote image loading fails
 */
function createBlueprintPlaceholder(title: string, category: string, accentColor = '#7c3aed', width = 900, height = 550): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background deep blueprint slate
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, width, height);

  // Subtle coordinate grid
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  const gridSize = 25;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Border frame with blueprint drafting markings
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // Registration marks
  ctx.fillStyle = accentColor;
  ctx.fillRect(16, 16, 8, 8);
  ctx.fillRect(width - 24, 16, 8, 8);
  ctx.fillRect(16, height - 24, 8, 8);
  ctx.fillRect(width - 24, height - 24, 8, 8);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(title.toUpperCase().slice(0, 32), 40, 60);

  // Category
  ctx.fillStyle = accentColor;
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText(`ARCHITECTURAL SCHEMATIC • ${category.toUpperCase()}`, 40, 90);

  // Center badge
  const boxW = 320;
  const boxH = 100;
  const boxX = (width - boxW) / 2;
  const boxY = (height - boxH) / 2 + 20;

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(boxX, boxY, boxW, boxH);
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FIZA HAYAT STUDIO', width / 2, boxY + 42);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px sans-serif';
  ctx.fillText('BIM COORDINATION & ARCHITECTURAL ASSET', width / 2, boxY + 70);

  return canvas.toDataURL('image/jpeg', 0.85);
}

/**
 * Safely fetches a project cover image or returns an architectural blueprint fallback
 */
async function getSafeImageDataUrl(url: string | undefined, title: string, category: string, accentColor: string): Promise<string> {
  if (url) {
    try {
      const img = await loadImageWithTimeout(url, 3500);
      return convertImageToDataUrl(img);
    } catch {
      // fallback to blueprint below
    }
  }
  return createBlueprintPlaceholder(title, category, accentColor);
}

/**
 * Generates and triggers download of a high-resolution, multi-page vector PDF Comparison Report
 * between two projects using jsPDF.
 */
export async function downloadProjectComparisonPdf({
  project1,
  project2,
  specs1,
  specs2
}: GenerateComparisonPdfOptions): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm
  let y = 14;

  const delta = calculateComparisonDelta(project1, project2);
  const dateFormatted = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const timeFormatted = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const reportRef = `FH-CMP-${Math.floor(100000 + Math.random() * 900000)}`;

  // Page break checker
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = 16;
      // Subsequent page banner
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(margin, y, contentWidth, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text(
        `FIZA HAYAT STUDIO | COMPARATIVE FEASIBILITY REPORT: ${project1.title.toUpperCase()} VS ${project2.title.toUpperCase()}`,
        margin + 4,
        y + 5.5
      );
      y += 13;
    }
  };

  // Safe image generation for both projects
  const [imgData1, imgData2] = await Promise.all([
    getSafeImageDataUrl(project1.coverImage, project1.title, project1.categoryName || 'Design', '#7c3aed'),
    getSafeImageDataUrl(project2.coverImage, project2.title, project2.categoryName || 'Design', '#2563eb')
  ]);

  // ==========================================
  // PAGE 1: HEADER & EXECUTIVE COMPARISON
  // ==========================================

  // --- 1. HEADER BANNER ---
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, y, contentWidth, 26, 'F');

  // Accent strips: Left violet (Project 1), Right blue (Project 2)
  doc.setFillColor(124, 58, 237); // violet-600
  doc.rect(margin, y, 4, 26, 'F');

  doc.setFillColor(37, 99, 235); // blue-600
  doc.rect(margin + 4, y, 2, 26, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('FIZA HAYAT ARCHITECTURAL & BIM STUDIO', margin + 10, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(196, 181, 253); // violet-300
  doc.text('PROJECT SPECIFICATION & FINANCIAL COMPARISON REPORT', margin + 10, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`Ref: ${reportRef}  |  Generated: ${dateFormatted} at ${timeFormatted}  |  Dual Architectural Audit`, margin + 10, y + 20);

  // Status Stamp
  doc.setFillColor(124, 58, 237);
  doc.roundedRect(pageWidth - margin - 40, y + 5, 36, 16, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text('FEASIBILITY MATRIX', pageWidth - margin - 22, y + 10, { align: 'center' });
  doc.setFontSize(8.5);
  doc.text('SIDE-BY-SIDE', pageWidth - margin - 22, y + 15, { align: 'center' });

  y += 31;

  // --- 2. EXECUTIVE COST VARIANCE CALLOUT ---
  const varianceBgColor = [248, 250, 252] as const;
  doc.setFillColor(...varianceBgColor);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');

  // Left indicator bar
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.rect(margin, y, 3, 18, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('EXECUTIVE VARIANCE & COMMERCIAL FINDINGS', margin + 7, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const costDiffSummary = delta.costDiffPercent > 0
    ? `Estimated investment differential is ${delta.costDiffFormatted} (~${delta.costDiffPercent}% variance). ${
        delta.higherCostProject === 1 ? project1.title : project2.title
      } reflects higher overall capital outlay due to enhanced scale, higher LOD BIM, or premium materials.`
    : `Both projects exhibit identical or near-equivalent overall capital estimates with distinct spatial and material allocations.`;

  doc.text(costDiffSummary, margin + 7, y + 12, { maxWidth: contentWidth - 14 });

  y += 23;

  // --- 3. SIDE-BY-SIDE HERO PROJECTS ---
  const colWidth = (contentWidth - 6) / 2; // 88mm each
  const col1X = margin;
  const col2X = margin + colWidth + 6;

  // Column 1: Project A
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(196, 181, 253); // violet-300
  doc.setLineWidth(0.4);
  doc.roundedRect(col1X, y, colWidth, 76, 2, 2, 'FD');

  // Badge A
  doc.setFillColor(124, 58, 237);
  doc.roundedRect(col1X + 4, y + 4, 24, 5.5, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text('PROJECT A', col1X + 16, y + 8, { align: 'center' });

  // Category A
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(project1.categoryName || 'Architecture', col1X + 32, y + 8);

  // Image A
  if (imgData1) {
    try {
      doc.addImage(imgData1, 'JPEG', col1X + 4, y + 12, colWidth - 8, 32);
    } catch {
      // graceful fallback
    }
  }

  // Title A
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  const titleA = doc.splitTextToSize(project1.title, colWidth - 8);
  doc.text(titleA, col1X + 4, y + 49);

  // Location & Metrics A
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(project1.location ? `Location: ${project1.location}` : 'Location: Global Portfolio', col1X + 4, y + 57);

  // Cost Row A
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(col1X + 4, y + 60, colWidth - 8, 12, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('ESTIMATED COST', col1X + 8, y + 65);
  doc.text('RATE', col1X + colWidth / 2 + 2, y + 65);

  doc.setFontSize(9.5);
  doc.setTextColor(124, 58, 237); // violet-600
  doc.text(specs1.estimatedCost, col1X + 8, y + 70);
  doc.setTextColor(15, 23, 42);
  doc.text(specs1.costPerSqFt, col1X + colWidth / 2 + 2, y + 70);

  // Column 2: Project B
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(147, 197, 253); // blue-300
  doc.setLineWidth(0.4);
  doc.roundedRect(col2X, y, colWidth, 76, 2, 2, 'FD');

  // Badge B
  doc.setFillColor(37, 99, 235);
  doc.roundedRect(col2X + 4, y + 4, 24, 5.5, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text('PROJECT B', col2X + 16, y + 8, { align: 'center' });

  // Category B
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(project2.categoryName || 'Architecture', col2X + 32, y + 8);

  // Image B
  if (imgData2) {
    try {
      doc.addImage(imgData2, 'JPEG', col2X + 4, y + 12, colWidth - 8, 32);
    } catch {
      // graceful fallback
    }
  }

  // Title B
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  const titleB = doc.splitTextToSize(project2.title, colWidth - 8);
  doc.text(titleB, col2X + 4, y + 49);

  // Location & Metrics B
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(project2.location ? `Location: ${project2.location}` : 'Location: Global Portfolio', col2X + 4, y + 57);

  // Cost Row B
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(col2X + 4, y + 60, colWidth - 8, 12, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('ESTIMATED COST', col2X + 8, y + 65);
  doc.text('RATE', col2X + colWidth / 2 + 2, y + 65);

  doc.setFontSize(9.5);
  doc.setTextColor(37, 99, 235); // blue-600
  doc.text(specs2.estimatedCost, col2X + 8, y + 70);
  doc.setTextColor(15, 23, 42);
  doc.text(specs2.costPerSqFt, col2X + colWidth / 2 + 2, y + 70);

  y += 81;

  // --- 4. FINANCIAL & COST BREAKDOWN COMPARISON TABLE ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('FINANCIAL MATRIX & COMPONENT COST BREAKDOWN', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Comparative allocation of architectural, engineering, BIM modeling, and site execution expenditures.', margin, y + 4.5);

  y += 8;

  // Table Header
  const colMetricW = 58;
  const colP1W = 62;
  const colP2W = 62;

  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('FINANCIAL PARAMETER', margin + 4, y + 4.5);
  doc.text(`PROJECT A (${project1.title.slice(0, 20)})`, margin + colMetricW + 4, y + 4.5);
  doc.text(`PROJECT B (${project2.title.slice(0, 20)})`, margin + colMetricW + colP1W + 4, y + 4.5);

  y += 7;

  const financialRows = [
    { label: 'Total Estimated Investment', val1: specs1.estimatedCost, val2: specs2.estimatedCost, bold: true, highlight: true },
    { label: 'Cost Per Unit Area', val1: specs1.costPerSqFt, val2: specs2.costPerSqFt, bold: false, highlight: false },
    { label: 'Total Built-up Scale / Area', val1: specs1.area, val2: specs2.area, bold: false, highlight: false },
    { label: 'Projected Delivery Duration', val1: specs1.duration, val2: specs2.duration, bold: false, highlight: false },
    { label: 'Architectural Design Services (8%)', val1: specs1.costBreakdown.architectural, val2: specs2.costBreakdown.architectural, bold: false, highlight: false },
    { label: 'BIM & 3D Coordination (4%)', val1: specs1.costBreakdown.bimAnd3d, val2: specs2.costBreakdown.bimAnd3d, bold: false, highlight: false },
    { label: 'Structural & MEP Engineering (6%)', val1: specs1.costBreakdown.engineering, val2: specs2.costBreakdown.engineering, bold: false, highlight: false },
    { label: 'Construction & Site Execution (82%)', val1: specs1.costBreakdown.constructionEst, val2: specs2.costBreakdown.constructionEst, bold: false, highlight: false }
  ];

  financialRows.forEach((row, i) => {
    const isEven = i % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(margin, y + 6, margin + contentWidth, y + 6);

    doc.setFont('helvetica', row.bold ? 'bold' : 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(row.label, margin + 4, y + 4.2);

    if (row.highlight) {
      doc.setTextColor(124, 58, 237);
      doc.setFont('helvetica', 'bold');
    }
    doc.text(row.val1, margin + colMetricW + 4, y + 4.2);

    if (row.highlight) {
      doc.setTextColor(37, 99, 235);
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setTextColor(15, 23, 42);
    }
    doc.text(row.val2, margin + colMetricW + colP1W + 4, y + 4.2);

    y += 6;
  });

  // ==========================================
  // PAGE 2: STRUCTURAL, MATERIALS & DELIVERABLES
  // ==========================================
  doc.addPage();
  y = 16;

  // Header Page 2
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `FIZA HAYAT STUDIO | SPECIFICATION MATRIX: ${project1.title.toUpperCase()} VS ${project2.title.toUpperCase()}`,
    margin + 4,
    y + 5.5
  );
  y += 14;

  // --- 5. TECHNICAL & STRUCTURAL SPECIFICATIONS ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('ARCHITECTURAL, STRUCTURAL & BIM SPECIFICATIONS', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Technical framing, digital twin standards, and environmental certifications.', margin, y + 4.5);

  y += 8;

  // Specs Table Header
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('TECHNICAL PARAMETER', margin + 4, y + 4.5);
  doc.text(`PROJECT A`, margin + colMetricW + 4, y + 4.5);
  doc.text(`PROJECT B`, margin + colMetricW + colP1W + 4, y + 4.5);

  y += 7;

  const specRows = [
    { label: 'Structural System & Framing', val1: specs1.structuralType, val2: specs2.structuralType },
    { label: 'Building Levels / Floors', val1: specs1.floors, val2: specs2.floors },
    { label: 'Energy & Sustainability Standard', val1: specs1.energyRating, val2: specs2.energyRating },
    { label: 'BIM Level of Development (LOD)', val1: specs1.bimLevel, val2: specs2.bimLevel }
  ];

  specRows.forEach((row, i) => {
    const isEven = i % 2 === 0;
    // Calculate row height based on text wrapping
    const val1Lines = doc.splitTextToSize(row.val1, colP1W - 8);
    const val2Lines = doc.splitTextToSize(row.val2, colP2W - 8);
    const lineCount = Math.max(val1Lines.length, val2Lines.length, 1);
    const rowH = Math.max(7, lineCount * 4 + 3);

    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(margin, y, contentWidth, rowH, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(margin, y + rowH, margin + contentWidth, y + rowH);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(row.label, margin + 4, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(val1Lines, margin + colMetricW + 4, y + 5);
    doc.text(val2Lines, margin + colMetricW + colP1W + 4, y + 5);

    y += rowH;
  });

  y += 6;

  // --- 6. MATERIALS & SOFTWARE COMPARISON ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('MATERIAL PALETTE & SOFTWARE TOOLING STACK', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Side-by-side assessment of specified exterior/interior materials and digital software tools.', margin, y + 4.5);

  y += 8;

  // Side-by-side materials and software box
  const boxW = (contentWidth - 6) / 2;

  // Materials Box (Project A on left, Project B on right)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, boxW, 40, 2, 2, 'FD');

  doc.roundedRect(margin + boxW + 6, y, boxW, 40, 2, 2, 'FD');

  // Box A Header
  doc.setFillColor(124, 58, 237);
  doc.rect(margin, y, boxW, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`PROJECT A: SPECIFIED MATERIALS & FINISHES`, margin + 4, y + 4);

  let matAY = y + 9.5;
  specs1.materials.slice(0, 5).forEach((m) => {
    doc.setFillColor(124, 58, 237);
    doc.circle(margin + 6, matAY - 1, 1, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text(m, margin + 9, matAY);
    matAY += 5;
  });

  // Box B Header
  doc.setFillColor(37, 99, 235);
  doc.rect(margin + boxW + 6, y, boxW, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`PROJECT B: SPECIFIED MATERIALS & FINISHES`, margin + boxW + 10, y + 4);

  let matBY = y + 9.5;
  specs2.materials.slice(0, 5).forEach((m) => {
    doc.setFillColor(37, 99, 235);
    doc.circle(margin + boxW + 12, matBY - 1, 1, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text(m, margin + boxW + 15, matBY);
    matBY += 5;
  });

  y += 45;

  // --- 7. DELIVERABLES & DRAWING PACKAGES ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('DELIVERABLES & TECHNICAL DRAWING PACKAGES', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Corroborated contractual drawing packages, permit sets, and computational assets included with each design.', margin, y + 4.5);

  y += 8;

  // Deliverables side by side
  const delBoxH = 38;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, boxW, delBoxH, 2, 2, 'FD');
  doc.roundedRect(margin + boxW + 6, y, boxW, delBoxH, 2, 2, 'FD');

  // Deliv A Header
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, boxW, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`PROJECT A: INCLUDED DELIVERABLES`, margin + 4, y + 4);

  let delAY = y + 9.5;
  specs1.deliverables.slice(0, 5).forEach((d) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(16, 185, 129); // check mark green
    doc.text('•', margin + 5, delAY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(d, margin + 9, delAY, { maxWidth: boxW - 12 });
    delAY += 5.5;
  });

  // Deliv B Header
  doc.setFillColor(15, 23, 42);
  doc.rect(margin + boxW + 6, y, boxW, 5.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`PROJECT B: INCLUDED DELIVERABLES`, margin + boxW + 10, y + 4);

  let delBY = y + 9.5;
  specs2.deliverables.slice(0, 5).forEach((d) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(16, 185, 129);
    doc.text('•', margin + boxW + 11, delBY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(d, margin + boxW + 15, delBY, { maxWidth: boxW - 12 });
    delBY += 5.5;
  });

  y += delBoxH + 5;

  // --- 8. STATUTORY QUALITY ASSURANCE & ARCHITECTURAL SIGN-OFF ---
  checkPageBreak(30);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('ARCHITECTURAL QUALITY ASSURANCE & STATUTORY VERIFICATION', margin + 5, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'This project comparison report is compiled in accordance with AIA / RIBA Stage Workflows, ISO 19650 BIM Information Management protocols, and international building estimation standards. Specifications and quantities reflect corroborated design documentation.',
    margin + 5,
    y + 11,
    { maxWidth: contentWidth - 48 }
  );

  doc.text(
    'For customized architectural proposals, hybrid scope synthesis, or construction administration queries: contact@fizahayat.com',
    margin + 5,
    y + 20
  );

  // Verification Seal Box
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(pageWidth - margin - 40, y + 3, 36, 18, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(196, 181, 253);
  doc.text('FIZA HAYAT STUDIO', pageWidth - margin - 22, y + 7.5, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('AUDIT VERIFIED', pageWidth - margin - 22, y + 12.5, { align: 'center' });
  doc.setFontSize(5.5);
  doc.setTextColor(148, 163, 184);
  doc.text('ISO 19650 STANDARDS', pageWidth - margin - 22, y + 16.5, { align: 'center' });

  // Add Page Numbers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Fiza Hayat Practice • Confidential Project Comparison Report • Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 6,
      { align: 'center' }
    );
  }

  // Safe file naming
  const safeName1 = project1.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 16);
  const safeName2 = project2.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 16);
  const safeFilename = `Fiza_Hayat_Comparison_${safeName1}_vs_${safeName2}.pdf`;

  doc.save(safeFilename);
}
