import React, { useState } from 'react';
import {
  Building2,
  Check,
  Compass,
  FileUp,
  MapPin,
  Plus,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import type { MitraAccount, MitraCategory } from '@/types/superAdmin';

export interface NewMitraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMitra?: (newMitra: MitraAccount) => void;
  onSubmit?: (newMitra: MitraAccount) => void;
}

const TEMPLATES = [
  {
    destinationName: 'Pantai Klayar Seruling Samudra',
    category: 'Pantai & Bahari' as MitraCategory,
    city: 'Kabupaten Pacitan',
    province: 'Jawa Timur',
    address: 'Desa Sendang, Kec. Donorojo, Pacitan',
    coordinates: '-8.225190, 110.952109',
    description: 'Pantai berpasir putih dengan bebatuan karang berbentuk Sphinx dan fenomena semburan air seruling samudra.',
    ticketPriceRange: 'Rp 15.000 - Rp 30.000',
    picName: 'Danang Prasetyo, S.Sos',
    picNik: '3501021908860002',
    picPosition: 'Ketua BUMDes Sendang Berkah',
    picEmail: 'danang.klayar@gmail.com',
    picWa: '081234567812',
    nibNumber: '0220109988123',
    bankName: 'Bank BRI (Persero) Tbk',
    bankNumber: '0019-01-098234-50-2',
    bankHolder: 'BUMDes Sendang Berkah Klayar',
    docType: 'SK Pokdarwis' as const,
  },
  {
    destinationName: 'Kawasan Wisata Candi Gedong Songo',
    category: 'Budaya & Sejarah' as MitraCategory,
    city: 'Kabupaten Semarang',
    province: 'Jawa Tengah',
    address: 'Candi, Krajan, Banyukuning, Kec. Bandungan',
    coordinates: '-7.204891, 110.342190',
    description: 'Kompleks sembilan candi Hindu peninggalan abad ke-8 di lereng Gunung Ungaran berketinggian 1.200 mdpl dengan pemandian air hangat belerang.',
    ticketPriceRange: 'Rp 20.000 - Rp 75.000',
    picName: 'Rina Kusumaningrum, M.Par',
    picNik: '3322041209840003',
    picPosition: 'Manajer Pengelola Kawasan Cagar Budaya',
    picEmail: 'rina.gedongsongo@gmail.com',
    picWa: '085640199234',
    nibNumber: '9120008876123',
    bankName: 'Bank Jateng',
    bankNumber: '102-390-119284',
    bankHolder: 'Pengelola Candi Gedong Songo Semarang',
    docType: 'Izin Usaha Pariwisata (TDUP)' as const,
  },
  {
    destinationName: 'Taman Kelinci & Agro Edukasi Pujon Kidul',
    category: 'Agrowisata & Edukasi' as MitraCategory,
    city: 'Kabupaten Malang',
    province: 'Jawa Timur',
    address: 'Desa Wisata Pujon Kidul, Kec. Pujon',
    coordinates: '-7.848912, 112.482190',
    description: 'Desa wisata agro terpadu dengan kafe sawah berlatar Gunung Dorowati, petik sayur organik, dan edukasi peternakan sapi perah.',
    ticketPriceRange: 'Rp 15.000 - Rp 25.000',
    picName: 'Umar Farouq',
    picNik: '3507021405890001',
    picPosition: 'Kepala Pengelola BUMDes Pujon Kidul',
    picEmail: 'umar.pujonkidul@gmail.com',
    picWa: '081333456789',
    nibNumber: '0220998811234',
    bankName: 'Bank Mandiri (Persero) Tbk',
    bankNumber: '144-00-1928374-9',
    bankHolder: 'BUMDes Sumber Sejahtera Pujon Kidul',
    docType: 'NIB Berbasis Risiko' as const,
  },
];

