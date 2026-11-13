import { useState } from 'react';
import {
  Coins,
  FileSpreadsheet,
  Plus,
  Printer,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { formatNumber, formatRupiah } from '@/lib/bookings';
import type { OperationalExpense, RevenueShareItem, VisitorCategoryStat } from '@/types/roles';
import type { Booking } from '@/types/ticket';

export type ReportTabType =
  | 'visitors-cat'
  | 'finance'
  | 'print'
  | 'revenue-sharing'
  | 'expenses'
  | 'tickets';

type ReportsViewProps = {
  activeTab: ReportTabType;
  bookings: Booking[];
  categoryStats: VisitorCategoryStat[];
  revenueShares: RevenueShareItem[];
  expenses: OperationalExpense[];
  onUpdateExpenses: (expenses: OperationalExpense[]) => void;
  onToast: (message: string) => void;
};

export default function ReportsView({
  activeTab,
  bookings,
  categoryStats,
  revenueShares,
  expenses,
  onUpdateExpenses,
  onToast,
}: ReportsViewProps) {
  const [currentTab, setCurrentTab] = useState<ReportTabType>(activeTab);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [newExpenseCat, setNewExpenseCat] = useState('Pemeliharaan');
  const [newExpenseDesc, setNewExpenseDesc] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');

  // Calculations
  const totalRevenue = bookings.reduce((sum, b) => sum + b.total, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netIncome = totalRevenue - totalExpenses;
  const totalVisitors = bookings.reduce(
    (sum, b) => sum + b.items.reduce((acc, it) => acc + it.quantity, 0),
    0
  );

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(newExpenseAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      onToast('Nominal pengeluaran tidak valid');
      return;
    }
    const newExp: OperationalExpense = {
      id: `exp-${Date.now()}`,
      category: newExpenseCat,
      description: newExpenseDesc,
      amount,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      approvedBy: 'M. Hasan',
    };
    onUpdateExpenses([newExp, ...expenses]);
    setExpenseModalOpen(false);
    setNewExpenseDesc('');
    setNewExpenseAmount('');
    onToast('Pengeluaran operasional berhasil dicatat');
  };

  const handlePrint = () => {
    window.print();
    onToast('Mencetak dokumen laporan keuangan...');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-ocean-600">
            Manajemen Data Pengunjung dan Laporan
          </p>
          <h1 className="mt-1 text-2xl font-bold text-ocean-900 sm:text-3xl">
            {currentTab === 'visitors-cat' && 'Kunjungan Berdasarkan Kategori Pengunjung'}
            {currentTab === 'finance' && 'Laporan Keuangan & Pendapatan'}
            {currentTab === 'print' && 'Cetak Laporan Keuangan Resmi'}
            {currentTab === 'revenue-sharing' && 'Pembagian Hasil Pendapatan Wisata'}
            {currentTab === 'expenses' && 'Pengeluaran Operasional Destinasi'}
            {currentTab === 'tickets' && 'Laporan & Rekap Penjualan Tiket'}
          </h1>
          <p className="text-sm text-slate-500">
            Data analitik terintegrasi untuk evaluasi kinerja dan akuntabilitas wisata.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {currentTab === 'expenses' && (
            <button
              type="button"
              onClick={() => setExpenseModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-ocean-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-ocean-600/20 hover:bg-ocean-700"
            >
              <Plus className="h-4 w-4" />
              Catat Pengeluaran
            </button>
          )}

          {currentTab === 'print' ? (
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
            >
              <Printer className="h-4 w-4" />
              Cetak Sekarang
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentTab('print')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Printer className="h-4 w-4 text-slate-500" />
              Format Cetak
            </button>
          )}
        </div>
      </div>

      {/* Tab Selector */}
      <div className="no-scrollbar flex overflow-x-auto rounded-2xl bg-white p-1.5 shadow-card">
        {[
          { id: 'visitors-cat', label: 'Kategori Pengunjung', icon: Users },
          { id: 'finance', label: 'Laporan Keuangan', icon: Wallet },
          { id: 'revenue-sharing', label: 'Pembagian Hasil', icon: Coins },
          { id: 'expenses', label: 'Pengeluaran Operasional', icon: TrendingDown },
          { id: 'tickets', label: 'Penjualan Tiket', icon: FileSpreadsheet },
          { id: 'print', label: 'Cetak Laporan', icon: Printer },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCurrentTab(tab.id as ReportTabType)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${active
                ? 'bg-ocean-600 text-white shadow-md shadow-ocean-600/20'
                : 'text-slate-600 hover:bg-ocean-50 hover:text-ocean-700'
                }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-ocean-100 bg-white p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Pengunjung</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{formatNumber(totalVisitors)} Orang</p>
          <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <TrendingUp className="h-3.5 w-3.5" /> +14.2% dari bulan lalu
          </p>
        </div>

        <div className="rounded-2xl border border-ocean-100 bg-white p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pendapatan Tiket</p>
          <p className="mt-2 text-2xl font-black text-ocean-900">{formatRupiah(totalRevenue)}</p>
          <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <TrendingUp className="h-3.5 w-3.5" /> +18.5% dari target
          </p>
        </div>

        <div className="rounded-2xl border border-ocean-100 bg-white p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Biaya Operasional</p>
          <p className="mt-2 text-2xl font-black text-rose-600">{formatRupiah(totalExpenses)}</p>
          <p className="mt-1 text-xs text-slate-400">4 Pos Biaya Terdaftar</p>
        </div>

        <div className="rounded-2xl border border-ocean-100 bg-white p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Laba Bersih</p>
          <p className="mt-2 text-2xl font-black text-emerald-600">{formatRupiah(netIncome)}</p>
          <p className="mt-1 text-xs font-medium text-slate-500">Margin laba ~{Math.round((netIncome / (totalRevenue || 1)) * 100)}%</p>
        </div>
      </div>

      {/* VIEW: Visitors by Category */}
      {currentTab === 'visitors-cat' && (
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-ocean-100 bg-white p-6 shadow-card">
            <h3 className="text-lg font-bold text-slate-900">Distribusi Kunjungan Berdasarkan Kategori</h3>
            <p className="text-sm text-slate-500">Rincian volume pengunjung dan kontribusi omset per kategori tiket.</p>

            <div className="mt-6 flex flex-col gap-5">
              {categoryStats.map((item) => (
                <div key={item.id} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-800">{item.name}</span>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="font-bold text-slate-900">{formatNumber(item.count)} Orang</span>
                      <span className="text-slate-400">|</span>
                      <span className="font-semibold text-ocean-700">{formatRupiah(item.revenue)}</span>
                      <span className="rounded-full bg-ocean-50 px-2 py-0.5 font-bold text-ocean-600">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: Financial Report */}
      {currentTab === 'finance' && (
        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-3xl border border-ocean-100 bg-white shadow-card">
            <div className="border-b border-ocean-50 p-6">
              <h3 className="text-lg font-bold text-slate-900">Buku Laporan Arus Keuangan</h3>
              <p className="text-sm text-slate-500">Rekapitulasi pemasukan tiket dan beban operasional destinasi wisata.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-ocean-50/70 text-xs font-semibold uppercase tracking-wider text-ocean-800">
                  <tr>
                    <th className="px-6 py-4">Kode / No</th>
                    <th className="px-6 py-4">Keterangan / Transaksi</th>
                    <th className="px-6 py-4">Jenis</th>
                    <th className="px-6 py-4 text-right">Debit (Masuk)</th>
                    <th className="px-6 py-4 text-right">Kredit (Keluar)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-ocean-50/30">
                    <td className="px-6 py-4 font-mono font-semibold text-ocean-600">INC-2026-11</td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      Total Penjualan Tiket Masuk Destinasi (Semua Kategori)
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        Pemasukan
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600">{formatRupiah(totalRevenue)}</td>
                    <td className="px-6 py-4 text-right text-slate-400">-</td>
                  </tr>

                  {expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-ocean-50/30">
                      <td className="px-6 py-4 font-mono font-semibold text-rose-600">{exp.id.toUpperCase()}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800">{exp.category}</p>
                        <p className="text-xs text-slate-400">{exp.description}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">
                          Beban Operasional
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-400">-</td>
                      <td className="px-6 py-4 text-right font-bold text-rose-600">{formatRupiah(exp.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-ocean-200 bg-ocean-50 font-bold text-slate-900">
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-base">
                      Saldo Bersih / Laba Wisata
                    </td>
                    <td colSpan={2} className="px-6 py-4 text-right text-lg text-ocean-800">
                      {formatRupiah(netIncome)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: Revenue Sharing (Pembagian Hasil) */}
      {currentTab === 'revenue-sharing' && (
        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-3xl border border-ocean-100 bg-white shadow-card">
            <div className="border-b border-ocean-50 p-6">
              <h3 className="text-lg font-bold text-slate-900">Data Pembagian Hasil Pendapatan Wisata</h3>
              <p className="text-sm text-slate-500">
                Alokasi persentase bagi hasil pendapatan kotor antara Pengelola Desa, Manajemen, dan Kas Konservasi.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-ocean-50/70 text-xs font-semibold uppercase tracking-wider text-ocean-800">
                  <tr>
                    <th className="px-6 py-4">Pihak Penerima Bagi Hasil</th>
                    <th className="px-6 py-4">Porsi Bagi Hasil</th>
                    <th className="px-6 py-4">Nominal Estimasi</th>
                    <th className="px-6 py-4">Periode</th>
                    <th className="px-6 py-4">Status Penyaluran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {revenueShares.map((item) => (
                    <tr key={item.id} className="hover:bg-ocean-50/30">
                      <td className="px-6 py-4 font-bold text-slate-800">{item.entity}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-ocean-50 px-2.5 py-1 text-xs font-extrabold text-ocean-700">
                          {item.sharePercentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-ocean-900">
                        {formatRupiah(Math.round((totalRevenue * item.sharePercentage) / 100))}
                      </td>
                      <td className="px-6 py-4 text-slate-500">{item.period}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === 'Ditransfer'
                            ? 'bg-emerald-50 text-emerald-700'
                            : item.status === 'Disetujui'
                              ? 'bg-sky-50 text-sky-700'
                              : 'bg-amber-50 text-amber-700'
                            }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: Operational Expenses */}
      {currentTab === 'expenses' && (
        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-3xl border border-ocean-100 bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-ocean-50 p-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Daftar Pengeluaran Operasional</h3>
                <p className="text-sm text-slate-500">Catatan pengeluaran harian dan pemeliharaan fasilitas.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-ocean-50/70 text-xs font-semibold uppercase tracking-wider text-ocean-800">
                  <tr>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Kategori Biaya</th>
                    <th className="px-6 py-4">Rincian Pengeluaran</th>
                    <th className="px-6 py-4">Disetujui Oleh</th>
                    <th className="px-6 py-4 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-ocean-50/30">
                      <td className="px-6 py-4 text-slate-500">{exp.date}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{exp.category}</td>
                      <td className="px-6 py-4 text-slate-600">{exp.description}</td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500">{exp.approvedBy}</td>
                      <td className="px-6 py-4 text-right font-bold text-rose-600">
                        {formatRupiah(exp.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: Ticket Sales Report */}
      {currentTab === 'tickets' && (
        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-3xl border border-ocean-100 bg-white shadow-card">
            <div className="border-b border-ocean-50 p-6">
              <h3 className="text-lg font-bold text-slate-900">Rekapitulasi Penjualan Tiket</h3>
              <p className="text-sm text-slate-500">Daftar transaksi pemesanan tiket pengunjung terbaru.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-ocean-50/70 text-xs font-semibold uppercase tracking-wider text-ocean-800">
                  <tr>
                    <th className="px-6 py-4">Kode Tiket</th>
                    <th className="px-6 py-4">Nama Pengunjung</th>
                    <th className="px-6 py-4">Tanggal Kunjungan</th>
                    <th className="px-6 py-4">Kategori & Qty</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.slice(0, 8).map((b) => (
                    <tr key={b.id} className="hover:bg-ocean-50/30">
                      <td className="px-6 py-4 font-mono font-bold text-ocean-700">{b.code}</td>
                      <td className="px-6 py-4 font-medium text-slate-800">{b.visitorName}</td>
                      <td className="px-6 py-4 text-slate-500">{b.visitDate}</td>
                      <td className="px-6 py-4">
                        {b.items.map((it) => (
                          <span
                            key={it.categoryId}
                            className="mr-1 inline-block rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
                          >
                            {it.name} x{it.quantity}
                          </span>
                        ))}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${b.status === 'validated'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                            }`}
                        >
                          {b.status === 'validated' ? 'Tervalidasi' : 'Menunggu '}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900 whitespace-nowrap">
                        {formatRupiah(b.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: Print Preview (Cetak Laporan Keuangan) */}
      {currentTab === 'print' && (
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border-2 border-slate-300 bg-white p-8 shadow-2xl print:border-none print:p-0 print:shadow-none">
            {/* Official Letterhead */}
            <div className="border-b-2 border-slate-900 pb-5 text-center">
              <h2 className="text-xl font-black uppercase tracking-wider text-slate-900 sm:text-2xl">
                Badan Pengelola Destinasi Wisata Ploria
              </h2>
              <p className="text-xs font-semibold text-slate-600 sm:text-sm">
                Jl. Bahari Nusantara No. 88, Karang Indah • Telp (021) 7890-4321 • Email: info@Ploria.id
              </p>
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-ocean-700">
                LAPORAN KEUANGAN DAN REALISASI PENDAPATAN BULANAN
              </p>
            </div>

            <div className="mt-6 flex flex-col justify-between gap-4 text-xs text-slate-600 sm:flex-row">
              <div>
                <p>
                  <strong className="text-slate-900">Periode:</strong> November 2026
                </p>
                <p>
                  <strong className="text-slate-900">Tanggal Cetak:</strong>{' '}
                  {new Date().toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p>
                  <strong className="text-slate-900">Penanggung Jawab:</strong> Budi Santoso, S.Par
                </p>
                <p>
                  <strong className="text-slate-900">Status Dokumen:</strong> RESMI & DISETUJUI
                </p>
              </div>
            </div>

            {/* Financial Summary Table */}
            <div className="mt-6">
              <table className="w-full border-collapse border border-slate-300 text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-900">
                    <th className="border border-slate-300 p-2.5">No</th>
                    <th className="border border-slate-300 p-2.5">Keterangan Akun</th>
                    <th className="border border-slate-300 p-2.5 text-right">Debit (Pemasukan)</th>
                    <th className="border border-slate-300 p-2.5 text-right">Kredit (Pengeluaran)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 p-2.5 text-center">1</td>
                    <td className="border border-slate-300 p-2.5 font-semibold">
                      Pendapatan Penjualan Tiket Masuk ({totalVisitors} Pengunjung)
                    </td>
                    <td className="border border-slate-300 p-2.5 text-right font-bold text-slate-900">
                      {formatRupiah(totalRevenue)}
                    </td>
                    <td className="border border-slate-300 p-2.5 text-right text-slate-400">-</td>
                  </tr>
                  {expenses.map((exp, idx) => (
                    <tr key={exp.id}>
                      <td className="border border-slate-300 p-2.5 text-center">{idx + 2}</td>
                      <td className="border border-slate-300 p-2.5">
                        {exp.category} - {exp.description}
                      </td>
                      <td className="border border-slate-300 p-2.5 text-right text-slate-400">-</td>
                      <td className="border border-slate-300 p-2.5 text-right font-medium text-slate-800">
                        {formatRupiah(exp.amount)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold text-slate-900">
                    <td colSpan={2} className="border border-slate-300 p-2.5 text-right">
                      TOTAL
                    </td>
                    <td className="border border-slate-300 p-2.5 text-right text-emerald-700">
                      {formatRupiah(totalRevenue)}
                    </td>
                    <td className="border border-slate-300 p-2.5 text-right text-rose-700">
                      {formatRupiah(totalExpenses)}
                    </td>
                  </tr>
                  <tr className="bg-ocean-50 text-base font-extrabold text-ocean-950">
                    <td colSpan={2} className="border border-slate-300 p-3 text-right">
                      SISA HASIL / LABA BERSIH
                    </td>
                    <td colSpan={2} className="border border-slate-300 p-3 text-right">
                      {formatRupiah(netIncome)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Signature Area */}
            <div className="mt-12 flex justify-between px-6 text-center text-xs text-slate-700">
              <div>
                <p>Mengetahui,</p>
                <p className="font-semibold text-slate-900">Admin Pengelola Wisata</p>
                <div className="h-20" />
                <p className="font-bold underline text-slate-900">M. Hasan Al-Farisi</p>
                <p className="text-[11px] text-slate-500">NIP: 19850412 201001 1 002</p>
              </div>

              <div>
                <p>Disetujui oleh,</p>
                <p className="font-semibold text-slate-900">Manager Operasional Wisata</p>
                <div className="h-20" />
                <p className="font-bold underline text-slate-900">Budi Santoso, S.Par</p>
                <p className="text-[11px] text-slate-500">NIP: 19800723 200502 1 001</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Expense */}
      {expenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-ocean-950/60 backdrop-blur-sm"
            onClick={() => setExpenseModalOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setExpenseModalOpen(false)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold text-ocean-900">Catat Pengeluaran Baru</h3>
            <p className="mt-1 text-xs text-slate-500">
              Catat biaya operasional pemeliharaan dan utilitas destinasi.
            </p>

            <form onSubmit={handleAddExpense} className="mt-5 flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Kategori Pengeluaran
                </label>
                <select
                  value={newExpenseCat}
                  onChange={(e) => setNewExpenseCat(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-ocean-500 focus:outline-none"
                >
                  <option value="Pemeliharaan Fasilitas">Pemeliharaan Fasilitas</option>
                  <option value="Gaji & Honor Staf">Gaji & Honor Staf</option>
                  <option value="Listrik & Utilitas">Listrik & Utilitas</option>
                  <option value="Kebersihan & Lingkungan">Kebersihan & Lingkungan</option>
                  <option value="Promosi & Publikasi">Promosi & Publikasi</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Nominal Biaya (Rp)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1000"
                  value={newExpenseAmount}
                  onChange={(e) => setNewExpenseAmount(e.target.value)}
                  placeholder="1500000"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-ocean-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Rincian Deskripsi
                </label>
                <textarea
                  rows={3}
                  required
                  value={newExpenseDesc}
                  onChange={(e) => setNewExpenseDesc(e.target.value)}
                  placeholder="Perbaikan lampu sorot dermaga dan cat gazebo..."
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:border-ocean-500 focus:outline-none"
                />
              </div>

              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setExpenseModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-ocean-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-ocean-600/25 hover:bg-ocean-700"
                >
                  Simpan Biaya
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
