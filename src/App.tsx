import React, { useState, useEffect, useMemo } from 'react';
import { 
  initialCategories, 
  initialProducts, 
  initialShopSettings, 
  kurdistanCities 
} from './data/initialData';
import { 
  Category, 
  CityDelivery, 
  CartItem, 
  OrderRecord, 
  Product, 
  ShopSettings 
} from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CategoryPills } from './components/CategoryPills';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ShareModal } from './components/ShareModal';
import { AdminPanel } from './components/AdminPanel';
import { InvoiceModal } from './components/InvoiceModal';
import { ProductQrModal } from './components/ProductQrModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { WholesaleModal } from './components/WholesaleModal';
import { SmartAssistantModal } from './components/SmartAssistantModal';
import { AppInstallModal } from './components/AppInstallModal';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Sparkles, ShoppingBag, CheckCircle, PackageSearch } from 'lucide-react';
import { playOrderNotificationSound } from './utils/audio';

const STORAGE_KEYS = {
  PRODUCTS: 'peshangay_shwan_products_v1',
  CATEGORIES: 'peshangay_shwan_categories_v1',
  CITIES: 'peshangay_shwan_cities_v1',
  SETTINGS: 'peshangay_shwan_settings_v1',
  ORDERS: 'peshangay_shwan_orders_v1',
  WISHLIST: 'peshangay_shwan_wishlist_v1',
  CART: 'peshangay_shwan_cart_v1',
  CURRENCY: 'peshangay_shwan_currency_v1',
  THEME: 'peshangay_shwan_theme_v1',
};

