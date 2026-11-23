export type TicketCategory = {
  id: string;
  name: string;
  description: string;
  price: number;
};

export type TicketItem = {
  id: string;
  // 1. Kategori Tiket
  categoryId: string;
  // 2. Nama Jenis Tiket
  name: string;
  // 3. Harga Default
  price: number;
  // 4. Harga Diskon
  discountPrice?: number;
  // 5. Masa Berlaku Tiket
  validityPeriod?: string;
  // 6. Informasi Pengembalian Dana
  refundInfo?: string;
  isRefundable?: boolean;
  // 7. Fasilitas (Yang termasuk dan tidak)
  facilities: string;
  includedFacilities?: string[];
  excludedFacilities?: string[];
  // 8. Syarat dan Ketentuan
  terms: string;
  // 9. Diskon (opsional)
  discount: number; // Diskon (%)
  potonganHarga?: number; // Potongan harga (nominal Rp)
  // 10. Cara Tukar tiket
  howToRedeem?: string;
  isVisible: boolean; // Visibilitas Tiket (Tampil/Sembunyi)
  createdAt: string;
};

export type BookingItem = {
  categoryId: string;
  name: string;
  unitPrice: number;
  quantity: number;
};

export type BookingStatus = 'booked' | 'validated';

export type BookingType = 'hari_ini' | 'mendatang';

export type PaymentMethod = 'cash' | 'qris' | 'ewallet' | 'transfer';

export type Booking = {
  id: string;
  // 11. No Invoice
  invoiceNo?: string;
  // 12. No Pesanan
  orderNo?: string;
  code: string; // Kode tiket / No Pesanan
  visitorName: string;
  phone: string;
  // 16. Tanggal Kunjungan
  visitDate: string;
  durationDays?: number;
  visitEndDate?: string;
  items: BookingItem[];
  subtotal?: number;
  discountAmount?: number;
  // 13. Total Harga
  total: number;
  totalPrice?: number;
  // 14. Barcode
  barcode?: string;
  // 15. Jumlah Tiket
  ticketCount?: number;
  status: BookingStatus;
  bookingType: BookingType;
  paymentMethod: PaymentMethod;
  createdAt: string;
  validatedAt: string | null;
  cashierName?: string;
};

export type mendatang = Booking;

export type BookingDraft = {
  visitorName: string;
  phone: string;
  visitDate: string;
  durationDays?: number;
  visitEndDate?: string;
  quantities: Record<string, number>;
  bookingType: BookingType;
  paymentMethod: PaymentMethod;
  discountType?: 'percent' | 'nominal';
  discountValue?: number;
  discountAmount?: number;
};

export type DraftErrors = Partial<
  Record<'visitorName' | 'phone' | 'visitDate' | 'quantities' | 'bookingType' | 'paymentMethod', string>
>;

export type ValidationResult =
  | { kind: 'valid'; mendatang: mendatang }
  | { kind: 'already_validated'; mendatang: mendatang }
  | { kind: 'not_found' };

export type CloseOrderRecap = {
  id: string;
  closedAt: string;
  sessionOpenedAt: string;
  cashierName: string;
  totalRevenue: number;
  totalTransactions: number;
  totalTicketsSold: number;
  breakdownBookingType: {
    hariIniCount: number;
    hariIniRevenue: number;
    bookingCount: number;
    bookingRevenue: number;
  };
  breakdownTicketItems: {
    name: string;
    quantity: number;
    revenue: number;
  }[];
  breakdownPayment: {
    cash: number;
    qris: number;
    ewallet: number;
    transfer: number;
  };
};
