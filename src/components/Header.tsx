import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Share2, 
  Search, 
  X,
  Sparkles,
  Sun,
  Moon,
  Truck,
  Building2,
  Bot,
  Smartphone
} from 'lucide-react';
import { ShopSettings } from '../types';

interface HeaderProps {
  settings: ShopSettings;
  currency: 'IQD' | 'USD';
  onToggleCurrency: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenShare: () => void;
  onOpenAdmin: () => void;
  onOpenTracker?: () => void;
  onOpenWholesale?: () => void;
  onOpenAssistant?: () => void;
  onOpenInstall?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  currency,
  onToggleCurrency,
  theme = 'dark',
  onToggleTheme,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenShare,
  onOpenAdmin,
  onOpenTracker,
  onOpenWholesale,
  onOpenAssistant,
  onOpenInstall,
  searchQuery,
  onSearchChange,
}) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Secret click handler: 4 clicks opens the admin panel for Shwan
  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 4) {
      setClickCount(0);
      onOpenAdmin();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0f1115]/95 backdrop-blur-md border-b border-zinc-800/80 transition-all">
      {/* Top Announcement Bar */}
      {settings.showAnnouncement && settings.announcementKu && (
        <div className="bg-gradient-to-r from-amber-600/90 via-amber-500/90 to-amber-600/90 text-black text-[11px] sm:text-sm font-semibold py-1.5 px-3 sm:px-4 text-center flex items-center justify-center gap-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 animate-spin shrink-0" style={{ animationDuration: '6s' }} />
          <span className="truncate max-w-[280px] sm:max-w-none">{settings.announcementKu}</span>
          <span className="hidden md:inline-block bg-black/15 px-2 py-0.5 rounded text-[11px] font-bold">
            گەیاندن بۆ هەموو کوردستان
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20 gap-2 sm:gap-3">
          
          {/* Logo & Showroom Title (Secret 4 clicks opens admin for Shwan) */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
            <div 
              id="shwan-store-brand"
              className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group select-none min-w-0"
              onClick={handleLogoClick}
              title="پێشەنگای شوان"
            >
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-black font-extrabold shadow-md shadow-amber-500/20 group-hover:scale-105 active:scale-95 transition-transform shrink-0">
                <span className="text-base sm:text-2xl font-black">ش</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1">
                  <h1 className="text-sm sm:text-2xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors truncate">
                    {settings.shopNameKu}
                  </h1>
                  <span className="hidden sm:inline-flex items-center px-1 py-0.2 rounded text-[9px] sm:text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
                    فەرمی
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-zinc-400 hidden sm:block truncate max-w-[220px]">
                  {settings.shopNameEn}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="desktop-search-input"
                type="text"
                placeholder="گەڕان بەدوای کاڵا، مۆبایل، بۆن، کاتژمێر، کۆد..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-zinc-900/90 border border-zinc-800 rounded-full py-2.5 pr-10 pl-9 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Mobile Search Toggle */}
            <button
              id="btn-mobile-search-toggle"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-1.5 sm:p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors"
              title="گەڕان"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Install App Button for iOS & Android */}
            {onOpenInstall && (
              <button
                id="btn-open-install"
                onClick={onOpenInstall}
                className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-bold transition-all shrink-0 active:scale-95"
                title="دابەزاندنی ئەپ بۆ iPhone و Android"
              >
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">داگرتنی ئەپ</span>
              </button>
            )}

            {/* AI Shopping Assistant Button */}
            {onOpenAssistant && (
              <button
                id="btn-open-assistant"
                onClick={onOpenAssistant}
                className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-amber-500/5 hover:from-amber-500/25 hover:to-amber-500/15 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-bold transition-all shrink-0 active:scale-95"
                title="یاریدەدەری زیرەکی پێشەنگا (AI Assistant)"
              >
                <Bot className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline">یاریدەدەری زیرەک</span>
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            )}

            {/* Order Tracking Button */}
            {onOpenTracker && (
              <button
                id="btn-open-tracker"
                onClick={onOpenTracker}
                className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-amber-400 text-xs sm:text-sm font-bold transition-all shrink-0"
                title="شوێنکەوتنی داواکاری"
              >
                <Truck className="w-4 h-4 text-amber-500" />
                <span className="hidden lg:inline">شوێنکەوتن</span>
              </button>
            )}

            {/* Wholesale Inquiries Button */}
            {onOpenWholesale && (
              <button
                id="btn-open-wholesale"
                onClick={onOpenWholesale}
                className="hidden md:flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-xs font-bold transition-all shrink-0"
                title="کڕینی جوملە و بە کۆمەڵ"
              >
                <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>جوملە</span>
              </button>
            )}

            {/* Currency Switcher */}
            <button
              id="btn-currency-toggle"
              onClick={onToggleCurrency}
              className="flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs sm:text-sm font-bold text-zinc-200 hover:text-amber-400 transition-all shrink-0"
              title="گۆڕینی دراو (دینار / دۆلار)"
            >
              <span className="text-amber-500 font-extrabold">{currency === 'IQD' ? 'د.ع' : '$'}</span>
              <span className="hidden sm:inline text-[10px] sm:text-[11px] text-zinc-400">({currency === 'IQD' ? 'دینار' : 'USD'})</span>
            </button>

            {/* Dark / Light Theme Toggle */}
            {onToggleTheme && (
              <button
                id="btn-theme-toggle"
                onClick={onToggleTheme}
                className="p-1.5 sm:p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-amber-400 transition-all shrink-0"
                title={theme === 'dark' ? 'گۆڕین بۆ دۆخی ڕووناک (Light Mode)' : 'گۆڕین بۆ دۆخی تاریک (Dark Mode)'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-zinc-400" />
                )}
              </button>
            )}

            {/* Share Store Link Button */}
            <button
              id="btn-share-store"
              onClick={onOpenShare}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-400 text-xs sm:text-sm font-semibold transition-all shrink-0"
              title="هاوبەشکردنی لینکی پێشەنگا بۆ کوردستان"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline mr-1">هاوبەشکردنی لینک</span>
            </button>

            {/* Wishlist Button (Desktop) */}
            <button
              id="btn-wishlist-open"
              onClick={onOpenWishlist}
              className="hidden sm:flex relative p-2 sm:p-2.5 rounded-xl text-zinc-300 hover:text-rose-400 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all"
              title="دڵخوازەکان"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -left-1 w-5 h-5 bg-rose-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="btn-cart-open"
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all active:scale-95"
              title="سەبەتەی کڕین"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              <span className="font-bold hidden sm:inline">سەبەتە</span>
              {cartCount > 0 && (
                <span className="bg-black text-amber-400 text-[10px] sm:text-[11px] font-black px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar Dropdown */}
        {showMobileSearch && (
          <div className="md:hidden pb-3 pt-1 transition-all">
            <div className="relative w-full">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="mobile-search-input"
                type="text"
                placeholder="گەڕان بەدوای کاڵا لە پێشەنگای شوان..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-2 pr-10 pl-9 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
