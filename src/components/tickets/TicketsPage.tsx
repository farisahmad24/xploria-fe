import { useEffect, useState } from 'react';
import { History, Layers, QrCode, Receipt, Wrench } from 'lucide-react';
import SlantedTicket from '@/components/common/SlantedTicket';
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
  mendatang,
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

type TicketsPageProps = {
  bookings: mendatang[];
  tickets: TicketItem[];
  categories: TicketCategory[];
  onCreate: (draft: BookingDraft) => mendatang;
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

      {/* ── TAB BAR NAVIGASI TIKETING ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-sm text-xs font-bold text-slate-600">
        {!isKasir && (
          <>
            <button
              type="button"
              onClick={() => setTab('kelola-tiket')}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 transition shrink-0 ${
                tab === 'kelola-tiket' ? 'bg-[#286EF2] text-white shadow-sm' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Wrench className="h-3.5 w-3.5" />
              <span>Kelola Jenis Tiket</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('kategori')}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 transition shrink-0 ${
                tab === 'kategori' ? 'bg-[#286EF2] text-white shadow-sm' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Kategori</span>
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => setTab('pesan')}
          className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 transition shrink-0 ${
            tab === 'pesan' ? 'bg-[#286EF2] text-white shadow-sm' : 'hover:bg-slate-50 text-slate-700'
          }`}
        >
          <SlantedTicket className="h-3.5 w-3.5" />
          <span>Loket Penjualan</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('riwayat')}
          className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 transition shrink-0 ${
            tab === 'riwayat' ? 'bg-[#286EF2] text-white shadow-sm' : 'hover:bg-slate-50 text-slate-700'
          }`}
        >
          <History className="h-3.5 w-3.5" />
          <span>Riwayat Penjualan</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
              tab === 'riwayat' ? 'bg-white/20 text-white' : 'bg-blue-50 text-[#286EF2]'
            }`}
          >
            {bookings.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setTab('validasi')}
          className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 transition shrink-0 ${
            tab === 'validasi' ? 'bg-[#286EF2] text-white shadow-sm' : 'hover:bg-slate-50 text-slate-700'
          }`}
        >
          <QrCode className="h-3.5 w-3.5" />
          <span>Validasi Gerbang</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('rekap-close-order')}
          className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 transition shrink-0 ${
            tab === 'rekap-close-order' ? 'bg-[#286EF2] text-white shadow-sm' : 'hover:bg-slate-50 text-slate-700'
          }`}
        >
          <Receipt className="h-3.5 w-3.5" />
          <span>Rekap &amp; Close Order</span>
        </button>
      </div>

      {/* ── 2. TAB PANELS ── */}
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
          onViewHistory={() => setTab('riwayat')}
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
