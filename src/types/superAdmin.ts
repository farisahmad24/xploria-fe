export type MitraStatus = 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';

export type MitraCategory =
  | 'Pantai & Bahari'
  | 'Pegunungan & Alam'
  | 'Taman Rekreasi & Hiburan'
  | 'Budaya & Sejarah'
  | 'Agrowisata & Edukasi'
  | 'Waterpark & Pemandian';

export interface MitraDocument {
  ktpUrl: string;
  ktpNumber: string;
  nibUrl: string;
  nibNumber: string;
  bankBookUrl: string;
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  documentType: 'NIB Berbasis Risiko' | 'SK Pokdarwis' | 'Izin Usaha Pariwisata (TDUP)';
  issueDate: string;
}

export interface MitraPIC {
  fullName: string;
  nik: string;
  position: string;
  email: string;
  whatsapp: string;
}

export interface MitraAccount {
  id: string;
  destinationName: string;
  category: MitraCategory;
  address: string;
  district: string;
  city: string;
  province: string;
  coordinates: string;
  registrationDate: string;
  status: MitraStatus;
  pic: MitraPIC;
  documents: MitraDocument;
  description: string;
  ticketPriceRange: string;
  rejectionReason?: string;
  rejectionNote?: string;
  suspensionReason?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  executorName: string;
  executorRole: string;
  targetMitraId: string;
  targetMitraName: string;
  previousStatus: MitraStatus;
  newStatus: MitraStatus;
  action: string;
  reason?: string;
  notes?: string;
}
