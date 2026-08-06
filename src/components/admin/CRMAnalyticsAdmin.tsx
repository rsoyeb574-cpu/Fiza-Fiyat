import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  PhoneCall, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  BarChart2, 
  Sparkles, 
  Plus 
} from 'lucide-react';
import { CRMLead, AuditLog } from '../../types/enterprise';
import { fetchCRMLeads, saveCRMLead } from '../../services/enterpriseDb';

export const CRMAnalyticsAdmin: React.FC = () => {
  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: 'al-1', actorName: 'Eng. Fiza Hayat', actorRole: 'Super Admin', action: 'Approved Quotation FH-QT-2026-089', target: 'Grand Azure Villa', timestamp: '2026-08-05 11:20 AM' },
    { id: 'al-2', actorName: 'Aarav Sharma', actorRole: 'Client', action: 'Paid Invoice FH-INV-2026-104 via UPI', target: 'Payment Gateway', timestamp: '2026-08-05 02:45 PM' }
  ]);

  // New Lead Form
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [dealValue, setDealValue] = useState(5000000);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    const l = await fetchCRMLeads();
    setLeads(l);
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: CRMLead = {
      id: `lead-${Date.now()}`,
      name: leadName,
      email: leadEmail,
      phone: leadPhone,
      source: 'Website Inquiry',
      status: 'New',
      estimatedDealValueINR: dealValue,
      notes: 'Requested architectural 3D walkthrough & BOQ estimation.',
      nextFollowUpDate: '2026-08-10',
      createdAt: new Date().toISOString().split('T')[0]
    };

    await saveCRMLead(newLead);
    setLeads([newLead, ...leads]);
    setLeadName('');
    setLeadEmail('');
    setLeadPhone('');
    alert('New CRM lead saved to Firebase!');
  };

  const totalPipelineINR = leads.reduce((acc, l) => acc + l.estimatedDealValueINR, 0);

  return (
    <div className="space-y-6 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-white/10">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>CRM Sales Pipeline & Enterprise Analytics</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">Lead conversion stages, deal values, revenue reports & audit security logs</p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-mono font-bold">
          Active Pipeline: ₹{(totalPipelineINR / 10000000).toFixed(2)} Cr
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-slate-900 border border-white/10">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Total CRM Leads</span>
          <div className="text-2xl font-black text-white mt-1">{leads.length}</div>
          <span className="text-emerald-400 text-[10px] mt-1 block">Live pipeline tracking</span>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900 border border-white/10">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Won Deals</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {leads.filter(l => l.status === 'Won').length}
          </div>
          <span className="text-slate-400 text-[10px] mt-1 block">Signed contracts</span>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900 border border-white/10">
          <span className="text-slate-400 font-bold uppercase text-[10px]">In Negotiation</span>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {leads.filter(l => l.status === 'Negotiating').length}
          </div>
          <span className="text-slate-400 text-[10px] mt-1 block">Closing soon</span>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900 border border-white/10">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Security Audit Logs</span>
          <div className="text-2xl font-black text-blue-400 mt-1">{auditLogs.length}</div>
          <span className="text-slate-400 text-[10px] mt-1 block">RBAC tracking active</span>
        </div>
      </div>

      {/* LEAD CREATOR & PIPELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleCreateLead} className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
          <h3 className="font-bold text-sm text-white border-b border-white/10 pb-3">Add CRM Lead</h3>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Lead Name</label>
            <input
              type="text"
              required
              value={leadName}
              onChange={e => setLeadName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-bold"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Email</label>
            <input
              type="email"
              required
              value={leadEmail}
              onChange={e => setLeadEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Phone</label>
            <input
              type="text"
              required
              value={leadPhone}
              onChange={e => setLeadPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Estimated Deal Value (INR)</label>
            <input
              type="number"
              value={dealValue}
              onChange={e => setDealValue(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-mono"
            />
          </div>
          <button type="submit" className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-bold shadow-lg">
            Add to Sales Pipeline
          </button>
        </form>

        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
          <h3 className="font-bold text-sm text-white border-b border-white/10 pb-3">CRM Pipeline Directory</h3>
          <div className="space-y-3">
            {leads.map(lead => (
              <div key={lead.id} className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex justify-between items-center">
                <div>
                  <div className="text-white font-bold text-sm">{lead.name}</div>
                  <div className="text-slate-400 text-[10px]">{lead.email} • {lead.phone} • Source: {lead.source}</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-mono font-bold">₹{(lead.estimatedDealValueINR / 100000).toFixed(1)} Lakhs</div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 text-[10px] font-bold">
                    {lead.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AUDIT LOGS */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
        <h3 className="font-bold text-sm text-white border-b border-white/10 pb-3 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-blue-400" />
          <span>Security Audit Trail & User Activity Logs</span>
        </h3>

        <div className="space-y-2">
          {auditLogs.map(log => (
            <div key={log.id} className="p-3 rounded-2xl bg-slate-950 border border-white/5 flex justify-between text-[11px]">
              <div>
                <span className="text-white font-bold">{log.actorName} ({log.actorRole}):</span>{' '}
                <span className="text-slate-300">{log.action}</span>
              </div>
              <span className="text-slate-500 font-mono text-[10px]">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
