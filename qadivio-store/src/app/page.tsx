import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Cpu, 
  Palette, 
  Code, 
  GraduationCap, 
  Film, 
  LayoutGrid, 
  Search, 
  Zap, 
  ShieldCheck, 
  ArrowLeft, 
  MessageSquare,
  ChevronDown
} from 'lucide-react';
import { getProducts } from '@/lib/db';
import { STORE_CATEGORIES, STORE_FAQS } from '@/lib/data';
import { ProductCard } from '@/components/product/ProductCard';
import { DealShowcase } from '@/components/product/DealShowcase';
import { TrendingMarquee } from '@/components/home/TrendingMarquee';
import { PaymentMethodsBanner } from '@/components/home/PaymentMethodsBanner';
import { TrustAndChannelsSection } from '@/components/home/TrustAndChannelsSection';

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="space-y-14 sm:space-y-20 pb-20">
      
      {/* 1. HERO SECTION - ROYAL BLUE & DEEP NAVY TECH MARKETPLACE */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#102A56] via-[#0A1124] to-[#0A1124] pt-8 sm:pt-14 pb-14 sm:pb-20 border-b border-[#3478F0]/20">
        {/* Subtle futuristic tech grid background */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none" 
          style={{
            backgroundImage: `radial-gradient(#3478F0 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Ambient Royal Blue Glow Spheres */}
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-[#3478F0]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-4 w-80 h-80 bg-[#538BF3]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Right: Brand Headline, CTAs & Quick Filters */}
            <div className="lg:col-span-7 text-center lg:text-right space-y-6">
              
              {/* Trust Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3478F0]/15 border border-[#3478F0]/30 text-[#AFC9FA] text-xs font-bold backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#3478F0] animate-ping" />
                <span>الوجهة الرسمية للاشتراكات الرقمية والذكاء الاصطناعي في الجزائر 🇩🇿</span>
              </div>

              {/* Strong Arabic Headline (Per requirement) */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.15] tracking-tight">
                كل عالمك الرقمي{' '}
                <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#7EA9F6] via-[#3478F0] to-[#AFC9FA]">
                  في مكان واحد
                </span>
              </h1>

              {/* Supporting Text (Per requirement) */}
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto lg:mr-0 leading-relaxed font-medium">
                اكتشف أفضل الاشتراكات الرقمية وأدوات الذكاء الاصطناعي بأسعار مناسبة داخل الجزائر.
              </p>

              {/* Primary & Secondary Action CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
                <Link
                  href="/category/all"
                  className="px-6 py-3.5 rounded-2xl bg-[#3478F0] hover:bg-[#2565D8] text-white font-black text-sm shadow-xl shadow-[#3478F0]/30 hover:shadow-[#3478F0]/50 transition-all duration-300 flex items-center gap-2 active:scale-95"
                >
                  <span>اكتشف الاشتراكات</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>

                <a
                  href="#contact-channels"
                  className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-extrabold text-sm border border-white/20 transition-all backdrop-blur-md flex items-center gap-2 active:scale-95"
                >
                  <MessageSquare className="w-4 h-4 text-[#7EA9F6]" />
                  <span>تواصل معنا</span>
                </a>
              </div>

              {/* Category Quick Pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2">
                <Link
                  href="/category/ai-universe"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-[#102A56] text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Cpu className="w-3.5 h-3.5 text-[#3478F0]" />
                  <span>AI Tools</span>
                </Link>

                <Link
                  href="/category/creator-zone"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-[#102A56] text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Palette className="w-3.5 h-3.5 text-pink-400" />
                  <span>Design & Content</span>
                </Link>

                <Link
                  href="/category/dev-station"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-[#102A56] text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Code className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Development</span>
                </Link>

                <Link
                  href="/category/education"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-[#102A56] text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Education</span>
                </Link>

                <Link
                  href="/category/streaming-productivity"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-[#102A56] text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Film className="w-3.5 h-3.5 text-amber-400" />
                  <span>Entertainment</span>
                </Link>
              </div>

              {/* Instant Search Bar */}
              <div className="pt-2 max-w-lg mx-auto lg:mr-0">
                <form action="/category/all" method="GET" className="relative flex items-center">
                  <input
                    type="text"
                    name="search"
                    placeholder="ابحث عن اشتراكك (مثل ChatGPT, Canva, Cursor, Duolingo)..."
                    className="w-full py-3.5 pr-11 pl-28 text-xs sm:text-sm font-semibold rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#3478F0] shadow-xl"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-4 top-4" />
                  <button
                    type="submit"
                    className="absolute left-2 top-2 bottom-2 bg-[#3478F0] hover:bg-[#2565D8] text-white font-extrabold text-xs px-4 rounded-xl transition-all shadow-md"
                  >
                    بحث فوري
                  </button>
                </form>
              </div>

              {/* Service Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-2 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400 fill-current" />
                  تسليم فوري وآلي
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  ضمان رسمي كامل المدة
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="font-bold text-[#7EA9F6]">BaridiMob • CCP • Flexy • RedotPay</span>
                </span>
              </div>
            </div>

            {/* Left: Featured Deals Showcase */}
            <div className="lg:col-span-5">
              <DealShowcase products={products} />
            </div>

          </div>
        </div>
      </section>

      {/* 2. TRENDING PRODUCTS MARQUEE */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3478F0] animate-pulse" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              الاشتراكات الأكثر طلباً في الجزائر 🔥
            </h2>
          </div>
          <Link
            href="/category/all"
            className="text-xs font-bold text-[#3478F0] hover:text-[#2565D8] flex items-center gap-1"
          >
            عرض الكل
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
        <TrendingMarquee products={products} />
      </section>

      {/* 3. CATEGORIES EXPLORER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            تصفح حسب التصنيف
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            اختر مجالك وتصفح أفضل البرامج والأدوات الرقمية المختارة بعناية
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {STORE_CATEGORIES.map((cat) => {
            const iconsMap: Record<string, any> = {
              all: LayoutGrid,
              'ai-universe': Cpu,
              'creator-zone': Palette,
              'dev-station': Code,
              education: GraduationCap,
              'streaming-productivity': Film,
            };
            const Icon = iconsMap[cat.slug] || Sparkles;

            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-[#3478F0]/60 hover:shadow-xl hover:shadow-[#3478F0]/10 text-center transition-all flex flex-col items-center justify-center gap-2.5"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#EAF2FF] dark:bg-[#102A56] text-[#3478F0] dark:text-[#7EA9F6] border border-[#3478F0]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-[#3478F0] transition-colors">
                    {cat.nameAr}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                    {cat.nameEn}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. PAYMENT METHODS SHOWCASE BANNER (BaridiMob, CCP, Flexy, RedotPay) */}
      <PaymentMethodsBanner />

      {/* 5. MAIN PRODUCT CATALOG GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#3478F0] font-bold text-xs mb-1">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>كتالوج الاشتراكات والبرمجيات المعتمدة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              باقات واشتراكات متوفرة للتسليم الفوري
            </h2>
          </div>

          <Link
            href="/category/all"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#102A56] hover:bg-[#3478F0] text-white font-extrabold text-xs transition-colors shadow-md"
          >
            <span>عرض كتالوج المتجر كاملاً</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. TRUST, BUSINESS VALUES & OFFICIAL SOCIAL CHANNELS */}
      <TrustAndChannelsSection />

      {/* 7. FAQ SECTION PREVIEW */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            الأسئلة الأكثر شيوعاً
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            إجابات واضحة ومباشرة حول كيفية الطلب، التفعيل، وطرق الدفع
          </p>
        </div>

        <div className="space-y-3">
          {STORE_FAQS.slice(0, 4).map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm"
            >
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#EAF2FF] dark:bg-[#102A56] text-[#3478F0] dark:text-[#7EA9F6] flex items-center justify-center text-xs font-black">
                  ؟
                </span>
                {faq.question}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pr-8 font-medium">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center pt-6">
          <Link
            href="/faq"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#3478F0] hover:underline"
          >
            <span>عرض جميع الأسئلة الشائعة والمعلومات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
