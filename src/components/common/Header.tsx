import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  Calculator, 
  PhoneCall, 
  Briefcase,
  Layers,
  Building2,
  FileText,
  Zap
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { usePlan } from '../../context/PlanContext';

interface HeaderProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onOpenSearch: () => void;
  onOpenFavorites: () => void;
  onOpenCalculator: () => void;
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  setActivePage,
  onOpenSearch,
  onOpenFavorites,
  onOpenCalculator,
  favoritesCount
}) => {
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useAuth();
  const { plan } = usePlan();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'marketplace', label: 'Marketplace', featured: true },
    { id: 'construction-intelligence', label: 'Intelligence' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'client-portal', label: 'Client Portal' },
    { id: 'community', label: 'Community' },
    { id: 'courses', label: 'Academy' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'directory', label: 'Directory' },
    { id: 'services', label: 'Services' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'blog', label: 'Blog' }
  ];

  const handleNavClick = (id: string) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#0B1020]/90 backdrop-blur-xl border-b border-indigo-500/20 shadow-2xl py-3' 
        : 'bg-[#0B1020]/40 backdrop-blur-md border-b border-indigo-500/10 py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-blue-600 p-[1px] shadow-lg shadow-violet-600/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0B1020] rounded-[11px] flex items-center justify-center">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-blue-400 text-lg tracking-wider">
                  FH
                </span>
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-violet-400 transition-colors flex items-center gap-1.5">
                FIZA-FIYAT
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
              </span>
              <span className="text-[10px] tracking-widest uppercase text-indigo-300/70 block font-medium">
                AI & Construction Hub
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-[#151B2E]/80 p-1.5 rounded-full border border-indigo-500/20 backdrop-blur-xl shadow-inner">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all relative ${
                  activePage === item.id
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/40'
                    : item.featured
                    ? 'text-violet-300 hover:text-white bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
                {item.featured && (
                  <span className="ml-1.5 px-1.5 py-0.2 text-[9px] font-bold uppercase rounded-full bg-violet-500 text-white font-mono">
                    HUB
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Action Tools */}
          <div className="hidden lg:flex items-center space-x-3">
            
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-[#151B2E] backdrop-blur-md border border-indigo-500/20 text-slate-300 hover:text-white hover:bg-indigo-900/30 hover:border-violet-500/40 text-xs transition-all cursor-pointer"
              title="Search Projects & Services (Cmd + K)"
            >
              <Search className="w-3.5 h-3.5 text-violet-400" />
              <span>Search</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-white/10 text-neutral-300 rounded border border-white/10">
                ⌘K
              </kbd>
            </button>

            {/* Cost Calculator Button */}
            <button
              onClick={onOpenCalculator}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#151B2E] backdrop-blur-md hover:bg-indigo-900/30 border border-indigo-500/20 text-violet-300 hover:text-violet-200 text-xs font-medium transition-all cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-indigo-400" />
              <span>Cost Estimator</span>
            </button>

            {/* Favorites Drawer Trigger */}
            <button
              onClick={onOpenFavorites}
              className="relative p-2 rounded-xl bg-[#151B2E] backdrop-blur-md border border-indigo-500/20 text-slate-300 hover:text-purple-400 hover:bg-indigo-900/30 transition-all cursor-pointer"
              title="Favorite Projects"
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-purple-500 text-purple-500' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-[#151B2E] backdrop-blur-md border border-indigo-500/20 text-slate-300 hover:text-amber-400 hover:bg-indigo-900/30 transition-all cursor-pointer"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Admin Hub Link */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`p-2 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
                activePage === 'admin' 
                  ? 'bg-violet-600 border-violet-500 text-white shadow-md shadow-violet-600/30' 
                  : 'bg-[#151B2E] border-indigo-500/20 text-slate-300 hover:text-violet-400 hover:bg-indigo-900/30'
              }`}
              title="Admin Panel"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* SaaS Plan Tier Badge */}
            <button
              onClick={() => handleNavClick('pricing')}
              className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title="View SaaS Plans & Usage"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="uppercase font-mono text-[10px] bg-purple-500/20 px-1.5 py-0.5 rounded text-purple-200">
                {plan}
              </span>
            </button>

            {/* Contact CTA */}
            <button
              onClick={() => handleNavClick('contact')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 transition-all cursor-pointer flex items-center space-x-1.5 hover:-translate-y-0.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get Quote</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-xl bg-neutral-900 border border-white/10 text-neutral-300"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-neutral-900 border border-white/10 text-neutral-300 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950/95 backdrop-blur-xl border-b border-white/10 px-4 pt-4 pb-6 space-y-3 mt-3 animate-fadeIn max-h-[85vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-medium text-left transition-all ${
                  activePage === item.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col space-y-2 pt-2">
            <button
              onClick={() => { onOpenCalculator(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-neutral-900 text-blue-400 border border-white/10 text-xs font-medium"
            >
              <span className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Construction & Interior Calculator
              </span>
            </button>

            <button
              onClick={() => handleNavClick('admin')}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-neutral-900 text-neutral-200 border border-white/10 text-xs font-medium"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                Admin Dashboard
              </span>
              {isAdmin && <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Logged In</span>}
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold text-center"
            >
              Start a Project / Consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
