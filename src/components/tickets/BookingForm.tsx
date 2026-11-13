import { useMemo, useState, type FormEvent } from 'react';
import {
  AlertCircle,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  Lock,
  Minus,
  Percent,
  Plus,
  QrCode,
  Receipt,
  RotateCcw,
  Sparkles,
  Tag,
  Wallet,
} from 'lucide-react';
import SlantedTicket from '@/components/common/SlantedTicket';
import { ticketCategories } from '@/data/ticketCategories';
import {
  MAX_QUANTITY_PER_CATEGORY,
  buildBookingItems,
  formatRupiah,
  formatVisitDate,
  toIsoDate,
  validateDraft,
} from '@/lib/bookings';
import type { Booking, BookingDraft, BookingType, DraftErrors, PaymentMethod } from '@/types/ticket';

type BookingFormProps = {
  onCreate: (draft: BookingDraft) => Booking;
  isSessionOpen?: boolean;
  onCloseOrder?: () => void;
  onOpenNewSession?: () => void;
  cashierName?: string;
  sessionStartTime?: string;
};

const inputClass =
  'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition focus:outline-none focus:ring-4';

function inputStateClass(hasError: boolean) {
  return hasError
    ? `${inputClass} border-rose-300 focus:border-rose-400 focus:ring-rose-100`
    : `${inputClass} border-ocean-100 focus:border-[#286EF2] focus:ring-blue-100`;
}

