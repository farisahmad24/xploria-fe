import {
  BarChart2,
  Bell,
  CalendarDays,
  FileSearch,
  FileText,
  Info,
  LayoutGrid,
  Lock,
  MessageCircle,
  QrCode,
  Receipt,
  Search,
  ShieldCheck,
  TrendingUp,
  UserCircle2,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import type { RoleNavConfig, RoleProfile, UserRole } from '@/types/roles';

export const roleProfiles: Record<UserRole, RoleProfile> = {
  pengelola: {
    id: 'pengelola',
    title: 'Pengelola',
    subtitle: 'Super Admin',
    userName: 'Budi Santoso, S.Par',
    userRoleName: 'Pengelola (Super Admin)',
    avatarText: 'PS',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
  },
  admin: {
    id: 'admin',
    title: 'Admin',
    subtitle: 'Aktor Pengelola',
    userName: 'M. Hasan Al-Farisi',
    userRoleName: 'Admin (Aktor Pengelola)',
    avatarText: 'AP',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
  },
  kasir: {
    id: 'kasir',
    title: 'Kasir',
    subtitle: 'Loket Tiket',
    userName: 'Siti Rahmawati',
    userRoleName: 'Kasir / Loket Tiket',
    avatarText: 'KL',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
  },
};

export const rolesNavigation: Record<UserRole, RoleNavConfig> = {
  // ─── PENGELOLA (SUPER ADMIN) ───────────────────────────────────────────────
  pengelola: {
    role: 'pengelola',
    roleTitle: 'PENGELOLA (SUPER ADMIN)',
    groups: [
      {
        id: 'mo-dash',
        title: 'Dashboard Pengelola',
        icon: LayoutGrid,         // Grid/Apps icon → overview dashboard
        items: [],
      },
      {
        id: 'mo-tiket',
        title: 'Tiketing & Transaksi',
        icon: Receipt,            // Receipt icon → transaksi tiket
        items: [],
      },
      {
        id: 'mo-laporan',
        title: 'Manajemen Data & Laporan',
        icon: FileText,           // Document icon → laporan data
        items: [],
      },
      {
        id: 'mo-destinasi',
        title: 'Profil Destinasi Wisata',
        icon: Info,               // Info circle → profil/informasi wisata
        items: [],
      },
      {
        id: 'mo-ulasan',
        title: 'Ulasan & Pengaduan',
        icon: MessageCircle,      // Chat bubble → ulasan & pengaduan
        items: [],
      },
      {
        id: 'mo-akun',
        title: 'Manajemen Akun Staf',
        icon: Users,              // People group → manajemen akun staf
        items: [],
      },
    ],
  },

  // ─── ADMIN (AKTOR PENGELOLA) ───────────────────────────────────────────────
  admin: {
    role: 'admin',
    roleTitle: 'ADMIN (AKTOR PENGELOLA)',
    groups: [
      {
        id: 'admin-dash',
        title: 'Dashboard Admin',
        icon: LayoutGrid,         // Grid/Apps → overview dashboard
        items: [],
      },
      {
        id: 'admin-tiket',
        title: 'Tiketing & Transaksi',
        icon: Receipt,            // Receipt → tiket & transaksi
        items: [],
      },
      {
        id: 'admin-laporan',
        title: 'Laporan Keuangan & Data',
        icon: Wallet,             // Wallet → keuangan & laporan
        items: [],
      },
      {
        id: 'admin-destinasi',
        title: 'Informasi Wisata',
        icon: Info,               // Info circle → informasi wisata
        items: [],
      },
      {
        id: 'admin-dest-reviews',
        title: 'Ulasan Wisatawan',
        icon: MessageCircle,      // Chat bubble → ulasan wisatawan
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
        title: 'Dashboard Kasir',
        icon: LayoutGrid,         // Grid/Apps → dashboard overview
        items: [
          { id: 'kasir-dash-stats',    label: 'Statistik & Overview',    icon: TrendingUp  },  // trending → statistik
          { id: 'kasir-dash-calendar', label: 'Kalender Jadwal Booking', icon: CalendarDays }, // calendar
        ],
      },
      {
        id: 'kasir-tiket-sales',
        title: 'Penjualan Tiket',
        icon: Zap,                // Lightning/Zap → aksi cepat penjualan
        items: [],
      },
      {
        id: 'kasir-tiket-validate',
        title: 'Validasi Tiket',
        icon: QrCode,             // QR code → scan/validasi tiket gerbang
        items: [],
      },
      {
        id: 'kasir-dash-rekap',
        title: 'Laporan Keuangan & Rekapan',
        icon: FileSearch,         // File + search → rekap & close order
        items: [],
      },
    ],
  },
};
