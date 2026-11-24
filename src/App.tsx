import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import StatCard from '@/components/dashboard/StatCard';
import ActivityChart from '@/components/dashboard/ActivityChart';
import MiniCalendar from '@/components/dashboard/MiniCalendar';
import RecentActivities from '@/components/dashboard/RecentActivities';
import DailyRecapView from '@/components/dashboard/DailyRecapView';
import TicketsPage from '@/components/tickets/TicketsPage';
import TicketCategoriesView from '@/components/tickets/TicketCategoriesView';
import ReportsView from '@/components/reports/ReportsView';
import DestinationProfileView from '@/components/destination/DestinationProfileView';
import ReviewsView from '@/components/reviews/ReviewsView';
import StaffManagementView from '@/components/staff/StaffManagementView';
import BookingCalendarView from '@/components/calendar/BookingCalendarView';
import LoginPage from '@/components/auth/LoginPage';
import SuperAdminPortal from '@/components/super-admin/SuperAdminPortal';
import ProfilePage from '@/components/profile/ProfilePage';
import BugReportPage from '@/components/bug-report/BugReportPage';
import { useSessionProfile } from '@/lib/profile';

import { statItems, type StatItem } from '@/data/dashboardData';
import { seedBookings } from '@/data/seedBookings';
import { ticketCategories } from '@/data/ticketCategories';
import { initialTicketItems } from '@/data/ticketItems';
import { BUG_NAV_ID, PROFILE_NAV_ID, roleProfiles } from '@/data/rolesNavData';
import {
  initialDestinationInfo,
  initialOperationalExpenses,
  initialRevenueShare,
  initialReviews,
  initialStaffMembers,
  initialVisitorCategoryStats,
} from '@/data/mockData';
import {
  buildActivityItems,
  countTickets,
  countValidatedTickets,
  createBooking,
  formatNumber,
  formatRupiah,
  sumRevenue,
  validateTicketCode,
} from '@/lib/bookings';
import type { UserRole } from '@/types/roles';
import type { mendatang, BookingDraft, TicketCategory, TicketItem, ValidationResult } from '@/types/ticket';

const TOAST_DURATION_MS = 2800;
const ROLE_STORAGE_KEY = 'ePloria_active_role';

type Toast = { id: number; message: string };

