import type { CloseOrderRecap } from '@/types/ticket';

export const initialCloseOrderRecaps: CloseOrderRecap[] = [
  {
    id: 'RCP-20261110-01',
    closedAt: '10 Nov 2026, 17:00 WIB',
    sessionOpenedAt: '10 Nov 2026, 07:30 WIB',
    cashierName: 'Siti Rahmawati (Loket 1)',
    totalRevenue: 2850000,
    totalTransactions: 32,
    totalTicketsSold: 88,
    breakdownBookingType: {
      hariIniCount: 24,
      hariIniRevenue: 2150000,
      bookingCount: 8,
      bookingRevenue: 700000,
    },
    breakdownTicketItems: [
      { name: 'Dewasa', quantity: 52, revenue: 1820000 },
      { name: 'Anak-anak', quantity: 24, revenue: 360000 },
      { name: 'Paket Keluarga', quantity: 8, revenue: 520000 },
      { name: 'Wisatawan Mancanegara', quantity: 4, revenue: 150000 },
    ],
    breakdownPayment: {
      cash: 1250000,
      qris: 1100000,
      ewallet: 300000,
      transfer: 200000,
    },
  },
  {
    id: 'RCP-20261109-01',
    closedAt: '09 Nov 2026, 17:00 WIB',
    sessionOpenedAt: '09 Nov 2026, 07:30 WIB',
    cashierName: 'Ahmad Fauzi (Loket 2)',
    totalRevenue: 3420000,
    totalTransactions: 40,
    totalTicketsSold: 112,
    breakdownBookingType: {
      hariIniCount: 31,
      hariIniRevenue: 2680000,
      bookingCount: 9,
      bookingRevenue: 740000,
    },
    breakdownTicketItems: [
      { name: 'Dewasa', quantity: 70, revenue: 2450000 },
      { name: 'Anak-anak', quantity: 30, revenue: 450000 },
      { name: 'Paket Keluarga', quantity: 6, revenue: 420000 },
      { name: 'Wisatawan Mancanegara', quantity: 6, revenue: 100000 },
    ],
    breakdownPayment: {
      cash: 1600000,
      qris: 1420000,
      ewallet: 250000,
      transfer: 150000,
    },
  },
];

