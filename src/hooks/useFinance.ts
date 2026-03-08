import { useState, useCallback } from 'react';
import { Transaction, Budget, Category } from '@/lib/types';
import {
  getTransactions,
  addTransaction as addTxn,
  deleteTransaction as delTxn,
  getBudgets,
  updateBudget as updateBgt,
  getMonthlyStats,
} from '@/lib/finance-store';

export function useFinance() {
  const [transactions, setTransactions] = useState<Transaction[]>(getTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(getBudgets);
  const [currentMonth] = useState(() => {
    const now = new Date();
    return { month: now.getMonth(), year: now.getFullYear() };
  });

  const stats = getMonthlyStats(currentMonth.month, currentMonth.year);

  const addTransaction = useCallback((txn: Omit<Transaction, 'id'>) => {
    const newTxn = addTxn(txn);
    setTransactions(getTransactions());
    return newTxn;
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    delTxn(id);
    setTransactions(getTransactions());
  }, []);

  const updateBudget = useCallback((category: Category, limit: number) => {
    updateBgt(category, limit);
    setBudgets(getBudgets());
  }, []);

  return {
    transactions: stats.transactions,
    allTransactions: transactions,
    budgets,
    stats,
    currentMonth,
    addTransaction,
    deleteTransaction,
    updateBudget,
  };
}
