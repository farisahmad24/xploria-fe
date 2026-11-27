import { useState, useEffect } from 'react';
import {
  ChevronDown,
  LogOut,
  User,
  X,
} from 'lucide-react';
import logoHorizontal from '@/assets/logo/logo_horizontal.svg';
import { rolesNavigation } from '@/data/rolesNavData';
import { useSessionProfile } from '@/lib/profile';
import type { NavGroup, NavSubItem, UserRole } from '@/types/roles';

type SidebarProps = {
  currentRole: UserRole;
  activeId: string;
  onSelect: (id: string, label: string) => void;
  onLogout: () => void;
  open: boolean;
  onClose: () => void;
  /** Mode ringkas (desktop): sidebar menyusut menjadi rel ikon. Dikelola parent. */
  collapsed?: boolean;
};

export default function Sidebar({
  currentRole,
  activeId,
  onSelect,
  onLogout,
  open,
  onClose,
  collapsed = false,
}: SidebarProps) {
  const navConfig = rolesNavigation[currentRole];
  const profile = useSessionProfile(currentRole);

  const hideWhenCollapsed = collapsed ? 'lg:hidden' : '';

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
        activeId === 'kasir-calendar' ||
        activeId === 'kasir' ||
        activeId === 'Dasbor'
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
      (activeId.includes('dash') || activeId === 'Dashboard')
    ) {
      // Pastikan activeId 'kasir-dash-rekap' tidak menyebabkan kasir-dash aktif lagi
      if (activeId === 'kasir-dash-rekap') return false;
      return true;
    }

    // Tiketing
    if (
      (groupId === 'mo-tiket' || groupId === 'admin-tiket' || groupId === 'kasir-tiket') &&
      (activeId.includes('tiket') || activeId === 'tiket' || activeId === 'kasir-dash-rekap')
    ) {
      return true;
    }

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
        className={`fixed inset-0 z-40 bg-ocean-950/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden print:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        aria-hidden="true"
      />

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-80 flex-col overflow-hidden bg-white text-slate-800 shadow-2xl transition-[transform,width] duration-300 ease-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none print:hidden ${collapsed ? 'lg:w-20' : 'lg:w-72'
          } ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header: Centered Logo + "Ploria Agency" */}
        <div className="relative flex h-[72px] shrink-0 flex-row items-start justify-center gap-2.5 px-5 pt-4">
          {collapsed ? (
            <img
              src={logoHorizontal}
              alt="Ploria Logo"
              className="h-10 w-10 object-cover object-left drop-shadow-sm select-none"
            />
          ) : (
            <div className="flex flex-col items-center gap-1">
              <img
                src={logoHorizontal}
                alt="Ploria Logo"
                className="h-10 w-auto max-w-[180px] object-contain drop-shadow-sm select-none"
              />
              <p className={`text-[11px] text-slate-500 font-medium whitespace-nowrap leading-snug ${hideWhenCollapsed}`}>
                Pemesanan Tiket Wisata
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-5 rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 lg:hidden"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className={`no-scrollbar flex-1 overflow-y-auto pl-3 pr-0 pt-6 pb-6 space-y-3 ${collapsed ? 'lg:pl-3' : ''}`}>
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
                  title={collapsed ? group.title : undefined}
                  className={`sidebar-curved-tab flex items-center gap-3.5 px-3 py-3 text-left text-sm ${isActive ? 'w-full' : 'w-[calc(100%-0.75rem)]'} ${collapsed ? 'lg:justify-center lg:gap-0 lg:px-0 lg:mr-0' : ''
                    } ${isActive
                      ? 'sidebar-curved-tab-active'
                      : 'rounded-full font-semibold text-slate-700 hover:bg-[#E6F2FD]'
                    }`}
                >
                  <GroupIcon
                    className={`h-6 w-6 shrink-0 ${isActive ? 'text-[#286EF2]' : 'text-slate-500'
                      }`}
                  />
                  <span className={`flex-1 truncate leading-snug ${hideWhenCollapsed}`}>{group.title}</span>

                  {hasSubItems && (
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${hideWhenCollapsed} ${isActive ? 'text-[#286EF2]' : 'text-slate-400'
                        } ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  )}
                </button>

                {/* ── Dropdown Sub-Items (saat ringkas: tampil sebagai deretan ikon) ── */}
                {hasSubItems && isExpanded && (
                  <div
                    className={`relative my-1.5 pl-3.5 border-l-2 border-slate-200 space-y-1 animate-fadeIn ${collapsed ? 'lg:ml-0 lg:mr-0 lg:pl-0 lg:border-l-0 lg:space-y-1.5' : 'ml-6 mr-4'
                      }`}
                  >
                    {group.items.map((item) => {
                      const SubIcon = item.icon;
                      const isSubActive =
                        activeId === item.id ||
                        (group.id === 'kasir-dash' &&
                          (activeId === 'kasir-dash' || activeId === 'kasir' || activeId === 'Dashboard') &&
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
                          title={collapsed ? item.label : undefined}
                          className={`flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left text-xs transition-all duration-150 ${collapsed ? 'lg:justify-center lg:gap-0 lg:px-0' : ''
                            } ${isSubActive
                              ? 'bg-[#E6F2FD] border border-[#286EF2]/20 text-[#286EF2] font-bold shadow-sm'
                              : 'font-medium text-slate-600 hover:bg-[#E6F2FD] hover:text-slate-900'
                            }`}
                        >
                          {SubIcon ? (
                            <SubIcon
                              className={`h-4 w-4 shrink-0 ${isSubActive ? 'text-[#286EF2]' : 'text-slate-400'
                                }`}
                            />
                          ) : (
                            <span
                              className={`h-1.5 w-1.5 rounded-full shrink-0 ${isSubActive ? 'bg-[#286EF2]' : 'bg-slate-300'
                                }`}
                            />
                          )}
                          <span className={`truncate leading-snug ${hideWhenCollapsed}`}>{item.label}</span>
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
        <div className="mt-auto px-4 pb-5 pt-3 space-y-2.5 border-t border-slate-200">
          {/* Status Wisata Aktif */}
          <div className={`flex items-center gap-2 px-1 ${collapsed ? 'lg:justify-center' : ''}`}>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className={`text-xs font-semibold text-slate-700 ${hideWhenCollapsed}`}>Xploria Wisata Aktif</span>
          </div>

          {/* Role Card */}
          <div className={`rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-inner ${hideWhenCollapsed}`}>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <User className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              <span>ROLE PENGGUNA AKTIF</span>
            </div>
            <p className="mt-1 truncate text-xs font-extrabold text-slate-900">
              {profile.userRoleName.toUpperCase()}
            </p>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={onLogout}
            title={collapsed ? 'Logout Sesi' : undefined}
            className={`flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF4D5E] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-red-900/20 transition hover:bg-[#ff3347] ${collapsed ? 'lg:px-0' : ''
              }`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className={hideWhenCollapsed}>Logout Sesi</span>
          </button>
        </div>
      </aside>
    </>
  );
}
