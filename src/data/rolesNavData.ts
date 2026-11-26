import {
  BarChart2,
  CalendarDays,
  Coins,
  FileSearch,
  FileSpreadsheet,
  FileText,
  History,
  Info,
  Layers,
  LayoutGrid,
  MessageCircleMore,
  Printer,
  QrCode,
  Receipt,
  ScanLine,
  TrendingDown,
  Users,
  Wallet,
  Wrench,
} from 'lucide-react';
import SlantedTicket from '@/components/common/SlantedTicket';
import type { RoleNavConfig, RoleProfile, UserRole } from '@/types/roles';

/** ID menu "Profil Saya" per role (Super Admin memakai tab sendiri di SuperAdminPortal). */
export const PROFILE_NAV_ID: Record<Exclude<UserRole, 'superadmin'>, string> = {
  Manajer: 'mo-profil',
  admin: 'admin-profil',
  kasir: 'kasir-profil',
};

/** ID menu "Laporkan Bug" per role pelapor. */
export const BUG_NAV_ID: Record<Exclude<UserRole, 'superadmin'>, string> = {
  Manajer: 'mo-bug',
  admin: 'admin-bug',
  kasir: 'kasir-bug',
};

export const roleProfiles: Record<UserRole, RoleProfile> = {
  Manajer: {
    id: 'Manajer',
    title: 'Manajer',
    subtitle: 'MANAJER',
    userName: 'Budi Santoso, S.Par',
    userRoleName: 'MANAJER',
    avatarText: 'PS',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
  },
  admin: {
    id: 'admin',
    title: 'Admin',
    subtitle: 'ADMIN ',
    userName: 'M. Hasan Al-Farisi',
    userRoleName: 'ADMIN ',
    avatarText: 'AP',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
  },
  kasir: {
    id: 'kasir',
    title: 'Kasir',
    subtitle: 'KASIR / LOKET TIKET',
    userName: 'Siti Rahmawati',
    userRoleName: 'Kasir / Loket Tiket',
    avatarText: 'KL',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
  },
  superadmin: {
    id: 'superadmin',
    title: 'Super Admin',
    subtitle: 'SUPER ADMIN (PUSAT KONTROL)',
    userName: 'Raka Daniswara, S.Kom',
    userRoleName: 'Super Admin Xploria',
    avatarText: 'SA',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
  },
};

