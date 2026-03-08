import { Budget, Category, CATEGORIES, getCategoryColor } from '@/lib/types';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Pencil, Check } from 'lucide-react';

interface Props {
  budgets: Budget[];
  byCategory: Record<string, number>;
  onUpdateBudget: (category: Category, limit: number) => void;
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function BudgetProgress({ budgets, byCategory, onUpdateBudget }: Props) {
  const [editing, setEditing] = useState<Category | null>(null);
  const [editValue, setEditValue] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="rounded-xl bg-card p-6 shadow-sm border border-border"
    >
      <h2 className="text-lg font-display mb-4">Budget Limits</h2>
      <div className="space-y-4">
        {CATEGORIES.map(cat => {
          const budget = budgets.find(b => b.category === cat.value);
          const limit = budget?.limit || 0;
          const spent = byCategory[cat.value] || 0;
          const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
          const over = spent > limit && limit > 0;

          return (
            <div key={cat.value}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="flex items-center gap-2">
                  <span>{cat.emoji}</span>
                  <span className="font-medium">{cat.label}</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className={over ? 'text-destructive font-semibold' : 'text-muted-foreground'}>
                    {formatCurrency(spent)}
                  </span>
                  <span className="text-muted-foreground">/</span>
                  {editing === cat.value ? (
                    <form
                      className="flex items-center gap-1"
                      onSubmit={e => {
                        e.preventDefault();
                        const v = parseFloat(editValue);
                        if (!isNaN(v) && v > 0) onUpdateBudget(cat.value, v);
                        setEditing(null);
                      }}
                    >
                      <Input
                        type="number"
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        className="h-6 w-20 text-xs"
                        autoFocus
                      />
                      <button type="submit" className="text-success hover:opacity-80">
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  ) : (
                    <button
                      className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => { setEditing(cat.value); setEditValue(String(limit)); }}
                    >
                      <span>{formatCurrency(limit)}</span>
                      <Pencil className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="h-full rounded-full transition-colors"
                  style={{
                    backgroundColor: over ? 'hsl(var(--destructive))' : getCategoryColor(cat.value),
                  }}
                />
              </div>
              {over && (
                <p className="text-xs text-destructive mt-1">
                  Over budget by {formatCurrency(spent - limit)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
