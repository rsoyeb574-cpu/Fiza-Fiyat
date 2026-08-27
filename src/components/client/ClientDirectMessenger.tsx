import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Mic, 
  MicOff, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Phone, 
  Video, 
  Calendar, 
  Check, 
  CheckCheck, 
  FileText, 
  FileCode, 
  FileCheck, 
  Clock, 
  Search, 
  AlertCircle, 
  ChevronRight, 
  Download, 
  Eye, 
  ExternalLink, 
  X, 
  Play, 
  Pause, 
  Volume2, 
  User as UserIcon, 
  Building2, 
  Layers, 
  Smile, 
  RefreshCw,
  Zap,
  Info
} from 'lucide-react';
import { 
  ChatMessage, 
  DirectPMMember, 
  EnterpriseProject, 
  ClientFileRequest 
} from '../../types/enterprise';
import { 
  ASSIGNED_PROJECT_MANAGERS, 
  subscribeToDirectPMMessages, 
  sendDirectPMMsg, 
  markDirectMessagesAsRead, 
  simulatePMReply 
} from '../../services/messagingService';
import { playMessageSentSound, playMessageReceivedSound } from '../../utils/soundEffects';

interface ClientDirectMessengerProps {
  currentUser: {
    uid: string;
    email?: string | null;
    displayName?: string | null;
  };
  projects: EnterpriseProject[];
  currentSelectedProject: EnterpriseProject | null;
  fileRequests: ClientFileRequest[];
  onOpenRequirementBrief?: (requestId: string, initialTab?: 'details' | 'discussion' | 'deliverables') => void;
  onBookMeeting?: () => void;
}

