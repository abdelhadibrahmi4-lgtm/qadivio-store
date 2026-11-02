import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Zap, ArrowLeft, Smartphone, CheckCircle } from 'lucide-react';

export function DigitalExperienceBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: VR & Futuristic Digital Entertainment */}
        <div className="group relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-xl flex flex-col justify-between">
          <div className="relative aspect-[16/9] sm:aspect-[2/1] overflow-hidden bg-slate-950">
            <img
              src="/brand/vr-banner.jpg"
              alt="متوفر أفضل الخدمات الإلكترونية والاشتراكات"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            
            <div className="absolute top-4 right-4 bg-[#3478F0] text-white text-[11px] font-black px-3 py-1 rounded-full shadow-lg">
              الصفحة رقم 01 في الجزائر 🇩🇿
            </div>
          </div>

          <div className="p-6 space-y-3 relative z-10 -mt-8 bg-slate-900/90 backdrop-blur-md rounded-t-3xl border-t border-slate-800">
            <h3 className="text-lg sm:text-xl font-black text-white">
              متوفر أفضل الخدمات الإلكترونية والاشتراكات
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              أفلام ومسلسلات، مباريات وبرامج ترفيهية، أدوات الذكاء الاصطناعي والتصميم... كل ما تحتاجه متاح بتسليم فوري وأفضل الأسعار بالدينار.
            </p>

            <div className="pt-2 flex items-center justify-between">
              <Link
                href="/category/streaming-productivity"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7EA9F6] hover:text-white transition"
              >
                <span>استكشف باقات الترفيه والإنتاجية</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Card 2: VIP Black Membership Card & Smartphone Setup */}
        <div className="group relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-xl flex flex-col justify-between">
          <div className="relative aspect-[16/9] sm:aspect-[2/1] overflow-hidden bg-slate-950">
            <img
              src="/brand/vip-card-hand.jpg"
              alt="بطاقة عضوية كاديفيو الرقمية"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ضمان شامل 100%</span>
            </div>
          </div>

          <div className="p-6 space-y-3 relative z-10 -mt-8 bg-slate-900/90 backdrop-blur-md rounded-t-3xl border-t border-slate-800">
            <h3 className="text-lg sm:text-xl font-black text-white">
              اشتراكك الرقمي بين يديك في دقائق
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              تفعيل رسمي مباشر على بريدك الإلكتروني الشخصي بدون مشاركة كلمات المرور، أو تسليم حساب جاهز ومحمي للاستخدام الفوري على هاتفك وحاسوبك.
            </p>

            <div className="pt-2 flex items-center justify-between">
              <Link
                href="/category/ai-universe"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7EA9F6] hover:text-white transition"
              >
                <span>اكتشف أقوى أدوات الذكاء الاصطناعي</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
