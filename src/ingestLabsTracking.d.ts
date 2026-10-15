import { Product } from './types';

export declare const trackPageLoad: (
  customPageName?: string,
  extraData?: Record<string, any>
) => void;

export declare const trackAddToCart: (
  product: Product | Record<string, any>,
  quantity?: number,
  extraData?: Record<string, any>
) => void;

export default trackPageLoad;

