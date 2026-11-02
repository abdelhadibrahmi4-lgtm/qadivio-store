/**
 * Meta Pixel (Facebook Ads) Integration for Qadivio Store
 * Handles:
 * - PageView
 * - ViewContent
 * - Search
 * - AddToCart
 * - InitiateCheckout
 * - Purchase (Only upon verified order completion)
 * - Event deduplication to prevent duplicate triggers
 */

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '967680699242701';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    __qadivio_fired_events?: Record<string, number>;
  }
}

// In-memory or session deduplication cache
function isEventDuplicate(uniqueKey: string, cooldownMs = 4000): boolean {
  if (typeof window === 'undefined') return false;
  if (!window.__qadivio_fired_events) {
    window.__qadivio_fired_events = {};
  }
  const now = Date.now();
  const lastTime = window.__qadivio_fired_events[uniqueKey] || 0;
  if (now - lastTime < cooldownMs) {
    return true; // Duplicate within cooldown
  }
  window.__qadivio_fired_events[uniqueKey] = now;
  return false;
}

// Check if a purchase has already been tracked in local storage to prevent duplicate refresh firing
export function isPurchaseAlreadyTracked(orderId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const trackedPurchases = JSON.parse(localStorage.getItem('qadivio_tracked_purchases') || '[]');
    return trackedPurchases.includes(orderId);
  } catch {
    return false;
  }
}

export function markPurchaseAsTracked(orderId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const trackedPurchases = JSON.parse(localStorage.getItem('qadivio_tracked_purchases') || '[]');
    if (!trackedPurchases.includes(orderId)) {
      trackedPurchases.push(orderId);
      localStorage.setItem('qadivio_tracked_purchases', JSON.stringify(trackedPurchases));
    }
  } catch (err) {
    console.error('Failed to mark purchase as tracked', err);
  }
}

// Core Meta Pixel tracker
export function trackPixelEvent(
  eventName: 'PageView' | 'ViewContent' | 'Search' | 'AddToCart' | 'InitiateCheckout' | 'Purchase',
  parameters: Record<string, unknown> = {},
  dedupKey?: string
) {
  if (typeof window === 'undefined') return;

  // Deduplication check
  const key = dedupKey || `${eventName}_${JSON.stringify(parameters)}`;
  if (isEventDuplicate(key)) {
    if (process.env.NEXT_PUBLIC_META_PIXEL_DEBUG === 'true') {
      console.warn(`[Meta Pixel] Duplicate event suppressed: ${eventName}`, parameters);
    }
    return;
  }

  // Execute Facebook Pixel if loaded
  if (typeof window.fbq === 'function') {
    window.fbq('track', eventName, parameters);
  }

  // Dispatch custom DOM event for live debugger widget & UI
  try {
    window.dispatchEvent(
      new CustomEvent('qadivio_pixel_event', {
        detail: {
          eventName,
          parameters,
          timestamp: new Date().toLocaleTimeString('ar-DZ'),
        },
      })
    );
  } catch {
    // Ignore DOM event dispatch error in environments without custom events
  }

  if (process.env.NEXT_PUBLIC_META_PIXEL_DEBUG === 'true') {
    console.log(`[Meta Pixel Tracked]: ${eventName}`, parameters);
  }
}

/** Standard Events Helpers */

export function trackPageView() {
  trackPixelEvent('PageView', {}, `pageview_${window.location.pathname}`);
}

export function trackViewContent(product: {
  id: string;
  name: string;
  category: string;
  price: number;
}) {
  trackPixelEvent(
    'ViewContent',
    {
      content_name: product.name,
      content_category: product.category,
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: 'DZD',
    },
    `view_content_${product.id}`
  );
}

export function trackSearch(searchQuery: string) {
  if (!searchQuery.trim()) return;
  trackPixelEvent(
    'Search',
    {
      search_string: searchQuery,
    },
    `search_${searchQuery.toLowerCase().trim()}`
  );
}

export function trackAddToCart(item: {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}) {
  trackPixelEvent(
    'AddToCart',
    {
      content_name: item.name,
      content_ids: [item.productId],
      content_type: 'product',
      value: item.price * item.quantity,
      currency: 'DZD',
      num_items: item.quantity,
    },
    `add_to_cart_${item.productId}_${Date.now()}`
  );
}

export function trackInitiateCheckout(items: { productId: string }[], totalValue: number) {
  trackPixelEvent(
    'InitiateCheckout',
    {
      content_ids: items.map((i) => i.productId),
      content_type: 'product',
      value: totalValue,
      currency: 'DZD',
      num_items: items.length,
    },
    `initiate_checkout_${totalValue}`
  );
}

export function trackPurchase(order: {
  id: string;
  total: number;
  items: { productId: string }[];
}) {
  // Strict check: Only fire if this specific order has NEVER been tracked before
  if (isPurchaseAlreadyTracked(order.id)) {
    console.warn(`[Meta Pixel] Purchase already recorded for order ${order.id}. Skipping to prevent duplicate reporting.`);
    return;
  }

  trackPixelEvent(
    'Purchase',
    {
      content_ids: order.items.map((i) => i.productId),
      content_type: 'product',
      value: order.total,
      currency: 'DZD',
      num_items: order.items.length,
      order_id: order.id,
    },
    `purchase_${order.id}`
  );

  markPurchaseAsTracked(order.id);
}
