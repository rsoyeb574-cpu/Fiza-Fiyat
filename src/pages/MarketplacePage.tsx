import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Star,
  Download,
  Eye,
  Heart,
  ShoppingCart,
  CheckCircle,
  Tag,
  ShieldCheck,
  ArrowUpDown,
  Sparkles,
  X,
  FileCode,
  Layers,
  Box,
  Video,
  FileText,
  SlidersHorizontal,
  Check,
  AlertCircle
} from 'lucide-react';
import {
  DigitalProduct,
  ProductCategory,
  SupportedFileFormat,
  SellerStore,
  ProductReview
} from '../types/marketplace';
import {
  getDigitalProducts,
  getSellerStores,
  createMarketplaceOrder,
  getWishlistProductIds,
  toggleWishlistProductId,
  getProductReviews,
  saveProductReview
} from '../services/marketplaceDb';

interface MarketplacePageProps {
  onNavigateToSeller: () => void;
  onNavigateToBuyer: () => void;
}

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  onNavigateToSeller,
  onNavigateToBuyer
}) => {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [stores, setStores] = useState<SellerStore[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFormat, setSelectedFormat] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'>('featured');
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const [productReviews, setProductReviews] = useState<ProductReview[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState<string | null>(null);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const categories: (ProductCategory | 'All')[] = [
    'All',
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

  const fileFormats: (SupportedFileFormat | 'All')[] = [
    'All', 'ZIP', 'PDF', 'DWG', 'RVT', 'SKP', 'OBJ', 'FBX', 'GLB', 'PNG', 'JPG', 'MP4'
  ];

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  const loadMarketplaceData = async () => {
    setLoading(true);
    const prods = await getDigitalProducts();
    const sts = await getSellerStores();
    setProducts(prods);
    setStores(sts);
    setWishlistIds(getWishlistProductIds());
    setLoading(false);
  };

  const handleToggleWishlist = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = toggleWishlistProductId(id);
    setWishlistIds(updated);
  };

  const handleToggleCompare = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter(i => i !== id));
    } else {
      if (compareIds.length >= 4) {
        alert('You can compare a maximum of 4 products at a time.');
        return;
      }
      setCompareIds([...compareIds, id]);
    }
  };

  const handleOpenProduct = async (product: DigitalProduct) => {
    setSelectedProduct(product);
    const reviews = await getProductReviews(product.id);
    setProductReviews(reviews);
  };

  const handleBuyProduct = async (product: DigitalProduct) => {
    const finalPrice = product.discountPrice || product.price;
    const order = await createMarketplaceOrder({
      buyerUserId: 'buyer-demo',
      buyerName: 'Alex Mercer',
      buyerEmail: 'alex.mercer@example.com',
      items: [
        {
          productId: product.id,
          productTitle: product.title,
          category: product.category,
          price: finalPrice,
          fileUrl: product.fileUrl,
          fileFormats: product.fileFormats,
          sellerId: product.sellerId,
          sellerName: product.sellerName,
          previewImage: product.previewImages[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
        }
      ],
      totalAmount: finalPrice
    });

    setShowCheckoutSuccess(product.title);
    setTimeout(() => {
      setShowCheckoutSuccess(null);
    }, 4000);
  };

  const handleAddReview = async () => {
    if (!selectedProduct || !newComment.trim()) return;
    await saveProductReview({
      productId: selectedProduct.id,
      buyerUserId: 'buyer-demo',
      buyerName: 'Alex Mercer',
      rating: newRating,
      comment: newComment
    });
    setNewComment('');
    const updated = await getProductReviews(selectedProduct.id);
    setProductReviews(updated);
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesFormat = selectedFormat === 'All' || p.fileFormats.includes(selectedFormat as SupportedFileFormat);
    return matchesSearch && matchesCategory && matchesFormat;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return (a.discountPrice || a.price) - (b.discountPrice || b.price);
    if (sortBy === 'price-high') return (b.discountPrice || b.price) - (a.discountPrice || a.price);
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  return (
    <div className="min-h-screen bg-[#020408] text-white pt-24 pb-20">
      
      {/* Toast Notification */}
      {showCheckoutSuccess && (
        <div className="fixed top-24 right-6 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 rounded-2xl shadow-2xl border border-emerald-400/30 flex items-center gap-4 animate-bounce">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
            ✓
          </div>
          <div>
            <h4 className="font-bold text-sm">Purchase Complete!</h4>
            <p className="text-xs text-emerald-100 font-medium">"{showCheckoutSuccess}" added to your Buyer Library.</p>
          </div>
          <button
            onClick={onNavigateToBuyer}
            className="ml-3 px-3 py-1.5 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-all cursor-pointer"
          >
            Go to Library
          </button>
        </div>
      )}

      {/* Hero Banner Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-blue-950/60 via-slate-900/80 to-indigo-950/60 p-8 md:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Architectural & Engineering Marketplace
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Digital Assets for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300">Design Professionals</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mb-8 leading-relaxed">
              Explore thousands of verified House Plans, AutoCAD DWGs, Revit BIM Families, SketchUp 3D Models, Quantity Surveying Excel BOQs, and AI Prompt Packs from licensed architects and engineers.
            </p>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onNavigateToSeller}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center gap-2"
              >
                <Tag className="w-4 h-4" />
                Become a Seller / Open Store
              </button>

              <button
                onClick={onNavigateToBuyer}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                My Purchased Downloads
              </button>

              {compareIds.length > 0 && (
                <button
                  onClick={() => setShowCompareModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  Compare Products ({compareIds.length})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter & Search Control Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 space-y-4">
          
          {/* Search bar & Sort dropdown */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search House plans, DWG blocks, Revit RVT, SketchUp, BOQ templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-neutral-900/90 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-neutral-900/90 border border-white/10 px-3 py-2.5 rounded-xl text-xs">
                <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                <span className="text-neutral-400">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-transparent text-white focus:outline-none cursor-pointer"
                >
                  <option value="featured" className="bg-neutral-900">Featured</option>
                  <option value="newest" className="bg-neutral-900">Newest First</option>
                  <option value="rating" className="bg-neutral-900">Highest Rated</option>
                  <option value="price-low" className="bg-neutral-900">Price: Low to High</option>
                  <option value="price-high" className="bg-neutral-900">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Chips Scrollable Bar */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">Product Category</span>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-500'
                      : 'bg-neutral-900/80 text-neutral-300 hover:bg-neutral-800 border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* File Format Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 scrollbar-none border-t border-white/5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 whitespace-nowrap">File Format:</span>
            {fileFormats.map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={`px-3 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                  selectedFormat === fmt
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-white/5 text-neutral-400 hover:text-white border border-white/10'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Digital Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-20 text-center text-neutral-400">
            <div className="inline-block w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Loading Verified Marketplace Digital Assets...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white/5 border border-white/10 rounded-3xl p-8">
            <AlertCircle className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Digital Products Found</h3>
            <p className="text-xs text-neutral-400 mb-4">Try clearing your category or format filters or search terms.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSelectedFormat('All'); setSearchQuery(''); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const isWishlisted = wishlistIds.includes(product.id);
              const isComparing = compareIds.includes(product.id);
              const displayPrice = product.discountPrice || product.price;

              return (
                <div
                  key={product.id}
                  onClick={() => handleOpenProduct(product)}
                  className="group bg-neutral-900/80 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col cursor-pointer relative"
                >
                  {/* Image Cover */}
                  <div className="relative h-52 overflow-hidden bg-neutral-950">
                    <img
                      src={product.previewImages[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80"></div>

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md bg-neutral-950/80 backdrop-blur-md border border-white/10 text-xs font-bold text-blue-300">
                        {product.category}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleToggleWishlist(product.id, e)}
                          className={`p-2 rounded-xl backdrop-blur-md border border-white/10 transition-all ${
                            isWishlisted ? 'bg-red-500 text-white' : 'bg-neutral-900/80 text-neutral-300 hover:text-white'
                          }`}
                          title="Save to Wishlist"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
                        </button>

                        <button
                          onClick={(e) => handleToggleCompare(product.id, e)}
                          className={`p-2 rounded-xl backdrop-blur-md border border-white/10 transition-all ${
                            isComparing ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-neutral-900/80 text-neutral-300 hover:text-white'
                          }`}
                          title="Compare Product"
                        >
                          <ArrowUpDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Format Badges at bottom of image */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1">
                      {(product.fileFormats || []).map((fmt) => (
                        <span key={fmt} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Seller Tag */}
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={product.sellerAvatar}
                          alt={product.sellerName}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="text-xs font-medium text-neutral-300 flex items-center gap-1">
                          {product.sellerName}
                          {product.storeVerified && <ShieldCheck className="w-3.5 h-3.5 text-blue-400 inline" />}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                        {product.title}
                      </h3>

                      <p className="text-xs text-neutral-400 mt-2 line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    {/* Footer Row */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-white">{product.rating}</span>
                        <span className="text-[10px] text-neutral-400">({product.reviewCount})</span>
                      </div>

                      <div className="text-right">
                        {product.discountPrice ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-neutral-500 line-through">${product.price}</span>
                            <span className="text-sm font-extrabold text-emerald-400">${product.discountPrice}</span>
                          </div>
                        ) : (
                          <span className="text-sm font-extrabold text-white">${product.price}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 relative shadow-2xl">
            
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-neutral-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header / Badges */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                  {selectedProduct.category}
                </span>
                {(selectedProduct.fileFormats || []).map((fmt) => (
                  <span key={fmt} className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30">
                    {fmt}
                  </span>
                ))}
              </div>
              <h2 className="text-2xl font-bold text-white">{selectedProduct.title}</h2>
              <p className="text-xs text-neutral-400">Published by {selectedProduct.sellerName} • Size: {selectedProduct.fileSize || 'Standard'}</p>
            </div>

            {/* Preview Image / Video */}
            <div className="rounded-2xl overflow-hidden bg-neutral-950 border border-white/10">
              {selectedProduct.previewVideoUrl ? (
                <video src={selectedProduct.previewVideoUrl} controls className="w-full max-h-96 object-cover" />
              ) : (
                <img src={selectedProduct.previewImages?.[0] || ''} alt={selectedProduct.title} className="w-full max-h-96 object-cover" />
              )}
            </div>

            {/* Details & Specs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10">
              <div className="md:col-span-2 space-y-4">
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">Product Overview</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">{selectedProduct.description}</p>
                {selectedProduct.fullDetails && (
                  <div className="bg-white/5 p-4 rounded-xl text-xs text-neutral-300 space-y-2">
                    <h4 className="font-bold text-white">Full File Specifications:</h4>
                    <p className="whitespace-pre-line">{selectedProduct.fullDetails}</p>
                  </div>
                )}

                {/* Reviews Section */}
                <div className="pt-4 space-y-4">
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider">Verified Buyer Reviews ({(productReviews || []).length})</h3>
                  <div className="space-y-3">
                    {(productReviews || []).map((rev) => (
                      <div key={rev.id} className="p-3 bg-neutral-950 rounded-xl border border-white/5 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-neutral-200">{rev.buyerName}</span>
                          <div className="flex items-center gap-1 text-amber-400">
                            {'★'.repeat(rev.rating)}
                          </div>
                        </div>
                        <p className="text-neutral-400">{rev.comment}</p>
                        {rev.sellerResponse && (
                          <div className="mt-2 p-2 bg-blue-950/40 border border-blue-500/20 rounded-lg text-blue-200">
                            <span className="font-bold text-[10px] uppercase text-blue-400">Seller Response:</span>
                            <p>{rev.sellerResponse.comment}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add Review Form */}
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
                    <h4 className="font-bold text-xs text-white">Write a Review</h4>
                    <div className="flex items-center gap-2 text-xs text-neutral-300">
                      <span>Rating:</span>
                      <select
                        value={newRating}
                        onChange={(e) => setNewRating(Number(e.target.value))}
                        className="bg-neutral-900 border border-white/10 px-2 py-1 rounded text-white"
                      >
                        <option value={5}>5 Stars (Excellent)</option>
                        <option value={4}>4 Stars (Good)</option>
                        <option value={3}>3 Stars (Average)</option>
                        <option value={2}>2 Stars (Fair)</option>
                        <option value={1}>1 Star (Poor)</option>
                      </select>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Share your feedback on file quality, CAD accuracy, or Revit structure..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none"
                    />
                    <button
                      onClick={handleAddReview}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Submit Review
                    </button>
                  </div>
                </div>
              </div>

              {/* Price & Instant Buy Card */}
              <div className="bg-neutral-950 border border-white/10 p-6 rounded-2xl h-fit space-y-4">
                <div>
                  <span className="text-xs text-neutral-400 block mb-1">Instant Digital License</span>
                  <div className="text-3xl font-extrabold text-white">
                    ${selectedProduct.discountPrice || selectedProduct.price}
                  </div>
                </div>

                <ul className="text-xs text-neutral-300 space-y-2">
                  <li className="flex items-center gap-2">✓ Unlimited Commercial Use</li>
                  <li className="flex items-center gap-2">✓ Instant High-Speed ZIP Download</li>
                  <li className="flex items-center gap-2">✓ Free Lifetime Future Updates</li>
                </ul>

                <button
                  onClick={() => {
                    handleBuyProduct(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Instant Download & Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl max-w-5xl w-full p-6 space-y-6 relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ArrowUpDown className="w-5 h-5 text-amber-400" />
                Product Comparison Matrix ({compareIds.length} Products)
              </h3>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-2 rounded-full bg-white/10 text-neutral-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto">
              {compareIds.map((id) => {
                const item = products.find(p => p.id === id);
                if (!item) return null;
                return (
                  <div key={id} className="bg-neutral-950 border border-white/10 rounded-2xl p-4 space-y-3">
                    <img src={item.previewImages[0]} alt={item.title} className="w-full h-32 object-cover rounded-xl" />
                    <h4 className="font-bold text-xs text-white line-clamp-2">{item.title}</h4>
                    <p className="text-[11px] text-blue-400 font-semibold">{item.category}</p>
                    <div className="text-base font-extrabold text-emerald-400">${item.discountPrice || item.price}</div>
                    <div className="text-[10px] font-mono text-cyan-300 bg-cyan-950/50 p-2 rounded">
                      Formats: {item.fileFormats.join(', ')}
                    </div>
                    <button
                      onClick={() => handleBuyProduct(item)}
                      className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                    >
                      Buy Now
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
