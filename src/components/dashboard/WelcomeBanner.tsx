import { useEffect, useState } from 'react';
import { bannerSlides } from '@/data/dashboardData';

const AUTO_ADVANCE_MS = 5000;

export default function WelcomeBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % bannerSlides.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [index]);

  return (
    <section className="animate-fade-in-up grid overflow-hidden rounded-3xl border border-ocean-100 bg-white shadow-card lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="flex flex-col justify-center gap-4 p-6 sm:p-8 lg:p-10">
        <h1 className="text-2xl font-bold leading-[1.2] text-ocean-900 sm:text-3xl lg:text-[32px]">
          Selamat Datang,
          <span className="block text-ocean-600">di Exploria!</span>
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-slate-500 sm:text-base">
          Kelola pariwisata desa dengan mudah dan efisien.
        </p>
      </div>

      <div className="relative min-h-[220px] overflow-hidden p-3 sm:min-h-[260px] lg:p-4">
        <div className="relative h-full min-h-[200px] overflow-hidden rounded-2xl">
          {bannerSlides.map((slide, slideIndex) => (
            <img
              key={slide.id}
              src={slide.src}
              alt={slide.alt}
              loading={slideIndex === 0 ? 'eager' : 'lazy'}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out ${
                slideIndex === index ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-ocean-900/30 to-transparent" />

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
            {bannerSlides.map((slide, slideIndex) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setIndex(slideIndex)}
                aria-label={`Tampilkan foto ${slideIndex + 1}`}
                aria-current={slideIndex === index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  slideIndex === index ? 'w-6 bg-white' : 'w-2 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
