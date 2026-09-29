import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import { Toast } from '../components/Toast';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, clearCart, totals, freeShippingThreshold, amountUntilFreeShipping } = useCart();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleRemove = (productId: string, productName: string) => {
    removeFromCart(productId);
    setToast({ message: `Removed ${productName} from your cart`, type: 'info' as any });
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      setToast({ message: 'Your cart is empty.', type: 'error' });
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-brand-stone mx-auto flex items-center justify-center text-brand-700 shadow-inner">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-noir">Your Shopping Cart is Empty</h1>
        <p className="text-stone-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          Looks like you haven't selected any fragrances yet. Explore our handcrafted collection to find your signature scent.
        </p>
        <div className="pt-4">
          <Link
            to="/products"
            id="empty-cart-shop-link"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-noir text-brand-gold-light hover:bg-brand-800 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md transition-all"
          >
            <span>Explore Fragrance Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const shippingProgressPercentage = Math.min(100, Math.round((totals.subtotal / freeShippingThreshold) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      
      {/* Page Heading */}
      <div className="border-b border-brand-stone pb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-noir">Your Shopping Bag</h1>
          <p className="text-stone-500 text-sm mt-1">
            {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'} ready for checkout
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-red-600 transition-colors self-start sm:self-auto"
        >
          Clear Entire Bag
        </button>
      </div>

      {/* Free Shipping Progress Indicator */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-brand-stone shadow-subtle space-y-2">
        <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
          <span className="flex items-center gap-1.5 text-stone-800">
            <Truck className="w-4 h-4 text-brand-600" />
            {amountUntilFreeShipping > 0 ? (
              <span>
                Add <strong className="text-brand-900 font-bold">{formatCurrency(amountUntilFreeShipping)}</strong> more to unlock <strong className="text-emerald-700">FREE Express Shipping</strong>
              </span>
            ) : (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-brand-500" />
                Congratulations! You've unlocked Complimentary Express Delivery!
              </span>
            )}
          </span>
          <span className="text-xs text-stone-500 font-bold">{shippingProgressPercentage}%</span>
        </div>
        <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-brand-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${shippingProgressPercentage}%` }}
          />
        </div>
      </div>

      {/* Cart Items & Order Summary Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-start">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-brand-stone divide-y divide-stone-100 shadow-subtle overflow-hidden">
            {items.map(({ product, quantity }) => {
              const itemTotal = product.price * quantity;

              return (
                <div
                  key={product.id}
                  id={`cart-item-${product.id}`}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                >
                  {/* Thumbnail & Title */}
                  <div className="flex items-center gap-4 flex-1">
                    <Link
                      to={`/products/${product.id}`}
                      className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover object-center"
                      />
                    </Link>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-700">
                        {product.brand} • {product.category}
                      </span>
                      <Link
                        to={`/products/${product.id}`}
                        className="font-serif text-base sm:text-lg font-bold text-brand-noir hover:text-brand-700 transition-colors block line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-stone-500">
                        Variant: <span className="font-semibold text-stone-700">{product.variant}</span>
                      </p>
                      <p className="text-xs font-bold text-stone-800 font-sans sm:hidden">
                        {formatCurrency(product.price)} each
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Price adjustments */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    
                    {/* Quantity adjuster */}
                    <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50">
                      <button
                        type="button"
                        id={`cart-decrement-${product.id}`}
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="px-3 py-1.5 text-stone-600 hover:text-brand-900 font-bold text-sm"
                        aria-label={`Decrease quantity of ${product.name}`}
                      >
                        −
                      </button>
                      <span
                        id={`cart-qty-${product.id}`}
                        className="px-3 py-1.5 font-bold text-xs text-stone-900 min-w-[2.5rem] text-center"
                      >
                        {quantity}
                      </span>
                      <button
                        type="button"
                        id={`cart-increment-${product.id}`}
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        disabled={quantity >= product.stock}
                        className="px-3 py-1.5 text-stone-600 hover:text-brand-900 disabled:opacity-30 font-bold text-sm"
                        aria-label={`Increase quantity of ${product.name}`}
                      >
                        +
                      </button>
                    </div>

                    {/* Line Total */}
                    <div className="text-right min-w-[5rem]">
                      <span className="font-bold text-base text-brand-noir font-sans block">
                        {formatCurrency(itemTotal)}
                      </span>
                      <span className="text-[11px] text-stone-400 hidden sm:block">
                        {formatCurrency(product.price)} / unit
                      </span>
                    </div>

                    {/* Delete item */}
                    <button
                      type="button"
                      id={`cart-remove-${product.id}`}
                      onClick={() => handleRemove(product.id, product.name)}
                      className="text-stone-400 hover:text-red-600 p-2 transition-colors rounded-lg hover:bg-red-50"
                      aria-label={`Remove ${product.name} from cart`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-800 hover:text-brand-600"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-brand-stone p-6 sm:p-8 space-y-6 shadow-subtle sticky top-28">
            <h3 className="font-serif text-xl font-bold text-brand-noir border-b border-stone-200 pb-4">
              Order Summary
            </h3>

            <div className="space-y-3.5 text-sm">
              <div className="flex items-center justify-between text-stone-600">
                <span>Subtotal ({totals.itemCount} items)</span>
                <span id="cart-subtotal" className="font-semibold text-stone-900 font-sans">
                  {formatCurrency(totals.subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between text-stone-600">
                <span className="flex items-center gap-1">
                  Estimated Shipping
                  <span className="text-[10px] text-stone-400 font-normal">
                    (&gt; ₹1000 free)
                  </span>
                </span>
                <span id="cart-shipping" className="font-semibold text-stone-900 font-sans">
                  {totals.shipping === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase text-xs">FREE</span>
                  ) : (
                    formatCurrency(totals.shipping)
                  )}
                </span>
              </div>

              <div className="border-t border-stone-200 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-base font-bold text-brand-noir block">Total</span>
                  <span className="text-[11px] text-stone-400">Includes all applicable taxes</span>
                </div>
                <span id="cart-total" className="font-serif text-2xl font-bold text-brand-noir">
                  {formatCurrency(totals.total)}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              type="button"
              id="proceed-to-checkout-btn"
              onClick={handleProceedToCheckout}
              className="w-full py-4 px-6 bg-brand-noir text-brand-gold-light hover:bg-brand-800 hover:text-white rounded-lg font-medium tracking-wider uppercase text-xs sm:text-sm shadow-elevated hover:shadow-gold-glow transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Encrypted & safe checkout simulation</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
                <span>Includes complimentary discovery fragrance sample</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Toast popup */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
