import fs from 'fs';
import path from 'path';
import { Product, Order, Coupon, OrderStatus } from '@/types';
import { INITIAL_PRODUCTS } from './data';
import { generateOrderId } from './utils';

// Local storage path for persistent storage
const DATA_DIR = path.join(process.cwd(), '.data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const COUPONS_FILE = path.join(DATA_DIR, 'coupons.json');

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Seed or update products if not exists
  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(INITIAL_PRODUCTS, null, 2), 'utf-8');
  } else {
    try {
      const existing: Product[] = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
      const existingIds = new Set(existing.map((p) => p.id));
      const missing = INITIAL_PRODUCTS.filter((p) => !existingIds.has(p.id));
      if (missing.length > 0) {
        const merged = [...existing, ...missing];
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(merged, null, 2), 'utf-8');
      }
    } catch {
      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(INITIAL_PRODUCTS, null, 2), 'utf-8');
    }
  }

  // Seed coupons if not exists
  if (!fs.existsSync(COUPONS_FILE)) {
    const initialCoupons: Coupon[] = [
      { code: 'QADIVIO10', discountPercentage: 10, minOrderAmount: 1000, active: true },
      { code: 'WELCOME20', discountPercentage: 20, minOrderAmount: 2000, active: true },
      { code: 'RAMADAN', discountPercentage: 15, minOrderAmount: 1500, active: true },
    ];
    fs.writeFileSync(COUPONS_FILE, JSON.stringify(initialCoupons, null, 2), 'utf-8');
  }

  // Seed sample initial orders if not exists
  if (!fs.existsSync(ORDERS_FILE)) {
    const initialOrders: Order[] = [
      {
        id: 'QD-2026-1042',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        customerName: 'محمد أمين رحماني',
        customerPhone: '0550123456',
        customerEmail: 'amine.r@gmail.com',
        wilayaCode: '16',
        wilayaName: 'الجزائر العاصمة',
        city: 'باب الزوار',
        notes: 'يرجى التفعيل على نفس الإيميل',
        items: [
          {
            productId: 'prod-gemini-pro',
            name: 'Gemini Advanced 2.0 Pro',
            variantName: '3 أشهر (الأكثر توفيراً)',
            accountTypeName: 'تفعيل رسمي على إيميلك الشخصي',
            quantity: 1,
            price: 3400,
          },
        ],
        subtotal: 3400,
        discount: 340,
        couponCode: 'QADIVIO10',
        total: 3060,
        paymentMethod: 'baridimob',
        paymentReceiptNumber: 'BM-9823412',
        status: 'completed',
        activationCodeOrAccount: 'Google Invitation link sent to amine.r@gmail.com',
        trackingToken: 'tr_1042_secured',
      },
      {
        id: 'QD-2026-1088',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        customerName: 'فاطمة الزهراء',
        customerPhone: '0661987654',
        customerEmail: 'fatima.design@gmail.com',
        wilayaCode: '31',
        wilayaName: 'وهران',
        city: 'السانية',
        items: [
          {
            productId: 'prod-canva-pro',
            name: 'Canva Pro',
            variantName: 'سنة كاملة (12 شهر)',
            accountTypeName: 'على إيميلك الشخصي الرسمي',
            quantity: 1,
            price: 950,
          },
        ],
        subtotal: 950,
        discount: 0,
        total: 950,
        paymentMethod: 'baridimob',
        status: 'verifying_payment',
        trackingToken: 'tr_1088_secured',
      },
    ];
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(initialOrders, null, 2), 'utf-8');
  }
}

// ---------------- PRODUCTS ----------------

export async function getProducts(): Promise<Product[]> {
  ensureDataDirectory();
  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return INITIAL_PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug || p.id === slug) || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.id === id) || null;
}

export async function saveProduct(product: Product): Promise<Product> {
  ensureDataDirectory();
  const products = await getProducts();
  const index = products.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    products[index] = product;
  } else {
    products.push(product);
  }
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
  return product;
}

// ---------------- ORDERS ----------------

export async function getOrders(): Promise<Order[]> {
  ensureDataDirectory();
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  const orders = await getOrders();
  const cleanId = id.trim().toUpperCase();
  return orders.find((o) => o.id.toUpperCase() === cleanId || o.trackingToken === id) || null;
}

export async function findOrdersByPhone(phone: string): Promise<Order[]> {
  const orders = await getOrders();
  const cleanPhone = phone.replace(/\D/g, '');
  return orders.filter((o) => o.customerPhone.replace(/\D/g, '').includes(cleanPhone));
}

export async function createOrder(data: Omit<Order, 'id' | 'createdAt' | 'status' | 'trackingToken'>): Promise<Order> {
  ensureDataDirectory();
  const orders = await getOrders();
  const products = await getProducts();

  // Attach accurate wholesale cost price for profit tracking
  const enrichedItems = data.items.map((it) => {
    if (it.costPrice !== undefined) return it;
    const prod = products.find((p) => p.id === it.productId);
    const variant = prod?.variants.find((v) => v.name === it.variantName);
    const costPrice = variant?.costPrice ?? prod?.costPrice ?? Math.round(it.price * 0.55);
    return { ...it, costPrice };
  });

  const newOrder: Order = {
    ...data,
    items: enrichedItems,
    id: generateOrderId(),
    createdAt: new Date().toISOString(),
    status: 'pending',
    trackingToken: `trk_${Math.random().toString(36).substring(2, 9)}`,
  };

  orders.unshift(newOrder);
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  return newOrder;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  activationCodeOrAccount?: string
): Promise<Order | null> {
  ensureDataDirectory();
  const orders = await getOrders();
  const index = orders.findIndex((o) => o.id.toUpperCase() === id.trim().toUpperCase());
  if (index === -1) return null;

  orders[index].status = status;
  if (activationCodeOrAccount !== undefined) {
    orders[index].activationCodeOrAccount = activationCodeOrAccount;
  }

  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  return orders[index];
}

