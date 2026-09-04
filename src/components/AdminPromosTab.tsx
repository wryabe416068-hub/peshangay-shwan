import React, { useState } from 'react';
import { Ticket, Plus, Trash2, CheckCircle2, XCircle, Sparkles, Copy, Check } from 'lucide-react';
import { PromoCode, ShopSettings } from '../types';
import { formatPrice } from '../utils/helpers';

interface AdminPromosTabProps {
  settings: ShopSettings;
  onSaveSettings: (settings: ShopSettings) => void;
}

export const AdminPromosTab: React.FC<AdminPromosTabProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(
    settings.promoCodes && settings.promoCodes.length > 0
      ? settings.promoCodes
      : [
          { code: 'SHWAN10', discountType: 'percentage', discountValue: 10, isActive: true },
          { code: 'NEWYEAR', discountType: 'fixed', discountValue: 5000, minSpendIqd: 30000, isActive: true },
        ]
  );

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minSpendIqd, setMinSpendIqd] = useState<number | undefined>(undefined);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCopy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedCode(txt);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleAddPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setErrorMsg('تکایە ناوی کۆدەکە بنووسە');
      return;
    }

    if (promoCodes.some(p => p.code.toUpperCase() === cleanCode)) {
      setErrorMsg('ئەم کۆدە پێشتر بوونی هەیە');
      return;
    }

    if (discountValue <= 0) {
      setErrorMsg('تکایە بڕی داشکاندن بە دروستی دیاری بکە');
      return;
    }

    const newPromo: PromoCode = {
      code: cleanCode,
      discountType,
      discountValue: Number(discountValue),
      minSpendIqd: minSpendIqd && minSpendIqd > 0 ? Number(minSpendIqd) : undefined,
      isActive: true,
    };

    const updated = [newPromo, ...promoCodes];
    setPromoCodes(updated);
    onSaveSettings({ ...settings, promoCodes: updated });

    setCode('');
    setDiscountValue(10);
    setMinSpendIqd(undefined);
    setSuccessMsg(`کۆدی داشکاندنی ${cleanCode} بە سەرکەوتوویی زیادکرا!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleToggleActive = (targetCode: string) => {
    const updated = promoCodes.map(p => 
      p.code === targetCode ? { ...p, isActive: !p.isActive } : p
    );
    setPromoCodes(updated);
    onSaveSettings({ ...settings, promoCodes: updated });
  };

  const handleDeletePromo = (targetCode: string) => {
    if (window.confirm(`ئایا دڵنیایت لە سڕینەوەی کۆدی ${targetCode}؟`)) {
      const updated = promoCodes.filter(p => p.code !== targetCode);
      setPromoCodes(updated);
      onSaveSettings({ ...settings, promoCodes: updated });
    }
  };

  return (
    <div className="space-y-6 text-right font-sans">
      
      {/* Header */}
      <div>
        <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
          <Ticket className="w-5 h-5 text-amber-400" />
          <span>بەڕێوەبردنی کۆدەکانی داشکاندن (Promo Codes)</span>
        </h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          کۆپۆنی تایبەت بۆ کڕیارانی پێشەنگای شوان دروست بکە بە ڕێژەی سەدی یان بڕی جێگیر.
        </p>
      </div>

      {/* Add New Promo Code Card */}
      <form onSubmit={handleAddPromo} className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
        <h4 className="text-xs sm:text-sm font-black text-zinc-200 flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-amber-400" />
          <span>دروستکردنی کۆدی داشکاندنی نوێ</span>
        </h4>

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Code */}
          <div>
            <label className="block text-zinc-400 mb-1 font-bold">ناوی کۆد *</label>
            <input
              type="text"
              placeholder="نموونە: SHWAN20"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100 font-mono uppercase tracking-wider focus:outline-none focus:border-amber-500 text-xs font-bold"
            />
          </div>

          {/* Discount Type */}
          <div>
            <label className="block text-zinc-400 mb-1 font-bold">جۆری داشکاندن</label>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as any)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-200 focus:outline-none focus:border-amber-500 cursor-pointer text-xs font-bold"
            >
              <option value="percentage">ڕێژەی سەدی (%)</option>
              <option value="fixed">بڕی جێگیر بە دینار (IQD)</option>
            </select>
          </div>

          {/* Value */}
          <div>
            <label className="block text-zinc-400 mb-1 font-bold">
              {discountType === 'percentage' ? 'بڕی داشکاندن (% سەدی)' : 'بڕی داشکاندن (دینار)'} *
            </label>
            <input
              type="number"
              min="1"
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500 text-xs"
            />
          </div>

          {/* Min Spend */}
          <div>
            <label className="block text-zinc-400 mb-1 font-bold">کەمترین کڕین (دینار - ئارەزوومەندانە)</label>
            <input
              type="number"
              placeholder="نموونە: 25000"
              value={minSpendIqd || ''}
              onChange={(e) => setMinSpendIqd(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-amber-500 text-xs"
            />
          </div>

        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>زیادکردنی کۆد بۆ سیستەم</span>
        </button>
      </form>

      {/* Existing Promo Codes List */}
      <div className="space-y-3">
        <h4 className="text-xs sm:text-sm font-black text-zinc-200">
          کۆدەکانی ئێستای پێشەنگا ({promoCodes.length})
        </h4>

        {promoCodes.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 bg-zinc-950 rounded-2xl border border-zinc-800 text-xs">
            هیچ کۆدێکی داشکاندن چالاک نییە.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {promoCodes.map((p) => (
              <div
                key={p.code}
                className={`p-4 rounded-2xl border transition-all ${
                  p.isActive 
                    ? 'bg-zinc-950 border-zinc-800' 
                    : 'bg-zinc-950/50 border-zinc-900 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                      {p.code}
                    </span>
                    <button
                      onClick={() => handleCopy(p.code)}
                      className="p-1 text-zinc-400 hover:text-white"
                      title="کۆپیکردن"
                    >
                      {copiedCode === p.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    p.isActive 
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    {p.isActive ? 'چالاکە' : 'ناچالاکە'}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-zinc-400 mb-3">
                  <p className="font-bold text-zinc-200">
                    داشکاندن: {p.discountType === 'percentage' ? `%${p.discountValue}` : formatPrice(p.discountValue, 'IQD')}
                  </p>
                  {p.minSpendIqd ? (
                    <p className="text-[11px] text-zinc-500">
                      بۆ کڕینی سەرووی: {formatPrice(p.minSpendIqd, 'IQD')}
                    </p>
                  ) : (
                    <p className="text-[11px] text-zinc-500">بێ مەرجی کەمترین بڕی کڕین</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs">
                  <button
                    onClick={() => handleToggleActive(p.code)}
                    className={`text-[11px] font-bold ${
                      p.isActive ? 'text-amber-400 hover:underline' : 'text-emerald-400 hover:underline'
                    }`}
                  >
                    {p.isActive ? 'ناچالاککردن' : 'چالاککردنەوە'}
                  </button>

                  <button
                    onClick={() => handleDeletePromo(p.code)}
                    className="text-zinc-500 hover:text-rose-400 p-1"
                    title="سڕینەوە"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
