import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import StatCard from '@/components/dashboard/StatCard';
import ActivityChart from '@/components/dashboard/ActivityChart';
import QuickMenu from '@/components/dashboard/QuickMenu';
import RecentActivities from '@/components/dashboard/RecentActivities';
import PromoCard from '@/components/dashboard/PromoCard';
import DailyRecapView from '@/components/dashboard/DailyRecapView';
import TicketsPage from '@/components/tickets/TicketsPage';
import TicketCategoriesView from '@/components/tickets/TicketCategoriesView';
import ReportsView from '@/components/reports/ReportsView';
import DestinationProfileView from '@/components/destination/DestinationProfileView';
import ReviewsView from '@/components/reviews/ReviewsView';
import StaffManagementView from '@/components/staff/StaffManagementView';
import BookingCalendarView from '@/components/calendar/BookingCalendarView';
import LoginPage from '@/components/auth/LoginPage';

import { statItems, type StatItem } from '@/data/dashboardData';
import { seedBookings } from '@/data/seedBookings';
import { ticketCategories } from '@/data/ticketCategories';
import { roleProfiles } from '@/data/rolesNavData';
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
import type { Booking, BookingDraft, TicketCategory, ValidationResult } from '@/types/ticket';

const TOAST_DURATION_MS = 2800;
const ROLE_STORAGE_KEY = 'exploria_active_role';

type Toast = { id: number; message: string };

function App() {
  // State Login Dummy: check localStorage or start as null (LoginPage)
  const [currentRole, setCurrentRole] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem(ROLE_STORAGE_KEY);
    if (saved === 'pengelola' || saved === 'admin' || saved === 'kasir') {
      return saved as UserRole;
    }
    return null;
  });

  const [activeNav, setActiveNav] = useState<string>(() => {
    const saved = localStorage.getItem(ROLE_STORAGE_KEY);
    if (saved === 'pengelola') return 'mo-dash-stats';
    if (saved === 'admin') return 'admin-dash-stats';
    if (saved === 'kasir') return 'kasir-dash-stats';
    return 'mo-dash-stats';
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState<Toast | null>(null);

  // Core Data States
  const [bookings, setBookings] = useState<Booking[]>(seedBookings);
  const [categories, setCategories] = useState<TicketCategory[]>(ticketCategories);
  const [staffList, setStaffList] = useState(initialStaffMembers);
  const [expenses, setExpenses] = useState(initialOperationalExpenses);
  const [revenueShares] = useState(initialRevenueShare);
  const [categoryStats] = useState(initialVisitorCategoryStats);
  const [destinationInfo, setDestinationInfo] = useState(initialDestinationInfo);
  const [reviews, setReviews] = useState(initialReviews);

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
    if (role === 'pengelola') setActiveNav('mo-dash-stats');
    else if (role === 'admin') setActiveNav('admin-dash-stats');
    else if (role === 'kasir') setActiveNav('kasir-dash-stats');
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

  // Booking handlers
  const handleCreateBooking = (draft: BookingDraft): Booking => {
    const booking = createBooking(draft, categories, bookings, new Date());
    setBookings((current) => [booking, ...current]);
    showToast(`Tiket #${booking.code} berhasil dipesan!`);
    return booking;
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
            className="animate-fade-in-up fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2.5 rounded-2xl bg-ocean-950 px-5 py-3 text-sm font-medium text-white shadow-2xl ring-1 ring-white/10"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{toast.message}</span>
          </div>
        )}
      </>
    );
  }

  // Determine which view to render based on activeNav
  const renderMainContent = () => {
    // 1. DASHBOARD VIEWS
    if (
      activeNav === 'mo-dash-stats' ||
      activeNav === 'admin-dash-stats' ||
      activeNav === 'kasir-dash-stats' ||
      activeNav === 'dashboard'
    ) {
      return (
        <>
          <WelcomeBanner />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
            {stats.map((item, index) => (
              <StatCard key={item.id} item={item} delay={index * 80} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ActivityChart />
            </div>
            <QuickMenu currentRole={currentRole} onSelect={handleNavSelect} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RecentActivities items={activities} query={query} />
            <PromoCard
              onExplore={() => {
                if (currentRole === 'pengelola') handleNavSelect('mo-tiket-sales');
                else if (currentRole === 'admin') handleNavSelect('admin-tiket-manage');
                else handleNavSelect('kasir-tiket-sales');
              }}
            />
          </div>
        </>
      );
    }

    if (activeNav === 'admin-dash-rekap') {
      return <DailyRecapView bookings={bookings} onToast={showToast} />;
    }

    if (activeNav === 'kasir-dash-calendar') {
      return <BookingCalendarView bookings={bookings} />;
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
    if (activeNav === 'mo-tiket-categories') {
      return (
        <TicketCategoriesView
          categories={categories}
          onUpdateCategories={setCategories}
          onToast={showToast}
        />
      );
    }

    if (
      activeNav === 'mo-tiket-sales' ||
      activeNav === 'admin-tiket-manage' ||
      activeNav === 'kasir-tiket-sales' ||
      activeNav === 'tiket'
    ) {
      return (
        <TicketsPage
          bookings={bookings}
          onCreate={handleCreateBooking}
          onValidate={handleValidateTicket}
          initialTab="pesan"
        />
      );
    }

    if (activeNav === 'mo-tiket-validate' || activeNav === 'kasir-tiket-validate') {
      return (
        <TicketsPage
          bookings={bookings}
          onCreate={handleCreateBooking}
          onValidate={handleValidateTicket}
          initialTab="validasi"
        />
      );
    }

    if (activeNav === 'admin-tiket-history' || activeNav === 'kasir-tiket-history') {
      return (
        <TicketsPage
          bookings={bookings}
          onCreate={handleCreateBooking}
          onValidate={handleValidateTicket}
          initialTab="riwayat"
        />
      );
    }

    // 3. MANAJEMEN DATA PENGUNJUNG DAN LAPORAN
    if (
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

    if (activeNav === 'admin-report-expenses') {
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

    if (activeNav === 'admin-report-tickets') {
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
    if (activeNav === 'mo-dest-profile' || activeNav === 'admin-dest-info') {
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
      activeNav === 'mo-reviews-view' ||
      activeNav === 'mo-reviews-reply' ||
      activeNav === 'admin-dest-reviews' ||
      activeNav === 'admin-dest-reply'
    ) {
      const isReplyOnly =
        activeNav === 'mo-reviews-reply' || activeNav === 'admin-dest-reply';
      return (
        <ReviewsView
          reviews={reviews}
          onReplyReview={handleReplyReview}
          currentUser={{
            name: roleProfiles[currentRole].userName,
            role: roleProfiles[currentRole].userRoleName,
          }}
          onToast={showToast}
          filterOnlyUnreplied={isReplyOnly}
        />
      );
    }

    // 6. MANAJEMEN AKUN
    if (activeNav === 'mo-staff-accounts') {
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
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        currentRole={currentRole}
        activeId={activeNav}
        onSelect={handleNavSelect}
        onLogout={handleLogout}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          currentRole={currentRole}
          query={query}
          onQueryChange={setQuery}
          onOpenMenu={() => setMenuOpen(true)}
          onLogout={handleLogout}
          bookings={bookings}
          onNavSelect={handleNavSelect}
        />

        <main className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
          {renderMainContent()}
        </main>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          key={toast.id}
          role="status"
          className="animate-fade-in-up fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2.5 rounded-2xl bg-ocean-950 px-5 py-3 text-sm font-medium text-white shadow-2xl ring-1 ring-white/10"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default App;
