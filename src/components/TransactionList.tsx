import { Transaction, CATEGORIES } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default function TransactionList({ transactions, onDelete }: Props) {
  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="rounded-xl bg-card p-6 shadow-sm border border-border"
    >
      <h2 className="text-lg font-display mb-4">Recent Transactions</h2>
      {sorted.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No transactions yet</p>
      ) : (
        <div className="space-y-1">
          <AnimatePresence>
            {sorted.map(txn => {
              const catInfo = txn.type === 'income'
                ? { emoji: '💰', label: 'Income' }
                : CATEGORIES.find(c => c.value === txn.category) || { emoji: '❓', label: txn.category };

              return (
                <motion.div
                  key={txn.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <span className="text-lg">{catInfo.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{txn.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {catInfo.label} · {format(new Date(txn.date), 'MMM d')}
                    </p>
                  </div>
                  <span className={`text-sm font-semibold tabular-nums ${
                    txn.type === 'income' ? 'text-success' : 'text-foreground'
                  }`}>
                    {txn.type === 'income' ? '+' : '−'}{formatCurrency(txn.amount)}
                  </span>
                  <button
                    onClick={() => onDelete(txn.id)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
