'use client';

import React, { useEffect, useState } from 'react';
import { Activity, CheckCircle, ChevronDown, ChevronUp, ShieldCheck, X } from 'lucide-react';
import { META_PIXEL_ID } from '@/lib/meta-pixel';

interface LoggedEvent {
  id: string;
  eventName: string;
  parameters: Record<string, unknown>;
  timestamp: string;
}

export function PixelEventDebugger() {
  const [events, setEvents] = useState<LoggedEvent[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handlePixelEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{
        eventName: string;
        parameters: Record<string, unknown>;
        timestamp: string;
      }>;
      if (customEvent.detail) {
        const newEvent: LoggedEvent = {
          id: `${Date.now()}-${Math.random()}`,
          eventName: customEvent.detail.eventName,
          parameters: customEvent.detail.parameters,
          timestamp: customEvent.detail.timestamp,
        };
        setEvents((prev) => [newEvent, ...prev.slice(0, 19)]);
      }
    };

    window.addEventListener('qadivio_pixel_event', handlePixelEvent);
    return () => window.removeEventListener('qadivio_pixel_event', handlePixelEvent);
  }, []);

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Meta Ads Pixel Monitor"
      className="fixed bottom-20 left-4 z-50 font-sans text-xs select-none"
    >
      {/* Pill Toggle Button */}
      <div className="flex items-center gap-1 shadow-2xl rounded-full bg-slate-900/90 text-white border border-slate-700/60 p-1 pl-3 backdrop-blur-md">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 hover:text-indigo-400 transition-colors"
          title="افتح سجل أحداث Meta Pixel المباشر"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-bold tracking-wide">Meta Pixel Live</span>
          <span className="bg-indigo-600/80 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {events.length}
          </span>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 text-slate-400 hover:text-white rounded-full"
          title="إخفاء المراقب"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {/* Expanded Logs Drawer */}
      {isOpen && (
        <div className="mt-2 w-80 sm:w-96 max-h-96 bg-slate-900/95 text-slate-100 border border-slate-700 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col animate-slide-up">
          <div className="p-3 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="font-bold text-xs text-white">سجل أحداث Meta Pixel المباشر</div>
                <div className="text-[10px] text-slate-400">Pixel ID: {META_PIXEL_ID}</div>
              </div>
            </div>
            <button
              onClick={() => setEvents([])}
              className="text-[10px] text-slate-400 hover:text-white underline"
            >
              مسح السجل
            </button>
          </div>

          <div className="p-2 space-y-2 overflow-y-auto max-h-72 dir-ltr text-left">
            {events.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                بانتظار تفاعل المستخدم لتسجيل الأحداث...
              </div>
            ) : (
              events.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-slate-800/60 border border-slate-700/50 rounded-lg p-2 transition-all hover:bg-slate-800"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                        ev.eventName === 'Purchase'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : ev.eventName === 'AddToCart'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : ev.eventName === 'InitiateCheckout'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      }`}
                    >
                      {ev.eventName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{ev.timestamp}</span>
                  </div>

                  {Object.keys(ev.parameters).length > 0 && (
                    <pre className="text-[10px] bg-slate-950/70 p-1.5 rounded overflow-x-auto text-slate-300 font-mono">
                      {JSON.stringify(ev.parameters, null, 2)}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="p-2 bg-slate-950/60 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              نظام منع تكرار الأحداث (Deduplication) مفعل
            </span>
            <span className="text-emerald-400 font-semibold">Active</span>
          </div>
        </div>
      )}
    </aside>
  );
}
