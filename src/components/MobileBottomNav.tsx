import React from 'react';
import { 
  Home, 
  Search, 
  Heart, 
  ShoppingBag, 
  MessageCircle,
  Share2
} from 'lucide-react';
import { ShopSettings } from '../types';

interface MobileBottomNavProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenShare: () => void;
  onFocusSearch: () => void;
  settings: ShopSettings;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenShare,
  onFocusSearch,
  settings,
}) => {
  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0f1115]/95 backdrop-blur-lg border-t border-zinc-800/80 px-3 py-2 select-none safe-area-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Home / Scroll to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-amber-400 active:text-amber-400 transition-colors py-1 px-2.5 rounded-xl active:bg-zinc-800/50"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">سەرەکی</span>
        </button>

        {/* Search */}
        <button
          onClick={onFocusSearch}
          className="flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-amber-400 active:text-amber-400 transition-colors py-1 px-2.5 rounded-xl active:bg-zinc-800/50"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-bold">گەڕان</span>
        </button>

        {/* WhatsApp Direct Chat */}
        <a
          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('سڵاو پێشەنگای شوان، دەمەوێت دەربارەی کاڵاکانتان پرسیار بکەم.')}`}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center justify-center -mt-5"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-[#25D366] text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 border-2 border-[#0f1115] active:scale-95 transition-transform">
            <MessageCircle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-black text-emerald-400 mt-0.5">واتسئاپ</span>
        </a>

        {/* Wishlist */}
        <button
          onClick={onOpenWishlist}
          className="relative flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-rose-400 active:text-rose-400 transition-colors py-1 px-2.5 rounded-xl active:bg-zinc-800/50"
        >
          <Heart className="w-5 h-5" />
          {wishlistCount > 0 && (
            <span className="absolute 0 top-0.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
          <span className="text-[10px] font-bold">دڵخوازەکان</span>
        </button>

        {/* Cart */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center gap-1 text-amber-400 active:text-amber-300 transition-colors py-1 px-2.5 rounded-xl active:bg-zinc-800/50"
        >
          <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
          {cartCount > 0 && (
            <span className="absolute top-0.5 right-1.5 w-4 h-4 bg-amber-500 text-black text-[9px] font-black rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span className="text-[10px] font-black">سەبەتە</span>
        </button>

      </div>
    </div>
  );
};
