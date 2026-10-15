import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function IngestPageLoad() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    const mp = window._mp;

    if (!mp?.waitUntil) {
      console.warn('Ingest Labs SDK is not available');
      return;
    }

    mp.waitUntil(
      () => Boolean(window._mp?.eedlInstance),
      15000,
      100,
      () => {
        try {
          if (typeof window._mp?.eedlInstance().ready === 'function') {
            window._mp.eedlInstance().ready();
          }
        } catch (e) {
          // Safe ignore if already ready
        }

        window._mp.safeExecute('evPageLoad', () => {
          const isProd = /https:\/\/luma-scents\.vercel\.app/.test(window.location.href);

          const payload: Record<string, any> = {
            event: 'page_load',
            'page.pageInfo.pageName': document.title,
            'env.pageUrl': window.location.href,
            'env.referrer': document.referrer || '',
            'env.pathName': window.location.pathname,
            'env.rs': isProd ? 'prd' : 'stg',
            'env.app_version': '1.0.0',
            page: {
              pageInfo: {
                pageName: document.title,
              },
            },
            env: {
              pageUrl: window.location.href,
              pathName: window.location.pathname,
              referrer: document.referrer || '',
              rs: isProd ? 'prd' : 'stg',
              app_version: '1.0.0',
            },
          };

          // Call window.eedl as a function as requested
          if (typeof window.eedl === 'function') {
            window.eedl('page_load', payload);
          } else if (window.eedl && typeof window.eedl.push === 'function') {
            window.eedl.push(['page_load', payload]);
            window.eedl.push(payload);
          }

          // Mirror into GTM dataLayer
          if (window.dataLayer && typeof window.dataLayer.push === 'function') {
            window.dataLayer.push(payload);
          }
        })();
      }
    );
  }, [location.pathname, location.search, location.hash]);

  return null;
}
