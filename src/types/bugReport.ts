import type { UserRole } from './roles';

export type BugCategory =
  | 'Tampilan / UI'
  | 'Error Sistem / Crash'
  | 'Perhitungan / Transaksi'
  | 'Akses & Login'
  | 'Lainnya';

export type BugPriority = 'low' | 'medium' | 'high';

export type BugStatus = 'pending' | 'in_progress' | 'done';

/** Role yang boleh melapor bug (Super Admin hanya meninjau). */
export type ReporterRole = Exclude<UserRole, 'superadmin'>;

export interface BugReporter {
  role: ReporterRole;
  name: string;
  username: string;
}

export interface BugResponse {
  note: string;
  responderName: string;
  updatedAt: string;
}

export interface BugReport {
  id: string;
  title: string;
  category: BugCategory;
  priority: BugPriority;
  description: string;
  screenshotDataUrl: string | null;
  status: BugStatus;
  reporter: BugReporter;
  createdAt: string;
  updatedAt: string;
  response: BugResponse | null;
}

export type NewBugReportInput = {
  title: string;
  category: BugCategory;
  priority: BugPriority;
  description: string;
  screenshotDataUrl: string | null;
  reporter: BugReporter;
};
