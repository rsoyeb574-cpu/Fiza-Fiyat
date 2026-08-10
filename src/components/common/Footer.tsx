import React from 'react';
import { 
  Mail, 
  MapPin, 
  ArrowUpRight
} from 'lucide-react';
import { WebsiteSettings } from '../../types';
import { WhatsAppButton } from './WhatsAppButton';
import { NewsletterSubscription } from './NewsletterSubscription';

interface FooterProps {
  settings: WebsiteSettings;
  setActivePage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, setActivePage }) => {
  const navigateTo = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#0B1020]/95 backdrop-blur-2xl border-t border-indigo-500/20 text-neutral-300 pt-16 pb-12 overflow-hidden z-10">
      {/* Background Subtle Gradient Lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Newsletter CTA Banner */}
        <NewsletterSubscription className="mb-16" />

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-indigo-500/20">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-blue-600 p-[1px] shadow-lg shadow-violet-600/20">
                <div className="w-full h-full bg-[#0B1020] rounded-[11px] flex items-center justify-center">
                  <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400 text-lg">FH</span>
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">FIZA-FIYAT</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed pr-4">
              Building the Future with Design, Creativity & AI. An international digital business hub uniting architectural engineering, 3D BIM modeling, luxury interior design, motion branding, and generative AI media.
            </p>
            
            <div className="space-y-2 pt-2 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-violet-400 shrink-0" />
                <span>{settings.address || 'Executive Tower, Downtown Dubai / Geneva'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-violet-400 shrink-0" />
                <a href={`mailto:${settings.companyEmail}`} className="hover:text-violet-300 transition-colors">
                  {settings.companyEmail || 'contact@fizahayat.com'}
                </a>
              </div>
              <div className="pt-2">
                <WhatsAppButton whatsappGroupLink={settings.whatsappGroupLink || settings.socialLinks?.whatsappGroup} />
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-l-2 border-violet-500 pl-2">
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              {['home', 'about', 'services', 'portfolio', 'blog', 'gallery', 'contact'].map((page) => (
                <li key={page}>
                  <button
                    onClick={() => navigateTo(page)}
                    className="text-slate-400 hover:text-violet-300 transition-colors capitalize flex items-center group cursor-pointer"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">
                      {page === 'home' ? 'Overview' : page}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Capabilities */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-l-2 border-violet-500 pl-2">
              Core Capabilities
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Building Design & Planning</li>
              <li>Luxury Interior Design</li>
              <li>3D Rendering & Animations</li>
              <li>AutoCAD & Revit BIM Models</li>
              <li>Generative AI Concept Art</li>
              <li>Brand Identity & Motion</li>
              <li>Web & UI/UX Systems</li>
            </ul>
          </div>

          {/* Global Operations */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-l-2 border-violet-500 pl-2">
              Target Clients
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>International Real Estate</li>
              <li>Architectural Firms</li>
              <li>Commercial Builders</li>
              <li>Interior Design Studios</li>
              <li>Startups & Tech Enterprises</li>
              <li>Digital Agencies</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} FIZA-FIYAT. All rights reserved. Premium AI Business Hub.</p>
          
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => navigateTo('privacy')}
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => navigateTo('terms')}
              className="hover:text-slate-300 transition-colors"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => navigateTo('admin')}
              className="hover:text-violet-400 transition-colors flex items-center gap-1"
            >
              Admin Hub <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
