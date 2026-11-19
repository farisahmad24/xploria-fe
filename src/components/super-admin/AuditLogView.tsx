import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCcw, 
  UserCheck, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Download,
  Calendar,
  Building2,
  RefreshCw
} from 'lucide-react';
import { AuditLogEntry, MitraStatus } from '../../types/superAdmin';

interface AuditLogViewProps {
  auditLogs: AuditLogEntry[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ auditLogs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<'ALL' | 'APPROVE' | 'REJECT' | 'SUSPEND' | 'REACTIVATE' | 'REGISTER'>('ALL');
  const [dateSort, setDateSort] = useState<'desc' | 'asc'>('desc');

  // KPI Ringkasan
  const stats = useMemo(() => {
    return {
      total: auditLogs.length,
      approved: auditLogs.filter(l => l.actionType === 'APPROVE').length,
      rejected: auditLogs.filter(l => l.actionType === 'REJECT').length,
      suspended: auditLogs.filter(l => l.actionType === 'SUSPEND').length,
      registered: auditLogs.filter(l => l.actionType === 'REGISTER').length,
    };
  }, [auditLogs]);

  // Filtered & Sorted logs
  const filteredLogs = useMemo(() => {
    return auditLogs
      .filter((log) => {
        // Filter action
        if (actionFilter !== 'ALL' && log.actionType !== actionFilter) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchMitra = log.mitraName.toLowerCase().includes(q);
          const matchAdmin = log.executorName.toLowerCase().includes(q) || log.executorEmail.toLowerCase().includes(q);
          const matchReason = log.reason.toLowerCase().includes(q);
          const matchDetails = log.details?.toLowerCase().includes(q);
          if (!matchMitra && !matchAdmin && !matchReason && !matchDetails) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return dateSort === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [auditLogs, actionFilter, searchQuery, dateSort]);

  // Format status badge helper
  const renderStatusBadge = (status: MitraStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Menunggu
          </span>
        );
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Aktif
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Ditolak
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            Dibekukan
          </span>
        );
      default:
        return null;
    }
  };

  const getActionIcon = (actionType: AuditLogEntry['actionType']) => {
    switch (actionType) {
      case 'APPROVE':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'REJECT':
        return <XCircle className="w-4 h-4 text-rose-600" />;
      case 'SUSPEND':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'REACTIVATE':
        return <RotateCcw className="w-4 h-4 text-blue-600" />;
      case 'REGISTER':
        return <UserCheck className="w-4 h-4 text-indigo-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  const getActionBadge = (actionType: AuditLogEntry['actionType']) => {
    switch (actionType) {
      case 'APPROVE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
            Persetujuan Akun
          </span>
        );
      case 'REJECT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-800">
            Penolakan Berkas
          </span>
        );
      case 'SUSPEND':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800">
            Pembekuan Akun
          </span>
        );
      case 'REACTIVATE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800">
            Pemulihan Akses
          </span>
        );
      case 'REGISTER':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-100 text-indigo-800">
            Pendaftaran Baru
          </span>
        );
      default:
        return null;
    }
  };

  const formatDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return {
        date: date.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        time: date.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      };
    } catch {
      return { date: isoString, time: '' };
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID Log', 'Waktu', 'Eksekutor', 'Email Eksekutor', 'Mitra Wisata', 'Tipe Aksi', 'Status Sebelum', 'Status Sesudah', 'Alasan / Catatan'];
    const rows = filteredLogs.map((log) => [
      log.id,
      log.timestamp,
      `"${log.executorName}"`,
      `"${log.executorEmail}"`,
      `"${log.mitraName}"`,
      log.actionType,
      log.previousStatus || '-',
      log.newStatus,
      `"${(log.reason + (log.details ? ' - ' + log.details : '')).replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `audit_log_xploria_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Sistem Keamanan & Kepatuhan
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Audit Log Sistem</h1>
          <p className="text-sm text-slate-500">
            Jejak digital kronologis atas setiap keputusan verifikasi, pembekuan, dan perubahan status akun mitra wisata.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition shadow-sm active:scale-95"
            title="Ekspor daftar log ke format CSV"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Ringkasan Audit */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Entri Log</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.total}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Seluruh jejak terekam</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-sm bg-gradient-to-br from-white to-emerald-50/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Disetujui</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700">{stats.approved}</div>
          <p className="text-[11px] text-emerald-600/80 mt-0.5">Mitra resmi aktif</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200/80 shadow-sm bg-gradient-to-br from-white to-rose-50/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Ditolak</span>
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-700">{stats.rejected}</div>
          <p className="text-[11px] text-rose-600/80 mt-0.5">Memerlukan revisi</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-sm bg-gradient-to-br from-white to-amber-50/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Dibekukan</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-700">{stats.suspended}</div>
          <p className="text-[11px] text-amber-600/80 mt-0.5">Akses ditangguhkan</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-indigo-200/80 shadow-sm bg-gradient-to-br from-white to-indigo-50/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">Pendaftaran</span>
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-700">{stats.registered}</div>
          <p className="text-[11px] text-indigo-600/80 mt-0.5">Calon mitra masuk</p>
        </div>
      </div>

      {/* Kontrol Pencarian & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama destinasi wisata, eksekutor Super Admin, atau alasan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#286EF2]/20 focus:border-[#286EF2]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Hapus
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Tipe Aksi */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setActionFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition ${
                actionFilter === 'ALL'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({stats.total})
            </button>
            <button
              onClick={() => setActionFilter('APPROVE')}
              className={`px-3 py-1.5 rounded-lg transition ${
                actionFilter === 'APPROVE'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Setuju
            </button>
            <button
              onClick={() => setActionFilter('REJECT')}
              className={`px-3 py-1.5 rounded-lg transition ${
                actionFilter === 'REJECT'
                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tolak
            </button>
            <button
              onClick={() => setActionFilter('SUSPEND')}
              className={`px-3 py-1.5 rounded-lg transition ${
                actionFilter === 'SUSPEND'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bekukan
            </button>
          </div>

          {/* Urutan Waktu */}
          <button
            onClick={() => setDateSort(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            title="Ubah urutan kronologis"
          >
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{dateSort === 'desc' ? 'Terbaru Dahulu' : 'Terlama Dahulu'}</span>
          </button>
        </div>
      </div>

      {/* Tabel Kronologis Audit Log */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Waktu & Tanggal</th>
                <th className="py-3.5 px-4">Super Admin Eksekutor</th>
                <th className="py-3.5 px-4">Destinasi Mitra</th>
                <th className="py-3.5 px-4">Aksi & Perubahan Status</th>
                <th className="py-3.5 px-4">Alasan & Catatan Resmi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="max-w-sm mx-auto flex flex-col items-center">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                        <Filter className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-slate-700">Tidak ada riwayat audit ditemukan</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Coba sesuaikan kata kunci pencarian atau ubah filter tipe aksi.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const dt = formatDateTime(log.timestamp);
                  return (
                    <tr key={log.id} className="hover:bg-slate-50/60 transition group">
                      {/* Waktu & Tanggal */}
                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        <div className="flex items-start gap-2">
                          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition">
                            <Calendar className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{dt.date}</div>
                            <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {dt.time} WIB
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-1">ID: #{log.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Eksekutor */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#286EF2]/10 text-[#286EF2] font-black text-xs flex items-center justify-center shrink-0 border border-[#286EF2]/20">
                            {log.executorName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                              {log.executorName}
                              <ShieldCheck className="w-3 h-3 text-blue-600" />
                            </div>
                            <div className="text-[11px] text-slate-500">{log.executorEmail}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">Role: Super Admin</div>
                          </div>
                        </div>
                      </td>

                      {/* Mitra Wisata */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-start gap-2">
                          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600 shrink-0">
                            <Building2 className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{log.mitraName}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">Ref: {log.mitraId}</div>
                          </div>
                        </div>
                      </td>

                      {/* Aksi & Perubahan Status */}
                      <td className="py-4 px-4 align-top">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            {getActionIcon(log.actionType)}
                            {getActionBadge(log.actionType)}
                          </div>

                          <div className="flex items-center gap-1.5 text-xs">
                            {log.previousStatus ? (
                              <>
                                {renderStatusBadge(log.previousStatus)}
                                <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                              </>
                            ) : null}
                            {renderStatusBadge(log.newStatus)}
                          </div>
                        </div>
                      </td>

                      {/* Alasan & Catatan */}
                      <td className="py-4 px-4 align-top">
                        <div className="max-w-md">
                          <p className="text-xs font-semibold text-slate-800 leading-snug">
                            {log.reason}
                          </p>
                          {log.details && (
                            <p className="text-[11px] text-slate-500 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-200/80 leading-relaxed font-sans">
                              {log.details}
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Menampilkan <strong className="text-slate-800">{filteredLogs.length}</strong> dari{' '}
            <strong className="text-slate-800">{auditLogs.length}</strong> seluruh catatan audit sistem.
          </span>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Semua aksi dicatat secara immutable (anti-tamper)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AuditLogView;
