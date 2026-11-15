import { useMemo, useState } from 'react';
import { History, Search } from 'lucide-react';
import { formatRupiah, formatVisitDate } from '@/lib/bookings';
import type { mendatang, BookingStatus, BookingType } from '@/types/ticket';

type FilterStatus = 'all' | BookingStatus;
type FilterType = 'all' | BookingType;

const statusStyle: Record<BookingStatus, { label: string; className: string }> = {
  booked: { label: 'Terjadwal / Menunggu', className: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200/50' },
  validated: { label: 'Tervalidasi / Masuk', className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/50' },
};

const paymentIcons: Record<string, string> = {
  cash: 'Tunai',
  qris: 'QRIS',
  ewallet: 'E-Wallet',
  transfer: 'Transfer',
};

type TicketHistoryProps = {
  bookings: mendatang[];
};

export default function TicketHistory({ bookings }: TicketHistoryProps) {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const visible = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchType = typeFilter === 'all' || b.bookingType === typeFilter;
      const matchSearch =
        b.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.phone.includes(searchTerm);
      return matchStatus && matchType && matchSearch;
    });
  }, [bookings, statusFilter, typeFilter, searchTerm]);

  return (
    <div className="flex min-h-[560px] flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card">
      <div>
        {/* Header & Filter Bar */}
        <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-[#286EF2] ring-1 ring-blue-100">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Riwayat Penjualan &amp; Pemesanan Tiket</h2>
              <p className="text-xs text-slate-400">
                Menampilkan {visible.length} dari total {bookings.length} transaksi pemesanan
              </p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter Tipe Transaksi */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Tipe:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as FilterType)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-[#286EF2] focus:bg-white focus:outline-none"
              >
                <option value="all">Semua Tipe Transaksi</option>
                <option value="hari_ini">Pemesanan Hari ini()</option>
                <option value="mendatang">Pemesanan mendatang (Mendatang)</option>
              </select>
            </div>

            {/* Filter Status Tiket */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-[#286EF2] focus:bg-white focus:outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="validated">Tervalidasi / Masuk</option>
                <option value="booked">Menunggu Kunjungan</option>
              </select>
            </div>

            <div className="relative">
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari kode atau nama..."
                className="w-full sm:w-48 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-[#286EF2] focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Table View dengan Fixed Width Column */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full min-w-[960px] table-fixed text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th className="w-44 px-5 py-4">Kode Tiket</th>
                <th className="w-56 px-5 py-4">Pengunjung</th>
                <th className="w-48 px-5 py-4">Tipe Transaksi</th>
                <th className="w-36 px-5 py-4">Tgl Kunjungan</th>
                <th className="w-32 px-5 py-4">Metode Bayar</th>
                <th className="w-28 px-5 py-4 text-center">Jumlah Tiket</th>
                <th className="w-40 px-5 py-4 text-right whitespace-nowrap">Total Bayar</th>
                <th className="w-44 px-5 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-24 text-center text-slate-400 text-sm">
                    Tidak ada transaksi pemesanan yang sesuai dengan filter yang dipilih.
                  </td>
                </tr>
              ) : (
                visible.map((mendatang) => {
                  const quantity = mendatang.items.reduce((sum, item) => sum + item.quantity, 0);
                  const status = statusStyle[mendatang.status] || statusStyle.booked;
                  const isHariIni = mendatang.bookingType === 'hari_ini';

                  return (
                    <tr key={mendatang.id} className="transition-colors hover:bg-slate-50/60">
                      <td className="w-44 px-5 py-4 font-mono text-xs font-bold text-[#286EF2]">
                        {mendatang.code}
                      </td>
                      <td className="w-56 px-5 py-4">
                        <p className="font-bold text-slate-900 truncate">{mendatang.visitorName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{mendatang.phone}</p>
                      </td>
                      <td className="w-48 px-5 py-4">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${isHariIni
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-sky-50 text-sky-800 border border-sky-200'
                            }`}
                        >
                          {isHariIni ? 'Hari ini()' : 'mendatang Mendatang'}
                        </span>
                      </td>
                      <td className="w-36 px-5 py-4 font-medium text-slate-700">
                        {formatVisitDate(mendatang.visitDate)}
                      </td>
                      <td className="w-32 px-5 py-4">
                        <span className="inline-block rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700 border border-slate-200/60">
                          {paymentIcons[mendatang.paymentMethod] || mendatang.paymentMethod}
                        </span>
                      </td>
                      <td className="w-28 px-5 py-4 text-center text-slate-700 font-bold">
                        {quantity} lembar
                      </td>
                      <td className="w-40 px-5 py-4 text-right font-extrabold text-slate-900 whitespace-nowrap">
                        {formatRupiah(mendatang.total)}
                      </td>
                      <td className="w-44 px-5 py-4 text-center">
                        <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Bar untuk menjaga frame tetap konsisten di semua filter */}
      <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">
            Menampilkan <strong className="text-slate-800">{visible.length}</strong> transaksi
          </span>
          <span className="text-slate-300">•</span>
          <span>
            Tipe:{' '}
            <strong className="text-[#286EF2]">
              {typeFilter === 'all'
                ? 'Semua Tipe'
                : typeFilter === 'hari_ini'
                  ? 'Hari ini()'
                  : 'mendatang Mendatang'}
            </strong>
          </span>
          <span className="text-slate-300">•</span>
          <span>
            Status:{' '}
            <strong className="text-slate-700">
              {statusFilter === 'all'
                ? 'Semua Status'
                : statusFilter === 'validated'
                  ? 'Tervalidasi / Masuk'
                  : 'Menunggu Kunjungan'}
            </strong>
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          Sistem Riwayat Transaksi Terverifikasi &amp; Terintegrasi
        </span>
      </div>
    </div>
  );
}
