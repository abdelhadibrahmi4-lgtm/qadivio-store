import React from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Tag, 
  ShieldCheck, 
  Clock, 
  Headphones, 
  ArrowLeft,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export function MascotExperienceSection() {
  const guaranteePills = [
    {
      title: 'تفعيل فوري',
      subtitle: 'أقوى العروض بأفضل الأسعار بعد الدفع مباشرة',
      icon: Zap,
      accent: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    },
    {
      title: 'أفضل الأسعار',
      subtitle: 'توفير حقيقي بالدينار الجزائري مقارنة بالأسعار العالمية',
      icon: Tag,
      accent: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
    },
    {
      title: 'ضمان كامل',
      subtitle: 'ضمان شامل واستبدال فوري طوال فترة الاشتراك',
      icon: ShieldCheck,
      accent: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    },
    {
      title: 'متاح 7 أيام / 24 ساعة',
      subtitle: 'خدمة متواصلة بدون انقطاع لتلبية جميع طلباتكم',
      icon: Clock,
      accent: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
    },
    {
      title: 'دعم فني 24/7',
      subtitle: 'نحن هنا لمساعدتك في التفعيل عبر قنواتنا الرسمية',
      icon: Headphones,
      accent: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-br from-[#102A56] via-slate-900 to-[#0A1B38] rounded-3xl border border-[#3478F0]/30 overflow-hidden shadow-2xl relative">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-[#3478F0]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12 relative z-10">
          
          {/* Right: Headline, Story & Benefits */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-right">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3478F0]/20 border border-[#3478F0]/40 text-[#AFC9FA] text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>هوية كاديفيو ستور الرسمية الموثقة 🇩🇿</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              إشتراكات أصلية،{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7EA9F6] via-[#3478F0] to-[#AFC9FA]">
                تجربة آمنة
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-200 font-bold">
              كل ما تحتاجه في عالم الذكاء الاصطناعي والتطبيقات... في مكان واحد!
            </p>

            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto lg:mr-0 leading-relaxed font-medium">
              نحن لا نبيع مجرد حسابات عادية، بل نقدم لك تجربة رقمية مضمونة 100% مع حسابات رسمية مفعلة على بريدك الإلكتروني، بدعم فني مستمر وخيارات دفع تناسب كل الجزائريين.
            </p>

            {/* Quick Guarantees Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-right">
              {guaranteePills.slice(0, 4).map((g, idx) => {
                const Icon = g.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 hover:border-[#3478F0]/40 transition"
                  >
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${g.accent}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-black text-xs text-white flex items-center gap-1.5">
                        <span>{g.title}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {g.subtitle}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Button */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Link
                href="/category/all"
                className="inline-flex items-center gap-2 bg-[#3478F0] hover:bg-[#2565D8] text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-[#3478F0]/30 transition-all active:scale-95"
              >
                <span>تصفح جميع الاشتراكات المتاحة</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Left: Official 3D Mascot Graphic with Orbiting Ecosystem */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md group">
              {/* Glow Behind Image */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#3478F0] to-[#538BF3] rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition duration-500" />

              {/* Main Card with Official 3D Mascot */}
              <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-slate-950 aspect-[4/5] sm:aspect-square">
                <img
                  src="/brand/mascot-3d-orbit.jpg"
                  alt="شخصية كاديفيو ستور الرسمية والاشتراكات الرقمية"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Bottom Badge */}
                <div className="absolute bottom-3 inset-x-3 p-3 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-extrabold text-white text-xs">حسابات رسمية ومضمونة</span>
                  </div>
                  <span className="text-[10px] text-[#7EA9F6] font-bold bg-[#102A56] px-2 py-0.5 rounded-md">
                    تفعيل فوري ⚡
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