export function NewMitraModal({ isOpen, onClose, onAddMitra, onSubmit }: NewMitraModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<number>(0);
  const [destinationName, setDestinationName] = useState(TEMPLATES[0].destinationName);
  const [category, setCategory] = useState<MitraCategory>(TEMPLATES[0].category);
  const [city, setCity] = useState(TEMPLATES[0].city);
  const [province, setProvince] = useState(TEMPLATES[0].province);
  const [address, setAddress] = useState(TEMPLATES[0].address);
  const [picName, setPicName] = useState(TEMPLATES[0].picName);
  const [picNik, setPicNik] = useState(TEMPLATES[0].picNik);
  const [picEmail, setPicEmail] = useState(TEMPLATES[0].picEmail);
  const [picWa, setPicWa] = useState(TEMPLATES[0].picWa);
  const [bankName, setBankName] = useState(TEMPLATES[0].bankName);
  const [bankAccount, setBankAccount] = useState(TEMPLATES[0].bankNumber);
  const [bankHolder, setBankHolder] = useState(TEMPLATES[0].bankHolder);

  const handleApplyTemplate = (index: number) => {
    setSelectedTemplate(index);
    const t = TEMPLATES[index];
    setDestinationName(t.destinationName);
    setCategory(t.category);
    setCity(t.city);
    setProvince(t.province);
    setAddress(t.address);
    setPicName(t.picName);
    setPicNik(t.picNik);
    setPicEmail(t.picEmail);
    setPicWa(t.picWa);
    setBankName(t.bankName);
    setBankAccount(t.bankNumber);
    setBankHolder(t.bankHolder);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = TEMPLATES[selectedTemplate] || TEMPLATES[0];
    const newId = `MITRA-2026-${String(Math.floor(Math.random() * 900) + 100)}`;

    const newMitra: MitraAccount = {
      id: newId,
      destinationName,
      category,
      address,
      district: 'Pusat Wisata',
      city,
      province,
      coordinates: t.coordinates,
      registrationDate: 'Hari ini, Baru saja',
      status: 'PENDING',
      description: t.description,
      ticketPriceRange: t.ticketPriceRange,
      pic: {
        fullName: picName,
        nik: picNik,
        position: t.picPosition,
        email: picEmail,
        whatsapp: picWa,
      },
      documents: {
        ktpNumber: picNik,
        ktpUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop',
        nibNumber: t.nibNumber,
        nibUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop',
        bankName,
        bankAccountNumber: bankAccount,
        bankAccountHolder: bankHolder,
        bankBookUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop',
        documentType: t.docType,
        issueDate: '2024',
      },
    };

    (onSubmit || onAddMitra)?.(newMitra);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#286EF2] text-white">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
              <Sparkles className="h-5 w-5 text-white" />
            </span>
            <div>
              <h3 className="text-base font-black">Simulasi Masuk Pendaftaran Mitra Baru</h3>
              <p className="text-xs text-blue-100">
                Generate calon mitra berstatus <span className="font-bold underline">PENDING</span> untuk pengujian alur verifikasi
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-white/80 hover:bg-white/20 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Preset Template Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Pilih Template Simulasi Cepat (Rekomendasi):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyTemplate(idx)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    selectedTemplate === idx
                      ? 'border-[#286EF2] bg-blue-50/70 ring-2 ring-blue-100'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-slate-800 truncate">{tmpl.destinationName}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{tmpl.city}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-3">
            <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-[#286EF2]" />
              <span>Identitas Destinasi Calon Mitra</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Nama Objek Wisata
                </label>
                <input
                  type="text"
                  required
                  value={destinationName}
                  onChange={(e) => setDestinationName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#286EF2]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Kategori Wisata
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MitraCategory)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#286EF2]"
                >
                  <option value="Pantai & Bahari">Pantai & Bahari</option>
                  <option value="Pegunungan & Alam">Pegunungan & Alam</option>
                  <option value="Taman Rekreasi & Hiburan">Taman Rekreasi & Hiburan</option>
                  <option value="Budaya & Sejarah">Budaya & Sejarah</option>
                  <option value="Agrowisata & Edukasi">Agrowisata & Edukasi</option>
                  <option value="Waterpark & Pemandian">Waterpark & Pemandian</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Kabupaten / Kota
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#286EF2]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Provinsi
                </label>
                <input
                  type="text"
                  required
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#286EF2]"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-3">
            <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-emerald-600" />
              <span>Data Penanggung Jawab (PIC) & Rekening</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Nama PIC
                </label>
                <input
                  type="text"
                  required
                  value={picName}
                  onChange={(e) => setPicName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#286EF2]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  NIK PIC
                </label>
                <input
                  type="text"
                  required
                  value={picNik}
                  onChange={(e) => setPicNik(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-mono font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#286EF2]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Bank Pencairan
                </label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#286EF2]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Nama Pemilik Rekening
                </label>
                <input
                  type="text"
                  required
                  value={bankHolder}
                  onChange={(e) => setBankHolder(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#286EF2]"
                />
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#286EF2] text-white font-bold hover:bg-blue-600 transition shadow-md shadow-blue-500/25 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span>Simulasikan Pendaftaran</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewMitraModal;

