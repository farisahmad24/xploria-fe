import React, { useState } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar — satu-satunya kontrol navigasi */}
      <SuperAdminSidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        pendingCount={pendingCount}
        onLogout={onLogout}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenMenu={() => setMenuOpen(true)}
      />

      {/* Konten Utama — tanpa navbar */}
      <div className="flex flex-1 flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
