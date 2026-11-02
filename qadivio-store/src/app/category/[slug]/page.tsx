import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/db';
import { STORE_CATEGORIES } from '@/lib/data';
import { CategoryClient } from '@/components/category/CategoryClient';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const cat = STORE_CATEGORIES.find((c) => c.slug === params.slug);
  const name = cat ? cat.nameAr : 'جميع الاشتراكات';

  return {
    title: `${name} | اشتراكات رقمية وأدوات الذكاء الاصطناعي - Qadivio Store`,
    description: `تصفح باقات ${name} الرسمية في متجر كاديفيو ستور بأسعار تنافسية ودفع عبر بريدي موب مع تفعيل فوري وضمان شامل.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const products = await getProducts();

  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto py-20 text-center text-slate-400 text-sm" dir="rtl">
        جاري تحميل كتالوج الاشتراكات...
      </div>
    }>
      <CategoryClient
        initialProducts={products}
        currentCategorySlug={params.slug || 'all'}
      />
    </Suspense>
  );
}
