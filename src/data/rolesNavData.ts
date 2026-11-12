import {
  BarChart3,
  BookOpen,
  CalendarDays,
  Compass,
  FileSpreadsheet,
  FileText,
  Images,
  LayoutDashboard,
  MessageCircle,
  MessageSquare,
  Receipt,
  ScanLine,
  Star,
  Ticket,
  TrendingUp,
  UserCog,
  Users,
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
        icon: LayoutDashboard,
        items: [],
      },
      {
        // No sub-items → behaves as a direct link (Navbar handles feature tabs)
        id: 'mo-tiket',
        title: 'Tiketing & Transaksi',
        icon: Ticket,
        items: [],
      },
      {
        // No sub-items → behaves as a direct link
        id: 'mo-laporan',
        title: 'Manajemen Data & Laporan',
        icon: FileText,
        items: [],
      },
      {
        id: 'mo-destinasi',
        title: 'Profil Destinasi Wisata',
        icon: Compass,
        items: [],
      },
      {
        id: 'mo-ulasan',
        title: 'Ulasan & Pengaduan',
        icon: MessageSquare,
        items: [],
      },
      {
        id: 'mo-akun',
        title: 'Manajemen Akun Staf',
        icon: Users,
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
        icon: LayoutDashboard,
        items: [],
      },
      {
        // No sub-items → direct link
        id: 'admin-tiket',
        title: 'Tiketing & Transaksi',
        icon: Ticket,
        items: [],
      },
      {
        // No sub-items → direct link
        id: 'admin-laporan',
        title: 'Laporan Keuangan & Data',
        icon: FileSpreadsheet,
        items: [],
      },
      {
        id: 'admin-destinasi',
        title: 'Informasi Wisata',
        icon: Compass,
        items: [],
      },
      {
        id: 'admin-dest-reviews',
        title: 'Ulasan Wisatawan',
        icon: MessageSquare,
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
        icon: LayoutDashboard,
        items: [
          { id: 'kasir-dash-stats',    label: 'Statistik & Overview',      icon: BarChart3 },
          { id: 'kasir-dash-calendar', label: 'Kalender Jadwal Booking',   icon: CalendarDays },
        ],
      },
      {
        // No sub-items → direct link
        id: 'kasir-tiket-sales',
        title: 'Penjualan Tiket',
        icon: Ticket,
        items: [],
      },
      {
        // No sub-items → direct link
        id: 'kasir-tiket-validate',
        title: 'Validasi Tiket',
        icon: ScanLine,
        items: [],
      },
      {
        // No sub-items → direct link
        id: 'kasir-dash-rekap',
        title: 'Laporan Keuangan & Rekapan',
        icon: FileSpreadsheet,
        items: [],
      },
    ],
  },
};
