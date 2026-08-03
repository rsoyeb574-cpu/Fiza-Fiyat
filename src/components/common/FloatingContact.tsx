import React, { useState } from 'react';
import { MessageSquare, Calculator, Sparkles, X, PhoneCall } from 'lucide-react';
import { WebsiteSettings } from '../../types';

interface FloatingContactProps {
  settings: WebsiteSettings;
  onOpenCalculator: () => void;
  onOpenAIChat: () => void;
}

export const FloatingContact: React.FC<FloatingContactProps> = ({
  settings,
  onOpenCalculator,
  onOpenAIChat
}) => {
  const [open, setOpen] = useState(false);

  const whatsappNum = settings.whatsappNumber ? settings.whatsappNumber.replace(/[^0-9]/g, '') : '18005553492';
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent('Hello Fiza Hayat Team, I would like to inquire about your architectural/design/AI services.')}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-3">
      {/* Expanded Quick Options */}
      {open && (
        <div className="flex flex-col items-end space-y-2 mb-2 animate-fadeIn">
          
          {/* AI Assistant trigger */}
          <button
            onClick={() => { onOpenAIChat(); setOpen(false); }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold shadow-xl hover:scale-105 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-200 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Fiza AI Assistant</span>
          </button>

          {/* Calculator Trigger */}
          <button
            onClick={() => { onOpenCalculator(); setOpen(false); }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-neutral-900 border border-blue-500/40 text-blue-400 text-xs font-semibold shadow-xl hover:scale-105 transition-all cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            <span>Cost Estimator</span>
          </button>

          {/* WhatsApp Direct */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xl hover:scale-105 transition-all"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>WhatsApp Direct</span>
          </a>
        </div>
      )}

      {/* Main Trigger Floating Badge */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-2xl shadow-blue-600/50 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer relative group"
        title="Quick Connect"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-neutral-950 animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-neutral-950"></span>
        {open ? <X className="w-6 h-6" /> : <PhoneCall className="w-6 h-6 animate-pulse" />}
      </button>
    </div>
  );
};
