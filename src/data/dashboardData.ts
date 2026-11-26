export type ChartRange = {
  id: string;
  label: string;
  labels: string[];
  values: number[];
};

export type StatItem = {
  id: 'tickets' | 'validated' | 'visitors' | 'revenue';
  label: string;
  value: string;
  change: string;
  spark: number[];
};

export type ActivityItem = {
  id: string;
  title: string;
  time: string;
  tone: 'blue' | 'emerald' | 'amber';
};

export type BannerSlide = {
  id: string;
  src: string;
  alt: string;
};

export const chartRanges: ChartRange[] = [
  {
    id: '7d',
    label: '7 Hari Terakhir',
    labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
    values: [720, 1380, 1000, 1520, 1460, 1620, 1980],
  },
  {
    id: '30d',
    label: '30 Hari Terakhir',
    labels: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    values: Array.from({ length: 30 }, (_, i) => 900 + Math.round(520 * Math.sin(i / 3.2)) + i * 22),
  },
];

export const statItems: StatItem[] = [
  {
    id: 'tickets',
    label: 'Total Tiket Terjual',
    value: '2.540',
    change: '+12%',
    spark: [18, 24, 20, 30, 26, 34, 38],
  },
  {
    id: 'validated',
    label: 'Tiket Tervalidasi Masuk',
    value: '2.180',
    change: '+15%',
    spark: [22, 20, 28, 24, 30, 27, 33],
  },
  {
    id: 'visitors',
    label: 'Pengunjung Hari Ini',
    value: '18.750',
    change: '+18%',
    spark: [14, 22, 18, 28, 25, 32, 36],
  },
  {
    id: 'revenue',
    label: 'Pendapatan Tiket',
    value: 'Rp 125.000.000',
    change: '+20%',
    spark: [12, 18, 16, 26, 22, 30, 37],
  },
];

export const bannerSlides: BannerSlide[] = [
  {
    id: 'slide-1',
    src: '/slide1.jpg',
    alt: 'Pantai Berbatu Eksotis',
  },
  {
    id: 'slide-2',
    src: '/slide2.jpg',
    alt: 'Wisata Alam Liar - Kawanan Gajah',
  },
  {
    id: 'slide-3',
    src: '/slide3.jpg',
    alt: 'Air Terjun Tersembunyi di Hutan Tropis',
  },
];
