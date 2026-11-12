import { useState } from 'react';
import { Edit2, Layers, Plus, Tag, Trash2, X } from 'lucide-react';
import type { TicketCategory } from '@/types/ticket';

type TicketCategoriesViewProps = {
  categories: TicketCategory[];
  onUpdateCategories: (categories: TicketCategory[]) => void;
  onToast: (message: string) => void;
};

export default function TicketCategoriesView({
  categories,
  onUpdateCategories,
  onToast,
}: TicketCategoriesViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TicketCategory | null>(null);

  // Form states: Nama Kategori (Text) & Deskripsi (Textarea)
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setModalOpen(true);
  };

  const openEditModal = (cat: TicketCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setModalOpen(true);
  };

  const handleDelete = (id: string, catName: string) => {
    if (categories.length <= 1) {
      onToast('Minimal harus ada satu kategori tiket aktif!');
      return;
    }
    if (window.confirm(`Yakin ingin menghapus kategori "${catName}"?`)) {
      const updated = categories.filter((c) => c.id !== id);
      onUpdateCategories(updated);
      onToast(`Kategori "${catName}" berhasil dihapus.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      onToast('Nama kategori tidak boleh kosong!');
      return;
    }

    if (editingCategory) {
      const updated = categories.map((c) =>
        c.id === editingCategory.id
          ? { ...c, name: trimmedName, description: description.trim() }
          : c
      );
      onUpdateCategories(updated);
      onToast(`Kategori "${trimmedName}" berhasil diperbarui.`);
    } else {
      const newCat: TicketCategory = {
        id: `cat-${Date.now()}`,
        name: trimmedName,
        description: description.trim(),
        price: 0,
      };
      onUpdateCategories([...categories, newCat]);
      onToast(`Kategori baru "${trimmedName}" berhasil dibuat.`);
    }
    setModalOpen(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Full-Width Table: Daftar Kategori Tiket */}
      <div className="w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card min-h-[540px] flex flex-col justify-between">
        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-ocean-50 p-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-[#286EF2] ring-1 ring-blue-100">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Daftar Kategori Tiket Terdaftar</h2>
                <p className="text-xs text-slate-400">Total {categories.length} kategori aktif</p>
              </div>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 rounded-xl bg-[#286EF2] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/25 transition hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Kategori Baru</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] table-fixed text-left text-sm text-slate-600">
              <thead className="bg-ocean-50/70 text-xs font-semibold uppercase tracking-wider text-ocean-800 border-b border-ocean-100/60">
                <tr>
                  <th className="w-14 px-4 py-4 text-center">No</th>
                  <th className="w-64 px-6 py-4">Nama Kategori</th>
                  <th className="px-6 py-4">Deskripsi Batasan Pengunjung</th>
                  <th className="w-40 px-4 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat, idx) => (
                  <tr key={cat.id} className="transition-colors hover:bg-ocean-50/30">
                    <td className="w-14 px-4 py-4 text-center font-mono text-xs text-slate-400">{idx + 1}</td>
                    <td className="w-64 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ocean-50 text-ocean-600 shrink-0">
                          <Tag className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-sm truncate">{cat.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">ID: {cat.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs leading-relaxed text-slate-600 line-clamp-2">
                        {cat.description || '-'}
                      </p>
                    </td>
                    <td className="w-40 px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(cat)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-ocean-600 shadow-sm transition hover:border-ocean-300 hover:bg-ocean-50"
                          title="Edit Kategori"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 shadow-sm transition hover:border-rose-300 hover:bg-rose-50"
                          title="Hapus Kategori"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-medium">
            Total <strong className="text-slate-800">{categories.length}</strong> kategori tiket terdaftar
          </span>
          <span className="text-[11px] text-slate-400">
            Kategori ini langsung terhubung pada form pemesanan tiket loket &amp; kasir
          </span>
        </div>
      </div>

      {/* Modal Dialog: Tambah / Edit Kategori */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-ocean-950/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold text-ocean-900">
              {editingCategory ? 'Edit Kategori Tiket' : 'Tambah Kategori Baru'}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Kelola informasi nama kategori dan deskripsi ketentuan pengunjung.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Nama Kategori <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Tiket Dewasa VIP"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition focus:border-ocean-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-ocean-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Deskripsi Kategori <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tuliskan keterangan batasan atau sasaran kategori pengunjung ini..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 transition focus:border-ocean-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-ocean-50"
                />
              </div>

              <div className="mt-3 flex gap-3">
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
                  {editingCategory ? 'Simpan Perubahan' : 'Buat Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
