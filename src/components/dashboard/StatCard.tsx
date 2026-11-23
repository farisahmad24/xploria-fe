import { CheckCircle2, Users, Wallet, TrendingUp, type LucideIcon } from 'lucide-react';
import SlantedTicket from '@/components/common/SlantedTicket';
import type { StatItem } from '@/data/dashboardData';
import { buildSmoothPath } from '@/lib/chartPath';

const iconById: Record<StatItem['id'], LucideIcon | typeof SlantedTicket> = {
  tickets: SlantedTicket,
  validated: CheckCircle2,
  visitors: Users,
  revenue: Wallet,
};

const cardTheme: Record<
  StatItem['id'],
  {
    gradient: string;
    badgeText: string;
  }
> = {
  tickets: {
    gradient: 'bg-gradient-to-br from-[#0F3D91] to-[#286EF2]',
    badgeText: 'text-[#1D5AD6]',
  },
  validated: {
    gradient: 'bg-gradient-to-br from-[#064E3B] to-[#10B981]',
    badgeText: 'text-[#059669]',
  },
  visitors: {
    gradient: 'bg-gradient-to-br from-[#312E81] to-[#4F46E5]',
    badgeText: 'text-[#4338CA]',
  },
  revenue: {
    gradient: 'bg-gradient-to-br from-[#9A3412] to-[#F59E0B]',
    badgeText: 'text-[#B45309]',
  },
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
        stroke="#FFFFFF"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function StatCard({ item, delay }: { item: StatItem; delay: number }) {
  const Icon = iconById[item.id];
  const theme = cardTheme[item.id];

  return (
    <article
      className={`animate-fade-in-up group rounded-2xl p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${theme.gradient}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white/90">{item.label}</p>
          <p className="mt-1 truncate text-xl font-bold text-white sm:text-2xl">{item.value}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className={`inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold ${theme.badgeText}`}>
          <TrendingUp className="h-3 w-3" />
          {item.change}
        </span>
        <span className="text-white opacity-90 transition-opacity group-hover:opacity-100">
          <Sparkline points={item.spark} />
        </span>
      </div>
    </article>
  );
}
