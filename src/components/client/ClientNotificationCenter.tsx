import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  FileText, 
  Download, 
  Sparkles, 
  Check, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Search, 
  Filter, 
  ChevronRight, 
  AlertTriangle, 
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  X
} from 'lucide-react';
import { ClientNotification, NotificationType } from '../../types/enterprise';
import { 
  subscribeToClientNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteClientNotification, 
  clearAllClientNotifications 
} from '../../services/notificationService';
import { playNotificationChime } from '../../utils/soundEffects';

interface ClientNotificationCenterProps {
  currentUser?: {
    uid: string;
    displayName?: string | null;
    email?: string | null;
  };
  clientUid?: string;
  clientEmail?: string;
  onOpenRequirementBrief?: (briefId: string, initialTab?: 'details' | 'deliverables' | 'discussion') => void;
  onOpenProject?: (projectId: string) => void;
  onTriggerSimulator?: () => void;
  variant?: 'popover' | 'full_panel' | 'header_dropdown';
}

export const ClientNotificationCenter: React.FC<ClientNotificationCenterProps> = ({
  currentUser,
  clientUid: propUid,
  clientEmail: propEmail,
  onOpenRequirementBrief,
  onOpenProject,
  onTriggerSimulator,
  variant = 'popover'
}) => {
  const activeUid = currentUser?.uid || propUid || '';
  const activeEmail = currentUser?.email || propEmail || undefined;
  const [notifications, setNotifications] = useState<ClientNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'reviews' | 'feedback' | 'approvals'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Subscribe to real-time notification updates
  useEffect(() => {
    if (!activeUid) return;
    const unsubscribe = subscribeToClientNotifications(
      activeUid,
      activeEmail,
      (updatedList) => {
        setNotifications(updatedList);
      }
    );

    return () => unsubscribe();
  }, [activeUid, activeEmail]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen && variant === 'popover') {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, variant]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    // Tab Filter
    if (activeFilter === 'unread' && n.read) return false;
    if (activeFilter === 'reviews' && n.type !== 'requirement_reviewed') return false;
    if (activeFilter === 'feedback' && n.type !== 'pm_feedback' && n.type !== 'clarification_requested') return false;
    if (activeFilter === 'approvals' && n.type !== 'requirement_approved' && n.type !== 'deliverable_uploaded') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchMsg = n.message.toLowerCase().includes(q);
      const matchPM = n.managerName.toLowerCase().includes(q);
      const matchBrief = (n.fileRequestTitle || '').toLowerCase().includes(q);
      return matchTitle || matchMsg || matchPM || matchBrief;
    }

    return true;
  });

  const handleNotificationClick = async (notif: ClientNotification) => {
    if (!notif.read) {
      await markNotificationAsRead(notif.id);
    }

    if (notif.fileRequestId && onOpenRequirementBrief) {
      let initialTab: 'details' | 'deliverables' | 'discussion' = 'details';
      if (notif.type === 'requirement_approved' || notif.type === 'deliverable_uploaded') {
        initialTab = 'deliverables';
      } else if (notif.type === 'pm_feedback' || notif.type === 'clarification_requested') {
        initialTab = 'discussion';
      }
      onOpenRequirementBrief(notif.fileRequestId, initialTab);
      setIsOpen(false);
    } else if (notif.projectId && onOpenProject) {
      onOpenProject(notif.projectId);
      setIsOpen(false);
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'requirement_approved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'requirement_reviewed':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'pm_feedback':
        return <MessageSquare className="w-4 h-4 text-purple-400" />;
      case 'deliverable_uploaded':
        return <Download className="w-4 h-4 text-indigo-400" />;
      case 'clarification_requested':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  const getTypeBadge = (type: NotificationType) => {
    switch (type) {
      case 'requirement_approved':
        return { label: 'Approved', bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30' };
      case 'requirement_reviewed':
        return { label: 'Under Review', bg: 'bg-blue-950/80 text-blue-300 border-blue-500/30' };
      case 'pm_feedback':
        return { label: 'PM Feedback', bg: 'bg-purple-950/80 text-purple-300 border-purple-500/30' };
      case 'deliverable_uploaded':
        return { label: 'Deliverable', bg: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/30' };
      case 'clarification_requested':
        return { label: 'Clarification', bg: 'bg-amber-950/80 text-amber-300 border-amber-500/30' };
      default:
        return { label: 'Alert', bg: 'bg-slate-900 text-slate-300 border-white/10' };
    }
  };

  const contentUI = (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white">Project Manager Live Alerts</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px]">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-slate-400 text-[11px]">Real-time review, feedback, and sign-off updates</p>
          </div>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center space-x-2">
          {onTriggerSimulator && (
            <button
              onClick={onTriggerSimulator}
              className="px-2.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-bold text-[11px] flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Open PM Simulator to test alerts"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Alert</span>
            </button>
          )}

          <button
            onClick={() => markAllNotificationsAsRead(currentUser.uid)}
            disabled={unreadCount === 0}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-40"
            title="Mark all as read"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mark read</span>
          </button>

          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playNotificationChime('default');
            }}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              soundEnabled 
                ? 'bg-blue-950/60 border-blue-500/40 text-blue-300' 
                : 'bg-slate-900 border-white/10 text-slate-500'
            }`}
            title={soundEnabled ? 'Sound enabled' : 'Sound muted'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search alerts by manager, requirement, or keywords..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[11px]">
          {[
            { id: 'all', label: `All (${notifications.length})` },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'reviews', label: `Reviews (${notifications.filter(n => n.type === 'requirement_reviewed').length})` },
            { id: 'feedback', label: `PM Feedback (${notifications.filter(n => n.type === 'pm_feedback' || n.type === 'clarification_requested').length})` },
            { id: 'approvals', label: `Approvals (${notifications.filter(n => n.type === 'requirement_approved' || n.type === 'deliverable_uploaded').length})` }
          ].map(tab => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notifications Feed */}
      <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-dashed border-white/10 space-y-2">
            <Bell className="w-7 h-7 text-slate-600 mx-auto" />
            <div className="text-slate-300 font-bold text-xs">No Notifications Found</div>
            <p className="text-slate-500 text-[11px] max-w-xs mx-auto">
              You're all caught up! When project managers review requirements, provide feedback, or upload drawings, alerts will appear here.
            </p>
          </div>
        ) : (
          filteredNotifications.map(notif => {
            const badge = getTypeBadge(notif.type);
            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer group relative ${
                  notif.read
                    ? 'bg-slate-950/50 border-white/5 hover:border-blue-500/30'
                    : 'bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border-blue-500/40 shadow-lg hover:border-blue-400'
                }`}
              >
                {/* Unread dot */}
                {!notif.read && (
                  <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-blue-400 shadow-sm shadow-blue-400"></span>
                )}

                <div className="flex items-start space-x-3">
                  <div className="relative shrink-0">
                    <img
                      src={notif.managerAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'}
                      alt={notif.managerName}
                      className="w-10 h-10 rounded-xl object-cover border border-white/10"
                    />
                    <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-slate-900 border border-slate-950">
                      {getNotificationIcon(notif.type)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] border ${badge.bg}`}>
                        {badge.label}
                      </span>
                      {notif.priority === 'Urgent' && (
                        <span className="px-1.5 py-0.2 rounded-full bg-rose-950 text-rose-300 font-bold text-[9px] border border-rose-500/30">
                          Urgent
                        </span>
                      )}
                      <span className="text-slate-500 text-[10px]">• {notif.createdAt}</span>
                    </div>

                    <div className="font-bold text-xs text-white group-hover:text-blue-300 transition-colors leading-snug">
                      {notif.title}
                    </div>

                    <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed font-sans">
                      {notif.message}
                    </p>

                    {notif.fileRequestTitle && (
                      <div className="text-[10px] text-blue-400 truncate pt-0.5">
                        Brief: <strong className="text-slate-300 font-medium">{notif.fileRequestTitle}</strong>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-1.5 text-[10px]">
                      <span className="text-slate-400">{notif.managerName} ({notif.managerRole})</span>
                      <div className="flex items-center space-x-2 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNotificationClick(notif);
                          }}
                          className="px-2 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>Open</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteClientNotification(notif.id);
                          }}
                          className="p-1 rounded-lg hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete alert"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-slate-400">
          <span>{notifications.length} total alerts recorded</span>
          <button
            onClick={() => clearAllClientNotifications(currentUser.uid)}
            className="text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            Clear all history
          </button>
        </div>
      )}
    </div>
  );

  if (variant === 'full_panel') {
    return (
      <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 shadow-2xl space-y-4">
        {contentUI}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer shadow-lg hover:border-blue-500/40 flex items-center justify-center"
        aria-label="View notifications"
        title="Project Manager Alerts & Reviews"
      >
        <Bell className="w-4 h-4 text-blue-400" />
        {unreadCount > 0 && (
          <>
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white font-black text-[10px] flex items-center justify-center border-2 border-slate-950 shadow-md">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 animate-ping opacity-60 pointer-events-none"></span>
          </>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-[calc(100vw-2rem)] sm:w-[480px] max-w-[500px] bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-5 z-50 animate-slideDown">
          {contentUI}
        </div>
      )}
    </div>
  );
};
