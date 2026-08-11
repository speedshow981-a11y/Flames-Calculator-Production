import React from 'react';
import { Calculator } from '../types';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Link } from '../lib/router';

interface CalculatorCardProps {
  calculator: Calculator;
  onClick?: () => void;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({ calculator, onClick }) => {
  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case 'HOT':
        return 'bg-rose-100 text-rose-600 border-rose-200';
      case 'POPULAR':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'PRO':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'NEW':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'AI':
        return 'bg-purple-100 text-purple-700 border-purple-200 shadow-2xs';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <Link
      href={`/calculators/${calculator.id}/`}
      onClick={onClick}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md text-left no-underline block"
    >
      <div>
        {/* Top row: Colored Letter Badge + Optional Tag Badge */}
        <div className="flex items-center justify-between">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold text-white shadow-xs ${calculator.color}`}
          >
            <span className="text-base font-extrabold">{calculator.letter}</span>
          </div>

          {calculator.badge && (
            <span
              className={`flex items-center gap-1 rounded border px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${getBadgeStyle(
                calculator.badge
              )}`}
            >
              {calculator.badge === 'AI' && <Sparkles className="h-2.5 w-2.5" />}
              {calculator.badge}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mt-3.5 text-base font-bold tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
          {calculator.title}
        </h3>

        {/* Description */}
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
          {calculator.description}
        </p>
      </div>

      {/* Card Footer: Category Label + Open Arrow */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-400">
        <span className="font-medium truncate">{calculator.categoryName}</span>
        <div className="flex items-center gap-1 font-semibold text-slate-400 group-hover:text-orange-600 transition-colors">
          <span>Launch</span>
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
};


