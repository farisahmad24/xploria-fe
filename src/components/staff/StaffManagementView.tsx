import { useState } from 'react';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Pencil,
  Phone,
  Shield,
  Trash2,
  UserCheck,
  UserPlus,
  UserX,
  X,
} from 'lucide-react';
import type { StaffMember } from '@/types/roles';

type StaffManagementViewProps = {
  staffList: StaffMember[];
  onUpdateStaff: (staff: StaffMember[]) => void;
  onToast: (message: string) => void;
};

export default function StaffManagementView({
  staffList,
  onUpdateStaff,
  onToast,
}: StaffManagementViewProps) {
  const [view, setView] = useState<'list' | 'add'>('list');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('Petugas Kasir Tiket');

  const handleToggleStatus = (id: string) => {
    const updated = staffList.map((s) => {
      if (s.id === id) {
        const nextStatus = s.status === 'aktif' ? 'nonaktif' : 'aktif';
        return { ...s, status: nextStatus as 'aktif' | 'nonaktif' };
      }
      return s;
    });
    onUpdateStaff(updated);
    onToast('Status akun staf berhasil diperbarui');
  };

  const handleDeleteStaff = (id: string) => {
    if (staffList.length <= 1) {
      onToast('Tidak dapat menghapus seluruh akun staf!');
      return;
    }
    const updated = staffList.filter((s) => s.id !== id);
    onUpdateStaff(updated);
    onToast('Akun staf berhasil dihapus');
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setShowPassword(false);
    setRole('Petugas Kasir Tiket');
  };

  const openAddPage = () => {
    resetForm();
    setView('add');
  };

  const openEditModal = (staf: StaffMember) => {
    setEditingId(staf.id);
    setName(staf.name);
    setEmail(staf.email);
    setPhone(staf.phone);
    setRole(staf.role);
    setPassword('');
    setShowPassword(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const handleSubmitStaff = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const updated = staffList.map((s) =>
        s.id === editingId
          ? { ...s, name, email, phone, role, ...(password ? { password } : {}) }
          : s,
      );
      onUpdateStaff(updated);
      closeModal();
      onToast(`Data akun staf untuk ${name} berhasil diperbarui!`);
      return;
    }

    const newStaff: StaffMember = {
      id: `st-${Date.now()}`,
      name,
      email,
      phone,
      role,
      password,
      status: 'aktif',
      joinedDate: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    };
    onUpdateStaff([...staffList, newStaff]);
    if (view === 'add') {
      setView('list');
      resetForm();
    } else {
      closeModal();
    }
    onToast(`Akun staf untuk ${name} berhasil dibuat!`);
  };

  // ── Halaman Tambah Akun Staf ─────────────────────────────────────────────
  if (view === 'add') {
    return (
      <div className="flex flex-col gap-6">
        {/* Header halaman tambah */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => { setView('list'); resetForm(); }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
            aria-label="Kembali ke daftar staf"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 sm:text-3xl tracking-tight">Tambah Akun Staf Baru</h1>
            <p className="text-sm text-slate-500">Buat akun akses pengguna untuk petugas operasional wisata.</p>
          </div>
        </div>

        {/* Form card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card">
          <div className="border-b border-slate-100 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-[#286EF2] ring-1 ring-blue-100">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Data Akun Baru</h2>
                <p className="text-xs text-slate-400">Lengkapi semua field untuk mendaftarkan staf baru.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmitStaff} className="p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Rian Pratama"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:border-[#286EF2] focus:outline-none focus:ring-2 focus:ring-[#286EF2]/20"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Role / Posisi
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:border-[#286EF2] focus:outline-none focus:ring-2 focus:ring-[#286EF2]/20"
                >
                  <option value="Petugas Kasir Tiket">Petugas Kasir Tiket</option>
                  <option value="Petugas Validasi Lapangan">Petugas Validasi Lapangan</option>
                  <option value="Admin Manajer">Admin Manajer</option>
                  <option value="Pengawas Operasional">Pengawas Operasional</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812-3456-7890"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:border-[#286EF2] focus:outline-none focus:ring-2 focus:ring-[#286EF2]/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rian.pratama@ploria.id"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:border-[#286EF2] focus:outline-none focus:ring-2 focus:ring-[#286EF2]/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm text-slate-800 focus:border-[#286EF2] focus:outline-none focus:ring-2 focus:ring-[#286EF2]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">Password minimal 8 karakter.</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => { setView('list'); resetForm(); }}
                className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#286EF2] px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/25 hover:bg-blue-700"
              >
                <UserPlus className="h-4 w-4" />
                Daftarkan Staf
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ── Halaman Daftar Staf ───────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>

          <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl tracking-tight">Kelola Akun Staf Wisata</h1>
          <p className="text-sm text-slate-500">
            Manajemen akun petugas loket kasir, administrator, dan hak akses operasional.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddPage}
          className="inline-flex items-center gap-2 rounded-xl bg-[#286EF2] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition hover:bg-blue-700"
        >
          <UserPlus className="h-4 w-4" />
          Tambah Akun Staf
        </button>
      </div>

      {/* Staff Table */}
      <div className="flex min-h-[560px] flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card">
        <div>
          <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-[#286EF2] ring-1 ring-blue-100">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Daftar Personel &amp; Hak Akses</h2>
                <p className="text-xs text-slate-400">Total {staffList.length} akun staf terdaftar pada sistem.</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-ocean-50/70 text-xs font-semibold uppercase tracking-wider text-ocean-800">
                <tr>
                  <th className="px-6 py-4">Nama Staf</th>
                  <th className="px-6 py-4">Role / Posisi</th>
                  <th className="px-6 py-4">Kontak</th>
                  <th className="px-6 py-4">Tanggal Bergabung</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staffList.map((staf) => (
                  <tr key={staf.id} className="hover:bg-ocean-50/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean-100 font-bold text-ocean-700">
                          {staf.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{staf.name}</p>
                          <p className="text-xs text-slate-400">{staf.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-800">
                        <Shield className="h-3 w-3 text-ocean-600" />
                        {staf.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <p className="flex items-center gap-1.5 text-slate-700">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        {staf.email}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-slate-500">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        {staf.phone}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{staf.joinedDate}</td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(staf.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition ${staf.status === 'aktif'
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                          }`}
                      >
                        {staf.status === 'aktif' ? (
                          <>
                            <UserCheck className="h-3 w-3" /> Aktif
                          </>
                        ) : (
                          <>
                            <UserX className="h-3 w-3" /> Nonaktif
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => openEditModal(staf)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-[#286EF2]"
                        title="Edit Akun Staf"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteStaff(staf.id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        title="Hapus Akun Staf"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Bar (Frame Stability) */}
        <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              Total Staf: <strong className="text-slate-800">{staffList.length}</strong> akun
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Aktif: <strong className="text-emerald-600">{staffList.filter((s) => s.status === 'aktif').length} Staf</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Nonaktif: <strong className="text-slate-500">{staffList.filter((s) => s.status === 'nonaktif').length} Staf</strong>
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Sistem Manajemen Personel &amp; Hak Akses Operasional
          </span>
        </div>
      </div>

      {/* Edit Staff Modal */}
      {modalOpen && editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-ocean-950/60 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold text-ocean-900">Edit Akun Staf</h3>
            <p className="mt-1 text-xs text-slate-500">
              Perbarui data akun akses pengguna untuk petugas operasional wisata.
            </p>

            <form onSubmit={handleSubmitStaff} className="mt-5 flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Rian Pratama"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-ocean-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Role / Posisi
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-ocean-500 focus:outline-none"
                >
                  <option value="Petugas Kasir Tiket">Petugas Kasir Tiket</option>
                  <option value="Petugas Validasi Lapangan">Petugas Validasi Lapangan</option>
                  <option value="Admin Manajer">Admin Manajer</option>
                  <option value="Pengawas Operasional">Pengawas Operasional</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rian.pratama@Ploria.id"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-ocean-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812-3456-7890"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-ocean-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Kosongkan jika tidak diubah"
                    autoComplete="new-password"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 pr-11 text-sm text-slate-800 focus:border-ocean-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-ocean-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-ocean-600/25 hover:bg-ocean-700"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
