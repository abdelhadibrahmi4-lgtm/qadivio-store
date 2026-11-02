'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Save, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Tag, 
  Clock, 
  DollarSign, 
  Layers,
  ShieldCheck,
  Upload,
  Image as ImageIcon,
  TrendingUp,
  Percent,
  CheckCircle2
} from 'lucide-react';
import { Product, ProductVariant, AccountTypeOption } from '@/types';
import { formatPrice } from '@/lib/utils';

interface AdminProductEditModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (updatedProduct: Product) => void;
}

export function AdminProductEditModal({
  product,
  isOpen,
  onClose,
  onSaved,
}: AdminProductEditModalProps) {
  const [formData, setFormData] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      // Deep clone to avoid mutating parent state directly
      const cloned: Product = JSON.parse(JSON.stringify(product));
      // Ensure each variant has a costPrice initialized
      cloned.variants = cloned.variants.map((v) => ({
        ...v,
        costPrice: v.costPrice ?? Math.round(v.price * 0.55),
      }));
      setFormData(cloned);
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [product]);

  if (!isOpen || !formData) return null;

  // Handle General Fields
  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  // Handle Image Upload from Device
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg(null);

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (!res.ok) {
        throw new Error('تعذر رفع الصورة عبر الخادم، جاري الحفظ المحلي...');
      }

      const data = await res.json();
      if (data.url) {
        handleInputChange('image', data.url);
        setSuccessMsg('تم رفع وتحديث صورة الاشتراك بنجاح! 🖼️');
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch {
      // Fallback: Read as base64 data url directly
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleInputChange('image', reader.result);
          setSuccessMsg('تم تحميل الصورة بنجاح! 🖼️');
          setTimeout(() => setSuccessMsg(null), 3000);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Variant Edits (Price, Wholesale Cost, Duration, Popular)
  const handleVariantChange = (index: number, field: keyof ProductVariant, value: any) => {
    if (!formData) return;
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: field === 'price' || field === 'costPrice' || field === 'oldPrice' || field === 'durationMonths'
        ? Number(value) || 0
        : value,
    };
    setFormData({ ...formData, variants: updatedVariants });
  };

  // Add New Variant (Plan / Duration)
  const handleAddVariant = () => {
    if (!formData) return;
    const newVariant: ProductVariant = {
      id: `v-${Date.now()}`,
      name: 'باقة جديدة (1 شهر)',
      durationMonths: 1,
      price: 1500,
      costPrice: 900,
      oldPrice: 3000,
      isPopular: false,
    };
    setFormData({
      ...formData,
      variants: [...formData.variants, newVariant],
    });
  };

  // Remove Variant
  const handleRemoveVariant = (index: number) => {
    if (!formData) return;
    if (formData.variants.length <= 1) {
      setErrorMsg('يجب أن يحتوي الاشتراك على باقة واحدة على الأقل');
      return;
    }
    const updated = formData.variants.filter((_, idx) => idx !== index);
    setFormData({ ...formData, variants: updated });
  };

  // Handle Account Types
  const handleAccountTypeChange = (index: number, field: keyof AccountTypeOption, value: any) => {
    if (!formData) return;
    const updated = [...formData.accountTypes];
    updated[index] = {
      ...updated[index],
      [field]: field === 'extraCost' ? Number(value) || 0 : value,
    };
    setFormData({ ...formData, accountTypes: updated });
  };

  const handleAddAccountType = () => {
    if (!formData) return;
    const newType: AccountTypeOption = {
      id: `acc-${Date.now()}`,
      label: 'نوع تفعيل جديد',
      description: 'وصف طريقة التفعيل أو الاستلام',
      extraCost: 0,
    };
    setFormData({
      ...formData,
      accountTypes: [...formData.accountTypes, newType],
    });
  };

  const handleRemoveAccountType = (index: number) => {
    if (!formData) return;
    const updated = formData.accountTypes.filter((_, idx) => idx !== index);
    setFormData({ ...formData, accountTypes: updated });
  };

  // Save changes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validate
    if (formData.variants.length === 0) {
      setErrorMsg('يجب توفر باقة واحدة على الأقل');
      return;
    }

    // Auto calculate base price & cost from lowest variant
    const minPrice = Math.min(...formData.variants.map((v) => v.price));
    const lowestVariant = formData.variants.find((v) => v.price === minPrice);

    const payload: Product = {
      ...formData,
      price: minPrice,
      costPrice: lowestVariant?.costPrice ?? formData.costPrice ?? Math.round(minPrice * 0.55),
      oldPrice: lowestVariant?.oldPrice || formData.oldPrice,
    };

    setIsSaving(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('حدث خطأ أثناء حفظ التعديلات');
      }

      const saved = await res.json();
      setSuccessMsg('تم حفظ التعديلات وتحديث المتجر بنجاح! 🎉');
      onSaved(saved);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || 'تعذر حفظ المنتج');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto" dir="rtl">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in my-auto">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#3478F0]/30 shadow-sm shrink-0">
              <img
                src={formData.image}
                alt={formData.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                تعديل المنتج والباقات والأرباح: {formData.name}
              </h3>
              <span className="text-[11px] text-[#3478F0] font-bold">
                {formData.categoryNameAr} ({formData.slug})
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="إغلاق النافذة"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Notifications */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. PRODUCT IMAGE UPLOADER & PREVIEW */}
          <div className="space-y-4 bg-gradient-to-r from-blue-900/20 via-slate-900/40 to-indigo-900/20 p-5 rounded-2xl border border-blue-500/30">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-xs sm:text-sm text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#3478F0]" />
                <span>صورة الاشتراك والمنتج (تغيير ورفع صورة جديدة)</span>
              </h4>
              <span className="text-[10px] text-blue-300 font-bold bg-blue-500/20 px-2 py-0.5 rounded-full">
                معاينة فورية
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Image Preview Box */}
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-slate-950 border-2 border-blue-500/40 shadow-xl shrink-0 group">
                <img
                  src={formData.image}
                  alt={formData.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1"
                >
                  <Upload className="w-4 h-4 text-blue-400" />
                  <span>تغيير الصورة</span>
                </button>
              </div>

              {/* Upload Controls */}
              <div className="flex-1 space-y-3 w-full">
                <div>
                  <label className="block text-[11px] font-bold text-slate-200 mb-1">
                    رفع صورة جديدة من جهازك (كمبيوتر أو هاتف):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-[#3478F0] hover:bg-[#2565D8] disabled:opacity-50 text-white rounded-xl text-xs font-black transition flex items-center gap-2 shadow-md active:scale-95"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploading ? 'جاري رفع الصورة...' : 'اختر صورة من جهازك 📁'}</span>
                    </button>
                    <span className="text-[10px] text-slate-400 font-medium">
                      يدعم PNG, JPG, WEBP بأي دقة
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    أو ضع رابط الصورة المباشر (Image URL):
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    placeholder="https://... أو /uploads/image.png"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700 bg-slate-900 text-white font-mono focus:ring-2 focus:ring-[#3478F0] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. GENERAL PRODUCT DETAILS */}
          <div className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-[#3478F0]" />
              البيانات الأساسية للاشتراك
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اسم الاشتراك الكامل (عربي) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#3478F0] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الاسم بالإنجليزية
                </label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => handleInputChange('nameEn', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#3478F0] outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                الوصف التسويقي المختصر (Tagline)
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#3478F0] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  شارة التميز على البطاقة (Badge)
                </label>
                <input
                  type="text"
                  placeholder="مثال: الأكثر طلباً 🔥 أو عرض خاص ⚡"
                  value={formData.badge || ''}
                  onChange={(e) => handleInputChange('badge', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#3478F0] outline-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-auto">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  حالة التوفر بالمخزون:
                </span>
                <button
                  type="button"
                  onClick={() => handleInputChange('inStock', !formData.inStock)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                    formData.inStock
                      ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/40'
                      : 'bg-red-500/20 text-red-500 border border-red-500/40'
                  }`}
                >
                  {formData.inStock ? 'متوفر للتسليم ✅' : 'غير متوفر ❌'}
                </button>
              </div>
            </div>
          </div>

          {/* 3. SUBSCRIPTION PACKAGES, DURATION, WHOLESALE COST & PROFIT */}
          <div className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#3478F0]" />
                  باقات ومدد الاشتراك وأسعار الجملة والفائدة ({formData.variants.length})
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  حدد سعر البيع وسعر الجملة لحساب صافي الأرباح تلقائياً لكل اشتراك
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddVariant}
                className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-black transition flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة باقة / مدة جديدة</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.variants.map((variant, index) => {
                const cost = variant.costPrice ?? Math.round(variant.price * 0.55);
                const profit = Math.max(0, variant.price - cost);
                const profitMargin = variant.price > 0 ? ((profit / variant.price) * 100).toFixed(0) : '0';

                return (
                  <div
                    key={variant.id || index}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 space-y-3 relative hover:border-[#3478F0]/40 transition shadow-sm"
                  >
                    {/* Variant Title & Duration */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      <div className="sm:col-span-5">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">
                          اسم الباقة (يظهر للزبون):
                        </label>
                        <input
                          type="text"
                          required
                          value={variant.name}
                          onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                          placeholder="مثال: شهر واحد، 3 أشهر، سنة كاملة"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">
                          المدة بالشهور:
                        </label>
                        <input
                          type="number"
                          min={1}
                          required
                          value={variant.durationMonths}
                          onChange={(e) => handleVariantChange(index, 'durationMonths', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                        />
                      </div>

                      <div className="sm:col-span-3 flex items-center gap-2 pt-4 sm:pt-0">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={!!variant.isPopular}
                            onChange={(e) => handleVariantChange(index, 'isPopular', e.target.checked)}
                            className="w-4 h-4 rounded text-[#3478F0] focus:ring-0"
                          />
                          <span>الأكثر طلباً ⭐</span>
                        </label>
                      </div>

                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(index)}
                          aria-label="حذف الباقة"
                          title="حذف الباقة"
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Prices: Selling Price, Wholesale Cost, Old Price */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div>
                        <label className="block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                          سعر البيع للزبون (DZD) *
                        </label>
                        <input
                          type="number"
                          min={0}
                          step={50}
                          required
                          value={variant.price}
                          onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/20 text-slate-900 dark:text-white font-mono font-black"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-blue-600 dark:text-blue-400 mb-1">
                          سعر الشراء / الجملة (DZD) *
                        </label>
                        <input
                          type="number"
                          min={0}
                          step={50}
                          required
                          value={cost}
                          onChange={(e) => handleVariantChange(index, 'costPrice', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-blue-500/40 bg-blue-50/30 dark:bg-blue-950/20 text-slate-900 dark:text-white font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">
                          السعر القديم قبل الخصم (اختياري):
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={variant.oldPrice || ''}
                          onChange={(e) => handleVariantChange(index, 'oldPrice', e.target.value)}
                          placeholder="مثال: 2500"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 font-mono"
                        />
                      </div>
                    </div>

                    {/* LIVE PROFIT DISPLAY PER VARIANT */}
                    <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/25 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                        <span>صافي الفائدة المحققة لكل عملية بيع:</span>
                        <span className="font-mono font-black text-sm text-emerald-500">
                          +{formatPrice(profit)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-emerald-500/20 px-2 py-0.5 rounded-lg text-[11px] font-black">
                        <span>هامش الربح:</span>
                        <span className="font-mono">{profitMargin}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. ACCOUNT DELIVERY OPTIONS */}
          <div className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3478F0]" />
                  خيارات وطرق التفعيل والتسليم ({formData.accountTypes.length})
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  مثال: على إيميلك الشخصي، أو حساب رسمي جاهز، مع إضافة تكلفة إضافية إن أردت
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddAccountType}
                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-xs font-bold transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة خيار تفعيل</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.accountTypes.map((acc, index) => (
                <div
                  key={acc.id || index}
                  className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3 items-center justify-between"
                >
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      required
                      value={acc.label}
                      onChange={(e) => handleAccountTypeChange(index, 'label', e.target.value)}
                      placeholder="عنوان الخيار (مثال: تفعيل رسمي على إيميلك الشخصي)"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    />
                    <input
                      type="text"
                      value={acc.description}
                      onChange={(e) => handleAccountTypeChange(index, 'description', e.target.value)}
                      placeholder="الوصف التوضيحي للعميل"
                      className="w-full px-3 py-1 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    />
                  </div>

                  <div className="w-full sm:w-40 flex items-center gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-0.5">
                        تكلفة إضافية (د.ج):
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={50}
                        value={acc.extraCost}
                        onChange={(e) => handleAccountTypeChange(index, 'extraCost', e.target.value)}
                        className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveAccountType(index)}
                      className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition mt-3"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </form>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            يبدأ سعر البطاقة بعد الحفظ من: <strong className="text-slate-900 dark:text-white font-black">{formatPrice(Math.min(...formData.variants.map((v) => v.price)))}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              إلغاء
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl text-xs font-black bg-[#3478F0] hover:bg-[#2563EB] text-white shadow-lg shadow-[#3478F0]/30 transition flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>جاري الحفظ وتحديث المتجر...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>حفظ التعديلات وتحديث المتجر الفوري 💾</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
