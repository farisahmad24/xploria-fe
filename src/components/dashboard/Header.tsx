import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell,
  Bug,
  CalendarCheck,
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  User,
  Users,
  X,
} from 'lucide-react';
import SlantedTicket from '@/components/common/SlantedTicket';
import ProfileAvatar from '@/components/common/ProfileAvatar';
import { rolesNavigation } from '@/data/rolesNavData';
import { useSessionProfile } from '@/lib/profile';
import type { UserRole } from '@/types/roles';
import type { mendatang } from '@/types/ticket';

type HeaderProps = {
  currentRole: UserRole;
  query: string;
  onQueryChange: (value: string) => void;
  onOpenMenu: () => void;
  onOpenProfile: () => void;
  onOpenBugReport: () => void;
  onLogout: () => void;
  bookings?: mendatang[];
  onNavSelect?: (id: string) => void;
};

// ─── Notification data ────────────────────────────────────────────
const notifications = [
  { id: 'n1', icon: SlantedTicket, text: 'Tiket baru #TK-20261108-001 telah dibuat', time: '2 menit lalu' },
  { id: 'n2', icon: CalendarCheck, text: 'mendatang rombongan 25 orang menunggu konfirmasi', time: '20 menit lalu' },
];

// ─── Search result types ───────────────────────────────────────────
type SearchResult =
  | { kind: 'menu'; id: string; groupTitle: string; label: string }
  | { kind: 'mendatang'; id: string; code: string; visitorName: string; status: string };

// Map nav group icon by parent group id segment
const GROUP_ICON_MAP: Record<string, any> = {
  dash: LayoutDashboard,
  tiket: SlantedTicket,
  laporan: FileText,
  destinasi: FileText,
  ulasan: FileText,
  akun: Users,
  report: FileText,
  reviews: FileText,
  dest: FileText,
  staff: Users,
};

function iconForId(id: string) {
  const segment = id.split('-')[1] ?? '';
  return GROUP_ICON_MAP[segment] ?? Search;
}

