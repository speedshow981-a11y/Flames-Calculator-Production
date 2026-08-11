import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles, Layers } from 'lucide-react';
import { ALL_CALCULATORS, searchCalculators } from '../lib/calculators-data';
import { Calculator } from '../types';
import { Link } from '../lib/router';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCalculator?: (calcId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectCalculator,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  let results = searchCalculators(query);
  if (selectedCategory !== 'all') {
    results = results.filter((c) => c.category === selectedCategory);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 p-4 pt-16 backdrop-blur-xs sm:pt-24">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden text-slate-900">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-slate-200 px-4 py-3.5 bg-white">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a calculator name, category, or formula..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="ml-3 flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="mr-2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[11px] font-mono text-slate-500 hover:bg-slate-200"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs overflow-x-auto">
          <span className="text-slate-500 mr-1 shrink-0 font-medium">Filter:</span>
          {[
            { id: 'all', label: 'All (217)' },
            { id: 'finance', label: 'Finance (82)' },
            { id: 'fitness-health', label: 'Health (31)' },
            { id: 'math', label: 'Math (44)' },
            { id: 'other', label: 'Other (55)' },
            { id: 'ai-suite', label: 'AI Suite (5)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`rounded-full px-2.5 py-1 font-medium transition shrink-0 cursor-pointer ${
                selectedCategory === tab.id
                  ? 'bg-orange-600 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {results.length > 0 ? (
            <div className="space-y-1">
              {results.slice(0, 30).map((calc) => (
                <Link
                  key={calc.id}
                  href={`/calculators/${calc.id}/`}
                  onClick={() => {
                    onSelectCalculator?.(calc.id);
                    onClose();
                  }}
                  className="group flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white shadow-2xs ${calc.color}`}
                    >
                      {calc.letter}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">
                          {calc.title}
                        </span>
                        {calc.badge && (
                          <span className="rounded bg-orange-100 border border-orange-200 px-1.5 py-0.2 text-[10px] font-bold text-orange-700">
                            {calc.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">
                        {calc.categoryName}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-slate-500">
              No calculators found matching "{query}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-2.5 text-xs text-slate-500">
          <span>
            Showing {Math.min(30, results.length)} of {results.length} tools
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-orange-600" />
            Flames Search Index
          </span>
        </div>
      </div>
    </div>
  );
};

