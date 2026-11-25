// src/lib/api/staff.ts
import { apiFetch } from '@/lib/api/common';

/** Ensure CSRF token before mutating **/
async function ensureCsrf() {
  await apiFetch('/csrf-cookie');
}

export async function listStaff(params: {
  search?: string;
  role_key?: string;
  per_page?: number;
  page?: number;
} = {}) {
  const qs = new URLSearchParams(params as any).toString();
  const path = `/pengelola/staff${qs ? '?' + qs : ''}`;
  const res = await apiFetch(path);
  return res.json();
}

export async function createStaff(payload: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role_key: string;
}) {
  await ensureCsrf();
  const res = await apiFetch('/staff/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function deleteStaff(userId: string) {
  await ensureCsrf();
  const res = await apiFetch(`/pengelola/staff/${userId}`, {
    method: 'DELETE',
  });
  return res.json();
}
