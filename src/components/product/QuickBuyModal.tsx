'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, CheckCircle, Zap, ShieldCheck, ArrowLeft, Upload, Copy, Check } from 'lucide-react';
import { Product, ProductVariant, AccountTypeOption, PaymentMethod } from '@/types';
import { ALGERIA_WILAYAS } from '@/lib/wilayas';
import { formatPrice } from '@/lib/utils';
import { trackInitiateCheckout, trackPurchase } from '@/lib/meta-pixel';

interface QuickBuyModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickBuyModal({ product, isOpen, onClose }: QuickBuyModalProps) {
  const router = useRouter();

  // Selected variant & account type
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedAccountType, setSelectedAccountType] = useState<AccountTypeOption | null>(null);

  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [wilayaCode, setWilayaCode] = useState('16'); // Default Algiers
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('baridimob');
  const [paymentReceiptNumber, setPaymentReceiptNumber] = useState('');

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedRip, setCopiedRip] = useState(false);

  // Setup initial variant when product changes
  React.useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants[0] || null);
      setSelectedAccountType(product.accountTypes[0] || null);
    }
  }, [product]);

  if (!isOpen || !product || !selectedVariant) return null;

  const currentPrice = selectedVariant.price + (selectedAccountType?.extraCost || 0);
  const selectedWilaya = ALGERIA_WILAYAS.find((w) => w.code === wilayaCode) || ALGERIA_WILAYAS[0];

  const baridimobRip = process.env.NEXT_PUBLIC_BARIDIMOB_RIP || '00799999000123456789';
  const baridimobHolder = process.env.NEXT_PUBLIC_BARIDIMOB_HOLDER || 'QADIVIO DIGITAL';

  const copyRipToClipboard = () => {
    navigator.clipboard.writeText(baridimobRip);
    setCopiedRip(true);
    setTimeout(() => setCopiedRip(false), 2000);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
      setErrorMessage('يرجى ملء جميع الحقول المطلوبة (الاسم، الهاتف، والبريد الإلكتروني)');
      return;
    }

    if (!customerEmail.includes('@')) {
      setErrorMessage('يرجى إدخال بريد إلكتروني صالح لاستلام التفعيل');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Fire InitiateCheckout Meta Pixel Event
      trackInitiateCheckout([{ productId: product.id }], currentPrice);

      const orderPayload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        wilayaCode: selectedWilaya.code,
        wilayaName: selectedWilaya.nameAr,
        city: city.trim(),
        notes: notes.trim(),
        items: [
          {
            productId: product.id,
            name: product.name,
            variantName: selectedVariant.name,
            accountTypeName: selectedAccountType?.label || 'افتراضي',
            quantity: 1,
            price: currentPrice,
          },
        ],
        subtotal: currentPrice,
        discount: 0,
        total: currentPrice,
        paymentMethod,
        paymentReceiptNumber: paymentReceiptNumber.trim() || undefined,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        throw new Error('حدث خطأ أثناء معالجة الطلب');
      }

      const createdOrder = await res.json();

      // 2. Strict Meta Pixel Purchase Event - Fired ONLY upon verified order submission
      trackPurchase({
        id: createdOrder.id,
        total: createdOrder.total,
        items: [{ productId: product.id }],
      });

      onClose();
      // Redirect to tracking page with new order ID
      router.push(`/track?id=${createdOrder.id}&new=true`);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || 'فشل إرسال الطلب، يرجى المحاولة ثانية');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-brand-900/10 via-indigo-900/10 to-slate-900/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-500 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  طلب سريع وتفعيل فوري ⚡
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {product.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmitOrder} className="p-4 sm:p-6 space-y-5">
            {/* 1. Variant Duration Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                اختر مدة الاشتراك:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariant(variant)}
                    className={`p-2.5 rounded-xl border text-right transition-all ${
                      selectedVariant.id === variant.id
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-900 dark:text-brand-300 ring-2 ring-brand-500/30'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">{variant.name}</div>
                    <div className="text-sm font-black text-brand-600 dark:text-brand-400 mt-1">
                      {formatPrice(variant.price)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Account Type Selection */}
            {product.accountTypes.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  نوع الحساب والتفعيل:
                </label>
                <div className="space-y-2">
                  {product.accountTypes.map((acc) => (
                    <label
                      key={acc.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                        selectedAccountType?.id === acc.id
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30 ring-1 ring-brand-500/30'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="accountType"
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

            {/* 3. Customer Info */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                بيانات المستلم والتفعيل:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="محمد أمين"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                    رقم الهاتف / واتساب *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0550123456"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                  البريد الإلكتروني (لاستلام التفعيل) *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="your-email@gmail.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              {/* Wilaya Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                    الولاية (58 ولاية)
                  </label>
                  <select
                    value={wilayaCode}
                    onChange={(e) => setWilayaCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  >
                    {ALGERIA_WILAYAS.map((w) => (
                      <option key={w.code} value={w.code}>
                        {w.code} - {w.nameAr} ({w.nameFr})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 dark:text-slate-400 mb-1">
                    البلدية / العنوان
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="البلدية أو المدينة"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. Payment Method Selection */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
              <label className="block text-xs font-bold text-slate-900 dark:text-white">
                طريقة الدفع المعتمدة:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { id: 'baridimob', label: 'بريدي موب 📱' },
                  { id: 'ccp', label: 'حوالة CCP 🏦' },
                  { id: 'edahabia', label: 'البطاقة الذهبية 💳' },
                  { id: 'usdt', label: 'USDT / Binance 🌐' },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                    className={`p-2 rounded-xl border text-center font-bold transition ${
                      paymentMethod === pm.id
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>

              {/* BaridiMob Details Card */}
              {paymentMethod === 'baridimob' && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1.5 text-xs">
                  <div className="font-bold text-amber-800 dark:text-amber-300">
                    بيانات حساب بريدي موب للتحويل:
                  </div>
                  <div className="flex items-center justify-between font-mono font-bold bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span>RIP: {baridimobRip}</span>
                    <button
                      type="button"
                      onClick={copyRipToClipboard}
                      className="text-brand-600 dark:text-brand-400 hover:text-brand-500 flex items-center gap-1 text-[11px]"
                    >
                      {copiedRip ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedRip ? 'تم النسخ!' : 'نسخ'}</span>
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    صاحب الحساب: {baridimobHolder}
                  </div>

                  <input
                    type="text"
                    value={paymentReceiptNumber}
                    onChange={(e) => setPaymentReceiptNumber(e.target.value)}
                    placeholder="رقم الوصل أو آخر 4 أرقام من التحويل (اختياري)"
                    className="w-full mt-2 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-600 dark:text-red-400 font-bold">
                {errorMessage}
              </div>
            )}

            {/* Price Total & CTA */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">المبلغ الإجمالي للدفع:</span>
                <div className="text-xl font-black text-brand-600 dark:text-brand-400">
                  {formatPrice(currentPrice)}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-extrabold px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-sm disabled:opacity-50"
              >
                <span>{isSubmitting ? 'جاري تأكيد الطلب...' : 'تأكيد الطلب الآن ⚡'}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>تسليم فوري ومضمون • سيتم حفظ طلبك وإرسال بيانات التفعيل</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
