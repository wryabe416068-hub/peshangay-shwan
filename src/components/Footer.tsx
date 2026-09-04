import React from 'react';
import { 
  Phone, 
  MapPin, 
  MessageCircle, 
  Instagram, 
  Truck, 
  ShieldCheck, 
  Heart, 
  Sparkles,
  Share2,
  Smartphone
} from 'lucide-react';
import { ShopSettings } from '../types';

interface FooterProps {
  settings: ShopSettings;
  onOpenShare: () => void;
  onOpenAdmin: () => void;
  onOpenTracker?: () => void;
  onOpenWholesale?: () => void;
  onOpenAssistant?: () => void;
  onOpenInstall?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenShare,
  onOpenAdmin,
  onOpenTracker,
  onOpenWholesale,
  onOpenAssistant,
  onOpenInstall,
}) => {
  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/80 pt-10 sm:pt-12 pb-24 md:pb-8 text-right transition-all w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Column 1: Brand & Ownership */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-black font-black text-xl shadow-md">
                ش
              </div>
              <div>
                <h3 className="text-xl font-black text-white">{settings.shopNameKu}</h3>
                <p className="text-xs text-zinc-400">{settings.shopNameEn}</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md">
              {settings.taglineKu}. سەرجەم کاڵاکان بە باشترین کوالیتی و پشکنینی وردەوە دەگەیەنرێنە بەردەم ماڵەکانتان لە سەرتاسەری کوردستان.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-zinc-300">
              <span className="font-bold text-amber-400">خاوەنداریەتی:</span>
              <span>{settings.ownerNameKu}</span>
            </div>
          </div>

          {/* Column 2: Kurdistan Delivery Coverage */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-black text-white flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>شارەکانی ژێر گەیاندن</span>
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              گەیاندنی ڕۆژانە بە خێرایی بۆ سەرجەم شار و قەزا و ناحیەکان:
            </p>
            <div className="flex flex-wrap gap-1.5 text-[11px] text-zinc-300">
              {['هەولێر', 'سلێمانی', 'دهۆک', 'کەرکووک', 'هەڵەبجە', 'سۆران', 'زاخۆ', 'ڕانیە', 'کەلار', 'ئاکرێ', 'کۆیە', 'قەڵادزێ'].map((city) => (
                <span key={city} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                  {city}
                </span>
              ))}
            </div>
          </div>

          {/* Column 3: Contact & Channels */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-black text-white">پەیوەندی و داواکاری</h4>
            
            <div className="space-y-2 text-xs">
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-zinc-300 hover:text-emerald-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <span dir="ltr" className="font-mono font-bold">{settings.whatsappNumber}</span>
              </a>

              <a
                href={`tel:${settings.phonePrimary}`}
                className="flex items-center gap-2 text-zinc-300 hover:text-amber-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span dir="ltr" className="font-mono font-bold">{settings.phonePrimary}</span>
              </a>

              {settings.instagramHandle && (
                <a
                  href={`https://instagram.com/${settings.instagramHandle}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-zinc-300 hover:text-pink-400 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
                  <span dir="ltr" className="font-mono">@{settings.instagramHandle}</span>
                </a>
              )}

              <div className="flex items-start gap-2 text-zinc-400 pt-1">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{settings.addressKu}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              {onOpenInstall && (
                <button
                  onClick={onOpenInstall}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold transition-all"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>دابەزاندنی ئەپ (iOS / Android)</span>
                </button>
              )}

              <button
                onClick={onOpenShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-amber-400 text-xs font-bold transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>هاوبەشکردنی لینک</span>
              </button>

              {onOpenTracker && (
                <button
                  onClick={onOpenTracker}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-bold transition-all"
                >
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  <span>شوێنکەوتنی داواکاری</span>
                </button>
              )}

              {onOpenWholesale && (
                <button
                  onClick={onOpenWholesale}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-bold transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>کڕینی جوملە</span>
                </button>
              )}

              {onOpenAssistant && (
                <button
                  onClick={onOpenAssistant}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>یاریدەدەری زیرەک</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <p>
            © {new Date().getFullYear()} سەرجەم مافەکانی ئەم بازاڕە ئۆنلاینە پارێزراوە بۆ <strong className="text-zinc-300">پێشەنگای شوان</strong>.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              دۆخی بەڕێوەبەر (Admin)
            </button>
            <span>•</span>
            <span className="text-zinc-400">بە یەک لینک بۆ سەرجەم کوردستان</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
