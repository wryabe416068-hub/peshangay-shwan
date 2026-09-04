import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowLeft, 
  MessageCircle, 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle2, 
  Sparkles,
  AlertCircle,
  CreditCard,
  Copy,
  Check,
  Ticket,
  QrCode,
  Award,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { CartItem, CityDelivery, OrderRecord, PaymentMethod, PromoCode, ShopSettings } from '../types';
import { formatPrice, generateWhatsAppOrderUrl } from '../utils/helpers';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: 'IQD' | 'USD';
  settings: ShopSettings;
  cities: CityDelivery[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderCreated: (order: OrderRecord) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  settings,
  cities,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderCreated,
}) => {
  if (!isOpen) return null;

  const [selectedCityId, setSelectedCityId] = useState<string>(cities[0]?.id || 'erbil');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [copiedPayment, setCopiedPayment] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [isSuccessOrder, setIsSuccessOrder] = useState(false);

  // Loyalty points state
  const [userLoyaltyPoints, setUserLoyaltyPoints] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('peshangay_shwan_loyalty_points');
      return stored ? parseInt(stored, 10) : 150; // 150 welcome bonus points
    } catch {
      return 150;
    }
  });
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);

  // Receipt image upload
  const [receiptImage, setReceiptImage] = useState<string | null>(null);

  // Dynamic QR Code for FastPay / FIB
  const [paymentQrUrl, setPaymentQrUrl] = useState<string | null>(null);

  useEffect(() => {
    if (paymentMethod === 'fastpay') {
      const fastPayAccount = settings.fastPayNumber || '0750 445 8899';
      QRCode.toDataURL(fastPayAccount, { margin: 1, width: 220, color: { dark: '#000000', light: '#ffffff' } })
        .then(setPaymentQrUrl)
        .catch(() => setPaymentQrUrl(null));
    } else if (paymentMethod === 'fib') {
      const fibAccount = settings.fibAccountNumber || '1000-2458-9901';
      QRCode.toDataURL(fibAccount, { margin: 1, width: 220, color: { dark: '#000000', light: '#ffffff' } })
        .then(setPaymentQrUrl)
        .catch(() => setPaymentQrUrl(null));
    } else {
      setPaymentQrUrl(null);
    }
  }, [paymentMethod, settings.fastPayNumber, settings.fibAccountNumber]);

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      alert('قەبارەی وێنەی وەسڵ نابێت لە ٤ مێگابایت زیاتر بێت');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setReceiptImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Promo code state
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoMessage, setPromoMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleCopyPaymentNumber = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPayment(label);
    setTimeout(() => setCopiedPayment(null), 2500);
  };

  const selectedCity = cities.find(c => c.id === selectedCityId) || cities[0];

  const subtotalIqd = items.reduce((sum, item) => sum + (item.product.priceIqd * item.quantity), 0);
  const subtotalUsd = items.reduce((sum, item) => sum + (item.product.priceUsd * item.quantity), 0);
  const currentSubtotal = currency === 'USD' ? subtotalUsd : subtotalIqd;

  const isFreeDelivery = settings.freeDeliveryThresholdIqd > 0 && subtotalIqd >= settings.freeDeliveryThresholdIqd;
  const deliveryFeeIqd = isFreeDelivery ? 0 : (selectedCity?.feeIqd || 0);
  const deliveryFeeUsd = isFreeDelivery ? 0 : (selectedCity?.feeUsd || 0);
  const currentDeliveryFee = currency === 'USD' ? deliveryFeeUsd : deliveryFeeIqd;

  // Calculate promo discount
  let discountIqd = 0;
  let discountUsd = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'percentage') {
      discountIqd = Math.round((subtotalIqd * appliedPromo.discountValue) / 100);
      discountUsd = Math.round(((subtotalUsd * appliedPromo.discountValue) / 100) * 100) / 100;
    } else {
      discountIqd = appliedPromo.discountValue;
      discountUsd = Math.round((appliedPromo.discountValue / settings.usdToIqdRate) * 100) / 100;
    }
  }

  // Loyalty calculations: 100 points = 5,000 IQD discount
  const pointsToRedeem = Math.min(userLoyaltyPoints, 100);
  const loyaltyDiscountIqd = useLoyaltyPoints && userLoyaltyPoints >= 50 ? (pointsToRedeem / 100) * 5000 : 0;
  const loyaltyDiscountUsd = Math.round((loyaltyDiscountIqd / settings.usdToIqdRate) * 100) / 100;
  const earnedLoyaltyPoints = Math.max(10, Math.floor(subtotalIqd / 1000));

  const currentDiscount = currency === 'USD' ? (discountUsd + loyaltyDiscountUsd) : (discountIqd + loyaltyDiscountIqd);

  const grandTotalIqd = Math.max(0, subtotalIqd - discountIqd - loyaltyDiscountIqd + deliveryFeeIqd);
  const grandTotalUsd = Math.max(0, subtotalUsd - discountUsd - loyaltyDiscountUsd + deliveryFeeUsd);
  const currentGrandTotal = currency === 'USD' ? grandTotalUsd : grandTotalIqd;

  const remainingForFreeDeliveryIqd = Math.max(0, settings.freeDeliveryThresholdIqd - subtotalIqd);

  const handleApplyPromo = () => {
    setPromoMessage(null);
    const cleanCode = promoInput.trim().toUpperCase();
    if (!cleanCode) {
      setPromoMessage({ text: 'تکایە کۆدی داشکاندن بنووسە', type: 'error' });
      return;
    }

    const activePromos: PromoCode[] = settings.promoCodes && settings.promoCodes.length > 0 
      ? settings.promoCodes 
      : [
          { code: 'SHWAN10', discountType: 'percentage', discountValue: 10, isActive: true },
          { code: 'NEWYEAR', discountType: 'fixed', discountValue: 5000, minSpendIqd: 30000, isActive: true }
        ];

    const match = activePromos.find(p => p.code.toUpperCase() === cleanCode && p.isActive);
    if (!match) {
      setPromoMessage({ text: 'کۆدەکە هەڵەیە یان بەسەرچووە', type: 'error' });
      return;
    }

    if (match.minSpendIqd && subtotalIqd < match.minSpendIqd) {
      setPromoMessage({
        text: `بۆ ئەم کۆدە دەبێت لانی کەم بڕی ${formatPrice(match.minSpendIqd, 'IQD')} بکڕیت`,
        type: 'error'
      });
      return;
    }

    setAppliedPromo(match);
    setPromoMessage({
      text: match.discountType === 'percentage' 
        ? `داشکاندنی %${match.discountValue} جێبەجێ کرا! ✨` 
        : `داشکاندنی ${formatPrice(match.discountValue, 'IQD')} جێبەجێ کرا! ✨`,
      type: 'success'
    });
  };

  const handleCheckoutWhatsApp = () => {
    if (!customerName.trim()) {
      setFormError('تکایە ناوی خۆت بنووسە');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 9) {
      setFormError('تکایە ژمارەی مۆبایل بە دروستی بنووسە');
      return;
    }
    if (!customerAddress.trim()) {
      setFormError('تکایە گەڕەک یان ناونیشانی نزیک دیاری بکە');
      return;
    }

    setFormError('');

    // Create Order Record for local storage & Admin Panel tracking
    const newOrder: OrderRecord = {
      id: `ord-${Date.now()}`,
      orderNumber: `SHW-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      cityName: selectedCity.nameKu,
      fullAddress: customerAddress.trim(),
      notes: customerNotes.trim(),
      paymentMethod,
      paymentDetails: paymentDetails.trim() || undefined,
      items: items.map(i => ({
        productId: i.product.id,
        titleKu: i.product.titleKu,
        quantity: i.quantity,
        priceIqd: i.product.priceIqd,
        priceUsd: i.product.priceUsd,
        selectedColor: i.selectedColor,
        selectedSize: i.selectedSize,
      })),
      subtotalIqd,
      subtotalUsd,
      deliveryFeeIqd,
      deliveryFeeUsd,
      discountCode: appliedPromo?.code,
      discountIqd: discountIqd > 0 ? discountIqd : undefined,
      discountUsd: discountUsd > 0 ? discountUsd : undefined,
      totalIqd: grandTotalIqd,
      totalUsd: grandTotalUsd,
      currencyUsed: currency,
      receiptImage: receiptImage || undefined,
      loyaltyPointsUsed: useLoyaltyPoints ? pointsToRedeem : undefined,
      loyaltyPointsEarned: earnedLoyaltyPoints,
      status: 'new',
    };

    onOrderCreated(newOrder);

    // Update customer loyalty points in localStorage
    const remainingLoyaltyPoints = Math.max(0, userLoyaltyPoints - (useLoyaltyPoints ? pointsToRedeem : 0)) + earnedLoyaltyPoints;
    setUserLoyaltyPoints(remainingLoyaltyPoints);
    try {
      localStorage.setItem('peshangay_shwan_loyalty_points', remainingLoyaltyPoints.toString());
    } catch (e) {}

    // Generate formatted WhatsApp invoice
    const waUrl = generateWhatsAppOrderUrl(
      items,
      {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        city: selectedCity,
        address: customerAddress.trim(),
        notes: customerNotes.trim(),
        paymentMethod,
        paymentDetails: paymentDetails.trim() || undefined,
        hasReceiptImage: Boolean(receiptImage),
        discountCode: appliedPromo?.code,
        discountAmount: currentDiscount > 0 ? currentDiscount : undefined,
        loyaltyPointsUsed: useLoyaltyPoints ? pointsToRedeem : undefined,
        loyaltyDiscount: loyaltyDiscountIqd > 0 ? loyaltyDiscountIqd : undefined,
        loyaltyPointsEarned: earnedLoyaltyPoints,
      },
      currency,
      settings
    );

    // Open WhatsApp
    window.open(waUrl, '_blank');
    setIsSuccessOrder(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div 
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between shadow-2xl text-right animate-in slide-in-from-left duration-300"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <h2 className="text-base sm:text-lg font-black text-white">
                سەبەتەی کڕین ({items.reduce((s, i) => s + i.quantity, 0)} دانە)
              </h2>
            </div>

            <button
              id="btn-close-cart"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success Message state */}
          {isSuccessOrder ? (
            <div className="p-8 text-center space-y-5 my-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-black text-white">
                داواکارییەکەت بە سەرکەوتوویی نێردرا!
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                دەقی داواکارییەکەت ڕەوانەی واتسئاپ کراوە. کارمەندانی پێشەنگای شوان لە کەمترین ماوەدا پەیوەندیت پێوە دەکەن بۆ گەیاندنی کاڵاکان.
              </p>
              <button
                onClick={() => {
                  onClearCart();
                  setIsSuccessOrder(false);
                  onClose();
                }}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm rounded-xl transition-all"
              >
                گەڕانەوە بۆ پێشەنگا
              </button>
            </div>
          ) : items.length === 0 ? (
            /* Empty Cart View */
            <div className="p-8 text-center space-y-4 my-auto">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 text-zinc-500 mx-auto flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">سەبەتەکەت بەتاڵە</h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                هیچ کاڵایەکت هەڵنەبژاردووە. دەتوانیت لە پێشەنگا کاڵای دڵخوازی خۆت دیاری بکەیت.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all"
              >
                تەماشاکردنی کاڵاکان
              </button>
            </div>
          ) : (
            /* Active Items List & Checkout Form */
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
              
              {/* Free delivery threshold meter */}
              {settings.freeDeliveryThresholdIqd > 0 && (
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-300 font-medium">
                      {isFreeDelivery ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> پیرۆزە! گەیاندنی ئەم داواکارییە بێ بەرامبەرە
                        </span>
                      ) : (
                        <span>
                          {formatPrice(remainingForFreeDeliveryIqd, 'IQD')} تر بکڕە بۆ گەیاندنی بێ بەرامبەر!
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotalIqd / settings.freeDeliveryThresholdIqd) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Items in Cart */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-zinc-400 block">کاڵا دیاریکراوەکان:</span>
                {items.map((item) => {
                  const itemPrice = currency === 'USD' ? item.product.priceUsd : item.product.priceIqd;
                  return (
                    <div 
                      key={item.product.id}
                      className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/90 flex gap-3 items-center justify-between"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.titleKu}
                        className="w-14 h-14 rounded-lg object-cover bg-zinc-900 border border-zinc-800 shrink-0"
                      />

                      <div className="flex-1 min-w-0 pr-2 space-y-1">
                        <h4 className="text-xs font-bold text-white truncate">
                          {item.product.titleKu}
                        </h4>
                        <span className="text-xs font-black text-amber-400 block">
                          {formatPrice(itemPrice * item.quantity, currency)}
                        </span>
                        
                        {/* Variant Badges (Color / Size) */}
                        {(item.selectedColor || item.selectedSize) && (
                          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 flex-wrap">
                            {item.selectedColor && (
                              <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                                ڕەنگ: {item.selectedColor}
                              </span>
                            )}
                            {item.selectedSize && (
                              <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                                قەبارە: {item.selectedSize}
                              </span>
                            )}
                          </div>
                        )}
                        
                        {/* Quantity adjuster */}
                        <div className="flex items-center gap-2 pt-1">
                          <div className="flex items-center border border-zinc-800 bg-zinc-900 rounded-lg overflow-hidden">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="px-2 py-0.5 text-zinc-400 hover:text-white text-xs font-bold"
                            >
                              -
                            </button>
                            <span className="px-2.5 py-0.5 text-xs font-bold text-zinc-100 font-mono">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="px-2 py-0.5 text-zinc-400 hover:text-white text-xs font-bold"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                            title="سڕینەوە"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Promo Code Box */}
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/90 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-amber-400" />
                    <span>کۆدی داشکاندن (Promo Code)</span>
                  </span>
                  {appliedPromo && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      چالاکە: {appliedPromo.code}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="نموونە: SHWAN10 یان NEWYEAR"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    disabled={Boolean(appliedPromo)}
                    className="flex-1 bg-black/50 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 uppercase font-mono tracking-wider focus:outline-none focus:border-amber-500"
                  />
                  {appliedPromo ? (
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedPromo(null);
                        setPromoInput('');
                        setPromoMessage(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-colors"
                    >
                      سڕینەوە
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-black shadow transition-all active:scale-95"
                    >
                      داشکاندن
                    </button>
                  )}
                </div>
                {promoMessage && (
                  <p className={`text-[11px] font-medium ${promoMessage.type === 'error' ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {promoMessage.text}
                  </p>
                )}
              </div>

              {/* Delivery Details Form */}
              <div className="space-y-3 pt-3 border-t border-zinc-800">
                <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> زانیارییەکانی گەیاندن لە کوردستان
                </span>

                {formError && (
                  <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="space-y-2 text-xs">
                  {/* Customer Name */}
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">ناوی کڕیار *</label>
                    <input
                      id="input-cart-name"
                      type="text"
                      placeholder="ناوی تەواو..."
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Customer Phone */}
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">ژمارەی مۆبایل (واتسئاپ/تەلەفۆن) *</label>
                    <input
                      id="input-cart-phone"
                      type="tel"
                      placeholder="0750 000 0000"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      dir="ltr"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 placeholder-zinc-600 text-right focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  {/* City Selector */}
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">شار / ناوچە *</label>
                    <select
                      id="select-cart-city"
                      value={selectedCityId}
                      onChange={(e) => setSelectedCityId(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-500 cursor-pointer font-bold"
                    >
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.nameKu} - گەیاندن: {formatPrice(currency === 'USD' ? city.feeUsd : city.feeIqd, currency)} ({city.estimateKu})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Full Address */}
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">گەڕەک و ناونیشانی نزیک *</label>
                    <input
                      id="input-cart-address"
                      type="text"
                      placeholder="نموونە: هەولێر - بەختیاری، نزیک باخچە..."
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Extra Notes */}
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">تێبینی یان کاتی گەیاندن (ئارەزوومەندانە)</label>
                    <input
                      id="input-cart-notes"
                      type="text"
                      placeholder="نموونە: ئێواران بگات، پێش گەیاندن تەلەفۆن بکەن..."
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Payment Method Selector (FastPay, FIB, Super Qi, Cash) */}
                  <div className="pt-2 border-t border-zinc-800/80">
                    <label className="block text-zinc-300 mb-2 font-bold flex items-center gap-1.5 text-xs sm:text-sm">
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span>شێوازی پارەدان هەڵبژێرە:</span>
                    </label>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {/* Cash */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cash')}
                        className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between ${
                          paymentMethod === 'cash'
                            ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">💵 کاش</span>
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            paymentMethod === 'cash' ? 'border-amber-400 bg-amber-400' : 'border-zinc-600'
                          }`}>
                            {paymentMethod === 'cash' && <span className="w-1.5 h-1.5 rounded-full bg-black"></span>}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 mt-1">لە کاتی وەرگرتنی کاڵا</span>
                      </button>

                      {/* FastPay */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('fastpay')}
                        className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between ${
                          paymentMethod === 'fastpay'
                            ? 'bg-rose-500/15 border-rose-500 text-rose-300'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">📱 فاستپەی</span>
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            paymentMethod === 'fastpay' ? 'border-rose-400 bg-rose-400' : 'border-zinc-600'
                          }`}>
                            {paymentMethod === 'fastpay' && <span className="w-1.5 h-1.5 rounded-full bg-black"></span>}
                          </span>
                        </div>
                        <span className="text-[10px] text-rose-400 mt-1 font-mono">FastPay</span>
                      </button>

                      {/* FIB */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('fib')}
                        className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between ${
                          paymentMethod === 'fib'
                            ? 'bg-sky-500/15 border-sky-500 text-sky-300'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">🏦 بانکی FIB</span>
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            paymentMethod === 'fib' ? 'border-sky-400 bg-sky-400' : 'border-zinc-600'
                          }`}>
                            {paymentMethod === 'fib' && <span className="w-1.5 h-1.5 rounded-full bg-black"></span>}
                          </span>
                        </div>
                        <span className="text-[10px] text-sky-400 mt-1 font-mono">First Iraqi Bank</span>
                      </button>

                      {/* Super Qi */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('superqi')}
                        className={`p-2.5 rounded-xl border text-right transition-all flex flex-col justify-between ${
                          paymentMethod === 'superqi'
                            ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">💳 سوپەر کی</span>
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            paymentMethod === 'superqi' ? 'border-amber-400 bg-amber-400' : 'border-zinc-600'
                          }`}>
                            {paymentMethod === 'superqi' && <span className="w-1.5 h-1.5 rounded-full bg-black"></span>}
                          </span>
                        </div>
                        <span className="text-[10px] text-amber-400 mt-1 font-mono">Super Qi Card</span>
                      </button>
                    </div>

                    {/* Electronic Payment Details Card */}
                    {paymentMethod !== 'cash' && (
                      <div className="mt-3 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-zinc-300">
                            {paymentMethod === 'fastpay' && 'ژمارەی ئەژمێری فاستپەی:'}
                            {paymentMethod === 'fib' && 'ژمارەی ئەژمێری FIB:'}
                            {paymentMethod === 'superqi' && 'ژمارەی کارتی سوپەر کی:'}
                          </span>
                          <span className="text-[10px] text-zinc-500">کلیک بکە بۆ کۆپیکردن</span>
                        </div>

                        {/* FastPay Number Box */}
                        {paymentMethod === 'fastpay' && (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-black/60 border border-zinc-800 rounded-lg px-2.5 py-1.5 font-mono text-sm text-rose-400 font-bold tracking-wider text-left">
                              {settings.fastPayNumber || '0750 445 8899'}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopyPaymentNumber(settings.fastPayNumber || '0750 445 8899', 'fastpay')}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 font-bold text-xs flex items-center gap-1 transition-all"
                            >
                              {copiedPayment === 'fastpay' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedPayment === 'fastpay' ? 'کۆپیکرا!' : 'کۆپی'}</span>
                            </button>
                          </div>
                        )}

                        {/* FIB Account Box */}
                        {paymentMethod === 'fib' && (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-black/60 border border-zinc-800 rounded-lg px-2.5 py-1.5 font-mono text-sm text-sky-400 font-bold tracking-wider text-left">
                              {settings.fibAccountNumber || '1000-2458-9901'}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopyPaymentNumber(settings.fibAccountNumber || '1000-2458-9901', 'fib')}
                              className="px-2.5 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 font-bold text-xs flex items-center gap-1 transition-all"
                            >
                              {copiedPayment === 'fib' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedPayment === 'fib' ? 'کۆپیکرا!' : 'کۆپی'}</span>
                            </button>
                          </div>
                        )}

                        {/* Super Qi Box */}
                        {paymentMethod === 'superqi' && (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-black/60 border border-zinc-800 rounded-lg px-2.5 py-1.5 font-mono text-sm text-amber-400 font-bold tracking-wider text-left">
                              {settings.superQiNumber || '6037-9921-4456-1188'}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopyPaymentNumber(settings.superQiNumber || '6037-9921-4456-1188', 'superqi')}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-bold text-xs flex items-center gap-1 transition-all"
                            >
                              {copiedPayment === 'superqi' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedPayment === 'superqi' ? 'کۆپیکرا!' : 'کۆپی'}</span>
                            </button>
                          </div>
                        )}

                        {settings.paymentInstructionsKu && (
                          <p className="text-[11px] text-zinc-400 italic">
                            💡 {settings.paymentInstructionsKu}
                          </p>
                        )}

                        {/* FastPay / FIB Dynamic QR Code */}
                        {paymentQrUrl && (
                          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col items-center justify-center space-y-2 text-center animate-in fade-in">
                            <div className="bg-white p-2.5 rounded-xl shadow-lg">
                              <img 
                                src={paymentQrUrl} 
                                alt="Payment QR Code" 
                                className="w-32 h-32 object-contain"
                              />
                            </div>
                            <div className="flex items-center gap-1.5 text-zinc-300 text-xs font-bold">
                              <QrCode className="w-3.5 h-3.5 text-amber-400" />
                              <span>
                                {paymentMethod === 'fastpay' ? 'سکانی بکە لە ئەپی FastPay' : 'سکانی بکە لە ئەپی FIB'}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-500 max-w-xs">
                              کۆدەکە بە مۆبایلەکەت لە ناو ئەپەکە سڕ بکە بۆ ناردنی ڕاستەوخۆ و بێ کێشەی بڕی پارەکە.
                            </p>
                          </div>
                        )}

                        {/* Transaction Receipt / Note */}
                        <div>
                          <label className="block text-[11px] font-bold text-zinc-400 mb-1">
                            کۆدی حەواڵە یان ژمارەی نێرەر (ئارەزوومەندانە):
                          </label>
                          <input
                            type="text"
                            placeholder="نموونە: ژمارەی وەسڵ یان ژمارەی مۆبایلەکەت..."
                            value={paymentDetails}
                            onChange={(e) => setPaymentDetails(e.target.value)}
                            className="w-full bg-black/50 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        {/* Receipt Screenshot Upload */}
                        <div className="space-y-1.5 pt-1">
                          <label className="block text-[11px] font-bold text-zinc-300">
                            وێنەی وەسڵ یان شاشەی پارەدان (ئارەزوومەندانە):
                          </label>
                          {receiptImage ? (
                            <div className="relative inline-flex items-center gap-2 p-2 bg-zinc-900 border border-emerald-500/50 rounded-xl">
                              <img src={receiptImage} alt="Receipt" className="w-14 h-14 object-cover rounded-lg" />
                              <div className="text-right">
                                <span className="text-xs font-bold text-emerald-400 block">وێنەی وەسڵ هاوپێچ کرا ✓</span>
                                <span className="text-[10px] text-zinc-400">ئامادەیە بۆ ناردن</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setReceiptImage(null)}
                                className="p-1 rounded-full bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 ml-2"
                                title="سڕینەوە"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-zinc-700 hover:border-amber-500/70 bg-zinc-900/50 text-zinc-400 hover:text-amber-400 cursor-pointer transition-all text-xs">
                              <Upload className="w-4 h-4" />
                              <span>دیاریکردنی وێنەی وەسڵی حەواڵە</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleReceiptUpload}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Loyalty Club Reward Card */}
              <div className="p-3 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">یانەی کڕیارانی دڵسۆز (Loyalty Club)</span>
                      <span className="text-[10px] text-zinc-400">
                        باڵانسی ئێستات: <strong className="text-amber-400 font-mono">{userLoyaltyPoints}</strong> خاڵ
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    +{earnedLoyaltyPoints} خاڵی نوێ لەم کڕینە
                  </span>
                </div>

                {userLoyaltyPoints >= 50 && (
                  <div className="pt-2 border-t border-amber-500/15 flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useLoyaltyPoints}
                        onChange={(e) => setUseLoyaltyPoints(e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-700 text-amber-500 focus:ring-amber-500 bg-zinc-900 cursor-pointer accent-amber-500"
                      />
                      <span className="text-xs text-zinc-200">
                        بەکارهێنانی <strong className="text-amber-400 font-mono">{pointsToRedeem}</strong> خاڵ بۆ داشکاندن
                      </span>
                    </label>
                    <span className="text-xs font-bold font-mono text-amber-400">
                      -{formatPrice(currency === 'USD' ? loyaltyDiscountUsd : loyaltyDiscountIqd, currency)}
                    </span>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Footer & Order Summary */}
          {!isSuccessOrder && items.length > 0 && (
            <div className="p-4 sm:p-5 bg-zinc-950 border-t border-zinc-800 space-y-3">
              
              {/* Financial Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>کۆی کاڵاکان:</span>
                  <span className="font-bold text-zinc-200">{formatPrice(currentSubtotal, currency)}</span>
                </div>
                {appliedPromo && discountIqd > 0 && (
                  <div className="flex justify-between text-rose-400 font-bold">
                    <span>داشکاندنی کۆد ({appliedPromo.code}):</span>
                    <span>-{formatPrice(currency === 'USD' ? discountUsd : discountIqd, currency)}</span>
                  </div>
                )}
                {useLoyaltyPoints && loyaltyDiscountIqd > 0 && (
                  <div className="flex justify-between text-amber-400 font-bold">
                    <span>داشکاندنی خاڵی کڕیار ({pointsToRedeem} خاڵ):</span>
                    <span>-{formatPrice(currency === 'USD' ? loyaltyDiscountUsd : loyaltyDiscountIqd, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    <span>تێچووی گەیاندن ({selectedCity?.nameKu}):</span>
                  </span>
                  <span className="font-bold text-zinc-200">
                    {isFreeDelivery ? (
                      <span className="text-emerald-400">بێ بەرامبەر ✨</span>
                    ) : (
                      formatPrice(currentDeliveryFee, currency)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-zinc-800">
                  <span>کۆی گشتی کۆتایی:</span>
                  <span className="text-amber-400 text-base">{formatPrice(currentGrandTotal, currency)}</span>
                </div>
              </div>

              {/* Direct WhatsApp Order Button */}
              <button
                id="btn-submit-cart-order"
                onClick={handleCheckoutWhatsApp}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <MessageCircle className="w-5 h-5 stroke-[2.5]" />
                <span>تەواوکردنی داواکاری لە واتسئاپ 💬</span>
              </button>

              <p className="text-[10px] text-zinc-500 text-center">
                بە کلیک کردن، دەقی داواکارییەکەت ڕاستەوخۆ دەگاتە دەست بەڕێوەبەرایەتی پێشەنگای شوان
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
