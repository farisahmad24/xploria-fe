import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Bug, Clock, ImagePlus, Send, Trash2 } from 'lucide-react';
import {
  BUG_CATEGORIES,
  BUG_PRIORITY_META,
  BUG_STATUS_META,
  MAX_SCREENSHOT_BYTES,
  createBugReport,
  useBugReports,
} from '@/lib/bugReports';
import { ACCEPTED_AVATAR_TYPES, fileToDataUrl, useSessionProfile } from '@/lib/profile';
import type { BugCategory, BugPriority, ReporterRole } from '@/types/bugReport';

type BugReportPageProps = {
  role: ReporterRole;
  onToast: (message: string) => void;
};

type ReportTab = 'kirim' | 'riwayat';

type FormState = {
  title: string;
  category: BugCategory | '';
  priority: BugPriority | '';
  description: string;
};

type FormErrors = Partial<Record<keyof FormState | 'screenshot', string>>;

const EMPTY_FORM: FormState = { title: '', category: '', priority: '', description: '' };
const PRIORITIES: BugPriority[] = ['low', 'medium', 'high'];

const inputClass = (hasError: boolean) =>
  `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition focus:outline-none focus:ring-4 focus:ring-blue-100 ${
    hasError ? 'border-rose-300 focus:border-rose-400' : 'border-slate-200 focus:border-[#286EF2]'
  }`;

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  const title = form.title.trim();
  const description = form.description.trim();
  if (title.length < 5) errors.title = 'Judul minimal 5 karakter';
  else if (title.length > 100) errors.title = 'Judul maksimal 100 karakter';
  if (!form.category) errors.category = 'Pilih kategori masalah';
  if (!form.priority) errors.priority = 'Pilih tingkat prioritas';
  if (description.length < 20) errors.description = 'Deskripsi minimal 20 karakter';
  else if (description.length > 1000) errors.description = 'Deskripsi maksimal 1000 karakter';
  return errors;
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));

