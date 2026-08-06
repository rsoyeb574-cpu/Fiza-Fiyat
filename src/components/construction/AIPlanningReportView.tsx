import React, { useState } from 'react';
import { AIPlanningReport } from '../../types/aiPlanning';
import { FloorPlan2DViewer } from './FloorPlan2DViewer';
import { Design3DViewer } from './Design3DViewer';
import { StructuralAdviceViewer } from './StructuralAdviceViewer';
import { 
  Building2, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  IndianRupee, 
  Calendar, 
  Download, 
  Printer, 
  BarChart2, 
  Package, 
  Compass, 
  Maximize2,
  CheckCircle2,
  TrendingUp,
  FileText
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface AIPlanningReportViewProps {
  report: AIPlanningReport;
  onReset: () => void;
}

export const AIPlanningReportView: React.FC<AIPlanningReportViewProps> = ({ report, onReset }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'floorplans' | '3dview' | 'structural' | 'materials' | 'cost' | 'timeline'>('overview');
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);

  const costBreakdownData = [
    { name: 'Materials', value: report.costSummary.materialCostINR, color: '#3b82f6' },
    { name: 'Labor', value: report.costSummary.laborCostINR, color: '#10b981' },
    { name: 'Interior', value: report.costSummary.interiorCostINR, color: '#f59e0b' },
    { name: 'Exterior', value: report.costSummary.exteriorCostINR, color: '#8b5cf6' },
    { name: 'Misc & Permit', value: report.costSummary.miscellaneousCostINR, color: '#ec4899' }
  ];

  const qualityChartData = [
    { level: 'Budget', cost: report.costSummary.qualityComparison.budgetLevel / 100000 },
    { level: 'Standard', cost: report.costSummary.qualityComparison.standardLevel / 100000 },
    { level: 'Premium', cost: report.costSummary.qualityComparison.premiumLevel / 100000 },
    { level: 'Luxury', cost: report.costSummary.qualityComparison.luxuryLevel / 100000 }
  ];

  return (
    <div className="space-y-8 text-xs">
      {/* TOP HEADER & ACTION BAR */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 font-bold uppercase tracking-wider text-[10px]">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Report ID: {report.id} • Generated {report.createdAt}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            {report.input.numberOfFloors} Residential Planning Report
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Plot: {report.input.plotWidthFt}′ × {report.input.plotLengthFt}′ ({report.totalPlotSqFt} Sq.Ft) • Built-up: {report.builtUpSqFt} Sq.Ft • City: {report.input.locationCity}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPdfModal(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF Report</span>
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
          >
            New Plan
          </button>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-white/10 text-xs">
        {[
          { id: 'overview', label: 'Executive Summary', icon: FileText },
          { id: 'floorplans', label: `2D Floor Plans (${report.floorPlans.length})`, icon: Layers },
          { id: '3dview', label: `3D Design Concepts (${report.design3DConcepts.length})`, icon: Sparkles },
          { id: 'structural', label: 'Structural Advice', icon: ShieldCheck },
          { id: 'materials', label: 'Material Estimates', icon: Package },
          { id: 'cost', label: 'Cost & Budget Charts', icon: BarChart2 },
          { id: 'timeline', label: `Timeline (${report.totalWeeks} Weeks)`, icon: Calendar }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl font-bold flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30' 
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* STATS CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-white/10">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Total Built-Up Area</span>
              <div className="text-xl font-black text-white mt-1">{report.builtUpSqFt.toLocaleString()} Sq.Ft</div>
              <span className="text-blue-400 text-[10px] mt-1 block">Carpet: {report.spaceDistribution.carpetAreaSqFt} Sq.Ft</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-white/10">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Total Estimated Cost</span>
              <div className="text-xl font-black text-emerald-400 mt-1">₹{(report.costSummary.totalBudgetINR / 100000).toFixed(1)} Lakhs</div>
              <span className="text-slate-400 text-[10px] mt-1 block">₹{report.costSummary.costPerSqFtINR} / Sq.Ft</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-white/10">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Target Construction Time</span>
              <div className="text-xl font-black text-amber-400 mt-1">{report.totalWeeks} Weeks</div>
              <span className="text-slate-400 text-[10px] mt-1 block">~ {report.totalMonths} Calendar Months</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-white/10">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Quality Tier</span>
              <div className="text-xl font-black text-purple-400 mt-1">{report.input.qualityLevel}</div>
              <span className="text-slate-400 text-[10px] mt-1 block">{report.input.numberOfBedrooms} BHK • {report.input.kitchenType}</span>
            </div>
          </div>

          {/* VASTU & SPACE DISTRIBUTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Vastu & Orientation Matrix ({report.input.roadDirection} Facing)</span>
              </h3>

              <div className="space-y-3">
                {(report.roomPositionsVastu || []).map((v, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">{v.room}</div>
                      <div className="text-slate-400 text-[11px]">{v.position} • {v.reason}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-bold text-[10px]">
                      {v.vastuStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Maximize2 className="w-4 h-4 text-amber-400" />
                <span>Space & Area Utilization Breakdown</span>
              </h3>

              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-slate-950 border border-white/5 flex justify-between items-center">
                  <span className="text-slate-300">Carpet Living Area:</span>
                  <span className="text-white font-bold">{report.spaceDistribution.carpetAreaSqFt} Sq.Ft (72%)</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-white/5 flex justify-between items-center">
                  <span className="text-slate-300">Wall Thickness Space:</span>
                  <span className="text-white font-bold">{report.spaceDistribution.wallAreaSqFt} Sq.Ft (14%)</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-white/5 flex justify-between items-center">
                  <span className="text-slate-300">Circulation Corridors & Stairs:</span>
                  <span className="text-white font-bold">{report.spaceDistribution.circulationSqFt} Sq.Ft (9%)</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-white/5 flex justify-between items-center">
                  <span className="text-slate-300">Balcony & Open Terrace:</span>
                  <span className="text-white font-bold">{report.spaceDistribution.balconyTerraceSqFt} Sq.Ft (5%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FLOOR PLANS */}
      {activeTab === 'floorplans' && (
        <FloorPlan2DViewer 
          floorPlans={report.floorPlans} 
          plotWidthFt={report.input.plotWidthFt} 
          plotLengthFt={report.input.plotLengthFt} 
        />
      )}

      {/* TAB 3: 3D VIEWER */}
      {activeTab === '3dview' && (
        <Design3DViewer concepts={report.design3DConcepts} />
      )}

      {/* TAB 4: STRUCTURAL ADVICE */}
      {activeTab === 'structural' && (
        <StructuralAdviceViewer structuralAdviceList={report.structuralAdviceList} />
      )}

      {/* TAB 5: MATERIAL ESTIMATES */}
      {activeTab === 'materials' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Package className="w-4 h-4 text-blue-400" />
            <span>Itemized Bill of Materials (BOM) Estimate</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-white/10 text-[11px] uppercase tracking-wider">
                  <th className="pb-3 pl-2">Material</th>
                  <th className="pb-3">Quantity</th>
                  <th className="pb-3">Estimated Rate</th>
                  <th className="pb-3">Total Cost</th>
                  <th className="pb-3 pr-2">Brand / Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(report.materialEstimates || []).map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-all">
                    <td className="py-3 pl-2 font-bold text-white">{m.materialName}</td>
                    <td className="py-3 text-slate-300">{m.quantity.toLocaleString()} {m.unit}</td>
                    <td className="py-3 text-slate-300">₹{m.unitPriceINR} / {m.unit}</td>
                    <td className="py-3 font-bold text-emerald-400">₹{m.totalCostINR.toLocaleString()}</td>
                    <td className="py-3 pr-2 text-slate-400">{m.recommendedBrand} ({m.qualityGrade})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: COST & BUDGET CHARTS */}
      {activeTab === 'cost' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <BarChart2 className="w-4 h-4 text-emerald-400" />
              <span>Cost Component Distribution</span>
            </h3>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={costBreakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {(costBreakdownData || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `₹${Number(value).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span>Quality Tier Cost Comparison (Lakhs INR)</span>
            </h3>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={qualityChartData}>
                  <XAxis dataKey="level" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip formatter={(val: any) => `₹${val} Lakhs`} />
                  <Bar dataKey="cost" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Phase-wise Construction Milestones</span>
          </h3>

          <div className="space-y-4">
            {(report.timelineMilestones || []).map((m, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-blue-400 font-bold">{m.phase} ({m.weekRange})</span>
                  <span className="text-emerald-400 font-bold">{m.completionPercentage}% Cumulative</span>
                </div>
                <h4 className="text-white font-bold text-sm">{m.title}</h4>
                <p className="text-slate-400 text-xs">{m.description}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {(m.keyTasks || []).map((t, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-300 text-[10px] border border-white/5">
                      ✓ {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRINTABLE PDF MODAL */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-2xl w-full space-y-4 text-white text-xs">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-bold text-sm">Download PDF Report Summary</h3>
              <button onClick={() => setShowPdfModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Your professional PDF report includes Cover Page, 2D Blueprint, 3D Render Specs, Bill of Quantities, Cost Charts, and Structural disclaimers branded with Fiza Hayat Engineers.
            </p>
            <div className="p-4 bg-slate-950 rounded-2xl border border-white/10 text-center font-bold text-emerald-400">
              Ready for Download (Generated PDF Package)
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowPdfModal(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">
                Close
              </button>
              <button 
                onClick={() => {
                  window.print();
                  setShowPdfModal(false);
                }} 
                className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
