import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  Building2, 
  User, 
  ChevronRight,
  Sparkles
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'validasi-mitra':
        return 'Validasi Mitra Wisata';
      case 'audit-log':
        return 'Audit Log Sistem';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans text-slate-800 flex">
      {/* Sidebar Khusus Super Admin */}
      <SuperAdminSidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        pendingCount={pendingCount}
        onLogout={onLogout}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            {/* Hamburger Button (Mobile) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Buka Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Info */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="font-semibold text-slate-700 hidden sm:inline">Portal Super Admin</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
              <span className="font-bold text-slate-900">{getBreadcrumbTitle()}</span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Environment Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#286EF2]" />
              <span>HQ Otoritas Pusat</span>
            </div>

            {/* Notification Indicator */}
            {pendingCount > 0 && (
              <div 
                onClick={() => onSelectTab('validasi-mitra')}
                className="cursor-pointer flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition"
                title={`${pendingCount} antrean pendaftaran menunggu verifikasi`}
              >
                <Bell className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
                <span>{pendingCount} Verifikasi Tertunda</span>
              </div>
            )}

            {/* Profile Avatar Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#286EF2] text-white font-black text-xs flex items-center justify-center shadow-xs">
                RD
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight">Raka Daniswara</div>
                <div className="text-[10px] text-slate-500 font-medium">Lead Super Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="py-4 px-8 border-t border-slate-200/80 bg-white/60 text-center sm:flex sm:justify-between sm:items-center text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} <strong className="text-slate-700">Xploria Agency Indonesia</strong> &mdash; Modul Super Administrator.
          </div>
          <div className="mt-1 sm:mt-0 flex items-center justify-center gap-4 text-[11px] text-slate-400">
            <span>SLA Verifikasi Mitra: Maks 2x24 Jam</span>
            <span>&bull;</span>
            <span>Standar Keamanan ISO 27001</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
export default SuperAdminLayout;
