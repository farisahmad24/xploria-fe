import { hasStored, readStored, useStoredValue, writeStored } from '@/lib/localStore';
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

const EMPTY: BugReport[] = [];

// Data contoh agar halaman Super Admin tidak kosong saat pertama dibuka.
const SAMPLE_REPORTS: BugReport[] = [
  {
    id: 'BUG-20261122-101',
    title: 'Tombol simpan tiket tidak merespons saat kuantitas diubah',
    category: 'Perhitungan / Transaksi',
    priority: 'high',
    description:
      'Saat mengubah jumlah tiket dewasa menjadi 5 lalu menekan Simpan, layar tidak berubah dan total harga tetap menampilkan nilai lama.',
    screenshotDataUrl: null,
    status: 'pending',
    reporter: { role: 'kasir', name: 'Siti Rahmawati', username: 'siti.rahmawati' },
    createdAt: '2026-11-22T09:14:00+07:00',
    updatedAt: '2026-11-22T09:14:00+07:00',
    response: null,
  },
  {
    id: 'BUG-20261123-047',
    title: 'Tabel riwayat penjualan terpotong di layar kecil',
    category: 'Tampilan / UI',
    priority: 'low',
    description:
      'Pada layar smartphone, kolom aksi di tabel riwayat penjualan tidak terlihat dan harus digeser manual.',
    screenshotDataUrl: null,
    status: 'in_progress',
    reporter: { role: 'admin', name: 'M. Hasan Al-Farisi', username: 'hasan.alfarisi' },
    createdAt: '2026-11-23T13:40:00+07:00',
    updatedAt: '2026-11-23T15:02:00+07:00',
    response: {
      note: 'Sedang ditinjau tim pengembang. Perbaikan responsif dijadwalkan minggu ini.',
      responderName: 'Raka Daniswara, S.Kom',
      updatedAt: '2026-11-23T15:02:00+07:00',
    },
  },
  {
    id: 'BUG-20261124-012',
    title: 'Grafik kategori pengunjung menampilkan angka 0 setelah refresh',
    category: 'Error Sistem / Crash',
    priority: 'medium',
    description:
      'Setelah halaman di-refresh, grafik kategori pengunjung kosong padahal data penjualan sudah ada.',
    screenshotDataUrl: null,
    status: 'done',
    reporter: { role: 'Manajer', name: 'Budi Santoso, S.Par', username: 'budi.santoso' },
    createdAt: '2026-11-24T08:05:00+07:00',
    updatedAt: '2026-11-24T10:30:00+07:00',
    response: {
      note: 'Sudah diperbaiki pada pembaruan terbaru. Mohon konfirmasi kembali.',
      responderName: 'Raka Daniswara, S.Kom',
      updatedAt: '2026-11-24T10:30:00+07:00',
    },
  },
];

if (!hasStored(BUG_REPORTS_KEY)) {
  writeStored(BUG_REPORTS_KEY, SAMPLE_REPORTS);
}

export function getBugReports(): BugReport[] {
  return readStored<BugReport[]>(BUG_REPORTS_KEY, EMPTY);
}

export function useBugReports(): BugReport[] {
  return useStoredValue<BugReport[]>(BUG_REPORTS_KEY, EMPTY);
}

function createBugId(existing: BugReport[], now: Date): string {
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
  const taken = new Set(existing.map((r) => r.id));
  for (let attempt = 0; attempt < 50; attempt++) {
    const seq = String(Math.floor(Math.random() * 900) + 100);
    const id = `BUG-${datePart}-${seq}`;
    if (!taken.has(id)) return id;
  }
  return `BUG-${Date.now()}`;
}

/** Menyimpan laporan baru. Melempar error jika penyimpanan gagal (mis. kuota penuh). */
export function createBugReport(input: NewBugReportInput): BugReport {
  const existing = getBugReports();
  const now = new Date();
  const nowIso = now.toISOString();
  const report: BugReport = {
    id: createBugId(existing, now),
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
  if (!writeStored(BUG_REPORTS_KEY, [report, ...existing])) {
    throw new Error('Penyimpanan browser penuh. Coba lampiran yang lebih kecil atau hapus data lama.');
  }
  return report;
}

/** Memperbarui status dan tanggapan. Catatan kosong berarti tanggapan dihapus. */
export function updateBugReport(
  id: string,
  update: { status: BugStatus; note: string; responderName: string }
): boolean {
  const nowIso = new Date().toISOString();
  const note = update.note.trim();
  const next = getBugReports().map((r) =>
    r.id === id
      ? {
        ...r,
        status: update.status,
        updatedAt: nowIso,
        response: note ? { note, responderName: update.responderName, updatedAt: nowIso } : null,
      }
      : r
  );
  return writeStored(BUG_REPORTS_KEY, next);
}
