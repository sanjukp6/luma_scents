import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Tag, Gift, Flame, ShieldCheck, ArrowRight, Clock } from 'lucide-react';
import { OFFER_PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Toast } from '../components/Toast';

export const OffersPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Available categories for offer products
  const offerCategories = useMemo(() => {
    const cats = Array.from(new Set(OFFER_PRODUCTS.map((p) => p.category)));
    return ['All', ...cats];
  }, []);

  // Filter and sort offer items
  const filteredProducts = useMemo(() => {
    return OFFER_PRODUCTS.filter((product) => {
      return selectedCategory === 'All' || product.category === selectedCategory;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
    });
  }, [selectedCategory, sortBy]);

  // Google Tag Manager / GA4 view_item_list tracking
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null }); // Reset previous ecommerce state
    window.dataLayer.push({
      event: 'view_item_list',
      ecommerce: {
        item_list_name: 'New Year Sale 2026 - 50% OFF Collection',
        items: filteredProducts.map((product, index) => ({
          item_id: product.id,
          item_name: product.name,
          item_brand: product.brand,
          item_category: product.category,
          item_variant: product.variant,
          price: product.price,
          index: index + 1,
        })),
      },
    });
  }, [filteredProducts]);

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Offer Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-noir via-stone-900 to-brand-noir text-white py-16 md:py-24 border-b border-amber-500/30">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-amber-500/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-brand-gold text-xs font-bold uppercase tracking-widest animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Exclusive Limited Edition • New Year Sale 2026</span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Celebrate 2026 with <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300 bg-clip-text text-transparent">Flat 50% Off</span>
          </h1>

          {/* Subtitle */}
          <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-sans">
            Ring in the New Year with our limited-batch Haute Parfumerie creations. Handcrafted with Grand Cru champagne accords, rare black truffles, and sacred liquid amber at half the atelier price.
          </p>

          {/* Countdown & Highlights Pill */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold uppercase tracking-wider">
            <div className="flex items-center gap-2 bg-stone-800/80 backdrop-blur-md px-4 py-2.5 rounded-lg border border-stone-700 text-amber-300">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Limited 2026 Batch — While Stock Lasts</span>
            </div>
            <div className="flex items-center gap-2 bg-stone-800/80 backdrop-blur-md px-4 py-2.5 rounded-lg border border-stone-700 text-stone-200">
              <Gift className="w-4 h-4 text-brand-gold" />
              <span>Complimentary Festive Velvet Packaging</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Controls: Filter categories & Sort */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-brand-stone shadow-subtle">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 mr-2 shrink-0">Filter:</span>
            {offerCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-noir text-brand-gold-light shadow-md'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
            <label htmlFor="sort-select" className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Sort By:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            >
              <option value="featured">Featured Deals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onNotification={(msg, type) => setToast({ message: msg, type })}
            />
          ))}
        </div>

        {/* Empty state fallback */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-brand-stone space-y-4">
            <Tag className="w-10 h-10 text-stone-400 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-brand-noir">No offers found in this category</h3>
            <button
              onClick={() => setSelectedCategory('All')}
              className="px-5 py-2.5 bg-brand-noir text-brand-gold rounded-lg text-xs font-bold uppercase tracking-wider"
            >
              View All 50% Offers
            </button>
          </div>
        )}

        {/* Perks Banner */}
        <div className="bg-gradient-to-r from-stone-900 via-brand-noir to-stone-900 text-white rounded-2xl p-8 border border-amber-500/30 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400 shrink-0">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-brand-gold">50% Auto-Applied</h4>
              <p className="text-xs text-stone-300 mt-1">
                No promo code needed. Prices already reflect our direct 50% celebratory deduction.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-brand-gold">100% Authentic Extrait</h4>
              <p className="text-xs text-stone-300 mt-1">
                Same luxury botanical formulation, pure natural extracts, and 24h+ olfactory longevity.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400 shrink-0">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-brand-gold">Festive Gifting Ready</h4>
              <p className="text-xs text-stone-300 mt-1">
                Every bottle arrives in luxury gold-embossed presentation boxes with bespoke seals.
              </p>
            </div>
          </div>
        </div>

        {/* Explore Regular Collection CTA */}
        <div className="text-center pt-6 space-y-3">
          <p className="text-stone-500 text-sm">Looking for our classic timeless perfumes?</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-800 hover:text-brand-600 underline underline-offset-4"
          >
            <span>Explore Full Atelier Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
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
