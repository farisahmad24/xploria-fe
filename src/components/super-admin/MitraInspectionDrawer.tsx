import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Building2,
  Check,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  HelpCircle,
  Mail,
  MapPin,
  Maximize2,
  MessageSquare,
  Phone,
  Power,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  User,
  X,
  XCircle,
} from 'lucide-react';
import type { MitraAccount, MitraStatus } from '@/types/superAdmin';
import DocumentPreviewModal from './DocumentPreviewModal';

export interface MitraInspectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mitra: MitraAccount | null;
  onApprove: (mitraId: string, notes?: string) => void;
  onReject: (mitraId: string, reason: string, note?: string) => void;
  onSuspend: (mitraId: string, reason: string) => void;
  onReactivate: (mitraId: string, reason?: string) => void;
}

const QUICK_REJECTION_REASONS = [
  'Foto berkas NIB buram & nomor izin tidak terbaca jelas',
  'Nama pada buku tabungan / rekening tidak sesuai dengan identitas PIC',
  'Dokumen izin operasional / SK Pokdarwis belum dilampirkan lengkap',
  'Nomor Induk Kependudukan (NIK) pada KTP tidak terverifikasi Dukcapil',
  'Kategori objek wisata dan kelengkapan fasilitas belum memenuhi standar keselamatan',
];

