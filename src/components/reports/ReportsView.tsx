import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Coins,
  Plus,
  Printer,
  Receipt,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { formatNumber, formatRupiah } from '@/lib/bookings';
import type { OperationalExpense, RevenueShareItem, VisitorCategoryStat } from '@/types/roles';
import type { mendatang } from '@/types/ticket';

export type ReportTabType =
  | 'visitors-cat'
  | 'finance'
  | 'print'
  | 'revenue-sharing'
  | 'expenses'
  | 'tickets';

type ReportsViewProps = {
  activeTab: ReportTabType;
  bookings: mendatang[];
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

  useEffect(() => {
    if (activeTab) {
      setCurrentTab(activeTab);
    }
  }, [activeTab]);
  const [addExpenseView, setAddExpenseView] = useState(false);
  const [newExpenseCat, setNewExpenseCat] = useState('Pemeliharaan Fasilitas');
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
    setAddExpenseView(false);
    setNewExpenseDesc('');
    setNewExpenseAmount('');
    setNewExpenseCat('Pemeliharaan Fasilitas');
    onToast('Pengeluaran operasional berhasil dicatat');
  };

  const handlePrint = () => {
    window.print();
    onToast('Mencetak dokumen laporan keuangan...');
  };

  // ── Halaman Catat Pengeluaran Baru ───────────────────────────────────────
  if (addExpenseView) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => { setAddExpenseView(false); setNewExpenseDesc(''); setNewExpenseAmount(''); setNewExpenseCat('Pemeliharaan Fasilitas'); }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
            aria-label="Kembali"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 sm:text-3xl tracking-tight">Catat Pengeluaran Baru</h1>
            <p className="text-sm text-slate-500">Catat biaya operasional pemeliharaan dan utilitas destinasi.</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card">
          <div className="border-b border-slate-100 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Detail Pengeluaran</h2>
                <p className="text-xs text-slate-400">Lengkapi semua field untuk mencatat pengeluaran baru.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleAddExpense} className="p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Kategori Pengeluaran
                </label>
                <select
                  value={newExpenseCat}
                  onChange={(e) => setNewExpenseCat(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:border-[#286EF2] focus:outline-none focus:ring-2 focus:ring-[#286EF2]/20"
                >
                  <option value="Pemeliharaan Fasilitas">Pemeliharaan Fasilitas</option>
                  <option value="Gaji &amp; Honor Staf">Gaji &amp; Honor Staf</option>
                  <option value="Listrik &amp; Utilitas">Listrik &amp; Utilitas</option>
                  <option value="Kebersihan &amp; Lingkungan">Kebersihan &amp; Lingkungan</option>
                  <option value="Promosi &amp; Publikasi">Promosi &amp; Publikasi</option>
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
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:border-[#286EF2] focus:outline-none focus:ring-2 focus:ring-[#286EF2]/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Rincian Deskripsi
                </label>
                <textarea
                  rows={4}
                  required
                  value={newExpenseDesc}
                  onChange={(e) => setNewExpenseDesc(e.target.value)}
                  placeholder="Perbaikan lampu sorot dermaga dan cat gazebo..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:border-[#286EF2] focus:outline-none focus:ring-2 focus:ring-[#286EF2]/20"
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => { setAddExpenseView(false); setNewExpenseDesc(''); setNewExpenseAmount(''); setNewExpenseCat('Pemeliharaan Fasilitas'); }}
                className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-ocean-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-ocean-600/25 hover:bg-ocean-700"
              >
                <Plus className="h-4 w-4" />
                Simpan Pengeluaran
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>

          <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl tracking-tight">
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
              onClick={() => setAddExpenseView(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-ocean-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-ocean-600/20 hover:bg-ocean-700"
            >
              <Plus className="h-4 w-4" />
              Catat Pengeluaran
            </button>
          )}

          {currentTab === 'print' && (
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
            >
              <Printer className="h-4 w-4" />
              Cetak Sekarang
            </button>
          )}
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 print:hidden">
        {/* Card 1: Total Pengunjung (Oranye, selaras dengan Dashboard) */}
        <div className="rounded-2xl p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg bg-gradient-to-br from-[#FFA66E] via-[#FFC283] to-[#FFE49C] text-slate-900">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Total Pengunjung</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E0701E] text-white shadow-sm">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-1 text-2xl font-black text-slate-900">{formatNumber(totalVisitors)} Orang</p>
          <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-700">
            <TrendingUp className="h-3.5 w-3.5" /> +14.2% dari bulan lalu
          </p>
        </div>

        {/* Card 2: Pendapatan Tiket (Ungu, selaras dengan Dashboard) */}
        <div className="rounded-2xl p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg bg-gradient-to-br from-[#C49CF2] via-[#DDA6EE] to-[#F6C6EC] text-slate-900">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Pendapatan Tiket</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7C4DC2] text-white shadow-sm">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-1 text-2xl font-black text-slate-900">{formatRupiah(totalRevenue)}</p>
          <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-700">
            <TrendingUp className="h-3.5 w-3.5" /> +18.5% dari target
          </p>
        </div>

        {/* Card 3: Biaya Operasional (Pink pastel, selaras dengan palet Dashboard) */}
        <div className="rounded-2xl p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg bg-gradient-to-br from-[#FFA3B8] via-[#FFC0CE] to-[#FFE0E8] text-slate-900">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Biaya Operasional</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E11D48] text-white shadow-sm">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-1 text-2xl font-black text-slate-900">{formatRupiah(totalExpenses)}</p>
          <p className="mt-1 text-xs font-medium text-slate-700">4 Pos Biaya Terdaftar</p>
        </div>

        {/* Card 4: Laba Bersih (Hijau pastel, selaras dengan Dashboard) */}
        <div className="rounded-2xl p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg bg-gradient-to-br from-[#7EE3A4] via-[#B4EFA0] to-[#D8F79E] text-slate-900">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Laba Bersih</p>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#12956A] text-white shadow-sm">
              <Coins className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-1 text-2xl font-black text-slate-900">{formatRupiah(netIncome)}</p>
          <p className="mt-1 text-xs font-medium text-slate-700">Margin laba ~{Math.round((netIncome / (totalRevenue || 1)) * 100)}%</p>
        </div>
      </div>

      {/* VIEW: Visitors by Category */}
      {currentTab === 'visitors-cat' && (
        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-3xl border border-ocean-100 bg-white shadow-card">
            <div className="border-b border-ocean-100 p-6">
              <h3 className="text-lg font-bold text-slate-900">Distribusi Kunjungan Berdasarkan Kategori</h3>
              <p className="text-sm text-slate-500">Rincian volume pengunjung dan kontribusi omset per kategori tiket.</p>
            </div>
            {/* Column header stripe â€” same look as thead bg-ocean-50/70 on other tabs */}
            <div className="bg-ocean-50/70 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-ocean-800">
              <div className="flex items-center justify-between">
                <span>Kategori Pengunjung</span>
                <div className="flex items-center gap-8 pr-1">
                  <span>Jumlah</span>
                  <span>Pendapatan</span>
                  <span>Porsi</span>
                </div>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {categoryStats.map((item) => (
                <div key={item.id} className="flex flex-col gap-2 px-6 py-5 hover:bg-ocean-50/30">
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
            {/* Footer total — sama seperti tfoot di tab lain */}
            <div className="border-t-2 border-ocean-200 bg-ocean-50 px-6 py-4 font-bold text-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-base">Total Keseluruhan Pengunjung</span>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-ocean-800">{formatNumber(totalVisitors)} Orang</span>
                  <span className="text-lg text-ocean-900">{formatRupiah(categoryStats.reduce((s, i) => s + i.revenue, 0))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: Financial Report */}
      {currentTab === 'finance' && (
        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-3xl border border-ocean-100 bg-white shadow-card">
            <div className="border-b border-ocean-100 p-6">
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
            <div className="border-b border-ocean-100 p-6">
              <h3 className="text-lg font-bold text-slate-900">Data Pembagian Hasil Pendapatan Wisata</h3>
              <p className="text-sm text-slate-500">
                Alokasi persentase bagi hasil pendapatan kotor antara Manajer Desa, Manajemen, dan Kas Konservasi.
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
                <tfoot className="border-t-2 border-ocean-200 bg-ocean-50 font-bold text-slate-900">
                  <tr>
                    <td className="px-6 py-4 text-base">Total Penyaluran Bagi Hasil</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-ocean-100 px-2.5 py-1 text-xs font-black text-ocean-800">
                        100%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-lg text-ocean-900">
                      {formatRupiah(totalRevenue)}
                    </td>
                    <td colSpan={2} className="px-6 py-4 text-xs font-medium text-slate-500">
                      Seluruh alokasi pendapatan terdistribusi
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: Operational Expenses */}
      {currentTab === 'expenses' && (
        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-3xl border border-ocean-100 bg-white shadow-card">
            <div className="border-b border-ocean-100 p-6">
              <h3 className="text-lg font-bold text-slate-900">Daftar Pengeluaran Operasional</h3>
              <p className="text-sm text-slate-500">Catatan pengeluaran harian dan pemeliharaan fasilitas.</p>
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
                <tfoot className="border-t-2 border-ocean-200 bg-ocean-50 font-bold text-slate-900">
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-base">
                      Total Pengeluaran Operasional
                    </td>
                    <td className="px-6 py-4 text-right text-lg text-rose-700">
                      {formatRupiah(totalExpenses)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: Ticket Sales Report */}
      {currentTab === 'tickets' && (
        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-3xl border border-ocean-100 bg-white shadow-card">
            <div className="border-b border-ocean-100 p-6">
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
                <tfoot className="border-t-2 border-ocean-200 bg-ocean-50 font-bold text-slate-900">
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-base">
                      Total Penjualan Tiket Masuk (Rekapitulasi)
                    </td>
                    <td className="px-6 py-4 text-right text-lg text-ocean-900 whitespace-nowrap">
                      {formatRupiah(totalRevenue)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: Print Preview (Cetak Laporan Keuangan) */}
      {currentTab === 'print' && (
        <div className="report-print-root flex flex-col gap-6 print:m-0 print:p-0 print:block">
          <div className="rounded-3xl border-2 border-slate-300 bg-white p-8 shadow-2xl print:m-0 print:w-full print:max-w-none print:rounded-none print:border-none print:p-0 print:shadow-none">
            {/* Official Letterhead */}
            <div className="border-b-2 border-slate-900 pb-5 text-center">
              <h2 className="text-xl font-black uppercase tracking-wider text-slate-900 sm:text-2xl">
                Badan Manajer Destinasi Wisata Ploria
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
                <p className="font-semibold text-slate-900">Admin MANAJER</p>
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

    </div>
  );
}

