import { useMemo, useState, type FormEvent } from 'react';
import {
  CheckCircle2,
  Clock,
  Filter,
  QrCode,
  ScanLine,
  Search,
  ShieldAlert,
  Sparkles,
  Ticket,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react';
import { formatNumber, formatRupiah, formatVisitDate } from '@/lib/bookings';
import type { Booking, ValidationResult } from '@/types/ticket';

type ValidateTicketProps = {
  onValidate: (code: string) => ValidationResult;
  bookings?: Booking[];
};

export default function ValidateTicket({ onValidate, bookings = [] }: ValidateTicketProps) {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [formError, setFormError] = useState('');
  const [searchLog, setSearchLog] = useState('');

  // Validated tickets data
  const validatedBookings = useMemo(
    () => bookings.filter((b) => b.status === 'validated'),
    [bookings]
  );
  const pendingBookings = useMemo(
    () => bookings.filter((b) => b.status === 'booked'),
    [bookings]
  );

  const totalValidatedCount = useMemo(
    () => validatedBookings.reduce((sum, b) => sum + b.items.reduce((s, it) => s + it.quantity, 0), 0),
    [validatedBookings]
  );
  const totalPendingCount = useMemo(
    () => pendingBookings.reduce((sum, b) => sum + b.items.reduce((s, it) => s + it.quantity, 0), 0),
    [pendingBookings]
  );

  const filteredLog = useMemo(() => {
    const q = searchLog.trim().toLowerCase();
    if (!q) return validatedBookings;
    return validatedBookings.filter(
      (b) =>
        b.code.toLowerCase().includes(q) ||
        b.visitorName.toLowerCase().includes(q) ||
        b.items.some((it) => it.name.toLowerCase().includes(q))
    );
  }, [validatedBookings, searchLog]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!code.trim()) {
      setFormError('Masukkan kode tiket terlebih dahulu');
      setResult(null);
      return;
    }
    setFormError('');
    setResult(onValidate(code.trim()));
  };

  const booking = result && result.kind !== 'not_found' ? result.booking : null;

  return (
    <div className="flex w-full flex-col gap-6">
      {/* ── 1. STATISTIK RINGKASAN GERBANG VALIDASI ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tiket Tervalidasi Masuk
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
            {formatNumber(totalValidatedCount)}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {validatedBookings.length} transaksi lolos check-in
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tiket Belum Masuk / Antre
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-[#286EF2]">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
            {formatNumber(totalPendingCount)}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-400">
            {pendingBookings.length} pesanan menunggu kehadiran
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Status Pintu Masuk
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#286EF2]">
              <ScanLine className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-lg font-black text-emerald-700">Online &amp; Siap</p>
          </div>
          <p className="mt-1 text-xs font-medium text-slate-400">Scanner gerbang 1 &amp; 2 terhubung</p>
        </div>
      </div>

      {/* ── 2. CARD INPUT / SCANNER KODE TIKET (FULL-WIDTH) ── */}
      <section className="w-full rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#286EF2] ring-1 ring-blue-100">
              <ScanLine className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Validasi Tiket Masuk Gerbang</h2>
              <p className="text-xs text-slate-500">
                Arahkan scanner ke QR Code atau ketik kode tiket pengunjung untuk verifikasi check-in.
              </p>
            </div>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Sistem Scanner Aktif
          </span>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <QrCode className="h-4 w-4" />
            </div>
            <input
              value={code}
              onChange={(event) => {
                setCode(event.target.value);
                setFormError('');
              }}
              placeholder="Contoh: TK-20261108-001 (atau scan QR)"
              aria-label="Kode tiket"
              aria-invalid={!!formError}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3.5 pl-11 pr-4 font-mono text-sm uppercase tracking-wider text-slate-800 placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400 transition focus:border-[#286EF2] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#286EF2] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 focus:outline-none shrink-0"
          >
            <ScanLine className="h-4 w-4" />
            <span>Verifikasi &amp; Check-In</span>
          </button>
        </form>
        {formError && <p className="mt-3 text-sm font-semibold text-rose-500">{formError}</p>}
      </section>

      {/* ── 3. HASIL REAL-TIME VALIDASI (JIKA ADA AKSI) ── */}
      {result && (
        <section
          role="status"
          className={`animate-fade-in-up w-full rounded-3xl border p-6 shadow-card sm:p-8 ${
            result.kind === 'valid' ? 'border-emerald-200 bg-emerald-50/60' : 'border-rose-200 bg-rose-50/60'
          }`}
        >
          {result.kind === 'not_found' && (
            <div className="flex items-start gap-4">
              <XCircle className="mt-0.5 h-7 w-7 shrink-0 text-rose-500" />
              <div>
                <p className="font-bold text-rose-700 text-base">Kode Tiket Tidak Ditemukan</p>
                <p className="mt-1 text-sm text-rose-600/80">
                  Kode tiket tidak terdaftar pada database sistem wisata. Pastikan nomor tiket tidak salah ketik.
                </p>
              </div>
            </div>
          )}

          {result.kind === 'already_validated' && (
            <div className="flex items-start gap-4">
              <ShieldAlert className="mt-0.5 h-7 w-7 shrink-0 text-amber-500" />
              <div>
                <p className="font-bold text-amber-700 text-base">Tiket Sudah Pernah Divalidasi</p>
                <p className="mt-1 text-sm text-amber-700/80">
                  Tiket ini telah digunakan sebelumnya untuk masuk. Tidak dapat digunakan kembali untuk masuk ganda.
                </p>
              </div>
            </div>
          )}

          {result.kind === 'valid' && (
            <div className="flex items-start gap-4">
              <CheckCircle2 className="mt-0.5 h-7 w-7 shrink-0 text-emerald-500" />
              <div>
                <p className="font-bold text-emerald-700 text-base">
                  Tiket Valid • Pengunjung Dipersilakan Masuk
                </p>
                <p className="mt-1 text-sm text-emerald-700/80">
                  Verifikasi gerbang berhasil. Status tiket telah otomatis diperbarui menjadi &quot;Tervalidasi / Masuk&quot;.
                </p>
              </div>
            </div>
          )}

          {booking && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-5 text-sm shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Informasi Detail Tiket Terverifikasi
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-slate-50 p-3">
                  <dt className="text-xs text-slate-500">Nama Pengunjung</dt>
                  <dd className="mt-0.5 font-bold text-slate-900">{booking.visitorName}</dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <dt className="text-xs text-slate-500">Kode Tiket</dt>
                  <dd className="mt-0.5 font-mono font-bold text-[#286EF2]">{booking.code}</dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <dt className="text-xs text-slate-500">Tanggal Kunjungan</dt>
                  <dd className="mt-0.5 font-bold text-slate-900">{formatVisitDate(booking.visitDate)}</dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <dt className="text-xs text-slate-500">Total Nominal</dt>
                  <dd className="mt-0.5 font-extrabold text-emerald-700">{formatRupiah(booking.total)}</dd>
                </div>
                <div className="sm:col-span-2 lg:col-span-4 rounded-xl bg-slate-50 p-3">
                  <dt className="text-xs text-slate-500">Rincian Tiket &amp; Jumlah Orang</dt>
                  <dd className="mt-1 flex flex-wrap gap-2">
                    {booking.items.map((item) => (
                      <span
                        key={item.categoryId}
                        className="rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-2xs border border-slate-200"
                      >
                        {item.name}: <strong>{item.quantity} Tiket</strong>
                      </span>
                    ))}
                  </dd>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── 4. TABEL LOG / RIWAYAT TIKET TERVALIDASI MASUK (REAL-TIME) ── */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card w-full">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#286EF2]">
              <Ticket className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Log Tiket Tervalidasi Masuk Gerbang
              </h3>
              <p className="text-xs text-slate-400">
                Daftar wisatawan yang telah berhasil melakukan verifikasi check-in di pintu masuk
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="h-3.5 w-3.5" />
            </div>
            <input
              type="text"
              value={searchLog}
              onChange={(e) => setSearchLog(e.target.value)}
              placeholder="Cari kode atau nama..."
              className="w-full sm:w-56 rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#286EF2] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Kode Tiket</th>
                <th className="px-6 py-4">Nama Wisatawan</th>
                <th className="px-6 py-4">Rincian Tiket</th>
                <th className="px-6 py-4">Tipe Pemesanan</th>
                <th className="px-6 py-4">Waktu Check-In</th>
                <th className="px-6 py-4 text-center">Status Gerbang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLog.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Belum ada data tiket tervalidasi yang cocok.
                  </td>
                </tr>
              ) : (
                filteredLog.map((b, idx) => {
                  const totalPcs = b.items.reduce((s, it) => s + it.quantity, 0);
                  return (
                    <tr key={b.id} className="transition hover:bg-slate-50/60">
                      <td className="px-6 py-4 font-mono text-slate-400">{idx + 1}</td>
                      <td className="px-6 py-4 font-mono font-bold text-[#286EF2]">{b.code}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{b.visitorName}</p>
                        <p className="text-[10px] text-slate-400">{b.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800">
                          {b.items.map((it) => `${it.name} (${it.quantity})`).join(', ')}
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          Total: {totalPcs} orang
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            b.bookingType === 'hari_ini'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-sky-50 text-sky-700 border border-sky-200'
                          }`}
                        >
                          {b.bookingType === 'hari_ini' ? 'Hari Ini (Walk-in)' : 'Booking Terjadwal'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800">
                          {b.validatedAt ? b.validatedAt : 'Hari Ini, 08:30 WIB'}
                        </p>
                        <p className="text-[10px] text-slate-400">Gate Masuk Utama</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          Tervalidasi / Masuk
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
    </div>
  );
}
