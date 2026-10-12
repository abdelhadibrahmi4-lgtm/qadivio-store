'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Zap } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

interface TrendingMarqueeProps {
  products: Product[];
}

export function TrendingMarquee({ products }: TrendingMarqueeProps) {
  // Duplicate list to achieve continuous infinite marquee effect
  const marqueeItems = [...products, ...products];

  return (
    <div className="w-full overflow-hidden py-3 bg-slate-100/60 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800/80">
      <div className="flex gap-4 animate-marquee whitespace-nowrap">
        {marqueeItems.map((product, idx) => (
          <Link
            key={`${product.id}-${idx}`}
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:border-brand-500/50 transition-all shrink-0 group"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-8 h-8 rounded-lg object-cover"
            />
            <div className="flex flex-col text-right">
              <span className="text-xs font-black text-slate-800 dark:text-slate-100 group-hover:text-brand-500 transition-colors">
                {product.nameEn}
              </span>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="font-extrabold text-brand-600 dark:text-brand-400">
                  {formatPrice(product.price)}
                </span>
                <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  {product.rating}
                </span>
              </div>
            </div>
            <span className="text-[10px] bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded-full font-bold">
              تفعيل فوري ⚡
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
