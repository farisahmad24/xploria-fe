import { useId, useMemo, useState } from 'react';
import { ChevronDown, BarChart3 } from 'lucide-react';
import { chartRanges } from '@/data/dashboardData';
import { buildSmoothPath, type Point } from '@/lib/chartPath';

const WIDTH = 640;
const HEIGHT = 260;
const PLOT = { left: 56, right: 624, top: 16, bottom: 232 };
const Y_TICKS = 4;

const numberFormat = new Intl.NumberFormat('id-ID');

export default function ActivityChart() {
  const [rangeId, setRangeId] = useState(chartRanges[0].id);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const gradientId = useId();

  const range = chartRanges.find((item) => item.id === rangeId) ?? chartRanges[0];
  const { values, labels } = range;

  const { points, yTicks, average } = useMemo(() => {
    const maxValue = Math.max(...values);
    const yMax = Math.ceil(maxValue / 500) * 500;
    const plotWidth = PLOT.right - PLOT.left;
    const plotHeight = PLOT.bottom - PLOT.top;

    const pts: Point[] = values.map((value, i) => ({
      x: PLOT.left + (i * plotWidth) / (values.length - 1),
      y: PLOT.bottom - (value / yMax) * plotHeight,
    }));

    const ticks = Array.from({ length: Y_TICKS + 1 }, (_, i) => {
      const value = (yMax / Y_TICKS) * i;
      return { value, y: PLOT.bottom - (value / yMax) * plotHeight };
    });

    const avg = Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
    return { points: pts, yTicks: ticks, average: avg };
  }, [values]);

  const linePath = buildSmoothPath(points);
  const areaPath = `${linePath} L ${PLOT.right} ${PLOT.bottom} L ${PLOT.left} ${PLOT.bottom} Z`;
  const showAllDots = values.length <= 10;
  const activePoint = hoverIndex !== null ? points[hoverIndex] : null;

  const handlePointer = (clientX: number, bounds: DOMRect) => {
    const ratio = (clientX - bounds.left) / bounds.width;
    const svgX = ratio * WIDTH;
    const index = Math.round(((svgX - PLOT.left) / (PLOT.right - PLOT.left)) * (values.length - 1));
    setHoverIndex(Math.min(Math.max(index, 0), values.length - 1));
  };

  return (
    <section className="animate-fade-in-up rounded-3xl border border-ocean-100 bg-white p-5 shadow-card sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ocean-50 text-ocean-600">
            <BarChart3 className="h-[18px] w-[18px]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ocean-900">Ringkasan Aktivitas</h2>
            <p className="text-xs text-slate-500">Rata-rata {numberFormat.format(average)} pengunjung per hari</p>
          </div>
        </div>

        <div className="relative">
          <select
            value={rangeId}
            onChange={(event) => {
              setRangeId(event.target.value);
              setHoverIndex(null);
            }}
            aria-label="Pilih rentang waktu"
            className="cursor-pointer appearance-none rounded-xl border border-ocean-100 bg-white py-2 pl-4 pr-9 text-sm font-semibold text-ocean-800 shadow-sm transition hover:border-ocean-300 focus:border-ocean-400 focus:outline-none focus:ring-4 focus:ring-ocean-100"
          >
            {chartRanges.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-500" />
        </div>
      </header>

      <div className="relative mt-6">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto w-full touch-none"
          role="img"
          aria-label={`Grafik pengunjung ${range.label.toLowerCase()}`}
          onMouseMove={(event) => handlePointer(event.clientX, event.currentTarget.getBoundingClientRect())}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
            </linearGradient>
          </defs>

          {yTicks.map((tick) => (
            <g key={tick.value}>
              <line
                x1={PLOT.left}
                x2={PLOT.right}
                y1={tick.y}
                y2={tick.y}
                stroke="#DBEAFE"
                strokeDasharray={tick.value === 0 ? undefined : '4 6'}
              />
              <text x={PLOT.left - 12} y={tick.y + 4} textAnchor="end" className="fill-slate-400 text-[11px]">
                {numberFormat.format(tick.value)}
              </text>
            </g>
          ))}

          <path d={areaPath} fill={`url(#${gradientId})`} />
          <path
            d={linePath}
            fill="none"
            stroke="#2563EB"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={0}
            className="animate-[draw-line_1.2s_ease-out]"
          />

          {labels.map((label, i) => {
            const step = Math.ceil(labels.length / 10);
            if (i % step !== 0 && i !== labels.length - 1) return null;
            const x = points[i].x;
            return (
              <text key={`${label}-${i}`} x={x} y={HEIGHT - 6} textAnchor="middle" className="fill-slate-400 text-[11px]">
                {label}
              </text>
            );
          })}

          {showAllDots &&
            points.map((point, i) => (
              <circle key={`dot-${i}`} cx={point.x} cy={point.y} r={4} fill="#fff" stroke="#2563EB" strokeWidth={2} />
            ))}

          {activePoint && hoverIndex !== null && (
            <g pointerEvents="none">
              <line
                x1={activePoint.x}
                x2={activePoint.x}
                y1={PLOT.top}
                y2={PLOT.bottom}
                stroke="#93C5FD"
                strokeDasharray="3 4"
              />
              <circle cx={activePoint.x} cy={activePoint.y} r={6} fill="#2563EB" stroke="#fff" strokeWidth={3} />
            </g>
          )}
        </svg>

        {activePoint && hoverIndex !== null && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-xl bg-ocean-900 px-3 py-2 text-center text-white shadow-lg"
            style={{
              left: `${(activePoint.x / WIDTH) * 100}%`,
              top: `${(activePoint.y / HEIGHT) * 100}%`,
              marginTop: '-12px',
            }}
          >
            <p className="text-[11px] text-ocean-200">{labels[hoverIndex]}</p>
            <p className="text-sm font-bold">{numberFormat.format(values[hoverIndex])}</p>
          </div>
        )}
      </div>
    </section>
  );
}
