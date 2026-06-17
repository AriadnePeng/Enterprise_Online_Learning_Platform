import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  hint: string;
  icon: LucideIcon;
  tone?: 'blue' | 'emerald' | 'amber' | 'rose' | 'violet';
}

const tones = {
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600',
  violet: 'bg-violet-50 text-violet-600',
};

export function MetricCard({ label, value, hint, icon: Icon, tone = 'blue' }: MetricCardProps) {
  return (
    <div className="db-stat-card flex items-start justify-between gap-4 p-5">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        <p className="mt-1 text-xs text-slate-400">{hint}</p>
      </div>
      <div className={`rounded-xl p-3 ${tones[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}

