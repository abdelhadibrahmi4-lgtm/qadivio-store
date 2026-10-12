export type ProductCategory = 
  | 'ai-universe'
  | 'creator-zone'
  | 'dev-station'
  | 'education'
  | 'streaming-productivity';

export interface ProductVariant {
  id: string;
  name: string; // e.g. "شهر واحد", "3 أشهر", "سنة كاملة"
  durationMonths: number;
  price: number; // in DZD
  oldPrice?: number;
  isPopular?: boolean;
}

export interface AccountTypeOption {
  id: string;
  label: string; // "حساب خاص على إيميلك", "حساب جاهز مفعل"
  description: string;
  extraCost: number;
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  wilaya?: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  tagline: string;
  description: string;
  longDescription?: string;
  category: ProductCategory;
  categoryNameAr: string;
  price: number; // base price
  oldPrice?: number;
  discountPercentage?: number;
  image: string;
  badge?: string; // e.g. "الأكثر طلباً", "حصري", "وفر 50%"
  inStock: boolean;
  rating: number;
  reviewsCount: number;
  features: string[];
  activationType: 'instant' | 'within-1-hour' | 'custom-invite';
  activationGuide?: string[];
  variants: ProductVariant[];
  accountTypes: AccountTypeOption[];
  featured?: boolean;
  isDealOfTheDay?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  variantId: string;
  variantName: string;
  accountTypeId: string;
  accountTypeName: string;
  unitPrice: number;
  quantity: number;
}

export interface Wilaya {
  id: number;
  code: string;
  nameAr: string;
  nameFr: string;
  deliveryTime: string;
}

export type PaymentMethod = 'baridimob' | 'ccp' | 'edahabia' | 'cod' | 'usdt';

export type OrderStatus = 'pending' | 'verifying_payment' | 'processing' | 'completed' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  variantName: string;
  accountTypeName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string; // e.g. QD-2026-9812
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  wilayaCode: string;
  wilayaName: string;
  city?: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentReceiptNumber?: string;
  paymentReceiptImage?: string;
  status: OrderStatus;
  activationCodeOrAccount?: string;
  trackingToken: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  minOrderAmount?: number;
  active: boolean;
  expiryDate?: string;
}

export interface MetaPixelEventData {
  eventName: 'PageView' | 'ViewContent' | 'Search' | 'AddToCart' | 'InitiateCheckout' | 'Purchase';
  eventId?: string;
  customData?: {
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    content_type?: string;
    value?: number;
    currency?: string;
    search_string?: string;
    num_items?: number;
    order_id?: string;
  };
  timestamp?: string;
}
