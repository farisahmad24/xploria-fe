import { useState } from 'react';
import {
  CalendarCheck,
  CalendarDays,
  Ticket,
  User,
  Users,
} from 'lucide-react';
import { initialBookingSchedule } from '@/data/mockData';
import { formatRupiah } from '@/lib/bookings';
import type { Booking } from '@/types/ticket';

type BookingCalendarViewProps = {
  bookings: Booking[];
};

export default function BookingCalendarView({ bookings }: BookingCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState('2026-11-11');

  // Filter bookings for selected date or fallback
  const dateBookings = bookings.filter((b) => b.visitDate === selectedDate);

  const selectedScheduleInfo = initialBookingSchedule.find((s) => s.date === selectedDate) || {
    date: selectedDate,
    title: selectedDate,
    totalVisitors: dateBookings.reduce(
      (sum, b) => sum + b.items.reduce((acc, it) => acc + it.quantity, 0),
      0
    ),
    totalBookings: dateBookings.length,
    highlight: false,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-ocean-600">
            Kasir / Loket Tiket
          </p>
          <h1 className="mt-1 text-2xl font-bold text-ocean-900 sm:text-3xl">
            Kalender Jadwal Booking Pengunjung
          </h1>
          <p className="text-sm text-slate-500">
            Jadwal reservasi tiket rombongan dan perorangan harian untuk estimasi kapasitas pantai.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 shadow-card">
          <CalendarDays className="h-5 w-5 text-ocean-600" />
          <span className="text-sm font-bold text-ocean-950">November 2026</span>
        </div>
      </div>

      {/* Date timeline cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {initialBookingSchedule.map((item) => {
          const isSelected = selectedDate === item.date;
          return (
            <button
              key={item.date}
              type="button"
              onClick={() => setSelectedDate(item.date)}
              className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all ${
                isSelected
                  ? 'border-ocean-600 bg-ocean-600 text-white shadow-lg shadow-ocean-600/30'
                  : 'border-ocean-100 bg-white text-slate-700 hover:border-ocean-300 hover:bg-ocean-50/50'
              }`}
            >
              <span className={`text-xs font-semibold ${isSelected ? 'text-ocean-100' : 'text-slate-400'}`}>
                {item.title}
              </span>
              <span className="my-1 text-xl font-black">
                {new Date(item.date).getDate()}
              </span>
              <span
                className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-ocean-50 text-ocean-700'
                }`}
              >
                {item.totalVisitors} Org
              </span>
            </button>
          );
        })}
      </div>

      {/* Detail for Selected Date */}
      <div className="rounded-3xl border border-ocean-100 bg-white p-6 shadow-card">
        <div className="flex flex-col justify-between gap-4 border-b border-ocean-50 pb-5 sm:flex-row sm:items-center">
          <div>
            <span className="rounded-full bg-ocean-50 px-3 py-1 text-xs font-bold text-ocean-700">
              Jadwal Kunjungan: {selectedDate}
            </span>
            <h2 className="mt-2 text-xl font-bold text-slate-900">
              Rincian Reservasi Tiket ({selectedScheduleInfo.totalVisitors} Pengunjung Terdaftar)
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <Ticket className="h-4 w-4 text-ocean-600" />
              {selectedScheduleInfo.totalBookings} Transaksi Booking
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-emerald-600" />
              Kapasitas: Optimal
            </span>
          </div>
        </div>

        {/* List of bookings */}
        <div className="mt-6 flex flex-col gap-3">
          {dateBookings.length > 0 ? (
            dateBookings.map((b) => (
              <div
                key={b.id}
                className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 transition hover:bg-white hover:shadow-md sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ocean-100 text-ocean-700 font-bold">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{b.visitorName}</h4>
                    <p className="text-xs text-slate-400">
                      Kode: <span className="font-mono text-ocean-600">{b.code}</span> • Telp: {b.phone}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {b.items.map((it) => (
                    <span
                      key={it.categoryId}
                      className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200"
                    >
                      {it.name}: <strong>{it.quantity} tiket</strong>
                    </span>
                  ))}
                  <span className="font-bold text-ocean-900 ml-2">{formatRupiah(b.total)}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      b.status === 'validated'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {b.status === 'validated' ? 'Sudah Masuk' : 'Booking Terjadwal'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CalendarCheck className="h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm font-semibold text-slate-700">
                Belum ada reservasi khusus untuk tanggal {selectedDate}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Pengunjung tetap dapat membeli tiket langsung secara go-show di loket kasir.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
