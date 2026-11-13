import {
  Calendar,
  CheckCircle2,
  Coins,
  CreditCard,
  FileSpreadsheet,
  Printer,
  Receipt,
  RotateCcw,
  User,
  Wallet,
  X,
} from 'lucide-react';
import SlantedTicket from '@/components/common/SlantedTicket';
import { formatNumber, formatRupiah } from '@/lib/bookings';
import type { CloseOrderRecap } from '@/types/ticket';

type CloseOrderRecapModalProps = {
  isOpen: boolean;
  onClose: () => void;
  recap: CloseOrderRecap;
  onOpenNewSession?: () => void;
};

export default function CloseOrderRecapModal({
  isOpen,
  onClose,
  recap,
  onOpenNewSession,
}: CloseOrderRecapModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 print:hidden"
          aria-label="Tutup"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Rekap */}
        <div className="border-b border-slate-100 pb-5 text-left">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 ring-4 ring-emerald-50">
                <Receipt className="h-6 w-6" />
              </div>
              <div>
                <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Rekapitulasi Kasir Berhasil Dibuat
                </span>
                <h2 className="mt-0.5 text-xl font-black text-slate-900 sm:text-2xl">
                  Laporan Hasil Close Order
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 print:hidden">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <Printer className="h-4 w-4 text-slate-500" />
                Cetak Rekap
              </button>
            </div>
          </div>

          {/* Metadata Card */}
          <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs sm:grid-cols-4">
            <div>
              <p className="text-[11px] text-slate-400 font-medium">ID Rekapan</p>
              <p className="mt-0.5 font-mono font-bold text-slate-900">{recap.id}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Waktu Buka Sesi</p>
              <p className="mt-0.5 font-semibold text-slate-800">{recap.sessionOpenedAt}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Waktu Close Order</p>
              <p className="mt-0.5 font-semibold text-slate-800">{recap.closedAt}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Operator / Kasir</p>
              <p className="mt-0.5 font-bold text-ocean-700">{recap.cashierName}</p>
            </div>
          </div>
        </div>

        {/* 1. Ringkasan Utama (3 Metrik) */}
        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            1. Ringkasan Utama Penerimaan
          </p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-ocean-100 bg-gradient-to-br from-[#286EF2]/10 via-sky-50/50 to-white p-4">
              <div className="flex items-center gap-2 text-ocean-700">
                <Coins className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Total Pendapatan</span>
              </div>
              <p className="mt-2 text-2xl font-black text-slate-900">{formatRupiah(recap.totalRevenue)}</p>
              <p className="mt-0.5 text-[11px] text-slate-500">Gross receipt loket tiket</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <FileSpreadsheet className="h-4 w-4 text-ocean-600" />
                <span className="text-xs font-bold uppercase tracking-wider">Total Transaksi</span>
              </div>
              <p className="mt-2 text-2xl font-black text-slate-900">{recap.totalTransactions} Pesanan</p>
              <p className="mt-0.5 text-[11px] text-slate-500">Struk transaksi terbit</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <SlantedTicket className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider">Total Tiket Terjual</span>
              </div>
              <p className="mt-2 text-2xl font-black text-slate-900">{formatNumber(recap.totalTicketsSold)} Lembar</p>
              <p className="mt-0.5 text-[11px] text-slate-500">Kapasitas pengunjung masuk</p>
            </div>
          </div>
        </div>

        {/* 2. Breakdown Tipe Pemesanan (Hari Ini vs Booking) */}
        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            2. Breakdown Tipe Pemesanan
          </p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                  Pemesanan Hari Ini (Walk-in)
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {recap.breakdownBookingType.hariIniCount} Transaksi
                </span>
              </div>
              <p className="mt-3 text-xl font-extrabold text-emerald-900">
                {formatRupiah(recap.breakdownBookingType.hariIniRevenue)}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Tiket langsung aktif dan masuk ke destinasi hari ini
              </p>
            </div>

            <div className="rounded-2xl border border-sky-100 bg-sky-50/40 p-4">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-bold text-sky-800">
                  Pemesanan Booking (Mendatang)
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {recap.breakdownBookingType.bookingCount} Transaksi
                </span>
              </div>
              <p className="mt-3 text-xl font-extrabold text-sky-900">
                {formatRupiah(recap.breakdownBookingType.bookingRevenue)}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Tiket terjadwal untuk tanggal kunjungan berikutnya
              </p>
            </div>
          </div>
        </div>

        {/* 3. Breakdown Metode Pembayaran */}
        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            3. Breakdown Metode Pembayaran
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Wallet className="h-3.5 w-3.5 text-emerald-600" />
                <span className="font-bold">Tunai (Cash)</span>
              </div>
              <p className="mt-1.5 text-sm font-extrabold text-slate-900">
                {formatRupiah(recap.breakdownPayment.cash)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-1.5 text-slate-600">
                <CreditCard className="h-3.5 w-3.5 text-[#286EF2]" />
                <span className="font-bold">QRIS Dinamis</span>
              </div>
              <p className="mt-1.5 text-sm font-extrabold text-slate-900">
                {formatRupiah(recap.breakdownPayment.qris)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Coins className="h-3.5 w-3.5 text-amber-600" />
                <span className="font-bold">E-Wallet</span>
              </div>
              <p className="mt-1.5 text-sm font-extrabold text-slate-900">
                {formatRupiah(recap.breakdownPayment.ewallet)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-1.5 text-slate-600">
                <Receipt className="h-3.5 w-3.5 text-indigo-600" />
                <span className="font-bold">Transfer Bank</span>
              </div>
              <p className="mt-1.5 text-sm font-extrabold text-slate-900">
                {formatRupiah(recap.breakdownPayment.transfer)}
              </p>
            </div>
          </div>
        </div>

        {/* 4. Breakdown per Jenis Tiket */}
        <div className="mt-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            4. Breakdown Penjualan per Jenis Tiket
          </p>
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-2.5">No</th>
                  <th className="px-4 py-2.5">Jenis Tiket</th>
                  <th className="px-4 py-2.5 text-center">Jumlah Lembar</th>
                  <th className="px-4 py-2.5 text-right">Subtotal Omset</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recap.breakdownTicketItems.map((item, index) => (
                  <tr key={item.name} className="hover:bg-slate-50/50">
                    <td className="px-4 py-2.5 font-mono text-slate-400">{index + 1}</td>
                    <td className="px-4 py-2.5 font-semibold text-slate-800">{item.name}</td>
                    <td className="px-4 py-2.5 text-center font-bold text-slate-900">{item.quantity} Lembar</td>
                    <td className="px-4 py-2.5 text-right font-extrabold text-ocean-900">
                      {formatRupiah(item.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row print:hidden">
          {onOpenNewSession && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenNewSession();
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Buka Sesi Kasir Baru (Shift Berikutnya)</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Selesai &amp; Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

