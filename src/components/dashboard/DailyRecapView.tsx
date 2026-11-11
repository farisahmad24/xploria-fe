import {
  Calendar,
  QrCode,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { formatRupiah } from '@/lib/bookings';
import type { Booking } from '@/types/ticket';

type DailyRecapViewProps = {
  bookings: Booking[];
  onToast: (message: string) => void;
};

export default function DailyRecapView({ bookings, onToast }: DailyRecapViewProps) {
  // Calculations
  const totalRevenue = bookings.reduce((sum, b) => sum + b.total, 0);
  const targetDaily = 15000000;
  const currentDailyRevenue = Math.round(totalRevenue * 0.32); // Today's portion
  const percentage = Math.min(100, Math.round((currentDailyRevenue / targetDaily) * 100));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-ocean-600">
            Aktor Pengelola (Admin) • Dashboard
          </p>
          <h1 className="mt-1 text-2xl font-bold text-ocean-900 sm:text-3xl">
            Rekap Pendapatan Harian
          </h1>
          <p className="text-sm text-slate-500">
            Laporan dan rekonsiliasi kas loket tiket harian real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2 shadow-card">
          <Calendar className="h-4 w-4 text-ocean-600" />
          <span className="text-xs font-bold text-slate-700">Tanggal: 11 November 2026</span>
        </div>
      </div>

      {/* Target Progress Card */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-ocean-100 bg-gradient-to-br from-ocean-700 via-ocean-800 to-ocean-900 p-6 text-white shadow-xl lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ocean-200">
                Pencapaian Target Harian Loket
              </p>
              <h2 className="mt-1 text-3xl font-extrabold sm:text-4xl">
                {formatRupiah(currentDailyRevenue)}
              </h2>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <TrendingUp className="h-7 w-7 text-emerald-400" />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-ocean-200">
              <span>Target: {formatRupiah(targetDaily)}</span>
              <span className="font-bold text-white">{percentage}% Tercapai</span>
            </div>
            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-700"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/10 pt-4 text-center">
            <div>
              <p className="text-[11px] text-ocean-200">Metode QRIS</p>
              <p className="mt-0.5 text-sm font-bold sm:text-base">
                {formatRupiah(Math.round(currentDailyRevenue * 0.65))}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-ocean-200">Tunai / Loket</p>
              <p className="mt-0.5 text-sm font-bold sm:text-base">
                {formatRupiah(Math.round(currentDailyRevenue * 0.25))}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-ocean-200">Transfer Bank</p>
              <p className="mt-0.5 text-sm font-bold sm:text-base">
                {formatRupiah(Math.round(currentDailyRevenue * 0.1))}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Summary Card */}
        <div className="flex flex-col justify-between rounded-3xl border border-ocean-100 bg-white p-6 shadow-card">
          <div>
            <h3 className="text-base font-bold text-slate-900">Status Tutup Buku Harian</h3>
            <p className="text-xs text-slate-500">Rekonsiliasi loket tiket shift pagi & siang.</p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs">
                <span className="font-medium text-slate-600">Shift Pagi (07:00 - 12:00)</span>
                <span className="font-bold text-emerald-600">Tervalidasi ✓</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs">
                <span className="font-medium text-slate-600">Shift Siang (12:00 - 18:00)</span>
                <span className="font-bold text-amber-600">Sedang Berjalan</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onToast('Proses tutup buku loket shift akan dicetak')}
            className="mt-6 w-full rounded-xl bg-ocean-50 py-2.5 text-xs font-bold text-ocean-700 transition hover:bg-ocean-100"
          >
            Rekonsiliasi Kas Sekarang
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="overflow-hidden rounded-3xl border border-ocean-100 bg-white shadow-card">
        <div className="border-b border-ocean-50 p-6">
          <h3 className="text-lg font-bold text-slate-900">Rincian Transaksi Pendapatan Hari Ini</h3>
          <p className="text-sm text-slate-500">Daftar pembayaran tiket masuk terverifikasi.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-ocean-50/70 text-xs font-semibold uppercase tracking-wider text-ocean-800">
              <tr>
                <th className="px-6 py-4">Kode Tiket</th>
                <th className="px-6 py-4">Nama Wisatawan</th>
                <th className="px-6 py-4">Jumlah Tiket</th>
                <th className="px-6 py-4">Metode Bayar</th>
                <th className="px-6 py-4 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.slice(0, 6).map((b, idx) => (
                <tr key={b.id} className="hover:bg-ocean-50/30">
                  <td className="px-6 py-4 font-mono font-bold text-ocean-700">{b.code}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{b.visitorName}</td>
                  <td className="px-6 py-4">
                    {b.items.reduce((acc, it) => acc + it.quantity, 0)} Lembar
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                      {idx % 2 === 0 ? <QrCode className="h-3 w-3" /> : <Wallet className="h-3 w-3" />}
                      {idx % 2 === 0 ? 'QRIS' : 'Tunai Loket'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">
                    {formatRupiah(b.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
