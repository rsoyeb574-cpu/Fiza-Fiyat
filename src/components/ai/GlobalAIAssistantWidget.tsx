import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  User, 
  ChevronUp, 
  AlertTriangle, 
  Building2, 
  Calculator, 
  ShieldCheck, 
  Compass, 
  RefreshCw, 
  Mic, 
  MicOff,
  Globe,
  Languages,
  Check,
  ChevronDown,
  Volume2,
  VolumeX,
  Square,
  SlidersHorizontal,
  Palette,
  RotateCcw
} from 'lucide-react';
import { usePlan } from '../../context/PlanContext';
import { fetchAndDiagnoseAI } from '../../utils/aiDiagnostics';

const CHAT_STORAGE_KEY = 'fiza_ai_chat_history';

interface GlobalAIAssistantWidgetProps {
  activePage: string;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export type PersonalityId = 'architectural' | 'creative' | 'engineering';

export interface AssistantPersonality {
  id: PersonalityId;
  name: string;
  shortLabel: string;
  role: string;
  tagline: string;
  iconName: 'Compass' | 'Sparkles' | 'Calculator';
  badgeClass: string;
  activeBtnClass: string;
  welcomeMessage: string;
  suggestedQuestions: string[];
}

export const ASSISTANT_PERSONALITIES: AssistantPersonality[] = [
  {
    id: 'architectural',
    name: 'Architectural Professional',
    shortLabel: 'Architectural',
    role: 'Principal Architect & BIM Lead',
    tagline: 'Spatial planning, Revit LOD 500, luxury finishes & ergonomics',
    iconName: 'Compass',
    badgeClass: 'text-purple-300 bg-purple-950/60 border-purple-500/30',
    activeBtnClass: 'bg-purple-600/30 text-purple-200 border-purple-500/50 shadow-sm font-semibold',
    welcomeMessage: 'Hello! I am Fiza AI in Architectural Professional mode. I specialize in spatial layouts, Revit BIM modeling (LOD 300–500), luxury material palettes, and architectural design standards.',
    suggestedQuestions: ['Review 3BHK spatial circulation', 'Explain Revit LOD 500 deliverables', 'Suggest luxury facade materials']
  },
  {
    id: 'creative',
    name: 'Creative Conceptualist',
    shortLabel: 'Creative',
    role: 'Avant-Garde Design Visionary',
    tagline: 'Artistic forms, biophilic concepts, mood lighting & narratives',
    iconName: 'Sparkles',
    badgeClass: 'text-amber-300 bg-amber-950/60 border-amber-500/30',
    activeBtnClass: 'bg-amber-600/30 text-amber-200 border-amber-500/50 shadow-sm font-semibold',
    welcomeMessage: 'Welcome! I am Fiza AI in Creative Conceptualist mode. Let\'s explore avant-garde sculptural forms, biophilic narratives, sensory lighting moods, and bold design concepts.',
    suggestedQuestions: ['Generate a biophilic villa concept', 'Describe ambient lighting scenarios', 'Explore futuristic parametric curves']
  },
  {
    id: 'engineering',
    name: 'Engineering Specialist',
    shortLabel: 'Engineering',
    role: 'Structural & Civil Lead',
    tagline: 'Load paths, IS/ACI seismic codes, Fe500D rebar & BoQ analytics',
    iconName: 'Calculator',
    badgeClass: 'text-cyan-300 bg-cyan-950/60 border-cyan-500/30',
    activeBtnClass: 'bg-cyan-600/30 text-cyan-200 border-cyan-500/50 shadow-sm font-semibold',
    welcomeMessage: 'Greetings! I am Fiza AI in Engineering Specialist mode. Ready to calculate structural load paths, assess IS/ACI seismic codes, specify Fe500D rebar grades, and optimize your BoQ.',
    suggestedQuestions: ['Calculate raft foundation depth', 'Compare AAC blocks vs Red bricks', 'Review Fe500D seismic tolerances']
  }
];

interface SpeechLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  short: string;
}

