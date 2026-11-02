'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Package, X, ArrowUpLeft, ShieldCheck } from 'lucide-react';
import { OFFICIAL_CHANNELS } from '@/lib/data';

export function OfficialSupportFloating() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 z-40 select-none">
      {/* Expanded Popover */}
      {isOpen && (
        <div className="mb-3 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 animate-fade-in text-right">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h4 className="font-black text-sm text-slate-900 dark:text-white">
                خدمة عملاء Qadivio Store
              </h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="إغلاق"
              className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            تواصل معنا مباشرة عبر قنواتنا الرسمية للمساعدة في تفعيل اشتراكك أو الإجابة عن أي استفسار:
          </p>

          {/* Official Channel Buttons */}
          <div className="space-y-2">
            {/* Facebook Messenger */}
            <a
              href={OFFICIAL_CHANNELS.facebook.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#3478F0] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  f
                </div>
                <div>
                  <div className="font-extrabold text-xs text-slate-900 dark:text-white">
                    صفحة فيسبوك الرسمية
                  </div>
                  <div className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">
                    {OFFICIAL_CHANNELS.facebook.name}
                  </div>
                </div>
              </div>
              <ArrowUpLeft className="w-4 h-4 text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Instagram */}
            <a
              href={OFFICIAL_CHANNELS.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-2xl bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900/50 hover:bg-pink-100 dark:hover:bg-pink-900/40 text-pink-700 dark:text-pink-300 transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  ig
                </div>
                <div>
                  <div className="font-extrabold text-xs text-slate-900 dark:text-white">
                    حساب إنستغرام الرسمي
                  </div>
                  <div className="text-[10px] text-pink-600 dark:text-pink-400 font-mono">
                    {OFFICIAL_CHANNELS.instagram.name}
                  </div>
                </div>
              </div>
              <ArrowUpLeft className="w-4 h-4 text-pink-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Order Tracking */}
            <Link
              href="/track"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-sm">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-xs text-slate-900 dark:text-white">
                    تتبع حالة طلبك
                  </div>
                  <div className="text-[10px] text-slate-400">
                    برقم الطلب أو الهاتف
                  </div>
                </div>
              </div>
              <ArrowUpLeft className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <div className="pt-1 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>قنوات تواصل رسمية وموثقة</span>
          </div>
        </div>
      )}

      {/* Floating Pill Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="تواصل مع خدمة العملاء"
        className="group flex items-center gap-2.5 bg-[#3478F0] hover:bg-[#2565D8] text-white py-2.5 px-4 rounded-full shadow-xl shadow-[#3478F0]/30 hover:shadow-2xl hover:shadow-[#3478F0]/50 transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageSquare className="w-4 h-4 fill-current" />
        <span className="font-black text-xs tracking-wide">تواصل معنا</span>
      </button>
    </div>
  );
}
