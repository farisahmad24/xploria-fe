import type {
  DestinationInfo,
  OperationalExpense,
  RevenueShareItem,
  StaffMember,
  VisitorCategoryStat,
  VisitorReview,
} from '@/types/roles';

export const initialStaffMembers: StaffMember[] = [
  {
    id: 'st-01',
    name: 'Budi Santoso, S.Par',
    email: 'budi.santoso@Ploria.id',
    phone: '0812-3456-7890',
    role: 'Manager Operasional',
    status: 'aktif',
    joinedDate: '15 Jan 2024',
  },
  {
    id: 'st-02',
    name: 'M. Hasan Al-Farisi',
    email: 'hasan.alfarisi@Ploria.id',
    phone: '0813-9876-5432',
    role: 'Admin Manajer',
    status: 'aktif',
    joinedDate: '01 Mar 2024',
  },
  {
    id: 'st-03',
    name: 'Siti Rahmawati',
    email: 'siti.rahma@Ploria.id',
    phone: '0856-1122-3344',
    role: 'Petugas Kasir Tiket',
    status: 'aktif',
    joinedDate: '10 Mei 2024',
  },
  {
    id: 'st-04',
    name: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@Ploria.id',
    phone: '0878-5566-7788',
    role: 'Petugas Kasir Tiket',
    status: 'aktif',
    joinedDate: '01 Jun 2024',
  },
  {
    id: 'st-05',
    name: 'Dewi Lestari',
    email: 'dewi.lestari@Ploria.id',
    phone: '0819-2233-4455',
    role: 'Petugas Validasi Lapangan',
    status: 'aktif',
    joinedDate: '15 Jul 2024',
  },
];

export const initialVisitorCategoryStats: VisitorCategoryStat[] = [
  {
    id: 'dewasa',
    name: 'Dewasa',
    count: 1420,
    revenue: 49700000,
    percentage: 55,
    color: 'bg-ocean-500',
  },
  {
    id: 'anak',
    name: 'Anak-anak',
    count: 650,
    revenue: 9750000,
    percentage: 25,
    color: 'bg-emerald-500',
  },
  {
    id: 'keluarga',
    name: 'Paket Keluarga',
    count: 380,
    revenue: 41800000,
    percentage: 15,
    color: 'bg-amber-500',
  },
  {
    id: 'mancanegara',
    name: 'Wisatawan Mancanegara',
    count: 130,
    revenue: 9750000,
    percentage: 5,
    color: 'bg-rose-500',
  },
];

export const initialRevenueShare: RevenueShareItem[] = [
  {
    id: 'rs-1',
    entity: 'Manajer Desa Wisata (BUMDes)',
    sharePercentage: 40,
    amount: 44400000,
    status: 'Disetujui',
    period: 'November 2026',
  },
  {
    id: 'rs-2',
    entity: 'Manajemen Operasional Wisata',
    sharePercentage: 35,
    amount: 38850000,
    status: 'Diproses',
    period: 'November 2026',
  },
  {
    id: 'rs-3',
    entity: 'Dana Pemeliharaan & Konservasi',
    sharePercentage: 15,
    amount: 16650000,
    status: 'Disetujui',
    period: 'November 2026',
  },
  {
    id: 'rs-4',
    entity: 'Kas Pemberdayaan Warga Lokal',
    sharePercentage: 10,
    amount: 11100000,
    status: 'Ditransfer',
    period: 'November 2026',
  },
];

export const initialOperationalExpenses: OperationalExpense[] = [
  {
    id: 'exp-1',
    category: 'Gaji & Honor Staf',
    description: 'Honor petugas kebersihan & keamanan loket minggu ke-1',
    amount: 8500000,
    date: '08 Nov 2026',
    approvedBy: 'Budi Santoso',
  },
  {
    id: 'exp-2',
    category: 'Listrik & Utilitas',
    description: 'Tagihan PLN penerangan pantai dan pos tiket',
    amount: 2350000,
    date: '06 Nov 2026',
    approvedBy: 'Budi Santoso',
  },
  {
    id: 'exp-3',
    category: 'Kebersihan & Lingkungan',
    description: 'Pengadaan tempat sampah organik dan kantong daur ulang',
    amount: 1200000,
    date: '04 Nov 2026',
    approvedBy: 'M. Hasan',
  },
  {
    id: 'exp-4',
    category: 'Pemeliharaan Wahana',
    description: 'Servis pelampung safety & gazebo dermaga pantai',
    amount: 3400000,
    date: '02 Nov 2026',
    approvedBy: 'M. Hasan',
  },
];

