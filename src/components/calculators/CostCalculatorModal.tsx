import React, { useState } from 'react';
import { X, Calculator, Building, Sofa, Sparkles, Send, Check, Download } from 'lucide-react';
import { sendInquiry } from '../../services/db';

interface CostCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CostCalculatorModal: React.FC<CostCalculatorModalProps> = ({
  isOpen,
  onClose
}) => {
  const [calcType, setCalcType] = useState<'construction' | 'interior'>('construction');
  const [areaSqFt, setAreaSqFt] = useState<number>(3500);
  const [projectTier, setProjectTier] = useState<'standard' | 'luxury' | 'ultra'>('luxury');
  const [includeBIM, setIncludeBIM] = useState(true);
  const [includeAI, setIncludeAI] = useState(true);
  const [clientEmail, setClientEmail] = useState('');
  const [clientName, setClientName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Calculation parameters
  const rates = {
    construction: { standard: 180, luxury: 320, ultra: 550 },
    interior: { standard: 85, luxury: 160, ultra: 290 }
  };

  const baseRate = rates[calcType][projectTier];
  let subtotal = areaSqFt * baseRate;
  if (includeBIM) subtotal += areaSqFt * 15;
  if (includeAI) subtotal += areaSqFt * 10;

  const estimatedMin = Math.round(subtotal * 0.95);
  const estimatedMax = Math.round(subtotal * 1.15);

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientEmail || !clientName) return;
    setLoading(true);
    try {
      await sendInquiry({
        name: clientName,
        email: clientEmail,
        service: `${calcType === 'construction' ? 'Construction' : 'Interior'} Cost Calculation`,
        message: `Generated Cost Calculation Breakdown:
- Type: ${calcType.toUpperCase()}
- Area: ${areaSqFt} Sq.Ft
- Tier: ${projectTier.toUpperCase()}
- Include Revit BIM: ${includeBIM ? 'Yes' : 'No'}
- Include AI Visualization: ${includeAI ? 'Yes' : 'No'}
- Estimated Cost Range: $${estimatedMin.toLocaleString()} - $${estimatedMax.toLocaleString()} USD`,
        budget: `$${estimatedMin.toLocaleString()} - $${estimatedMax.toLocaleString()}`
      });
      setSubmitted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-neutral-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-neutral-950 via-blue-950/40 to-neutral-950 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Fiza Hayat Cost Estimator
              </h3>
              <p className="text-neutral-400 text-xs">
                Real-time construction & luxury interior budget estimator
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Type Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-neutral-950 p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setCalcType('construction')}
              className={`py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                calcType === 'construction' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Building className="w-4 h-4" />
              Building Construction
            </button>
            <button
              onClick={() => setCalcType('interior')}
              className={`py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                calcType === 'interior' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sofa className="w-4 h-4" />
              Interior Fitout
            </button>
          </div>

          {/* Area Slider */}
          <div className="space-y-2 bg-neutral-950/50 p-4 rounded-2xl border border-white/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label className="text-neutral-300 font-semibold">Total Area (Sq.Ft)</label>
              <span className="text-blue-400 font-bold text-xs sm:text-sm bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 w-fit">
                {areaSqFt.toLocaleString()} Sq.Ft ({Math.round(areaSqFt * 0.092903)} m²)
              </span>
            </div>
            <input
              type="range"
              min={500}
              max={25000}
              step={250}
              value={areaSqFt}
              onChange={(e) => setAreaSqFt(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Luxury Finish Tier */}
          <div className="space-y-2">
            <label className="text-neutral-300 font-semibold block">Quality & Finish Specification</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'standard', name: 'Standard Commercial', rate: rates[calcType].standard },
                { id: 'luxury', name: 'Premium Luxury', rate: rates[calcType].luxury },
                { id: 'ultra', name: 'Ultra High-End', rate: rates[calcType].ultra }
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setProjectTier(tier.id as any)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    projectTier === tier.id 
                      ? 'bg-blue-600/15 border-blue-500 text-white' 
                      : 'bg-neutral-950 border-white/10 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="font-semibold text-xs text-white">{tier.name}</div>
                  <div className="text-[10px] text-blue-400 mt-1">${tier.rate}/sq.ft base</div>
                </button>
              ))}
            </div>
          </div>

          {/* Add-on Services */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className={`p-3 rounded-2xl border flex items-center space-x-2 cursor-pointer transition-all ${
              includeBIM ? 'bg-blue-600/10 border-blue-500 text-white' : 'bg-neutral-950 border-white/10 text-neutral-400'
            }`}>
              <input
                type="checkbox"
                checked={includeBIM}
                onChange={(e) => setIncludeBIM(e.target.checked)}
                className="rounded accent-blue-500"
              />
              <div>
                <div className="font-semibold text-xs">Revit BIM & CAD Drafting</div>
                <div className="text-[10px] text-neutral-400">+$15/sq.ft clash detection</div>
              </div>
            </label>

            <label className={`p-3 rounded-2xl border flex items-center space-x-2 cursor-pointer transition-all ${
              includeAI ? 'bg-indigo-600/10 border-indigo-500 text-white' : 'bg-neutral-950 border-white/10 text-neutral-400'
            }`}>
              <input
                type="checkbox"
                checked={includeAI}
                onChange={(e) => setIncludeAI(e.target.checked)}
                className="rounded accent-indigo-500"
              />
              <div>
                <div className="font-semibold text-xs">AI & 8K Raytraced Renders</div>
                <div className="text-[10px] text-neutral-400">+$10/sq.ft concept package</div>
              </div>
            </label>
          </div>

          {/* Estimate Result Display */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-500/30 text-center">
            <div className="text-neutral-400 text-[11px] uppercase tracking-wider font-semibold">
              Estimated Total Investment Range
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-white my-1">
              ${estimatedMin.toLocaleString()} – ${estimatedMax.toLocaleString()} USD
            </div>
            <div className="text-[10px] text-neutral-400">
              Includes turnkey design, engineering drawings, project supervision, and material specifications.
            </div>
          </div>

          {/* Submit for Formal Quotation */}
          {submitted ? (
            <div className="p-4 rounded-2xl bg-green-950/60 border border-green-500/30 text-green-300 flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-400 shrink-0" />
              <div>
                <div className="font-bold text-xs">Quotation Request Received!</div>
                <div className="text-[11px] text-green-400/80">
                  Our principal architect will contact you at {clientEmail} within 24 hours with an itemized proposal.
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitQuote} className="space-y-3 pt-2">
              <div className="font-semibold text-neutral-200">
                Receive Itemized PDF Breakdown
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-blue-500"
                />
                <input
                  type="email"
                  required
                  placeholder="Your Corporate Email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center space-x-2 text-xs"
              >
                <span>{loading ? 'Sending Request...' : 'Send Formal Proposal Request'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
