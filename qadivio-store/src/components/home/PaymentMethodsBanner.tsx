import React from 'react';
import { CreditCard, Smartphone, Building2, Wallet, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function PaymentMethodsBanner() {
  const methods = [
    {
      id: 'baridimob',
      name: 'بريدي موب (BaridiMob)',
      nameEn: 'BaridiMob Transfer',
      tag: 'الأكثر استخداماً ⚡',
      description: 'تحويل مباشر وفوري عبر تطبيق BaridiMob باستخدام رقم الـ RIP وتأكيد فوري للطلب.',
      icon: Smartphone,
      accent: 'border-amber-500/40 bg-amber-500/10 text-amber-500',
    },
    {
      id: 'ccp',
      name: 'حوالة بريدية (CCP)',
      nameEn: 'Algérie Poste CCP',
      tag: 'بريد الجزائر 🏛️',
      description: 'دفع عبر أي مكتب بريد في الجزائر عبر الحساب الجاري البريدي مع رقم الحساب والمفتاح Clé.',
      icon: Building2,
      accent: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500',
    },
    {
      id: 'flexy',
      name: 'تعبئة رصيد (Flexy)',
      nameEn: 'Flexy Djezzy / Mobilis / Ooredoo',
      tag: 'دفع سريع 📲',
      description: 'شحن رصيد فليكسي سريع عبر جميع الشبكات الوطنية (موبيليس، جازي، أوريدو) لتسهيل الشراء.',
      icon: Wallet,
      accent: 'border-blue-500/40 bg-blue-500/10 text-blue-500',
    },
    {
      id: 'redotpay',
      name: 'ريدوت باي (RedotPay)',
      nameEn: 'RedotPay Wallet & ID',
      tag: 'محفظة رقمية 🌐',
      description: 'تحويل فوري بدون رسوم إضافية عبر معرّف Pay ID لمحفظة RedotPay الدولية.',
      icon: CreditCard,
      accent: 'border-rose-500/40 bg-rose-500/10 text-rose-500',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-br from-[#102A56] via-slate-900 to-[#0A1B38] rounded-3xl border border-[#3478F0]/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#3478F0]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 max-w-2xl text-center sm:text-right space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3478F0]/20 border border-[#3478F0]/40 text-[#AFC9FA] text-xs font-bold">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>طرق دفع معتمدة ومناسبة للسوق الجزائري 🇩🇿</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            ادفع بسهولة بالدينار الجزائري وبدون بطاقة دولية
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            نوفر لك وسائل الدفع الرسمية الأكثر أماناً وسرعة داخل الجزائر مع تفعيل مباشر لاشتراكك فور إتمام التحويل.
          </p>
        </div>

        {/* Payment Methods Grid */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {methods.map((method) => {
            const Icon = method.icon;
            return (
              <div
                key={method.id}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-[#3478F0]/60 hover:shadow-xl hover:shadow-[#3478F0]/10 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center font-bold ${method.accent} group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {method.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-sm text-white group-hover:text-[#3478F0] transition-colors">
                      {method.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                      {method.nameEn}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {method.description}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-[#7EA9F6]">
                  <span className="font-semibold">دفع يدوي آمن وموثق</span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom micro-copy */}
        <div className="relative z-10 mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p className="text-center sm:text-right">
            🔒 يتم تدقيق ومعالجة الوصلات من قبل فريق المتجر لتسليم اشتراكك بسرعة وأمان.
          </p>
          <Link
            href="/category/all"
            className="inline-flex items-center gap-1.5 text-[#7EA9F6] hover:text-white font-bold transition"
          >
            <span>اختر اشتراكك الآن</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
