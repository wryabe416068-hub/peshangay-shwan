import React from 'react';
import { 
  Truck, 
  ShieldCheck, 
  MessageCircle, 
  Sparkles, 
  ArrowLeft, 
  PhoneCall, 
  QrCode,
  CheckCircle2,
  MapPin,
  Clock
} from 'lucide-react';
import { ShopSettings } from '../types';

interface HeroSectionProps {
  settings: ShopSettings;
  onOpenShare: () => void;
  onScrollToCatalog: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  onOpenShare,
  onScrollToCatalog,
}) => {
  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <section className="relative w-full max-w-full overflow-hidden pt-3 pb-5 sm:py-10 border-b border-zinc-800/80 bg-gradient-to-b from-[#14171f] via-[#0f1115] to-[#0f1115]">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center">
          
          {/* Main Hero Content */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-5 text-right">
            
            {/* Showroom verified pill */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] sm:text-sm font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>پێشەنگای فەرمی شوان • هەموو کوردستان</span>
            </div>

            <h1 className="text-xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.3]">
              باشترین و ناوازەترین کاڵاکان لە <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                پێشەنگای شوان
              </span>
            </h1>

            <p className="text-xs sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
              {settings.taglineKu}
            </p>

            {/* Feature Bullets - Mobile Optimized 3-grid */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-1 sm:pt-2">
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-1 p-1.5 sm:p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-[9.5px] sm:text-xs text-zinc-200 font-bold leading-tight">گەیاندنی خێرا</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-1 p-1.5 sm:p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[9.5px] sm:text-xs text-zinc-200 font-bold leading-tight">گەرەنتی و پشکنین</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-1 p-1.5 sm:p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[9.5px] sm:text-xs text-zinc-200 font-bold leading-tight">داوا بە واتسئاپ</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 pt-1 sm:pt-2">
              <button
                id="btn-hero-catalog"
                onClick={onScrollToCatalog}
                className="col-span-1 flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs sm:text-base shadow-lg shadow-amber-500/25 transition-all active:scale-95 text-center"
              >
                <span>سەیرکردنی کاڵاکان</span>
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              </button>

              <a
                id="btn-hero-whatsapp"
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent('سڵاو پێشەنگای شوان، دەمەوێت دەربارەی کاڵاکانتان پرسیار بکەم.')}`}
                target="_blank"
                rel="noreferrer"
                className="col-span-1 flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-bold text-xs sm:text-base transition-all active:scale-95 text-center truncate"
              >
                <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">چاتی واتسئاپ</span>
              </a>

              <button
                id="btn-hero-share"
                onClick={onOpenShare}
                className="col-span-2 sm:w-auto flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs sm:text-sm font-semibold transition-all active:scale-95"
              >
                <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                <span>بارکۆدی فەرمی پێشەنگا (QR)</span>
              </button>
            </div>
          </div>

          {/* Hero Visual Card / Highlights */}
          <div className="lg:col-span-5 pt-2 lg:pt-0">
            <div className="relative rounded-2xl bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 p-4 sm:p-5 shadow-2xl space-y-3.5">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black text-emerald-400">داواکارییەکان کراوەیە</span>
                </div>
                <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Peshangay Shwan
                </span>
              </div>

              {/* Kurdistan Coverage preview */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-zinc-400 font-bold block">شارەکانی گەیاندن:</span>
                <div className="flex flex-wrap gap-1 text-[10px] sm:text-[11px] text-zinc-300">
                  {['هەولێر', 'سلێمانی', 'دهۆک', 'کەرکووک', 'هەڵەبجە', 'سۆران', 'زاخۆ', 'ڕانیە', 'کەلار', 'ئاکرێ'].map((city) => (
                    <span key={city} className="px-1.5 sm:px-2 py-0.5 bg-zinc-800/80 rounded-md border border-zinc-700/50 font-medium">
                      ✓ {city}
                    </span>
                  ))}
                </div>
              </div>

              {/* Direct Info */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] sm:text-xs">
                  <span className="text-zinc-400 font-medium">واتسئاپ و پەیوەندی:</span>
                  <a href={`tel:${settings.phonePrimary}`} className="text-amber-400 font-mono font-bold hover:underline" dir="ltr">
                    {settings.phonePrimary}
                  </a>
                </div>
                <div className="flex items-center justify-between text-[11px] sm:text-xs">
                  <span className="text-zinc-400 font-medium">ناونیشانی پێشەنگا:</span>
                  <span className="text-zinc-200 font-medium truncate max-w-[190px] sm:max-w-[210px]">{settings.addressKu}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
