import { Calculator, Category } from '../types';
import { CATEGORIES } from './data/categories';
import { FINANCE_CALCULATORS } from './data/finance-calcs';
import { HEALTH_CALCULATORS } from './data/health-calcs';
import { MATH_CALCULATORS } from './data/math-calcs';
import { OTHER_CALCULATORS } from './data/other-calcs';
import { AI_CALCULATORS } from './data/ai-calcs';

export { CATEGORIES };

export const ALL_CALCULATORS: Calculator[] = [
  ...FINANCE_CALCULATORS,
  ...HEALTH_CALCULATORS,
  ...MATH_CALCULATORS,
  ...OTHER_CALCULATORS,
  ...AI_CALCULATORS,
];

// Quick index lookup
export const CALCULATOR_MAP: Record<string, Calculator> = ALL_CALCULATORS.reduce(
  (acc, calc) => {
    acc[calc.id] = calc;
    return acc;
  },
  {} as Record<string, Calculator>
);

export function getCalculatorById(id: string): Calculator | undefined {
  return CALCULATOR_MAP[id];
}

export function getCalculatorsByCategory(categoryId: string): Calculator[] {
  if (categoryId === 'all') return ALL_CALCULATORS;
  return ALL_CALCULATORS.filter((c) => c.category === categoryId);
}

export function searchCalculators(query: string): Calculator[] {
  if (!query || !query.trim()) return ALL_CALCULATORS;
  const q = query.toLowerCase().trim();
  return ALL_CALCULATORS.filter(
    (calc) =>
      calc.title.toLowerCase().includes(q) ||
      calc.description.toLowerCase().includes(q) ||
      calc.categoryName.toLowerCase().includes(q) ||
      calc.id.toLowerCase().includes(q) ||
      (calc.badge && calc.badge.toLowerCase().includes(q))
  );
}

export function getCategoryById(categoryId: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === categoryId);
}

export function getTotalCalculatorsCount(): number {
  return ALL_CALCULATORS.length;
}

export function getFeaturedCalculators(limit = 8): Calculator[] {
  const featured = ALL_CALCULATORS.filter(
    (c) => c.badge === 'HOT' || c.badge === 'POPULAR' || c.badge === 'PRO' || c.id === 'flames-calculator'
  );
  if (featured.length >= limit) return featured.slice(0, limit);
  return ALL_CALCULATORS.slice(0, limit);
}

export function getRelatedCalculators(calcOrId: Calculator | string, limit = 6): Calculator[] {
  const currentCalc = typeof calcOrId === 'string' ? getCalculatorById(calcOrId) : calcOrId;
  if (!currentCalc) return ALL_CALCULATORS.slice(0, limit);

  // First prefer calculators from same category, excluding current
  const sameCategory = ALL_CALCULATORS.filter(
    (c) => c.id !== currentCalc.id && c.category === currentCalc.category
  );
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }
  // Fill with other calculators if needed
  const others = ALL_CALCULATORS.filter(
    (c) => c.id !== currentCalc.id && c.category !== currentCalc.category
  );
  return [...sameCategory, ...others].slice(0, limit);
}
