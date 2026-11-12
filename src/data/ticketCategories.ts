import type { TicketCategory } from '@/types/ticket';

export const ticketCategories: TicketCategory[] = [
  {
    id: 'dewasa',
    name: 'Dewasa',
    description: 'Akses penuh area pantai dan gazebo',
    price: 35000,
  },
  {
    id: 'anak',
    name: 'Anak-anak',
    description: 'Usia 3 sampai 12 tahun',
    price: 15000,
  },
  {
    id: 'keluarga',
    name: 'Paket Keluarga',
    description: 'Berlaku untuk 4 orang, termasuk 1 sesi foto',
    price: 110000,
  },
  {
    id: 'mancanegara',
    name: 'Wisatawan Mancanegara',
    description: 'Tiket internasional dengan pemandu lokal',
    price: 75000,
  },
];
