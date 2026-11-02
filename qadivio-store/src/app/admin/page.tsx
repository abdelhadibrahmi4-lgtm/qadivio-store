'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Package, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Users, 
  Settings, 
  LogOut, 
  Search, 
  RefreshCw, 
  Eye, 
  MessageCircle, 
  Sparkles, 
  ShieldCheck, 
  Tag, 
  Activity,
  Layers,
  Edit,
  ExternalLink,
  TrendingUp,
  Wallet,
  Coins,
  BarChart3,
  Calendar,
  Percent,
  ArrowUpRight
} from 'lucide-react';
import { Order, Product, OrderStatus } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { META_PIXEL_ID } from '@/lib/meta-pixel';
import { AdminProductEditModal } from '@/components/admin/AdminProductEditModal';

export default function AdminDashboardPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'profits' | 'settings'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalWholesaleCost: 0,
    totalNetProfit: 0,
    todayRevenue: 0,
    todayWholesaleCost: 0,
    todayNetProfit: 0,
    monthRevenue: 0,
    monthWholesaleCost: 0,
    monthNetProfit: 0,
    profitMargin: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    productsCount: 0,
    productsProfitBreakdown: [] as Array<{
      productId: string;
      name: string;
      unitsSold: number;
      revenue: number;
      cost: number;
      profit: number;
    }>,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // Selected product for live editing modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Selected order for status update modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('completed');
  const [activationCode, setActivationCode] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Authenticate
  useEffect(() => {
    const session = localStorage.getItem('qadivio_admin_session');
    if (!session) {
      router.push('/admin/login');
      return;
    }
    loadData();
  }, [router]);

  // Support direct edit via URL query: /admin?edit=slug
  useEffect(() => {
    if (typeof window !== 'undefined' && products.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const editSlug = params.get('edit');
      if (editSlug) {
        const target = products.find((p) => p.slug === editSlug || p.id === editSlug);
        if (target) {
          setActiveTab('products');
          setEditingProduct(target);
          setIsEditModalOpen(true);
        }
      }
    }
  }, [products]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [ordersRes, productsRes, statsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products'),
        fetch('/api/admin/stats'),
      ]);

      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (e) {
      console.error('Failed to load admin data', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('qadivio_admin_session');
    router.push('/admin/login');
  };

  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          activationCodeOrAccount: activationCode.trim() || undefined,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        setSelectedOrder(null);
        setActivationCode('');
        loadData();
      }
    } catch {
      alert('حدث خطأ أثناء تحديث حالة الطلب');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (orderFilter !== 'all' && o.status !== orderFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = o.id.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.includes(q);
      const matchEmail = o.customerEmail.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchPhone && !matchEmail) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" dir="rtl">
      
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-600/10 text-brand-500 border border-brand-500/20 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              لوحة تحكم كاديفيو ستور
            </h1>
            <p className="text-xs text-slate-500">
              إدارة الطلبات، التفعيلات، المنتجات، والتحليلات المباشرة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
          >
            <span>زيارة المتجر</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/20 flex items-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* KPI Stats & Profit Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold">إجمالي المبيعات</span>
            <DollarSign className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {formatPrice(stats.totalRevenue)}
          </div>
          <div className="text-[10px] text-slate-500 flex justify-between font-medium">
            <span>تكلفة الجملة: {formatPrice(stats.totalWholesaleCost)}</span>
          </div>
        </div>

        {/* Card 2: Net Profit (Highlight) */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent border-2 border-emerald-500/30 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-emerald-500">
            <span className="text-xs font-black flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              صافي الفائدة الكلية
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded-full font-black">
              {stats.profitMargin}% هامش
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-500 font-mono">
            +{formatPrice(stats.totalNetProfit)}
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
            الأرباح الصافية بعد خصم تكلفة الشراء
          </span>
        </div>

        {/* Card 3: Today's Profit & Revenue */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              أرباح اليوم
            </span>
            <span className="text-[10px] text-blue-400 font-bold">مبيعات: {formatPrice(stats.todayRevenue)}</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-500 font-mono">
            +{formatPrice(stats.todayNetProfit)}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">صافي فائدة مبيعات اليوم فقط</span>
        </div>

        {/* Card 4: Month's Profit & Revenue */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-purple-500" />
              أرباح هذا الشهر
            </span>
            <span className="text-[10px] text-purple-400 font-bold">مبيعات: {formatPrice(stats.monthRevenue)}</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-500 font-mono">
            +{formatPrice(stats.monthNetProfit)}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">صافي مدخول الشهر الحالي</span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition ${
            activeTab === 'orders'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          إدارة الطلبات ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
            activeTab === 'products'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>إدارة الباقات والاشتراكات ({products.length})</span>
          <span className="bg-amber-400/20 text-amber-500 dark:text-amber-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
            تعديل مباشر
          </span>
        </button>

        <button
          onClick={() => setActiveTab('profits')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
            activeTab === 'profits'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>تقرير الأرباح والمدخول 💰</span>
          <span className="bg-emerald-400/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
            +{formatPrice(stats.totalNetProfit)}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition ${
            activeTab === 'settings'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          إعدادات Meta Pixel والمتجر
        </button>
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="relative w-full sm:max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث برقم الطلب، اسم العميل، الهاتف، أو الإيميل..."
                className="w-full pr-10 pl-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 whitespace-nowrap">الحالة:</span>
              <select
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
              >
                <option value="all">جميع الحالات</option>
                <option value="pending">تم الاستلام (Pending)</option>
                <option value="verifying_payment">مراجعة الدفع</option>
                <option value="processing">جاري التفعيل (Processing)</option>
                <option value="completed">مكتمل (Completed)</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-extrabold">
                  <tr>
                    <th className="p-4">رقم الطلب</th>
                    <th className="p-4">العميل</th>
                    <th className="p-4">المنتجات المطلوبة</th>
                    <th className="p-4">المبلغ</th>
                    <th className="p-4">طريقة الدفع</th>
                    <th className="p-4">الحالة</th>
                    <th className="p-4">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400">
                        لا توجد أي طلبات تطابق الفلتر الحالي.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                        <td className="p-4 font-mono font-black text-brand-600 dark:text-brand-400 whitespace-nowrap">
                          {order.id}
                        </td>
                        <td className="p-4">
                          <div className="font-extrabold text-slate-900 dark:text-white">
                            {order.customerName}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500">
                            {order.customerPhone}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                            {order.customerEmail}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-0.5">
                            {order.items.map((it, idx) => (
                              <div key={idx} className="font-medium text-slate-800 dark:text-slate-200">
                                {it.name} <span className="text-[10px] text-brand-400">({it.variantName})</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 font-black text-slate-900 dark:text-white whitespace-nowrap">
                          {formatPrice(order.total)}
                        </td>
                        <td className="p-4 whitespace-nowrap uppercase font-bold text-[11px] text-amber-500">
                          {order.paymentMethod}
                          {order.paymentReceiptNumber && (
                            <span className="block text-[10px] font-mono text-slate-400">
                              وصل: {order.paymentReceiptNumber}
                            </span>
                          )}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              order.status === 'completed'
                                ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                                : order.status === 'processing'
                                ? 'bg-indigo-500/15 text-indigo-500 border border-indigo-500/30'
                                : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                            }`}
                          >
                            {order.status === 'completed' && 'مكتمل ✅'}
                            {order.status === 'processing' && 'جاري التفعيل ⏳'}
                            {order.status === 'verifying_payment' && 'مراجعة الدفع 🔍'}
                            {order.status === 'pending' && 'معلق 📋'}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setNewStatus(order.status);
                                setActivationCode(order.activationCodeOrAccount || '');
                              }}
                              className="px-2.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                            >
                              <Edit className="w-3 h-3" />
                              <span>تحديث / تفعيل</span>
                            </button>

                            <a
                              href={`https://wa.me/213${order.customerPhone.replace(/^0/, '')}?text=${encodeURIComponent(`مرحباً ${order.customerName}، نتواصل معك بخصوص طلبك رقم ${order.id} من متجر Qadivio Store.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 rounded-lg transition"
                              title="مراسلة العميل على واتساب"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS & PACKAGES EDITOR */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Quick Notice Header */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>لوحة التحكم وتعديل باقات الاشتراكات بدون برمجة</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                اضغط على زر <strong className="text-amber-300">«تعديل الباقات والأسعار»</strong> أمام أي اشتراك لتغيير السعر بالدينار الجزائري، تعديل المدد (شهري، 3 أشهر، سنوي)، أو إضافة باقة جديدة مباشرة دون كتابة أي كود برمجي.
              </p>
            </div>
            <div className="relative w-full md:w-72 shrink-0">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="ابحث عن اشتراك لتعديل باقاته..."
                className="w-full pr-9 pl-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                جميع الاشتراكات والمنتجات ({products.filter((p) => {
                  if (!productSearch.trim()) return true;
                  const q = productSearch.toLowerCase().trim();
                  return p.name.toLowerCase().includes(q) || p.nameEn.toLowerCase().includes(q) || p.categoryNameAr.toLowerCase().includes(q);
                }).length})
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products
                .filter((prod) => {
                  if (!productSearch.trim()) return true;
                  const q = productSearch.toLowerCase().trim();
                  return (
                    prod.name.toLowerCase().includes(q) ||
                    prod.nameEn.toLowerCase().includes(q) ||
                    prod.categoryNameAr.toLowerCase().includes(q)
                  );
                })
                .map((prod) => (
                  <div
                    key={prod.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-4 flex flex-col justify-between hover:border-brand-500/50 transition shadow-sm"
                  >
                    <div>
                      {/* Product Header */}
                      <div className="flex gap-3 items-start">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-sm"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                            {prod.name}
                          </h4>
                          <span className="text-[11px] text-brand-500 font-bold block">
                            {prod.categoryNameAr} ({prod.nameEn})
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-black text-slate-900 dark:text-white">
                              يبدأ من: {formatPrice(prod.price)}
                            </span>
                            {prod.badge && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold border border-brand-200 dark:border-brand-800">
                                {prod.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Variants Summary */}
                      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          <span>الباقات المتاحة ({prod.variants.length}):</span>
                          <span className={prod.inStock ? 'text-emerald-500' : 'text-red-500'}>
                            {prod.inStock ? '● متوفر' : '● غير متوفر'}
                          </span>
                        </div>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                          {prod.variants.map((v) => (
                            <div
                              key={v.id}
                              className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800"
                            >
                              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                                {v.name}
                              </span>
                              <span className="font-black text-brand-600 dark:text-brand-400 font-mono">
                                {formatPrice(v.price)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(prod);
                          setIsEditModalOpen(true);
                        }}
                        className="w-full py-2.5 px-3 bg-brand-600 hover:bg-brand-500 active:scale-[0.98] text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-md shadow-brand-600/20"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>تعديل الباقات والأسعار ⚙️</span>
                      </button>

                      <Link
                        href={`/products/${prod.slug}`}
                        target="_blank"
                        className="w-full py-1.5 text-center text-slate-500 hover:text-brand-500 text-[11px] font-bold flex items-center justify-center gap-1 transition"
                      >
                        <span>معاينة صفحة الاشتراك بالمتجر</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROFITS & FINANCIAL ANALYTICS */}
      {activeTab === 'profits' && (
        <div className="space-y-6">
          {/* Main Financial Overview Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold border border-emerald-500/30">
                  <Coins className="w-3.5 h-3.5" />
                  <span>نظام تتبع صافي الفائدة والأرباح بالدينار الجزائري (DZD)</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  تقرير الأرباح والمدخول المالي لمتجر Qadivio Store
                </h2>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  يتم حساب الأرباح تلقائياً بناءً على <strong className="text-emerald-400">سعر البيع للزبون</strong> مطروحاً منه <strong className="text-blue-400">سعر الشراء / الجملة للاشتراك</strong>، لمعرفة مدخولك اليومي والشهري بدقة.
                </p>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-left shrink-0">
                <span className="text-[10px] text-slate-400 block font-bold">نسبة هامش الربح الإجمالي</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {stats.profitMargin}%
                </span>
              </div>
            </div>

            {/* 4 Financial Metric Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  فائدة اليوم الصافية
                </span>
                <div className="text-xl font-black text-emerald-400 font-mono">
                  +{formatPrice(stats.todayNetProfit)}
                </div>
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>مبيعات: {formatPrice(stats.todayRevenue)}</span>
                  <span>جملة: {formatPrice(stats.todayWholesaleCost)}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-purple-400" />
                  فائدة هذا الشهر الصافية
                </span>
                <div className="text-xl font-black text-emerald-400 font-mono">
                  +{formatPrice(stats.monthNetProfit)}
                </div>
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>مبيعات: {formatPrice(stats.monthRevenue)}</span>
                  <span>جملة: {formatPrice(stats.monthWholesaleCost)}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <Wallet className="w-3.5 h-3.5 text-amber-400" />
                  إجمالي تكلفة الشراء (جملة)
                </span>
                <div className="text-xl font-black text-amber-400 font-mono">
                  {formatPrice(stats.totalWholesaleCost)}
                </div>
                <span className="text-[10px] text-slate-500 block">
                  رأس المال المدفوع لتوفير الاشتراكات
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 space-y-1">
                <span className="text-[11px] font-extrabold text-emerald-300 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  صافي الفائدة التراكمية
                </span>
                <div className="text-xl font-black text-emerald-300 font-mono">
                  +{formatPrice(stats.totalNetProfit)}
                </div>
                <span className="text-[10px] text-emerald-400/80 font-bold block">
                  صافي الأرباح في جيبك (الطلبات المكتملة)
                </span>
              </div>
            </div>
          </div>

          {/* Table: Product Profit Performance */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-brand-500" />
                  <span>تحليل الأرباح والفائدة حسب كل اشتراك</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  يوضح كم حققت من أرباح صافية من كل اشتراك بناءً على عدد مرات بيعه
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-extrabold">
                  <tr>
                    <th className="p-3.5">الاشتراك</th>
                    <th className="p-3.5">سعر البيع الافتتاحي</th>
                    <th className="p-3.5">سعر الجملة الافتتاحي</th>
                    <th className="p-3.5">الفائدة بالقطعة</th>
                    <th className="p-3.5">الكمية المباعة</th>
                    <th className="p-3.5">إجمالي المبيعات</th>
                    <th className="p-3.5">صافي الفائدة المحققة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {products.map((prod) => {
                    const lowestVariant = prod.variants[0];
                    const sellPrice = lowestVariant?.price || prod.price;
                    const costPrice = lowestVariant?.costPrice ?? prod.costPrice ?? Math.round(sellPrice * 0.55);
                    const unitProfit = Math.max(0, sellPrice - costPrice);

                    // Find if there are recorded sales in stats
                    const soldStat = stats.productsProfitBreakdown.find((s) => s.productId === prod.id);
                    const unitsSold = soldStat ? soldStat.unitsSold : 0;
                    const totalSoldRevenue = soldStat ? soldStat.revenue : 0;
                    const totalProfitMade = soldStat ? soldStat.profit : 0;

                    return (
                      <tr key={prod.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-8 h-8 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                            />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                                {prod.name}
                              </div>
                              <span className="text-[10px] text-brand-500 font-medium">
                                {prod.categoryNameAr}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                          {formatPrice(sellPrice)}
                        </td>

                        <td className="p-3.5 font-mono font-bold text-blue-500">
                          {formatPrice(costPrice)}
                        </td>

                        <td className="p-3.5 font-mono font-bold text-emerald-500">
                          +{formatPrice(unitProfit)} ({sellPrice > 0 ? ((unitProfit / sellPrice) * 100).toFixed(0) : 0}%)
                        </td>

                        <td className="p-3.5 font-mono font-bold text-slate-700 dark:text-slate-300">
                          {unitsSold > 0 ? (
                            <span className="px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-500 font-bold">
                              {unitsSold} اشتراك
                            </span>
                          ) : (
                            <span className="text-slate-400">0</span>
                          )}
                        </td>

                        <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                          {unitsSold > 0 ? formatPrice(totalSoldRevenue) : '0 د.ج'}
                        </td>

                        <td className="p-3.5 font-mono font-black text-emerald-500">
                          {unitsSold > 0 ? (
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30">
                              +{formatPrice(totalProfitMade)}
                            </span>
                          ) : (
                            <span className="text-slate-400">0 د.ج</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table: Profit per Completed Order */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-500" />
              <span>سجل الفائدة في كل طلب مكتمل ومفعل</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-extrabold">
                  <tr>
                    <th className="p-3.5">رقم الطلب</th>
                    <th className="p-3.5">العميل</th>
                    <th className="p-3.5">المنتجات المطلوبة</th>
                    <th className="p-3.5">سعر البيع الإجمالي</th>
                    <th className="p-3.5">تكلفة الجملة</th>
                    <th className="p-3.5">الفائدة الصافية المحققة</th>
                    <th className="p-3.5">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {orders
                    .filter((o) => o.status === 'completed')
                    .map((order) => {
                      const orderCost = order.items.reduce((sum, it) => {
                        let c = it.costPrice;
                        if (typeof c !== 'number') {
                          const prod = products.find((p) => p.id === it.productId);
                          const variant = prod?.variants.find((v) => v.name === it.variantName);
                          c = variant?.costPrice ?? prod?.costPrice ?? Math.round(it.price * 0.55);
                        }
                        return sum + c * (it.quantity || 1);
                      }, 0);
                      const profit = Math.max(0, order.total - orderCost);

                      return (
                        <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                          <td className="p-3.5 font-mono font-bold text-brand-600 dark:text-brand-400">
                            {order.id}
                          </td>
                          <td className="p-3.5">
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {order.customerName}
                            </span>
                            <span className="font-mono text-[11px] text-slate-400">
                              {order.customerPhone}
                            </span>
                          </td>
                          <td className="p-3.5">
                            {order.items.map((it, idx) => (
                              <div key={idx} className="text-[11px] text-slate-700 dark:text-slate-300">
                                {it.name} <span className="text-slate-400">({it.variantName})</span>
                              </div>
                            ))}
                          </td>
                          <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                            {formatPrice(order.total)}
                          </td>
                          <td className="p-3.5 font-mono font-bold text-blue-500">
                            {formatPrice(orderCost)}
                          </td>
                          <td className="p-3.5 font-mono font-black text-emerald-500">
                            <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30">
                              +{formatPrice(profit)}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                            {formatDate(order.createdAt)}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SETTINGS & PIXEL */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-500" />
              إعدادات Meta Pixel & الحملات الإعلانية
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              إعدادات تتبع التحويلات لـ Facebook / Instagram Ads
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold">معرّف البيكسل (Meta Pixel ID):</span>
              <span className="font-mono font-black text-brand-400 bg-slate-900 px-3 py-1 rounded-lg">
                {META_PIXEL_ID}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-bold">أحداث البيكسل المجهزة:</span>
              <span className="text-emerald-400 font-bold">
                PageView, ViewContent, Search, AddToCart, InitiateCheckout, Purchase
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-bold">آلية منع تكرار الأحداث (Deduplication):</span>
              <span className="text-emerald-400 font-bold">
                مفعلة تلقائياً عبر LocalStorage و Transaction Tokens
              </span>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white">روابط الـ SEO وملفات الفهرسة:</h4>
            <div className="flex gap-4">
              <a href="/sitemap.xml" target="_blank" className="text-brand-500 hover:underline flex items-center gap-1">
                <span>ملف Sitemap.xml</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a href="/robots.txt" target="_blank" className="text-brand-500 hover:underline flex items-center gap-1">
                <span>ملف Robots.txt</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE ORDER MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-2xl">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                تحديث حالة الطلب: {selectedOrder.id}
              </h3>

              <form onSubmit={handleUpdateOrderStatus} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الحالة الجديدة للطلب:
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="pending">معلق (Pending)</option>
                    <option value="verifying_payment">قيد مراجعة الدفع (Verifying Payment)</option>
                    <option value="processing">جاري التجهيز والتفعيل (Processing)</option>
                    <option value="completed">مكتمل ومفعل بنجاح (Completed)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    كود التفعيل / بيانات الحساب (تظهر للعميل في التتبع):
                  </label>
                  <textarea
                    rows={3}
                    value={activationCode}
                    onChange={(e) => setActivationCode(e.target.value)}
                    placeholder="مثال: تم إرسال الدعوة لبريدك الإلكتروني، أو: Email: user@domain.com | Pass: 123456"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-5 py-2 rounded-xl text-xs font-black bg-brand-600 hover:bg-brand-500 text-white shadow-md disabled:opacity-50"
                  >
                    {isUpdating ? 'جاري الحفظ...' : 'حفظ التحديث'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT & PLANS MODAL */}
      <AdminProductEditModal
        product={editingProduct}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProduct(null);
        }}
        onSaved={(updatedProduct) => {
          setProducts((prev) =>
            prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
          );
        }}
      />

    </div>
  );
}
