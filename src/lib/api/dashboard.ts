// src/lib/api/Dashboard.ts
import { apiFetch } from '@/lib/api/common';

/** Ensure CSRF token (not required for GET but kept for consistency) */
async function ensureCsrf() {
  await apiFetch('/csrf-cookie');
}

export async function getAdminDashboard() {
  // Admin Dashboard data
  const res = await apiFetch('/admin/Dashboard');
  return res; // JSON already returned by apiFetch
}

export async function getCashierDashboard() {
  const res = await apiFetch('/kasir/Dashboard');
  return res;
}
