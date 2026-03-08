import { Transaction, Budget, Category } from './types';

const TRANSACTIONS_KEY = 'pft-transactions';
const BUDGETS_KEY = 'pft-budgets';

function generateId() {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

// Seed data
const SEED_TRANSACTIONS: Omit<Transaction, 'id'>[] = [
  { amount: 4500, category: 'income', type: 'income', description: 'Monthly salary', date: '2026-03-01' },
  { amount: 1200, category: 'housing', type: 'expense', description: 'Rent payment', date: '2026-03-01' },
  { amount: 85, category: 'utilities', type: 'expense', description: 'Electric bill', date: '2026-03-03' },
  { amount: 45, category: 'food', type: 'expense', description: 'Grocery run', date: '2026-03-04' },
  { amount: 12, category: 'entertainment', type: 'expense', description: 'Netflix', date: '2026-03-05' },
  { amount: 60, category: 'transport', type: 'expense', description: 'Gas', date: '2026-03-06' },
  { amount: 32, category: 'food', type: 'expense', description: 'Dinner out', date: '2026-03-07' },
  { amount: 500, category: 'income', type: 'income', description: 'Freelance project', date: '2026-03-07' },
  { amount: 55, category: 'utilities', type: 'expense', description: 'Internet bill', date: '2026-03-05' },
  { amount: 28, category: 'entertainment', type: 'expense', description: 'Movie tickets', date: '2026-03-08' },
];

const DEFAULT_BUDGETS: Budget[] = [
  { category: 'housing', limit: 1500 },
  { category: 'food', limit: 400 },
  { category: 'transport', limit: 200 },
  { category: 'entertainment', limit: 150 },
  { category: 'utilities', limit: 200 },
];

export function getTransactions(): Transaction[] {
  const stored = localStorage.getItem(TRANSACTIONS_KEY);
  if (stored) return JSON.parse(stored);
  const seeded = SEED_TRANSACTIONS.map(t => ({ ...t, id: generateId() }));
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(seeded));
  return seeded;
}

function saveTransactions(txns: Transaction[]) {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(txns));
}

export function addTransaction(txn: Omit<Transaction, 'id'>): Transaction {
  const transactions = getTransactions();
  const newTxn = { ...txn, id: generateId() };
  transactions.push(newTxn);
  saveTransactions(transactions);
  return newTxn;
}

export function deleteTransaction(id: string) {
  const transactions = getTransactions().filter(t => t.id !== id);
  saveTransactions(transactions);
}

export function getBudgets(): Budget[] {
  const stored = localStorage.getItem(BUDGETS_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(BUDGETS_KEY, JSON.stringify(DEFAULT_BUDGETS));
  return DEFAULT_BUDGETS;
}

export function updateBudget(category: Category, limit: number) {
  const budgets = getBudgets();
  const idx = budgets.findIndex(b => b.category === category);
  if (idx >= 0) budgets[idx].limit = limit;
  else budgets.push({ category, limit });
  localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
}

export function getMonthlyStats(month: number, year: number) {
  const transactions = getTransactions().filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const byCategory: Record<string, number> = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
  });

  return { income, expenses, balance: income - expenses, byCategory, transactions };
}
