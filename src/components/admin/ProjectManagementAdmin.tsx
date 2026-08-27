import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  UserPlus, 
  FileCode, 
  Video, 
  Image as ImageIcon, 
  Eye, 
  EyeOff, 
  Edit3, 
  Trash2, 
  Save, 
  Sparkles, 
  TrendingUp, 
  Calendar 
} from 'lucide-react';
import { 
  EnterpriseProject, 
  ProjectStatus, 
  ProjectPriority, 
  ProjectLog, 
  ProjectMilestone,
  ClientFileRequest 
} from '../../types/enterprise';
import { 
  fetchEnterpriseProjects, 
  saveEnterpriseProject,
  fetchClientFileRequests,
  saveClientFileRequest 
} from '../../services/enterpriseDb';

export const ProjectManagementAdmin: React.FC = () => {
  const [projects, setProjects] = useState<EnterpriseProject[]>([]);
  const [selectedProj, setSelectedProj] = useState<EnterpriseProject | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form Fields for new or edit project
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Planning');
  const [priority, setPriority] = useState<ProjectPriority>('Medium');
  const [progressPercent, setProgressPercent] = useState(10);
  const [budgetINR, setBudgetINR] = useState(5000000);
  const [clientVisible, setClientVisible] = useState(true);

  // New Log Entry
  const [logNotes, setLogNotes] = useState('');
  const [logType, setLogType] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');

  // Client File Requests
  const [fileRequests, setFileRequests] = useState<ClientFileRequest[]>([]);

  useEffect(() => {
    loadProjects();
    loadFileRequests();
  }, []);

  const loadProjects = async () => {
    const p = await fetchEnterpriseProjects();
    setProjects(p);
    if (p.length > 0 && !selectedProj) setSelectedProj(p[0]);
  };

  const loadFileRequests = async () => {
    const reqs = await fetchClientFileRequests();
    setFileRequests(reqs);
  };

  const handleUpdateFileRequestStatus = async (req: ClientFileRequest, newStatus: any) => {
    const updated = {
      ...req,
      status: newStatus,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    await saveClientFileRequest(updated);
    setFileRequests(fileRequests.map(r => r.id === updated.id ? updated : r));
    alert(`File Request status updated to ${newStatus}`);
  };

  const handleSelectProject = (p: EnterpriseProject) => {
    setSelectedProj(p);
    setTitle(p.title);
    setClientName(p.clientName);
    setClientEmail(p.clientEmail);
    setStatus(p.status);
    setPriority(p.priority);
    setProgressPercent(p.progressPercent);
    setBudgetINR(p.budgetINR);
    setClientVisible(p.clientVisible);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProj) return;

    const updated: EnterpriseProject = {
      ...selectedProj,
      title,
      clientName,
      clientEmail,
      status,
      priority,
      progressPercent,
      budgetINR,
      clientVisible,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    await saveEnterpriseProject(updated);
    setProjects(projects.map(p => p.id === updated.id ? updated : p));
    setSelectedProj(updated);
    setIsEditing(false);
    alert('Project details saved to Firebase Firestore!');
  };

  const handleAddLog = async () => {
    if (!selectedProj || !logNotes.trim()) return;
    const newLog: ProjectLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      authorName: 'Eng. Fiza Hayat',
      type: logType,
      notes: logNotes
    };

    const updatedProj = {
      ...selectedProj,
      logs: [newLog, ...selectedProj.logs]
    };

    await saveEnterpriseProject(updatedProj);
    setSelectedProj(updatedProj);
    setProjects(projects.map(p => p.id === updatedProj.id ? updatedProj : p));
    setLogNotes('');
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-white/10">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <span>Enterprise Project Management System</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">Track stages, BIM drawing assets, daily site logs & client visibility</p>
        </div>

        <button
          onClick={() => {
            const newProj: EnterpriseProject = {
              id: `proj-${Date.now()}`,
              title: 'New Luxury Residential Project',
              clientUid: 'client-new',
              clientName: 'Client Name',
              clientEmail: 'client@example.com',
              assignedTeam: [{ uid: 'emp-1', name: 'Eng. Fiza Hayat', role: 'Principal Architect' }],
              status: 'Planning',
              priority: 'Medium',
              progressPercent: 5,
              startDate: new Date().toISOString().split('T')[0],
              estimatedCompletionDate: '2027-01-01',
              budgetINR: 8500000,
              drawings: [],
              media: [],
              deliverables: [],
              milestones: [
                { id: 'm-1', title: 'Concept Design & Client Signoff', dueDate: '2026-09-01', completed: false, weightPercent: 20 }
              ],
              logs: [],
              clientVisible: true,
              createdAt: new Date().toISOString().split('T')[0],
              updatedAt: new Date().toISOString().split('T')[0]
            };
            saveEnterpriseProject(newProj);
            setProjects([...projects, newProj]);
            handleSelectProject(newProj);
          }}
          className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30"
        >
          <Plus className="w-4 h-4" /> Create New Project
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PROJECT LIST */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-white/10 space-y-3">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Projects Directory ({(projects || []).length})</span>
          <div className="space-y-2">
            {(projects || []).map(p => (
              <div
                key={p.id}
                onClick={() => handleSelectProject(p)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedProj?.id === p.id 
                    ? 'bg-blue-950/80 border-blue-500 text-white shadow-lg' 
                    : 'bg-slate-950 border-white/5 text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs truncate max-w-[180px]">{p.title}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    p.status === 'Completed' ? 'bg-emerald-950 text-emerald-400' : 'bg-blue-950 text-blue-300'
                  }`}>
                    {p.status}
                  </span>
                </div>
                <div className="text-slate-400 text-[10px] mt-1 flex justify-between">
                  <span>Client: {p.clientName}</span>
                  <span className="text-emerald-400 font-mono">{p.progressPercent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SELECTED PROJECT DETAILS & LOGS */}
        {selectedProj && (
          <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-bold text-white">{selectedProj.title}</h3>
                <p className="text-slate-400 text-xs">Client: {selectedProj.clientName} ({selectedProj.clientEmail})</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isEditing ? 'Cancel Edit' : 'Edit Specs'}</span>
                </button>
              </div>
            </div>

            {/* EDITABLE FORM */}
            {isEditing ? (
              <form onSubmit={handleSaveProject} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Project Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Budget (INR)</label>
                  <input
                    type="number"
                    value={budgetINR}
                    onChange={e => setBudgetINR(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status Stage</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-bold"
                  >
                    {(['Pending', 'Planning', 'Design', 'Approval', 'Construction', 'Completed', 'Cancelled'] as const).map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Progress Percentage ({progressPercent}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressPercent}
                    onChange={e => setProgressPercent(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="sm:col-span-2 flex justify-end">
                  <button type="submit" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save Changes to Firebase
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {/* DAILY / WEEKLY LOGS */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-3">
                  <h4 className="text-white font-bold">Add Daily / Weekly Construction Site Log</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={logNotes}
                      onChange={e => setLogNotes(e.target.value)}
                      placeholder="e.g. Completed 1st floor beam rebar binding with Fe500D steel..."
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white"
                    />
                    <button onClick={handleAddLog} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold">
                      Post Log
                    </button>
                  </div>

                  <div className="space-y-2 pt-2">
                    {(selectedProj.logs || []).map(l => (
                      <div key={l.id} className="p-3 rounded-xl bg-slate-900 border border-white/5 flex justify-between">
                        <div>
                          <div className="text-white font-semibold">{l.notes}</div>
                          <div className="text-slate-400 text-[10px]">Posted by {l.authorName} ({l.type})</div>
                        </div>
                        <span className="text-slate-500 font-mono text-[10px]">{l.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* INCOMING CLIENT FILE REQUESTS & BRIEFS */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div>
                      <h4 className="text-white font-bold text-xs flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                        <span>Client Requirement Briefs & File Requests ({fileRequests.filter(r => r.projectId === selectedProj.id).length})</span>
                      </h4>
                      <p className="text-slate-400 text-[11px]">Submitted by {selectedProj.clientName} directly to Project Managers.</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    {fileRequests.filter(r => r.projectId === selectedProj.id).length === 0 ? (
                      <div className="p-4 rounded-xl bg-slate-900 text-center text-slate-500 text-xs">
                        No requirement documents submitted for this project yet.
                      </div>
                    ) : (
                      fileRequests.filter(r => r.projectId === selectedProj.id).map(req => (
                        <div key={req.id} className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-white text-xs">{req.title}</span>
                              <span className="px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 text-[9px] font-bold border border-blue-500/20">
                                {req.category}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                                req.priority === 'Urgent' ? 'bg-red-950 text-red-400' : 'bg-slate-800 text-slate-300'
                              }`}>
                                {req.priority}
                              </span>
                              <select
                                value={req.status}
                                onChange={e => handleUpdateFileRequestStatus(req, e.target.value)}
                                className="px-2 py-1 rounded-lg bg-slate-950 text-xs border border-white/10 text-white font-bold cursor-pointer"
                              >
                                <option value="Submitted">Submitted</option>
                                <option value="Under Review">Under Review</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Fulfilled">Fulfilled</option>
                                <option value="Needs Clarification">Needs Clarification</option>
                              </select>
                            </div>
                          </div>

                          <p className="text-slate-300 text-xs line-clamp-2">{req.description}</p>

                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5">
                            <span>Client: {req.clientName} ({req.clientEmail})</span>
                            <span>Submitted: {req.createdAt} • Attachments: {req.attachments?.length || 0}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
