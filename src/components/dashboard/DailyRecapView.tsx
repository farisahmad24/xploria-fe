import { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  CreditCard,
  FileSpreadsheet,
  Lock,
  QrCode,
  Receipt,
  RotateCcw,
  Ticket,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import CloseOrderConfirmModal from '@/components/tickets/CloseOrderConfirmModal';
import CloseOrderRecapModal from '@/components/tickets/CloseOrderRecapModal';
import { initialCloseOrderRecaps } from '@/data/seedCloseOrders';
import { formatNumber, formatRupiah, generateCloseOrderRecap } from '@/lib/bookings';
import type { mendatang, CloseOrderRecap } from '@/types/ticket';

type DailyRecapViewProps = {
  bookings: mendatang[];
  onToast: (message: string) => void;
};

export default function DailyRecapView({ bookings, onToast }: DailyRecapViewProps) {
  const [isSessionOpen, setIsSessionOpen] = useState(true);
  const [sessionStartTime, setSessionStartTime] = useState('07:30 WIB');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [activeRecapModal, setActiveRecapModal] = useState<CloseOrderRecap | null>(null);

  // Calculations
  const totalRevenue = bookings.reduce((sum, b) => sum + b.total, 0);
  const targetDaily = 15000000;
  const percentage = Math.min(100, Math.round((totalRevenue / targetDaily) * 100));

  const hariIniBookings = bookings.filter((b) => b.bookingType === 'hari_ini');
  const bookingBookings = bookings.filter((b) => b.bookingType === 'mendatang');

  const hariIniRevenue = hariIniBookings.reduce((sum, b) => sum + b.total, 0);
  const bookingRevenue = bookingBookings.reduce((sum, b) => sum + b.total, 0);

  const cashRevenue = bookings
    .filter((b) => b.paymentMethod === 'cash')
    .reduce((sum, b) => sum + b.total, 0);
  const qrisRevenue = bookings
    .filter((b) => b.paymentMethod === 'qris')
    .reduce((sum, b) => sum + b.total, 0);
  const transferRevenue = bookings
    .filter((b) => b.paymentMethod === 'transfer' || b.paymentMethod === 'ewallet')
    .reduce((sum, b) => sum + b.total, 0);

  const handleExecuteCloseOrder = () => {
    const recap = generateCloseOrderRecap(bookings, 'M. Hasan Al-Farisi (Admin)', sessionStartTime, new Date());
    setIsSessionOpen(false);
    setConfirmModalOpen(false);
    setActiveRecapModal(recap);
    onToast(`Close Order berhasil! Rekapan otomatis ${recap.id} telah dibuat.`);
  };

  const handleOpenNewSession = () => {
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setIsSessionOpen(true);
    setSessionStartTime(`${nowTime} WIB`);
    setActiveRecapModal(null);
    onToast('Sesi kasir baru berhasil dibuka.');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-ocean-600">
            Aktor Pengelola (Admin) • Dashboard
          </p>
          <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl tracking-tight">
            Rekap Pendapatan Harian &amp; Sesi Kasir
          </h1>
          <p className="text-sm text-slate-500">
            Pantau arus penerimaan loket kasir real-time, breakdown pembayaran, dan tutup sesi harian.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-card border border-slate-100">
            <Calendar className="h-4 w-4 text-ocean-600" />
            <span className="text-xs font-bold text-slate-700">Tanggal: 11 November 2026</span>
          </div>

          {isSessionOpen ? (
            <button
              type="button"
              onClick={() => setConfirmModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/25 transition hover:bg-rose-700"
            >
              <Lock className="h-4 w-4" />
              <span>Close Order Sesi</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenNewSession}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Buka Sesi Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Target Progress Card */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-blue-400/30 bg-[#286EF2] p-6 text-white shadow-xl lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ocean-200">
                Pencapaian Target Harian Loket
              </p>
              <h2 className="mt-1 text-3xl font-extrabold sm:text-4xl">
                {formatRupiah(totalRevenue)}
              </h2>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <TrendingUp className="h-7 w-7 text-emerald-400" />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-ocean-200">
              <span>Target Operasional: {formatRupiah(targetDaily)}</span>
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
              <p className="mt-0.5 text-sm font-bold sm:text-base">{formatRupiah(qrisRevenue)}</p>
            </div>
            <div>
              <p className="text-[11px] text-ocean-200">Tunai / Loket</p>
              <p className="mt-0.5 text-sm font-bold sm:text-base">{formatRupiah(cashRevenue)}</p>
            </div>
            <div>
              <p className="text-[11px] text-ocean-200">E-Wallet / Transfer</p>
              <p className="mt-0.5 text-sm font-bold sm:text-base">{formatRupiah(transferRevenue)}</p>
            </div>
          </div>
        </div>

        {/* Status Sesi Kasir Card */}
        <div className="flex flex-col justify-between rounded-3xl border border-ocean-100 bg-white p-6 shadow-card">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${isSessionOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  }`}
              />
              <span
                className={`text-xs font-black uppercase tracking-wider ${isSessionOpen ? 'text-emerald-700' : 'text-rose-700'
                  }`}
              >
                {isSessionOpen ? 'Session Open (Aktif)' : 'Session Closed (Terkunci)'}
              </span>
            </div>
            <h3 className="mt-1 text-base font-bold text-slate-900">Status Sesi Kasir Harian</h3>
            <p className="text-xs text-slate-500">Buka sejak: {sessionStartTime}</p>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs">
                <span className="font-medium text-slate-600">Pemesanan Hari ini</span>
                <span className="font-extrabold text-emerald-700">{formatRupiah(hariIniRevenue)}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs">
                <span className="font-medium text-slate-600">Pemesanan mendatang</span>
                <span className="font-extrabold text-sky-700">{formatRupiah(bookingRevenue)}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const recap = generateCloseOrderRecap(bookings, 'M. Hasan Al-Farisi (Admin)', sessionStartTime, new Date());
              setActiveRecapModal(recap);
            }}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-ocean-50 py-2.5 text-xs font-bold text-ocean-700 transition hover:bg-ocean-100"
          >
            <Receipt className="h-4 w-4" />
            <span>Lihat Format Rekapan Lengkap</span>
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="overflow-hidden rounded-3xl border border-ocean-100 bg-white shadow-card">
        <div className="border-b border-ocean-50 p-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Rincian Transaksi Pendapatan Hari Ini</h3>
            <p className="text-sm text-slate-500">Daftar pembayaran tiket masuk terverifikasi pada sesi ini.</p>
          </div>
          <span className="text-xs font-bold text-slate-400">Total: {bookings.length} Transaksi</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-ocean-50/70 text-xs font-semibold uppercase tracking-wider text-ocean-800">
              <tr>
                <th className="px-6 py-4">Kode Tiket</th>
                <th className="px-6 py-4">Nama Wisatawan</th>
                <th className="px-6 py-4">Tipe Pemesanan</th>
                <th className="px-6 py-4">Metode Bayar</th>
                <th className="px-6 py-4 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-ocean-50/30">
                  <td className="px-6 py-4 font-mono font-bold text-ocean-700">{b.code}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{b.visitorName}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${b.bookingType === 'hari_ini'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-sky-100 text-sky-800'
                        }`}
                    >
                      {b.bookingType === 'hari_ini' ? 'Hari ini' : 'Mendatang'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                      {b.paymentMethod === 'qris' ? (
                        <QrCode className="h-3 w-3" />
                      ) : (
                        <Wallet className="h-3 w-3" />
                      )}
                      {b.paymentMethod.toUpperCase()}
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

      {/* Close Order Confirm Modal */}
      <CloseOrderConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleExecuteCloseOrder}
        bookings={bookings}
        cashierName="M. Hasan Al-Farisi (Admin)"
      />

      {/* Automatic Recap Modal */}
      {activeRecapModal && (
        <CloseOrderRecapModal
          isOpen={true}
          onClose={() => setActiveRecapModal(null)}
          recap={activeRecapModal}
          onOpenNewSession={handleOpenNewSession}
        />
      )}
    </div>
  );
}
