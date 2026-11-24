import { useMemo, useState } from 'react';
import {
  Bug,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  Layers,
  RefreshCw,
  Search,
} from 'lucide-react';
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
  'rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition focus:border-[#286EF2] focus:outline-none focus:ring-4 focus:ring-blue-100';

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
    {
      id: 'all' as StatusFilter,
      label: 'Total Laporan',
      value: counts.total,
      tag: 'Semua',
      gradient: 'from-[#1E6BFF] via-[#286EF2] to-[#60A5FA]',
      icon: <Layers className="h-4 w-4" />,
    },
    {
      id: 'pending' as StatusFilter,
      label: 'Menunggu Ditinjau',
      value: counts.pending,
      tag: 'Pending',
      gradient: 'from-[#D97706] via-[#F59E0B] to-[#FBBF24]',
      icon: <Clock className="h-4 w-4" />,
    },
    {
      id: 'in_progress' as StatusFilter,
      label: 'Sedang Diproses',
      value: counts.in_progress,
      tag: 'Diproses',
      gradient: 'from-[#0284C7] via-[#0EA5E9] to-[#38BDF8]',
      icon: <RefreshCw className="h-4 w-4" />,
    },
    {
      id: 'done' as StatusFilter,
      label: 'Selesai',
      value: counts.done,
      tag: 'Selesai',
      gradient: 'from-[#059669] via-[#10B981] to-[#34D399]',
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#286EF2] uppercase tracking-wider mb-1">
            <span>Portal Super Admin</span>
            <span>•</span>
            <span>Pusat Kendala &amp; Laporan Bug</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
            Laporan Bug
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Tinjau laporan bug dari Admin, Kasir, dan Pengelola Wisata, lalu perbarui status penanganannya.
          </p>
        </div>
      </div>

      {/* ── 1. KPI Summary Cards (Konsisten Gradient & Active Ring) ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
        {summaryCards.map((card) => {
          const isSelected = statusFilter === card.id;
          return (
            <div
              key={card.label}
              onClick={() => setStatusFilter(card.id)}
              className={`cursor-pointer rounded-2xl p-4 sm:p-5 transition-all text-white shadow-sm hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-br ${card.gradient} ${
                isSelected
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-100 shadow-md scale-[1.02]'
                  : 'opacity-95 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                  {card.label}
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
                  {card.icon}
                </span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-white">{card.value}</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-black uppercase text-white tracking-wide">
                  {card.tag}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 2. UNIFIED FRAME CONTAINER (KONSISTEN MIN-HEIGHT & FOOTER) ── */}
      <div className="flex min-h-[560px] flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card">
        <div>
          {/* Card Sub-Header */}
          <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#286EF2] ring-1 ring-blue-100">
                <Bug className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Daftar Tiket Kendala &amp; Laporan Sistem</h2>
                <p className="text-xs text-slate-400">
                  Menampilkan {filtered.length} dari total {reports.length} laporan kendala yang masuk
                </p>
              </div>
            </div>

            {/* Quick Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-slate-100 p-1">
              {[
                { id: 'all', label: 'Semua Status' },
                { id: 'pending', label: 'Menunggu' },
                { id: 'in_progress', label: 'Diproses' },
                { id: 'done', label: 'Selesai' },
              ].map((tab) => {
                const isSelected = statusFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setStatusFilter(tab.id as StatusFilter)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-[#286EF2] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter Bar: Search + Role + Priority */}
          <div className="border-b border-slate-100 bg-slate-50/50 p-4 sm:px-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari judul, nama pelapor, atau ID laporan..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-3 text-xs text-slate-700 placeholder:text-slate-400 transition focus:border-[#286EF2] focus:outline-none focus:ring-4 focus:ring-blue-100 sm:text-sm"
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
            </div>
          </div>

          {/* Daftar: tabel (desktop) */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Pelapor</th>
                  <th className="px-6 py-4">Judul &amp; Kategori</th>
                  <th className="px-6 py-4">Prioritas</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((r) => (
                  <tr key={r.id} className="transition hover:bg-blue-50/40">
                    <td className="whitespace-nowrap px-6 py-4 font-mono text-[11px] font-bold text-slate-600">{r.id}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-600">{formatDate(r.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800">{r.reporter.name}</span>
                        <RoleBadge role={r.reporter.role} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="flex items-center gap-1.5 font-semibold text-slate-900">
                        {r.title}
                        {r.screenshotDataUrl && (
                          <ImageIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-label="Ada lampiran" />
                        )}
                      </p>
                      <p className="text-[11px] text-slate-500">{r.category}</p>
                    </td>
                    <td className="px-6 py-4">
                      <PriorityBadge priority={r.priority} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedId(r.id)}
                        className="rounded-xl bg-[#286EF2] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#1f5ad6] active:scale-95"
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
          <div className="space-y-3 p-4 md:hidden">
            {filtered.length === 0 && <EmptyState />}
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
        </div>

        {/* ── 3. FOOTER BAR (FRAME STABILITY) ── */}
        <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">
              Menampilkan <strong className="text-slate-800">{filtered.length}</strong> dari{' '}
              <strong className="text-slate-800">{reports.length}</strong> laporan bug
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Menunggu: <strong className="text-amber-600">{counts.pending}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Diproses: <strong className="text-blue-600">{counts.in_progress}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Selesai: <strong className="text-emerald-600">{counts.done}</strong>
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Sistem Pemantauan Bug &amp; Penanganan Kendala Layanan
          </span>
        </div>
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
    <div className="flex flex-col items-center gap-2 py-16 text-center text-slate-400">
      <Bug className="h-8 w-8 opacity-40" />
      <p className="text-sm font-semibold">Tidak ada laporan yang sesuai filter.</p>
    </div>
  );
}
