import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Sparkles, Flame, ArrowRight } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Toast } from '../components/Toast';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Sync category state when URL changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && CATEGORIES.includes(cat)) {
      setSelectedCategory(cat);
    } else if (!cat) {
      setSelectedCategory('All');
    }
  }, [searchParams]);

  // Google Tag Manager / GA4 view_item_list Event
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: 'view_item_list',
      ecommerce: {
        item_list_id: `category_${selectedCategory.toLowerCase().replace(/\s+/g, '_')}`,
        item_list_name: `${selectedCategory} Fragrance Collection`,
        items: PRODUCTS.filter((p) =>
          selectedCategory === 'All' ? true : p.category.toLowerCase() === selectedCategory.toLowerCase()
        ).map((product, index) => ({
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
  }, [selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category });
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesSearch =
        searchQuery.trim() === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.topNotes && product.topNotes.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (product.heartNotes && product.heartNotes.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (product.baseNotes && product.baseNotes.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      
      {/* New Year Sale Callout Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-brand-noir to-stone-900 text-white rounded-2xl p-5 sm:p-6 border border-amber-500/40 shadow-elevated flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-brand-gold">
              New Year Sale 2026 is Live!
            </h3>
            <p className="text-xs text-stone-300">
              Enjoy Flat 50% Off on our exclusive limited-edition celebratory flacons.
            </p>
          </div>
        </div>

        <Link
          to="/offers"
          className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:brightness-110 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-md transition-all"
        >
          <span>View 50% Offers</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-stone text-xs font-semibold uppercase tracking-widest text-brand-800">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>The Atelier Archive</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-noir">
          Artisanal Fragrance Collection
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Explore our handcrafted perfumes, woody elixirs, and concentrated botanical oils formulated with rare natural absolutes.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-brand-stone shadow-subtle space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="product-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scents, notes (e.g. Vanilla)..."
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
            />
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2 text-stone-500 text-xs font-medium uppercase tracking-wider">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Sort By:</span>
            </div>
            <select
              id="product-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 font-medium"
            >
              <option value="featured">Featured & Best Sellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-2 scrollbar-thin">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory.toLowerCase() === category.toLowerCase();
            return (
              <button
                key={category}
                id={`category-filter-${category.toLowerCase().replace(/\s+/g, '-')}`}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-brand-noir text-brand-gold shadow-sm font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Results Info */}
      <div className="flex items-center justify-between text-xs text-stone-500 uppercase tracking-widest px-1">
        <span>
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'Fragrance' : 'Fragrances'}
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-brand-700 hover:underline cursor-pointer"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onNotification={showNotification}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-brand-stone p-12 text-center space-y-4 max-w-md mx-auto">
          <p className="font-serif text-xl text-stone-700 font-semibold">No fragrances found</p>
          <p className="text-sm text-stone-500">
            We couldn't find any scents matching your search criteria. Try a different filter or search term.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-6 py-2.5 bg-brand-noir text-brand-gold text-xs font-bold uppercase tracking-wider rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      )}

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
