// src/lib/api/tickets.ts
import { apiFetch } from '@/lib/api/common';

/** Ensure CSRF token for mutating requests */
async function ensureCsrf() {
  await apiFetch('/csrf-cookie');
}

/** List all tickets */
export async function listTickets(params: Record<string, any> = {}) {
  const qs = new URLSearchParams(params as any).toString();
  const path = `/tickets${qs ? '?' + qs : ''}`;
  const res = await apiFetch(path);
  return res; // JSON array
}

/** Get ticket detail by ID */
export async function getTicket(id: string) {
  const res = await apiFetch(`/tickets/${id}`);
  return res;
}

/** Create a new ticket */
export async function createTicket(payload: any) {
  await ensureCsrf();
  const res = await apiFetch('/tickets', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res;
}

/** Update ticket (partial) */
export async function updateTicket(id: string, payload: any) {
  await ensureCsrf();
  const res = await apiFetch(`/tickets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return res;
}

/** Validate ticket code (used by gate scanner) */
export async function validateTicketCode(code: string) {
  const res = await apiFetch(`/tickets/validate/${encodeURIComponent(code)}`);
  return res;
}
