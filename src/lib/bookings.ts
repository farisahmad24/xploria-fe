import type {
  Booking,
  BookingDraft,
  BookingItem,
  CloseOrderRecap,
  DraftErrors,
  TicketCategory,
  ValidationResult,
} from '@/types/ticket';
import type { ActivityItem } from '@/data/dashboardData';

export const MAX_QUANTITY_PER_CATEGORY = 20;

const numberFormatter = new Intl.NumberFormat('id-ID');
const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function formatNumber(value: number) {
  return numberFormatter.format(value);
}

export function formatRupiah(value: number) {
  return `Rp ${numberFormatter.format(value)}`;
}

export function formatVisitDate(isoDate: string) {
  return dateFormatter.format(new Date(`${isoDate}T00:00:00`));
}

export function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function countTickets(bookings: Booking[]) {
  return bookings.reduce(
    (sum, booking) => sum + booking.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );
}

export function countValidatedTickets(bookings: Booking[]) {
  return countTickets(bookings.filter((booking) => booking.status === 'validated'));
}

export function sumRevenue(bookings: Booking[]) {
  return bookings.reduce((sum, booking) => sum + booking.total, 0);
}

export function validateDraft(draft: BookingDraft, todayIso: string): DraftErrors {
  const errors: DraftErrors = {};
  const name = draft.visitorName.trim();
  const phone = draft.phone.replace(/[\s-]/g, '');

  if (name.length < 3) {
    errors.visitorName = 'Nama minimal 3 karakter';
  }
  if (!/^\+?[0-9]{9,15}$/.test(phone)) {
    errors.phone = 'Nomor telepon tidak valid (9-15 angka)';
  }
  if (!draft.visitDate) {
    errors.visitDate = 'Pilih tanggal kunjungan';
  } else if (draft.bookingType === 'booking' && draft.visitDate <= todayIso) {
    errors.visitDate = 'Pemesanan Booking wajib memilih tanggal kunjungan di masa mendatang';
  } else if (draft.visitDate < todayIso) {
    errors.visitDate = 'Tanggal kunjungan tidak boleh di masa lalu';
  }

  const totalQuantity = Object.values(draft.quantities).reduce((sum, qty) => sum + qty, 0);
  if (totalQuantity === 0) {
    errors.quantities = 'Pilih minimal 1 tiket';
  }

  return errors;
}

export function buildBookingItems(
  quantities: Record<string, number>,
  categories: TicketCategory[]
): BookingItem[] {
  return categories
    .filter((category) => (quantities[category.id] ?? 0) > 0)
    .map((category) => ({
      categoryId: category.id,
      name: category.name,
      unitPrice: category.price,
      quantity: quantities[category.id],
    }));
}

export function createBooking(
  draft: BookingDraft,
  categories: TicketCategory[],
  existing: Booking[],
  now: Date,
  cashierName?: string
): Booking {
  const items = buildBookingItems(draft.quantities, categories);
  const sequence = String(existing.length + 1).padStart(3, '0');
  const datePart = toIsoDate(now).replace(/-/g, '');
  const prefix = draft.bookingType === 'hari_ini' ? 'TK-TODAY' : 'TK-BOOK';
  const code = `${prefix}-${datePart}-${sequence}`;

  // Pemesanan Hari Ini (Walk-in):
  // "Tiket langsung berstatus Aktif / Valid dan siap untuk divalidasi di gerbang."
  const isHariIni = draft.bookingType === 'hari_ini';
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountAmount = Math.min(draft.discountAmount || 0, subtotal);
  const total = Math.max(0, subtotal - discountAmount);

  return {
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    code,
    visitorName: draft.visitorName.trim(),
    phone: draft.phone.replace(/[\s-]/g, ''),
    visitDate: draft.visitDate,
    items,
    subtotal,
    discountAmount,
    total,
    status: isHariIni ? 'validated' : 'booked',
    bookingType: draft.bookingType,
    paymentMethod: draft.paymentMethod,
    createdAt: now.toISOString(),
    validatedAt: isHariIni ? now.toISOString() : null,
    cashierName: cashierName || 'Siti Rahmawati (Kasir)',
  };
}

