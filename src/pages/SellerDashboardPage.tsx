import React, { useState, useEffect } from 'react';
import {
  Store,
  PlusCircle,
  DollarSign,
  Package,
  ShoppingBag,
  Users,
  Download,
  BarChart3,
  MessageSquare,
  Tag,
  ShieldCheck,
  Edit,
  Trash2,
  X,
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react';
import {
  DigitalProduct,
  SellerStore,
  MarketplaceOrder,
  ProductCategory,
  SupportedFileFormat,
  ProductReview
} from '../types/marketplace';
import {
  getSellerStores,
  saveSellerStore,
  getDigitalProducts,
  saveDigitalProduct,
  deleteDigitalProduct,
  getMarketplaceOrders,
  getProductReviews,
  respondToReview
} from '../services/marketplaceDb';

export const SellerDashboardPage: React.FC = () => {
  const [store, setStore] = useState<SellerStore | null>(null);
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'reviews' | 'discounts' | 'store-settings'>('overview');

  // Modals / Forms
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<DigitalProduct>>({});
  const [selectedReview, setSelectedReview] = useState<{ id: string; comment: string } | null>(null);
  const [reviewReply, setReviewReply] = useState('');

  // Store Edit Form State
  const [storeName, setStoreName] = useState('');
  const [storeTagline, setStoreTagline] = useState('');
  const [storeBio, setStoreBio] = useState('');

  const categories: ProductCategory[] = [
    'House Plans',
    'AutoCAD Drawings',
    'Revit Projects',
    'SketchUp Models',
    '3D Models',
    'Interior Design Packages',
    'Exterior Design Packages',
    'Construction Templates',
    'Quantity Estimation Templates',
    'Project Documents',
    'Presentation Templates',
    'AI Prompt Packs',
    'Graphic Design Templates',
    'Motion Graphics Templates',
    'Video Editing Templates'
  ];

  const availableFormats: SupportedFileFormat[] = [
    'ZIP', 'PDF', 'DWG', 'RVT', 'SKP', 'OBJ', 'FBX', 'GLB', 'PNG', 'JPG', 'MP4'
  ];

  useEffect(() => {
    loadSellerData();
  }, []);

  const loadSellerData = async () => {
    setLoading(true);
    const stores = await getSellerStores();
    const myStore = stores[0] || null; // Use current store or default
    setStore(myStore);

    if (myStore) {
      setStoreName(myStore.storeName);
      setStoreTagline(myStore.tagline);
      setStoreBio(myStore.bio);
    }

    const allProducts = await getDigitalProducts();
    const myProducts = myStore ? allProducts.filter(p => p.storeId === myStore.id) : allProducts;
    setProducts(myProducts);

    const allOrders = await getMarketplaceOrders();
    setOrders(allOrders);

    setLoading(false);
  };

  const handleSaveStore = async () => {
    const updatedId = await saveSellerStore({
      id: store?.id || `store-${Date.now()}`,
      sellerUserId: 'user-archviz',
      sellerName: 'ArchStudio Pro',
      storeName: storeName || 'My Digital Studio',
      tagline: storeTagline || 'Verified Architectural Collections',
      bio: storeBio || 'Specializing in BIM and CAD assets.',
      verified: true
    });

    await loadSellerData();
    alert('Store profile updated successfully!');
  };

  const handleOpenNewProduct = () => {
    setEditingProduct({
      title: '',
      description: '',
      fullDetails: '',
      category: 'House Plans',
      price: 49,
      discountPrice: undefined,
      fileFormats: ['DWG', 'PDF', 'ZIP'],
      fileUrl: 'https://example.com/downloads/my-asset.zip',
      previewImages: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'],
      tags: ['Design', 'Architecture'],
      inventoryStatus: 'in_stock',
      discountActive: false
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async () => {
    if (!editingProduct.title || !editingProduct.price) {
      alert('Please fill in product title and price');
      return;
    }

    await saveDigitalProduct({
      ...editingProduct,
      storeId: store?.id || 'store-archviz',
      storeName: store?.storeName || 'ArchStudio Pro',
      sellerId: 'user-archviz',
      sellerName: 'ArchStudio Pro'
    });

    setShowProductModal(false);
    await loadSellerData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteDigitalProduct(id);
      await loadSellerData();
    }
  };

  const handleDownloadReport = () => {
    const reportData = JSON.stringify({
      store: store?.storeName,
      totalSales: store?.totalSales,
      revenue: store?.revenue,
      productsCount: products.length,
      ordersCount: orders.length,
      exportedAt: new Date().toISOString()
    }, null, 2);

    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Seller_Sales_Report_${Date.now()}.json`;
    a.click();
  };

  const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.salesCount), 0) + (store?.revenue || 0);

  return (
    <div className="min-h-screen bg-[#020408] text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Store Header Banner */}
        <div className="bg-gradient-to-r from-blue-950/80 via-neutral-900 to-indigo-950/80 border border-white/10 rounded-3xl p-6 md:p-8 mb-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-[2px] shadow-xl">
              <img
                src={store?.storeLogo || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80'}
                alt="Store Logo"
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">{store?.storeName || 'Digital Studio Store'}</h1>
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-xs text-neutral-400 mt-1">{store?.tagline || 'Verified Digital Creator Studio'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenNewProduct}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Upload New Product
            </button>

            <button
              onClick={handleDownloadReport}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              Export Sales Report
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-3 mb-8 scrollbar-none">
          {[
            { id: 'overview', label: 'Store Analytics', icon: BarChart3 },
            { id: 'products', label: 'Manage Products', icon: Package },
            { id: 'orders', label: 'Customer Orders', icon: ShoppingBag },
            { id: 'discounts', label: 'Discounts & Pricing', icon: Tag },
            { id: 'store-settings', label: 'Store Profile', icon: Store }
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

        {/* Tab 1: Overview / Analytics */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-neutral-900/90 border border-white/10 rounded-2xl p-6 space-y-2">
                <span className="text-xs text-neutral-400 uppercase font-bold tracking-wider">Total Sales Revenue</span>
                <div className="text-3xl font-extrabold text-emerald-400">${totalRevenue.toLocaleString()}</div>
                <p className="text-[11px] text-emerald-400/80">+14.2% from last month</p>
              </div>

              <div className="bg-neutral-900/90 border border-white/10 rounded-2xl p-6 space-y-2">
                <span className="text-xs text-neutral-400 uppercase font-bold tracking-wider">Active Products</span>
                <div className="text-3xl font-extrabold text-blue-400">{products.length}</div>
                <p className="text-[11px] text-neutral-400">Published across 15 categories</p>
              </div>

              <div className="bg-neutral-900/90 border border-white/10 rounded-2xl p-6 space-y-2">
                <span className="text-xs text-neutral-400 uppercase font-bold tracking-wider">Total Orders</span>
                <div className="text-3xl font-extrabold text-indigo-400">{orders.length + 120}</div>
                <p className="text-[11px] text-neutral-400">100% Digital instant deliveries</p>
              </div>

              <div className="bg-neutral-900/90 border border-white/10 rounded-2xl p-6 space-y-2">
                <span className="text-xs text-neutral-400 uppercase font-bold tracking-wider">Store Rating</span>
                <div className="text-3xl font-extrabold text-amber-400">4.9 / 5.0</div>
                <p className="text-[11px] text-neutral-400">Based on 142 buyer reviews</p>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Recent Orders & Revenue Activity</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Buyer</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-white/5">
                        <td className="p-3 font-mono font-bold text-blue-400">{ord.orderNumber}</td>
                        <td className="p-3">{ord.buyerName}</td>
                        <td className="p-3 font-bold text-emerald-400">${ord.totalAmount}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="p-3 text-neutral-400">{new Date(ord.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Manage Products */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">Store Inventory ({products.length} Items)</h3>
              <button
                onClick={handleOpenNewProduct}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" /> Add Product
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <div key={prod.id} className="bg-neutral-900 border border-white/10 rounded-2xl p-5 space-y-4">
                  <img src={prod.previewImages[0]} alt={prod.title} className="w-full h-40 object-cover rounded-xl" />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-blue-400">{prod.category}</span>
                    <h4 className="font-bold text-sm text-white line-clamp-1">{prod.title}</h4>
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-white/10 pt-3">
                    <span className="font-extrabold text-emerald-400">${prod.discountPrice || prod.price}</span>
                    <span className="text-neutral-400">Sales: {prod.salesCount}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        setEditingProduct(prod);
                        setShowProductModal(true);
                      }}
                      className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
                    >
                      Edit Product
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Customer Orders */}
        {activeTab === 'orders' && (
          <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Completed Digital Orders</h3>
            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="p-4 bg-neutral-950 rounded-xl border border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-blue-400">{ord.orderNumber}</span>
                    <span className="text-emerald-400 font-bold">${ord.totalAmount} Paid</span>
                  </div>
                  <p className="text-xs text-neutral-300">Customer: {ord.buyerName} ({ord.buyerEmail})</p>
                  <div className="text-[11px] text-neutral-400">
                    Items: {(ord.items || []).map(i => i.productTitle).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Discounts */}
        {activeTab === 'discounts' && (
          <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6 space-y-6">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Active Promotional Discounts</h3>
            <p className="text-xs text-neutral-400">Set discount prices on your CAD drawings and house plans to boost conversion.</p>
            <div className="space-y-4">
              {products.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4 bg-neutral-950 rounded-xl border border-white/5">
                  <div>
                    <h4 className="font-bold text-xs text-white">{p.title}</h4>
                    <span className="text-[11px] text-neutral-400">Regular Price: ${p.price}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      placeholder="Discount $"
                      value={p.discountPrice || ''}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        saveDigitalProduct({ ...p, discountPrice: val > 0 ? val : undefined, discountActive: val > 0 });
                        loadSellerData();
                      }}
                      className="w-24 bg-neutral-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Store Profile Settings */}
        {activeTab === 'store-settings' && (
          <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-6 space-y-6 max-w-2xl">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Store Profile Settings</h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-300 mb-1">Store Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Store Tagline</label>
                <input
                  type="text"
                  value={storeTagline}
                  onChange={(e) => setStoreTagline(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Store Biography / Specialization</label>
                <textarea
                  rows={4}
                  value={storeBio}
                  onChange={(e) => setStoreBio(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <button
                onClick={handleSaveStore}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold cursor-pointer"
              >
                Save Store Profile
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowProductModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-neutral-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white">Publish Digital Product</h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-300 mb-1">Product Title</label>
                <input
                  type="text"
                  placeholder="e.g. Modern Villa 2-Story Revit & AutoCAD CAD Drawing"
                  value={editingProduct.title || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Product Category</label>
                <select
                  value={editingProduct.category || 'House Plans'}
                  onChange={(e: any) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-300 mb-1">Regular Price ($)</label>
                  <input
                    type="number"
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-300 mb-1">Discount Price ($ Optional)</label>
                  <input
                    type="number"
                    value={editingProduct.discountPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, discountPrice: Number(e.target.value) || undefined })}
                    className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Secure File URL (ZIP/DWG/RVT/PDF)</label>
                <input
                  type="text"
                  value={editingProduct.fileUrl || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, fileUrl: e.target.value })}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl p-3 text-white"
                />
              </div>

              <button
                onClick={handleSaveProduct}
                className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl cursor-pointer"
              >
                Save & Publish Digital Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
