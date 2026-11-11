import { ArrowRight } from 'lucide-react';

const PROMO_IMAGE_URL =
  'https://images.pexels.com/photos/32820544/pexels-photo-32820544.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

type PromoCardProps = {
  onExplore: () => void;
};

export default function PromoCard({ onExplore }: PromoCardProps) {
  return (
    <section className="animate-fade-in-up group relative overflow-hidden rounded-3xl bg-gradient-to-br from-ocean-100 via-sky-50 to-white shadow-card">
      <div className="grid h-full grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex flex-col justify-center gap-3 p-6 sm:p-8">
          <h2 className="text-2xl font-bold leading-[1.2] text-ocean-900 sm:text-[28px]">Exploria</h2>
          <p className="text-base font-semibold leading-snug text-ocean-700">Pesan tiket wisata favoritmu sekarang</p>
          <button
            type="button"
            onClick={onExplore}
            className="mt-3 inline-flex w-fit items-center gap-2 rounded-xl bg-ocean-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-ocean-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-ocean-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-ocean-200"
          >
            Jelajahi Wisata
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
        <div className="relative min-h-[200px] overflow-hidden">
          <img
            src={PROMO_IMAGE_URL}
            alt="Mercusuar di pulau karang dengan laut biru"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ocean-100 via-transparent to-transparent sm:block hidden" />
        </div>
      </div>
    </section>
  );
}
