import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Droplets, Compass, Award, Flame } from 'lucide-react';
import { PRODUCTS, OFFER_PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Toast } from '../components/Toast';

export const HomePage: React.FC = () => {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const featuredProducts = PRODUCTS.filter((p) => p.isFeatured && !p.isOffer).slice(0, 4);
  const newYearOfferProducts = OFFER_PRODUCTS.slice(0, 3);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  // Google Tag Manager / GA4 view_promotion event on homepage load
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'view_promotion',
      ecommerce: {
        promotion_id: 'PROMO_NY2026_50OFF',
        promotion_name: 'New Year Sale 2026 - Flat 50% Off',
        creative_name: 'New Year 2026 Hero & Spotlight Banners',
        creative_slot: 'homepage_featured',
        location_id: 'homepage',
        items: newYearOfferProducts.map((p, index) => ({
          item_id: p.id,
          item_name: p.name,
          item_brand: p.brand,
          item_category: p.category,
          item_variant: p.variant,
          price: p.price,
          index: index + 1,
        })),
      },
    });
  }, []);

  // DataLayer event when user clicks the Hero offer button (without items array)
  const handleHeroOfferClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'offer_button_click',
      offer_name: 'New Year Sale 2026',
      discount: '50% OFF',
      button_text: 'New Year Sale (50% OFF)',
      button_location: 'homepage_hero',
      target_page: '/offers'
    });
  };

  // DataLayer event when user clicks the Spotlight section offer button (without items array)
  const handleSpotlightOfferClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'offer_button_click',
      offer_name: 'New Year Sale 2026',
      discount: '50% OFF',
      button_text: 'Explore All 50% Offers',
      button_location: 'homepage_spotlight',
      target_page: '/offers'
    });
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-stone/40 via-brand-sand to-brand-sand border-b border-brand-stone/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-stone/80 border border-brand-300/60 text-xs font-semibold uppercase tracking-widest text-brand-800">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>The Artisanal Fragrance Atelier</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-noir tracking-tight leading-[1.15]">
                Scents that linger in memories, crafted from rare botanicals.
              </h1>

              <p className="text-stone-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
                Elevate your everyday ritual with our limited-batch parfums, formulated with wildcrafted blossoms, aged woods, and golden amber.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/offers"
                  id="hero-new-year-sale-cta"
                  onClick={handleHeroOfferClick}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-white hover:brightness-110 rounded-lg font-medium tracking-wider uppercase text-sm shadow-elevated flex items-center justify-center gap-2 group animate-pulse"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>New Year Sale (50% OFF)</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  to="/products"
                  className="w-full sm:w-auto px-6 py-4 bg-white/80 hover:bg-white text-stone-800 rounded-lg font-medium tracking-wider uppercase text-sm border border-brand-stone shadow-subtle hover:border-brand-400 transition-all flex items-center justify-center"
                >
                  Shop Full Collection
                </Link>
              </div>

              {/* Micro stats */}
              <div className="pt-8 border-t border-brand-stone/80 grid grid-cols-3 gap-4 text-center lg:text-left max-w-md mx-auto lg:mx-0">
                <div>
                  <span className="block font-serif text-2xl font-bold text-brand-noir">100%</span>
                  <span className="text-xs text-stone-500 uppercase tracking-wider">Natural Essences</span>
                </div>
                <div>
                  <span className="block font-serif text-2xl font-bold text-brand-noir">24h+</span>
                  <span className="text-xs text-stone-500 uppercase tracking-wider">Longevity</span>
                </div>
                <div>
                  <span className="block font-serif text-2xl font-bold text-brand-noir">Free</span>
                  <span className="text-xs text-stone-500 uppercase tracking-wider">Shipping &gt; ₹1k</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Imagery */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=900"
                    alt="Luma Noir Eau de Parfum Signature Bottle"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="text-xs uppercase tracking-widest text-brand-gold font-medium block">
                      Signature Release
                    </span>
                    <h3 className="font-serif text-2xl font-bold mt-1">Luma Noir Eau de Parfum</h3>
                    <p className="text-xs text-stone-300 mt-1">Bourbon Vanilla • Night Jasmine • Amber</p>
                  </div>
                </div>

                {/* Floating highlight badge */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-brand-stone flex items-center gap-3 max-w-xs animate-subtle-float">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-brand-700" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-brand-noir block">Award Winning Blend</span>
                    <span className="text-[11px] text-stone-500">Voted Best Artisanal Fragrance 2026</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* NEW YEAR SALE 2026 SPECIAL SPOTLIGHT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-brand-noir via-stone-900 to-stone-950 text-white rounded-3xl p-8 sm:p-12 border border-amber-500/40 shadow-2xl space-y-10 relative overflow-hidden">
          {/* Subtle gold glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 border-b border-stone-800 pb-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-brand-gold text-xs font-bold uppercase tracking-widest">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>New Year Sale 2026 • Flat 50% Off</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                Limited Edition <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300 bg-clip-text text-transparent">2026 Flacons</span>
              </h2>
              <p className="text-stone-300 text-sm sm:text-base max-w-xl">
                Exclusive celebratory formulations handcrafted for 2026. Available at a special 50% deduction while limited atelier stock remains.
              </p>
            </div>

            <Link
              to="/offers"
              id="spotlight-new-year-sale-cta"
              onClick={handleSpotlightOfferClick}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-white hover:brightness-110 rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg transition-all shrink-0"
            >
              <span>Explore All 50% Offers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* New Year Offer Preview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {newYearOfferProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNotification={showNotification}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Selection</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-noir">
              Featured Creations
            </h2>
            <p className="text-stone-500 text-sm mt-1 max-w-md">
              Discover our most sought-after olfactory signatures, meticulously compounded by master perfumers.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand-800 hover:text-brand-600 transition-colors group"
          >
            <span>View All Fragrances</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid of Featured Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onNotification={showNotification}
            />
          ))}
        </div>
      </section>

      {/* Brand Craftsmanship & Notes Story */}
      <section className="bg-brand-noir text-white py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
              The Alchemy of Scent
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Pure Botanicals. Uncompromising Elegance.
            </h2>
            <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
              Every bottle of Luma Scents is cold-aged for 90 days to achieve olfactory harmony, using sustainably sourced rare botanicals from Grasse, Madagascar, and Mysore.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center mx-auto md:mx-0">
                <Droplets className="w-6 h-6 text-brand-gold" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-brand-gold-light">Top Notes</h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                The immediate sparkling introduction—vibrant bergamot, crushed raspberry, and morning neroli dew.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center mx-auto md:mx-0">
                <Sparkles className="w-6 h-6 text-brand-gold" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-brand-gold-light">Heart Notes</h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                The true character and emotional core of the parfum—nocturnal jasmine, Grasse centifolia rose, and white sage.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center mx-auto md:mx-0">
                <Compass className="w-6 h-6 text-brand-gold" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-brand-gold-light">Base Notes</h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                The enduring trail that stays with you into the twilight—aged agarwood, smoked cedar, and golden bourbon vanilla.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full collection banner callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-brand-stone/60 border border-brand-stone p-8 sm:p-14 overflow-hidden text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700">
            Find Your Signature Scent
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-noir max-w-xl mx-auto">
            Ready to experience the allure of Luma Scents?
          </h2>
          <p className="text-stone-600 text-sm sm:text-base max-w-lg mx-auto">
            Explore our complete catalog with detailed fragrance notes, bottle variants, and instant doorstep dispatch.
          </p>
          <div>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-noir text-brand-gold-light hover:bg-brand-800 rounded-lg font-medium tracking-wider uppercase text-sm shadow-md hover:shadow-lg transition-all"
            >
              <span>Explore All Fragrances</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

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