export default function BugReportPage({ role, onToast }: BugReportPageProps) {
  const session = useSessionProfile(role);
  const allReports = useBugReports();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<ReportTab>('kirim');
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const myReports = useMemo(
    () =>
      allReports
        .filter((r) => r.reporter.role === role)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [allReports, role]
  );

  // Reset form setiap halaman dibuka untuk role ini.
  useEffect(() => {
    setTab('kirim');
    setForm(EMPTY_FORM);
    setScreenshot(null);
    setErrors({});
  }, [role]);

  if (!session) return null;

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleScreenshot = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, screenshot: 'Lampiran harus berupa gambar (PNG, JPG, WEBP, atau GIF).' }));
      return;
    }
    if (file.size > MAX_SCREENSHOT_BYTES) {
      setErrors((prev) => ({ ...prev, screenshot: 'Ukuran lampiran maksimal 2 MB.' }));
      return;
    }
    try {
      setScreenshot(await fileToDataUrl(file));
      setErrors((prev) => ({ ...prev, screenshot: undefined }));
    } catch {
      setErrors((prev) => ({ ...prev, screenshot: 'Gambar tidak dapat dibaca. Coba file lain.' }));
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;
    if (!form.category || !form.priority) return;

    setSubmitting(true);
    try {
      createBugReport({
        title: form.title,
        category: form.category,
        priority: form.priority,
        description: form.description,
        screenshotDataUrl: screenshot,
        reporter: { role, name: session.userName, username: session.username },
      });
      onToast('Laporan bug berhasil dikirim. Terima kasih!');
      setForm(EMPTY_FORM);
      setScreenshot(null);
      setErrors({});
      setTab('riwayat');
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Gagal mengirim laporan bug.');
    } finally {
      setSubmitting(false);
    }
  };

  const tabButton = (id: ReportTab, label: string) => (
    <button
      type="button"
      onClick={() => setTab(id)}
      aria-current={tab === id ? 'page' : undefined}
      className={`flex-1 whitespace-nowrap rounded-xl px-5 py-2.5 text-xs font-bold transition sm:min-w-[13rem] ${
        tab === id ? 'bg-white text-[#286EF2] shadow-sm' : 'text-slate-500 hover:text-slate-800'
      }`}
    >
      {label}
    </button>
  );

  const tabMeta =
    tab === 'kirim'
      ? { title: 'Form Laporan Baru', desc: 'Jelaskan kendala yang Anda temui secara rinci.' }
      : { title: 'Riwayat Laporan Saya', desc: 'Pantau status dan tanggapan dari Super Admin.' };

  return (
    <div className="flex flex-col gap-6">
      {/* ── 1. HEADER JUDUL & STATUS ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl tracking-tight">
            Laporkan Kendala
          </h1>
          <p className="text-sm text-slate-500">
            Bantu kami memperbaiki sistem Ploria dengan melaporkan kendala yang Anda temui.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm border border-slate-200/80">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Layanan Bantuan Pengguna</span>
        </div>
      </div>

      {/* ── 2. UNIFIED FRAME CONTAINER (KONSISTEN MIN-HEIGHT & FOOTER) ── */}
      <div className="flex min-h-[560px] flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card">
        <div>
          {/* Sub-header (pola sama dengan frame halaman lain) */}
          <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-[#286EF2] ring-1 ring-blue-100">
                <Bug className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">{tabMeta.title}</h2>
                <p className="text-xs text-slate-400">{tabMeta.desc}</p>
              </div>
            </div>
            <div className="flex gap-1 rounded-2xl bg-slate-100 p-1">
              {tabButton('kirim', 'Kirim Laporan')}
              {tabButton('riwayat', `Riwayat Saya (${myReports.length})`)}
            </div>
          </div>

          <div className="p-6">
          {tab === 'kirim' && (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-700">Judul Bug</span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Contoh: Tombol simpan tidak merespons"
                  maxLength={120}
                  className={inputClass(!!errors.title)}
                />
                {errors.title && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.title}</span>}
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold text-slate-700">Kategori Masalah</span>
                  <select
                    value={form.category}
                    onChange={(e) => updateField('category', e.target.value as BugCategory | '')}
                    className={inputClass(!!errors.category)}
                  >
                    <option value="">Pilih kategori</option>
                    {BUG_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.category && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.category}</span>}
                </label>

                <div className="block">
                  <span className="mb-1.5 block text-xs font-bold text-slate-700">Tingkat Prioritas</span>
                  <div className="grid grid-cols-3 gap-1.5" role="radiogroup" aria-label="Tingkat prioritas">
                    {PRIORITIES.map((p) => {
                      const selected = form.priority === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => updateField('priority', p)}
                          className={`rounded-xl border px-2 py-2 text-[11px] font-bold leading-tight transition ${
                            selected
                              ? 'border-[#286EF2] bg-blue-50 text-[#286EF2]'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {BUG_PRIORITY_META[p].label}
                        </button>
                      );
                    })}
                  </div>
                  {errors.priority && <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.priority}</span>}
                </div>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-slate-700">Deskripsi Detail</span>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Jelaskan kronologi kejadian, langkah untuk mengulang, dan hasil yang diharapkan."
                  className={`${inputClass(!!errors.description)} resize-y`}
                />
                <div className="mt-1 flex justify-between text-[11px]">
                  <span className="font-medium text-rose-600">{errors.description ?? ''}</span>
                  <span className="text-slate-400">{form.description.length}/1000</span>
                </div>
              </label>

              {/* Lampiran screenshot (opsional) */}
              <div>
                <span className="mb-1.5 block text-xs font-bold text-slate-700">
                  Lampiran Screenshot <span className="font-normal text-slate-400">(opsional)</span>
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_AVATAR_TYPES.join(',')}
                  className="hidden"
                  onChange={handleScreenshot}
                />
                {screenshot ? (
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                    <img src={screenshot} alt="Pratinjau screenshot" className="h-16 w-24 rounded-lg object-cover" />
                    <div className="flex-1 text-xs text-slate-500">Screenshot terlampir</div>
                    <button
                      type="button"
                      onClick={() => setScreenshot(null)}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-3 py-4 text-xs font-semibold text-slate-500 transition hover:border-[#286EF2] hover:text-[#286EF2]"
                  >
                    <ImagePlus className="h-4 w-4" />
                    Unggah gambar (maks. 2 MB)
                  </button>
                )}
                {errors.screenshot && (
                  <span className="mt-1 block text-[11px] font-medium text-rose-600">{errors.screenshot}</span>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <p className="text-[11px] text-slate-400">
                  Dilaporkan sebagai <span className="font-semibold text-slate-600">{session.userName}</span>
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#286EF2] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#1f5ad6] disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  Kirim Laporan
                </button>
              </div>
            </form>
          )}

          {tab === 'riwayat' && (
            <div className="divide-y divide-slate-100">
              {myReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
                    <Bug className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-700">Belum ada laporan yang Anda kirim</h3>
                  <p className="mt-1 text-xs text-slate-400 max-w-sm">
                    Gunakan tab &quot;Kirim Laporan&quot; jika Anda menemukan kendala teknis atau error sistem.
                  </p>
                </div>
              ) : (
                myReports.map((r) => (
                  <article key={r.id} className="py-5 first:pt-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-500">{r.id}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${BUG_STATUS_META[r.status].badge}`}>
                        {BUG_STATUS_META[r.status].label}
                      </span>
                    </div>
                    <h4 className="mt-1.5 text-sm font-bold text-slate-900">{r.title}</h4>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {r.category} &middot; Prioritas {BUG_PRIORITY_META[r.priority].label}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="h-3 w-3" />
                      {formatDate(r.createdAt)}
                    </p>
                    {r.response && (
                      <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/60 p-3">
                        <p className="text-[11px] font-bold text-[#286EF2]">Tanggapan {r.response.responderName}</p>
                        <p className="mt-1 text-xs text-slate-700">{r.response.note}</p>
                      </div>
                    )}
                  </article>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── 3. FOOTER BAR (FRAME STABILITY) ── */}
      <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {tab === 'kirim' ? (
            <>
              <span className="font-medium">
                Status Form: <strong className="text-[#286EF2]">Siap Dikirim</strong>
              </span>
              <span className="text-slate-300">•</span>
              <span>
                Pelapor:{' '}
                <strong className="text-slate-700">{session.userName} ({session.userRoleName})</strong>
              </span>
            </>
          ) : (
            <>
              <span className="font-medium">
                Menampilkan <strong className="text-slate-800">{myReports.length}</strong> laporan bug
              </span>
              <span className="text-slate-300">•</span>
              <span>
                Status:{' '}
                <strong className="text-[#286EF2]">
                  {myReports.filter((r) => r.status === 'done').length} Selesai / {myReports.length} Total
                </strong>
              </span>
            </>
          )}
        </div>
        <span className="text-[11px] text-slate-400">
          Sistem Layanan Pelaporan &amp; Perbaikan Bug Ploria
        </span>
      </div>
    </div>
  </div>
);
}
