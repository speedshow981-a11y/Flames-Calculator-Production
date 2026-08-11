import { CalculatorCategory } from '../../types';

export const CATEGORIES: CalculatorCategory[] = [
  {
    id: 'finance',
    name: 'Finance Calculators',
    count: 82,
    description: 'Comprehensive financial, mortgage, loan, tax, retirement, and investment calculation engines.',
    iconName: 'Landmark',
  },
  {
    id: 'fitness-health',
    name: 'Fitness & Health Calculators',
    count: 31,
    description: 'Body composition, calorie tracking, metabolic rates, nutrition, and cardiovascular metrics.',
    iconName: 'HeartPulse',
  },
  {
    id: 'math',
    name: 'Math Calculators',
    count: 44,
    description: 'Algebraic, geometric, statistical, trigonometric, matrix, and arithmetic computation tools.',
    iconName: 'Binary',
  },
  {
    id: 'other',
    name: 'Other Calculators',
    count: 55,
    description: 'Time, engineering, physics, date, conversion, construction, and lifestyle utilities.',
    iconName: 'Sliders',
  },
  {
    id: 'ai-suite',
    name: 'AI Calculator Suite',
    count: 5,
    description: 'Intelligent multi-factor goal planning, result synthesis, scenario comparisons, and health audits.',
    iconName: 'Sparkles',
  },
];
