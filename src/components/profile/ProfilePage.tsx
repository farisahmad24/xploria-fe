import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { Camera, Eye, EyeOff, KeyRound, Lock, Save, Trash2, User } from 'lucide-react';
import ProfileAvatar from '@/components/common/ProfileAvatar';
import {
  ACCEPTED_AVATAR_TYPES,
  MAX_AVATAR_BYTES,
  MIN_PASSWORD_LENGTH,
  fileToDataUrl,
  hashPassword,
  saveStoredProfile,
  useSessionProfile,
  validatePasswordForm,
  validateProfileForm,
  verifyPassword,
  type PasswordFormErrors,
  type PasswordFormValues,
  type ProfileFormErrors,
  type ProfileFormValues,
} from '@/lib/profile';
import type { UserRole } from '@/types/roles';

type ProfilePageProps = {
  role: UserRole;
  onToast: (message: string) => void;
};

type ProfileTab = 'profil' | 'keamanan';

const inputClass = (hasError: boolean) =>
  `w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition focus:outline-none focus:ring-4 focus:ring-blue-100 ${
    hasError ? 'border-rose-300 focus:border-rose-400' : 'border-slate-200 focus:border-[#286EF2]'
  }`;

function Field({
  label,
  error,
  children,
  hint,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-slate-700">{label}</span>
      {children}
      {error ? (
        <span className="mt-1 block text-[11px] font-medium text-rose-600">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-[11px] text-slate-400">{hint}</span>
      ) : null}
    </label>
  );
}

const EMPTY_PROFILE_FORM: ProfileFormValues = { fullName: '', username: '', email: '', phone: '' };
const EMPTY_PASSWORD_FORM: PasswordFormValues = { current: '', next: '', confirm: '' };

