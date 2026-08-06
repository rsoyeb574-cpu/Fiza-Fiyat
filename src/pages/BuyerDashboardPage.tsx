import React, { useState, useEffect } from 'react';
import {
  Download,
  FileText,
  Heart,
  UserCheck,
  RotateCcw,
  Star,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  X,
  AlertCircle
} from 'lucide-react';
import {
  MarketplaceOrder,
  DigitalProduct,
  SellerStore
} from '../types/marketplace';
import {
  getMarketplaceOrders,
  getDigitalProducts,
  getSellerStores,
  getWishlistProductIds,
  getFollowedSellerIds,
  requestOrderRefund,
  saveProductReview
} from '../services/marketplaceDb';

export const BuyerDashboardPage: React.FC = () => {
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [allProducts, setAllProducts] = useState<DigitalProduct[]>([]);
  const [allStores, setAllStores] = useState<SellerStore[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [followedIds, setFollowedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Tabs
  const [activeTab, setActiveTab] = useState<'downloads' | 'orders' | 'wishlist' | 'sellers'>('downloads');

  // Refund Modal State
  const [selectedRefundOrder, setSelectedRefundOrder] = useState<MarketplaceOrder | null>(null);
  const [refundReason, setRefundReason] = useState('');

  // Invoice Download Modal State
  const [viewingInvoice, setViewingInvoice] = useState<MarketplaceOrder | null>(null);

  useEffect(() => {
    loadBuyerData();
  }, []);

  const loadBuyerData = async () => {
    setLoading(true);
    const ords = await getMarketplaceOrders();
    const prods = await getDigitalProducts();
    const sts = await getSellerStores();

    setOrders(ords);
    setAllProducts(prods);
    setAllStores(sts);
    setWishlistIds(getWishlistProductIds());
    setFollowedIds(getFollowedSellerIds());
    setLoading(false);
  };

  const handleRequestRefundSubmit = async () => {
    if (!selectedRefundOrder || !refundReason.trim()) return;
    await requestOrderRefund(selectedRefundOrder.id, refundReason);
    setSelectedRefundOrder(null);
    setRefundReason('');
    await loadBuyerData();
    alert('Refund request submitted successfully. Our team will review your ticket within 24 hours.');
  };

  const handleDownloadFile = (title: string, fileUrl: string) => {
    // Simulated secure download link
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_license.zip`;
    a.click();
    alert(`Downloading verified digital file package for "${title}"...`);
  };

  const wishlistProducts = allProducts.filter(p => wishlistIds.includes(p.id));
  const followedStores = allStores.filter(s => followedIds.includes(s.id));

  // Extract all purchased items across orders
  const purchasedItems = (orders || []).flatMap(o => (o?.items || []).map(item => ({ ...item, orderDate: o.createdAt, orderId: o.id })));

  return (
    <div className="min-h-screen bg-[#020408] text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Buyer Header */}
        <div className="bg-gradient-to-r from-blue-950/80 via-neutral-900 to-teal-950/80 border border-white/10 rounded-3xl p-6 md:p-8 mb-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Digital Library
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">My Buyer Account & Download Center</h1>
            <p className="text-xs text-neutral-400 mt-1">Access purchased AutoCAD DWGs, Revit BIM models, download invoices, and manage wishlist.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-neutral-900 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-neutral-300">
              Purchases: <span className="text-emerald-400 font-extrabold">{purchasedItems.length} Files</span>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-3 mb-8 scrollbar-none">
          {[
            { id: 'downloads', label: `Download Center (${purchasedItems.length})`, icon: Download },
            { id: 'orders', label: `Order History (${orders.length})`, icon: ShoppingBag },
            { id: 'wishlist', label: `Saved Wishlist (${wishlistProducts.length})`, icon: Heart },
            { id: 'sellers', label: `Followed Sellers (${followedStores.length})`, icon: UserCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Download Center */}
        {activeTab === 'downloads' && (
          <div className="space-y-6">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Your Digital File Vault</h3>
            {purchasedItems.length === 0 ? (
              <div className="py-16 text-center bg-white/5 border border-white/10 rounded-2xl p-6">
                <Download className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
                <h4 className="font-bold text-sm text-white">No Files Purchased Yet</h4>
                <p className="text-xs text-neutral-400 mt-1">Visit the marketplace to purchase House plans, CAD drawings, or Revit BIM files.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {purchasedItems.map((item, idx) => (
                  <div key={idx} className="bg-neutral-900 border border-white/10 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                    <div className="flex gap-4">
                      <img src={item.previewImage} alt={item.productTitle} className="w-24 h-24 object-cover rounded-xl bg-neutral-950" />
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-cyan-400">{item.category}</span>
                        <h4 className="font-bold text-sm text-white line-clamp-2">{item.productTitle}</h4>
                        <p className="text-[11px] text-neutral-400">By {item.sellerName}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {(item.fileFormats || []).map((f) => (
                            <span key={f} className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[11px] text-neutral-400">Licensed Purchase</span>
                      <button
                        onClick={() => handleDownloadFile(item.productTitle, item.fileUrl)}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download File Package
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Order History & Invoices */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Order History & Payment Tracking</h3>
            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="bg-neutral-900 border border-white/10 rounded-2xl p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <span className="font-mono font-bold text-blue-400 text-sm">{ord.orderNumber}</span>
                      <span className="text-xs text-neutral-400 ml-3">{new Date(ord.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-400">${ord.totalAmount}</span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        {ord.paymentStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {(ord.items || []).map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-neutral-300">
                        <span>{it.productTitle}</span>
                        <span className="font-bold text-white">${it.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-white/5">
                    <button
                      onClick={() => setViewingInvoice(ord)}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-400" />
                      View Invoice
                    </button>

                    <button
                      onClick={() => setSelectedRefundOrder(ord)}
                      className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Request Refund
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Saved Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Your Saved Wishlist Products</h3>
            {wishlistProducts.length === 0 ? (
              <div className="py-16 text-center bg-white/5 border border-white/10 rounded-2xl p-6">
                <Heart className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
                <h4 className="font-bold text-sm text-white">Your Wishlist is Empty</h4>
                <p className="text-xs text-neutral-400 mt-1">Save CAD blocks or Revit models while browsing the marketplace.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {wishlistProducts.map((prod) => (
                  <div key={prod.id} className="bg-neutral-900 border border-white/10 rounded-2xl p-5 space-y-3">
                    <img src={prod.previewImages[0]} alt={prod.title} className="w-full h-36 object-cover rounded-xl" />
                    <h4 className="font-bold text-xs text-white line-clamp-1">{prod.title}</h4>
                    <div className="text-sm font-extrabold text-emerald-400">${prod.discountPrice || prod.price}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Followed Sellers */}
        {activeTab === 'sellers' && (
          <div className="space-y-6">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Followed Verified Seller Studios</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {followedStores.map((st) => (
                <div key={st.id} className="bg-neutral-900 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
                  <img src={st.storeLogo} alt={st.storeName} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-sm text-white">{st.storeName}</h4>
                    <p className="text-xs text-neutral-400">{st.tagline}</p>
                    <span className="text-[11px] text-blue-400 font-bold mt-1 inline-block">Rating: ★ {st.rating} ({st.reviewCount} reviews)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-6 relative">
            <button
              onClick={() => setViewingInvoice(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-neutral-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Official Digital Invoice</span>
              <h3 className="text-xl font-bold text-white mt-1">Invoice #{viewingInvoice.orderNumber}</h3>
              <p className="text-xs text-neutral-400">Date: {new Date(viewingInvoice.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-neutral-950 p-4 rounded-xl border border-white/5 space-y-2">
                <span className="font-bold text-neutral-300 block">Billed To:</span>
                <p className="text-white">{viewingInvoice.buyerName} ({viewingInvoice.buyerEmail})</p>
                <p className="text-neutral-400">Transaction ID: {viewingInvoice.transactionId}</p>
              </div>

              <div className="space-y-2 pt-2">
                {(viewingInvoice.items || []).map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-white font-medium">{it.productTitle}</span>
                    <span className="font-bold text-emerald-400">${it.price}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm font-bold text-white pt-3 border-t border-white/10">
                <span>Total Amount Paid</span>
                <span className="text-emerald-400 text-lg">${viewingInvoice.totalAmount}</span>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Print / Save Invoice PDF
            </button>
          </div>
        </div>
      )}

      {/* Refund Request Modal */}
      {selectedRefundOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-4 relative">
            <button
              onClick={() => setSelectedRefundOrder(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-neutral-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white">Request Order Refund</h3>
            <p className="text-xs text-neutral-400">Order: {selectedRefundOrder.orderNumber}</p>

            <textarea
              rows={4}
              placeholder="State the reason for refund (e.g. file corruption, missing Revit family parameters)..."
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none"
            />

            <button
              onClick={handleRequestRefundSubmit}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Submit Refund Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
