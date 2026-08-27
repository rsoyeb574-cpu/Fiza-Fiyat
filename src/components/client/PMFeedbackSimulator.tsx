import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  Download, 
  UserCheck, 
  X,
  Volume2
} from 'lucide-react';
import { ClientFileRequest, ClientNotification } from '../../types/enterprise';
import { sendClientNotification } from '../../services/notificationService';
import { saveClientFileRequest } from '../../services/enterpriseDb';
import { playNotificationChime } from '../../utils/soundEffects';

interface PMFeedbackSimulatorProps {
  isOpen?: boolean;
  requests?: ClientFileRequest[];
  fileRequests?: ClientFileRequest[];
  currentRequest?: ClientFileRequest | null;
  clientUid?: string;
  clientEmail?: string;
  clientName?: string;
  onNotificationSent?: (notif: ClientNotification) => void;
  onRequestUpdated?: (updatedReq: ClientFileRequest) => void;
  onSimulateSuccess?: () => void;
  onClose?: () => void;
}

const PM_PROFILES = [
  {
    name: 'Eng. Fiza Hayat',
    role: 'Principal Architect & Structural Lead',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    email: 'contact@fizahayatresearch.com'
  },
  {
    name: 'Rohan Mehta',
    role: 'Senior Project Manager & BIM Specialist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    email: 'rohan.mehta@fizahayat.com'
  },
  {
    name: 'Priya Verma',
    role: 'Structural Engineer & Quality Assurance',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    email: 'priya.verma@fizahayat.com'
  }
];

