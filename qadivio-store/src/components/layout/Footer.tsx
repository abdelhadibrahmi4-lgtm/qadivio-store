import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Zap, Headphones, Smartphone, Building2, Wallet, CreditCard, ArrowUpLeft } from 'lucide-react';
import { BrandLogo } from '@/components/common/BrandLogo';
import { OFFICIAL_CHANNELS } from '@/lib/data';

export function Footer() {
  return (
    <footer className="bg-[#0A1124] text-slate-300 border-t border-slate-800/80 pt-16 pb-24 md:pb-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-800/60 mb-12">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#102A56]/40 border border-[#3478F0]/20">
            <div className="w-12 h-12 rounded-xl bg-[#3478F0]/15 border border-[#3478F0]/30 flex items-center justify-center text-[#7EA9F6] shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">سرعة التفعيل</h4>
              <p className="text-xs text-slate-400 mt-0.5">تفعيل فوري وآلي للاشتراك خلال دقائق بعد تأكيد الدفع.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#102A56]/40 border border-[#3478F0]/20">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">ضمان كامل واستبدال فوري</h4>
              <p className="text-xs text-slate-400 mt-0.5">اشتراكات أصلية ورسمية 100% مع ضمان استمرارية كامل المدة.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#102A56]/40 border border-[#3478F0]/20">
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">دعم العملاء الرسمي</h4>
              <p className="text-xs text-slate-400 mt-0.5">تواصل مباشر عبر صفحتنا على فيسبوك وحساب إنستغرام.</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <BrandLogo size="md" />
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              الوجهة الجزائرية الموثوقة لشراء وتفعيل اشتراكات أدوات الذكاء الاصطناعي، البرمجيات الرقمية، ومنصات التعليم والترفيه بالدينار الجزائري.
            </p>

            {/* Official Social Links */}
            <div className="space-y-2 pt-2">
              <div className="text-[11px] font-bold text-slate-300">القنوات الرسمية المعتمدة:</div>
              <div className="flex flex-col gap-1.5 text-xs">
                <a
                  href={OFFICIAL_CHANNELS.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition group"
                >
                  <span className="w-6 h-6 rounded-lg bg-[#3478F0] text-white flex items-center justify-center text-xs font-bold">f</span>
                  <span>{OFFICIAL_CHANNELS.facebook.name}</span>
                  <ArrowUpLeft className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition" />
                </a>

                <a
                  href={OFFICIAL_CHANNELS.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition group"
                >
                  <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center text-[10px] font-bold">ig</span>
                  <span className="font-mono">{OFFICIAL_CHANNELS.instagram.name}</span>
                  <ArrowUpLeft className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition" />
                </a>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-extrabold text-white mb-4">التصنيفات والخدمات</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/category/ai-universe" className="hover:text-[#7EA9F6] transition">
                  أدوات الذكاء الاصطناعي (AI Tools)
                </Link>
              </li>
              <li>
                <Link href="/category/creator-zone" className="hover:text-[#7EA9F6] transition">
                  التصميم والمونتاج (Canva & CapCut)
                </Link>
              </li>
              <li>
                <Link href="/category/dev-station" className="hover:text-[#7EA9F6] transition">
                  محطة المطورين (Cursor & Copilot & Lovable)
                </Link>
              </li>
              <li>
                <Link href="/category/education" className="hover:text-[#7EA9F6] transition">
                  التعليم وتطوير المهارات (Coursera & Duolingo)
                </Link>
              </li>
              <li>
                <Link href="/category/streaming-productivity" className="hover:text-[#7EA9F6] transition">
                  الترفيه والإنتاجية (YouTube & Spotify & Prime)
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-extrabold text-white mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/category/all" className="hover:text-[#7EA9F6] transition">
                  تصفح جميع الاشتراكات
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-[#7EA9F6] transition">
                  تتبع حالة الطلب الفوري
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#7EA9F6] transition">
                  الأسئلة الشائعة ومعلومات الدفع
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-[#7EA9F6] transition">
                  دخول لوحة الإدارة
                </Link>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div>
            <h4 className="text-sm font-extrabold text-white mb-4">طرق الدفع المعتمدة</h4>
            <p className="text-xs text-slate-400 mb-3">
              دفع بالدينار الجزائري عبر القنوات المعتمدة:
            </p>
            <div className="flex flex-col gap-2 text-xs font-bold">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                <span>بريدي موب BaridiMob (RIP)</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>الحساب البريدي الجاري CCP</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-blue-400 flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                <span>شحن رصيد فليكسي Flexy</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span>محفظة ريدوت باي RedotPay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 جميع الحقوق محفوظة لـ Qadivio Store • متجر كاديفيو للخدمات الرقمية</p>
          <div className="flex items-center gap-4">
            <span>الجزائر 🇩🇿 • تفعيل فوري لجميع الولايات الـ 58</span>
            <span className="text-[#3478F0] font-mono font-bold">v1.2.0</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
