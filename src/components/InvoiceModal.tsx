import React from 'react';
import { X, Printer, CheckCircle, MapPin, Phone, Calendar, CreditCard, ShieldCheck } from 'lucide-react';
import { OrderRecord, ShopSettings } from '../types';
import { formatPrice } from '../utils/helpers';

interface InvoiceModalProps {
  order: OrderRecord | null;
  settings: ShopSettings;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, settings, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const paymentLabel = 
    order.paymentMethod === 'fastpay' ? 'فاستپەی (FastPay)' :
    order.paymentMethod === 'fib' ? 'بانکی یەکەمی عێراقی (FIB)' :
    order.paymentMethod === 'superqi' ? 'سوپەر کی (Super Qi)' :
    'کاش لەکاتی وەرگرتن (Cash on Delivery)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      {/* Container */}
      <div className="relative w-full max-w-2xl bg-white text-zinc-900 rounded-2xl shadow-2xl overflow-hidden my-auto print:m-0 print:p-0 print:shadow-none print:w-full print:max-w-none">
        
        {/* Top Screen Action Bar (hidden on print) */}
        <div className="p-4 bg-zinc-900 text-white flex items-center justify-between print:hidden border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="font-black text-amber-400 text-sm sm:text-base">وەسڵی فەرمی فرۆشتن و گەیاندن</span>
            <span className="text-xs text-zinc-400 font-mono">#{order.orderNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-1.5 shadow transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>چاپکردن (Print / PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div id="printable-invoice" className="p-6 sm:p-8 space-y-6 text-right font-sans">
          
          {/* Shop Header */}
          <div className="flex flex-row-reverse justify-between items-start border-b-2 border-zinc-900 pb-5">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900">
                  {settings.shopNameKu}
                </h1>
                <p className="text-xs text-zinc-600 font-medium">{settings.shopNameEn}</p>
                <p className="text-[11px] text-zinc-500 mt-1 max-w-xs">{settings.addressKu}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-zinc-900 text-amber-400 flex items-center justify-center font-black text-2xl shrink-0 print:border print:border-black">
                ش
              </div>
            </div>

            <div className="text-left font-mono space-y-1">
              <div className="inline-block px-2.5 py-1 rounded bg-zinc-100 border border-zinc-300 text-xs font-black text-zinc-900">
                INVOICE #{order.orderNumber}
              </div>
              <p className="text-xs text-zinc-600 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>{new Date(order.createdAt).toLocaleDateString('ku', { dateStyle: 'medium' })}</span>
              </p>
              <p className="text-xs text-zinc-600">کاتی تۆمار: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>

          {/* Customer & Delivery Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs">
            <div className="space-y-1.5">
              <span className="text-[11px] font-black text-zinc-500 uppercase tracking-wider block">زانیاری کڕیار:</span>
              <p className="font-bold text-sm text-zinc-900">{order.customerName}</p>
              <p className="text-zinc-700 flex items-center gap-1.5 font-mono">
                <Phone className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span dir="ltr">{order.customerPhone}</span>
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-black text-zinc-500 uppercase tracking-wider block">شوێن و گەیاندن:</span>
              <p className="font-bold text-zinc-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>{order.cityName}</span>
              </p>
              <p className="text-zinc-600">{order.fullAddress}</p>
              {order.notes && (
                <p className="text-zinc-500 italic mt-1 bg-amber-50 p-1.5 rounded border border-amber-200">
                  تێبینی: {order.notes}
                </p>
              )}
            </div>
          </div>

          {/* Payment Method Badge */}
          <div className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-zinc-100 border border-zinc-200 text-xs">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-zinc-700" />
              <span className="text-zinc-600">شێوازی پارەدان:</span>
              <span className="font-bold text-zinc-900">{paymentLabel}</span>
            </div>
            {order.paymentDetails && (
              <div className="text-left font-mono text-[11px]">
                <span className="text-zinc-500">کۆدی حەواڵە: </span>
                <span className="font-bold text-zinc-900">{order.paymentDetails}</span>
              </div>
            )}
          </div>