export default function ProfilePage({ role, onToast }: ProfilePageProps) {
  const session = useSessionProfile(role);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<ProfileTab>('profil');

  // Form profil
  const [form, setForm] = useState<ProfileFormValues>(EMPTY_PROFILE_FORM);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [profileErrors, setProfileErrors] = useState<ProfileFormErrors>({});

  // Form password
  const [passwordForm, setPasswordForm] = useState<PasswordFormValues>(EMPTY_PASSWORD_FORM);
  const [passwordErrors, setPasswordErrors] = useState<PasswordFormErrors>({});
  const [showPasswords, setShowPasswords] = useState({ current: false, next: false, confirm: false });
  const [savingPassword, setSavingPassword] = useState(false);

  // Isi form saat halaman dibuka untuk role ini. Sengaja tidak bergantung pada `session`
  // agar penyimpanan password (yang juga mengubah profil) tidak mereset form profil.
  const sessionRef = useRef(session);
  sessionRef.current = session;
  useEffect(() => {
    const current = sessionRef.current;
    if (!current) return;
    setForm({
      fullName: current.userName,
      username: current.username,
      email: current.email,
      phone: current.phone,
    });
    setAvatar(current.avatarDataUrl);
    setProfileErrors({});
    setTab('profil');
  }, [role]);

  if (!session) return null;

  const updateField = (field: keyof ProfileFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (profileErrors[field]) setProfileErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!ACCEPTED_AVATAR_TYPES.includes(file.type)) {
      onToast('Format foto harus PNG, JPG, WEBP, atau GIF.');
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      onToast('Ukuran foto maksimal 2 MB.');
      return;
    }
    try {
      setAvatar(await fileToDataUrl(file));
    } catch {
      onToast('Foto tidak dapat dibaca. Coba file lain.');
    }
  };

  const handleSaveProfile = (event: FormEvent) => {
    event.preventDefault();
    const errors = validateProfileForm(form);
    setProfileErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    const ok = saveStoredProfile(role, {
      fullName: form.fullName.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      phone: form.phone.replace(/[\s-]/g, ''),
      avatarDataUrl: avatar,
    });
    if (ok) {
      onToast('Profil berhasil diperbarui.');
    } else {
      onToast('Gagal menyimpan profil. Penyimpanan browser penuh atau diblokir.');
    }
  };

  const handleRemoveAvatar = () => setAvatar(null);

  const updatePasswordField = (field: keyof PasswordFormValues, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    if (passwordErrors[field]) setPasswordErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleChangePassword = async (event: FormEvent) => {
    event.preventDefault();
    const errors = validatePasswordForm(passwordForm);
    setPasswordErrors(errors);
    if (Object.values(errors).some(Boolean)) return;

    setSavingPassword(true);
    try {
      const matches = await verifyPassword(role, passwordForm.current);
      if (!matches) {
        setPasswordErrors({ current: 'Password lama tidak sesuai' });
        return;
      }
      const passwordHash = await hashPassword(passwordForm.next);
      const ok = saveStoredProfile(role, { passwordHash });
      if (!ok) {
        onToast('Gagal menyimpan password. Penyimpanan browser penuh atau diblokir.');
        return;
      }
      setPasswordForm(EMPTY_PASSWORD_FORM);
      setPasswordErrors({});
      onToast('Password berhasil diubah.');
    } catch (err) {
      onToast(err instanceof Error ? err.message : 'Gagal mengubah password.');
    } finally {
      setSavingPassword(false);
    }
  };

  const togglePassword = (field: keyof PasswordFormValues) =>
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));

  const passwordField = (
    field: keyof PasswordFormValues,
    label: string,
    autoComplete: string
  ) => (
    <Field label={label} error={passwordErrors[field]}>
      <div className="relative">
        <input
          type={showPasswords[field] ? 'text' : 'password'}
          value={passwordForm[field]}
          onChange={(e) => updatePasswordField(field, e.target.value)}
          autoComplete={autoComplete}
          className={`${inputClass(!!passwordErrors[field])} pr-11`}
        />
        <button
          type="button"
          onClick={() => togglePassword(field)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label={showPasswords[field] ? 'Sembunyikan password' : 'Tampilkan password'}
        >
          {showPasswords[field] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </Field>
  );

  const tabButton = (id: ProfileTab, label: string, Icon: typeof User) => (
    <button
      type="button"
      onClick={() => setTab(id)}
      aria-current={tab === id ? 'page' : undefined}
      className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-5 py-2.5 text-xs font-bold transition sm:min-w-[13rem] ${
        tab === id ? 'bg-white text-[#286EF2] shadow-sm' : 'text-slate-500 hover:text-slate-800'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );

  const tabMeta =
    tab === 'profil'
      ? { Icon: User, title: 'Informasi Pribadi', desc: 'Foto, nama, username, dan kontak Anda.' }
      : { Icon: KeyRound, title: 'Keamanan Akun', desc: 'Ubah password untuk menjaga keamanan akun.' };
  const TabIcon = tabMeta.Icon;

  return (
    <div className="flex flex-col gap-6">
      {/* ── 1. HEADER JUDUL & STATUS ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl tracking-tight">
            Profil Saya
          </h1>
          <p className="text-sm text-slate-500">
            Kelola informasi akun dan keamanan Anda.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm border border-slate-200/80">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Sesi Aktif: {session.userName}</span>
        </div>
      </div>

      {/* ── 2. UNIFIED FRAME CONTAINER (KONSISTEN MIN-HEIGHT & FOOTER) ── */}
      <div className="flex min-h-[560px] flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card">
        <div>
          {/* Sub-header (pola sama dengan frame halaman lain) */}
          <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-[#286EF2] ring-1 ring-blue-100">
                <TabIcon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">{tabMeta.title}</h2>
                <p className="text-xs text-slate-400">{tabMeta.desc}</p>
              </div>
            </div>
            <div className="flex gap-1 rounded-2xl bg-slate-100 p-1">
              {tabButton('profil', 'Informasi Profil', User)}
              {tabButton('keamanan', 'Keamanan & Password', KeyRound)}
            </div>
          </div>

          <div className="p-6">
          {tab === 'profil' && (
            <form onSubmit={handleSaveProfile} className="space-y-5" noValidate>
              {/* Foto profil */}
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
                <ProfileAvatar
                  size="lg"
                  initials={session.avatarText}
                  imageUrl={avatar}
                />
                <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_AVATAR_TYPES.join(',')}
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Camera className="h-3.5 w-3.5 text-slate-500" />
                    Ganti Foto
                  </button>
                  {avatar && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3.5 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus Foto
                    </button>
                  )}
                  <p className="w-full text-center text-[11px] text-slate-400 sm:text-left">
                    PNG, JPG, WEBP, atau GIF, maks. 2 MB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Nama Lengkap" error={profileErrors.fullName}>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      className={inputClass(!!profileErrors.fullName)}
                    />
                  </Field>
                </div>
                <Field label="Username" error={profileErrors.username} hint="Huruf kecil, angka, titik, atau _">
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) => updateField('username', e.target.value)}
                    className={inputClass(!!profileErrors.username)}
                    autoComplete="username"
                  />
                </Field>
                <Field label="Nomor Telepon / WhatsApp" error={profileErrors.phone}>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className={inputClass(!!profileErrors.phone)}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Email" error={profileErrors.email}>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className={inputClass(!!profileErrors.email)}
                      autoComplete="email"
                    />
                  </Field>
                </div>
              </div>

              {/* Jabatan / role: read-only */}
              <div>
                <span className="mb-1.5 block text-xs font-bold text-slate-700">Jabatan / Role</span>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600">
                    <Lock className="h-3.5 w-3.5 text-slate-400" />
                    {session.userRoleName}
                  </span>
                  <span className="text-[11px] text-slate-400">Diatur oleh Super Admin</span>
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-100 pt-4">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#286EF2] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#1f5ad6]"
                >
                  <Save className="h-4 w-4" />
                  Simpan Perubahan
                </button>
              </div>
            </form>
          )}

          {tab === 'keamanan' && (
            <form onSubmit={handleChangePassword} className="space-y-5" noValidate>
              <p className="text-xs text-slate-400">
                Gunakan minimal {MIN_PASSWORD_LENGTH} karakter. Password baru tidak boleh sama dengan password lama.
              </p>
              {passwordField('current', 'Password Lama', 'current-password')}
              {passwordField('next', 'Password Baru', 'new-password')}
              {passwordField('confirm', 'Konfirmasi Password Baru', 'new-password')}

              <div className="flex justify-end border-t border-slate-100 pt-4">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#286EF2] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#1f5ad6] disabled:opacity-60"
                >
                  <KeyRound className="h-4 w-4" />
                  Ubah Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ── 3. FOOTER BAR (FRAME STABILITY) ── */}
      <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {tab === 'profil' ? (
            <>
              <span className="font-medium">
                Role Akses: <strong className="text-[#286EF2]">{session.userRoleName}</strong>
              </span>
              <span className="text-slate-300">•</span>
              <span>
                Status Akun: <strong className="text-emerald-600">Aktif &amp; Terverifikasi</strong>
              </span>
            </>
          ) : (
            <>
              <span className="font-medium">
                Proteksi Kredensial:{' '}
                <strong className="text-slate-800">Enkripsi Browser SHA-256</strong>
              </span>
              <span className="text-slate-300">•</span>
              <span>
                Status:{' '}
                <strong className="text-emerald-600">Keamanan Sesi Terlindungi</strong>
              </span>
            </>
          )}
        </div>
        <span className="text-[11px] text-slate-400">
          Manajemen Akun &amp; Kredensial Pengguna Terenkripsi
        </span>
      </div>
    </div>
  </div>
);
}