export default function BookingForm({
  onCreate,
  isSessionOpen = true,
  onCloseOrder,
  onOpenNewSession,
  cashierName = 'Siti Rahmawati (Kasir)',
  sessionStartTime = '07:30 WIB',
}: BookingFormProps) {
  const todayIso = toIsoDate(new Date());

  const emptyDraft = (): BookingDraft => ({
    visitorName: '',
    phone: '',
    visitDate: todayIso,
    durationDays: 1,
    visitEndDate: todayIso,
    quantities: {},
    bookingType: 'hari_ini',
    paymentMethod: 'cash',
  });

  const [draft, setDraft] = useState<BookingDraft>(emptyDraft);
  const [errors, setErrors] = useState<DraftErrors>({});
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  // Helper kalkulasi rentang hari & tanggal selesai
  const calculateEndDate = (startDateIso: string, days: number): string => {
    if (!startDateIso) return '';
    try {
      const d = new Date(`${startDateIso}T00:00:00`);
      d.setDate(d.getDate() + (days - 1));
      return toIsoDate(d);
    } catch {
      return startDateIso;
    }
  };

  const calculateDuration = (startDateIso: string, endDateIso: string): number => {
    if (!startDateIso || !endDateIso) return 1;
    try {
      const start = new Date(`${startDateIso}T00:00:00`).getTime();
      const end = new Date(`${endDateIso}T00:00:00`).getTime();
      const diff = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return Math.max(1, diff);
    } catch {
      return 1;
    }
  };

  // Fitur Potongan Harga / Diskon Tiket
  const [discountType, setDiscountType] = useState<'percent' | 'nominal'>('percent');
  const [discountValue, setDiscountValue] = useState<string>('0');

  const selectedItems = buildBookingItems(draft.quantities, ticketCategories);
  const totalTickets = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalPrice = selectedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const numericDiscount = Math.max(0, parseFloat(discountValue) || 0);
  const discountAmount = useMemo(() => {
    if (subtotalPrice <= 0 || numericDiscount <= 0) return 0;
    if (discountType === 'percent') {
      const clampedPercent = Math.min(100, numericDiscount);
      return Math.round((subtotalPrice * clampedPercent) / 100);
    }
    return Math.min(subtotalPrice, Math.round(numericDiscount));
  }, [subtotalPrice, discountType, numericDiscount]);

  const grandTotal = Math.max(0, subtotalPrice - discountAmount);

  // Ubah tipe pemesanan (Hari Ini vs Booking)
  const handleBookingTypeChange = (type: BookingType) => {
    setDraft((current) => ({
      ...current,
      bookingType: type,
      // Jika Hari Ini -> kunci tanggal ke hari ini. Jika Booking -> kosongkan atau set besok
      visitDate: type === 'hari_ini' ? todayIso : '',
      durationDays: 1,
      visitEndDate: type === 'hari_ini' ? todayIso : '',
    }));
    setErrors((current) => ({ ...current, visitDate: undefined }));
  };

  const handleDurationChange = (days: number) => {
    const end = draft.visitDate ? calculateEndDate(draft.visitDate, days) : '';
    setDraft((curr) => ({
      ...curr,
      durationDays: days,
      visitEndDate: end,
    }));
  };

  const handleStartDateChange = (startDate: string) => {
    const days = draft.durationDays || 1;
    const end = startDate ? calculateEndDate(startDate, days) : '';
    setDraft((curr) => ({
      ...curr,
      visitDate: startDate,
      visitEndDate: end,
    }));
    setErrors((curr) => ({ ...curr, visitDate: undefined }));
  };

  const handleEndDateChange = (endDate: string) => {
    const days = calculateDuration(draft.visitDate, endDate);
    setDraft((curr) => ({
      ...curr,
      visitEndDate: endDate,
      durationDays: days,
    }));
  };

  const updateField = <K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const updateQuantity = (categoryId: string, next: number) => {
    const clamped = Math.min(Math.max(next, 0), MAX_QUANTITY_PER_CATEGORY);
    setDraft((current) => ({
      ...current,
      quantities: { ...current.quantities, [categoryId]: clamped },
    }));
    setErrors((current) => ({ ...current, quantities: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSessionOpen) return;

    const nextErrors = validateDraft(draft, todayIso);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const draftPayload: BookingDraft = {
      ...draft,
      discountType,
      discountValue: numericDiscount,
      discountAmount,
    };
    setConfirmed(onCreate(draftPayload));
  };

  // ── Success Confirmed View ──────────────────────────────────────────
  if (confirmed) {
    const isHariIni = confirmed.bookingType === 'hari_ini';
    const hasDiscount = (confirmed.discountAmount || 0) > 0;

    return (
      <section className="animate-fade-in-up mx-auto max-w-xl rounded-3xl border border-ocean-100 bg-white p-8 text-center shadow-card">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-9 w-9 text-emerald-500" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-ocean-900">Pemesanan Berhasil Disimpan</h2>
        <p className="mt-1 text-sm text-slate-500">
          Struk tiket masuk pariwisata telah diterbitkan secara resmi.
        </p>

        {/* Status Badge */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              isHariIni
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-sky-100 text-sky-800'
            }`}
          >
            {isHariIni ? '✓ Pemesanan Hari Ini (Langsung Aktif)' : '📅 Booking Terjadwal'}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-700">
            Metode: {confirmed.paymentMethod.toUpperCase()}
          </span>
        </div>

        <p className="mt-5 rounded-2xl bg-ocean-50 px-4 py-4 font-mono text-2xl font-bold tracking-wider text-[#286EF2]">
          {confirmed.code}
        </p>

        <dl className="mt-6 space-y-3 rounded-2xl border border-ocean-100 p-5 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Nama Pengunjung</dt>
            <dd className="font-semibold text-ocean-900">{confirmed.visitorName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Nomor Telepon</dt>
            <dd className="font-medium text-slate-700">{confirmed.phone}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Tanggal Kunjungan</dt>
            <dd className="font-semibold text-ocean-900 text-right">
              {formatVisitDate(confirmed.visitDate)}
              {confirmed.durationDays && confirmed.durationDays > 1 && confirmed.visitEndDate ? (
                <span className="block text-xs font-normal text-slate-500">
                  s/d {formatVisitDate(confirmed.visitEndDate)} ({confirmed.durationDays} Hari)
                </span>
              ) : null}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Petugas Kasir</dt>
            <dd className="font-medium text-slate-700">{confirmed.cashierName}</dd>
          </div>

          {hasDiscount ? (
            <>
              <div className="flex justify-between gap-4 border-t border-slate-100 pt-3">
                <dt className="text-slate-500">Subtotal Tiket</dt>
                <dd className="font-medium text-slate-700">
                  {formatRupiah(confirmed.subtotal || confirmed.total + (confirmed.discountAmount || 0))}
                </dd>
              </div>
              <div className="flex justify-between gap-4 text-emerald-600">
                <dt className="font-medium">Potongan Diskon</dt>
                <dd className="font-bold">- {formatRupiah(confirmed.discountAmount || 0)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-ocean-100 pt-3">
                <dt className="font-semibold text-slate-700">Total Pembayaran (Grand Total)</dt>
                <dd className="text-base font-bold text-[#286EF2]">{formatRupiah(confirmed.total)}</dd>
              </div>
            </>
          ) : (
            <div className="flex justify-between gap-4 border-t border-ocean-100 pt-3">
              <dt className="text-slate-500">Total Pembayaran</dt>
              <dd className="text-base font-bold text-[#286EF2]">{formatRupiah(confirmed.total)}</dd>
            </div>
          )}
        </dl>

        <button
          type="button"
          onClick={() => {
            setConfirmed(null);
            setDraft(emptyDraft());
            setDiscountValue('0');
          }}
          className="mt-6 w-full rounded-xl bg-[#286EF2] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 hover:bg-blue-600"
        >
          Layani Pemesanan Tiket Berikutnya
        </button>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── KASIR SESSION STATUS & CLOSE ORDER BAR ── */}
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
              isSessionOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}
          >
            <Clock className="h-5 w-5" />
          </div>
          <div>
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
                {isSessionOpen ? 'Sesi Kasir Aktif (Session Open)' : 'Sesi Terkunci (Session Closed)'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Kasir: <strong className="text-slate-800">{cashierName}</strong> • Buka sejak: {sessionStartTime}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSessionOpen ? (
            onCloseOrder && (
              <button
                type="button"
                onClick={onCloseOrder}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-600/20 transition hover:bg-rose-700"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Close Order (Tutup Kasir)</span>
              </button>
            )
          ) : (
            onOpenNewSession && (
              <button
                type="button"
                onClick={onOpenNewSession}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Buka Sesi Kasir Baru</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Lock Banner if session is closed */}
      {!isSessionOpen && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-5 text-rose-900 shadow-sm">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold">Sesi Kasir Hari Ini Telah Ditutup (Close Order)</h3>
              <p className="mt-1 text-xs leading-relaxed text-rose-800">
                Seluruh transaksi pada sesi ini telah dikunci untuk keperluan rekonsiliasi kas dan pembukuan harian. Tidak ada transaksi baru yang dapat dibuat. Klik tombol <strong>&quot;Buka Sesi Kasir Baru&quot;</strong> jika Anda ingin memulai shift pelayanan berikutnya.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── 1. PEMISAHAN TIPE PEMESANAN TIKET (TAB SWITCH) ── */}
      <div className="rounded-3xl border border-ocean-100 bg-white p-4 shadow-card">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-1">
          Pilih Tipe Transaksi Pemesanan
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Tab 1: Pemesanan Hari Ini (Walk-in) */}
          <button
            type="button"
            disabled={!isSessionOpen}
            onClick={() => handleBookingTypeChange('hari_ini')}
            className={`flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-all ${
              draft.bookingType === 'hari_ini'
                ? 'border-[#286EF2] bg-blue-50/60 shadow-md ring-2 ring-[#286EF2]/20'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                draft.bookingType === 'hari_ini'
                  ? 'bg-[#286EF2] text-white shadow-md shadow-blue-500/25'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <SlantedTicket className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-900">
                  Pemesanan Hari Ini (Walk-in)
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  Langsung Aktif
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Tanggal terkunci otomatis pada hari ini ({formatVisitDate(todayIso)}). Tiket langsung siap dipindai di gerbang.
              </p>
            </div>
          </button>

          {/* Tab 2: Pemesanan Booking (Mendatang) */}
          <button
            type="button"
            disabled={!isSessionOpen}
            onClick={() => handleBookingTypeChange('booking')}
            className={`flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-all ${
              draft.bookingType === 'booking'
                ? 'border-[#286EF2] bg-blue-50/60 shadow-md ring-2 ring-[#286EF2]/20'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                draft.bookingType === 'booking'
                  ? 'bg-[#286EF2] text-white shadow-md shadow-blue-500/25'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-900">
                  Pemesanan Booking (Mendatang)
                </span>
                <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800">
                  Terjadwal
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Pilih tanggal kunjungan di masa depan. Tiket berstatus booking dan aktif ketika tanggal kunjungan tiba.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* ── FORM PEMESANAN & RINGKASAN PESANAN ── */}
      <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          {/* Pilih Jenis Tiket */}
          <section className="rounded-3xl border border-ocean-100 bg-white p-5 shadow-card sm:p-6">
            <div className="flex items-center gap-2.5">
              <SlantedTicket className="h-5 w-5 text-ocean-600" />
              <h2 className="text-base font-bold text-ocean-900">Pilih Jumlah &amp; Jenis Tiket</h2>
            </div>
            {errors.quantities && <p className="mt-3 text-sm text-rose-500">{errors.quantities}</p>}

            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {ticketCategories.map((category) => {
                const quantity = draft.quantities[category.id] ?? 0;
                return (
                  <li
                    key={category.id}
                    className={`flex h-full min-h-[160px] flex-col justify-between gap-4 rounded-2xl border p-4 transition-colors ${
                      quantity > 0 ? 'border-ocean-400 bg-ocean-50/60' : 'border-ocean-100 bg-white'
                    } ${!isSessionOpen ? 'opacity-60' : ''}`}
                  >
                    <div>
                      <p className="font-semibold text-ocean-900">{category.name}</p>
                      <p className="mt-0.5 min-h-[36px] text-xs leading-relaxed text-slate-500">{category.description}</p>
                      <p className="mt-2 text-sm font-bold text-ocean-700">{formatRupiah(category.price)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Jumlah</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={!isSessionOpen || quantity === 0}
                          onClick={() => updateQuantity(category.id, quantity - 1)}
                          aria-label={`Kurangi ${category.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-ocean-200 text-ocean-700 transition hover:bg-ocean-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-ocean-900">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          disabled={!isSessionOpen || quantity >= MAX_QUANTITY_PER_CATEGORY}
                          onClick={() => updateQuantity(category.id, quantity + 1)}
                          aria-label={`Tambah ${category.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-ocean-600 text-white transition hover:bg-ocean-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Data Pengunjung & Tanggal */}
          <section className="rounded-3xl border border-ocean-100 bg-white p-5 shadow-card sm:p-6">
            <h2 className="text-base font-bold text-ocean-900">Data Pengunjung &amp; Tanggal Kunjungan</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-600">
                Nama Lengkap Pengunjung / Rombongan
                <input
                  disabled={!isSessionOpen}
                  value={draft.visitorName}
                  onChange={(event) => updateField('visitorName', event.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className={inputStateClass(!!errors.visitorName)}
                />
                {errors.visitorName && <span className="text-xs text-rose-500">{errors.visitorName}</span>}
              </label>

              <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-600">
                Nomor Telepon / WhatsApp
                <input
                  disabled={!isSessionOpen}
                  value={draft.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                  inputMode="tel"
                  placeholder="081234567890"
                  className={inputStateClass(!!errors.phone)}
                />
                {errors.phone && <span className="text-xs text-rose-500">{errors.phone}</span>}
              </label>

              {/* Tanggal Kunjungan & Range Hari Booking */}
              <div className="flex flex-col gap-2.5 text-sm font-medium text-slate-600 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <span>Tanggal Kunjungan</span>
                  {draft.bookingType === 'hari_ini' ? (
                    <span className="text-xs font-bold text-emerald-700">
                      ✓ Terkunci Hari Ini (Walk-in)
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-[#286EF2]">
                      Pemesanan Booking Terjadwal
                    </span>
                  )}
                </div>

                {draft.bookingType === 'hari_ini' ? (
                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
                    <input
                      type="date"
                      disabled
                      value={draft.visitDate}
                      className="w-full rounded-xl border border-slate-200 bg-slate-100 py-2.5 pl-11 pr-4 text-xs font-bold text-slate-700 cursor-not-allowed"
                    />
                  </div>
                ) : (
                  <div className="rounded-2xl border border-blue-200/80 bg-blue-50/50 p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-[#286EF2]" />
                        Berapa Lama di Tempat Wisata? (Durasi &amp; Rentang Tanggal)
                      </span>
                      <span className="text-xs font-bold text-[#286EF2] bg-white px-2.5 py-0.5 rounded-full border border-blue-200 shadow-xs">
                        {draft.durationDays || 1} Hari {((draft.durationDays || 1) > 1) ? `(${((draft.durationDays || 1) - 1)} Malam)` : '(Same-Day)'}
                      </span>
                    </div>

                    {/* Quick Duration Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-slate-500">Pilihan Cepat:</span>
                      {[
                        { days: 1, label: '1 Hari' },
                        { days: 2, label: '2 Hari 1 Malam' },
                        { days: 3, label: '3 Hari 2 Malam' },
                        { days: 4, label: '4 Hari 3 Malam' },
                        { days: 5, label: '5 Hari 4 Malam' },
                      ].map((item) => (
                        <button
                          key={item.days}
                          type="button"
                          disabled={!isSessionOpen}
                          onClick={() => handleDurationChange(item.days)}
                          className={`rounded-xl px-2.5 py-1 text-xs font-bold transition-all ${
                            (draft.durationDays || 1) === item.days
                              ? 'bg-[#286EF2] text-white shadow-xs'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {/* Date Range Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Tanggal Datang (Check-in) <span className="text-rose-500">*</span>
                        </span>
                        <div className="relative">
                          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                          <input
                            type="date"
                            min={todayIso}
                            value={draft.visitDate}
                            onChange={(e) => handleStartDateChange(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs font-bold text-slate-800 focus:border-[#286EF2] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Tanggal Pulang (Check-out)
                        </span>
                        <div className="relative">
                          <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                          <input
                            type="date"
                            min={draft.visitDate || todayIso}
                            value={draft.visitEndDate || draft.visitDate}
                            onChange={(e) => handleEndDateChange(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs font-bold text-slate-800 focus:border-[#286EF2] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {draft.visitDate && (
                      <div className="rounded-xl bg-white p-2.5 text-xs text-slate-600 border border-blue-100 flex items-center justify-between">
                        <span>
                          Rentang Jadwal:{' '}
                          <strong className="text-slate-900">{formatVisitDate(draft.visitDate)}</strong> s/d{' '}
                          <strong className="text-slate-900">{formatVisitDate(draft.visitEndDate || draft.visitDate)}</strong>
                        </span>
                        <span className="font-extrabold text-[#286EF2]">
                          Total {draft.durationDays || 1} Hari
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {errors.visitDate && <span className="text-xs text-rose-500">{errors.visitDate}</span>}
              </div>
            </div>
          </section>

          {/* Metode Pembayaran */}
          <section className="rounded-3xl border border-ocean-100 bg-white p-5 shadow-card sm:p-6">
            <h2 className="text-base font-bold text-ocean-900">Metode Pembayaran Transaksi</h2>
            <p className="mt-0.5 text-xs text-slate-500">Pilih media pembayaran yang digunakan oleh pengunjung.</p>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { id: 'cash', label: 'Tunai (Cash)', icon: Wallet },
                { id: 'qris', label: 'QRIS', icon: QrCode },
                { id: 'ewallet', label: 'E-Wallet', icon: CreditCard },
                { id: 'transfer', label: 'Transfer Bank', icon: Receipt },
              ].map((m) => {
                const Icon = m.icon;
                const active = draft.paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    disabled={!isSessionOpen}
                    onClick={() => updateField('paymentMethod', m.id as PaymentMethod)}
                    className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-3.5 text-center transition-all ${
                      active
                        ? 'border-[#286EF2] bg-blue-50/60 shadow-sm ring-2 ring-[#286EF2]/20 font-bold text-ocean-900'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                        active ? 'bg-[#286EF2] text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-xs">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Potongan Harga / Diskon Transaksi */}
          <section className="rounded-3xl border border-ocean-100 bg-white p-5 shadow-card sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#286EF2]">
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-ocean-900">Potongan Harga / Diskon Transaksi</h2>
                  <p className="text-xs text-slate-500">Diskon otomatis memotong nominal akhir Grand Total (persen / rupiah).</p>
                </div>
              </div>
              {discountAmount > 0 && (
                <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                  Hemat {formatRupiah(discountAmount)}
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Type Switch: Persen (%) vs Nominal (Rp) */}
              <div className="inline-flex rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  disabled={!isSessionOpen}
                  onClick={() => {
                    setDiscountType('percent');
                    setDiscountValue('0');
                  }}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                    discountType === 'percent'
                      ? 'bg-white text-[#286EF2] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Percent className="h-3.5 w-3.5" />
                  <span>Persen (%)</span>
                </button>
                <button
                  type="button"
                  disabled={!isSessionOpen}
                  onClick={() => {
                    setDiscountType('nominal');
                    setDiscountValue('0');
                  }}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                    discountType === 'nominal'
                      ? 'bg-white text-[#286EF2] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Nominal (Rp)</span>
                </button>
              </div>

              {/* Input Value */}
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  {discountType === 'percent' ? '%' : 'Rp'}
                </span>
                <input
                  type="number"
                  min="0"
                  max={discountType === 'percent' ? 100 : subtotalPrice}
                  disabled={!isSessionOpen}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={discountType === 'percent' ? 'Contoh: 10' : 'Contoh: 25000'}
                  className={`${inputClass} pl-10 border-slate-200 focus:border-[#286EF2] focus:ring-blue-100 font-semibold`}
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-slate-400">Pilihan Cepat:</span>
              {discountType === 'percent' ? (
                [0, 5, 10, 15, 20, 50].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    disabled={!isSessionOpen}
                    onClick={() => setDiscountValue(String(pct))}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                      numericDiscount === pct
                        ? 'bg-[#286EF2] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {pct === 0 ? 'Tanpa Diskon' : `${pct}%`}
                  </button>
                ))
              ) : (
                [0, 10000, 25000, 50000, 100000].map((nom) => (
                  <button
                    key={nom}
                    type="button"
                    disabled={!isSessionOpen}
                    onClick={() => setDiscountValue(String(nom))}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                      numericDiscount === nom
                        ? 'bg-[#286EF2] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {nom === 0 ? 'Tanpa Diskon' : formatRupiah(nom)}
                  </button>
                ))
              )}
            </div>
          </section>
        </div>

        {/* ── ASIDE RINGKASAN & SUBMIT ── */}
        <aside className="h-fit rounded-3xl border border-ocean-100 bg-white p-5 shadow-card xl:sticky xl:top-28 sm:p-6">
          <div className="flex items-center gap-2.5">
            <Receipt className="h-5 w-5 text-[#286EF2]" />
            <h2 className="text-base font-bold text-ocean-900">Ringkasan Pesanan</h2>
          </div>

          <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span className="font-bold text-slate-900">Tipe Transaksi:</span>
              <span className="font-semibold text-[#286EF2]">
                {draft.bookingType === 'hari_ini' ? 'Hari Ini (Walk-in)' : 'Booking Mendatang'}
              </span>
            </div>
            {draft.bookingType === 'booking' && (
              <div className="flex justify-between border-t border-slate-200/60 pt-1 text-[11px]">
                <span className="text-slate-500">Durasi:</span>
                <span className="font-bold text-slate-800">
                  {draft.durationDays || 1} Hari ({draft.visitDate ? formatVisitDate(draft.visitDate) : '-'} s/d {draft.visitEndDate ? formatVisitDate(draft.visitEndDate) : '-'})
                </span>
              </div>
            )}
          </div>

          {selectedItems.length === 0 ? (
            <p className="mt-5 text-sm text-slate-500">Belum ada tiket yang dipilih.</p>
          ) : (
            <ul className="mt-5 space-y-3">
              {selectedItems.map((item) => (
                <li key={item.categoryId} className="flex justify-between gap-3 text-sm">
                  <span className="text-slate-600">
                    {item.name} <span className="text-slate-400">x{item.quantity}</span>
                  </span>
                  <span className="font-semibold text-ocean-900">
                    {formatRupiah(item.unitPrice * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 space-y-2 border-t border-ocean-100 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Subtotal ({totalTickets} tiket)</span>
              <span className="font-semibold text-slate-800">{formatRupiah(subtotalPrice)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex items-center justify-between text-sm text-emerald-600">
                <span className="font-medium">
                  Potongan Diskon {discountType === 'percent' ? `(${numericDiscount}%)` : ''}
                </span>
                <span className="font-bold">- {formatRupiah(discountAmount)}</span>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-base font-bold text-slate-900">Grand Total</span>
              <span className="text-xl font-black text-[#286EF2]">{formatRupiah(grandTotal)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isSessionOpen || totalTickets === 0}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#286EF2] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {!isSessionOpen ? (
              <>
                <Lock className="h-4 w-4" />
                <span>Sesi Kasir Terkunci</span>
              </>
            ) : (
              <>
                <span>Konfirmasi Pembayaran ({draft.bookingType === 'hari_ini' ? 'Walk-in' : 'Booking'})</span>
              </>
            )}
          </button>
        </aside>
      </form>
    </div>
  );
}
