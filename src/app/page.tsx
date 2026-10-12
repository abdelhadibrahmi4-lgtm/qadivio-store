import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Cpu, 
  Palette, 
  Code, 
  GraduationCap, 
  LayoutGrid, 
  Search, 
  Zap, 
  ShieldCheck, 
  ArrowLeft, 
  Star, 
  CheckCircle,
  Clock,
  CreditCard,
  MessageCircle
} from 'lucide-react';
import { getProducts } from '@/lib/db';
import { STORE_CATEGORIES, INITIAL_REVIEWS, STORE_FAQS } from '@/lib/data';
import { ProductCard } from '@/components/product/ProductCard';
import { DealShowcase } from '@/components/product/DealShowcase';
import { TrendingMarquee } from '@/components/home/TrendingMarquee';

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  const products = await getProducts();
  const featuredProducts = products.filter((p) => p.featured || p.badge);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950/80 via-slate-900 to-slate-950 pt-10 sm:pt-16 pb-16 sm:pb-20 border-b border-indigo-900/40">
        {/* Glow ambient spheres */}
        <div className="absolute -top-32 right-1/4 w-96 h-96 bg-brand-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-10 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Right: Headlines & Category Filters */}
            <div className="lg:col-span-7 text-center lg:text-right space-y-5">
              
              {/* Trust Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-bold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>الوجهة الأولى للاشتراكات الرقمية في الجزائر 🇩🇿</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                وفّر حتى{' '}
                <span className="inline-block bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 px-3 py-0.5 rounded-2xl shadow-lg shadow-amber-400/20 transform -rotate-1">
                  85%
                </span>{' '}
                على أدوات الذكاء الاصطناعي والاشتراكات الرقمية
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto lg:mr-0 leading-relaxed font-medium">
                احصل على تفعيل فوري لحسابات <strong className="text-white">ChatGPT Plus</strong> و <strong className="text-white">Gemini Advanced</strong> و <strong className="text-white">Claude Pro</strong> و <strong className="text-white">Canva Pro</strong> بضمان كامل الدورة وأسعار لا تقبل المنافسة بالدينار الجزائري (BaridiMob / CCP).
              </p>

              {/* Category Quick Pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2">
                <Link
                  href="/category/all"
                  className="px-4 py-2 rounded-xl bg-brand-600 text-white font-extrabold text-xs shadow-md shadow-brand-600/30 flex items-center gap-1.5 hover:bg-brand-500 transition"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>جميع المنتجات</span>
                </Link>
                <Link
                  href="/category/ai-universe"
                  className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Cpu className="w-3.5 h-3.5 text-brand-400" />
                  <span>AI Universe</span>
                </Link>
                <Link
                  href="/category/creator-zone"
                  className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Palette className="w-3.5 h-3.5 text-pink-400" />
                  <span>Creator Zone</span>
                </Link>
                <Link
                  href="/category/dev-station"
                  className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Code className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Dev Station</span>
                </Link>
              </div>

              {/* Search Box */}
              <div className="pt-2 max-w-lg mx-auto lg:mr-0">
                <form action="/category/all" method="GET" className="relative flex items-center">
                  <input
                    type="text"
                    name="search"
                    placeholder="ابحث عن أداة أو اشتراك (مثل Gemini, Canva, Cursor)..."
                    className="w-full py-3.5 pr-11 pl-28 text-xs sm:text-sm font-semibold rounded-2xl bg-white dark:bg-slate-800/90 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-xl"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-4 top-4" />
                  <button
                    type="submit"
                    className="absolute left-2 top-2 bottom-2 bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs px-4 rounded-xl transition-all shadow-md"
                  >
                    بحث فوري
                  </button>
                </form>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400 fill-current" />
                  تسليم فوري وآلي
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  ضمان 100% طوال المدة
                </span>
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-indigo-400" />
                  دفع بالدينار (بريدي موب)
                </span>
              </div>
            </div>

            {/* Left: Deals Showcase Slider */}
            <div className="lg:col-span-5">
              <DealShowcase products={products} />
            </div>

          </div>
        </div>
      </section>

      {/* 2. TRENDING PRODUCTS TICKER (MARQUEE) */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              المنتجات الأكثر طلباً في الجزائر 🔥
            </h2>
          </div>
          <Link
            href="/category/all"
            className="text-xs font-bold text-brand-500 hover:text-brand-400 flex items-center gap-1"
          >
            عرض الكل
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
        <TrendingMarquee products={products} />
      </section>

      {/* 3. CATEGORIES TILES */}
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
          {STORE_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 hover:shadow-xl hover:shadow-brand-500/10 text-center transition-all flex flex-col items-center justify-center gap-2.5"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                  {cat.nameAr}
                </h3>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                  {cat.nameEn}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS CATALOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-bold text-xs mb-1">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>أحدث العروض الحصرية</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              باقات واشتراكات مميزة
            </h2>
          </div>

          <Link
            href="/category/all"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-brand-600 dark:hover:bg-brand-600 text-white font-extrabold text-xs transition-colors shadow-md"
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

      {/* 5. WHY CHOOSE QADIVIO STORE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 rounded-3xl border border-indigo-800/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl text-center sm:text-right space-y-3 mb-8">
            <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">
              لماذا يختارنا مئات العملاء؟
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              تجربة تسوق رقمية استثنائية مع Qadivio Store
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              صممنا متجر كاديفيو لتقديم أعلى مستويات الموثوقية والأمان للمستخدم الجزائري والعربي.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-white text-sm">تفعيل فوري خلال دقائق</h4>
              <p className="text-xs text-slate-400">لا حاجة للانتظار طويلاً، بمجرد تأكيد طلبك يتم تفعيل اشتراكك فورياً.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-white text-sm">ضمان كامل واستبدال فوري</h4>
              <p className="text-xs text-slate-400">جميع الاشتراكات رسمية بنسبة 100% مع ضمان استمرارية كامل المدة المشتراة.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-white text-sm">دفع سهل بالدينار الجزائري</h4>
              <p className="text-xs text-slate-400">ادفع بسهولة عبر بريدي موب BaridiMob، CCP، أو البطاقة الذهبية بدون عمولات إضافية.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-white text-sm">دعم فني عبر واتساب 24/7</h4>
              <p className="text-xs text-slate-400">فريقنا متواجد دائماً لمساعدتك في التفعيل والإجابة على أي استفسار.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-amber-400 font-bold text-xs">
            <Star className="w-4 h-4 fill-current" />
            <span>آراء العملاء الحقيقيين</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            ثقة تتحدث عن نفسها
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            انضم لمئات المستفيدين من خدمات كاديفيو ستور في مختلف ولايات الجزائر
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INITIAL_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] text-slate-400">{rev.date}</span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                "{rev.comment}"
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white">
                    {rev.userName}
                  </div>
                  {rev.wilaya && (
                    <div className="text-[10px] text-slate-400">{rev.wilaya}</div>
                  )}
                </div>
                {rev.verifiedPurchase && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold">
                    <CheckCircle className="w-3 h-3" />
                    شراء موثق
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FAQ SECTION PREVIEW */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            الأسئلة الأكثر شيوعاً
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            إجابات واضحة ومباشرة حول كيفية الطلب، التفعيل، والدفع
          </p>
        </div>

        <div className="space-y-3">
          {STORE_FAQS.slice(0, 3).map((faq, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center text-xs">
                  ؟
                </span>
                {faq.question}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pr-8">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center pt-6">
          <Link
            href="/faq"
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            <span>عرض جميع الأسئلة الشائعة والمعلومات</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

    </div>
  );
}
