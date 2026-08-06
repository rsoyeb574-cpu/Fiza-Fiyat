import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Save, X, Tag, Check } from 'lucide-react';
import { LaborRateItem, LaborRoleType } from '../../types/constructionDatabase';
import { getLaborRates, saveLaborRate, deleteLaborRate } from '../../services/constructionDb';
import { initialLaborRates } from '../../services/constructionDbSeedData';

export const ConstructionLaborAdmin: React.FC = () => {
  const [laborList, setLaborList] = useState<LaborRateItem[]>([]);
  const [editingLabor, setEditingLabor] = useState<Partial<LaborRateItem> | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadLabor();
  }, []);

  const loadLabor = async () => {
    const data = await getLaborRates(initialLaborRates);
    setLaborList(data);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLabor?.role || !editingLabor?.dailyRate) return;
    await saveLaborRate(editingLabor as LaborRateItem);
    setEditingLabor(null);
    await loadLabor();
    showToast('Labor rate updated in Firestore!');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this labor rate record?')) {
      await deleteLaborRate(id);
      await loadLabor();
      showToast('Labor rate deleted.');
    }
  };

  return (
    <div className="space-y-6 text-xs">
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-semibold text-xs shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-400" />
            <span>Labor Rates Directory Manager</span>
          </h2>
          <p className="text-neutral-400 text-xs">Manage trade labor daily wages across cities (Mason, Carpenter, Plumber, Electrician, etc.)</p>
        </div>
        <button
          onClick={() => setEditingLabor({
            role: 'Mason',
            dailyRate: 850,
            experienceYears: 5,
            availability: 'Immediate',
            city: 'Kolkata',
            contactInfo: '+91 98300 00000',
            skills: ['Civil Work'],
            rating: 4.8
          })}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center space-x-1.5 cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Labor Rate</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {laborList.map(item => (
          <div key={item.id} className="p-4 rounded-2xl bg-neutral-900/60 border border-white/10 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-white font-bold text-sm">{item.role}</div>
                  <div className="text-neutral-400 text-[11px]">{item.city} • {item.experienceYears} Years Exp</div>
                </div>
                <div className="text-emerald-400 font-extrabold text-base">₹{item.dailyRate} / Day</div>
              </div>

              <div className="mt-2 text-neutral-300 text-[11px] space-y-1">
                <div>Skills: <span className="text-neutral-400">{item.skills.join(', ')}</span></div>
                <div>Contact: <span className="text-blue-400">{item.contactInfo}</span></div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-white/5">
              <button
                onClick={() => setEditingLabor(item)}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="px-3 py-1.5 rounded-lg bg-red-950/60 text-red-400 hover:bg-red-900/60 border border-red-500/20 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {editingLabor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingLabor.id ? 'Edit Labor Rate' : 'Add Labor Rate Record'}
              </h3>
              <button onClick={() => setEditingLabor(null)} className="p-1 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Labor Trade Role *</label>
                  <select
                    value={editingLabor.role || 'Mason'}
                    onChange={e => setEditingLabor({ ...editingLabor, role: e.target.value as LaborRoleType })}
                    className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                  >
                    {['Mason', 'Carpenter', 'Electrician', 'Painter', 'Plumber', 'Welder', 'POP Worker', 'Tile Installer', 'Steel Fixer', 'Glass Installer', 'False Ceiling Worker'].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">City Location *</label>
                  <input
                    type="text"
                    required
                    value={editingLabor.city || ''}
                    onChange={e => setEditingLabor({ ...editingLabor, city: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Daily Wage Rate (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingLabor.dailyRate || 800}
                    onChange={e => setEditingLabor({ ...editingLabor, dailyRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={editingLabor.experienceYears || 5}
                    onChange={e => setEditingLabor({ ...editingLabor, experienceYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Contact Phone / Info</label>
                <input
                  type="text"
                  value={editingLabor.contactInfo || ''}
                  onChange={e => setEditingLabor({ ...editingLabor, contactInfo: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingLabor(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Labor Rate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
