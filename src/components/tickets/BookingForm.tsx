import { useState, type FormEvent } from 'react';
import { CalendarDays, CheckCircle2, Minus, Plus, Receipt, Ticket } from 'lucide-react';
import { ticketCategories } from '@/data/ticketCategories';
import {
  MAX_QUANTITY_PER_CATEGORY,
  buildBookingItems,
  formatRupiah,
  formatVisitDate,
  toIsoDate,
  validateDraft,
} from '@/lib/bookings';
import type { Booking, BookingDraft, DraftErrors } from '@/types/ticket';

type BookingFormProps = {
  onCreate: (draft: BookingDraft) => Booking;
};

const emptyDraft = (): BookingDraft => ({
  visitorName: '',
  phone: '',
  visitDate: '',
  quantities: {},
});

const inputClass =
  'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition focus:outline-none focus:ring-4';

function inputStateClass(hasError: boolean) {
  return hasError
    ? `${inputClass} border-rose-300 focus:border-rose-400 focus:ring-rose-100`
    : `${inputClass} border-ocean-100 focus:border-ocean-400 focus:ring-ocean-100`;
}

export default function BookingForm({ onCreate }: BookingFormProps) {
  const [draft, setDraft] = useState<BookingDraft>(emptyDraft);
  const [errors, setErrors] = useState<DraftErrors>({});
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  const selectedItems = buildBookingItems(draft.quantities, ticketCategories);
  const totalTickets = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const minDate = toIsoDate(new Date());

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
    const nextErrors = validateDraft(draft, minDate);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setConfirmed(onCreate(draft));
  };

  if (confirmed) {
    return (
      <section className="animate-fade-in-up mx-auto max-w-xl rounded-3xl border border-ocean-100 bg-white p-8 text-center shadow-card">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-9 w-9 text-emerald-500" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-ocean-900">Pemesanan Berhasil</h2>
        <p className="mt-2 text-sm text-slate-500">
          Tunjukkan kode berikut kepada petugas saat tiba di lokasi.
        </p>
        <p className="mt-6 rounded-2xl bg-ocean-50 px-4 py-4 font-mono text-2xl font-bold tracking-wider text-ocean-700">
          {confirmed.code}
        </p>

        <dl className="mt-6 space-y-3 rounded-2xl border border-ocean-100 p-5 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Nama</dt>
            <dd className="font-semibold text-ocean-900">{confirmed.visitorName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Tanggal kunjungan</dt>
            <dd className="font-semibold text-ocean-900">{formatVisitDate(confirmed.visitDate)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Jumlah tiket</dt>
            <dd className="font-semibold text-ocean-900">
              {confirmed.items.reduce((sum, item) => sum + item.quantity, 0)} tiket
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-ocean-100 pt-3">
            <dt className="text-slate-500">Total bayar</dt>
            <dd className="text-base font-bold text-ocean-700">{formatRupiah(confirmed.total)}</dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={() => {
            setConfirmed(null);
            setDraft(emptyDraft());
          }}
          className="mt-6 w-full rounded-xl bg-ocean-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-ocean-600/25 transition hover:-translate-y-0.5 hover:bg-ocean-700"
        >
          Pesan Tiket Lagi
        </button>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-6">
        <section className="rounded-3xl border border-ocean-100 bg-white p-5 shadow-card sm:p-6">
          <div className="flex items-center gap-2.5">
            <Ticket className="h-5 w-5 text-ocean-600" />
            <h2 className="text-base font-bold text-ocean-900">Pilih Jenis Tiket</h2>
          </div>
          {errors.quantities && <p className="mt-3 text-sm text-rose-500">{errors.quantities}</p>}

          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {ticketCategories.map((category) => {
              const quantity = draft.quantities[category.id] ?? 0;
              return (
                <li
                  key={category.id}
                  className={`flex flex-col justify-between gap-4 rounded-2xl border p-4 transition-colors ${
                    quantity > 0 ? 'border-ocean-400 bg-ocean-50/60' : 'border-ocean-100 bg-white'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-ocean-900">{category.name}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{category.description}</p>
                    <p className="mt-2 text-sm font-bold text-ocean-700">{formatRupiah(category.price)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Jumlah</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(category.id, quantity - 1)}
                        disabled={quantity === 0}
                        aria-label={`Kurangi ${category.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-ocean-200 text-ocean-700 transition hover:bg-ocean-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-ocean-900" aria-live="polite">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(category.id, quantity + 1)}
                        disabled={quantity >= MAX_QUANTITY_PER_CATEGORY}
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

        <section className="rounded-3xl border border-ocean-100 bg-white p-5 shadow-card sm:p-6">
          <h2 className="text-base font-bold text-ocean-900">Data Pengunjung</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-600">
              Nama lengkap
              <input
                value={draft.visitorName}
                onChange={(event) => updateField('visitorName', event.target.value)}
                placeholder="Contoh: Andi Pratama"
                className={inputStateClass(!!errors.visitorName)}
              />
              {errors.visitorName && <span className="text-xs text-rose-500">{errors.visitorName}</span>}
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-600">
              Nomor telepon
              <input
                value={draft.phone}
                onChange={(event) => updateField('phone', event.target.value)}
                inputMode="tel"
                placeholder="081234567890"
                className={inputStateClass(!!errors.phone)}
              />
              {errors.phone && <span className="text-xs text-rose-500">{errors.phone}</span>}
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-600 sm:col-span-2">
              Tanggal kunjungan
              <span className="relative">
                <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
                <input
                  type="date"
                  min={minDate}
                  value={draft.visitDate}
                  onChange={(event) => updateField('visitDate', event.target.value)}
                  className={`${inputStateClass(!!errors.visitDate)} w-full pl-11 sm:w-auto`}
                />
              </span>
              {errors.visitDate && <span className="text-xs text-rose-500">{errors.visitDate}</span>}
            </label>
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-3xl border border-ocean-100 bg-white p-5 shadow-card xl:sticky xl:top-28 sm:p-6">
        <div className="flex items-center gap-2.5">
          <Receipt className="h-5 w-5 text-ocean-600" />
          <h2 className="text-base font-bold text-ocean-900">Ringkasan Pesanan</h2>
        </div>

        {selectedItems.length === 0 ? (
          <p className="mt-5 text-sm text-slate-500">Belum ada tiket dipilih.</p>
        ) : (
          <ul className="mt-5 space-y-3">
            {selectedItems.map((item) => (
              <li key={item.categoryId} className="flex justify-between gap-3 text-sm">
                <span className="text-slate-600">
                  {item.name} <span className="text-slate-400">x{item.quantity}</span>
                </span>
                <span className="font-semibold text-ocean-900">{formatRupiah(item.unitPrice * item.quantity)}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-ocean-100 pt-4">
          <span className="text-sm text-slate-500">Total ({totalTickets} tiket)</span>
          <span className="text-lg font-bold text-ocean-700">{formatRupiah(totalPrice)}</span>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-ocean-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-ocean-600/25 transition hover:-translate-y-0.5 hover:bg-ocean-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-ocean-200"
        >
          Konfirmasi Pemesanan
        </button>
      </aside>
    </form>
  );
}
