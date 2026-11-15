import { useMemo, useState } from 'react';
import { ChevronRight, Clock, Sparkles } from 'lucide-react';
import type { ActivityItem } from '@/data/dashboardData';

const PREVIEW_COUNT = 5;

const toneClass: Record<ActivityItem['tone'], { dot: string; bg: string }> = {
  blue: { dot: 'bg-ocean-500 ring-ocean-100', bg: 'bg-ocean-50/50 hover:bg-ocean-50' },
  emerald: { dot: 'bg-emerald-500 ring-emerald-100', bg: 'bg-emerald-50/40 hover:bg-emerald-50' },
  amber: { dot: 'bg-amber-500 ring-amber-100', bg: 'bg-amber-50/40 hover:bg-amber-50' },
};

type RecentActivitiesProps = {
  items: ActivityItem[];
  query: string;
};

export default function RecentActivities({ items, query }: RecentActivitiesProps) {
  const [expanded, setExpanded] = useState(false);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) => item.title.toLowerCase().includes(term));
  }, [items, query]);

  const visible = expanded ? filtered : filtered.slice(0, PREVIEW_COUNT);
  const canExpand = filtered.length > PREVIEW_COUNT;

  return (
    <section className="animate-fade-in-up w-full rounded-3xl border border-ocean-100 bg-white p-6 shadow-card transition-all">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-ocean-50/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ocean-50 text-ocean-600 ring-1 ring-ocean-100/80">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ocean-950 sm:text-lg">Aktivitas Terbaru</h2>
            <p className="text-xs text-slate-400">
              Pantau arus transaksi tiket, validasi pengunjung, dan riwayat operasional real-time
            </p>
          </div>
        </div>

        {canExpand && (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-ocean-100 bg-ocean-50/70 px-3 py-1.5 text-xs font-bold text-ocean-700 transition hover:bg-ocean-100"
          >
            {expanded ? 'Tampilkan Lebih Sedikit' : `Lihat Semua (${filtered.length})`}
            <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${expanded ? '-rotate-90' : ''}`} />
          </button>
        )}
      </header>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
          <Sparkles className="h-8 w-8 opacity-40 mb-2" />
          <p className="text-sm font-medium">Tidak ada aktivitas yang cocok dengan pencarian.</p>
        </div>
      ) : (
        <ol className="mt-4 divide-y divide-slate-100">
          {visible.map((item, index) => {
            const toneConfig = toneClass[item.tone] || toneClass.blue;
            return (
              <li
                key={item.id}
                className={`flex items-center justify-between gap-4 py-3.5 px-3 rounded-2xl transition-colors ${toneConfig.bg}`}
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <span className="flex h-3 w-3 shrink-0 items-center justify-center">
                    <span className={`h-2.5 w-2.5 rounded-full ring-4 ${toneConfig.dot}`} />
                  </span>
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {item.title}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="inline-block rounded-lg bg-white px-2.5 py-1 text-xs font-mono font-medium text-slate-500 shadow-sm ring-1 ring-slate-100">
                    {item.time}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
