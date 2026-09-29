import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const { totals } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collection', path: '/products' },
    { name: 'New Year Sale 2026', path: '/offers', badge: '50% OFF' },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleOfferNavClick = (location: string) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'offer_button_click',
      offer_name: 'New Year Sale 2026',
      discount: '50% OFF',
      button_text: 'Shop 50% Deals',
      button_location: location,
      target_page: '/offers'
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-brand-sand/90 backdrop-blur-md border-b border-brand-stone/60 transition-colors">
      {/* Top micro announcement */}
      <Link
        to="/offers"
        onClick={() => handleOfferNavClick('navbar_announcement_bar')}
        className="bg-gradient-to-r from-stone-950 via-brand-noir to-stone-950 text-brand-gold-light py-2 px-4 text-center text-xs tracking-widest uppercase font-medium flex items-center justify-center gap-2 hover:text-white transition-colors group cursor-pointer"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-300 inline animate-spin-slow" />
        <span>🎉 New Year 2026 Sale: Flat 50% Off On Exclusive Limited Editions</span>
        <span className="hidden sm:inline-block bg-amber-500/30 text-amber-200 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider group-hover:bg-amber-500/50">
          Shop 50% Deals →
        </span>
      </Link>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-brand-noir hover:text-brand-600 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-1 md:flex-none flex items-center justify-center md:justify-start">
            <Link to="/" className="flex items-center gap-2.5 group" onClick={closeMobileMenu}>
              <div className="w-9 h-9 rounded-full bg-brand-noir text-brand-gold flex items-center justify-center font-serif text-lg font-bold shadow-sm group-hover:scale-105 transition-transform">
                L
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-wider text-brand-noir group-hover:text-brand-700 transition-colors">
                  LUMA SCENTS
                </span>
                <span className="text-[10px] tracking-[0.25em] uppercase text-stone-500 font-sans -mt-1">
                  Haute Parfumerie
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => {
                  if (link.path === '/offers') handleOfferNavClick('navbar_menu');
                }}
                className={({ isActive }) =>
                  `text-sm font-medium tracking-wider uppercase transition-colors relative py-1 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-brand-900 font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-brand-500'
                      : 'text-stone-600 hover:text-brand-900 hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-brand-300'
                  }`
                }
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm animate-pulse">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              id="navbar-cart-link"
              className="relative p-2.5 rounded-full hover:bg-brand-stone/60 transition-all text-brand-noir flex items-center"
              aria-label={`Shopping cart with ${totals.itemCount} items`}
            >
              <ShoppingBag className="w-6 h-6 stroke-[1.75]" />
              {totals.itemCount > 0 && (
                <span
                  id="navbar-cart-count"
                  className="absolute -top-1 -right-1 bg-brand-noir text-brand-gold-light text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-sand animate-scale-in"
                >
                  {totals.itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-sand border-b border-brand-stone px-4 pt-3 pb-6 space-y-3 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => {
                closeMobileMenu();
                if (link.path === '/offers') handleOfferNavClick('navbar_mobile_menu');
              }}
              className={`flex items-center justify-between px-3 py-2.5 rounded-md text-base font-medium tracking-wider uppercase ${
                location.pathname === link.path
                  ? 'bg-brand-stone text-brand-900 font-semibold'
                  : 'text-stone-700 hover:bg-brand-stone/40'
              }`}
            >
              <span>{link.name}</span>
              {link.badge && (
                <span className="bg-amber-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
          <Link
            to="/cart"
            onClick={closeMobileMenu}
            className="flex items-center justify-between px-3 py-2.5 rounded-md text-base font-medium text-stone-700 hover:bg-brand-stone/40"
          >
            <span className="tracking-wider uppercase">Shopping Cart</span>
            <span className="bg-brand-noir text-brand-gold-light text-xs px-2.5 py-0.5 rounded-full font-bold">
              {totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'}
            </span>
          </Link>
        </div>
      )}
    </header>
  );
};
