import React, { useState, useMemo } from 'react';
import {
  AlertCircle,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  FileCheck,
  FileText,
  Filter,
  Layers,
  MapPin,
  Phone,
  Plus,
  Power,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  XCircle,
} from 'lucide-react';
import type { MitraAccount, MitraCategory, MitraStatus } from '@/types/superAdmin';

export interface MitraValidationViewProps {
  mitraList: MitraAccount[];
  onInspectMitra: (mitra: MitraAccount) => void;
  onOpenNewMitraModal?: () => void;
  onOpenSimulationModal?: () => void;
}

export function MitraValidationView({
  mitraList,
  onInspectMitra,
  onOpenNewMitraModal,
  onOpenSimulationModal,
}: MitraValidationViewProps) {
  const handleOpenModal = onOpenSimulationModal || onOpenNewMitraModal || (() => { });
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<MitraStatus | 'ALL'>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // KPI Calculations
  const totalCount = mitraList.length;
  const pendingCount = mitraList.filter((m) => m.status === 'PENDING').length;
  const activeCount = mitraList.filter((m) => m.status === 'ACTIVE').length;
  const rejectedCount = mitraList.filter((m) => m.status === 'REJECTED').length;
  const suspendedCount = mitraList.filter((m) => m.status === 'SUSPENDED').length;

  // Filtered List
  const filteredMitra = useMemo(() => {
    return mitraList.filter((m) => {
      // Status Filter
      if (selectedStatusFilter !== 'ALL' && m.status !== selectedStatusFilter) {
        return false;
      }
      // Category Filter
      if (selectedCategoryFilter !== 'ALL' && m.category !== selectedCategoryFilter) {
        return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = m.destinationName.toLowerCase().includes(q);
        const matchPic = m.pic.fullName.toLowerCase().includes(q);
        const matchCity = m.city.toLowerCase().includes(q);
        const matchProvince = m.province.toLowerCase().includes(q);
        const matchId = m.id.toLowerCase().includes(q);
        const matchPhone = m.pic.whatsapp.includes(q);
        if (!matchName && !matchPic && !matchCity && !matchProvince && !matchId && !matchPhone) {
          return false;
        }
      }
      return true;
    });
  }, [mitraList, selectedStatusFilter, selectedCategoryFilter, searchQuery]);

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* ── Page Header & Action Bar ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
         
          <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
            Validasi Akun Mitra Wisata
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Pusat verifikasi legalitas objek wisata, identitas penanggung jawab (PIC), dan rekening pencairan resmi sebelum akses MANAJER diaktifkan.
          </p>
        </div>

        {/* Action Button: Simulation */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenModal}
            className="flex items-center gap-2 rounded-2xl bg-[#286EF2] px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-600 transition-all hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            <span>Simulasi Pendaftaran Baru</span>
          </button>
        </div>
      </div>

      {/* ── 1. KPI Summary Cards ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {/* Total Mitra */}
        <div
          onClick={() => setSelectedStatusFilter('ALL')}
          className={`cursor-pointer rounded-2xl p-4 sm:p-5 transition-all text-white shadow-sm hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-br from-[#1E6BFF] via-[#286EF2] to-[#60A5FA] ${selectedStatusFilter === 'ALL'
            ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-100 shadow-md scale-[1.02]'
            : 'opacity-95 hover:opacity-100'
            }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white">
              Total Mitra
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{totalCount}</span>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white">
              Destinasi
            </span>
          </div>
        </div>

        {/* Menunggu Verifikasi (Pending) */}
        <div
          onClick={() => setSelectedStatusFilter('PENDING')}
          className={`cursor-pointer rounded-2xl p-4 sm:p-5 transition-all text-white shadow-sm hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-br from-[#EA580C] via-[#F97316] to-[#FBBF24] ${selectedStatusFilter === 'PENDING'
            ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-100 shadow-md scale-[1.02]'
            : 'opacity-95 hover:opacity-100'
            }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white">
              Menunggu Review
            </span>
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
              <Clock className="h-4 w-4" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-white animate-ping" />
              )}
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{pendingCount}</span>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-black uppercase text-white tracking-wide">
              PENDING
            </span>
          </div>
        </div>

        {/* Mitra Aktif (Active) */}
        <div
          onClick={() => setSelectedStatusFilter('ACTIVE')}
          className={`cursor-pointer rounded-2xl p-4 sm:p-5 transition-all text-white shadow-sm hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-br from-[#059669] via-[#10B981] to-[#34D399] ${selectedStatusFilter === 'ACTIVE'
            ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-100 shadow-md scale-[1.02]'
            : 'opacity-95 hover:opacity-100'
            }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white">
              Mitra Aktif
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{activeCount}</span>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-black uppercase text-white tracking-wide">
              ACTIVE
            </span>
          </div>
        </div>

        {/* Ditolak / Revisi (Rejected) */}
        <div
          onClick={() => setSelectedStatusFilter('REJECTED')}
          className={`cursor-pointer rounded-2xl p-4 sm:p-5 transition-all text-white shadow-sm hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-br from-[#E11D48] via-[#F43F5E] to-[#FB7185] ${selectedStatusFilter === 'REJECTED'
            ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-100 shadow-md scale-[1.02]'
            : 'opacity-95 hover:opacity-100'
            }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white">
              Ditolak / Revisi
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
              <XCircle className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{rejectedCount}</span>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-black uppercase text-white tracking-wide">
              REJECTED
            </span>
          </div>
        </div>

        {/* Dibekukan (Suspended) */}
        <div
          onClick={() => setSelectedStatusFilter('SUSPENDED')}
          className={`cursor-pointer rounded-2xl p-4 sm:p-5 transition-all text-white shadow-sm hover:scale-[1.02] active:scale-[0.98] col-span-2 sm:col-span-1 bg-gradient-to-br from-[#475569] via-[#64748B] to-[#94A3B8] ${selectedStatusFilter === 'SUSPENDED'
            ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-100 shadow-md scale-[1.02]'
            : 'opacity-95 hover:opacity-100'
            }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white">
              Dibekukan
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
              <Power className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{suspendedCount}</span>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-black uppercase text-white tracking-wide">
              SUSPENDED
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. Filter Tabs & Search Bar ── */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-4 shadow-sm space-y-3.5">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {[
              { id: 'ALL', label: 'Semua Status', count: totalCount },
              { id: 'PENDING', label: 'Menunggu Verifikasi', count: pendingCount, highlight: true },
              { id: 'ACTIVE', label: 'Mitra Aktif', count: activeCount },
              { id: 'REJECTED', label: 'Ditolak / Revisi', count: rejectedCount },
              { id: 'SUSPENDED', label: 'Dibekukan', count: suspendedCount },
            ].map((tab) => {
              const isSelected = selectedStatusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedStatusFilter(tab.id as any)}
                  className={`flex items-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-bold transition-all ${isSelected
                    ? 'bg-[#286EF2] text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${isSelected
                      ? 'bg-white/20 text-white'
                      : tab.highlight && tab.count > 0
                        ? 'bg-amber-100 text-amber-800 font-extrabold'
                        : 'bg-slate-200 text-slate-600'
                      }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Category Dropdown Filter */}
          <div className="flex items-center gap-2 text-xs">
            <Layers className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#286EF2]"
            >
              <option value="ALL">Semua Kategori Wisata</option>
              <option value="Pantai & Bahari">Pantai & Bahari</option>
              <option value="Pegunungan & Alam">Pegunungan & Alam</option>
              <option value="Taman Rekreasi & Hiburan">Taman Rekreasi & Hiburan</option>
              <option value="Budaya & Sejarah">Budaya & Sejarah</option>
              <option value="Agrowisata & Edukasi">Agrowisata & Edukasi</option>
              <option value="Waterpark & Pemandian">Waterpark & Pemandian</option>
            </select>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama destinasi wisata, nama PIC Manajer, kabupaten, atau nomor pendaftaran..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-2.5 pl-11 pr-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition focus:border-[#286EF2] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100/60"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Hapus
            </button>
          )}
        </div>
      </div>

      {/* ── 3. Tabel Antrean Pendaftaran Mitra ── */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                <th className="py-4 px-5">Destinasi & Kategori</th>
                <th className="py-4 px-5">PIC & Kontak</th>
                <th className="py-4 px-5">Kelengkapan Dokumen</th>
                <th className="py-4 px-5">Tanggal Daftar</th>
                <th className="py-4 px-5 text-center">Status Akun</th>
                <th className="py-4 px-5 text-right">Aksi Validasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMitra.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Building2 className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                    <p className="text-sm font-semibold text-slate-600">Tidak ada data pendaftaran mitra yang cocok.</p>
                    <p className="text-xs text-slate-400 mt-0.5">Silakan sesuaikan filter status atau kata kunci pencarian.</p>
                  </td>
                </tr>
              ) : (
                filteredMitra.map((item) => {
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => onInspectMitra(item)}
                    >
                      {/* Destinasi & Kategori */}
                      <td className="py-4 px-5">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#286EF2] font-black">
                            <Building2 className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="font-mono text-[10px] font-bold text-slate-400 block">{item.id}</span>
                            <span className="font-bold text-slate-900 text-sm block group-hover:text-[#286EF2] transition">
                              {item.destinationName}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                                {item.category}
                              </span>
                              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {item.city}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* PIC & Kontak */}
                      <td className="py-4 px-5">
                        <div>
                          <span className="font-bold text-slate-800 block text-xs">{item.pic.fullName}</span>
                          <span className="text-[11px] text-slate-500 block">{item.pic.position}</span>
                          <div className="flex items-center gap-2.5 mt-1 text-[11px]">
                            <span className="text-emerald-700 font-medium flex items-center gap-0.5">
                              <Phone className="h-3 w-3" />
                              {item.pic.whatsapp}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Kelengkapan Dokumen */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200/60">
                            <Check className="h-3 w-3" />
                            KTP
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200/60">
                            <Check className="h-3 w-3" />
                            NIB/SK
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200/60">
                            <Check className="h-3 w-3" />
                            Bank
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Rekening: {item.documents.bankName}
                        </span>
                      </td>

                      {/* Tanggal Daftar */}
                      <td className="py-4 px-5 text-slate-600 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span>{item.registrationDate}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider ${item.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : item.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : item.status === 'REJECTED'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : 'bg-slate-200 text-slate-700 border border-slate-300'
                            }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${item.status === 'PENDING'
                              ? 'bg-amber-500 animate-pulse'
                              : item.status === 'ACTIVE'
                                ? 'bg-emerald-500'
                                : item.status === 'REJECTED'
                                  ? 'bg-rose-500'
                                  : 'bg-slate-500'
                              }`}
                          />
                          <span>{item.status}</span>
                        </span>
                      </td>

                      {/* Tombol Aksi */}
                      <td className="py-4 px-5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        {item.status === 'PENDING' ? (
                          <button
                            type="button"
                            onClick={() => onInspectMitra(item)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[#286EF2] px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-600 transition"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Periksa Dokumen</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onInspectMitra(item)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
                          >
                            <FileText className="h-3.5 w-3.5 text-slate-400" />
                            <span>Detail / Kelola</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 text-xs text-slate-500">
          <span>Menampilkan <strong>{filteredMitra.length}</strong> dari <strong>{totalCount}</strong> total mitra wisata terdaftar</span>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
            <span>Standar Verifikasi: UU No. 10/2009 & Regulasi Pariwisata Berkelanjutan</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MitraValidationView;

