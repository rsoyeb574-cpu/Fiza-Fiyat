import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  ShieldCheck,
  Check,
  CheckCheck,
  Clock,
  FileCode,
  FileText,
  Paperclip,
  Layers,
  Sparkles,
  AlertCircle,
  Search,
  Filter,
  Download,
  ExternalLink,
  ChevronDown,
  User,
  Sliders,
  Award,
  RefreshCw,
  Eye,
  Plus,
  Compass,
  CheckCircle2,
  HelpCircle,
  Bot,
  Zap,
  Volume2,
  Mic,
  Maximize2,
  X,
  Building2,
  Tag
} from 'lucide-react';
import { Project } from '../../types';
import { 
  ProjectRevisionMessage, 
  ProjectRevisionItem, 
  RevisionParticipant,
  RevisionSuggestedChange
} from '../../types/projectRevisionChat';
import {
  DEFAULT_PARTICIPANTS,
  getProjectRevisionItems,
  subscribeToProjectRevisions,
  sendProjectRevisionMessage,
  toggleRevisionResolution,
  approveRevisionChange,
  toggleMessageReaction,
  simulateDesignerOrClientReply
} from '../../services/projectRevisionChatService';

interface ProjectRevisionChatProps {
  project: Project;
  embeddedMode?: 'full' | 'compact' | 'drawer';
  onCloseDrawer?: () => void;
  onOpenDrawingSheet?: (sheetRef: string) => void;
}

