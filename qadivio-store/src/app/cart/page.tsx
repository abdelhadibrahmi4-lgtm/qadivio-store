'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, Tag, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { trackInitiateCheckout } from '@/lib/meta-pixel';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState<number | null>(null);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const discountAmount = couponDiscount ? Math.round((subtotal * couponDiscount) / 100) : 0;
  const finalTotal = subtotal - discountAmount;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsApplying(true);
    setCouponMessage(null);

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setCouponDiscount(data.discountPercentage);
        setCouponMessage(data.message);
      } else {
        setCouponDiscount(null);
        setCouponMessage(data.message || 'كود الخصم غير صالح');
      }
    } catch {
      setCouponMessage('تعذر التحقق من الكود');
    } finally {
      setIsApplying(false);
    }
  };

  const handleCheckout = () => {
    trackInitiateCheckout(
      items.map((i) => ({ productId: i.productId })),
      finalTotal
    );

    if (couponDiscount && couponCode) {
      router.push(`/checkout?coupon=${encodeURIComponent(couponCode.trim())}`);
    } else {
      router.push('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-5" dir="rtl">
        <div className="w-24 h-24 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          سلة المشتريات فارغة
        </h1>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          لم تقم بإضافة أي اشتراك أو أداة إلى سلتك بعد. تصفح عروضنا الحصرية واختر ما يناسبك!
        </p>
        <div>
          <Link
            href="/category/all"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-sm px-6 py-3 rounded-2xl shadow-lg transition"
          >
            <span>تصفح المتجر الآن</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" dir="rtl">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            سلة المشتريات ({items.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            راجع مشترياتك وقم بتطبيق كوبونات التخفيض قبل إتمام الدفع
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-red-500 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>تفريغ السلة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left items list */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center gap-4 p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0"
              />

              <div className="flex-1 text-center sm:text-right space-y-1">
                <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                  {item.name}
                </h3>
                <div className="text-xs text-brand-600 dark:text-brand-400 font-bold">
                  {item.variantName}
                </div>
                <div className="text-[11px] text-slate-400">
                  {item.accountTypeName}
                </div>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1 hover:text-red-500 text-slate-600 dark:text-slate-300"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold px-2 text-slate-900 dark:text-white">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 hover:text-emerald-500 text-slate-600 dark:text-slate-300"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Price & Delete */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                <div className="text-base sm:text-lg font-black text-brand-600 dark:text-brand-400">
                  {formatPrice(item.unitPrice * item.quantity)}
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right summary card */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-lg">
          <h2 className="text-base font-black text-slate-900 dark:text-white">
            ملخص الطلب
          </h2>

          {/* Coupon form */}
          <form onSubmit={handleApplyCoupon} className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="كود الخصم (QADIVIO10)"
                  className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono uppercase font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <button
                type="submit"
                disabled={isApplying || !couponCode.trim()}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition disabled:opacity-50"
              >
                {isApplying ? '...' : 'تطبيق'}
              </button>
            </div>

            {couponMessage && (
              <div
                className={`text-xs p-2 rounded-xl font-bold ${
                  couponDiscount
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-600 border border-red-500/20'
                }`}
              >
                {couponMessage}
              </div>
            )}
          </form>

          {/* Totals */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>المجموع الفرعي:</span>
              <span className="font-bold text-slate-900 dark:text-white">{formatPrice(subtotal)}</span>
            </div>
            {couponDiscount && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>خصم الكوبون ({couponDiscount}%):</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>رسوم التفعيل والتسليم:</span>
              <span className="text-emerald-500 font-bold">مجاني (0 د.ج) ⚡</span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-3 border-t border-slate-200 dark:border-slate-700">
              <span>الإجمالي المستحق:</span>
              <span className="text-xl text-brand-600 dark:text-brand-400">
                {formatPrice(finalTotal)}
              </span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleCheckout}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-brand-600/30 text-sm transition-all active:scale-98"
          >
            <span>متابعة إتمام الطلب</span>
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>تسليم فوري ومضمون • ضمان استرجاع 100%</span>
          </div>
        </div>

      </div>

    </div>
  );
}
