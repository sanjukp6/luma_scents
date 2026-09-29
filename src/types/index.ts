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

export interface Order {
  transactionId: string;
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  status: 'success' | 'pending' | 'failed';
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

