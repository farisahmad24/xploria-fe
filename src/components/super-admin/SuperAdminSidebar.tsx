import React from 'react';
import {
  FileCheck2,
  History,
  LogOut,
  User,
  X,
} from 'lucide-react';

interface SuperAdminSidebarProps {
  activeTab: 'validasi-mitra' | 'audit-log';
  onSelectTab: (tab: 'validasi-mitra' | 'audit-log') => void;
  pendingCount: number;
  onLogout: () => void;
  open: boolean;
  onClose: () => void;
}

type NavItem = {
  id: 'validasi-mitra' | 'audit-log';
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  badge?: number;
};

export const SuperAdminSidebar: React.FC<SuperAdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingCount,
  onLogout,
  open,
  onClose,
}) => {
  const navItems: NavItem[] = [
    {
      id: 'validasi-mitra',
      label: 'Validasi Mitra Wisata',
      Icon: FileCheck2,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      id: 'audit-log',
      label: 'Audit Log Sistem',
      Icon: History,
    },
  ];

  const handleSelect = (id: 'validasi-mitra' | 'audit-log') => {
    onSelectTab(id);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-ocean-950/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* Sidebar Panel — identik dgn Sidebar.tsx */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-80 flex-col overflow-hidden bg-[#286EF2] text-white shadow-2xl transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:translate-x-0 lg:shadow-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header: Logo + nama app — sama persis dengan Sidebar.tsx */}
        <div className="relative flex flex-col items-center justify-center pt-7 pb-2 px-5">
          <img
            src="/logo-white.png"
            alt="Ploria Logo"
            className="h-10 w-auto object-contain drop-shadow-sm select-none"
          />
          <h1 className="mt-2 text-base font-bold text-white tracking-wide">
            Ploria Agency
          </h1>
          {/* Close button — mobile only */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-5 rounded-lg p-1.5 text-white/80 transition hover:bg-white/15 hover:text-white lg:hidden"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="no-scrollbar flex-1 overflow-y-auto pl-4 pr-0 pt-6 pb-6 space-y-1.5">
          {navItems.map((item) => {
            const { id, label, Icon, badge } = item;
            const isActive = activeTab === id;

            return (
              <div key={id} className="w-full">
                <button
                  type="button"
                  onClick={() => handleSelect(id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex w-full items-center gap-3.5 px-4 py-3 text-left text-sm transition-all duration-200 ${
                    isActive
                      ? 'sidebar-curved-tab-active'
                      : 'mr-4 rounded-full font-semibold text-white hover:bg-white/10'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#286EF2]' : 'text-white'
                    }`}
                  />
                  <span className="flex-1 truncate leading-snug">{label}</span>

                  {/* Badge pending count */}
                  {badge !== undefined && (
                    <span
                      className={`ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-black leading-none ${
                        isActive
                          ? 'bg-[#286EF2] text-white'
                          : 'bg-amber-400 text-slate-900 animate-pulse'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </nav>

        {/* Footer — identik dengan Sidebar.tsx */}
        <div className="mt-auto px-4 pb-5 pt-3 space-y-2.5 border-t border-white/15">
          {/* Status */}
          <div className="flex items-center gap-2 px-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-xs font-semibold text-white">Xploria Wisata Aktif</span>
          </div>

          {/* Role Card */}
          <div className="rounded-2xl border border-white/20 bg-white/10 p-3 shadow-inner">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-100">
              <User className="h-3.5 w-3.5 text-white shrink-0" />
              <span>ROLE PENGGUNA AKTIF</span>
            </div>
            <p className="mt-1 truncate text-xs font-extrabold text-white">
              SUPER ADMIN (PUSAT KONTROL)
            </p>
          </div>

          {/* Logout Button — sama persis */}
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF4D5E] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-red-900/20 transition hover:bg-[#ff3347]"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Logout Sesi</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default SuperAdminSidebar;
