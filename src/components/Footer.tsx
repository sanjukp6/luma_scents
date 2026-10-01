import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, RefreshCw, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-noir text-white border-t border-brand-noir-light mt-auto">
      {/* Value props section */}
      <div className="border-b border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-brand-gold/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-brand-gold" />
              </div>
              <div>
                <h4 className="font-serif font-medium text-base text-brand-gold-light">Artisanal Distillation</h4>
                <p className="text-xs text-stone-400 mt-0.5">Sustainably harvested botanicals & cold-pressed essences</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-brand-gold/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-brand-gold" />
              </div>
              <div>
                <h4 className="font-serif font-medium text-base text-brand-gold-light">100% Authentic & Pure</h4>
                <p className="text-xs text-stone-400 mt-0.5">IFRA compliant, non-toxic, vegan and cruelty-free</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-brand-gold/30 flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5 text-brand-gold" />
              </div>
              <div>
                <h4 className="font-serif font-medium text-base text-brand-gold-light">Complimentary Shipping</h4>
                <p className="text-xs text-stone-400 mt-0.5">Free doorstep delivery on orders above ₹1,000</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer contents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-wider text-white">LUMA SCENTS</span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed max-w-sm">
              Luma Scents is an artisanal haute parfumerie devoted to evocative scents, rare botanicals, and timeless elegance.
            </p>
            <div className="pt-2">
              <p className="text-xs uppercase tracking-widest text-brand-gold font-medium">Tracking Demo & Storefront</p>
              <p className="text-xs text-stone-500 mt-1">Ready for GTM & GA4 Ecommerce Data Layer Integration</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm text-stone-300">
              <li>
                <Link to="/" className="hover:text-brand-gold transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-brand-gold transition-colors">All Fragrances</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-brand-gold transition-colors">Your Cart</Link>
              </li>
              <li>
                <Link to="/checkout" className="hover:text-brand-gold transition-colors">Checkout</Link>
              </li>
              <li>
                <Link to="/refund" className="hover:text-brand-gold transition-colors">Returns & Refund</Link>
              </li>
            </ul>
          </div>

          {/* Fragrance Families */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-brand-gold mb-4">Collections</h4>
            <ul className="space-y-2.5 text-sm text-stone-300">
              <li>
                <Link to="/products?category=Perfume" className="hover:text-brand-gold transition-colors">Eau de Parfum</Link>
              </li>
              <li>
                <Link to="/products?category=Woody+Fragrance" className="hover:text-brand-gold transition-colors">Woody & Amber</Link>
              </li>
              <li>
                <Link to="/products?category=Floral" className="hover:text-brand-gold transition-colors">Floral Botanicals</Link>
              </li>
              <li>
                <Link to="/products?category=Oriental" className="hover:text-brand-gold transition-colors">Rare Ouds</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Luma Scents. All rights reserved.</p>
          <p className="flex items-center gap-1 text-stone-400">
            Crafted for <Heart className="w-3.5 h-3.5 text-brand-gold fill-brand-gold inline" /> Luxury Fragrance Lovers
          </p>
        </div>
      </div>
    </footer>
  );
};
