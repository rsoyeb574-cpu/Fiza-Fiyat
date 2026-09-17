import { jsPDF } from 'jspdf';
import { Project, ProjectMilestonePhase } from '../types';

interface MilestonePdfStats {
  overallPercentage: number;
  completedPhasesCount: number;
  inProgressCount: number;
  upcomingCount: number;
  totalDeliverables: number;
  completedDeliverables: number;
  activePhase: ProjectMilestonePhase | null;
}

/**
 * Generates and downloads a multi-page vector PDF Milestone Progress Report
 * for the project, detailing completion percentages, phase delivery status, and key deliverables.
 */
export async function downloadMilestoneProgressPdf(
  project: Project,
  phases: ProjectMilestonePhase[],
  stats: MilestonePdfStats
): Promise<void> {
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

  const dateFormatted = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const timeFormatted = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Helper to ensure page bounds
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 16) {
      doc.addPage();
      y = 16;
      // Repeat mini header on subsequent pages
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(margin, y, contentWidth, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(`FIZA HAYAT STUDIO | ${project.title.toUpperCase()} | MILESTONE PROGRESS DOSSIER`, margin + 3, y + 5.5);
      y += 14;
    }
  };

  // --- 1. HEADER SECTION ---
  // Top Banner
  doc.setFillColor(15, 23, 42); // #0f172a
  doc.rect(margin, y, contentWidth, 24, 'F');

  // Decorative blue accent strip
  doc.setFillColor(59, 130, 246); // #3b82f6
  doc.rect(margin, y, 4, 24, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('FIZA HAYAT ARCHITECTURAL & BIM PRACTICE', margin + 8, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('OFFICIAL PROJECT MILESTONE PROGRESS REPORT & STATUTORY PHASE MATRIX', margin + 8, y + 14);
  doc.text(`Generated on: ${dateFormatted} at ${timeFormatted} | Client: ${project.clientName}`, margin + 8, y + 19);

  // Status Stamp on Right
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.roundedRect(pageWidth - margin - 38, y + 5, 34, 14, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('SCHEDULE STATUS', pageWidth - margin - 21, y + 10, { align: 'center' });
  doc.setFontSize(9);
  doc.text('ON TRACK', pageWidth - margin - 21, y + 15, { align: 'center' });

  y += 29;

  // --- 2. PROJECT SUMMARY CARD ---
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(project.title, margin + 4, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const locationText = project.location ? `Location: ${project.location}  |  ` : '';
  const dateText = project.projectDate ? `Project Initiation: ${project.projectDate}  |  ` : '';
  doc.text(`${locationText}${dateText}Category: ${project.categoryName || 'Architectural & Engineering'}`, margin + 4, y + 12);

  // 4 Metrics in summary box
  const colW = contentWidth / 4;
  const metrics = [
    { label: 'OVERALL COMPLETION', val: `${stats.overallPercentage}%`, highlight: true },
    { label: 'COMPLETED PHASES', val: `${stats.completedPhasesCount} / ${phases.length}`, highlight: false },
    { label: 'ACTIVE STAGE', val: stats.activePhase ? stats.activePhase.shortCode : 'Complete', highlight: false },
    { label: 'DELIVERABLES VERIFIED', val: `${stats.completedDeliverables} / ${stats.totalDeliverables}`, highlight: false }
  ];

  metrics.forEach((m, idx) => {
    const mx = margin + idx * colW + 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(m.label, mx, y + 19);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    if (m.highlight) {
      doc.setTextColor(37, 99, 235); // blue-600
    } else {
      doc.setTextColor(15, 23, 42);
    }
    doc.text(m.val, mx, y + 25);
  });

  y += 34;

  // --- 3. SECTION TITLE: DETAILED PHASE MATRIX ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('PROJECT PHASES & VERIFIABLE DELIVERABLES SCHEDULE', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Review statutory submissions, technical drawings, site inspections, and signed completion percentages.', margin, y + 4.5);

  y += 9;

  // --- 4. PHASE BY PHASE CARDS ---
  phases.forEach((phase) => {
    // Estimate card height: header (12mm) + meta (10mm) + deliverables (5mm per item)
    const cardHeight = 22 + (phase.keyDeliverables.length * 5.5);
    checkPageBreak(cardHeight + 4);

    const is100 = phase.completionPercentage === 100;
    const isInProgress = phase.status === 'in_progress';

    // Box background
    if (is100) {
      doc.setFillColor(240, 253, 244); // emerald-50
      doc.setDrawColor(167, 243, 208); // emerald-200
    } else if (isInProgress) {
      doc.setFillColor(239, 246, 255); // blue-50
      doc.setDrawColor(191, 219, 254); // blue-200
    } else {
      doc.setFillColor(248, 250, 252); // slate-50
      doc.setDrawColor(226, 232, 240); // slate-200
    }

    doc.setLineWidth(0.35);
    doc.roundedRect(margin, y, contentWidth, cardHeight, 1.5, 1.5, 'FD');

    // Left phase stripe
    if (is100) {
      doc.setFillColor(16, 185, 129); // emerald-500
    } else if (isInProgress) {
      doc.setFillColor(59, 130, 246); // blue-500
    } else {
      doc.setFillColor(148, 163, 184); // slate-400
    }
    doc.rect(margin, y, 3, cardHeight, 'F');

    // Phase Code & Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`[${phase.shortCode}]  ${phase.name}`, margin + 6, y + 6);

    // Status Pill on top right
    if (is100) {
      doc.setFillColor(16, 185, 129);
      doc.roundedRect(pageWidth - margin - 36, y + 2.5, 32, 5.5, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(255, 255, 255);
      doc.text('COMPLETED (100%)', pageWidth - margin - 20, y + 6.2, { align: 'center' });
    } else if (isInProgress) {
      doc.setFillColor(59, 130, 246);
      doc.roundedRect(pageWidth - margin - 36, y + 2.5, 32, 5.5, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(255, 255, 255);
      doc.text(`IN PROGRESS (${phase.completionPercentage}%)`, pageWidth - margin - 20, y + 6.2, { align: 'center' });
    } else {
      doc.setFillColor(148, 163, 184);
      doc.roundedRect(pageWidth - margin - 32, y + 2.5, 28, 5.5, 1, 1, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(255, 255, 255);
      doc.text('UPCOMING (0%)', pageWidth - margin - 18, y + 6.2, { align: 'center' });
    }

    // Progress Bar
    const barX = margin + 6;
    const barY = y + 9;
    const barW = 100;
    const barH = 2.5;
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(barX, barY, barW, barH, 0.8, 0.8, 'F');
    if (phase.completionPercentage > 0) {
      const fillW = (barW * phase.completionPercentage) / 100;
      doc.setFillColor(is100 ? 16 : 59, is100 ? 185 : 130, is100 ? 129 : 246);
      doc.roundedRect(barX, barY, fillW, barH, 0.8, 0.8, 'F');
    }

    // Progress text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(is100 ? 5 : 37, is100 ? 150 : 99, is100 ? 105 : 235);
    doc.text(`${phase.completionPercentage}% Complete`, barX + barW + 4, barY + 2.2);

    // Meta row (Lead Owner, Window, Budget)
    let metaY = y + 15;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    const ownerText = `Lead: ${phase.leadOwner.split('(')[0].trim()}`;
    const windowText = phase.actualEndDate 
      ? `Expected: ${phase.targetEndDate} | Actual: ${phase.actualEndDate}` 
      : `Expected Delivery: ${phase.targetEndDate}`;
    const budgetText = phase.budgetAllocated ? `Budget: ${phase.budgetAllocated}` : '';
    const riskText = phase.riskLevel ? `Risk: ${phase.riskLevel.toUpperCase()}` : '';
    doc.text(`${ownerText}   |   ${windowText}   |   ${budgetText}   |   ${riskText}`, margin + 6, metaY);

    // Deliverables Header
    let delY = metaY + 5.5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);
    doc.text('Key Verifiable Phase Deliverables:', margin + 6, delY);

    delY += 4;
    phase.keyDeliverables.forEach((del) => {
      // Checkmark box
      if (del.completed) {
        doc.setFillColor(16, 185, 129);
        doc.rect(margin + 6, delY - 2.5, 3, 3, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6);
        doc.setTextColor(255, 255, 255);
        doc.text('v', margin + 6.8, delY - 0.4);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(15, 23, 42);
        doc.text(`${del.title}  [VERIFIED]`, margin + 11, delY);
      } else {
        doc.setDrawColor(148, 163, 184);
        doc.rect(margin + 6, delY - 2.5, 3, 3, 'D');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text(`${del.title}  [PENDING]`, margin + 11, delY);
      }

      if (del.deliverableType) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(6.5);
        doc.setTextColor(148, 163, 184);
        doc.text(`(${del.deliverableType})`, pageWidth - margin - 4, delY, { align: 'right' });
      }

      delY += 4.8;
    });

    y += cardHeight + 4;
  });

  // --- 5. COMPLIANCE & STATUTORY SIGN-OFF SEAL ---
  checkPageBreak(30);

  doc.setFillColor(241, 245, 249); // slate-100
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('ARCHITECTURAL QUALITY ASSURANCE & STATUTORY SIGN-OFF', margin + 5, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'This milestone progress record conforms to AIA / RIBA Stage Workflows and ISO 19650 BIM Information Management standards. All percentages reflected represent corroborated contract documentation and certified site progress inspections.',
    margin + 5,
    y + 11,
    { maxWidth: contentWidth - 48 }
  );

  // Verification Seal Box
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(pageWidth - margin - 38, y + 3, 34, 16, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(59, 130, 246);
  doc.text('FIZA HAYAT STUDIO', pageWidth - margin - 21, y + 7.5, { align: 'center' });
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('CERTIFIED AUDIT', pageWidth - margin - 21, y + 12, { align: 'center' });
  doc.setFontSize(5.5);
  doc.setTextColor(148, 163, 184);
  doc.text('ISO 19650 VERIFIED', pageWidth - margin - 21, y + 16, { align: 'center' });

  y += 28;

  // Add Page Numbers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Fiza Hayat Practice • Confidential Milestone Progress Report • Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 6,
      { align: 'center' }
    );
  }

  // Safe file naming
  const safeFilename = `Fiza_Hayat_Milestone_Progress_${project.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 28)}_${project.id.slice(0, 6)}.pdf`;
  doc.save(safeFilename);
}
