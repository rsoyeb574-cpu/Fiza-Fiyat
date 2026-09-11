import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, ChevronLeft, Sparkles, Lightbulb } from 'lucide-react';
import { VisualStep } from '../../types/visualKnowledge';
import { SafeImage } from '../common/SafeImage';

interface StepVisualTutorialProps {
  title?: string;
  steps: VisualStep[];
}

export const StepVisualTutorial: React.FC<StepVisualTutorialProps> = ({
  title = 'Step-by-Step Technical Execution',
  steps
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  if (!steps || steps.length === 0) return null;

  const currentStep = steps[activeStepIndex];

  return (
    <div className="space-y-6 rounded-3xl bg-[#0F172A]/80 border border-indigo-500/20 p-5 sm:p-7 backdrop-blur-xl">
      {/* Title & Step tracker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-[11px] font-bold tracking-widest uppercase text-violet-400 block">
            Step-by-Step Tutorial
          </span>
          <h3 className="text-lg sm:text-xl font-extrabold text-white">
            {title}
          </h3>
        </div>

        {/* Step indicator pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {steps.map((s, idx) => (
            <button
              key={s.stepNumber}
              onClick={() => setActiveStepIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeStepIndex === idx
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30 ring-1 ring-violet-400'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-white/5'
              }`}
            >
              <span>Step 0{s.stepNumber}</span>
              {idx < activeStepIndex && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
            </button>
          ))}
        </div>
      </div>

      {/* Active Step Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Step Image */}
        <div className="lg:col-span-7 space-y-2">
          <div className="relative h-[280px] sm:h-[360px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-950 group">
            <SafeImage
              src={currentStep.image}
              alt={currentStep.imageAlt}
              topicType={title + ' ' + currentStep.title}
              fallbackTitle={currentStep.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-neutral-950/85 backdrop-blur-md text-white text-xs font-bold border border-violet-500/40 shadow-lg flex items-center gap-2 z-10 pointer-events-none">
              <span className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center text-[10px] font-black">
                {currentStep.stepNumber}
              </span>
              <span>Step {currentStep.stepNumber} of {steps.length}</span>
            </div>
          </div>
          {currentStep.caption && (
            <p className="text-[11px] text-neutral-400 italic text-center px-2">
              {currentStep.caption}
            </p>
          )}
        </div>

        {/* Step Instructions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-mono text-violet-400 font-semibold uppercase tracking-wider">
              Phase 0{currentStep.stepNumber}
            </span>
            <h4 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {currentStep.title}
            </h4>
            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Expert Tips */}
          {currentStep.tips && currentStep.tips.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-violet-950/30 border border-violet-500/20 space-y-1.5">
              <span className="text-[11px] font-bold text-violet-300 flex items-center gap-1.5 uppercase tracking-wide">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                Engineering Tip
              </span>
              <ul className="space-y-1 text-xs text-neutral-300">
                {currentStep.tips.map((t, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-violet-400 font-bold">•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Prev / Next controls */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <button
              onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={activeStepIndex === 0}
              className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none text-neutral-300 text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Step</span>
            </button>

            <button
              onClick={() => setActiveStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
              disabled={activeStepIndex === steps.length - 1}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-violet-600/30 transition-all cursor-pointer"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
