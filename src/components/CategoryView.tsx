import React, { useState, useEffect } from 'react';
import { CategoryId } from '../types';
import { CATEGORIES } from '../lib/data/categories';
import { getCalculatorsByCategory, getCategoryById } from '../lib/calculators-data';
import { CalculatorCard } from './CalculatorCard';
import { Link, useRouter } from '../lib/router';
import { updateDocumentSeo } from '../lib/seo-service';
import { getCanonicalUrl } from '../lib/seo-config';
import {
  ChevronRight,
  Sparkles,
  Search,
  Grid,
  Layers,
  ArrowLeft,
  DollarSign,
  HeartPulse,
  Binary,
  Sliders,
  Zap,
} from 'lucide-react';

interface CategoryViewProps {
  categoryId: CategoryId | string;
  onSelectCalculator?: (calcId: string) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({ categoryId, onSelectCalculator }) => {
  const { navigate } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const category = getCategoryById(categoryId) || CATEGORIES[0];
  const allCategoryTools = getCalculatorsByCategory(categoryId);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'finance':
        return <DollarSign className="h-6 w-6 text-emerald-600" />;
      case 'fitness-health':
        return <HeartPulse className="h-6 w-6 text-rose-600" />;
      case 'math':
        return <Binary className="h-6 w-6 text-blue-600" />;
      case 'other':
        return <Sliders className="h-6 w-6 text-amber-600" />;
      case 'ai-suite':
        return <Zap className="h-6 w-6 text-orange-600" />;
      default:
        return <Grid className="h-6 w-6 text-slate-600" />;
    }
  };

  const filteredTools = searchQuery.trim()
    ? allCategoryTools.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allCategoryTools;

  const canonicalUrl = getCanonicalUrl(`/category/${category.id}/`);

  // Update Category SEO Metadata
  useEffect(() => {
    updateDocumentSeo({
      title: `${category.name} Calculators – Free Online Tools | Flames Calculator`,
      description: `Use free online ${category.name.toLowerCase()} calculators. Browse ${allCategoryTools.length} calculation tools with instant results, formulas, and step-by-step guidance on Flames Calculator.`,
      canonicalUrl,
      schemaJson: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'CollectionPage',
            '@id': `${canonicalUrl}#webpage`,
            name: `${category.name} — Flames Calculator`,
            url: canonicalUrl,
            description: category.description,
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: getCanonicalUrl('/'),
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: category.name,
                  item: canonicalUrl,
                },
              ],
            },
          },
        ],
      },
    });
  }, [category.id, category.name, category.description, allCategoryTools.length, canonicalUrl]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-16">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-medium text-slate-500">
        <Link href="/" className="hover:text-orange-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-slate-900 font-bold">{category.name}</span>
      </nav>

      {/* Category Header Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
              {getCategoryIcon(category.id)}
              <span>{allCategoryTools.length} Calculators Available</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
              {category.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
              {category.description}
            </p>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition self-start md:self-auto shrink-0 shadow-2xs"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>All Categories</span>
          </Link>
        </div>

        {/* Category Filter Switcher Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
          <Link
            href="/"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white hover:text-slate-900 transition"
          >
            All (217)
          </Link>
          {CATEGORIES.map((cat) => {
            const isActive = cat.id === category.id;
            return (
              <Link
                key={cat.id}
                href={cat.id === 'ai-suite' ? '/ai-suite/' : `/category/${cat.id}/`}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                {cat.name} ({cat.count})
              </Link>
            );
          })}
        </div>
      </div>

      {/* Search & Grid Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Filter ${category.name.toLowerCase()}...`}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 shadow-2xs"
          />
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{filteredTools.length}</span> of {allCategoryTools.length} tools
        </span>
      </div>

      {/* Grid of Calculator Cards */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTools.map((calc) => (
            <CalculatorCard
              key={calc.id}
              calculator={calc}
              onClick={() => {
                if (onSelectCalculator) {
                  onSelectCalculator(calc.id);
                } else {
                  navigate(`/calculators/${calc.id}/`);
                }
              }}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          <p className="text-sm font-semibold">No calculators matching "{searchQuery}" in {category.name}.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-3 text-xs font-bold text-orange-600 hover:underline cursor-pointer"
          >
            Clear Filter
          </button>
        </div>
      )}
    </div>
  );
};
