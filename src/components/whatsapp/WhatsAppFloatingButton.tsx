'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export function WhatsAppFloatingButton() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '213555000000';
  const defaultMessage = encodeURIComponent('مرحباً متجر كاديفيو Qadivio Store، أود الاستفسار حول تفعيل أحد الاشتراكات الرقمية.');
  const whatsappUrl = `https://wa.me/${phone}?text=${defaultMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معنا عبر واتساب"
      className="fixed bottom-20 right-4 z-40 group flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 px-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
    >
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
      </span>
      <MessageCircle className="w-5 h-5 fill-current" />
      <span className="font-bold text-xs sm:text-sm tracking-wide hidden sm:inline">دعم فني فوري</span>
    </a>
  );
}
