import React, { useState } from 'react';
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  X,
} from 'lucide-react';
import { SuperAdminSidebar } from './SuperAdminSidebar';

interface SuperAdminLayoutProps {
  activeTab: 'validasi-mitra' | 'audit-log';
  onSelectTab: (tab: 'validasi-mitra' | 'audit-log') => void;
  pendingCount: number;
  onLogout: () => void;
  children: React.ReactNode;
}

export const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({
  activeTab,
  onSelectTab,
  pendingCount,
  onLogout,
  children,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState('');

  const profile = {
    userName: 'Raka Daniswara, S.Kom',
    userRoleName: 'Super Admin Xploria',
    title: 'Super Admin',
    avatarText: 'RD',
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar — sama persis dengan Sidebar.tsx */}
      <SuperAdminSidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        pendingCount={pendingCount}
        onLogout={onLogout}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      {/* Right Panel: Header + Content — sama persis dengan App.tsx */}
      <div className="flex flex-1 flex-col min-w-0">

        {/* Header — identik styling dengan Header.tsx */}
        <header className="sticky top-0 z-30 border-b border-ocean-100/80 bg-white/90 backdrop-blur-md">
          <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="rounded-xl p-2 text-ocean-800 transition hover:bg-ocean-50 lg:hidden"
              aria-label="Buka menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Search Bar — identik dengan Header.tsx */}
            <div className="relative w-full max-w-md">
              <label className="group relative flex w-full items-center">
                <Search className="pointer-events-none absolute left-4 h-[18px] w-[18px] text-ocean-400 transition-colors group-focus-within:text-[#286EF2]" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari mitra wisata, nama PIC, atau status..."
                  className="w-full rounded-full border border-ocean-100 bg-ocean-50/70 py-2.5 pl-11 pr-10 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 transition focus:border-[#286EF2] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                  autoComplete="off"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-3 rounded-full p-0.5 text-slate-400 hover:text-slate-700 transition"
                    aria-label="Hapus pencarian"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </label>
            </div>

            {/* Right side items — identik dengan Header.tsx */}
            <div className="ml-auto flex items-center gap-2 sm:gap-4">
              {/* Notifikasi pending */}
              {pendingCount > 0 && (
                <button
                  type="button"
                  onClick={() => onSelectTab('validasi-mitra')}
                  className="relative rounded-full p-2.5 text-ocean-700 transition hover:bg-ocean-50"
                  aria-label="Notifikasi"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white ring-2 ring-white">
                    {pendingCount}
                  </span>
                </button>
              )}

              {/* User Profile dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 rounded-full p-1 transition hover:bg-ocean-50 sm:pl-2 sm:pr-3"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-ocean-600 to-ocean-800 text-xs font-extrabold text-white ring-2 ring-ocean-100">
                    {profile.avatarText}
                  </div>
                  <div className="hidden text-left leading-tight sm:block">
                    <p className="text-xs font-bold text-ocean-950">{profile.userName}</p>
                    <p className="text-[11px] font-medium text-ocean-600">{profile.title}</p>
                  </div>
                  <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
                </button>

                {profileOpen && (
                  <div className="animate-fade-in-up absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-2xl border border-ocean-100 bg-white p-2 shadow-2xl">
                    <div className="border-b border-slate-100 px-3 py-2.5">
                      <p className="text-xs font-bold text-slate-900">{profile.userName}</p>
                      <p className="text-[11px] text-slate-500">{profile.userRoleName}</p>
                    </div>
                    <div className="pt-1.5">
                      <button
                        type="button"
                        onClick={() => { setProfileOpen(false); onLogout(); }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout / Keluar Sesi
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content — identik padding dengan App.tsx */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
