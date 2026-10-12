'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Zap, ShoppingBag, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { QuickBuyModal } from './QuickBuyModal';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false);

  const defaultVariant = product.variants[0];
  const defaultAccountType = product.accountTypes[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!defaultVariant || !defaultAccountType) return;

    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      variantId: defaultVariant.id,
      variantName: defaultVariant.name,
      accountTypeId: defaultAccountType.id,
      accountTypeName: defaultAccountType.label,
      unitPrice: defaultVariant.price + (defaultAccountType.extraCost || 0),
      quantity: 1,
    });
  };

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickBuyOpen(true);
  };

  return (
    <>
      <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:border-brand-500/50 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300 flex flex-col justify-between">
        {/* Top Image & Badge */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
          <Link href={`/products/${product.slug}`} className="block w-full h-full">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            />
          </Link>

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-extrabold text-[11px] px-3 py-1 rounded-full shadow-lg backdrop-blur-md">
              {product.badge}
            </div>
          )}

          {/* Discount Tag */}
          {product.discountPercentage && (
            <div className="absolute top-3 left-3 bg-amber-400 text-slate-950 font-black text-[11px] px-2 py-0.5 rounded-lg shadow-md">
              -{product.discountPercentage}%
            </div>
          )}

          {/* Instant delivery pill */}
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Zap className="w-3 h-3 fill-current" />
            <span>تسليم فوري</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span className="font-semibold text-brand-600 dark:text-brand-400">
                {product.categoryNameAr}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{product.rating}</span>
                <span className="text-[10px] text-slate-400">({product.reviewsCount})</span>
              </div>
            </div>

            {/* Product Title */}
            <Link href={`/products/${product.slug}`}>
              <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-500 transition-colors">
                {product.name}
              </h3>
            </Link>

            {/* Tagline */}
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
              {product.tagline}
            </p>

            {/* Duration variant teaser */}
            <div className="flex items-center gap-1.5 mt-3">
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                {product.variants.length} خيارات للمدة
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                ضمان شامل
              </span>
            </div>
          </div>

          {/* Pricing & Actions */}
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <span className="text-[11px] text-slate-400 block">يبدأ من:</span>
                <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {formatPrice(product.price)}
                </span>
              </div>
              {product.oldPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>

            {/* Button group */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleQuickBuy}
                className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-extrabold py-2.5 px-3 rounded-xl shadow-md shadow-brand-600/20 text-xs transition-all active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>طلب سريع</span>
              </button>

              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs transition-all active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>أضف للسلة</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Buy Modal Instance */}
      <QuickBuyModal
        product={product}
        isOpen={isQuickBuyOpen}
        onClose={() => setIsQuickBuyOpen(false)}
      />
    </>
  );
}
