import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingBag,
  Check,
  Star,
  Shield,
  Truck,
  Sparkles,
  Droplet,
  PackageCheck
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import { Toast } from '../components/Toast';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState<number>(1);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <h2 className="font-serif text-3xl font-bold text-brand-noir">Fragrance Not Found</h2>
        <p className="text-stone-600">The requested fragrance does not exist in our atelier collection.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-noir text-brand-gold text-xs font-bold uppercase tracking-wider rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Fragrances
        </Link>
      </div>
    );
  }

  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock <= 0;

  /**
   * Application Business Logic: Handle Add to Cart
   * 1. Checks requested quantity vs stock
   * 2. Calls addToCart(product, quantity)
   * 3. Handles state feedback
   * (Ready for dataLayer.push ecommerce add_to_cart event later)
   */
  const handleAddToCart = () => {
    if (isOutOfStock) {
      setToast({ message: 'Sorry, this fragrance is currently out of stock.', type: 'error' });
      return;
    }

    setIsAdding(true);
    const result = addToCart(product, quantity);

    if (result.success) {
      setJustAdded(true);
      setToast({ message: result.message, type: 'success' });
      setTimeout(() => setJustAdded(false), 2000);
    } else {
      setToast({ message: result.message, type: 'error' });
    }

    setIsAdding(false);
  };

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= product.stock) {
      setQuantity(newQty);
    }
  };

  // Related products
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
  const fallbackRelated = relatedProducts.length > 0 ? relatedProducts : PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumbs & Back */}
      <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500">
        <Link to="/" className="hover:text-brand-900 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-brand-900 transition-colors">Collection</Link>
        <span>/</span>
        <span className="text-brand-900 font-semibold truncate">{product.name}</span>
      </nav>

      {/* Main Product Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Product Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 border border-brand-stone shadow-subtle group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            {product.isBestseller && (
              <span className="absolute top-4 left-4 bg-brand-noir text-brand-gold text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-md">
                Atelier Bestseller
              </span>
            )}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-md text-xs font-semibold text-stone-800 shadow-sm">
              {product.variant}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs text-stone-600 bg-brand-stone/40 p-3 rounded-xl border border-brand-stone">
            <div className="flex items-center justify-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-brand-600" />
              <span>Extrait Formulation</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 border-x border-stone-300">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Cruelty Free</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <PackageCheck className="w-3.5 h-3.5 text-brand-600" />
              <span>Sealed Flacon</span>
            </div>
          </div>
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Brand & Category */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-700">
                {product.brand}
              </span>
              <span className="text-xs text-stone-400 block tracking-wider uppercase">
                Category: {product.category} • SKU: {product.id}
              </span>
            </div>

            {product.rating && (
              <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-amber-900">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-stone-400">({product.reviewCount} reviews)</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-noir leading-tight">
            {product.name}
          </h1>

          {/* Price & Variant */}
          <div className="flex items-baseline gap-4 py-2 border-y border-stone-200">
            <span className="font-sans text-3xl font-bold text-brand-noir">
              {formatCurrency(product.price)}
            </span>
            <span className="text-sm text-stone-500 font-medium">
              Tax included • Free Shipping on orders &ge; ₹1,000
            </span>
          </div>

          {/* Description */}
          <p className="text-stone-600 text-base leading-relaxed">
            {product.description}
          </p>

          {/* Olfactory Notes Pyramid */}
          {(product.topNotes || product.heartNotes || product.baseNotes) && (
            <div className="bg-white rounded-xl p-5 border border-brand-stone/80 space-y-3 shadow-subtle">
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-brand-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-500" /> Olfactory Notes Architecture
              </h3>

              <div className="space-y-2 text-xs divide-y divide-stone-100">
                {product.topNotes && (
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                    <span className="font-bold text-stone-700 w-24 shrink-0 uppercase tracking-wider">Top Notes:</span>
                    <span className="text-stone-600">{product.topNotes.join(' • ')}</span>
                  </div>
                )}
                {product.heartNotes && (
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                    <span className="font-bold text-stone-700 w-24 shrink-0 uppercase tracking-wider">Heart Notes:</span>
                    <span className="text-stone-600">{product.heartNotes.join(' • ')}</span>
                  </div>
                )}
                {product.baseNotes && (
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                    <span className="font-bold text-stone-700 w-24 shrink-0 uppercase tracking-wider">Base Notes:</span>
                    <span className="text-stone-600">{product.baseNotes.join(' • ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stock Status Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">Stock Availability:</span>
            {isOutOfStock ? (
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                Low Stock (Only {product.stock} units remaining)
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} available)
              </span>
            )}
          </div>

          {/* Purchase Actions: Quantity Selector & Add to Cart */}
          <div className="pt-4 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              
              {/* Quantity Selector */}
              <div className="flex items-center justify-between border-2 border-stone-300 rounded-lg px-3 py-2 bg-white w-full sm:w-36">
                <button
                  type="button"
                  id="qty-decrement-btn"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="text-stone-600 hover:text-brand-900 disabled:opacity-30 p-1 font-bold text-lg"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span id="product-quantity-display" className="font-bold text-stone-900 text-sm">
                  {quantity}
                </span>
                <button
                  type="button"
                  id="qty-increment-btn"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="text-stone-600 hover:text-brand-900 disabled:opacity-30 p-1 font-bold text-lg"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                id="add-to-cart-button"
                onClick={handleAddToCart}
                disabled={isAdding || isOutOfStock}
                className={`flex-1 py-4 px-8 rounded-lg font-medium tracking-wider uppercase text-sm flex items-center justify-center gap-3 shadow-elevated transition-all duration-300 ${
                  justAdded
                    ? 'bg-emerald-700 text-white'
                    : isOutOfStock
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    : 'bg-brand-noir text-brand-gold-light hover:bg-brand-800 hover:shadow-gold-glow'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct Checkout button if items already selected */}
            <div className="flex items-center justify-between pt-2">
              <Link
                to="/cart"
                className="text-xs font-semibold uppercase tracking-wider text-brand-700 hover:text-brand-900 underline underline-offset-4"
              >
                View Shopping Bag →
              </Link>
            </div>
          </div>

          {/* Guarantee & Assurances */}
          <div className="pt-6 border-t border-stone-200 grid grid-cols-2 gap-4 text-xs text-stone-600">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-brand-600 shrink-0" />
              <span>Ships within 24 hours in insulated luxury packaging</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-brand-600 shrink-0" />
              <span>100% Authentic Handcrafted Perfume Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Fragrances Section */}
      <div className="pt-12 border-t border-brand-stone space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-noir">
            You May Also Admire
          </h2>
          <Link
            to="/products"
            className="text-xs font-semibold uppercase tracking-wider text-brand-700 hover:text-brand-900"
          >
            Explore Full Collection →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {fallbackRelated.map((related) => (
            <ProductCard
              key={related.id}
              product={related}
              onNotification={(msg, type) => setToast({ message: msg, type })}
            />
          ))}
        </div>
      </div>

      {/* Toast Feedback */}
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
