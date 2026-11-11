import {
  Compass,
  FileSpreadsheet,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Ticket,
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
  pengelola: {
    role: 'pengelola',
    roleTitle: 'PENGELOLA (SUPER ADMIN)',
    groups: [
      {
        id: 'mo-dash',
        code: 'A.',
        title: 'Dashboard Pengelola',
        icon: LayoutDashboard,
        items: [
          { id: 'mo-dash-stats', code: 'a)', label: 'Melihat statistik pengunjung' },
          { id: 'mo-dash-sales', code: 'b)', label: 'Melihat data penjualan tiket' },
        ],
      },
      {
        id: 'mo-tiket',
        code: 'B.',
        title: 'Manajemen Tiket dan Transaksi',
        icon: Ticket,
        items: [
          { id: 'mo-tiket-sales', code: 'a)', label: 'Mengelola penjualan tiket' },
          { id: 'mo-tiket-categories', code: 'b)', label: 'Mengelola Kategori tiket' },
          { id: 'mo-tiket-validate', code: 'c)', label: 'Memvalidasi tiket' },
        ],
      },
      {
        id: 'mo-laporan',
        code: 'C.',
        title: 'Manajemen Data Pengunjung dan Laporan',
        icon: FileText,
        items: [
          { id: 'mo-report-visitors-cat', code: 'a)', label: 'Melihat jumlah kunjungan berdasarkan kategori pengunjung' },
          { id: 'mo-report-finance', code: 'b)', label: 'Melihat laporan keuangan' },
          { id: 'mo-report-print', code: 'c)', label: 'Mencetak laporan keuangan' },
          { id: 'mo-report-revenue-sharing', code: 'd)', label: 'Mengelola data pembagian hasil pendapatan' },
        ],
      },
      {
        id: 'mo-destinasi',
        code: 'D.',
        title: 'Manajemen Informasi Destinasi',
        icon: Compass,
        items: [
          { id: 'mo-dest-profile', code: 'a)', label: 'Mengelola informasi profil destinasi wisata' },
        ],
      },
      {
        id: 'mo-ulasan',
        code: 'E.',
        title: 'Manajemen Ulasan dan Pengaduan',
        icon: MessageSquare,
        items: [
          { id: 'mo-reviews-view', code: 'a)', label: 'Melihat ulasan pengunjung' },
          { id: 'mo-reviews-reply', code: 'b)', label: 'Membalas ulasan pengunjung' },
        ],
      },
      {
        id: 'mo-akun',
        code: 'F.',
        title: 'Manajemen Akun',
        icon: Users,
        items: [
          { id: 'mo-staff-accounts', code: 'a)', label: 'Mengelola akun staf' },
        ],
      },
    ],
  },

  admin: {
    role: 'admin',
    roleTitle: 'ADMIN (AKTOR PENGELOLA)',
    groups: [
      {
        id: 'admin-dash',
        code: 'A.',
        title: 'Dashboard',
        icon: LayoutDashboard,
        items: [
          { id: 'admin-dash-rekap', code: 'a)', label: 'Mengelola rekap pendapatan harian' },
          { id: 'admin-dash-stats', code: 'b)', label: 'Melihat statistik pengunjung' },
        ],
      },
      {
        id: 'admin-tiket',
        code: 'B.',
        title: 'Manajemen Tiket dan Transaksi',
        icon: Ticket,
        items: [
          { id: 'admin-tiket-manage', code: 'a)', label: 'Mengelola tiket' },
          { id: 'admin-tiket-history', code: 'b)', label: 'Melihat riwayat penjualan' },
        ],
      },
      {
        id: 'admin-laporan',
        code: 'C.',
        title: 'Manajemen Data Pengunjung dan Laporan',
        icon: FileSpreadsheet,
        items: [
          { id: 'admin-report-expenses', code: 'a)', label: 'Mengelola pengeluaran operasional' },
          { id: 'admin-report-tickets', code: 'b)', label: 'Mengelola penjualan tiket' },
          { id: 'admin-report-visitors-cat', code: 'c)', label: 'Melihat jumlah kunjungan berdasarkan kategori pengunjung' },
          { id: 'admin-report-finance', code: 'd)', label: 'Melihat laporan keuangan' },
          { id: 'admin-report-print', code: 'e)', label: 'Mencetak laporan keuangan' },
        ],
      },
      {
        id: 'admin-destinasi',
        code: 'D.',
        title: 'Manajemen Informasi Destinasi',
        icon: Compass,
        items: [
          { id: 'admin-dest-info', code: 'a)', label: 'Mengelola informasi wisata' },
          { id: 'admin-dest-reviews', code: 'b)', label: 'Melihat ulasan wisatawan' },
          { id: 'admin-dest-reply', code: 'c)', label: 'Membalas ulasan wisatawan' },
        ],
      },
    ],
  },

  kasir: {
    role: 'kasir',
    roleTitle: 'KASIR / LOKET TIKET',
    groups: [
      {
        id: 'kasir-dash',
        code: 'A.',
        title: 'Dashboard',
        icon: LayoutDashboard,
        items: [
          { id: 'kasir-dash-stats', code: 'a)', label: 'Melihat statistik pengunjung' },
          { id: 'kasir-dash-calendar', code: 'b)', label: 'Melihat kalender jadwal booking' },
        ],
      },
      {
        id: 'kasir-tiket',
        code: 'B.',
        title: 'Manajemen Tiket dan Transaksi',
        icon: Ticket,
        items: [
          { id: 'kasir-tiket-sales', code: 'a)', label: 'Mengelola penjualan tiket' },
          { id: 'kasir-tiket-validate', code: 'b)', label: 'Memvalidasi tiket' },
          { id: 'kasir-tiket-history', code: 'c)', label: 'Melihat riwayat penjualan tiket' },
        ],
      },
    ],
  },
};
