import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageSquare, Linkedin, Twitter } from 'lucide-react';
import { Project } from '../../types';

interface ShareModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ project, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !project) return null;

  const currentUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(`Check out this project by Fiza Hayat: ${project.title} - ${currentUrl}`)}`;
  const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Share Project</h3>
            <p className="text-neutral-400 text-xs truncate max-w-[240px]">{project.title}</p>
          </div>
        </div>

        {/* Project Thumbnail */}
        <div className="mb-4 rounded-xl overflow-hidden h-32 border border-white/10 relative">
          <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent"></div>
          <span className="absolute bottom-2 left-2 text-[10px] text-blue-400 bg-neutral-950/80 px-2 py-0.5 rounded-full border border-blue-500/30">
            {project.categoryName}
          </span>
        </div>

        {/* Copy Link Input */}
        <div className="flex items-center space-x-2 bg-neutral-950 p-1.5 rounded-xl border border-white/10 mb-4">
          <input
            type="text"
            readOnly
            value={currentUrl}
            className="flex-1 bg-transparent px-3 text-xs text-neutral-300 focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center space-x-1 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Quick Social Shares */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <a
            href={whatsappShare}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 font-medium flex items-center justify-center space-x-2 transition-all"
          >
            <MessageSquare className="w-4 h-4 fill-emerald-400" />
            <span>WhatsApp</span>
          </a>

          <a
            href={linkedinShare}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 border border-blue-500/30 text-blue-300 font-medium flex items-center justify-center space-x-2 transition-all"
          >
            <Linkedin className="w-4 h-4 fill-blue-400" />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </div>
  );
};