export function MitraInspectionDrawer({
  isOpen,
  onClose,
  mitra,
  onApprove,
  onReject,
  onSuspend,
  onReactivate,
}: MitraInspectionDrawerProps) {
  // Document Tabs in Inspection Drawer
  const [activeDocTab, setActiveDocTab] = useState<'ktp' | 'nib' | 'bank'>('ktp');
  const [zoomModalOpen, setZoomModalOpen] = useState(false);

  // 3 Mandatory Compliance Checklists
  const [checkKtp, setCheckKtp] = useState(false);
  const [checkNib, setCheckNib] = useState(false);
  const [checkBank, setCheckBank] = useState(false);

  // Action Mode State ('none' | 'rejecting' | 'suspending' | 'reactivating')
  const [actionFlow, setActionFlow] = useState<'none' | 'rejecting' | 'suspending' | 'reactivating'>('none');
  const [selectedQuickReason, setSelectedQuickReason] = useState<string>(QUICK_REJECTION_REASONS[0]);
  const [actionNote, setActionNote] = useState<string>('');
  const [approvalNote, setApprovalNote] = useState<string>('');

  // Reset checklist & action flows when a new mitra is inspected
  useEffect(() => {
    if (mitra) {
      if (mitra.status === 'ACTIVE') {
        setCheckKtp(true);
        setCheckNib(true);
        setCheckBank(true);
      } else {
        setCheckKtp(false);
        setCheckNib(false);
        setCheckBank(false);
      }
      setActionFlow('none');
      setActionNote('');
      setApprovalNote('');
    }
  }, [mitra]);

  if (!isOpen || !mitra) return null;

  const isAllChecked = checkKtp && checkNib && checkBank;

  const handleApproveClick = () => {
    if (!isAllChecked) return;
    onApprove(mitra.id, approvalNote || 'Semua verifikasi dokumen KTP, NIB, dan rekening pencairan sah 100%.');
    onClose();
  };

  const handleRejectSubmit = () => {
    const reason = selectedQuickReason;
    const note = actionNote.trim() || 'Dokumen belum memenuhi standar kelayakan dan kepatuhan operasional. Silakan periksa kembali instruksi dan unggah ulang berkas yang valid.';
    onReject(mitra.id, reason, note);
    setActionFlow('none');
    onClose();
  };

  const handleSuspendSubmit = () => {
    const reason = actionNote.trim() || 'Pembekuan akun sementara untuk keperluan audit dan investigasi operasional.';
    onSuspend(mitra.id, reason);
    setActionFlow('none');
    onClose();
  };

  const handleReactivateSubmit = () => {
    onReactivate(mitra.id, actionNote || 'Investigasi selesai dan akun dinyatakan siap beroperasi kembali.');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
      />

      {/* Slide-over Drawer Panel */}
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col bg-white shadow-2xl transition-transform duration-300 ease-out border-l border-slate-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#286EF2] text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-tight">{mitra.destinationName}</h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${mitra.status === 'PENDING'
                      ? 'bg-amber-400 text-amber-950'
                      : mitra.status === 'ACTIVE'
                        ? 'bg-emerald-400 text-emerald-950'
                        : mitra.status === 'REJECTED'
                          ? 'bg-rose-400 text-rose-950'
                          : 'bg-slate-300 text-slate-900'
                    }`}
                >
                  {mitra.status}
                </span>
              </div>
              <p className="text-xs text-blue-100/90 font-medium mt-0.5">
                ID Pendaftaran: <span className="font-mono font-bold text-white">{mitra.id}</span> • Daftar: {mitra.registrationDate}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-white/80 hover:bg-white/15 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Body Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 text-sm">
          {/* Status Alert Banner if Rejected or Suspended */}
          {mitra.status === 'REJECTED' && (
            <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs space-y-1">
              <div className="flex items-center gap-2 text-rose-700 font-bold">
                <XCircle className="h-4 w-4" />
                <span>Pendaftaran Ini Berstatus Ditolak / Menunggu Perbaikan Berkas</span>
              </div>
              <p className="text-rose-900 font-semibold">{mitra.rejectionReason}</p>
              <p className="text-slate-600 mt-1 italic">Catatan: "{mitra.rejectionNote}"</p>
            </div>
          )}

          {mitra.status === 'SUSPENDED' && (
            <div className="rounded-2xl bg-slate-100 border border-slate-300 p-4 text-xs space-y-1">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span>Akun Mitra Sedang Dibekukan (Suspended)</span>
              </div>
              <p className="text-slate-700 font-semibold">Alasan: {mitra.suspensionReason}</p>
            </div>
          )}

          {/* Section 1: Profil Destinasi & PIC */}
          <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#286EF2]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Profil Destinasi Wisata</h3>
              </div>
              <span className="rounded-full bg-blue-100/80 px-2.5 py-0.5 text-[10px] font-bold text-[#286EF2]">
                {mitra.category}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Lokasi & Alamat</span>
                <p className="font-semibold text-slate-800 mt-0.5 flex items-start gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{mitra.address}, {mitra.city}, {mitra.province}</span>
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Titik Koordinat Peta</span>
                <p className="font-mono font-semibold text-slate-800 mt-0.5">{mitra.coordinates}</p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[10px] font-bold uppercase text-slate-400">Deskripsi Wisata</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed">{mitra.description}</p>
              </div>
            </div>

            {/* Sub-Section: PIC Identitas */}
            <div className="pt-3 border-t border-slate-200/60">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-emerald-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Penanggung Jawab (PIC)</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Nama Lengkap PIC</span>
                  <p className="font-bold text-slate-900 mt-0.5">{mitra.pic.fullName}</p>
                  <p className="text-[11px] text-slate-500">{mitra.pic.position}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">NIK (Nomor Induk Kependudukan)</span>
                  <p className="font-mono font-bold text-slate-800 mt-0.5">{mitra.pic.nik}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Kontak Email PIC</span>
                  <a
                    href={`mailto:${mitra.pic.email}`}
                    className="font-medium text-[#286EF2] hover:underline mt-0.5 flex items-center gap-1"
                  >
                    <Mail className="h-3 w-3" />
                    <span>{mitra.pic.email}</span>
                  </a>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">WhatsApp / Telepon</span>
                  <a
                    href={`https://wa.me/${mitra.pic.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-emerald-700 hover:underline mt-0.5 flex items-center gap-1"
                  >
                    <Phone className="h-3 w-3" />
                    <span>{mitra.pic.whatsapp}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Pratinjau Dokumen Legalitas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-[#286EF2]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Pratinjau Dokumen Legalitas & Rekening
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setZoomModalOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#286EF2] hover:underline"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Perbesar Dokumen</span>
              </button>
            </div>

            {/* Document Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <button
                type="button"
                onClick={() => setActiveDocTab('ktp')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeDocTab === 'ktp'
                    ? 'bg-[#286EF2] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                <span>1. KTP PIC</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </button>
              <button
                type="button"
                onClick={() => setActiveDocTab('nib')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeDocTab === 'nib'
                    ? 'bg-[#286EF2] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                <span>2. Izin NIB / SK</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </button>
              <button
                type="button"
                onClick={() => setActiveDocTab('bank')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeDocTab === 'bank'
                    ? 'bg-[#286EF2] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                <span>3. Rekening Pencairan</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </button>
            </div>

            {/* Document Card Preview */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group">
              <img
                src={
                  activeDocTab === 'ktp'
                    ? mitra.documents.ktpUrl
                    : activeDocTab === 'nib'
                      ? mitra.documents.nibUrl
                      : mitra.documents.bankBookUrl
                }
                alt="Document Preview"
                className="w-full h-56 object-cover object-center opacity-90 transition group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-200 block">
                      {activeDocTab === 'ktp'
                        ? 'Kartu Tanda Penduduk'
                        : activeDocTab === 'nib'
                          ? mitra.documents.documentType
                          : 'Rekening Bank Resmi'}
                    </span>
                    <span className="font-bold text-sm">
                      {activeDocTab === 'ktp'
                        ? `NIK: ${mitra.documents.ktpNumber}`
                        : activeDocTab === 'nib'
                          ? `No. Izin: ${mitra.documents.nibNumber}`
                          : `${mitra.documents.bankName} - ${mitra.documents.bankAccountNumber}`}
                    </span>
                    <p className="text-xs text-slate-300">
                      Pemilik: {activeDocTab === 'bank' ? mitra.documents.bankAccountHolder : mitra.pic.fullName}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setZoomModalOpen(true)}
                    className="rounded-xl bg-white/20 backdrop-blur-md px-3 py-2 text-xs font-bold hover:bg-white/30 transition flex items-center gap-1.5"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Periksa</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Checklist Kepatuhan Wajib (3 Poin) */}
          <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-[#286EF2]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Checklist Kepatuhan Verifikasi (Wajib 3 Poin)
                </h3>
              </div>
              <span className="text-[11px] font-bold text-[#286EF2]">
                {[checkKtp, checkNib, checkBank].filter(Boolean).length}/3 Terpenuhi
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Super Admin wajib memastikan ketiga syarat validitas berikut telah terverifikasi sebelum menyetujui aktivasi akun:
            </p>

            <div className="space-y-2.5 pt-1">
              {/* Check 1 */}
              <label className="flex items-start gap-3 p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-[#286EF2] transition select-none">
                <input
                  type="checkbox"
                  checked={checkKtp}
                  onChange={(e) => setCheckKtp(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#286EF2] focus:ring-[#286EF2]"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">1. Identitas KTP Sesuai PIC Pendaftar</span>
                  <span className="text-[11px] text-slate-500 block">
                    Nama pada KTP ({mitra.pic.fullName}) dan NIK ({mitra.pic.nik}) cocok 100% tanpa manipulasi data.
                  </span>
                </div>
              </label>

              {/* Check 2 */}
              <label className="flex items-start gap-3 p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-[#286EF2] transition select-none">
                <input
                  type="checkbox"
                  checked={checkNib}
                  onChange={(e) => setCheckNib(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#286EF2] focus:ring-[#286EF2]"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">2. Dokumen Izin Usaha / SK Pokdarwis Sah & Terbaca Jelas</span>
                  <span className="text-[11px] text-slate-500 block">
                    Berkas legalitas {mitra.documents.documentType} memuat stempel/tanda tangan sah pejabat berwenang.
                  </span>
                </div>
              </label>

              {/* Check 3 */}
              <label className="flex items-start gap-3 p-2.5 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-[#286EF2] transition select-none">
                <input
                  type="checkbox"
                  checked={checkBank}
                  onChange={(e) => setCheckBank(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#286EF2] focus:ring-[#286EF2]"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">3. Rekening Bank Sesuai PIC atau Badan Manajer</span>
                  <span className="text-[11px] text-slate-500 block">
                    Pemilik rekening ({mitra.documents.bankAccountHolder}) di {mitra.documents.bankName} terhubung langsung dengan calon mitra.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50">
          {mitra.status === 'PENDING' && (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => setActionFlow(actionFlow === 'rejecting' ? 'none' : 'rejecting')}
                className="w-full sm:w-auto rounded-xl border border-rose-300 bg-white px-5 py-3 text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
              >
                Tolak Pendaftaran
              </button>

              <button
                type="button"
                onClick={handleApproveClick}
                disabled={!isAllChecked}
                className={`flex-1 w-full rounded-xl py-3 px-6 text-xs font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 ${isAllChecked
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  }`}
              >
                <Check className="h-4 w-4" />
                <span>
                  {isAllChecked ? 'Setujui & Aktifkan Akun Mitra' : 'Centang 3 Syarat Kepatuhan di Atas'}
                </span>
              </button>
            </div>
          )}

          {mitra.status === 'ACTIVE' && (
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Status: <span className="font-bold text-emerald-700">Mitra Aktif Beroperasi</span>
              </div>
              <button
                type="button"
                onClick={() => setActionFlow(actionFlow === 'suspending' ? 'none' : 'suspending')}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5"
              >
                <Power className="h-3.5 w-3.5 text-amber-600" />
                <span>Bekukan Akun (Suspend)</span>
              </button>
            </div>
          )}

          {mitra.status === 'SUSPENDED' && (
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Status: <span className="font-bold text-slate-700">Akun Dibekukan</span>
              </div>
              <button
                type="button"
                onClick={handleReactivateSubmit}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition flex items-center gap-1.5 shadow"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Pulihkan & Aktifkan Kembali</span>
              </button>
            </div>
          )}

          {mitra.status === 'REJECTED' && (
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Pendaftaran ditolak pada {mitra.reviewedAt || 'hari sebelumnya'}.
              </div>
              <button
                type="button"
                onClick={() => {
                  setCheckKtp(true);
                  setCheckNib(true);
                  setCheckBank(true);
                  onApprove(mitra.id, 'Mitra telah melengkapi berkas revisi dan disetujui ulang.');
                  onClose();
                }}
                className="rounded-xl bg-[#286EF2] px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-600 transition flex items-center gap-1.5 shadow"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Verifikasi Ulang & Aktifkan</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Document Zoom Modal */}
      <DocumentPreviewModal
        isOpen={zoomModalOpen}
        onClose={() => setZoomModalOpen(false)}
        mitra={mitra}
        activeDocType={activeDocTab}
      />

      {/* Modal Dialog: Tolak Pendaftaran Mitra */}
      {actionFlow === 'rejecting' && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-rose-100 space-y-4 animate-scaleUp">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shrink-0">
                  <XCircle className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900">Tolak Pendaftaran Mitra</h3>
                  <p className="text-xs text-slate-500">{mitra.destinationName} • PIC: {mitra.pic.fullName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActionFlow('none')}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl bg-rose-50/70 p-3.5 border border-rose-200/80 text-xs text-rose-800">
              <p className="font-semibold leading-relaxed">
                Status mitra akan diubah menjadi <strong className="font-black text-rose-900">REJECTED</strong>. Berkas akan dikembalikan ke calon mitra untuk diperbaiki dan dilengkapi.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Alasan Penolakan:
              </label>
              <select
                value={selectedQuickReason}
                onChange={(e) => setSelectedQuickReason(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {QUICK_REJECTION_REASONS.map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Catatan Tambahan untuk PIC Mitra (Opsional):
              </label>
              <textarea
                rows={3}
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder="Misal: Foto KTP mohon diunggah ulang tanpa pantulan cahaya..."
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActionFlow('none')}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleRejectSubmit}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-600/30 hover:bg-rose-700 transition"
              >
                Konfirmasi Tolak Pendaftaran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dialog: Suspend Mitra */}
      {actionFlow === 'suspending' && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shrink-0">
                  <AlertTriangle className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900">Bekukan Akun Mitra (Suspend)</h3>
                  <p className="text-xs text-slate-500">{mitra.destinationName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActionFlow('none')}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Alasan Pembekuan Akun:
              </label>
              <textarea
                rows={3}
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder="Misal: Investigasi selisih rekonsiliasi kasir / kendala scanner QR..."
                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActionFlow('none')}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSuspendSubmit}
                className="flex-1 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-white shadow hover:bg-slate-900 transition"
              >
                Konfirmasi Bekukan Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MitraInspectionDrawer;

