import React from 'react';
import { 
  LayoutGrid, 
  Smartphone, 
  Watch, 
  Home, 
  ShoppingBag, 
  Headphones, 
  Flame, 
  Percent, 
  CheckCircle,
  SlidersHorizontal
} from 'lucide-react';
import { Category } from '../types';

interface CategoryPillsProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  onlySale: boolean;
  onToggleSale: () => void;
  onlyInStock: boolean;
  onToggleInStock: () => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest';
  onSortChange: (sort: 'featured' | 'price-asc' | 'price-desc' | 'newest') => void;
  totalProductsCount: number;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onlySale,
  onToggleSale,
  onlyInStock,
  onToggleInStock,
  sortBy,
  onSortChange,
  totalProductsCount,
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone': return <Smartphone className="w-4 h-4" />;
      case 'Watch': return <Watch className="w-4 h-4" />;
      case 'Home': return <Home className="w-4 h-4" />;
      case 'ShoppingBag': return <ShoppingBag className="w-4 h-4" />;
      case 'Headphones': return <Headphones className="w-4 h-4" />;
      default: return <LayoutGrid className="w-4 h-4" />;
    }
  };

  return (
    <div id="catalog-section" className="py-4 sm:py-6 space-y-3 sm:space-y-4 w-full max-w-full min-w-0">
      {/* Category Pills Slider */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar w-full max-w-full min-w-0">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`cat-btn-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 ${
                isSelected
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 scale-[1.02]'
                  : 'bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {getCategoryIcon(cat.iconName)}
              <span>{cat.nameKu}</span>
              {cat.id === 'all' && (
                <span className={`text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {totalProductsCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filter Chips & Sorting Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 pt-1 border-t border-zinc-800/60 text-xs w-full max-w-full min-w-0">
        
        {/* Quick Filter Toggles */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <button
            id="filter-sale-btn"
            onClick={onToggleSale}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border font-semibold text-[11px] sm:text-xs transition-all ${
              onlySale
                ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Percent className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>تەنها داشکاندن</span>
          </button>

          <button
            id="filter-stock-btn"
            onClick={onToggleInStock}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border font-semibold text-[11px] sm:text-xs transition-all ${
              onlyInStock
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>بەردەست لە کۆگا</span>
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span className="text-zinc-400 hidden sm:inline">ڕیزبەندی:</span>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg py-1 sm:py-1.5 px-2 sm:px-2.5 text-zinc-200 text-[11px] sm:text-xs font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="featured">پێشنیارکراو و تایبەت</option>
            <option value="newest">نوێترین کاڵاکان</option>
            <option value="price-asc">نرخ: کەم بۆ زۆر</option>
            <option value="price-desc">نرخ: زۆر بۆ کەم</option>
          </select>
        </div>

      </div>
    </div>
  );
};
