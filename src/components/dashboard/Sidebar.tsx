import { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronRight,
  LogOut,
  Palmtree,
  UserCheck,
  X,
} from 'lucide-react';
import AppLogo from '@/components/common/AppLogo';
import { roleProfiles, rolesNavigation } from '@/data/rolesNavData';
import type { UserRole } from '@/types/roles';

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
    // Auto-expand the group that contains the initial activeId (sub-item match)
    for (const group of rolesNavigation[currentRole].groups) {
      if (group.items.some((item) => item.id === activeId)) {
        return group.id;
      }
    }
    return null;
  });

  // If activeId changes (e.g. from Header search nav), auto-expand the parent group
  useEffect(() => {
    for (const group of navConfig.groups) {
      if (group.items.some((item) => item.id === activeId)) {
        setExpandedGroupId(group.id);
        return;
      }
    }
  }, [activeId, navConfig.groups]);

  const handleSelect = (id: string, label: string) => {
    onSelect(id, label);
    onClose();
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroupId((prev) => (prev === groupId ? null : groupId));
  };

  // ── Determine if a group header should be highlighted as "active" ─────────
  const isGroupActive = (groupId: string): boolean => {
    // Direct match (group itself selected, e.g. flat-link groups)
    if (activeId === groupId) return true;

    // Check if any sub-item of this group is active
    const group = navConfig.groups.find((g) => g.id === groupId);
    if (group && group.items.some((item) => item.id === activeId)) return true;

    // ── Legacy heuristic mappings for flat-link groups ────────────────────
    // Dashboard
    if (
      groupId.endsWith('-dash') &&
      (activeId.includes('dash') || activeId === 'dashboard')
    ) {
      if (groupId === 'kasir-dash-rekap') return activeId === 'kasir-dash-rekap';
      return true;
    }

    // Tiketing
    if (
      (groupId === 'mo-tiket' || groupId === 'admin-tiket') &&
      (activeId.includes('tiket') || activeId === 'tiket')
    ) return true;

    // Kasir items
    if (groupId === 'kasir-tiket-sales' && activeId === 'kasir-tiket-sales') return true;
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
      (activeId.includes('dest-profile') || activeId.includes('dest-info') || activeId.includes('dest-gallery'))
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
        className={`fixed inset-0 z-40 bg-ocean-950/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        aria-hidden="true"
      />

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-80 flex-col overflow-hidden bg-[#286EF2] text-white shadow-2xl transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:translate-x-0 lg:shadow-none ${open ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Header: Logo + Close */}
        <div className="flex items-center justify-between px-5 pb-4 pt-6">
          <AppLogo colorScheme="white" size={38} />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/80 transition hover:bg-white/15 hover:text-white lg:hidden"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Role Badge */}
        <div className="px-4 pb-3">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-3 shadow-inner">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-100">
              <UserCheck className="h-3.5 w-3.5 text-white" />
              Role Pengguna Aktif
            </span>
            <p className="mt-0.5 truncate text-xs font-extrabold text-white">
              {navConfig.roleTitle}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="no-scrollbar flex-1 overflow-y-auto px-3.5 pb-6">
          <div className="space-y-2">
            {navConfig.groups.map((group) => {
              const GroupIcon = group.icon;
              const hasSubItems = group.items.length > 0;
              const isActive = isGroupActive(group.id);
              const isExpanded = expandedGroupId === group.id;

              return (
                <div
                  key={group.id}
                  className="overflow-hidden rounded-2xl bg-white/[0.06] ring-1 ring-white/10"
                >
                  {/* ── FLAT LINK (no sub-items) ───────────────────────── */}
                  {!hasSubItems ? (
                    <button
                      type="button"
                      onClick={() => handleSelect(group.id, group.title)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-xs transition-all duration-150 ${isActive
                        ? 'bg-white text-[#286EF2] font-extrabold shadow-md shadow-blue-950/25 ring-1 ring-white'
                        : 'font-semibold text-white hover:bg-white/15 hover:text-white'
                        }`}
                    >
                      <GroupIcon
                        className={`h-4 w-4 shrink-0 transition-transform ${isActive ? 'scale-110 text-[#286EF2]' : 'text-white'
                          }`}
                      />
                      <span className="flex-1 leading-snug">{group.title}</span>
                    </button>
                  ) : (
                    /* ── ACCORDION (has sub-items) ──────────────────────── */
                    <>
                      {/* Accordion Header */}
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.id)}
                        aria-expanded={isExpanded}
                        className={`flex w-full items-center gap-3 px-3.5 py-3 text-left text-xs transition-all duration-150 ${isActive && !isExpanded
                          ? 'bg-white text-[#286EF2] font-extrabold shadow-md shadow-blue-950/25'
                          : isActive && isExpanded
                            ? 'bg-white/20 text-white font-extrabold'
                            : 'font-semibold text-white hover:bg-white/15'
                          }`}
                      >
                        <GroupIcon
                          className={`h-4 w-4 shrink-0 transition-transform ${isActive && !isExpanded
                            ? 'scale-110 text-[#286EF2]'
                            : 'text-white'
                            }`}
                        />
                        <span className="flex-1 leading-snug">{group.title}</span>
                        {isExpanded ? (
                          <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-80" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
                        )}
                      </button>

                      {/* Sub-items panel (animated) */}
                      <div
                        className={`overflow-hidden transition-all duration-200 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                      >
                        <div className="mx-3 mb-2.5 mt-1 space-y-0.5 border-l-2 border-white/25 pl-3">
                          {group.items.map((item) => {
                            const SubIcon = item.icon;
                            const isSubActive = activeId === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => handleSelect(item.id, item.label)}
                                aria-current={isSubActive ? 'page' : undefined}
                                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs transition-all duration-100 ${isSubActive
                                  ? 'bg-white/25 font-extrabold text-white ring-1 ring-white/40 shadow-sm'
                                  : 'font-medium text-blue-100 hover:bg-white/10 hover:text-white'
                                  }`}
                              >
                                {SubIcon && (
                                  <SubIcon
                                    className={`h-3.5 w-3.5 shrink-0 ${isSubActive ? 'text-white' : 'text-blue-200'
                                      }`}
                                  />
                                )}
                                <span className="leading-snug">{item.label}</span>
                                {item.badge && (
                                  <span className="ml-auto rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                                    {item.badge}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Footer: User Info + Logout */}
        <div className="relative mt-auto border-t border-white/15 px-5 pb-5 pt-3">
          <Palmtree className="pointer-events-none absolute -bottom-2 -right-2 h-20 w-20 text-white/5" />
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
            <p className="text-[11px] font-bold text-white">Ploria Wisata Aktif</p>
          </div>
          <p className="mt-0.5 text-[10px] text-blue-100">
            {profile.userName} • {profile.userRoleName}
          </p>

          <button
            type="button"
            onClick={onLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white/15 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-rose-500 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout Sesi
          </button>
        </div>
      </aside>
    </>
  );
}
