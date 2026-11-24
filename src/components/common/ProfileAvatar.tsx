type ProfileAvatarProps = {
  initials: string;
  imageUrl?: string | null;
  size?: 'md' | 'lg';
  className?: string;
};

const SIZE_CLASS = {
  md: 'h-9 w-9 text-xs',
  lg: 'h-20 w-20 text-xl',
};

export default function ProfileAvatar({ initials, imageUrl, size = 'md', className = '' }: ProfileAvatarProps) {
  const base = `shrink-0 rounded-full ring-2 ring-ocean-100 ${SIZE_CLASS[size]} ${className}`;

  if (imageUrl) {
    return <img src={imageUrl} alt="Foto profil" className={`${base} object-cover`} />;
  }

  return (
    <div
      className={`${base} flex items-center justify-center bg-gradient-to-br from-ocean-600 to-ocean-800 font-extrabold text-white`}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}
