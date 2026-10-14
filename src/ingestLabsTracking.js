/**
 * IngestLabs / MagicPixel tracking integration & GTM DataLayer Bridge
 */

// Ensure global eedl array bus and GTM dataLayer bridge exist immediately
if (typeof window !== 'undefined') {
  window.eedl = window.eedl || [];
  window.dataLayer = window.dataLayer || [];

  if (!window._eedlGtmBridgeInitialized) {
    window._eedlGtmBridgeInitialized = true;
    const originalEedlPush = window.eedl.push;
    window.eedl.push = function (...items) {
      items.forEach((item) => {
        if (window.dataLayer && typeof window.dataLayer.push === 'function') {
          window.dataLayer.push(item);
        }
      });
      return originalEedlPush.apply(this, items);
    };
  }
}

const getPageName = (pathname) => {
  if (pathname === '/') return 'Home | Luma Scents';
  if (pathname === '/products') return 'Products | Luma Scents';
  if (pathname.startsWith('/products/')) return 'Product Detail | Luma Scents';
  if (pathname === '/cart') return 'Cart | Luma Scents';
  if (pathname === '/checkout') return 'Checkout | Luma Scents';
  if (pathname === '/order-success') return 'Order Success | Luma Scents';
  if (pathname === '/offers' || pathname === '/new-year-sale-2026') return 'Special Offers | Luma Scents';
  if (pathname === '/refund' || pathname === '/returns') return 'Refund & Returns | Luma Scents';
  return document.title || 'Luma Scents';
};

/**
 * Tracks route change / page load event for IngestLabs / MagicPixel EEDL & GTM
 * @param {string} [customPageName] - Optional override for page name
 * @param {Record<string, any>} [extraData] - Additional payload properties
 */
export const trackPageLoad = (customPageName, extraData = {}) => {
  if (typeof window === 'undefined') return;

  // 1. Ensure window.eedl & dataLayer are initialized
  window.eedl = window.eedl || [];
  window.dataLayer = window.dataLayer || [];

  const pathname = window.location.pathname;
  const pageName = customPageName || (document.title && document.title.trim()) || getPageName(pathname);
  const isProd = !/localhost|127\.0\.0\.1/.test(window.location.hostname);

  // Structured event according to SDL (Software Data Layer) specification
  const eventPayload = {
    event: 'page_load',
    env: {
      pageUrl: window.location.href,
      pathName: pathname,
      referrer: document.referrer || '',
      rs: isProd ? 'prd' : 'stg',
      app_version: '1.0.0',
    },
    page: {
      pageInfo: {
        pageName: pageName,
      },
    },
    // Also include flat dot-notation keys for backwards compatibility with any tag expecting them
    'page.pageInfo.pageName': pageName,
    'env.pageUrl': window.location.href,
    'env.referrer': document.referrer || '',
    'env.pathName': pathname,
    'env.rs': isProd ? 'prd' : 'stg',
    'env.app_version': '1.0.0',
    ...extraData,
  };

  const dispatchEvent = () => {
    try {
      // 1. Push to window.eedl (which automatically forwards to window.dataLayer via the bridge)
      if (Array.isArray(window.eedl)) {
        window.eedl.push(eventPayload);
      } else {
        // Fallback: push directly to window.dataLayer if eedl is not an array
        if (window.dataLayer && typeof window.dataLayer.push === 'function') {
          window.dataLayer.push(eventPayload);
        }
      }

      // 2. Also invoke as a function if the SDK has wrapped eedl into a function
      if (typeof window.eedl === 'function') {
        window.eedl('page_load', eventPayload);
      } else if (typeof eedl === 'function') {
        // @ts-ignore
        eedl('page_load', eventPayload);
      }
    } catch (err) {
      console.warn('[IngestLabs] Error dispatching eedl event:', err);
    }
  };

  // Safe execution with MagicPixel SDK (_mp) if present
  const mp = window._mp;
  if (mp && typeof mp.waitUntil === 'function') {
    mp.waitUntil(
      function () {
        return window._mp && window._mp.eedlInstance;
      },
      15000,
      100,
      function () {
        try {
          if (window._mp.eedlInstance && typeof window._mp.eedlInstance().ready === 'function') {
            window._mp.eedlInstance().ready();
          }
        } catch (e) {
          // Safe ignore if already ready
        }

        if (typeof window._mp.safeExecute === 'function') {
          window._mp.safeExecute('evPageLoad', dispatchEvent)();
        } else {
          dispatchEvent();
        }
      }
    );
  } else {
    // If _mp SDK is not yet available, immediately push so it is queued!
    dispatchEvent();
  }
};

export default trackPageLoad;
