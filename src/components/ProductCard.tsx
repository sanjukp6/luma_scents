import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../utils/formatters';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onNotification?: (message: string, type: 'success' | 'error') => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNotification }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock <= 0) {
      if (onNotification) onNotification('Product is currently out of stock', 'error');
      return;
    }

    setIsAdding(true);
    const result = addToCart(product, 1);
    
    if (result.success) {
      setJustAdded(true);
      if (onNotification) onNotification(result.message, 'success');
      setTimeout(() => setJustAdded(false), 1800);
    } else {
      if (onNotification) onNotification(result.message, 'error');
    }
    
    setIsAdding(false);
  };

  const isLowStock = product.stock > 0 && product.stock <= 10;

  return (
    <div className="group bg-white rounded-xl border border-brand-stone/80 overflow-hidden shadow-subtle hover:shadow-elevated hover:border-brand-300 transition-all duration-300 flex flex-col">
      {/* Product Image Container */}
      <Link
        to={`/products/${product.id}`}
        className="relative block aspect-[4/5] bg-stone-100 overflow-hidden"
        id={`product-card-${product.id}`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestseller && (
            <span className="bg-brand-noir text-brand-gold text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-sm">
              Bestseller
            </span>
          )}
          {isLowStock && (
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Variant tag */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-medium px-2 py-0.5 rounded shadow-sm">
          {product.variant}
        </div>

        {/* Quick Add Overlay on Desktop hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center">
          <button
            type="button"
            id={`quick-add-${product.id}`}
            onClick={handleQuickAdd}
            disabled={isAdding || product.stock <= 0}
            className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
              justAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-white text-brand-noir hover:bg-brand-gold hover:text-white'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Quick Add
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="uppercase tracking-widest font-medium">{product.category}</span>
            {product.rating && (
              <span className="flex items-center gap-1 text-stone-700 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {product.rating.toFixed(1)}
              </span>
            )}
          </div>

          <Link
            to={`/products/${product.id}`}
            className="font-serif text-lg font-semibold text-brand-noir group-hover:text-brand-700 transition-colors line-clamp-1"
          >
            {product.name}
          </Link>

          <p className="text-stone-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 uppercase tracking-wider block font-sans">Price</span>
            <span className="text-lg font-bold text-brand-noir font-sans">
              {formatCurrency(product.price)}
            </span>
          </div>

          {/* Mobile direct Add button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isAdding || product.stock <= 0}
            className="sm:hidden p-2.5 rounded-lg bg-brand-noir text-brand-gold hover:bg-brand-800 transition-colors"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>

          <Link
            to={`/products/${product.id}`}
            className="hidden sm:inline-block text-xs font-semibold text-brand-700 hover:text-brand-900 tracking-wider uppercase underline underline-offset-4 decoration-brand-300 hover:decoration-brand-700"
          >
            View Notes →
          </Link>
        </div>
      </div>
    </div>
  );
};
