import { useState } from 'react';
import {
  CornerDownRight,
  MessageSquare,
  MessageSquareReply,
  Send,
  Star,
} from 'lucide-react';
import type { VisitorReview } from '@/types/roles';

type ReviewsViewProps = {
  reviews: VisitorReview[];
  onReplyReview: (reviewId: string, replyMessage: string, authorName: string, authorRole: string) => void;
  currentUser: { name: string; role: string };
  onToast: (message: string) => void;
  filterOnlyUnreplied?: boolean;
};

export default function ReviewsView({
  reviews,
  onReplyReview,
  currentUser,
  onToast,
  filterOnlyUnreplied = false,
}: ReviewsViewProps) {
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');
  const [onlyUnreplied, setOnlyUnreplied] = useState(filterOnlyUnreplied);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const filteredReviews = reviews.filter((r) => {
    if (selectedRating !== 'all' && r.rating !== selectedRating) return false;
    if (onlyUnreplied && r.reply) return false;
    return true;
  });

  const handleOpenReply = (id: string, existingMessage?: string) => {
    setActiveReplyId(id);
    setReplyText(existingMessage || '');
  };

  const handleSubmitReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    onReplyReview(reviewId, replyText.trim(), currentUser.name, currentUser.role);
    setActiveReplyId(null);
    setReplyText('');
    onToast('Balasan ulasan berhasil dikirim!');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── 1. HEADER JUDUL & FILTER ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#286EF2]">
            Manajemen Ulasan dan Pengaduan
          </p>
          <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl tracking-tight">
            Ulasan Pengunjung &amp; Tanggapan
          </h1>
          <p className="text-sm text-slate-500">
            Pantau testimoni pengunjung dan berikan tanggapan resmi pengelola wisata.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 rounded-2xl bg-white p-1.5 shadow-card border border-slate-200/80">
            <button
              type="button"
              onClick={() => setSelectedRating('all')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                selectedRating === 'all'
                  ? 'bg-[#286EF2] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Semua Bintang
            </button>
            {[5, 4, 3].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setSelectedRating(star)}
                className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold transition ${
                  selectedRating === star
                    ? 'bg-[#286EF2] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{star}</span>
                <Star className={`h-3 w-3 ${selectedRating === star ? 'fill-white text-white' : 'fill-amber-400 text-amber-400'}`} />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOnlyUnreplied(!onlyUnreplied)}
            className={`rounded-2xl border px-3.5 py-2 text-xs font-bold shadow-sm transition ${
              onlyUnreplied
                ? 'border-amber-400 bg-amber-500 text-white shadow-amber-500/20'
                : 'border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {onlyUnreplied ? 'Hanya Belum Dibalas ✓' : 'Belum Dibalas'}
          </button>
        </div>
      </div>

      {/* ── 2. UNIFIED FRAME CONTAINER (KONSISTEN MIN-HEIGHT & FOOTER) ── */}
      <div className="flex min-h-[560px] flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card">
        <div>
          {/* Card Sub-Header */}
          <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-[#286EF2] ring-1 ring-blue-100">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Daftar Ulasan &amp; Testimoni Wisata</h2>
                <p className="text-xs text-slate-400">
                  Menampilkan {filteredReviews.length} dari total {reviews.length} ulasan pengunjung
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 border border-amber-200/60">
                ★ Rata-rata 4.2 / 5.0
              </span>
            </div>
          </div>

          {/* Review List */}
          <div className="divide-y divide-slate-100 p-6 space-y-6">
            {filteredReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-700">Tidak ada ulasan yang sesuai filter</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Cobalah memilih kategori bintang lain atau menonaktifkan filter belum dibalas.
                </p>
              </div>
            ) : (
              filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="flex flex-col gap-3.5 pt-6 first:pt-0"
                >
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#286EF2] font-extrabold ring-1 ring-blue-100">
                        {rev.userName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{rev.userName}</h3>
                        <p className="text-xs text-slate-400">
                          Tiket: <span className="font-mono font-semibold text-[#286EF2]">{rev.ticketCode}</span> • {rev.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-xs font-bold text-slate-700">{rev.rating}.0</span>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed text-slate-700 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                    &ldquo;{rev.comment}&rdquo;
                  </p>

                  {/* Existing Reply */}
                  {rev.reply && (
                    <div className="ml-4 flex flex-col gap-2 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 sm:ml-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CornerDownRight className="h-4 w-4 text-[#286EF2]" />
                          <span className="text-xs font-bold text-slate-900">{rev.reply.author}</span>
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-[#286EF2]">
                            {rev.reply.role}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">{rev.reply.date}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-700">{rev.reply.message}</p>
                    </div>
                  )}

                  {/* Reply Button / Box */}
                  {activeReplyId === rev.id ? (
                    <div className="ml-4 mt-2 flex flex-col gap-2.5 sm:ml-8">
                      <label className="text-xs font-bold text-slate-700">
                        Balas sebagai {currentUser.name} ({currentUser.role}):
                      </label>
                      <textarea
                        rows={3}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Tuliskan respon atau solusi atas ulasan pengunjung..."
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:border-[#286EF2] focus:bg-white focus:outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveReplyId(null)}
                          className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSubmitReply(rev.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#286EF2] px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
                        >
                          <Send className="h-3.5 w-3.5" />
                          Kirim Balasan
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleOpenReply(rev.id, rev.reply?.message)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#286EF2] hover:text-blue-700 transition"
                      >
                        <MessageSquareReply className="h-3.5 w-3.5" />
                        {rev.reply ? 'Edit Tanggapan' : 'Balas Ulasan Ini'}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── 3. FOOTER BAR (FRAME STABILITY) ── */}
        <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              Menampilkan <strong className="text-slate-800">{filteredReviews.length}</strong> ulasan
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Rating:{' '}
              <strong className="text-[#286EF2]">
                {selectedRating === 'all' ? 'Semua Bintang' : `${selectedRating} Bintang`}
              </strong>
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Status:{' '}
              <strong className={onlyUnreplied ? 'text-amber-700' : 'text-slate-700'}>
                {onlyUnreplied ? 'Hanya Belum Dibalas' : 'Semua Ulasan'}
              </strong>
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Sistem Ulasan &amp; Tanggapan Pengunjung Terverifikasi
          </span>
        </div>
      </div>
    </div>
  );
}
