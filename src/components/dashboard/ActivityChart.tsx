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
    <section className="animate-fade-in-up flex h-full flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm transition-all">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-[#286EF2] ring-1 ring-blue-100">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              Ringkasan Aktivitas
            </h2>
            <p className="text-xs text-slate-500">
              Rata-rata {numberFormat.format(average)} pengunjung per hari
            </p>
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
            className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3.5 pr-8 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-slate-300 focus:border-[#286EF2] focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            {chartRanges.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
      </header>

      {/* Line Chart Area */}
      <div className="relative mt-4 flex-1">
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
              <stop offset="0%" stopColor="#286EF2" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#286EF2" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Y Ticks & Dashed Gridlines */}
          {yTicks.map((tick) => (
            <g key={tick.value}>
              <line
                x1={PLOT.left}
                x2={PLOT.right}
                y1={tick.y}
                y2={tick.y}
                stroke="#E2E8F0"
                strokeDasharray={tick.value === 0 ? undefined : '4 6'}
              />
              <text x={PLOT.left - 12} y={tick.y + 4} textAnchor="end" className="fill-slate-400 text-[11px] font-medium">
                {numberFormat.format(tick.value)}
              </text>
            </g>
          ))}

          {/* Area Fill */}
          <path d={areaPath} fill={`url(#${gradientId})`} />

          {/* Main Smooth Curved Line in #286EF2 */}
          <path
            d={linePath}
            fill="none"
            stroke="#286EF2"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={0}
            className="animate-[draw-line_1.2s_ease-out]"
          />

          {/* X Axis Labels */}
          {labels.map((label, i) => {
            const step = Math.ceil(labels.length / 10);
            if (i % step !== 0 && i !== labels.length - 1) return null;
            const x = points[i].x;
            return (
              <text key={`${label}-${i}`} x={x} y={HEIGHT - 6} textAnchor="middle" className="fill-slate-400 text-[11px] font-medium">
                {label}
              </text>
            );
          })}

          {/* Data Points / Sample Dots */}
          {showAllDots &&
            points.map((point, i) => (
              <circle
                key={`dot-${i}`}
                cx={point.x}
                cy={point.y}
                r={4}
                fill="#FFFFFF"
                stroke="#286EF2"
                strokeWidth={2.5}
              />
            ))}

          {/* Active Hover Point */}
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
              <circle cx={activePoint.x} cy={activePoint.y} r={6} fill="#286EF2" stroke="#FFFFFF" strokeWidth={3} />
            </g>
          )}
        </svg>

        {/* Hover Tooltip */}
        {activePoint && hoverIndex !== null && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-xl bg-slate-900 px-3 py-1.5 text-center text-white shadow-lg"
            style={{
              left: `${(activePoint.x / WIDTH) * 100}%`,
              top: `${(activePoint.y / HEIGHT) * 100}%`,
              marginTop: '-12px',
            }}
          >
            <p className="text-[10px] text-slate-300 font-medium">{labels[hoverIndex]}</p>
            <p className="text-xs font-bold">{numberFormat.format(values[hoverIndex])} Pengunjung</p>
          </div>
        )}
      </div>
    </section>
  );
}
