import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, CartTotals } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => { success: boolean; message: string };
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totals: CartTotals;
  freeShippingThreshold: number;
  amountUntilFreeShipping: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'luma_scents_cart_v1';
const FREE_SHIPPING_THRESHOLD = 1000;
const STANDARD_SHIPPING_FEE = 99;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    }
    return [];
  });

  // Persist cart to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  /**
   * Business Logic: addToCart
   * 1. Check product stock limit
   * 2. Find if product is already in cart
   * 3. Update cart state
   * 4. Return result object for UI feedback
   * (dataLayer.push hooks will be attached here later)
   */
  const addToCart = (product: Product, quantity: number = 1): { success: boolean; message: string } => {
    if (quantity <= 0) {
      return { success: false, message: 'Quantity must be at least 1' };
    }

    const existingIndex = items.findIndex((item) => item.product.id === product.id);
    const currentQtyInCart = existingIndex > -1 ? items[existingIndex].quantity : 0;
    const requestedTotalQty = currentQtyInCart + quantity;

    if (requestedTotalQty > product.stock) {
      const availableToAdd = product.stock - currentQtyInCart;
      if (availableToAdd <= 0) {
        return {
          success: false,
          message: `Cannot add more. Maximum available stock (${product.stock}) already in cart.`,
        };
      }
      return {
        success: false,
        message: `Only ${availableToAdd} more item(s) available in stock.`,
      };
    }

    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: requestedTotalQty,
      };
      setItems(updated);
    } else {
      setItems((prev) => [...prev, { product, quantity }]);
    }

    return {
      success: true,
      message: `Added ${quantity} × ${product.name} to your cart`,
    };
  };

  /**
   * Business Logic: updateQuantity
   * Adjusts quantity for a line item within stock limits
   */
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const clampedQty = Math.min(quantity, item.product.stock);
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  /**
   * Business Logic: removeFromCart
   */
  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  /**
   * Business Logic: clearCart
   */
  const clearCart = () => {
    setItems([]);
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = items.length === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const total = subtotal + shipping;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const amountUntilFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totals: {
          subtotal,
          shipping,
          total,
          itemCount,
        },
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountUntilFreeShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
