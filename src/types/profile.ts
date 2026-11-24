import type { UserRole } from './roles';

/** Data profil yang disimpan per role (override dari data default `roleProfiles`). */
export interface StoredProfile {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  avatarDataUrl: string | null;
  /** SHA-256 hex dari password. Jika null, password default berlaku. */
  passwordHash: string | null;
  updatedAt: string;
}

/** Profil gabungan (default + override) yang dipakai UI. */
export interface SessionProfile {
  role: UserRole;
  userName: string;
  username: string;
  email: string;
  phone: string;
  avatarDataUrl: string | null;
  avatarText: string;
  title: string;
  userRoleName: string;
}
