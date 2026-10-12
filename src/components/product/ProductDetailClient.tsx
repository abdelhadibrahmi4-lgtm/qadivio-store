'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Star, 
  Zap, 
  ShieldCheck, 
  Clock, 
  CheckCircle, 
  ShoppingBag, 
  ArrowLeft, 
  Share2, 
  Headphones, 
  CreditCard,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Product, ProductVariant, AccountTypeOption } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { trackViewContent } from '@/lib/meta-pixel';
import { QuickBuyModal } from './QuickBuyModal';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [selectedAccountType, setSelectedAccountType] = useState<AccountTypeOption>(product.accountTypes[0]);
  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Trigger Meta Pixel ViewContent event on page load
  useEffect(() => {
    trackViewContent({
      id: product.id,
      name: product.name,
      category: product.categoryNameAr,
      price: selectedVariant ? selectedVariant.price : product.price,
    });
  }, [product, selectedVariant]);

  const currentPrice = selectedVariant.price + (selectedAccountType?.extraCost || 0);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
      accountTypeId: selectedAccountType.id,
      accountTypeName: selectedAccountType.label,
      unitPrice: currentPrice,
      quantity: 1,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.tagline,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12" dir="rtl">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-brand-500 transition">الرئيسية</Link>
          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          <Link href={`/category/${product.category}`} className="hover:text-brand-500 transition">
            {product.categoryNameAr}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          <span className="text-slate-900 dark:text-white font-bold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Showcase Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-xl">
          
          {/* Left / Gallery Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />

              {product.badge && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg">
                  {product.badge}
                </div>
              )}

              {product.discountPercentage && (
                <div className="absolute top-4 left-4 bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-1 rounded-xl shadow-md">
                  وفّر {product.discountPercentage}%
                </div>
              )}
            </div>

            {/* Quick Guarantees Box */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Zap className="w-4 h-4 text-amber-500 fill-current shrink-0" />
                <span className="font-semibold">تفعيل فوري وآلي</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-semibold">ضمان كامل المدة</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Headphones className="w-4 h-4 text-brand-500 shrink-0" />
                <span className="font-semibold">دعم فني 24/7</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CreditCard className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="font-semibold">دفع عبر BaridiMob</span>
              </div>
            </div>
          </div>

          {/* Right / Product Details & Customization */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-3 py-1 rounded-full border border-brand-200 dark:border-brand-800/40">
                  {product.categoryNameAr}
                </span>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-500 transition p-1.5 rounded-lg border border-slate-200 dark:border-slate-800"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'تم نسخ الرابط!' : 'مشاركة'}</span>
                </button>
              </div>

              <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {product.tagline}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{product.rating}</span>
                <span>• تقييم موثق ({product.reviewsCount} مشتري)</span>
              </div>
            </div>

            {/* Price Preview */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-1">السعر المحدد:</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-brand-600 dark:text-brand-400">
                    {formatPrice(currentPrice)}
                  </span>
                  {selectedVariant.oldPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(selectedVariant.oldPrice)}
                    </span>
                  )}
                </div>
              </div>

              {selectedVariant.oldPrice && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-extrabold text-xs px-3 py-1 rounded-xl">
                  وفرت {formatPrice(selectedVariant.oldPrice - currentPrice)}
                </div>
              )}
            </div>

            {/* 1. Variants Selection (Duration) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-900 dark:text-white">
                اختر مدة الاشتراك:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`p-3 rounded-2xl border text-right transition-all relative ${
                      selectedVariant.id === v.id
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-900 dark:text-brand-300 ring-2 ring-brand-500/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {v.isPopular && (
                      <span className="absolute -top-2 left-2 bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-sm">
                        الأوفر ⚡
                      </span>
                    )}
                    <div className="text-xs font-bold">{v.name}</div>
                    <div className="text-sm font-black text-brand-600 dark:text-brand-400 mt-1">
                      {formatPrice(v.price)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Account Type Selection */}
            {product.accountTypes.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-900 dark:text-white">
                  نوع الحساب والتفعيل:
                </label>
                <div className="space-y-2">
                  {product.accountTypes.map((acc) => (
                    <label
                      key={acc.id}
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${
                        selectedAccountType?.id === acc.id
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30 ring-1 ring-brand-500/30'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="detailAccountType"
                        checked={selectedAccountType?.id === acc.id}
                        onChange={() => setSelectedAccountType(acc)}
                        className="mt-1 text-brand-600 focus:ring-brand-500"
                      />
                      <div className="flex-1 text-right">
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                          <span>{acc.label}</span>
                          {acc.extraCost > 0 && (
                            <span className="text-[11px] text-amber-500 font-bold">
                              +{acc.extraCost} د.ج
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {acc.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setIsQuickBuyOpen(true)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-brand-600/30 text-sm transition-all active:scale-98"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>شراء سريع فوري ⚡</span>
              </button>

              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-extrabold py-4 px-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm transition-all active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>إضافة إلى السلة</span>
              </button>
            </div>

          </div>
        </div>

        {/* Features & Description & Activation Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Features list */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-500" />
                مميزات الاشتراك وما يشمله:
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-3">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                تفاصيل الاشتراك
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {product.longDescription || product.description}
              </p>
            </div>

            {/* Activation Guide */}
            {product.activationGuide && product.activationGuide.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  خطوات التفعيل والاستلام:
                </h2>
                <div className="space-y-3">
                  {product.activationGuide.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
                      <span className="w-6 h-6 rounded-lg bg-brand-600 text-white font-black flex items-center justify-center text-xs shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Guarantee & Support */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 rounded-3xl border border-indigo-800/40 p-6 text-white space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black">ضمان Qadivio الذهبي</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                نلتزم بتوفير اشتراكات رسمية بنسبة 100%. في حال واجهت أي انقطاع خلال فترة الاشتراك، نضمن لك استبدال الحساب أو التفعيل فوراً بدون أي رسوم.
              </p>
              <div className="pt-2 border-t border-indigo-900/40">
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '213555000000'}?text=${encodeURIComponent(`أستفسر عن اشتراك ${product.name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-3 rounded-xl transition"
                >
                  <Headphones className="w-4 h-4" />
                  <span>تحدث مع الدعم الفني عبر واتساب</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              منتجات واشتراكات مشابهة
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 transition group flex flex-col justify-between"
                >
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-950 mb-3">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-brand-500 line-clamp-1">
                      {p.name}
                    </h3>
                    <div className="text-sm font-black text-brand-600 dark:text-brand-400 mt-1">
                      {formatPrice(p.price)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

      <QuickBuyModal
        product={product}
        isOpen={isQuickBuyOpen}
        onClose={() => setIsQuickBuyOpen(false)}
      />
    </>
  );
}