// ─── Highlight matching text ───────────────────────────────────────
function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-blue-100 text-[#286EF2] rounded px-0.5 font-bold not-italic">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

const STATUS_BADGE: Record<string, string> = {
  validated: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-slate-100 text-slate-500',
};
const STATUS_LABEL: Record<string, string> = {
  validated: 'Tervalidasi',
  pending: 'Menunggu',
  cancelled: 'Dibatalkan',
};

// ─── Component ────────────────────────────────────────────────────
export default function Header({
  currentRole,
  query,
  onQueryChange,
  onOpenMenu,
  onOpenProfile,
  onOpenBugReport,
  onLogout,
  bookings = [],
  onNavSelect,
}: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unread, setUnread] = useState(notifications.length);
  const [searchFocused, setSearchFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const profile = useSessionProfile(currentRole);

  // ── Build search results ──────────────────────────────────────────
  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 1) return [];

    const out: SearchResult[] = [];

    // 1. Menu items from sidebar nav for current role
    const navConfig = rolesNavigation[currentRole];
    for (const group of navConfig.groups) {
      if (!group.items || group.items.length === 0) {
        if (group.title.toLowerCase().includes(q)) {
          out.push({
            kind: 'menu',
            id: group.id,
            groupTitle: 'Menu Utama',
            label: group.title,
          });
        }
      } else {
        for (const item of group.items) {
          if (
            item.label.toLowerCase().includes(q) ||
            group.title.toLowerCase().includes(q)
          ) {
            out.push({
              kind: 'menu',
              id: item.id,
              groupTitle: group.title,
              label: item.label,
            });
          }
        }
      }
    }

    // 2. Bookings: search by code or visitor name
    let bookingCount = 0;
    for (const b of bookings) {
      if (bookingCount >= 5) break;
      if (
        b.code.toLowerCase().includes(q) ||
        b.visitorName.toLowerCase().includes(q)
      ) {
        out.push({
          kind: 'mendatang',
          id: b.id,
          code: b.code,
          visitorName: b.visitorName,
          status: b.status,
        });
        bookingCount++;
      }
    }

    return out.slice(0, 10);
  }, [query, currentRole, bookings]);

  // ── Close on outside click ────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Close on Escape ───────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchFocused(false);
        onQueryChange('');
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onQueryChange]);

  const handleResultClick = (result: SearchResult) => {
    if (result.kind === 'menu' && onNavSelect) {
      onNavSelect(result.id);
    } else if (result.kind === 'mendatang' && onNavSelect) {
      if (currentRole === 'admin') onNavSelect('admin-tiket-history');
      else if (currentRole === 'kasir') onNavSelect('kasir-tiket-history');
      else onNavSelect('mo-tiket-sales');
    }
    setSearchFocused(false);
    onQueryChange('');
  };

  const showDropdown = searchFocused && query.trim().length > 0;
  const menuResults = results.filter(
    (r): r is Extract<SearchResult, { kind: 'menu' }> => r.kind === 'menu'
  );
  const bookingResults = results.filter(
    (r): r is Extract<SearchResult, { kind: 'mendatang' }> => r.kind === 'mendatang'
  );

  return (
    <header className="sticky top-0 z-30 border-b border-ocean-100/80 bg-white/90 backdrop-blur-md print:hidden">
      <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={onOpenMenu}
          className="rounded-xl p-2 text-ocean-800 transition hover:bg-ocean-50 lg:hidden"
          aria-label="Buka menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* ── Search Bar ── */}
        <div className="relative w-full max-w-md">
          <label className="group relative flex w-full items-center">
            <Search className="pointer-events-none absolute left-4 h-[18px] w-[18px] text-ocean-400 transition-colors group-focus-within:text-[#286EF2]" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Cari menu, tiket, atau nama pengunjung..."
              className="w-full rounded-full border border-ocean-100 bg-ocean-50/70 py-2.5 pl-11 pr-10 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 transition focus:border-[#286EF2] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={() => { onQueryChange(''); inputRef.current?.focus(); }}
                className="absolute right-3 rounded-full p-0.5 text-slate-400 hover:text-slate-700 transition"
                aria-label="Hapus pencarian"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </label>

          {/* ── Dropdown ── */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl shadow-slate-200/70"
            >
              {results.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-slate-400">
                  <Search className="h-8 w-8 opacity-30" />
                  <p className="text-sm font-medium">
                    Tidak ada hasil untuk &ldquo;{query}&rdquo;
                  </p>
                </div>
              ) : (
                <>
                  {/* Menu results */}
                  {menuResults.length > 0 && (
                    <div>
                      <p className="px-4 pb-1 pt-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Menu &amp; Fitur
                      </p>
                      {menuResults.map((r) => {
                        const Icon = iconForId(r.id);
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onMouseDown={() => handleResultClick(r)}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-blue-50"
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#286EF2]/10 text-[#286EF2]">
                              <Icon className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-800">
                                <Highlight text={r.label} q={query} />
                              </p>
                              <p className="text-[11px] text-slate-400">{r.groupTitle}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* mendatang results */}
                  {bookingResults.length > 0 && (
                    <div className={menuResults.length > 0 ? 'border-t border-slate-50' : ''}>
                      <p className="px-4 pb-1 pt-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Data Tiket / mendatang
                      </p>
                      {bookingResults.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onMouseDown={() => handleResultClick(r)}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-blue-50"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                            <SlantedTicket className="h-4 w-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-800">
                              <Highlight text={r.visitorName} q={query} />
                            </p>
                            <p className="text-[11px] text-slate-400">
                              <Highlight text={r.code} q={query} />
                            </p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_BADGE[r.status] ?? 'bg-slate-100 text-slate-600'}`}
                          >
                            {STATUS_LABEL[r.status] ?? r.status}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="border-t border-slate-50 px-4 py-2">
                    <p className="text-[11px] text-slate-400">
                      {results.length} hasil &middot; tekan{' '}
                      <kbd className="rounded bg-slate-100 px-1 font-mono text-[10px]">Esc</kbd>{' '}
                      untuk tutup
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right side items */}
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setNotifOpen((o) => !o); setUnread(0); }}
              className="relative rounded-full p-2.5 text-ocean-700 transition hover:bg-ocean-50"
              aria-label="Notifikasi"
              aria-expanded={notifOpen}
            >
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white ring-2 ring-white">
                  {unread}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="animate-fade-in-up absolute right-0 top-12 w-80 overflow-hidden rounded-2xl border border-ocean-100 bg-white shadow-card">
                <div className="border-b border-ocean-50 px-4 py-3">
                  <p className="text-sm font-bold text-ocean-900">Notifikasi</p>
                </div>
                <ul>
                  {notifications.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.id} className="flex gap-3 px-4 py-3 transition hover:bg-ocean-50/60">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ocean-50 text-ocean-600">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-700">{item.text}</p>
                          <p className="mt-0.5 text-xs text-slate-400">{item.time}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 rounded-full p-1 transition hover:bg-ocean-50 sm:pl-2 sm:pr-3"
            >
              <ProfileAvatar initials={profile.avatarText} imageUrl={profile.avatarDataUrl} />
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
                <div className="space-y-0.5 pt-1.5">
                  <button
                    type="button"
                    onClick={() => { setProfileOpen(false); onOpenProfile(); }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <User className="h-4 w-4 text-slate-500" />
                    Profil Saya
                  </button>
                  <button
                    type="button"
                    onClick={() => { setProfileOpen(false); onOpenBugReport(); }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Bug className="h-4 w-4 text-slate-500" />
                    Laporkan Kendala
                  </button>
                  <div className="my-1 border-t border-slate-100" />
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
  );
}
