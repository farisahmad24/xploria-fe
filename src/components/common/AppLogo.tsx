import logoHorizontal from '@/assets/logo/logo_horizontal.svg';

type AppLogoProps = {
  className?: string;
  size?: number;
  colorScheme?: 'white' | 'blue';
  showText?: boolean;
  textClassName?: string;
  subtitleClassName?: string;
};

export default function AppLogo({
  className = '',
  size = 40,
  colorScheme = 'white',
  showText = true,
  textClassName = '',
  subtitleClassName = '',
}: AppLogoProps) {
  const isWhite = colorScheme === 'white';

  return (
    <div className={`inline-flex items-center gap-3 font-sans ${className}`}>
      {/* Logo dari folder src/assets/logo; skema putih dibuat monokrom putih agar terlihat di latar gelap */}
      <img
        src={logoHorizontal}
        alt="Ploria Logo"
        style={{
          height: `${size}px`,
          width: 'auto',
          filter: isWhite ? 'brightness(0) invert(1)' : undefined,
        }}
        className="shrink-0 object-contain drop-shadow-sm select-none"
        loading="eager"
      />

      {showText && (
        <div className="leading-tight font-sans">
          <p
            className={`text-xs font-semibold font-sans ${subtitleClassName || (isWhite ? 'text-blue-100' : 'text-[#286EF2]')
              }`}
          >
            Pemesanan Tiket Wisata
          </p>
        </div>
      )}
    </div>
  );
}
