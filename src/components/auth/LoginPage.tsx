import { useState } from 'react';
import {
  ArrowRight,
  Contact,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  UserCheck,
  X,
} from 'lucide-react';
import SlantedTicket from '@/components/common/SlantedTicket';
import type { UserRole } from '@/types/roles';

type AuthMode = 'login' | 'register';

type LoginPageProps = {
  onLogin: (role: UserRole) => void;
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Manajer');
  const [email, setEmail] = useState('budi.santoso@ploria.id');
  const [password, setPassword] = useState('password123');
  const [firstName, setFirstName] = useState('Budi');
  const [lastName, setLastName] = useState('Santoso');
  const [showPassword, setShowPassword] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'Manajer') {
      setEmail('budi.santoso@ploria.id');
      setFirstName('Budi');
      setLastName('Santoso');
    } else if (role === 'admin') {
      setEmail('hasan.alfarisi@ploria.id');
      setFirstName('M. Hasan');
      setLastName('Al-Farisi');
    } else if (role === 'kasir') {
      setEmail('siti.rahma@ploria.id');
      setFirstName('Siti');
      setLastName('Rahmawati');
    } else if (role === 'superadmin') {
      setEmail('raka.superadmin@ploria.id');
      setFirstName('Raka');
      setLastName('Daniswara');
    }
  };

  const handleDirectLogin = (role: UserRole) => {
    handleRoleSelect(role);
    setShowRoleModal(false);
    onLogin(role);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'register') {
      setToastMessage(
        `Registrasi akun ${firstName} ${lastName} berhasil! Masuk ke sistem sebagai ${selectedRole === 'Manajer'
          ? 'MANAJER'
          : selectedRole === 'admin'
            ? 'ADMIN '
            : selectedRole === 'kasir'
              ? 'Kasir / Loket Tiket'
              : 'Super Admin Pusat'
        }`
      );
      setTimeout(() => {
        onLogin(selectedRole);
      }, 1000);
    } else {
      onLogin(selectedRole);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#EBF0F8] p-3 sm:p-6 lg:p-10 font-sans">
      {/* ── Outer Card Frame: Fixed consistent height & width on desktop ── */}
      <div className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-[32px] sm:rounded-[40px] bg-white shadow-2xl shadow-blue-900/10 min-h-[600px] lg:h-[660px] lg:flex-row">
        {/* ── LEFT SIDE: Form & Branding (Consistent Height) ── */}
        <div className="relative z-10 flex flex-1 flex-col justify-between bg-white px-7 py-8 sm:px-12 sm:py-9 h-full">
          <div>
            {/* Top Bar: Brand & Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src="/logo.png"
                  alt="Ploria Logo"
                  className="h-8 w-auto object-contain select-none drop-shadow-xs"
                />
                <span className="text-xl font-black text-slate-900 tracking-tight font-sans">
                  Ploria
                </span>
              </div>

            </div>

            {/* Header Titles */}
            <div className="mt-7 sm:mt-8">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                {mode === 'register' ? 'MULAI SECARA GRATIS' : 'SELAMAT DATANG'}
              </span>
              <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl lg:text-[34px] tracking-tight leading-tight">
                {mode === 'register' ? 'Buat akun baru' : 'Masuk ke akun'}
                <span className="text-[#286EF2]">.</span>
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
                {mode === 'register' ? (
                  <>
                    Sudah Memiliki Akun?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="font-bold text-[#286EF2] hover:underline"
                    >
                      Masuk
                    </button>
                  </>
                ) : (
                  <>
                    Belum punya akun?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="font-bold text-[#286EF2] hover:underline"
                    >
                      Buat akun
                    </button>
                  </>
                )}
              </p>
            </div>

            {/* Form Fields Container */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              {/* If Register Mode: First Name & Last Name (2 Cols) */}
              {mode === 'register' ? (
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <div className="relative rounded-2xl bg-[#F4F7FC] px-4 py-2 border border-transparent transition-all focus-within:border-[#286EF2] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100/60">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Nama depan
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Budi"
                      className="w-full bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                    <Contact className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400/80 pointer-events-none" />
                  </div>

                  <div className="relative rounded-2xl bg-[#F4F7FC] px-4 py-2 border border-transparent transition-all focus-within:border-[#286EF2] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100/60">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Nama belakang
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Santoso"
                      className="w-full bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                    <Contact className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400/80 pointer-events-none" />
                  </div>
                </div>
              ) : null}

              {/* Email Field */}
              <div className="relative rounded-2xl bg-[#F4F7FC] px-4 py-2 border border-transparent transition-all focus-within:border-[#286EF2] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100/60">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@ploria.id"
                  className="w-full bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none pr-6"
                />
                <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400/80 pointer-events-none" />
              </div>

              {/* Password Field */}
              <div className="relative rounded-2xl bg-[#F4F7FC] px-4 py-2 border border-transparent transition-all focus-within:border-[#286EF2] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100/60">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none pr-6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>

              {/* Role Selection Field */}
              <div className="relative rounded-2xl bg-[#F4F7FC] px-4 py-2 border border-transparent transition-all focus-within:border-[#286EF2] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100/60">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Role Akun (Hak Akses)
                  </label>
                  <span className="text-[10px] font-semibold text-[#286EF2]">
                    {selectedRole === 'Manajer'
                      ? 'MANAJER'
                      : selectedRole === 'admin'
                        ? 'Admin Wisata'
                        : selectedRole === 'kasir'
                          ? 'Kasir Loket'
                          : 'Super Admin HQ'}
                  </span>
                </div>
                <div className="mt-1 grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('Manajer')}
                    className={`rounded-xl py-1.5 text-[10px] sm:text-[11px] font-bold transition-all text-center ${selectedRole === 'Manajer'
                      ? 'bg-[#286EF2] text-white shadow-sm'
                      : 'bg-white/80 text-slate-600 hover:bg-white'
                      }`}
                  >
                    Manajer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('admin')}
                    className={`rounded-xl py-1.5 text-[10px] sm:text-[11px] font-bold transition-all text-center ${selectedRole === 'admin'
                      ? 'bg-[#286EF2] text-white shadow-sm'
                      : 'bg-white/80 text-slate-600 hover:bg-white'
                      }`}
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('kasir')}
                    className={`rounded-xl py-1.5 text-[10px] sm:text-[11px] font-bold transition-all text-center ${selectedRole === 'kasir'
                      ? 'bg-[#286EF2] text-white shadow-sm'
                      : 'bg-white/80 text-slate-600 hover:bg-white'
                      }`}
                  >
                    Kasir
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleSelect('superadmin')}
                    className={`rounded-xl py-1.5 text-[10px] sm:text-[11px] font-bold transition-all text-center ${selectedRole === 'superadmin'
                      ? 'bg-[#286EF2] text-white shadow-sm'
                      : 'bg-white/80 text-slate-600 hover:bg-white'
                      }`}
                  >
                    Super Admin
                  </button>
                </div>
              </div>

              {/* Login Extra Options (Remember & Forgot Password) for vertical visual balance */}
              {mode === 'login' ? (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-3.5 w-3.5 rounded border-slate-300 text-[#286EF2] focus:ring-[#286EF2]"
                    />
                    <span className="text-[11px] font-medium text-slate-500">Ingat sesi saya</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowRoleModal(true)}
                    className="text-[11px] font-semibold text-slate-400 hover:text-[#286EF2] transition"
                  >
                    Lupa Kata Sandi?
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-slate-400">
                    Akses instan langsung siap digunakan setelah registrasi
                  </span>
                </div>
              )}

              {/* Action Buttons Row */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRoleModal(true)}
                  className="rounded-full bg-[#F0F4FA] px-5 py-3 text-xs font-bold text-slate-600 hover:bg-[#E4ECF7] transition shrink-0"
                >
                  Ganti metode
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-full bg-[#286EF2] px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-[#1a5adb] transition-all flex items-center justify-center gap-2"
                >
                  <span>{mode === 'register' ? 'Buat akun' : 'Masuk'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="my-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md animate-fade-in-up">
              {toastMessage}
            </div>
          )}

          {/* Footer Copyright */}
          <div className="pt-4 border-t border-slate-100/80">
            <p className="text-[11px] text-slate-400">
              © 2026 Ploria Tourism Network • Sistem Manajemen Tiket Wisata
            </p>
          </div>
        </div>

        {/* ── RIGHT SIDE: Scenic Tourism Coastal Rock & Organic Wave Divider (Consistent Frame) ── */}
        <div className="relative hidden w-full lg:flex lg:w-[48%] h-full overflow-hidden bg-slate-900 select-none">
          {/* Nature Scenic Image: Pantai Karang Gigi Hiu */}
          <img
            src="/login-bg.jpg"
            alt="Destinasi Wisata Pantai Karang"
            className="h-full w-full object-cover object-center filter saturate-[1.08] contrast-[1.03]"
          />

          {/* Gentle gradient overlay for atmospheric depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

          {/* ── SVG Organic Wave Divider ── */}
          <svg
            className="absolute top-0 -left-1 bottom-0 h-full w-[150px] pointer-events-none z-10"
            viewBox="0 0 150 640"
            preserveAspectRatio="none"
          >
            {/* Dashed Guideline Curve */}
            <path
              d="M 50 0 C 18 160, 125 300, 48 450 C 12 530, 85 590, 25 640"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="1.8"
              strokeDasharray="4 6"
            />
            {/* White Organic Wave Fill */}
            <path
              d="M 0 0 L 85 0 C 42 160, 150 300, 72 450 C 28 530, 105 590, 50 640 L 0 640 Z"
              fill="#FFFFFF"
            />
          </svg>


        </div>
      </div>

      {/* ── Role Demo Modal ("Change method") ── */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-6 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#286EF2]" />
                <h3 className="text-sm font-bold text-slate-800">Pilih Akun Demo (Role)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRoleModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Klik salah satu akun di bawah untuk auto-fill data dan langsung masuk ke dashboard:
            </p>

            <div className="mt-4 space-y-2.5">
              {/* Manajer */}
              <button
                type="button"
                onClick={() => handleDirectLogin('Manajer')}
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 p-3 text-left transition hover:border-[#286EF2] hover:bg-blue-50/60"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">Budi Santoso, S.Par</p>
                  <p className="text-[10px] text-slate-400 truncate">budi.santoso@ploria.id</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                  Manajer
                </span>
              </button>

              {/* Admin */}
              <button
                type="button"
                onClick={() => handleDirectLogin('admin')}
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 p-3 text-left transition hover:border-[#286EF2] hover:bg-blue-50/60"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                  <UserCheck className="h-5 w-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">M. Hasan Al-Farisi</p>
                  <p className="text-[10px] text-slate-400 truncate">hasan.alfarisi@ploria.id</p>
                </div>
                <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[9px] font-bold text-sky-700">
                  Admin
                </span>
              </button>

              {/* Kasir */}
              <button
                type="button"
                onClick={() => handleDirectLogin('kasir')}
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 p-3 text-left transition hover:border-[#286EF2] hover:bg-blue-50/60"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <SlantedTicket className="h-5 w-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">Siti Rahmawati</p>
                  <p className="text-[10px] text-slate-400 truncate">siti.rahma@ploria.id</p>
                </div>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-800">
                  Kasir Loket
                </span>
              </button>

              {/* Super Admin */}
              <button
                type="button"
                onClick={() => handleDirectLogin('superadmin')}
                className="flex w-full items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50/40 p-3 text-left transition hover:border-[#286EF2] hover:bg-blue-50"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#286EF2] text-white shadow-xs">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">Raka Daniswara, S.Kom</p>
                  <p className="text-[10px] text-[#286EF2] font-semibold truncate">raka.superadmin@ploria.id</p>
                </div>
                <span className="rounded-full bg-[#286EF2] px-2 py-0.5 text-[9px] font-bold text-white shadow-xs">
                  Super Admin
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
