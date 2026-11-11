import { useEffect, useState } from 'react';
import {
  ChevronDown,
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
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const navConfig = rolesNavigation[currentRole];
  const profile = roleProfiles[currentRole];

  // Initialize all groups to open whenever role changes
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    navConfig.groups.forEach((g) => {
      initial[g.id] = true;
    });
    setExpandedGroups(initial);
  }, [currentRole, navConfig]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleSelect = (id: string, label: string) => {
    onSelect(id, label);
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

      {/* Solid Blue Background Sidebar - NO Gradient */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-80 flex-col overflow-hidden bg-[#286EF2] text-white shadow-2xl transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:translate-x-0 lg:shadow-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header with New Transparent Vector Logo */}
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

        {/* Static Role Indicator Badge */}
        <div className="px-4 pb-3">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-3 shadow-inner">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-100">
              <UserCheck className="h-3.5 w-3.5 text-white" />
              Role Pengguna Aktif
            </span>
            <p className="truncate text-xs font-extrabold text-white mt-0.5">
              {navConfig.roleTitle}
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="no-scrollbar flex-1 overflow-y-auto px-3.5 pb-6">
          <div className="space-y-3">
            {navConfig.groups.map((group) => {
              const isExpanded = expandedGroups[group.id] ?? true;
              const hasActiveChild = group.items.some((item) => item.id === activeId);
              const GroupIcon = group.icon;

              return (
                <div key={group.id} className="rounded-2xl bg-white/[0.08] p-1.5 ring-1 ring-white/10">
                  {/* Group header button */}
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
                      hasActiveChild ? 'text-white bg-white/15' : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <GroupIcon className="h-4 w-4 shrink-0 text-white" />
                    <span className="flex-1 text-left leading-snug">
                      <span className="text-blue-100 mr-1 font-semibold">{group.code}</span>
                      {group.title}
                    </span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 text-white/80 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Leaf items with High-Contrast Active State */}
                  {isExpanded && (
                    <ul className="mt-1 space-y-1 border-l border-white/20 ml-4 pl-2">
                      {group.items.map((leaf) => {
                        const active = leaf.id === activeId;
                        return (
                          <li key={leaf.id}>
                            <button
                              type="button"
                              onClick={() => handleSelect(leaf.id, leaf.label)}
                              aria-current={active ? 'page' : undefined}
                              className={`group flex w-full items-start gap-2.5 rounded-xl px-2.5 py-2 text-left text-xs transition-all duration-150 ${
                                active
                                  ? 'bg-white text-[#286EF2] font-extrabold shadow-md shadow-blue-950/25 ring-1 ring-white'
                                  : 'text-white hover:bg-white/15 hover:text-white font-medium'
                              }`}
                            >
                              <span
                                className={`shrink-0 font-mono text-[11px] ${
                                  active ? 'text-[#286EF2] font-black' : 'text-blue-100 font-bold'
                                }`}
                              >
                                {leaf.code}
                              </span>
                              <span
                                className={`flex-1 leading-snug ${
                                  active ? 'text-[#286EF2] font-extrabold' : 'text-white'
                                }`}
                              >
                                {leaf.label}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Footer Brand note & Logout Button */}
        <div className="relative mt-auto border-t border-white/15 px-5 pb-5 pt-3">
          <Palmtree className="absolute -bottom-2 -right-2 h-20 w-20 text-white/5 pointer-events-none" />
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
            <p className="text-[11px] font-bold text-white">Exploria Wisata Aktif</p>
          </div>
          <p className="mt-0.5 text-[10px] text-blue-100">
            {profile.userName} • {profile.userRoleName}
          </p>

          <button
            type="button"
            onClick={onLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white/15 px-3 py-2 text-xs font-bold text-white transition hover:bg-rose-500 hover:text-white shadow-sm"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout Sesi
          </button>
        </div>
      </aside>
    </>
  );
}
