// src/lib/api/bugReports.ts
import { apiFetch } from '@/lib/api/common';

/** Ensure CSRF token before mutating **/
async function ensureCsrf() {
  await apiFetch('/csrf-cookie');
}

export async function fetchBugReports() {
  const res = await apiFetch('/bug-reports');
  return res.json(); // { data: BugReport[] }
}

export async function getBugReport(id: string) {
  const res = await apiFetch(`/bug-reports/${id}`);
  return res.json();
}

export async function createBugReport(payload: {
  title: string;
  category: string;
  priority: string;
  description: string;
  screenshotDataUrl?: string | null;
  reporter: { role: string; name: string; username: string };
}) {
  await ensureCsrf();
  const res = await apiFetch('/bug-reports', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function updateBugReport(id: string, payload: {
  status: string;
  note: string;
  responderName: string;
}) {
  await ensureCsrf();
  const res = await apiFetch(`/bug-reports/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return res.json();
}