function App() {
  // State Login Dummy: check localStorage or start as null (LoginPage)
  const [currentRole, setCurrentRole] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem(ROLE_STORAGE_KEY);
    if (saved === 'Manajer' || saved === 'admin' || saved === 'kasir' || saved === 'superadmin') {
      return saved as UserRole;
    }
    return null;
  });

  const [activeNav, setActiveNav] = useState<string>(() => {
    const saved = localStorage.getItem(ROLE_STORAGE_KEY);
    if (saved === 'Manajer') return 'mo-dash';
    if (saved === 'admin') return 'admin-dash';
    if (saved === 'kasir') return 'kasir-dash';
    if (saved === 'superadmin') return 'validasi-mitra';
    return 'mo-dash';
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState<Toast | null>(null);

  // Core Data States
  const [bookings, setBookings] = useState<mendatang[]>(seedBookings);
  const [categories, setCategories] = useState<TicketCategory[]>(ticketCategories);
  const [tickets, setTickets] = useState<TicketItem[]>(initialTicketItems);
  const [staffList, setStaffList] = useState(initialStaffMembers);
  const [expenses, setExpenses] = useState(initialOperationalExpenses);
  const [revenueShares] = useState(initialRevenueShare);
  const [categoryStats] = useState(initialVisitorCategoryStats);
  const [destinationInfo, setDestinationInfo] = useState(initialDestinationInfo);
  const [reviews, setReviews] = useState(initialReviews);

  // Profil sesi (default + perubahan dari modal "Profil Saya")
  const sessionProfile = useSessionProfile(currentRole);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (message: string) => setToast({ id: Date.now(), message });

  // Handle Login from LoginPage
  const handleLogin = (role: UserRole) => {
    setCurrentRole(role);
    localStorage.setItem(ROLE_STORAGE_KEY, role);
    if (role === 'Manajer') setActiveNav('mo-dash');
    else if (role === 'admin') setActiveNav('admin-dash');
    else if (role === 'kasir') setActiveNav('kasir-dash');
    else if (role === 'superadmin') setActiveNav('validasi-mitra');
    showToast(`Berhasil login sebagai ${roleProfiles[role].title}`);
  };

  // Handle Logout to return to LoginPage
  const handleLogout = () => {
    localStorage.removeItem(ROLE_STORAGE_KEY);
    setCurrentRole(null);
    setActiveNav('');
    showToast('Anda telah logout dari sesi.');
  };

  // Handle Navigation Selection
  const handleNavSelect = (id: string) => {
    setActiveNav(id);
  };

  // Buka halaman "Profil Saya" / "Laporkan Bug" sesuai role yang sedang login
  const openProfile = () => {
    setMenuOpen(false);
    if (currentRole && currentRole !== 'superadmin') handleNavSelect(PROFILE_NAV_ID[currentRole]);
  };
  const openBugReport = () => {
    setMenuOpen(false);
    if (currentRole && currentRole !== 'superadmin') handleNavSelect(BUG_NAV_ID[currentRole]);
  };

  // Stats calculation
  const stats = useMemo<StatItem[]>(
    () =>
      statItems.map((item) => {
        if (item.id === 'tickets') return { ...item, value: formatNumber(countTickets(bookings)) };
        if (item.id === 'validated') return { ...item, value: formatNumber(countValidatedTickets(bookings)) };
        if (item.id === 'visitors') return { ...item, value: formatNumber(countTickets(bookings) + 1200) };
        if (item.id === 'revenue') return { ...item, value: formatRupiah(sumRevenue(bookings)) };
        return item;
      }),
    [bookings]
  );

  const activities = useMemo(() => buildActivityItems(bookings, new Date()), [bookings]);

  // mendatang handlers
  const handleCreateBooking = (draft: BookingDraft): mendatang => {
    const mendatang = createBooking(
      draft,
      categories,
      bookings,
      new Date(),
      sessionProfile?.userName ?? 'Kasir Loket'
    );
    setBookings((current) => [mendatang, ...current]);
    showToast(`Tiket #${mendatang.code} berhasil dipesan!`);
    return mendatang;
  };

  const handleValidateTicket = (code: string): ValidationResult => {
    const { result, bookings: next } = validateTicketCode(bookings, code, new Date());
    if (result.kind === 'valid') {
      setBookings(next);
      showToast(`Tiket #${code} valid! Pengunjung dipersilakan masuk.`);
    }
    return result;
  };

  // Review Reply Handler
  const handleReplyReview = (
    reviewId: string,
    replyMessage: string,
    authorName: string,
    authorRole: string
  ) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
            ...r,
            reply: {
              author: authorName,
              role: authorRole,
              message: replyMessage,
              date: new Date().toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }),
            },
          }
          : r
      )
    );
  };

  // If user is not logged in, render LoginPage
  if (!currentRole) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        {toast && (
          <div
            key={toast.id}
            role="status"
            className="animate-fade-in-up fixed top-16 left-1/2 lg:left-[36%] z-[60] flex -translate-x-1/2 items-center gap-3.5 rounded-2xl bg-ocean-950 px-8 py-5 text-lg font-medium shadow-2xl ring-1 ring-white/10"
          >
            <CheckCircle2 className={`h-6 w-6 shrink-0 ${toast.message.toLowerCase().includes('logout') ? 'text-blue-400' : 'text-emerald-400'}`} />
            <span className={toast.message.toLowerCase().includes('logout') ? 'text-blue-400 text-lg font-semibold' : 'text-white'}>
              {toast.message}
            </span>
          </div>
        )}
      </>
    );
  }

  // KHUSUS ROLE SUPER ADMIN: Route & Layout Terisolasi Penuh (ADD-ONLY)
  if (currentRole === 'superadmin') {
    return (
      <>
        <SuperAdminPortal onLogout={handleLogout} />
        {toast && (
          <div
            key={toast.id}
            role="status"
            className="animate-fade-in-up fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2.5 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium shadow-2xl ring-1 ring-white/10"
          >
            <CheckCircle2 className={`h-4 w-4 shrink-0 ${toast.message.toLowerCase().includes('logout') ? 'text-blue-400' : 'text-emerald-400'}`} />
            <span className={toast.message.toLowerCase().includes('logout') ? 'text-blue-400 font-semibold' : 'text-white'}>
              {toast.message}
            </span>
          </div>
        )}
      </>
    );
  }

  // Determine which view to render based on activeNav
  const renderMainContent = () => {
    // 0. PROFIL SAYA (halaman dalam dashboard, bukan popup)
    if (activeNav === PROFILE_NAV_ID[currentRole]) {
      return <ProfilePage role={currentRole} onToast={showToast} />;
    }

    // 0b. LAPORKAN BUG (halaman dalam dashboard, bukan popup)
    if (activeNav === BUG_NAV_ID[currentRole]) {
      return <BugReportPage role={currentRole} onToast={showToast} />;
    }

    // 1. DASHBOARD VIEWS
    if (
      activeNav === 'mo-dash' ||
      activeNav === 'admin-dash' ||
      activeNav === 'kasir-dash' ||
      activeNav === 'mo-dash-stats' ||
      activeNav === 'admin-dash-stats' ||
      activeNav === 'kasir-dash-stats' ||
      activeNav === 'kasir-dash-overview' ||
      activeNav === 'dashboard'
    ) {
      return (
        <>
          {/* Dashboard Header Title */}
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900 sm:text-3xl tracking-tight">
                Dashboard Overview
              </h1>
              <p className="text-sm text-slate-500">
                Ringkasan statistik pengunjung, transaksi penjualan tiket, dan operasional wisata.
              </p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm border border-slate-200/80">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sistem Operasional Aktif</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
            {stats.map((item, index) => (
              <StatCard key={item.id} item={item} delay={index * 80} />
            ))}
          </div>

          {/* Side-by-Side Flex/Grid Container: Ringkasan Aktivitas (Kiri) & Kalender mendatang (Kanan) */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch w-full">
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
              <ActivityChart />
            </div>
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
              <MiniCalendar bookings={bookings} />
            </div>
          </div>

          {/* Aktivitas Terbaru: Full-Width (100%) meregang mengisi seluruh area bawah */}
          <div className="w-full">
            <RecentActivities items={activities} query={query} />
          </div>
        </>
      );
    }

    if (activeNav === 'kasir-dash-calendar' || activeNav === 'kasir-calendar') {
      // Pembatasan hak akses: Hanya Kasir yang dapat mengakses modul kalender ini
      if (currentRole === 'kasir') {
        return <BookingCalendarView bookings={bookings} />;
      }
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-base font-bold text-slate-700">Akses modul kalender hanya tersedia untuk role Kasir.</p>
        </div>
      );
    }

    if (activeNav === 'mo-dash-sales') {
      return (
        <ReportsView
          activeTab="tickets"
          bookings={bookings}
          categoryStats={categoryStats}
          revenueShares={revenueShares}
          expenses={expenses}
          onUpdateExpenses={setExpenses}
          onToast={showToast}
        />
      );
    }

    // 2. MANAJEMEN TIKET DAN TRANSAKSI
    // A. Mengelola Tiket (Daftar & Form Buat Jenis Tiket) - Hak Akses Manajer / Admin
    if (
      activeNav === 'mo-tiket' ||
      activeNav === 'admin-tiket' ||
      activeNav === 'mo-tiket-manage' ||
      activeNav === 'admin-tiket-manage'
    ) {
      return (
        <TicketsPage
          bookings={bookings}
          tickets={tickets}
          categories={categories}
          onCreate={handleCreateBooking}
          onValidate={handleValidateTicket}
          onUpdateTickets={setTickets}
          onUpdateCategories={setCategories}
          onToast={showToast}
          initialTab="kelola-tiket"
          currentRole={currentRole}
          cashierName={sessionProfile?.userName ?? 'Kasir Loket'}
        />
      );
    }

    // B. Mengelola Kategori Tiket
    if (activeNav === 'mo-tiket-categories' || activeNav === 'admin-tiket-categories') {
      return (
        <TicketsPage
          bookings={bookings}
          tickets={tickets}
          categories={categories}
          onCreate={handleCreateBooking}
          onValidate={handleValidateTicket}
          onUpdateTickets={setTickets}
          onUpdateCategories={setCategories}
          onToast={showToast}
          initialTab="kategori"
          currentRole={currentRole}
          cashierName={sessionProfile?.userName ?? 'Kasir Loket'}
        />
      );
    }

    // Penjualan Tiket (Kasir / Loket Transaksi)
    if (
      activeNav === 'kasir-tiket' ||
      activeNav === 'kasir-tiket-sales' ||
      activeNav === 'mo-tiket-sales' ||
      activeNav === 'admin-tiket-sales' ||
      activeNav === 'tiket'
    ) {
      return (
        <TicketsPage
          bookings={bookings}
          tickets={tickets}
          categories={categories}
          onCreate={handleCreateBooking}
          onValidate={handleValidateTicket}
          onUpdateTickets={setTickets}
          onUpdateCategories={setCategories}
          onToast={showToast}
          initialTab="pesan"
          currentRole={currentRole}
          cashierName={sessionProfile?.userName ?? 'Kasir Loket'}
        />
      );
    }

    // Validasi Tiket (Gerbang Masuk)
    if (
      activeNav === 'kasir-tiket-validate' ||
      activeNav === 'mo-tiket-validate' ||
      activeNav === 'admin-tiket-validate'
    ) {
      return (
        <TicketsPage
          bookings={bookings}
          tickets={tickets}
          categories={categories}
          onCreate={handleCreateBooking}
          onValidate={handleValidateTicket}
          onUpdateTickets={setTickets}
          onUpdateCategories={setCategories}
          onToast={showToast}
          initialTab="validasi"
          currentRole={currentRole}
          cashierName={sessionProfile?.userName ?? 'Kasir Loket'}
        />
      );
    }

    // Rekap & Close Order (Kasir: Laporan Keuangan & Rekapan)
    if (
      activeNav === 'kasir-dash-rekap' ||
      activeNav === 'admin-dash-rekap' ||
      activeNav === 'mo-tiket-closeorder' ||
      activeNav === 'admin-tiket-closeorder'
    ) {
      return (
        <TicketsPage
          bookings={bookings}
          tickets={tickets}
          categories={categories}
          onCreate={handleCreateBooking}
          onValidate={handleValidateTicket}
          onUpdateTickets={setTickets}
          onUpdateCategories={setCategories}
          onToast={showToast}
          initialTab="rekap-close-order"
          currentRole={currentRole}
          cashierName={sessionProfile?.userName ?? 'Kasir Loket'}
        />
      );
    }

    // Riwayat Penjualan
    if (
      activeNav === 'admin-tiket-history' ||
      activeNav === 'kasir-tiket-history' ||
      activeNav === 'mo-tiket-history'
    ) {
      return (
        <TicketsPage
          bookings={bookings}
          tickets={tickets}
          categories={categories}
          onCreate={handleCreateBooking}
          onValidate={handleValidateTicket}
          onUpdateTickets={setTickets}
          onUpdateCategories={setCategories}
          onToast={showToast}
          initialTab="riwayat"
          currentRole={currentRole}
          cashierName={sessionProfile?.userName ?? 'Kasir Loket'}
        />
      );
    }

    // 3. MANAJEMEN DATA PENGUNJUNG DAN LAPORAN (Menu Tunggal Langsung)
    if (
      activeNav === 'mo-laporan' ||
      activeNav === 'admin-laporan' ||
      activeNav === 'mo-report-visitors-cat' ||
      activeNav === 'admin-report-visitors-cat'
    ) {
      return (
        <ReportsView
          activeTab="visitors-cat"
          bookings={bookings}
          categoryStats={categoryStats}
          revenueShares={revenueShares}
          expenses={expenses}
          onUpdateExpenses={setExpenses}
          onToast={showToast}
        />
      );
    }

    if (activeNav === 'mo-report-finance' || activeNav === 'admin-report-finance') {
      return (
        <ReportsView
          activeTab="finance"
          bookings={bookings}
          categoryStats={categoryStats}
          revenueShares={revenueShares}
          expenses={expenses}
          onUpdateExpenses={setExpenses}
          onToast={showToast}
        />
      );
    }

    if (activeNav === 'mo-report-print' || activeNav === 'admin-report-print') {
      return (
        <ReportsView
          activeTab="print"
          bookings={bookings}
          categoryStats={categoryStats}
          revenueShares={revenueShares}
          expenses={expenses}
          onUpdateExpenses={setExpenses}
          onToast={showToast}
        />
      );
    }

    if (activeNav === 'mo-report-revenue-sharing') {
      return (
        <ReportsView
          activeTab="revenue-sharing"
          bookings={bookings}
          categoryStats={categoryStats}
          revenueShares={revenueShares}
          expenses={expenses}
          onUpdateExpenses={setExpenses}
          onToast={showToast}
        />
      );
    }

    if (activeNav === 'admin-report-expenses' || activeNav === 'mo-report-expenses') {
      return (
        <ReportsView
          activeTab="expenses"
          bookings={bookings}
          categoryStats={categoryStats}
          revenueShares={revenueShares}
          expenses={expenses}
          onUpdateExpenses={setExpenses}
          onToast={showToast}
        />
      );
    }

    if (activeNav === 'admin-report-tickets' || activeNav === 'mo-report-tickets') {
      return (
        <ReportsView
          activeTab="tickets"
          bookings={bookings}
          categoryStats={categoryStats}
          revenueShares={revenueShares}
          expenses={expenses}
          onUpdateExpenses={setExpenses}
          onToast={showToast}
        />
      );
    }

    // 4. MANAJEMEN INFORMASI DESTINASI
    if (
      activeNav === 'mo-destinasi' ||
      activeNav === 'admin-destinasi' ||
      activeNav === 'mo-dest-profile' ||
      activeNav === 'admin-dest-info' ||
      activeNav === 'mo-dest-gallery' ||
      activeNav === 'admin-dest-gallery'
    ) {
      return (
        <DestinationProfileView
          initialData={destinationInfo}
          onSave={setDestinationInfo}
          onToast={showToast}
        />
      );
    }

    // 5. MANAJEMEN ULASAN DAN PENGADUAN
    if (
      activeNav === 'mo-ulasan' ||
      activeNav === 'mo-reviews-view' ||
      activeNav === 'mo-reviews-reply' ||
      activeNav === 'admin-dest-reviews' ||
      activeNav === 'admin-reviews-view' ||
      activeNav === 'admin-dest-reply'
    ) {
      const isReplyOnly =
        activeNav === 'mo-reviews-reply' || activeNav === 'admin-dest-reply';
      return (
        <ReviewsView
          reviews={reviews}
          onReplyReview={handleReplyReview}
          currentUser={{
            name: sessionProfile?.userName ?? 'Staf Manajer',
            role: sessionProfile?.userRoleName ?? 'Manajer',
          }}
          onToast={showToast}
          filterOnlyUnreplied={isReplyOnly}
        />
      );
    }

    // 6. MANAJEMEN AKUN
    if (activeNav === 'mo-akun' || activeNav === 'mo-staff-accounts') {
      return (
        <StaffManagementView
          staffList={staffList}
          onUpdateStaff={setStaffList}
          onToast={showToast}
        />
      );
    }

    // Fallback: Dashboard
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-base font-bold text-slate-700">Memuat halaman...</p>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#E8F3FF] via-[#FBF3EB] to-[#FFE8D4] print:bg-white print:block">
      <Sidebar
        currentRole={currentRole}
        activeId={activeNav}
        onSelect={handleNavSelect}
        onLogout={handleLogout}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        collapsed={sidebarCollapsed}
      />

      <div className="flex min-w-0 flex-1 flex-col print:block print:w-full print:p-0">
        <Header
          currentRole={currentRole}
          query={query}
          onQueryChange={setQuery}
          onOpenMenu={() => setMenuOpen(true)}
          onOpenProfile={openProfile}
          onOpenBugReport={openBugReport}
          onLogout={handleLogout}
          bookings={bookings}
          onNavSelect={handleNavSelect}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((c) => !c)}
        />

        <main className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 print:block print:p-0 print:m-0 print:gap-0">
          {renderMainContent()}
        </main>
      </div>


      {/* Toast Notification */}
      {toast && (
        <div
          key={toast.id}
          role="status"
          className="animate-fade-in-up fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2.5 rounded-2xl bg-ocean-950 px-5 py-3 text-sm font-medium shadow-2xl ring-1 ring-white/10 print:hidden"
        >
          <CheckCircle2 className={`h-4 w-4 shrink-0 ${toast.message.toLowerCase().includes('logout') ? 'text-blue-400' : 'text-emerald-400'}`} />
          <span className={toast.message.toLowerCase().includes('logout') ? 'text-blue-400 font-semibold' : 'text-white'}>
            {toast.message}
          </span>
        </div>
      )}
    </div>
  );
}

export default App;
