import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  AlertCircle,
  ShoppingBag,
  CreditCard,
  QrCode,
  Building2,
  Banknote,
  CheckCircle2,
  Sparkles,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { Customer } from '../types';
import { formatCurrency } from '../utils/formatters';
import { Toast } from '../components/Toast';

type PaymentMethodType = 'upi' | 'card' | 'netbanking' | 'cod';

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

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('upi');
  const [upiId, setUpiId] = useState('fragrance.lover@oksbi');
  const [cardDetails, setCardDetails] = useState({
    number: '•••• •••• •••• 4242',
    name: 'Eleanor Vance',
    expiry: '12/28',
    cvv: '•••'
  });
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [hasTrackedShipping, setHasTrackedShipping] = useState(false);

  // Google Tag Manager / GA4 Begin Checkout Event
  useEffect(() => {
    if (items.length > 0) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ ecommerce: null }); // Clear previous ecommerce object
      window.dataLayer.push({
        event: 'begin_checkout',
        ecommerce: {
          currency: 'INR',
          value: totals.total,
          items: items.map((item, index) => ({
            item_id: item.product.id,
            item_name: item.product.name,
            item_brand: item.product.brand,
            item_category: item.product.category,
            item_variant: item.product.variant,
            price: item.product.price,
            quantity: item.quantity,
            index: index + 1,
          })),
        },
      });

      // Default payment info tracking on initial render
      pushPaymentInfoEvent('upi');
    }
  }, []); // Fires once when customer initiates checkout

  const pushShippingInfoEvent = () => {
    if (!hasTrackedShipping && items.length > 0) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ ecommerce: null });
      window.dataLayer.push({
        event: 'add_shipping_info',
        ecommerce: {
          currency: 'INR',
          value: totals.total,
          shipping_tier: totals.shipping === 0 ? 'Complimentary Express' : 'Standard Express Delivery',
          items: items.map((item, index) => ({
            item_id: item.product.id,
            item_name: item.product.name,
            item_brand: item.product.brand,
            item_category: item.product.category,
            item_variant: item.product.variant,
            price: item.product.price,
            quantity: item.quantity,
            index: index + 1,
          })),
        },
      });
      setHasTrackedShipping(true);
    }
  };

  const pushPaymentInfoEvent = (method: PaymentMethodType) => {
    if (items.length > 0) {
      const methodLabels: Record<PaymentMethodType, string> = {
        upi: 'UPI / Instant QR',
        card: 'Credit / Debit Card',
        netbanking: 'Net Banking',
        cod: 'Cash on Delivery'
      };

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ ecommerce: null });
      window.dataLayer.push({
        event: 'add_payment_info',
        ecommerce: {
          currency: 'INR',
          value: totals.total,
          payment_type: methodLabels[method],
          items: items.map((item, index) => ({
            item_id: item.product.id,
            item_name: item.product.name,
            item_brand: item.product.brand,
            item_category: item.product.category,
            item_variant: item.product.variant,
            price: item.product.price,
            quantity: item.quantity,
            index: index + 1,
          })),
        },
      });
    }
  };

  const handleSelectPaymentMethod = (method: PaymentMethodType) => {
    setPaymentMethod(method);
    pushPaymentInfoEvent(method);
  };

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
   * 4. Fires dataLayer purchase event
   * 5. Navigates to /order-success
   */
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setToast({ message: 'Please fix the highlighted errors before placing the order.', type: 'error' });
      return;
    }

    setIsSubmitting(true);

    const methodLabels: Record<PaymentMethodType, string> = {
      upi: 'UPI (Instant UPI / QR)',
      card: 'Credit / Debit Card',
      netbanking: 'Net Banking',
      cod: 'Cash on Delivery (COD)'
    };

    try {
      const createdOrder = await placeOrder(
        customer,
        items,
        totals.subtotal,
        totals.shipping,
        totals.total,
        methodLabels[paymentMethod]
      );

      // Google Tag Manager / GA4 Purchase Event
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ ecommerce: null }); // Clear previous ecommerce object
      window.dataLayer.push({
        event: "purchase",
        ecommerce: {
          transaction_id: createdOrder.transactionId,
          value: createdOrder.total,
          shipping: createdOrder.shipping,
          tax: 0,
          currency: "INR",
          payment_type: methodLabels[paymentMethod],
          items: createdOrder.items.map((item, index) => ({
            item_id: item.product.id,
            item_name: item.product.name,
            item_brand: item.product.brand,
            item_category: item.product.category,
            item_variant: item.product.variant,
            price: item.product.price,
            quantity: item.quantity,
            index: index + 1,
          }))
        }
      });

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
          <p className="text-stone-500 text-sm mt-1">Please provide your delivery and payment details.</p>
        </div>
        <Link
          to="/cart"
          className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-800 hover:text-brand-600"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-start">

        {/* Left Column: Customer, Shipping and Payment Form */}
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
          <div
            className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-stone shadow-subtle space-y-6"
            onFocus={pushShippingInfoEvent}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="font-serif text-xl font-bold text-brand-noir">
                2. Shipping Destination
              </h2>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200">
                <Truck className="w-3.5 h-3.5" /> Express Dispatch
              </span>
            </div>

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

          {/* Payment Method Selection */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-stone shadow-subtle space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="font-serif text-xl font-bold text-brand-noir">
                3. Payment Method
              </h2>
              <span className="text-xs text-stone-500 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-brand-600 inline" /> 256-Bit SSL Encrypted
              </span>
            </div>

            {/* Payment Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* UPI / QR */}
              <div
                onClick={() => handleSelectPaymentMethod('upi')}
                id="payment-method-upi"
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                  paymentMethod === 'upi'
                    ? 'border-brand-900 bg-brand-stone/30 shadow-sm'
                    : 'border-stone-200 bg-white hover:border-brand-300'
                }`}
              >
                <div className={`p-2 rounded-lg ${paymentMethod === 'upi' ? 'bg-brand-noir text-brand-gold' : 'bg-stone-100 text-stone-600'}`}>
                  <QrCode className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-noir">UPI / Instant QR</span>
                    {paymentMethod === 'upi' && <CheckCircle2 className="w-4 h-4 text-brand-700" />}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">Google Pay, PhonePe, Paytm, BHIM</p>
                  <span className="inline-block mt-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Instant Zero-Fee
                  </span>
                </div>
              </div>

              {/* Credit / Debit Card */}
              <div
                onClick={() => handleSelectPaymentMethod('card')}
                id="payment-method-card"
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                  paymentMethod === 'card'
                    ? 'border-brand-900 bg-brand-stone/30 shadow-sm'
                    : 'border-stone-200 bg-white hover:border-brand-300'
                }`}
              >
                <div className={`p-2 rounded-lg ${paymentMethod === 'card' ? 'bg-brand-noir text-brand-gold' : 'bg-stone-100 text-stone-600'}`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-noir">Cards</span>
                    {paymentMethod === 'card' && <CheckCircle2 className="w-4 h-4 text-brand-700" />}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">Visa, MasterCard, RuPay, Amex</p>
                  <span className="inline-block mt-1 bg-stone-100 text-stone-700 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                    International & Domestic
                  </span>
                </div>
              </div>

              {/* Net Banking */}
              <div
                onClick={() => handleSelectPaymentMethod('netbanking')}
                id="payment-method-netbanking"
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                  paymentMethod === 'netbanking'
                    ? 'border-brand-900 bg-brand-stone/30 shadow-sm'
                    : 'border-stone-200 bg-white hover:border-brand-300'
                }`}
              >
                <div className={`p-2 rounded-lg ${paymentMethod === 'netbanking' ? 'bg-brand-noir text-brand-gold' : 'bg-stone-100 text-stone-600'}`}>
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-noir">Net Banking</span>
                    {paymentMethod === 'netbanking' && <CheckCircle2 className="w-4 h-4 text-brand-700" />}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">HDFC, ICICI, SBI, Axis, Kotak</p>
                  <span className="inline-block mt-1 bg-stone-100 text-stone-700 text-[10px] font-semibold px-1.5 py-0.5 rounded">
                    50+ Major Banks
                  </span>
                </div>
              </div>

              {/* Cash On Delivery */}
              <div
                onClick={() => handleSelectPaymentMethod('cod')}
                id="payment-method-cod"
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                  paymentMethod === 'cod'
                    ? 'border-brand-900 bg-brand-stone/30 shadow-sm'
                    : 'border-stone-200 bg-white hover:border-brand-300'
                }`}
              >
                <div className={`p-2 rounded-lg ${paymentMethod === 'cod' ? 'bg-brand-noir text-brand-gold' : 'bg-stone-100 text-stone-600'}`}>
                  <Banknote className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-noir">Cash on Delivery</span>
                    {paymentMethod === 'cod' && <CheckCircle2 className="w-4 h-4 text-brand-700" />}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">Pay in cash or UPI at doorstep</p>
                  <span className="inline-block mt-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Verified Courier
                  </span>
                </div>
              </div>

            </div>

            {/* Dynamic Sub-Form for Selected Payment */}
            <div className="bg-stone-50 p-4 sm:p-5 rounded-xl border border-stone-200 space-y-3">
              {paymentMethod === 'upi' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800 uppercase tracking-wider">Virtual Payment Address (VPA / UPI ID)</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Auto-Verified
                    </span>
                  </div>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="w-full px-4 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 font-mono"
                  />
                  <p className="text-[11px] text-stone-500">
                    A test payment intent notification will be simulated upon clicking Place Order.
                  </p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Card Number</label>
                    <input
                      type="text"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-stone-300 rounded-lg text-sm font-mono text-stone-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Expiry Date</label>
                      <input
                        type="text"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-stone-300 rounded-lg text-sm font-mono text-stone-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">CVV Code</label>
                      <input
                        type="password"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-stone-300 rounded-lg text-sm font-mono text-stone-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Select Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 font-medium"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="text-xs text-stone-600 space-y-1">
                  <p className="font-bold text-stone-900">Cash / UPI on Delivery</p>
                  <p>You can pay via Cash, QR, or Card terminal when our courier arrives with your handcrafted perfume.</p>
                </div>
              )}
            </div>
          </div>

          {/* Simulated Payment Notice */}
          <div className="bg-brand-stone/40 border border-brand-stone rounded-2xl p-5 flex items-start gap-4 text-xs text-stone-700">
            <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-stone-900">Simulated Testing Environment</strong>
              <span>
                No actual card charges are levied. Placing an order generates authentic GA4 and GTM DataLayer e-commerce events (<code>begin_checkout</code>, <code>add_shipping_info</code>, <code>add_payment_info</code>, and <code>purchase</code>) for analytics verification.
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
