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
  ExternalLink
} from 'lucide-react';
import { Order, Product, OrderStatus } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { META_PIXEL_ID } from '@/lib/meta-pixel';

export default function AdminDashboardPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'stats' | 'settings'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    productsCount: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold">إجمالي المبيعات</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {formatPrice(stats.totalRevenue)}
          </div>
          <span className="text-[10px] text-emerald-500 font-bold">الطلبات المكتملة والمؤكدة</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold">إجمالي الطلبات</span>
            <Package className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {stats.totalOrders}
          </div>
          <span className="text-[10px] text-slate-400">طلب مسجل بالنظام</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold">بانتظار التفعيل</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-500">
            {stats.pendingOrders}
          </div>
          <span className="text-[10px] text-amber-500 font-bold">تحتاج لمراجعة أو تسليم كود</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold">المنتجات في المتجر</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {stats.productsCount}
          </div>
          <span className="text-[10px] text-indigo-500 font-bold">أدوات واشتراكات نشطة</span>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
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
          className={`px-4 py-2 rounded-xl text-xs font-black transition ${
            activeTab === 'products'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          إدارة المنتجات ({products.length})
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

      {/* TAB 2: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              قائمة المنتجات والاشتراكات المتاحة ({products.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-3 flex flex-col justify-between"
                >
                  <div className="flex gap-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {prod.name}
                      </h4>
                      <span className="text-[10px] text-brand-500 font-semibold block">
                        {prod.categoryNameAr}
                      </span>
                      <span className="text-xs font-black text-slate-900 dark:text-white mt-1 block">
                        {formatPrice(prod.price)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                    <span className="text-[11px] text-emerald-500 font-bold">
                      {prod.inStock ? 'متوفر للتسليم' : 'غير متوفر'}
                    </span>
                    <Link
                      href={`/products/${prod.slug}`}
                      className="text-brand-500 hover:underline text-[11px] font-bold flex items-center gap-1"
                    >
                      <span>معاينة بالمتجر</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SETTINGS & PIXEL */}
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

    </div>
  );
}