export default function App() {
  // --- Persistent States ---
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : initialCategories;
    } catch {
      return initialCategories;
    }
  });

  const [cities, setCities] = useState<CityDelivery[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CITIES);
      return saved ? JSON.parse(saved) : kurdistanCities;
    } catch {
      return kurdistanCities;
    }
  });

  const [settings, setSettings] = useState<ShopSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : initialShopSettings;
    } catch {
      return initialShopSettings;
    }
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currency, setCurrency] = useState<'IQD' | 'USD'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENCY);
      return (saved === 'USD' || saved === 'IQD') ? saved : 'IQD';
    } catch {
      return 'IQD';
    }
  });

  // --- UI and Filter States ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [onlySale, setOnlySale] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');

  // --- Theme State ---
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  // --- Modals State ---
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState<OrderRecord | null>(null);
  const [qrProduct, setQrProduct] = useState<Product | null>(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isWholesaleOpen, setIsWholesaleOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isInstallOpen, setIsInstallOpen] = useState(false);

  // --- Toast notification ---
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // --- Initial & Real-Time Synchronization with Shared Server Store (Multi-Admin Live Sync) ---
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let fallbackInterval: NodeJS.Timeout | null = null;
    let currentVersion = 0;

    const applyStoreUpdate = (data: any) => {
      if (!data) return;
      if (data.settings) {
        setSettings(data.settings);
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      }
      if (data.products && Array.isArray(data.products) && data.products.length > 0) {
        setProducts(data.products);
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data.products));
      }
      if (data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
        setCategories(data.categories);
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(data.categories));
      }
      if (data.cities && Array.isArray(data.cities) && data.cities.length > 0) {
        setCities(data.cities);
        localStorage.setItem(STORAGE_KEYS.CITIES, JSON.stringify(data.cities));
      }
      if (data.orders && Array.isArray(data.orders)) {
        setOrders(prevOrders => {
          if (prevOrders.length > 0 && data.orders.length > prevOrders.length) {
            playOrderNotificationSound();
            showToast(`داواکارییەکی نوێ گەیشت! 🔔 (${data.orders[0]?.customerName || ''})`);
          }
          return data.orders;
        });
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(data.orders));
      }
    };

    // 1. Initial manual fetch
    const syncWithServer = async () => {
      try {
        const res = await fetch('/api/store');
        if (res.ok) {
          const data = await res.json();
          currentVersion = data.version || Date.now();
          applyStoreUpdate(data);
        }
      } catch (err) {
        console.warn('Using offline cached store', err);
      }
    };
    syncWithServer();

    // 2. Setup Server-Sent Events (SSE) for instant live push to all 3-4 admins
    try {
      eventSource = new EventSource('/api/store/live');

      eventSource.addEventListener('init', (e: MessageEvent) => {
        try {
          const parsed = JSON.parse(e.data);
          currentVersion = parsed.version || Date.now();
          if (parsed.store) {
            applyStoreUpdate(parsed.store);
          }
        } catch (err) {
          console.error('Failed parsing init SSE', err);
        }
      });

      eventSource.addEventListener('update', (e: MessageEvent) => {
        try {
          const parsed = JSON.parse(e.data);
          currentVersion = parsed.version || Date.now();
          if (parsed.store) {
            applyStoreUpdate(parsed.store);
          }
        } catch (err) {
          console.error('Failed parsing update SSE', err);
        }
      });

      eventSource.onerror = () => {
        // SSE will reconnect automatically
      };
    } catch (e) {
      console.warn('SSE connection init error, relying on polling fallback', e);
    }

    // 3. Setup periodic lightweight version polling every 4 seconds as reliable fallback
    fallbackInterval = setInterval(async () => {
      try {
        const vRes = await fetch('/api/store/version');
        if (vRes.ok) {
          const { version } = await vRes.json();
          if (version && version !== currentVersion) {
            currentVersion = version;
            const fullRes = await fetch('/api/store');
            if (fullRes.ok) {
              const fullData = await fullRes.json();
              applyStoreUpdate(fullData);
            }
          }
        }
      } catch {
        // Network quiet
      }
    }, 4000);

    return () => {
      if (eventSource) eventSource.close();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, []);

  // --- Syncing to LocalStorage ---
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CITIES, JSON.stringify(cities));
  }, [cities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
  }, [currency]);

  // Check URL Hash on load to see if a specific product link was opened
  useEffect(() => {
    const handleHashCheck = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#prod-')) {
        const prodId = hash.replace('#prod-', '');
        const target = products.find(p => p.id === prodId);
        if (target) {
          setSelectedProduct(target);
        }
      }
    };

    handleHashCheck();
    window.addEventListener('hashchange', handleHashCheck);
    return () => window.removeEventListener('hashchange', handleHashCheck);
  }, [products]);

  // --- Cart Operations ---
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`کاڵای "${product.titleKu}" زیادکرا بۆ سەبەتە`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // --- Wishlist Operations ---
  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const isExist = prev.includes(product.id);
      if (isExist) {
        showToast(`کاڵا لە دڵخوازەکان لادرا`);
        return prev.filter(id => id !== product.id);
      } else {
        showToast(`کاڵای "${product.titleKu}" خرایە دڵخوازەکان`);
        return [...prev, product.id];
      }
    });
  };

  const wishlistProducts = useMemo(() => {
    return products.filter(p => wishlist.includes(p.id));
  }, [products, wishlist]);

  // --- Order Created Listener ---
  const handleOrderCreated = async (newOrder: OrderRecord) => {
    playOrderNotificationSound();
    setOrders(prev => [newOrder, ...prev]);
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder }),
      });
    } catch (e) {
      console.error('Failed to sync order to server', e);
    }
  };

  // --- Synchronized Handlers for Admin Panel ---
  const handleSaveSettings = async (newSettings: ShopSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
    try {
      await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: newSettings }),
      });
      showToast('ڕێکخستنەکان لەسەر هەموو مۆبایلەکان نوێکرانەوە');
    } catch (e) {
      console.error('Failed to sync settings to server', e);
    }
  };

  const handleSaveProducts = async (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(newProducts));
    try {
      await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: newProducts }),
      });
    } catch (e) {
      console.error('Failed to sync products to server', e);
    }
  };

  const handleSaveCategories = async (newCategories: Category[]) => {
    setCategories(newCategories);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(newCategories));
    try {
      await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: newCategories }),
      });
    } catch (e) {
      console.error('Failed to sync categories to server', e);
    }
  };

  const handleSaveCities = async (newCities: CityDelivery[]) => {
    setCities(newCities);
    localStorage.setItem(STORAGE_KEYS.CITIES, JSON.stringify(newCities));
    try {
      await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cities: newCities }),
      });
    } catch (e) {
      console.error('Failed to sync cities to server', e);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderRecord['status']) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
    setOrders(updated);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
    try {
      await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders: updated }),
      });
    } catch (e) {
      console.error('Failed to sync order status update to server', e);
    }
  };

  // --- Reset All Data ---
  const handleResetAllData = async () => {
    setProducts(initialProducts);
    setCategories(initialCategories);
    setCities(kurdistanCities);
    setSettings(initialShopSettings);
    setOrders([]);
    setCart([]);
    setWishlist([]);
    setCurrency('IQD');
    localStorage.clear();
    try {
      await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: initialProducts,
          categories: initialCategories,
          cities: kurdistanCities,
          settings: initialShopSettings,
          orders: [],
        }),
      });
    } catch (e) {
      console.error('Failed to reset store on server', e);
    }
  };

  // --- Filtered and Sorted Products ---
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Sale filter
      if (onlySale) {
        const hasDiscount = Boolean(product.originalPriceIqd && product.originalPriceIqd > product.priceIqd);
        if (!hasDiscount) return false;
      }

      // In-stock filter
      if (onlyInStock && !product.inStock) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitleKu = product.titleKu.toLowerCase().includes(q);
        const matchTitleEn = product.titleEn.toLowerCase().includes(q);
        const matchSku = product.sku.toLowerCase().includes(q);
        const matchDesc = product.descriptionKu.toLowerCase().includes(q);
        return matchTitleKu || matchTitleEn || matchSku || matchDesc;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') {
        return a.priceIqd - b.priceIqd;
      }
      if (sortBy === 'price-desc') {
        return b.priceIqd - a.priceIqd;
      }
      if (sortBy === 'newest') {
        return (b.badgeType === 'new' ? 1 : 0) - (a.badgeType === 'new' ? 1 : 0);
      }
      // 'featured'
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, onlySale, onlyInStock, searchQuery, sortBy]);

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartItems = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-[#f8fafc] text-zinc-900' : 'bg-[#0f1115] text-[#f1f5f9]'} flex flex-col font-sans selection:bg-amber-500 selection:text-black transition-colors w-full max-w-full overflow-x-hidden`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-amber-500/50 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-in slide-in-from-bottom-5">
          <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        settings={settings}
        currency={currency}
        onToggleCurrency={() => setCurrency(prev => prev === 'IQD' ? 'USD' : 'IQD')}
        theme={theme}
        onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
        cartCount={totalCartItems}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenWholesale={() => setIsWholesaleOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenInstall={() => setIsInstallOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero Showroom Banner */}
      <HeroSection
        settings={settings}
        onOpenShare={() => setIsShareOpen(true)}
        onScrollToCatalog={scrollToCatalog}
      />

      {/* Main Catalog Area */}
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 w-full max-w-full min-w-0">
        
        {/* Category Bar & Filters */}
        <CategoryPills
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onlySale={onlySale}
          onToggleSale={() => setOnlySale(!onlySale)}
          onlyInStock={onlyInStock}
          onToggleInStock={() => setOnlyInStock(!onlyInStock)}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalProductsCount={products.length}
        />

        {/* Search Results indicator */}
        {searchQuery && (
          <div className="py-2 text-xs text-zinc-400 flex items-center justify-between">
            <span>
              ئەنجامەکانی گەڕان بۆ: <strong className="text-amber-400">"{searchQuery}"</strong> ({filteredProducts.length} کاڵا دۆزرایەوە)
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-amber-400 hover:underline font-bold"
            >
              سڕینەوەی گەڕان
            </button>
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-4 bg-zinc-900/40 rounded-2xl border border-zinc-800/80 my-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800 text-zinc-500 mx-auto flex items-center justify-center">
              <PackageSearch className="w-8 h-8" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              هیچ کاڵایەک نەدۆزرایەوە
            </h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              ببورە، بەپێی ئەم فلتەرانە کاڵایەک بەردەست نییە. دەتوانیت وشەی گەڕان بگۆڕیت یان هەموو کاڵاکان هەڵبژێریت.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setOnlySale(false);
                setOnlyInStock(false);
              }}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl shadow transition-all"
            >
              نیشاندانی هەموو کاڵاکان
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6 py-2 sm:py-4 w-full max-w-full">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                settings={settings}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                onViewDetails={setSelectedProduct}
                onOpenQr={(p) => setQrProduct(p)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        currency={currency}
        settings={settings}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onClose={() => {
          setSelectedProduct(null);
          // remove hash if any
          if (window.location.hash.startsWith('#prod-')) {
            history.replaceState(null, '', window.location.pathname);
          }
        }}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        currency={currency}
        settings={settings}
        cities={cities}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOrderCreated={handleOrderCreated}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlistProducts}
        currency={currency}
        onRemoveWishlist={handleToggleWishlist}
        onAddToCart={(p) => handleAddToCart(p, 1)}
        onViewDetails={setSelectedProduct}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        settings={settings}
      />

      {/* Product QR Code Modal */}
      <ProductQrModal
        isOpen={!!qrProduct}
        onClose={() => setQrProduct(null)}
        product={qrProduct}
        settings={settings}
      />

      {/* Printable Invoice Modal */}
      <InvoiceModal
        isOpen={!!invoiceOrder}
        onClose={() => setInvoiceOrder(null)}
        order={invoiceOrder}
        settings={settings}
      />

      {/* Admin Panel */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        categories={categories}
        cities={cities}
        orders={orders}
        settings={settings}
        currency={currency}
        onSaveProducts={handleSaveProducts}
        onSaveCategories={handleSaveCategories}
        onSaveCities={handleSaveCities}
        onSaveSettings={handleSaveSettings}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onResetAllData={handleResetAllData}
        onPrintInvoice={(ord) => setInvoiceOrder(ord)}
      />

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenWholesale={() => setIsWholesaleOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenInstall={() => setIsInstallOpen(true)}
      />

      {/* Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        orders={orders}
        settings={settings}
      />

      {/* Wholesale Inquiries Modal */}
      <WholesaleModal
        isOpen={isWholesaleOpen}
        onClose={() => setIsWholesaleOpen(false)}
        settings={settings}
      />

      {/* AI Smart Shopping Assistant Modal */}
      <SmartAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        products={products}
        currency={currency}
        settings={settings}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
          setIsAssistantOpen(false);
        }}
      />

      {/* App Installation Guide & PWA Modal for iOS and Android */}
      <AppInstallModal
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
        settings={settings}
      />

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav
        cartCount={totalCartItems}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onFocusSearch={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const mobileSearchBtn = document.getElementById('btn-mobile-search-toggle');
          if (mobileSearchBtn) mobileSearchBtn.click();
        }}
        settings={settings}
      />

      {/* Mobile Safe Bottom Padding so content isn't covered by bottom nav */}
      <div className="h-16 md:hidden" />

    </div>
  );
}