const SUPPORTED_SPEECH_LANGUAGES: SpeechLanguage[] = [
  { code: 'en-US', name: 'English (US)', nativeName: 'English (US)', flag: '🇺🇸', short: 'EN-US' },
  { code: 'en-IN', name: 'English (India)', nativeName: 'English (India)', flag: '🇮🇳', short: 'EN-IN' },
  { code: 'en-GB', name: 'English (UK)', nativeName: 'English (UK)', flag: '🇬🇧', short: 'EN-GB' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', short: 'HI' },
  { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', short: 'BN' },
  { code: 'ar-SA', name: 'Arabic (Saudi)', nativeName: 'العربية', flag: '🇸🇦', short: 'AR' },
  { code: 'ar-AE', name: 'Arabic (UAE)', nativeName: 'العربية (الإمارات)', flag: '🇦🇪', short: 'AR-AE' },
  { code: 'ur-PK', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', short: 'UR' },
  { code: 'es-ES', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', short: 'ES' },
  { code: 'fr-FR', name: 'French', nativeName: 'Français', flag: '🇫🇷', short: 'FR' },
  { code: 'de-DE', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', short: 'DE' },
  { code: 'zh-CN', name: 'Mandarin Chinese', nativeName: '中文 (简体)', flag: '🇨🇳', short: 'ZH' },
  { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', short: 'JA' },
  { code: 'pt-BR', name: 'Portuguese (BR)', nativeName: 'Português', flag: '🇧🇷', short: 'PT' },
  { code: 'ru-RU', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', short: 'RU' },
  { code: 'it-IT', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', short: 'IT' },
];

/** Clean markdown, code blocks, URLs, and asterisks for smooth text-to-speech audio */
function cleanTextForSpeech(raw: string): string {
  return raw
    .replace(/```[\s\S]*?```/g, 'Code snippet omitted.')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/https?:\/\/\S+/g, 'link')
    .replace(/[*_#~>[\]()]/g, ' ')
    .replace(/🔒|⚠️|✨|💡|🏗️|🏢|📐|🤖/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export const GlobalAIAssistantWidget: React.FC<GlobalAIAssistantWidgetProps> = ({ activePage }) => {
  const { userProfile, openUpgradeModal, incrementUsage, plan } = usePlan();
  const [isOpen, setIsOpen] = useState(false);

  // Personality State
  const [selectedPersonality, setSelectedPersonality] = useState<PersonalityId>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('fiza_ai_personality') as PersonalityId;
      if (stored && ['architectural', 'creative', 'engineering'].includes(stored)) {
        return stored;
      }
    }
    return 'architectural';
  });

  const activePersonalityObj = ASSISTANT_PERSONALITIES.find(p => p.id === selectedPersonality) || ASSISTANT_PERSONALITIES[0];

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(CHAT_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Failed to parse saved chat history from localStorage', e);
      }
    }
    return [
      {
        id: '1',
        sender: 'ai',
        text: activePersonalityObj.welcomeMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('fiza_ai_speech_language') || 'en-US';
    }
    return 'en-US';
  });
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [languageSearch, setLanguageSearch] = useState('');

  // TTS State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('fiza_ai_auto_speak') === 'true';
    }
    return false;
  });
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const endRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Sync messages to localStorage whenever conversation updates
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      try {
        // Retain up to the latest 80 messages
        const trimmed = messages.slice(-80);
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(trimmed));
      } catch (e) {
        console.warn('Failed to save chat history to localStorage', e);
      }
    }
  }, [messages]);

  // Clear / Reset Conversation History
  const handleClearHistory = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    const freshWelcomeMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'ai',
      text: activePersonalityObj.welcomeMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([freshWelcomeMsg]);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify([freshWelcomeMsg]));
      } catch (e) {
        localStorage.removeItem(CHAT_STORAGE_KEY);
      }
    }
  };

  // Web Speech API capability checks
  const isSpeechRecognitionSupported = typeof window !== 'undefined' && Boolean(
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  );
  const isSpeechSynthesisSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const currentLanguageObj = SUPPORTED_SPEECH_LANGUAGES.find(l => l.code === selectedLanguage) || SUPPORTED_SPEECH_LANGUAGES[0];

  // Handle personality change
  const handleSelectPersonality = (personalityId: PersonalityId) => {
    if (personalityId === selectedPersonality) return;
    
    setSelectedPersonality(personalityId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fiza_ai_personality', personalityId);
    }

    const newPersona = ASSISTANT_PERSONALITIES.find(p => p.id === personalityId) || ASSISTANT_PERSONALITIES[0];

    // If conversation is fresh (only 1 AI welcome message), replace welcome message with new tone
    setMessages(prev => {
      if (prev.length <= 1 && prev[0]?.sender === 'ai') {
        return [{
          id: Date.now().toString(),
          sender: 'ai',
          text: newPersona.welcomeMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }];
      }
      return [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'ai',
          text: `🔄 Switched tone to **${newPersona.name}** (${newPersona.role}). ${newPersona.tagline}.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
    });
  };

  // Load available speech synthesis voices
  useEffect(() => {
    if (!isSpeechSynthesisSupported) return;

    const loadVoices = () => {
      try {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          setAvailableVoices(voices);
        }
      } catch (err) {
        console.warn('Error loading speech synthesis voices:', err);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [isSpeechSynthesisSupported]);

  useEffect(() => {
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, typing]);

  const stopSpeaking = useCallback(() => {
    if (isSpeechSynthesisSupported) {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {}
    }
    setIsSpeaking(false);
    setSpeakingMessageId(null);
    activeUtteranceRef.current = null;
  }, [isSpeechSynthesisSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  // Clean up speech recognition & speech synthesis on widget close or unmount
  useEffect(() => {
    if (!isOpen) {
      if (isListening) {
        stopListening();
      }
      if (isSpeaking) {
        stopSpeaking();
      }
      setIsLanguageMenuOpen(false);
    }
  }, [isOpen, isListening, isSpeaking, stopListening, stopSpeaking]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch (_) {}
      }
    };
  }, []);

  // Close language menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(e.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
    };
    if (isLanguageMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLanguageMenuOpen]);

  const speakText = useCallback((textToSpeak: string, messageId?: string, langCode?: string) => {
    if (!isSpeechSynthesisSupported) return;

    // If already speaking this exact message, toggle it off
    if (isSpeaking && speakingMessageId === messageId) {
      stopSpeaking();
      return;
    }

    // Cancel any previous utterance
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}

    const clean = cleanTextForSpeech(textToSpeak);
    if (!clean) return;

    const utterance = new SpeechSynthesisUtterance(clean);
    activeUtteranceRef.current = utterance;

    const targetLang = langCode || selectedLanguage || 'en-US';
    utterance.lang = targetLang;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Find best matching voice
    if (availableVoices.length > 0) {
      const exactVoice = availableVoices.find(v => v.lang.toLowerCase() === targetLang.toLowerCase());
      const prefixVoice = availableVoices.find(v => v.lang.toLowerCase().startsWith(targetLang.split('-')[0].toLowerCase()));
      if (exactVoice) {
        utterance.voice = exactVoice;
      } else if (prefixVoice) {
        utterance.voice = prefixVoice;
      }
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      if (messageId) {
        setSpeakingMessageId(messageId);
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
      activeUtteranceRef.current = null;
    };

    utterance.onerror = (e) => {
      // 'interrupted' and 'canceled' errors are normal when user stops or starts another speech
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('Speech synthesis error:', e.error);
      }
      setIsSpeaking(false);
      setSpeakingMessageId(null);
      activeUtteranceRef.current = null;
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Failed to invoke window.speechSynthesis.speak:', err);
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    }
  }, [isSpeechSynthesisSupported, isSpeaking, speakingMessageId, stopSpeaking, selectedLanguage, availableVoices]);

  const toggleAutoSpeak = () => {
    setAutoSpeak(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('fiza_ai_auto_speak', String(next));
      }
      if (!next && isSpeaking) {
        stopSpeaking();
      }
      return next;
    });
  };

  const startListening = useCallback((langCode?: string) => {
    if (!isSpeechRecognitionSupported) {
      setSpeechError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    // Stop speaking if AI is talking when user starts speaking
    if (isSpeaking) {
      stopSpeaking();
    }

    setSpeechError(null);
    setInterimTranscript('');

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }

      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass();
      recognitionRef.current = recognition;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = langCode || selectedLanguage || 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let finalized = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0]?.transcript || '';
          if (event.results[i].isFinal) {
            finalized += transcriptPiece;
          } else {
            interim += transcriptPiece;
          }
        }

        if (finalized) {
          setInput(prev => {
            const trimmed = prev.trim();
            return trimmed ? `${trimmed} ${finalized.trim()}` : finalized.trim();
          });
        }
        setInterimTranscript(interim);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setSpeechError('Microphone access was denied. Please allow microphone permissions to use voice input.');
        } else if (event.error === 'no-speech') {
          // Benign timeout
        } else if (event.error === 'network') {
          setSpeechError('Network issue with speech recognition service.');
        } else {
          setSpeechError(`Voice input error: ${event.error}`);
        }
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.start();
    } catch (err: any) {
      console.error('Error starting speech recognition:', err);
      setSpeechError('Could not start speech recognition.');
      setIsListening(false);
    }
  }, [isSpeechRecognitionSupported, selectedLanguage, isSpeaking, stopSpeaking]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSelectLanguage = (langCode: string) => {
    setSelectedLanguage(langCode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fiza_ai_speech_language', langCode);
    }
    setIsLanguageMenuOpen(false);
    setLanguageSearch('');

    // If currently listening, restart recognition with new language
    if (isListening) {
      stopListening();
      setTimeout(() => {
        startListening(langCode);
      }, 150);
    }
  };

  const filteredLanguages = SUPPORTED_SPEECH_LANGUAGES.filter(lang => 
    lang.name.toLowerCase().includes(languageSearch.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(languageSearch.toLowerCase()) ||
    lang.code.toLowerCase().includes(languageSearch.toLowerCase())
  );

  // Contextual Suggested Prompts per Page & Personality
  const getPagePrompts = () => {
    const personalityPrompts = activePersonalityObj.suggestedQuestions || [];
    let pageSpecificPrompts: string[] = [];

    switch (activePage) {
      case 'client-portal':
        pageSpecificPrompts = ['Check my project stage status', 'What drawings are in my Cloud Vault?'];
        break;
      case 'construction-intelligence':
        pageSpecificPrompts = ['Estimate my 30x40 plot cost in Kolkata', 'Compare AAC Blocks vs Red Bricks'];
        break;
      case 'services':
        pageSpecificPrompts = ['What is included in BIM LOD 500?', 'How much does 8K rendering cost?'];
        break;
      case 'portfolio':
        pageSpecificPrompts = ['Tell me about Grand Azure Villa', 'Show luxury residential project renderings'];
        break;
      case 'admin':
        pageSpecificPrompts = ['How to generate a new quotation?', 'Show active CRM pipeline value'];
        break;
      default:
        pageSpecificPrompts = ['What architectural services does Fiza Hayat offer?', 'Book a BIM consultation'];
    }

    return Array.from(new Set([...personalityPrompts, ...pageSpecificPrompts]));
  };

  const handleSendText = async (textToSend: string) => {
    if (!textToSend.trim() || typing) return;

    // If currently listening to voice, stop recognition
    if (isListening) {
      stopListening();
    }
    // Stop any ongoing speech
    if (isSpeaking) {
      stopSpeaking();
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setTyping(true);

    const historyPayload = newMessages.map(m => ({
      sender: m.sender,
      text: m.text
    }));

    try {
      const diagResult = await fetchAndDiagnoseAI<any>('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          prompt: textToSend,
          personality: selectedPersonality,
          history: historyPayload,
          pageContext: activePage,
          userId: userProfile?.uid,
          userEmail: userProfile?.email
        })
      }, 'Global AI Widget');

      const data = diagResult.data || {};
      const status = diagResult.status;

      if (status === 429 || data.code === 'LIMIT_REACHED') {
        const limitMsg = data.message || `Your ${plan.toUpperCase()} plan limit for AI chat has been reached. Upgrade your plan to continue.`;
        const aiMsgId = (Date.now() + 1).toString();
        const aiMsgText = `🔒 ${limitMsg}`;
        setMessages(prev => [
          ...prev,
          {
            id: aiMsgId,
            sender: 'ai',
            text: aiMsgText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        if (autoSpeak) {
          speakText(aiMsgText, aiMsgId, selectedLanguage);
        }
        openUpgradeModal(limitMsg);
      } else if (diagResult.ok && (data.success || data.status === 'success') && (data.reply || data.text)) {
        const reply = data.reply || data.text;
        await incrementUsage('ai_chat');
        const aiMsgId = (Date.now() + 1).toString();
        setMessages(prev => [
          ...prev,
          {
            id: aiMsgId,
            sender: 'ai',
            text: reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        if (autoSpeak) {
          speakText(reply, aiMsgId, selectedLanguage);
        }
      } else {
        const errorMsg = data.error || data.message || (diagResult.nonJsonType === 'html_error' ? 'AI service is warming up. Please resend your message.' : 'Failed to receive response from Gemini AI.');
        const aiMsgId = (Date.now() + 1).toString();
        const aiMsgText = `⚠️ ${errorMsg}`;
        setMessages(prev => [
          ...prev,
          {
            id: aiMsgId,
            sender: 'ai',
            text: aiMsgText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        if (autoSpeak) {
          speakText(aiMsgText, aiMsgId, selectedLanguage);
        }
      }
    } catch (e) {
      const aiMsgId = (Date.now() + 1).toString();
      const aiMsgText = `⚠️ Communication Error: Unable to reach AI server.`;
      setMessages(prev => [
        ...prev,
        {
          id: aiMsgId,
          sender: 'ai',
          text: aiMsgText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      if (autoSpeak) {
        speakText(aiMsgText, aiMsgId, selectedLanguage);
      }
    } finally {
      setTyping(false);
    }
  };

  const prompts = getPagePrompts();

  const renderPersonalityIcon = (iconName: 'Compass' | 'Sparkles' | 'Calculator', className: string = 'w-3 h-3') => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Calculator':
        return <Calculator className={className} />;
      case 'Compass':
      default:
        return <Compass className={className} />;
    }
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-50 text-xs">
      {/* FLOATING TRIGGER BUTTON */}
      {!isOpen && (
        <button
          id="btn-open-global-ai-assistant"
          onClick={() => setIsOpen(true)}
          className="px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white font-bold shadow-2xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer border border-white/20 group"
        >
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 flex items-center justify-center">
            {renderPersonalityIcon(activePersonalityObj.iconName, "w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 animate-pulse")}
          </div>
          <span className="hidden xs:inline sm:inline">Ask Fiza AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </button>
      )}

      {/* EXPANDED CHAT DRAWER */}
      {isOpen && (
        <div className="w-[calc(100vw-20px)] sm:w-[420px] max-w-[420px] sm:max-w-[calc(100vw-40px)] h-[min(550px,calc(100vh-30px))] rounded-3xl bg-slate-900 border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
          {/* HEADER */}
          <div className="p-3.5 bg-gradient-to-r from-purple-950/80 via-blue-950/80 to-slate-900 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/40 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-purple-300" />
              </div>
              <div className="overflow-hidden">
                <div className="text-white font-bold text-xs flex items-center gap-1.5 truncate">
                  <span>Fiza AI Assistant</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[8px] font-mono border border-emerald-500/30">Live</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-[9px] truncate">
                  <span>Context: /{activePage}</span>
                  <span>•</span>
                  <span className="text-purple-300 font-medium">{activePersonalityObj.shortLabel}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {/* CLEAR CHAT HISTORY BUTTON */}
              <button
                type="button"
                id="btn-clear-chat-history"
                onClick={handleClearHistory}
                title="Clear conversation history and reset"
                className="p-1.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-white/10 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* AUTO-SPEAK (TTS) TOGGLE BUTTON */}
              {isSpeechSynthesisSupported && (
                <button
                  type="button"
                  id="btn-toggle-auto-tts"
                  onClick={toggleAutoSpeak}
                  title={autoSpeak ? "Auto-read AI responses is ON (Click to mute)" : "Auto-read AI responses is OFF (Click to enable)"}
                  className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                    autoSpeak
                      ? 'bg-purple-600/30 text-purple-300 border-purple-500/40 hover:bg-purple-600/50'
                      : 'bg-slate-800/80 text-slate-400 border-transparent hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {autoSpeak ? <Volume2 className="w-4 h-4 text-purple-300 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
                </button>
              )}

              {/* CLOSE BUTTON */}
              <button
                id="btn-close-global-ai-assistant"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* PERSONALITY SELECTOR BAR */}
          <div className="px-2.5 py-2 bg-slate-950/90 border-b border-white/5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                <SlidersHorizontal className="w-3 h-3 text-purple-400" />
                <span>Assistant Tone & Persona:</span>
              </div>
              <span className="text-[9px] text-slate-500 hidden xs:inline">{activePersonalityObj.role}</span>
            </div>

            <div className="grid grid-cols-3 gap-1">
              {ASSISTANT_PERSONALITIES.map(persona => {
                const isSelected = persona.id === selectedPersonality;
                return (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => handleSelectPersonality(persona.id)}
                    title={`${persona.name}: ${persona.tagline}`}
                    className={`px-2 py-1.5 rounded-xl border text-[10px] transition-all flex items-center justify-center gap-1.5 cursor-pointer truncate ${
                      isSelected
                        ? persona.activeBtnClass
                        : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border-white/5'
                    }`}
                  >
                    {renderPersonalityIcon(persona.iconName, `w-3 h-3 shrink-0 ${isSelected ? 'text-current' : 'text-slate-500'}`)}
                    <span className="truncate">{persona.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DISCLAIMER NOTICE */}
          <div className="px-3 py-1.5 bg-amber-950/20 border-b border-amber-500/10 text-[9px] text-slate-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="truncate">Informational AI. Construction designs require licensed engineering sign-off.</span>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
            {messages.map(m => {
              const isThisMessageSpeaking = isSpeaking && speakingMessageId === m.id;
              return (
                <div key={m.id} className={`flex space-x-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.sender === 'ai' && (
                    <div className="w-6 h-6 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className={`max-w-[84%] p-3 rounded-2xl relative group ${
                    m.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none font-medium' 
                      : isThisMessageSpeaking
                        ? 'bg-slate-950 text-slate-200 border border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.15)] rounded-tl-none'
                        : 'bg-slate-950 text-slate-200 border border-white/10 rounded-tl-none'
                  }`}>
                    <p className="leading-relaxed text-[11px] whitespace-pre-wrap">{m.text}</p>
                    
                    <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-white/5">
                      {/* PER-MESSAGE TTS READ-ALOUD BUTTON (FOR AI MESSAGES) */}
                      {m.sender === 'ai' && isSpeechSynthesisSupported ? (
                        <button
                          type="button"
                          onClick={() => speakText(m.text, m.id, selectedLanguage)}
                          title={isThisMessageSpeaking ? "Stop reading aloud" : "Read this response aloud"}
                          className={`flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                            isThisMessageSpeaking
                              ? 'bg-purple-600/40 text-purple-200 font-semibold border border-purple-500/40 animate-pulse'
                              : 'text-slate-400 hover:text-purple-300 hover:bg-slate-900'
                          }`}
                        >
                          {isThisMessageSpeaking ? (
                            <>
                              <Square className="w-2.5 h-2.5 fill-current" />
                              <span>Stop reading</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-2.5 h-2.5" />
                              <span>Read aloud</span>
                            </>
                          )}
                        </button>
                      ) : <span />}

                      <span className="text-[9px] opacity-60">{m.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {typing && (
              <div className="flex space-x-2 justify-start items-center animate-fadeIn">
                <div className="w-6 h-6 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-slate-950 border border-white/10 p-2.5 rounded-2xl rounded-tl-none text-slate-300 text-[11px] flex items-center space-x-2 shadow-md">
                  <span className="font-medium text-purple-300">Fiza AI ({activePersonalityObj.shortLabel}) is thinking...</span>
                  <div className="flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* CONTEXTUAL PROMPT PILLS */}
          <div className="p-2 bg-slate-950/80 border-t border-white/5 overflow-x-auto whitespace-nowrap scrollbar-none">
            <div className="flex gap-1.5">
              {prompts.map((p, i) => (
                <button
                  key={i}
                  disabled={typing}
                  onClick={() => handleSendText(p)}
                  className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-purple-600/30 border border-white/10 text-slate-300 hover:text-white text-[10px] font-medium cursor-pointer transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ✨ {p}
                </button>
              ))}
            </div>
          </div>

          {/* ACTIVE SPEAKING (TTS) BANNER */}
          {isSpeaking && (
            <div className="px-3 py-1.5 bg-purple-950/70 border-t border-purple-500/30 text-[10px] text-purple-200 flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2 overflow-hidden pr-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping shrink-0" />
                <span className="truncate flex items-center gap-1.5">
                  <Volume2 className="w-3 h-3 text-purple-300 shrink-0 animate-bounce" />
                  <span>Reading aloud ({currentLanguageObj.short})...</span>
                </span>
              </div>
              <button
                type="button"
                onClick={stopSpeaking}
                className="px-2 py-0.5 rounded bg-purple-900 hover:bg-purple-800 text-purple-100 text-[9px] font-medium cursor-pointer shrink-0 flex items-center gap-1 border border-purple-500/40"
              >
                <Square className="w-2.5 h-2.5 fill-current" />
                <span>Stop</span>
              </button>
            </div>
          )}

          {/* ACTIVE LISTENING (STT) BANNER */}
          {isListening && (
            <div className="px-3 py-1.5 bg-rose-950/60 border-t border-rose-500/30 text-[10px] text-rose-200 flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2 overflow-hidden pr-2">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping shrink-0" />
                <span className="truncate">
                  {interimTranscript ? (
                    <span className="italic">"{interimTranscript}"</span>
                  ) : (
                    <span>Listening ({currentLanguageObj.flag} {currentLanguageObj.short})... Speak hands-free</span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsLanguageMenuOpen(prev => !prev)}
                  className="px-1.5 py-0.5 rounded bg-rose-900/60 hover:bg-rose-800/80 text-rose-200 text-[9px] font-medium cursor-pointer flex items-center gap-1 border border-rose-500/30"
                  title="Change voice language"
                >
                  <span>{currentLanguageObj.flag}</span>
                  <span className="hidden xs:inline">{currentLanguageObj.short}</span>
                </button>
                <button
                  type="button"
                  onClick={stopListening}
                  className="px-1.5 py-0.5 rounded bg-rose-900/80 hover:bg-rose-800 text-rose-200 text-[9px] font-medium cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {speechError && (
            <div className="px-3 py-1.5 bg-amber-950/60 border-t border-amber-500/30 text-[10px] text-amber-200 flex items-center justify-between animate-fadeIn">
              <span className="truncate pr-2">⚠️ {speechError}</span>
              <button
                type="button"
                onClick={() => setSpeechError(null)}
                className="text-amber-400 hover:text-white text-[10px] px-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* LANGUAGE SELECTION POPUP MENU */}
          {isLanguageMenuOpen && (
            <div 
              ref={languageMenuRef}
              className="absolute bottom-16 right-3 w-64 max-h-72 bg-slate-950 border border-purple-500/40 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-fadeIn"
            >
              <div className="p-2.5 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-200 font-semibold text-[11px]">
                  <Languages className="w-3.5 h-3.5 text-purple-400" />
                  <span>Speech Language</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLanguageMenuOpen(false)}
                  className="text-slate-400 hover:text-white text-xs p-0.5"
                >
                  ✕
                </button>
              </div>

              <div className="p-2 border-b border-white/5 bg-slate-900/40">
                <input
                  type="text"
                  value={languageSearch}
                  onChange={(e) => setLanguageSearch(e.target.value)}
                  placeholder="Search language..."
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-white text-[10px] focus:outline-none focus:border-purple-500 placeholder:text-slate-500"
                />
              </div>

              <div className="overflow-y-auto p-1.5 space-y-0.5 max-h-48 scrollbar-thin">
                {filteredLanguages.length === 0 ? (
                  <div className="p-3 text-center text-slate-500 text-[10px]">
                    No language matched
                  </div>
                ) : (
                  filteredLanguages.map(lang => {
                    const isSelected = lang.code === selectedLanguage;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleSelectLanguage(lang.code)}
                        className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-left text-[10px] transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-purple-600/30 text-purple-200 font-medium border border-purple-500/40'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="text-sm shrink-0">{lang.flag}</span>
                          <div className="truncate">
                            <span className="font-medium text-white">{lang.name}</span>
                            <span className="text-[9px] text-slate-400 ml-1.5">({lang.nativeName})</span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3 h-3 text-purple-400 shrink-0 ml-1" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* INPUT FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendText(input);
            }}
            className="p-3 bg-slate-950 border-t border-white/10 flex gap-2 items-center relative"
          >
            <input
              id="input-fiza-ai-chat"
              type="text"
              value={input}
              disabled={typing}
              onChange={e => setInput(e.target.value)}
              placeholder={
                isListening 
                  ? `Listening (${currentLanguageObj.name})...` 
                  : typing 
                    ? `Fiza AI (${activePersonalityObj.shortLabel}) is responding...` 
                    : `Ask ${activePersonalityObj.name}...`
              }
              className={`flex-1 px-3 py-2 rounded-xl bg-slate-900 border text-white text-[11px] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                isListening 
                  ? 'border-rose-500/70 shadow-[0_0_10px_rgba(244,63,94,0.2)]' 
                  : 'border-white/10 focus:border-purple-500'
              }`}
            />

            {/* LANGUAGE SELECTOR BUTTON */}
            <button
              type="button"
              id="btn-select-speech-language"
              onClick={() => setIsLanguageMenuOpen(prev => !prev)}
              disabled={typing}
              title={`Speech Language: ${currentLanguageObj.name} (${currentLanguageObj.nativeName}) - Click to change`}
              className="px-2 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-[10px] font-medium cursor-pointer transition-all disabled:opacity-50 flex items-center gap-1 shrink-0"
            >
              <span>{currentLanguageObj.flag}</span>
              <span className="hidden sm:inline text-[9px]">{currentLanguageObj.short}</span>
              <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
            </button>

            {/* VOICE-TO-TEXT MICROPHONE BUTTON */}
            <button
              type="button"
              id="btn-toggle-voice-input"
              onClick={toggleListening}
              disabled={typing}
              title={
                !isSpeechRecognitionSupported 
                  ? "Voice input not supported in this browser" 
                  : isListening 
                    ? `Listening in ${currentLanguageObj.name}. Click to stop` 
                    : `Speak in ${currentLanguageObj.name} (Voice to Text)`
              }
              className={`px-3 py-2 rounded-xl border font-bold cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0 ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-400/80 shadow-lg shadow-rose-600/30 animate-pulse'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-white/10'
              }`}
            >
              {isListening ? (
                <MicOff className="w-3.5 h-3.5 text-white" />
              ) : (
                <Mic className="w-3.5 h-3.5 text-purple-300 group-hover:text-white" />
              )}
            </button>

            {/* SEND BUTTON */}
            <button
              type="submit"
              id="btn-send-fiza-ai-chat"
              disabled={typing || !input.trim()}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
            >
              {typing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

