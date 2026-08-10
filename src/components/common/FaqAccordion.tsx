import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    id: '1',
    question: 'What architectural consultancy services does Fiza Hayat offer?',
    answer: 'We provide end-to-end architectural consultancy including conceptual design, structural drafting, 3D visualization, BIM LOD 500 coordination, interior planning, landscape architecture, and AI-assisted design concepts.',
    category: 'General Services',
  },
  {
    id: '2',
    question: 'How does BIM (Building Information Modeling) LOD 500 benefit my project?',
    answer: 'LOD 500 represents as-built models with rich geometrical and parametric accuracy. It eliminates structural clashes, reduces material wastage, optimizes constructability, and delivers digital twin capabilities for long-term facility management.',
    category: 'BIM & Technical',
  },
  {
    id: '3',
    question: 'What is the typical workflow and project delivery timeline?',
    answer: 'Our workflow starts with an initial design discovery and site feasibility analysis, followed by schematic 3D modeling, detailed BIM coordination, client review iterations, and final construction documentation. Timelines vary by scale, typically ranging from 2 to 8 weeks.',
    category: 'Process & Timeline',
  },
  {
    id: '4',
    question: 'Can your team manage international building codes and remote coordination?',
    answer: 'Yes. We regularly work with international client networks across Europe, the Middle East, Asia, and the Americas. Our deliverables comply with international CAD/BIM standards (IBC, Eurocodes, UAE Fire Code, ISO 19650).',
    category: 'Global & Compliance',
  },
  {
    id: '5',
    question: 'How is Generative AI integrated into your architectural workflow?',
    answer: 'We leverage custom neural diffusion pipelines and generative AI algorithms for rapid material exploration, environmental lighting studies, spatial ideation, and hyper-realistic concept renderings during early-stage feasibility.',
    category: 'Innovation & AI',
  },
  {
    id: '6',
    question: 'How do I request a project proposal or consultation quote?',
    answer: 'You can submit a project inquiry directly via our Contact page, reach out through our WhatsApp channel, or send your project specifications via email. Our team will review your requirements and provide a detailed scope proposal within 24–48 hours.',
    category: 'Getting Started',
  },
];

export interface FaqAccordionProps {
  faqs?: FaqItem[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({
  faqs = DEFAULT_FAQS,
  title = 'Frequently Asked Questions',
  subtitle = 'Everything you need to know about our architectural consultancy, BIM workflows, and project coordination.',
  className = '',
}) => {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Client Knowledge Base</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Accordion List */}
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-neutral-900/90 border-blue-500/40 shadow-xl shadow-blue-500/5'
                  : 'bg-neutral-900/50 border-white/10 hover:border-white/20'
              }`}
            >
              <button
                id={`faq-button-${faq.id}`}
                type="button"
                onClick={() => toggleItem(faq.id)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${faq.id}`}
                className="w-full px-6 py-4 flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-none"
              >
                <div className="flex items-center space-x-3">
                  <span className={`text-sm font-semibold transition-colors ${isOpen ? 'text-blue-400' : 'text-white'}`}>
                    {faq.question}
                  </span>
                  {faq.category && (
                    <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-neutral-800 text-[10px] text-neutral-400 border border-white/5 font-medium">
                      {faq.category}
                    </span>
                  )}
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                    isOpen ? 'bg-blue-600/20 text-blue-400 rotate-180' : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div
                  id={`faq-answer-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-button-${faq.id}`}
                  className="px-6 pb-5 pt-1 text-neutral-300 text-xs sm:text-sm leading-relaxed border-t border-white/5 mt-1"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FaqAccordion;
