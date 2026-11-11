import { useState, type FormEvent } from 'react';
import { CheckCircle2, ScanLine, ShieldAlert, XCircle } from 'lucide-react';
import { formatRupiah, formatVisitDate } from '@/lib/bookings';
import type { ValidationResult } from '@/types/ticket';

type ValidateTicketProps = {
  onValidate: (code: string) => ValidationResult;
};

export default function ValidateTicket({ onValidate }: ValidateTicketProps) {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [formError, setFormError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!code.trim()) {
      setFormError('Masukkan kode tiket terlebih dahulu');
      setResult(null);
      return;
    }
    setFormError('');
    setResult(onValidate(code));
  };

  const booking = result && result.kind !== 'not_found' ? result.booking : null;

  return (
    <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6">
      <section className="rounded-3xl border border-ocean-100 bg-white p-5 shadow-card sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ocean-50 text-ocean-600">
            <ScanLine className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-ocean-900">Validasi Tiket Pengunjung</h2>
            <p className="text-sm text-slate-500">Masukkan kode tiket yang ditunjukkan pengunjung.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            value={code}
            onChange={(event) => {
              setCode(event.target.value);
              setFormError('');
            }}
            placeholder="TK-20261108-001"
            aria-label="Kode tiket"
            aria-invalid={!!formError}
            className="flex-1 rounded-xl border border-ocean-100 bg-ocean-50/50 px-4 py-3 font-mono text-sm uppercase tracking-wider text-slate-800 placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400 transition focus:border-ocean-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-ocean-100"
          />
          <button
            type="submit"
            className="rounded-xl bg-ocean-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-ocean-600/25 transition hover:-translate-y-0.5 hover:bg-ocean-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-ocean-200"
          >
            Validasi
          </button>
        </form>
        {formError && <p className="mt-3 text-sm text-rose-500">{formError}</p>}
      </section>

      {result && (
        <section
          role="status"
          className={`animate-fade-in-up rounded-3xl border p-6 shadow-card sm:p-8 ${
            result.kind === 'valid' ? 'border-emerald-200 bg-emerald-50/60' : 'border-rose-200 bg-rose-50/60'
          }`}
        >
          {result.kind === 'not_found' && (
            <div className="flex items-start gap-4">
              <XCircle className="mt-0.5 h-7 w-7 shrink-0 text-rose-500" />
              <div>
                <p className="font-bold text-rose-700">Kode tiket tidak ditemukan</p>
                <p className="mt-1 text-sm text-rose-600/80">Periksa kembali kode yang dimasukkan pengunjung.</p>
              </div>
            </div>
          )}

          {result.kind === 'already_validated' && (
            <div className="flex items-start gap-4">
              <ShieldAlert className="mt-0.5 h-7 w-7 shrink-0 text-amber-500" />
              <div>
                <p className="font-bold text-amber-700">Tiket sudah pernah divalidasi</p>
                <p className="mt-1 text-sm text-amber-700/80">Tiket ini tidak dapat digunakan untuk masuk lagi.</p>
              </div>
            </div>
          )}

          {result.kind === 'valid' && (
            <div className="flex items-start gap-4">
              <CheckCircle2 className="mt-0.5 h-7 w-7 shrink-0 text-emerald-500" />
              <div>
                <p className="font-bold text-emerald-700">Tiket valid, silakan masuk</p>
                <p className="mt-1 text-sm text-emerald-700/80">Tiket berhasil ditandai sebagai sudah digunakan.</p>
              </div>
            </div>
          )}

          {booking && (
            <dl className="mt-6 grid grid-cols-1 gap-3 rounded-2xl bg-white/80 p-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">Nama</dt>
                <dd className="font-semibold text-ocean-900">{booking.visitorName}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Kode</dt>
                <dd className="font-mono font-semibold text-ocean-900">{booking.code}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Tanggal kunjungan</dt>
                <dd className="font-semibold text-ocean-900">{formatVisitDate(booking.visitDate)}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Jumlah tiket</dt>
                <dd className="font-semibold text-ocean-900">
                  {booking.items.map((item) => `${item.quantity} ${item.name}`).join(', ')}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-slate-500">Total</dt>
                <dd className="font-semibold text-ocean-700">{formatRupiah(booking.total)}</dd>
              </div>
            </dl>
          )}
        </section>
      )}
    </div>
  );
}
