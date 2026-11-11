export type TicketCategory = {
  id: string;
  name: string;
  description: string;
  price: number;
};

export type BookingItem = {
  categoryId: string;
  name: string;
  unitPrice: number;
  quantity: number;
};

export type BookingStatus = 'booked' | 'validated';

export type Booking = {
  id: string;
  code: string;
  visitorName: string;
  phone: string;
  visitDate: string;
  items: BookingItem[];
  total: number;
  status: BookingStatus;
  createdAt: string;
  validatedAt: string | null;
};

export type BookingDraft = {
  visitorName: string;
  phone: string;
  visitDate: string;
  quantities: Record<string, number>;
};

export type DraftErrors = Partial<Record<'visitorName' | 'phone' | 'visitDate' | 'quantities', string>>;

export type ValidationResult =
  | { kind: 'valid'; booking: Booking }
  | { kind: 'already_validated'; booking: Booking }
  | { kind: 'not_found' };
