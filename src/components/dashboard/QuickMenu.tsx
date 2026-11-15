import {
  FileText,
  MapPin,
  MessageSquare,
  ScanLine,
  Star,
  Tag,
  type LucideIcon,
} from 'lucide-react';
import SlantedTicket from '@/components/common/SlantedTicket';
import type { UserRole } from '@/types/roles';

export type QuickAction = {
  id: string;
  label: string;
  icon: any;
  target: string;
};

type QuickMenuProps = {
  currentRole: UserRole;
  onSelect: (targetId: string, label: string) => void;
};

export default function QuickMenu({ currentRole, onSelect }: QuickMenuProps) {
  const getQuickActions = (): QuickAction[] => {
    if (currentRole === 'kasir') {
      return [
        { id: 'q-kasir-sales', label: 'Jual Tiket', icon: SlantedTicket, target: 'kasir-tiket-sales' },
        { id: 'q-kasir-validate', label: 'Validasi QR', icon: ScanLine, target: 'kasir-tiket-validate' },
        { id: 'q-kasir-history', label: 'Riwayat Transaksi', icon: FileText, target: 'kasir-tiket-history' },
        { id: 'q-kasir-cal', label: 'Jadwal mendatang', icon: Tag, target: 'kasir-dash-calendar' },
      ];
    }

    if (currentRole === 'admin') {
      return [
        { id: 'q-adm-rekap', label: 'Rekap Harian', icon: FileText, target: 'admin-dash-rekap' },
        { id: 'q-adm-ticket', label: 'Kelola Tiket', icon: SlantedTicket, target: 'admin-tiket-manage' },
        { id: 'q-adm-exp', label: 'Pengeluaran', icon: Tag, target: 'admin-report-expenses' },
        { id: 'q-adm-rep', label: 'Laporan Keuangan', icon: FileText, target: 'admin-report-finance' },
        { id: 'q-adm-dest', label: 'Info Wisata', icon: MapPin, target: 'admin-dest-info' },
        { id: 'q-adm-rev', label: 'Ulasan Wisatawan', icon: MessageSquare, target: 'admin-dest-reviews' },
      ];
    }

    // Default: pengelola ()
    return [
      { id: 'q-mo-sales', label: 'Penjualan Tiket', icon: SlantedTicket, target: 'mo-tiket-sales' },
      { id: 'q-mo-cat', label: 'Kategori Tiket', icon: Tag, target: 'mo-tiket-categories' },
      { id: 'q-mo-val', label: 'Validasi Tiket', icon: ScanLine, target: 'mo-tiket-validate' },
      { id: 'q-mo-rep', label: 'Laporan Keuangan', icon: FileText, target: 'mo-report-finance' },
      { id: 'q-mo-share', label: 'Bagi Hasil', icon: Tag, target: 'mo-report-revenue-sharing' },
      { id: 'q-mo-rev', label: 'Ulasan Pengunjung', icon: MessageSquare, target: 'mo-reviews-view' },
    ];
  };

  const actions = getQuickActions();

  return (
    <section className="animate-fade-in-up rounded-3xl border border-ocean-100 bg-white p-5 shadow-card sm:p-6">
      <div className="flex items-center gap-2.5">
        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
        <h2 className="text-base font-bold text-ocean-900">Menu Cepat Role</h2>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => onSelect(action.target, action.label)}
              className="group flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-ocean-100 bg-gradient-to-b from-white to-ocean-50/50 p-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-ocean-300 hover:shadow-lg hover:shadow-ocean-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-ocean-100"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean-100 text-ocean-600 transition-all duration-200 group-hover:scale-110 group-hover:bg-ocean-600 group-hover:text-white">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-xs font-semibold leading-tight text-ocean-900">{action.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
