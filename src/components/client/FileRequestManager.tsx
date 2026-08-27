import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Layers, 
  User, 
  Paperclip, 
  MessageSquare, 
  Calendar, 
  ChevronRight, 
  Sparkles, 
  FileCode, 
  RefreshCw, 
  ShieldCheck, 
  Send,
  Eye,
  Check
} from 'lucide-react';
import { 
  EnterpriseProject, 
  ClientFileRequest, 
  FileRequestStatus, 
  FileRequestPriority, 
  FileRequestCategory 
} from '../../types/enterprise';
import { 
  fetchClientFileRequests, 
  saveClientFileRequest, 
  deleteClientFileRequest 
} from '../../services/enterpriseDb';
import { NewFileRequestModal } from './NewFileRequestModal';
import { FileRequestDetailModal } from './FileRequestDetailModal';
import { DocumentPreviewModal, PreviewableDocument } from './DocumentPreviewModal';

interface FileRequestManagerProps {
  projects: EnterpriseProject[];
  currentSelectedProject: EnterpriseProject | null;
  currentUser: {
    uid: string;
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
    phone?: string;
  };
  initialSelectedRequestId?: string | null;
  initialModalTab?: 'details' | 'deliverables' | 'discussion';
}

export const FileRequestManager: React.FC<FileRequestManagerProps> = ({
  projects,
  currentSelectedProject,
  currentUser,
  initialSelectedRequestId,
  initialModalTab = 'details'
}) => {
  const [requests, setRequests] = useState<ClientFileRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ClientFileRequest | null>(null);
  const [modalTab, setModalTab] = useState<'details' | 'deliverables' | 'discussion'>(initialModalTab);

  // Direct Document Preview Modal
  const [previewDoc, setPreviewDoc] = useState<PreviewableDocument | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    loadRequests();
  }, [currentUser.uid]);

  useEffect(() => {
    if (initialSelectedRequestId && requests.length > 0) {
      const match = requests.find(r => r.id === initialSelectedRequestId);
      if (match) {
        setSelectedRequest(match);
        setModalTab(initialModalTab || 'details');
      }
    }
  }, [initialSelectedRequestId, requests, initialModalTab]);

  const loadRequests = async () => {
    setLoading(true);
    const data = await fetchClientFileRequests(currentUser.uid);
    setRequests(data);
    setLoading(false);
  };

  const handleRequestCreated = (newReq: ClientFileRequest) => {
    setRequests([newReq, ...requests]);
    setSelectedRequest(newReq);
  };

  const handleRequestUpdated = (updated: ClientFileRequest) => {
    setRequests(requests.map(r => r.id === updated.id ? updated : r));
    setSelectedRequest(updated);
  };

  // Filtered requests
  const filteredRequests = requests.filter(r => {
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.assignedManagerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.projectTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesProject = projectFilter === 'all' || r.projectId === projectFilter;
    const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesProject && matchesCategory;
  });

  // Metric Stats
  const totalCount = requests.length;
  const underReviewCount = requests.filter(r => r.status === 'Under Review').length;
  const inProgressCount = requests.filter(r => r.status === 'In Progress').length;
  const fulfilledCount = requests.filter(r => r.status === 'Fulfilled').length;

  const getStatusBadge = (status: FileRequestStatus) => {
    switch (status) {
      case 'Submitted':
        return { label: 'Submitted', bg: 'bg-blue-950 text-blue-300 border-blue-500/30' };
      case 'Under Review':
        return { label: 'Under Review', bg: 'bg-purple-950 text-purple-300 border-purple-500/30' };
      case 'In Progress':
        return { label: 'In Progress', bg: 'bg-amber-950 text-amber-300 border-amber-500/30' };
      case 'Fulfilled':
        return { label: 'Fulfilled', bg: 'bg-emerald-950 text-emerald-300 border-emerald-500/30' };
      case 'Needs Clarification':
        return { label: 'Needs Clarification', bg: 'bg-rose-950 text-rose-300 border-rose-500/30' };
      default:
        return { label: status, bg: 'bg-slate-800 text-slate-400 border-white/10' };
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER & METRICS BAR */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Project File Requests & Requirement Documents
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 font-bold text-[10px] border border-blue-500/30">
              PM Collaboration
            </span>
          </div>
          <p className="text-slate-400 text-xs max-w-2xl">
            Submit formal architectural briefs, structural load specs, 3D BIM requirements, and material schedules directly to your assigned Project Managers.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Submit New File Request</span>
        </button>
      </div>

      {/* STATS METRIC TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-white/10">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Total Briefs</span>
          <div className="text-xl sm:text-2xl font-black text-white mt-1">{totalCount}</div>
          <span className="text-blue-400 text-[10px] mt-0.5 block">Document submissions</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-white/10">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Under Review</span>
          <div className="text-xl sm:text-2xl font-black text-purple-400 mt-1">{underReviewCount}</div>
          <span className="text-slate-400 text-[10px] mt-0.5 block">Pending PM review</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-white/10">
          <span className="text-slate-400 font-bold uppercase text-[10px]">In Progress</span>
          <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">{inProgressCount}</div>
          <span className="text-slate-400 text-[10px] mt-0.5 block">Active CAD/BIM drafting</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-white/10">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Fulfilled & Ready</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">{fulfilledCount}</div>
          <span className="text-emerald-400 text-[10px] mt-0.5 block">Completed deliverables</span>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search briefs by title, scope, project, or manager..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-xs"
            />
          </div>

          {/* Project Filter */}
          <select
            value={projectFilter}
            onChange={e => setProjectFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-slate-300 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="all">All Projects ({projects.length})</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>

          {/* Refresh Button */}
          <button
            onClick={loadRequests}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Refresh requests"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: `All Requests (${requests.length})` },
            { id: 'Submitted', label: `Submitted (${requests.filter(r => r.status === 'Submitted').length})` },
            { id: 'Under Review', label: `Under Review (${underReviewCount})` },
            { id: 'In Progress', label: `In Progress (${inProgressCount})` },
            { id: 'Fulfilled', label: `Fulfilled (${fulfilledCount})` },
            { id: 'Needs Clarification', label: `Clarification (${requests.filter(r => r.status === 'Needs Clarification').length})` }
          ].map(f => {
            const isActive = statusFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* REQUESTS LIST */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 space-y-3 bg-slate-900 rounded-3xl border border-white/10">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-400" />
          <p className="text-xs">Synchronizing requirement documents from Firestore...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="p-12 text-center space-y-4 bg-slate-900 rounded-3xl border border-dashed border-white/10">
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No File Requests Found</h3>
            <p className="text-slate-400 text-xs max-w-md mx-auto">
              {searchQuery || statusFilter !== 'all' || projectFilter !== 'all'
                ? 'No requirement documents match your current search filters.'
                : 'You have not submitted any project requirement documents yet. Create one to brief your Project Manager.'}
            </p>
          </div>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Requirement Document</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRequests.map(req => {
            const status = getStatusBadge(req.status);
            return (
              <div
                key={req.id}
                className="p-5 rounded-3xl bg-slate-900 border border-white/10 hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-4 shadow-xl group"
              >
                <div className="space-y-3">
                  {/* Top Bar: Category, Priority, Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-blue-300 font-bold text-[10px] border border-blue-500/20 truncate max-w-[200px]">
                      {req.category}
                    </span>

                    <div className="flex items-center space-x-1.5">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                        req.priority === 'Urgent' ? 'bg-red-950 text-red-400 border border-red-500/30' :
                        req.priority === 'High' ? 'bg-amber-950 text-amber-400 border border-amber-500/30' :
                        'bg-slate-950 text-slate-400'
                      }`}>
                        {req.priority}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${status.bg}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Title & Project Name */}
                  <div>
                    <h3 
                      onClick={() => setSelectedRequest(req)}
                      className="text-sm sm:text-base font-bold text-white group-hover:text-blue-400 transition-colors cursor-pointer line-clamp-2"
                    >
                      {req.title}
                    </h3>
                    <div className="text-slate-400 text-[11px] mt-0.5 flex items-center gap-1.5 truncate">
                      <Layers className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">{req.projectTitle}</span>
                    </div>
                  </div>

                  {/* Description Snippet */}
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed font-sans">
                    {req.description}
                  </p>

                  {/* Requested Deliverables Tag Preview */}
                  {req.deliverablesRequested && req.deliverablesRequested.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {req.deliverablesRequested.slice(0, 3).map((del, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-950 border border-white/5 text-slate-300 text-[10px]"
                        >
                          ✓ {del}
                        </span>
                      ))}
                      {req.deliverablesRequested.length > 3 && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-500 text-[10px]">
                          +{req.deliverablesRequested.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Attached Reference Documents Strip */}
                  {req.attachments && req.attachments.length > 0 && (
                    <div className="pt-2 border-t border-white/5 space-y-1.5">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Attached Brief Documents ({req.attachments.length}):</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {req.attachments.map(att => (
                          <button
                            key={att.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewDoc({
                                id: att.id,
                                name: att.name,
                                fileType: att.fileType,
                                sizeBytes: att.sizeBytes,
                                url: att.url,
                                uploadedAt: att.uploadedAt,
                                uploadedBy: req.clientName,
                                category: req.category,
                                projectTitle: req.projectTitle,
                                notes: req.description
                              });
                              setIsPreviewOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-blue-950 border border-white/10 hover:border-blue-500/40 text-slate-300 hover:text-blue-300 text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer group/btn"
                            title="Click to preview uploaded document"
                          >
                            <Paperclip className="w-3 h-3 text-blue-400 shrink-0" />
                            <span className="truncate max-w-[140px]">{att.name}</span>
                            <Eye className="w-3 h-3 text-blue-400 opacity-60 group-hover/btn:opacity-100 shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Bar: Assigned PM + Action Button */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3 text-xs">
                  {/* Assigned PM Mini-Card */}
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <img
                      src={req.assignedManagerAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'}
                      alt={req.assignedManagerName}
                      className="w-8 h-8 rounded-lg object-cover border border-blue-500/30 shrink-0"
                    />
                    <div className="truncate">
                      <div className="text-white font-bold truncate text-xs">{req.assignedManagerName}</div>
                      <div className="text-slate-400 text-[10px] truncate">{req.assignedManagerRole}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    {req.responseDeliverables && req.responseDeliverables.length > 0 && (
                      <span className="px-2 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                        <Download className="w-3 h-3" /> Ready
                      </span>
                    )}

                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>View Brief</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* NEW FILE REQUEST MODAL */}
      <NewFileRequestModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        projects={projects}
        currentSelectedProject={currentSelectedProject}
        clientUid={currentUser.uid}
        clientName={currentUser.displayName || currentUser.email?.split('@')[0] || 'Client User'}
        clientEmail={currentUser.email || ''}
        clientPhone={currentUser.phone}
        onSuccess={handleRequestCreated}
      />

      {/* FILE REQUEST DETAIL & PM COLLABORATION MODAL */}
      {selectedRequest && (
        <FileRequestDetailModal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          request={selectedRequest}
          onUpdateRequest={handleRequestUpdated}
          currentUserUid={currentUser.uid}
          currentUserName={currentUser.displayName || currentUser.email?.split('@')[0] || 'Client User'}
          initialTab={modalTab}
        />
      )}

      {/* DIRECT DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <DocumentPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          document={previewDoc}
          allDocuments={requests.flatMap(r => (r.attachments || []).map(a => ({
            id: a.id,
            name: a.name,
            fileType: a.fileType,
            sizeBytes: a.sizeBytes,
            url: a.url,
            uploadedAt: a.uploadedAt,
            uploadedBy: r.clientName,
            category: r.category,
            projectTitle: r.projectTitle,
            notes: r.description
          })))}
          onSelectDocument={(doc) => setPreviewDoc(doc)}
        />
      )}
    </div>
  );
};
