/**
 * IngestLabs / MagicPixel tracking integration
 */

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
 * Tracks route change / page load event for IngestLabs / MagicPixel EEDL
 * @param {string} [customPageName] - Optional override for page name
 * @param {Record<string, any>} [extraData] - Additional payload properties
 */
export const trackPageLoad = (customPageName, extraData = {}) => {
  if (typeof window === 'undefined') return;

  const pathname = window.location.pathname;
  const pageName = customPageName || (document.title && document.title.trim()) || getPageName(pathname);

  const isProd = !/localhost|127\.0\.0\.1/.test(window.location.hostname);

  const payload = {
    'page.pageInfo.pageName': pageName,
    'env.pageUrl': window.location.href,
    'env.referrer': document.referrer || '',
    'env.pathName': pathname,
    'env.rs': isProd ? 'prd' : 'stg',
    'env.app_version': '1.0.0',
    ...extraData,
  };

  const fireEedl = () => {
    try {
      if (typeof window.eedl === 'function') {
        window.eedl('page_load', payload);
      } else if (typeof eedl === 'function') {
        // @ts-ignore
        eedl('page_load', payload);
      } else {
        console.log('[IngestLabs] eedl page_load tracked:', payload);
      }
    } catch (err) {
      console.warn('[IngestLabs] Error triggering eedl:', err);
    }
  };

  // Check if MagicPixel SDK (_mp) is present
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
          // ignore if already ready
        }

        if (typeof window._mp.safeExecute === 'function') {
          window._mp.safeExecute('evPageLoad', fireEedl)();
        } else {
          fireEedl();
        }
      }
    );
  } else {
    // Direct call if _mp is not wrapping or in dev mode
    fireEedl();
  }
};

export default trackPageLoad;