export const initialDestinationInfo: DestinationInfo = {
  // 1. Gambar (bisa lebih dari 1)
  images: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
  ],
  // 2. Nama Tempat
  name: 'Pantai Ploria Indah',
  tagline: 'Pesona Bahari Tropis & Konservasi Terumbu Karang',
  // 3. Lokasi
  location: 'Jl. Bahari Nusantara No. 88, Desa Wisata Karang Indah, Malang, Jawa Timur',
  // 4. Jam Operasional
  openHours: 'Setiap Hari: 07:00 - 18:00 WIB (Gate ditutup 17.30 WIB)',
  // 5. Deskripsi
  description:
    'Destinasi wisata pesisir unggulan dengan panorama pasir putih halus, air laut turquoise, serta fasilitas lengkap rekreasi keluarga. Dilengkapi spot snorkeling, gazebo teduh di tepi pantai, dan pusat kuliner hidangan laut segar khas nusantara.',
  // 6. Himbauan / Informasi Penting (Jika Ada)
  importantNotice:
    'Seluruh pengunjung wajib mengenakan pelampung keselamatan saat bermain wahana air. Dilarang membawa botol kaca dan sampah plastik ke bibir pantai demi kelestarian ekosistem terumbu karang.',
  // 7. Fasilitas
  facilities: [
    'Gazebo Pantai & Tempat Santai',
    'Pusat Snorkeling & Penyewaan Alat',
    'Spot Foto Sunset Dermaga',
    'Musholla & Ruang Ganti Bersih',
    'Sentra Kuliner Makanan Laut',
    'Area Parkir Luas & Keamanan 24 Jam',
    'Pos Medis & Lifeguard Siaga',
  ],
  // 8. Kontak Manajer
  contactPhone: '+62 812-3456-7890 / (021) 7890-4321',
  contactEmail: 'info@ploria.id',
  managerContact: 'Budi Santoso, S.Par (Manajer Operasional Wisata - 0812-9876-5432)',
  // 9. Pilihan tiket (harga terendah/penawaran terbaik)
  lowestTicketPrice: 15000,
  bestOffer: 'Mulai dari Rp 15.000 / orang (Diskon 10% untuk Paket Keluarga Bahari)',
  // 10. Rating
  rating: 4.9,
  totalReviews: 128,
  // 11. Prediksi Kepadatan
  crowdPrediction: 'Rendah (Pagi: 07.00 - 10.00) • Sedang (Siang: 10.00 - 14.00) • Padat / Ramai (Sore: 14.00 - 17.30)',
  // 12. Rekomendasi
  recommendation:
    'Waktu terbaik berkunjung pukul 15.30 WIB untuk menikmati panorama matahari terbenam (sunset) dan wahana snorkeling air jernih.',
  rules: [
    'Wajib menunjukkan tiket resmi di pintu masuk',
    'Dilarang merusak terumbu karang & biota laut',
    'Buang sampah pada tempat yang disediakan',
    'Anak-anak wajib didampingi saat berenang di tepi laut',
  ],
};

