import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, RefreshCw, Calculator, Building2 } from 'lucide-react';
import { Service, Project } from '../../types';

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
    if (!input.trim()) return;

    const userMsgText = input.trim();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userMsgText,
      time: now
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setTyping(true);

    // Call server API route /api/chat or perform smart conversational synthesis
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsgText })
      });

      if (response.ok) {
        const data = await response.json();
        const aiText = data.text || data.reply;
        if (aiText) {
          setMessages(prev => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              sender: 'ai',
              text: aiText,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
          setTyping(false);
          return;
        }
      }
    } catch (e) {
      // Fallback
    }

    // Smart Domain-Aware Fallback
    setTimeout(() => {
      let aiReply = "Fiza Hayat specializes in end-to-end luxury building design, Revit BIM modeling, photorealistic 8K rendering, and AI concept generation. Would you like to view our latest portfolio or generate an instant cost estimate?";
      const lower = userMsgText.toLowerCase();

      if (lower.includes('cost') || lower.includes('price') || lower.includes('quote') || lower.includes('budget')) {
        aiReply = "Our project fees depend on total square footage, Level of Detail (BIM LOD 300 to 500), and interior specification. You can use our interactive Cost Estimator on the website or leave your email to receive an itemized proposal!";
      } else if (lower.includes('revit') || lower.includes('cad') || lower.includes('bim') || lower.includes('drawing')) {
        aiReply = "We provide LOD 300 to LOD 500 Autodesk Revit BIM modeling, MEP clash detection, and precision 2D AutoCAD drafting compliant with international building codes.";
      } else if (lower.includes('ai') || lower.includes('render') || lower.includes('3d') || lower.includes('animation')) {
        aiReply = "We utilize custom-trained neural diffusion pipelines combined with Unreal Engine 5 & V-Ray to produce photorealistic 8K stills and cinematic 3D walkthrough animations in record time.";
      } else if (lower.includes('location') || lower.includes('contact') || lower.includes('dubai') || lower.includes('switzerland')) {
        aiReply = "Fiza Hayat operates globally with primary executive offices in Downtown Dubai and Zurich/Geneva. You can reach our team via WhatsApp, phone, or email at contact@fizahayat.com.";
      }

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setTyping(false);
    }, 1000);
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
                <p className="leading-relaxed">{m.text}</p>
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
            <div className="flex space-x-2 justify-start items-center">
              <div className="w-7 h-7 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-neutral-800 p-3 rounded-2xl rounded-tl-none text-neutral-400 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-neutral-950 border-t border-white/10 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Ask about BIM, 3D renders, architectural timelines..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
