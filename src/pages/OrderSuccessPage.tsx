import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Truck, Mail, MapPin, Sparkles } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { Order } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

export const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const { currentOrder } = useOrder();

  // Retrieve order from router state or fallback to currentOrder in context
  const order: Order | null = (location.state as any)?.order || currentOrder;

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="font-serif text-3xl font-bold text-brand-noir">No Recent Order Found</h1>
        <p className="text-stone-600">
          It looks like you haven't placed an order recently or your session has expired.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-noir text-brand-gold text-xs font-bold uppercase tracking-wider rounded-lg"
        >
          <span>Explore Fragrances</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      {/* Success Hero Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 mx-auto flex items-center justify-center shadow-lg animate-scale-in">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-stone text-xs font-semibold uppercase tracking-widest text-brand-800">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Receipt & Confirmation</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-noir">
          Order Placed Successfully
        </h1>

        <p className="text-stone-600 text-sm sm:text-base max-w-lg mx-auto">
          Thank you, <strong className="text-brand-noir">{order.customer.name}</strong>. Your artisanal fragrances have entered compounding & dispatch preparation.
        </p>
      </div>

      {/* Transaction & Order Key Info Bar */}
      <div className="bg-brand-noir text-white rounded-2xl p-6 sm:p-8 shadow-elevated grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-brand-gold">
            Transaction ID
          </span>
          <p id="order-transaction-id" className="font-mono text-base sm:text-lg font-bold text-white tracking-wider">
            {order.transactionId}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-brand-gold">
            Date & Time
          </span>
          <p className="text-xs sm:text-sm text-stone-200">
            {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-brand-gold">
            Payment Status
          </span>
          <p className="text-xs sm:text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
            Authorized ({order.status})
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-brand-gold">
            Total Paid
          </span>
          <p id="order-total-amount" className="font-serif text-xl sm:text-2xl font-bold text-white">
            {formatCurrency(order.total)}
          </p>
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="bg-white rounded-2xl border border-brand-stone p-6 sm:p-8 shadow-subtle space-y-8">
        
        {/* Purchased Products List */}
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-brand-noir border-b border-stone-100 pb-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-600" />
            <span>Purchased Items ({order.items.reduce((s, i) => s + i.quantity, 0)})</span>
          </h2>

          <div className="divide-y divide-stone-100" id="order-items-list">
            {order.items.map(({ product, quantity }) => (
              <div key={product.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-20 object-cover rounded-lg bg-stone-100 border border-stone-200"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-700 block">
                      {product.brand}
                    </span>
                    <h4 className="font-serif font-bold text-brand-noir text-base">{product.name}</h4>
                    <p className="text-xs text-stone-500">
                      Variant: <span className="font-semibold text-stone-700">{product.variant}</span> • SKU: {product.id}
                    </p>
                    <p className="text-xs text-stone-500 font-sans">
                      {quantity} × {formatCurrency(product.price)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-base text-brand-noir font-sans">
                    {formatCurrency(product.price * quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="bg-stone-50 p-5 rounded-xl border border-stone-200 space-y-2.5 text-sm">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal</span>
            <span className="font-semibold text-stone-900 font-sans">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Shipping</span>
            <span className="font-semibold text-stone-900 font-sans">
              {order.shipping === 0 ? <span className="text-emerald-700 font-bold uppercase text-xs">FREE</span> : formatCurrency(order.shipping)}
            </span>
          </div>
          <div className="border-t border-stone-200 pt-3 flex justify-between font-bold text-base text-brand-noir">
            <span>Final Total</span>
            <span className="font-serif text-lg">{formatCurrency(order.total)}</span>
          </div>
        </div>

        {/* Customer & Shipping Destination */}
        <div className="border-t border-stone-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-serif text-base font-bold text-brand-noir flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-600" />
              <span>Customer Information</span>
            </h3>
            <div className="text-xs text-stone-600 space-y-1 pl-6">
              <p className="font-bold text-stone-900" id="customer-name-display">{order.customer.name}</p>
              <p>{order.customer.email}</p>
              <p>{order.customer.phone}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-base font-bold text-brand-noir flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-600" />
              <span>Shipping Destination</span>
            </h3>
            <div className="text-xs text-stone-600 space-y-1 pl-6">
              <p>{order.customer.address}</p>
              <p>
                {order.customer.city}, {order.customer.state} - {order.customer.pincode}
              </p>
              <p className="text-emerald-700 font-semibold pt-1 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 inline" /> Standard Express Courier
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Next Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to="/products"
          id="continue-shopping-btn"
          className="w-full sm:w-auto px-8 py-4 bg-brand-noir text-brand-gold-light hover:bg-brand-800 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-4 bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center"
        >
          Return to Home
        </Link>
      </div>

    </div>
  );
};
