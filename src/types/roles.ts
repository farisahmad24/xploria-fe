import type React from 'react';
import type { LucideIcon } from 'lucide-react';

export type UserRole = 'Manajer' | 'admin' | 'kasir' | 'superadmin';

export type RoleProfile = {
  id: UserRole;
  title: string;
  subtitle: string;
  userName: string;
  userRoleName: string;
  avatarText: string;
  badgeColor: string;
};

export type NavSubItem = {
  id: string;
  code?: string;
  label: string;
  badge?: string;
  icon?: LucideIcon | React.ComponentType<any>;
};

export type NavGroup = {
  id: string;
  code?: string;
  title: string;
  icon: LucideIcon | React.ComponentType<any>;
  items: NavSubItem[];
};

export type RoleNavConfig = {
  role: UserRole;
  roleTitle: string;
  groups: NavGroup[];
};

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'aktif' | 'nonaktif';
  joinedDate: string;
  password?: string;
};

export type VisitorCategoryStat = {
  id: string;
  name: string;
  count: number;
  revenue: number;
  percentage: number;
  color: string;
};

export type RevenueShareItem = {
  id: string;
  entity: string;
  sharePercentage: number;
  amount: number;
  status: 'Disetujui' | 'Diproses' | 'Ditransfer';
  period: string;
};

export type OperationalExpense = {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  approvedBy: string;
};

export type VisitorReview = {
  id: string;
  userName: string;
  rating: number;
  date: string;
  ticketCode: string;
  comment: string;
  reply?: {
    author: string;
    role: string;
    message: string;
    date: string;
  };
};

export type DestinationInfo = {
  // 1. Gambar (bisa lebih dari 1)
  images: string[];
  // 2. Nama Tempat
  name: string;
  tagline: string;
  // 3. Lokasi
  location: string;
  // 4. Jam Operasional
  openHours: string;
  // 5. Deskripsi
  description: string;
  // 6. Himbauan / Informasi Penting (Jika Ada)
  importantNotice: string;
  // 7. Fasilitas
  facilities: string[];
  // 8. Kontak Manajer
  contactPhone: string;
  contactEmail: string;
  managerContact?: string;
  // 9. Pilihan tiket (harga terendah/penawaran terbaik)
  lowestTicketPrice: number;
  bestOffer: string;
  // 10. Rating
  rating: number;
  totalReviews?: number;
  // 11. Prediksi Kepadatan
  crowdPrediction: string;
  // 12. Rekomendasi
  recommendation: string;
  // Aturan tambahan
  rules: string[];
};
