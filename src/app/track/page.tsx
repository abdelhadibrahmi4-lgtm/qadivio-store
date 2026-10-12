'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Package, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  MessageCircle, 
  ShieldCheck, 
  Copy, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const isNewOrder = searchParams.get('new') === 'true';

  const [query, setQuery] = useState(initialId);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const fetchOrder = async (orderIdOrPhone: string) => {
    if (!orderIdOrPhone.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderIdOrPhone.trim())}`);
      if (!res.ok) {
        throw new Error('لم يتم العثور على أي طلب بهذا المعرّف أو رقم الهاتف');
      }
      const data = await res.json();
      setOrder(data);
    } catch (err: unknown) {
      const error = err as Error;
      setOrder(null);
      setErrorMessage(error.message || 'تعذر جلب تفاصيل الطلب');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchOrder(initialId);
    }
  }, [initialId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(query);
  };

  const copyActivationCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const steps: { key: OrderStatus; label: string; sub: string }[] = [
    { key: 'pending', label: 'تم الاستلام', sub: 'تم تسجيل طلبك بنجاح' },
    { key: 'verifying_payment', label: 'مراجعة الدفع', sub: 'التحقق من إشعار التحويل' },
    { key: 'processing', label: 'جاري التفعيل', sub: 'إعداد الحساب والترقية' },
    { key: 'completed', label: 'مكتمل ومفعل', sub: 'تم تسليم بيانات الاشتراك' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 0;
      case 'verifying_payment': return 1;
      case 'processing': return 2;
      case 'completed': return 3;
      default: return 0;
    }
  };

  const currentStepIdx = order ? getStepIndex(order.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8" dir="rtl">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 font-bold text-xs border border-brand-500/20">
          <Package className="w-3.5 h-3.5" />
          <span>نظام التتبع المباشر للطلبات</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
          تتبع حالة طلبك واشتراكك
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          أدخل رقم الطلب (مثل QD-2026-1042) أو رقم هاتفك لمعرفة حالة التفعيل واستلام الحساب
        </p>
      </div>

      {/* New Order Banner */}
      {isNewOrder && order && (
        <div className="p-4 sm:p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-black text-sm sm:text-base">
              تم إرسال طلبك بنجاح! رقم الطلب: {order.id} 🎉
            </h3>
            <p className="text-xs leading-relaxed">
              احفظ هذا الرقم لمتابعة حالة التفعيل في أي وقت. تم إرسال إشعار لفريق العمل للبدء في تفعيل اشتراكك فوراً.
            </p>
          </div>
        </div>
      )}

      {/* Search Input Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-md">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute right-4 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="أدخل رقم الطلب (مثال: QD-2026-1042) أو رقم الهاتف..."
              className="w-full pr-12 pl-4 py-3 text-xs sm:text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="bg-brand-600 hover:bg-brand-500 text-white font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'جاري البحث...' : 'بحث عن الطلب'}</span>
          </button>
        </form>

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-600 font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Order Result Card */}
      {order && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-8 shadow-xl">
          {/* Header of Order */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs text-slate-400">معرّف الطلب:</span>
              <div className="text-xl sm:text-2xl font-black text-brand-600 dark:text-brand-400 font-mono">
                {order.id}
              </div>
              <span className="text-xs text-slate-500 mt-1 block">
                تاريخ الإنشاء: {formatDate(order.createdAt)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3.5 py-1.5 rounded-full text-xs font-black ${
                  order.status === 'completed'
                    ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                    : order.status === 'processing'
                    ? 'bg-indigo-500/15 text-indigo-500 border border-indigo-500/30'
                    : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                }`}
              >
                {order.status === 'completed' && 'تم التفعيل والتسليم بنجاح ✅'}
                {order.status === 'processing' && 'جاري التفعيل الآن ⏳'}
                {order.status === 'verifying_payment' && 'قيد مراجعة إشعار الدفع 🔍'}
                {order.status === 'pending' && 'تم استلام الطلب بانتظار المراجعة 📋'}
              </span>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="py-2">
            <div className="grid grid-cols-4 gap-2 relative">
              {steps.map((st, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div key={st.key} className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                        isPassed
                          ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30 ring-4 ring-brand-500/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {isPassed ? <Check className="w-5 h-5" /> : idx + 1}
                    </div>
                    <div>
                      <div className={`text-xs sm:text-sm font-extrabold ${isCurrent ? 'text-brand-500' : 'text-slate-700 dark:text-slate-300'}`}>
                        {st.label}
                      </div>
                      <div className="text-[10px] text-slate-400 hidden sm:block mt-0.5">
                        {st.sub}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activation Code / Credentials Box */}
          {order.activationCodeOrAccount && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-900/30 via-indigo-900/20 to-slate-900 border border-brand-500/30 space-y-3">
              <div className="flex items-center gap-2 text-brand-400 font-black text-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>بيانات التفعيل والحساب الرسمية:</span>
              </div>
              <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400">
                <span className="select-all break-all">{order.activationCodeOrAccount}</span>
                <button
                  onClick={() => copyActivationCode(order.activationCodeOrAccount!)}
                  className="mr-3 text-slate-400 hover:text-white flex items-center gap-1 font-sans text-[11px]"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'تم النسخ!' : 'نسخ'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                تم تفعيل هذا الحساب وفق شروط الضمان. في حال واجهت أي استفسار تواصل فوراً مع الدعم.
              </p>
            </div>
          )}

          {/* Items & Customer Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Items */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-black text-slate-900 dark:text-white">
                تفاصيل المنتجات:
              </h4>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{item.name}</span>
                      <span className="text-[10px] text-slate-400 block">{item.variantName} • {item.accountTypeName}</span>
                    </div>
                    <span className="font-black text-brand-600 dark:text-brand-400">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between font-black text-sm">
                <span>المبلغ الإجمالي:</span>
                <span className="text-brand-600 dark:text-brand-400">{formatPrice(order.total)}</span>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-2.5 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
              <h4 className="font-black text-slate-900 dark:text-white">
                بيانات المستلم:
              </h4>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>الاسم:</span>
                <span className="font-bold text-slate-900 dark:text-white">{order.customerName}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>الهاتف:</span>
                <span className="font-bold font-mono text-slate-900 dark:text-white">{order.customerPhone}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>البريد الإلكتروني:</span>
                <span className="font-bold text-slate-900 dark:text-white">{order.customerEmail}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>الولاية:</span>
                <span className="font-bold text-slate-900 dark:text-white">{order.wilayaName}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>طريقة الدفع:</span>
                <span className="font-bold text-amber-500 uppercase">{order.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Instant WhatsApp Support Help */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-400">
              تحتاج لمساعدة أو تسريع التفعيل؟
            </span>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '213555000000'}?text=${encodeURIComponent(`مرحباً كاديفيو، أستفسر عن طلبي رقم ${order.id}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>تواصل مع الدعم عبر واتساب حول هذا الطلب</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto py-20 text-center text-slate-400 text-sm" dir="rtl">
        جاري تحميل نظام تتبع الطلبات...
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}
