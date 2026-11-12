import type { LucideIcon } from 'lucide-react';

export type UserRole = 'pengelola' | 'admin' | 'kasir';

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
  icon?: LucideIcon;
};

export type NavGroup = {
  id: string;
  code?: string;
  title: string;
  icon: LucideIcon;
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
  name: string;
  tagline: string;
  description: string;
  location: string;
  contactPhone: string;
  contactEmail: string;
  openHours: string;
  facilities: string[];
  rules: string[];
};
