import React, { useState } from 'react';
import {
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  RotateCw,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import type { MitraAccount } from '@/types/superAdmin';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  mitra: MitraAccount;
  activeDocType: 'ktp' | 'nib' | 'bank';
}

export default function DocumentPreviewModal({
  isOpen,
  onClose,
  mitra,
  activeDocType,
}: DocumentPreviewModalProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);

  if (!isOpen) return null;

  const getDocDetails = () => {
    switch (activeDocType) {
      case 'ktp':
        return {
          title: 'Kartu Tanda Penduduk (KTP) Penanggung Jawab',
          badge: 'Identitas Diri PIC',
          numberLabel: 'NIK Terdaftar',
          numberValue: mitra.pic.nik,
          nameLabel: 'Nama Lengkap PIC',
          nameValue: mitra.pic.fullName,
          docType: 'KTP Elektronik Republik Indonesia',
          statusCheck: 'NIK sesuai dengan nama pemohon',
          imageUrl: mitra.documents.ktpUrl,
        };
      case 'nib':
        return {
          title: 'Dokumen Legalitas & Izin Usaha / SK Pokdarwis',
          badge: mitra.documents.documentType,
          numberLabel: 'Nomor Registrasi / Izin',
          numberValue: mitra.documents.nibNumber,
          nameLabel: 'Nama Badan / Destinasi',
          nameValue: mitra.destinationName,
          docType: `${mitra.documents.documentType} (Diterbitkan ${mitra.documents.issueDate})`,
          statusCheck: 'Dokumen berstatus berlaku sah secara hukum',
          imageUrl: mitra.documents.nibUrl,
        };
      case 'bank':
        return {
          title: 'Buku Tabungan / Rekening Bank Pencairan Tiket',
          badge: 'Rekening Resmi Pencairan',
          numberLabel: 'Nomor Rekening',
          numberValue: mitra.documents.bankAccountNumber,
          nameLabel: 'Nama Pemilik Rekening',
          nameValue: mitra.documents.bankAccountHolder,
          docType: mitra.documents.bankName,
          statusCheck: 'Telah terverifikasi bank kliring BI-FAST',
          imageUrl: mitra.documents.bankBookUrl,
        };
    }
  };

  const details = getDocDetails();

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 75));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setZoomLevel(100);
    setRotation(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 sm:p-6 animate-fadeIn">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#286EF2]/10 text-[#286EF2]">
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{details.title}</h3>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-[#286EF2] border border-blue-200/60">
                  {details.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Calon Mitra: <span className="font-semibold text-slate-700">{mitra.destinationName}</span> ({mitra.city})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Toolbar Dokumen */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-2.5 border-b border-slate-100 bg-white text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="font-medium text-slate-500">Perbesaran:</span>
            <span className="font-bold text-[#286EF2] min-w-[45px]">{zoomLevel}%</span>
            <div className="flex items-center gap-1 ml-1">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 75}
                className="rounded-lg p-1.5 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition"
                title="Perkecil"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 200}
                className="rounded-lg p-1.5 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition"
                title="Perbesar"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleRotate}
                className="rounded-lg p-1.5 border border-slate-200 hover:bg-slate-50 transition"
                title="Putar 90°"
              >
                <RotateCw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg px-2 py-1 border border-slate-200 text-[11px] font-semibold hover:bg-slate-50 transition"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-200/60">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>{details.statusCheck}</span>
            </span>
            <a
              href={details.imageUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-slate-600 hover:bg-slate-50 transition"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Buka Tab Baru</span>
            </a>
          </div>
        </div>

        {/* Viewport Dokumen */}
        <div className="flex-1 overflow-auto bg-slate-900/95 p-6 flex items-center justify-center min-h-[360px] max-h-[500px]">
          <div
            className="transition-transform duration-200 ease-out origin-center"
            style={{
              transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
            }}
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-white/20 bg-slate-800 max-w-xl">
              <img
                src={details.imageUrl}
                alt={details.title}
                className="w-full h-auto object-cover select-none pointer-events-none"
              />
              {/* Mock Overlay Stamp */}
              <div className="absolute top-4 right-4 bg-emerald-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow">
                Terverifikasi Valid
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info Metadata Dokumen */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="rounded-xl bg-white p-3 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">{details.numberLabel}</span>
              <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">{details.numberValue}</span>
            </div>
            <div className="rounded-xl bg-white p-3 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">{details.nameLabel}</span>
              <span className="font-semibold text-slate-800 text-sm mt-0.5 block truncate">{details.nameValue}</span>
            </div>
            <div className="rounded-xl bg-white p-3 border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Jenis / Instansi Dokumen</span>
              <span className="font-semibold text-[#286EF2] text-sm mt-0.5 block truncate">{details.docType}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
