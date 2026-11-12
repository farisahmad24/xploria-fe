export type TicketCategory = {
  id: string;
  name: string;
  description: string;
  price: number;
};

export type TicketItem = {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  facilities: string;
  terms: string;
  discount: number; // Diskon (persentase, misal 10 untuk 10%)
  potonganHarga?: number; // Potongan harga (nominal Rp langsung: Harga Tiket - Potongan Harga)
  isVisible: boolean; // Atur Visibilitas Tiket: true (Tampil), false (Sembunyi)
  createdAt: string;
};

export type BookingItem = {
  categoryId: string;
  name: string;
  unitPrice: number;
  quantity: number;
};

export type BookingStatus = 'booked' | 'validated';

export type BookingType = 'hari_ini' | 'booking';

export type PaymentMethod = 'cash' | 'qris' | 'ewallet' | 'transfer';

export type Booking = {
  id: string;
  code: string;
  visitorName: string;
  phone: string;
  visitDate: string;
  items: BookingItem[];
  subtotal?: number;
  discountAmount?: number;
  total: number;
  status: BookingStatus;
  bookingType: BookingType;
  paymentMethod: PaymentMethod;
  createdAt: string;
  validatedAt: string | null;
  cashierName?: string;
};

export type BookingDraft = {
  visitorName: string;
  phone: string;
  visitDate: string;
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
  | { kind: 'valid'; booking: Booking }
  | { kind: 'already_validated'; booking: Booking }
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
