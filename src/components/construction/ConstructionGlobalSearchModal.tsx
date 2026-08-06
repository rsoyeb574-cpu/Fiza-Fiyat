import React, { useState, useEffect } from 'react';
import { Search, X, Filter, Building, DollarSign, MapPin, Tag, ArrowRight, ShieldCheck } from 'lucide-react';
import { MaterialItem, LaborRateItem, HousePlanItem, FAQItem } from '../../types/constructionDatabase';
import { getMaterials, getLaborRates, getHousePlans, getFAQs } from '../../services/constructionDb';
import { initialMaterials, initialLaborRates, initialHousePlans, initialFAQs } from '../../services/constructionDbSeedData';

interface ConstructionGlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult?: (type: string, item: any) => void;
}

export const ConstructionGlobalSearchModal: React.FC<ConstructionGlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [qualityGradeFilter, setQualityGradeFilter] = useState('All');

  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [laborRates, setLaborRates] = useState<LaborRateItem[]>([]);
  const [housePlans, setHousePlans] = useState<HousePlanItem[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      getMaterials(initialMaterials).then(setMaterials);
      getLaborRates(initialLaborRates).then(setLaborRates);
      getHousePlans(initialHousePlans).then(setHousePlans);
      getFAQs(initialFAQs).then(setFaqs);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || m.categoryName.includes(selectedCategory);
    const matchesQuality = qualityGradeFilter === 'All' || m.qualityGrade === qualityGradeFilter;
    const matchesPrice = m.price <= maxPrice;
    return matchesSearch && matchesCat && matchesQuality && matchesPrice;
  });

  const filteredLabor = laborRates.filter(l => {
    const matchesSearch = l.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCity = selectedCity === 'All' || l.city.toLowerCase() === selectedCity.toLowerCase();
    return matchesSearch && matchesCity;
  });

  const filteredPlans = housePlans.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.style.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div 
        className="w-full max-w-4xl bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Construction Global Database Search</h2>
              <p className="text-neutral-400 text-xs">Filter materials, labor rates, house plans & engineering tips in real-time</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search cement, steel rebars, masons in Kolkata, 20x20 villa plans..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-neutral-950 border border-white/10 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-neutral-950/60 p-3 rounded-2xl border border-white/5">
          <div>
            <label className="text-neutral-400 block mb-1 font-medium">City Location</label>
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none"
            >
              <option value="All">All Cities</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Bangalore">Bangalore</option>
            </select>
          </div>

          <div>
            <label className="text-neutral-400 block mb-1 font-medium">Category</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Structural">Structural & Masonry</option>
              <option value="Finishes">Tiles & Finishes</option>
              <option value="Paints">Paints & Coatings</option>
            </select>
          </div>

          <div>
            <label className="text-neutral-400 block mb-1 font-medium">Quality Grade</label>
            <select
              value={qualityGradeFilter}
              onChange={e => setQualityGradeFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-neutral-900 border border-white/10 rounded-xl text-white focus:outline-none"
            >
              <option value="All">All Grades</option>
              <option value="Economy">Economy</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>

          <div>
            <label className="text-neutral-400 block mb-1 font-medium">Max Price (₹{maxPrice})</label>
            <input
              type="range"
              min="50"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer mt-1"
            />
          </div>
        </div>

        {/* Search Results Display Area */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1 text-xs">
          {/* Materials Section */}
          <div className="space-y-3">
            <h3 className="text-neutral-300 font-bold flex items-center gap-2 text-sm">
              <Building className="w-4 h-4 text-blue-400" />
              <span>Verified Materials ({filteredMaterials.length})</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredMaterials.map(mat => (
                <div 
                  key={mat.id}
                  onClick={() => onSelectResult && onSelectResult('material', mat)}
                  className="p-3.5 rounded-2xl bg-neutral-950 border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer flex gap-3 items-center group"
                >
                  <img src={mat.image} alt={mat.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-white font-bold truncate group-hover:text-blue-400 transition-colors">{mat.name}</div>
                    <div className="text-neutral-400 text-[11px]">{mat.brand} • {mat.qualityGrade}</div>
                    <div className="text-blue-400 font-bold mt-1">₹{mat.price} / {mat.priceUnit}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Labor Rates Section */}
          <div className="space-y-3">
            <h3 className="text-neutral-300 font-bold flex items-center gap-2 text-sm">
              <Tag className="w-4 h-4 text-indigo-400" />
              <span>Labor Rates Directory ({filteredLabor.length})</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredLabor.map(lab => (
                <div key={lab.id} className="p-3.5 rounded-2xl bg-neutral-950 border border-white/10 flex justify-between items-center">
                  <div>
                    <div className="text-white font-bold">{lab.role} ({lab.city})</div>
                    <div className="text-neutral-400 text-[11px]">{lab.experienceYears} Years Exp • {lab.skills.join(', ')}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-bold">₹{lab.dailyRate} / Day</div>
                    <div className="text-neutral-400 text-[10px]">{lab.availability}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* House Plans Section */}
          <div className="space-y-3">
            <h3 className="text-neutral-300 font-bold flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Architectural House Plans ({filteredPlans.length})</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredPlans.map(plan => (
                <div key={plan.id} className="p-3.5 rounded-2xl bg-neutral-950 border border-white/10 flex gap-3 items-center">
                  <img src={plan.image} alt={plan.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div>
                    <div className="text-white font-bold">{plan.title}</div>
                    <div className="text-neutral-400 text-[11px]">{plan.builtUpAreaSqFt} Sq.Ft • Est: ₹{(plan.estimatedCostINR / 100000).toFixed(2)} Lakhs</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
