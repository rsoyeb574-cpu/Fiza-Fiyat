import React, { useState } from 'react';
import { MessageSquare, Calculator, Sparkles, X, Users } from 'lucide-react';
import { WebsiteSettings } from '../../types';
import { CONTACT_CONFIG } from '../../config/contact';
import { WhatsAppButton } from './WhatsAppButton';

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

  return (
    <div className="fixed bottom-20 right-3 sm:right-5 z-40 flex flex-col items-end space-y-3">
      {/* Expanded Quick Options */}
      {open && (
        <div className="flex flex-col items-end space-y-2 mb-2 animate-fadeIn">
          
          {/* AI Assistant trigger */}
          <button
            onClick={() => { onOpenAIChat(); setOpen(false); }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold shadow-xl hover:scale-105 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-200 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Fiza AI Assistant</span>
          </button>

          {/* Calculator Trigger */}
          <button
            onClick={() => { onOpenCalculator(); setOpen(false); }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-[#151B2E] border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-xl hover:scale-105 transition-all cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-violet-400" />
            <span>Cost Estimator</span>
          </button>

          {/* WhatsApp Group Join Button */}
          <WhatsAppButton whatsappGroupLink={settings.whatsappGroupLink || settings.socialLinks?.whatsappGroup} className="!rounded-full shadow-emerald-600/30" />
        </div>
      )}

      {/* Main Trigger Floating Badge */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-2xl shadow-purple-600/40 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer relative group"
        title="Quick Connect"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0B1020] animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0B1020]"></span>
        {open ? <X className="w-6 h-6" /> : <Users className="w-6 h-6 animate-pulse" />}
      </button>
    </div>
  );
};
