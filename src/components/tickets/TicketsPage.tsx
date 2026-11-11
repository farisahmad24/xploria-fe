import { useEffect, useState } from 'react';
import { History, ScanLine, Ticket as TicketIcon, type LucideIcon } from 'lucide-react';
import BookingForm from '@/components/tickets/BookingForm';
import TicketHistory from '@/components/tickets/TicketHistory';
import ValidateTicket from '@/components/tickets/ValidateTicket';
import type { Booking, BookingDraft, ValidationResult } from '@/types/ticket';

export type TicketTab = 'pesan' | 'validasi' | 'riwayat';

const tabs: { id: TicketTab; label: string; icon: LucideIcon }[] = [
  { id: 'pesan', label: 'Pesan Tiket', icon: TicketIcon },
  { id: 'validasi', label: 'Validasi Tiket', icon: ScanLine },
  { id: 'riwayat', label: 'Riwayat Penjualan', icon: History },
];

type TicketsPageProps = {
  bookings: Booking[];
  onCreate: (draft: BookingDraft) => Booking;
  onValidate: (code: string) => ValidationResult;
  initialTab?: TicketTab;
};

export default function TicketsPage({
  bookings,
  onCreate,
  onValidate,
  initialTab = 'pesan',
}: TicketsPageProps) {
  const [tab, setTab] = useState<TicketTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setTab(initialTab);
    }
  }, [initialTab]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-ocean-600">Transaksi</p>
          <h1 className="mt-1 text-2xl font-bold text-ocean-900 sm:text-3xl">Tiket & Pemesanan Wisata</h1>
          <p className="text-sm text-slate-500">
            Kelola penjualan tiket masuk, verifikasi kode QR tiket, dan pantau riwayat pesanan.
          </p>
        </div>

        <div role="tablist" aria-label="Menu tiket" className="flex w-full rounded-2xl bg-white p-1.5 shadow-card sm:w-auto">
          {tabs.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(item.id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 sm:flex-none sm:px-4 ${
                  active ? 'bg-ocean-600 text-white shadow-lg shadow-ocean-600/25' : 'text-slate-500 hover:bg-ocean-50 hover:text-ocean-700'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="hidden md:inline">{item.label}</span>
                <span className="md:hidden">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {tab === 'pesan' && <BookingForm onCreate={onCreate} />}
      {tab === 'validasi' && <ValidateTicket onValidate={onValidate} />}
      {tab === 'riwayat' && <TicketHistory bookings={bookings} />}
    </div>
  );
}
