export type CategoryId = 'finance' | 'fitness-health' | 'math' | 'other' | 'ai-suite';

export type ToolBadge = 'POPULAR' | 'HOT' | 'NEW' | 'PRO' | 'AI';

export interface Category {
  id: CategoryId;
  name: string;
  count: number;
  description: string;
  iconName: string;
}

export type CalculatorCategory = Category;

export interface InputOption {
  label: string;
  value: string | number;
}

export interface CalculatorInputField {
  name: string;
  label: string;
  unit?: string;
  type: 'number' | 'text' | 'date' | 'select';
  defaultValue?: string | number;
  options?: InputOption[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  helpText?: string;
}

export interface Calculator {
  id: string; // slug, e.g. "mortgage-calculator"
  title: string;
  category: CategoryId;
  categoryName: string;
  description: string; // one-line, shown on card
  letter: string; // single badge letter
  color: string; // tailwind bg color class, e.g. 'bg-blue-600'
  badge?: ToolBadge;
  isAiPowered?: boolean;
  inputFields: CalculatorInputField[];
  formulaSummary: string;
  primaryResultKey?: string;
  unit?: string;
  tags?: string[];
}

export interface MetricItem {
  label: string;
  value: string | number;
  unit?: string;
  note?: string;
  badge?: string;
  change?: string;
  description?: string;
}

export interface ChartDataPoint {
  label: string;
  [key: string]: string | number;
}

export interface CalculationResult {
  primaryValue: string;
  primaryLabel: string;
  summary?: string;
  metrics: MetricItem[];
  chartData?: ChartDataPoint[];
  steps?: string[];
  schedule?: Array<Record<string, string | number>>;
}

export interface SavedCalculation {
  id: string;
  calculatorId: string;
  calculatorTitle: string;
  category: CategoryId;
  date: string;
  inputs: Record<string, any>;
  result: CalculationResult;
  notes?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  joinedDate?: string;
}
