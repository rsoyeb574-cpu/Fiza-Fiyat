import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Lock, 
  Mail, 
  Phone, 
  Building2, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  Clock, 
  FileText, 
  MessageSquare, 
  Calendar, 
  CreditCard, 
  Send, 
  Sparkles, 
  Layers, 
  LogOut, 
  Upload, 
  AlertCircle, 
  ChevronRight, 
  Bell, 
  Check, 
  Paperclip, 
  Mic, 
  FileCode, 
  RefreshCw 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  EnterpriseProject, 
  Quotation, 
  Invoice, 
  PaymentTransaction, 
  ChatMessage, 
  CalendarEvent, 
  SystemNotification 
} from '../types/enterprise';
import { 
  fetchEnterpriseProjects, 
  fetchInvoices, 
  saveEnterpriseProject, 
  saveInvoice 
} from '../services/enterpriseDb';

export const ClientPortalPage: React.FC = () => {
  const { user, logout, loginWithEmail } = useAuth();

  // Auth State
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Client Data State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'downloads' | 'payments' | 'chat' | 'meetings' | 'profile'>('dashboard');
  const [projects, setProjects] = useState<EnterpriseProject[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedProject, setSelectedProject] = useState<EnterpriseProject | null>(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 'm-1', channelId: 'client-chat', senderUid: 'admin', senderName: 'Eng. Fiza Hayat', senderRole: 'Principal Architect', text: 'Welcome to your Fiza Hayat Client Portal! How can we assist with your villa design today?', readBy: [], createdAt: '10:30 AM' }
  ]);
  const [newChatText, setNewChatText] = useState('');

  // Meeting Booking State
  const [meetingTitle, setMeetingTitle] = useState('Architectural Review');
  const [meetingDate, setMeetingDate] = useState('2026-08-12');
  const [meetingTime, setMeetingTime] = useState('11:00 AM');
  const [bookedMeetings, setBookedMeetings] = useState<CalendarEvent[]>([]);

  // Payment Modal State
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Net Banking'>('UPI');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Profile Photo Upload State
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');

  useEffect(() => {
    loadClientData();
  }, [user]);

  const loadClientData = async () => {
    const p = await fetchEnterpriseProjects();
    const inv = await fetchInvoices();
    setProjects(p);
    setInvoices(inv);
    if (p.length > 0) setSelectedProject(p[0]);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      if (authMode === 'login') {
        await loginWithEmail(email, password);
      } else if (authMode === 'register') {
        // Register simulation or standard auth
        await loginWithEmail(email, password);
      } else {
        alert('Password reset link sent to your email address!');
        setAuthMode('login');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      channelId: 'client-chat',
      senderUid: user?.uid || 'client-demo',
      senderName: user?.displayName || name || 'Client User',
      senderRole: 'Client',
      text: newChatText,
      readBy: [],
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages([...chatMessages, newMsg]);
    setNewChatText('');
  };

  const handleBookMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    const newEv: CalendarEvent = {
      id: `evt-${Date.now()}`,
      title: meetingTitle,
      category: 'Client Call',
      startDate: `${meetingDate} ${meetingTime}`,
      endDate: `${meetingDate} 12:00 PM`,
      attendees: ['Client', 'Eng. Fiza Hayat'],
      description: 'Scheduled via Client Portal'
    };
    setBookedMeetings([...bookedMeetings, newEv]);
    alert('Meeting successfully requested! Our team will confirm shortly.');
  };

  const handleExecutePayment = async () => {
    if (!payingInvoice) return;
    const updatedInv: Invoice = {
      ...payingInvoice,
      paymentStatus: 'Paid',
      remainingBalanceINR: 0,
      paidAt: new Date().toISOString().split('T')[0],
      transactionRef: `UPI-${Math.floor(10000000 + Math.random() * 90000000)}`
    };
    await saveInvoice(updatedInv);
    setInvoices(invoices.map(i => i.id === updatedInv.id ? updatedInv : i));
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      setPayingInvoice(null);
    }, 2000);
  };

  const handleDeliverableApproval = async (delId: string, status: 'Approved' | 'Revision Requested') => {
    if (!selectedProject) return;
    const updatedDeliverables = (selectedProject.deliverables || []).map(d => 
      d.id === delId ? { ...d, status } : d
    );
    const updatedProj = { ...selectedProject, deliverables: updatedDeliverables };
    await saveEnterpriseProject(updatedProj);
    setProjects(projects.map(p => p.id === updatedProj.id ? updatedProj : p));
    setSelectedProject(updatedProj);
    alert(`Deliverable status updated to: ${status}`);
  };

  // LOGIN / REGISTER SCREEN IF NOT LOGGED IN
  if (!user) {
    return (
      <div className="min-h-[85vh] pt-28 pb-16 px-4 flex items-center justify-center">
        <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-[1px] mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-white">Client Portal Access</h2>
            <p className="text-slate-400 text-xs">Fiza Hayat Engineers • Secure Client Workspace</p>
          </div>

          {authError && (
            <div className="p-3 rounded-2xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            {authMode === 'register' && (
              <>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="client@example.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            {authMode !== 'forgot' && (
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <span>Verifying Security Credentials...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{authMode === 'login' ? 'Sign In to Portal' : authMode === 'register' ? 'Create Client Account' : 'Reset Password'}</span>
                </>
              )}
            </button>
          </form>

          <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 pt-4">
            {authMode === 'login' ? (
              <>
                <button onClick={() => setAuthMode('forgot')} className="hover:text-blue-400">Forgot Password?</button>
                <button onClick={() => setAuthMode('register')} className="hover:text-blue-400 font-bold text-blue-400">Create Account</button>
              </>
            ) : (
              <button onClick={() => setAuthMode('login')} className="hover:text-blue-400 font-bold text-blue-400 mx-auto">← Return to Login</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // MAIN CLIENT DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-8 text-xs">
      {/* HEADER BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img 
              src={profilePhotoUrl} 
              alt={user.displayName || 'Client'} 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-xl"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" title="Online"></span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{user.displayName || user.email?.split('@')[0]}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 font-bold text-[10px] border border-blue-500/30">
                Verified Client
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">{user.email} • Client Portal Workspace</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('chat')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat with Company</span>
          </button>
          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-white/10 text-xs">
        {[
          { id: 'dashboard', label: 'Client Overview', icon: Building2 },
          { id: 'projects', label: `Active Projects (${projects.length})`, icon: Layers },
          { id: 'downloads', label: 'Download Center (CAD/PDF)', icon: Download },
          { id: 'payments', label: `Invoices & Payments (${invoices.length})`, icon: CreditCard },
          { id: 'chat', label: 'Real-Time Company Chat', icon: MessageSquare },
          { id: 'meetings', label: 'Book Site Visit / Call', icon: Calendar },
          { id: 'profile', label: 'Security & Profile', icon: UserIcon }
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

      {/* TAB 1: DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900 border border-white/10">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Active Projects</span>
              <div className="text-2xl font-black text-white mt-1">{projects.length}</div>
              <span className="text-blue-400 text-[10px] mt-1 block">Tracked live via BIM engine</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-white/10">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Pending Invoices</span>
              <div className="text-2xl font-black text-amber-400 mt-1">
                ₹{invoices.filter(i => i.paymentStatus !== 'Paid').reduce((acc, i) => acc + i.remainingBalanceINR, 0).toLocaleString()}
              </div>
              <span className="text-slate-400 text-[10px] mt-1 block">Due balance</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 border border-white/10">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Deliverable Approvals</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {selectedProject?.deliverables.filter(d => d.status === 'Pending Approval').length || 0} Pending
              </div>
              <span className="text-slate-400 text-[10px] mt-1 block">Drawings awaiting your review</span>
            </div>
          </div>

          {/* PROJECT PROGRESS HIGHLIGHT */}
          {selectedProject && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <div>
                  <span className="text-blue-400 font-bold uppercase text-[10px]">Primary Active Project</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{selectedProject.title}</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-950 border border-blue-500/30 text-blue-300 font-bold text-[11px]">
                  {selectedProject.status} Stage
                </span>
              </div>

              {/* PROGRESS BAR */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Overall Construction Progress</span>
                  <span className="text-emerald-400">{selectedProject.progressPercent}% Completed</span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-white/10">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${selectedProject.progressPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* MILESTONE LIST */}
              <div className="space-y-2 pt-2">
                <h4 className="text-white font-bold text-xs">Milestone Tracker</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(selectedProject.milestones || []).map(m => (
                    <div key={m.id} className="p-3 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className={`w-4 h-4 ${m.completed ? 'text-emerald-400' : 'text-slate-600'}`} />
                        <div>
                          <div className="text-white font-semibold">{m.title}</div>
                          <div className="text-slate-400 text-[10px]">Target: {m.dueDate}</div>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold ${m.completed ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {m.completed ? 'Done' : 'In Progress'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PROJECTS */}
      {activeTab === 'projects' && selectedProject && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-6">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">{selectedProject.title}</h3>
              <p className="text-slate-400 text-xs">Assigned Principal Architect: {selectedProject.assignedTeam?.[0]?.name || 'Unassigned'}</p>
            </div>
            <span className="text-emerald-400 font-bold font-mono text-sm">Budget: ₹{((selectedProject.budgetINR || 0) / 100000).toFixed(1)} Lakhs</span>
          </div>

          {/* DELIVERABLE REVISION REQUESTS */}
          <div className="space-y-3">
            <h4 className="text-white font-bold">Deliverables & Approvals</h4>
            <div className="space-y-2">
              {(selectedProject.deliverables || []).map(d => (
                <div key={d.id} className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-white font-bold text-xs">{d.title}</div>
                    <div className="text-slate-400 text-[10px]">Status: <span className="text-amber-300 font-bold">{d.status}</span></div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDeliverableApproval(d.id, 'Approved')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDeliverableApproval(d.id, 'Revision Requested')}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] cursor-pointer"
                    >
                      Request Revision
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DOWNLOAD CENTER */}
      {activeTab === 'downloads' && selectedProject && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Download className="w-4 h-4 text-blue-400" />
            <span>Drawings, CAD, Revit 3D & Invoice Downloads</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(selectedProject.drawings || []).map(dwg => (
              <div key={dwg.id} className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-blue-950 text-blue-400">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-xs">{dwg.title}</div>
                    <div className="text-slate-400 text-[10px]">Format: {dwg.type} • Uploaded {dwg.uploadedAt}</div>
                  </div>
                </div>

                <a
                  href={dwg.url}
                  download
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PAYMENTS & INVOICES */}
      {activeTab === 'payments' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Invoices & Payment History</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-white/10 text-[11px] uppercase tracking-wider">
                  <th className="pb-3">Invoice No.</th>
                  <th className="pb-3">Project Title</th>
                  <th className="pb-3">Total Amount</th>
                  <th className="pb-3">Balance Due</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {invoices.map(inv => (
                  <tr key={inv.id}>
                    <td className="py-3 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                    <td className="py-3 text-slate-300">{inv.projectTitle}</td>
                    <td className="py-3 text-white font-bold">₹{inv.totalAmountINR.toLocaleString()}</td>
                    <td className="py-3 text-amber-400 font-bold">₹{inv.remainingBalanceINR.toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${inv.paymentStatus === 'Paid' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950 text-amber-400 border border-amber-500/30'}`}>
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {inv.paymentStatus !== 'Paid' && (
                        <button
                          onClick={() => setPayingInvoice(inv)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer"
                        >
                          Pay Online
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: REAL-TIME CHAT */}
      {activeTab === 'chat' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4 flex flex-col h-[500px]">
          <h3 className="text-sm font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span>Direct Portal Chat with Fiza Hayat Team</span>
          </h3>

          <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-slate-950 rounded-2xl border border-white/5">
            {chatMessages.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.senderRole === 'Client' ? 'items-end' : 'items-start'}`}>
                <div className="text-[10px] text-slate-400 mb-1">{msg.senderName} ({msg.senderRole}) • {msg.createdAt}</div>
                <div className={`p-3 rounded-2xl max-w-md ${msg.senderRole === 'Client' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChatMessage} className="flex items-center space-x-2 pt-2">
            <input
              type="text"
              value={newChatText}
              onChange={e => setNewChatText(e.target.value)}
              placeholder="Type your message to our architects..."
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-500"
            />
            <button type="submit" className="px-5 py-3 rounded-2xl bg-blue-600 text-white font-bold flex items-center gap-1">
              <Send className="w-4 h-4" /> Send
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: MEETINGS */}
      {activeTab === 'meetings' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-6">
          <h3 className="text-sm font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>Schedule Site Visit or Architect Consultation</span>
          </h3>

          <form onSubmit={handleBookMeeting} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Meeting Purpose</label>
              <input
                type="text"
                value={meetingTitle}
                onChange={e => setMeetingTitle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Preferred Date</label>
              <input
                type="date"
                value={meetingDate}
                onChange={e => setMeetingDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Time Slot</label>
              <input
                type="text"
                value={meetingTime}
                onChange={e => setMeetingTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-bold"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end">
              <button type="submit" className="px-6 py-3 rounded-2xl bg-purple-600 text-white font-bold flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Request Appointment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 7: PROFILE */}
      {activeTab === 'profile' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-6">
          <h3 className="text-sm font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-blue-400" />
            <span>Security Settings & Profile Photo</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Profile Avatar URL</label>
              <input
                type="text"
                value={profilePhotoUrl}
                onChange={e => setProfilePhotoUrl(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-mono"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-white font-bold">Two-Factor Authentication (2FA)</div>
                <div className="text-slate-400 text-[11px]">Require OTP code via phone for sensitive deliverable approvals.</div>
              </div>
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={e => setTwoFactorEnabled(e.target.checked)}
                className="w-5 h-5 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* ONLINE PAYMENT MODAL */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-md w-full space-y-4 text-white text-xs shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-bold text-sm">Online Payment Gateway Gateway</h3>
              <button onClick={() => setPayingInvoice(null)} className="text-slate-400">✕</button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-1">
              <div className="text-slate-400 text-[10px]">Invoice: {payingInvoice.invoiceNumber}</div>
              <div className="text-xl font-black text-emerald-400">Amount: ₹{payingInvoice.remainingBalanceINR.toLocaleString()}</div>
            </div>

            <div className="space-y-2">
              <label className="block font-semibold text-slate-300">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {(['UPI', 'Card', 'Net Banking'] as const).map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    className={`py-2 rounded-xl border font-bold text-[11px] ${paymentMethod === m ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-950 border-white/10 text-slate-400'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {paymentSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-bold text-center">
                ✓ Payment Successful! Receipt Issued.
              </div>
            ) : (
              <button
                onClick={handleExecutePayment}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg"
              >
                Pay ₹{payingInvoice.remainingBalanceINR.toLocaleString()} Now
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
