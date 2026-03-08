import { useFinance } from '@/hooks/useFinance';
import OverviewCards from '@/components/OverviewCards';
import SpendingChart from '@/components/SpendingChart';
import BudgetProgress from '@/components/BudgetProgress';
import TransactionList from '@/components/TransactionList';
import AddTransactionForm from '@/components/AddTransactionForm';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function Index() {
  const { transactions, budgets, stats, currentMonth, addTransaction, deleteTransaction, updateBudget } = useFinance();
  const monthLabel = format(new Date(currentMonth.year, currentMonth.month), 'MMMM yyyy');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-display tracking-tight">Pocketbook</h1>
            <p className="text-muted-foreground mt-1">{monthLabel}</p>
          </div>
          <AddTransactionForm onAdd={addTransaction} />
        </motion.div>

        {/* Overview */}
        <OverviewCards income={stats.income} expenses={stats.expenses} balance={stats.balance} />

        {/* Charts & Budget */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <SpendingChart byCategory={stats.byCategory} />
          <BudgetProgress budgets={budgets} byCategory={stats.byCategory} onUpdateBudget={updateBudget} />
        </div>

        {/* Transactions */}
        <div className="mt-4">
          <TransactionList transactions={transactions} onDelete={deleteTransaction} />
        </div>
      </div>
    </div>
  );
}
