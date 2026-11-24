import { useState } from 'react';
import { Lock, LogIn, LogOut, Mail, User, UserPlus, X } from 'lucide-react';
import { roleProfiles } from '@/data/rolesNavData';
import type { UserRole } from '@/types/roles';

type AuthType = 'register' | 'login' | 'logout';

type AuthModalProps = {
  isOpen: boolean;
  type: AuthType;
  currentRole: UserRole;
  onClose: () => void;
  onRoleChange: (role: UserRole) => void;
  onSuccess: (message: string) => void;
};

export default function AuthModal({
  isOpen,
  type,
  currentRole,
  onClose,
  onRoleChange,
  onSuccess,
}: AuthModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const currentProfile = roleProfiles[currentRole];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'logout') {
      onSuccess(`Anda berhasil logout dari sesi ${currentProfile.title}`);
      onClose();
      return;
    }

    if (type === 'login') {
      onRoleChange(selectedRole);
      onSuccess(`Berhasil login sebagai ${roleProfiles[selectedRole].title}`);
      onClose();
      return;
    }

    if (type === 'register') {
      onRoleChange(selectedRole);
      onSuccess(`Pendaftaran akun baru ${roleProfiles[selectedRole].title} berhasil!`);
      onClose();
      return;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ocean-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl transition-all sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          aria-label="Tutup"
        >
          <X className="h-5 w-5" />
        </button>

        {type === 'logout' ? (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <LogOut className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">Konfirmasi Logout</h3>
            <p className="mt-2 text-sm text-slate-500">
              Apakah Anda yakin ingin keluar dari akun <strong className="text-slate-800">{currentProfile.userName}</strong> (
              {currentProfile.title})?
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/25 hover:bg-rose-700"
              >
                Keluar Sesi
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ocean-50 text-ocean-600">
                {type === 'login' ? <LogIn className="h-6 w-6" /> : <UserPlus className="h-6 w-6" />}
              </div>
              <div>
                <h3 className="text-xl font-bold text-ocean-900">
                  {type === 'login' ? 'Login Pengguna' : 'Registrasi Akun Baru'}
                </h3>
                <p className="text-xs text-slate-500">
                  {type === 'login'
                    ? 'Masuk ke sistem MANAJER Ploria'
                    : 'Daftarkan akun staf/Manajer baru'}
                </p>
              </div>
            </div>

            <div className="mt-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Pilih Role / Hak Akses
              </label>
              <div className="mt-1.5 grid grid-cols-3 gap-2">
                {(['manager', 'admin', 'kasir'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`rounded-xl border p-2.5 text-center text-xs font-medium transition ${selectedRole === r
                      ? 'border-ocean-600 bg-ocean-50/80 font-bold text-ocean-700 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                  >
                    {r === 'Manajer' ? 'Manajer' : r === 'admin' ? 'Admin' : 'Kasir'}
                  </button>
                ))}
              </div>
            </div>

            {type === 'register' && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Nama Lengkap
                </label>
                <div className="relative mt-1">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-ocean-500 focus:outline-none focus:ring-4 focus:ring-ocean-50"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    selectedRole === 'Manajer'
                      ? 'budi.santoso@Ploria.id'
                      : selectedRole === 'admin'
                        ? 'hasan.alfarisi@Ploria.id'
                        : 'siti.rahma@Ploria.id'
                  }
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-ocean-500 focus:outline-none focus:ring-4 focus:ring-ocean-50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Kata Sandi</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-ocean-500 focus:outline-none focus:ring-4 focus:ring-ocean-50"
                />
              </div>
            </div>

            {type === 'register' && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Konfirmasi Sandi
                </label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-ocean-500 focus:outline-none focus:ring-4 focus:ring-ocean-50"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-ocean-600 py-3 text-sm font-bold text-white shadow-lg shadow-ocean-600/25 transition hover:bg-ocean-700"
            >
              {type === 'login' ? 'Masuk ke Sistem' : 'Daftarkan Akun'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