export const initialReviews: VisitorReview[] = [
  {
    id: 'rev-1',
    userName: 'Rendra Pratama',
    rating: 5,
    date: '10 Nov 2026',
    ticketCode: 'TK-20261108-001',
    comment:
      'Pantainya sangat bersih dan fasilitas gazebonya nyaman sekali! Sistem tiket QR-nya juga sangat cepat, tidak perlu antre panjang di pintu masuk.',
    reply: {
      author: 'Budi Santoso',
      role: 'Manager Operasional',
      message:
        'Terima kasih banyak atas kunjungannya Mas Rendra! Senang mendengar liburan keluarga Anda menyenangkan di Ploria.',
      date: '10 Nov 2026',
    },
  },
  {
    id: 'rev-2',
    userName: 'Citra Dewi Kusuma',
    rating: 4,
    date: '09 Nov 2026',
    ticketCode: 'TK-20261108-002',
    comment:
      'Pemandangan sunset dari dermaga luar biasa indahnya. Saran saya mohon ditambah penunjuk arah ke toilet di area barat pantai.',
    reply: {
      author: 'M. Hasan Al-Farisi',
      role: 'Admin Manajer',
      message:
        'Terima kasih atas saran berharga Mbak Citra. Tim kami sedang memasang papan petunjuk arah tambahan di zona barat minggu ini.',
      date: '09 Nov 2026',
    },
  },
  {
    id: 'rev-3',
    userName: 'Michael Anderson',
    rating: 5,
    date: '08 Nov 2026',
    ticketCode: 'TK-20261108-004',
    comment:
      'Amazing experience! The coral reefs are pristine and the local guide was very knowledgeable and friendly. Highly recommended!',
  },
  {
    id: 'rev-4',
    userName: 'Anisa Maharani',
    rating: 4,
    date: '07 Nov 2026',
    ticketCode: 'TK-20261107-010',
    comment:
      'Paket keluarga sangat hemat dan pas. Anak-anak sangat menikmati pantai. Hanya saja saat jam makan siang food court cukup ramai.',
  },
  {
    id: 'rev-5',
    userName: 'Bambang Sudiro',
    rating: 3,
    date: '06 Nov 2026',
    ticketCode: 'TK-20261106-008',
    comment:
      'Pemandangan alam pantai luar biasa indah. Namun saat jam sibuk akhir pekan antrean di toilet umum dan mushola cukup panjang. Perlu penambahan fasilitas sanitasi.',
    reply: {
      author: 'M. Hasan Al-Farisi',
      role: 'Admin Manajer',
      message:
        'Terima kasih banyak atas evaluasinya Pak Bambang. Kami sedang menjadwalkan pembangunan fasilitas bilas dan toilet tambahan di sisi timur pantai.',
      date: '07 Nov 2026',
    },
  },
  {
    id: 'rev-6',
    userName: 'Dewi Anggraini',
    rating: 3,
    date: '05 Nov 2026',
    ticketCode: 'TK-20261105-012',
    comment:
      'Spot foto pantai sangat estetik untuk konten media sosial. Sayangnya debit air bilas air tawar agak mengecil saat sore hari setelah pengunjung ramai.',
  },
  {
    id: 'rev-7',
    userName: 'Hendra Gunawan',
    rating: 3,
    date: '04 Nov 2026',
    ticketCode: 'TK-20261104-015',
    comment:
      'Secara keseluruhan tempat wisata tertata rapi. Hanya saja kapasitas kantong parkir kendaraan roda empat perlu diperluas agar tidak macet di gerbang masuk.',
  },
];

export const initialBookingSchedule = [
  {
    date: '2026-11-11',
    title: 'Hari Ini',
    totalVisitors: 85,
    totalBookings: 6,
    highlight: true,
  },
  {
    date: '2026-11-12',
    title: 'Besok',
    totalVisitors: 110,
    totalBookings: 8,
    highlight: false,
  },
  {
    date: '2026-11-13',
    title: 'Jumat',
    totalVisitors: 140,
    totalBookings: 11,
    highlight: false,
  },
  {
    date: '2026-11-14',
    title: 'Sabtu (Weekend)',
    totalVisitors: 320,
    totalBookings: 24,
    highlight: true,
  },
  {
    date: '2026-11-15',
    title: 'Minggu (Weekend)',
    totalVisitors: 410,
    totalBookings: 32,
    highlight: true,
  },
  {
    date: '2026-11-16',
    title: 'Senin',
    totalVisitors: 65,
    totalBookings: 5,
    highlight: false,
  },
  {
    date: '2026-11-17',
    title: 'Selasa',
    totalVisitors: 90,
    totalBookings: 7,
    highlight: false,
  },
];