export const ProjectRevisionChat: React.FC<ProjectRevisionChatProps> = ({
  project,
  embeddedMode = 'full',
  onCloseDrawer,
  onOpenDrawingSheet
}) => {
  // Participants & Active Persona
  const participants = DEFAULT_PARTICIPANTS;
  const [activeUser, setActiveUser] = useState<RevisionParticipant>(participants[0]); // Default to Client
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);

  // Messages & Revisions
  const [messages, setMessages] = useState<ProjectRevisionMessage[]>([]);
  const [revisionItems, setRevisionItems] = useState<ProjectRevisionItem[]>(() => 
    getProjectRevisionItems(project.id)
  );
  const [selectedRevisionFilter, setSelectedRevisionFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'action'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Input & Composer State
  const [inputText, setInputText] = useState('');
  const [selectedRevisionId, setSelectedRevisionId] = useState<string>('REV-03');
  const [drawingSheetRef, setDrawingSheetRef] = useState<string>('S-305 Cantilever Detail');
  const [priority, setPriority] = useState<'Normal' | 'Urgent' | 'Milestone Approval' | 'Site RFI'>('Normal');
  const [isSpecChangeOpen, setIsSpecChangeOpen] = useState(false);
  const [specChangeData, setSpecChangeData] = useState<RevisionSuggestedChange>({
    element: 'Cantilever Slab Overhang',
    discipline: 'Structural',
    previousSpec: '1.80m cantilever with 12mm rebar @ 150mm',
    proposedSpec: '2.10m cantilever with 16mm Fe550D rebar + 20mm pre-camber',
    costImpact: '+₹72,500',
    structuralCompliance: 'IS 456 Cl. 23.2 Deflection Verified'
  });
  
  // Attachments State
  const [attachmentPreset, setAttachmentPreset] = useState<'none' | 'drawing' | 'spec_pdf' | 'site_photo'>('none');
  const [autoSimulateReply, setAutoSimulateReply] = useState(true);
  const [isAiSuggesting, setIsAiSuggesting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [audioVoiceNoteActive, setAudioVoiceNoteActive] = useState(false);
  const [voiceTimer, setVoiceTimer] = useState(0);

  // Lightbox for attachment preview
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Scroll Container Ref
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voiceIntervalRef = useRef<any>(null);

  // Subscribe to real-time updates from Firestore/Local
  useEffect(() => {
    const unsubscribe = subscribeToProjectRevisions(
      project.id,
      project.title,
      (updated) => {
        setMessages(updated);
      }
    );

    return () => {
      unsubscribe();
      if (voiceIntervalRef.current) clearInterval(voiceIntervalRef.current);
    };
  }, [project.id, project.title]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, selectedRevisionFilter]);

  // Filter messages based on Revision ID, Status, and Search Query
  const filteredMessages = messages.filter((m) => {
    const matchesRevision = selectedRevisionFilter === 'ALL' || m.revisionId === selectedRevisionFilter;
    const matchesStatus = 
      statusFilter === 'all' ? true :
      statusFilter === 'pending' ? m.revisionStatus === 'under_review' || m.revisionStatus === 'proposed' :
      statusFilter === 'approved' ? m.revisionStatus === 'client_approved' :
      statusFilter === 'action' ? !m.resolved : true;

    const matchesSearch = 
      !searchQuery.trim() ||
      m.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.revisionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.drawingSheetRef && m.drawingSheetRef.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesRevision && matchesStatus && matchesSearch;
  });

  // Handle Voice Note Simulation
  const toggleVoiceRecording = () => {
    if (audioVoiceNoteActive) {
      clearInterval(voiceIntervalRef.current);
      setAudioVoiceNoteActive(false);
      // Auto-populate message with audio note
      const currentRev = revisionItems.find(r => r.id === selectedRevisionId);
      const newVoiceMsg: ProjectRevisionMessage = {
        id: `rev-msg-${Date.now()}`,
        projectId: project.id,
        projectTitle: project.title,
        revisionId: selectedRevisionId,
        revisionTitle: currentRev?.title || 'General Revision Discussion',
        drawingSheetRef: drawingSheetRef || undefined,
        senderUid: activeUser.uid,
        senderName: activeUser.name,
        senderRole: activeUser.role,
        senderRoleLabel: activeUser.roleTitle,
        senderAvatar: activeUser.avatar,
        isAuthorizedClient: activeUser.isAuthorizedClient,
        isVerifiedDesigner: activeUser.isVerifiedDesigner,
        priority: 'Normal',
        text: `🎙️ Audio Voice Note recorded on site regarding ${currentRev?.title || 'drawing specifications'} (${voiceTimer}s)`,
        attachment: {
          name: `Voice_Note_${selectedRevisionId}_${new Date().toLocaleTimeString()}.m4a`,
          url: 'https://cdn.freesound.org/previews/564/564414_11861866-lq.mp3',
          type: 'voice_note',
          sizeLabel: `${(voiceTimer * 12).toFixed(0)} KB`,
          caption: `Voice commentary by ${activeUser.name} (${activeUser.roleTitle})`,
          durationSeconds: voiceTimer
        },
        resolved: false,
        timestamp: Date.now(),
        createdAt: 'Just now'
      };
      sendProjectRevisionMessage(newVoiceMsg);
      setVoiceTimer(0);
    } else {
      setAudioVoiceNoteActive(true);
      setVoiceTimer(0);
      voiceIntervalRef.current = setInterval(() => {
        setVoiceTimer(prev => prev + 1);
      }, 1000);
    }
  };

  // Send Message
  const handleSendMessage = async () => {
    if (!inputText.trim() && attachmentPreset === 'none') return;

    const currentRev = revisionItems.find(r => r.id === selectedRevisionId);

    let attachmentObj = undefined;
    if (attachmentPreset === 'drawing') {
      attachmentObj = {
        name: `${selectedRevisionId}_CAD_Working_Drawing.dwg`,
        url: project.coverImage || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
        type: 'drawing' as const,
        sizeLabel: '3.8 MB',
        caption: `Architectural CAD Revision markup for Sheet ${drawingSheetRef}`
      };
    } else if (attachmentPreset === 'spec_pdf') {
      attachmentObj = {
        name: `${selectedRevisionId}_Material_Specification.pdf`,
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        type: 'pdf' as const,
        sizeLabel: '1.5 MB',
        caption: `Certified engineering data sheet & load schedule.`
      };
    } else if (attachmentPreset === 'site_photo') {
      attachmentObj = {
        name: `Site_Progress_${new Date().toISOString().slice(0, 10)}.jpg`,
        url: project.images?.[1] || project.coverImage || 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f2?auto=format&fit=crop&w=1200&q=80',
        type: 'image' as const,
        sizeLabel: '2.9 MB',
        caption: `Site rebar inspection photo before concrete pour.`
      };
    }

    const newMessage: ProjectRevisionMessage = {
      id: `rev-msg-${Date.now()}`,
      projectId: project.id,
      projectTitle: project.title,
      revisionId: selectedRevisionId,
      revisionTitle: currentRev?.title || 'General Project Revision',
      drawingSheetRef: drawingSheetRef.trim() || undefined,
      senderUid: activeUser.uid,
      senderName: activeUser.name,
      senderRole: activeUser.role,
      senderRoleLabel: activeUser.roleTitle,
      senderAvatar: activeUser.avatar,
      isAuthorizedClient: activeUser.isAuthorizedClient,
      isVerifiedDesigner: activeUser.isVerifiedDesigner,
      priority,
      text: inputText.trim(),
      suggestedChange: isSpecChangeOpen ? specChangeData : undefined,
      attachment: attachmentObj,
      revisionStatus: isSpecChangeOpen ? 'under_review' : 'proposed',
      resolved: false,
      timestamp: Date.now(),
      createdAt: 'Just now'
    };

    setInputText('');
    setAttachmentPreset('none');
    setIsSpecChangeOpen(false);

    await sendProjectRevisionMessage(newMessage);

    // Auto-Simulate bilateral response if enabled
    if (autoSimulateReply) {
      const responder = activeUser.isAuthorizedClient 
        ? participants.find(p => p.role === 'lead_architect' || p.role === 'structural_engineer') || participants[1]
        : participants[0]; // If designer spoke, client responds

      setTimeout(() => {
        simulateDesignerOrClientReply(newMessage, activeUser, responder);
      }, 1600);
    }
  };

  // AI Assistant Quick Suggestions
  const handleGenerateAiSuggestions = () => {
    setIsAiSuggesting(true);
    setTimeout(() => {
      if (activeUser.isAuthorizedClient) {
        setAiSuggestions([
          `"We have reviewed the deflection calculations. Please proceed with the 2.1m cantilever extension and 16mm Fe550D rebars."`,
          `"Could you provide a 3D perspective showing the underside of the balcony soffit with integrated LED strip lighting?"`,
          `"Approved from our end! Please ensure the change is communicated to the MEP contractor before ceiling works begin."`
        ]);
      } else {
        setAiSuggestions([
          `"Per IS 456 Cl. 23.2, effective span-to-depth ratio for cantilevers is capped at 7.0. Our 200mm slab thickness ensures tip deflection is under 5.2mm."`,
          `"We have coordinated with the facade vendor. The thermal break profile will align flush with the perimeter drop beam."`,
          `"Revised drawing package ${selectedRevisionId} has been uploaded. All rebar lap lengths follow IS 13920 ductile detailing criteria."`
        ]);
      }
      setIsAiSuggesting(false);
    }, 600);
  };

  // Export Revision Minutes as Markdown
  const handleExportMinutes = () => {
    const dateStr = new Date().toLocaleDateString();
    let content = `# ARCHITECTURAL & STRUCTURAL REVISION MINUTES\n`;
    content += `**Project:** ${project.title} (ID: ${project.id})\n`;
    content += `**Date of Issue:** ${dateStr}\n`;
    content += `**Client:** Aarav Sharma (Azure Horizon Estates)\n`;
    content += `**Lead Architect:** Eng. Fiza Hayat (COA/2016/74829)\n`;
    content += `**Lead Structural Engineer:** Ar. Rohit Verma (SE/MH/2018/1109)\n\n`;
    content += `---\n\n`;
    content += `## ACTIVE REVISION SCHEDULE\n\n`;

    revisionItems.forEach((rev) => {
      content += `### [${rev.code}] ${rev.title}\n`;
      content += `- **Discipline:** ${rev.discipline}\n`;
      content += `- **Status:** ${rev.status}\n`;
      content += `- **Lead:** ${rev.leadDesigner}\n`;
      content += `- **Sheets:** ${rev.drawingSheets.join(', ')}\n\n`;
    });

    content += `---\n\n`;
    content += `## RECORDED DISCUSSIONS & CLIENT APPROVALS\n\n`;

    messages.forEach((msg, idx) => {
      content += `### ${idx + 1}. [${msg.revisionId}] ${msg.senderName} (${msg.senderRoleLabel})\n`;
      content += `*Timestamp: ${msg.createdAt} | Drawing Ref: ${msg.drawingSheetRef || 'General'}*\n\n`;
      content += `> ${msg.text}\n\n`;

      if (msg.suggestedChange) {
        content += `**Specification Diff:**\n`;
        content += `- Element: ${msg.suggestedChange.element}\n`;
        content += `- Previous: ${msg.suggestedChange.previousSpec}\n`;
        content += `- Proposed: ${msg.suggestedChange.proposedSpec}\n`;
        content += `- Cost Delta: ${msg.suggestedChange.costImpact || 'N/A'}\n`;
        content += `- Code Compliance: ${msg.suggestedChange.structuralCompliance || 'Verified'}\n\n`;
      }

      if (msg.clientSignoff) {
        content += `✅ **CLIENT SIGNOFF STAMP**: Signed by ${msg.clientSignoff.signedBy} on ${new Date(msg.clientSignoff.timestamp).toLocaleString()}\n`;
        content += `*Note: ${msg.clientSignoff.signatureNote}*\n\n`;
      }

      content += `---\n\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.title.replace(/\s+/g, '_')}_Revision_Minutes_${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-neutral-950/80 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl flex flex-col h-[760px] max-h-[85vh]">
      
      {/* 1. TOP CONTROL BAR */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-neutral-900/80 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Project & Active Revisions Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Revision Deliberations</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Real-Time Channel
                </span>
              </h3>
            </div>
            <p className="text-xs text-neutral-400 flex items-center gap-2 mt-0.5">
              <span>{project.title}</span>
              <span>•</span>
              <span className="text-blue-400 font-semibold">{messages.length} revisions logged</span>
            </p>
          </div>
        </div>

        {/* Right: Active Role Switcher & Minutes Export */}
        <div className="flex items-center gap-2.5 flex-wrap">
          
          {/* Export Minutes Button */}
          <button
            onClick={handleExportMinutes}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
            title="Download formatted Revision Minutes & BIM audit log"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Export Minutes</span>
          </button>

          {/* Interactive Persona / Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white border border-blue-500/40 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all"
              title="Switch user perspective between Authorized Client and Lead Designers"
            >
              <img
                src={activeUser.avatar}
                alt={activeUser.name}
                className="w-5 h-5 rounded-full object-cover border border-blue-400"
              />
              <div className="text-left hidden md:block">
                <div className="leading-tight text-[11px] font-extrabold text-white flex items-center gap-1">
                  <span>{activeUser.name}</span>
                  {activeUser.isAuthorizedClient ? (
                    <span className="px-1 rounded bg-amber-500/20 text-amber-300 text-[9px]">Client</span>
                  ) : (
                    <span className="px-1 rounded bg-blue-500/20 text-blue-300 text-[9px]">Designer</span>
                  )}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {/* Persona Switcher Dropdown */}
            {isPersonaMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-neutral-900 border border-white/15 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    Switch Active Persona & Authority
                  </span>
                </div>
                <div className="space-y-1">
                  {participants.map((p) => (
                    <button
                      key={p.uid}
                      onClick={() => {
                        setActiveUser(p);
                        setIsPersonaMenuOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                        activeUser.uid === p.uid
                          ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                          : 'hover:bg-white/5 text-neutral-300'
                      }`}
                    >
                      <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold truncate text-white">{p.name}</span>
                          {p.isAuthorizedClient ? (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                              Client
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-neutral-400 truncate">{p.roleTitle}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Drawer Close Button if in drawer mode */}
          {embeddedMode === 'drawer' && onCloseDrawer && (
            <button
              onClick={onCloseDrawer}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. REVISION SCHEDULE & FILTER STRIP */}
      <div className="px-4 py-2.5 border-b border-white/10 bg-neutral-950/60 flex items-center justify-between gap-3 overflow-x-auto text-xs no-scrollbar">
        
        {/* Revision Chips */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-bold text-neutral-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-blue-400" />
            <span>Filter Revision:</span>
          </span>

          <button
            onClick={() => setSelectedRevisionFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] cursor-pointer transition-all ${
              selectedRevisionFilter === 'ALL'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-neutral-300'
            }`}
          >
            All Threads ({messages.length})
          </button>

          {revisionItems.map((rev) => {
            const revCount = messages.filter(m => m.revisionId === rev.id).length;
            const isSelected = selectedRevisionFilter === rev.id;

            return (
              <button
                key={rev.id}
                onClick={() => setSelectedRevisionFilter(rev.id)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1.5 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                }`}
              >
                <span>{rev.code}</span>
                <span className={`px-1 py-0.2 rounded text-[9px] ${
                  rev.status === 'Approved by Client'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : rev.status === 'Pending Client Approval'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {revCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search within Discussions */}
        <div className="relative shrink-0 w-36 sm:w-48">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search specs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1 rounded-lg bg-neutral-900 border border-white/10 text-neutral-200 placeholder:text-neutral-500 text-[11px] focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* 3. MESSAGE STREAM CONTAINER */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-gradient-to-b from-neutral-950 via-neutral-900/40 to-neutral-950">
        
        {/* Verification & Trust Banner */}
        <div className="p-3 rounded-2xl bg-blue-950/30 border border-blue-500/20 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-blue-200">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              <strong>Authenticated Revision Channel:</strong> Discussions, drawing attachments, and sign-offs are cryptographically logged for BIM contract compliance.
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold shrink-0">
            ISO 19650
          </span>
        </div>

        {/* Message Cards */}
        {filteredMessages.length === 0 ? (
          <div className="text-center py-16 text-neutral-400 space-y-2">
            <HelpCircle className="w-8 h-8 mx-auto text-neutral-600" />
            <p className="text-sm font-semibold text-neutral-300">No messages match current filter criteria</p>
            <p className="text-xs text-neutral-500">Select "All Threads" or reset search to view project history.</p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isFromClient = msg.isAuthorizedClient;
            const isMe = msg.senderUid === activeUser.uid;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl transition-all ${
                  isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className={`w-9 h-9 rounded-full object-cover shrink-0 border ${
                    isFromClient ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-blue-400 ring-2 ring-blue-400/20'
                  }`}
                />

                {/* Message Body Box */}
                <div className={`space-y-2.5 min-w-[280px] max-w-xl ${isMe ? 'items-end' : 'items-start'}`}>
                  
                  {/* Sender Header & Revision Badge */}
                  <div className={`flex items-center gap-2 text-[11px] ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span className="font-bold text-white">{msg.senderName}</span>
                    
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold ${
                      isFromClient 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {msg.senderRoleLabel}
                    </span>

                    <span className="text-neutral-500">{msg.createdAt}</span>
                  </div>

                  {/* Bubble Container */}
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      isMe
                        ? 'bg-blue-950/40 border-blue-500/40 text-neutral-100 rounded-tr-none'
                        : isFromClient
                        ? 'bg-amber-950/20 border-amber-500/30 text-neutral-100 rounded-tl-none'
                        : 'bg-neutral-900 border-white/10 text-neutral-100 rounded-tl-none'
                    }`}
                  >
                    
                    {/* Revision & Sheet Reference Pill */}
                    <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-white/10 text-[11px]">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-extrabold text-[10px]">
                          {msg.revisionId}
                        </span>
                        <span className="font-semibold text-neutral-300 truncate max-w-[200px]">
                          {msg.revisionTitle}
                        </span>
                        {msg.drawingSheetRef && (
                          <span className="px-1.5 py-0.5 rounded bg-white/5 text-neutral-400 font-mono text-[9px]">
                            {msg.drawingSheetRef}
                          </span>
                        )}
                      </div>

                      {msg.priority === 'Urgent' && (
                        <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-extrabold text-[9px] flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5" />
                          Urgent
                        </span>
                      )}
                    </div>

                    {/* Text Body */}
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line text-neutral-200">
                      {msg.text}
                    </p>

                    {/* Suggested Change Comparison Card */}
                    {msg.suggestedChange && (
                      <div className="mt-3 p-3 rounded-xl bg-black/40 border border-white/10 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-teal-400">
                          <span className="flex items-center gap-1">
                            <Sliders className="w-3 h-3" />
                            Proposed Specification Delta ({msg.suggestedChange.discipline})
                          </span>
                          {msg.suggestedChange.costImpact && (
                            <span className="text-amber-400 font-bold">
                              {msg.suggestedChange.costImpact}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                          <div className="p-2 rounded-lg bg-rose-950/20 border border-rose-500/20 text-rose-200">
                            <span className="block text-[9px] uppercase font-bold text-rose-400">Previous Design:</span>
                            <span className="line-through opacity-80">{msg.suggestedChange.previousSpec}</span>
                          </div>
                          <div className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-200">
                            <span className="block text-[9px] uppercase font-bold text-emerald-400">Proposed Refinement:</span>
                            <span className="font-semibold">{msg.suggestedChange.proposedSpec}</span>
                          </div>
                        </div>

                        {msg.suggestedChange.structuralCompliance && (
                          <div className="text-[10px] text-teal-300 flex items-center gap-1 pt-0.5">
                            <Check className="w-3 h-3 text-teal-400" />
                            <span>Code Standard: {msg.suggestedChange.structuralCompliance}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Attachment Preview Card */}
                    {msg.attachment && (
                      <div className="mt-3 p-2.5 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {msg.attachment.type === 'drawing' ? (
                            <div className="w-9 h-9 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                              <FileCode className="w-5 h-5" />
                            </div>
                          ) : msg.attachment.type === 'voice_note' ? (
                            <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                              <Volume2 className="w-5 h-5" />
                            </div>
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">
                              {msg.attachment.name}
                            </div>
                            <div className="text-[10px] text-neutral-400">
                              {msg.attachment.sizeLabel || 'Attachment'}
                              {msg.attachment.caption && ` • ${msg.attachment.caption}`}
                            </div>
                          </div>
                        </div>

                        {/* View / Download */}
                        {msg.attachment.type === 'image' || msg.attachment.type === 'drawing' ? (
                          <button
                            onClick={() => setPreviewImageUrl(msg.attachment?.url || null)}
                            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Inspect</span>
                          </button>
                        ) : msg.attachment.type === 'voice_note' ? (
                          <button
                            onClick={() => {
                              const audio = new Audio(msg.attachment?.url);
                              audio.play().catch(() => {});
                            }}
                            className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-[10px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Play ({msg.attachment.durationSeconds || 5}s)</span>
                          </button>
                        ) : (
                          <a
                            href={msg.attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold flex items-center gap-1 shrink-0"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Open</span>
                          </a>
                        )}
                      </div>
                    )}

                    {/* Client Sign-Off Seal */}
                    {msg.clientSignoff && (
                      <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between text-xs text-emerald-200">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div>
                            <span className="font-bold text-white">Client Revision Sign-Off:</span>
                            <span className="text-[11px] block text-emerald-300">
                              Approved by {msg.clientSignoff.signedBy} on {new Date(msg.clientSignoff.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 font-mono text-emerald-300">
                          BIM SIGNED
                        </span>
                      </div>
                    )}

                    {/* Bottom Actions Bar (Approve, Resolve, Reactions) */}
                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap text-[11px]">
                      
                      {/* Emoji Reactions */}
                      <div className="flex items-center gap-1 flex-wrap">
                        {Object.entries(msg.reactions || {}).map(([emoji, users]) => (
                          <button
                            key={emoji}
                            onClick={() => toggleMessageReaction(project.id, project.title, msg.id, emoji, activeUser.name)}
                            className="px-1.5 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-[10px] flex items-center gap-1 cursor-pointer"
                            title={users.join(', ')}
                          >
                            <span>{emoji}</span>
                            <span className="text-neutral-400 font-bold">{users.length}</span>
                          </button>
                        ))}
                        
                        {/* Add Emoji Picker button */}
                        {['👍', '📐', '✨', '⚡'].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => toggleMessageReaction(project.id, project.title, msg.id, emoji, activeUser.name)}
                            className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white text-[11px] cursor-pointer"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>

                      {/* Client Sign-Off Trigger or Designer Resolve Button */}
                      <div className="flex items-center gap-2">
                        
                        {/* Authorized Client Sign-Off Action */}
                        {!msg.clientSignoff && activeUser.isAuthorizedClient && (
                          <button
                            onClick={() => approveRevisionChange(project.id, project.title, msg.id, activeUser.name)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                            title="Sign-off as Authorized Client on this architectural refinement"
                          >
                            <Check className="w-3 h-3" />
                            <span>Client Sign-Off</span>
                          </button>
                        )}

                        {/* Toggle Resolved */}
                        <button
                          onClick={() => toggleRevisionResolution(project.id, project.title, msg.id, !msg.resolved, activeUser.name)}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer transition-colors ${
                            msg.resolved
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : 'text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          {msg.resolved ? '✓ Resolved' : 'Mark Resolved'}
                        </button>
                      </div>

                    </div>

                  </div>
                </div>
              </div>
            );
          })
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. AI ARCHITECTURAL SUGGESTION BAR */}
      {aiSuggestions.length > 0 && (
        <div className="p-3 bg-neutral-900 border-t border-white/10 space-y-1.5 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between text-[11px] text-purple-300 font-bold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Engineering Assistant Recommendations:</span>
            </span>
            <button onClick={() => setAiSuggestions([])} className="text-neutral-400 hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {aiSuggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(sug.replace(/^"|"$/g, ''));
                  setAiSuggestions([]);
                }}
                className="p-2 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-left text-[11px] text-purple-200 line-clamp-2 cursor-pointer transition-all"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 5. EXPANDABLE SPECIFICATION PROPOSAL FORM */}
      {isSpecChangeOpen && (
        <div className="p-4 bg-neutral-900/90 border-t border-white/10 space-y-3 animate-in slide-in-from-bottom duration-200 text-xs">
          <div className="flex items-center justify-between font-bold text-white">
            <span className="flex items-center gap-1.5 text-teal-400">
              <Sliders className="w-3.5 h-3.5" />
              <span>Structured Specification Delta (Before vs Proposed)</span>
            </span>
            <button onClick={() => setIsSpecChangeOpen(false)} className="text-neutral-400 hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">Architectural / Structural Element</label>
              <input
                type="text"
                value={specChangeData.element}
                onChange={(e) => setSpecChangeData({ ...specChangeData, element: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">Discipline</label>
              <select
                value={specChangeData.discipline}
                onChange={(e) => setSpecChangeData({ ...specChangeData, discipline: e.target.value as any })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs"
              >
                <option value="Architectural">Architectural</option>
                <option value="Structural">Structural</option>
                <option value="Façade">Façade</option>
                <option value="MEP">MEP Services</option>
                <option value="Interior">Interior Finishes</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">Estimated Cost Delta</label>
              <input
                type="text"
                value={specChangeData.costImpact || ''}
                onChange={(e) => setSpecChangeData({ ...specChangeData, costImpact: e.target.value })}
                placeholder="+₹50,000 / Budget Neutral"
                className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-rose-400 block mb-1">Previous Baseline Specification</label>
              <textarea
                rows={2}
                value={specChangeData.previousSpec}
                onChange={(e) => setSpecChangeData({ ...specChangeData, previousSpec: e.target.value })}
                className="w-full p-2 rounded-lg bg-neutral-950 border border-rose-500/30 text-neutral-200 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-emerald-400 block mb-1">Proposed Specification Refinement</label>
              <textarea
                rows={2}
                value={specChangeData.proposedSpec}
                onChange={(e) => setSpecChangeData({ ...specChangeData, proposedSpec: e.target.value })}
                className="w-full p-2 rounded-lg bg-neutral-950 border border-emerald-500/30 text-neutral-200 text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. BOTTOM MESSAGE COMPOSER */}
      <div className="p-3 sm:p-4 border-t border-white/10 bg-neutral-900/95 space-y-3">
        
        {/* Revision Tag & Sheet Reference Selector Line */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
          
          <div className="flex items-center gap-2 flex-wrap">
            {/* Revision Assignment */}
            <div className="flex items-center gap-1 bg-neutral-950 border border-white/10 px-2 py-1 rounded-lg">
              <Tag className="w-3 h-3 text-teal-400" />
              <select
                value={selectedRevisionId}
                onChange={(e) => setSelectedRevisionId(e.target.value)}
                className="bg-transparent text-white text-[11px] font-bold focus:outline-none cursor-pointer"
              >
                {revisionItems.map((r) => (
                  <option key={r.id} value={r.id} className="bg-neutral-900 text-white">
                    {r.code}: {r.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Drawing Sheet Input */}
            <input
              type="text"
              placeholder="Sheet ref (e.g. S-305)"
              value={drawingSheetRef}
              onChange={(e) => setDrawingSheetRef(e.target.value)}
              className="px-2 py-1 rounded-lg bg-neutral-950 border border-white/10 text-[11px] text-neutral-200 placeholder:text-neutral-500 w-36 focus:outline-none focus:border-blue-500 font-mono"
            />

            {/* Priority */}
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="px-2 py-1 rounded-lg bg-neutral-950 border border-white/10 text-[11px] text-neutral-300 focus:outline-none cursor-pointer"
            >
              <option value="Normal">Normal Priority</option>
              <option value="Urgent">Urgent Review</option>
              <option value="Milestone Approval">Milestone Sign-Off</option>
              <option value="Site RFI">Site RFI</option>
            </select>
          </div>

          {/* Quick Tools: AI Suggest & Spec Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateAiSuggestions}
              disabled={isAiSuggesting}
              className="px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
              title="Suggest code-compliant structural replies using Gemini AI"
            >
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>AI Assist</span>
            </button>

            <button
              onClick={() => setIsSpecChangeOpen(!isSpecChangeOpen)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                isSpecChangeOpen
                  ? 'bg-teal-600 text-white border-teal-500'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/10'
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>Spec Diff</span>
            </button>
          </div>

        </div>

        {/* Input Textarea & Send Row */}
        <div className="flex items-end gap-2">
          
          {/* Text Area */}
          <div className="flex-1 relative">
            <textarea
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={`Comment as ${activeUser.name} (${activeUser.isAuthorizedClient ? 'Authorized Client' : 'Lead Designer'})...`}
              className="w-full p-3 rounded-2xl bg-neutral-950 border border-white/15 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
            />

            {/* Selected Attachment Badge inside textarea bottom */}
            {attachmentPreset !== 'none' && (
              <div className="absolute left-3 bottom-3 px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 border border-blue-500/30 text-[10px] flex items-center gap-1.5">
                <Paperclip className="w-3 h-3" />
                <span>Attached: {attachmentPreset === 'drawing' ? 'CAD Drawing .dwg' : attachmentPreset === 'spec_pdf' ? 'Material Spec .pdf' : 'Site Photo .jpg'}</span>
                <button onClick={() => setAttachmentPreset('none')} className="hover:text-white cursor-pointer ml-1">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Attachment Menu */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1">
              
              {/* Attachment selector */}
              <button
                onClick={() => {
                  if (attachmentPreset === 'none') setAttachmentPreset('drawing');
                  else if (attachmentPreset === 'drawing') setAttachmentPreset('spec_pdf');
                  else if (attachmentPreset === 'spec_pdf') setAttachmentPreset('site_photo');
                  else setAttachmentPreset('none');
                }}
                className={`p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                  attachmentPreset !== 'none'
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border-white/10'
                }`}
                title="Attach Architectural CAD Drawing, PDF, or Site Photo"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Voice Note Simulator */}
              <button
                onClick={toggleVoiceRecording}
                className={`p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                  audioVoiceNoteActive
                    ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border-white/10'
                }`}
                title={audioVoiceNoteActive ? `Recording (${voiceTimer}s)... Click to send voice note` : 'Record Audio Note'}
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() && attachmentPreset === 'none'}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-600/30 transition-all"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>

            </div>

            {/* Bilateral Simulation Checkbox */}
            <label className="text-[10px] text-neutral-400 flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoSimulateReply}
                onChange={(e) => setAutoSimulateReply(e.target.checked)}
                className="rounded accent-blue-500 cursor-pointer"
              />
              <span>Simulate instant bilateral reply</span>
            </label>
          </div>

        </div>

      </div>

      {/* LIGHTBOX PREVIEW MODAL */}
      {previewImageUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewImageUrl(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setPreviewImageUrl(null)}
              className="absolute top-2 right-2 p-2 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImageUrl}
              alt="Revision Drawing Markup Preview"
              className="max-w-full max-h-[80vh] rounded-2xl object-contain border border-white/20 shadow-2xl"
            />
            <div className="mt-3 text-center text-xs text-neutral-300">
              High-Resolution BIM / CAD Markup Inspection • Click outside to dismiss
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
