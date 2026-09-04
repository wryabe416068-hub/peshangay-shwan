import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  Heart, 
  MessageCircle, 
  Check, 
  ShieldCheck, 
  Truck, 
  Star, 
  Share2, 
  Copy,
  Sparkles,
  User,
  MessageSquare,
  ThumbsUp,
  Plus
} from 'lucide-react';
import { Product, ProductReview, ShopSettings } from '../types';
import { initialReviews } from '../data/initialData';
import { formatPrice, generateSingleProductWhatsAppUrl } from '../utils/helpers';

interface ProductModalProps {
  product: Product | null;
  currency: 'IQD' | 'USD';
  settings: ShopSettings;
  isWishlisted: boolean;
  onClose: () => void;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  currency,
  settings,
  isWishlisted,
  onClose,
  onToggleWishlist,
  onAddToCart,
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  // Customer Reviews State
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [showAddReview, setShowAddReview] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewCity, setReviewCity] = useState('هەولێر');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('peshangay_shwan_reviews');
      const allReviews: ProductReview[] = stored ? JSON.parse(stored) : initialReviews;
      const productReviews = allReviews.filter(r => r.productId === product.id);
      setReviews(productReviews);
    } catch (e) {
      setReviews(initialReviews.filter(r => r.productId === product.id));
    }
  }, [product.id]);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      customerName: reviewName.trim(),
      cityKu: reviewCity,
      rating: reviewRating,
      commentKu: reviewComment.trim(),
      createdAt: 'کەمێک لەمەوبەر',
      isVerifiedPurchase: true,
    };

    try {
      const stored = localStorage.getItem('peshangay_shwan_reviews');
      const allReviews: ProductReview[] = stored ? JSON.parse(stored) : initialReviews;
      const updated = [newRev, ...allReviews];
      localStorage.setItem('peshangay_shwan_reviews', JSON.stringify(updated));
      setReviews(prev => [newRev, ...prev]);
    } catch (e) {
      setReviews(prev => [newRev, ...prev]);
    }

    setReviewSuccess(true);
    setReviewName('');
    setReviewComment('');
    setReviewRating(5);
    setTimeout(() => {
      setReviewSuccess(false);
      setShowAddReview(false);
    }, 2000);
  };

  const currentPrice = currency === 'USD' ? product.priceUsd : product.priceIqd;
  const originalPrice = currency === 'USD' ? product.originalPriceUsd : product.originalPriceIqd;
  const hasDiscount = Boolean(originalPrice && originalPrice > currentPrice);

  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#prod-${product.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const whatsappDirectUrl = generateSingleProductWhatsAppUrl(product, currency, settings);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        id="product-detail-modal"
        className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          id="btn-close-product-modal"
          onClick={onClose}
          className="absolute top-4 left-4 z-20 p-2 rounded-full bg-black/60 text-zinc-300 hover:text-white hover:bg-black/90 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          
          {/* Images Gallery Column */}
          <div className="md:col-span-6 bg-zinc-950 p-4 sm:p-6 flex flex-col justify-between space-y-4">
            {/* Main Image */}
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.titleKu}
                className="w-full h-full object-cover"
              />
              
              {product.badgeKu && (
                <div className="absolute top-3 right-3 bg-amber-500 text-black font-black text-xs px-3 py-1 rounded-lg shadow">
                  {product.badgeKu}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx ? 'border-amber-500 scale-105' : 'border-zinc-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Kurdistan Shipping Info */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800/80">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>گەیاندن بۆ هەموو کوردستان</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>پشکنین لە کاتی وەرگرتن</span>
              </div>
            </div>
          </div>

          {/* Product Details Column */}
          <div className="md:col-span-6 p-5 sm:p-6 md:p-8 flex flex-col justify-between space-y-5 text-right">
            
            <div className="space-y-4">
              
              {/* Header Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-mono">کۆدی کاڵا: {product.sku}</span>
                  <div className="flex items-center gap-1.5 text-amber-400">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-zinc-100">{product.rating}</span>
                    <span className="text-zinc-500 text-xs">({product.reviewsCount} هەڵسەنگاندن)</span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {product.titleKu}
                </h2>
                <p className="text-xs text-zinc-400 font-medium">
                  {product.titleEn}
                </p>
              </div>

              {/* Price Row */}
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-amber-400">
                      {formatPrice(currentPrice, currency)}
                    </span>
                    {hasDiscount && originalPrice && (
                      <span className="text-sm text-zinc-500 line-through">
                        {formatPrice(originalPrice, currency)}
                      </span>
                    )}
                  </div>
                  {hasDiscount && (
                    <span className="text-xs font-bold text-rose-400">
                      داشکاندن: {product.discountPercent}% بەردەستە
                    </span>
                  )}
                </div>

                <div className="text-left">
                  <span className="text-[11px] text-zinc-500 block">نرخی هاوتا بە دراوی تر:</span>
                  <span className="text-xs font-mono font-bold text-zinc-300">
                    {currency === 'IQD' ? formatPrice(product.priceUsd, 'USD') : formatPrice(product.priceIqd, 'IQD')}
                  </span>
                </div>
              </div>

              {/* Tabs Switcher: Overview vs Reviews */}
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'details'
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                      : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>تایبەتمەندی و ناساندن</span>
                </button>

                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'reviews'
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                      : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>ڕای کڕیاران ({reviews.length})</span>
                </button>
              </div>

              {activeTab === 'details' ? (
                <>
                  {/* Description */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-zinc-300">دەربارەی ئەم کاڵایە:</h4>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      {product.descriptionKu}
                    </p>
                  </div>

                  {/* Features List */}
                  {product.featuresKu && product.featuresKu.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <h4 className="text-xs font-bold text-zinc-300">تایبەتمەندییە سەرەکییەکان:</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                        {product.featuresKu.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/60">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Stock status */}
                  <div className="flex items-center gap-2 text-xs pt-1">
                    <span className="text-zinc-400">دۆخی کاڵا لە پێشەنگا:</span>
                    {product.inStock ? (
                      <span className="text-emerald-400 font-bold">
                        ✓ بەردەستە بۆ ناردنی خێرا ({product.stockCount} دانە)
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold">
                        ✗ لە ئێستادا نەماوە
                      </span>
                    )}
                  </div>
                </>
              ) : (
                /* Reviews Tab Content */
                <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-black text-white">{product.rating} لە ٥</span>
                      <span className="text-xs text-zinc-500">({reviews.length} بۆچوون)</span>
                    </div>

                    <button
                      onClick={() => setShowAddReview(!showAddReview)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 text-xs font-bold transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>نووسینی بۆچوون</span>
                    </button>
                  </div>

                  {/* Add Review Form */}
                  {showAddReview && (
                    <form onSubmit={handleAddReview} className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3 text-xs">
                      <span className="font-bold text-white block">بۆچوونی بەڕێزت بنووسە:</span>
                      
                      {reviewSuccess && (
                        <div className="p-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-lg text-center font-bold">
                          بۆچوونەکەت بە سەرکەوتوویی تۆمارکرا! زۆر سوپاس ✨
                        </div>
                      )}

                      {/* Interactive Stars */}
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-400">پلەدانان:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="p-1 hover:scale-110 transition-transform"
                            >
                              <Star className={`w-4 h-4 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="ناوی بەڕێزت..."
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                        />
                        <select
                          value={reviewCity}
                          onChange={(e) => setReviewCity(e.target.value)}
                          className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-amber-500"
                        >
                          <option value="هەولێر">هەولێر</option>
                          <option value="سلێمانی">سلێمانی</option>
                          <option value="دهۆک">دهۆک</option>
                          <option value="کەرکووک">کەرکووک</option>
                          <option value="هەڵەبجە">هەڵەبجە</option>
                          <option value="شارێکی تر">شارێکی تر</option>
                        </select>
                      </div>

                      <textarea
                        rows={2}
                        required
                        placeholder="ئەزموونت لەگەڵ ئەم کاڵایە بنووسە..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 resize-none"
                      />

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddReview(false)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
                        >
                          پەشیمانبوونەوە
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg bg-amber-500 text-black font-extrabold hover:bg-amber-400 transition-all"
                        >
                          ناردن
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Reviews List */}
                  {reviews.length > 0 ? (
                    <div className="space-y-2.5">
                      {reviews.map((rev) => (
                        <div key={rev.id} className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white">{rev.customerName}</span>
                              <span className="text-[10px] text-zinc-500">({rev.cityKu})</span>
                              {rev.isVerifiedPurchase && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold border border-emerald-500/20">
                                  کڕیاری ڕاستەقینە ✓
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-0.5 text-amber-400">
                              {Array.from({ length: rev.rating }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-zinc-300 text-[11px] leading-relaxed">
                            {rev.commentKu}
                          </p>
                          <span className="text-[9px] text-zinc-500 block text-left font-mono">
                            {rev.createdAt}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-zinc-500 text-xs">
                      هێشتا هیچ بۆچوونێک بۆ ئەم کاڵایە تۆمار نەکراوە. یەکەم کەس بە بۆچوونت بنووسیت!
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Actions & Quantity Footer */}
            <div className="pt-4 border-t border-zinc-800 space-y-3">
              
              {/* Quantity selector */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300">ژمارەی داواکراو:</span>
                <div className="flex items-center border border-zinc-700 bg-zinc-950 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-800 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-black text-amber-400 font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockCount || 99, quantity + 1))}
                    className="px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-800 text-sm font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Main action buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                
                {/* Add to Cart */}
                <button
                  id="modal-add-to-cart-btn"
                  onClick={() => {
                    onAddToCart(product, quantity);
                    onClose();
                  }}
                  disabled={!product.inStock}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    product.inStock 
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-white' 
                      : 'bg-zinc-800/40 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>زیادکردن بۆ سەبەتە</span>
                </button>

                {/* Direct WhatsApp Order */}
                <a
                  id="modal-whatsapp-order-btn"
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all text-center"
                >
                  <MessageCircle className="w-4 h-4 stroke-[2.5]" />
                  <span>داواکردن لە واتسئاپ</span>
                </a>

              </div>

              {/* Utility actions: Wishlist + Copy link */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  onClick={() => onToggleWishlist(product)}
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-rose-400 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{isWishlisted ? 'لە دڵخوازەکاندایە' : 'زیادکردن بۆ دڵخوازەکان'}</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-amber-400 transition-colors"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'لینکی کاڵا کۆپی کرا!' : 'کۆپیکردنی لینکی ئەم کاڵایە'}</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
