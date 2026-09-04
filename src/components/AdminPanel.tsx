import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Edit3, 
  Trash2, 
  Copy, 
  Save, 
  Package, 
  ShoppingBag, 
  Settings, 
  Truck, 
  Database, 
  Lock, 
  CheckCircle, 
  AlertCircle, 
  Phone, 
  MessageCircle, 
  Upload, 
  DollarSign,
  Eye,
  RefreshCw,
  Download,
  FileJson,
  Sparkles,
  ShieldAlert,
  KeyRound,
  ShieldCheck,
  CreditCard,
  BarChart3,
  Ticket,
  Printer
} from 'lucide-react';
import { Category, CityDelivery, OrderRecord, Product, ShopSettings } from '../types';
import { calculateDiscount, formatPrice, generateCustomerStatusWhatsAppUrl } from '../utils/helpers';
import { AdminAnalyticsTab } from './AdminAnalyticsTab';
import { AdminPromosTab } from './AdminPromosTab';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: Category[];
  cities: CityDelivery[];
  orders: OrderRecord[];
  settings: ShopSettings;
  currency: 'IQD' | 'USD';
  onSaveProducts: (products: Product[]) => void;
  onSaveCategories: (categories: Category[]) => void;
  onSaveCities: (cities: CityDelivery[]) => void;
  onSaveSettings: (settings: ShopSettings) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderRecord['status']) => void;
  onResetAllData: () => void;
  onPrintInvoice?: (order: OrderRecord) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  categories,
  cities,
  orders,
  settings,
  currency,
  onSaveProducts,
  onSaveCategories,
  onSaveCities,
  onSaveSettings,
  onUpdateOrderStatus,
  onResetAllData,
  onPrintInvoice,
}) => {
  if (!isOpen) return null;

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'analytics' | 'promos' | 'settings' | 'delivery' | 'backup'>('products');

  // Product Editing Modal State
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product> & { colorInput?: string; sizeInput?: string }>({
    titleKu: '',
    titleEn: '',
    category: 'electronics',
    priceIqd: 25000,
    priceUsd: 16.6,
    originalPriceIqd: 0,
    originalPriceUsd: 0,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
    descriptionKu: '',
    descriptionEn: '',
    inStock: true,
    stockCount: 10,
    badgeKu: 'نوێ ✨',
    badgeType: 'new',
    sku: `SHW-${Math.floor(1000 + Math.random() * 9000)}`,
    featuresKu: ['کوالیتی بەرز', 'گرەنتی لە پێشەنگای شوان'],
    colors: ['ڕەش', 'سپی'],
    sizes: ['Standard'],
    colorInput: 'ڕەش, سپی',
    sizeInput: 'Standard',
    rating: 4.9,
    reviewsCount: 15,
    isFeatured: true,
  });

  // Settings State Form
  const [settingsForm, setSettingsForm] = useState<ShopSettings>({ ...settings });
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Master Recovery State
  const PERMANENT_MASTER_KEY = 'SHWAN-9988';
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryMasterKey, setRecoveryMasterKey] = useState('');
  const [recoveryNewPin, setRecoveryNewPin] = useState('');
  const [recoveryConfirmPin, setRecoveryConfirmPin] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);
  const [masterLoginNotice, setMasterLoginNotice] = useState(false);
  const [copiedMasterKey, setCopiedMasterKey] = useState(false);

  // Pin Unlock handler
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = pinInput.trim();
    const currentPin = String(settings.adminPin || '').trim();
    const masterKey = String(settings.masterRecoveryKey || PERMANENT_MASTER_KEY).trim();

    // 1. Direct local check with current PIN or Master Key
    if (cleanInput && (cleanInput === currentPin || cleanInput === masterKey || cleanInput === PERMANENT_MASTER_KEY)) {
      setIsUnlocked(true);
      setPinError(false);
      if (cleanInput === masterKey || cleanInput === PERMANENT_MASTER_KEY) {
        setMasterLoginNotice(true);
      }
      return;
    }

    // 2. Online verification with server
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: cleanInput }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsUnlocked(true);
        setPinError(false);
        if (data.isMaster) {
          setMasterLoginNotice(true);
        }
        return;
      }
    } catch {
      // Local fallback
    }

    setPinError(true);
  };

  // Seize control & Master reset handler
  const handleMasterResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');
    setRecoverySuccess('');

    const cleanMaster = recoveryMasterKey.trim();
    const cleanNew = recoveryNewPin.trim();
    const cleanConfirm = recoveryConfirmPin.trim();

    if (!cleanMaster) {
      setRecoveryError('تکایە کلیلی ماستەری شوان بنووسە');
      return;
    }
    if (cleanNew.length < 3) {
      setRecoveryError('تێپەڕەوشەی نوێ پێویستە بەلایەنی کەم ٣ پیت یان ژمارە بێت');
      return;
    }
    if (cleanNew !== cleanConfirm) {
      setRecoveryError('تێپەڕەوشەی نوێ و دووبارەکردنەوەکەی وەک یەک نین!');
      return;
    }

    const currentMaster = String(settings.masterRecoveryKey || PERMANENT_MASTER_KEY).trim();
    if (cleanMaster !== currentMaster && cleanMaster !== PERMANENT_MASTER_KEY) {
      setRecoveryError('کلیلی ماستەر هەڵەیە! ناتوانیت کۆنترۆڵ بسەنیتەوە.');
      return;
    }

    setIsRecovering(true);

    try {
      await fetch('/api/admin/master-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ masterKey: cleanMaster, newPin: cleanNew }),
      });

      const updatedSettings = {
        ...settings,
        adminPin: cleanNew,
        masterRecoveryKey: settings.masterRecoveryKey || PERMANENT_MASTER_KEY,
      };

      onSaveSettings(updatedSettings);
      setSettingsForm(updatedSettings);

      setRecoverySuccess('کۆنترۆڵی پێشەنگا بە سەرکەوتوویی گەڕێنرایەوە بۆ دەستت! تێپەڕەوشەی نوێ لەسەر هەموو مۆبایلەکان جێگیرکرا.');
      setTimeout(() => {
        setIsUnlocked(true);
        setShowRecoveryModal(false);
        setRecoverySuccess('');
        setRecoveryMasterKey('');
        setRecoveryNewPin('');
        setRecoveryConfirmPin('');
      }, 1500);
    } catch (err) {
      setRecoveryError('هەڵەیەک ڕوویدا لە کاتی پەیوەندی بە سێرڤەر');
    } finally {
      setIsRecovering(false);
    }
  };

  // Open Add Product Modal
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      id: `prod-${Date.now()}`,
      titleKu: '',
      titleEn: '',
      category: categories[1]?.id || 'electronics',
      priceIqd: 30000,
      priceUsd: 20,
      originalPriceIqd: 0,
      originalPriceUsd: 0,
      discountPercent: 0,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
      descriptionKu: '',
      descriptionEn: '',
      inStock: true,
      stockCount: 15,
      badgeKu: 'نوێ ✨',
      badgeType: 'new',
      sku: `SHW-${Math.floor(1000 + Math.random() * 9000)}`,
      featuresKu: ['کوالیتی بەرز و دڵنیاکراو', 'گرەنتی لە پێشەنگای شوان'],
      rating: 5.0,
      reviewsCount: 10,
      isFeatured: false,
    });
    setIsEditingProduct(true);
  };

  // Open Edit Product Modal
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductForm({ 
      ...prod,
      colorInput: (prod.colors || []).join(', '),
      sizeInput: (prod.sizes || []).join(', ')
    });
    setIsEditingProduct(true);
  };

  // Delete Product
  const handleDeleteProduct = (id: string) => {
    if (window.confirm('ئایا دڵنیایت لە سڕینەوەی ئەم کاڵایە لە پێشەنگا؟')) {
      const updated = products.filter(p => p.id !== id);
      onSaveProducts(updated);
    }
  };

  // Duplicate Product
  const handleDuplicateProduct = (prod: Product) => {
    const duplicated: Product = {
      ...prod,
      id: `prod-${Date.now()}`,
      sku: `SHW-${Math.floor(1000 + Math.random() * 9000)}`,
      titleKu: `${prod.titleKu} (کۆپی)`,
    };
    onSaveProducts([duplicated, ...products]);
  };

  // Save Product (Add or Edit)
  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.titleKu?.trim()) {
      alert('تکایە ناوی کاڵا بە کوردی بنووسە');
      return;
    }

    const parsedColors = productForm.colorInput 
      ? productForm.colorInput.split(',').map(s => s.trim()).filter(Boolean)
      : (productForm.colors || []);
    const parsedSizes = productForm.sizeInput 
      ? productForm.sizeInput.split(',').map(s => s.trim()).filter(Boolean)
      : (productForm.sizes || []);

    const discount = calculateDiscount(productForm.originalPriceIqd, productForm.priceIqd);
    const newProduct: Product = {
      id: editingProductId || `prod-${Date.now()}`,
      titleKu: productForm.titleKu || 'کاڵای نوێ',
      titleEn: productForm.titleEn || 'New Product',
      category: productForm.category || 'electronics',
      priceIqd: Number(productForm.priceIqd) || 0,
      priceUsd: Number(productForm.priceUsd) || 0,
      originalPriceIqd: Number(productForm.originalPriceIqd) || undefined,
      originalPriceUsd: Number(productForm.originalPriceUsd) || undefined,
      discountPercent: discount > 0 ? discount : undefined,
      images: productForm.images && productForm.images.length > 0 ? productForm.images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
      descriptionKu: productForm.descriptionKu || '',
      descriptionEn: productForm.descriptionEn || '',
      inStock: productForm.inStock ?? true,
      stockCount: Number(productForm.stockCount) || 1,
      badgeKu: productForm.badgeKu,
      badgeType: productForm.badgeType || 'new',
      sku: productForm.sku || `SHW-${Math.floor(1000 + Math.random() * 9000)}`,
      featuresKu: productForm.featuresKu || [],
      colors: parsedColors.length > 0 ? parsedColors : undefined,
      sizes: parsedSizes.length > 0 ? parsedSizes : undefined,
      rating: productForm.rating || 4.9,
      reviewsCount: productForm.reviewsCount || 1,
      isFeatured: productForm.isFeatured ?? false,
    };

    if (editingProductId) {
      const updated = products.map(p => p.id === editingProductId ? newProduct : p);
      onSaveProducts(updated);
    } else {
      onSaveProducts([newProduct, ...products]);
    }

    setIsEditingProduct(false);
  };

  // Image upload to data URL
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setProductForm(prev => ({
            ...prev,
            images: [dataUrl, ...(prev.images || []).slice(1)]
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Settings
  const handleSaveSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(settingsForm);
    setSaveSuccessMsg('ڕێکخستنەکان بە سەرکەوتوویی پاشەکەوت کران!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Export JSON
  const handleExportJson = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      shop: settings,
      categories,
      cities,
      products,
      orders,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `peshangay-shwan-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.products) onSaveProducts(data.products);
          if (data.shop) onSaveSettings(data.shop);
          if (data.categories) onSaveCategories(data.categories);
          if (data.cities) onSaveCities(data.cities);
          alert('داتاکان بە سەرکەوتوویی گەڕێنرانەوە!');
        } catch (err) {
          alert('هەڵەیەک لە خوێندنەوەی فایلی JSON ڕوویدا');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        id="admin-dashboard-modal"
        className="relative w-full max-w-5xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh] text-right"
      >
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-black font-extrabold flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  پنێڵی بەڕێوەبردنی پێشەنگای شوان
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  هاوکاتی ڕاستەوخۆ (Live Sync)
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                بەڕێوەبردنی کاڵاکان، نرخ، گەیاندن و ڕێکخستنەکانی دوکان
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lock Screen if Not Unlocked */}
        {!isUnlocked ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-5 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">چوونەژوورەوەی خاوەن پێشەنگا (شوان)</h3>
              <p className="text-xs text-zinc-400">
                تکایە تێپەڕەوشەی نهێنی (Password) بنووسە بۆ چوونە ناو پنێڵ
              </p>
            </div>

            <form onSubmit={handleUnlock} className="space-y-3">
              <input
                id="admin-pin-input"
                type="password"
                placeholder="تێپەڕەوشەی نهێنی بنووسە..."
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-center text-lg font-mono tracking-widest text-amber-400 focus:outline-none focus:border-amber-500"
              />

              {pinError && (
                <p className="text-xs text-rose-400 font-bold">
                  تێپەڕەوشەی نهێنی هەڵەیە! تکایە دووبارە تاقی بکەرەوە.
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20"
              >
                چوونەژوورەوە
              </button>
            </form>

            {/* Master Recovery Emergency Trigger */}
            <div className="pt-3 border-t border-zinc-800/80">
              <button
                type="button"
                id="btn-open-master-recovery"
                onClick={() => {
                  setShowRecoveryModal(true);
                  setRecoveryError('');
                  setRecoverySuccess('');
                }}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold transition-colors inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/15"
              >
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>پاسۆرد لەژێر دەستت دەرچووە یان گۆڕدراوە؟ (سەندنەوەی ماستەر)</span>
              </button>
            </div>

            {/* Master Recovery Modal */}
            {showRecoveryModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                <div className="w-full max-w-md bg-zinc-900 border border-amber-500/40 rounded-2xl p-5 sm:p-6 shadow-2xl text-right space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <div className="flex items-center gap-2 text-amber-400">
                      <KeyRound className="w-5 h-5 text-amber-400" />
                      <h4 className="text-base font-black text-white">سەندنەوەی کۆنترۆڵی پێشەنگا بۆ شوان</h4>
                    </div>
                    <button 
                      onClick={() => setShowRecoveryModal(false)}
                      className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    ئەگەر کەسێک پاسۆردی پنێڵەکەی گۆڕیوە یان پاسۆردت لەبیرچووە، بە نووسینی <span className="text-amber-400 font-bold font-mono">کلیلی ماستەری نەگۆڕی شوان</span> دەتوانیت دەستبەجێ کۆنترۆڵی پێشەنگاکە بگەڕێنیتەوە ژێر دەستی خۆت و پاسۆردێکی نوێ جێگیر بکەیت.
                  </p>

                  <form onSubmit={handleMasterResetSubmit} className="space-y-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                        کلیلی ماستەری نەگۆڕی شوان (Master Key):
                      </label>
                      <input
                        type="password"
                        placeholder="کلیلی ماستەری تایبەتی شوان بنووسە..."
                        value={recoveryMasterKey}
                        onChange={(e) => setRecoveryMasterKey(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm font-mono text-amber-400 tracking-wider focus:outline-none focus:border-amber-500"
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                        تێپەڕەوشەی نوێ (New Password):
                      </label>
                      <input
                        type="password"
                        placeholder="تێپەڕەوشەی نوێی خۆت بنووسە..."
                        value={recoveryNewPin}
                        onChange={(e) => setRecoveryNewPin(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm font-mono text-zinc-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                        دووبارەکردنەوەی تێپەڕەوشەی نوێ:
                      </label>
                      <input
                        type="password"
                        placeholder="دووبارە تێپەڕەوشەکە بنووسەوە..."
                        value={recoveryConfirmPin}
                        onChange={(e) => setRecoveryConfirmPin(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm font-mono text-zinc-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {recoveryError && (
                      <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{recoveryError}</span>
                      </div>
                    )}

                    {recoverySuccess && (
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>{recoverySuccess}</span>
                      </div>
                    )}

                    <div className="pt-2 flex gap-2">
                      <button
                        type="submit"
                        disabled={isRecovering}
                        className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50"
                      >
                        {isRecovering ? 'خەریکی سەندنەوەیە...' : 'سەندنەوەی کۆنترۆڵ و دانانی پاسۆردی نوێ'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowRecoveryModal(false)}
                        className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded-xl"
                      >
                        پاشگەزبوونەوە
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Unlocked Admin Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Tabs Navigation */}
            <div className="flex items-center gap-1 sm:gap-2 px-4 pt-3 border-b border-zinc-800 bg-zinc-950/50 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
                  activeTab === 'products'
                    ? 'border-amber-500 text-amber-400 bg-zinc-900'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>کاڵاکان ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
                  activeTab === 'orders'
                    ? 'border-amber-500 text-amber-400 bg-zinc-900'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>داواکارییەکان ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
                  activeTab === 'analytics'
                    ? 'border-amber-500 text-amber-400 bg-zinc-900'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>ئامار و فرۆش</span>
              </button>

              <button
                onClick={() => setActiveTab('promos')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
                  activeTab === 'promos'
                    ? 'border-amber-500 text-amber-400 bg-zinc-900'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Ticket className="w-4 h-4" />
                <span>کۆدەکانی داشکاندن</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
                  activeTab === 'settings'
                    ? 'border-amber-500 text-amber-400 bg-zinc-900'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>ڕێکخستنەکانی پێشەنگا</span>
              </button>

              <button
                onClick={() => setActiveTab('delivery')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
                  activeTab === 'delivery'
                    ? 'border-amber-500 text-amber-400 bg-zinc-900'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>کرێی گەیاندنی شارەکان</span>
              </button>

              <button
                onClick={() => setActiveTab('backup')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
                  activeTab === 'backup'
                    ? 'border-amber-500 text-amber-400 bg-zinc-900'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>پاشەکەوت و هەناردە</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              
              {/* TAB 1: PRODUCTS MANAGER */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  
                  {/* Top Bar for Products */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-black text-white">لیستی سەرجەم کاڵاکانی پێشەنگا</h3>
                      <p className="text-xs text-zinc-400">دەتوانیت کاڵای نوێ زیاد بکەیت، نرخ و وێنە دەستکاری بکەیت.</p>
                    </div>

                    <button
                      id="btn-add-new-product"
                      onClick={handleOpenAddProduct}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>زیادکردنی کاڵای نوێ</span>
                    </button>
                  </div>

                  {/* Product Cards Table / List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {products.map((prod) => (
                      <div
                        key={prod.id}
                        className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between space-y-3"
                      >
                        <div className="flex gap-3">
                          <img
                            src={prod.images[0]}
                            alt={prod.titleKu}
                            className="w-16 h-16 rounded-lg object-cover bg-zinc-900 border border-zinc-800 shrink-0"
                          />
                          <div className="flex-1 min-w-0 space-y-1">
                            <span className="text-[10px] font-mono text-zinc-500 block">{prod.sku}</span>
                            <h4 className="text-xs font-bold text-white line-clamp-1">{prod.titleKu}</h4>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-xs font-black text-amber-400">
                                {formatPrice(prod.priceIqd, 'IQD')}
                              </span>
                              <span className="text-[10px] text-zinc-500 font-mono">
                                ({formatPrice(prod.priceUsd, 'USD')})
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px]">
                              <span className={prod.inStock ? 'text-emerald-400' : 'text-rose-400'}>
                                {prod.inStock ? `بەردەستە (${prod.stockCount})` : 'نەماوە'}
                              </span>
                              {prod.badgeKu && (
                                <span className="bg-zinc-800 text-amber-400 px-1.5 py-0.2 rounded font-bold">
                                  {prod.badgeKu}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="flex items-center gap-1 text-zinc-300 hover:text-amber-400 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>دەستکاری</span>
                          </button>

                          <button
                            onClick={() => handleDuplicateProduct(prod)}
                            className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors"
                            title="کۆپیکردن"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>کۆپی</span>
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="flex items-center gap-1 text-zinc-500 hover:text-rose-400 transition-colors"
                            title="سڕینەوە"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>سڕینەوە</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* TAB 2: ORDERS LOG */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-white">تۆماری داواکارییەکانی کڕیاران</h3>
                      <p className="text-xs text-zinc-400">ئەو داواکارییانەی لە ڕێگەی سەبەتە یان واتسئاپەوە نێردراون.</p>
                    </div>
                  </div>

                  {orders.length === 0 ? (
                    <div className="p-8 text-center text-zinc-500 bg-zinc-950 rounded-2xl border border-zinc-800">
                      تا ئێستا هیچ داواکارییەک تۆمار نەکراوە. لەگەڵ کڕینی یەکەم داواکاری لە سەبەتەوە، لێرەدا دەردەکەوێت.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((ord) => (
                        <div
                          key={ord.id}
                          className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-amber-400">#{ord.orderNumber}</span>
                              <span className="text-xs font-bold text-white">{ord.customerName}</span>
                              <span className="text-[11px] text-zinc-500">({ord.cityName})</span>
                            </div>

                            {/* Status Selector */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-zinc-400">دۆخ:</span>
                              <select
                                value={ord.status}
                                onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as any)}
                                className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-200 font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
                              >
                                <option value="new">نوێ (New)</option>
                                <option value="contacted">پەیوەندی پێوەکرا</option>
                                <option value="shipped">نێردرا بۆ گەیاندن</option>
                                <option value="completed">گەیەندرا و تەواو بوو</option>
                                <option value="cancelled">هەڵوەشایەوە</option>
                              </select>
                            </div>
                          </div>

                          {/* Order Details & Contact */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-300">
                            <div className="space-y-1">
                              <p className="flex items-center gap-1.5 text-zinc-400">
                                <span>📞 مۆبایل:</span>
                                <a href={`tel:${ord.customerPhone}`} className="text-amber-400 font-mono font-bold hover:underline" dir="ltr">
                                  {ord.customerPhone}
                                </a>
                              </p>
                              <p className="text-zinc-400">
                                <span>📍 ناونیشان:</span> <span className="text-zinc-200">{ord.fullAddress}</span>
                              </p>
                              <p className="flex items-center gap-1 text-zinc-400">
                                <span>💳 شێوازی پارەدان:</span>
                                <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                                  ord.paymentMethod === 'fastpay' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                                  ord.paymentMethod === 'fib' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' :
                                  ord.paymentMethod === 'superqi' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                  'bg-zinc-800 text-zinc-300'
                                }`}>
                                  {ord.paymentMethod === 'fastpay' ? 'فاستپەی (FastPay)' :
                                   ord.paymentMethod === 'fib' ? 'بانکی FIB' :
                                   ord.paymentMethod === 'superqi' ? 'سوپەر کی (Super Qi)' :
                                   'کاش لەکاتی وەرگرتن'}
                                </span>
                              </p>
                              {ord.paymentDetails && (
                                <p className="text-zinc-400 text-[11px]">
                                  <span>🧾 کۆدی حەواڵە/وەسڵ:</span> <span className="font-mono text-amber-300">{ord.paymentDetails}</span>
                                </p>
                              )}
                              {ord.notes && (
                                <p className="text-zinc-400 italic">
                                  <span>📝 تێبینی:</span> {ord.notes}
                                </p>
                              )}
                            </div>

                            <div className="space-y-1 sm:text-left">
                              <p className="text-zinc-400">
                                <span>کۆی گشتی:</span> <span className="text-amber-400 font-black text-sm">{formatPrice(ord.totalIqd, 'IQD')}</span>
                              </p>
                              <div className="text-[11px] text-zinc-400">
                                {ord.items.map((it, idx) => (
                                  <span key={idx} className="block">
                                    • {it.titleKu} ({it.quantity} دانە)
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Order Actions: Print Invoice & One-Click WhatsApp Status Updates */}
                          <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2">
                            {/* Left: Print Invoice */}
                            <div>
                              {onPrintInvoice && (
                                <button
                                  type="button"
                                  onClick={() => onPrintInvoice(ord)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors shadow-sm"
                                >
                                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                                  <span>چاپکردنی وەسڵ (فاتورە)</span>
                                </button>
                              )}
                            </div>

                            {/* Right: Quick Status Actions & WhatsApp */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[11px] text-zinc-500 font-bold ml-1">ئاگادارکردنەوە لە واتسئاپ:</span>
                              
                              <button
                                type="button"
                                onClick={() => {
                                  onUpdateOrderStatus(ord.id, 'contacted');
                                  const url = generateCustomerStatusWhatsAppUrl(ord, 'contacted', settings);
                                  window.open(url, '_blank');
                                }}
                                title="پەیوەندی کرا و کڕیار ئاگادار بکەرەوە"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 text-[11px] font-bold transition-colors"
                              >
                                <span>پەیوەندی کرا 📞</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  onUpdateOrderStatus(ord.id, 'shipped');
                                  const url = generateCustomerStatusWhatsAppUrl(ord, 'shipped', settings);
                                  window.open(url, '_blank');
                                }}
                                title="بەڕێکراوە و کڕیار ئاگادار بکەرەوە"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-400 text-[11px] font-bold transition-colors"
                              >
                                <span>بەڕێکراوە 🚚</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  onUpdateOrderStatus(ord.id, 'completed');
                                  const url = generateCustomerStatusWhatsAppUrl(ord, 'completed', settings);
                                  window.open(url, '_blank');
                                }}
                                title="تەواوبوو و سوپاسی کڕیار بکە"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-[11px] font-bold transition-colors"
                              >
                                <span>تەواوبوو ✅</span>
                              </button>

                              <a
                                href={`https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`سڵاو ${ord.customerName} گیان لە پێشەنگای شوانەوە پەیوەندیت پێوە دەکەین دەربارەی داواکاری #${ord.orderNumber}`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] text-xs font-bold transition-colors"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>نامە</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: ANALYTICS & SALES REPORT */}
              {activeTab === 'analytics' && (
                <AdminAnalyticsTab
                  orders={orders}
                  products={products}
                  settings={settings}
                  currency={currency}
                />
              )}

              {/* TAB: PROMO CODES */}
              {activeTab === 'promos' && (
                <AdminPromosTab
                  settings={settings}
                  onSaveSettings={onSaveSettings}
                />
              )}

              {/* TAB 3: SHOP SETTINGS */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettingsSubmit} className="space-y-4 max-w-2xl">
                  <h3 className="text-base font-black text-white">زانیارییە سەرەکییەکانی پێشەنگای شوان</h3>
                  
                  {saveSuccessMsg && (
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>{saveSuccessMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-zinc-400 mb-1 font-bold">ناوی دوکان / پێشەنگا (کوردی)</label>
                      <input
                        type="text"
                        value={settingsForm.shopNameKu}
                        onChange={(e) => setSettingsForm({ ...settingsForm, shopNameKu: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-500 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1 font-bold">ناوی پێشەنگا (ئینگلیزی)</label>
                      <input
                        type="text"
                        value={settingsForm.shopNameEn}
                        onChange={(e) => setSettingsForm({ ...settingsForm, shopNameEn: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1 font-bold">ژمارەی واتسئاپ بۆ وەرگرتنی داواکاری *</label>
                      <input
                        type="text"
                        value={settingsForm.whatsappNumber}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                        dir="ltr"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-amber-500 text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1 font-bold">ژمارەی مۆبایلی سەرەکی بۆ پەیوەندی</label>
                      <input
                        type="text"
                        value={settingsForm.phonePrimary}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phonePrimary: e.target.value })}
                        dir="ltr"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-amber-500 text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1 font-bold">حیسابی ئینستاگرام (@)</label>
                      <input
                        type="text"
                        value={settingsForm.instagramHandle}
                        onChange={(e) => setSettingsForm({ ...settingsForm, instagramHandle: e.target.value })}
                        dir="ltr"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-amber-500 text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1 font-bold">نرخی ئاڵوگۆڕی ١ دۆلار بە دینار (Exchange Rate)</label>
                      <input
                        type="number"
                        value={settingsForm.usdToIqdRate}
                        onChange={(e) => setSettingsForm({ ...settingsForm, usdToIqdRate: Number(e.target.value) })}
                        dir="ltr"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-amber-500 text-right"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-zinc-400 mb-1 font-bold">ناونیشانی شوێنی پێشەنگا لە کوردستان</label>
                      <input
                        type="text"
                        value={settingsForm.addressKu}
                        onChange={(e) => setSettingsForm({ ...settingsForm, addressKu: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-zinc-400 mb-1 font-bold">ڕاگەیاندنی سەرەوە (Announcement Bar)</label>
                      <input
                        type="text"
                        value={settingsForm.announcementKu}
                        onChange={(e) => setSettingsForm({ ...settingsForm, announcementKu: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-400 mb-1 font-bold">تێپەڕەوشەی سەرەکی پنێڵ (Password / PIN)</label>
                      <input
                        type="text"
                        value={settingsForm.adminPin}
                        onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-amber-400 font-mono text-base focus:outline-none focus:border-amber-500 font-bold"
                      />
                      <p className="text-[11px] text-zinc-500 mt-1">ئەم تێپەڕەوشەیە لەسەر هەموو مۆبایل و ئامێرەکان بە شێوەی ئۆنلاین هاوکات (Sync) دەبێت.</p>
                    </div>

                    {/* Iraqi Local Payment Methods Configuration */}
                    <div className="sm:col-span-2 p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                      <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm border-b border-zinc-800 pb-2">
                        <CreditCard className="w-4 h-4 text-amber-400" />
                        <span>ئەژمێرەکانی پارەدانی ئەلیکترۆنی لە کوردستان (FastPay / FIB / Super Qi)</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-zinc-400 mb-1 font-bold">ژمارەی فاستپەی (FastPay)</label>
                          <input
                            type="text"
                            placeholder="0750 xxx xxxx"
                            value={settingsForm.fastPayNumber || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, fastPayNumber: e.target.value })}
                            dir="ltr"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 font-mono text-left focus:outline-none focus:border-amber-500 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-zinc-400 mb-1 font-bold">ئەژمێری بانکی یەکەم (FIB)</label>
                          <input
                            type="text"
                            placeholder="ژمارەی ئەژمێری FIB"
                            value={settingsForm.fibAccountNumber || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, fibAccountNumber: e.target.value })}
                            dir="ltr"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 font-mono text-left focus:outline-none focus:border-amber-500 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-zinc-400 mb-1 font-bold">ئەژمێری سوپەر کی (Super Qi)</label>
                          <input
                            type="text"
                            placeholder="ژمارەی کارتی کی"
                            value={settingsForm.superQiNumber || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, superQiNumber: e.target.value })}
                            dir="ltr"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 font-mono text-left focus:outline-none focus:border-amber-500 text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-zinc-400 mb-1 font-bold">ڕێنمایی بۆ کڕیار دەربارەی ناردنی پارە (ئارەزوومەندانە)</label>
                        <input
                          type="text"
                          placeholder="نموونە: دوای ناردنی بڕەکە، وێنەی وەسڵەکە لە واتسئاپ بنێرە..."
                          value={settingsForm.paymentInstructionsKu || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, paymentInstructionsKu: e.target.value })}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-500 text-xs"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-zinc-400 mb-1 font-bold">لینکی فەرمی پێشەنگای شوان (بۆ کڕیاران و بارکۆد)</label>
                      <input
                        type="text"
                        value={settingsForm.customStoreUrl || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, customStoreUrl: e.target.value })}
                        placeholder="https://ais-pre-cegnzsal62axn53jlnbzue-513231421546.europe-west2.run.app"
                        dir="ltr"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-amber-400 font-mono text-xs focus:outline-none focus:border-amber-500 text-left"
                      />
                      <p className="text-[11px] text-zinc-500 mt-1">ئەمە ئەو بەستەرەیە کە کڕیاران دەچنە سەری کاتێک بارکۆد سکان دەکەن یان لە بایۆ دایئەنێیت.</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black text-sm rounded-xl transition-all shadow-md"
                  >
                    پاشەکەوتکردنی ڕێکخستنەکان
                  </button>
                </form>
              )}

              {/* TAB 4: DELIVERY FEES */}
              {activeTab === 'delivery' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-black text-white">تێچووی گەیاندن بۆ شار و ناوچەکانی کوردستان</h3>
                    <p className="text-xs text-zinc-400">دەتوانیت نرخی گەیاندن و کاتی پێشبینیکراو بۆ هەر شارێک دیاری بکەیت.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {cities.map((city, idx) => (
                      <div key={city.id} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
                        <div className="flex items-center justify-between font-bold text-white">
                          <span>{city.nameKu}</span>
                          <span className="font-mono text-zinc-400 text-[11px]">{city.nameEn}</span>
                        </div>
                        <div className="space-y-1 text-zinc-300">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400">کرێی گەیاندن (دینار):</span>
                            <input
                              type="number"
                              value={city.feeIqd}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                const updated = [...cities];
                                updated[idx].feeIqd = val;
                                updated[idx].feeUsd = Math.round((val / settings.usdToIqdRate) * 10) / 10;
                                onSaveCities(updated);
                              }}
                              className="w-24 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-amber-400 font-mono text-left focus:outline-none"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-400">کاتی گەیاندن:</span>
                            <input
                              type="text"
                              value={city.estimateKu}
                              onChange={(e) => {
                                const updated = [...cities];
                                updated[idx].estimateKu = e.target.value;
                                onSaveCities(updated);
                              }}
                              className="w-32 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-zinc-200 text-xs focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: BACKUP & DATA */}
              {activeTab === 'backup' && (
                <div className="space-y-5 max-w-xl text-xs">
                  <div>
                    <h3 className="text-base font-black text-white">پاشەکەوت و کۆنترۆڵی داتای پێشەنگا</h3>
                    <p className="text-zinc-400">هەموو کاڵا و نرخی پێشەنگاکەت لێرەدا دەتوانیت هەناردەی فایل بکەیت تا هەرگیز لەدەستی نەدەیت.</p>
                  </div>

                  <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <Download className="w-4 h-4 text-amber-400" />
                      <span>داگرتنی فایلی یەدەگ (Backup JSON)</span>
                    </h4>
                    <p className="text-zinc-400">
                      کلیک لێرە بکە بۆ دابەزاندنی تەواوی داتای کاڵاکان، نرخەکان و ڕێکخستنەکان لەناو فایلی JSON.
                    </p>
                    <button
                      onClick={handleExportJson}
                      className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold rounded-xl transition-all flex items-center gap-2"
                    >
                      <FileJson className="w-4 h-4 text-amber-400" />
                      <span>داگرتنی فایلی یەدەگ</span>
                    </button>
                  </div>

                  <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-3">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>گەڕاندنەوەی فایلی یەدەگ (Restore Backup)</span>
                    </h4>
                    <p className="text-zinc-400">
                      ئەگەر فایلی یەدەگی پێشووت هەیە، لێرەوە دەتوانیت هەڵیبژێریت و باربکرێتەوە.
                    </p>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJson}
                      className="text-xs text-zinc-400 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer"
                    />
                  </div>

                  <div className="p-4 bg-rose-950/20 rounded-2xl border border-rose-500/30 space-y-3">
                    <h4 className="font-bold text-rose-300 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-rose-400" />
                      <span>گەڕاندنەوە بۆ دۆخی سەرەتایی پێشەنگای شوان</span>
                    </h4>
                    <p className="text-zinc-400">
                      ئەم دوگمەیە هەموو داتاکان دەگەڕێنێتەوە بۆ کاڵا مۆدێرنە سەرەتاییەکانی پێشەنگای شوان.
                    </p>
                    <button
                      onClick={() => {
                        if (window.confirm('ئایا دڵنیایت لە گەڕاندنەوە بۆ کاڵا سەرەتاییەکان؟')) {
                          onResetAllData();
                          alert('پێشەنگا گەڕێنرایەوە بۆ دۆخی سەرەتایی!');
                        }
                      }}
                      className="px-4 py-2 bg-rose-600/80 hover:bg-rose-600 text-white font-bold rounded-xl transition-all"
                    >
                      گەڕاندنەوە بۆ کەتەلۆکی سەرەتایی
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* Modal for Adding/Editing a single Product */}
        {isEditingProduct && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4 my-auto text-right max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-base font-black text-white">
                  {editingProductId ? 'دەستکاریکردنی کاڵا' : 'زیادکردنی کاڵای نوێ بۆ پێشەنگای شوان'}
                </h3>
                <button
                  onClick={() => setIsEditingProduct(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProductForm} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-zinc-400 mb-1 font-bold">ناوی کاڵا (کوردی) *</label>
                    <input
                      type="text"
                      required
                      placeholder="نموونە: کاتژمێری زیرەک، بۆنی فەخم، هێدفۆن..."
                      value={productForm.titleKu}
                      onChange={(e) => setProductForm({ ...productForm, titleKu: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-100 text-sm font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-bold">ناوی کاڵا (ئینگلیزی)</label>
                    <input
                      type="text"
                      placeholder="Product Name in English"
                      value={productForm.titleEn}
                      onChange={(e) => setProductForm({ ...productForm, titleEn: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-bold">بەش (Category)</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      {categories.filter(c => c.id !== 'all').map((c) => (
                        <option key={c.id} value={c.id}>{c.nameKu}</option>
                      ))}
                    </select>
                  </div>

                  {/* Pricing */}
                  <div>
                    <label className="block text-zinc-400 mb-1 font-bold">نرخ بە دینار (IQD) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.priceIqd}
                      onChange={(e) => {
                        const iqd = Number(e.target.value);
                        setProductForm({
                          ...productForm,
                          priceIqd: iqd,
                          priceUsd: Math.round((iqd / settings.usdToIqdRate) * 10) / 10,
                        });
                      }}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-bold">نرخ بە دۆلار (USD $)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={productForm.priceUsd}
                      onChange={(e) => setProductForm({ ...productForm, priceUsd: Number(e.target.value) })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Original Price for discount */}
                  <div>
                    <label className="block text-zinc-400 mb-1 font-bold">نرخی پێش داشکاندن (ئارەزوومەندانە)</label>
                    <input
                      type="number"
                      placeholder="نموونە: 50000"
                      value={productForm.originalPriceIqd || ''}
                      onChange={(e) => {
                        const origIqd = Number(e.target.value);
                        setProductForm({
                          ...productForm,
                          originalPriceIqd: origIqd,
                          originalPriceUsd: origIqd ? Math.round((origIqd / settings.usdToIqdRate) * 10) / 10 : 0
                        });
                      }}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-bold">کۆدی کاڵا (SKU)</label>
                    <input
                      type="text"
                      value={productForm.sku}
                      onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-bold">باج / بریکارنامە (Badge)</label>
                    <input
                      type="text"
                      placeholder="نموونە: پڕفرۆشترین 🔥، نوێ ✨"
                      value={productForm.badgeKu || ''}
                      onChange={(e) => setProductForm({ ...productForm, badgeKu: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-bold">ژمارەی بەردەست لە کۆگا (Stock)</label>
                    <input
                      type="number"
                      value={productForm.stockCount}
                      onChange={(e) => setProductForm({ ...productForm, stockCount: Number(e.target.value) })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Variants: Colors & Sizes */}
                  <div>
                    <label className="block text-zinc-400 mb-1 font-bold">ڕەنگە بەردەستەکان (بە فاریزە جیاکراوەتەوە)</label>
                    <input
                      type="text"
                      placeholder="نموونە: ڕەش, سپی, شین, زێڕین"
                      value={productForm.colorInput || ''}
                      onChange={(e) => setProductForm({ ...productForm, colorInput: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-500"
                    />
                    <p className="text-[10px] text-zinc-500 mt-1">ڕەنگەکان بە فاریزە جیا بکەرەوە، بۆ نموونە: ڕەش, سپی, شین</p>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-bold">قەبارە بەردەستەکان (Sizes - بە فاریزە)</label>
                    <input
                      type="text"
                      placeholder="نموونە: S, M, L, XL یان قەبارەی ئاسایی"
                      value={productForm.sizeInput || ''}
                      onChange={(e) => setProductForm({ ...productForm, sizeInput: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-amber-500"
                    />
                    <p className="text-[10px] text-zinc-500 mt-1">قەبارەکان بە فاریزە بنووسە: S, M, L, XL</p>
                  </div>
                </div>

                {/* Image Upload or URL */}
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <label className="block text-zinc-400 font-bold">وێنەی کاڵا (لینکی وێنە یان بارکردن لە مۆبایل/کۆمپیوتەر)</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="لینکی وێنە (https://...)"
                      value={productForm.images?.[0] || ''}
                      onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 font-mono text-xs focus:outline-none focus:border-amber-500"
                    />
                    <label className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-xl cursor-pointer shrink-0 flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>بارکردن</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                  {productForm.images?.[0] && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950">
                      <img src={productForm.images[0]} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-zinc-400 mb-1 font-bold">وەسف و ڕوونکردنەوەی کاڵا (کوردی)</label>
                  <textarea
                    rows={3}
                    placeholder="تایبەتمەندییەکان و وەسفی کاڵاکە بۆ کڕیاران بنووسە..."
                    value={productForm.descriptionKu}
                    onChange={(e) => setProductForm({ ...productForm, descriptionKu: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Stock Toggle & Featured Toggle */}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.inStock}
                      onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-zinc-950 border-zinc-700"
                    />
                    <span className="font-bold text-zinc-200">بەردەستە لە کۆگا</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isFeatured}
                      onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-zinc-950 border-zinc-700"
                    />
                    <span className="font-bold text-amber-400">نیشاندان لە پێشنیارکراوە سەرەکییەکان ⭐</span>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsEditingProduct(false)}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold"
                  >
                    پاشگەزبوونەوە
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold shadow-md"
                  >
                    پاشەکەوتکردنی کاڵا
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
