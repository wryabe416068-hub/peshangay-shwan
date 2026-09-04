import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react';
import { Product } from '../types';
import { formatPrice } from '../utils/helpers';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  currency: 'IQD' | 'USD';
  onRemoveWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onRemoveWishlist,
  onAddToCart,
  onViewDetails,
}) => {
  if (!isOpen) return null;

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
          id="wishlist-drawer-panel"
          className="w-screen max-w-md bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between shadow-2xl text-right animate-in slide-in-from-left duration-300"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="text-base sm:text-lg font-black text-white">
                دڵخوازەکان ({items.length} کاڵا)
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          {items.length === 0 ? (
            <div className="p-8 text-center space-y-4 my-auto">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 text-zinc-500 mx-auto flex items-center justify-center">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">هیچ کاڵایەکت لە دڵخوازەکان دانەناوە</h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                دەتوانیت بە دڵسوتاندن و کلیک لەسەر دڵی سەر کاڵاکان، کاڵا خوازراوەکان لێرەدا پاشەکەوت بکەیت.
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {items.map((prod) => {
                const itemPrice = currency === 'USD' ? prod.priceUsd : prod.priceIqd;
                return (
                  <div 
                    key={prod.id}
                    className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex gap-3 items-center justify-between"
                  >
                    <img
                      src={prod.images[0]}
                      alt={prod.titleKu}
                      onClick={() => {
                        onViewDetails(prod);
                        onClose();
                      }}
                      className="w-16 h-16 rounded-lg object-cover bg-zinc-900 border border-zinc-800 cursor-pointer shrink-0"
                    />

                    <div className="flex-1 min-w-0 pr-2 space-y-1">
                      <h4 
                        onClick={() => {
                          onViewDetails(prod);
                          onClose();
                        }}
                        className="text-xs font-bold text-white truncate cursor-pointer hover:text-amber-400"
                      >
                        {prod.titleKu}
                      </h4>
                      <span className="text-xs font-black text-amber-400 block">
                        {formatPrice(itemPrice, currency)}
                      </span>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => {
                            onAddToCart(prod);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-[11px] font-bold flex items-center gap-1"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>سەبەتە</span>
                        </button>

                        <button
                          onClick={() => onRemoveWishlist(prod)}
                          className="text-zinc-500 hover:text-rose-400 p-1"
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
          )}

          {/* Footer */}
          <div className="p-4 bg-zinc-950 border-t border-zinc-800">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition-colors"
            >
              داخستن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
