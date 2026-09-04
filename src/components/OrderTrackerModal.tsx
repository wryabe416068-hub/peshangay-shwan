import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MessageCircle, 
  AlertCircle,
  MapPin,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { OrderRecord, ShopSettings } from '../types';
import { formatPrice } from '../utils/helpers';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ShopSettings;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [searchedOrders, setSearchedOrders] = useState<OrderRecord[] | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('peshangay_shwan_orders');
      if (stored) {
        setOrders(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading orders', e);
    }
  }, [isOpen]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSearchedOrders(null);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    // Search by clean phone or order number
    const cleanQueryPhone = query.replace(/[^0-9]/g, '');
    const matches = orders.filter((ord) => {
      const cleanOrdPhone = ord.customerPhone.replace(/[^0-9]/g, '');
      const matchPhone = cleanQueryPhone && cleanOrdPhone.includes(cleanQueryPhone);
      const matchOrderNum = ord.orderNumber.toLowerCase().includes(query);
      const matchName = ord.customerName.toLowerCase().includes(query);
      return matchPhone || matchOrderNum || matchName;
    });

    setSearchedOrders(matches);
    if (matches.length > 0) {
      setExpandedOrderId(matches[0].id);
    }
  };

  const cleanStoreWhatsApp = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const getStatusStep = (status: OrderRecord['status']) => {
    switch (status) {
      case 'new': return 1;
      case 'contacted': return 2;
      case 'shipped': return 3;
      case 'completed': return 4;
      case 'cancelled': return 0;
      default: return 1;
    }
  };

  const getStatusBadge = (status: OrderRecord['status']) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">داواکاری نوێ</span>;
      case 'contacted':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">لە ئامادەکردندا</span>;
      case 'shipped':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">لە ڕێگایە لەگەڵ گەیاندن 🚚</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">گەیشتە دەست کڕیار ✓</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">هەڵوەشێنراوەتەوە</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        id="order-tracker-modal"
        className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto text-right animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">شوێنکەوتنی داواکارییەکان</h3>
              <p className="text-[11px] text-zinc-400">بە ژمارەی مۆبایل یان ژمارەی وەصڵ دۆخی کاڵاکەت بزانە</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-bold text-zinc-300">
              ژمارەی مۆبایل یان ژمارەی داواکاری (وەک 0750xxxxxxx یان SHW-xxxx):
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="نموونە: 0750 123 4567 یان SHW-1025..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none font-mono"
                  dir="ltr"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all shrink-0 active:scale-95 shadow-md shadow-amber-500/20"
              >
                <Search className="w-4 h-4" />
                <span>گەڕان</span>
              </button>
            </div>
          </form>

          {/* Results Area */}
          {hasSearched ? (
            searchedOrders && searchedOrders.length > 0 ? (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                <p className="text-xs text-zinc-400 font-semibold">
                  {searchedOrders.length} داواکاری بەم زانیارییە دۆزرایەوە:
                </p>

                {searchedOrders.map((ord) => {
                  const step = getStatusStep(ord.status);
                  const isExpanded = expandedOrderId === ord.id;
                  const formattedTotal = formatPrice(ord.currencyUsed === 'USD' ? ord.totalUsd : ord.totalIqd, ord.currencyUsed);

                  return (
                    <div 
                      key={ord.id}
                      className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-4 transition-all"
                    >
                      {/* Top Summary */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-black text-amber-400">
                            #{ord.orderNumber}
                          </span>
                          {getStatusBadge(ord.status)}
                        </div>

                        <button
                          onClick={() => setExpandedOrderId(isExpanded ? null : ord.id)}
                          className="flex items-center gap-1 text-xs text-zinc-400 hover:text-amber-400 transition-colors"
                        >
                          <span>{isExpanded ? 'کەمکردنەوە' : 'وردەکاری داواکاری'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Visual Timeline Stepper */}
                      {ord.status !== 'cancelled' ? (
                        <div className="pt-2 pb-1">
                          <div className="grid grid-cols-4 gap-1 relative">
                            {/* Connecting line */}
                            <div className="absolute top-3.5 left-6 right-6 h-0.5 bg-zinc-800 -z-0" />
                            
                            {/* Step 1: Placed */}
                            <div className="flex flex-col items-center text-center relative z-10 space-y-1.5">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                step >= 1 ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30' : 'bg-zinc-800 text-zinc-400'
                              }`}>
                                <CheckCircle className="w-4 h-4" />
                              </div>
                              <span className={`text-[10px] sm:text-[11px] font-bold ${step >= 1 ? 'text-amber-400' : 'text-zinc-500'}`}>
                                تۆمارکراوە
                              </span>
                            </div>

                            {/* Step 2: Contacted / Processing */}
                            <div className="flex flex-col items-center text-center relative z-10 space-y-1.5">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                step >= 2 ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30' : 'bg-zinc-800 text-zinc-400'
                              }`}>
                                <Clock className="w-4 h-4" />
                              </div>
                              <span className={`text-[10px] sm:text-[11px] font-bold ${step >= 2 ? 'text-blue-400' : 'text-zinc-500'}`}>
                                ئامادەکردن
                              </span>
                            </div>

                            {/* Step 3: Shipped */}
                            <div className="flex flex-col items-center text-center relative z-10 space-y-1.5">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                step >= 3 ? 'bg-purple-500 text-white shadow-md shadow-purple-500/30' : 'bg-zinc-800 text-zinc-400'
                              }`}>
                                <Truck className="w-4 h-4" />
                              </div>
                              <span className={`text-[10px] sm:text-[11px] font-bold ${step >= 3 ? 'text-purple-400' : 'text-zinc-500'}`}>
                                لە ڕێگایە
                              </span>
                            </div>

                            {/* Step 4: Completed */}
                            <div className="flex flex-col items-center text-center relative z-10 space-y-1.5">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                step >= 4 ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30' : 'bg-zinc-800 text-zinc-400'
                              }`}>
                                <Package className="w-4 h-4" />
                              </div>
                              <span className={`text-[10px] sm:text-[11px] font-bold ${step >= 4 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                                گەیشت
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                          ئەم داواکارییە هەڵوەشێنراوەتەوە. بۆ پرسیار پەیوەندی بە پێشەنگاوە بکە.
                        </div>
                      )}

                      {/* Details Box */}
                      {isExpanded && (
                        <div className="pt-3 border-t border-zinc-800/80 space-y-3 text-xs">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300">
                            <div>
                              <span className="text-zinc-500">ناوی کڕیار: </span>
                              <span className="font-bold text-white">{ord.customerName}</span>
                            </div>
                            <div>
                              <span className="text-zinc-500">شار و ناونیشان: </span>
                              <span className="font-bold text-white">{ord.cityName} - {ord.fullAddress}</span>
                            </div>
                            <div>
                              <span className="text-zinc-500">بەروار: </span>
                              <span className="font-mono text-zinc-300">{ord.createdAt}</span>
                            </div>
                            <div>
                              <span className="text-zinc-500">کۆی گشتی: </span>
                              <span className="font-bold text-amber-400">{formattedTotal}</span>
                            </div>
                          </div>

                          {/* Items */}
                          <div className="space-y-1.5 pt-1">
                            <span className="text-zinc-400 font-bold block">کاڵاکان:</span>
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-zinc-900 border border-zinc-800/60">
                                <span>{it.quantity} × {it.titleKu}</span>
                                <span className="text-amber-400 font-mono">
                                  {formatPrice(ord.currencyUsed === 'USD' ? it.priceUsd * it.quantity : it.priceIqd * it.quantity, ord.currencyUsed)}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* WhatsApp Inquiry Button */}
                          <div className="pt-2 flex justify-end">
                            <a
                              href={`https://wa.me/${cleanStoreWhatsApp}?text=${encodeURIComponent(`سڵاو پێشەنگای شوان، پرسیارم هەیە دەربارەی دۆخی داواکارییەکەم بە ژمارەی #${ord.orderNumber}`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] font-bold text-xs transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>پرسیار دەربارەی ئەم داواکارییە لە واتسئاپ</span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">هیچ داواکارییەک نەدۆزرایەوە</h4>
                <p className="text-xs text-zinc-400">
                  تکایە دڵنیابەرەوە لە دروستی ژمارەی مۆبایلەکە یان کۆدی داواکاری (#SHW-xxxx).
                </p>
              </div>
            )
          ) : (
            <div className="p-6 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-center space-y-3">
              <Package className="w-10 h-10 text-amber-400/80 mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-white">دەستپێکردنی شوێنکەوتن</h4>
                <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                  لە کاتی کڕین لە پێشەنگای شوان، کۆدی داواکاریت پێ دەدرێت. لێرەوە دەتوانیت سات بە سات ئاگاداری ڕێڕەوی گەیشتنی بیت.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between text-xs text-zinc-400">
          <span>پێشەنگای شوان • خزمەتگوزاری سەرتاسەری کوردستان</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-colors"
          >
            داخستن
          </button>
        </div>
      </div>
    </div>
  );
};
