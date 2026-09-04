import React, { useEffect, useState } from 'react';
import { X, Printer, QrCode, Sparkles, ExternalLink, Download } from 'lucide-react';
import QRCode from 'qrcode';
import { Product, ShopSettings } from '../types';
import { formatPrice, getCleanStoreUrl } from '../utils/helpers';

interface ProductQrModalProps {
  product: Product | null;
  settings: ShopSettings;
  onClose: () => void;
}

export const ProductQrModal: React.FC<ProductQrModalProps> = ({ product, settings, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (!product) return;
    const storeUrl = getCleanStoreUrl(settings);
    const targetUrl = `${storeUrl}#prod-${product.id}`;

    QRCode.toDataURL(targetUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed generating QR code', err));
  }, [product, settings]);

  if (!product) return null;

  const handlePrintLabel = () => {
    window.print();
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QR-${product.sku}-${product.titleKu.slice(0, 15)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const storeUrl = getCleanStoreUrl(settings);
  const targetUrl = `${storeUrl}#prod-${product.id}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-auto text-right print:m-0 print:p-0 print:shadow-none print:w-full print:bg-white print:text-black">
        
        {/* Header Bar */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80 print:hidden">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">کۆدی QR بۆ پێشەنگا (In-Store Tag)</h3>
              <p className="text-[10px] text-zinc-400">بۆ دانان لەسەر کاڵاکان بۆ کڕیاری ناو پێشەنگا</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Label Area */}
        <div id="printable-qr-tag" className="p-6 text-center space-y-4 print:p-4 print:text-black">
          {/* Label Card */}
          <div className="p-5 rounded-2xl bg-white text-zinc-900 border-2 border-zinc-900 shadow-xl space-y-3 mx-auto max-w-xs print:border-black print:shadow-none">
            
            {/* Tag Header */}
            <div className="border-b border-zinc-200 pb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block">
                {settings.shopNameKu}
              </span>
              <h4 className="text-xs font-black text-zinc-900 line-clamp-1 leading-snug">
                {product.titleKu}
              </h4>
              <p className="text-[9px] text-zinc-500 font-mono">کۆد: {product.sku}</p>
            </div>

            {/* QR Code Image */}
            <div className="flex justify-center p-2 bg-white rounded-xl">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR Code" className="w-44 h-44 object-contain rounded-lg" />
              ) : (
                <div className="w-44 h-44 bg-zinc-100 flex items-center justify-center text-xs text-zinc-400">
                  لە ئامادەکردندایە...
                </div>
              )}
            </div>

            {/* Price Banner */}
            <div className="bg-zinc-900 text-white rounded-xl p-2 font-black print:bg-black print:text-white">
              <div className="text-base font-extrabold text-amber-400 print:text-white">
                {formatPrice(product.priceIqd, 'IQD')}
              </div>
              <div className="text-[10px] font-mono text-zinc-300">
                هاوتا: {formatPrice(product.priceUsd, 'USD')}
              </div>
            </div>
          </div>

          {/* Action buttons (hidden on print) */}
          <div className="flex items-center gap-2 print:hidden pt-2">
            <button
              onClick={handlePrintLabel}
              className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>چاپکردنی لێبڵ (Print Tag)</span>
            </button>

            <button
              onClick={handleDownloadQr}
              className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              title="دابەزاندنی وێنە"
            >
              <Download className="w-4 h-4" />
              <span>داگرتن</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
