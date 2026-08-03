import React from 'react';

export const PrivacyTermsPage: React.FC<{ mode: 'privacy' | 'terms' }> = ({ mode }) => {
  return (
    <div className="pt-28 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-neutral-300 text-xs leading-relaxed">
      <h1 className="text-3xl font-extrabold text-white tracking-tight">
        {mode === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
      </h1>

      <div className="p-8 rounded-3xl bg-neutral-900/60 border border-white/10 space-y-6">
        {mode === 'privacy' ? (
          <>
            <p>
              This Privacy Policy describes how Fiza Hayat collects, uses, and discloses information when you visit or submit inquiries through our digital business hub.
            </p>
            <h3 className="text-base font-bold text-white">1. Information Collection</h3>
            <p>
              We collect information you provide directly, such as your name, corporate email address, phone number, and project specification details submitted via contact or cost calculator forms.
            </p>
            <h3 className="text-base font-bold text-white">2. Data Security & Storage</h3>
            <p>
              All client inquiries and project data are securely stored using enterprise-grade Firebase Firestore security rules and encrypted data transmission.
            </p>
          </>
        ) : (
          <>
            <p>
              By accessing Fiza Hayat platform or engaging our architectural, design, engineering, or AI services, you agree to these Terms of Service.
            </p>
            <h3 className="text-base font-bold text-white">1. Intellectual Property</h3>
            <p>
              All architectural CAD drawings, Revit BIM models, 3D renders, and AI media packages produced for clients remain protected under international copyright agreements until contract completion.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
