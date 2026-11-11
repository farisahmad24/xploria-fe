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
  const logoSrc = isWhite ? '/logo-white.png' : '/logo.png';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Exact Logo from User with Transparent Background */}
      <img
        src={logoSrc}
        alt="Exploria Logo"
        style={{ height: `${size}px`, width: 'auto' }}
        className="shrink-0 object-contain drop-shadow-sm select-none"
        loading="eager"
      />

      {showText && (
        <div className="leading-tight">
          <p
            className={`text-base font-extrabold tracking-tight ${
              textClassName || (isWhite ? 'text-white' : 'text-slate-900')
            }`}
          >
            Exploria
          </p>
          <p
            className={`text-xs font-semibold ${
              subtitleClassName || (isWhite ? 'text-blue-100' : 'text-[#286EF2]')
            }`}
          >
            Pemesanan Tiket Wisata
          </p>
        </div>
      )}
    </div>
  );
}
