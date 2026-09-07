import { jsPDF } from 'jspdf';
import { 
  StructuralInspectionResult, 
  DamageAnnotation, 
  DetectedProblem, 
  PossibleRepairApproach,
  DamageCategory,
  ConcernLevel 
} from '../types/structuralInspector';

/**
 * Maps severity and damage type to a high-visibility hex color for annotations
 */
function getSeverityHex(severity: ConcernLevel, type?: DamageCategory): string {
  if (severity.includes('Critical')) return '#dc2626'; // red-600
  if (severity.includes('High')) return '#ea580c'; // orange-600
  if (type === 'crack') return '#ef4444'; // red-500
  if (type === 'spalling' || type === 'honeycombing') return '#d97706'; // amber-600
  if (type === 'corrosion') return '#b45309'; // amber-700
  if (type === 'water_moisture') return '#0891b2'; // cyan-600
  if (type === 'deformation') return '#9333ea'; // purple-600
  if (severity.includes('Moderate')) return '#d97706'; // amber-600
  return '#2563eb'; // blue-600
}

/**
 * Loads an image from a URL or Data URL with crossOrigin support and timeout
 */
function loadImageWithTimeout(url: string, timeoutMs = 8000): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Use anonymous CORS if not already a base64 data URL
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
 * Generates an offscreen canvas with composite damage annotations, bounding boxes, labels, and scale marks
 */
export async function renderAnnotatedImageForPdf(
  imageUrl: string,
  annotations: DamageAnnotation[] = [],
  structureType: string,
  imageIndex = 0
): Promise<{ dataUrl: string; width: number; height: number }> {
  const targetW = 1200;
  const targetH = 800;

  try {
    const img = await loadImageWithTimeout(imageUrl);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || targetW;
    canvas.height = img.naturalHeight || targetH;
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Could not get canvas context');

    // Draw photographic evidence
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Filter annotations for this image index if specified
    const matchingAnnotations = annotations.filter(ann => 
      ann.imageIndex === undefined || ann.imageIndex === imageIndex
    );

    // Draw annotations
    matchingAnnotations.forEach((ann, idx) => {
      const [ymin, xmin, ymax, xmax] = ann.box2d;
      const x = (xmin / 1000) * canvas.width;
      const y = (ymin / 1000) * canvas.height;
      const w = Math.max(25, ((xmax - xmin) / 1000) * canvas.width);
      const h = Math.max(25, ((ymax - ymin) / 1000) * canvas.height);

      const color = getSeverityHex(ann.severity, ann.type);

      // Semi-transparent highlight
      ctx.fillStyle = color + '2b';
      ctx.fillRect(x, y, w, h);

      // Solid bounding border
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(3, Math.round(canvas.width * 0.0035));
      ctx.strokeRect(x, y, w, h);

      // High-precision corner L-brackets
      const corner = Math.min(24, w * 0.28, h * 0.28);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = Math.max(2, Math.round(canvas.width * 0.0022));

      // Top-Left
      ctx.beginPath();
      ctx.moveTo(x, y + corner);
      ctx.lineTo(x, y);
      ctx.lineTo(x + corner, y);
      ctx.stroke();

      // Top-Right
      ctx.beginPath();
      ctx.moveTo(x + w - corner, y);
      ctx.lineTo(x + w, y);
      ctx.lineTo(x + w, y + corner);
      ctx.stroke();

      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(x, y + h - corner);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x + corner, y + h);
      ctx.stroke();

      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(x + w - corner, y + h);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x + w, y + h - corner);
      ctx.stroke();

      // Annotation Tag Pill
      const fontSize = Math.max(14, Math.round(canvas.width * 0.015));
      ctx.font = `bold ${fontSize}px sans-serif`;
      const label = `DEFECT #${idx + 1}: ${ann.label} [${ann.severity.toUpperCase()}]`;
      const textWidth = ctx.measureText(label).width;
      const tagPad = 8;
      const tagHeight = fontSize + 10;
      const tagY = Math.max(0, y - tagHeight - 4);

      ctx.fillStyle = color;
      ctx.fillRect(x, tagY, textWidth + tagPad * 2, tagHeight);

      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, x + tagPad, tagY + fontSize + 1);
    });

    // Technical Watermark Bar
    const barHeight = Math.max(32, Math.round(canvas.height * 0.045));
    ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
    ctx.fillRect(0, canvas.height - barHeight, canvas.width, barHeight);

    ctx.fillStyle = '#38bdf8'; // sky-400
    ctx.font = `bold ${Math.max(11, Math.round(barHeight * 0.38))}px sans-serif`;
    ctx.fillText('FIZA FIYAT AI STRUCTURAL INSPECTOR', 16, canvas.height - Math.round(barHeight * 0.35));

    ctx.fillStyle = '#e2e8f0';
    ctx.font = `normal ${Math.max(10, Math.round(barHeight * 0.34))}px sans-serif`;
    ctx.fillText(
      `• Preliminary Visual Audit (${structureType.toUpperCase()}) • Not Certified Structural Engineering Sign-off`,
      Math.max(260, Math.round(canvas.width * 0.28)),
      canvas.height - Math.round(barHeight * 0.35)
    );

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    return { dataUrl, width: canvas.width, height: canvas.height };

  } catch (err) {
    console.warn('Canvas export fallback triggered (CORS or image load constraint):', err);

    // High-tech blueprint fallback canvas if image has external CORS restriction
    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas fallback failed');

    // Navy blueprint background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Outer frame
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Title inside blueprint
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`VISUAL DEFECT MAPPING SCHEMATIC — ${structureType.toUpperCase()}`, 40, 55);

    // Render annotations on blueprint
    annotations.forEach((ann, idx) => {
      const [ymin, xmin, ymax, xmax] = ann.box2d;
      const x = (xmin / 1000) * (canvas.width - 80) + 40;
      const y = (ymin / 1000) * (canvas.height - 120) + 70;
      const w = Math.max(40, ((xmax - xmin) / 1000) * (canvas.width - 80));
      const h = Math.max(40, ((ymax - ymin) / 1000) * (canvas.height - 120));

      const color = getSeverityHex(ann.severity, ann.type);
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = color + '26';
      ctx.fillRect(x, y, w, h);

      ctx.fillStyle = color;
      ctx.fillRect(x, y - 26, 260, 24);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`#${idx + 1}: ${ann.label} (${ann.severity})`, x + 6, y - 9);
    });

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    return { dataUrl, width: targetW, height: targetH };
  }
}

