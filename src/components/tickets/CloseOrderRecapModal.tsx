import {
  Banknote,
  Landmark,
  Printer,
  QrCode,
  RotateCcw,
  Smartphone,
  X,
} from 'lucide-react';
import { formatNumber, formatRupiah } from '@/lib/bookings';
import type { CloseOrderRecap } from '@/types/ticket';

type CloseOrderRecapModalProps = {
  isOpen: boolean;
  onClose: () => void;
  recap: CloseOrderRecap;
  onOpenNewSession?: () => void;
};

function SectionTitle({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
      <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-900 text-[10px] font-bold text-white">
        {number}
      </span>
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">{title}</h3>
    </div>
  );
}

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

  const itemTotalQty = recap.breakdownTicketItems.reduce((sum, item) => sum + item.quantity, 0);
  const itemTotalRevenue = recap.breakdownTicketItems.reduce((sum, item) => sum + item.revenue, 0);

  const paymentRows = [
    { label: 'Tunai (Cash)', value: recap.breakdownPayment.cash, Icon: Banknote },
    { label: 'QRIS Dinamis', value: recap.breakdownPayment.qris, Icon: QrCode },
    { label: 'E-Wallet', value: recap.breakdownPayment.ewallet, Icon: Smartphone },
    { label: 'Transfer Bank', value: recap.breakdownPayment.transfer, Icon: Landmark },
  ];

  return (
    <div className="recap-print-root fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <div className="print:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="recap-print-dialog relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header Dokumen */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 px-6 py-5 sm:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-700">
              Rekapitulasi Kasir Berhasil Dibuat
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">Laporan Hasil Close Order</h2>
          </div>

          <div className="flex items-center gap-2 pr-10 print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Printer className="h-4 w-4 text-slate-500" />
              Cetak Rekap
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 print:hidden"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-6 sm:px-8">
          {/* Metadata */}
          <dl className="grid grid-cols-2 divide-x divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 text-xs sm:grid-cols-4 sm:divide-y-0">
            <div className="p-3">
              <dt className="text-[11px] font-medium text-slate-500">ID Rekapan</dt>
              <dd className="mt-1 font-mono font-semibold text-slate-900">{recap.id}</dd>
            </div>
            <div className="p-3">
              <dt className="text-[11px] font-medium text-slate-500">Waktu Buka Sesi</dt>
              <dd className="mt-1 font-semibold text-slate-900">{recap.sessionOpenedAt}</dd>
            </div>
            <div className="p-3">
              <dt className="text-[11px] font-medium text-slate-500">Waktu Close Order</dt>
              <dd className="mt-1 font-semibold text-slate-900">{recap.closedAt}</dd>
            </div>
            <div className="p-3">
              <dt className="text-[11px] font-medium text-slate-500">Operator / Kasir</dt>
              <dd className="mt-1 font-semibold text-slate-900">{recap.cashierName}</dd>
            </div>
          </dl>

          {/* 1. Ringkasan Utama */}
          <section className="mt-7">
            <SectionTitle number={1} title="Ringkasan Utama Penerimaan" />
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Total Pendapatan</p>
                <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">
                  {formatRupiah(recap.totalRevenue)}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">Gross receipt loket tiket</p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Total Transaksi</p>
                <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">
                  {formatNumber(recap.totalTransactions)} Pesanan
                </p>
                <p className="mt-1 text-[11px] text-slate-500">Struk transaksi terbit</p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Total Tiket Terjual</p>
                <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">
                  {formatNumber(recap.totalTicketsSold)} Lembar
                </p>
                <p className="mt-1 text-[11px] text-slate-500">Kapasitas pengunjung masuk</p>
              </div>
            </div>
          </section>

          {/* 2. Tipe Pemesanan */}
          <section className="mt-7">
            <SectionTitle number={2} title="Breakdown Tipe Pemesanan" />
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Pemesanan Hari Ini</span>
                  <span className="text-xs font-medium tabular-nums text-slate-500">
                    {recap.breakdownBookingType.hariIniCount} Transaksi
                  </span>
                </div>
                <p className="mt-3 text-xl font-bold tabular-nums text-slate-900">
                  {formatRupiah(recap.breakdownBookingType.hariIniRevenue)}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">Tiket langsung aktif dan masuk ke destinasi hari ini</p>
              </div>

              <div className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Pemesanan Mendatang</span>
                  <span className="text-xs font-medium tabular-nums text-slate-500">
                    {recap.breakdownBookingType.bookingCount} Transaksi
                  </span>
                </div>
                <p className="mt-3 text-xl font-bold tabular-nums text-slate-900">
                  {formatRupiah(recap.breakdownBookingType.bookingRevenue)}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">Tiket terjadwal untuk tanggal kunjungan berikutnya</p>
              </div>
            </div>
          </section>

          {/* 3. Metode Pembayaran */}
          <section className="mt-7">
            <SectionTitle number={3} title="Breakdown Metode Pembayaran" />
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {paymentRows.map(({ label, value, Icon }) => (
                <div key={label} className="rounded-lg border border-slate-200 p-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                    <Icon className="h-3.5 w-3.5 text-slate-400" />
                    <span>{label}</span>
                  </div>
                  <p className="mt-2 text-sm font-bold tabular-nums text-slate-900">{formatRupiah(value)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Penjualan per Jenis Tiket */}
          <section className="mt-7">
            <SectionTitle number={4} title="Breakdown Penjualan per Jenis Tiket" />
            <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                  <tr>
                    <th className="w-14 px-4 py-2.5">No</th>
                    <th className="px-4 py-2.5">Jenis Tiket</th>
                    <th className="px-4 py-2.5 text-center">Jumlah Lembar</th>
                    <th className="px-4 py-2.5 text-right">Subtotal Omset</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recap.breakdownTicketItems.map((item, index) => (
                    <tr key={item.name}>
                      <td className="px-4 py-2.5 tabular-nums text-slate-500">{index + 1}</td>
                      <td className="px-4 py-2.5 font-medium text-slate-900">{item.name}</td>
                      <td className="px-4 py-2.5 text-center tabular-nums">{formatNumber(item.quantity)} Lembar</td>
                      <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-slate-900">
                        {formatRupiah(item.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-slate-300 bg-slate-50 font-bold text-slate-900">
                  <tr>
                    <td className="px-4 py-2.5" colSpan={2}>
                      Total
                    </td>
                    <td className="px-4 py-2.5 text-center tabular-nums">{formatNumber(itemTotalQty)} Lembar</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{formatRupiah(itemTotalRevenue)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row print:hidden">
            {onOpenNewSession && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenNewSession();
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 text-xs font-semibold text-white transition hover:bg-emerald-700"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Buka Sesi Kasir Baru (Shift Berikutnya)</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 py-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Selesai &amp; Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
