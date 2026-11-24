import { useMemo, useState } from 'react';
import { Bug, Image as ImageIcon, Search } from 'lucide-react';
import BugReportDetailDrawer from '@/components/bug-report/BugReportDetailDrawer';
import {
  BUG_PRIORITY_META,
  BUG_STATUS_META,
  REPORTER_ROLE_BADGE,
  REPORTER_ROLE_LABEL,
  updateBugReport,
  useBugReports,
} from '@/lib/bugReports';
import { useSessionProfile } from '@/lib/profile';
import type { BugPriority, BugStatus, ReporterRole } from '@/types/bugReport';

type BugReportsAdminViewProps = {
  onToast: (message: string) => void;
};

type RoleFilter = 'all' | ReporterRole;
type PriorityFilter = 'all' | BugPriority;
type StatusFilter = 'all' | BugStatus;

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso));

const selectClass =
  'rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 transition focus:border-[#286EF2] focus:outline-none focus:ring-4 focus:ring-blue-100';

function StatusBadge({ status }: { status: BugStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${BUG_STATUS_META[status].badge}`}>
      {BUG_STATUS_META[status].label}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: BugPriority }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${BUG_PRIORITY_META[priority].badge}`}>
      {BUG_PRIORITY_META[priority].label}
    </span>
  );
}

function RoleBadge({ role }: { role: ReporterRole }) {
  return (
    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${REPORTER_ROLE_BADGE[role]}`}>
      {REPORTER_ROLE_LABEL[role]}
    </span>
  );
}

export default function BugReportsAdminView({ onToast }: BugReportsAdminViewProps) {
  const reports = useBugReports();
  const session = useSessionProfile('superadmin');
  const responderName = session.userName;

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      total: reports.length,
      pending: reports.filter((r) => r.status === 'pending').length,
      in_progress: reports.filter((r) => r.status === 'in_progress').length,
      done: reports.filter((r) => r.status === 'done').length,
    }),
    [reports]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reports
      .filter((r) => roleFilter === 'all' || r.reporter.role === roleFilter)
      .filter((r) => priorityFilter === 'all' || r.priority === priorityFilter)
      .filter((r) => statusFilter === 'all' || r.status === statusFilter)
      .filter(
        (r) =>
          !q ||
          r.title.toLowerCase().includes(q) ||
          r.reporter.name.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [reports, search, roleFilter, priorityFilter, statusFilter]);

  const selected = selectedId ? reports.find((r) => r.id === selectedId) ?? null : null;

  const handleSave = (id: string, status: BugStatus, note: string) => {
    const ok = updateBugReport(id, { status, note, responderName });
    if (ok) {
      onToast(`Laporan ${id} diperbarui ke status "${BUG_STATUS_META[status].label}".`);
    } else {
      onToast('Gagal menyimpan perubahan. Penyimpanan browser penuh atau diblokir.');
    }
  };

  const summaryCards = [
    { label: 'Total Laporan', value: counts.total, accent: 'text-slate-900' },
    { label: 'Menunggu Ditinjau', value: counts.pending, accent: 'text-amber-600' },
    { label: 'Sedang Diproses', value: counts.in_progress, accent: 'text-[#286EF2]' },
    { label: 'Selesai', value: counts.done, accent: 'text-emerald-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Judul */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Laporan Bug</h1>
        <p className="text-sm text-slate-500">
          Tinjau laporan bug dari Admin, Kasir, dan Pengelola Wisata, lalu perbarui statusnya.
        </p>
      </div>

      {/* Ringkasan */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
            <p className={`mt-1.5 text-2xl font-black ${card.accent}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul, nama pelapor, atau ID laporan..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-xs text-slate-700 placeholder:text-slate-400 transition focus:border-[#286EF2] focus:outline-none focus:ring-4 focus:ring-blue-100 sm:text-sm"
            />
          </label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
            className={selectClass}
            aria-label="Filter role pelapor"
          >
            <option value="all">Semua Role Pelapor</option>
            <option value="admin">Admin</option>
            <option value="kasir">Kasir</option>
            <option value="pengelola">Pengelola</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
            className={selectClass}
            aria-label="Filter prioritas"
          >
            <option value="all">Semua Prioritas</option>
            <option value="high">Tinggi / Kritis</option>
            <option value="medium">Sedang</option>
            <option value="low">Rendah</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className={selectClass}
            aria-label="Filter status"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="in_progress">Diproses</option>
            <option value="done">Selesai</option>
          </select>
        </div>
      </div>

      {/* Daftar: tabel (desktop) */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Pelapor</th>
              <th className="px-4 py-3">Judul &amp; Kategori</th>
              <th className="px-4 py-3">Prioritas</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((r) => (
              <tr key={r.id} className="transition hover:bg-blue-50/40">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] font-bold text-slate-600">{r.id}</td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-600">{formatDate(r.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800">{r.reporter.name}</span>
                    <RoleBadge role={r.reporter.role} />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="flex items-center gap-1.5 font-semibold text-slate-900">
                    {r.title}
                    {r.screenshotDataUrl && <ImageIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-label="Ada lampiran" />}
                  </p>
                  <p className="text-[11px] text-slate-500">{r.category}</p>
                </td>
                <td className="px-4 py-3"><PriorityBadge priority={r.priority} /></td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => setSelectedId(r.id)}
                    className="rounded-xl bg-[#286EF2] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#1f5ad6]"
                  >
                    Tinjau
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <EmptyState />}
      </div>

      {/* Daftar: kartu (mobile) */}
      <div className="space-y-3 md:hidden">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <EmptyState />
          </div>
        )}
        {filtered.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setSelectedId(r.id)}
            className="block w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-[#286EF2]/40"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] font-bold text-slate-500">{r.id}</span>
              <StatusBadge status={r.status} />
            </div>
            <p className="mt-1.5 font-bold text-slate-900">{r.title}</p>
            <p className="text-[11px] text-slate-500">{r.category}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">{r.reporter.name}</span>
              <RoleBadge role={r.reporter.role} />
              <PriorityBadge priority={r.priority} />
            </div>
            <p className="mt-2 text-[11px] text-slate-400">{formatDate(r.createdAt)}</p>
          </button>
        ))}
      </div>

      {selected && (
        <BugReportDetailDrawer
          key={selected.id}
          report={selected}
          onClose={() => setSelectedId(null)}
          onSave={(status, note) => handleSave(selected.id, status, note)}
        />
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center text-slate-400">
      <Bug className="h-8 w-8 opacity-40" />
      <p className="text-sm font-semibold">Tidak ada laporan yang sesuai filter.</p>
    </div>
  );
}
