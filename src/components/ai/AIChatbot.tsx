import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, RefreshCw, Calculator, Building2, Zap } from 'lucide-react';
import { Service, Project } from '../../types';
import { usePlan } from '../../context/PlanContext';
import { fetchAndDiagnoseAI } from '../../utils/aiDiagnostics';

interface AIChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  projects: Project[];
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({
  isOpen,
  onClose,
  services,
  projects
}) => {
  const { userProfile, openUpgradeModal, incrementUsage, plan } = usePlan();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am Fiza AI, your architectural & design intelligence assistant. How can I assist with your building project, BIM workflow, or creative campaign today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || typing) return;

    const userMsgText = input.trim();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userMsgText,
      time: now
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setTyping(true);

    // Format chat history for Gemini API
    const historyPayload = newMessages.map(m => ({
      sender: m.sender,
      text: m.text
    }));

    try {
      const diagResult = await fetchAndDiagnoseAI<any>('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsgText,
          prompt: userMsgText,
          history: historyPayload,
          userId: userProfile?.uid,
          userEmail: userProfile?.email
        })
      }, 'Chatbot Assistant');

      const data = diagResult.data || {};
      const status = diagResult.status;

      if (status === 429 || data.code === 'LIMIT_REACHED') {
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
      } else if (diagResult.ok && (data.success || data.status === 'success') && (data.reply || data.text)) {
        const aiText = data.reply || data.text;
        await incrementUsage('ai_chat');
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: aiText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        const errorMsg = data.error || data.message || (diagResult.nonJsonType === 'html_error' ? 'AI server is warming up. Please resend your message.' : 'Failed to receive response from Gemini AI.');
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
    } catch (err: any) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[580px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chat Header */}
        <div className="p-4 bg-gradient-to-r from-purple-950/60 via-blue-950/60 to-neutral-950 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-600 p-[1px]">
              <div className="w-full h-full bg-neutral-950 rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-sm font-bold text-white tracking-tight">Fiza AI Assistant</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <span className="text-[10px] text-neutral-400">Architectural & Design Intelligence</span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message History */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
          {messages.map((m) => (
            <div 
              key={m.id}
              className={`flex space-x-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div className={`max-w-[80%] p-3 rounded-2xl ${
                m.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-neutral-800/80 text-neutral-200 border border-white/5 rounded-tl-none'
              }`}>
                <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                <span className="text-[9px] opacity-60 block mt-1 text-right">{m.time}</span>
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {typing && (
            <div className="flex space-x-2 justify-start items-center animate-fadeIn">
              <div className="w-7 h-7 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-neutral-800/90 border border-white/10 p-3 rounded-2xl rounded-tl-none text-neutral-300 flex items-center space-x-2.5 shadow-lg">
                <span className="text-[11px] font-medium text-purple-300">Fiza AI is thinking...</span>
                <div className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-neutral-950 border-t border-white/10 flex items-center space-x-2">
          <input
            type="text"
            placeholder={typing ? "Fiza AI is analyzing your prompt..." : "Ask about BIM, 3D renders, architectural timelines..."}
            value={input}
            disabled={typing}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={typing || !input.trim()}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {typing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};
