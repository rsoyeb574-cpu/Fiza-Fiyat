import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Save, X, Building, Check } from 'lucide-react';
import { MaterialItem } from '../../types/constructionDatabase';
import { getMaterials, saveMaterial, deleteMaterial } from '../../services/constructionDb';
import { initialMaterials } from '../../services/constructionDbSeedData';

export const ConstructionMaterialsAdmin: React.FC = () => {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [editingMaterial, setEditingMaterial] = useState<Partial<MaterialItem> | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    const data = await getMaterials(initialMaterials);
    setMaterials(data);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMaterial?.name || !editingMaterial?.price) return;
    await saveMaterial(editingMaterial as MaterialItem);
    setEditingMaterial(null);
    await loadMaterials();
    showToast('Material saved to Firestore!');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this material item from database?')) {
      await deleteMaterial(id);
      await loadMaterials();
      showToast('Material deleted.');
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
            <Building className="w-5 h-5 text-blue-400" />
            <span>Materials Database Manager</span>
          </h2>
          <p className="text-neutral-400 text-xs">Manage material prices, brands, specifications, and suppliers in real-time</p>
        </div>
        <button
          onClick={() => setEditingMaterial({
            name: '',
            categoryId: 'mcat-structural',
            categoryName: 'Structural & Masonry',
            brand: 'UltraTech / Tata',
            image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
            description: '',
            purpose: '',
            advantages: ['High Durability'],
            disadvantages: ['Requires proper storage'],
            lifeExpectancy: '80+ Years',
            maintenance: 'Keep dry',
            price: 500,
            priceUnit: 'Bag (50kg)',
            availableSizes: ['50kg'],
            strength: 'Standard Grade',
            qualityGrade: 'Standard',
            recommendedUsage: 'Residential Construction',
            supplier: 'Authorized Distributor',
            country: 'India',
            warranty: 'Manufacturer Guarantee',
            alternativeMaterials: [],
            relatedMaterials: [],
            installationMethod: 'Standard civil procedure'
          })}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center space-x-1.5 cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Material</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {materials.map(mat => (
          <div key={mat.id} className="p-4 rounded-2xl bg-neutral-900/60 border border-white/10 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <img src={mat.image} alt={mat.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                <div className="min-w-0">
                  <div className="text-white font-bold truncate">{mat.name}</div>
                  <div className="text-neutral-400 text-[11px]">{mat.brand} • Grade: {mat.qualityGrade}</div>
                  <div className="text-emerald-400 font-extrabold text-sm mt-0.5">₹{mat.price} / {mat.priceUnit}</div>
                </div>
              </div>
              <p className="text-neutral-300 line-clamp-2 text-[11px] bg-neutral-950/60 p-2 rounded-xl border border-white/5">{mat.description}</p>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-white/5">
              <button
                onClick={() => setEditingMaterial(mat)}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => handleDelete(mat.id)}
                className="px-3 py-1.5 rounded-lg bg-red-950/60 text-red-400 hover:bg-red-900/60 border border-red-500/20 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {editingMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
          <div className="w-full max-w-3xl bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingMaterial.id ? 'Edit Material Item' : 'Create Material Entry'}
              </h3>
              <button onClick={() => setEditingMaterial(null)} className="p-1 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Material Name *</label>
                  <input
                    type="text"
                    required
                    value={editingMaterial.name || ''}
                    onChange={e => setEditingMaterial({ ...editingMaterial, name: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={editingMaterial.brand || ''}
                    onChange={e => setEditingMaterial({ ...editingMaterial, brand: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingMaterial.price || 0}
                    onChange={e => setEditingMaterial({ ...editingMaterial, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Price Unit *</label>
                  <input
                    type="text"
                    required
                    value={editingMaterial.priceUnit || 'Bag (50kg)'}
                    onChange={e => setEditingMaterial({ ...editingMaterial, priceUnit: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Quality Grade</label>
                  <select
                    value={editingMaterial.qualityGrade || 'Standard'}
                    onChange={e => setEditingMaterial({ ...editingMaterial, qualityGrade: e.target.value as any })}
                    className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                  >
                    <option value="Economy">Economy</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingMaterial.image || ''}
                  onChange={e => setEditingMaterial({ ...editingMaterial, image: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingMaterial.description || ''}
                  onChange={e => setEditingMaterial({ ...editingMaterial, description: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-950 rounded-xl border border-white/10 text-white"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingMaterial(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
