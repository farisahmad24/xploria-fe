import React from 'react';
import { 
  Building2, 
  FileCheck2, 
  History, 
  LogOut, 
  ShieldCheck, 
  Compass, 
  CheckCircle,
  X
} from 'lucide-react';

interface SuperAdminSidebarProps {
  activeTab: 'validasi-mitra' | 'audit-log';
  onSelectTab: (tab: 'validasi-mitra' | 'audit-log') => void;
  pendingCount: number;
  onLogout: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const SuperAdminSidebar: React.FC<SuperAdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingCount,
  onLogout,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 bg-[#286EF2] text-white flex flex-col z-50 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Brand */}
        <div className="p-6 pb-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20 shadow-inner">
              <Compass className="w-6 h-6 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-white">Xploria</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/25">
                  HQ
                </span>
              </div>
              <p className="text-[11px] font-semibold text-blue-100/90 tracking-wide">
                Portal Super Administrator
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              aria-label="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Status System Badge */}
        <div className="px-6 py-3.5 bg-black/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <span className="text-blue-100 font-medium text-[11px]">Sistem Pengawasan Aktif</span>
          </div>
          <span className="text-[10px] font-mono text-white/70">v2.4-sa</span>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-blue-200/75">
            Manajemen Platform Wisata
          </div>

          {/* Nav Item: Validasi Mitra */}
          <button
            onClick={() => {
              onSelectTab('validasi-mitra');
              onCloseMobile?.();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all group ${
              activeTab === 'validasi-mitra'
                ? 'bg-white text-[#286EF2] font-bold shadow-lg shadow-black/10'
                : 'text-white/90 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileCheck2
                className={`w-5 h-5 transition-transform group-hover:scale-105 ${
                  activeTab === 'validasi-mitra' ? 'text-[#286EF2]' : 'text-blue-200'
                }`}
              />
              <div className="text-left">
                <div>Validasi Mitra Wisata</div>
                <div
                  className={`text-[10px] ${
                    activeTab === 'validasi-mitra' ? 'text-[#286EF2]/70 font-semibold' : 'text-blue-200/80'
                  }`}
                >
                  Verifikasi Berkas Legalitas
                </div>
              </div>
            </div>

            {pendingCount > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-black shadow-xs ${
                  activeTab === 'validasi-mitra'
                    ? 'bg-[#286EF2] text-white'
                    : 'bg-amber-400 text-slate-900 animate-pulse'
                }`}
              >
                {pendingCount}
              </span>
            )}
          </button>

          {/* Nav Item: Audit Log */}
          <button
            onClick={() => {
              onSelectTab('audit-log');
              onCloseMobile?.();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all group ${
              activeTab === 'audit-log'
                ? 'bg-white text-[#286EF2] font-bold shadow-lg shadow-black/10'
                : 'text-white/90 hover:bg-white/10 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <History
                className={`w-5 h-5 transition-transform group-hover:scale-105 ${
                  activeTab === 'audit-log' ? 'text-[#286EF2]' : 'text-blue-200'
                }`}
              />
              <div className="text-left">
                <div>Audit Log Sistem</div>
                <div
                  className={`text-[10px] ${
                    activeTab === 'audit-log' ? 'text-[#286EF2]/70 font-semibold' : 'text-blue-200/80'
                  }`}
                >
                  Rekam Jejak Keputusan
                </div>
              </div>
            </div>
          </button>

          <div className="pt-6 px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-blue-200/75">
            Akses & Otoritas
          </div>

          <div className="px-3.5 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-blue-100 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Tingkat Akses: Level 0 (Master)</span>
            </div>
            <p className="text-[11px] text-blue-200/80 leading-relaxed">
              Otoritas penuh untuk menyetujui, merevisi, menolak, atau membekukan akun pengelola objek wisata se-Indonesia.
            </p>
          </div>
        </div>

        {/* Footer / User Profile & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-black/5">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/10 border border-white/15">
            <div className="w-10 h-10 rounded-xl bg-white text-[#286EF2] font-black flex items-center justify-center shrink-0 shadow-sm text-sm">
              RD
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                <span>Raka Daniswara, S.Kom</span>
              </div>
              <div className="text-[11px] text-blue-200 truncate">raka.superadmin@ploria.id</div>
              <div className="text-[10px] font-semibold text-emerald-300 flex items-center gap-1 mt-0.5">
                <CheckCircle className="w-3 h-3" />
                <span>Super Admin Verified</span>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition shadow-md shadow-rose-950/20 active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Sesi Super Admin</span>
          </button>
        </div>
      </aside>
    </>
  );
};
export default SuperAdminSidebar;
