import { useState } from 'react';
import {
  CornerDownRight,
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-ocean-600">
            Manajemen Ulasan dan Pengaduan
          </p>
          <h1 className="mt-1 text-2xl font-bold text-ocean-900 sm:text-3xl">
            Ulasan Pengunjung & Tanggapan
          </h1>
          <p className="text-sm text-slate-500">
            Pantau testimoni pengunjung dan berikan tanggapan resmi pengelola wisata.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl bg-white p-1 shadow-card">
            <button
              type="button"
              onClick={() => setSelectedRating('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                selectedRating === 'all'
                  ? 'bg-ocean-600 text-white'
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
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold ${
                  selectedRating === star
                    ? 'bg-ocean-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{star}</span>
                <Star className="h-3 w-3 fill-current" />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOnlyUnreplied(!onlyUnreplied)}
            className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              onlyUnreplied
                ? 'border-amber-400 bg-amber-50 text-amber-700'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {onlyUnreplied ? 'Hanya Belum Dibalas ✓' : 'Belum Dibalas'}
          </button>
        </div>
      </div>

      {/* Review List */}
      <div className="flex flex-col gap-4">
        {filteredReviews.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
            Tidak ada ulasan yang sesuai dengan filter yang dipilih.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col gap-4 rounded-3xl border border-ocean-100 bg-white p-6 shadow-card"
            >
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ocean-50 text-ocean-700 font-bold">
                    {rev.userName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{rev.userName}</h3>
                    <p className="text-xs text-slate-400">
                      Tiket: <span className="font-mono text-ocean-600">{rev.ticketCode}</span> • {rev.date}
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

              <p className="text-sm leading-relaxed text-slate-700 bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                "{rev.comment}"
              </p>

              {/* Existing Reply */}
              {rev.reply && (
                <div className="ml-4 flex flex-col gap-2 rounded-2xl border border-ocean-100 bg-ocean-50/50 p-4 sm:ml-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CornerDownRight className="h-4 w-4 text-ocean-600" />
                      <span className="text-xs font-bold text-ocean-900">{rev.reply.author}</span>
                      <span className="rounded-full bg-ocean-200/60 px-2 py-0.5 text-[10px] font-semibold text-ocean-800">
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
                <div className="ml-4 mt-2 flex flex-col gap-2 sm:ml-8">
                  <label className="text-xs font-semibold text-ocean-800">
                    Balas sebagai {currentUser.name} ({currentUser.role}):
                  </label>
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Tuliskan respon atau solusi atas ulasan pengunjung..."
                    className="w-full rounded-2xl border border-ocean-200 p-3 text-xs text-slate-800 focus:border-ocean-500 focus:outline-none focus:ring-4 focus:ring-ocean-50"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveReplyId(null)}
                      className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSubmitReply(rev.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-ocean-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-ocean-700"
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
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-ocean-600 hover:text-ocean-800"
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
  );
}
