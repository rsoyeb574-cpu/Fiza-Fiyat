import React, { useState, useEffect } from 'react';
import { Shield, Check } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('fh_cookie_consent');
    if (!consent) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('fh_cookie_consent', 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:right-auto md:max-w-md z-40 p-4 rounded-2xl bg-neutral-900/90 backdrop-blur-xl border border-white/10 shadow-2xl animate-fadeIn text-xs">
      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 shrink-0">
          <Shield className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-neutral-300 leading-relaxed">
            Fiza Hayat uses essential cookies and local state to optimize performance, save user favorites, and deliver luxury experiences.
          </p>
          <div className="flex items-center space-x-2 pt-1">
            <button
              onClick={handleAccept}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md transition-all cursor-pointer flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Accept & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