// ---------------- COUPONS ----------------

export async function getCoupons(): Promise<Coupon[]> {
  ensureDataDirectory();
  try {
    const raw = fs.readFileSync(COUPONS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function validateCoupon(code: string, orderSubtotal: number): Promise<{ valid: boolean; discountPercentage: number; message: string }> {
  const coupons = await getCoupons();
  const coupon = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());

  if (!coupon) {
    return { valid: false, discountPercentage: 0, message: 'كود الخصم غير موجود' };
  }
  if (!coupon.active) {
    return { valid: false, discountPercentage: 0, message: 'كود الخصم غير مفعّل' };
  }
  if (coupon.minOrderAmount && orderSubtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      discountPercentage: 0,
      message: `الحد الأدنى لتطبيق هذا الكوبون هو ${coupon.minOrderAmount} د.ج`,
    };
  }

  return {
    valid: true,
    discountPercentage: coupon.discountPercentage,
    message: `تم تطبيق الخصم بنجاح (${coupon.discountPercentage}%)! 🎉`,
  };
}

// ---------------- ADMIN STATS & PROFIT TRACKING ----------------

export async function getAdminStats() {
  const orders = await getOrders();
  const products = await getProducts();

  const completedOrders = orders.filter((o) => o.status === 'completed');
  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'verifying_payment' || o.status === 'processing');

  // Helper for order wholesale cost
  const getOrderWholesaleCost = (order: Order) => {
    return order.items.reduce((sum, it) => {
      let cost = it.costPrice;
      if (typeof cost !== 'number') {
        const prod = products.find((p) => p.id === it.productId);
        const variant = prod?.variants.find((v) => v.name === it.variantName);
        cost = variant?.costPrice ?? prod?.costPrice ?? Math.round(it.price * 0.55);
      }
      return sum + cost * (it.quantity || 1);
    }, 0);
  };

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let totalRevenue = 0;
  let totalWholesaleCost = 0;
  let todayRevenue = 0;
  let todayWholesaleCost = 0;
  let monthRevenue = 0;
  let monthWholesaleCost = 0;

  completedOrders.forEach((o) => {
    const oCost = getOrderWholesaleCost(o);
    totalRevenue += o.total;
    totalWholesaleCost += oCost;

    const oDate = new Date(o.createdAt);
    if (oDate.toISOString().split('T')[0] === todayStr) {
      todayRevenue += o.total;
      todayWholesaleCost += oCost;
    }
    if (oDate.getMonth() === currentMonth && oDate.getFullYear() === currentYear) {
      monthRevenue += o.total;
      monthWholesaleCost += oCost;
    }
  });

  const totalNetProfit = Math.max(0, totalRevenue - totalWholesaleCost);
  const todayNetProfit = Math.max(0, todayRevenue - todayWholesaleCost);
  const monthNetProfit = Math.max(0, monthRevenue - monthWholesaleCost);
  const profitMargin = totalRevenue > 0 ? Number(((totalNetProfit / totalRevenue) * 100).toFixed(1)) : 0;

  // Breakdown per product
  const productStatsMap: Record<string, {
    productId: string;
    name: string;
    unitsSold: number;
    revenue: number;
    cost: number;
    profit: number;
  }> = {};

  completedOrders.forEach((o) => {
    o.items.forEach((it) => {
      let cost = it.costPrice;
      if (typeof cost !== 'number') {
        const prod = products.find((p) => p.id === it.productId);
        const variant = prod?.variants.find((v) => v.name === it.variantName);
        cost = variant?.costPrice ?? prod?.costPrice ?? Math.round(it.price * 0.55);
      }
      const qty = it.quantity || 1;
      const rev = it.price * qty;
      const totalItemCost = cost * qty;

      if (!productStatsMap[it.productId]) {
        productStatsMap[it.productId] = {
          productId: it.productId,
          name: it.name,
          unitsSold: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
        };
      }
      productStatsMap[it.productId].unitsSold += qty;
      productStatsMap[it.productId].revenue += rev;
      productStatsMap[it.productId].cost += totalItemCost;
      productStatsMap[it.productId].profit += Math.max(0, rev - totalItemCost);
    });
  });

  const productsProfitBreakdown = Object.values(productStatsMap).sort((a, b) => b.profit - a.profit);

  return {
    totalRevenue,
    totalWholesaleCost,
    totalNetProfit,
    todayRevenue,
    todayWholesaleCost,
    todayNetProfit,
    monthRevenue,
    monthWholesaleCost,
    monthNetProfit,
    profitMargin,
    totalOrders: orders.length,
    pendingOrders: pendingOrders.length,
    completedOrders: completedOrders.length,
    productsCount: products.length,
    productsProfitBreakdown,
  };
}
