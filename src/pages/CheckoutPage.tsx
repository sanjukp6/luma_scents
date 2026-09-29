import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowLeft, AlertCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { Customer } from '../types';
import { formatCurrency } from '../utils/formatters';
import { Toast } from '../components/Toast';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, totals, clearCart } = useCart();
  const { placeOrder } = useOrder();

  const [customer, setCustomer] = useState<Customer>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // If cart is empty, show redirection prompt
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-brand-stone mx-auto flex items-center justify-center text-brand-700">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-brand-noir">Your Cart is Empty</h2>
        <p className="text-stone-600 text-sm">
          Please add items to your cart before proceeding to the checkout portal.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-noir text-brand-gold text-xs font-bold uppercase tracking-wider rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Fragrances
        </Link>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Customer, string>> = {};

    if (!customer.name.trim()) newErrors.name = 'Full name is required';
    if (!customer.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(customer.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!customer.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\s-]{8,15}$/.test(customer.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!customer.address.trim()) newErrors.address = 'Street address is required';
    if (!customer.city.trim()) newErrors.city = 'City is required';
    if (!customer.state.trim()) newErrors.state = 'State / Region is required';
    if (!customer.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^[0-9a-zA-Z\s-]{4,10}$/.test(customer.pincode.trim())) {
      newErrors.pincode = 'Please enter a valid postal code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof Customer, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  /**
   * Application Business Logic: Place Order
   * 1. Validates required customer details
   * 2. Calls order context `placeOrder()` to generate mock transaction & order object
   * 3. Clears the cart
   * 4. Navigates to /order-success
   * (dataLayer.push purchase event will be attached here later)
   */
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setToast({ message: 'Please fix the highlighted errors before placing the order.', type: 'error' });
      return;
    }

    setIsSubmitting(true);

    try {
      const createdOrder = await placeOrder(
        customer,
        items,
        totals.subtotal,
        totals.shipping,
        totals.total
      );

      // Clear the shopping cart
      clearCart();

      // Navigate to order success with transaction state
      navigate('/order-success', { state: { order: createdOrder } });
    } catch (err: any) {
      setToast({ message: err?.message || 'Failed to place order. Please try again.', type: 'error' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      
      {/* Header */}
      <div className="border-b border-brand-stone pb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-noir">Checkout & Dispatch</h1>
          <p className="text-stone-500 text-sm mt-1">Please provide your delivery and contact information.</p>
        </div>
        <Link
          to="/cart"
          className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-800 hover:text-brand-600"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-start">
        
        {/* Left Column: Customer and Shipping Form */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Contact Information */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-stone shadow-subtle space-y-6">
            <h2 className="font-serif text-xl font-bold text-brand-noir border-b border-stone-100 pb-3">
              1. Customer Contact
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Full Name */}
              <div className="sm:col-span-2 space-y-1.5">
                <label htmlFor="customer-name" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="customer-name"
                  value={customer.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className={`w-full px-4 py-2.5 bg-stone-50 border rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 ${
                    errors.name ? 'border-red-500 ring-red-200' : 'border-stone-200 focus:ring-brand-500/30 focus:border-brand-500'
                  }`}
                />
                {errors.name && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="customer-email" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="customer-email"
                  value={customer.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="eleanor@example.com"
                  className={`w-full px-4 py-2.5 bg-stone-50 border rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 ${
                    errors.email ? 'border-red-500 ring-red-200' : 'border-stone-200 focus:ring-brand-500/30 focus:border-brand-500'
                  }`}
                />
                {errors.email && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.email}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label htmlFor="customer-phone" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="customer-phone"
                  value={customer.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className={`w-full px-4 py-2.5 bg-stone-50 border rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 ${
                    errors.phone ? 'border-red-500 ring-red-200' : 'border-stone-200 focus:ring-brand-500/30 focus:border-brand-500'
                  }`}
                />
                {errors.phone && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.phone}</p>}
              </div>

            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-stone shadow-subtle space-y-6">
            <h2 className="font-serif text-xl font-bold text-brand-noir border-b border-stone-100 pb-3">
              2. Shipping Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Address */}
              <div className="sm:col-span-2 space-y-1.5">
                <label htmlFor="customer-address" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Street Address & Apartment / Suite *
                </label>
                <input
                  type="text"
                  id="customer-address"
                  value={customer.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Apartment 4B, 12 Kensington Boulevard"
                  className={`w-full px-4 py-2.5 bg-stone-50 border rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 ${
                    errors.address ? 'border-red-500 ring-red-200' : 'border-stone-200 focus:ring-brand-500/30 focus:border-brand-500'
                  }`}
                />
                {errors.address && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.address}</p>}
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label htmlFor="customer-city" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  City *
                </label>
                <input
                  type="text"
                  id="customer-city"
                  value={customer.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Mumbai"
                  className={`w-full px-4 py-2.5 bg-stone-50 border rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 ${
                    errors.city ? 'border-red-500 ring-red-200' : 'border-stone-200 focus:ring-brand-500/30 focus:border-brand-500'
                  }`}
                />
                {errors.city && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.city}</p>}
              </div>

              {/* State */}
              <div className="space-y-1.5">
                <label htmlFor="customer-state" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  State / Region *
                </label>
                <input
                  type="text"
                  id="customer-state"
                  value={customer.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Maharashtra"
                  className={`w-full px-4 py-2.5 bg-stone-50 border rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 ${
                    errors.state ? 'border-red-500 ring-red-200' : 'border-stone-200 focus:ring-brand-500/30 focus:border-brand-500'
                  }`}
                />
                {errors.state && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.state}</p>}
              </div>

              {/* Pincode */}
              <div className="space-y-1.5">
                <label htmlFor="customer-pincode" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Pincode / Postal Code *
                </label>
                <input
                  type="text"
                  id="customer-pincode"
                  value={customer.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  placeholder="400001"
                  className={`w-full px-4 py-2.5 bg-stone-50 border rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 ${
                    errors.pincode ? 'border-red-500 ring-red-200' : 'border-stone-200 focus:ring-brand-500/30 focus:border-brand-500'
                  }`}
                />
                {errors.pincode && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.pincode}</p>}
              </div>

            </div>
          </div>

          {/* Simulated Payment Notice */}
          <div className="bg-brand-stone/40 border border-brand-stone rounded-2xl p-5 flex items-start gap-4 text-xs text-stone-700">
            <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-stone-900">Simulated Testing Environment</strong>
              <span>
                No payment gateway credentials required. Clicking <strong>Place Order</strong> will immediately generate an authentic test order object and transaction ID for analytics verification.
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary & Action */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-brand-stone p-6 sm:p-8 space-y-6 shadow-subtle sticky top-28">
            <h3 className="font-serif text-xl font-bold text-brand-noir border-b border-stone-200 pb-4">
              Order Summary ({totals.itemCount} items)
            </h3>

            {/* Line items preview */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-stone-100">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="pt-3 first:pt-0 flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-14 object-cover rounded-lg bg-stone-100 border shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-900 truncate">{product.name}</p>
                    <p className="text-[11px] text-stone-500">
                      Qty: {quantity} • {product.variant}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-stone-800 font-sans">
                    {formatCurrency(product.price * quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="border-t border-stone-200 pt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between text-stone-600">
                <span>Subtotal</span>
                <span id="checkout-subtotal" className="font-semibold text-stone-900 font-sans">
                  {formatCurrency(totals.subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between text-stone-600">
                <span>Shipping Delivery</span>
                <span id="checkout-shipping" className="font-semibold text-stone-900 font-sans">
                  {totals.shipping === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase text-xs">Complimentary (FREE)</span>
                  ) : (
                    formatCurrency(totals.shipping)
                  )}
                </span>
              </div>

              <div className="border-t border-stone-200 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-base font-bold text-brand-noir block">Total Amount</span>
                  <span className="text-[11px] text-stone-400">All taxes included</span>
                </div>
                <span id="checkout-total" className="font-serif text-2xl font-bold text-brand-noir">
                  {formatCurrency(totals.total)}
                </span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="submit"
              id="place-order-button"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-lg font-medium tracking-wider uppercase text-sm shadow-elevated transition-all duration-300 flex items-center justify-center gap-2 ${
                isSubmitting
                  ? 'bg-stone-400 text-white cursor-wait'
                  : 'bg-brand-noir text-brand-gold-light hover:bg-brand-800 hover:text-white hover:shadow-gold-glow'
              }`}
            >
              {isSubmitting ? (
                <span>Authorizing Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Place Order • {formatCurrency(totals.total)}</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-stone-400 leading-normal">
              By placing your order you agree to Luma Scents' artisanal terms of service and client privacy policy.
            </p>
          </div>
        </div>

      </form>

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
