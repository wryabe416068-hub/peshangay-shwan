import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  MessageCircle, 
  QrCode, 
  Send, 
  Phone, 
  Sparkles, 
  Download,
  ExternalLink,
  ShieldCheck,
  Globe,
  Store
} from 'lucide-react';
import { ShopSettings } from '../types';
import { getCleanStoreUrl, getQrCodeUrl } from '../utils/helpers';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ShopSettings;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  
  // Clean standalone URL for customers (ensures no AI Studio 404 or editor links are shared)
  const cleanStoreUrl = getCleanStoreUrl(settings);
  const qrCodeUrl = getQrCodeUrl(cleanStoreUrl, 400);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(cleanStoreUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = `سڵاو، دەتوانیت سەرجەم کاڵا نوێ و ناوازەکانی پێشەنگای شوان لەم لینکەوە تەماشا بکەیت بە گەیاندنی خێرا بۆ هەموو شارەکانی کوردستان: \n${cleanStoreUrl}`;

  const shareWhatsAppUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const shareTelegramUrl = `https://t.me/share/url?url=${encodeURIComponent(cleanStoreUrl)}&text=${encodeURIComponent('پێشەنگای شوان - بازاڕی ئۆنلاین بۆ هەموو کوردستان')}`;
  const shareViberUrl = `viber://forward?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        id="share-store-modal"
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-5 sm:p-7 space-y-6 text-right animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20">
            <Store className="w-3.5 h-3.5" />
            <span>لینکی ڕاستەوخۆ و فەرمی پێشەنگای شوان</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            بەستەر و بارکۆد بۆ کڕیاران
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            ئەم لینک و بارکۆدە ڕاستەوخۆ وەک وێبسایتی فەرمی پێشەنگاکەت دەکرێتەوە و هیچ کەسێک شوێنی دروستکردن یان بەشی پڕۆگرامینگ نابینێت.
          </p>
        </div>

        {/* Customer Protection Badge */}
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-black block">پارێزراو بۆ بینینی کڕیار (Public Customer View):</span>
            <p className="text-[11px] text-zinc-300 mt-0.5">
              کاتێک کڕیار ئەم لینکە دەکاتەوە یان بارکۆدەکە سکان دەکات، تەنها کاڵاکان، نرخەکان و داواکردنی واتسئاپ دەبینێت.
            </p>
          </div>
        </div>

        {/* QR Code Presentation */}
        <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-36 h-36 bg-white p-2 rounded-xl shrink-0 flex items-center justify-center shadow-lg">
            <img
              src={qrCodeUrl}
              alt="QR Code Peshangay Shwan"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="space-y-2 text-right">
            <h4 className="text-sm font-black text-white flex items-center gap-1.5 justify-end sm:justify-start">
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>بارکۆدی QR ی فەرمی بۆ چاپکردن</span>
            </h4>
            <p className="text-xs text-zinc-400">
              ئەم بارکۆدە دابەزێنە و پرینتی بکە لەسەر کارت، لەزگە، یان ستاندی ناو مەعرەز و شوێنی فرۆشتن.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href={qrCodeUrl}
                download="peshangay-shwan-qr.png"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>دابەزاندنی بارکۆد</span>
              </a>
              <a
                href={cleanStoreUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 text-xs font-bold transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>تاقیکردنەوە لە وێبگەڕ</span>
              </a>
            </div>
          </div>
        </div>

        {/* Single Link Copy Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-zinc-300">
              لینکی پێشەنگای شوان بۆ کڕیاران (بۆ دانان لە بایۆی ئینستاگرام، تیکتۆک و بارکۆد):
            </label>
            <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Peshangay Shwan Official
            </span>
          </div>
          <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl p-1.5 pl-3">
            <input
              type="text"
              readOnly
              value={cleanStoreUrl}
              dir="ltr"
              className="w-full bg-transparent text-xs text-amber-400 font-mono focus:outline-none truncate select-all"
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-lg shrink-0 shadow transition-all active:scale-95"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'کۆپی کرا!' : 'کۆپیکردن'}</span>
            </button>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-zinc-400 block">ناردنی ڕاستەوخۆ بۆ تۆڕە کۆمەڵایەتییەکان:</span>
          <div className="grid grid-cols-3 gap-2">
            <a
              href={shareWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] text-xs font-bold transition-all text-center"
            >
              <MessageCircle className="w-4 h-4" />
              <span>واتسئاپ</span>
            </a>

            <a
              href={shareTelegramUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#0088cc]/15 hover:bg-[#0088cc]/25 border border-[#0088cc]/30 text-[#0088cc] text-xs font-bold transition-all text-center"
            >
              <Send className="w-4 h-4" />
              <span>تێلیگرام</span>
            </a>

            <a
              href={shareViberUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#7360f2]/15 hover:bg-[#7360f2]/25 border border-[#7360f2]/30 text-[#7360f2] text-xs font-bold transition-all text-center"
            >
              <Phone className="w-4 h-4" />
              <span>ڤایبەر</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
