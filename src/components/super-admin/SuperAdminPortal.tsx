import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { initialMitraAccounts, initialAuditLogs } from '../../data/seedSuperAdmin';
import { MitraAccount, AuditLogEntry, SuperAdminTab } from '../../types/superAdmin';
import { SuperAdminLayout } from './SuperAdminLayout';
import { MitraValidationView } from './MitraValidationView';
import { AuditLogView } from './AuditLogView';
import { MitraInspectionDrawer } from './MitraInspectionDrawer';
import { NewMitraModal } from './NewMitraModal';
import BugReportsAdminView from '@/components/bug-report/BugReportsAdminView';
import ProfilePage from '@/components/profile/ProfilePage';
import { useBugReports } from '@/lib/bugReports';
import { useSessionProfile } from '@/lib/profile';

interface SuperAdminPortalProps {
  onLogout: () => void;
}

export const SuperAdminPortal: React.FC<SuperAdminPortalProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<SuperAdminTab>('validasi-mitra');
  const [mitraList, setMitraList] = useState<MitraAccount[]>(initialMitraAccounts);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);
  const [selectedMitra, setSelectedMitra] = useState<MitraAccount | null>(null);
  const [isNewMitraModalOpen, setIsNewMitraModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Jumlah mitra berstatus PENDING
  const pendingCount = mitraList.filter((m) => m.status === 'PENDING').length;

  // Laporan bug yang belum selesai (Menunggu + Diproses)
  const bugReports = useBugReports();
  const openBugCount = bugReports.filter((r) => r.status !== 'done').length;

  // Current logged in Super Admin identity (dari profil tersimpan)
  const sessionProfile = useSessionProfile('superadmin');
  const currentAdmin = {
    id: 'SA-001',
    name: sessionProfile.userName,
    email: sessionProfile.email,
  };

  // Helper untuk menambah entri audit log baru
  const addAuditLog = (
    actionType: AuditLogEntry['actionType'],
    mitra: MitraAccount,
    previousStatus: MitraAccount['status'] | undefined,
    newStatus: MitraAccount['status'],
    reason: string,
    details?: string
  ) => {
    const newLog: AuditLogEntry = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      executorId: currentAdmin.id,
      executorName: currentAdmin.name,
      executorEmail: currentAdmin.email,
      actionType,
      mitraId: mitra.id,
      mitraName: mitra.destinationName,
      previousStatus,
      newStatus,
      reason,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Aksi 1: Setujui & Aktifkan Mitra
  const handleApproveMitra = (mitraId: string) => {
    const target = mitraList.find((m) => m.id === mitraId);
    if (!target) return;

    const prevStatus = target.status;
    const nowIso = new Date().toISOString();

    setMitraList((prev) =>
      prev.map((m) =>
        m.id === mitraId
          ? {
              ...m,
              status: 'ACTIVE',
              verifiedAt: nowIso,
              verifiedBy: currentAdmin.name,
              rejectionReason: undefined,
            }
          : m
      )
    );

    addAuditLog(
      'APPROVE',
      target,
      prevStatus,
      'ACTIVE',
      'Persetujuan & Pengaktifan Akun Mitra',
      'Seluruh dokumen legalitas (KTP PIC, Izin/NIB, Rekening Bank) telah diperiksa dan dinyatakan memenuhi standar kepatuhan operasional Xploria.'
    );

    // Refresh selected drawer jika terbuka
    setSelectedMitra((prev) =>
      prev && prev.id === mitraId
        ? {
            ...prev,
            status: 'ACTIVE',
            verifiedAt: nowIso,
            verifiedBy: currentAdmin.name,
            rejectionReason: undefined,
          }
        : null
    );

    showToast(`Mitra "${target.destinationName}" berhasil disetujui & diaktifkan.`);
  };

  // Aksi 2: Tolak Pendaftaran Mitra
  const handleRejectMitra = (mitraId: string, reason: string, notes?: string) => {
    const target = mitraList.find((m) => m.id === mitraId);
    if (!target) return;

    const prevStatus = target.status;

    setMitraList((prev) =>
      prev.map((m) =>
        m.id === mitraId
          ? {
              ...m,
              status: 'REJECTED',
              rejectionReason: `${reason}${notes ? ` - Catatan: ${notes}` : ''}`,
            }
          : m
      )
    );

    addAuditLog(
      'REJECT',
      target,
      prevStatus,
      'REJECTED',
      `Penolakan Berkas: ${reason}`,
      notes ? `Catatan wajib revisi untuk mitra: "${notes}"` : 'Dokumen tidak memenuhi kelayakan legalitas.'
    );

    setSelectedMitra(null);
    showToast(`Pendaftaran mitra "${target.destinationName}" telah ditolak & berkas dikembalikan.`);
  };

  // Aksi 3: Bekukan Akun Mitra (Suspend)
  const handleSuspendMitra = (mitraId: string, reason: string) => {
    const target = mitraList.find((m) => m.id === mitraId);
    if (!target) return;

    const prevStatus = target.status;

    setMitraList((prev) =>
      prev.map((m) =>
        m.id === mitraId
          ? {
              ...m,
              status: 'SUSPENDED',
              rejectionReason: `Dibekukan: ${reason}`,
            }
          : m
      )
    );

    addAuditLog(
      'SUSPEND',
      target,
      prevStatus,
      'SUSPENDED',
      `Pembekuan Akun Operasional: ${reason}`,
      'Akses loket dan dashboard pengelola wisata sementara ditangguhkan atas wewenang Super Admin.'
    );

    setSelectedMitra((prev) =>
      prev && prev.id === mitraId
        ? {
            ...prev,
            status: 'SUSPENDED',
            rejectionReason: `Dibekukan: ${reason}`,
          }
        : null
    );

    showToast(`Akun mitra "${target.destinationName}" telah dibekukan.`);
  };

  // Aksi 4: Aktifkan Kembali Akun (Reactivate)
  const handleReactivateMitra = (mitraId: string) => {
    const target = mitraList.find((m) => m.id === mitraId);
    if (!target) return;

    const prevStatus = target.status;

    setMitraList((prev) =>
      prev.map((m) =>
        m.id === mitraId
          ? {
              ...m,
              status: 'ACTIVE',
              rejectionReason: undefined,
            }
          : m
      )
    );

    addAuditLog(
      'REACTIVATE',
      target,
      prevStatus,
      'ACTIVE',
      'Pemulihan Status Akun Mitra Aktif',
      'Pembekuan dicabut setelah pengelola menyelesaikan verifikasi lanjutan.'
    );

    setSelectedMitra((prev) =>
      prev && prev.id === mitraId
        ? {
            ...prev,
            status: 'ACTIVE',
            rejectionReason: undefined,
          }
        : null
    );

    showToast(`Akun mitra "${target.destinationName}" berhasil dipulihkan & aktif kembali.`);
  };

  // Aksi 5: Simulasi Pendaftaran Mitra Baru
  const handleAddMitra = (newMitra: MitraAccount) => {
    setMitraList((prev) => [newMitra, ...prev]);

    addAuditLog(
      'REGISTER',
      newMitra,
      undefined,
      'PENDING',
      'Pendaftaran Calon Mitra Wisata Baru',
      `Pengelola ${newMitra.pic.fullName} mendaftarkan ${newMitra.destinationName} ke dalam antrean verifikasi legalitas.`
    );
  };

  return (
    <SuperAdminLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      pendingCount={pendingCount}
      openBugCount={openBugCount}
      profile={sessionProfile}
      onOpenProfile={() => setActiveTab('profil')}
      onLogout={onLogout}
    >
      {/* Tampilan 1: Validasi Mitra Wisata */}
      {activeTab === 'validasi-mitra' && (
        <MitraValidationView
          mitraList={mitraList}
          onInspectMitra={(mitra) => setSelectedMitra(mitra)}
          onOpenSimulationModal={() => setIsNewMitraModalOpen(true)}
        />
      )}

      {/* Tampilan 2: Audit Log Sistem */}
      {activeTab === 'audit-log' && <AuditLogView auditLogs={auditLogs} />}

      {/* Tampilan 3: Laporan Bug dari Admin, Kasir, dan Pengelola */}
      {activeTab === 'laporan-bug' && <BugReportsAdminView onToast={showToast} />}

      {/* Tampilan 4: Profil Saya */}
      {activeTab === 'profil' && <ProfilePage role="superadmin" onToast={showToast} />}

      {/* Drawer Inspeksi & Aksi Verifikasi */}
      <MitraInspectionDrawer
        mitra={selectedMitra}
        isOpen={!!selectedMitra}
        onClose={() => setSelectedMitra(null)}
        onApprove={handleApproveMitra}
        onReject={handleRejectMitra}
        onSuspend={handleSuspendMitra}
        onReactivate={handleReactivateMitra}
      />

      {/* Modal Simulasi Pendaftaran Mitra Baru */}
      <NewMitraModal
        isOpen={isNewMitraModalOpen}
        onClose={() => setIsNewMitraModalOpen(false)}
        onSubmit={handleAddMitra}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2.5 rounded-2xl bg-slate-900/95 px-5 py-3 text-sm font-medium text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-md transition-all duration-300 animate-fadeIn"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </SuperAdminLayout>
  );
};
export default SuperAdminPortal;
