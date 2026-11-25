// src/lib/bugReports.ts – wrapper around the API module with graceful fallback.
import { useState, useEffect } from 'react';
import { hasStored, readStored, writeStored } from '@/lib/localStore';
import {
  fetchBugReports,
  getBugReport as apiGetBugReport,
  createBugReport as apiCreateBugReport,
  updateBugReport as apiUpdateBugReport,
} from '@/lib/api/bugReports';
import type {
  BugCategory,
  BugPriority,
  BugReport,
  BugStatus,
  NewBugReportInput,
  ReporterRole,
} from '@/types/bugReport';

export const BUG_REPORTS_KEY = 'ePloria_bug_reports';

export const BUG_CATEGORIES: BugCategory[] = [
  'Tampilan / UI',
  'Error Sistem / Crash',
  'Perhitungan / Transaksi',
  'Akses & Login',
  'Lainnya',
];

export const BUG_PRIORITY_META: Record<BugPriority, { label: string; badge: string }> = {
  low: { label: 'Rendah', badge: 'bg-slate-100 text-slate-600' },
  medium: { label: 'Sedang', badge: 'bg-amber-100 text-amber-700' },
  high: { label: 'Tinggi / Kritis', badge: 'bg-rose-100 text-rose-700' },
};

export const BUG_STATUS_META: Record<BugStatus, { label: string; badge: string }> = {
  pending: { label: 'Menunggu', badge: 'bg-amber-100 text-amber-700' },
  in_progress: { label: 'Diproses', badge: 'bg-blue-100 text-[#286EF2]' },
  done: { label: 'Selesai', badge: 'bg-emerald-100 text-emerald-700' },
};

export const REPORTER_ROLE_LABEL: Record<ReporterRole, string> = {
  Manajer: 'Manajer',
  admin: 'Admin',
  kasir: 'Kasir',
};

export const REPORTER_ROLE_BADGE: Record<ReporterRole, string> = {
  Manajer: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  admin: 'bg-sky-50 text-sky-700 border-sky-200',
  kasir: 'bg-amber-50 text-amber-700 border-amber-200',
};

export const MAX_SCREENSHOT_BYTES = 2 * 1024 * 1024;

const SAMPLE_REPORTS: BugReport[] = [
  {
    id: 'BUG-20261124-101',
    title: 'Tombol cetak tidak merespons',
    category: 'Perhitungan / Transaksi',
    priority: 'high',
    description: 'Setelah transaksi berhasil, struk tidak tercetak otomatis.',
    screenshotDataUrl: null,
    status: 'pending',
    reporter: { role: 'kasir', name: 'Siti Rahmawati', username: 'siti.rahmawati' },
    createdAt: '2026-11-24T09:14:00+07:00',
    updatedAt: '2026-11-24T09:14:00+07:00',
    response: null,
  },
];

if (!hasStored(BUG_REPORTS_KEY)) {
  writeStored(BUG_REPORTS_KEY, SAMPLE_REPORTS);
}

/** Retrieve all bug reports (async API with local fallback) */
export async function getBugReports(): Promise<BugReport[]> {
  try {
    const resp = await fetchBugReports();
    if (resp && Array.isArray(resp.data)) {
      writeStored(BUG_REPORTS_KEY, resp.data);
      return resp.data;
    }
  } catch (err) {
    console.warn('getBugReports API error, reading from storage', err);
  }
  return readStored<BugReport[]>(BUG_REPORTS_KEY, SAMPLE_REPORTS);
}

/** React hook returning an array of BugReports, synced with API */
export function useBugReports(): BugReport[] {
  const [reports, setReports] = useState<BugReport[]>(() =>
    readStored<BugReport[]>(BUG_REPORTS_KEY, SAMPLE_REPORTS)
  );

  useEffect(() => {
    let mounted = true;
    fetchBugReports()
      .then((resp) => {
        if (mounted && resp && Array.isArray(resp.data)) {
          setReports(resp.data);
          writeStored(BUG_REPORTS_KEY, resp.data);
        }
      })
      .catch((e) => console.warn('useBugReports fetch error:', e));
    return () => {
      mounted = false;
    };
  }, []);

  return reports;
}

/** Create a new bug report via backend */
export async function createBugReport(input: NewBugReportInput): Promise<BugReport> {
  const existing = readStored<BugReport[]>(BUG_REPORTS_KEY, SAMPLE_REPORTS);
  try {
    const resp = await apiCreateBugReport(input);
    if (resp && resp.data) {
      const next = [resp.data, ...existing];
      writeStored(BUG_REPORTS_KEY, next);
      return resp.data;
    }
  } catch (err) {
    console.warn('createBugReport API failed, saving to local fallback', err);
  }

  const nowIso = new Date().toISOString();
  const fallbackReport: BugReport = {
    id: `BUG-${Date.now()}`,
    title: input.title.trim(),
    category: input.category,
    priority: input.priority,
    description: input.description.trim(),
    screenshotDataUrl: input.screenshotDataUrl,
    status: 'pending',
    reporter: input.reporter,
    createdAt: nowIso,
    updatedAt: nowIso,
    response: null,
  };
  writeStored(BUG_REPORTS_KEY, [fallbackReport, ...existing]);
  return fallbackReport;
}

/** Update an existing bug report via backend */
export async function updateBugReport(
  id: string,
  update: { status: BugStatus; note: string; responderName: string }
): Promise<boolean> {
  try {
    await apiUpdateBugReport(id, update);
  } catch (err) {
    console.warn('updateBugReport API failed, updating local fallback', err);
  }

  const existing = readStored<BugReport[]>(BUG_REPORTS_KEY, SAMPLE_REPORTS);
  const nowIso = new Date().toISOString();
  const next = existing.map((r) =>
    r.id === id
      ? {
          ...r,
          status: update.status,
          updatedAt: nowIso,
          response: update.note ? { note: update.note, responderName: update.responderName, updatedAt: nowIso } : null,
        }
      : r
  );
  writeStored(BUG_REPORTS_KEY, next);
  return true;
}
