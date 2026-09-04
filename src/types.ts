export interface Product {
  id: string;
  titleKu: string;
  titleEn: string;
  category: string;
  priceIqd: number;
  priceUsd: number;
  originalPriceIqd?: number;
  originalPriceUsd?: number;
  discountPercent?: number;
  images: string[];
  descriptionKu: string;
  descriptionEn: string;
  inStock: boolean;
  stockCount: number;
  badgeKu?: string;
  badgeType?: 'hot' | 'sale' | 'new' | 'exclusive';
  sku: string;
  featuresKu: string[];
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  colors?: string[];
  sizes?: string[];
}

export interface Category {
  id: string;
  nameKu: string;
  nameEn: string;
  iconName: string;
  itemCount?: number;
}

export interface CityDelivery {
  id: string;
  nameKu: string;
  nameEn: string;
  feeIqd: number;
  feeUsd: number;
  estimateKu: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export type PaymentMethod = 'cash' | 'fastpay' | 'fib' | 'superqi';

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // percentage (e.g. 10 for 10%) or fixed IQD (e.g. 5000)
  minSpendIqd?: number;
  isActive: boolean;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  cityName: string;
  fullAddress: string;
  notes?: string;
  items: {
    productId: string;
    titleKu: string;
    quantity: number;
    priceIqd: number;
    priceUsd: number;
    selectedColor?: string;
    selectedSize?: string;
  }[];
  subtotalIqd: number;
  subtotalUsd: number;
  deliveryFeeIqd: number;
  deliveryFeeUsd: number;
  discountCode?: string;
  discountIqd?: number;
  discountUsd?: number;
  totalIqd: number;
  totalUsd: number;
  currencyUsed: 'IQD' | 'USD';
  paymentMethod?: PaymentMethod;
  paymentDetails?: string;
  receiptImage?: string;
  loyaltyPointsUsed?: number;
  loyaltyPointsEarned?: number;
  status: 'new' | 'contacted' | 'shipped' | 'completed' | 'cancelled';
}

export interface ProductReview {
  id: string;
  productId: string;
  customerName: string;
  cityKu: string;
  rating: number; // 1 to 5
  commentKu: string;
  createdAt: string;
  isVerifiedPurchase?: boolean;
}

export interface WholesaleInquiry {
  customerName: string;
  businessName?: string;
  phone: string;
  city: string;
  productOrCategory: string;
  estimatedQuantity: string;
  notes?: string;
}

export interface ShopSettings {
  shopNameKu: string;
  shopNameEn: string;
  taglineKu: string;
  taglineEn: string;
  ownerNameKu: string;
  phonePrimary: string;
  phoneSecondary?: string;
  whatsappNumber: string;
  viberNumber?: string;
  instagramHandle: string;
  tiktokHandle?: string;
  facebookPage?: string;
  telegramUsername?: string;
  addressKu: string;
  addressEn: string;
  usdToIqdRate: number; // e.g. 1500 (meaning $1 = 1500 IQD or $100 = 150,000 IQD)
  adminPin: string;
  masterRecoveryKey?: string;
  announcementKu: string;
  showAnnouncement: boolean;
  freeDeliveryThresholdIqd: number;
  customStoreUrl?: string;
  // Iraqi Local Payment Methods
  fastPayNumber?: string;
  fibAccountNumber?: string;
  superQiNumber?: string;
  paymentInstructionsKu?: string;
  // Promo codes
  promoCodes?: PromoCode[];
}
