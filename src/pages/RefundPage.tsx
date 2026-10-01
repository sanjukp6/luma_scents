import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  RotateCcw,
  Search,
  CheckCircle,
  Package,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Toast } from '../components/Toast';
import { Order, RefundRecord } from '../types';

export const RefundPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { orders, currentOrder, getOrderById, processRefund } = useOrder();

  const [transactionQuery, setTransactionQuery] = useState(
    searchParams.get('transactionId') || ''
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [refundMode, setRefundMode] = useState<'full' | 'partial'>('full');
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  const [refundReason, setRefundReason] = useState('Fragrance note mismatch / olfactory preference');
  const [customReason, setCustomReason] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('Original Payment Method');
  const [isProcessing, setIsProcessing] = useState(false);
  const [refundResult, setRefundResult] = useState<RefundRecord | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Auto-load order if transactionId is in query or if currentOrder exists
  useEffect(() => {
    const q = searchParams.get('transactionId');
    if (q) {
      setTransactionQuery(q);
      const found = getOrderById(q);
      if (found) {
        loadOrder(found);
      }
    } else if (currentOrder) {
      setTransactionQuery(currentOrder.transactionId);
      loadOrder(currentOrder);
    } else if (orders.length > 0) {
      setTransactionQuery(orders[0].transactionId);
      loadOrder(orders[0]);
    }
  }, [searchParams, orders, currentOrder]);

  const loadOrder = (order: Order) => {
    setSelectedOrder(order);
    setRefundResult(order.refundDetails || null);
    // Initialize partial selection with all item quantities
    const initialQty: Record<string, number> = {};
    order.items.forEach((item) => {
      initialQty[item.product.id] = item.quantity;
    });
    setSelectedItems(initialQty);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionQuery.trim()) {
      setToast({ message: 'Please enter a Transaction ID', type: 'error' });
      return;
    }
    const found = getOrderById(transactionQuery.trim());
    if (found) {
      loadOrder(found);
      setToast({ message: `Order ${found.transactionId} found`, type: 'success' });
    } else {
      setSelectedOrder(null);
      setToast({
        message: `No order found matching "${transactionQuery}". Check the ID or place a test order.`,
        type: 'error',
      });
    }
  };

  const handleItemQtyChange = (productId: string, qty: number, maxQty: number) => {
    const clamped = Math.max(0, Math.min(qty, maxQty));
    setSelectedItems((prev) => ({
      ...prev,
      [productId]: clamped,
    }));
  };

  const calculatedRefundTotal = useMemo(() => {
    if (!selectedOrder) return 0;
    if (refundMode === 'full') return selectedOrder.total;

    let subtotal = 0;
    selectedOrder.items.forEach((item) => {
      const qty = selectedItems[item.product.id] || 0;
      subtotal += item.product.price * qty;
    });

    return subtotal;
  }, [selectedOrder, refundMode, selectedItems]);

  const handleProcessRefund = async () => {
    if (!selectedOrder) return;

    if (selectedOrder.status === 'refunded') {
      setToast({ message: 'This order has already been fully refunded.', type: 'error' });
      return;
    }

    if (calculatedRefundTotal <= 0) {
      setToast({ message: 'Please select at least 1 item to refund.', type: 'error' });
      return;
    }

    setIsProcessing(true);

    try {
      const itemsToRefund = selectedOrder.items
        .filter((item) => (refundMode === 'full' ? true : (selectedItems[item.product.id] || 0) > 0))
        .map((item) => ({
          productId: item.product.id,
          product: item.product,
          quantity: refundMode === 'full' ? item.quantity : selectedItems[item.product.id] || item.quantity,
          amount: item.product.price * (refundMode === 'full' ? item.quantity : selectedItems[item.product.id] || item.quantity),
        }));

      const finalReason = refundReason === 'Other' ? customReason || 'Other customer reason' : refundReason;

      const record = await processRefund(selectedOrder.transactionId, {
        items: itemsToRefund.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          amount: i.amount,
        })),
        amount: calculatedRefundTotal,
        reason: finalReason,
        payoutMethod,
      });

      // Google Tag Manager / GA4 Refund Event
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ ecommerce: null }); // Clear previous ecommerce object
      window.dataLayer.push({
        event: "refund",
        ecommerce: {
          currency: "INR",
          transaction_id: selectedOrder.transactionId,
          value: calculatedRefundTotal,
          tax: 0,
          shipping: refundMode === 'full' ? selectedOrder.shipping : 0,
          items: itemsToRefund.map((item, index) => ({
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

      setRefundResult(record);
      setSelectedOrder((prev) => (prev ? { ...prev, status: calculatedRefundTotal >= prev.total ? 'refunded' : 'partially_refunded' } : null));
      setToast({ message: 'Refund initiated and tracked successfully!', type: 'success' });
    } catch (err: any) {
      setToast({ message: err?.message || 'Failed to process refund', type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">

      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-stone text-xs font-semibold uppercase tracking-widest text-brand-800">
          <RotateCcw className="w-3.5 h-3.5 text-brand-600" />
          <span>Client Concierge</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-noir">
          Returns & Refund Portal
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Lookup your orders, initiate full or partial returns, and track standard GA4 <code>refund</code> dataLayer events.
        </p>
      </div>

      {/* Search Bar / Order Lookup */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-stone shadow-subtle max-w-3xl mx-auto">
        <form onSubmit={handleSearch} className="space-y-4">
          <label htmlFor="tx-search" className="block text-xs font-bold uppercase tracking-wider text-stone-700">
            Search By Transaction / Order ID
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                id="tx-search"
                value={transactionQuery}
                onChange={(e) => setTransactionQuery(e.target.value)}
                placeholder="e.g. LUMA-TX-1740889..."
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-lg text-sm font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
              />
            </div>
            <button
              type="submit"
              id="lookup-order-btn"
              className="px-6 py-3 bg-brand-noir text-brand-gold-light hover:bg-brand-800 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all shrink-0"
            >
              <span>Lookup Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Select from existing mock orders */}
          {orders.length > 0 && (
            <div className="pt-2 border-t border-stone-100 flex items-center gap-2 flex-wrap text-xs text-stone-500">
              <span className="font-semibold text-stone-700">Recent Orders:</span>
              {orders.slice(0, 3).map((o) => (
                <button
                  key={o.transactionId}
                  type="button"
                  onClick={() => loadOrder(o)}
                  className={`px-2.5 py-1 rounded border text-[11px] font-mono transition-colors ${
                    selectedOrder?.transactionId === o.transactionId
                      ? 'bg-brand-noir text-white border-brand-noir'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {o.transactionId} ({formatCurrency(o.total)})
                </button>
              ))}
            </div>
          )}
        </form>
      </div>

      {/* Selected Order Refund Management */}
      {selectedOrder ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
          
          {/* Left Column: Order details & Refund form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Order Overview Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-stone shadow-subtle space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-4 gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-700">
                    Order Reference
                  </span>
                  <h3 className="font-mono text-base font-bold text-brand-noir">
                    {selectedOrder.transactionId}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      selectedOrder.status === 'refunded'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : selectedOrder.status === 'partially_refunded'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {selectedOrder.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-stone-600">
                <div>
                  <span className="text-stone-400 block font-medium">Customer:</span>
                  <p className="font-bold text-stone-900">{selectedOrder.customer.name}</p>
                  <p className="truncate">{selectedOrder.customer.email}</p>
                </div>
                <div>
                  <span className="text-stone-400 block font-medium">Placed On:</span>
                  <p className="font-bold text-stone-900 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <div>
                  <span className="text-stone-400 block font-medium">Payment Mode:</span>
                  <p className="font-bold text-stone-900">{selectedOrder.paymentMethod || 'UPI / Card'}</p>
                </div>
              </div>
            </div>

            {/* Refund Configuration Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-stone shadow-subtle space-y-6">
              <h3 className="font-serif text-xl font-bold text-brand-noir border-b border-stone-100 pb-3 flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-brand-600" />
                <span>Configure Refund & Return</span>
              </h3>

              {/* Mode Switcher */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Refund Scope
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRefundMode('full')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      refundMode === 'full'
                        ? 'border-brand-900 bg-brand-stone/30 font-bold text-brand-noir shadow-sm'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span className="text-xs uppercase tracking-wider block">Full Order Refund</span>
                    <span className="text-[11px] font-normal text-stone-500">
                      Refund entire amount ({formatCurrency(selectedOrder.total)})
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRefundMode('partial')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      refundMode === 'partial'
                        ? 'border-brand-900 bg-brand-stone/30 font-bold text-brand-noir shadow-sm'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span className="text-xs uppercase tracking-wider block">Partial Item Return</span>
                    <span className="text-[11px] font-normal text-stone-500">
                      Select specific items to refund
                    </span>
                  </button>
                </div>
              </div>

              {/* Line items selector for Partial Mode */}
              {refundMode === 'partial' && (
                <div className="space-y-3 pt-2 border-t border-stone-100">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Select Items & Quantities to Return
                  </label>
                  <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
                    {selectedOrder.items.map(({ product, quantity }) => {
                      const currentSelectedQty = selectedItems[product.id] || 0;
                      return (
                        <div key={product.id} className="p-3.5 bg-white flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-14 object-cover rounded-lg bg-stone-100 border shrink-0"
                            />
                            <div>
                              <p className="text-xs font-bold text-brand-noir">{product.name}</p>
                              <p className="text-[11px] text-stone-500">
                                {formatCurrency(product.price)} each • Max Qty: {quantity}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="text-xs text-stone-500">Refund Qty:</label>
                            <select
                              value={currentSelectedQty}
                              onChange={(e) => handleItemQtyChange(product.id, parseInt(e.target.value), quantity)}
                              className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-md text-xs font-bold text-stone-900"
                            >
                              {Array.from({ length: quantity + 1 }).map((_, i) => (
                                <option key={i} value={i}>
                                  {i}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Refund Reason */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Reason for Return / Refund *
                </label>
                <select
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                >
                  <option value="Fragrance note mismatch / olfactory preference">
                    Fragrance note mismatch / olfactory preference
                  </option>
                  <option value="Ordered incorrect variant or concentration">
                    Ordered incorrect variant or concentration
                  </option>
                  <option value="Damaged flacon / leakage during transit">
                    Damaged flacon / leakage during transit
                  </option>
                  <option value="Defective spray atomizer">Defective spray atomizer</option>
                  <option value="Delayed delivery">Delayed courier delivery</option>
                  <option value="Other">Other reason...</option>
                </select>

                {refundReason === 'Other' && (
                  <textarea
                    rows={2}
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Please specify additional return context..."
                    className="w-full mt-2 px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900"
                  />
                )}
              </div>

              {/* Payout Destination */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Refund Payout Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 text-xs text-stone-800 p-2.5 border rounded-lg hover:bg-stone-50 cursor-pointer">
                    <input
                      type="radio"
                      name="payout"
                      checked={payoutMethod === 'Original Payment Method'}
                      onChange={() => setPayoutMethod('Original Payment Method')}
                      className="accent-brand-noir"
                    />
                    <span>Original Payment Method (Direct reversal to source in 3-5 business days)</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-stone-800 p-2.5 border rounded-lg hover:bg-stone-50 cursor-pointer">
                    <input
                      type="radio"
                      name="payout"
                      checked={payoutMethod === 'Store Credit (+5% Bonus)'}
                      onChange={() => setPayoutMethod('Store Credit (+5% Bonus)')}
                      className="accent-brand-noir"
                    />
                    <span className="flex items-center gap-1.5">
                      <span>Instant Luma Scents Store Credit</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        +5% Extra Value
                      </span>
                    </span>
                  </label>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Refund Summary & Trigger */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-brand-stone p-6 sm:p-8 space-y-6 shadow-subtle sticky top-28">
              <h3 className="font-serif text-xl font-bold text-brand-noir border-b border-stone-200 pb-4">
                Refund Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-stone-600">
                  <span>Refund Scope</span>
                  <span className="font-semibold text-stone-900 uppercase text-xs">
                    {refundMode === 'full' ? 'Full Order' : 'Partial Items'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-stone-600">
                  <span>Calculated Amount</span>
                  <span className="font-semibold text-stone-900 font-sans">
                    {formatCurrency(calculatedRefundTotal)}
                  </span>
                </div>

                <div className="border-t border-stone-200 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-base font-bold text-brand-noir block">Total Refund Value</span>
                    <span className="text-[11px] text-stone-400">Pushed to GA4 dataLayer</span>
                  </div>
                  <span className="font-serif text-2xl font-bold text-brand-noir">
                    {formatCurrency(calculatedRefundTotal)}
                  </span>
                </div>
              </div>

              {/* Process Refund Button */}
              <button
                type="button"
                id="process-refund-button"
                onClick={handleProcessRefund}
                disabled={isProcessing || selectedOrder.status === 'refunded' || calculatedRefundTotal <= 0}
                className={`w-full py-4 px-6 rounded-lg font-medium tracking-wider uppercase text-sm shadow-elevated transition-all duration-300 flex items-center justify-center gap-2 ${
                  isProcessing
                    ? 'bg-stone-400 text-white cursor-wait'
                    : selectedOrder.status === 'refunded'
                    ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                    : 'bg-rose-900 text-white hover:bg-rose-800 hover:shadow-lg'
                }`}
              >
                {isProcessing ? (
                  <span>Processing Refund...</span>
                ) : selectedOrder.status === 'refunded' ? (
                  <span>Already Refunded</span>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    <span>Authorize Refund • {formatCurrency(calculatedRefundTotal)}</span>
                  </>
                )}
              </button>

              {/* DataLayer Information Box */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs text-stone-600 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-stone-800">
                  <Info className="w-4 h-4 text-brand-600" />
                  <span>Google Tag Manager / GA4 Payload</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Authorizing the refund fires the official GA4 <code>refund</code> event containing <code>transaction_id</code>, <code>value</code>, <code>currency</code>, and the itemized product list.
                </p>
              </div>

              {/* Refund Confirmation Receipt if executed */}
              {refundResult && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 space-y-2 animate-fade-in">
                  <div className="flex items-center gap-2 font-bold text-emerald-800">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Refund Record #{refundResult.refundId}</span>
                  </div>
                  <p className="text-[11px]">
                    Refund of <strong>{formatCurrency(refundResult.amount)}</strong> authorized for transaction <code>{refundResult.transactionId}</code>.
                  </p>
                  <p className="text-[10px] text-emerald-700">
                    Payout via {refundResult.payoutMethod} • {formatDate(refundResult.createdAt)}
                  </p>
                </div>
              )}

            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-brand-stone p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-brand-stone mx-auto flex items-center justify-center text-brand-700">
            <Package className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-brand-noir">No Order Selected</h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Please search for an existing order by Transaction ID above or place a fresh test order via checkout to test the complete eCommerce refund journey.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/products"
              className="px-6 py-2.5 bg-brand-noir text-brand-gold text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm"
            >
              Shop Fragrances
            </Link>
          </div>
        </div>
      )}

      {/* Trust & Guarantee Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-brand-stone shadow-subtle grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-brand-stone/60 rounded-xl text-brand-700 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-stone-900 text-sm">30-Day Artisanal Guarantee</h4>
            <p className="text-xs text-stone-500 mt-1">Hassle-free return policy if notes do not blend with your skin chemistry.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-brand-stone/60 rounded-xl text-brand-700 shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-stone-900 text-sm">Complimentary Return Shipping</h4>
            <p className="text-xs text-stone-500 mt-1">Pre-paid courier pickup scheduled right at your doorstep.</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-brand-stone/60 rounded-xl text-brand-700 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-stone-900 text-sm">Discovery Samples Kept</h4>
            <p className="text-xs text-stone-500 mt-1">You are welcome to keep all complimentary discovery vial samples.</p>
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
