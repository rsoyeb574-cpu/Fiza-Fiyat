import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  Building2, 
  BookOpen, 
  Package, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  Mic, 
  MicOff, 
  Radio, 
  AlertCircle, 
  Clock, 
  Volume2, 
  Check, 
  RotateCcw,
  Sparkle,
  CornerDownLeft
} from 'lucide-react';
import { Project, Service, BlogArticle } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  services: Service[];
  blogs: BlogArticle[];
  onSelectProject?: (id: string) => void;
  onSelectService?: (id: string) => void;
  onSelectBlog?: (id: string) => void;
}

// Web Speech API Types
interface SpeechRecognitionEventLike extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
  message?: string;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  projects,
  services,
  blogs,
  onSelectProject,
  onSelectService,
  onSelectBlog
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'projects' | 'services' | 'blogs' | 'materials' | 'faqs'>('all');
  
  // Voice Recognition States
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [lastSpokenCommand, setLastSpokenCommand] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  
  const recognitionRef = useRef<any>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Check Web Speech API support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
      }
    }
  }, []);

  // Initialize and clean up speech recognition
  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
      setIsListening(false);
      setInterimTranscript('');
      setVoiceError(null);
    }
  }, [isOpen]);

  // Handle global keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle mic with Cmd+M or Ctrl+M
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        toggleVoiceSearch();
      }
      if (e.key === 'Escape') {
        if (isListening) {
          stopListening();
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isListening]);

  // Process voice transcript with intent recognition
  const processVoiceInput = (rawText: string) => {
    const text = rawText.trim();
    if (!text) return;

    setLastSpokenCommand(text);
    let extractedQuery = text;
    let targetCat: 'all' | 'projects' | 'services' | 'blogs' | 'materials' | 'faqs' = activeCategory;

    const lowerText = text.toLowerCase();

    // Intent 1: Check category-specific command prefix
    if (lowerText.startsWith('search projects') || lowerText.startsWith('show projects') || lowerText.startsWith('find projects')) {
      targetCat = 'projects';
      extractedQuery = text.replace(/^(search projects|show projects|find projects)\s*(for|about|in)?\s*/i, '');
    } else if (lowerText.startsWith('search services') || lowerText.startsWith('show services') || lowerText.startsWith('find services') || lowerText.startsWith('services for')) {
      targetCat = 'services';
      extractedQuery = text.replace(/^(search services|show services|find services|services for)\s*(for|about)?\s*/i, '');
    } else if (lowerText.startsWith('search blogs') || lowerText.startsWith('show blogs') || lowerText.startsWith('articles about') || lowerText.startsWith('find articles') || lowerText.startsWith('blogs on')) {
      targetCat = 'blogs';
      extractedQuery = text.replace(/^(search blogs|show blogs|articles about|find articles|blogs on|search articles)\s*(for|about)?\s*/i, '');
    } else if (lowerText.startsWith('search materials') || lowerText.startsWith('building materials') || lowerText.startsWith('find material') || lowerText.startsWith('material rate')) {
      targetCat = 'materials';
      extractedQuery = text.replace(/^(search materials|building materials|find material|material rate)\s*(for|about)?\s*/i, '');
    } else if (lowerText.startsWith('faqs') || lowerText.startsWith('ask') || lowerText.startsWith('how to') || lowerText.startsWith('how much')) {
      targetCat = 'faqs';
      // keep original query for FAQs
    } else {
      // General prefixes stripping
      extractedQuery = text.replace(/^(search for|find me|look up|show me|can you find|search)\s+/i, '');
      
      // Semantic keyword context mapping if category is 'all'
      if (lowerText.includes('bim') || lowerText.includes('consulting') || lowerText.includes('engineering service')) {
        targetCat = 'services';
      } else if (lowerText.includes('article') || lowerText.includes('sustainability') || lowerText.includes('trends')) {
        targetCat = 'blogs';
      } else if (lowerText.includes('cement') || lowerText.includes('steel') || lowerText.includes('rebar') || lowerText.includes('brick') || lowerText.includes('aac block')) {
        targetCat = 'materials';
      } else if (lowerText.includes('cost per sq') || lowerText.includes('how long')) {
        targetCat = 'faqs';
      }
    }

    const finalQuery = (extractedQuery.trim() || text).replace(/[.,!?]+$/, '');
    setQuery(finalQuery);
    setActiveCategory(targetCat);
  };

  const startListening = () => {
    setVoiceError(null);
    setInterimTranscript('');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          if (result.isFinal) {
            final += result[0].transcript;
          } else {
            interim += result[0].transcript;
          }
        }

        if (interim) {
          setInterimTranscript(interim);
        }

        if (final) {
          setInterimTranscript('');
          processVoiceInput(final);
          setIsListening(false);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setVoiceError('Microphone permission was denied. Please allow microphone access in your browser settings.');
        } else if (event.error === 'no-speech') {
          setVoiceError('No speech detected. Please tap the microphone and speak again.');
        } else if (event.error === 'network') {
          setVoiceError('Network connection issue for speech service. Please check internet connection.');
        } else {
          setVoiceError(`Voice input error (${event.error}). Please try again.`);
        }
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setVoiceError('Unable to access microphone. Please check permissions.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    setIsListening(false);
    setInterimTranscript('');
  };

  const toggleVoiceSearch = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isOpen) return null;

  const lower = query.toLowerCase().trim();

  const filteredProjects = projects.filter(p => {
    if (!lower) return true;
    return (
      p.title.toLowerCase().includes(lower) || 
      p.description.toLowerCase().includes(lower) || 
      (p.location && p.location.toLowerCase().includes(lower)) ||
      p.categoryName.toLowerCase().includes(lower) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(lower))) ||
      (p.softwareUsed && p.softwareUsed.some(s => s.toLowerCase().includes(lower)))
    );
  });

  const filteredServices = services.filter(s => {
    if (!lower) return true;
    return (
      s.title.toLowerCase().includes(lower) || 
      s.description.toLowerCase().includes(lower) ||
      (s.category && s.category.toLowerCase().includes(lower)) ||
      (s.features && s.features.some(f => f.toLowerCase().includes(lower)))
    );
  });

  const filteredBlogs = blogs.filter(b => {
    if (!lower) return true;
    return (
      b.title.toLowerCase().includes(lower) || 
      b.excerpt.toLowerCase().includes(lower) ||
      (b.category && b.category.toLowerCase().includes(lower)) ||
      (b.tags && b.tags.some(t => t.toLowerCase().includes(lower)))
    );
  });

  const sampleMaterials = [
    { name: 'UltraTech PPC Cement', category: 'Civil', rate: '₹375 / bag', desc: 'Fly ash blended cement with zero micro-cracking risk' },
    { name: 'Tata Tiscon Fe500D Rebar', category: 'Steel', rate: '₹62,000 / ton', desc: 'Seismic grade high elongation steel rebar' },
    { name: 'Magicrete 6" AAC Blocks', category: 'Masonry', rate: '₹62 / block', desc: 'Lightweight thermal block reducing foundation dead weight' },
    { name: 'Saint-Gobain Solar Control Glass', category: 'Glazing', rate: '₹340 / sq.ft', desc: 'Low-E acoustic insulated double glazed glass units' },
    { name: 'Fosroc Conbextra GP Grout', category: 'Chemicals', rate: '₹850 / 25kg', desc: 'Non-shrink structural cementitious column base grout' }
  ].filter(m => !lower || m.name.toLowerCase().includes(lower) || m.desc.toLowerCase().includes(lower) || m.category.toLowerCase().includes(lower));

  const sampleFAQs = [
    { q: 'How long does a 3D BIM model take?', a: 'Typically 5 to 7 business days for LOD 300 to LOD 500 Revit modeling.' },
    { q: 'What is the cost per square foot for residential turnkey building?', a: 'Standard grade construction starts at ₹1,850/sq.ft in regional India.' },
    { q: 'Can Fiza Hayat handle seismic structural engineering certifications?', a: 'Yes, our certified structural teams design for Zone IV and V seismic compliances with full PE stamps.' },
    { q: 'What software formats are provided in project deliverables?', a: 'Deliverables include RVT (Revit), IFC, DWG, PDF blueprints, OBJ/FBX 3D assets, and Navisworks NWD files.' }
  ].filter(f => !lower || f.q.toLowerCase().includes(lower) || f.a.toLowerCase().includes(lower));

  const totalResults = 
    (activeCategory === 'all' 
      ? (filteredProjects.length + filteredServices.length + filteredBlogs.length + sampleMaterials.length + sampleFAQs.length)
      : activeCategory === 'projects' ? filteredProjects.length
      : activeCategory === 'services' ? filteredServices.length
      : activeCategory === 'blogs' ? filteredBlogs.length
      : activeCategory === 'materials' ? sampleMaterials.length
      : sampleFAQs.length);

  const voiceSamplePrompts = [
    { label: 'Modern Villa Projects', query: 'Modern Villa' },
    { label: 'Revit BIM Modeling', query: 'Revit BIM modeling' },
    { label: 'Green Architecture Blogs', query: 'Green Architecture' },
    { label: 'Fe500D Steel Rate', query: 'Tata Tiscon Fe500D' },
    { label: 'Turnkey Construction Cost', query: 'turnkey building cost' }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 md:pt-16 p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn text-xs"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* SEARCH HEADER */}
        <div className="p-4 bg-slate-950 border-b border-white/10 flex items-center gap-3 relative">
          <Search className={`w-5 h-5 shrink-0 transition-colors ${isListening ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`} />
          
          <input
            ref={searchInputRef}
            type="text"
            autoFocus
            value={isListening && interimTranscript ? interimTranscript : query}
            onChange={e => setQuery(e.target.value)}
            placeholder={isListening ? "Listening... Speak your query now" : "Search projects, BIM services, articles, materials, or speak with voice..."}
            className={`flex-1 bg-transparent text-white font-bold text-sm focus:outline-none placeholder-slate-500 transition-all ${
              isListening ? 'placeholder-rose-300 italic' : ''
            }`}
          />

          {/* Query Clear button */}
          {query && !isListening && (
            <button
              onClick={() => {
                setQuery('');
                setLastSpokenCommand(null);
                searchInputRef.current?.focus();
              }}
              className="text-[11px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800/80 cursor-pointer transition-colors"
              title="Clear search query"
            >
              Clear
            </button>
          )}

          {/* Voice-to-Text Input Button */}
          <div className="relative flex items-center">
            <button
              onClick={toggleVoiceSearch}
              className={`p-2 rounded-xl flex items-center gap-1.5 cursor-pointer font-bold transition-all relative ${
                isListening
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40 ring-2 ring-rose-400/80 animate-pulse'
                  : 'bg-slate-800/90 text-cyan-300 hover:text-white hover:bg-slate-700 border border-cyan-500/20'
              }`}
              title={isListening ? "Stop Voice Search" : "Voice Search (Click or press Ctrl+M)"}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 text-white" />
                  <span className="text-[11px] font-mono hidden sm:inline">Listening...</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-cyan-400" />
                  <span className="text-[11px] font-mono hidden sm:inline">Voice</span>
                </>
              )}
            </button>
          </div>

          {/* Close Modal Button */}
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer transition-colors"
            title="Close Search (ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* VOICE RECOGNITION LIVE PULSE & FEEDBACK BAR */}
        {isListening && (
          <div className="bg-rose-950/40 border-b border-rose-500/30 px-4 py-3 flex items-center justify-between gap-3 text-xs animate-fadeIn">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center gap-1 shrink-0 h-4">
                <span className="w-1 bg-rose-400 rounded-full animate-[bounce_0.8s_infinite_100ms] h-4"></span>
                <span className="w-1 bg-rose-400 rounded-full animate-[bounce_0.8s_infinite_250ms] h-3"></span>
                <span className="w-1 bg-rose-400 rounded-full animate-[bounce_0.8s_infinite_400ms] h-5"></span>
                <span className="w-1 bg-rose-400 rounded-full animate-[bounce_0.8s_infinite_150ms] h-2"></span>
                <span className="w-1 bg-rose-400 rounded-full animate-[bounce_0.8s_infinite_300ms] h-4"></span>
              </div>
              <div className="min-w-0">
                <div className="text-rose-200 font-bold text-xs flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-rose-400 animate-spin" />
                  <span>Listening to your voice command...</span>
                </div>
                <p className="text-rose-300/80 text-[11px] truncate">
                  {interimTranscript ? `"${interimTranscript}"` : 'Say: "Show villa projects", "Revit BIM services", or "Sustainable architecture articles"'}
                </p>
              </div>
            </div>

            <button
              onClick={stopListening}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-xs shrink-0 cursor-pointer transition-all shadow-sm"
            >
              Done Speaking
            </button>
          </div>
        )}

        {/* VOICE ERROR BANNER */}
        {voiceError && !isListening && (
          <div className="bg-amber-950/40 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-amber-200 text-xs animate-fadeIn">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{voiceError}</span>
            </div>
            <button
              onClick={() => setVoiceError(null)}
              className="text-amber-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* LAST SPOKEN BADGE NOTIFICATION */}
        {lastSpokenCommand && !isListening && (
          <div className="bg-cyan-950/40 border-b border-cyan-500/20 px-4 py-1.5 flex items-center justify-between text-cyan-300 text-[11px]">
            <div className="flex items-center gap-1.5 truncate">
              <Mic className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="font-semibold text-slate-400">Voice Query:</span>
              <span className="text-white font-mono font-bold bg-slate-900/90 px-2 py-0.5 rounded border border-cyan-500/30">
                "{lastSpokenCommand}"
              </span>
            </div>
            <button
              onClick={toggleVoiceSearch}
              className="text-cyan-400 hover:text-white flex items-center gap-1 font-semibold text-[10px] cursor-pointer"
              title="Speak another query"
            >
              <RotateCcw className="w-3 h-3" /> Speak Again
            </button>
          </div>
        )}

        {/* CATEGORY TABS & VOICE SUGGESTIONS */}
        <div className="px-4 py-2.5 bg-slate-900 border-b border-white/10 flex flex-col gap-2">
          {/* CATEGORY TABS */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All Results' },
              { id: 'projects', label: `Projects (${filteredProjects.length})` },
              { id: 'services', label: `Services (${filteredServices.length})` },
              { id: 'blogs', label: `Articles (${filteredBlogs.length})` },
              { id: 'materials', label: `Materials (${sampleMaterials.length})` },
              { id: 'faqs', label: `FAQs (${sampleFAQs.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[10px] cursor-pointer transition-all ${
                  activeCategory === tab.id 
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30' 
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* VOICE COMMAND QUICK SUGGESTION CHIPS */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[10px]">
            <span className="text-slate-400 font-bold shrink-0 flex items-center gap-1">
              <Sparkle className="w-3 h-3 text-amber-400" /> Try Voice:
            </span>
            {voiceSamplePrompts.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  processVoiceInput(sample.query);
                }}
                className="bg-slate-950/80 hover:bg-slate-800 border border-white/5 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 px-2 py-0.5 rounded-lg whitespace-nowrap cursor-pointer transition-all flex items-center gap-1"
              >
                <span>"{sample.label}"</span>
                <CornerDownLeft className="w-2.5 h-2.5 opacity-50" />
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* ZERO RESULTS STATE */}
          {totalResults === 0 && (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <div className="text-white font-bold text-sm">No results found for "{query}"</div>
              <p className="text-slate-400 text-xs max-w-sm mx-auto">
                Try searching for broader keywords, or tap the microphone icon to speak your query naturally.
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  onClick={toggleVoiceSearch}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-2 cursor-pointer transition-all shadow-md shadow-cyan-600/30"
                >
                  <Mic className="w-4 h-4" />
                  <span>Try Voice Search</span>
                </button>
                <button
                  onClick={() => { setQuery(''); setActiveCategory('all'); }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold cursor-pointer transition-all"
                >
                  Clear Filter
                </button>
              </div>
            </div>
          )}

          {/* PROJECTS */}
          {(activeCategory === 'all' || activeCategory === 'projects') && filteredProjects.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-300 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-cyan-400" /> Architectural & Engineering Projects ({filteredProjects.length})
                </h4>
                {activeCategory === 'all' && filteredProjects.length > 4 && (
                  <button 
                    onClick={() => setActiveCategory('projects')} 
                    className="text-[10px] text-cyan-400 hover:underline font-bold"
                  >
                    View All ({filteredProjects.length})
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(activeCategory === 'all' ? filteredProjects.slice(0, 4) : filteredProjects).map(p => (
                  <div 
                    key={p.id} 
                    onClick={() => { onSelectProject?.(p.id); onClose(); }}
                    className="p-3 rounded-2xl bg-slate-950 border border-white/10 hover:border-cyan-500/50 hover:bg-slate-900/90 cursor-pointer flex gap-3 items-center group transition-all"
                  >
                    <img 
                      src={p.heroImage || p.coverImage || (p.images && p.images[0]) || '/placeholder-project.jpg'} 
                      alt={p.title} 
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10 group-hover:scale-105 transition-transform" 
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-white font-bold text-xs group-hover:text-cyan-400 transition-colors truncate">
                        {p.title}
                      </div>
                      <div className="text-slate-400 text-[10px] mt-0.5 truncate">
                        {p.categoryName} • {p.location || 'Global'} {p.year ? `• ${p.year}` : ''}
                      </div>
                      {p.softwareUsed && p.softwareUsed.length > 0 && (
                        <div className="flex items-center gap-1 mt-1.5 overflow-hidden">
                          {p.softwareUsed.slice(0, 2).map((s, idx) => (
                            <span key={idx} className="text-[9px] bg-slate-900 px-1.5 py-0.2 rounded text-cyan-300 border border-cyan-500/20 truncate">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SERVICES */}
          {(activeCategory === 'all' || activeCategory === 'services') && filteredServices.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-300 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" /> BIM & Engineering Services ({filteredServices.length})
                </h4>
                {activeCategory === 'all' && filteredServices.length > 4 && (
                  <button 
                    onClick={() => setActiveCategory('services')} 
                    className="text-[10px] text-amber-400 hover:underline font-bold"
                  >
                    View All ({filteredServices.length})
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(activeCategory === 'all' ? filteredServices.slice(0, 4) : filteredServices).map(s => (
                  <div 
                    key={s.id}
                    onClick={() => { onSelectService?.(s.id); onClose(); }}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 hover:border-amber-500/50 hover:bg-slate-900/90 cursor-pointer group transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-white font-bold text-xs group-hover:text-amber-400 transition-colors">
                        {s.title}
                      </div>
                      <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20 shrink-0">
                        {s.category}
                      </span>
                    </div>
                    <div className="text-slate-400 text-[10px] line-clamp-2 mt-1 leading-relaxed">
                      {s.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BLOGS & ARTICLES */}
          {(activeCategory === 'all' || activeCategory === 'blogs') && filteredBlogs.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-300 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-400" /> Articles & Engineering Insights ({filteredBlogs.length})
                </h4>
                {activeCategory === 'all' && filteredBlogs.length > 4 && (
                  <button 
                    onClick={() => setActiveCategory('blogs')} 
                    className="text-[10px] text-blue-400 hover:underline font-bold"
                  >
                    View All ({filteredBlogs.length})
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(activeCategory === 'all' ? filteredBlogs.slice(0, 4) : filteredBlogs).map(b => (
                  <div 
                    key={b.id}
                    onClick={() => { onSelectBlog?.(b.id); onClose(); }}
                    className="p-3 rounded-2xl bg-slate-950 border border-white/10 hover:border-blue-500/50 hover:bg-slate-900/90 cursor-pointer flex gap-3 items-center group transition-all"
                  >
                    <img 
                      src={b.coverImage || '/placeholder-blog.jpg'} 
                      alt={b.title} 
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10 group-hover:scale-105 transition-transform" 
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-white font-bold text-xs group-hover:text-blue-400 transition-colors line-clamp-1">
                        {b.title}
                      </div>
                      <p className="text-slate-400 text-[10px] line-clamp-1 mt-0.5">
                        {b.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-[9px] text-slate-400 mt-1">
                        <span>{b.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" /> {b.readTime || '4 min'}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MATERIALS */}
          {(activeCategory === 'all' || activeCategory === 'materials') && sampleMaterials.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-300 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                <Package className="w-4 h-4 text-emerald-400" /> Construction Materials DB ({sampleMaterials.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sampleMaterials.map((m, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 hover:border-emerald-500/40 transition-all">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold text-xs">{m.name}</span>
                      <span className="text-emerald-400 font-mono font-bold text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        {m.rate}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[10px] mt-1 leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQS */}
          {(activeCategory === 'all' || activeCategory === 'faqs') && sampleFAQs.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-300 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-indigo-400" /> FAQs & Cost Guidance ({sampleFAQs.length})
              </h4>
              <div className="space-y-2">
                {sampleFAQs.map((f, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 hover:border-indigo-500/40 transition-all">
                    <div className="text-white font-bold text-xs">Q: {f.q}</div>
                    <p className="text-slate-300 text-[11px] mt-1 leading-relaxed">A: {f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-3.5 bg-slate-950 border-t border-white/10 text-slate-400 text-[11px] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10 font-mono text-[10px]">Ctrl+M</kbd>
              <span>Voice Search</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10 font-mono text-[10px]">ESC</kbd>
              <span>Close</span>
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px] text-cyan-400">
            <span>FIZA HAYAT INTELLIGENT SEARCH</span>
          </div>
        </div>
      </div>
    </div>
  );
};

