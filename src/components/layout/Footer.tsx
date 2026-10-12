import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Zap, Headphones, CreditCard } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 pt-16 pb-24 md:pb-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-800/60 mb-12">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">تسليم وتفعيل فوري</h4>
              <p className="text-xs text-slate-400 mt-0.5">استلم حسابك أو كود التفعيل خلال دقائق معدودة بعد الدفع.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">ضمان كامل المدة 100%</h4>
              <p className="text-xs text-slate-400 mt-0.5">اشتراكات أصلية ورسمية مع تعويض واستبدال فوري عند أي مشكلة.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">دعم فني متواصل 24/7</h4>
              <p className="text-xs text-slate-400 mt-0.5">فريق متخصص جاهز للإجابة والمساعدة مباشرة عبر واتساب والموقع.</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-brand-accent" />
                </div>
              </div>
              <span className="text-xl font-black text-white">
                QADIVIO<span className="text-brand-500">.STORE</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              متجر كاديفيو ستور هو المنصة الجزائرية الرائدة المتخصصة في تقديم اشتراكات أدوات الذكاء الاصطناعي، البرامج الرقمية، والحلول التقنية بأفضل الأسعار وأعلى معايير الأمان وسرعة التفعيل.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-extrabold text-white mb-4">التصنيفات والخدمات</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/category/ai-universe" className="hover:text-brand-400 transition">
                  أدوات الذكاء الاصطناعي (AI Tools)
                </Link>
              </li>
              <li>
                <Link href="/category/creator-zone" className="hover:text-brand-400 transition">
                  التصميم والمونتاج (Canva & CapCut)
                </Link>
              </li>
              <li>
                <Link href="/category/dev-station" className="hover:text-brand-400 transition">
                  محطة المطورين (Cursor & Copilot)
                </Link>
              </li>
              <li>
                <Link href="/category/education" className="hover:text-brand-400 transition">
                  التعليم وتطوير المهارات (Coursera)
                </Link>
              </li>
              <li>
                <Link href="/category/streaming-productivity" className="hover:text-brand-400 transition">
                  الترفيه والإنتاجية (YouTube Premium)
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-extrabold text-white mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/category/all" className="hover:text-brand-400 transition">
                  تصفح جميع الاشتراكات
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-brand-400 transition">
                  تتبع حالة الطلب الفوري
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-400 transition">
                  الأسئلة الشائعة والشروط
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-brand-400 transition">
                  دخول لوحة الإدارة
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div>
            <h4 className="text-sm font-extrabold text-white mb-4">طرق الدفع المعتمدة</h4>
            <p className="text-xs text-slate-400 mb-3">
              نوفر خيارات دفع آمنة وسهلة داخل الجزائر:
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-bold">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 flex items-center gap-1">
                <CreditCard className="w-3 h-3" /> بريدي موب BaridiMob
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400">
                الحساب البريدي CCP
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-indigo-400">
                الذهبية / CIB
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                USDT (Binance Pay)
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 جميع الحقوق محفوظة لـ Qadivio Store • متجر كاديفيو للخدمات الرقمية</p>
          <div className="flex items-center gap-4">
            <span>الجزائر • تفعيل لجميع الولايات الـ 58</span>
            <span className="text-brand-500 font-mono font-bold">v1.0.0</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
