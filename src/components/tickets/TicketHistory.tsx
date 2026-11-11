import { useMemo, useState } from 'react';
import { formatRupiah, formatVisitDate } from '@/lib/bookings';
import type { Booking, BookingStatus } from '@/types/ticket';

type FilterValue = 'all' | BookingStatus;

const filters: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'booked', label: 'Menunggu Kunjungan' },
  { value: 'validated', label: 'Sudah Masuk' },
];

const statusStyle: Record<BookingStatus, { label: string; className: string }> = {
  booked: { label: 'Terpesan', className: 'bg-ocean-50 text-ocean-700' },
  validated: { label: 'Tervalidasi', className: 'bg-emerald-50 text-emerald-700' },
};

type TicketHistoryProps = {
  bookings: Booking[];
};

export default function TicketHistory({ bookings }: TicketHistoryProps) {
  const [filter, setFilter] = useState<FilterValue>('all');

  const visible = useMemo(
    () => (filter === 'all' ? bookings : bookings.filter((booking) => booking.status === filter)),
    [bookings, filter]
  );

  return (
    <section className="rounded-3xl border border-ocean-100 bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-ocean-900">Riwayat Penjualan Tiket</h2>
          <p className="text-sm text-slate-500">{bookings.length} pemesanan tercatat</p>
        </div>
        <div role="group" aria-label="Filter status" className="flex rounded-xl bg-ocean-50 p-1">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              aria-pressed={filter === item.value}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all sm:text-sm ${
                filter === item.value ? 'bg-white text-ocean-700 shadow-sm' : 'text-slate-500 hover:text-ocean-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-500">Belum ada pemesanan pada filter ini.</p>
      ) : (
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-ocean-100 text-xs uppercase tracking-wider text-slate-400">
                <th className="pb-3 font-semibold">Kode</th>
                <th className="pb-3 font-semibold">Pengunjung</th>
                <th className="pb-3 font-semibold">Kunjungan</th>
                <th className="pb-3 font-semibold">Tiket</th>
                <th className="pb-3 text-right font-semibold">Total</th>
                <th className="pb-3 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ocean-50">
              {visible.map((booking) => {
                const quantity = booking.items.reduce((sum, item) => sum + item.quantity, 0);
                const status = statusStyle[booking.status];
                return (
                  <tr key={booking.id} className="transition-colors hover:bg-ocean-50/50">
                    <td className="py-3.5 font-mono text-xs font-semibold text-ocean-800">{booking.code}</td>
                    <td className="py-3.5 font-medium text-slate-700">{booking.visitorName}</td>
                    <td className="py-3.5 text-slate-500">{formatVisitDate(booking.visitDate)}</td>
                    <td className="py-3.5 text-slate-500">{quantity} tiket</td>
                    <td className="py-3.5 text-right font-semibold text-ocean-900">{formatRupiah(booking.total)}</td>
                    <td className="py-3.5 text-right">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
