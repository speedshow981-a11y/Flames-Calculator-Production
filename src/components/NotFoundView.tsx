import React, { useState, useEffect } from 'react';
import { Link, useRouter } from '../lib/router';
import { CATEGORIES } from '../lib/data/categories';
import { getFeaturedCalculators, searchCalculators } from '../lib/calculators-data';
import { updateDocumentSeo } from '../lib/seo-service';
import { Search, Home, ArrowLeft, HelpCircle, Compass, Grid, Sparkles } from 'lucide-react';

export const NotFoundView: React.FC = () => {
  const { navigate } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const featured = getFeaturedCalculators().slice(0, 8);
  const searchResults = searchQuery.trim() ? searchCalculators(searchQuery).slice(0, 8) : [];

  useEffect(() => {
    updateDocumentSeo({
      title: 'Page Not Found (404) — Flames Calculator',
      description: 'The requested calculation tool or page could not be found. Explore 217 free online calculators on Flames Calculator.',
      noindex: true,
    });
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && searchResults.length > 0) {
      navigate(`/calculators/${searchResults[0].id}/`);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-10 py-8 px-4 text-center">
      {/* 404 Hero */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1 text-xs font-bold text-rose-700">
          <HelpCircle className="h-4 w-4" />
          <span>Error 404 — Page Not Found</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
          Calculator Not Found
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
          The page or calculator you're looking for doesn't exist, may have moved, or the URL might be mistyped.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-lg mx-auto">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search 217 calculators (e.g. Mortgage, BMI, Flames, SIP)..."
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-24 text-sm text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 shadow-xs"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 rounded-xl bg-orange-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-orange-700 transition"
        >
          Search
        </button>
      </form>

      {/* Search Results if query entered */}
      {searchQuery.trim() && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xs max-w-lg mx-auto">
          <p className="text-xs font-bold text-slate-500 mb-2 px-2">
            Matching Calculators ({searchResults.length}):
          </p>
          {searchResults.length > 0 ? (
            <div className="space-y-1">
              {searchResults.map((calc) => (
                <Link
                  key={calc.id}
                  href={`/calculators/${calc.id}/`}
                  className="flex items-center justify-between rounded-lg p-2 hover:bg-slate-50 text-xs font-medium text-slate-900 group"
                >
                  <span>{calc.title}</span>
                  <span className="text-[10px] text-slate-400 group-hover:text-orange-600">
                    {calc.categoryName} →
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 p-2">No matching calculators found.</p>
          )}
        </div>
      )}

      {/* Explore by Category */}
      <div className="space-y-4 pt-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Browse All Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.id === 'ai-suite' ? '/ai-suite/' : `/category/${cat.id}/`}
              className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-orange-500 hover:shadow-xs transition group"
            >
              <div className="text-xs font-bold text-slate-900 group-hover:text-orange-600">
                {cat.name}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">{cat.count} Calculators</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Direct Links */}
      <div className="space-y-3 pt-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Popular Online Calculators
        </h2>
        <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
          {featured.map((calc) => (
            <Link
              key={calc.id}
              href={`/calculators/${calc.id}/`}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-orange-500 hover:text-orange-600 transition shadow-2xs"
            >
              {calc.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 flex justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition shadow-xs"
        >
          <Home className="h-4 w-4" />
          <span>Go to Homepage</span>
        </Link>
      </div>
    </div>
  );
};
