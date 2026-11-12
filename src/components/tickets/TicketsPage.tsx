import { useEffect, useState } from 'react';
import {
  History,
  Layers,
  Receipt,
  ScanLine,
  Ticket as TicketIcon,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import BookingForm from '@/components/tickets/BookingForm';
import CloseOrderConfirmModal from '@/components/tickets/CloseOrderConfirmModal';
import CloseOrderHistoryView from '@/components/tickets/CloseOrderHistoryView';
import CloseOrderRecapModal from '@/components/tickets/CloseOrderRecapModal';
import ManageTicketsView from '@/components/tickets/ManageTicketsView';
import TicketCategoriesView from '@/components/tickets/TicketCategoriesView';
import TicketHistory from '@/components/tickets/TicketHistory';
import ValidateTicket from '@/components/tickets/ValidateTicket';
import { initialCloseOrderRecaps } from '@/data/seedCloseOrders';
import { generateCloseOrderRecap } from '@/lib/bookings';
import type { UserRole } from '@/types/roles';
import type {
  Booking,
  BookingDraft,
  CloseOrderRecap,
  TicketCategory,
  TicketItem,
  ValidationResult,
} from '@/types/ticket';

export type TicketTab =
  | 'kelola-tiket'
  | 'kategori'
  | 'pesan'
  | 'validasi'
  | 'riwayat'
  | 'rekap-close-order';

const tabs: { id: TicketTab; label: string; icon: LucideIcon }[] = [
  { id: 'kelola-tiket', label: 'Mengelola Tiket', icon: Wrench },
  { id: 'kategori', label: 'Kategori Tiket', icon: Layers },
  { id: 'pesan', label: 'Penjualan / Pesan', icon: TicketIcon },
  { id: 'validasi', label: 'Validasi Tiket', icon: ScanLine },
  { id: 'riwayat', label: 'Riwayat Penjualan', icon: History },
  { id: 'rekap-close-order', label: 'Rekap & Close Order', icon: Receipt },
];

type TicketsPageProps = {
  bookings: Booking[];
  tickets: TicketItem[];
  categories: TicketCategory[];
  onCreate: (draft: BookingDraft) => Booking;
  onValidate: (code: string) => ValidationResult;
  onUpdateTickets: (tickets: TicketItem[]) => void;
  onUpdateCategories: (categories: TicketCategory[]) => void;
  onToast: (message: string) => void;
  initialTab?: TicketTab;
  cashierName?: string;
  currentRole?: UserRole | null;
};

export default function TicketsPage({
  bookings,
  tickets,
  categories,
  onCreate,
  onValidate,
  onUpdateTickets,
  onUpdateCategories,
  onToast,
  initialTab = 'kelola-tiket',
  cashierName = 'Siti Rahmawati (Kasir)',
  currentRole,
}: TicketsPageProps) {
  const isKasir = currentRole === 'kasir';

  // Role kasir otomatis dialihkan ke 'pesan' bila membuka kelola-tiket atau kategori
  const resolveInitialTab = (tabValue: TicketTab): TicketTab => {
    if (isKasir && (tabValue === 'kelola-tiket' || tabValue === 'kategori')) {
      return 'pesan';
    }
    return tabValue;
  };

  const [tab, setTab] = useState<TicketTab>(() => resolveInitialTab(initialTab));

  // Close Order & Kasir Session State
  const [isSessionOpen, setIsSessionOpen] = useState(true);
  const [sessionStartTime, setSessionStartTime] = useState('07:30 WIB');
  const [recaps, setRecaps] = useState<CloseOrderRecap[]>(initialCloseOrderRecaps);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [activeRecapModal, setActiveRecapModal] = useState<CloseOrderRecap | null>(null);

  useEffect(() => {
    if (initialTab) {
      setTab(resolveInitialTab(initialTab));
    }
  }, [initialTab, isKasir]);

  // RBAC Filter: Kasir TIDAK BISA mengakses 'kelola-tiket' dan 'kategori'
  const visibleTabs = tabs.filter((t) => {
    if (isKasir && (t.id === 'kelola-tiket' || t.id === 'kategori')) {
      return false;
    }
    return true;
  });

  // Eksekusi Close Order:
  // 1. Kunci transaksi pada sesi ini
  // 2. Generate rekapan otomatis
  // 3. Tampilkan modal rekapan
  const handleExecuteCloseOrder = () => {
    const recap = generateCloseOrderRecap(bookings, cashierName, sessionStartTime, new Date());
    setRecaps((prev) => [recap, ...prev]);
    setIsSessionOpen(false);
    setConfirmModalOpen(false);
    setActiveRecapModal(recap);
    onToast(`Close Order berhasil! Sesi kasir telah dikunci & rekapan ${recap.id} otomatis terbit.`);
  };

  const handleOpenNewSession = () => {
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setIsSessionOpen(true);
    setSessionStartTime(`${nowTime} WIB`);
    setActiveRecapModal(null);
    onToast('Sesi kasir baru telah dibuka! Loket siap melayani pemesanan tiket.');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── 1. HEADER JUDUL & DESKRIPSI MODUL DI ATAS NAVBAR ── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#286EF2]">
            {isKasir ? 'Kasir Loket Tiket' : 'Aktor Pengelola & Admin'} • Modul Tiketing &amp; Transaksi
          </p>
          <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl tracking-tight">
            {tab === 'kelola-tiket' && 'Mengelola Jenis Tiket'}
            {tab === 'kategori' && 'Mengelola Kategori Tiket'}
            {tab === 'pesan' && 'Pemesanan Tiket & Loket Transaksi'}
            {tab === 'validasi' && 'Validasi & Verifikasi Tiket'}
            {tab === 'riwayat' && 'Riwayat Transaksi Penjualan'}
            {tab === 'rekap-close-order' && 'Rekap Penjualan & Close Order'}
          </h1>
          <p className="text-sm text-slate-500">
            {isKasir
              ? 'Layanan loket penjualan tiket, validasi check-in gerbang wisata, dan rekapan tutup kasir.'
              : 'Pusat pengelolaan kategori tiket, tarif wisata, transaksi loket, validasi gerbang, dan pembukuan sesi.'}
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm border border-slate-200/80">
          <span className={`h-2 w-2 rounded-full ${isSessionOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <span>Petugas: {cashierName}</span>
        </div>
      </div>

      {/* ── 2. NAVBAR TIKETING: MEMANJANG FULL-WIDTH (100% LEBAR KONTAINER) ── */}
      <nav
        aria-label="Navigasi Fitur Tiketing"
        className="w-full rounded-2xl bg-white p-2 shadow-card border border-slate-200/80"
      >
        <div
          role="tablist"
          className="no-scrollbar flex w-full flex-wrap sm:flex-nowrap items-center gap-1.5 overflow-x-auto"
        >
          {visibleTabs.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(item.id)}
                className={`flex flex-1 min-w-[140px] items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs sm:text-sm font-bold transition-all duration-200 ${
                  active
                    ? 'bg-[#286EF2] text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── 3. TAB PANELS ── */}
      {tab === 'kelola-tiket' && !isKasir && (
        <ManageTicketsView
          tickets={tickets}
          categories={categories}
          onUpdateTickets={onUpdateTickets}
          onToast={onToast}
        />
      )}

      {tab === 'kategori' && !isKasir && (
        <TicketCategoriesView
          categories={categories}
          onUpdateCategories={onUpdateCategories}
          onToast={onToast}
        />
      )}

      {tab === 'pesan' && (
        <BookingForm
          onCreate={onCreate}
          isSessionOpen={isSessionOpen}
          onCloseOrder={() => setConfirmModalOpen(true)}
          onOpenNewSession={handleOpenNewSession}
          cashierName={cashierName}
          sessionStartTime={sessionStartTime}
        />
      )}

      {tab === 'validasi' && (
        <ValidateTicket onValidate={onValidate} bookings={bookings} />
      )}

      {tab === 'riwayat' && <TicketHistory bookings={bookings} />}

      {tab === 'rekap-close-order' && (
        <CloseOrderHistoryView
          bookings={bookings}
          recaps={recaps}
          isSessionOpen={isSessionOpen}
          onOpenCloseOrderConfirm={() => setConfirmModalOpen(true)}
          onOpenNewSession={handleOpenNewSession}
          cashierName={cashierName}
          sessionStartTime={sessionStartTime}
        />
      )}

      {/* Modal Konfirmasi Close Order */}
      <CloseOrderConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleExecuteCloseOrder}
        bookings={bookings}
        cashierName={cashierName}
      />

      {/* Modal Laporan Rekapan Otomatis */}
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
