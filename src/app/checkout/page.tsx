'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ShieldCheck, 
  Zap, 
  ArrowLeft, 
  CreditCard, 
  Copy, 
  Check, 
  ShoppingBag, 
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '@/context/CartContext';
import { ALGERIA_WILAYAS } from '@/lib/wilayas';
import { formatPrice } from '@/lib/utils';
import { PaymentMethod } from '@/types';
import { trackInitiateCheckout, trackPurchase } from '@/lib/meta-pixel';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const couponParam = searchParams.get('coupon') || '';

  const { items, subtotal, clearCart } = useCart();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [wilayaCode, setWilayaCode] = useState('16'); // Algiers
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('baridimob');
  const [paymentReceiptNumber, setPaymentReceiptNumber] = useState('');

  // Discount
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedRip, setCopiedRip] = useState(false);

  const baridimobRip = process.env.NEXT_PUBLIC_BARIDIMOB_RIP || '00799999000123456789';
  const baridimobHolder = process.env.NEXT_PUBLIC_BARIDIMOB_HOLDER || 'QADIVIO DIGITAL SERVICES';
  const ccpAccount = process.env.NEXT_PUBLIC_CCP_ACCOUNT || '0012345678';
  const ccpKey = process.env.NEXT_PUBLIC_CCP_KEY || '45';

  // Apply coupon if passed in URL
  useEffect(() => {
    if (couponParam) {
      fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponParam, subtotal }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            setCouponDiscount(data.discountPercentage);
          }
        })
        .catch(() => {});
    }
  }, [couponParam, subtotal]);

  // Track InitiateCheckout on page enter
  useEffect(() => {
    if (items.length > 0) {
      trackInitiateCheckout(
        items.map((i) => ({ productId: i.productId })),
        subtotal
      );
    }
  }, [items, subtotal]);

  const discountAmount = couponDiscount ? Math.round((subtotal * couponDiscount) / 100) : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);
  const selectedWilaya = ALGERIA_WILAYAS.find((w) => w.code === wilayaCode) || ALGERIA_WILAYAS[0];

  const copyRip = () => {
    navigator.clipboard.writeText(baridimobRip);
    setCopiedRip(true);
    setTimeout(() => setCopiedRip(false), 2000);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage('سلتك فارغة، أضف منتجات قبل إتمام الطلب');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
      setErrorMessage('يرجى ملء جميع الحقول الإلزامية (الاسم، الهاتف، البريد الإلكتروني)');
      return;
    }

    if (!customerEmail.includes('@')) {
      setErrorMessage('يرجى إدخال بريد إلكتروني صالح لاستلام التفعيل');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        wilayaCode: selectedWilaya.code,
        wilayaName: selectedWilaya.nameAr,
        city: city.trim(),
        notes: notes.trim(),
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          variantName: i.variantName,
          accountTypeName: i.accountTypeName,
          quantity: i.quantity,
          price: i.unitPrice * i.quantity,
        })),
        subtotal,
        discount: discountAmount,
        couponCode: couponDiscount > 0 ? couponParam : undefined,
        total: finalTotal,
        paymentMethod,
        paymentReceiptNumber: paymentReceiptNumber.trim() || undefined,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        throw new Error('حدث خطأ أثناء معالجة الطلب');
      }

      const createdOrder = await res.json();

      // Fire Meta Pixel Purchase event with strict deduplication
      trackPurchase({
        id: createdOrder.id,
        total: createdOrder.total,
        items: items.map((i) => ({ productId: i.productId })),
      });

      // Confetti celebration animation
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }

      // Clear cart
      clearCart();

      // Redirect to Order Confirmation & Tracking
      router.push(`/track?id=${createdOrder.id}&new=true`);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || 'فشل إرسال الطلب، يرجى المحاولة لاحقاً');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4" dir="rtl">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          سلتك فارغة
        </h1>
        <p className="text-sm text-slate-500">
          لا توجد منتجات لإتمام طلبها حالياً.
        </p>
        <Link
          href="/category/all"
          className="inline-flex items-center gap-2 bg-brand-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs"
        >
          <span>تصفح المتجر</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" dir="rtl">
      {/* Page Title */}
      <div className="mb-8 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          إتمام الطلب والدفع الآمن ⚡
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          تأكيد بيانات التفعيل واختيار وسيلة الدفع المناسبة لك
        </p>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Right: Form Information */}
          <div className="lg:col-span-7 space-y-6">
            {/* Customer Details Box */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs">
                  1
                </span>
                بيانات المستلم والتفعيل
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="محمد أمين رحماني"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    رقم الهاتف / واتساب *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0550 12 34 56"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  البريد الإلكتروني (لاستلام التفعيل) *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="your-email@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  سيتم إرسال دعوة التفعيل أو بيانات الدخول الرسمية لهذا البريد.
                </span>
              </div>

              {/* Wilaya & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الولاية (58 ولاية)
                  </label>
                  <select
                    value={wilayaCode}
                    onChange={(e) => setWilayaCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
                  >
                    {ALGERIA_WILAYAS.map((w) => (
                      <option key={w.code} value={w.code}>
                        {w.code} - {w.nameAr} ({w.nameFr})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    البلدية أو المدينة
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="البلدية أو المدينة"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ملاحظات إضافية حول التفعيل (اختياري)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أي تعليمات أو ملاحظات خاصة بطلبك..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Payment Methods Box */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs">
                  2
                </span>
                طريقة الدفع المعتمدة
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'baridimob', title: 'بريدي موب', sub: 'BaridiMob 📱' },
                  { id: 'ccp', title: 'حوالة بريدية', sub: 'CCP 🏦' },
                  { id: 'edahabia', title: 'البطاقة الذهبية', sub: 'CIB / Edahabia 💳' },
                  { id: 'usdt', title: 'USDT', sub: 'Binance Pay 🌐' },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      paymentMethod === pm.id
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-300 ring-2 ring-brand-500/30 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">{pm.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{pm.sub}</div>
                  </button>
                ))}
              </div>

              {/* Payment Details Container */}
              {paymentMethod === 'baridimob' && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-2 text-xs">
                  <div className="font-bold text-amber-800 dark:text-amber-300">
                    بيانات حساب بريدي موب BaridiMob للتحويل:
                  </div>
                  <div className="flex items-center justify-between font-mono font-bold bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span>RIP: {baridimobRip}</span>
                    <button
                      type="button"
                      onClick={copyRip}
                      className="text-brand-600 dark:text-brand-400 hover:text-brand-500 flex items-center gap-1 font-sans text-xs"
                    >
                      {copiedRip ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedRip ? 'تم النسخ!' : 'نسخ الرقم'}</span>
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    اسم صاحب الحساب: <strong className="text-slate-800 dark:text-slate-200">{baridimobHolder}</strong>
                  </div>

                  <div className="pt-2">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      رقم الوصل أو آخر 4 أرقام من التحويل:
                    </label>
                    <input
                      type="text"
                      value={paymentReceiptNumber}
                      onChange={(e) => setPaymentReceiptNumber(e.target.value)}
                      placeholder="رقم التحويل أو كود الإرسال"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'ccp' && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-2 text-xs">
                  <div className="font-bold text-emerald-800 dark:text-emerald-300">
                    بيانات الحساب البريدي الجاري CCP:
                  </div>
                  <div className="font-mono font-bold bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    الحساب: {ccpAccount} • المفتاح Clé: {ccpKey}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Left: Order Summary Column */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-xl sticky top-24">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-500" />
              محتويات الطلب ({items.length})
            </h2>

            {/* Items list preview */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </h4>
                    <span className="text-[10px] text-brand-500 font-semibold block">
                      {item.variantName} ({item.quantity}x)
                    </span>
                  </div>
                  <div className="font-extrabold text-slate-900 dark:text-white">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>المجموع الفرعي:</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatPrice(subtotal)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>خصم الكوبون ({couponDiscount}%):</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>رسوم التفعيل والتسليم:</span>
                <span className="text-emerald-500 font-bold">مجاني 0 د.ج ⚡</span>
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-3 border-t border-slate-200 dark:border-slate-700">
                <span>المبلغ الإجمالي المستحق:</span>
                <span className="text-xl text-brand-600 dark:text-brand-400">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-600 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* CTA Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-brand-600/30 text-sm transition-all active:scale-98 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'جاري تسجيل الطلب...' : 'تأكيد وإرسال الطلب الآن ⚡'}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>دفع آمن 100% • حفظ الطلب فورياً في قاعدة البيانات مع كود تتبع</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto py-20 text-center text-slate-400 text-sm" dir="rtl">
        جاري تحميل صفحة الدفع والطلب...
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
