import { useState } from 'react';
import {
  CheckCircle2,
  Edit2,
  Eye,
  EyeOff,
  Filter,
  Plus,
  Receipt,
  Sparkles,
  Ticket,
  Trash2,
  X,
} from 'lucide-react';
import { formatRupiah } from '@/lib/bookings';
import type { TicketCategory, TicketItem } from '@/types/ticket';

type ManageTicketsViewProps = {
  tickets: TicketItem[];
  categories: TicketCategory[];
  onUpdateTickets: (tickets: TicketItem[]) => void;
  onToast: (message: string) => void;
};

export default function ManageTicketsView({
  tickets,
  categories,
  onUpdateTickets,
  onToast,
}: ManageTicketsViewProps) {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modal State for Edit / Add
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketItem | null>(null);

  // Form Fields as requested in "Membuat Jenis Tiket":
  // 1. Pilih Kategori: Select Dropdown
  // 2. Nama Jenis Tiket: Text Input
  // 3. Harga Tiket: Number Input / Format Currency
  // 4. Memasukkan Diskon: Number Input (%)
  // 5. Informasi Fasilitas yang Didapatkan: Textarea / List Input
  // 6. Syarat dan Ketentuan: Textarea
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id || '');
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [facilities, setFacilities] = useState<string>('');
  const [terms, setTerms] = useState<string>('');
  const [discount, setDiscount] = useState<string>('0');
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const openAddModal = () => {
    setEditingTicket(null);
    setCategoryId(categories[0]?.id || '');
    setName('');
    setPrice('');
    setFacilities('');
    setTerms('');
    setDiscount('0');
    setIsVisible(true);
    setModalOpen(true);
  };

  const openEditModal = (t: TicketItem) => {
    setEditingTicket(t);
    setCategoryId(t.categoryId);
    setName(t.name);
    setPrice(t.price.toString());
    setFacilities(t.facilities);
    setTerms(t.terms);
    setDiscount(t.discount.toString());
    setIsVisible(t.isVisible);
    setModalOpen(true);
  };

  // 1. Atur Visibilitas Tiket (Toggle switch / Dropdown status tampil/sembunyi)
  const handleToggleVisibility = (id: string) => {
    const target = tickets.find((t) => t.id === id);
    if (!target) return;
    const nextState = !target.isVisible;
    const updated = tickets.map((t) => (t.id === id ? { ...t, isVisible: nextState } : t));
    onUpdateTickets(updated);
    onToast(
      `Visibilitas tiket "${target.name}" diubah ke: ${nextState ? 'TAMPIL (Aktif)' : 'SEMBUNYI (Nonaktif)'}`
    );
  };

  // 2. Hapus Tiket
  const handleDeleteTicket = (id: string, ticketName: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus tiket "${ticketName}"?`)) {
      const updated = tickets.filter((t) => t.id !== id);
      onUpdateTickets(updated);
      onToast(`Tiket "${ticketName}" berhasil dihapus.`);
    }
  };

  // 3. Form Submit (Membuat Jenis Tiket / Edit Tiket)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = parseInt(price, 10);
    const numDiscount = parseInt(discount || '0', 10);

    if (!name.trim()) {
      onToast('Nama jenis tiket wajib diisi!');
      return;
    }
    if (isNaN(numPrice) || numPrice < 0) {
      onToast('Harga tiket tidak valid!');
      return;
    }
    if (isNaN(numDiscount) || numDiscount < 0 || numDiscount > 100) {
      onToast('Diskon tiket harus berupa angka antara 0% hingga 100%!');
      return;
    }

    if (editingTicket) {
      const updated = tickets.map((t) =>
        t.id === editingTicket.id
          ? {
              ...t,
              categoryId,
              name: name.trim(),
              price: numPrice,
              facilities: facilities.trim(),
              terms: terms.trim(),
              discount: numDiscount,
              isVisible,
            }
          : t
      );
      onUpdateTickets(updated);
      onToast(`Tiket "${name.trim()}" berhasil diperbarui.`);
    } else {
      const newTicket: TicketItem = {
        id: `tkt-${Date.now()}`,
        categoryId,
        name: name.trim(),
        price: numPrice,
        facilities: facilities.trim(),
        terms: terms.trim(),
        discount: numDiscount,
        isVisible,
        createdAt: new Date().toISOString().split('T')[0],
      };
      onUpdateTickets([newTicket, ...tickets]);
      onToast(`Jenis tiket baru "${name.trim()}" berhasil dibuat.`);
    }

    setModalOpen(false);
  };

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    const matchesCategory = filterCategory === 'all' || t.categoryId === filterCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.facilities.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryName = (catId: string) => {
    return categories.find((c) => c.id === catId)?.name || catId;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Filter and Action Bar */}
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#286EF2]" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Kategori:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-[#286EF2] focus:outline-none"
          >
            <option value="all">Semua Kategori ({tickets.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama tiket atau fasilitas..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-[#286EF2] focus:bg-white focus:outline-none sm:w-56"
          />

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#286EF2] px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition hover:bg-blue-700 shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Buat Jenis Tiket Baru</span>
          </button>
        </div>
      </div>

      {/* 1. DAFTAR TIKET (Table View) */}
      <div className="flex min-h-[540px] flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card">
        <div>
          <div className="flex items-center justify-between border-b border-ocean-50 p-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ocean-50 text-ocean-600">
                <Ticket className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Daftar Tiket Wisata</h2>
                <p className="text-xs text-slate-400">
                  Menampilkan {filteredTickets.length} jenis tiket
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] table-fixed text-left text-sm text-slate-600">
              <thead className="bg-ocean-50/70 text-xs font-semibold uppercase tracking-wider text-ocean-800 border-b border-ocean-100/60">
                <tr>
                  <th className="w-14 px-4 py-4 text-center">No</th>
                  <th className="w-60 px-6 py-4">Jenis Tiket &amp; Kategori</th>
                  <th className="w-44 px-6 py-4">Harga &amp; Diskon</th>
                  <th className="w-72 px-6 py-4">Fasilitas</th>
                  <th className="w-72 px-6 py-4">Syarat &amp; Ketentuan</th>
                  <th className="w-28 px-4 py-4 text-center">Visibilitas</th>
                  <th className="w-40 px-4 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-24 text-center text-slate-400">
                      Tidak ada jenis tiket yang sesuai.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((t, idx) => {
                    const discount = t.discount || 0;
                    const finalPrice = Math.max(0, Math.round(t.price * (1 - discount / 100)));
                    const hasDiscount = discount > 0;

                    return (
                      <tr
                        key={t.id}
                        className={`transition-colors hover:bg-ocean-50/30 ${
                          !t.isVisible ? 'bg-slate-50/60 opacity-75' : ''
                        }`}
                      >
                        <td className="w-14 px-4 py-4 text-center font-mono text-xs text-slate-400">{idx + 1}</td>
                        <td className="w-60 px-6 py-4">
                          <p className="font-bold text-slate-900 line-clamp-1" title={t.name}>{t.name}</p>
                          <span className="mt-0.5 inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-[#286EF2]">
                            {getCategoryName(t.categoryId)}
                          </span>
                        </td>
                        <td className="w-44 px-6 py-4">
                          <div className="flex flex-col gap-0.5">
                            {hasDiscount ? (
                              <>
                                <span className="text-xs text-slate-400 line-through">
                                  {formatRupiah(t.price)}
                                </span>
                                <div className="flex flex-wrap items-center gap-1">
                                  <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-black text-amber-700">
                                    Diskon -{discount}%
                                  </span>
                                </div>
                                <span className="text-sm font-extrabold text-[#286EF2]">
                                  {formatRupiah(finalPrice)}
                                </span>
                              </>
                            ) : (
                              <span className="text-sm font-extrabold text-slate-900">
                                {formatRupiah(t.price)}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="w-72 px-6 py-4">
                          <p className="text-xs leading-relaxed text-slate-600 line-clamp-2" title={t.facilities}>
                            {t.facilities || '-'}
                          </p>
                        </td>
                        <td className="w-72 px-6 py-4">
                          <p className="text-xs leading-relaxed text-slate-500 line-clamp-2" title={t.terms}>
                            {t.terms || '-'}
                          </p>
                        </td>
                        <td className="w-28 px-4 py-4 text-center">
                          {/* Atur Visibilitas Tiket: Toggle Switch */}
                          <div className="flex flex-col items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleToggleVisibility(t.id)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                t.isVisible ? 'bg-emerald-500' : 'bg-slate-300'
                              }`}
                              role="switch"
                              aria-checked={t.isVisible}
                              title={t.isVisible ? 'Klik untuk sembunyikan tiket' : 'Klik untuk tampilkan tiket'}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                  t.isVisible ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                            <span
                              className={`text-[10px] font-bold ${
                                t.isVisible ? 'text-emerald-700' : 'text-slate-400'
                              }`}
                            >
                              {t.isVisible ? 'Tampil' : 'Sembunyi'}
                            </span>
                          </div>
                        </td>
                        <td className="w-40 px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditModal(t)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-ocean-600 shadow-sm transition hover:border-ocean-300 hover:bg-ocean-50"
                              title="Edit Tiket"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteTicket(t.id, t.name)}
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-600 shadow-sm transition hover:border-rose-300 hover:bg-rose-50"
                              title="Hapus Tiket"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Bar untuk menjaga konsistensi tinggi & proporsi frame */}
        <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              Menampilkan <strong className="text-slate-800">{filteredTickets.length}</strong> jenis tiket
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Kategori:{' '}
              <strong className="text-[#286EF2]">
                {filterCategory === 'all' ? 'Semua Kategori' : getCategoryName(filterCategory)}
              </strong>
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Sistem Tiketing &amp; Gerbang Masuk Terintegrasi
          </span>
        </div>
      </div>

      {/* 2. FORM BUAT / EDIT JENIS TIKET MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-ocean-950/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ocean-50 text-ocean-600 ring-1 ring-ocean-100">
                <Ticket className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-ocean-900">
                  {editingTicket ? 'Edit Jenis Tiket' : 'Buat Jenis Tiket Baru'}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Isi rincian kategori, harga, fasilitas, syarat &amp; ketentuan, serta diskon tiket.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              {/* Row 1: Pilih Kategori & Nama Jenis Tiket */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Pilih Kategori <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 focus:border-ocean-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-ocean-50"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Nama Jenis Tiket <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Tiket Dewasa VIP Sunset"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 focus:border-ocean-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-ocean-50"
                  />
                </div>
              </div>

              {/* Row 2: Harga Tiket & Diskon Tiket (%) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Harga Tiket (Rp) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative mt-1.5">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      Rp
                    </span>
                    <input
                      type="number"
                      required
                      min="0"
                      step="1000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="35000"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:border-[#286EF2] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-50"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    *Tarif dasar / harga reguler tiket
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Memasukkan Diskon (%) <span className="text-slate-400 font-normal">(Opsional)</span>
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      placeholder="0"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-10 text-sm text-slate-800 focus:border-[#286EF2] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-50"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      %
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    *Diskon potongan persentase tiket (0% - 100%)
                  </p>
                </div>
              </div>

              {/* Simulasi Perhitungan Harga Akhir jika ada Diskon */}
              {(() => {
                const p = parseInt(price, 10) || 0;
                const disc = parseInt(discount, 10) || 0;
                const discAmount = Math.round(p * (disc / 100));
                const finalP = Math.max(0, p - discAmount);

                if (p <= 0 || disc <= 0) return null;

                return (
                  <div className="rounded-2xl border border-blue-200/80 bg-blue-50/60 p-4 text-xs">
                    <p className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                      <Receipt className="h-4 w-4 text-[#286EF2]" />
                      Simulasi Perhitungan Harga Diskon:
                    </p>
                    <div className="space-y-1.5 text-slate-600">
                      <div className="flex justify-between">
                        <span>Harga Awal Tiket:</span>
                        <span className="font-bold text-slate-800">{formatRupiah(p)}</span>
                      </div>
                      <div className="flex justify-between text-amber-700 font-medium">
                        <span>Potongan Diskon ({disc}%):</span>
                        <span>- {formatRupiah(discAmount)}</span>
                      </div>
                      <div className="flex justify-between text-emerald-800 font-black text-sm border-t border-blue-200 pt-1.5">
                        <span>Harga Akhir Tiket:</span>
                        <span>{formatRupiah(finalP)}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Row 3: Informasi Fasilitas yang Didapatkan */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Informasi Fasilitas yang Didapatkan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={facilities}
                  onChange={(e) => setFacilities(e.target.value)}
                  placeholder="Contoh: Akses penuh pantai, gazebo umum, welcome drink kelapa muda, toilet..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 focus:border-ocean-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-ocean-50"
                />
              </div>

              {/* Row 4: Syarat dan Ketentuan */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Syarat dan Ketentuan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  placeholder="Contoh: Wajib scan QR code saat masuk, tiket hanya berlaku di hari H, non-refundable..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 focus:border-ocean-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-ocean-50"
                />
              </div>

              {/* Row 5: Status Visibilitas */}
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                <div>
                  <p className="text-xs font-bold text-slate-800">Status Visibilitas Tiket</p>
                  <p className="text-[11px] text-slate-500">
                    Apakah tiket ini langsung ditampilkan pada loket pemesanan?
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsVisible((v) => !v)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isVisible ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        isVisible ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className="text-xs font-bold text-slate-700">
                    {isVisible ? 'Tampil' : 'Sembunyi'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-ocean-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-ocean-600/25 hover:bg-ocean-700"
                >
                  {editingTicket ? 'Simpan Perubahan' : 'Simpan Jenis Tiket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

