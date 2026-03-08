import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Category, CATEGORIES, getCategoryColor } from '@/lib/types';
import { motion } from 'framer-motion';

interface Props {
  byCategory: Record<string, number>;
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default function SpendingChart({ byCategory }: Props) {
  const data = CATEGORIES
    .map(c => ({ name: c.label, value: byCategory[c.value] || 0, key: c.value, emoji: c.emoji }))
    .filter(d => d.value > 0);

  const total = data.reduce((s, d) => s + d.value, 0);

  if (data.length === 0) {
    return (
      <div className="rounded-xl bg-card p-6 shadow-sm border border-border text-center text-muted-foreground">
        No expenses yet this month
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="rounded-xl bg-card p-6 shadow-sm border border-border"
    >
      <h2 className="text-lg font-display mb-4">Spending Breakdown</h2>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.key} fill={getCategoryColor(entry.key as Category)} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  borderRadius: '0.5rem',
                  border: '1px solid hsl(var(--border))',
                  fontSize: '0.875rem',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2 w-full">
          {data.map(d => {
            const pct = ((d.value / total) * 100).toFixed(0);
            return (
              <div key={d.key} className="flex items-center gap-3">
                <span className="text-lg">{d.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{d.name}</span>
                    <span className="text-muted-foreground">{formatCurrency(d.value)} · {pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: getCategoryColor(d.key as Category) }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
