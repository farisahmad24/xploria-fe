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
    iconBg: string;
    accent: string;
  }
> = {
  tickets: {
    gradient: 'bg-gradient-to-br from-[#8FD3FA] via-[#A9DFFB] to-[#C6EEFF]',
    iconBg: '#1B7FC4',
    accent: '#1B6FA8',
  },
  validated: {
    gradient: 'bg-gradient-to-br from-[#7EE3A4] via-[#B4EFA0] to-[#D8F79E]',
    iconBg: '#12956A',
    accent: '#11805A',
  },
  visitors: {
    gradient: 'bg-gradient-to-br from-[#FFA66E] via-[#FFC283] to-[#FFE49C]',
    iconBg: '#E0701E',
    accent: '#B45309',
  },
  revenue: {
    gradient: 'bg-gradient-to-br from-[#C49CF2] via-[#DDA6EE] to-[#F6C6EC]',
    iconBg: '#7C4DC2',
    accent: '#6B3FB0',
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

function Sparkline({ points, color }: { points: number[]; color: string }) {
  const width = 80;
  const height = 28;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-7 w-20 overflow-visible" aria-hidden="true">
      <path
        d={buildSparkPath(points, width, height)}
        fill="none"
        stroke={color}
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
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
          style={{ backgroundColor: theme.iconBg }}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-slate-700">{item.label}</p>
          <p className="mt-1 truncate text-xl font-bold text-slate-900 sm:text-2xl">{item.value}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-semibold"
          style={{ color: theme.accent }}
        >
          <TrendingUp className="h-3 w-3" />
          {item.change}
        </span>
        <span className="opacity-90 transition-opacity group-hover:opacity-100">
          <Sparkline points={item.spark} color="#FFFFFF" />
        </span>
      </div>
    </article>
  );
}