          {/* Order Items Table */}
          <div className="overflow-hidden border border-zinc-200 rounded-xl">
            <table className="w-full text-xs text-right">
              <thead className="bg-zinc-900 text-white font-bold">
                <tr>
                  <th className="p-2.5 text-center w-10">#</th>
                  <th className="p-2.5">ناوی کاڵا و مۆدێل</th>
                  <th className="p-2.5 text-center">ژمارە</th>
                  <th className="p-2.5 text-left">نرخی یەکە</th>
                  <th className="p-2.5 text-left">کۆی پارە</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {order.items.map((item, index) => {
                  const unitPrice = order.currencyUsed === 'USD' ? item.priceUsd : item.priceIqd;
                  const totalItemPrice = unitPrice * item.quantity;
                  const variantText = [
                    item.selectedColor ? `ڕەنگ: ${item.selectedColor}` : null,
                    item.selectedSize ? `قەبارە: ${item.selectedSize}` : null,
                  ].filter(Boolean).join(' | ');

                  return (
                    <tr key={index} className="hover:bg-zinc-50">
                      <td className="p-2.5 text-center text-zinc-500 font-mono">{index + 1}</td>
                      <td className="p-2.5">
                        <span className="font-bold text-zinc-900 block">{item.titleKu}</span>
                        {variantText && (
                          <span className="text-[11px] text-zinc-500 block font-medium">{variantText}</span>
                        )}
                      </td>
                      <td className="p-2.5 text-center font-bold font-mono">{item.quantity}</td>
                      <td className="p-2.5 text-left font-mono">{formatPrice(unitPrice, order.currencyUsed)}</td>
                      <td className="p-2.5 text-left font-bold font-mono text-zinc-900">
                        {formatPrice(totalItemPrice, order.currencyUsed)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Price Breakdown Calculation */}
          <div className="flex justify-end">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-200 text-zinc-600">
                <span>کۆی گشتی کاڵاکان:</span>
                <span className="font-bold font-mono">
                  {formatPrice(order.currencyUsed === 'USD' ? order.subtotalUsd : order.subtotalIqd, order.currencyUsed)}
                </span>
              </div>

              {((order.discountIqd && order.discountIqd > 0) || (order.discountUsd && order.discountUsd > 0)) && (
                <div className="flex justify-between py-1 border-b border-zinc-200 text-rose-600 font-bold">
                  <span>داشکاندنی کۆد ({order.discountCode || 'کۆپۆن'}):</span>
                  <span className="font-mono">
                    -{formatPrice(order.currencyUsed === 'USD' ? (order.discountUsd || 0) : (order.discountIqd || 0), order.currencyUsed)}
                  </span>
                </div>
              )}

              <div className="flex justify-between py-1 border-b border-zinc-200 text-zinc-600">
                <span>تێچووی گەیاندن:</span>
                <span className="font-bold font-mono">
                  {formatPrice(order.currencyUsed === 'USD' ? order.deliveryFeeUsd : order.deliveryFeeIqd, order.currencyUsed)}
                </span>
              </div>

              <div className="flex justify-between py-2 border-t-2 border-zinc-900 text-base font-black text-zinc-900">
                <span>کۆی کۆتایی بۆ وەرگرتن:</span>
                <span className="font-mono text-amber-600">
                  {formatPrice(order.currencyUsed === 'USD' ? order.totalUsd : order.totalIqd, order.currencyUsed)}
                </span>
              </div>
            </div>
          </div>

          {/* Guarantee & Verification Footer */}
          <div className="pt-4 border-t border-zinc-300 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-2">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>کاڵاکان بە گەرەنتی تاقیکردنەوە و پشکنین دەگەنە دەستان.</span>
            </div>
            <div className="text-zinc-600 font-mono">
              پەیوەندی: {settings.phonePrimary} | واتسئاپ: {settings.whatsappNumber}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
