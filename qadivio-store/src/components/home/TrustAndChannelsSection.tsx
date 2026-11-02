import React from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Headphones, 
  MousePointerClick, 
  CreditCard, 
  PackageSearch, 
  ShieldCheck, 
  ArrowUpLeft, 
  ExternalLink 
} from 'lucide-react';
import { STORE_VALUES, OFFICIAL_CHANNELS } from '@/lib/data';

export function TrustAndChannelsSection() {
  const valueIcons: Record<string, any> = {
    speed: Zap,
    support: Headphones,
    ease: MousePointerClick,
    payment: CreditCard,
    tracking: PackageSearch,
  };

  return (
    <div id="contact-channels" className="space-y-12">
      {/* 1. Official Business Values Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3478F0]/10 text-[#3478F0] dark:text-[#7EA9F6] border border-[#3478F0]/20 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>معايير الثقة والاحترافية في Qadivio Store</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            لماذا يختارنا عملاء الخدمات الرقمية في الجزائر؟
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            نقدم حلاً متكاملاً يجمع بين سرعة التفعيل، أمان الاشتراكات، وسهولة الدفع المحلي.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {STORE_VALUES.map((val) => {
            const Icon = valueIcons[val.id] || ShieldCheck;
            return (
              <div
                key={val.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-[#3478F0]/50 hover:shadow-xl hover:shadow-[#3478F0]/10 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#EAF2FF] dark:bg-[#102A56] text-[#3478F0] dark:text-[#7EA9F6] border border-[#3478F0]/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-[#3478F0] transition-colors">
                      {val.title}
                    </h3>
                    <span className="inline-block mt-1 text-[10px] font-bold text-[#3478F0] bg-[#EAF2FF] dark:bg-[#102A56]/80 px-2 py-0.5 rounded-md">
                      {val.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {val.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Official Social Support Channels Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#102A56] via-slate-900 to-[#0A1B38] rounded-3xl border border-[#3478F0]/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle tech background effect */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#3478F0]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Right: Message & Brand presence */}
            <div className="lg:col-span-7 space-y-4 text-center lg:text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white font-bold text-xs backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>دعم العملاء والتواصل الرسمي 24/7</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                هل تحتاج لمساعدة أو لديك استفسار حول اشتراكك؟
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto lg:mr-0 font-medium">
                فريق متجر <strong className="text-white">Qadivio Store</strong> متواجد دائماً للإجابة عن أسئلتكم ومساعدتكم خطوة بخطوة في تفعيل كافة الاشتراكات عبر صفحاتنا الرسمية الموثقة.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>تواصل آمن ومباشر</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400 fill-current" />
                  <span>استجابة سريعة للطلبات</span>
                </div>
                <Link href="/track" className="text-[#7EA9F6] hover:underline font-bold">
                  تتبع حالة طلبك فورياً ←
                </Link>
              </div>
            </div>

            {/* Left: Interactive Official Channel Buttons */}
            <div className="lg:col-span-5 space-y-3">
              {/* Facebook Card */}
              <a
                href={OFFICIAL_CHANNELS.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white transition-all duration-300 group shadow-lg backdrop-blur-md"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#3478F0] text-white flex items-center justify-center text-xl font-black shadow-md shadow-[#3478F0]/40 group-hover:scale-105 transition-transform">
                    f
                  </div>
                  <div className="text-right">
                    <div className="font-black text-sm text-white">
                      صفحة فيسبوك الرسمية
                    </div>
                    <div className="text-xs text-[#AFC9FA] font-bold">
                      {OFFICIAL_CHANNELS.facebook.name}
                    </div>
                    <div className="text-[10px] text-slate-300 mt-0.5">
                      مراسلة فورية عبر Messenger
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-[#AFC9FA] group-hover:text-white">
                  <span>فتح الصفحة</span>
                  <ArrowUpLeft className="w-4 h-4 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </a>

              {/* Instagram Card */}
              <a
                href={OFFICIAL_CHANNELS.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white transition-all duration-300 group shadow-lg backdrop-blur-md"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center text-lg font-black shadow-md group-hover:scale-105 transition-transform">
                    ig
                  </div>
                  <div className="text-right">
                    <div className="font-black text-sm text-white">
                      حساب إنستغرام الرسمي
                    </div>
                    <div className="text-xs text-pink-300 font-mono font-bold">
                      {OFFICIAL_CHANNELS.instagram.name}
                    </div>
                    <div className="text-[10px] text-slate-300 mt-0.5">
                      تواصل عبر الرسائل المباشرة DM
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-pink-300 group-hover:text-white">
                  <span>زيارة الحساب</span>
                  <ArrowUpLeft className="w-4 h-4 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
