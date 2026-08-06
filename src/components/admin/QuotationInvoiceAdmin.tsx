import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Printer, 
  Download, 
  Check, 
  X, 
  Trash2, 
  DollarSign, 
  Calculator, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';
import { Quotation, QuotationItem, Invoice } from '../../types/enterprise';
import { fetchQuotations, saveQuotation, fetchInvoices, saveInvoice } from '../../services/enterpriseDb';

export const QuotationInvoiceAdmin: React.FC = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'quotations' | 'invoices'>('quotations');

  // Quotation Creator Form State
  const [clientName, setClientName] = useState('Aarav Sharma');
  const [clientEmail, setClientEmail] = useState('aarav.sharma@example.com');
  const [projectTitle, setProjectTitle] = useState('Grand Azure Luxury Villa');
  const [items, setItems] = useState<QuotationItem[]>([
    { id: 'qi-1', description: 'Architectural Working Drawings & 3D BIM Modeling', category: 'Service', quantity: 1, unitPriceINR: 450000, totalINR: 450000 }
  ]);
  const [gstRatePercent, setGstRatePercent] = useState(18);
  const [discountINR, setDiscountINR] = useState(25000);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const q = await fetchQuotations();
    const inv = await fetchInvoices();
    setQuotations(q);
    setInvoices(inv);
  };

  const handleAddItem = () => {
    const newItem: QuotationItem = {
      id: `qi-${Date.now()}`,
      description: 'Fe500D Structural Steel Supply',
      category: 'Material',
      quantity: 10,
      unitPriceINR: 65000,
      totalINR: 650000
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const subtotal = items.reduce((sum, i) => sum + i.totalINR, 0);
  const gstAmount = (subtotal * gstRatePercent) / 100;
  const grandTotal = subtotal + gstAmount - discountINR;

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    const newQuote: Quotation = {
      id: `q-${Date.now()}`,
      quoteNumber: `FH-QT-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName,
      clientEmail,
      projectTitle,
      items,
      subtotalINR: subtotal,
      gstRatePercent,
      gstAmountINR: gstAmount,
      discountINR,
      grandTotalINR: grandTotal,
      status: 'Sent',
      validUntil: '2026-09-30',
      termsAndConditions: '30% Advance upon approval. Executed under NBC & BIS standards.',
      createdAt: new Date().toISOString().split('T')[0]
    };

    await saveQuotation(newQuote);

    // Auto-generate linked invoice draft
    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `FH-INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      quotationId: newQuote.id,
      clientName,
      clientEmail,
      projectTitle,
      totalAmountINR: grandTotal,
      advancePaidINR: 0,
      remainingBalanceINR: grandTotal,
      cgstAmountINR: gstAmount / 2,
      sgstAmountINR: gstAmount / 2,
      igstAmountINR: 0,
      paymentStatus: 'Unpaid',
      dueDate: '2026-09-15',
      createdAt: new Date().toISOString().split('T')[0]
    };

    await saveInvoice(newInv);

    setQuotations([newQuote, ...quotations]);
    setInvoices([newInv, ...invoices]);
    alert('Quotation and linked Invoice successfully generated and saved to Firebase!');
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-white/10">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>Quotations & Invoicing Engine</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">Itemized service/material estimation, GST tax calculations & PDF exports</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveSubTab('quotations')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeSubTab === 'quotations' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Quotations ({quotations.length})
          </button>
          <button
            onClick={() => setActiveSubTab('invoices')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeSubTab === 'invoices' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Invoices ({invoices.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'quotations' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QUOTATION GENERATOR FORM */}
          <form onSubmit={handleCreateQuotation} className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Create New Official Quotation</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Client Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Client Email</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={e => setClientEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Project Title</label>
              <input
                type="text"
                value={projectTitle}
                onChange={e => setProjectTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white font-bold"
              />
            </div>

            {/* LINE ITEMS */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-bold">Itemized Breakdown</span>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-2.5 py-1 rounded-xl bg-blue-600 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add Item Line
                </button>
              </div>

              {(items || []).map((item, idx) => (
                <div key={item.id} className="p-3 rounded-2xl bg-slate-950 border border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-[10px] font-bold">Line Item #{idx + 1}</span>
                    <button type="button" onClick={() => handleRemoveItem(item.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.description}
                    onChange={e => {
                      const updated = [...items];
                      updated[idx].description = e.target.value;
                      setItems(updated);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white text-[11px]"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={e => {
                        const updated = [...items];
                        updated[idx].quantity = Number(e.target.value);
                        updated[idx].totalINR = updated[idx].quantity * updated[idx].unitPriceINR;
                        setItems(updated);
                      }}
                      placeholder="Qty"
                      className="px-2 py-1 rounded-lg bg-slate-900 border border-white/10 text-white font-mono text-[11px]"
                    />
                    <input
                      type="number"
                      value={item.unitPriceINR}
                      onChange={e => {
                        const updated = [...items];
                        updated[idx].unitPriceINR = Number(e.target.value);
                        updated[idx].totalINR = updated[idx].quantity * updated[idx].unitPriceINR;
                        setItems(updated);
                      }}
                      placeholder="Unit Rate ₹"
                      className="px-2 py-1 rounded-lg bg-slate-900 border border-white/10 text-white font-mono text-[11px]"
                    />
                    <div className="px-2 py-1 rounded-lg bg-slate-900 font-mono font-bold text-emerald-400 flex items-center text-[11px]">
                      ₹{item.totalINR.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* TOTALS SUMMARY */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST (18%):</span>
                <span>+₹{gstAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Discount:</span>
                <span>-₹{discountINR.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-black text-sm border-t border-white/10 pt-2">
                <span>Grand Total:</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" /> Save & Issue Official Quotation
            </button>
          </form>

          {/* QUOTATIONS LIST */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
            <h3 className="font-bold text-sm text-white border-b border-white/10 pb-3">Existing Quotations Log</h3>
            <div className="space-y-3">
              {(quotations || []).map(q => (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-blue-400">{q.quoteNumber}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 font-bold text-[10px]">
                      {q.status}
                    </span>
                  </div>
                  <div className="text-white font-bold">{q.projectTitle}</div>
                  <div className="text-slate-400 text-[10px]">Client: {q.clientName}</div>
                  <div className="flex justify-between items-center border-t border-white/5 pt-2 text-xs">
                    <span className="text-emerald-400 font-mono font-bold">Total: ₹{q.grandTotalINR.toLocaleString()}</span>
                    <button 
                      onClick={() => window.print()}
                      className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 font-bold hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print / PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* INVOICES LIST */
        <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
          <h3 className="font-bold text-sm text-white border-b border-white/10 pb-3">Enterprise Invoices Ledger</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 border-b border-white/10 text-[10px] uppercase">
                  <th className="pb-3">Invoice No</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Project</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Balance Due</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(invoices || []).map(inv => (
                  <tr key={inv.id}>
                    <td className="py-3 font-mono font-bold text-emerald-400">{inv.invoiceNumber}</td>
                    <td className="py-3 text-white font-bold">{inv.clientName}</td>
                    <td className="py-3 text-slate-300">{inv.projectTitle}</td>
                    <td className="py-3 font-mono text-white">₹{inv.totalAmountINR.toLocaleString()}</td>
                    <td className="py-3 font-mono text-amber-400">₹{inv.remainingBalanceINR.toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        inv.paymentStatus === 'Paid' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                      }`}>
                        {inv.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
