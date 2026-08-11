import React from 'react';
import {
  DollarSign,
  Activity,
  Calculator as MathIcon,
  Grid,
  Sparkles,
  TrendingUp,
  X,
  Zap,
  Flame,
} from 'lucide-react';
import { CATEGORIES, ALL_CALCULATORS } from '../lib/calculators-data';
import { Link } from '../lib/router';

interface SidebarProps {
  currentCategory: string;
  onSelectCategory?: (categoryId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onSelectCalculator?: (calcId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentCategory,
  onSelectCategory,
  isOpen,
  onClose,
  onSelectCalculator,
}) => {
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'finance':
        return <DollarSign className="h-4 w-4 text-emerald-400" />;
      case 'fitness-health':
        return <Activity className="h-4 w-4 text-rose-400" />;
      case 'math':
        return <MathIcon className="h-4 w-4 text-blue-400" />;
      case 'other':
        return <Grid className="h-4 w-4 text-amber-400" />;
      case 'ai-suite':
        return <Zap className="h-4 w-4 text-orange-400" />;
      default:
        return <Grid className="h-4 w-4 text-slate-400" />;
    }
  };

  const quickPicks = [
    { id: 'mortgage-calculator', title: 'Mortgage Calculator', cat: 'Finance' },
    { id: 'loan-calculator', title: 'Loan Calculator', cat: 'Finance' },
    { id: 'income-tax-calculator', title: 'Income Tax', cat: 'Finance' },
    { id: 'compound-interest-calculator', title: 'Compound Interest', cat: 'Finance' },
    { id: 'bmi-calculator', title: 'BMI Calculator', cat: 'Health' },
    { id: 'scientific-calculator', title: 'Scientific Calculator', cat: 'Math' },
    { id: 'ai-financial-health-check', title: 'AI Financial Health', cat: 'AI Suite' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between border-r border-slate-800 bg-slate-950 text-slate-400 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col overflow-y-auto px-4 py-5">
          {/* Logo in mobile sidebar / Header branding */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
            <Link href="/" onClick={onClose} className="flex items-center space-x-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <Flame className="h-5 w-5 fill-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <span className="text-white font-bold tracking-tight">Flames</span>
                  <span className="text-slate-300 font-medium">Calculator</span>
                </div>
                <div className="bg-orange-500/20 text-orange-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-block border border-orange-500/30">
                  AI
                </div>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Directory Categories Header */}
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-2 mb-2">
            Categories
          </div>

          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => {
                onSelectCategory?.('all');
                onClose();
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                currentCategory === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Grid className="h-4 w-4 text-slate-300" />
                <span>All Categories</span>
              </div>
              <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[11px] text-slate-400">
                {ALL_CALCULATORS.length}
              </span>
            </Link>

            {CATEGORIES.map((cat) => {
              const isSelected = currentCategory === cat.id;
              const catHref = cat.id === 'ai-suite' ? '/ai-suite/' : `/category/${cat.id}/`;
              return (
                <Link
                  key={cat.id}
                  href={catHref}
                  onClick={() => {
                    onSelectCategory?.(cat.id);
                    onClose();
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isSelected
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {getCategoryIcon(cat.id)}
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${
                      cat.id === 'ai-suite'
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {cat.count}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Trending Calculators */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between px-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
              <span>Trending Tools</span>
              <TrendingUp className="h-3.5 w-3.5 text-orange-500" />
            </div>
            <div className="space-y-1">
              {quickPicks.map((pick) => (
                <Link
                  key={pick.id}
                  href={`/calculators/${pick.id}/`}
                  onClick={() => {
                    onSelectCalculator?.(pick.id);
                    onClose();
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition"
                >
                  <span className="truncate">{pick.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{pick.cat}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Footer Calculation Usage Limit Card */}
        <div className="p-4 mt-auto border-t border-slate-800">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex justify-between text-[11px] mb-2 font-bold">
              <span className="text-slate-400 uppercase tracking-wider">Calculations</span>
              <span className="text-white">82%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-orange-600 w-[82%]" />
            </div>
            <div className="text-[10px] text-slate-400 mt-2 font-medium">
              2,460 / 3,000 monthly limit
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

