import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Layers, 
  Package, 
  BarChart3, 
  Table as TableIcon, 
  Clock, 
  CheckCircle2, 
  Leaf, 
  DollarSign, 
  Download, 
  Filter, 
  Search, 
  HardHat, 
  ShieldCheck, 
  Sparkles, 
  Briefcase, 
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Project, ProjectTeamMemberAllocation, ProjectMaterialRequirement } from '../../types';
import { getProjectResourceAllocation } from '../../utils/projectResources';

interface ProjectResourceAllocationViewProps {
  project: Project;
  className?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Structural': '#3b82f6',
  'Enclosure & Glass': '#06b6d4',
  'Interior & Finishes': '#8b5cf6',
  'Thermal & Acoustic': '#10b981',
  'Metals & Hardware': '#f59e0b',
  'General': '#64748b'
};

const PIE_COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];

export const ProjectResourceAllocationView: React.FC<ProjectResourceAllocationViewProps> = ({ 
  project, 
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'team' | 'materials' | 'charts'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'procured'>('all');

  const resourceData = useMemo(() => {
    return getProjectResourceAllocation(project);
  }, [project]);

  // Filtered Team Members
  const filteredTeam = useMemo(() => {
    return resourceData.team.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            member.discipline.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || 
                            (statusFilter === 'active' && member.status === 'active') ||
                            (statusFilter === 'completed' && member.status === 'completed');
      return matchesSearch && matchesStatus;
    });
  }, [resourceData.team, searchQuery, statusFilter]);

  // Filtered Materials
  const filteredMaterials = useMemo(() => {
    return resourceData.materials.filter(mat => {
      const matchesSearch = mat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            mat.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            mat.specification.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' ||
                            (statusFilter === 'procured' && (mat.procurementStatus === 'Procured' || mat.procurementStatus === 'Delivered')) ||
                            (statusFilter === 'active' && mat.procurementStatus === 'In Fabrication');
      return matchesSearch && matchesStatus;
    });
  }, [resourceData.materials, searchQuery, statusFilter]);

  // Chart Data: Materials Cost by Category
  const materialsByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    resourceData.materials.forEach(m => {
      map[m.category] = (map[m.category] || 0) + m.estimatedCost;
    });
    return Object.entries(map).map(([name, value]) => ({
      name,
      value
    }));
  }, [resourceData.materials]);

  // Chart Data: Team Hours by Discipline
  const teamByDiscipline = useMemo(() => {
    const map: Record<string, { hours: number; count: number }> = {};
    resourceData.team.forEach(t => {
      if (!map[t.discipline]) {
        map[t.discipline] = { hours: 0, count: 0 };
      }
      map[t.discipline].hours += t.hoursCommitted;
      map[t.discipline].count += 1;
    });
    return Object.entries(map).map(([discipline, data]) => ({
      discipline,
      hours: data.hours,
      members: data.count
    }));
  }, [resourceData.team]);

  // Export CSV
  const handleExportCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    // Team Section
    csvContent += '--- TEAM ALLOCATION ---\n';
    csvContent += 'Name,Role,Discipline,Allocation %,Hours Committed,Status\n';
    resourceData.team.forEach(m => {
      csvContent += `"${m.name}","${m.role}","${m.discipline}",${m.allocationPercent}%,${m.hoursCommitted},"${m.status}"\n`;
    });

    csvContent += '\n--- MATERIALS REQUIREMENTS ---\n';
    csvContent += 'Material Name,Category,Specification,Quantity,Unit,Est Cost (USD),Sustainability,Procurement Status\n';
    resourceData.materials.forEach(mat => {
      csvContent += `"${mat.name}","${mat.category}","${mat.specification}","${mat.quantity}","${mat.unit}",${mat.estimatedCost},"${mat.sustainabilityRating}","${mat.procurementStatus}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${project.slug || 'project'}-resource-allocation.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`space-y-6 rounded-3xl bg-neutral-900/60 border border-white/10 p-6 sm:p-8 backdrop-blur-sm ${className}`}>
      
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-xs uppercase tracking-wider">
              Resource Intelligence
            </span>
            <span className="text-xs text-neutral-400">• Multi-Disciplinary Staffing & Procurement</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <HardHat className="w-6 h-6 text-blue-400" />
            <span>Resource Allocation Breakdown</span>
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
            Detailed tracking of assigned architectural, structural, and BIM personnel alongside project-specific materials schedule, procurement statuses, and sustainability ratings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center gap-2 border border-white/10 transition-all cursor-pointer shadow-sm hover:border-blue-500/30"
            title="Download CSV Resource Matrix"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Export CSV Schedule</span>
          </button>
        </div>
      </div>

      {/* METRICS BANNER */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Dedicated Staff */}
        <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="flex items-center gap-1.5 font-medium">
              <Users className="w-4 h-4 text-blue-400" />
              Allocated Team
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">
              100% Staffed
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{resourceData.team.length}</span>
            <span className="text-xs text-neutral-400">Leads & Specialists</span>
          </div>
          <div className="text-[11px] text-neutral-400">
            Total Committed: <strong className="text-blue-300 font-mono">{resourceData.totalTeamHours} hrs</strong>
          </div>
        </div>

        {/* Metric 2: Material Budget */}
        <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="flex items-center gap-1.5 font-medium">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Materials Budget
            </span>
            <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded font-bold">
              Procurement
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">
              ${(resourceData.totalMaterialsBudget / 1000).toFixed(0)}k
            </span>
            <span className="text-xs text-neutral-400">Est. Total</span>
          </div>
          <div className="text-[11px] text-neutral-400">
            Across <strong className="text-emerald-300 font-mono">{resourceData.materials.length}</strong> key specifications
          </div>
        </div>

        {/* Metric 3: Eco & Carbon Rating */}
        <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="flex items-center gap-1.5 font-medium">
              <Leaf className="w-4 h-4 text-emerald-400" />
              Eco Sustainability
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">
              Low Carbon
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400 font-mono">A+ Tier</span>
            <span className="text-xs text-neutral-400">LEED Gold Target</span>
          </div>
          <div className="text-[11px] text-neutral-400">
            Recycled & localized sourcing certified
          </div>
        </div>

        {/* Metric 4: Procurement Completion */}
        <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              Fulfillment Status
            </span>
            <span className="text-[10px] text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded font-bold">
              On Schedule
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">75%</span>
            <span className="text-xs text-neutral-400">Delivered / In Fab</span>
          </div>
          <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full w-3/4 rounded-full" />
          </div>
        </div>

      </div>

      {/* CONTROLS: TABS, SEARCH, AND STATUS FILTER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Resources', icon: Layers },
            { id: 'team', label: `Team Members (${resourceData.team.length})`, icon: Users },
            { id: 'materials', label: `Materials Schedule (${resourceData.materials.length})`, icon: Package },
            { id: 'charts', label: 'Visual Analytics', icon: BarChart3 }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-neutral-800/80 text-neutral-400 hover:text-white border border-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Filter Bar */}
        {activeTab !== 'charts' && (
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff, materials..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-neutral-950 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/50"
              />
            </div>

            <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-white/10 text-xs">
              <Filter className="w-3 h-3 text-neutral-400 ml-1" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="bg-transparent text-neutral-300 text-xs pr-2 py-0.5 focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-neutral-900">All Status</option>
                <option value="active" className="bg-neutral-900">Active / In Fab</option>
                <option value="completed" className="bg-neutral-900">Completed</option>
                <option value="procured" className="bg-neutral-900">Procured</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 1: VISUAL CHARTS VIEW */}
      {(activeTab === 'charts' || activeTab === 'all') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span>Resource Allocation & Cost Distribution Charts</span>
            </h4>
            <span className="text-[11px] text-neutral-400 hidden sm:inline">
              Real-time engineering hours and procurement breakdown
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Materials Cost Distribution (Donut Chart) */}
            <div className="p-5 rounded-2xl bg-neutral-950/60 border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider">Materials Value by Category</h5>
                  <p className="text-[11px] text-neutral-400">Proportional budget allocation per building system</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  ${(resourceData.totalMaterialsBudget / 1000).toFixed(0)}k Total
                </span>
              </div>

              <div className="h-60 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={materialsByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {materialsByCategory.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={CATEGORY_COLORS[entry.name] || PIE_COLORS[index % PIE_COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(val: unknown) => [
                        typeof val === 'number' ? `$${val.toLocaleString()}` : `${val}`, 
                        'Budget'
                      ]}
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        borderColor: 'rgba(255,255,255,0.1)', 
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend Badges */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                {materialsByCategory.map((item, idx) => (
                  <div key={item.name} className="flex items-center gap-1.5 text-[11px] text-neutral-300">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: CATEGORY_COLORS[item.name] || PIE_COLORS[idx % PIE_COLORS.length] }} 
                    />
                    <span>{item.name}:</span>
                    <strong className="font-mono text-white">${(item.value / 1000).toFixed(0)}k</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Team Effort Hours by Discipline (Bar Chart) */}
            <div className="p-5 rounded-2xl bg-neutral-950/60 border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider">Staff Effort by Discipline</h5>
                  <p className="text-[11px] text-neutral-400">Total billable engineering & design hours committed</p>
                </div>
                <span className="text-xs font-mono font-bold text-blue-400">
                  {resourceData.totalTeamHours} Hours
                </span>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamByDiscipline} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis 
                      dataKey="discipline" 
                      stroke="#64748b" 
                      fontSize={10} 
                      interval={0}
                      tickLine={false}
                      angle={-15}
                      textAnchor="end"
                    />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                    <RechartsTooltip 
                      formatter={(val: unknown) => [`${val} Hours`, 'Committed Hours']}
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        borderColor: 'rgba(255,255,255,0.1)', 
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="hours" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-white/5 font-mono">
                <span>Total Specialists: <strong className="text-white">{resourceData.team.length}</strong></span>
                <span>Avg. Commitment: <strong className="text-blue-300">{Math.round(resourceData.totalTeamHours / resourceData.team.length)} hrs/lead</strong></span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SECTION 2: TEAM ALLOCATION TABLE */}
      {(activeTab === 'team' || activeTab === 'all') && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Project Team & Staffing Schedule ({filteredTeam.length})</span>
            </h4>
            <span className="text-xs text-neutral-400">
              Role assignments, hours committed, and deliverable responsibilities
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-neutral-950/60 shadow-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-900/90 text-neutral-400 text-[11px] uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4">Team Member & Role</th>
                  <th className="py-3.5 px-3">Discipline</th>
                  <th className="py-3.5 px-3">Allocation %</th>
                  <th className="py-3.5 px-3">Hours Committed</th>
                  <th className="py-3.5 px-4">Assigned Deliverables</th>
                  <th className="py-3.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTeam.map((member) => (
                  <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                    
                    {/* Member & Role */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={member.avatar} 
                          alt={member.name} 
                          className="w-9 h-9 rounded-xl object-cover border border-white/10 shrink-0" 
                        />
                        <div>
                          <div className="font-bold text-white text-xs">{member.name}</div>
                          <div className="text-[11px] text-neutral-400">{member.role}</div>
                        </div>
                      </div>
                    </td>

                    {/* Discipline */}
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 font-medium text-[11px] border border-blue-500/20 whitespace-nowrap">
                        {member.discipline}
                      </span>
                    </td>

                    {/* Allocation Progress */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-1 w-24">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-white font-bold">{member.allocationPercent}%</span>
                        </div>
                        <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-500 h-full rounded-full transition-all" 
                            style={{ width: `${member.allocationPercent}%` }} 
                          />
                        </div>
                      </div>
                    </td>

                    {/* Hours */}
                    <td className="py-3.5 px-3 font-mono">
                      <div className="flex items-center gap-1.5 text-neutral-200">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{member.hoursCommitted} hrs</span>
                      </div>
                    </td>

                    {/* Assigned Tasks */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {member.assignedTasks.map((task, idx) => (
                          <span 
                            key={idx} 
                            className="px-2 py-0.5 rounded bg-neutral-900 border border-white/5 text-[10px] text-neutral-300"
                          >
                            {task}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        member.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : member.status === 'completed'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          member.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'
                        }`} />
                        {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: MATERIALS SCHEDULE TABLE */}
      {(activeTab === 'materials' || activeTab === 'all') && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-400" />
              <span>Project Materials & Procurement Schedule ({filteredMaterials.length})</span>
            </h4>
            <span className="text-xs text-neutral-400">
              Technical specifications, quantities, budget estimates, and LEED sustainability
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-neutral-950/60 shadow-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-900/90 text-neutral-400 text-[11px] uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3.5 px-4">Material Name & Category</th>
                  <th className="py-3.5 px-4">Engineering Specification</th>
                  <th className="py-3.5 px-3">Quantity</th>
                  <th className="py-3.5 px-3 font-mono">Est. Value</th>
                  <th className="py-3.5 px-3">Eco Rating</th>
                  <th className="py-3.5 px-4 text-right">Procurement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredMaterials.map((mat) => (
                  <tr key={mat.id} className="hover:bg-white/[0.02] transition-colors">
                    
                    {/* Material Name & Category */}
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-bold text-white text-xs">{mat.name}</div>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-medium bg-neutral-900 border border-white/10 text-neutral-300">
                          {mat.category}
                        </span>
                      </div>
                    </td>

                    {/* Specification */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="text-neutral-300 text-[11px] leading-relaxed line-clamp-2">
                        {mat.specification}
                      </p>
                    </td>

                    {/* Quantity */}
                    <td className="py-3.5 px-3 font-mono whitespace-nowrap">
                      <span className="text-white font-bold">{mat.quantity}</span>
                      <span className="text-neutral-400 ml-1 text-[11px]">{mat.unit}</span>
                    </td>

                    {/* Est. Cost */}
                    <td className="py-3.5 px-3 font-mono whitespace-nowrap">
                      <span className="text-emerald-400 font-bold">
                        ${mat.estimatedCost.toLocaleString()}
                      </span>
                    </td>

                    {/* Sustainability Rating */}
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                        <Leaf className="w-2.5 h-2.5" />
                        {mat.sustainabilityRating}
                      </span>
                    </td>

                    {/* Procurement Status */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        mat.procurementStatus === 'Delivered'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : mat.procurementStatus === 'Procured'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : mat.procurementStatus === 'In Fabrication'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-neutral-800 text-neutral-400 border border-white/10'
                      }`}>
                        {mat.procurementStatus}
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