/**
 * Downloads a formatted, multi-page professional PDF report using jsPDF,
 * containing the full AI assessment, detected issues, and embedded annotated image evidence.
 */
export async function downloadStructuralInspectionPdf(result: StructuralInspectionResult): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm
  let y = 16;

  // Helper to handle automatic page breaks
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 18) {
      doc.addPage();
      y = 16;
      // Continuation Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text(`FIZA FIYAT AI STRUCTURAL DAMAGE INSPECTION • REPORT #${result.id}`, margin, 10);
      doc.setFont('helvetica', 'normal');
      doc.text(result.structureType.toUpperCase(), pageWidth - margin, 10, { align: 'right' });
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, 12, pageWidth - margin, 12);
      y = 18;
    }
  };

  // Date formatting
  const dateFormatted = new Date(result.timestamp).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Severity colors for PDF
  const isCritical = result.severity === 'critical_looking';
  const isHigh = result.severity === 'high';
  const isModerate = result.severity === 'moderate';

  const sevR = isCritical ? 220 : isHigh ? 234 : isModerate ? 217 : 16;
  const sevG = isCritical ? 38 : isHigh ? 88 : isModerate ? 119 : 185;
  const sevB = isCritical ? 38 : isHigh ? 12 : isModerate ? 6 : 129;

  const bgR = isCritical ? 254 : isHigh ? 255 : isModerate ? 254 : 240;
  const bgG = isCritical ? 242 : isHigh ? 247 : isModerate ? 252 : 253;
  const bgB = isCritical ? 242 : isHigh ? 237 : isModerate ? 232 : 244;

  // ==========================================
  // 1. REPORT HEADER & BRANDING
  // ==========================================
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('FIZA FIYAT', margin + 6, y + 9);

  const isMultiBatch = result.isMultiImage || result.mediaType === 'multi_image' || Boolean(result.multiImageAssessment);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(56, 189, 248); // sky-400
  doc.text(
    isMultiBatch 
      ? 'CONSOLIDATED MULTI-IMAGE STRUCTURAL ASSESSMENT REPORT' 
      : 'AI STRUCTURAL DAMAGE INSPECTION REPORT', 
    margin + 6, 
    y + 16
  );
  doc.setFontSize(7);
  doc.setTextColor(203, 213, 225);
  doc.text(
    isMultiBatch
      ? `Civil Engineering Multi-Angle Diagnostic Audit • ${result.multiImageAssessment?.totalImagesAnalyzed || result.imageUrls?.length || 2} Photos Synthesized`
      : 'Civil Engineering Diagnostic Intelligence • Preliminary Visual Audit',
    margin + 6,
    y + 20
  );

  // Metadata block on right
  doc.setFontSize(7.5);
  doc.setTextColor(226, 232, 240);
  doc.setFont('helvetica', 'bold');
  doc.text(`REPORT #${result.id}`, pageWidth - margin - 6, y + 8, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(`Date: ${dateFormatted}`, pageWidth - margin - 6, y + 13, { align: 'right' });
  doc.text(`Target Structure: ${result.structureType.toUpperCase()}`, pageWidth - margin - 6, y + 17, { align: 'right' });
  doc.text(
    `Mode: ${isMultiBatch ? `BATCH (${result.multiImageAssessment?.totalImagesAnalyzed || result.imageUrls?.length || 2} PHOTOS)` : result.mediaType.toUpperCase()}`,
    pageWidth - margin - 6,
    y + 21,
    { align: 'right' }
  );

  y += 28;

  // ==========================================
  // 2. OVERALL PRELIMINARY ASSESSMENT BANNER
  // ==========================================
  doc.setFillColor(bgR, bgG, bgB);
  doc.setDrawColor(sevR, sevG, sevB);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(
    isMultiBatch ? 'CONSOLIDATED MULTI-IMAGE HEALTH ASSESSMENT' : 'PRELIMINARY STRUCTURAL HEALTH ASSESSMENT', 
    margin + 5, 
    y + 6
  );

  // Severity Badge
  doc.setFontSize(8);
  doc.setTextColor(sevR, sevG, sevB);
  const severityText = `SEVERITY: ${result.severity.toUpperCase().replace('_', ' ')}  |  CONFIDENCE: ${result.confidence.toUpperCase()}`;
  doc.text(severityText, pageWidth - margin - 5, y + 6, { align: 'right' });

  // Assessment text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  const assessmentText = result.multiImageAssessment?.consolidatedDiagnosis || result.overallAssessment;
  const assessmentLines = doc.splitTextToSize(assessmentText, contentWidth - 10);
  doc.text(assessmentLines, margin + 5, y + 12);

  // Recommendation warning
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(result.immediateProfessionalInspection === 'Strongly Recommended' ? 185 : 180, 28, 28);
  doc.text(
    `Immediate Physical On-Site Professional Audit: ${result.immediateProfessionalInspection.toUpperCase()}`,
    margin + 5,
    y + 22
  );

  y += 30;

  // ==========================================
  // MULTI-IMAGE SYNTHESIS SECTION (If Batch)
  // ==========================================
  if (isMultiBatch && result.multiImageAssessment) {
    checkPageBreak(35);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('1. CONSOLIDATED MULTI-IMAGE BATCH SYNTHESIS', margin, y);

    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.line(margin, y + 2, margin + 85, y + 2);
    y += 7;

    // Spatial spread box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 14, 1.5, 1.5, 'FD');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text('Spatial Spread & Distribution:', margin + 4, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const spreadLines = doc.splitTextToSize(result.multiImageAssessment.spatialSpreadEvaluation, contentWidth - 8);
    doc.text(spreadLines, margin + 4, y + 10);
    y += 18;

    // Cross-Image Correlations
    if (result.multiImageAssessment.crossImageCorrelations?.length) {
      checkPageBreak(25);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text('Cross-Photo Correlations & Corroborating Evidence:', margin, y);
      y += 4;

      result.multiImageAssessment.crossImageCorrelations.forEach((corr) => {
        checkPageBreak(10);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(51, 65, 85);
        const corrLines = doc.splitTextToSize(`• ${corr}`, contentWidth - 6);
        doc.text(corrLines, margin + 4, y);
        y += corrLines.length * 3.8 + 1;
      });
      y += 3;
    }

    // Photo-by-Photo Summary Table
    if (result.multiImageAssessment.imageSummaries?.length) {
      checkPageBreak(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text('Photo-by-Photo Breakdown:', margin, y);
      y += 4;

      // Table Header
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, y, contentWidth, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(71, 85, 105);
      doc.text('PHOTO', margin + 3, y + 4.2);
      doc.text('OBSERVED VIEW / ELEMENT', margin + 25, y + 4.2);
      doc.text('DISTRESS SUMMARY', margin + 85, y + 4.2);
      doc.text('DEFECTS', margin + 145, y + 4.2);
      doc.text('SEVERITY', pageWidth - margin - 4, y + 4.2, { align: 'right' });
      y += 6;

      result.multiImageAssessment.imageSummaries.forEach((sumItem, idx) => {
        checkPageBreak(8);
        const rowBg = idx % 2 === 0 ? 255 : 248;
        doc.setFillColor(rowBg, rowBg, rowBg);
        doc.rect(margin, y, contentWidth, 7, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(30, 41, 59);
        doc.text(`Photo #${sumItem.imageIndex + 1}`, margin + 3, y + 4.5);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        const viewTrunc = doc.splitTextToSize(sumItem.observedView || '-', 55)[0];
        doc.text(viewTrunc, margin + 25, y + 4.5);

        const distTrunc = doc.splitTextToSize(sumItem.distressSummary || '-', 55)[0];
        doc.text(distTrunc, margin + 85, y + 4.5);

        doc.text(`${sumItem.primaryFindingsCount}`, margin + 148, y + 4.5);

        doc.setFont('helvetica', 'bold');
        if (sumItem.keySeverity?.includes('Critical')) doc.setTextColor(220, 38, 38);
        else if (sumItem.keySeverity?.includes('High')) doc.setTextColor(234, 88, 12);
        else doc.setTextColor(37, 99, 235);
        doc.text(sumItem.keySeverity || 'Moderate', pageWidth - margin - 4, y + 4.5, { align: 'right' });

        y += 7;
      });
      y += 5;
    }
  }

  // ==========================================
  // 3. ANNOTATED IMAGE EVIDENCE SECTION
  // ==========================================
  checkPageBreak(30);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('1. ANNOTATED VISUAL EVIDENCE & DEFECT MAPPING', margin, y);

  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.line(margin, y + 2, margin + 70, y + 2);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Visible distress markers identified and mapped with computerized coordinates. Bounding boxes highlight suspected compromise.', margin, y);
  y += 5;

  // Determine images to render
  const imagesToRender: string[] = [];
  if (result.imageUrls && result.imageUrls.length > 0) {
    imagesToRender.push(...result.imageUrls);
  } else if (result.videoFindings && result.videoFindings[0]?.frameThumbnail) {
    imagesToRender.push(result.videoFindings[0].frameThumbnail);
  }

  // Fallback to demo structure if no imageUrls array is populated
  if (imagesToRender.length === 0) {
    imagesToRender.push('https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80');
  }

  // Render visual evidence photos (up to 4 for multi-image batch, 2 for single)
  const maxPhotosToRender = Math.min(imagesToRender.length, isMultiBatch ? 4 : 2);
  for (let imgIdx = 0; imgIdx < maxPhotosToRender; imgIdx++) {
    const imgUrl = imagesToRender[imgIdx];
    try {
      const rendered = await renderAnnotatedImageForPdf(
        imgUrl,
        result.annotations || [],
        result.structureType,
        imgIdx
      );

      const imgWidthMm = contentWidth;
      const imgHeightMm = Math.min(85, Math.round(imgWidthMm * (rendered.height / rendered.width)));

      checkPageBreak(imgHeightMm + 24);

      // Draw image in PDF
      doc.addImage(rendered.dataUrl, 'JPEG', margin, y, imgWidthMm, imgHeightMm);

      // Frame border around image
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.3);
      doc.rect(margin, y, imgWidthMm, imgHeightMm, 'S');

      y += imgHeightMm;

      // Caption Bar under Image
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, y, imgWidthMm, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);
      const photoLabel = result.multiImageAssessment?.imageSummaries?.[imgIdx]?.label || `Photo #${imgIdx + 1}`;
      const anomaliesCount = (result.annotations || []).filter(a => a.imageIndex === undefined || a.imageIndex === imgIdx).length;
      doc.text(
        `Figure 1.${imgIdx + 1}: ${result.structureType.toUpperCase()} Visual Evidence [${photoLabel}] • Marked Anomalies: ${anomaliesCount}`,
        margin + 4,
        y + 5
      );

      y += 12;
    } catch (e) {
      console.warn('Failed to embed annotated image in PDF:', e);
    }
  }

  // ==========================================
  // 4. DETECTED STRUCTURAL FINDINGS LIST
  // ==========================================
  checkPageBreak(35);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('2. DETECTED VISIBLE DISTRESS FINDINGS', margin, y);

  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.line(margin, y + 2, margin + 65, y + 2);
  y += 7;

  if (!result.findings || result.findings.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('No significant visual structural distress patterns detected in the media provided.', margin, y);
    y += 8;
  } else {
    for (let i = 0; i < result.findings.length; i++) {
      const f = result.findings[i];
      const evidenceLines = doc.splitTextToSize(f.evidence, contentWidth - 28);
      const boxHeight = 24 + (evidenceLines.length * 3.5) + (f.possibleCauses.length * 3.2);

      checkPageBreak(boxHeight + 4);

      // Finding Container
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentWidth, boxHeight, 1.5, 1.5, 'FD');

      // Title & Index Badge
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(margin + 3, y + 3, 6, 6, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text(`${i + 1}`, margin + 6, y + 7.2, { align: 'center' });

      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      const photoPrefix = (isMultiBatch && typeof f.imageIndex === 'number') ? `[Photo #${f.imageIndex + 1}] ` : '';
      doc.text(`${photoPrefix}${f.problem}`, margin + 12, y + 7);

      // Severity tag on right
      const isFindingCritical = f.severity.includes('Critical') || f.severity.includes('High');
      doc.setFontSize(7.5);
      doc.setTextColor(isFindingCritical ? 185 : 180, 28, 28);
      doc.text(`[${f.severity.toUpperCase()}]`, pageWidth - margin - 5, y + 7, { align: 'right' });

      // Location
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text('Location:', margin + 5, y + 13);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      doc.text(f.location, margin + 20, y + 13);

      // Evidence
      doc.setFont('helvetica', 'bold');
      doc.text('Visible Evidence:', margin + 5, y + 17.5);
      doc.setFont('helvetica', 'normal');
      doc.text(evidenceLines, margin + 31, y + 17.5);

      // Possible causes
      let causesY = y + 19.5 + (evidenceLines.length * 3.5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text('Possible Causes (Subject to field testing):', margin + 5, causesY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      f.possibleCauses.forEach((cause) => {
        causesY += 3.2;
        doc.text(`• ${cause}`, margin + 10, causesY);
      });

      y += boxHeight + 4;
    }
  }

  // ==========================================
  // 5. PRELIMINARY REPAIR & MITIGATION MATRIX
  // ==========================================
  if (result.possibleRepairApproaches && result.possibleRepairApproaches.length > 0) {
    checkPageBreak(35);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('3. PRELIMINARY REPAIR & MITIGATION APPROACH', margin, y);

    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.line(margin, y + 2, margin + 75, y + 2);
    y += 7;

    result.possibleRepairApproaches.forEach((r) => {
      const stepLinesCount = r.steps.length;
      const repBoxHeight = 22 + (stepLinesCount * 4) + (r.professionalWarning ? 8 : 0);

      checkPageBreak(repBoxHeight + 4);

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, repBoxHeight, 1.5, 1.5, 'FD');

      // Issue Type
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(r.issueType, margin + 4, y + 6);

      // Classification Badge
      const isStructural = r.repairClassification.includes('Potential Structural');
      doc.setFontSize(7.5);
      doc.setTextColor(isStructural ? 185 : 3, isStructural ? 28 : 105, isStructural ? 28 : 161);
      doc.text(r.repairClassification.toUpperCase(), pageWidth - margin - 4, y + 6, { align: 'right' });

      // Steps
      let stepY = y + 10.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      r.steps.forEach((step, sIdx) => {
        doc.text(`${sIdx + 1}. ${step}`, margin + 6, stepY);
        stepY += 3.8;
      });

      // Warning
      if (r.professionalWarning) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(185, 28, 28);
        doc.text(`⚠ ${r.professionalWarning}`, margin + 6, stepY + 3);
      }

      y += repBoxHeight + 4;
    });
  }

  // ==========================================
  // 6. RECOMMENDED FIELD INVESTIGATIONS & TESTS
  // ==========================================
  if (result.whatMayBeRequired && result.whatMayBeRequired.length > 0) {
    checkPageBreak(25 + (result.whatMayBeRequired.length * 4));

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('4. RECOMMENDED FIELD INVESTIGATIONS & TESTS', margin, y);

    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.line(margin, y + 2, margin + 78, y + 2);
    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);

    result.whatMayBeRequired.forEach((req) => {
      doc.text(`•  ${req}`, margin + 4, y);
      y += 4;
    });

    y += 4;
  }

  // ==========================================
  // 7. QUESTIONS FOR LICENSED ENGINEER
  // ==========================================
  if (result.questionsForEngineer && result.questionsForEngineer.length > 0) {
    checkPageBreak(25 + (result.questionsForEngineer.length * 4));

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('5. SUGGESTED QUESTIONS FOR STRUCTURAL ENGINEER', margin, y);

    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.line(margin, y + 2, margin + 82, y + 2);
    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);

    result.questionsForEngineer.forEach((q, qIdx) => {
      doc.text(`Q${qIdx + 1}:  ${q}`, margin + 4, y);
      y += 4;
    });

    y += 4;
  }

  // ==========================================
  // 8. MANDATORY LEGAL & ENGINEERING DISCLAIMER
  // ==========================================
  checkPageBreak(30);

  doc.setFillColor(254, 242, 242); // red-50
  doc.setDrawColor(248, 113, 113); // red-400
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(185, 28, 28);
  doc.text('CRITICAL SAFETY & LEGAL DISCLAIMER (MANDATORY REQUIREMENT)', margin + 5, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(127, 29, 29);
  const disclaimerLines = doc.splitTextToSize(result.safetyDisclaimer, contentWidth - 10);
  doc.text(disclaimerLines, margin + 5, y + 11);

  y += 28;

  // ==========================================
  // 9. ADD PROFESSIONAL FOOTERS ACROSS ALL PAGES
  // ==========================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'FIZA FIYAT AI Structural Damage Inspector • Preliminary Diagnostic Intelligence • Confidential',
      margin,
      pageHeight - 8
    );
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }

  // ==========================================
  // 10. TRIGGER DIRECT PDF DOWNLOAD
  // ==========================================
  const filename = `FIZA_FIYAT_Structural_Inspection_${result.structureType.replace(/[^a-zA-Z0-9]/g, '_')}_${result.id}.pdf`;
  doc.save(filename);
}

