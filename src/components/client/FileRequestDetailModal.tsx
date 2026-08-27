import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  Paperclip, 
  User, 
  Building2, 
  ShieldCheck, 
  Printer, 
  MessageSquare, 
  Layers, 
  Sparkles, 
  FileCode, 
  ArrowRight,
  ExternalLink,
  Check,
  RefreshCw,
  Eye
} from 'lucide-react';
import { 
  ClientFileRequest, 
  FileRequestStatus, 
  FileRequestMessage,
  FileRequestAttachment 
} from '../../types/enterprise';
import { saveClientFileRequest } from '../../services/enterpriseDb';
import { DocumentPreviewModal, PreviewableDocument } from './DocumentPreviewModal';

interface FileRequestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ClientFileRequest;
  onUpdateRequest: (updated: ClientFileRequest) => void;
  currentUserUid: string;
  currentUserName: string;
}

export const FileRequestDetailModal: React.FC<FileRequestDetailModalProps> = ({
  isOpen,
  onClose,
  request,
  onUpdateRequest,
  currentUserUid,
  currentUserName
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'discussion' | 'deliverables'>('details');
  const [newMsgText, setNewMsgText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  // File Preview Modal State
  const [previewDoc, setPreviewDoc] = useState<PreviewableDocument | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (!isOpen) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const getStatusBadge = (status: FileRequestStatus) => {
    switch (status) {
      case 'Submitted':
        return { label: 'Submitted to PM', bg: 'bg-blue-950 text-blue-300 border-blue-500/30' };
      case 'Under Review':
        return { label: 'Under Review by PM', bg: 'bg-purple-950 text-purple-300 border-purple-500/30' };
      case 'In Progress':
        return { label: 'In Progress (Drafting)', bg: 'bg-amber-950 text-amber-300 border-amber-500/30' };
      case 'Fulfilled':
        return { label: 'Fulfilled & Ready', bg: 'bg-emerald-950 text-emerald-300 border-emerald-500/30' };
      case 'Needs Clarification':
        return { label: 'Clarification Needed', bg: 'bg-rose-950 text-rose-300 border-rose-500/30' };
      case 'Cancelled':
        return { label: 'Cancelled', bg: 'bg-slate-800 text-slate-400 border-white/10' };
      default:
        return { label: status, bg: 'bg-slate-900 text-slate-300 border-white/10' };
    }
  };

  const statusBadge = getStatusBadge(request.status);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsgText.trim()) return;

    setIsSending(true);
    const newMsg: FileRequestMessage = {
      id: `fmsg-${Date.now()}`,
      senderUid: currentUserUid || 'client-user',
      senderName: currentUserName || 'Client User',
      senderRole: 'Client',
      text: newMsgText.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated: ClientFileRequest = {
      ...request,
      messages: [...(request.messages || []), newMsg],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    await saveClientFileRequest(updated);
    onUpdateRequest(updated);
    setNewMsgText('');
    setIsSending(false);
  };

  const handleStatusChange = async (newStatus: FileRequestStatus) => {
    setIsUpdatingStatus(true);
    const statusNote: FileRequestMessage = {
      id: `fmsg-status-${Date.now()}`,
      senderUid: currentUserUid || 'client-user',
      senderName: currentUserName || 'Client User',
      senderRole: 'Client',
      text: `Status updated by Client to: ${newStatus}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated: ClientFileRequest = {
      ...request,
      status: newStatus,
      messages: [...(request.messages || []), statusNote],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    await saveClientFileRequest(updated);
    onUpdateRequest(updated);
    setIsUpdatingStatus(false);
  };

  const handlePrintSummary = () => {
    window.print();
  };

  // Build previewable list from all attachments & deliverables
  const allPreviewableDocs: PreviewableDocument[] = [
    ...(request.attachments || []).map(att => ({
      id: att.id,
      name: att.name,
      fileType: att.fileType,
      sizeBytes: att.sizeBytes,
      url: att.url,
      uploadedAt: att.uploadedAt,
      uploadedBy: request.clientName,
      category: request.category,
      projectTitle: request.projectTitle,
      notes: request.description
    })),
    ...(request.responseDeliverables || []).map(resp => ({
      id: resp.id,
      name: resp.title,
      fileType: resp.fileType,
      url: resp.url,
      uploadedAt: resp.uploadedAt,
      uploadedBy: resp.uploadedBy,
      category: 'Deliverable',
      projectTitle: request.projectTitle,
      notes: resp.notes
    }))
  ];

  const handleOpenPreviewForAttachment = (att: FileRequestAttachment) => {
    const doc: PreviewableDocument = {
      id: att.id,
      name: att.name,
      fileType: att.fileType,
      sizeBytes: att.sizeBytes,
      url: att.url,
      uploadedAt: att.uploadedAt,
      uploadedBy: request.clientName,
      category: request.category,
      projectTitle: request.projectTitle,
      notes: request.description
    };
    setPreviewDoc(doc);
    setIsPreviewOpen(true);
  };

  const handleOpenPreviewForDeliverable = (resp: any) => {
    const doc: PreviewableDocument = {
      id: resp.id,
      name: resp.title,
      fileType: resp.fileType,
      url: resp.url,
      uploadedAt: resp.uploadedAt,
      uploadedBy: resp.uploadedBy,
      category: 'Deliverable',
      projectTitle: request.projectTitle,
      notes: resp.notes
    };
    setPreviewDoc(doc);
    setIsPreviewOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 font-bold text-[10px] border border-blue-500/30">
                  {request.category}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${statusBadge.bg}`}>
                  {statusBadge.label}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  request.priority === 'Urgent' ? 'bg-red-950 text-red-400 border border-red-500/30' :
                  request.priority === 'High' ? 'bg-amber-950 text-amber-400 border border-amber-500/30' :
                  'bg-slate-800 text-slate-300'
                }`}>
                  {request.priority} Priority
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {request.title}
              </h2>
              <p className="text-slate-400 text-xs flex items-center gap-2">
                <span>Project: <strong className="text-slate-200">{request.projectTitle}</strong></span>
                <span>•</span>
                <span>Submitted: {request.createdAt}</span>
                {request.targetDueDate && (
                  <>
                    <span>•</span>
                    <span className="text-blue-300">Target Due: {request.targetDueDate}</span>
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrintSummary}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Print requirement brief"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print Brief</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* PROGRESS STEPS BAR */}
          <div className="mt-5 pt-4 border-t border-white/5 grid grid-cols-4 gap-2 text-center text-[11px]">
            {[
              { id: 'Submitted', label: '1. Submitted', active: true },
              { id: 'Under Review', label: '2. Under Review', active: ['Under Review', 'In Progress', 'Fulfilled'].includes(request.status) },
              { id: 'In Progress', label: '3. In Progress', active: ['In Progress', 'Fulfilled'].includes(request.status) },
              { id: 'Fulfilled', label: '4. Fulfilled', active: request.status === 'Fulfilled' }
            ].map(step => (
              <div 
                key={step.id} 
                className={`p-2 rounded-xl border transition-all ${
                  step.active 
                    ? 'bg-blue-950/60 border-blue-500/40 text-blue-200 font-bold' 
                    : 'bg-slate-950/40 border-white/5 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  {step.active && <CheckCircle2 className="w-3 h-3 text-blue-400" />}
                  <span>{step.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ASSIGNED PROJECT MANAGER BAR */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={request.assignedManagerAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'}
                alt={request.assignedManagerName}
                className="w-10 h-10 rounded-xl object-cover border border-blue-500/40"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-950"></span>
            </div>
            <div>
              <div className="text-white font-bold">{request.assignedManagerName}</div>
              <div className="text-blue-400 text-[11px]">{request.assignedManagerRole} • Lead Consultant</div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('discussion')}
              className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-semibold text-[11px] flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Message Manager ({request.messages?.length || 0})</span>
            </button>
            {request.responseDeliverables && request.responseDeliverables.length > 0 && (
              <button
                onClick={() => setActiveTab('deliverables')}
                className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold text-[11px] flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Files Provided ({request.responseDeliverables.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex items-center space-x-2 px-6 pt-3 border-b border-white/5 text-xs bg-slate-900">
          {[
            { id: 'details', label: 'Requirement Scope & Documents', icon: FileText },
            { id: 'deliverables', label: `PM Response Deliverables (${request.responseDeliverables?.length || 0})`, icon: Download },
            { id: 'discussion', label: `Discussion & Clarifications (${request.messages?.length || 0})`, icon: MessageSquare }
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-4 py-2.5 font-bold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
                  isActive 
                    ? 'border-blue-500 text-white bg-blue-950/20' 
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: DETAILS & DOCUMENTS */}
        {activeTab === 'details' && (
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
            {/* Admin/PM Notes if present */}
            {request.adminNotes && (
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1">
                <div className="text-indigo-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Update from {request.assignedManagerName}:</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{request.adminNotes}</p>
              </div>
            )}

            {/* Detailed Scope Section */}
            <div className="space-y-2">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider text-slate-400">
                Requirement Description & Scope of Work:
              </h4>
              <div className="p-4 rounded-2xl bg-slate-950 border border-white/5 text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                {request.description}
              </div>
            </div>

            {/* Requested Deliverables List */}
            {request.deliverablesRequested && request.deliverablesRequested.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-white font-bold text-xs uppercase tracking-wider text-slate-400">
                  Required Deliverables & File Formats:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {request.deliverablesRequested.map((del, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950 border border-white/5 flex items-center space-x-2.5"
                    >
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-white font-medium text-xs">{del}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Client Uploaded Attachments */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider text-slate-400">
                Attached Reference Documents ({request.attachments?.length || 0}):
              </h4>
              {request.attachments && request.attachments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {request.attachments.map(att => (
                    <div
                      key={att.id}
                      onClick={() => handleOpenPreviewForAttachment(att)}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 hover:border-blue-500/50 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center space-x-3 truncate">
                        <div className="p-2 rounded-xl bg-blue-950 text-blue-400 group-hover:scale-105 transition-transform shrink-0">
                          <Paperclip className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <div className="text-white font-bold truncate group-hover:text-blue-300 transition-colors">
                            {att.name}
                          </div>
                          <div className="text-slate-400 text-[10px]">
                            {att.fileType.toUpperCase()} • {formatFileSize(att.sizeBytes)} • Uploaded {att.uploadedAt}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenPreviewForAttachment(att);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Preview</span>
                        </button>

                        <a
                          href={att.url}
                          download={att.name}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Direct Download"
                        >
                          <Download className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-950 border border-dashed border-white/10 text-center text-slate-500">
                  No reference files attached to this request.
                </div>
              )}
            </div>

            {/* Client Status Actions */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-white font-bold">Manage Request Status</div>
                <div className="text-slate-400 text-[11px]">Keep your project manager informed about this requirement.</div>
              </div>

              <div className="flex items-center space-x-2">
                {request.status !== 'Fulfilled' && (
                  <button
                    disabled={isUpdatingStatus}
                    onClick={() => handleStatusChange('Fulfilled')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer"
                  >
                    Mark as Satisfied / Fulfilled
                  </button>
                )}
                {request.status !== 'Needs Clarification' && (
                  <button
                    disabled={isUpdatingStatus}
                    onClick={() => handleStatusChange('Needs Clarification')}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] cursor-pointer"
                  >
                    Request Clarification
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PM RESPONSE DELIVERABLES */}
        {activeTab === 'deliverables' && (
          <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Files Provided by Project Manager</h3>
                <p className="text-slate-400 text-xs">
                  CAD files, engineering sheets, 3D renderings, and specifications uploaded by {request.assignedManagerName}.
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                Official Deliverables
              </span>
            </div>

            {request.responseDeliverables && request.responseDeliverables.length > 0 ? (
              <div className="space-y-3">
                {request.responseDeliverables.map(resp => (
                  <div
                    key={resp.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 shrink-0">
                        <FileCode className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <div className="text-white font-bold text-xs truncate">{resp.title}</div>
                        <div className="text-slate-400 text-[10px]">
                          Format: <strong className="text-slate-200">{resp.fileType.toUpperCase()}</strong> • Uploaded by {resp.uploadedBy} on {resp.uploadedAt}
                        </div>
                        {resp.notes && (
                          <div className="text-emerald-300/90 text-[11px] mt-1 bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/20">
                            {resp.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenPreviewForDeliverable(resp)}
                        className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview Drawing</span>
                      </button>

                      <a
                        href={resp.url}
                        download
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-lg cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download File</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-950 border border-dashed border-white/10 text-center space-y-2">
                <Clock className="w-8 h-8 text-amber-400 mx-auto" />
                <div className="text-white font-bold">No Deliverables Uploaded Yet</div>
                <p className="text-slate-400 text-xs max-w-md mx-auto">
                  {request.assignedManagerName} is currently reviewing your requirement brief. Once working drawings or models are generated, they will appear here for one-click download.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DISCUSSION & CLARIFICATIONS */}
        {activeTab === 'discussion' && (
          <div className="p-6 overflow-y-auto space-y-4 flex-1 flex flex-col h-[480px] text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div>
                <h3 className="text-sm font-bold text-white">Direct Brief Collaboration Thread</h3>
                <p className="text-slate-400 text-xs">Chat directly with {request.assignedManagerName} regarding this requirement.</p>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-950 rounded-2xl border border-white/5">
              {(request.messages || []).map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.senderRole === 'Client' ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] text-slate-400 mb-0.5 flex items-center gap-1.5">
                    <span className="font-bold text-slate-300">{msg.senderName}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] ${msg.senderRole === 'Client' ? 'bg-blue-950 text-blue-300' : 'bg-emerald-950 text-emerald-300'}`}>
                      {msg.senderRole}
                    </span>
                    <span>• {msg.createdAt}</span>
                  </div>
                  <div
                    className={`p-3.5 rounded-2xl max-w-lg leading-relaxed ${
                      msg.senderRole === 'Client'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-800 text-slate-200 border border-white/10 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Send Message Form */}
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2 pt-2">
              <input
                type="text"
                value={newMsgText}
                onChange={e => setNewMsgText(e.target.value)}
                placeholder={`Type a note or query for ${request.assignedManagerName}...`}
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-sans"
              />
              <button
                type="submit"
                disabled={isSending || !newMsgText.trim()}
                className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 shadow-lg cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* DOCUMENT PREVIEW MODAL OVERLAY */}
      {previewDoc && (
        <DocumentPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          document={previewDoc}
          allDocuments={allPreviewableDocs}
          onSelectDocument={(doc) => setPreviewDoc(doc)}
        />
      )}
    </div>
  );
};
