import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import SlantedTicket from '@/components/common/SlantedTicket';
import { toIsoDate } from '@/lib/bookings';
import type { mendatang } from '@/types/ticket';

const MONTH_NAMES_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

// Uppercase day names with red accent for Saturday and Sunday
const DAY_NAMES_UPPER = ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN'];

type MiniCalendarProps = {
  bookings: mendatang[];
  onNavigateToCalendar?: () => void;
};

export default function MiniCalendar({ bookings, onNavigateToCalendar }: MiniCalendarProps) {
  // Default to November 2026 to match application timeline
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // 10 = November
  const [selectedDate, setSelectedDate] = useState('2026-11-11');

  const todayIso = toIsoDate(new Date());

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Calendar Grid (Monday-first)
  const calendarDays = useMemo(() => {
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    const prevTotal = new Date(currentYear, currentMonth, 0).getDate();

    const cells: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];

    for (let i = startOffset - 1; i >= 0; i--) {
      const d = prevTotal - i;
      const prevM = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevY = currentMonth === 0 ? currentYear - 1 : currentYear;
      cells.push({
        day: d,
        dateStr: `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        isCurrentMonth: false,
      });
    }
    for (let d = 1; d <= totalDays; d++) {
      cells.push({
        day: d,
        dateStr: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        isCurrentMonth: true,
      });
    }
    // Always render 42 cells (6 rows) for completely stable frame height across all months
    const FIXED_CELLS = 42;
    const trailing = FIXED_CELLS - cells.length;
    for (let d = 1; d <= trailing; d++) {
      const nextM = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextY = currentMonth === 11 ? currentYear + 1 : currentYear;
      cells.push({
        day: d,
        dateStr: `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        isCurrentMonth: false,
      });
    }
    return cells;
  }, [currentYear, currentMonth]);

  // Map bookings by date
  const bookingsByDate = useMemo(() => {
    const map = new Map<string, mendatang[]>();
    for (const b of bookings) {
      const list = map.get(b.visitDate) || [];
      list.push(b);
      map.set(b.visitDate, list);
    }
    return map;
  }, [bookings]);

  // Selected date details
  const selectedBookings = bookingsByDate.get(selectedDate) || [];
  const selectedCount = selectedBookings.length;
  const selectedVisitors = selectedBookings.reduce(
    (sum, b) => sum + b.items.reduce((s, it) => s + it.quantity, 0),
    0
  );

  return (
    <section className="animate-fade-in-up flex h-full flex-col justify-between rounded-3xl border border-slate-200/80 bg-[#F4F7FC] p-5 sm:p-6 shadow-sm transition-all">
      {/* Header Kalender */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-200/70 pb-3.5">
          <div className="flex items-center gap-3">
            {/* Sisi kiri judul: Ikon kalender di dalam lingkaran biru solid #286EF2 */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#286EF2] text-white shadow-md shadow-blue-500/25">
              <CalendarDays className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 leading-tight">
                {MONTH_NAMES_ID[currentMonth]} {currentYear}
              </h2>
              <p className="text-[11px] font-medium text-slate-500">
                Kalender mendatang Kasir
              </p>
            </div>
          </div>

          {/* Sisi kanan: Tombol navigasi bulan berbentuk panah < dan > */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="flex h-7 w-7 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Bulan sebelumnya"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="flex h-7 w-7 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-2xs transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Bulan berikutnya"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Baris Nama Hari: SEN, SEL, RAB, KAM, JUM, SAB (merah), MIN (merah) */}
        <div className="mt-3.5 grid grid-cols-7 gap-1 text-center">
          {DAY_NAMES_UPPER.map((dayName, idx) => {
            const isWeekend = idx >= 5;
            return (
              <div
                key={dayName}
                className={`py-1 text-[10px] font-extrabold uppercase tracking-wider ${isWeekend ? 'text-rose-500' : 'text-slate-500'
                  }`}
              >
                {dayName}
              </div>
            );
          })}
        </div>

        {/* Grid Tanggal Bulanan (Circular) */}
        <div className="mt-2 grid grid-cols-7 gap-1">
          {calendarDays.map((cell) => {
            const isSelected = selectedDate === cell.dateStr;
            const isToday = cell.dateStr === todayIso;
            const dayBookings = bookingsByDate.get(cell.dateStr) || [];
            const hasBooking = dayBookings.length > 0;

            return (
              <button
                key={cell.dateStr}
                type="button"
                onClick={() => setSelectedDate(cell.dateStr)}
                title={
                  hasBooking
                    ? `${cell.dateStr}: ${dayBookings.length} mendatang (${dayBookings.reduce(
                      (s, b) => s + b.items.reduce((acc, it) => acc + it.quantity, 0),
                      0
                    )} pengunjung)`
                    : cell.dateStr
                }
                className={`group relative mx-auto flex h-9 w-9 flex-col items-center justify-center rounded-full text-xs font-semibold transition-all duration-150 ${isSelected
                    ? 'bg-[#286EF2] text-white font-black shadow-md shadow-blue-500/35 scale-105 ring-2 ring-blue-300'
                    : hasBooking
                      ? 'bg-[#286EF2]/15 text-[#286EF2] font-black ring-1.5 ring-[#286EF2] hover:bg-[#286EF2]/25'
                      : isToday
                        ? 'bg-white text-[#286EF2] font-black ring-1 ring-slate-300 hover:bg-slate-50'
                        : cell.isCurrentMonth
                          ? 'text-slate-700 hover:bg-white/80 font-medium'
                          : 'text-slate-300 hover:bg-white/40 font-normal'
                  }`}
              >
                <span className="leading-none">{cell.day}</span>

                {/* Titik Penanda (Blue Event Dot) persis di bawah angka tanggal */}
                {hasBooking && (
                  <span
                    className={`mt-0.5 h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-white ring-1 ring-[#286EF2]' : 'bg-[#286EF2] animate-pulse'
                      }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Info Bar: Kontainer putih melengkung berisi teks tanggal terpilih & badge mendatang */}
      <div
        role={onNavigateToCalendar ? 'button' : undefined}
        tabIndex={onNavigateToCalendar ? 0 : undefined}
        onClick={onNavigateToCalendar}
        onKeyDown={onNavigateToCalendar ? (e) => e.key === 'Enter' && onNavigateToCalendar() : undefined}
        className={`mt-4 flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-3.5 py-2.5 text-xs shadow-2xs ${
          onNavigateToCalendar ? 'cursor-pointer hover:bg-blue-50 hover:border-[#286EF2]/30 transition-colors' : ''
        }`}
      >
        <div className="flex items-center gap-2">
          <SlantedTicket className="h-3.5 w-3.5 text-[#286EF2] shrink-0" />
          <span className="font-semibold text-slate-700 truncate">
            {new Intl.DateTimeFormat('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }).format(new Date(`${selectedDate}T00:00:00`))}
          </span>
        </div>

        {selectedCount > 0 ? (
          <span className="rounded-full bg-[#286EF2] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-2xs">
            {selectedCount} mendatang ({selectedVisitors} Org)
          </span>
        ) : (
          <span className="text-[10px] font-medium text-slate-400">Tidak ada mendatang</span>
        )}
      </div>
    </section>
  );
}
