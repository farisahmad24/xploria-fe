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
  const [statusFilter, setStatusFilter] = useState<'all' | 'validated' | 'booked'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'hari_ini' | 'booking'>('all');

  // Validated & Pending tickets data
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
    return bookings.filter((b) => {
      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchType = typeFilter === 'all' || b.bookingType === typeFilter;
      const matchSearch =
        !q ||
        b.code.toLowerCase().includes(q) ||
        b.visitorName.toLowerCase().includes(q) ||
        b.phone.includes(q) ||
        b.items.some((it) => it.name.toLowerCase().includes(q));
      return matchStatus && matchType && matchSearch;
    });
  }, [bookings, statusFilter, typeFilter, searchLog]);

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

  const handleQuickValidate = (ticketCode: string) => {
    setCode(ticketCode);
    setFormError('');
    const res = onValidate(ticketCode);
    setResult(res);
    window.scrollTo({ top: 120, behavior: 'smooth' });
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

      {/* ── 4. TABEL LOG / RIWAYAT VALIDASI & STATUS TIKET GERBANG ── */}
      <div className="flex min-h-[560px] flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card w-full">
        <div>
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-[#286EF2] ring-1 ring-blue-100">
                <Ticket className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Data Validasi &amp; Status Tiket Gerbang
                </h3>
                <p className="text-xs text-slate-400">
                  Pantau tiket yang sudah check-in maupun yang masih menunggu di loket/gerbang masuk ({bookings.length} total tiket)
                </p>
              </div>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Filter Status Gerbang */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'validated' | 'booked')}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 focus:border-[#286EF2] focus:bg-white focus:outline-none"
                >
                  <option value="all">Semua Status Gerbang ({bookings.length})</option>
                  <option value="validated">✓ Tervalidasi / Sudah Masuk ({validatedBookings.length})</option>
                  <option value="booked">⏳ Belum Masuk / Menunggu ({pendingBookings.length})</option>
                </select>
              </div>

              {/* Filter Tipe Pemesanan */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Tipe:</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as 'all' | 'hari_ini' | 'booking')}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 focus:border-[#286EF2] focus:bg-white focus:outline-none"
                >
                  <option value="all">Semua Tipe Pemesanan</option>
                  <option value="hari_ini">Pemesanan Hari Ini (Walk-in)</option>
                  <option value="booking">Pemesanan Booking (Mendatang)</option>
                </select>
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
                  className="w-full sm:w-48 rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#286EF2] focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full min-w-[960px] table-fixed text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="w-12 px-4 py-4 text-center">No</th>
                  <th className="w-44 px-5 py-4">Kode Tiket</th>
                  <th className="w-52 px-5 py-4">Nama Wisatawan</th>
                  <th className="w-48 px-5 py-4">Rincian Tiket</th>
                  <th className="w-36 px-5 py-4">Tipe Pemesanan</th>
                  <th className="w-40 px-5 py-4">Waktu / Jadwal</th>
                  <th className="w-40 px-5 py-4 text-center">Status Gerbang</th>
                  <th className="w-40 px-5 py-4 text-center">Aksi Validasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLog.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-24 text-center text-slate-400 text-sm">
                      Tidak ada data tiket yang cocok dengan filter yang dipilih.
                    </td>
                  </tr>
                ) : (
                  filteredLog.map((b, idx) => {
                    const totalPcs = b.items.reduce((s, it) => s + it.quantity, 0);
                    const isValidated = b.status === 'validated';

                    return (
                      <tr key={b.id} className="transition hover:bg-slate-50/60">
                        <td className="w-12 px-4 py-4 font-mono text-slate-400 text-center">{idx + 1}</td>
                        <td className="w-44 px-5 py-4 font-mono font-bold text-[#286EF2]">{b.code}</td>
                        <td className="w-52 px-5 py-4">
                          <p className="font-bold text-slate-900 truncate">{b.visitorName}</p>
                          <p className="text-[10px] text-slate-400">{b.phone}</p>
                        </td>
                        <td className="w-48 px-5 py-4">
                          <span className="font-semibold text-slate-800 line-clamp-1">
                            {b.items.map((it) => `${it.name} (${it.quantity})`).join(', ')}
                          </span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">
                            Total: {totalPcs} orang
                          </span>
                        </td>
                        <td className="w-36 px-5 py-4">
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
                        <td className="w-40 px-5 py-4">
                          <p className="font-semibold text-slate-800">
                            {isValidated
                              ? (b.validatedAt ? 'Check-in: Hari Ini' : 'Hari Ini, 08:30 WIB')
                              : formatVisitDate(b.visitDate)}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {isValidated ? 'Gate Masuk Utama' : 'Belum Verifikasi'}
                          </p>
                        </td>
                        <td className="w-40 px-5 py-4 text-center">
                          {isValidated ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                              Tervalidasi / Masuk
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                              <Clock className="h-3 w-3 text-amber-600" />
                              Menunggu Check-in
                            </span>
                          )}
                        </td>
                        <td className="w-40 px-5 py-4 text-center">
                          {isValidated ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                              <CheckCircle2 className="h-3 w-3" />
                              Lolos Masuk
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleQuickValidate(b.code)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#286EF2] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-600 transition"
                              title="Klik untuk langsung validasi tiket ini"
                            >
                              <ScanLine className="h-3.5 w-3.5" />
                              <span>Validasi Masuk</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              Menampilkan <strong className="text-slate-800">{filteredLog.length}</strong> tiket
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Status:{' '}
              <strong className="text-[#286EF2]">
                {statusFilter === 'all'
                  ? 'Semua Status'
                  : statusFilter === 'validated'
                  ? 'Sudah Masuk'
                  : 'Belum Masuk'}
              </strong>
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Tipe:{' '}
              <strong className="text-slate-700">
                {typeFilter === 'all'
                  ? 'Semua Tipe'
                  : typeFilter === 'hari_ini'
                  ? 'Hari Ini'
                  : 'Booking'}
              </strong>
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Sistem Pemindai &amp; Validasi Gate Masuk Real-Time
          </span>
        </div>
      </div>
    </div>
  );
}
