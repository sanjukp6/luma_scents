import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-brand-stone mx-auto flex items-center justify-center text-brand-700">
        <Compass className="w-10 h-10 stroke-[1.5]" />
      </div>
      
      <span className="text-xs font-bold uppercase tracking-widest text-brand-600 block">
        Error 404
      </span>

      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-noir">
        Page Not Found
      </h1>

      <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
        The fragrance notes you are seeking seem to have dissipated into thin air. Let us guide you back to our atelier.
      </p>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-noir text-brand-gold-light hover:bg-brand-800 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Atelier
        </Link>
        <Link
          to="/products"
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 rounded-lg text-xs font-bold uppercase tracking-wider"
        >
          Browse All Fragrances
        </Link>
      </div>
    </div>
  );
};
