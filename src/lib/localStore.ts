import { useSyncExternalStore } from 'react';

/**
 * Lapisan penyimpanan bersama berbasis localStorage.
 * - Membaca nilai di-cache per key agar aman dipakai sebagai snapshot React (useSyncExternalStore).
 * - Setiap penulisan memicu event sehingga komponen di pohon React yang berbeda
 *   (mis. App vs SuperAdminPortal) ikut ter-update tanpa reload.
 */

const CHANGE_EVENT = 'ePloria:storage-change';

type CacheEntry = { raw: string | null; value: unknown };
const cache = new Map<string, CacheEntry>();

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function hasStored(key: string): boolean {
  try {
    return window.localStorage.getItem(key) !== null;
  } catch {
    return true; // storage tidak tersedia: jangan seed apa pun
  }
}

export function readStored<T>(key: string, fallback: T): T {
  const raw = readRaw(key);
  const cached = cache.get(key);
  if (cached && cached.raw === raw) return cached.value as T;

  let value: unknown = fallback;
  if (raw !== null) {
    try {
      value = JSON.parse(raw);
    } catch {
      value = fallback;
    }
  }
  cache.set(key, { raw, value });
  return value as T;
}

/** Mengembalikan false jika penyimpanan gagal (mis. kuota penuh / storage diblokir). */
export function writeStored<T>(key: string, value: T): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return false;
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: key }));
  return true;
}

/** Hook reaktif untuk membaca nilai tersimpan. `fallback` harus berupa konstanta (referensi stabil). */
export function useStoredValue<T>(key: string, fallback: T): T {
  return useSyncExternalStore(
    (onChange) => {
      window.addEventListener(CHANGE_EVENT, onChange);
      window.addEventListener('storage', onChange);
      return () => {
        window.removeEventListener(CHANGE_EVENT, onChange);
        window.removeEventListener('storage', onChange);
      };
    },
    () => readStored(key, fallback),
    () => fallback
  );
}
