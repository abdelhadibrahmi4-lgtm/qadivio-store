'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Zap, ChevronRight, ChevronLeft } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { QuickBuyModal } from './QuickBuyModal';

interface DealShowcaseProps {
  products: Product[];
}

export function DealShowcase({ products }: DealShowcaseProps) {
  const dealProducts = products.filter((p) => p.isDealOfTheDay || p.featured).slice(0, 4);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedQuickProduct, setSelectedQuickProduct] = useState<Product | null>(null);

  // Auto rotate every 6 seconds
  useEffect(() => {
    if (dealProducts.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % dealProducts.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [dealProducts.length]);

  if (dealProducts.length === 0) return null;

  const currentProduct = dealProducts[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % dealProducts.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + dealProducts.length) % dealProducts.length);
  };

  return (
    <>
      <div className="relative bg-gradient-to-br from-slate-900/90 via-indigo-950/70 to-slate-950 rounded-3xl border border-indigo-800/40 p-5 sm:p-6 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col justify-between select-none">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-md shadow-amber-400/20">
              ⚡
            </span>
            <span className="font-extrabold text-white text-sm">عروض اليوم الحصرية</span>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>تخفيضات نشطة</span>
          </div>
        </div>

        {/* Timeline Progress Segments */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 mb-4 relative z-10">
          {dealProducts.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setActiveIndex(idx)}
              className="h-1.5 rounded-full overflow-hidden bg-slate-800/80 transition-all"
            >
              <div
                className={`h-full bg-brand-400 transition-all duration-300 ${
                  idx === activeIndex ? 'w-full' : idx < activeIndex ? 'w-full opacity-60' : 'w-0'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Active Deal Content */}
        <div className="flex flex-col sm:flex-row gap-4 items-center relative z-10 py-2">
          {/* Artwork */}
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-indigo-700/50">
            <img
              src={currentProduct.image}
              alt={currentProduct.name}
              className="w-full h-full object-cover"
            />
            {currentProduct.discountPercentage && (
              <div className="absolute top-2 right-2 bg-amber-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded-md shadow-md">
                -{currentProduct.discountPercentage}%
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 text-center sm:text-right space-y-1.5">
            <span className="text-[11px] font-bold text-brand-300 tracking-wide uppercase">
              {currentProduct.nameEn}
            </span>
            <h4 className="font-black text-base sm:text-lg text-white leading-snug line-clamp-2">
              {currentProduct.name}
            </h4>

            {/* Price */}
            <div className="flex items-baseline justify-center sm:justify-start gap-2 pt-1">
              <span className="text-xl sm:text-2xl font-black text-amber-300">
                {formatPrice(currentProduct.price)}
              </span>
              {currentProduct.oldPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(currentProduct.oldPrice)}
                </span>
              )}
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center justify-center sm:justify-start gap-2 pt-3">
              <button
                onClick={() => setSelectedQuickProduct(currentProduct)}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-brand-500 to-indigo-500 hover:from-brand-400 hover:to-indigo-400 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>اطلب العرض الآن</span>
              </button>

              <Link
                href={`/products/${currentProduct.slug}`}
                className="inline-flex items-center gap-1 text-slate-300 hover:text-white text-xs font-semibold px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 transition"
              >
                <span>التفاصيل</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Thumbnail Selector & Arrows */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-indigo-900/40 relative z-10">
          <button
            onClick={handlePrev}
            aria-label="العرض السابق"
            className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {dealProducts.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setActiveIndex(idx)}
                className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all ${
                  idx === activeIndex
                    ? 'border-brand-400 scale-110 shadow-md ring-2 ring-brand-500/30'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            aria-label="العرض التالي"
            className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      <QuickBuyModal
        product={selectedQuickProduct}
        isOpen={!!selectedQuickProduct}
        onClose={() => setSelectedQuickProduct(null)}
      />
    </>
  );
}
