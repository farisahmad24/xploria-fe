import { useMemo, useState } from 'react';
import {
  Calendar,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  Search,
  Sparkles,
  User,
  Users,
} from 'lucide-react';
import SlantedTicket from '@/components/common/SlantedTicket';
import { formatNumber, formatRupiah, toIsoDate } from '@/lib/bookings';
import type { Booking, BookingItem } from '@/types/ticket';

const MONTH_NAMES_ID_FULL = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const MINI_CAL_DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

type BookingCalendarViewProps = {
  bookings: Booking[];
};

export default function BookingCalendarView({ bookings }: BookingCalendarViewProps) {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // November (0-indexed: 10)
  const [selectedDate, setSelectedDate] = useState('2026-11-11');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'validated' | 'booked'>('all');

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

  const handleGoToday = () => {
    const t = new Date();
    setCurrentYear(t.getFullYear());
    setCurrentMonth(t.getMonth());
    setSelectedDate(todayIso);
  };

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

  // Mini calendar 42 cells (Sunday-first)
  const miniCalDays = useMemo(() => {
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDow = new Date(currentYear, currentMonth, 1).getDay();
    const prevTotal = new Date(currentYear, currentMonth, 0).getDate();
    const cells: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];

    for (let i = firstDow - 1; i >= 0; i--) {
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
    const trailing = 42 - cells.length;
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

  // Bookings on the selected date (filtered by search if any)
  const selectedDateBookings = useMemo(() => {
    const list = bookingsByDate.get(selectedDate) || [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (b) =>
        b.visitorName.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.phone.includes(q)
    );
  }, [bookingsByDate, selectedDate, searchQuery]);

  // Counts for status filters on selected date
  const validatedCount = useMemo(() => {
    return selectedDateBookings.filter((b) => b.status === 'validated').length;
  }, [selectedDateBookings]);

  const bookedCount = useMemo(() => {
    return selectedDateBookings.filter((b) => b.status === 'booked').length;
  }, [selectedDateBookings]);

  // Filtered bookings to display in the grid
  const displayedBookings = useMemo(() => {
    if (statusFilter === 'all') return selectedDateBookings;
    return selectedDateBookings.filter((b) => b.status === statusFilter);
  }, [selectedDateBookings, statusFilter]);

  // Totals for selected date
  const selectedVisitors = useMemo(() => {
    return selectedDateBookings.reduce(
      (sum: number, b: Booking) => sum + b.items.reduce((s: number, it: BookingItem) => s + it.quantity, 0),
      0
    );
  }, [selectedDateBookings]);

  const selectedRevenue = useMemo(() => {
    return selectedDateBookings.reduce((sum: number, b: Booking) => sum + b.total, 0);
  }, [selectedDateBookings]);

  // Formatted date string for Indonesian display
  const formattedSelectedDate = useMemo(() => {
    try {
      return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(`${selectedDate}T00:00:00`));
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  return (
    <div className="flex flex-col gap-6">
      {/* ── KONTENER UTAMA SIDE-BY-SIDE ───────────────────────── */}
      <div className="overflow-hidden rounded-[32px] border border-slate-200/90 bg-white p-5 sm:p-7 shadow-xl shadow-slate-200/70">
        {/* Top Navbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-[#286EF2]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 leading-tight">
                Jadwal Booking <span className="text-xs text-[#286EF2] font-bold">• Kasir Loket</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Pilih tanggal pada kalender untuk melihat rincian pemesanan harian
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleGoToday}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs transition hover:border-[#286EF2] hover:text-[#286EF2] hover:bg-blue-50/50"
            >
              <Clock className="h-3.5 w-3.5 text-[#286EF2]" />
              <span>Hari Ini</span>
            </button>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2 pl-3 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">Siti Rahmawati</p>
                <p className="text-[10px] text-slate-400">Kasir Loket</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#286EF2] to-sky-400 text-white text-xs font-black shadow-sm">
                SR
              </div>
            </div>
          </div>
        </div>

        {/* ── 2-COLUMN LAYOUT (LEFT: 1 HARI SAJA | RIGHT: KALENDER MINI) ───────────────── */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* SISI KIRI: DAFTAR PESANAN 1 HARI TERPILIH (Dinaikkan Mengisi Ruang Kosong) */}
          <div className="lg:col-span-8 flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-[#F8FAFD] p-5 sm:p-6 min-h-[460px]">
            <div>
              {/* Header Jadwal Terpilih */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/70">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-blue-100/80 px-2.5 py-0.5 text-[11px] font-black text-[#286EF2]">
                      Jadwal Terpilih
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">{selectedDate}</span>
                  </div>
                  <h3 className="mt-1.5 text-lg sm:text-xl font-black text-slate-900">
                    {formattedSelectedDate}
                  </h3>
                </div>

                {/* Summary Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-2xs border border-slate-200/60">
                    <SlantedTicket className="h-3.5 w-3.5 text-[#286EF2]" />
                    <span>{selectedDateBookings.length} Pesanan</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-[11px] font-bold text-emerald-800 shadow-2xs border border-slate-200/60">
                    <Users className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{formatNumber(selectedVisitors)} Pengunjung</span>
                  </div>
                  {selectedRevenue > 0 && (
                    <div className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-[11px] font-bold text-amber-800 shadow-2xs border border-slate-200/60">
                      <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                      <span>{formatRupiah(selectedRevenue)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Filter Status: Semua | Tervalidasi | Booking */}
              <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1 rounded-2xl bg-slate-200/70 p-1">
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      statusFilter === 'all'
                        ? 'bg-white text-[#286EF2] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Semua</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                        statusFilter === 'all'
                          ? 'bg-blue-100 text-[#286EF2]'
                          : 'bg-slate-300/60 text-slate-600'
                      }`}
                    >
                      {selectedDateBookings.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusFilter('validated')}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      statusFilter === 'validated'
                        ? 'bg-white text-emerald-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Tervalidasi</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                        statusFilter === 'validated'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-300/60 text-slate-600'
                      }`}
                    >
                      {validatedCount}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusFilter('booked')}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      statusFilter === 'booked'
                        ? 'bg-white text-sky-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    <span>Booking</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                        statusFilter === 'booked'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-slate-300/60 text-slate-600'
                      }`}
                    >
                      {bookedCount}
                    </span>
                  </button>
                </div>

                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  Menampilkan {displayedBookings.length} dari {selectedDateBookings.length} pesanan
                </span>
              </div>

              {/* Grid Kartu Pesanan untuk 1 Hari (Tertata rapi 2 kolom, teks terbaca jelas) */}
              <div className="mt-3.5">
                {displayedBookings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1">
                    {displayedBookings.map((b) => {
                      const timePart = b.createdAt?.split('T')[1]?.substring(0, 5) || '10:00';
                      const totalQty = b.items.reduce((s: number, it: BookingItem) => s + it.quantity, 0);
                      const isValidated = b.status === 'validated';

                      return (
                        <div
                          key={b.id}
                          className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-2xs transition hover:shadow-md hover:border-blue-200"
                        >
                          <div>
                            {/* Top Bar: Accent indicator + Jam */}
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={`h-1.5 w-6 rounded-full ${
                                  isValidated
                                    ? 'bg-emerald-500'
                                    : b.total >= 200000
                                    ? 'bg-amber-500'
                                    : 'bg-[#286EF2]'
                                }`}
                              />
                              <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                                {timePart} WIB
                              </span>
                            </div>

                            {/* Visitor Name & Info */}
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#286EF2] font-black text-xs">
                                <User className="h-4 w-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs font-black text-slate-900 truncate">
                                  {b.visitorName}
                                </h4>
                                <p className="text-[10px] text-slate-400 font-mono truncate">
                                  {b.code} • {b.phone}
                                </p>
                              </div>
                            </div>

                            {/* Ticket Details */}
                            <div className="mt-2.5 flex flex-wrap gap-1">
                              {b.items.map((it: BookingItem) => (
                                <span
                                  key={it.categoryId}
                                  className="rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-700 ring-1 ring-slate-200/70"
                                >
                                  {it.name}: <strong>{it.quantity}×</strong>
                                </span>
                              ))}
                            </div>

                            {b.durationDays && b.durationDays > 1 && (
                              <p className="mt-1 text-[10px] font-semibold text-indigo-600">
                                Durasi: {b.durationDays} Hari ({b.visitDate} – {b.visitEndDate})
                              </p>
                            )}
                          </div>

                          {/* Footer: Harga & Status Badge */}
                          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                            <span className="text-xs font-black text-slate-900">
                              {formatRupiah(b.total)}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] font-black ${
                                isValidated
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-sky-100 text-sky-800'
                              }`}
                            >
                              {isValidated ? 'Tervalidasi' : 'Booking'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                    <CalendarCheck className="h-10 w-10 text-slate-300 mb-2" />
                    <p className="text-sm font-bold text-slate-700">
                      {statusFilter === 'all'
                        ? 'Tidak ada pesanan pada tanggal ini'
                        : statusFilter === 'validated'
                        ? 'Tidak ada tiket dengan status Tervalidasi'
                        : 'Tidak ada tiket dengan status Booking'}
                    </p>
                    <p className="mt-1 text-xs text-slate-400 max-w-xs">
                      {statusFilter !== 'all' ? (
                        <button
                          type="button"
                          onClick={() => setStatusFilter('all')}
                          className="font-bold text-[#286EF2] hover:underline"
                        >
                          Klik di sini untuk menampilkan semua tiket
                        </button>
                      ) : (
                        'Wisatawan tetap dapat melakukan pembelian tiket langsung di loket kasir (Walk-in).'
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom helper info */}
            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Klik tanggal lain pada kalender untuk melihat daftar pesanan hari tersebut.</span>
              <span className="font-bold text-[#286EF2]">Total: {selectedVisitors} Pengunjung</span>
            </div>
          </div>

          {/* SISI KANAN: KALENDER MINI BIRU (Tanpa Ringkasan Bulanan, Tinggi Pas Sesuai Kiri) */}
          <div className="lg:col-span-4 rounded-[28px] bg-[#286EF2] p-5 text-white shadow-xl shadow-blue-500/25 flex flex-col gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama pemesan..."
                className="w-full rounded-full bg-white/15 pl-9 pr-4 py-2 text-xs text-white placeholder-white/60 border border-white/20 focus:outline-none focus:bg-white/22 transition"
              />
            </div>

            {/* Month Header + Navigation Arrows */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <h3 className="text-sm font-black text-white">
                  {MONTH_NAMES_ID_FULL[currentMonth]} {currentYear}
                </h3>
                <p className="text-[10px] text-white/70">
                  {(bookingsByDate.get(selectedDate) || []).length} pemesanan dipilih
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/20 transition text-white"
                  title="Bulan sebelumnya"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/20 transition text-white"
                  title="Bulan berikutnya"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Day Labels */}
            <div className="grid grid-cols-7 text-center">
              {MINI_CAL_DAYS.map((d) => (
                <div key={d} className="text-[10px] font-bold text-white/80">
                  {d}
                </div>
              ))}
            </div>

            {/* 42-Cell Mini Calendar Grid WITH Booking Indicators */}
            <div className="grid grid-cols-7 gap-y-1.5 text-center">
              {miniCalDays.map((cell) => {
                const isSel = selectedDate === cell.dateStr;
                const isToday = cell.dateStr === todayIso;
                const dayBookings = bookingsByDate.get(cell.dateStr) || [];
                const hasBookings = dayBookings.length > 0;
                const count = dayBookings.length;

                return (
                  <div key={cell.dateStr} className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setSelectedDate(cell.dateStr)}
                      title={hasBookings ? `${count} pemesanan` : cell.dateStr}
                      className={`relative h-8 w-8 rounded-full text-xs transition duration-150 font-semibold ${
                        isSel
                          ? 'bg-white text-[#286EF2] font-black shadow-md scale-110'
                          : isToday
                          ? 'ring-2 ring-white/60 text-white font-bold'
                          : hasBookings && cell.isCurrentMonth
                          ? 'bg-white/20 text-white font-black ring-1 ring-amber-300/80 hover:bg-white/30'
                          : cell.isCurrentMonth
                          ? 'text-white hover:bg-white/15'
                          : 'text-white/30'
                      }`}
                    >
                      {cell.day}
                      {/* Number badge for multiple bookings */}
                      {hasBookings && !isSel && cell.isCurrentMonth && count > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-400 text-[8px] font-black text-amber-950">
                          {count}
                        </span>
                      )}
                    </button>

                    {/* Dot indicator */}
                    {hasBookings && cell.isCurrentMonth && (
                      <span
                        className={`mt-0.5 h-1.5 w-1.5 rounded-full ${
                          isSel ? 'bg-[#286EF2]' : 'bg-amber-300'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend Penanda Kalender */}
            <div className="flex items-center justify-center gap-4 rounded-xl bg-white/10 py-2 text-[10px] text-white/90 mt-1">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-300 animate-pulse" />
                Ada Pemesanan
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white" />
                Tanggal Dipilih
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
