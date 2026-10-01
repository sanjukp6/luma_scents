export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  variant: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  // Additional rich presentation fields
  topNotes?: string[];
  heartNotes?: string[];
  baseNotes?: string[];
  mood?: string;
  rating?: number;
  reviewCount?: number;
  isFeatured?: boolean;
  isBestseller?: boolean;
  // Special Offers & Sales
  originalPrice?: number;
  discountPercent?: number;
  isOffer?: boolean;
  offerTag?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface RefundItem {
  productId: string;
  quantity: number;
  amount: number;
}

export interface RefundRecord {
  refundId: string;
  transactionId: string;
  amount: number;
  reason: string;
  payoutMethod: string;
  items: RefundItem[];
  createdAt: string;
}

export interface Order {
  transactionId: string;
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  paymentMethod?: string;
  status: 'success' | 'pending' | 'failed' | 'refunded' | 'partially_refunded';
  refundDetails?: RefundRecord;
  createdAt: string;
}

export interface CartTotals {
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
}

declare global {
  interface Window {
    dataLayer?: Record<string, any>[];
  }
}

