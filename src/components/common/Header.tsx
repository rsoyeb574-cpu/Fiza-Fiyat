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
  FileText
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

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
    { id: 'client-portal', label: 'Client Portal' },
    { id: 'community', label: 'Community' },
    { id: 'courses', label: 'Academy' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'directory', label: 'Directory' },
    { id: 'construction-intelligence', label: 'Intelligence' },
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
        ? 'bg-[#020408]/85 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3' 
        : 'bg-white/5 backdrop-blur-md border-b border-white/10 py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 p-[1px] shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#020408] rounded-[11px] flex items-center justify-center">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 text-lg tracking-wider">
                  FH
                </span>
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                FIZA HAYAT
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              </span>
              <span className="text-[10px] tracking-widest uppercase text-neutral-400 block font-medium">
                Digital Business Hub
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-xl shadow-inner">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all relative ${
                  activePage === item.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40'
                    : item.featured
                    ? 'text-blue-300 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30'
                    : 'text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
                {item.featured && (
                  <span className="ml-1.5 px-1.5 py-0.2 text-[9px] font-bold uppercase rounded-full bg-cyan-400 text-slate-950 font-mono">
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
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 hover:border-blue-500/50 text-xs transition-all cursor-pointer"
              title="Search Projects & Services (Cmd + K)"
            >
              <Search className="w-3.5 h-3.5 text-blue-400" />
              <span>Search</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-white/10 text-neutral-300 rounded border border-white/10">
                ⌘K
              </kbd>
            </button>

            {/* Cost Calculator Button */}
            <button
              onClick={onOpenCalculator}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/10 text-blue-400 hover:text-blue-300 text-xs font-medium transition-all cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Cost Estimator</span>
            </button>

            {/* Favorites Drawer Trigger */}
            <button
              onClick={onOpenFavorites}
              className="relative p-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-neutral-300 hover:text-red-400 hover:bg-white/10 transition-all cursor-pointer"
              title="Favorite Projects"
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-neutral-300 hover:text-amber-400 hover:bg-white/10 transition-all cursor-pointer"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Admin Hub Link */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`p-2 rounded-xl border backdrop-blur-md transition-all cursor-pointer ${
                activePage === 'admin' 
                  ? 'bg-blue-600 border-blue-500 text-white' 
                  : 'bg-white/5 border-white/10 text-neutral-300 hover:text-blue-400 hover:bg-white/10'
              }`}
              title="Admin Panel"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* Contact CTA */}
            <button
              onClick={() => handleNavClick('contact')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center space-x-1.5"
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
        <div className="lg:hidden bg-neutral-950/95 backdrop-blur-xl border-b border-white/10 px-4 pt-4 pb-6 space-y-3 mt-3 animate-fadeIn">
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
