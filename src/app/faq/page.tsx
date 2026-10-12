'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, MessageCircle, ShieldCheck, Zap } from 'lucide-react';
import { STORE_FAQS } from '@/lib/data';

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10" dir="rtl">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 font-bold text-xs border border-brand-500/20">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>مركز المساعدة والمعلومات</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          الأسئلة الشائعة حول متجر Qadivio
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          كل ما تحتاج معرفته عن كيفية الطلب، طرق الدفع المعتمدة، ضمان الاشتراكات، وسرعة التفعيل
        </p>
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-3">
        {STORE_FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
              >
                <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-brand-500' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 mt-1">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Support CTA Card */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 rounded-3xl border border-indigo-800/40 p-6 sm:p-8 text-center sm:text-right flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-white">هل لديك استفسار آخر غير موجود هنا؟</h3>
          <p className="text-xs text-slate-300">
            فريق الدعم الفني متواجد عبر واتساب للرد على كافة أسئلتكم ومساعدتكم خطوة بخطوة.
          </p>
        </div>

        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '213555000000'}?text=${encodeURIComponent('مرحباً كاديفيو، لدي استفسار خاص.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs px-6 py-3.5 rounded-2xl shadow-lg transition whitespace-nowrap"
        >
          <MessageCircle className="w-4 h-4" />
          <span>تواصل مع الدعم الفني الآن</span>
        </a>
      </div>

    </div>
  );
}
