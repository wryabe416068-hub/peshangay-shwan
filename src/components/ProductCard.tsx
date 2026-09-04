import React from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Eye, 
  MessageCircle, 
  Star, 
  Check, 
  Sparkles,
  Zap,
  QrCode
} from 'lucide-react';
import { Product, ShopSettings } from '../types';
import { formatPrice, generateSingleProductWhatsAppUrl } from '../utils/helpers';

interface ProductCardProps {
  product: Product;
  currency: 'IQD' | 'USD';
  settings: ShopSettings;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onShowQr?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  settings,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onViewDetails,
  onShowQr,
}) => {
  const currentPrice = currency === 'USD' ? product.priceUsd : product.priceIqd;
  const originalPrice = currency === 'USD' ? product.originalPriceUsd : product.originalPriceIqd;
  const hasDiscount = Boolean(originalPrice && originalPrice > currentPrice);

  const getBadgeStyle = (badgeType?: string) => {
    switch (badgeType) {
      case 'sale':
        return 'bg-rose-500 text-white';
      case 'hot':
        return 'bg-amber-500 text-black';
      case 'exclusive':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-emerald-500 text-white';
    }
  };

  const whatsappDirectUrl = generateSingleProductWhatsAppUrl(product, currency, settings);

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl bg-[#14171f] border border-zinc-800/80 hover:border-amber-500/50 transition-all duration-300 overflow-hidden shadow-lg shadow-black/40 hover:shadow-amber-500/10 hover:-translate-y-1"
    >
      {/* Top Image Container */}
      <div className="relative w-full aspect-square bg-zinc-950 overflow-hidden cursor-pointer" onClick={() => onViewDetails(product)}>
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'}
          alt={product.titleKu}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Badges Top-Right */}
        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 flex flex-col gap-1 items-end z-10">
          {product.badgeKu && (
            <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-black shadow-md ${getBadgeStyle(product.badgeType)}`}>
              {product.badgeKu}
            </span>
          )}
          {hasDiscount && (
            <span className="px-1.5 py-0.5 sm:px-2 rounded-md text-[9px] sm:text-[10px] font-black bg-rose-600 text-white shadow">
              {product.discountPercent}% داشکاندن
            </span>
          )}
        </div>

        {/* Wishlist & QR Buttons Top-Left */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1.5 z-10">
          <button
            id={`wishlist-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`p-2 rounded-xl backdrop-blur-md transition-all active:scale-90 ${
              isWishlisted 
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
                : 'bg-black/50 text-zinc-300 hover:text-white hover:bg-black/80'
            }`}
            title="دڵخوازەکان"
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {onShowQr && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShowQr(product);
              }}
              className="p-2 rounded-xl backdrop-blur-md bg-black/50 text-zinc-300 hover:text-amber-400 hover:bg-black/80 transition-all active:scale-90"
              title="کۆدی QR بۆ پێشەنگا"
            >
              <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>

        {/* Stock Status Badge Bottom-Right */}
        <div className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 z-10 flex items-center gap-1">
          {product.stockCount !== undefined && product.stockCount > 0 && product.stockCount <= 5 ? (
            <span className="px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-black bg-amber-500 text-black shadow">
              تەنها {product.stockCount} ماوە!
            </span>
          ) : product.inStock ? (
            <span className="px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
              بەردەستە
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-bold bg-rose-950/90 text-rose-300 border border-rose-500/30 backdrop-blur-sm">
              نەماوە لە کۆگا
            </span>
          )}
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-3 text-right">
        
        <div className="space-y-1 sm:space-y-1.5">
          {/* SKU & Rating */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-zinc-400">
            <span className="font-mono text-zinc-500 text-[9px] sm:text-[10px]">کۆد: {product.sku}</span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-zinc-200 text-xs">{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onViewDetails(product)}
            className="text-xs sm:text-sm md:text-base font-black text-zinc-100 hover:text-amber-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {product.titleKu}
          </h3>

          {/* Variant Indicators */}
          {(Boolean(product.colors?.length) || Boolean(product.sizes?.length)) && (
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 pt-0.5">
              {product.colors && product.colors.length > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                  {product.colors.length} ڕەنگ
                </span>
              )}
              {product.sizes && product.sizes.length > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                  {product.sizes.length} قەبارە
                </span>
              )}
            </div>
          )}

          <p className="text-[11px] sm:text-xs text-zinc-400 line-clamp-1 sm:line-clamp-2 leading-relaxed">
            {product.descriptionKu}
          </p>
        </div>

        {/* Price & Action Area */}
        <div className="pt-2 border-t border-zinc-800/80 space-y-2.5 sm:space-y-3">
          
          {/* Prices */}
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm sm:text-lg font-black text-amber-400">
                {formatPrice(currentPrice, currency)}
              </span>
              {hasDiscount && originalPrice && (
                <span className="text-[10px] sm:text-xs text-zinc-500 line-through">
                  {formatPrice(originalPrice, currency)}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-1 sm:gap-2">
            
            {/* Add to Cart */}
            <button
              id={`add-cart-${product.id}`}
              onClick={() => onAddToCart(product)}
              disabled={!product.inStock}
              className={`flex items-center justify-center gap-1 py-1.5 px-1 sm:py-2 sm:px-3 rounded-xl text-[10px] sm:text-xs font-bold transition-all ${
                product.inStock 
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 hover:text-white active:scale-95' 
                  : 'bg-zinc-800/40 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">سەبەتە</span>
            </button>

            {/* Quick WhatsApp Buy */}
            <a
              id={`whatsapp-buy-${product.id}`}
              href={whatsappDirectUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1 py-1.5 px-1 sm:py-2 sm:px-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-[10px] sm:text-xs font-black shadow-sm transition-all active:scale-95 text-center truncate"
              title="کڕینی خێرا لە واتسئاپ"
            >
              <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5] shrink-0" />
              <span className="truncate">
                <span className="inline sm:hidden">کڕین</span>
                <span className="hidden sm:inline">کڕینی خێرا</span>
              </span>
            </a>

          </div>

        </div>

      </div>
    </div>
  );
};
