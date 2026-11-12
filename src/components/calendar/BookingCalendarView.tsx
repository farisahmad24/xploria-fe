import { useMemo, useState } from 'react';
import {
  Calendar,
  CalendarCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Ticket,
  User,
  Users,
} from 'lucide-react';
import { formatNumber, formatRupiah, toIsoDate } from '@/lib/bookings';
import type { Booking } from '@/types/ticket';

const MONTH_NAMES_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const DAY_NAMES_ID = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

type BookingCalendarViewProps = {
  bookings: Booking[];
};

export default function BookingCalendarView({ bookings }: BookingCalendarViewProps) {
  // Default to November 2026 to match application timeline
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // 0-indexed: 10 = November
  const [selectedDate, setSelectedDate] = useState('2026-11-11');

  const todayIso = toIsoDate(new Date());

  // Navigation handlers
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

  const handleGoToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDate(todayIso);
  };

  // Calendar Grid Calculation (Monday as first day of week)
  const calendarDays = useMemo(() => {
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    // Monday index = 0, Sunday = 6
    const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    // Previous month days to pad
    const prevMonthDaysCount = new Date(currentYear, currentMonth, 0).getDate();
    const leadingDays: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = prevMonthDaysCount - i;
      const prevM = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevY = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      leadingDays.push({ day: d, dateStr, isCurrentMonth: false });
    }

    // Current month days
    const days: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ day: d, dateStr, isCurrentMonth: true });
    }

    // Trailing days from next month to complete standard 6 rows (42 cells)
    const totalCells = leadingDays.length + days.length;
    const trailingCount = 42 - totalCells;
    const trailingDays: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];
    for (let d = 1; d <= trailingCount; d++) {
      const nextM = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextY = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      trailingDays.push({ day: d, dateStr, isCurrentMonth: false });
    }

    return [...leadingDays, ...days, ...trailingDays];
  }, [currentYear, currentMonth]);

  // Map of bookings by date
  const bookingsByDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    for (const b of bookings) {
      const list = map.get(b.visitDate) || [];
      list.push(b);
      map.set(b.visitDate, list);
    }
    return map;
  }, [bookings]);

  // Selected date details
  const selectedDateBookings = bookingsByDate.get(selectedDate) || [];
  const selectedDateTotalVisitors = selectedDateBookings.reduce(
    (sum, b) => sum + b.items.reduce((s, it) => s + it.quantity, 0),
    0
  );
  const selectedDateRevenue = selectedDateBookings.reduce((sum, b) => sum + b.total, 0);

  // Formatter for selected date header
  const formattedSelectedDate = useMemo(() => {
    try {
      const d = new Date(`${selectedDate}T00:00:00`);
      return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(d);
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header View */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-ocean-600">
            Kasir / Loket Tiket • Reservasi
          </p>
          <h1 className="mt-1 text-2xl font-bold text-ocean-900 sm:text-3xl">
            Kalender Jadwal Booking Pengunjung
          </h1>
          <p className="text-sm text-slate-500">
            Pantau sebaran jadwal kedatangan wisatawan, estimasi kapasitas pengunjung, dan status tiket reservasi.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoToday}
          className="inline-flex items-center gap-2 rounded-xl border border-ocean-200 bg-white px-4 py-2 text-xs font-bold text-ocean-700 shadow-sm transition hover:bg-ocean-50"
        >
          <Clock className="h-4 w-4" />
          <span>Kembali ke Hari Ini</span>
        </button>
      </div>

      {/* Grid Kalender Bulanan (Monthly Calendar Grid) */}
      <div className="rounded-3xl border border-slate-200/90 bg-[#F1F5F9] p-5 shadow-sm sm:p-7">
        {/* Calendar Navigation Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#286EF2] shadow-xs">
              <CalendarDays className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 sm:text-2xl">
                {MONTH_NAMES_ID[currentMonth]} {currentYear}
              </h2>
              <p className="text-xs text-slate-500">
                Pilih tanggal pada grid kalender untuk melihat daftar reservasi pengunjung
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Month & Year Selectors */}
            <select
              value={currentMonth}
              onChange={(e) => setCurrentMonth(parseInt(e.target.value, 10))}
              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs focus:border-[#286EF2] focus:outline-none"
            >
              {MONTH_NAMES_ID.map((name, idx) => (
                <option key={name} value={idx}>
                  {name}
                </option>
              ))}
            </select>

            <select
              value={currentYear}
              onChange={(e) => setCurrentYear(parseInt(e.target.value, 10))}
              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs focus:border-[#286EF2] focus:outline-none"
            >
              {[2025, 2026, 2027, 2028].map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>

            {/* Nav Arrows */}
            <div className="flex items-center gap-1 ml-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-600 shadow-xs transition hover:bg-slate-100"
                aria-label="Bulan sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-600 shadow-xs transition hover:bg-slate-100"
                aria-label="Bulan berikutnya"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Header Hari (Sen, Sel, Rab, Kam, Jum, Sab, Min) */}
        <div className="mt-6 grid grid-cols-7 gap-1 text-center">
          {DAY_NAMES_ID.map((dayName, idx) => (
            <div
              key={dayName}
              className={`py-2 text-xs font-bold uppercase tracking-wider ${
                idx >= 5 ? 'text-rose-500' : 'text-slate-600'
              }`}
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Grid Tanggal Bulanan (Circular Badge Grid) */}
        <div className="mt-2 grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((cell) => {
            const isSelected = selectedDate === cell.dateStr;
            const isToday = cell.dateStr === todayIso;
            const dayBookings = bookingsByDate.get(cell.dateStr) || [];
            const hasBookings = dayBookings.length > 0;
            const visitorsCount = dayBookings.reduce(
              (sum, b) => sum + b.items.reduce((s, it) => s + it.quantity, 0),
              0
            );

            return (
              <div
                key={cell.dateStr}
                className="relative flex flex-col items-center justify-center p-1 sm:p-2"
              >
                <button
                  type="button"
                  onClick={() => setSelectedDate(cell.dateStr)}
                  title={
                    hasBookings
                      ? `${cell.dateStr}: ${dayBookings.length} booking (${visitorsCount} pengunjung)`
                      : cell.dateStr
                  }
                  className={`group relative flex h-12 w-12 sm:h-14 sm:w-14 flex-col items-center justify-center rounded-2xl transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#286EF2] text-white font-black shadow-lg shadow-blue-500/35 scale-105 ring-4 ring-blue-200'
                      : hasBookings
                      ? 'bg-[#286EF2]/15 text-[#286EF2] font-black ring-2 ring-[#286EF2] shadow-sm hover:bg-[#286EF2]/25 scale-105'
                      : isToday
                      ? 'bg-white text-[#286EF2] font-black ring-2 ring-slate-400 hover:bg-slate-50'
                      : cell.isCurrentMonth
                      ? 'bg-white/80 text-slate-800 hover:bg-white font-semibold shadow-2xs'
                      : 'text-slate-400 hover:bg-white/40 font-normal'
                  }`}
                >
                  <span className={`leading-none ${hasBookings ? 'text-base font-black' : 'text-sm'}`}>
                    {cell.day}
                  </span>

                  {/* Indikator Booking yang Menonjol & Besar */}
                  {hasBookings && (
                    <span className="mt-1 flex items-center justify-center">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ring-2 ${
                          isSelected ? 'bg-white ring-[#286EF2]' : 'bg-[#286EF2] ring-white animate-pulse'
                        }`}
                      />
                    </span>
                  )}
                </button>

                {/* Subtext info pengunjung untuk tanggal dengan booking */}
                {hasBookings && cell.isCurrentMonth && (
                  <span
                    className={`mt-1 hidden sm:inline-block rounded-md px-1.5 py-0.5 text-[10px] font-extrabold ${
                      isSelected
                        ? 'bg-[#286EF2] text-white'
                        : 'bg-[#286EF2]/10 text-[#286EF2]'
                    }`}
                  >
                    {visitorsCount} Org
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend / Keterangan Warna */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 border-t border-slate-200 pt-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-lg bg-[#286EF2] shadow-xs" />
            <span className="font-bold text-slate-700">Tanggal Terpilih</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-lg border-2 border-[#286EF2] bg-[#286EF2]/15 flex items-center justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-[#286EF2]" />
            </span>
            <span className="font-bold text-[#286EF2]">Ada Reservasi / Booking</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-lg border-2 border-slate-400 bg-white" />
            <span className="font-semibold text-slate-700">Hari Ini</span>
          </div>
        </div>
      </div>

      {/* Rincian Reservasi untuk Tanggal yang Dipilih */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-[#F1F5F9] p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-ocean-50 pb-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#286EF2]">
                Jadwal Kunjungan Terpilih
              </span>
              <span className="font-mono text-xs text-slate-400">{selectedDate}</span>
            </div>
            <h2 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
              {formattedSelectedDate}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Rincian reservasi pengunjung yang terjadwal hadir pada tanggal ini.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700">
              <Ticket className="h-4 w-4 text-[#286EF2]" />
              <span>{selectedDateBookings.length} Pesanan</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800">
              <Users className="h-4 w-4 text-emerald-600" />
              <span>{formatNumber(selectedDateTotalVisitors)} Pengunjung</span>
            </div>
            {selectedDateRevenue > 0 && (
              <div className="flex items-center gap-2 rounded-2xl bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-800">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span>{formatRupiah(selectedDateRevenue)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Daftar Booking pada Tanggal Terpilih */}
        <div className="mt-6 flex flex-col gap-3">
          {selectedDateBookings.length > 0 ? (
            selectedDateBookings.map((b) => (
              <div
                key={b.id}
                className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:bg-white hover:shadow-md sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ocean-100 text-ocean-700 font-bold">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{b.visitorName}</h4>
                    <p className="text-xs text-slate-400">
                      Kode: <span className="font-mono font-bold text-[#286EF2]">{b.code}</span> • Telp: {b.phone}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {b.items.map((it) => (
                    <span
                      key={it.categoryId}
                      className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200"
                    >
                      {it.name}: <strong>{it.quantity} tiket</strong>
                    </span>
                  ))}
                  <span className="font-extrabold text-slate-900 ml-1">
                    {formatRupiah(b.total)}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      b.status === 'validated'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    {b.status === 'validated' ? 'Tervalidasi / Hadir' : 'Booking Terjadwal'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
              <CalendarCheck className="h-12 w-12 text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">
                Tidak ada reservasi khusus untuk tanggal {selectedDate}
              </p>
              <p className="mt-1 text-xs text-slate-400 max-w-sm">
                Pengunjung tetap dapat membeli tiket secara langsung di loket kasir (*Walk-in*) pada hari tersebut.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
