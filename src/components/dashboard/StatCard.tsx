import { CheckCircle2, Ticket, Users, Wallet, TrendingUp, type LucideIcon } from 'lucide-react';
import type { StatItem } from '@/data/dashboardData';
import { buildSmoothPath } from '@/lib/chartPath';

const iconById: Record<StatItem['id'], LucideIcon> = {
  tickets: Ticket,
  validated: CheckCircle2,
  visitors: Users,
  revenue: Wallet,
};

function buildSparkPath(points: number[], width: number, height: number) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const step = width / (points.length - 1);
  return buildSmoothPath(
    points.map((value, i) => ({
      x: i * step,
      y: height - ((value - min) / range) * height,
    }))
  );
}


function Sparkline({ points }: { points: number[] }) {
  const width = 80;
  const height = 28;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-7 w-20 overflow-visible" aria-hidden="true">
      <path
        d={buildSparkPath(points, width, height)}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        className="text-ocean-500"
      />
    </svg>
  );
}

export default function StatCard({ item, delay }: { item: StatItem; delay: number }) {
  const Icon = iconById[item.id];
  return (
    <article
      className="animate-fade-in-up group rounded-2xl border border-ocean-100 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-ocean-200 hover:shadow-xl"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ocean-50 text-ocean-600 transition-colors group-hover:bg-ocean-600 group-hover:text-white">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-500">{item.label}</p>
          <p className="mt-1 truncate text-xl font-bold text-ocean-900 sm:text-2xl">{item.value}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
          <TrendingUp className="h-3 w-3" />
          {item.change}
        </span>
        <span className="text-ocean-400 transition-colors group-hover:text-ocean-600">
          <Sparkline points={item.spark} />
        </span>
      </div>
    </article>
  );
}
