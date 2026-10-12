'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingBag, 
  Search, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Package, 
  HelpCircle,
  Zap,
  Lock
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { trackSearch } from '@/lib/meta-pixel';

export function Header() {
  const router = useRouter();
  const { totalItems, openCart } = useCart();
  const [isDark, setIsDark] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Dark mode check
    const savedTheme = localStorage.getItem('qadivio_theme') || 'dark';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDark ? 'dark' : 'light';
    setIsDark(!isDark);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('qadivio_theme', nextTheme);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      trackSearch(searchQuery.trim());
      router.push(`/category/all?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white text-[11px] sm:text-xs py-2 px-4 border-b border-indigo-800/40 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-sm">
              عرض خاص ⚡
            </span>
            <span className="font-medium text-slate-200">
              استخدم كوبون <strong className="text-amber-300 font-bold">QADIVIO10</strong> للحصول على خصم 10% إضافي
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              تسليم فوري وآلي
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ضمان كامل طوال مدة الاشتراك
            </span>
            <Link
              href="/admin/login"
              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 transition"
              title="لوحة الإدارة"
            >
              <Lock className="w-3 h-3" />
              لوحة الإدارة
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-brand-accent p-0.5 shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-all duration-300">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-brand-accent animate-pulse-subtle" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                  QADIVIO<span className="text-brand-500 font-extrabold text-sm sm:text-base mr-1">.STORE</span>
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-semibold -mt-1 hidden xs:inline">
                  متجر الاشتراكات الرقمية والذكاء الاصطناعي
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
              <Link
                href="/"
                className="px-3 py-2 rounded-xl hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
              >
                الرئيسية
              </Link>
              <Link
                href="/category/all"
                className="px-3 py-2 rounded-xl hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
              >
                المتجر
              </Link>
              <Link
                href="/category/ai-universe"
                className="px-3 py-2 rounded-xl text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/50 hover:bg-brand-100 dark:hover:bg-brand-900/40 transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                أدوات AI
              </Link>
              <Link
                href="/track"
                className="px-3 py-2 rounded-xl hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition flex items-center gap-1"
              >
                <Package className="w-4 h-4 text-slate-400" />
                تتبع الطلب
              </Link>
              <Link
                href="/faq"
                className="px-3 py-2 rounded-xl hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition flex items-center gap-1"
              >
                <HelpCircle className="w-4 h-4 text-slate-400" />
                الأسئلة الشائعة
              </Link>
            </nav>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm mx-2">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  placeholder="ابحث عن اشتراك (ChatGPT, Canva...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-inner"
                />
                <button
                  type="submit"
                  aria-label="بحث"
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-brand-500"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Actions (Cart, Dark mode, Mobile Menu) */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={toggleTheme}
                  aria-label="تبديل الوضع الليلي والنهاري"
                  className="p-2 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
                </button>
              )}

              {/* Cart Button */}
              <button
                onClick={openCart}
                aria-label="سلة المشتريات"
                className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-500/30 font-bold transition shadow-sm"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="hidden sm:inline text-xs font-black">السلة</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scale">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="القائمة"
                className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-4 shadow-xl">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="ابحث عن أداة أو اشتراك..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="absolute right-3 top-3 text-slate-400 hover:text-brand-500"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            <nav className="flex flex-col space-y-2 text-sm font-bold text-slate-800 dark:text-slate-200">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
              >
                <span>الرئيسية</span>
                <span className="text-xs text-slate-400">Home</span>
              </Link>
              <Link
                href="/category/all"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
              >
                <span>جميع المنتجات والاشتراكات</span>
                <span className="text-xs text-brand-500 font-mono">10+</span>
              </Link>
              <Link
                href="/category/ai-universe"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  أدوات الذكاء الاصطناعي
                </span>
                <span className="text-xs font-mono">AI Pro</span>
              </Link>
              <Link
                href="/track"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-slate-400" />
                  تتبع الطلب
                </span>
                <span className="text-xs text-slate-400">Order Track</span>
              </Link>
              <Link
                href="/faq"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  الأسئلة الشائعة
                </span>
                <span className="text-xs text-slate-400">FAQ</span>
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-slate-500 text-xs"
              >
                <span className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  لوحة تحكم الإدارة (Admin)
                </span>
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
