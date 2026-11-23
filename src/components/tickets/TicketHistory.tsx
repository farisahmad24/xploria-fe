import { useMemo, useState } from 'react';
import {
  Barcode as BarcodeIcon,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  History,
  Printer,
  Receipt,
  User,
  X,
} from 'lucide-react';
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
  const [selectedBooking, setSelectedBooking] = useState<mendatang | null>(null);

  const visible = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchType = typeFilter === 'all' || b.bookingType === typeFilter;
      const invoice = b.invoiceNo || '';
      const barcode = b.barcode || '';
      const matchSearch =
        b.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
        barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                Menampilkan {visible.length} dari total {bookings.length} transaksi pemesanan (Dilengkapi No Invoice, No Pesanan, Barcode &amp; E-Tiket)
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
                <option value="hari_ini">Pemesanan Hari ini</option>
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
                placeholder="Cari invoice, kode, barcode, nama..."
                className="w-full sm:w-56 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-[#286EF2] focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Table View dengan Fixed Width Column */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full min-w-[1080px] table-fixed text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th className="w-48 px-5 py-4">No Invoice &amp; Pesanan</th>
                <th className="w-48 px-5 py-4">Pengunjung</th>
                <th className="w-36 px-5 py-4">Tgl Kunjungan</th>
                <th className="w-36 px-5 py-4">Barcode E-Tiket</th>
                <th className="w-28 px-5 py-4 text-center">Jumlah Tiket</th>
                <th className="w-36 px-5 py-4 text-right whitespace-nowrap">Total Harga</th>
                <th className="w-36 px-5 py-4 text-center">Status</th>
                <th className="w-28 px-4 py-4 text-center">Aksi</th>
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
                visible.map((b) => {
                  const quantity = b.ticketCount ?? b.items.reduce((sum, item) => sum + item.quantity, 0);
                  const status = statusStyle[b.status] || statusStyle.booked;
                  const invoice = b.invoiceNo || `INV-${b.code}`;
                  const orderCode = b.orderNo || b.code;
                  const barcodeCode = b.barcode || `BC-${b.code}`;
                  const totalPrice = b.totalPrice ?? b.total;

                  return (
                    <tr key={b.id} className="transition-colors hover:bg-slate-50/60">
                      <td className="w-48 px-5 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono text-xs font-black text-slate-900" title="11. No Invoice">
                            {invoice}
                          </span>
                          <span className="font-mono text-[11px] font-bold text-[#286EF2]" title="12. No Pesanan">
                            #{orderCode}
                          </span>
                        </div>
                      </td>
                      <td className="w-48 px-5 py-4">
                        <p className="font-bold text-slate-900 truncate">{b.visitorName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{b.phone}</p>
                      </td>
                      <td className="w-36 px-5 py-4">
                        <div className="flex items-center gap-1.5 font-medium text-slate-700">
                          <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{formatVisitDate(b.visitDate)}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {b.bookingType === 'hari_ini' ? 'Hari Ini' : 'Mendatang'}
                        </span>
                      </td>
                      <td className="w-36 px-5 py-4">
                        <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-mono font-bold text-slate-800 border border-slate-200/80">
                          <BarcodeIcon className="h-3.5 w-3.5 text-slate-600" />
                          <span>{barcodeCode}</span>
                        </div>
                      </td>
                      <td className="w-28 px-5 py-4 text-center font-bold text-slate-800">
                        {quantity} lembar
                      </td>
                      <td className="w-36 px-5 py-4 text-right font-extrabold text-slate-900 whitespace-nowrap">
                        {formatRupiah(totalPrice)}
                      </td>
                      <td className="w-36 px-5 py-4 text-center">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="w-28 px-4 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedBooking(b)}
                          className="inline-flex items-center gap-1 rounded-xl bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-[#286EF2] hover:bg-blue-100 transition shadow-2xs"
                          title="Lihat Detail E-Tiket & Faktur"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Detail</span>
                        </button>
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
                  ? 'Hari ini'
                  : 'Mendatang'}
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

      {/* MODAL DETAIL TRANSAKSI & E-TIKET (Memenuhi Data Informasi Tiket 11 - 16) */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedBooking(null)}
          />
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setSelectedBooking(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#286EF2] ring-1 ring-blue-100">
                <Receipt className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">E-Tiket &amp; Faktur Pembayaran</h3>
                <p className="text-xs text-slate-500">
                  Rincian resmi data transaksi tiket pengunjung Pantai Drini.
                </p>
              </div>
            </div>

            {/* Content: 6 Parameter Transaksi / E-Tiket (11 - 16) */}
            <div className="mt-5 space-y-4">
              {/* Barcode Visual Representation */}
              <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/70 p-5 text-center">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  14. Barcode E-Tiket Masuk
                </p>
                {/* Simulated Barcode lines */}
                <div className="flex h-14 items-center justify-center gap-1 bg-white px-6 py-2 rounded-xl border border-slate-200 shadow-2xs">
                  {[2, 4, 1, 3, 2, 5, 2, 1, 4, 2, 3, 1, 5, 2, 1, 3, 4, 2, 1, 3, 2, 4, 1, 3].map((w, idx) => (
                    <div
                      key={idx}
                      className="h-10 bg-slate-900"
                      style={{ width: `${w}px` }}
                    />
                  ))}
                </div>
                <p className="mt-2 font-mono text-sm font-black tracking-widest text-slate-800">
                  {selectedBooking.barcode || `BC-${selectedBooking.code}`}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  Pindai barcode ini di scanner turnstile atau tunjukkan ke petugas loket.
                </p>
              </div>

              {/* 6 Key Specifications Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    11. No Invoice
                  </span>
                  <p className="mt-1 font-mono text-sm font-black text-slate-900">
                    {selectedBooking.invoiceNo || `INV-${selectedBooking.code}`}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    12. No Pesanan
                  </span>
                  <p className="mt-1 font-mono text-sm font-black text-[#286EF2]">
                    #{selectedBooking.orderNo || selectedBooking.code}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    16. Tanggal Kunjungan
                  </span>
                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {formatVisitDate(selectedBooking.visitDate)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    15. Jumlah Tiket
                  </span>
                  <p className="mt-1 text-sm font-black text-slate-900">
                    {selectedBooking.ticketCount ??
                      selectedBooking.items.reduce((s, i) => s + i.quantity, 0)}{' '}
                    Lembar
                  </p>
                </div>
              </div>

              {/* Total Harga Card (Field 13) */}
              <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    13. Total Harga
                  </span>
                  <p className="text-xs text-emerald-700">Sudah termasuk pajak &amp; asuransi pengunjung</p>
                </div>
                <p className="text-xl font-black text-emerald-800">
                  {formatRupiah(selectedBooking.totalPrice ?? selectedBooking.total)}
                </p>
              </div>

              {/* Detail Pengunjung & Item Tiket */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-600">Nama Pemesan:</span>
                  <span className="font-bold text-slate-900">{selectedBooking.visitorName} ({selectedBooking.phone})</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-600">Metode Pembayaran:</span>
                  <span className="font-bold text-slate-900 uppercase">{selectedBooking.paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-600">Status Check-In:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                      selectedBooking.status === 'validated'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    {selectedBooking.status === 'validated' ? 'Tervalidasi / Masuk' : 'Menunggu Kehadiran'}
                  </span>
                </div>

                {/* Items */}
                <div className="pt-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Daftar Tiket Terbeli:
                  </p>
                  <div className="space-y-1.5">
                    {selectedBooking.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-slate-700">
                        <span>{item.name} x {item.quantity}</span>
                        <span className="font-bold">{formatRupiah(item.unitPrice * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action: Cetak / Tutup */}
              <div className="mt-4 flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#286EF2] py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:bg-blue-700"
                >
                  <Printer className="h-4 w-4" />
                  <span>Cetak E-Tiket / Faktur</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
