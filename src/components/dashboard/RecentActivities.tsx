import { useMemo, useState } from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import type { ActivityItem } from '@/data/dashboardData';

const PREVIEW_COUNT = 3;

const toneClass: Record<ActivityItem['tone'], string> = {
  blue: 'bg-ocean-500 ring-ocean-100',
  emerald: 'bg-emerald-500 ring-emerald-100',
  amber: 'bg-amber-500 ring-amber-100',
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
    <section className="animate-fade-in-up flex flex-col rounded-3xl border border-ocean-100 bg-white p-5 shadow-card sm:p-6">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ocean-50 text-ocean-600">
            <Clock className="h-[18px] w-[18px]" />
          </div>
          <h2 className="text-base font-bold text-ocean-900">Aktivitas Terbaru</h2>
        </div>
        {canExpand && (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-ocean-600 transition hover:bg-ocean-50 hover:text-ocean-800"
          >
            {expanded ? 'Tutup' : 'Lihat Semua'}
            <ChevronRight className={`h-4 w-4 transition-transform ${expanded ? '-rotate-90' : ''}`} />
          </button>
        )}
      </header>

      {visible.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-500">Tidak ada aktivitas yang cocok dengan pencarian.</p>
      ) : (
        <ol className="mt-5 space-y-1">
          {visible.map((item, index) => (
            <li
              key={item.id}
              className="animate-fade-in-up relative flex items-start gap-4 rounded-xl px-3 py-3 transition-colors hover:bg-ocean-50/60"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="relative flex w-3 shrink-0 justify-center pt-1.5">
                <span className={`h-3 w-3 rounded-full ring-4 ${toneClass[item.tone]}`} />
                {index < visible.length - 1 && (
                  <span className="absolute left-1/2 top-4 -bottom-5 w-px -translate-x-1/2 bg-ocean-100" />
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <p className="text-sm font-medium leading-snug text-slate-700">{item.title}</p>
                <p className="shrink-0 text-xs text-slate-400">{item.time}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
