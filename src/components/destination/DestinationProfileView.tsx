import { useState } from 'react';
import {
  Clock,
  Compass,
  FileCheck,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from 'lucide-react';
import type { DestinationInfo } from '@/types/roles';

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
  const [data, setData] = useState<DestinationInfo>(initialData);
  const [newFacility, setNewFacility] = useState('');
  const [newRule, setNewRule] = useState('');

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
    onToast('Profil dan informasi destinasi wisata berhasil diperbarui!');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-ocean-600">
            Manajemen Informasi Destinasi
          </p>
          <h1 className="mt-1 text-2xl font-bold text-ocean-900 sm:text-3xl">
            Kelola Profil & Informasi Wisata
          </h1>
          <p className="text-sm text-slate-500">
            Perbarui data publik destinasi wisata, jam operasional, kontak, dan fasilitas.
          </p>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-ocean-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-ocean-600/25 transition hover:bg-ocean-700"
        >
          <Save className="h-4 w-4" />
          Simpan Perubahan
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Details */}
        <div className="flex flex-col gap-5 rounded-3xl border border-ocean-100 bg-white p-6 shadow-card lg:col-span-2">
          <div className="flex items-center gap-2.5 border-b border-ocean-50 pb-4">
            <Compass className="h-5 w-5 text-ocean-600" />
            <h2 className="text-base font-bold text-slate-900">Informasi Umum Destinasi</h2>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Nama Objek Wisata
              </label>
              <input
                type="text"
                required
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-ocean-500 focus:outline-none focus:ring-4 focus:ring-ocean-50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Slogan / Tagline
              </label>
              <input
                type="text"
                required
                value={data.tagline}
                onChange={(e) => setData({ ...data, tagline: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-ocean-500 focus:outline-none focus:ring-4 focus:ring-ocean-50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Deskripsi Lengkap Wisata
              </label>
              <textarea
                rows={4}
                required
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm leading-relaxed text-slate-800 focus:border-ocean-500 focus:outline-none focus:ring-4 focus:ring-ocean-50"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Lokasi / Alamat
                </label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={data.location}
                    onChange={(e) => setData({ ...data, location: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:border-ocean-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Jam Buka Operasional
                </label>
                <div className="relative mt-1">
                  <Clock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={data.openHours}
                    onChange={(e) => setData({ ...data, openHours: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:border-ocean-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Kontak Telepon / WhatsApp
                </label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={data.contactPhone}
                    onChange={(e) => setData({ ...data, contactPhone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:border-ocean-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Email Informasi
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={data.contactEmail}
                    onChange={(e) => setData({ ...data, contactEmail: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 focus:border-ocean-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Facilities & Rules */}
        <div className="flex flex-col gap-6">
          {/* Facilities */}
          <div className="rounded-3xl border border-ocean-100 bg-white p-6 shadow-card">
            <h2 className="text-base font-bold text-slate-900">Daftar Fasilitas Wisata</h2>
            <p className="text-xs text-slate-500">Fasilitas yang dapat dinikmati pengunjung.</p>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newFacility}
                onChange={(e) => setNewFacility(e.target.value)}
                placeholder="Tambah fasilitas..."
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-ocean-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddFacility}
                className="rounded-xl bg-ocean-600 px-3 py-2 text-xs font-bold text-white hover:bg-ocean-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <ul className="mt-3 space-y-1.5">
              {data.facilities.map((fac, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between rounded-xl bg-ocean-50/70 px-3 py-2 text-xs text-slate-700"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-ocean-600" />
                    {fac}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFacility(idx)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Rules */}
          <div className="rounded-3xl border border-ocean-100 bg-white p-6 shadow-card">
            <h2 className="text-base font-bold text-slate-900">Tata Tertib & Peraturan</h2>
            <p className="text-xs text-slate-500">Ketentuan wajib bagi seluruh wisatawan.</p>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                placeholder="Tambah peraturan..."
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-ocean-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddRule}
                className="rounded-xl bg-ocean-600 px-3 py-2 text-xs font-bold text-white hover:bg-ocean-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <ul className="mt-3 space-y-1.5">
              {data.rules.map((rule, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-700"
                >
                  <span className="flex items-center gap-2">
                    <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
                    {rule}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRule(idx)}
                    className="text-slate-400 hover:text-rose-600"
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