/**
 * Generates an HTML report string with embedded styling and media for web print preview
 */
export function generateStructuralReportHtml(result: StructuralInspectionResult): string {
  const dateFormatted = new Date(result.timestamp).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const severityColor = 
    result.severity === 'critical_looking' ? '#ef4444' :
    result.severity === 'high' ? '#f97316' :
    result.severity === 'moderate' ? '#eab308' : '#10b981';

  const severityBadgeBg = 
    result.severity === 'critical_looking' ? '#fef2f2' :
    result.severity === 'high' ? '#fff7ed' :
    result.severity === 'moderate' ? '#fefce8' : '#f0fdf4';

  const findingsHtml = (result.findings || []).map((f, i) => `
    <div style="margin-bottom: 16px; padding: 14px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f8fafc;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
        <span style="font-weight: 700; font-size: 14px; color: #0f172a;">${i + 1}. ${f.problem}</span>
        <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 9999px; background-color: ${f.severity.includes('Critical') || f.severity.includes('High') ? '#fee2e2' : '#fef3c7'}; color: ${f.severity.includes('Critical') || f.severity.includes('High') ? '#b91c1c' : '#b45309'};">
          ${f.severity}
        </span>
      </div>
      <div style="font-size: 12px; color: #64748b; margin-bottom: 6px;"><strong>Location:</strong> ${f.location}</div>
      <div style="font-size: 12px; color: #334155; margin-bottom: 8px; line-height: 1.5;"><strong>Visual Evidence:</strong> ${f.evidence}</div>
      <div style="font-size: 11px; color: #475569; background-color: #ffffff; padding: 8px; border-radius: 6px; border: 1px dashed #cbd5e1;">
        <strong>Possible Causes (Subject to On-Site Verification):</strong>
        <ul style="margin: 4px 0 0 16px; padding: 0;">
          ${f.possibleCauses.map(c => `<li style="margin-bottom: 2px;">${c}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');

  const imagesHtml = (result.imageUrls || []).map((imgUrl, i) => `
    <div style="margin-bottom: 16px; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
      <img src="${imgUrl}" alt="Inspection Evidence ${i + 1}" style="width: 100%; max-height: 350px; object-fit: cover;" />
      <div style="background-color: #f1f5f9; padding: 8px 12px; font-size: 11px; color: #334155; font-weight: 600;">
        Figure ${i + 1}: ${result.structureType} Visual Inspection Evidence
      </div>
    </div>
  `).join('');

  const repairHtml = (result.possibleRepairApproaches || []).map((r) => `
    <div style="margin-bottom: 14px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <span style="font-weight: 700; font-size: 13px; color: #1e293b;">${r.issueType}</span>
        <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 9999px; background-color: ${r.repairClassification.includes('Potential Structural') ? '#fee2e2' : '#e0f2fe'}; color: ${r.repairClassification.includes('Potential Structural') ? '#991b1b' : '#0369a1'};">
          ${r.repairClassification}
        </span>
      </div>
      <div style="font-size: 11px; color: #475569; margin-bottom: 6px;"><strong>General Sequence:</strong></div>
      <ol style="margin: 0 0 6px 16px; padding: 0; font-size: 11px; color: #334155; line-height: 1.5;">
        ${r.steps.map(s => `<li>${s}</li>`).join('')}
      </ol>
      ${r.materialsInvolved && r.materialsInvolved.length > 0 ? `
        <div style="font-size: 11px; color: #64748b;"><strong>Typical Materials:</strong> ${r.materialsInvolved.join(', ')}</div>
      ` : ''}
      ${r.professionalWarning ? `
        <div style="font-size: 10px; color: #b91c1c; background-color: #fef2f2; padding: 6px; border-radius: 4px; margin-top: 6px;">
          ⚠ ${r.professionalWarning}
        </div>
      ` : ''}
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FIZA FIYAT - AI Structural Damage Inspection Report</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background-color: #ffffff;
      margin: 0;
      padding: 20px;
      line-height: 1.5;
      font-size: 12px;
    }
    .header-box {
      border-bottom: 2px solid #3b82f6;
      padding-bottom: 15px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .title-main {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      margin: 0 0 4px 0;
    }
    .subtitle {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
      margin: 0;
    }
    .meta-box {
      text-align: right;
      font-size: 11px;
      color: #64748b;
    }
    .assessment-banner {
      background-color: ${severityBadgeBg};
      border: 1px solid ${severityColor};
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 20px;
    }
    .section-title {
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #1e293b;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin: 20px 0 12px 0;
    }
    .disclaimer-box {
      background-color: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      padding: 12px;
      font-size: 11px;
      color: #991b1b;
      margin-top: 25px;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="header-box">
    <div>
      <h1 class="title-main">FIZA FIYAT</h1>
      <p class="subtitle">AI Structural Damage Inspection Report</p>
    </div>
    <div class="meta-box">
      <div><strong>Report ID:</strong> ${result.id}</div>
      <div><strong>Generated:</strong> ${dateFormatted}</div>
      <div><strong>Structure:</strong> ${result.structureType.toUpperCase()}</div>
      <div><strong>Media Type:</strong> ${result.mediaType.toUpperCase()}</div>
    </div>
  </div>

  <div class="assessment-banner">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
      <span style="font-size: 14px; font-weight: 800; color: #0f172a;">OVERALL PRELIMINARY ASSESSMENT</span>
      <span style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: ${severityColor};">
        SEVERITY: ${result.severity.toUpperCase()} | CONFIDENCE: ${result.confidence.toUpperCase()}
      </span>
    </div>
    <div style="font-size: 13px; font-weight: 600; color: #1e293b; margin-bottom: 6px;">
      ${result.overallAssessment}
    </div>
    <div style="font-size: 12px; color: #475569;">
      <strong>Immediate On-Site Professional Audit:</strong> 
      <span style="font-weight: 700; color: ${result.immediateProfessionalInspection === 'Strongly Recommended' ? '#b91c1c' : '#b45309'};">
        ${result.immediateProfessionalInspection}
      </span>
    </div>
  </div>

  ${imagesHtml ? `
    <div class="section-title">ANNOTATED VISUAL EVIDENCE</div>
    ${imagesHtml}
  ` : ''}

  <div class="section-title">1. VISIBLE FINDINGS & DISTRESS EVIDENCE</div>
  ${findingsHtml || '<p style="font-size: 12px; color: #64748b;">No significant visual distress patterns detected in the media provided.</p>'}

  <div class="section-title">2. PRELIMINARY REPAIR APPROACH</div>
  ${repairHtml}

  <div class="disclaimer-box">
    <strong>CRITICAL SAFETY & LEGAL DISCLAIMER:</strong><br/>
    ${result.safetyDisclaimer}
  </div>
</body>
</html>
  `;
}
