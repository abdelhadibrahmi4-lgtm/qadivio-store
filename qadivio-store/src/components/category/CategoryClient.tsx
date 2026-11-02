'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, ArrowUpDown, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { STORE_CATEGORIES } from '@/lib/data';
import { ProductCard } from '@/components/product/ProductCard';

interface CategoryClientProps {
  initialProducts: Product[];
  currentCategorySlug: string;
}

export function CategoryClient({ initialProducts, currentCategorySlug }: CategoryClientProps) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(currentCategorySlug);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }
        // Search term filter
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase().trim();
          const matchesName = p.name.toLowerCase().includes(q) || p.nameEn.toLowerCase().includes(q);
          const matchesTagline = p.tagline.toLowerCase().includes(q);
          const matchesFeatures = p.features.some((f) => f.toLowerCase().includes(q));
          if (!matchesName && !matchesTagline && !matchesFeatures) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // Default popular
        return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      });
  }, [initialProducts, selectedCategory, searchTerm, sortBy]);

  const currentCategoryObj = STORE_CATEGORIES.find((c) => c.slug === selectedCategory) || STORE_CATEGORIES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8" dir="rtl">
      
      {/* Category Header */}
      <div className="text-center sm:text-right space-y-2">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
          {currentCategoryObj.nameAr}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          تصفح قائمة الاشتراكات الرقمية وأدوات الذكاء الاصطناعي مع إمكانية التصفية المباشرة
        </p>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {STORE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === cat.slug
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-brand-500'
            }`}
          >
            <span>{cat.nameAr}</span>
          </button>
        ))}
      </div>

      {/* Controls Bar: Search & Sorting */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث باسم الأداة (مثال: ChatGPT, Gemini, Canva)..."
            className="w-full pr-10 pl-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-2.5" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute left-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
            >
              مسح
            </button>
          )}
        </div>

        {/* Counter & Sorting */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold whitespace-nowrap">
            {filteredProducts.length} منتج متاح
          </span>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
            >
              <option value="popular">الأكثر طلباً 🔥</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
              <option value="rating">الأعلى تقييماً ⭐</option>
            </select>
          </div>
        </div>

      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            لم نجد أي منتج يطابق بحثك "{searchTerm}"
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً من القائمة أعلاه.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="px-5 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs"
          >
            إعادة ضبط الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
