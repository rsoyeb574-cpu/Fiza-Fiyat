import { jsPDF } from 'jspdf';
import { Project } from '../types';
import { getProjectSpecs, NormalizedProjectSpecs } from './projectComparison';

/**
 * Loads an image from a URL or Data URL with cross-origin handling and timeout
 */
function loadImageWithTimeout(url: string, timeoutMs = 7000): Promise<HTMLImageElement> {
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
function convertImageToDataUrl(img: HTMLImageElement, maxWidth = 1400, maxHeight = 900): string {
  const canvas = document.createElement('canvas');
  let w = img.naturalWidth || 1000;
  let h = img.naturalHeight || 600;

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

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);

  return canvas.toDataURL('image/jpeg', 0.88);
}

/**
 * Generates an architectural blueprint illustration as fallback if remote image loading fails
 */
function createBlueprintPlaceholder(title: string, category: string, width = 1200, height = 650): string {
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
  const gridSize = 30;
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
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  // Corner registration marks
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(26, 26, 8, 8);
  ctx.fillRect(width - 34, 26, 8, 8);
  ctx.fillRect(26, height - 34, 8, 8);
  ctx.fillRect(width - 34, height - 34, 8, 8);

  // Title & Subtitle
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText(title.toUpperCase(), 60, 80);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(`ARCHITECTURAL SCHEMATIC & DIGITAL TWIN • ${category.toUpperCase()}`, 60, 115);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px sans-serif';
  ctx.fillText('Federated BIM Model • Structural Engineering & Spatial Design Coordination', 60, 145);

  // Center architectural schematic badge
  const boxW = 380;
  const boxH = 150;
  const boxX = (width - boxW) / 2;
  const boxY = (height - boxH) / 2 + 30;

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(boxX, boxY, boxW, boxH);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FIZA HAYAT STUDIO', width / 2, boxY + 45);

  ctx.font = '13px sans-serif';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('ARCHITECTURAL & BIM INTELLIGENCE', width / 2, boxY + 75);

  ctx.font = '11px sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('High-Fidelity 3D Model & Technical Dossier', width / 2, boxY + 110);
  ctx.textAlign = 'left';

  return canvas.toDataURL('image/jpeg', 0.9);
}

/**
 * Safely fetches and prepares an image data URL with fallback
 */
async function prepareImageDataUrl(imageUrl?: string, title = 'Project', category = 'Architecture'): Promise<string> {
  if (!imageUrl) {
    return createBlueprintPlaceholder(title, category);
  }

  try {
    const img = await loadImageWithTimeout(imageUrl, 6000);
    return convertImageToDataUrl(img);
  } catch (err) {
    console.warn('Could not load project image directly (CORS or network), using procedural architectural blueprint:', err);
    return createBlueprintPlaceholder(title, category);
  }
}

/**
 * Generates a polished, multi-page vector PDF report of a selected project's
 * complete specifications, imagery, cost breakdown, and architectural narrative.
 */
