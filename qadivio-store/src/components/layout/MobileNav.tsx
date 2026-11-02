'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Package, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export function MobileNav() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();

  const navItems = [
    { label: 'الرئيسية', href: '/', icon: Home, active: pathname === '/' },
    { label: 'المتجر', href: '/category/all', icon: Grid, active: pathname.startsWith('/category') || pathname.startsWith('/products') },
    { label: 'تتبع الطلب', href: '/track', icon: Package, active: pathname === '/track' },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 md:hidden pb-safe select-none">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${
                item.active
                  ? 'text-brand-600 dark:text-brand-400 font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}

        {/* Cart Trigger Button */}
        <button
          onClick={openCart}
          className="flex flex-col items-center justify-center w-16 h-full text-slate-500 dark:text-slate-400 relative hover:text-brand-500 transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-1" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-brand-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px]">السلة</span>
        </button>
      </div>
    </div>
  );
}
