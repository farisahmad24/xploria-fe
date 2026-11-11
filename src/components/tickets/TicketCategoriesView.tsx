import { useState } from 'react';
import { Edit2, Plus, Tag, Trash2, X } from 'lucide-react';
import { formatRupiah } from '@/lib/bookings';
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

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setPrice('');
    setDescription('');
    setModalOpen(true);
  };

  const openEditModal = (cat: TicketCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setPrice(cat.price.toString());
    setDescription(cat.description);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (categories.length <= 1) {
      onToast('Minimal harus ada satu kategori tiket!');
      return;
    }
    const updated = categories.filter((c) => c.id !== id);
    onUpdateCategories(updated);
    onToast('Kategori tiket berhasil dihapus');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = parseInt(price, 10);
    if (isNaN(numPrice) || numPrice <= 0) {
      onToast('Harga tiket tidak valid');
      return;
    }

    if (editingCategory) {
      const updated = categories.map((c) =>
        c.id === editingCategory.id ? { ...c, name, price: numPrice, description } : c
      );
      onUpdateCategories(updated);
      onToast(`Kategori ${name} berhasil diperbarui`);
    } else {
      const newCat: TicketCategory = {
        id: `cat-${Date.now()}`,
        name,
        price: numPrice,
        description,
      };
      onUpdateCategories([...categories, newCat]);
      onToast(`Kategori ${name} berhasil ditambahkan`);
    }
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-ocean-600">
            Manajemen Tiket dan Transaksi
          </p>
          <h1 className="mt-1 text-2xl font-bold text-ocean-900 sm:text-3xl">Kelola Kategori Tiket</h1>
          <p className="text-sm text-slate-500">
            Atur jenis tiket, tarif harga masuk, dan ketentuan fasilitas pengunjung.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-xl bg-ocean-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-ocean-600/25 transition hover:bg-ocean-700"
        >
          <Plus className="h-4 w-4" />
          Tambah Kategori Tiket
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-col justify-between rounded-3xl border border-ocean-100 bg-white p-6 shadow-card transition-all hover:border-ocean-200 hover:shadow-lg"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ocean-50 text-ocean-600 ring-1 ring-ocean-100">
                    <Tag className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{cat.name}</h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ocean-600">
                      ID: {cat.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(cat)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-ocean-50 hover:text-ocean-600"
                    title="Edit Kategori"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    title="Hapus Kategori"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-600">{cat.description}</p>
            </div>

            <div className="mt-6 flex items-baseline justify-between border-t border-slate-100 pt-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Tarif Tiket
              </span>
              <span className="text-xl font-extrabold text-ocean-900">{formatRupiah(cat.price)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
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
              Kelola informasi jenis tiket masuk untuk pengunjung wisata.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Tiket Dewasa VIP"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-ocean-500 focus:outline-none focus:ring-4 focus:ring-ocean-50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Tarif Harga (Rp)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="35000"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-ocean-500 focus:outline-none focus:ring-4 focus:ring-ocean-50"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Deskripsi & Fasilitas
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Akses penuh pantai, spot foto dan welcome drink..."
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-ocean-500 focus:outline-none focus:ring-4 focus:ring-ocean-50"
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
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