export async function downloadProjectSummaryPdf(project: Project): Promise<void> {
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

  const specs: NormalizedProjectSpecs = getProjectSpecs(project);
  const dateFormatted = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const reportRef = `FH-PRJ-${project.id.toUpperCase().replace(/[^a-zA-Z0-9]/g, '').slice(0, 8) || '2026'}`;

  // Helper for automated page breaks
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = 16;
      // Continuation Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text(`FIZA HAYAT ARCHITECTURAL & BIM STUDIO • PROJECT DOSSIER: ${project.title.toUpperCase().slice(0, 45)}`, margin, 10);
      doc.setFont('helvetica', 'normal');
      doc.text(reportRef, pageWidth - margin, 10, { align: 'right' });
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, 12, pageWidth - margin, 12);
      y = 18;
    }
  };

  // Pre-load primary hero visual
  const primaryImageUrl = project.coverImage || project.heroImage || project.images?.[0];
  const heroDataUrl = await prepareImageDataUrl(primaryImageUrl, project.title, project.categoryName);

  // Pre-load secondary visual if available
  let secondaryDataUrl: string | null = null;
  const secondaryImageUrl = project.images?.find(img => img !== primaryImageUrl) || project.gallery?.[0];
  if (secondaryImageUrl) {
    try {
      secondaryDataUrl = await prepareImageDataUrl(secondaryImageUrl, project.title, 'Interior & Detail');
    } catch {
      secondaryDataUrl = null;
    }
  }

  // ==========================================
  // PAGE 1: HEADER & EXECUTIVE BRANDING
  // ==========================================
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('FIZA HAYAT ARCHITECTURAL & BIM STUDIO', margin + 6, y + 8);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(56, 189, 248); // sky-400
  doc.text('EXECUTIVE PROJECT SUMMARY & TECHNICAL DOSSIER', margin + 6, y + 15);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('Global Architecture • LOD 400 BIM Modeling • Digital Twin Coordination • Structural Feasibility', margin + 6, y + 21);

  // Header metadata box on right
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(248, 250, 252);
  doc.text(`REF #${reportRef}`, pageWidth - margin - 6, y + 8, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(`Date Issued: ${dateFormatted}`, pageWidth - margin - 6, y + 13, { align: 'right' });
  doc.text(`Classification: OFFICIAL CLIENT DOSSIER`, pageWidth - margin - 6, y + 17, { align: 'right' });
  doc.setTextColor(52, 211, 153); // emerald-400
  doc.setFont('helvetica', 'bold');
  doc.text(`Status: COMMISIONED / APPROVED`, pageWidth - margin - 6, y + 21, { align: 'right' });

  y += 30;

  // ==========================================
  // PROJECT IDENTITY & QUICK METADATA STRIP
  // ==========================================
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 23, 2, 2, 'FD');

  // Category Tag Pill
  doc.setFillColor(37, 99, 235); // blue-600
  doc.roundedRect(margin + 4, y + 4, 38, 5, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text((project.categoryName || 'ARCHITECTURE').toUpperCase().slice(0, 24), margin + 6, y + 7.5);

  // Project Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  const truncatedTitle = project.title.length > 55 ? `${project.title.slice(0, 52)}...` : project.title;
  doc.text(truncatedTitle, margin + 46, y + 8);

  // Meta items row
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  const colW = contentWidth / 4;
  // Col 1: Client
  doc.text('Client:', margin + 4, y + 15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text((project.clientName || 'Private Client').slice(0, 22), margin + 4, y + 19);

  // Col 2: Location
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Location:', margin + colW + 2, y + 15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text((project.location || 'Global Metro').slice(0, 22), margin + colW + 2, y + 19);

  // Col 3: Date / Timeline
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Timeline / Date:', margin + colW * 2 + 2, y + 15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${project.projectDate || project.year || '2025-2026'}`, margin + colW * 2 + 2, y + 19);

  // Col 4: Est. Budget
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Est. Budget:', margin + colW * 3 + 2, y + 15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105); // emerald-600
  doc.text(`${specs.estimatedCost}`, margin + colW * 3 + 2, y + 19);

  y += 27;

  // ==========================================
  // HERO PERSPECTIVE VISUAL / RENDERING EMBED
  // ==========================================
  const imgHeight = 72; // mm
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.rect(margin, y, contentWidth, imgHeight);

  if (heroDataUrl) {
    try {
      doc.addImage(heroDataUrl, 'JPEG', margin, y, contentWidth, imgHeight, undefined, 'FAST');
    } catch (e) {
      console.warn('Failed to embed primary image to PDF:', e);
    }
  }

  // Image Caption Bar
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y + imgHeight - 6, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`FIGURE 1: PRIMARY ARCHITECTURAL PERSPECTIVE & FACADE COMPOSITION • ${project.title.toUpperCase()}`, margin + 4, y + imgHeight - 2);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Fiza Hayat Studio 3D CGI & BIM Visualization Pipeline', pageWidth - margin - 4, y + imgHeight - 2, { align: 'right' });

  y += imgHeight + 4;

  // ==========================================
  // TECHNICAL SPECIFICATIONS MATRIX (8-POINT GRID)
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('TECHNICAL SPECIFICATIONS & ENGINEERING METRICS', margin, y + 4);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Verified BIM & Structural Parameters', pageWidth - margin, y + 4, { align: 'right' });

  y += 7;

  // 4 rows x 2 columns table
  const specRowHeight = 8.5;
  const halfW = contentWidth / 2 - 2;

  const specGrid = [
    {
      label1: 'Scale / Built-Up Area',
      val1: specs.area,
      label2: 'Structural Framing System',
      val2: specs.structuralType
    },
    {
      label1: 'Estimated Investment Budget',
      val1: specs.estimatedCost,
      isMoney1: true,
      label2: 'Building Levels / Height',
      val2: specs.floors
    },
    {
      label1: 'Unit Execution Rate',
      val1: specs.costPerSqFt,
      label2: 'Sustainability & Energy Rating',
      val2: specs.energyRating
    },
    {
      label1: 'Project Duration / Timeline',
      val1: specs.duration,
      label2: 'BIM Coordination & LOD Level',
      val2: specs.bimLevel
    }
  ];

  specGrid.forEach((row, idx) => {
    const isEven = idx % 2 === 0;
    const rowY = y + idx * specRowHeight;

    // Left Cell
    doc.setFillColor(isEven ? 248 : 255, isEven ? 250 : 255, isEven ? 252 : 255);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.rect(margin, rowY, halfW, specRowHeight, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(row.label1, margin + 3, rowY + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    if (row.isMoney1) {
      doc.setTextColor(5, 150, 105); // emerald-600
    } else {
      doc.setTextColor(15, 23, 42);
    }
    doc.text(row.val1.slice(0, 32), margin + halfW - 3, rowY + 5.5, { align: 'right' });

    // Right Cell
    const rightX = margin + halfW + 4;
    doc.setFillColor(isEven ? 248 : 255, isEven ? 250 : 255, isEven ? 252 : 255);
    doc.rect(rightX, rowY, halfW, specRowHeight, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(row.label2, rightX + 3, rowY + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(row.val2.slice(0, 34), rightX + halfW - 3, rowY + 5.5, { align: 'right' });
  });

  y += specGrid.length * specRowHeight + 6;

  // ==========================================
  // COST BREAKDOWN DISTRIBUTION SECTION
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('PROJECT FINANCIAL & COST DISTRIBUTION HEADS', margin, y + 3);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Estimated distribution across principal project phases', pageWidth - margin, y + 3, { align: 'right' });

  y += 6;

  const costCards = [
    { title: 'Architectural Design', share: '8%', amount: specs.costBreakdown.architectural, color: [37, 99, 235] },
    { title: 'BIM 3D & Coordination', share: '4%', amount: specs.costBreakdown.bimAnd3d, color: [124, 58, 237] },
    { title: 'Structural & MEP Eng.', share: '6%', amount: specs.costBreakdown.engineering, color: [14, 165, 233] },
    { title: 'Construction Execution', share: '82%', amount: specs.costBreakdown.constructionEst, color: [5, 150, 105] }
  ];

  const cardW = (contentWidth - 9) / 4; // 4 cards with 3mm gap

  costCards.forEach((c, i) => {
    const cx = margin + i * (cardW + 3);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(cx, y, cardW, 18, 1.5, 1.5, 'FD');

    // Colored accent top bar
    doc.setFillColor(c.color[0], c.color[1], c.color[2]);
    doc.roundedRect(cx, y, cardW, 2.5, 1, 1, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(c.title, cx + cardW / 2, y + 7, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(c.amount, cx + cardW / 2, y + 12, { align: 'center' });

    doc.setFontSize(6.5);
    doc.setTextColor(c.color[0], c.color[1], c.color[2]);
    doc.text(`Approx. ${c.share} Total`, cx + cardW / 2, y + 16, { align: 'center' });
  });

  y += 22;

  // Page 1 Transition Hint
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Continued on Page 2: Architectural Narrative, Materials Schedule, Software Stack & Certification →', pageWidth / 2, pageHeight - 16, { align: 'center' });

  // ==========================================
  // PAGE 2: NARRATIVE, SECONDARY GALLERY, DELIVERABLES & CERTIFICATION
  // ==========================================
  doc.addPage();
  y = 16;

  // Header banner page 2
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`FIZA HAYAT ARCHITECTURAL & BIM STUDIO • PROJECT DOSSIER: ${project.title.toUpperCase()}`, margin, 10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Page 2 • Technical Appendices & Scope`, pageWidth - margin, 10, { align: 'right' });
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, 12, pageWidth - margin, 12);

  // SECTION 1: ARCHITECTURAL & ENGINEERING NARRATIVE
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('1. ARCHITECTURAL & ENGINEERING DESIGN RATIONALE', margin, y + 4);

  y += 7;

  // Box with description
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);

  const narrativeText = project.description || 'This architectural project exemplifies contemporary spatial planning, structural integrity, and energy-conscious design principles.';
  const wrappedDescription = doc.splitTextToSize(narrativeText, contentWidth - 10);
  const narrativeBoxH = Math.max(18, wrappedDescription.length * 4 + 8);

  doc.roundedRect(margin, y, contentWidth, narrativeBoxH, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text(wrappedDescription, margin + 5, y + 6);

  y += narrativeBoxH + 4;

  // Optional Full Content Excerpt if present
  if (project.fullContent) {
    const fullExcerpt = project.fullContent.slice(0, 380).replace(/(\r\n|\n|\r)/gm, ' ');
    const wrappedFull = doc.splitTextToSize(fullExcerpt + (project.fullContent.length > 380 ? '...' : ''), contentWidth - 10);
    const fullBoxH = Math.max(14, wrappedFull.length * 3.6 + 6);

    checkPageBreak(fullBoxH + 4);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, fullBoxH, 'FD');

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(wrappedFull, margin + 5, y + 5);

    y += fullBoxH + 5;
  }

  // SECTION 2: SECONDARY VISUAL SHOWCASE / DETAIL GALLERY
  if (secondaryDataUrl) {
    checkPageBreak(56);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text('2. SPATIAL DETAIL & BIM COORDINATION VIEW', margin, y + 4);

    y += 7;

    const secImgH = 46;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.4);
    doc.rect(margin, y, contentWidth, secImgH);

    try {
      doc.addImage(secondaryDataUrl, 'JPEG', margin, y, contentWidth, secImgH, undefined, 'FAST');
    } catch (e) {
      console.warn('Failed to embed secondary image to PDF:', e);
    }

    doc.setFillColor(15, 23, 42);
    doc.rect(margin, y + secImgH - 5, contentWidth, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(255, 255, 255);
    doc.text('FIGURE 2: DETAILED INTERIOR / FACADE APPARATUS & SPATIAL INTEGRATION', margin + 4, y + secImgH - 1.5);

    y += secImgH + 6;
  }

  // SECTION 3: SPECIFIED MATERIALS & FINISHES
  checkPageBreak(28);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('3. MATERIAL SPECIFICATIONS & ENVELOPE FINISHES', margin, y + 4);

  y += 7;

  const materials = specs.materials.length > 0 ? specs.materials : [
    'Reinforced Structural Concrete (Grade M35/M40)',
    'Low-E Acoustic Performance Glazing',
    'Architectural Travertine & Natural Stone Cladding',
    'Thermally-Treated Sustainable Hardwood Accents'
  ];

  const matColW = contentWidth / 2 - 2;
  materials.slice(0, 4).forEach((mat, idx) => {
    const isRight = idx % 2 === 1;
    const rowIdx = Math.floor(idx / 2);
    const mx = isRight ? margin + matColW + 4 : margin;
    const my = y + rowIdx * 8;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.rect(mx, my, matColW, 7, 'FD');

    // Small blue dot
    doc.setFillColor(37, 99, 235);
    doc.circle(mx + 3.5, my + 3.5, 1.2, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(mat.slice(0, 40), mx + 7, my + 4.8);
  });

  y += Math.ceil(Math.min(materials.length, 4) / 2) * 8 + 6;

  // SECTION 4: BIM SOFTWARE STACK & OFFICIAL DELIVERABLES
  checkPageBreak(32);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('4. TECHNOLOGY PIPELINE & CONTRACTED DELIVERABLES', margin, y + 4);

  y += 7;

  const stackColW = contentWidth / 2 - 2;

  // Left side: Software Tools
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, stackColW, 26, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(37, 99, 235);
  doc.text('SOFTWARE & COMPUTATIONAL STACK', margin + 4, y + 5.5);

  const softwareList = project.softwareUsed?.length ? project.softwareUsed : ['Autodesk Revit', 'AutoCAD', '3ds Max & V-Ray', 'Rhino Grasshopper'];
  softwareList.slice(0, 4).forEach((sw, idx) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);
    doc.text(`• ${sw}`, margin + 5, y + 10.5 + idx * 3.8);
  });

  // Right side: Deliverables Included
  const delivX = margin + stackColW + 4;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(delivX, y, stackColW, 26, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(5, 150, 105);
  doc.text('APPROVED DRAWING & ASSET SCHEDULE', delivX + 4, y + 5.5);

  const deliverables = specs.deliverables.length ? specs.deliverables : [
    'Full 2D CAD Plans & Detailed Sections',
    'Federated LOD 400 BIM Model (Revit)',
    'Photorealistic 8K Render Suite',
    'Comprehensive Bill of Quantities (BOQ)'
  ];

  deliverables.slice(0, 4).forEach((d, idx) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);
    doc.text(`✓ ${d.slice(0, 36)}`, delivX + 5, y + 10.5 + idx * 3.8);
  });

  y += 30;

  // SECTION 5: EXECUTIVE STUDIO CERTIFICATION & SIGN-OFF
  checkPageBreak(30);

  doc.setFillColor(241, 245, 249); // slate-100
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('OFFICIAL STUDIO CERTIFICATION & CONTACT', margin + 5, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('Fiza Hayat Architectural & Digital Twin Studio • Global Design & BIM Practice', margin + 5, y + 11);
  doc.text('Email: contact@fizahayat.com • Web: https://fizahayat.com • Tel: +91 98765 43210', margin + 5, y + 15);
  doc.text('Confidential Document — All architectural layouts, renders, and engineering data are proprietary.', margin + 5, y + 19);

  // Right side signature mark
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(37, 99, 235);
  doc.text('DIGITALLY VERIFIED', pageWidth - margin - 5, y + 6, { align: 'right' });
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('Fiza Hayat', pageWidth - margin - 5, y + 14, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Principal Architect & Lead Director', pageWidth - margin - 5, y + 19, { align: 'right' });

  // ==========================================
  // FOOTERS ACROSS ALL PAGES
  // ==========================================
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `FIZA HAYAT Architectural & BIM Studio • Project Summary: ${project.title.slice(0, 40)} • Ref #${reportRef}`,
      margin,
      pageHeight - 7
    );
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  }

  // ==========================================
  // TRIGGER DOWNLOAD
  // ==========================================
  const safeFilename = `Fiza_Hayat_Project_Summary_${project.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}_${project.id.slice(0, 8)}.pdf`;
  doc.save(safeFilename);
}

/**
 * Opens a print-ready, high-resolution HTML summary in a new window as an alternative preview
 */
export function openProjectSummaryPrintView(project: Project): void {
  const specs = getProjectSpecs(project);
  const dateFormatted = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${project.title} - Project Summary Report</title>
  <style>
    @page { size: A4; margin: 12mm 15mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background-color: #ffffff;
      margin: 0;
      padding: 20px;
      line-height: 1.5;
      font-size: 12px;
    }
    .header {
      background: #0f172a;
      color: #ffffff;
      padding: 16px 20px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .brand { font-size: 18px; font-weight: 800; letter-spacing: -0.5px; }
    .sub { font-size: 11px; color: #38bdf8; font-weight: 600; text-transform: uppercase; margin-top: 2px; }
    .meta-box { text-align: right; font-size: 11px; color: #94a3b8; }
    .hero-img { width: 100%; max-height: 380px; object-fit: cover; border-radius: 8px; margin-bottom: 20px; }
    .spec-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
    .spec-card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 14px; border-radius: 6px; display: flex; justify-content: space-between; }
    .cost-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
    .cost-box { background: #f8fafc; border: 1px solid #e2e8f0; border-top: 3px solid #3b82f6; padding: 10px; border-radius: 6px; text-align: center; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 30px; font-size: 11px; color: #64748b; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">FIZA HAYAT ARCHITECTURAL & BIM STUDIO</div>
      <div class="sub">Executive Project Summary & Technical Dossier</div>
    </div>
    <div class="meta-box">
      <div><strong>REF:</strong> FH-PRJ-${project.id.slice(0, 8).toUpperCase()}</div>
      <div><strong>Date:</strong> ${dateFormatted}</div>
      <div style="color: #34d399;"><strong>Status:</strong> Approved</div>
    </div>
  </div>

  <h1 style="font-size: 24px; margin: 0 0 6px 0; color: #0f172a;">${project.title}</h1>
  <p style="color: #64748b; font-size: 12px; margin: 0 0 16px 0;">
    Category: <strong>${project.categoryName}</strong> • Client: <strong>${project.clientName}</strong> • Location: <strong>${project.location || 'Global Metro'}</strong>
  </p>

  ${project.coverImage ? `<img src="${project.coverImage}" class="hero-img" alt="${project.title}" />` : ''}

  <h3 style="font-size: 14px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px;">Technical Specifications</h3>
  <div class="spec-grid">
    <div class="spec-card"><span>Built-Up Area:</span><strong>${specs.area}</strong></div>
    <div class="spec-card"><span>Structural System:</span><strong>${specs.structuralType}</strong></div>
    <div class="spec-card"><span>Estimated Cost:</span><strong style="color: #059669;">${specs.estimatedCost}</strong></div>
    <div class="spec-card"><span>Levels / Floors:</span><strong>${specs.floors}</strong></div>
    <div class="spec-card"><span>Rate per Sq.Ft:</span><strong>${specs.costPerSqFt}</strong></div>
    <div class="spec-card"><span>Sustainability:</span><strong>${specs.energyRating}</strong></div>
    <div class="spec-card"><span>Execution Timeline:</span><strong>${specs.duration}</strong></div>
    <div class="spec-card"><span>BIM Level:</span><strong>${specs.bimLevel}</strong></div>
  </div>

  <h3 style="font-size: 14px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px;">Cost Breakdown</h3>
  <div class="cost-grid">
    <div class="cost-box">
      <div style="font-size: 10px; color: #64748b;">Architectural (8%)</div>
      <div style="font-size: 13px; font-weight: bold; margin-top: 4px;">${specs.costBreakdown.architectural}</div>
    </div>
    <div class="cost-box" style="border-top-color: #8b5cf6;">
      <div style="font-size: 10px; color: #64748b;">BIM & 3D (4%)</div>
      <div style="font-size: 13px; font-weight: bold; margin-top: 4px;">${specs.costBreakdown.bimAnd3d}</div>
    </div>
    <div class="cost-box" style="border-top-color: #0ea5e9;">
      <div style="font-size: 10px; color: #64748b;">Engineering (6%)</div>
      <div style="font-size: 13px; font-weight: bold; margin-top: 4px;">${specs.costBreakdown.engineering}</div>
    </div>
    <div class="cost-box" style="border-top-color: #10b981;">
      <div style="font-size: 10px; color: #64748b;">Construction (82%)</div>
      <div style="font-size: 13px; font-weight: bold; margin-top: 4px;">${specs.costBreakdown.constructionEst}</div>
    </div>
  </div>

  <h3 style="font-size: 14px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 8px;">Architectural Narrative</h3>
  <p style="font-size: 12px; color: #334155; line-height: 1.6; margin-bottom: 20px;">
    ${project.description}
  </p>

  <div class="footer">
    <div>Fiza Hayat Architectural & BIM Studio • contact@fizahayat.com • www.fizahayat.com</div>
    <div>Official Client Summary Dossier</div>
  </div>

  <script>
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => window.print(), 500);
    });
  </script>
</body>
</html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  }
}

/**
 * Adapter to generate a project summary PDF for Enterprise client projects
 */
export async function downloadEnterpriseProjectSummaryPdf(ep: {
  id: string;
  title: string;
  clientName: string;
  status: string;
  progressPercent: number;
  startDate?: string;
  estimatedCompletionDate?: string;
  budgetINR?: number;
  media?: { type: string; url: string }[];
  deliverables?: { title: string; status: string }[];
}): Promise<void> {
  const coverImg = ep.media?.find(m => m.type === 'Image')?.url || 
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

  const adapted: Project = {
    id: ep.id,
    title: ep.title,
    slug: ep.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: `Official enterprise project dossier for ${ep.clientName}. Project execution phase: ${ep.status} with ${ep.progressPercent}% milestone delivery completed.`,
    categoryId: 'enterprise-bim',
    categoryName: 'Enterprise Architecture & BIM',
    images: ep.media?.filter(m => m.type === 'Image').map(m => m.url) || [coverImg],
    coverImage: coverImg,
    softwareUsed: ['Autodesk Revit', 'AutoCAD 2026', 'Navisworks Manage', 'BIM 360 Docs'],
    tags: ['Enterprise', 'BIM LOD 400', 'Digital Twin', 'Structural'],
    projectDate: ep.startDate || new Date().toISOString().split('T')[0],
    clientName: ep.clientName || 'Enterprise Client',
    location: 'Regional Hub / Active Site',
    estimatedCost: ep.budgetINR ? `₹${(ep.budgetINR / 100000).toFixed(1)} Lakhs` : '$950,000',
    costNumeric: ep.budgetINR,
    duration: ep.estimatedCompletionDate ? `Target: ${ep.estimatedCompletionDate}` : '12 Months',
    area: '14,500 sq.ft',
    structuralType: 'Reinforced Post-Tensioned Concrete & Structural Steel Frame',
    floors: 'G + 4 Commercial Levels',
    energyRating: 'GRIHA 4-Star / LEED Gold Pre-certified',
    bimLevel: 'LOD 400 (Fabrication & Detailing)',
    createdAt: new Date().toISOString()
  };

  return downloadProjectSummaryPdf(adapted);
}

