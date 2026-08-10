import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Building2, 
  Layers, 
  Cpu, 
  Palette, 
  CheckCircle2, 
  Star, 
  Globe2, 
  Award, 
  Users, 
  Calculator,
  ChevronRight,
  Eye,
  Heart
} from 'lucide-react';
import { Project, Service, Testimonial, WebsiteSettings, Category } from '../types';
import { BeforeAfterSlider } from '../components/common/BeforeAfterSlider';

interface HomePageProps {
  settings: WebsiteSettings;
  projects: Project[];
  services: Service[];
  testimonials: Testimonial[];
  categories: Category[];
  setActivePage: (page: string) => void;
  onSelectProject: (id: string) => void;
  onOpenCalculator: () => void;
  onToggleFavorite: (project: Project) => void;
  isFavorite: (id: string) => boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  projects,
  services,
  testimonials,
  categories,
  setActivePage,
  onSelectProject,
  onOpenCalculator,
  onToggleFavorite,
  isFavorite
}) => {
  // Typing Effect State
  const typingTexts = settings.heroTypingTexts?.length 
    ? settings.heroTypingTexts 
    : ['Architectural Design & Planning', '3D Rendering & Virtual Walkthroughs', 'Revit BIM & AutoCAD Drafting', 'AI Generative Concept Production'];
  
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string>('all');

  useEffect(() => {
    const currentText = typingTexts[textIdx];
    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIdx === currentText.length) {
      speed = 2200; // pause at end
    } else if (isDeleting && charIdx === 0) {
      setIsDeleting(false);
      setTextIdx((prev) => (prev + 1) % typingTexts.length);
      speed = 400;
    }

    const timer = setTimeout(() => {
      setCharIdx((prev) => prev + (isDeleting ? -1 : 1));
      if (!isDeleting && charIdx === currentText.length) {
        setIsDeleting(true);
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [charIdx, isDeleting, textIdx, typingTexts]);

  const displayedTyping = typingTexts[textIdx].substring(0, charIdx);

  const featuredProjects = projects.filter(p => p.featured).slice(0, 6);
  const filteredProjects = currentCategory === 'all' 
    ? projects.slice(0, 6) 
    : projects.filter(p => p.categoryId === currentCategory).slice(0, 6);

  const sampleBeforeAfter = projects.find(p => p.beforeAfter) || projects[0];

  return (
    <div className="space-y-24 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden bg-[#0B1020]">
        
        {/* Animated Background Canvas & Glow Orbs */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-[#0B1020] to-[#0B1020]"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[550px] bg-gradient-to-tr from-violet-600/20 via-indigo-600/25 to-blue-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>

        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#7c3aed0a_1px,transparent_1px),linear-gradient(to_bottom,#7c3aed0a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#151B2E] border border-violet-500/30 text-violet-300 text-xs font-semibold backdrop-blur-xl shadow-xl shadow-violet-600/10">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Digital Business Hub & International AI Studio</span>
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping"></span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
            {settings.heroTitle || 'Building the Future with Design, Creativity & AI'}
          </h1>

          {/* Dynamic Typing Effect */}
          <div className="h-12 flex items-center justify-center">
            <p className="text-xl sm:text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-indigo-300 to-blue-300">
              {displayedTyping}
              <span className="inline-block w-0.5 h-6 bg-violet-500 ml-1 animate-pulse"></span>
            </p>
          </div>

          {/* Hero Subtitle */}
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            {settings.heroSubtitle}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActivePage('portfolio')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold shadow-2xl shadow-purple-600/40 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center space-x-2 text-sm"
            >
              <span>Explore Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenCalculator}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#151B2E] hover:bg-indigo-900/40 border border-indigo-500/30 hover:border-violet-500/50 text-indigo-200 font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center space-x-2 text-sm backdrop-blur-xl"
            >
              <Calculator className="w-4 h-4 text-violet-400" />
              <span>Construction & Interior Calculator</span>
            </button>
          </div>

          {/* Key Accreditations / Software Pill Ticker */}
          <div className="pt-12 border-t border-indigo-500/20 max-w-4xl mx-auto">
            <p className="text-[11px] uppercase tracking-widest text-indigo-300/80 font-bold mb-4">
              POWERED BY ENTERPRISE SOFTWARE & HARDWARE
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-300">
              {['Autodesk Revit BIM', 'AutoCAD 2026', '3ds Max & V-Ray', 'Unreal Engine 5', 'Rhino 3D', 'Midjourney AI', 'Adobe Creative Cloud', 'Figma Systems'].map((sw) => (
                <span key={sw} className="px-3.5 py-1.5 rounded-xl bg-[#151B2E] border border-indigo-500/20 backdrop-blur-md font-medium text-slate-300">
                  {sw}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* STATISTICS COUNTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-[#151B2E] border border-indigo-500/20 backdrop-blur-2xl shadow-2xl grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-blue-400">
              {settings.statsProjects || 145}+
            </div>
            <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mt-1">Delivered Projects</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-blue-400">
              {settings.statsClients || 82}+
            </div>
            <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mt-1">Global Clients</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-blue-400">
              {settings.statsCountries || 24}+
            </div>
            <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mt-1">Countries Served</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-blue-400">
              {settings.statsYears || 10}+
            </div>
            <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mt-1">Years Excellence</div>
          </div>
        </div>
      </section>

      {/* FEATURED CONSTRUCTION INTELLIGENCE HUB BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-violet-500/30 bg-gradient-to-r from-[#151B2E] via-indigo-950/80 to-[#151B2E] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-violet-300 bg-violet-500/10 border border-violet-500/30">
                <Cpu className="w-3.5 h-3.5 text-violet-400" />
                Featured Platform Module
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Construction <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-blue-400 bg-clip-text text-transparent">Intelligence</span> Hub
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                Dynamic civil engineering & architectural consultation platform. Calculate material formulas, view 2D/3D floor plan layouts, cost breakdowns, construction schedules, and 12 structural knowledge guides.
              </p>
              
              <div className="flex flex-wrap gap-2 text-xs text-slate-300 pt-2">
                <span className="px-3 py-1 rounded-lg bg-[#0B1020]/80 border border-indigo-500/20 font-mono">20x20 Plot Calculator</span>
                <span className="px-3 py-1 rounded-lg bg-[#0B1020]/80 border border-indigo-500/20 font-mono">Cement, Steel & Sand Formulas</span>
                <span className="px-3 py-1 rounded-lg bg-[#0B1020]/80 border border-indigo-500/20 font-mono">IS 456 Structural Rules</span>
                <span className="px-3 py-1 rounded-lg bg-[#0B1020]/80 border border-indigo-500/20 font-mono">BOQ Generator</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <button
                onClick={() => setActivePage('construction-intelligence')}
                className="w-full px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2 group/btn cursor-pointer hover:-translate-y-0.5"
              >
                <span>Launch Construction Intelligence</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-violet-400 text-xs font-bold uppercase tracking-widest block mb-2">
              Capabilities
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Featured Design & Engineering Services
            </h2>
          </div>
          <button
            onClick={() => setActivePage('services')}
            className="text-violet-400 hover:text-violet-300 text-xs font-semibold flex items-center gap-1 group cursor-pointer"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.filter(s => s.featured).slice(0, 6).map((srv) => (
            <div
              key={srv.id}
              onClick={() => setActivePage('services')}
              className="p-6 rounded-3xl bg-[#151B2E] backdrop-blur-xl border border-indigo-500/20 hover:border-violet-500/40 hover:bg-[#192138] transition-all hover:-translate-y-1 cursor-pointer group space-y-4 flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors">
                  {srv.title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                  {srv.description}
                </p>
              </div>

              <div className="pt-4 border-t border-indigo-500/20 space-y-2">
                {srv.features?.slice(0, 3).map((f) => (
                  <div key={f} className="text-[11px] text-slate-300 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LATEST PROJECTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-violet-400 text-xs font-bold uppercase tracking-widest block mb-2">
              Portfolio
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Latest Project Showcases
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCurrentCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                currentCategory === 'all'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30'
                  : 'bg-[#151B2E] border border-indigo-500/20 text-slate-300 hover:text-white hover:border-violet-500/30'
              }`}
            >
              All
            </button>
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCurrentCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  currentCategory === cat.id
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30'
                    : 'bg-[#151B2E] border border-indigo-500/20 text-slate-300 hover:text-white hover:border-violet-500/30'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="group rounded-3xl bg-[#151B2E] backdrop-blur-xl border border-indigo-500/20 overflow-hidden hover:border-violet-500/40 hover:bg-[#192138] transition-all hover:-translate-y-1 flex flex-col justify-between shadow-xl"
            >
              <div className="relative h-60 overflow-hidden cursor-pointer" onClick={() => onSelectProject(proj.id)}>
                <img
                  src={proj.coverImage}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-transparent to-transparent"></div>
                
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0B1020]/80 backdrop-blur-md text-violet-300 text-[10px] font-bold border border-violet-500/30">
                  {proj.categoryName}
                </span>

                <button
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(proj); }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-[#0B1020]/80 backdrop-blur-md text-white hover:text-purple-400 transition-colors cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${isFavorite(proj.id) ? 'fill-purple-500 text-purple-500' : ''}`} />
                </button>
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 
                    onClick={() => onSelectProject(proj.id)}
                    className="text-base font-bold text-white group-hover:text-violet-400 transition-colors cursor-pointer line-clamp-1"
                  >
                    {proj.title}
                  </h3>
                  <p className="text-slate-400 text-xs line-clamp-2 mt-1">
                    {proj.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-indigo-500/20 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Client: <strong className="text-slate-200">{proj.clientName}</strong></span>
                  <button
                    onClick={() => onSelectProject(proj.id)}
                    className="text-violet-400 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    View Details <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BEFORE / AFTER TRANSFORMATION SLIDER */}
      {sampleBeforeAfter && sampleBeforeAfter.beforeAfter && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-violet-400 text-xs font-bold uppercase tracking-widest block">
              Architectural Craftsmanship
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Interactive Wireframe to 3D Render Transformation
            </h2>
            <p className="text-slate-400 text-xs max-w-xl mx-auto">
              Drag the divider line to observe how raw site layouts and CAD drawings transform into 8K photorealistic renders.
            </p>
          </div>

          <BeforeAfterSlider
            beforeImage={sampleBeforeAfter.beforeAfter.before}
            afterImage={sampleBeforeAfter.beforeAfter.after}
            labelBefore={sampleBeforeAfter.beforeAfter.labelBefore}
            labelAfter={sampleBeforeAfter.beforeAfter.labelAfter}
          />
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-violet-400 text-xs font-bold uppercase tracking-widest block">
            Client Feedback
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Endorsed by Global Industry Leaders
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-3xl bg-[#151B2E] backdrop-blur-xl border border-indigo-500/20 space-y-4 flex flex-col justify-between shadow-xl hover:border-violet-500/40 hover:bg-[#192138] transition-all"
            >
              <div className="space-y-3">
                <div className="flex text-amber-400 space-x-1">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-xs leading-relaxed italic">
                  "{t.content}"
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-indigo-500/20">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-indigo-500/30" />
                <div>
                  <div className="text-white font-bold text-xs">{t.name}</div>
                  <div className="text-slate-400 text-[10px]">{t.role}, {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-[#151B2E] via-violet-950/40 to-[#151B2E] border border-violet-500/30 backdrop-blur-2xl text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Bring Your Vision to Life?
            </h2>
            <p className="text-slate-300 text-xs leading-relaxed">
              Partner with Fiza-Fiya for bespoke architectural design, Revit BIM modeling, AI media campaigns, and digital platforms.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setActivePage('contact')}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold text-xs shadow-xl shadow-purple-600/30 transition-all cursor-pointer hover:-translate-y-0.5"
              >
                Schedule Consultation Call
              </button>
              <button
                onClick={onOpenCalculator}
                className="px-8 py-3.5 rounded-2xl bg-[#0B1020]/80 border border-indigo-500/30 hover:border-violet-500/50 text-indigo-200 font-semibold text-xs transition-all cursor-pointer backdrop-blur-md"
              >
                Try Cost Calculator
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
