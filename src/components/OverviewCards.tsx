import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface Props {
  income: number;
  expenses: number;
  balance: number;
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default function OverviewCards({ income, expenses, balance }: Props) {
  const cards = [
    { label: 'Income', value: income, icon: TrendingUp, variant: 'success' as const },
    { label: 'Expenses', value: expenses, icon: TrendingDown, variant: 'destructive' as const },
    { label: 'Balance', value: balance, icon: Wallet, variant: 'primary' as const },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="rounded-xl bg-card p-5 shadow-sm border border-border"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
            <card.icon className={`h-4 w-4 ${
              card.variant === 'success' ? 'text-success' :
              card.variant === 'destructive' ? 'text-destructive' :
              'text-primary'
            }`} />
          </div>
          <p className="text-2xl font-bold font-display tracking-tight">
            {formatCurrency(card.value)}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
