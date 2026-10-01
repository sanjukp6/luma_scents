import React, { createContext, useContext, useState } from 'react';
import { Customer, CartItem, Order, RefundRecord } from '../types';
import { generateTransactionId } from '../utils/idGenerator';

interface OrderContextType {
  currentOrder: Order | null;
  orders: Order[];
  placeOrder: (
    customer: Customer,
    items: CartItem[],
    subtotal: number,
    shipping: number,
    total: number,
    paymentMethod?: string
  ) => Promise<Order>;
  getOrderById: (transactionId: string) => Order | null;
  setCurrentOrder: (order: Order | null) => void;
  processRefund: (
    transactionId: string,
    refundData: {
      items: { productId: string; quantity: number; amount: number }[];
      amount: number;
      reason: string;
      payoutMethod: string;
    }
  ) => Promise<RefundRecord>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = 'luma_scents_orders_v1';
const LATEST_ORDER_KEY = 'luma_scents_latest_order_v1';

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load orders from localStorage', e);
    }
    return [];
  });

  const [currentOrder, setCurrentOrder] = useState<Order | null>(() => {
    try {
      const saved = localStorage.getItem(LATEST_ORDER_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load latest order from localStorage', e);
    }
    return null;
  });

  /**
   * Business Logic: placeOrder
   * 1. Validates order parameters
   * 2. Generates unique transaction ID
   * 3. Constructs the structured Order object
   * 4. Persists to storage
   * 5. Returns completed Order object for checkout flow
   */
  const placeOrder = async (
    customer: Customer,
    items: CartItem[],
    subtotal: number,
    shipping: number,
    total: number,
    paymentMethod: string = 'UPI'
  ): Promise<Order> => {
    // Validate inputs
    if (!items || items.length === 0) {
      throw new Error('Cannot place an order with an empty cart.');
    }
    if (!customer.name || !customer.email || !customer.phone || !customer.address || !customer.city || !customer.pincode) {
      throw new Error('Please fill in all required customer details.');
    }

    // Simulate network latency / payment authorization
    await new Promise((resolve) => setTimeout(resolve, 400));

    const transactionId = generateTransactionId();

    const newOrder: Order = {
      transactionId,
      customer: { ...customer },
      items: [...items],
      subtotal,
      shipping,
      total,
      currency: 'INR',
      paymentMethod,
      status: 'success',
      createdAt: new Date().toISOString(),
    };

    // Update state & persistence
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    setCurrentOrder(newOrder);

    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
      localStorage.setItem(LATEST_ORDER_KEY, JSON.stringify(newOrder));
    } catch (e) {
      console.error('Failed to persist order to localStorage', e);
    }

    return newOrder;
  };

  const processRefund = async (
    transactionId: string,
    refundData: {
      items: { productId: string; quantity: number; amount: number }[];
      amount: number;
      reason: string;
      payoutMethod: string;
    }
  ): Promise<RefundRecord> => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const refundId = `REF-${Math.floor(100000 + Math.random() * 900000)}`;
    const refundRecord: RefundRecord = {
      refundId,
      transactionId,
      amount: refundData.amount,
      reason: refundData.reason,
      payoutMethod: refundData.payoutMethod,
      items: refundData.items,
      createdAt: new Date().toISOString(),
    };

    const updatedOrders = orders.map((order) => {
      if (order.transactionId.toLowerCase() === transactionId.toLowerCase()) {
        const isFull = refundData.amount >= order.total;
        return {
          ...order,
          status: (isFull ? 'refunded' : 'partially_refunded') as Order['status'],
          refundDetails: refundRecord,
        };
      }
      return order;
    });

    setOrders(updatedOrders);
    if (currentOrder && currentOrder.transactionId.toLowerCase() === transactionId.toLowerCase()) {
      const isFull = refundData.amount >= currentOrder.total;
      setCurrentOrder({
        ...currentOrder,
        status: (isFull ? 'refunded' : 'partially_refunded') as Order['status'],
        refundDetails: refundRecord,
      });
    }

    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
    } catch (e) {
      console.error('Failed to persist refund in localStorage', e);
    }

    return refundRecord;
  };

  const getOrderById = (transactionId: string): Order | null => {
    const found = orders.find((o) => o.transactionId.toLowerCase() === transactionId.toLowerCase());
    if (found) return found;
    if (currentOrder && currentOrder.transactionId.toLowerCase() === transactionId.toLowerCase()) {
      return currentOrder;
    }
    return null;
  };

  return (
    <OrderContext.Provider
      value={{
        currentOrder,
        orders,
        placeOrder,
        getOrderById,
        setCurrentOrder,
        processRefund,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
