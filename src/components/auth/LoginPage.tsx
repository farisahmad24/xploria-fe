import { useState } from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import SlantedTicket from '@/components/common/SlantedTicket';
import AppLogo from '@/components/common/AppLogo';
import type { UserRole } from '@/types/roles';

type LoginPageProps = {
  onLogin: (role: UserRole) => void;
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('pengelola');
  const [email, setEmail] = useState('budi.santoso@Ploria.id');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'pengelola') setEmail('budi.santoso@Ploria.id');
    else if (role === 'admin') setEmail('hasan.alfarisi@Ploria.id');
    else if (role === 'kasir') setEmail('siti.rahma@Ploria.id');
  };

  const handleDirectLogin = (role: UserRole) => {
    onLogin(role);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole);
  };

  return (
    /* Full-screen gray background */
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-100 p-4 sm:p-6 lg:p-8">
      {/* Floating Card Container */}
      <div className="flex w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-300/60">

        {/* ── LEFT PANEL: Blue solid panel ── */}
        <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-[#286EF2] p-10 lg:flex">
          {/* Decorative circles */}
          <div className="absolute -top-16 -left-16 h-56 w-56 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-white/10" />
          <div className="absolute bottom-32 -left-10 h-36 w-36 rounded-full bg-white/5" />

          {/* Headline */}
          <div className="relative z-10">
            <h2 className="text-2xl font-extrabold leading-snug text-white xl:text-3xl">
              Sederhanakan manajemen wisata dengan dashboard kami
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-blue-100/90">
              Sistem terintegrasi untuk tiket digital, validasi QR, laporan keuangan, dan transparansi bagi hasil destinasi wisata.
            </p>
          </div>

          {/* Illustration */}
          <div className="relative z-10 flex flex-1 items-center justify-center py-6">
            <img
              src="https://cdn3d.iconscout.com/3d/premium/thumb/man-working-on-laptop-5684898-4716266.png"
              alt="Ilustrasi Dashboard"
              className="w-full max-w-[260px] drop-shadow-2xl"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>

          {/* Footer */}
          <p className="relative z-10 text-[11px] text-blue-200/70">
            © 2026 Ploria Tourism Network
          </p>
        </div>

        {/* ── RIGHT PANEL: White form ── */}
        <div className="flex flex-1 flex-col justify-center px-8 py-10 sm:px-12">
          {/* Logo */}
          <div className="mb-6 flex justify-center lg:justify-start">
            <AppLogo colorScheme="blue" size={40} />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
            Selamat Datang Kembali
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Silakan masuk ke akun Anda
          </p>

          {/* Email Input */}
          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 transition focus:border-[#286EF2] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-11 text-sm text-slate-800 placeholder-slate-400 transition focus:border-[#286EF2] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end -mt-1">
              <button
                type="button"
                className="text-xs text-slate-400 hover:text-[#286EF2] transition"
              >
                Lupa Kata Sandi?
              </button>
            </div>

            {/* Primary Login Button */}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#286EF2] py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              <span>Masuk</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 flex items-center">
            <div className="flex-1 border-t border-slate-200" />
            <span className="mx-3 text-xs font-medium text-slate-400">
              atau masuk sebagai
            </span>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          {/* Role Login Buttons */}
          <div className="flex flex-col gap-2.5">
            {/* Pengelola */}
            <button
              type="button"
              onClick={() => {
                handleRoleSelect('pengelola');
                handleDirectLogin('pengelola');
              }}
              className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-[#286EF2] hover:bg-blue-50 hover:text-[#286EF2]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200 transition">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <span className="flex-1">Login sebagai Pengelola</span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">

              </span>
            </button>

            {/* Admin */}
            <button
              type="button"
              onClick={() => {
                handleRoleSelect('admin');
                handleDirectLogin('admin');
              }}
              className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-[#286EF2] hover:bg-blue-50 hover:text-[#286EF2]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-700 group-hover:bg-sky-200 transition">
                <UserCheck className="h-4 w-4" />
              </span>
              <span className="flex-1">Login sebagai Admin</span>
              <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700">
                Aktor Pengelola
              </span>
            </button>

            {/* Kasir */}
            <button
              type="button"
              onClick={() => {
                handleRoleSelect('kasir');
                handleDirectLogin('kasir');
              }}
              className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:border-[#286EF2] hover:bg-blue-50 hover:text-[#286EF2]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 group-hover:bg-amber-200 transition">
                <SlantedTicket className="h-4 w-4" />
              </span>
              <span className="flex-1">Login sebagai Kasir</span>
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                Loket Tiket
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
