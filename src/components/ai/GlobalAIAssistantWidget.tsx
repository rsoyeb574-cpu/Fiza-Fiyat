import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, X, Send, User, ChevronUp, AlertTriangle, Building2, Calculator, ShieldCheck, Compass, RefreshCw } from 'lucide-react';
import { usePlan } from '../../context/PlanContext';

interface GlobalAIAssistantWidgetProps {
  activePage: string;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const GlobalAIAssistantWidget: React.FC<GlobalAIAssistantWidgetProps> = ({ activePage }) => {
  const { userProfile, openUpgradeModal, incrementUsage, plan } = usePlan();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am Fiza AI, your architectural & construction intelligence assistant. How can I help you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, typing]);

  // Contextual Suggested Prompts per Page
  const getPagePrompts = () => {
    switch (activePage) {
      case 'client-portal':
        return ['Check my project stage status', 'How to download my latest invoice?', 'What drawings are in my Cloud Vault?'];
      case 'construction-intelligence':
        return ['Estimate my 30x40 plot cost in Kolkata', 'Compare AAC Blocks vs Red Bricks', 'Explain Foundation IS Code standards'];
      case 'services':
        return ['What is included in BIM LOD 500?', 'How much does 8K rendering cost?', 'How do I request a site consultation?'];
      case 'portfolio':
        return ['Tell me about Grand Azure Villa', 'Show me residential project renderings', 'Filter projects by Dubai location'];
      case 'admin':
        return ['How to generate a new quotation?', 'Show active CRM pipeline value', 'Assign a task to an engineer'];
      default:
        return ['What services does Fiza Hayat offer?', 'Generate an instant cost estimate', 'Book a BIM consultation'];
    }
  };

  const handleSendText = async (textToSend: string) => {
    if (!textToSend.trim() || typing) return;

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
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          history: historyPayload,
          pageContext: activePage,
          userId: userProfile?.uid,
          userEmail: userProfile?.email
        })
      });

      const data = await res.json();

      if (res.status === 429 || data.code === 'LIMIT_REACHED') {
        const limitMsg = data.message || `Your ${plan.toUpperCase()} plan limit for AI chat has been reached. Upgrade your plan to continue.`;
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: `🔒 ${limitMsg}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        openUpgradeModal(limitMsg);
      } else if (res.ok && data.status === 'success' && (data.text || data.reply)) {
        const reply = data.text || data.reply;
        await incrementUsage('ai_chat');
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        const errorMsg = data.error || 'Failed to receive response from Gemini AI.';
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: `⚠️ ${errorMsg}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `⚠️ Communication Error: Unable to reach AI server.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setTyping(false);
    }
  };

  const prompts = getPagePrompts();

  return (
    <div className="fixed bottom-5 right-5 z-50 text-xs">
      {/* FLOATING TRIGGER BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-3 rounded-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white font-bold shadow-2xl hover:scale-105 transition-all flex items-center gap-2 cursor-pointer border border-white/20 group"
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>
          <span className="hidden sm:inline">Ask Fiza AI</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        </button>
      )}

      {/* EXPANDED CHAT DRAWER */}
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] max-w-[360px] sm:max-w-[420px] h-[550px] max-h-[85vh] rounded-3xl bg-slate-900 border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
          {/* HEADER */}
          <div className="p-4 bg-gradient-to-r from-purple-950/80 via-blue-950/80 to-slate-900 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/40 flex items-center justify-center">
                <Bot className="w-4 h-4 text-purple-300" />
              </div>
              <div>
                <div className="text-white font-bold text-xs flex items-center gap-1.5">
                  <span>Fiza AI Assistant</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[9px] font-mono border border-emerald-500/30">Live</span>
                </div>
                <span className="text-slate-400 text-[10px]">Context: Page /{activePage}</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* DISCLAIMER NOTICE */}
          <div className="px-3 py-2 bg-amber-950/30 border-b border-amber-500/20 text-[10px] text-slate-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>AI responses are informational. Engineering designs require licensed professional review.</span>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map(m => (
              <div key={m.id} className={`flex space-x-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className={`max-w-[82%] p-3 rounded-2xl ${
                  m.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none font-medium' 
                    : 'bg-slate-950 text-slate-200 border border-white/10 rounded-tl-none'
                }`}>
                  <p className="leading-relaxed text-[11px] whitespace-pre-wrap">{m.text}</p>
                  <span className="text-[9px] opacity-60 block mt-1 text-right">{m.time}</span>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex space-x-2 justify-start items-center animate-fadeIn">
                <div className="w-6 h-6 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-slate-950 border border-white/10 p-2.5 rounded-2xl rounded-tl-none text-slate-300 text-[11px] flex items-center space-x-2 shadow-md">
                  <span className="font-medium text-purple-300">Fiza AI is thinking...</span>
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
                  className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-blue-600/30 border border-white/10 text-slate-300 hover:text-white text-[10px] font-medium cursor-pointer transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ✨ {p}
                </button>
              ))}
            </div>
          </div>

          {/* INPUT FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendText(input);
            }}
            className="p-3 bg-slate-950 border-t border-white/10 flex gap-2"
          >
            <input
              type="text"
              value={input}
              disabled={typing}
              onChange={e => setInput(e.target.value)}
              placeholder={typing ? "Fiza AI is processing..." : `Ask Fiza AI on /${activePage}...`}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-[11px] focus:outline-none focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={typing || !input.trim()}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {typing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
