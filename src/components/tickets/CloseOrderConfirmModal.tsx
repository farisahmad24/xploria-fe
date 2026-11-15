import { AlertTriangle, Lock, X } from 'lucide-react';
import { formatNumber, formatRupiah } from '@/lib/bookings';
import type { mendatang } from '@/types/ticket';

type CloseOrderConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookings: mendatang[];
  cashierName: string;
};

export default function CloseOrderConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  bookings,
  cashierName,
}: CloseOrderConfirmModalProps) {
  if (!isOpen) return null;

  const totalRevenue = bookings.reduce((sum, b) => sum + b.total, 0);
  const totalTickets = bookings.reduce(
    (sum, b) => sum + b.items.reduce((s, it) => s + it.quantity, 0),
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-7">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100"
          aria-label="Tutup"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 ring-4 ring-rose-50">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Konfirmasi Close Order</h3>
            <p className="text-xs text-slate-500">Tutup sesi kasir &amp; buat rekapan otomatis</p>
          </div>
        </div>

        {/* Warning Callout */}
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <p className="text-xs leading-relaxed text-amber-900">
              Perhatian: Menutup order akan <strong>mengunci sesi transaksi kasir</strong>. Tidak ada transaksi baru yang dapat diproses sampai Anda membuka sesi kasir baru.
            </p>
          </div>
        </div>

        {/* Quick Snapshot */}
        <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs space-y-2">
          <div className="flex justify-between text-slate-600">
            <span>Petugas Kasir:</span>
            <span className="font-bold text-slate-900">{cashierName}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Total Transaksi Sesi Ini:</span>
            <span className="font-bold text-slate-900">{bookings.length} Transaksi</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Total Tiket Terjual:</span>
            <span className="font-bold text-slate-900">{formatNumber(totalTickets)} Lembar</span>
          </div>
          <div className="flex justify-between border-t border-slate-200/80 pt-2 text-sm font-extrabold text-ocean-950">
            <span>Total Penerimaan Kas:</span>
            <span className="text-ocean-700">{formatRupiah(totalRevenue)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-rose-600 py-3 text-xs font-bold text-white shadow-lg shadow-rose-600/25 transition hover:bg-rose-700"
          >
            Ya, Close Order Sesi
          </button>
        </div>
      </div>
    </div>
  );
}

