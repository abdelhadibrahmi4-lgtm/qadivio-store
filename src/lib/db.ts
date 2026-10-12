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

  // Seed products if not exists
  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(INITIAL_PRODUCTS, null, 2), 'utf-8');
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
  const newOrder: Order = {
    ...data,
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

// ---------------- ADMIN STATS ----------------

export async function getAdminStats() {
  const orders = await getOrders();
  const products = await getProducts();

  const totalRevenue = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'verifying_payment').length;
  const completedOrders = orders.filter((o) => o.status === 'completed').length;

  return {
    totalRevenue,
    totalOrders: orders.length,
    pendingOrders,
    completedOrders,
    productsCount: products.length,
  };
}
