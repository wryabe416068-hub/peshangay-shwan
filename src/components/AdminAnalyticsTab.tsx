import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  MapPin, 
  CreditCard,
  Package,
  Award
} from 'lucide-react';
import { OrderRecord, Product, ShopSettings } from '../types';
import { formatPrice } from '../utils/helpers';

interface AdminAnalyticsTabProps {
  orders: OrderRecord[];
  products: Product[];
  settings: ShopSettings;
  currency: 'IQD' | 'USD';
}

export const AdminAnalyticsTab: React.FC<AdminAnalyticsTabProps> = ({
  orders,
  products,
  settings,
  currency,
}) => {
  // Calculations
  const nonCancelledOrders = orders.filter(o => o.status !== 'cancelled');
  const completedOrders = orders.filter(o => o.status === 'completed');
  
  const totalRevenueIqd = nonCancelledOrders.reduce((sum, o) => sum + (o.totalIqd || 0), 0);
  const totalRevenueUsd = nonCancelledOrders.reduce((sum, o) => sum + (o.totalUsd || 0), 0);

  const completedRevenueIqd = completedOrders.reduce((sum, o) => sum + (o.totalIqd || 0), 0);
  const completedRevenueUsd = completedOrders.reduce((sum, o) => sum + (o.totalUsd || 0), 0);

  const avgOrderIqd = nonCancelledOrders.length > 0 ? Math.round(totalRevenueIqd / nonCancelledOrders.length) : 0;
  const avgOrderUsd = nonCancelledOrders.length > 0 ? Math.round((totalRevenueUsd / nonCancelledOrders.length) * 10) / 10 : 0;

  // Status counts
  const statusCounts = {
    new: orders.filter(o => o.status === 'new').length,
    contacted: orders.filter(o => o.status === 'contacted').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    completed: completedOrders.length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  // Top products calculation
  const productSalesMap: Record<string, { title: string; count: number; revenueIqd: number }> = {};
  nonCancelledOrders.forEach(ord => {
    ord.items.forEach(it => {
      if (!productSalesMap[it.productId]) {
        productSalesMap[it.productId] = {
          title: it.titleKu,
          count: 0,
          revenueIqd: 0,
        };
      }
      productSalesMap[it.productId].count += it.quantity;
      productSalesMap[it.productId].revenueIqd += (it.priceIqd * it.quantity);
    });
  });

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // City breakdown
  const citySalesMap: Record<string, { count: number; totalIqd: number }> = {};
  nonCancelledOrders.forEach(ord => {
    const cityName = ord.cityName || 'نەزانراو';
    if (!citySalesMap[cityName]) {
      citySalesMap[cityName] = { count: 0, totalIqd: 0 };
    }
    citySalesMap[cityName].count += 1;
    citySalesMap[cityName].totalIqd += ord.totalIqd;
  });

  const citySalesList = Object.entries(citySalesMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count);

  // Payment methods breakdown
  const paymentBreakdown = {
    cash: orders.filter(o => o.paymentMethod === 'cash').length,
    fastpay: orders.filter(o => o.paymentMethod === 'fastpay').length,
    fib: orders.filter(o => o.paymentMethod === 'fib').length,
    superqi: orders.filter(o => o.paymentMethod === 'superqi').length,
  };

  return (
    <div className="space-y-6 text-right font-sans">
      
      {/* Header */}
      <div>
        <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-400" />
          <span>ئامار و ڕاپۆرتی فرۆشی پێشەنگای شوان</span>
        </h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          شیکاری وردی داواکارییەکان، داهاتی فرۆش، و پڕفرۆشترین کاڵاکان.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Revenue */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>کۆی داهاتی فرۆش</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-base sm:text-xl font-black text-amber-400">
            {formatPrice(totalRevenueIqd, 'IQD')}
          </p>
          <p className="text-[11px] text-zinc-500 font-mono">
            هاوتا: {formatPrice(totalRevenueUsd, 'USD')}
          </p>
        </div>

        {/* Total Orders */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>ژمارەی داواکارییەکان</span>
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-base sm:text-xl font-black text-white">
            {orders.length} داواکاری
          </p>
          <p className="text-[11px] text-emerald-400 font-medium">
            {completedOrders.length} تەواوکراو ({orders.length > 0 ? Math.round((completedOrders.length / orders.length) * 100) : 0}%)
          </p>
        </div>

        {/* Completed Revenue */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>داهاتی وەرگیراو (تەواوبوو)</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-base sm:text-xl font-black text-emerald-400">
            {formatPrice(completedRevenueIqd, 'IQD')}
          </p>
          <p className="text-[11px] text-zinc-500 font-mono">
            {formatPrice(completedRevenueUsd, 'USD')}
          </p>
        </div>

        {/* Average Order Value */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>تێکڕای نرخی سەبەتە (AOV)</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-base sm:text-xl font-black text-zinc-100">
            {formatPrice(avgOrderIqd, 'IQD')}
          </p>
          <p className="text-[11px] text-zinc-500 font-mono">
            {formatPrice(avgOrderUsd, 'USD')}
          </p>
        </div>

      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Status Breakdown Bar */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
          <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>دۆخی داواکارییەکان</span>
          </h4>

          <div className="space-y-2.5 text-xs">
            {/* New */}
            <div>
              <div className="flex justify-between text-zinc-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>نوێ (New)</span>
                </span>
                <span className="font-mono font-bold text-amber-400">{statusCounts.new}</span>
              </div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-400 h-full rounded-full" 
                  style={{ width: `${orders.length ? (statusCounts.new / orders.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Contacted */}
            <div>
              <div className="flex justify-between text-zinc-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span>پەیوەندی پێوەکرا</span>
                </span>
                <span className="font-mono font-bold text-sky-400">{statusCounts.contacted}</span>
              </div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-sky-400 h-full rounded-full" 
                  style={{ width: `${orders.length ? (statusCounts.contacted / orders.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Shipped */}
            <div>
              <div className="flex justify-between text-zinc-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span>نێردرا بۆ گەیاندن</span>
                </span>
                <span className="font-mono font-bold text-purple-400">{statusCounts.shipped}</span>
              </div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-purple-400 h-full rounded-full" 
                  style={{ width: `${orders.length ? (statusCounts.shipped / orders.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Completed */}
            <div>
              <div className="flex justify-between text-zinc-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>تەواوبوو و وەرگیرا</span>
                </span>
                <span className="font-mono font-bold text-emerald-400">{statusCounts.completed}</span>
              </div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full rounded-full" 
                  style={{ width: `${orders.length ? (statusCounts.completed / orders.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Cancelled */}
            <div>
              <div className="flex justify-between text-zinc-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>هەڵوەشاوەتەوە</span>
                </span>
                <span className="font-mono font-bold text-rose-400">{statusCounts.cancelled}</span>
              </div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-rose-500 h-full rounded-full" 
                  style={{ width: `${orders.length ? (statusCounts.cancelled / orders.length) * 100 : 0}%` }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Top Selling Products */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
          <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-400" />
            <span>پڕفرۆشترین کاڵاکانی پێشەنگا</span>
          </h4>

          {topProducts.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-6">
              هێشتا داواکاری تۆمار نەکراوە تا پڕفرۆشترین دیاری بکرێت.
            </p>
          ) : (
            <div className="space-y-3 text-xs">
              {topProducts.map((prod, index) => (
                <div key={index} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-black text-[11px] flex items-center justify-center font-mono">
                      {index + 1}
                    </span>
                    <span className="font-bold text-zinc-200 line-clamp-1">{prod.title}</span>
                  </div>
                  <div className="text-left font-mono">
                    <span className="font-black text-amber-400 block">{prod.count} فرۆشراو</span>
                    <span className="text-[10px] text-zinc-500">{formatPrice(prod.revenueIqd, 'IQD')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Cities Distribution & Payment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* City distribution */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
          <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>داواکاری بەپێی شارەکانی کوردستان</span>
          </h4>

          {citySalesList.length === 0 ? (
            <p className="text-xs text-zinc-500 text-center py-4">داتای شارەکان بەردەست نییە</p>
          ) : (
            <div className="space-y-2 text-xs">
              {citySalesList.map((city, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/40">
                  <span className="font-bold text-zinc-300">{city.name}</span>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-amber-400 font-bold">{city.count} داواکاری</span>
                    <span className="text-zinc-500 text-[11px]">{formatPrice(city.totalIqd, 'IQD')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
          <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>شێوازەکانی پارەدان</span>
          </h4>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-[11px] text-zinc-400 block">کاش لەکاتی وەرگرتن</span>
              <span className="text-lg font-black text-zinc-100 font-mono">{paymentBreakdown.cash}</span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-[11px] text-rose-400 block">فاستپەی (FastPay)</span>
              <span className="text-lg font-black text-rose-400 font-mono">{paymentBreakdown.fastpay}</span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-[11px] text-sky-400 block">بانکی FIB</span>
              <span className="text-lg font-black text-sky-400 font-mono">{paymentBreakdown.fib}</span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-[11px] text-amber-400 block">سوپەر کی (Super Qi)</span>
              <span className="text-lg font-black text-amber-400 font-mono">{paymentBreakdown.superqi}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
