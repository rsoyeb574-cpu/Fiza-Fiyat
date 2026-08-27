import React, { useEffect, useState } from 'react';
import { 
  Bell, 
  X, 
  CheckCircle2, 
  MessageSquare, 
  FileText, 
  Download, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { ClientNotification } from '../../types/enterprise';

interface NotificationToastProps {
  notification: ClientNotification | null;
  onClose: () => void;
  onActionClick?: (notification: ClientNotification) => void;
  onOpenBrief?: (briefId: string, initialTab?: 'details' | 'deliverables' | 'discussion') => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  onActionClick,
  onOpenBrief
}) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!notification) return;

    setProgress(100);
    const duration = 7000; // 7 seconds
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      if (!isPaused) {
        setProgress(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          return prev - step;
        });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [notification, isPaused, onClose]);

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'requirement_approved':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'requirement_reviewed':
        return <FileText className="w-5 h-5 text-blue-400" />;
      case 'pm_feedback':
        return <MessageSquare className="w-5 h-5 text-purple-400" />;
      case 'deliverable_uploaded':
        return <Download className="w-5 h-5 text-indigo-400" />;
      case 'clarification_requested':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      default:
        return <Bell className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBadgeStyle = () => {
    switch (notification.type) {
      case 'requirement_approved':
        return 'bg-emerald-950 text-emerald-300 border-emerald-500/30';
      case 'requirement_reviewed':
        return 'bg-blue-950 text-blue-300 border-blue-500/30';
      case 'pm_feedback':
        return 'bg-purple-950 text-purple-300 border-purple-500/30';
      case 'deliverable_uploaded':
        return 'bg-indigo-950 text-indigo-300 border-indigo-500/30';
      case 'clarification_requested':
        return 'bg-amber-950 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-900 text-slate-300 border-white/10';
    }
  };

  const getBadgeLabel = () => {
    switch (notification.type) {
      case 'requirement_approved':
        return 'Requirement Approved';
      case 'requirement_reviewed':
        return 'Requirement Reviewed';
      case 'pm_feedback':
        return 'New PM Feedback';
      case 'deliverable_uploaded':
        return 'CAD/BIM Deliverable';
      case 'clarification_requested':
        return 'Clarification Needed';
      default:
        return 'Project Alert';
    }
  };

  return (
    <div 
      className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] sm:w-full bg-slate-900/95 border border-blue-500/40 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-300 animate-slideUp"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="alert"
    >
      {/* Top Accent Gradient Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400">
        <div 
          className="h-full bg-slate-900 transition-all duration-75"
          style={{ width: `${100 - progress}%`, float: 'right' }}
        />
      </div>

      <div className="p-4 sm:p-5 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src={notification.managerAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'} 
                alt={notification.managerName}
                className="w-10 h-10 rounded-2xl object-cover border border-white/10 shadow-md shrink-0"
              />
              <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-slate-900 border border-slate-950">
                {getIcon()}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] border ${getBadgeStyle()}`}>
                  {getBadgeLabel()}
                </span>
                <span className="text-slate-400 text-[10px]">{notification.createdAt}</span>
              </div>
              <div className="text-white font-bold text-xs mt-0.5">{notification.managerName}</div>
              <div className="text-blue-400 text-[10px]">{notification.managerRole}</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-1">
          <h4 className="text-white font-bold text-xs tracking-tight">
            {notification.title}
          </h4>
          <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed font-sans">
            {notification.message}
          </p>
          {notification.fileRequestTitle && (
            <div className="text-[11px] text-blue-300/80 truncate mt-1">
              Brief: <strong className="text-slate-200">{notification.fileRequestTitle}</strong>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <span className="text-[10px] text-slate-400">
            {notification.projectTitle || 'Villa Architecture'}
          </span>
          <button
            onClick={() => {
              if (onOpenBrief && notification.fileRequestId) {
                const initialTab = notification.actionType === 'open_deliverables' 
                  ? 'deliverables' 
                  : (notification.actionType === 'open_chat' ? 'discussion' : 'details');
                onOpenBrief(notification.fileRequestId, initialTab);
              } else if (onActionClick) {
                onActionClick(notification);
              }
              onClose();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer transition-all hover:scale-105"
          >
            <span>View Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
