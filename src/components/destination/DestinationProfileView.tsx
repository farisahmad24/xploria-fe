import { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  Compass,
  FileCheck,
  Image as ImageIcon,
  ImageOff,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Sparkles,
  Star,
  Tag,
  ThumbsUp,
  Trash2,
  TrendingUp,
  Upload,
  User,
  Users,
} from 'lucide-react';
import type { DestinationInfo } from '@/types/roles';
import { formatRupiah } from '@/lib/bookings';

type DestinationProfileViewProps = {
  initialData: DestinationInfo;
  onSave: (data: DestinationInfo) => void;
  onToast: (message: string) => void;
};

export default function DestinationProfileView({
  initialData,
  onSave,
  onToast,
}: DestinationProfileViewProps) {
  const [data, setData] = useState<DestinationInfo>({
    ...initialData,
    images: initialData.images && initialData.images.length > 0 ? initialData.images : [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
    ],
    importantNotice: initialData.importantNotice || 'Seluruh pengunjung wajib mengenakan pelampung keselamatan saat bermain wahana air.',
    lowestTicketPrice: initialData.lowestTicketPrice || 15000,
    bestOffer: initialData.bestOffer || 'Mulai dari Rp 15.000 / orang (Diskon 10% untuk Paket Keluarga)',
    rating: initialData.rating || 4.9,
    totalReviews: initialData.totalReviews || 128,
    crowdPrediction: initialData.crowdPrediction || 'Rendah (Pagi) • Sedang (Siang) • Padat / Ramai (Sore: 15.00 - 17.30)',
    recommendation: initialData.recommendation || 'Waktu terbaik berkunjung pukul 15.30 WIB untuk menikmati panorama sunset dan snorkeling.',
    managerContact: initialData.managerContact || 'Budi Santoso, S.Par (Manajer Operasional)',
  });

  const [newImage, setNewImage] = useState('');
  const [newFacility, setNewFacility] = useState('');
  const [newRule, setNewRule] = useState('');
  const [brokenImages, setBrokenImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB per file

  const handleAddImage = () => {
    const url = newImage.trim();
    if (!url) return;
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') throw new Error('protocol');
    } catch {
      onToast('URL gambar tidak valid. Gunakan tautan yang diawali https://');
      return;
    }
    setData((prev) => ({ ...prev, images: [...(prev.images || []), url] }));
    setNewImage('');
  };

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });

  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ''; // allow picking the same file again later
    if (files.length === 0) return;

    const imageFiles = files.filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length !== files.length) {
      onToast('Beberapa file dilewati karena bukan format gambar.');
    }
    const tooLarge = imageFiles.filter((f) => f.size > MAX_IMAGE_SIZE);
    if (tooLarge.length > 0) {
      onToast(`${tooLarge.length} gambar dilewati karena ukurannya lebih dari 5 MB.`);
    }
    const validFiles = imageFiles.filter((f) => f.size <= MAX_IMAGE_SIZE);
    if (validFiles.length === 0) return;

    setUploading(true);
    try {
      const dataUrls = await Promise.all(validFiles.map(readFileAsDataUrl));
      setData((prev) => ({ ...prev, images: [...(prev.images || []), ...dataUrls] }));
      onToast(`${dataUrls.length} gambar berhasil ditambahkan.`);
    } catch {
      onToast('Gagal membaca file gambar. Coba lagi.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddFacility = () => {
    if (!newFacility.trim()) return;
    setData((prev) => ({ ...prev, facilities: [...prev.facilities, newFacility.trim()] }));
    setNewFacility('');
  };

  const handleRemoveFacility = (index: number) => {
    setData((prev) => ({ ...prev, facilities: prev.facilities.filter((_, i) => i !== index) }));
  };

  const handleAddRule = () => {
    if (!newRule.trim()) return;
    setData((prev) => ({ ...prev, rules: [...prev.rules, newRule.trim()] }));
    setNewRule('');
  };

  const handleRemoveRule = (index: number) => {
    setData((prev) => ({ ...prev, rules: prev.rules.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(data);
    onToast('Seluruh Data Informasi Wisata berhasil diperbarui!');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-fadeIn">
      {/* Header Halaman & Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#286EF2] uppercase tracking-wider mb-1">
           
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
            Kelola Profil &amp; Informasi Wisata
          </h1>
          <p className="text-sm text-slate-500">
            Perbarui data lengkap destinasi wisata mulai dari foto, deskripsi, operasional, himbauan, fasilitas, hingga prediksi kepadatan.
          </p>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-2xl bg-[#286EF2] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Save className="h-4 w-4" />
          <span>Simpan Perubahan</span>
        </button>
      </div>

      {/* ── 1. GAMBAR WISATA (BISA LEBIH DARI 1) ── */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#286EF2]">
              <ImageIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">1. Gambar Objek Wisata (Bisa Lebih dari 1)</h2>
              <p className="text-xs text-slate-500">Koleksi foto panorama, wahana, dan fasilitas destinasi wisata.</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#286EF2] bg-blue-50 px-3 py-1 rounded-full w-fit">
            {(data.images || []).length} Foto Terdaftar
          </span>
        </div>

        {/* Gallery Thumbnails Grid */}
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(data.images || []).map((imgUrl, idx) => {
            const isBroken = brokenImages.includes(imgUrl);
            return (
            <div key={idx} className="group relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
              {isBroken ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 px-3 text-center text-slate-400">
                  <ImageOff className="h-6 w-6" />
                  <span className="text-[11px] font-semibold">Gambar gagal dimuat</span>
                  <span className="line-clamp-1 text-[10px] text-slate-400">{imgUrl}</span>
                </div>
              ) : (
                <img
                  src={imgUrl}
                  alt={`Wisata foto ${idx + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={() => setBrokenImages((prev) => (prev.includes(imgUrl) ? prev : [...prev, imgUrl]))}
                />
              )}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <span className="text-[10px] font-bold text-white bg-black/50 px-2 py-0.5 rounded-md">
                  Foto #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="rounded-full bg-rose-600 p-1.5 text-white shadow-md hover:bg-rose-700 transition"
                  title="Hapus foto ini"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            );
          })}
        </div>

        {/* Input Tambah Gambar Baru: dari URL atau upload dari perangkat */}
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddImage();
                }
              }}
              placeholder="Tempel tautan URL gambar baru (https://...)"
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-[#286EF2] focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah dari Link</span>
            </button>
          </div>

          <label
            className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#286EF2] bg-blue-50/50 px-5 py-2.5 text-xs font-bold text-[#286EF2] transition hover:bg-blue-50 ${uploading ? 'pointer-events-none opacity-60' : ''}`}
          >
            <Upload className="h-4 w-4" />
            <span>{uploading ? 'Memproses gambar...' : 'Upload Foto dari Perangkat (JPG, PNG, WEBP, maks. 5 MB)'}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUploadImages}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Kolom Utama (Parameter 2 - 6 & 8) */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Card: Informasi Pokok Wisata */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <Compass className="h-5 w-5 text-[#286EF2]" />
              <h2 className="text-base font-bold text-slate-900">Informasi Pokok Destinasi</h2>
            </div>

            {/* 2. Nama Tempat */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  2. Nama Tempat (Objek Wisata)
                </label>
                <input
                  type="text"
                  required
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="Contoh: Pantai Ploria Indah"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 focus:border-[#286EF2] focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Slogan / Tagline Destinasi
                </label>
                <input
                  type="text"
                  required
                  value={data.tagline}
                  onChange={(e) => setData({ ...data, tagline: e.target.value })}
                  placeholder="Pesona Bahari Tropis & Wisata Keluarga"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-[#286EF2] focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* 3. Lokasi & 4. Jam Operasional */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  3. Lokasi &amp; Alamat Lengkap
                </label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={data.location}
                    onChange={(e) => setData({ ...data, location: e.target.value })}
                    placeholder="Jl. Raya Pantai..."
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:border-[#286EF2] focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  4. Jam Operasional
                </label>
                <div className="relative mt-1">
                  <Clock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={data.openHours}
                    onChange={(e) => setData({ ...data, openHours: e.target.value })}
                    placeholder="Setiap Hari: 07:00 - 18:00 WIB"
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:border-[#286EF2] focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>

            {/* 5. Deskripsi */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                5. Deskripsi Lengkap Wisata
              </label>
              <textarea
                rows={4}
                required
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                placeholder="Tuliskan deskripsi daya tarik, sejarah, dan keindahan tempat wisata..."
                className="mt-1 w-full rounded-xl border border-slate-200 p-4 text-sm leading-relaxed text-slate-800 focus:border-[#286EF2] focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* 6. Himbauan / Informasi Penting (Jika Ada) */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-900">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span>6. Himbauan / Informasi Penting (Jika Ada)</span>
              </label>
              <textarea
                rows={2}
                value={data.importantNotice || ''}
                onChange={(e) => setData({ ...data, importantNotice: e.target.value })}
                placeholder="Contoh: Pengunjung wajib mengenakan pelampung saat berenang di pantai, dilarang merusak terumbu karang..."
                className="mt-2 w-full rounded-xl border border-amber-300 bg-white p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>

            {/* 8. Kontak Manajer */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#286EF2]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">8. Kontak Manajer</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">Telepon / WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={data.contactPhone}
                    onChange={(e) => setData({ ...data, contactPhone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-[#286EF2] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">Email Resmi</label>
                  <input
                    type="email"
                    required
                    value={data.contactEmail}
                    onChange={(e) => setData({ ...data, contactEmail: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-[#286EF2] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500">Nama PIC / Manajer</label>
                  <input
                    type="text"
                    value={data.managerContact || ''}
                    onChange={(e) => setData({ ...data, managerContact: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:border-[#286EF2] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card: Analitik & Rekomendasi (Parameter 9, 10, 11, 12) */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">Analisis Kunjungan &amp; Rekomendasi</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 9. Pilihan Tiket (Harga Terendah / Penawaran Terbaik) */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#286EF2]">
                  <Tag className="h-3.5 w-3.5" />
                  <span>9. Pilihan Tiket Terendah &amp; Penawaran</span>
                </div>
                <div className="mt-2 space-y-2">
                  <div>
                    <label className="text-[11px] text-slate-500 font-medium">Harga Tiket Terendah (Rp)</label>
                    <input
                      type="number"
                      value={data.lowestTicketPrice || 15000}
                      onChange={(e) => setData({ ...data, lowestTicketPrice: Number(e.target.value) })}
                      className="mt-0.5 w-full rounded-xl border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:border-[#286EF2] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-medium">Keterangan Penawaran Terbaik</label>
                    <input
                      type="text"
                      value={data.bestOffer || ''}
                      onChange={(e) => setData({ ...data, bestOffer: e.target.value })}
                      className="mt-0.5 w-full rounded-xl border border-blue-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-[#286EF2] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 10. Rating */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-amber-800">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  <span>10. Rating Wisata</span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-500 font-medium">Skor Rating (1-5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={data.rating || 4.9}
                      onChange={(e) => setData({ ...data, rating: Number(e.target.value) })}
                      className="mt-0.5 w-full rounded-xl border border-amber-200 bg-white px-3 py-1.5 text-xs font-bold text-amber-900 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-medium">Jumlah Ulasan</label>
                    <input
                      type="number"
                      value={data.totalReviews || 128}
                      onChange={(e) => setData({ ...data, totalReviews: Number(e.target.value) })}
                      className="mt-0.5 w-full rounded-xl border border-amber-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-amber-700 font-semibold">
                  ★ {data.rating || 4.9} dari {data.totalReviews || 128} wisatawan terverifikasi
                </p>
              </div>
            </div>

            {/* 11. Prediksi Kepadatan */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600">
                <Users className="h-3.5 w-3.5 text-slate-500" />
                <span>11. Prediksi Kepadatan Pengunjung</span>
              </label>
              <input
                type="text"
                value={data.crowdPrediction || ''}
                onChange={(e) => setData({ ...data, crowdPrediction: e.target.value })}
                placeholder="Contoh: Rendah (Pagi: 07-10) • Sedang (Siang) • Padat / Ramai (Sore: 15-18)"
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs text-slate-800 focus:border-[#286EF2] focus:outline-none"
              />
            </div>

            {/* 12. Rekomendasi */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600">
                <ThumbsUp className="h-3.5 w-3.5 text-emerald-600" />
                <span>12. Rekomendasi Wisatawan</span>
              </label>
              <textarea
                rows={2}
                value={data.recommendation || ''}
                onChange={(e) => setData({ ...data, recommendation: e.target.value })}
                placeholder="Rekomendasi jam kunjungan, spot favorit, dan tips liburan terbaik..."
                className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:border-[#286EF2] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Kolom Kanan: 7. Fasilitas & Tata Tertib */}
        <div className="flex flex-col gap-6">
          {/* 7. Fasilitas */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">7. Fasilitas Wisata</h2>
                <p className="text-xs text-slate-500">Fasilitas yang disediakan untuk wisatawan.</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                {data.facilities.length} Pos
              </span>
            </div>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newFacility}
                onChange={(e) => setNewFacility(e.target.value)}
                placeholder="Tambah fasilitas..."
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#286EF2] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddFacility}
                className="rounded-xl bg-[#286EF2] px-3 py-2 text-xs font-bold text-white hover:bg-blue-600 transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <ul className="mt-3 space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {data.facilities.map((fac, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between rounded-xl bg-blue-50/60 px-3 py-2 text-xs text-slate-700 border border-blue-100/60"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-[#286EF2]" />
                    {fac}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFacility(idx)}
                    className="text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tata Tertib / Peraturan Tambahan */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card">
            <h2 className="text-base font-bold text-slate-900">Tata Tertib Kunjungan</h2>
            <p className="text-xs text-slate-500">Aturan kepatuhan bagi seluruh wisatawan.</p>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                placeholder="Tambah peraturan..."
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#286EF2] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddRule}
                className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <ul className="mt-3 space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {data.rules.map((rule, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-700 border border-slate-200/60"
                >
                  <span className="flex items-center gap-2">
                    <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
                    {rule}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRule(idx)}
                    className="text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
}
