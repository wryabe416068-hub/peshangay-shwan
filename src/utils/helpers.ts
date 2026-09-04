import { CartItem, CityDelivery, OrderRecord, Product, ShopSettings } from '../types';

export const PUBLIC_STORE_DEFAULT_URL = 'https://ais-pre-cegnzsal62axn53jlnbzue-513231421546.europe-west2.run.app';

export function formatPrice(amount: number, currency: 'IQD' | 'USD'): string {
  if (currency === 'USD') {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: amount % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}`;
  }
  return `${Math.round(amount).toLocaleString('en-US')} د.ع`;
}

export function calculateDiscount(original?: number, current?: number): number {
  if (!original || !current || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
}

/**
 * Gets the clean, public customer-facing storefront URL.
 * Prevents exposing AI Studio development/builder URLs when scanned or copied.
 */
export function getCleanStoreUrl(settings?: ShopSettings): string {
  if (settings?.customStoreUrl && settings.customStoreUrl.trim()) {
    return settings.customStoreUrl.trim();
  }

  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    // If running in development container or inside aistudio iframe, use the direct public shared app URL
    if (origin.includes('aistudio.google.com') || origin.includes('localhost') || origin.includes('ais-dev')) {
      return PUBLIC_STORE_DEFAULT_URL;
    }
    return `${origin}${window.location.pathname}`;
  }

  return PUBLIC_STORE_DEFAULT_URL;
}

export function generateWhatsAppOrderUrl(
  items: CartItem[],
  customer: { 
    name: string; 
    phone: string; 
    city: CityDelivery; 
    address: string; 
    notes?: string;
    paymentMethod?: 'cash' | 'fastpay' | 'fib' | 'superqi';
    paymentDetails?: string;
    hasReceiptImage?: boolean;
    discountCode?: string;
    discountAmount?: number;
    loyaltyPointsUsed?: number;
    loyaltyDiscount?: number;
    loyaltyPointsEarned?: number;
  },
  currency: 'IQD' | 'USD',
  settings: ShopSettings
): string {
  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const orderId = `SHW-${Math.floor(1000 + Math.random() * 9000)}`;

  let subtotal = 0;
  const itemLines = items.map((item, index) => {
    const itemPrice = currency === 'USD' ? item.product.priceUsd : item.product.priceIqd;
    const lineTotal = itemPrice * item.quantity;
    subtotal += lineTotal;
    const formattedLineTotal = formatPrice(lineTotal, currency);
    const variantInfo = [
      item.selectedColor ? `ڕەنگ: ${item.selectedColor}` : null,
      item.selectedSize ? `قەبارە: ${item.selectedSize}` : null,
    ].filter(Boolean).join(' | ');

    return `${index + 1}️⃣ *${item.product.titleKu}*\n   • بڕ: ${item.quantity} دانە${variantInfo ? ` (${variantInfo})` : ''}\n   • کۆی گشتی: ${formattedLineTotal} (کۆد: ${item.product.sku})`;
  }).join('\n\n');

  const deliveryFee = currency === 'USD' ? customer.city.feeUsd : customer.city.feeIqd;
  const isFreeDelivery = settings.freeDeliveryThresholdIqd > 0 && 
    (currency === 'IQD' ? subtotal : subtotal * settings.usdToIqdRate) >= settings.freeDeliveryThresholdIqd;
  const finalDeliveryFee = isFreeDelivery ? 0 : deliveryFee;

  const discountAmount = customer.discountAmount || 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + finalDeliveryFee);

  let paymentMethodKu = 'کاش لەکاتی وەرگرتن (Cash on Delivery)';
  if (customer.paymentMethod === 'fastpay') {
    paymentMethodKu = `فاستپەی (FastPay) 📱 - ژمارە: ${settings.fastPayNumber || 'بەردەستە'}`;
  } else if (customer.paymentMethod === 'fib') {
    paymentMethodKu = `بانکی یەکەمی عێراقی (FIB) 🏦 - ئەژمێر: ${settings.fibAccountNumber || 'بەردەستە'}`;
  } else if (customer.paymentMethod === 'superqi') {
    paymentMethodKu = `سوپەر کی (Super Qi) 💳 - ئەژمێر: ${settings.superQiNumber || 'بەردەستە'}`;
  }

  const message = `🛍️ *داواکاری نوێ لە پێشەنگای شوان (Peshangay Shwan)*
━━━━━━━━━━━━━━━━━━
🆔 *ژمارەی داواکاری:* #${orderId}
👤 *ناوی کڕیار:* ${customer.name}
📞 *ژمارەی مۆبایل:* ${customer.phone}
📍 *شار:* ${customer.city.nameKu}
🏠 *ناونیشانی تەواو:* ${customer.address}
💳 *شێوازی پارەدان:* ${paymentMethodKu}
${customer.paymentDetails ? `🧾 *کۆدی حەواڵە / تێبینی پارەدان:* ${customer.paymentDetails}\n` : ''}${customer.hasReceiptImage ? `📸 *وێنەی وەسڵ:* وێنەی وەسڵی حەواڵە لە ناو ئەپ هاوپێچ کراوە\n` : ''}${customer.notes ? `📝 *تێبینی:* ${customer.notes}\n` : ''}
━━━━━━━━━━━━━━━━━━
📦 *کاڵا هەڵبژێردراوەکان:*
${itemLines}

━━━━━━━━━━━━━━━━━━
💰 *کۆی کاڵاکان:* ${formatPrice(subtotal, currency)}
${customer.discountCode && discountAmount > 0 ? `🎟️ *داشکاندنی کۆد (${customer.discountCode}):* -${formatPrice(discountAmount, currency)}\n` : ''}${customer.loyaltyPointsUsed ? `💎 *داشکاندنی خاڵی کڕیاری دڵسۆز (${customer.loyaltyPointsUsed} خاڵ):* داشکێنرا\n` : ''}🚚 *تێچووی گەیاندن:* ${isFreeDelivery ? 'بێ بەرامبەر (Free) ✨' : formatPrice(finalDeliveryFee, currency)} (${customer.city.estimateKu})
⭐️ *کۆی گشتی کۆتایی:* ${formatPrice(grandTotal, currency)}
${customer.loyaltyPointsEarned ? `✨ *خاڵی زیادکراوی ئەم کڕینە:* +${customer.loyaltyPointsEarned} خاڵ بۆ کڕیار\n` : ''}━━━━━━━━━━━━━━━━━━
سڵاو پێشەنگای شوان، تکایە ئەم داواکاریەم بۆ تەئکید بکەنەوە و کاتی گەیاندنم پێ ڕابگەیەنن. سوپاس!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function generateCustomerStatusWhatsAppUrl(
  order: OrderRecord,
  status: OrderRecord['status'],
  settings: ShopSettings
): string {
  const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
  // Format international number if starting with 07
  const intlPhone = cleanPhone.startsWith('07') ? `964${cleanPhone.slice(1)}` : cleanPhone;

  let statusMsg = '';
  if (status === 'contacted') {
    statusMsg = `سڵاو بەڕێز ${order.customerName} گیان،\nداواکارییەکەت لە *پێشەنگای شوان* بە ژمارەی (#${order.orderNumber}) وەرگیراوە و لە ئێستادا ئامادە دەکرێت. هەر پرسیارێکت هەبوو دەتوانیت لێرەوە پێمان بڵێیت. سوپاس بۆ کڕینەکەت! 🌸`;
  } else if (status === 'shipped') {
    statusMsg = `سڵاو بەڕێز ${order.customerName} گیان،\nخۆشحاڵین پێتان ڕابگەیەنین داواکارییەکەت (#${order.orderNumber}) لە *پێشەنگای شوان* ئامادە کرا و ڕادەستی تیمی گەیاندن کرا بەرەو (${order.cityName}). ان شاء الله بەم زووانە شۆفێری دیلیڤەری پەیوەندیت پێوە دەکات. تکایە مۆبایلەکەت کراوە بێت. 🚚📦`;
  } else if (status === 'completed') {
    statusMsg = `سڵاو بەڕێز ${order.customerName} گیان،\nسوپاسی بێپایان بۆ هەڵبژاردنی *پێشەنگای شوان*. داواکارییەکەت گەیشتە دەستتان و تۆمار کرا بە تەواوبوو. هیوادارین کاڵاکانت بە دڵ بێت و جارێکی تریش خزمەتتان بکەینەوە! ⭐️⭐️⭐️⭐️⭐️`;
  } else if (status === 'cancelled') {
    statusMsg = `سڵاو بەڕێز ${order.customerName}،\nداواکارییەکەت بە ژمارەی (#${order.orderNumber}) لەسەر داوای بەڕێزتان یان بەهۆی تەواوبوونی ستۆک هەڵوەشێنرایەوە. دڵخۆش دەبین لە دەرفەتێکی تردا خزمەتت بکەینەوە لە پێشەنگای شوان.`;
  } else {
    statusMsg = `سڵاو بەڕێز ${order.customerName} گیان،\nداواکارییەکەت (#${order.orderNumber}) لە *پێشەنگای شوان* تۆمار کرا. پەیوەندیت پێوە دەکەین بۆ پشتڕاستکردنەوە.`;
  }

  return `https://wa.me/${intlPhone}?text=${encodeURIComponent(statusMsg)}`;
}

export function generateSingleProductWhatsAppUrl(
  product: Product,
  currency: 'IQD' | 'USD',
  settings: ShopSettings
): string {
  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const price = currency === 'USD' ? formatPrice(product.priceUsd, 'USD') : formatPrice(product.priceIqd, 'IQD');
  const storeCleanUrl = getCleanStoreUrl(settings);
  
  const text = `سڵاو پێشەنگای شوان 🌿
حەز دەکەم ئەم کاڵایەتان لێ بکڕم یان پرسیار لەسەر بکەم:
🛍️ *${product.titleKu}*
💰 نرخ: ${price}
🏷️ کۆد: ${product.sku}
🌐 بینین لە مارکێت: ${storeCleanUrl}#prod-${product.id}

تکایە چۆنیەتی گەیاندن و کاتی بەردەستبوونم پێ بڵێن. سوپاس!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export function getQrCodeUrl(url: string, size = 300): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&margin=10&color=0f1115&bgcolor=ffffff`;
}
