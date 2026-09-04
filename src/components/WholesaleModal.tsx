import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Package, 
  Phone, 
  MapPin, 
  CheckCircle, 
  MessageCircle, 
  Sparkles, 
  TrendingDown, 
  Truck 
} from 'lucide-react';
import { ShopSettings } from '../types';

interface WholesaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ShopSettings;
}

export const WholesaleModal: React.FC<WholesaleModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('هەولێر');
  const [categoryInterest, setCategoryInterest] = useState('ئەلیکترۆنی و کاتژمێری زیرەک');
  const [quantityTier, setQuantityTier] = useState('٢٥ بۆ ٥٠ دانە (تایبەت بۆ فرۆشگاکان)');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const cleanWhatsApp = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) return;

    const message = `🏢 *داواکاری نرخی جوملە و کڕینی بە کۆمەڵ (Wholesale Quote)*
━━━━━━━━━━━━━━━━━━
👤 *ناوی کڕیار:* ${customerName}
🏪 *ناوی دوکان / کۆمپانیا:* ${businessName || 'کڕیاری تاک و بەکۆمەڵ'}
📞 *ژمارەی پەیوەندی:* ${phone}
📍 *شار / ناونیشان:* ${city}
📦 *جۆری کاڵای داواکراو:* ${categoryInterest}
🔢 *بڕی مەزەندەکراو:* ${quantityTier}
${notes ? `📝 *تێبینی زیاتر:* ${notes}\n` : ''}━━━━━━━━━━━━━━━━━━
سڵاو کاک شوان، دەمەوێت لیست و کەتەلۆگی نرخی جوملەم بۆ بنێرن بۆ ئەم بڕە. زۆر سوپاس!`;

    const url = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        id="wholesale-modal"
        className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto text-right animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">کڕینی بە کۆمەڵ و فرۆشتنی جوملە</h3>
              <p className="text-[11px] text-zinc-400">تایبەت بۆ خاوەن دوکانەکان، پەیجەکان، و داواکاری گەورە</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits banner */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-zinc-800/80 p-3 px-5">
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] sm:text-xs">
            <div className="flex items-center justify-center gap-1 text-amber-400 font-bold">
              <TrendingDown className="w-3.5 h-3.5 shrink-0" />
              <span>نرخی جوملەی ڕاستەقینە</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-amber-400 font-bold">
              <Truck className="w-3.5 h-3.5 shrink-0" />
              <span>گەیاندنی بار بۆ هەموو شارەکان</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-amber-400 font-bold">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span>فاکتوورە و گەرەنتی کۆگا</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 mb-1 font-bold">ناوی بەڕێزت *</label>
              <input
                type="text"
                required
                placeholder="ناوی سیانی..."
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-300 mb-1 font-bold">ناوی دوکان / پەیج (ئەگەر هەیە)</label>
              <input
                type="text"
                placeholder="نموونە: فرۆشگای ئاریان..."
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 mb-1 font-bold">ژمارەی مۆبایل / واتسئاپ *</label>
              <input
                type="tel"
                required
                dir="ltr"
                placeholder="0750 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none font-mono text-right"
              />
            </div>

            <div>
              <label className="block text-zinc-300 mb-1 font-bold">شار / دەڤەر</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none cursor-pointer font-bold"
              >
                <option value="هەولێر">هەولێر</option>
                <option value="سلێمانی">سلێمانی</option>
                <option value="دهۆک">دهۆک</option>
                <option value="کەرکووک">کەرکووک</option>
                <option value="هەڵەبجە">هەڵەبجە</option>
                <option value="سۆران و چۆمان">سۆران و چۆمان</option>
                <option value="زاخۆ">زاخۆ</option>
                <option value="ڕانیە و قەڵادزێ">ڕانیە و قەڵادزێ</option>
                <option value="گەرمیان و کەلار">گەرمیان و کەلار</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 mb-1 font-bold">جۆری کاڵاکان</label>
              <select
                value={categoryInterest}
                onChange={(e) => setCategoryInterest(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none cursor-pointer"
              >
                <option value="ئەلیکترۆنی و کاتژمێری زیرەک">ئەلیکترۆنی و کاتژمێری زیرەک</option>
                <option value="کاتژمێری کەشخە و بۆن">کاتژمێری کەشخە و بۆن</option>
                <option value="دەنگ، سپیکەر و هێدفۆن">دەنگ، سپیکەر و هێدفۆن</option>
                <option value="کەرەستەی ناوماڵ و ئامێرەکان">کەرەستەی ناوماڵ و ئامێرەکان</option>
                <option value="تێکەڵ لە هەموو کاڵاکان">تێکەڵ لە هەموو کاڵاکان</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 mb-1 font-bold">بڕی مەزەندەکراو (دانە)</label>
              <select
                value={quantityTier}
                onChange={(e) => setQuantityTier(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none cursor-pointer"
              >
                <option value="١٠ بۆ ٢٥ دانە">١٠ بۆ ٢٥ دانە</option>
                <option value="٢٥ بۆ ٥٠ دانە (تایبەت بۆ فرۆشگاکان)">٢٥ بۆ ٥٠ دانە (تایبەت بۆ فرۆشگاکان)</option>
                <option value="٥٠ بۆ ١٠٠ دانە">٥٠ بۆ ١٠٠ دانە</option>
                <option value="زیاتر لە ١٠٠ دانە (کۆنتێنەر/کارتۆنی تەواو)">زیاتر لە ١٠٠ دانە (کۆنتێنەر/کارتۆنی تەواو)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 mb-1 font-bold">تێبینی زیاتر یان مەرجی تایبەت</label>
            <textarea
              rows={2}
              placeholder="ئەگەر مۆدێلێکی تایبەتت دەوێت یان داواکارییەکی ترت هەیە لێرە بینوسە..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/25 active:scale-98"
            >
              <MessageCircle className="w-4 h-4 stroke-[2.5]" />
              <span>ناردنی داواکاری لە واتسئاپ بۆ کاک شوان</span>
            </button>
            <p className="text-[10px] text-zinc-500 text-center mt-2">
              لە ماوەیەکی کەمدا لیستی نرخ و داشکاندنی تایبەتی جوملەت بۆ دەنێردرێتەوە.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
