export type Category = 'housing' | 'food' | 'transport' | 'entertainment' | 'utilities';
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  category: Category | 'income';
  type: TransactionType;
  description: string;
  date: string; // ISO string
}

export interface Budget {
  category: Category;
  limit: number;
}

export const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: 'housing', label: 'Housing', emoji: '🏠' },
  { value: 'food', label: 'Food & Dining', emoji: '🍽️' },
  { value: 'transport', label: 'Transport', emoji: '🚗' },
  { value: 'entertainment', label: 'Entertainment', emoji: '🎭' },
  { value: 'utilities', label: 'Utilities', emoji: '⚡' },
];

export const CATEGORY_COLORS: Record<Category | 'income', string> = {
  housing: 'var(--chart-housing)',
  food: 'var(--chart-food)',
  transport: 'var(--chart-transport)',
  entertainment: 'var(--chart-entertainment)',
  utilities: 'var(--chart-utilities)',
  income: 'var(--chart-income)',
};

export function getCategoryColor(cat: Category | 'income'): string {
  return `hsl(${CATEGORY_COLORS[cat]})`;
}

export function getCategoryInfo(cat: Category) {
  return CATEGORIES.find(c => c.value === cat)!;
}