export const ClientDirectMessenger: React.FC<ClientDirectMessengerProps> = ({
  currentUser,
  projects,
  currentSelectedProject,
  fileRequests,
  onOpenRequirementBrief,
  onBookMeeting
}) => {
  // State for Project Managers and Selected Active PM Thread
  const [projectManagers] = useState<DirectPMMember[]>(ASSIGNED_PROJECT_MANAGERS);
  const [selectedPM, setSelectedPM] = useState<DirectPMMember>(ASSIGNED_PROJECT_MANAGERS[0]);
  
  // Messages State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [priority, setPriority] = useState<'Normal' | 'Urgent' | 'Milestone Review' | 'Site Query'>('Normal');
  const [selectedBriefRef, setSelectedBriefRef] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Voice Recording Simulation State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<any>(null);

  // File Attachment State
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    type: 'dwg' | 'rvt' | 'pdf' | 'jpg' | 'png' | 'zip' | 'doc';
    sizeBytes: number;
    url: string;
  } | null>(null);

  // Audio Playback State for voice notes
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Typing indicator simulation
  const [isPMTyping, setIsPMTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real-time Firestore message subscription
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = subscribeToDirectPMMessages(
      currentUser.uid,
      selectedPM.uid,
      (updatedMessages) => {
        setMessages(updatedMessages);
        
        // Auto mark unread messages from PM as read
        const unreadIds = updatedMessages
          .filter(m => m.senderUid === selectedPM.uid && !m.readBy?.includes(currentUser.uid))
          .map(m => m.id);

        if (unreadIds.length > 0) {
          markDirectMessagesAsRead(unreadIds, currentUser.uid);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [currentUser, selectedPM.uid]);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPMTyping]);

  // Filter messages for active PM thread or project
  const currentThreadMessages = messages.filter(m => {
    // Match either direct sender/recipient or channel
    const isDirectWithPM = 
      (m.senderUid === selectedPM.uid && m.recipientUid === currentUser.uid) ||
      (m.senderUid === currentUser.uid && m.recipientUid === selectedPM.uid) ||
      (m.channelId === 'pm-direct' && (!m.recipientUid || m.recipientUid === currentUser.uid || m.senderUid === selectedPM.uid));
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        m.text.toLowerCase().includes(q) ||
        (m.attachmentName && m.attachmentName.toLowerCase().includes(q)) ||
        (m.fileRequestTitle && m.fileRequestTitle.toLowerCase().includes(q));
      return isDirectWithPM && matchesSearch;
    }
    return isDirectWithPM;
  });

  // Calculate unread counts per PM
  const getPMUnreadCount = (pmUid: string) => {
    return messages.filter(
      m => m.senderUid === pmUid && !m.readBy?.includes(currentUser.uid)
    ).length;
  };

  // Handle Send Client Message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !attachedFile && !isRecording) return;

    const activeProject = currentSelectedProject || projects[0];
    const referencedBrief = fileRequests.find(f => f.id === selectedBriefRef);

    const newMsg: ChatMessage = {
      id: `dmsg-client-${Date.now()}`,
      channelId: 'pm-direct',
      senderUid: currentUser.uid,
      senderName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Client',
      senderRole: 'Client',
      recipientUid: selectedPM.uid,
      recipientName: selectedPM.name,
      recipientRole: selectedPM.role,
      projectId: activeProject?.id,
      projectTitle: activeProject?.title,
      fileRequestId: referencedBrief?.id,
      fileRequestTitle: referencedBrief?.title,
      priority: priority,
      text: inputText.trim() || (attachedFile ? `Attached file: ${attachedFile.name}` : 'Voice Note'),
      attachmentUrl: attachedFile?.url,
      attachmentName: attachedFile?.name,
      attachmentType: attachedFile?.type,
      attachmentSizeBytes: attachedFile?.sizeBytes,
      readBy: [currentUser.uid],
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      isEncrypted: true
    };

    playMessageSentSound();
    setInputText('');
    setAttachedFile(null);
    setSelectedBriefRef('');
    setPriority('Normal');

    await sendDirectPMMsg(newMsg);

    // Auto-trigger simulated PM response after short delay for realistic 2-way demonstration
    simulatePMReplyWithDelay(newMsg, selectedPM);
  };

  // Simulate PM Response with typing delay
  const simulatePMReplyWithDelay = (clientMsg: ChatMessage, pm: DirectPMMember) => {
    setIsPMTyping(true);
    setTimeout(async () => {
      await simulatePMReply(clientMsg, pm);
      setIsPMTyping(false);
      playMessageReceivedSound();
    }, 2800);
  };

  // Manual Trigger to test PM reply
  const handleTriggerManualPMReply = () => {
    const dummyClientMsg: ChatMessage = {
      id: `dmsg-manual-${Date.now()}`,
      channelId: 'pm-direct',
      senderUid: currentUser.uid,
      senderName: currentUser.displayName || 'Client',
      senderRole: 'Client',
      recipientUid: selectedPM.uid,
      recipientName: selectedPM.name,
      recipientRole: selectedPM.role,
      projectId: currentSelectedProject?.id,
      projectTitle: currentSelectedProject?.title,
      text: 'Requesting engineering update on the current milestone drawings and site supervision.',
      readBy: [currentUser.uid],
      createdAt: 'Just now',
      timestamp: Date.now()
    };
    simulatePMReplyWithDelay(dummyClientMsg, selectedPM);
  };

  // Handle Quick Inquiry Chip Click
  const handleApplyQuickPrompt = (promptText: string, suggestedPriority: 'Normal' | 'Urgent' | 'Site Query' = 'Normal') => {
    setInputText(promptText);
    setPriority(suggestedPriority);
  };

  // Voice Note Recording Handlers
  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds(s => s + 1);
    }, 1000);
  };

  const handleStopAndSendVoiceNote = async () => {
    clearInterval(recordingTimerRef.current);
    setIsRecording(false);

    const voiceMsg: ChatMessage = {
      id: `dmsg-voice-${Date.now()}`,
      channelId: 'pm-direct',
      senderUid: currentUser.uid,
      senderName: currentUser.displayName || 'Client',
      senderRole: 'Client',
      recipientUid: selectedPM.uid,
      recipientName: selectedPM.name,
      recipientRole: selectedPM.role,
      projectId: currentSelectedProject?.id,
      projectTitle: currentSelectedProject?.title,
      priority: priority,
      text: `🎤 Voice Note (${recordingSeconds || 4}s) - Architectural inquiry`,
      audioNoteUrl: 'https://example.com/audio-voice-note.mp3',
      audioDurationSeconds: recordingSeconds || 4,
      readBy: [currentUser.uid],
      createdAt: 'Just now',
      timestamp: Date.now(),
      isEncrypted: true
    };

    playMessageSentSound();
    await sendDirectPMMsg(voiceMsg);
    simulatePMReplyWithDelay(voiceMsg, selectedPM);
  };

  const handleCancelRecording = () => {
    clearInterval(recordingTimerRef.current);
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  // File Attachment simulation
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    let detectedType: 'dwg' | 'rvt' | 'pdf' | 'jpg' | 'png' | 'zip' | 'doc' = 'pdf';
    if (['dwg', 'rvt', 'pdf', 'jpg', 'png', 'zip', 'doc'].includes(extension)) {
      detectedType = extension as any;
    }

    setAttachedFile({
      name: file.name,
      type: detectedType,
      sizeBytes: file.size || 1500000,
      url: URL.createObjectURL(file)
    });
  };

  return (
    <div className="rounded-3xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[750px] sm:h-[820px] transition-all">
      
      {/* 1. TOP HEADER: SECURE PM MESSAGING BANNER */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-blue-500/40 bg-slate-800 shadow-md">
              <img 
                src={selectedPM.avatar} 
                alt={selectedPM.name} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
            <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
              selectedPM.status === 'Online' ? 'bg-emerald-500' : 'bg-amber-500'
            }`} />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-1.5">
                <span>{selectedPM.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-[10px] border border-blue-500/30">
                  {selectedPM.role}
                </span>
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{selectedPM.status}</span>
              </span>
              <span>• Responds {selectedPM.typicalResponseTime}</span>
              {selectedPM.licenseNumber && (
                <span className="text-slate-400 hidden md:inline">• Lic: {selectedPM.licenseNumber}</span>
              )}
            </div>
          </div>
        </div>

        {/* Top Header Actions */}
        <div className="flex items-center space-x-2 text-xs">
          {/* Encryption Indicator */}
          <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>E2EE 256-Bit Channel</span>
          </div>

          {/* Quick Schedule Call Button */}
          <button
            onClick={onBookMeeting}
            className="px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/30 text-purple-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
            title="Book video call or site inspection with this PM"
          >
            <Video className="w-3.5 h-3.5 text-purple-300" />
            <span className="hidden sm:inline">Book Video Consultation</span>
            <span className="sm:hidden">Call</span>
          </button>

          {/* Simulate PM Response Button */}
          <button
            onClick={handleTriggerManualPMReply}
            disabled={isPMTyping}
            className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            title="Simulate PM reviewing and replying in real-time"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">Simulate PM Reply</span>
            <span className="md:hidden">PM Reply</span>
          </button>

          {/* Search Toggle */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isSearchOpen ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-400 border-white/10 hover:text-white'
            }`}
            title="Search conversation"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SEARCH BAR (Expandable) */}
      {isSearchOpen && (
        <div className="px-5 py-2.5 bg-slate-950/90 border-b border-white/10 flex items-center gap-2 animate-in fade-in duration-200">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords, drawing titles, or requirement briefs..."
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* 2. MAIN MESSENGER BODY: SIDEBAR + CHAT STREAM */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT SIDEBAR: ASSIGNED PMs & PROJECT THREADS */}
        <div className="w-full md:w-72 lg:w-80 bg-slate-950/80 border-r border-white/10 flex flex-col flex-shrink-0">
          <div className="p-3.5 border-b border-white/5 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>Assigned Project Managers</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 border border-white/5">
              {projectManagers.length} Direct
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {projectManagers.map((pm) => {
              const isSelected = selectedPM.uid === pm.uid;
              const unreadCount = getPMUnreadCount(pm.uid);
              const pmLastMsg = messages
                .filter(m => m.senderUid === pm.uid || m.recipientUid === pm.uid)
                .slice(-1)[0];

              return (
                <button
                  key={pm.uid}
                  onClick={() => setSelectedPM(pm)}
                  className={`w-full p-3 rounded-2xl text-left transition-all flex items-start space-x-3 cursor-pointer ${
                    isSelected 
                      ? 'bg-gradient-to-r from-blue-950/80 to-indigo-950/60 border border-blue-500/40 shadow-md' 
                      : 'hover:bg-slate-900/80 border border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img 
                      src={pm.avatar} 
                      alt={pm.name} 
                      className="w-10 h-10 rounded-xl object-cover border border-white/10" 
                      referrerPolicy="no-referrer"
                    />
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-slate-950 ${
                      pm.status === 'Online' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-bold text-xs truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {pm.name}
                      </h4>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-black animate-pulse">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-blue-400 font-medium truncate mt-0.5">{pm.role}</p>
                    <p className="text-[11px] text-slate-400 truncate mt-1">
                      {pmLastMsg ? pmLastMsg.text : pm.specialization}
                    </p>
                  </div>
                </button>
              );
            })}

            {/* Quick Supervision Info Card */}
            <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-white/5 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-white">
                <Building2 className="w-4 h-4 text-blue-400" />
                <span className="truncate">{currentSelectedProject?.title || 'Active Project Supervision'}</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Direct channel for instant drawing clarifications, site queries, and milestone inspections.
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-white/5">
                <span>ISO 9001 Protocol</span>
                <span className="text-emerald-400 font-bold">● Active Gateway</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CHAT STREAM & INPUT CONTAINER */}
        <div className="flex-1 flex flex-col bg-slate-950/50 overflow-hidden">
          
          {/* Quick Inquiry Template Chips */}
          <div className="px-4 py-2 bg-slate-900/40 border-b border-white/5 flex items-center space-x-2 overflow-x-auto text-xs no-scrollbar">
            <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1 whitespace-nowrap">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Quick Inquiries:</span>
            </span>
            {[
              { label: 'Balcony Rebar Drawing', text: 'Could you clarify the rebar schedule for the cantilever overhang on Drawing FH-STR-01?', priority: 'Normal' },
              { label: 'Site Inspection Schedule', text: 'Can we schedule a joint on-site inspection for concrete slab casting this Friday?', priority: 'Site Query' },
              { label: 'Waterproofing Sign-off', text: 'Please confirm if the deck waterproofing membrane inspection has been approved by the QA team.', priority: 'Urgent' },
              { label: 'Next Milestone Target', text: 'When is the 3D interior BIM model expected for client review and sign-off?', priority: 'Milestone Review' }
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleApplyQuickPrompt(chip.text, chip.priority as any)}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium border border-white/5 whitespace-nowrap cursor-pointer transition-all"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* CHAT MESSAGES SCROLL AREA */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {currentThreadMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="p-4 rounded-3xl bg-slate-900 border border-white/10 text-blue-400">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h4 className="text-white font-bold text-sm">Direct Channel with {selectedPM.name}</h4>
                <p className="text-slate-400 text-xs max-w-sm">
                  Send a message, attach architectural drawings, or select a quick inquiry above to start direct communication.
                </p>
              </div>
            ) : (
              currentThreadMessages.map((msg, index) => {
                const isClient = msg.senderRole === 'Client' || msg.senderUid === currentUser.uid;
                const isUrgent = msg.priority === 'Urgent';

                return (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col ${isClient ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    {/* Sender Label & Role */}
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400 px-1">
                      <span className="font-semibold">{msg.senderName}</span>
                      <span>({msg.senderRole})</span>
                      <span>•</span>
                      <span>{msg.createdAt}</span>
                      {msg.priority && msg.priority !== 'Normal' && (
                        <span className={`px-1.5 py-0.2 rounded-md font-bold text-[9px] ${
                          isUrgent 
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {msg.priority}
                        </span>
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className={`relative max-w-[85%] sm:max-w-lg rounded-3xl p-4 sm:p-4.5 space-y-3 shadow-lg ${
                      isClient
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-br-none'
                        : 'bg-slate-900 border border-white/10 text-slate-200 rounded-bl-none'
                    }`}>
                      
                      {/* Attached File Request / Brief Reference */}
                      {msg.fileRequestTitle && (
                        <div 
                          onClick={() => {
                            if (msg.fileRequestId && onOpenRequirementBrief) {
                              onOpenRequirementBrief(msg.fileRequestId, 'details');
                            }
                          }}
                          className={`p-2.5 rounded-2xl flex items-center justify-between gap-2 text-xs cursor-pointer transition-all ${
                            isClient ? 'bg-blue-950/60 hover:bg-blue-950/80 border border-blue-400/30' : 'bg-slate-950 hover:bg-slate-900 border border-white/10'
                          }`}
                          title="Click to view full requirement brief"
                        >
                          <div className="flex items-center space-x-2 min-w-0">
                            <FileText className="w-4 h-4 text-amber-300 flex-shrink-0" />
                            <div className="min-w-0">
                              <span className="text-[10px] text-slate-400 uppercase font-bold block">Referenced Brief</span>
                              <span className="font-bold text-white text-xs truncate block">{msg.fileRequestTitle}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        </div>
                      )}

                      {/* Main Message Text */}
                      <p className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </p>

                      {/* Attached CAD / PDF / Image File */}
                      {msg.attachmentName && (
                        <div className={`p-3 rounded-2xl flex items-center justify-between gap-3 border ${
                          isClient ? 'bg-blue-900/50 border-blue-400/30' : 'bg-slate-950 border-white/10'
                        }`}>
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 flex-shrink-0">
                              {msg.attachmentType === 'dwg' || msg.attachmentType === 'rvt' ? (
                                <FileCode className="w-4 h-4" />
                              ) : (
                                <FileText className="w-4 h-4" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-xs text-white truncate block">{msg.attachmentName}</span>
                              <span className="text-[10px] text-slate-400 uppercase font-mono">
                                {msg.attachmentType || 'FILE'} • {((msg.attachmentSizeBytes || 1800000) / 1000000).toFixed(1)} MB
                              </span>
                            </div>
                          </div>

                          <a
                            href={msg.attachmentUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                            title="Download or Preview File"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}

                      {/* Voice Note Player (Simulation) */}
                      {msg.audioDurationSeconds && (
                        <div className={`p-2.5 rounded-2xl flex items-center space-x-3 border ${
                          isClient ? 'bg-blue-950/50 border-blue-400/30' : 'bg-slate-950 border-white/10'
                        }`}>
                          <button
                            onClick={() => setPlayingAudioId(playingAudioId === msg.id ? null : msg.id)}
                            className="p-2 rounded-xl bg-blue-500 text-white cursor-pointer hover:scale-105 transition-all"
                          >
                            {playingAudioId === msg.id ? (
                              <Pause className="w-3.5 h-3.5" />
                            ) : (
                              <Play className="w-3.5 h-3.5 fill-current" />
                            )}
                          </button>
                          
                          {/* Simulated Waveform Bar */}
                          <div className="flex-1 flex items-center space-x-0.5 h-4">
                            {[12, 24, 18, 28, 14, 20, 16, 26, 12, 18, 24, 10, 22].map((h, i) => (
                              <span 
                                key={i} 
                                className={`w-1 rounded-full ${
                                  playingAudioId === msg.id ? 'bg-amber-300 animate-pulse' : 'bg-slate-400'
                                }`} 
                                style={{ height: `${h}px` }} 
                              />
                            ))}
                          </div>
                          
                          <span className="text-[10px] font-mono text-slate-300">0:0{msg.audioDurationSeconds}</span>
                        </div>
                      )}

                      {/* Read status checkmarks for client messages */}
                      {isClient && (
                        <div className="flex items-center justify-end space-x-1 text-[10px] text-blue-200">
                          <span>Delivered</span>
                          <CheckCheck className="w-3.5 h-3.5 text-blue-200" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {/* TYPING INDICATOR BUBBLE */}
            {isPMTyping && (
              <div className="flex flex-col items-start space-y-1 animate-in fade-in duration-200">
                <span className="text-[10px] text-slate-400 px-1 font-semibold">
                  {selectedPM.name} is typing...
                </span>
                <div className="p-3 rounded-2xl bg-slate-900 border border-white/10 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 3. BOTTOM COMPOSER: INPUT, ATTACHMENTS & CONTROLS */}
          <div className="p-3 sm:p-4 bg-slate-900 border-t border-white/10 space-y-2">
            
            {/* Attachment Preview Chip */}
            {attachedFile && (
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-blue-500/40 text-xs">
                <div className="flex items-center space-x-2">
                  <Paperclip className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-white text-xs truncate max-w-xs">{attachedFile.name}</span>
                  <span className="text-slate-400 text-[10px]">({((attachedFile.sizeBytes) / 1000000).toFixed(1)} MB)</span>
                </div>
                <button 
                  onClick={() => setAttachedFile(null)}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Active Voice Recording Bar */}
            {isRecording ? (
              <div className="p-3 rounded-2xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-rose-200 text-xs font-bold">
                    Recording Audio Note... ({recordingSeconds}s)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleCancelRecording}
                    className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleStopAndSendVoiceNote}
                    className="px-4 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Audio</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-2">
                
                {/* Secondary Meta Row: Priority & Brief Referencing */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    {/* Priority Selector */}
                    <div className="flex items-center space-x-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Priority:</span>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as any)}
                        className="px-2 py-1 rounded-lg bg-slate-950 border border-white/10 text-white text-[11px] font-semibold focus:outline-none cursor-pointer"
                      >
                        <option value="Normal">Normal Inquiry</option>
                        <option value="Urgent">Urgent Site Query</option>
                        <option value="Site Query">Site Inspection</option>
                        <option value="Milestone Review">Milestone Review</option>
                      </select>
                    </div>

                    {/* Brief Tagging Dropdown */}
                    {fileRequests.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase hidden sm:inline">Attach Brief:</span>
                        <select
                          value={selectedBriefRef}
                          onChange={(e) => setSelectedBriefRef(e.target.value)}
                          className="px-2 py-1 rounded-lg bg-slate-950 border border-white/10 text-white text-[11px] font-semibold focus:outline-none max-w-[150px] sm:max-w-[200px] truncate cursor-pointer"
                        >
                          <option value="">None (General Message)</option>
                          {fileRequests.map(fr => (
                            <option key={fr.id} value={fr.id}>
                              {fr.title} ({fr.status})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <span className="text-slate-400 text-[10px] hidden md:inline">
                    Direct Line to <strong>{selectedPM.name}</strong>
                  </span>
                </div>

                {/* Primary Input Box & Action Buttons */}
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".dwg,.rvt,.pdf,.jpg,.jpeg,.png,.zip,.doc,.docx"
                  />

                  {/* Attachment Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-white cursor-pointer transition-colors"
                    title="Attach CAD drawings, specifications, or site photos"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  {/* Voice Note Trigger */}
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-white/10 text-slate-400 hover:text-white cursor-pointer transition-colors"
                    title="Record and send voice note"
                  >
                    <Mic className="w-4 h-4" />
                  </button>

                  {/* Main Text Input */}
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Message ${selectedPM.name} regarding drawings, specs, or milestone...`}
                    className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-white/10 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!inputText.trim() && !attachedFile}
                    className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer ${
                      inputText.trim() || attachedFile
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/30'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
