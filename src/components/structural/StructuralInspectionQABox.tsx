import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  HelpCircle,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { StructuralInspectionResult } from '../../types/structuralInspector';

interface StructuralInspectionQABoxProps {
  inspectionResult: StructuralInspectionResult;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const QUICK_QUESTIONS = [
  'What could cause this crack?',
  'Is this likely surface damage or structural?',
  'What should I inspect next?',
  'What materials may be involved in repair?',
  'What should I ask a structural engineer?',
  'Explain this report in simple language.'
];

export const StructuralInspectionQABox: React.FC<StructuralInspectionQABoxProps> = ({
  inspectionResult
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I'm Fiza AI Structural Assistant. I've reviewed the preliminary inspection report for this **${inspectionResult.structureType}**. Ask me any question about the visible distress patterns, potential causes, or questions for your structural engineer.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/structural-inspection/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: text,
          inspectionContext: {
            structureType: inspectionResult.structureType,
            overallAssessment: inspectionResult.overallAssessment,
            severity: inspectionResult.severity,
            findings: inspectionResult.findings,
            whatMayBeRequired: inspectionResult.whatMayBeRequired,
            possibleRepairApproaches: inspectionResult.possibleRepairApproaches
          },
          conversationHistory: messages.map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to get answer from AI');
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.answer || 'Thank you for your question. A qualified on-site engineer will be able to perform physical tests to verify this issue.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Structural QA error:', err);
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        sender: 'ai',
        text: `I apologize, but I encountered an error answering your question. Please ensure an on-site structural engineer inspects the structure directly.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-white/10 bg-slate-900/80 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Ask Fiza AI About This Damage</h3>
            <p className="text-xs text-slate-400">Interactive consultation grounded in this specific inspection report</p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
          AI Engineering Q&A
        </span>
      </div>

      {/* Quick Prompt Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Quick Questions:
        </span>
        {QUICK_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/40 text-slate-200 transition-all disabled:opacity-50 text-left"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Container */}
      <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
        {messages.map((m) => {
          const isAi = m.sender === 'ai';
          return (
            <div
              key={m.id}
              className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed border ${
                  isAi
                    ? 'bg-slate-950/80 border-white/10 text-slate-200'
                    : 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/20'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
                <div className={`text-[10px] mt-1.5 font-mono ${isAi ? 'text-slate-500' : 'text-blue-200'} text-right`}>
                  {m.timestamp}
                </div>
              </div>
              {!isAi && (
                <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-3 flex items-center gap-2 text-xs text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span>Analyzing structural context & formulating advice...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 pt-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask anything about this damage (e.g. Is this crack urgent?)..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Ask</span>
        </button>
      </form>
    </div>
  );
};
