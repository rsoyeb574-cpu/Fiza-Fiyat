import { Project } from '../types';
import { NormalizedProjectSpecs, calculateComparisonDelta } from './projectComparison';

interface GenerateProposalPDFOptions {
  project1: Project;
  project2: Project;
  specs1: NormalizedProjectSpecs;
  specs2: NormalizedProjectSpecs;
}

export function generateProposalReportHTML({
  project1,
  project2,
  specs1,
  specs2
}: GenerateProposalPDFOptions): string {
  const delta = calculateComparisonDelta(project1, project2);
  const generationDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const reportRef = `FH-PROP-${Math.floor(100000 + Math.random() * 900000)}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Architectural Feasibility & Project Comparison Proposal - Fiza Hayat Design Studio</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=JetBrains+Mono:wght@500;700&display=swap');

    @page {
      size: A4;
      margin: 12mm 15mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1e293b;
      background-color: #ffffff;
      line-height: 1.5;
      font-size: 11pt;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .report-container {
      max-width: 820px;
      margin: 0 auto;
      padding: 10px 0;
    }

    /* HEADER */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 18px;
      margin-bottom: 22px;
    }

    .brand-title {
      font-family: 'Playfair Display', serif;
      font-size: 24pt;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.5px;
      line-height: 1.1;
    }

    .brand-subtitle {
      font-size: 9pt;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #475569;
      font-weight: 600;
      margin-top: 4px;
    }

    .meta-box {
      text-align: right;
      font-size: 9pt;
      color: #475569;
    }

    .report-badge {
      display: inline-block;
      background-color: #6366f1;
      color: #ffffff;
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 4px;
      margin-bottom: 6px;
      letter-spacing: 1px;
    }

    .meta-line {
      margin: 2px 0;
      font-family: 'JetBrains Mono', monospace;
    }

    /* TITLE BAR */
    .document-title-block {
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
      color: #ffffff;
      padding: 18px 22px;
      border-radius: 8px;
      margin-bottom: 24px;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.1);
    }

    .document-title {
      font-size: 15pt;
      font-weight: 800;
      letter-spacing: -0.3px;
      margin-bottom: 4px;
    }

    .document-desc {
      font-size: 9.5pt;
      color: #cbd5e1;
      line-height: 1.4;
    }

    /* COMPARISON CARDS HERO */
    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }

    .project-card {
      border: 1.5px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
      background-color: #fafbfc;
      display: flex;
      flex-direction: column;
    }

    .card-img-wrapper {
      position: relative;
      height: 170px;
      background-color: #0f172a;
      overflow: hidden;
    }

    .card-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .card-tag {
      position: absolute;
      top: 10px;
      left: 10px;
      background-color: rgba(15, 23, 42, 0.85);
      color: #ffffff;
      font-size: 8pt;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .card-body {
      padding: 14px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .card-title {
      font-size: 13pt;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.3;
      margin-bottom: 6px;
    }

    .card-desc {
      font-size: 9pt;
      color: #64748b;
      margin-bottom: 12px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      padding-top: 10px;
      border-top: 1px solid #e2e8f0;
    }

    .stat-box {
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 6px 8px;
    }

    .stat-label {
      font-size: 7.5pt;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.5px;
    }

    .stat-val {
      font-size: 10.5pt;
      font-weight: 800;
      color: #0f172a;
      font-family: 'JetBrains Mono', monospace;
    }

    .stat-val-highlight {
      color: #059669;
    }

    /* DELTA BANNER */
    .delta-banner {
      background-color: #f1f5f9;
      border-left: 4px solid #6366f1;
      padding: 12px 16px;
      border-radius: 0 6px 6px 0;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .delta-text {
      font-size: 9.5pt;
      font-weight: 600;
      color: #1e293b;
    }

    .delta-sub {
      font-size: 8.5pt;
      color: #64748b;
      margin-top: 2px;
    }

    .delta-pill {
      background-color: #6366f1;
      color: #ffffff;
      font-weight: 800;
      font-size: 9pt;
      padding: 5px 12px;
      border-radius: 20px;
      font-family: 'JetBrains Mono', monospace;
      white-space: nowrap;
    }

    /* SECTION TITLE */
    .section-header {
      font-size: 11pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #0f172a;
      border-bottom: 1.5px solid #0f172a;
      padding-bottom: 6px;
      margin-top: 24px;
      margin-bottom: 12px;
    }

    /* TABLES */
    .spec-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9pt;
      margin-bottom: 20px;
    }

    .spec-table th {
      background-color: #0f172a;
      color: #ffffff;
      text-align: left;
      padding: 8px 12px;
      font-weight: 700;
      font-size: 8.5pt;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .spec-table td {
      padding: 8px 12px;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: top;
    }

    .spec-table tr:nth-child(even) {
      background-color: #f8fafc;
    }

    .col-feature {
      width: 32%;
      font-weight: 600;
      color: #475569;
    }

    .col-p1 {
      width: 34%;
      color: #0f172a;
    }

    .col-p2 {
      width: 34%;
      color: #0f172a;
    }

    .highlight-cost {
      font-weight: 800;
      color: #059669;
      font-family: 'JetBrains Mono', monospace;
    }

    .pill-tag {
      display: inline-block;
      background-color: #e0e7ff;
      color: #3730a3;
      font-size: 7.5pt;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 4px;
      margin-right: 4px;
      margin-bottom: 3px;
    }

    .bullet-list {
      list-style-type: none;
      padding: 0;
    }

    .bullet-list li {
      position: relative;
      padding-left: 14px;
      margin-bottom: 4px;
      line-height: 1.35;
    }

    .bullet-list li::before {
      content: '▪';
      position: absolute;
      left: 0;
      color: #6366f1;
      font-size: 10pt;
    }

    /* FOOTER & SIGN-OFF */
    .proposal-footer {
      margin-top: 32px;
      padding-top: 18px;
      border-top: 1.5px solid #cbd5e1;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 8.5pt;
      color: #64748b;
    }

    .signature-box {
      border-top: 1px dashed #94a3b8;
      padding-top: 8px;
      width: 220px;
      text-align: center;
      font-size: 8.5pt;
      color: #334155;
    }

    .signature-title {
      font-weight: 700;
      color: #0f172a;
    }

    .page-break {
      page-break-before: always;
    }

    /* PRINT ACTION BUTTON (Screen Only) */
    .screen-actions {
      position: fixed;
      top: 16px;
      right: 16px;
      background-color: #0f172a;
      padding: 12px 18px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      display: flex;
      gap: 10px;
      z-index: 9999;
    }

    .action-btn {
      background-color: #6366f1;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
      font-family: inherit;
    }

    .action-btn:hover {
      background-color: #4f46e5;
    }

    .close-btn {
      background-color: #334155;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
      font-family: inherit;
    }

    @media print {
      .screen-actions {
        display: none !important;
      }
      body {
        background-color: transparent;
      }
      .report-container {
        padding: 0;
      }
    }
  </style>
</head>
<body>

  <!-- Floating screen bar for user convenience -->
  <div class="screen-actions">
    <button class="action-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
    <button class="close-btn" onclick="window.close()">✕ Close Window</button>
  </div>

  <div class="report-container">
    
    <!-- HEADER -->
    <div class="header">
      <div>
        <div class="brand-title">FIZA HAYAT</div>
        <div class="brand-subtitle">Architectural & BIM Engineering Consultancy</div>
      </div>
      <div class="meta-box">
        <span class="report-badge">Feasibility & Proposal Analysis</span>
        <div class="meta-line"><strong>Reference:</strong> ${reportRef}</div>
        <div class="meta-line"><strong>Date:</strong> ${generationDate}</div>
        <div class="meta-line"><strong>Status:</strong> Client Review Draft</div>
      </div>
    </div>

    <!-- DOCUMENT TITLE BANNER -->
    <div class="document-title-block">
      <div class="document-title">Architectural Scope & Investment Comparison Proposal</div>
      <div class="document-desc">
        Comparative matrix report prepared for executive capital evaluation between 
        <strong>${project1.title}</strong> and <strong>${project2.title}</strong>.
      </div>
    </div>

    <!-- HERO CARDS OF COMPARED PROJECTS -->
    <div class="comparison-grid">
      <!-- PROJECT 1 -->
      <div class="project-card">
        <div class="card-img-wrapper">
          <img src="${project1.coverImage || project1.heroImage || ''}" alt="${project1.title}" class="card-img" crossorigin="anonymous" />
          <span class="card-tag">Option A: ${project1.categoryName}</span>
        </div>
        <div class="card-body">
          <div>
            <div class="card-title">${project1.title}</div>
            <div class="card-desc">${project1.description}</div>
          </div>
          <div class="card-stats">
            <div class="stat-box">
              <div class="stat-label">Total Estimate</div>
              <div class="stat-val stat-val-highlight">${specs1.estimatedCost}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Unit Rate</div>
              <div class="stat-val">${specs1.costPerSqFt}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Built-Up Area</div>
              <div class="stat-val">${specs1.area}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Project Cycle</div>
              <div class="stat-val">${specs1.duration}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- PROJECT 2 -->
      <div class="project-card">
        <div class="card-img-wrapper">
          <img src="${project2.coverImage || project2.heroImage || ''}" alt="${project2.title}" class="card-img" crossorigin="anonymous" />
          <span class="card-tag">Option B: ${project2.categoryName}</span>
        </div>
        <div class="card-body">
          <div>
            <div class="card-title">${project2.title}</div>
            <div class="card-desc">${project2.description}</div>
          </div>
          <div class="card-stats">
            <div class="stat-box">
              <div class="stat-label">Total Estimate</div>
              <div class="stat-val stat-val-highlight">${specs2.estimatedCost}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Unit Rate</div>
              <div class="stat-val">${specs2.costPerSqFt}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Built-Up Area</div>
              <div class="stat-val">${specs2.area}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Project Cycle</div>
              <div class="stat-val">${specs2.duration}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- DELTA VARIANCE SUMMARY -->
    <div class="delta-banner">
      <div>
        <div class="delta-text">
          Cost Variance Delta: ${delta.costDiffFormatted} (${delta.costDiffPercent}% Difference)
        </div>
        <div class="delta-sub">
          ${delta.higherCostProject === 1 
            ? `Option A ("${project1.title}") requires higher structural & BIM capital investment.`
            : delta.higherCostProject === 2
            ? `Option B ("${project2.title}") requires higher structural & BIM capital investment.`
            : `Both schemes sit within equivalent financial planning bands.`
          }
        </div>
      </div>
      <div class="delta-pill">
        Δ ${delta.costDiffFormatted}
      </div>
    </div>

    <!-- SECTION 1: FINANCIAL COMPARISON -->
    <div class="section-header">1. Capital Budgeting & Cost Breakdown</div>
    <table class="spec-table">
      <thead>
        <tr>
          <th class="col-feature">Budget Item</th>
          <th class="col-p1">${project1.title}</th>
          <th class="col-p2">${project2.title}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="col-feature">Total Estimated Budget</td>
          <td class="col-p1 highlight-cost">${specs1.estimatedCost}</td>
          <td class="col-p2 highlight-cost">${specs2.estimatedCost}</td>
        </tr>
        <tr>
          <td class="col-feature">Estimated Rate per Sq.Ft</td>
          <td class="col-p1">${specs1.costPerSqFt}</td>
          <td class="col-p2">${specs2.costPerSqFt}</td>
        </tr>
        <tr>
          <td class="col-feature">Architectural & Blueprints</td>
          <td class="col-p1">${specs1.costBreakdown.architectural}</td>
          <td class="col-p2">${specs2.costBreakdown.architectural}</td>
        </tr>
        <tr>
          <td class="col-feature">3D Renders & BIM Modeling</td>
          <td class="col-p1">${specs1.costBreakdown.bimAnd3d}</td>
          <td class="col-p2">${specs2.costBreakdown.bimAnd3d}</td>
        </tr>
        <tr>
          <td class="col-feature">Structural & MEP Engineering</td>
          <td class="col-p1">${specs1.costBreakdown.engineering}</td>
          <td class="col-p2">${specs2.costBreakdown.engineering}</td>
        </tr>
        <tr>
          <td class="col-feature">Turnkey Execution & Fit-out Est.</td>
          <td class="col-p1">${specs1.costBreakdown.constructionEst}</td>
          <td class="col-p2">${specs2.costBreakdown.constructionEst}</td>
        </tr>
      </tbody>
    </table>

    <!-- SECTION 2: ARCHITECTURAL & PHYSICAL PARAMETERS -->
    <div class="section-header">2. Structural & Architectural Specifications</div>
    <table class="spec-table">
      <thead>
        <tr>
          <th class="col-feature">Parameter</th>
          <th class="col-p1">${project1.title}</th>
          <th class="col-p2">${project2.title}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="col-feature">Location / Jurisdiction</td>
          <td class="col-p1">${project1.location || 'Global/International'}</td>
          <td class="col-p2">${project2.location || 'Global/International'}</td>
        </tr>
        <tr>
          <td class="col-feature">Total Floor Area</td>
          <td class="col-p1"><strong>${specs1.area}</strong></td>
          <td class="col-p2"><strong>${specs2.area}</strong></td>
        </tr>
        <tr>
          <td class="col-feature">Structural System</td>
          <td class="col-p1">${specs1.structuralType}</td>
          <td class="col-p2">${specs2.structuralType}</td>
        </tr>
        <tr>
          <td class="col-feature">Building Height / Levels</td>
          <td class="col-p1">${specs1.floors}</td>
          <td class="col-p2">${specs2.floors}</td>
        </tr>
        <tr>
          <td class="col-feature">BIM Development Level</td>
          <td class="col-p1">${specs1.bimLevel}</td>
          <td class="col-p2">${specs2.bimLevel}</td>
        </tr>
        <tr>
          <td class="col-feature">Sustainability & Energy Standard</td>
          <td class="col-p1">${specs1.energyRating}</td>
          <td class="col-p2">${specs2.energyRating}</td>
        </tr>
        <tr>
          <td class="col-feature">Key Material Palette</td>
          <td class="col-p1">
            ${specs1.materials.map(m => `<span class="pill-tag">${m}</span>`).join('')}
          </td>
          <td class="col-p2">
            ${specs2.materials.map(m => `<span class="pill-tag">${m}</span>`).join('')}
          </td>
        </tr>
        <tr>
          <td class="col-feature">Engineering Software Stack</td>
          <td class="col-p1">
            ${specs1.softwareUsed.map(s => `<span class="pill-tag">${s}</span>`).join('')}
          </td>
          <td class="col-p2">
            ${specs2.softwareUsed.map(s => `<span class="pill-tag">${s}</span>`).join('')}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- SECTION 3: DELIVERABLES & DRAWING PACKAGES -->
    <div class="section-header">3. Scope Deliverables & Drawing Packages</div>
    <table class="spec-table">
      <thead>
        <tr>
          <th class="col-feature">Item</th>
          <th class="col-p1">${project1.title} Deliverables</th>
          <th class="col-p2">${project2.title} Deliverables</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="col-feature">Included Drawings & Assets</td>
          <td class="col-p1">
            <ul class="bullet-list">
              ${specs1.deliverables.map(d => `<li>${d}</li>`).join('')}
            </ul>
          </td>
          <td class="col-p2">
            <ul class="bullet-list">
              ${specs2.deliverables.map(d => `<li>${d}</li>`).join('')}
            </ul>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- SIGN-OFF & FOOTER -->
    <div class="proposal-footer">
      <div>
        <strong>Fiza Hayat Architectural & BIM Studio</strong><br />
        Global Engineering, Spatial Design & Digital Twin Delivery<br />
        Contact: contact@fizahayat.com | www.fizahayat.com
      </div>
      <div class="signature-box">
        <div style="height: 35px;"></div>
        <div class="signature-title">Authorized Architectural Lead</div>
        <div>Fiza Hayat Executive Studio</div>
      </div>
    </div>

  </div>

  <script>
    // Auto-trigger print dialog for PDF saving when opened
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        window.print();
      }, 500);
    });
  </script>
</body>
</html>
`;
}

export function downloadProposalReport(options: GenerateProposalPDFOptions): void {
  const htmlContent = generateProposalReportHTML(options);
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  } else {
    // Fallback: If popup was blocked, create a downloadable HTML blob
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Proposal_Comparison_${options.project1.id}_vs_${options.project2.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
