// src/lib/api/auth.ts
// src/lib/api/auth.ts
import { apiFetch } from '@/lib/api/common';

/** Ensure CSRF cookie is set before mutating requests **/
async function ensureCsrf() {
  await apiFetch('/csrf-cookie');
}

export async function login(payload: { identifier: string; password: string }) {
  await ensureCsrf();
  const res = await apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res; // apiFetch already returns parsed JSON
}

export async function register(payload: {
  name: string;
  username: string;
  email: string;
  phone?: string;
  password: string;
}) {
  await ensureCsrf();
  const res = await apiFetch('/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res;
}

export async function logout() {
  await ensureCsrf();
  const res = await apiFetch('/logout', { method: 'POST' });
  return res;
}

export async function getProfile() {
  const res = await apiFetch('/profile');
  return res;
}

export async function listRoles() {
  const res = await apiFetch('/roles');
  return res;
}


/** Ensure CSRF cookie is set before mutating requests **/
async function ensureCsrf() {
  await apiFetch('/csrf-cookie');
}

export async function login(payload: { identifier: string; password: string }) {
  await ensureCsrf();
  const res = await apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.json(); // { user: { role: string, ... } }
}

export async function register(payload: {
  name: string;
  username: string;
  email: string;
  phone?: string;
  password: string;
}) {
  await ensureCsrf();
  const res = await apiFetch('/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function logout() {
  await ensureCsrf();
  const res = await apiFetch('/logout', { method: 'POST' });
  return res.json();
}

export async function getProfile() {
  const res = await apiFetch('/profile');
  return res.json();
}

export async function listRoles() {
  const res = await apiFetch('/roles');
  return res.json();
}