export function formatRelativeTime(iso: string, now: Date) {
  const minutes = Math.round((now.getTime() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return 'baru saja';
  if (minutes < 60) return `${minutes} menit yang lalu`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} jam yang lalu`;
  return `${Math.round(hours / 24)} hari yang lalu`;
}

export function buildActivityItems(bookings: Booking[], now: Date): ActivityItem[] {
  const events = bookings.flatMap((booking) => {
    const isWalkIn = booking.bookingType === 'hari_ini';
    const created = {
      id: `${booking.id}-created`,
      title: `${isWalkIn ? 'Pemesanan Hari Ini (Walk-in)' : 'Booking Tiket'} ${booking.code} oleh ${booking.visitorName}`,
      at: booking.createdAt,
      tone: isWalkIn ? ('emerald' as const) : ('blue' as const),
    };
    if (!booking.validatedAt || isWalkIn) return [created];
    return [
      created,
      {
        id: `${booking.id}-validated`,
        title: `Tiket Booking ${booking.code} divalidasi di gerbang`,
        at: booking.validatedAt,
        tone: 'emerald' as const,
      },
    ];
  });

  return events
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .map(({ id, title, at, tone }) => ({ id, title, time: formatRelativeTime(at, now), tone }));
}

export function validateTicketCode(
  bookings: Booking[],
  rawCode: string,
  now: Date
): { result: ValidationResult; bookings: Booking[] } {
  const code = rawCode.trim().toUpperCase();
  const booking = bookings.find((item) => item.code === code);

  if (!booking) {
    return { result: { kind: 'not_found' }, bookings };
  }
  if (booking.status === 'validated') {
    return { result: { kind: 'already_validated', booking }, bookings };
  }

  const validated: Booking = { ...booking, status: 'validated', validatedAt: now.toISOString() };
  return {
    result: { kind: 'valid', booking: validated },
    bookings: bookings.map((item) => (item.id === booking.id ? validated : item)),
  };
}

// ── Automatic Sales Recap Generator ──────────────────────────────────────────
export function generateCloseOrderRecap(
  bookings: Booking[],
  cashierName: string,
  sessionOpenedAt: string,
  now: Date = new Date()
): CloseOrderRecap {
  const dateStr = now.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const recapId = `RCP-${toIsoDate(now).replace(/-/g, '')}-${String(Math.floor(Math.random() * 90) + 10)}`;

  const totalRevenue = bookings.reduce((sum, b) => sum + b.total, 0);
  const totalTransactions = bookings.length;
  const totalTicketsSold = bookings.reduce(
    (sum, b) => sum + b.items.reduce((s, it) => s + it.quantity, 0),
    0
  );

  const hariIniBookings = bookings.filter((b) => b.bookingType === 'hari_ini');
  const bookingBookings = bookings.filter((b) => b.bookingType === 'booking');

  // Breakdown per jenis tiket
  const ticketMap = new Map<string, { quantity: number; revenue: number }>();
  for (const b of bookings) {
    for (const item of b.items) {
      const existing = ticketMap.get(item.name) || { quantity: 0, revenue: 0 };
      ticketMap.set(item.name, {
        quantity: existing.quantity + item.quantity,
        revenue: existing.revenue + item.unitPrice * item.quantity,
      });
    }
  }

  const breakdownTicketItems = Array.from(ticketMap.entries()).map(([name, data]) => ({
    name,
    quantity: data.quantity,
    revenue: data.revenue,
  }));

  // Breakdown metode pembayaran
  const paymentBreakdown = {
    cash: 0,
    qris: 0,
    ewallet: 0,
    transfer: 0,
  };

  for (const b of bookings) {
    const method = b.paymentMethod || 'cash';
    if (method in paymentBreakdown) {
      paymentBreakdown[method] += b.total;
    } else {
      paymentBreakdown.cash += b.total;
    }
  }

  return {
    id: recapId,
    closedAt: `${dateStr}, ${timeStr} WIB`,
    sessionOpenedAt,
    cashierName,
    totalRevenue,
    totalTransactions,
    totalTicketsSold,
    breakdownBookingType: {
      hariIniCount: hariIniBookings.length,
      hariIniRevenue: hariIniBookings.reduce((sum, b) => sum + b.total, 0),
      bookingCount: bookingBookings.length,
      bookingRevenue: bookingBookings.reduce((sum, b) => sum + b.total, 0),
    },
    breakdownTicketItems,
    breakdownPayment: paymentBreakdown,
  };
}
