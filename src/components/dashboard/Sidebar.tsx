import { useState, useEffect } from 'react';
import {
  ChevronDown,
  LogOut,
  User,
  X,
} from 'lucide-react';
import { roleProfiles, rolesNavigation } from '@/data/rolesNavData';
import type { NavGroup, NavSubItem, UserRole } from '@/types/roles';

type SidebarProps = {
  currentRole: UserRole;
  activeId: string;
  onSelect: (id: string, label: string) => void;
  onLogout: () => void;
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({
  currentRole,
  activeId,
  onSelect,
  onLogout,
  open,
  onClose,
}: SidebarProps) {
  const navConfig = rolesNavigation[currentRole];
  const profile = roleProfiles[currentRole];

  // ── Accordion state: track which group is currently expanded ─────────────
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(() => {
    // Auto-expand the group that contains the initial activeId
    for (const group of rolesNavigation[currentRole].groups) {
      if (group.items.length > 0) {
        if (group.items.some((item) => item.id === activeId) || group.id === activeId) {
          return group.id;
        }
      }
    }
    return null;
  });

  // If activeId changes, auto-expand the parent group
  useEffect(() => {
    for (const group of navConfig.groups) {
      if (group.items.length > 0) {
        if (group.items.some((item) => item.id === activeId) || group.id === activeId) {
          setExpandedGroupId(group.id);
          return;
        }
      }
    }
  }, [activeId, navConfig.groups]);

  const handleSelect = (id: string, label: string) => {
    onSelect(id, label);
    onClose();
  };

  const handleGroupClick = (group: NavGroup) => {
    if (group.items.length > 0) {
      if (expandedGroupId === group.id) {
        // Toggle collapse jika user mengklik grup yang sudah terbuka
        setExpandedGroupId(null);
      } else {
        // Buka dropdown
        setExpandedGroupId(group.id);
        // Jika belum ada sub-item aktif dari grup ini, aktifkan sub-item pertama
        const isChildActive = group.items.some((item) => item.id === activeId);
        if (!isChildActive) {
          handleSelect(group.items[0].id, group.items[0].label);
        }
      }
    } else {
      handleSelect(group.id, group.title);
    }
  };

  const handleSubItemClick = (item: NavSubItem) => {
    handleSelect(item.id, item.label);
  };

  // ── Determine if a group header should be highlighted as "active" ─────────
  const isGroupActive = (groupId: string): boolean => {
    // Direct match (group itself selected)
    if (activeId === groupId) return true;

    // Check if any sub-item of this group is active
    const group = navConfig.groups.find((g) => g.id === groupId);
    if (group && group.items.some((item) => item.id === activeId)) return true;

    // ── Kasir Dashboard: hanya aktif untuk ID yang benar-benar miliknya ──
    if (groupId === 'kasir-dash') {
      return (
        activeId === 'kasir-dash' ||
        activeId === 'kasir-dash-overview' ||
        activeId === 'kasir-dash-calendar' ||
        activeId === 'kasir-calendar' ||
        activeId === 'kasir' ||
        activeId === 'dashboard'
      );
    }

    // kasir-dash-rekap HANYA aktif untuk dirinya sendiri – jangan masuk blok generic -dash
    if (groupId === 'kasir-dash-rekap') {
      return activeId === 'kasir-dash-rekap' || activeId.includes('rekap');
    }

    // Dashboard generik (mo-dash, admin-dash, dst) – KECUALIKAN kasir-dash-rekap agar tidak bentrok
    if (
      groupId.endsWith('-dash') &&
      groupId !== 'kasir-dash-rekap' &&
      (activeId.includes('dash') || activeId === 'dashboard')
    ) {
      // Pastikan activeId 'kasir-dash-rekap' tidak menyebabkan kasir-dash aktif lagi
      if (activeId === 'kasir-dash-rekap') return false;
      return true;
    }

    // Tiketing
    if (
      (groupId === 'mo-tiket' || groupId === 'admin-tiket' || groupId === 'kasir-tiket-sales') &&
      (activeId.includes('tiket') || activeId === 'tiket')
    ) {
      if (groupId === 'kasir-tiket-sales') return activeId === 'kasir-tiket-sales';
      return true;
    }

    if (groupId === 'kasir-tiket-validate' && activeId === 'kasir-tiket-validate') return true;
    if (
      groupId === 'kasir-dash-rekap' &&
      (activeId === 'kasir-dash-rekap' || activeId.includes('rekap'))
    ) return true;

    // Laporan
    if (
      (groupId === 'mo-laporan' || groupId === 'admin-laporan') &&
      (activeId.includes('report') || activeId.includes('laporan'))
    ) return true;

    // Destinasi
    if (
      (groupId === 'mo-destinasi' || groupId === 'admin-destinasi') &&
      (activeId.includes('dest-profile') || activeId.includes('dest-info') || activeId.includes('dest-gallery') || activeId.includes('destinasi'))
    ) return true;

    // Ulasan
    if (
      (groupId === 'mo-ulasan' || groupId === 'admin-dest-reviews') &&
      activeId.includes('review')
    ) return true;

    // Akun staf
    if (groupId === 'mo-akun' && (activeId.includes('staff') || activeId === 'mo-akun')) return true;

    return false;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-ocean-950/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden print:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-80 flex-col overflow-hidden bg-[#286EF2] text-white shadow-2xl transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:translate-x-0 lg:shadow-none print:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header: Centered Logo + "Ploria Agency" */}
        <div className="relative flex flex-col items-center justify-center pt-7 pb-2 px-5">
          <img
            src="/logo-white.png"
            alt="Ploria Logo"
            className="h-10 w-auto object-contain drop-shadow-sm select-none"
          />
          <h1 className="mt-2 text-base font-bold text-white tracking-wide">
            Ploria Agency
          </h1>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-5 rounded-lg p-1.5 text-white/80 transition hover:bg-white/15 hover:text-white lg:hidden"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="no-scrollbar flex-1 overflow-y-auto pl-4 pr-0 pt-6 pb-6 space-y-1.5">
          {navConfig.groups.map((group) => {
            const GroupIcon = group.icon;
            const hasSubItems = group.items.length > 0;
            const isActive = isGroupActive(group.id);
            const isExpanded = expandedGroupId === group.id;

            return (
              <div key={group.id} className="w-full">
                {/* ── Main Group Button ── */}
                <button
                  type="button"
                  onClick={() => handleGroupClick(group)}
                  aria-expanded={hasSubItems ? isExpanded : undefined}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex w-full items-center gap-3.5 px-4 py-3 text-left text-sm transition-all duration-200 ${
                    isActive
                      ? 'sidebar-curved-tab-active'
                      : 'mr-4 rounded-full font-semibold text-white hover:bg-white/10'
                  }`}
                >
                  <GroupIcon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#286EF2]' : 'text-white'
                    }`}
                  />
                  <span className="flex-1 truncate leading-snug">{group.title}</span>

                  {hasSubItems && (
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                        isActive ? 'text-[#286EF2]' : 'text-white'
                      } ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  )}
                </button>

                {/* ── Dropdown Sub-Items ── */}
                {hasSubItems && isExpanded && (
                  <div className="relative my-1.5 ml-6 mr-4 pl-3.5 border-l-2 border-white/30 space-y-1 animate-fadeIn">
                    {group.items.map((item) => {
                      const SubIcon = item.icon;
                      const isSubActive =
                        activeId === item.id ||
                        (group.id === 'kasir-dash' &&
                          (activeId === 'kasir-dash' || activeId === 'kasir' || activeId === 'dashboard') &&
                          item.id === 'kasir-dash-overview') ||
                        (group.id === 'kasir-dash' &&
                          (activeId === 'kasir-calendar' || activeId === 'kasir-dash-calendar') &&
                          item.id === 'kasir-dash-calendar') ||
                        (group.id === 'mo-tiket' && (activeId === 'mo-tiket' || activeId === 'tiket') && item.id === 'mo-tiket-manage') ||
                        (group.id === 'admin-tiket' && activeId === 'admin-tiket' && item.id === 'admin-tiket-manage') ||
                        (group.id === 'mo-laporan' && activeId === 'mo-laporan' && item.id === 'mo-report-visitors-cat') ||
                        (group.id === 'admin-laporan' && activeId === 'admin-laporan' && item.id === 'admin-report-visitors-cat');

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSubItemClick(item)}
                          className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left text-xs transition-all duration-150 ${
                            isSubActive
                              ? 'bg-white/20 border border-white/25 text-white font-bold shadow-sm backdrop-blur-sm'
                              : 'font-medium text-white/85 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {SubIcon ? (
                            <SubIcon
                              className={`h-4 w-4 shrink-0 ${
                                isSubActive ? 'text-white' : 'text-blue-100'
                              }`}
                            />
                          ) : (
                            <span
                              className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                                isSubActive ? 'bg-white' : 'bg-white/60'
                              }`}
                            />
                          )}
                          <span className="truncate leading-snug">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer Area: Status Wisata, Role Pengguna, Logout */}
        <div className="mt-auto px-4 pb-5 pt-3 space-y-2.5 border-t border-white/15">
          {/* Status Wisata Aktif */}
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
              {profile.userRoleName.toUpperCase()}
            </p>
          </div>

          {/* Logout Button */}
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
}
