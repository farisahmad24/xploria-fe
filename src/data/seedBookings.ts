import type { Booking } from '@/types/ticket';

export const seedBookings: Booking[] = [
  {
    id: 'seed-1',
    code: 'TK-20261108-001',
    visitorName: 'Andi Pratama',
    phone: '081234567890',
    visitDate: '2026-11-12',
    items: [
      { categoryId: 'dewasa', name: 'Dewasa', unitPrice: 35000, quantity: 2 },
      { categoryId: 'anak', name: 'Anak-anak', unitPrice: 15000, quantity: 1 },
    ],
    total: 85000,
    status: 'validated',
    createdAt: '2026-11-08T08:15:00.000Z',
    validatedAt: '2026-11-08T08:40:00.000Z',
  },
  {
    id: 'seed-2',
    code: 'TK-20261108-002',
    visitorName: 'Siti Rahayu',
    phone: '081398765432',
    visitDate: '2026-11-14',
    items: [{ categoryId: 'keluarga', name: 'Paket Keluarga', unitPrice: 110000, quantity: 1 }],
    total: 110000,
    status: 'booked',
    createdAt: '2026-11-08T09:30:00.000Z',
    validatedAt: null,
  },
];
