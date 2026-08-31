import { StructuralInspectionResult } from '../types/structuralInspector';

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

  const repairHtml = (result.possibleRepairApproaches || []).map((r, i) => `
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

  const testingHtml = (result.whatMayBeRequired || []).map(t => `
    <li style="margin-bottom: 4px; font-size: 12px; color: #334155;">${t}</li>
  `).join('');

  const questionsHtml = (result.questionsForEngineer || []).map(q => `
    <li style="margin-bottom: 4px; font-size: 12px; color: #334155;">${q}</li>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FIZA FIYAT - AI Structural Damage Inspection Report</title>
  <style>
    @page {
      size: A4;
      margin: 15mm;
    }
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
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
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

  <div class="section-title">1. VISIBLE FINDINGS & DISTRESS EVIDENCE</div>
  ${findingsHtml || '<p style="font-size: 12px; color: #64748b;">No significant visual distress patterns detected in the media provided.</p>'}

  <div class="section-title">2. RECOMMENDED INVESTIGATIONS & TESTS</div>
  <ul style="margin: 0 0 16px 20px; padding: 0;">
    ${testingHtml}
  </ul>

  <div class="section-title">3. PRELIMINARY REPAIR APPROACH</div>
  ${repairHtml}

  <div class="section-title">4. SUGGESTED QUESTIONS FOR LICENSED STRUCTURAL ENGINEER</div>
  <ul style="margin: 0 0 16px 20px; padding: 0;">
    ${questionsHtml}
  </ul>

  <div class="disclaimer-box">
    <strong>CRITICAL SAFETY & LEGAL DISCLAIMER:</strong><br/>
    ${result.safetyDisclaimer}
  </div>

  <div style="margin-top: 25px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px;">
    Fiza Fiyat AI Structural Damage Inspector &bull; Civil Engineering Diagnostic Intelligence &bull; Confidential
  </div>
</body>
</html>
  `;
}

export function downloadStructuralInspectionPdf(result: StructuralInspectionResult): void {
  const htmlContent = generateStructuralReportHtml(result);
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  } else {
    // Fallback: download as html file
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Structural_Inspection_Report_${result.structureType}_${result.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