export const PMFeedbackSimulator: React.FC<PMFeedbackSimulatorProps> = ({
  isOpen,
  requests: propRequests,
  fileRequests,
  currentRequest,
  clientUid,
  clientEmail,
  clientName,
  onNotificationSent,
  onRequestUpdated,
  onSimulateSuccess,
  onClose
}) => {
  if (isOpen === false) return null;

  const actualRequests = propRequests || fileRequests || [];
  const [selectedRequestId, setSelectedRequestId] = useState<string>(
    currentRequest ? currentRequest.id : (actualRequests[0]?.id || '')
  );
  const [selectedPM, setSelectedPM] = useState(PM_PROFILES[0]);
  const [actionType, setActionType] = useState<'review' | 'approve' | 'feedback' | 'deliverable'>('review');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const activeTargetRequest: ClientFileRequest | null = actualRequests.find(r => r.id === selectedRequestId) || currentRequest || actualRequests[0] || (
    actualRequests.length === 0 ? {
      id: 'brief-demo-1',
      title: 'Structural Load Analysis for Cantilever Balcony',
      projectTitle: 'Hayat Luxury Villa & Penthouse',
      projectId: 'proj-1',
      clientUid: clientUid || 'client-demo',
      clientName: clientName || 'Client User',
      clientEmail: clientEmail || 'client@example.com',
      assignedManagerUid: 'pm-1',
      assignedManagerName: 'Eng. Fiza Hayat',
      assignedManagerRole: 'Principal Architect',
      assignedManagerAvatar: PM_PROFILES[0].avatar,
      assignedManagerEmail: PM_PROFILES[0].email,
      category: 'Structural & Foundation Specs' as const,
      priority: 'High' as const,
      status: 'Submitted' as const,
      description: 'Request for structural review and calculation notes.',
      deliverablesRequested: ['Structural Calculation Report (PDF)', 'Foundation Layout (DWG)'],
      attachments: [],
      responseDeliverables: [],
      messages: [],
      adminNotes: '',
      createdAt: 'Today',
      updatedAt: 'Today'
    } : null
  );

  const handleSimulateAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTargetRequest) return;

    setIsSubmitting(true);
    setSuccessMessage(null);

    const nowStr = 'Just now';
    const timestamp = Date.now();

    let notifTitle = '';
    let notifMessage = '';
    let notifType: any = 'requirement_reviewed';
    let updatedStatus = activeTargetRequest.status;
    let newAdminNotes = activeTargetRequest.adminNotes;
    let deliverables = activeTargetRequest.responseDeliverables || [];
    let messages = activeTargetRequest.messages || [];

    if (actionType === 'review') {
      notifType = 'requirement_reviewed';
      updatedStatus = 'Under Review';
      notifTitle = `Requirement Reviewed by ${selectedPM.name}`;
      notifMessage = customNotes.trim() || `${selectedPM.name} has completed the preliminary engineering review on "${activeTargetRequest.title}" and queued it for structural modeling.`;
      newAdminNotes = `Reviewed on ${new Date().toLocaleDateString()}: ${notifMessage}`;
    } else if (actionType === 'approve') {
      notifType = 'requirement_approved';
      updatedStatus = 'Fulfilled';
      notifTitle = `Requirement Approved & Sign-Off by ${selectedPM.name}`;
      notifMessage = customNotes.trim() || `All architectural parameters and technical loads for "${activeTargetRequest.title}" have been officially approved. Detailed drafting pack is ready for download.`;
      newAdminNotes = `Approved by ${selectedPM.name}: ${notifMessage}`;
      
      // Also attach an approved CAD deliverable
      const newDeliverable = {
        id: `deliv-${Date.now()}`,
        title: `FH_${activeTargetRequest.title.replace(/\s+/g, '_').substring(0, 24)}_Approved_Drawing.dwg`,
        fileType: 'dwg' as const,
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedBy: selectedPM.name,
        uploadedAt: 'Today',
        notes: `Approved for site execution by ${selectedPM.name}`
      };
      deliverables = [newDeliverable, ...deliverables];
    } else if (actionType === 'feedback') {
      notifType = 'pm_feedback';
      notifTitle = `New Feedback from ${selectedPM.name}`;
      notifMessage = customNotes.trim() || `${selectedPM.name}: "We have verified the cantilever span calculations against IS 456 codes. Rebar detailing has been adjusted to 16mm Fe500D bars."`;
      
      const newMsg = {
        id: `msg-${Date.now()}`,
        senderUid: `pm-${selectedPM.name.toLowerCase().replace(/\s+/g, '-')}`,
        senderName: selectedPM.name,
        senderRole: 'Principal Architect' as const,
        senderAvatar: selectedPM.avatar,
        text: notifMessage,
        createdAt: 'Just now'
      };
      messages = [...messages, newMsg];
    } else if (actionType === 'deliverable') {
      notifType = 'deliverable_uploaded';
      updatedStatus = 'In Progress';
      notifTitle = `CAD / BIM Deliverable Uploaded by ${selectedPM.name}`;
      notifMessage = customNotes.trim() || `${selectedPM.name} uploaded new 3D BIM structural layout & CAD drawing for "${activeTargetRequest.title}".`;
      
      const newDeliverable = {
        id: `deliv-${Date.now()}`,
        title: `FH_${activeTargetRequest.title.replace(/\s+/g, '_').substring(0, 24)}_BIM_Model.rvt`,
        fileType: 'rvt' as const,
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedBy: selectedPM.name,
        uploadedAt: 'Today',
        notes: `3D model package ready for review`
      };
      deliverables = [newDeliverable, ...deliverables];
    }

    // 1. Update ClientFileRequest in Firestore & Local State
    const updatedRequest: ClientFileRequest = {
      ...activeTargetRequest,
      status: updatedStatus,
      adminNotes: newAdminNotes,
      responseDeliverables: deliverables,
      messages: messages,
      updatedAt: 'Just now'
    };

    await saveClientFileRequest(updatedRequest);
    if (onRequestUpdated) {
      onRequestUpdated(updatedRequest);
    }

    // 2. Dispatch Real-time Notification
    const newNotif = await sendClientNotification({
      clientUid: activeTargetRequest.clientUid,
      clientEmail: activeTargetRequest.clientEmail,
      clientName: activeTargetRequest.clientName,
      projectId: activeTargetRequest.projectId,
      projectTitle: activeTargetRequest.projectTitle,
      fileRequestId: activeTargetRequest.id,
      fileRequestTitle: activeTargetRequest.title,
      type: notifType,
      title: notifTitle,
      message: notifMessage,
      managerName: selectedPM.name,
      managerRole: selectedPM.role,
      managerAvatar: selectedPM.avatar,
      managerEmail: selectedPM.email,
      priority: actionType === 'approve' ? 'High' : (actionType === 'review' ? 'Urgent' : 'Medium'),
      read: false,
      actionType: actionType === 'approve' || actionType === 'deliverable' ? 'open_deliverables' : 'open_brief'
    });

    if (onNotificationSent) {
      onNotificationSent(newNotif);
    }
    if (onSimulateSuccess) {
      onSimulateSuccess();
    }

    setIsSubmitting(false);
    setSuccessMessage(`Real-time alert successfully broadcasted to client!`);
    setCustomNotes('');

    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-blue-500/30 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <span>Project Manager Review & Notification Engine</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                Live Simulator
              </span>
            </h3>
            <p className="text-slate-400 text-xs">
              Simulate real-time alerts when requirement briefs are reviewed, approved, or commented on by project managers.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSimulateAction} className="space-y-5">
        {/* Step 1: Select Target Requirement Brief */}
        <div className="space-y-1.5">
          <label className="text-slate-300 font-bold text-xs flex items-center justify-between">
            <span>1. Target Requirement Brief:</span>
            <span className="text-blue-400 text-[10px]">{actualRequests.length} briefs available</span>
          </label>
          <select
            value={selectedRequestId}
            onChange={e => setSelectedRequestId(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {actualRequests.map(r => (
              <option key={r.id} value={r.id}>
                [{r.status}] {r.title} ({r.category})
              </option>
            ))}
          </select>
        </div>

        {/* Step 2: Select Acting Project Manager */}
        <div className="space-y-1.5">
          <label className="text-slate-300 font-bold text-xs">
            2. Acting Project Manager:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {PM_PROFILES.map(pm => {
              const isSelected = selectedPM.name === pm.name;
              return (
                <div
                  key={pm.name}
                  onClick={() => setSelectedPM(pm)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center space-x-3 ${
                    isSelected
                      ? 'bg-blue-950/60 border-blue-500 text-white shadow-lg'
                      : 'bg-slate-950 border-white/5 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <img
                    src={pm.avatar}
                    alt={pm.name}
                    className="w-9 h-9 rounded-xl object-cover border border-white/10 shrink-0"
                  />
                  <div className="truncate">
                    <div className="font-bold text-xs truncate text-white">{pm.name}</div>
                    <div className="text-[10px] text-blue-400 truncate">{pm.role}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Select Action Trigger */}
        <div className="space-y-1.5">
          <label className="text-slate-300 font-bold text-xs">
            3. Project Manager Action Trigger:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'review', label: 'Review Brief', icon: Clock, desc: 'Sets status to Under Review' },
              { id: 'approve', label: 'Approve & Sign Off', icon: CheckCircle2, desc: 'Marks Fulfilled with CAD dwg' },
              { id: 'feedback', label: 'Provide Feedback', icon: MessageSquare, desc: 'Sends technical note' },
              { id: 'deliverable', label: 'Upload Deliverable', icon: Download, desc: 'Adds BIM/CAD file' }
            ].map(act => {
              const Icon = act.icon;
              const isSelected = actionType === act.id;
              return (
                <button
                  type="button"
                  key={act.id}
                  onClick={() => setActionType(act.id as any)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border-blue-500 text-white shadow-md'
                      : 'bg-slate-950 border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span className="font-bold text-xs text-white">{act.label}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-snug">{act.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: Custom Notes / Remarks */}
        <div className="space-y-1.5">
          <label className="text-slate-300 font-bold text-xs flex items-center justify-between">
            <span>4. Custom PM Message / Engineering Notes (Optional):</span>
            <span className="text-slate-500 text-[10px]">Leave blank for realistic automated message</span>
          </label>
          <textarea
            rows={2}
            value={customNotes}
            onChange={e => setCustomNotes(e.target.value)}
            placeholder="e.g. Deflection checks verified per IS 456. Balcony slab reinforced with 16mm rebars at 150mm c/c."
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-xs font-sans resize-none"
          />
        </div>

        {/* Feedback / Success Notification */}
        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="font-semibold">{successMessage}</div>
          </div>
        )}

        {/* Submit Button & Sound Test */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => playNotificationChime('feedback')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-white/10 text-slate-300 text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Test notification chime sound"
          >
            <Volume2 className="w-4 h-4 text-blue-400" />
            <span>Test Audio Chime</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting || !activeTargetRequest}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Broadcasting Alert...' : 'Dispatch Real-Time Notification'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