export const rolesNavigation: Record<UserRole, RoleNavConfig> = {
  superadmin: {
    role: 'superadmin',
    roleTitle: 'SUPER ADMIN (PUSAT KONTROL)',
    groups: [],
  },
  // ─── MANAJER ───────────────────────────────────────────────
  Manajer: {
    role: 'Manajer',
    roleTitle: 'MANAJER',
    groups: [
      {
        id: 'mo-dash',
        title: 'Dasboard',
        icon: LayoutGrid,
        items: [],
      },
      {
        id: 'mo-tiket',
        title: 'Tiketing & Transaksi',
        icon: SlantedTicket,
        items: [
          { id: 'mo-tiket-manage', label: 'Mengelola Tiket', icon: Wrench },
          { id: 'mo-tiket-categories', label: 'Kategori Tiket', icon: Layers },
          { id: 'mo-tiket-sales', label: 'Penjualan / Pesan', icon: SlantedTicket },
          { id: 'mo-tiket-validate', label: 'Validasi Tiket', icon: ScanLine },
          { id: 'mo-tiket-history', label: 'Riwayat Penjualan', icon: History },
          { id: 'mo-tiket-closeorder', label: 'Rekap & Close Order', icon: Receipt },
          { id: 'mo-tiket-calendar', label: 'Kalender Jadwal Mendatang', icon: CalendarDays },
        ],
      },
      {
        id: 'mo-laporan',
        title: 'Manajemen Data & laporan',
        icon: FileText,
        items: [
          { id: 'mo-report-visitors-cat', label: 'Kategori Pengunjung', icon: Users },
          { id: 'mo-report-finance', label: 'Laporan Keuangan', icon: Wallet },
          { id: 'mo-report-revenue-sharing', label: 'Pembagian Hasil', icon: Coins },
          { id: 'mo-report-expenses', label: 'Pengeluaran Operasional', icon: TrendingDown },
          { id: 'mo-report-tickets', label: 'Penjualan Tiket', icon: FileSpreadsheet },
          { id: 'mo-report-print', label: 'Cetak Laporan', icon: Printer },
        ],
      },
      {
        id: 'mo-destinasi',
        title: 'Profil Destinasi Wisata',
        icon: Info,
        items: [],
      },
      {
        id: 'mo-ulasan',
        title: 'Ulasan & Pengaduan',
        icon: MessageCircleMore,
        items: [],
      },
      {
        id: 'mo-akun',
        title: 'Manajemen Akun Staff',
        icon: Users,
        items: [],
      },
    ],
  },

  // ─── ADMIN  ───────────────────────────────────────────────
  admin: {
    role: 'admin',
    roleTitle: 'ADMIN ',
    groups: [
      {
        id: 'admin-dash',
        title: 'Dashboard',
        icon: LayoutGrid,
        items: [],
      },
      {
        id: 'admin-tiket',
        title: 'Tiketing & Transaksi',
        icon: SlantedTicket,
        items: [
          { id: 'admin-tiket-manage', label: 'Mengelola Tiket', icon: Wrench },
          { id: 'admin-tiket-categories', label: 'Kategori Tiket', icon: Layers },
          { id: 'admin-tiket-sales', label: 'Penjualan / Pesan', icon: SlantedTicket },
          { id: 'admin-tiket-validate', label: 'Validasi Tiket', icon: ScanLine },
          { id: 'admin-tiket-history', label: 'Riwayat Penjualan', icon: History },
          { id: 'admin-tiket-closeorder', label: 'Rekap & Close Order', icon: Receipt },
        ],
      },
      {
        id: 'admin-laporan',
        title: 'Manajemen Data & Laporan',
        icon: FileText,
        items: [
          { id: 'admin-report-visitors-cat', label: 'Kategori Pengunjung', icon: Users },
          { id: 'admin-report-finance', label: 'Laporan Keuangan', icon: Wallet },
          { id: 'admin-report-expenses', label: 'Pengeluaran Operasional', icon: TrendingDown },
          { id: 'admin-report-tickets', label: 'Penjualan Tiket', icon: FileSpreadsheet },
          { id: 'admin-report-print', label: 'Cetak Laporan', icon: Printer },
        ],
      },
      {
        id: 'admin-destinasi',
        title: 'Profil Destinasi Wisata',
        icon: Info,
        items: [],
      },
      {
        id: 'admin-dest-reviews',
        title: 'Ulasan & Pengaduan',
        icon: MessageCircleMore,
        items: [],
      },
    ],
  },

  // ─── KASIR / LOKET TIKET ──────────────────────────────────────────────────
  kasir: {
    role: 'kasir',
    roleTitle: 'KASIR / LOKET TIKET',
    groups: [
      {
        id: 'kasir-dash',
        title: 'Dashboard',
        icon: LayoutGrid,
        items: [],
      },
      {
        id: 'kasir-tiket',
        title: 'Tiketing & Transaksi',
        icon: SlantedTicket,
        items: [
          { id: 'kasir-tiket-sales', label: 'Penjualan Tiket', icon: SlantedTicket },
          { id: 'kasir-tiket-history', label: 'Riwayat Penjualan', icon: History },
          { id: 'kasir-tiket-validate', label: 'Validasi Tiket', icon: QrCode },
          { id: 'kasir-dash-calendar', label: 'Kalender Jadwal Mendatang', icon: CalendarDays },
          { id: 'kasir-dash-rekap', label: 'Laporan Keuangan & Rekapitulasi', icon: FileSearch },
        ],
      },
    ],
  },
};
