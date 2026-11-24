import { useMemo } from 'react';
import { roleProfiles } from '@/data/rolesNavData';
import { readStored, useStoredValue, writeStored } from '@/lib/localStore';
import type { UserRole } from '@/types/roles';
import type { SessionProfile, StoredProfile } from '@/types/profile';

/** Sama dengan password default pada halaman login. */
export const DEFAULT_PASSWORD = 'password123';
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
export const ACCEPTED_AVATAR_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

const PROFILE_KEY_PREFIX = 'ePloria_profile_';
const NO_ROLE_KEY = 'ePloria_profile_none';

const DEFAULT_ACCOUNT: Record<UserRole, { username: string; email: string }> = {
  pengelola: { username: 'budi.santoso', email: 'budi.santoso@ploria.id' },
  admin: { username: 'hasan.alfarisi', email: 'hasan.alfarisi@ploria.id' },
  kasir: { username: 'siti.rahmawati', email: 'siti.rahmawati@ploria.id' },
  superadmin: { username: 'raka.daniswara', email: 'raka.superadmin@ploria.id' },
};

const profileKey = (role: UserRole) => `${PROFILE_KEY_PREFIX}${role}`;

// ─── Penyimpanan ──────────────────────────────────────────────────────────

export function getStoredProfile(role: UserRole): StoredProfile | null {
  return readStored<StoredProfile | null>(profileKey(role), null);
}

/** Menggabungkan patch ke profil tersimpan. Mengembalikan false jika penyimpanan gagal. */
export function saveStoredProfile(role: UserRole, patch: Partial<StoredProfile>): boolean {
  const current = getStoredProfile(role);
  const base = roleProfiles[role];
  const account = DEFAULT_ACCOUNT[role];
  const next: StoredProfile = {
    fullName: base.userName,
    username: account.username,
    email: account.email,
    phone: '',
    avatarDataUrl: null,
    passwordHash: null,
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  return writeStored(profileKey(role), next);
}

/** Gabungan data default role dengan override tersimpan. */
export function buildSessionProfile(role: UserRole, stored: StoredProfile | null): SessionProfile {
  const base = roleProfiles[role];
  const account = DEFAULT_ACCOUNT[role];
  const userName = stored?.fullName || base.userName;
  return {
    role,
    userName,
    username: stored?.username || account.username,
    email: stored?.email || account.email,
    phone: stored?.phone ?? '',
    avatarDataUrl: stored?.avatarDataUrl ?? null,
    avatarText: userName === base.userName ? base.avatarText : getInitials(userName),
    title: base.title,
    userRoleName: base.userRoleName,
  };
}

export function useSessionProfile(role: UserRole): SessionProfile;
export function useSessionProfile(role: UserRole | null): SessionProfile | null;
export function useSessionProfile(role: UserRole | null): SessionProfile | null {
  const stored = useStoredValue<StoredProfile | null>(role ? profileKey(role) : NO_ROLE_KEY, null);
  return useMemo(() => (role ? buildSessionProfile(role, stored) : null), [role, stored]);
}

// ─── Password ─────────────────────────────────────────────────────────────

export async function hashPassword(text: string): Promise<string> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error('Browser ini tidak mendukung enkripsi password (gunakan localhost atau HTTPS).');
  }
  const digest = await subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(role: UserRole, input: string): Promise<boolean> {
  const stored = getStoredProfile(role);
  const expected = stored?.passwordHash ?? (await hashPassword(DEFAULT_PASSWORD));
  return (await hashPassword(input)) === expected;
}

// ─── Util ─────────────────────────────────────────────────────────────────

export function getInitials(name: string): string {
  const words = name.replace(/[,.]/g, ' ').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = words[0][0] ?? '';
  const second = words.length > 1 ? words[1][0] : words[0][1] ?? '';
  return `${first}${second}`.toUpperCase();
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// ─── Validasi form profil ─────────────────────────────────────────────────

export type ProfileFormValues = {
  fullName: string;
  username: string;
  email: string;
  phone: string;
};

export type ProfileFormErrors = Partial<Record<keyof ProfileFormValues, string>>;

export function validateProfileForm(values: ProfileFormValues): ProfileFormErrors {
  const errors: ProfileFormErrors = {};
  const fullName = values.fullName.trim();
  const username = values.username.trim();
  const email = values.email.trim();
  const phone = values.phone.replace(/[\s-]/g, '');

  if (fullName.length < 3) errors.fullName = 'Nama lengkap minimal 3 karakter';
  if (!/^[a-z0-9._]{4,20}$/.test(username)) {
    errors.username = 'Username 4-20 karakter: huruf kecil, angka, titik, atau underscore';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Format email tidak valid';
  if (phone && !/^\+?[0-9]{9,15}$/.test(phone)) {
    errors.phone = 'Nomor telepon tidak valid (9-15 angka)';
  }
  return errors;
}

export type PasswordFormValues = {
  current: string;
  next: string;
  confirm: string;
};

export type PasswordFormErrors = Partial<Record<keyof PasswordFormValues, string>>;

/** Validasi sinkron. Pengecekan password lama dilakukan terpisah (async) lewat verifyPassword. */
export function validatePasswordForm(values: PasswordFormValues): PasswordFormErrors {
  const errors: PasswordFormErrors = {};
  if (!values.current) errors.current = 'Masukkan password lama';
  if (values.next.length < MIN_PASSWORD_LENGTH) {
    errors.next = `Password baru minimal ${MIN_PASSWORD_LENGTH} karakter`;
  } else if (values.next === values.current) {
    errors.next = 'Password baru harus berbeda dengan password lama';
  }
  if (values.confirm !== values.next) errors.confirm = 'Konfirmasi password tidak cocok';
  return errors;
}
