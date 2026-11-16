import {
  BarChart2,
  CalendarDays,
  FileSearch,
  FileText,
  Info,
  LayoutGrid,
  MessageCircleMore,
  QrCode,
  TrendingUp,
  Users,
} from 'lucide-react';
import SlantedTicket from '@/components/common/SlantedTicket';
import type { RoleNavConfig, RoleProfile, UserRole } from '@/types/roles';

export const roleProfiles: Record<UserRole, RoleProfile> = {
  pengelola: {
    id: 'pengelola',
    title: 'Pengelola',
    subtitle: 'PENGELOLA',
    userName: 'Budi Santoso, S.Par',
    userRoleName: 'Pengelola',
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
  // ─── PENGELOLA () ───────────────────────────────────────────────
  pengelola: {
    role: 'pengelola',
    roleTitle: 'PENGELOLA',
    groups: [
      {
        id: 'mo-dash',
        title: 'Dashboard Pengelola',
        icon: LayoutGrid,         // Grid 2x2 rounded squares (Item 1)
        items: [],
      },
      {
        id: 'mo-tiket',
        title: 'Tiketing & Transaksi',
        icon: SlantedTicket,      // Diagonal ticket tilted 45° with cutouts (Item 2)
        items: [],
      },
      {
        id: 'mo-laporan',
        title: 'Manajemen Data & Laporan',
        icon: FileText,           // Document with folded corner and lines (Item 3)
        items: [],
      },
      {
        id: 'mo-destinasi',
        title: 'Profil Destinasi Wisata',
        icon: Info,               // Circle with i (Item 4)
        items: [],
      },
      {
        id: 'mo-ulasan',
        title: 'Ulasan & Pengaduan',
        icon: MessageCircleMore,  // Chat bubble with 3 dots (Item 5)
        items: [],
      },
      {
        id: 'mo-akun',
        title: 'Manajemen Akun Staf',
        icon: Users,              // Two people group (Item 6)
        items: [],
      },
    ],
  },

  // ─── ADMIN (AKTOR PENGELOLA) ───────────────────────────────────────────────
  admin: {
    role: 'admin',
    roleTitle: 'ADMIN',
    groups: [
      {
        id: 'admin-dash',
        title: 'Dashboard Admin',
        icon: LayoutGrid,
        items: [],
      },
      {
        id: 'admin-tiket',
        title: 'Tiketing & Transaksi',
        icon: SlantedTicket,
        items: [],
      },
      {
        id: 'admin-laporan',
        title: 'Laporan Keuangan & Data',
        icon: FileText,
        items: [],
      },
      {
        id: 'admin-destinasi',
        title: 'Informasi Wisata',
        icon: Info,
        items: [],
      },
      {
        id: 'admin-dest-reviews',
        title: 'Ulasan Wisatawan',
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
        title: 'Dashboard Kasir',
        icon: LayoutGrid,
        items: [],
      },
      {
        id: 'kasir-calendar',
        title: 'Dashboard Kalender',
        icon: CalendarDays,
        items: [],
      },
      {
        id: 'kasir-tiket-sales',
        title: 'Penjualan Tiket',
        icon: SlantedTicket,
        items: [],
      },
      {
        id: 'kasir-tiket-validate',
        title: 'Validasi Tiket',
        icon: QrCode,
        items: [],
      },
      {
        id: 'kasir-dash-rekap',
        title: 'Laporan Keuangan & Rekapan',
        icon: FileSearch,
        items: [],
      },
    ],
  },
};
