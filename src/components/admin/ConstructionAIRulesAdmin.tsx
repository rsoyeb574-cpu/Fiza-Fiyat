import React, { useState } from 'react';
import { Sparkles, Save, Check, Plus, Edit3, Trash2, Cpu, FileText, Sliders } from 'lucide-react';

interface PromptTemplate {
  id: string;
  name: string;
  category: 'Structural' | 'Interior' | 'Vastu' | 'Material';
  template: string;
}

interface AIRule {
  id: string;
  ruleName: string;
  condition: string;
  recommendation: string;
}

export const ConstructionAIRulesAdmin: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [prompts, setPrompts] = useState<PromptTemplate[]>([
    {
      id: 'p-1',
      name: 'Structural Load Calculator Prompt',
      category: 'Structural',
      template: 'Analyze soil bearing capacity for {locationCity} and calculate minimum footing depth for {numberOfFloors} floors.'
    },
    {
      id: 'p-2',
      name: 'Vastu & Natural Ventilation Prompt',
      category: 'Vastu',
      template: 'Recommend room positions for plot with road facing {roadDirection} and North at {northDirection}.'
    },
    {
      id: 'p-3',
      name: 'Material Quantity Ratio Prompt',
      category: 'Material',
      template: 'Calculate cement bags, steel kg, sand cu.ft for {builtUpSqFt} sq.ft with quality level {qualityLevel}.'
    }
  ]);

  const [rules, setRules] = useState<AIRule[]>([
    { id: 'r-1', ruleName: 'High Seismic Zone Rule', condition: 'City in Seismic Zone IV / V', recommendation: 'Enforce IS 13920 ductile detailing for all columns.' },
    { id: 'r-2', ruleName: 'Luxury Finish Rule', condition: 'Quality == Luxury', recommendation: 'Recommend Italian Marble and Double Glazed uPVC Fenestration.' }
  ]);

  const [editingPrompt, setEditingPrompt] = useState<PromptTemplate | null>(null);
  const [editingRule, setEditingRule] = useState<AIRule | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSavePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrompt) return;
    setPrompts(prompts.map(p => p.id === editingPrompt.id ? editingPrompt : p));
    setEditingPrompt(null);
    showToast('Prompt Template saved successfully!');
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;
    setRules(rules.map(r => r.id === editingRule.id ? editingRule : r));
    setEditingRule(null);
    showToast('AI Recommendation Rule saved successfully!');
  };

  return (
    <div className="space-y-6 text-xs">
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-semibold text-xs shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-2">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-amber-400" />
          <span>AI House Planner & Rules Engine Configuration</span>
        </h2>
        <p className="text-slate-400 text-xs">Manage prompt templates, structural rule triggers, material formula constants, and 3D style parameters stored in Firestore.</p>
      </div>

      {/* PROMPT TEMPLATES SECTION */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <span>AI Prompt Templates</span>
          </h3>
          <button
            onClick={() => {
              const newP: PromptTemplate = { id: `p-${Date.now()}`, name: 'New Prompt', category: 'Structural', template: 'New prompt text template' };
              setPrompts([...prompts, newP]);
              setEditingPrompt(newP);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Prompt
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prompts.map(p => (
            <div key={p.id} className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <span className="font-bold text-white text-sm">{p.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 font-mono text-[10px]">{p.category}</span>
                </div>
                <p className="text-slate-300 font-mono text-[11px] mt-2 bg-slate-900 p-2.5 rounded-xl border border-white/5">{p.template}</p>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-white/5">
                <button onClick={() => setEditingPrompt(p)} className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 flex items-center gap-1">
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI RECOMMENDATION RULES SECTION */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <span>AI Structural & Design Rules</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map(r => (
            <div key={r.id} className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
              <div className="font-bold text-white text-sm">{r.ruleName}</div>
              <div className="text-slate-400 text-[11px]">Condition: <span className="text-cyan-300 font-mono">{r.condition}</span></div>
              <div className="text-slate-300 text-[11px]">Recommendation: {r.recommendation}</div>
            </div>
          ))}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingPrompt && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-lg w-full space-y-4 text-white">
            <h3 className="font-bold text-sm border-b border-white/10 pb-3">Edit Prompt Template</h3>
            <form onSubmit={handleSavePrompt} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Prompt Name</label>
                <input
                  type="text"
                  value={editingPrompt.name}
                  onChange={e => setEditingPrompt({ ...editingPrompt, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 rounded-xl border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Template String</label>
                <textarea
                  rows={4}
                  value={editingPrompt.template}
                  onChange={e => setEditingPrompt({ ...editingPrompt, template: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 rounded-xl border border-white/10 text-white font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setEditingPrompt(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-1.5">
                  <Save className="w-3.5 h-3.5" /> Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
