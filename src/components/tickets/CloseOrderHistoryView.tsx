import { useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  CreditCard,
  Eye,
  FileSpreadsheet,
  Lock,
  Printer,
  QrCode,
  Receipt,
  RotateCcw,
  Search,
  Ticket,
  TrendingUp,
  User,
  Wallet,
} from 'lucide-react';
import { formatNumber, formatRupiah, generateCloseOrderRecap } from '@/lib/bookings';
import type { Booking, CloseOrderRecap } from '@/types/ticket';
import CloseOrderRecapModal from './CloseOrderRecapModal';

type CloseOrderHistoryViewProps = {
  bookings?: Booking[];
  recaps: CloseOrderRecap[];
  isSessionOpen: boolean;
  onOpenCloseOrderConfirm: () => void;
  onOpenNewSession: () => void;
  cashierName: string;
  sessionStartTime?: string;
};

export default function CloseOrderHistoryView({
  bookings = [],
  recaps,
  isSessionOpen,
  onOpenCloseOrderConfirm,
  onOpenNewSession,
  cashierName,
  sessionStartTime = '07:30 WIB',
}: CloseOrderHistoryViewProps) {
  const [selectedRecap, setSelectedRecap] = useState<CloseOrderRecap | null>(null);
  const [searchTx, setSearchTx] = useState('');

  // Financial calculations
  const totalRevenue = useMemo(
    () => bookings.reduce((sum, b) => sum + b.total, 0),
    [bookings]
  );
  const targetDaily = 15000000;
  const percentage = Math.min(100, Math.round((totalRevenue / targetDaily) * 100));

  const hariIniBookings = useMemo(
    () => bookings.filter((b) => b.bookingType === 'hari_ini'),
    [bookings]
  );
  const bookingBookings = useMemo(
    () => bookings.filter((b) => b.bookingType === 'booking'),
    [bookings]
  );

  const hariIniRevenue = useMemo(
    () => hariIniBookings.reduce((sum, b) => sum + b.total, 0),
    [hariIniBookings]
  );
  const bookingRevenue = useMemo(
    () => bookingBookings.reduce((sum, b) => sum + b.total, 0),
    [bookingBookings]
  );

  const cashRevenue = useMemo(
    () => bookings.filter((b) => b.paymentMethod === 'cash').reduce((sum, b) => sum + b.total, 0),
    [bookings]
  );
  const qrisRevenue = useMemo(
    () => bookings.filter((b) => b.paymentMethod === 'qris').reduce((sum, b) => sum + b.total, 0),
    [bookings]
  );
  const transferRevenue = useMemo(
    () =>
      bookings
        .filter((b) => b.paymentMethod === 'transfer' || b.paymentMethod === 'ewallet')
        .reduce((sum, b) => sum + b.total, 0),
    [bookings]
  );

  const filteredBookings = useMemo(() => {
    const q = searchTx.trim().toLowerCase();
    if (!q) return bookings;
    return bookings.filter(
      (b) =>
        b.code.toLowerCase().includes(q) ||
        b.visitorName.toLowerCase().includes(q) ||
        b.paymentMethod.toLowerCase().includes(q)
    );
  }, [bookings, searchTx]);

  const handleOpenCurrentPreview = () => {
    const recap = generateCloseOrderRecap(bookings, cashierName, sessionStartTime, new Date());
    setSelectedRecap(recap);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {/* ── 1. TARGET PROGRESS CARD & STATUS SESI KASIR (SIDE-BY-SIDE) ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Card Target Harian Loket (Biru Solid #286EF2) */}
        <div className="rounded-3xl border border-blue-400/30 bg-[#286EF2] p-6 text-white shadow-xl lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                Pencapaian Target Harian Loket
              </p>
              <h2 className="mt-1 text-3xl font-black sm:text-4xl tracking-tight">
                {formatRupiah(totalRevenue)}
              </h2>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
              <TrendingUp className="h-7 w-7 text-emerald-300" />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-blue-100">
              <span>Target Operasional: {formatRupiah(targetDaily)}</span>
              <span className="font-bold text-white">{percentage}% Tercapai</span>
            </div>
            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-700"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/15 pt-4 text-center">
            <div>
              <p className="text-[11px] text-blue-100 font-medium">Metode QRIS</p>
              <p className="mt-0.5 text-sm font-extrabold sm:text-base">{formatRupiah(qrisRevenue)}</p>
            </div>
            <div>
              <p className="text-[11px] text-blue-100 font-medium">Tunai / Loket</p>
              <p className="mt-0.5 text-sm font-extrabold sm:text-base">{formatRupiah(cashRevenue)}</p>
            </div>
            <div>
              <p className="text-[11px] text-blue-100 font-medium">E-Wallet / Transfer</p>
              <p className="mt-0.5 text-sm font-extrabold sm:text-base">{formatRupiah(transferRevenue)}</p>
            </div>
          </div>
        </div>

        {/* Card Status Sesi Kasir & Tombol Aksi */}
        <div className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    isSessionOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  }`}
                />
                <span
                  className={`text-xs font-black uppercase tracking-wider ${
                    isSessionOpen ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {isSessionOpen ? 'Session Open (Aktif)' : 'Session Closed (Terkunci)'}
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-400">
                {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
              </span>
            </div>

            <h3 className="mt-2 text-base font-bold text-slate-900">Status Sesi Kasir Harian</h3>
            <p className="text-xs text-slate-500">
              Petugas: <strong className="text-slate-800">{cashierName}</strong>
            </p>
            <p className="text-[11px] text-slate-400">Buka sejak: {sessionStartTime}</p>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 text-xs">
                <span className="font-medium text-slate-600">Pemesanan Hari Ini</span>
                <span className="font-extrabold text-emerald-700">{formatRupiah(hariIniRevenue)}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 text-xs">
                <span className="font-medium text-slate-600">Pemesanan Booking</span>
                <span className="font-extrabold text-[#286EF2]">{formatRupiah(bookingRevenue)}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {isSessionOpen ? (
              <button
                type="button"
                onClick={onOpenCloseOrderConfirm}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-600/25 transition hover:bg-rose-700"
              >
                <Lock className="h-4 w-4" />
                <span>Close Order (Tutup Kasir)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenNewSession}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-700"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Buka Sesi Kasir Baru</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleOpenCurrentPreview}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
            >
              <Receipt className="h-3.5 w-3.5 text-[#286EF2]" />
              <span>Format Laporan Ringkasan</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. TABEL RINCIAN TRANSAKSI PENDAPATAN SESI HARI INI ── */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card w-full">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Rincian Transaksi Pendapatan Sesi Ini
            </h3>
            <p className="text-xs text-slate-400">
              Daftar seluruh transaksi masuk yang tercatat pada sesi kasir aktif ({bookings.length} transaksi)
            </p>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="h-3.5 w-3.5" />
            </div>
            <input
              type="text"
              value={searchTx}
              onChange={(e) => setSearchTx(e.target.value)}
              placeholder="Cari kode atau nama..."
              className="w-full sm:w-56 rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#286EF2] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Kode Tiket</th>
                <th className="px-6 py-4">Nama Wisatawan</th>
                <th className="px-6 py-4">Tipe Pemesanan</th>
                <th className="px-6 py-4">Metode Bayar</th>
                <th className="px-6 py-4 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-400">
                    Tidak ada transaksi yang cocok.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="transition hover:bg-slate-50/60">
                    <td className="px-6 py-4 font-mono font-bold text-[#286EF2]">{b.code}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{b.visitorName}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          b.bookingType === 'hari_ini'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-sky-50 text-sky-700 border border-sky-200'
                        }`}
                      >
                        {b.bookingType === 'hari_ini' ? 'Hari Ini (Walk-in)' : 'Booking Mendatang'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                        {b.paymentMethod === 'qris' ? (
                          <QrCode className="h-3 w-3 text-[#286EF2]" />
                        ) : (
                          <Wallet className="h-3 w-3 text-emerald-600" />
                        )}
                        {b.paymentMethod.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-slate-900 text-sm">
                      {formatRupiah(b.total)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 3. TABEL RIWAYAT REKAPITULASI CLOSE ORDER ── */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card w-full">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#286EF2]">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Riwayat Rekapitulasi Close Order</h3>
              <p className="text-xs text-slate-400">
                Arsip laporan penutupan kasir dan ringkasan sesi otomatis per shift
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">ID Rekap</th>
                <th className="px-6 py-4">Waktu Close Order</th>
                <th className="px-6 py-4">Operator Kasir</th>
                <th className="px-6 py-4 text-center">Tiket Terjual</th>
                <th className="px-6 py-4 text-center">Transaksi</th>
                <th className="px-6 py-4 text-right">Total Pendapatan</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recaps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Belum ada riwayat close order yang tercatat.
                  </td>
                </tr>
              ) : (
                recaps.map((r) => (
                  <tr key={r.id} className="transition hover:bg-slate-50/60">
                    <td className="px-6 py-4 font-mono font-bold text-[#286EF2]">{r.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{r.closedAt}</p>
                      <p className="text-[10px] text-slate-400">Buka: {r.sessionOpenedAt}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">{r.cashierName}</td>
                    <td className="px-6 py-4 text-center font-bold text-slate-900">
                      {formatNumber(r.totalTicketsSold)} Lembar
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-slate-700">
                      {r.totalTransactions} Pesanan
                    </td>
                    <td className="px-6 py-4 text-right font-extrabold text-slate-900">
                      {formatRupiah(r.totalRevenue)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedRecap(r)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-[#286EF2] shadow-2xs transition hover:bg-blue-50 hover:border-blue-200"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Lihat Rincian</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Format Rekapan Lengkap */}
      {selectedRecap && (
        <CloseOrderRecapModal
          isOpen={true}
          onClose={() => setSelectedRecap(null)}
          recap={selectedRecap}
          onOpenNewSession={onOpenNewSession}
        />
      )}
    </div>
  );
}
