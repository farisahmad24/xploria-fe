import { useState } from 'react';
import { CheckCircle2, Clock, Image as ImageIcon, X } from 'lucide-react';
import {
  BUG_PRIORITY_META,
  BUG_STATUS_META,
  REPORTER_ROLE_BADGE,
  REPORTER_ROLE_LABEL,
} from '@/lib/bugReports';
import type { BugReport, BugStatus } from '@/types/bugReport';

type BugReportDetailDrawerProps = {
  report: BugReport;
  onClose: () => void;
  onSave: (status: BugStatus, note: string) => void;
};

const STATUS_ORDER: BugStatus[] = ['pending', 'in_progress', 'done'];

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));

/**
 * Di-mount ulang lewat `key` (id laporan) oleh pemanggil,
 * sehingga state form selalu mulai dari data laporan yang dipilih.
 */
export default function BugReportDetailDrawer({ report, onClose, onSave }: BugReportDetailDrawerProps) {
  const [status, setStatus] = useState<BugStatus>(report.status);
  const [note, setNote] = useState(report.response?.note ?? '');

  const hasChanges =
    status !== report.status || note.trim() !== (report.response?.note ?? '');

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-[70] bg-slate-950/50 backdrop-blur-sm animate-fadeIn"
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="bug-detail-title"
        className="fixed inset-y-0 right-0 z-[71] flex w-full max-w-md flex-col bg-white shadow-2xl animate-fadeIn"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="min-w-0">
            <p className="font-mono text-[11px] font-bold text-slate-500">{report.id}</p>
            <h3 id="bug-detail-title" className="mt-0.5 text-base font-bold text-slate-900">
              {report.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Tutup detail"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {/* Meta */}
          <dl className="grid grid-cols-2 gap-3 text-xs">
            <div className="col-span-2 rounded-xl border border-slate-200 p-3">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pelapor</dt>
              <dd className="mt-1 flex flex-wrap items-center gap-2">
                <span className="font-bold text-slate-800">{report.reporter.name}</span>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${REPORTER_ROLE_BADGE[report.reporter.role]}`}
                >
                  {REPORTER_ROLE_LABEL[report.reporter.role]}
                </span>
              </dd>
              <dd className="mt-0.5 text-[11px] text-slate-500">@{report.reporter.username}</dd>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Kategori</dt>
              <dd className="mt-1 font-semibold text-slate-800">{report.category}</dd>
            </div>
            <div className="rounded-xl border border-slate-200 p-3">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Prioritas</dt>
              <dd className="mt-1">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${BUG_PRIORITY_META[report.priority].badge}`}>
                  {BUG_PRIORITY_META[report.priority].label}
                </span>
              </dd>
            </div>
            <div className="col-span-2 flex items-center gap-1.5 text-[11px] text-slate-500">
              <Clock className="h-3.5 w-3.5" />
              Dilaporkan {formatDate(report.createdAt)}
            </div>
          </dl>

          {/* Deskripsi */}
          <section>
            <h4 className="mb-1.5 text-xs font-bold text-slate-700">Deskripsi Detail</h4>
            <p className="whitespace-pre-wrap rounded-xl bg-slate-50 p-3.5 text-sm leading-relaxed text-slate-700">
              {report.description}
            </p>
          </section>

          {/* Lampiran */}
          <section>
            <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <ImageIcon className="h-3.5 w-3.5" />
              Lampiran Screenshot
            </h4>
            {report.screenshotDataUrl ? (
              <a href={report.screenshotDataUrl} target="_blank" rel="noopener noreferrer" className="block">
                <img
                  src={report.screenshotDataUrl}
                  alt={`Screenshot untuk ${report.id}`}
                  className="max-h-64 w-full rounded-xl border border-slate-200 object-contain bg-slate-50"
                />
              </a>
            ) : (
              <p className="text-xs text-slate-400">Tidak ada lampiran.</p>
            )}
          </section>

          {/* Status */}
          <section>
            <h4 className="mb-1.5 text-xs font-bold text-slate-700">Status Laporan</h4>
            <div className="grid grid-cols-3 gap-1.5" role="radiogroup" aria-label="Status laporan">
              {STATUS_ORDER.map((s, index) => {
                const selected = status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setStatus(s)}
                    className={`rounded-xl border px-2 py-2.5 text-[11px] font-bold transition ${
                      selected
                        ? 'border-[#286EF2] bg-blue-50 text-[#286EF2]'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="mr-1 text-slate-400">{index + 1}.</span>
                    {BUG_STATUS_META[s].label}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Tanggapan */}
          <section>
            <label htmlFor="bug-response-note" className="mb-1.5 block text-xs font-bold text-slate-700">
              Tanggapan untuk Pelapor <span className="font-normal text-slate-400">(opsional)</span>
            </label>
            <textarea
              id="bug-response-note"
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
              placeholder="Contoh: Sedang ditinjau tim pengembang, mohon tunggu pembaruan."
              className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition focus:border-[#286EF2] focus:outline-none focus:ring-4 focus:ring-blue-100"
            />
            {report.response && (
              <p className="mt-1 text-[11px] text-slate-400">
                Terakhir ditanggapi {report.response.responderName} &middot; {formatDate(report.response.updatedAt)}
              </p>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={!hasChanges}
            onClick={() => onSave(status, note)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#286EF2] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#1f5ad6] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            Simpan Perubahan
          </button>
        </div>
      </aside>
    </>
  );
}
