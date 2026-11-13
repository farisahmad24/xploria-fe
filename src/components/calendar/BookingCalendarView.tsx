import { useMemo, useState } from 'react';
import {
  Calendar,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Folder,
  LayoutGrid,
  MessageSquare,
  Search,
  Sparkles,
  Ticket,
  User,
  Users,
} from 'lucide-react';
import { formatNumber, formatRupiah, toIsoDate } from '@/lib/bookings';
import type { Booking } from '@/types/ticket';

const MONTH_NAMES_ID_FULL = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const MONTH_NAMES_ID = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des',
];

const MINI_CAL_DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

type BookingCalendarViewProps = {
  bookings: Booking[];
};

export default function BookingCalendarView({ bookings }: BookingCalendarViewProps) {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // November
  const [selectedDate, setSelectedDate] = useState('2026-11-11');
  const [searchQuery, setSearchQuery] = useState('');
  const [showWeekend, setShowWeekend] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const todayIso = toIsoDate(new Date());

  const handlePrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const handleGoToday = () => {
    const t = new Date();
    setCurrentYear(t.getFullYear());
    setCurrentMonth(t.getMonth());
    setSelectedDate(todayIso);
  };

  // Bookings by date map
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

  // Week days (Mon–Fri or Mon–Sun) anchored to selectedDate
  const weekDays = useMemo(() => {
    const d = new Date(`${selectedDate}T00:00:00`);
    const dow = d.getDay();
    const diffToMon = dow === 0 ? -6 : 1 - dow;
    const monday = new Date(d);
    monday.setDate(d.getDate() + diffToMon);

    const IDnames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const count = showWeekend ? 7 : 5;
    return Array.from({ length: count }, (_, i) => {
      const cur = new Date(monday);
      cur.setDate(monday.getDate() + i);
      const iso = toIsoDate(cur);
      return { dateStr: iso, dayNumber: cur.getDate(), nameEn: IDnames[i] };
    });
  }, [selectedDate, showWeekend]);

  // Cards for a given day — only real bookings, filtered by search
  const getCards = (dateStr: string) => {
    const list = bookingsByDate.get(dateStr) || [];
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      b => b.visitorName.toLowerCase().includes(q) || b.code.toLowerCase().includes(q)
    );
  };

  // Selected date info
  const selectedBookings = bookingsByDate.get(selectedDate) || [];
  const selectedVisitors = selectedBookings.reduce((s, b) => s + b.items.reduce((x, it) => x + it.quantity, 0), 0);
  const selectedRevenue = selectedBookings.reduce((s, b) => s + b.total, 0);

  const formattedSelectedDate = useMemo(() => {
    try {
      return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      }).format(new Date(`${selectedDate}T00:00:00`));
    } catch { return selectedDate; }
  }, [selectedDate]);

  // Handle "Add new list" note (kept for future use, panel removed)
  const _unusedSubmit = () => setFeedbackMsg(null);

  return (
    <div className="flex flex-col gap-5">
      {/* ── OUTER CARD ───────────────────────────────────────── */}
      <div className="overflow-hidden rounded-[32px] border border-slate-100 bg-white p-5 sm:p-7 shadow-xl shadow-slate-200/70">

        {/* Top Nav */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#286EF2]">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 leading-tight">
                Jadwal Booking <span className="text-xs text-[#286EF2] font-bold">• Kasir Loket</span>
              </h2>
              <p className="text-[10px] text-slate-400">Kalender & Timeline Jadwal Kunjungan Wisatawan</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowWeekend(!showWeekend)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold border transition ${
                showWeekend
                  ? 'bg-blue-50 text-[#286EF2] border-blue-200'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {showWeekend ? 'Tampil 5 Hari' : 'Tampil 7 Hari'}
            </button>

            <div className="hidden sm:flex items-center gap-1 text-slate-300">
              {[LayoutGrid, MessageSquare, Folder].map((Icon, i) => (
                <button key={i} type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-50 hover:text-slate-600 transition">
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-100">
              <span className="hidden sm:block text-xs font-bold text-slate-700">Siti Rahmawati</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#286EF2] to-sky-400 text-white text-[10px] font-black shadow-sm">
                SR
              </div>
            </div>
          </div>
        </div>

        {feedbackMsg && (
          <div className="mt-3 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 border border-emerald-200 flex items-center justify-between">
            <span>{feedbackMsg}</span>
            <button onClick={() => setFeedbackMsg(null)} className="text-emerald-400 hover:text-emerald-700">✕</button>
          </div>
        )}

        {/* ── MAIN 2-COLUMN ───────────────────────── */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT: Weekly Timeline Grid — only real bookings, compact cards */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-xs">
              <div style={{ minWidth: `${weekDays.length * 140}px` }}>

                {/* Column Headers */}
                <div
                  className="grid border-b border-slate-100 bg-slate-50/60"
                  style={{ gridTemplateColumns: `repeat(${weekDays.length}, minmax(0, 1fr))` }}
                >
                  {weekDays.map(day => {
                    const count = (bookingsByDate.get(day.dateStr) || []).length;
                    const isSel = selectedDate === day.dateStr;
                    return (
                      <button
                        key={day.dateStr}
                        type="button"
                        onClick={() => setSelectedDate(day.dateStr)}
                        className={`flex flex-col items-center py-3 px-2 border-r border-slate-100 last:border-r-0 transition ${
                          isSel ? 'bg-blue-50 ring-2 ring-inset ring-[#286EF2]' : 'hover:bg-slate-100/60'
                        }`}
                      >
                        <span className={`text-[11px] font-bold ${isSel ? 'text-[#286EF2]' : 'text-slate-600'}`}>
                          {day.nameEn}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {day.dayNumber} {MONTH_NAMES_ID[currentMonth]}
                        </span>
                        {count > 0
                          ? <span className="mt-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-black text-amber-800">
                              {count} pesan
                            </span>
                          : <span className="mt-1 text-[9px] text-slate-300">–</span>
                        }
                      </button>
                    );
                  })}
                </div>

                {/* Card Columns — COMPACT, real bookings only */}
                <div
                  className="grid divide-x divide-slate-100 bg-slate-50/20"
                  style={{
                    gridTemplateColumns: `repeat(${weekDays.length}, minmax(0, 1fr))`,
                    minHeight: '340px',
                  }}
                >
                  {weekDays.map(day => {
                    const cards = getCards(day.dateStr);
                    const isSel = selectedDate === day.dateStr;
                    return (
                      <div
                        key={day.dateStr}
                        className={`flex flex-col gap-2 p-2 ${isSel ? 'bg-blue-50/20' : ''}`}
                      >
                        {cards.length > 0 ? (
                          cards.map(b => {
                            // Extract hh:mm from createdAt
                            const timePart = b.createdAt?.split('T')[1]?.substring(0, 5) || '–';
                            const totalQty = b.items.reduce((s, it) => s + it.quantity, 0);
                            const accentColor =
                              b.status === 'validated' ? 'bg-emerald-500'
                              : b.total >= 200000 ? 'bg-amber-500'
                              : 'bg-indigo-500';

                            return (
                              <div
                                key={b.id}
                                onClick={() => setSelectedDate(day.dateStr)}
                                className="cursor-pointer rounded-xl bg-white border border-slate-100 shadow-sm p-2.5 hover:shadow-md hover:border-blue-200 transition-all group"
                              >
                                {/* Accent line */}
                                <div className={`h-1 w-6 rounded-full mb-1.5 ${accentColor}`} />

                                {/* Name + time */}
                                <div className="flex items-start justify-between gap-1">
                                  <p className="text-[11px] font-black text-slate-800 leading-tight line-clamp-1 group-hover:text-[#286EF2] transition">
                                    {b.visitorName}
                                  </p>
                                  <span className="shrink-0 rounded bg-slate-100 px-1 py-0.5 text-[9px] font-bold text-slate-500">
                                    {timePart}
                                  </span>
                                </div>

                                {/* Tiket info */}
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  {totalQty} tiket • {formatRupiah(b.total)}
                                </p>

                                {/* Status dot */}
                                <div className="mt-1.5 flex items-center gap-1">
                                  <span className={`h-1.5 w-1.5 rounded-full ${b.status === 'validated' ? 'bg-emerald-500' : 'bg-sky-500'}`} />
                                  <span className="text-[9px] font-bold text-slate-400">
                                    {b.status === 'validated' ? 'Tervalidasi' : 'Terjadwal'}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="flex flex-1 flex-col items-center justify-center text-center py-8 text-slate-200">
                            <Calendar className="h-5 w-5 stroke-[1.5] mb-1" />
                            <span className="text-[9px]">Kosong</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-1 text-[10px] text-slate-400">
              <span>Hanya menampilkan pesanan tiket yang telah dipesan. Klik kolom hari untuk detail.</span>
              <button onClick={handleGoToday} className="font-bold text-[#286EF2] hover:underline">
                Hari Ini
              </button>
            </div>
          </div>

          {/* RIGHT: Blue Mini Calendar + Add List */}
          <div className="lg:col-span-4 rounded-[28px] bg-[#286EF2] p-4 sm:p-5 text-white shadow-xl shadow-blue-500/25 flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari nama pemesan..."
                className="w-full rounded-full bg-white/15 pl-9 pr-4 py-1.5 text-[11px] text-white placeholder-white/60 border border-white/20 focus:outline-none focus:bg-white/22 transition"
              />
            </div>

            {/* Month Header + Nav */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white">
                  {MONTH_NAMES_ID_FULL[currentMonth]} {currentYear}
                </h3>
                <p className="text-[10px] text-white/60">
                  {(bookingsByDate.get(selectedDate) || []).length} pemesanan dipilih
                </p>
              </div>
              <div className="flex items-center gap-0.5">
                <button onClick={handlePrevMonth}
                  className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white/20 transition">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button onClick={handleNextMonth}
                  className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-white/20 transition">
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Day Labels */}
            <div className="grid grid-cols-7 text-center">
              {MINI_CAL_DAYS.map(d => (
                <div key={d} className="text-[9px] font-bold text-white/70">{d}</div>
              ))}
            </div>

            {/* 42-cell mini grid WITH booking indicators */}
            <div className="grid grid-cols-7 gap-y-1.5 text-center">
              {miniCalDays.map(cell => {
                const isSel = selectedDate === cell.dateStr;
                const isToday = cell.dateStr === todayIso;
                const dayBookings = bookingsByDate.get(cell.dateStr) || [];
                const hasBookings = dayBookings.length > 0;
                const count = dayBookings.length;

                return (
                  <div key={cell.dateStr} className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => { setSelectedDate(cell.dateStr); }}
                      title={hasBookings ? `${count} pemesanan` : cell.dateStr}
                      className={`relative h-7 w-7 rounded-full text-[11px] transition duration-150 font-semibold ${
                        isSel
                          ? 'bg-white text-[#286EF2] font-black shadow-md scale-110'
                          : isToday
                          ? 'ring-2 ring-white/60 text-white'
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
                        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-amber-400 text-[7px] font-black text-amber-900">
                          {count}
                        </span>
                      )}
                    </button>

                    {/* Dot indicator */}
                    {hasBookings && cell.isCurrentMonth && (
                      <span className={`mt-0.5 h-1 w-1 rounded-full ${isSel ? 'bg-[#286EF2]' : 'bg-amber-300'}`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 rounded-xl bg-white/10 py-2 text-[10px] text-white/80">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-300" />Ada Pemesanan
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white" />Tanggal Dipilih
              </span>
            </div>

            {/* Summary stats to fill space */}
            <div className="rounded-[22px] bg-white/15 p-4 flex flex-col gap-3">
              <h4 className="text-xs font-black text-white">Ringkasan Bulan Ini</h4>
              {(() => {
                const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
                const monthBookings = bookings.filter(b => b.visitDate.startsWith(monthPrefix));
                const totalVisitors = monthBookings.reduce(
                  (s, b) => s + b.items.reduce((x, it) => x + it.quantity, 0), 0
                );
                const validated = monthBookings.filter(b => b.status === 'validated').length;
                const pending = monthBookings.filter(b => b.status !== 'validated').length;
                const revenue = monthBookings.reduce((s, b) => s + b.total, 0);
                return (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-white/15 p-2.5">
                      <p className="text-[9px] text-white/70 font-semibold">Total Pemesanan</p>
                      <p className="text-lg font-black text-white leading-tight">{monthBookings.length}</p>
                    </div>
                    <div className="rounded-xl bg-white/15 p-2.5">
                      <p className="text-[9px] text-white/70 font-semibold">Pengunjung</p>
                      <p className="text-lg font-black text-white leading-tight">{totalVisitors}</p>
                    </div>
                    <div className="rounded-xl bg-emerald-500/30 p-2.5">
                      <p className="text-[9px] text-white/70 font-semibold">Tervalidasi</p>
                      <p className="text-lg font-black text-white leading-tight">{validated}</p>
                    </div>
                    <div className="rounded-xl bg-amber-400/25 p-2.5">
                      <p className="text-[9px] text-white/70 font-semibold">Menunggu</p>
                      <p className="text-lg font-black text-white leading-tight">{pending}</p>
                    </div>
                    <div className="col-span-2 rounded-xl bg-white/15 p-2.5">
                      <p className="text-[9px] text-white/70 font-semibold">Estimasi Pendapatan</p>
                      <p className="text-sm font-black text-white leading-tight">{formatRupiah(revenue)}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* ── DETAIL PANEL: Selected Date Bookings ───────── */}
      <div className="rounded-3xl border border-slate-200/90 bg-[#F4F7FC] p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/70">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-full bg-blue-100/80 px-2.5 py-0.5 text-[11px] font-black text-[#286EF2]">
                Jadwal Terpilih
              </span>
              <span className="font-mono text-[11px] text-slate-400">{selectedDate}</span>
            </div>
            <h2 className="mt-1 text-lg font-black text-slate-900">{formattedSelectedDate}</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 shadow-2xs border border-slate-200/60">
              <Ticket className="h-3.5 w-3.5 text-[#286EF2]" />
              {selectedBookings.length} Pesanan
            </div>
            <div className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-[11px] font-bold text-emerald-800 shadow-2xs border border-slate-200/60">
              <Users className="h-3.5 w-3.5 text-emerald-600" />
              {formatNumber(selectedVisitors)} Pengunjung
            </div>
            {selectedRevenue > 0 && (
              <div className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-[11px] font-bold text-amber-800 shadow-2xs border border-slate-200/60">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                {formatRupiah(selectedRevenue)}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2.5">
          {selectedBookings.length > 0 ? (
            selectedBookings.map(b => (
              <div
                key={b.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white p-3.5 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#286EF2]">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{b.visitorName}</h4>
                    <p className="text-[11px] text-slate-400">
                      <span className="font-mono font-bold text-[#286EF2]">{b.code}</span> • {b.phone}
                    </p>
                    {b.durationDays && b.durationDays > 1 && (
                      <p className="text-[10px] font-semibold text-indigo-600 mt-0.5">
                        {b.durationDays} Hari ({b.visitDate} – {b.visitEndDate})
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {b.items.map(it => (
                    <span key={it.categoryId}
                      className="rounded-lg bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">
                      {it.name}: <strong>{it.quantity}×</strong>
                    </span>
                  ))}
                  <span className="font-black text-sm text-slate-900">{formatRupiah(b.total)}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    b.status === 'validated' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                  }`}>
                    {b.status === 'validated' ? 'Tervalidasi' : 'Booking'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CalendarCheck className="h-10 w-10 text-slate-200 mb-2" />
              <p className="text-sm font-bold text-slate-600">Tidak ada pesanan pada tanggal ini</p>
              <p className="mt-1 text-xs text-slate-400 max-w-xs">
                Pengunjung masih bisa membeli tiket langsung di loket kasir (Walk-in).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
