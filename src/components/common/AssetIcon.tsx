import dashboardRaw from '@/assets/icons/boxicons_dashboard.svg?raw';
import ticketRaw from '@/assets/icons/fluent_ticket-diagonal-20-regular.svg?raw';
import reportRaw from '@/assets/icons/boxicons_reporfile.svg?raw';
import profileRaw from '@/assets/icons/coolicons_circle-info-sharp.svg?raw';
import commentRaw from '@/assets/icons/iconoven_comment-flag.svg?raw';
import usersRaw from '@/assets/icons/ci_users.svg?raw';

/**
 * Ubah SVG mentah menjadi SVG yang mengikuti warna teks (`currentColor`)
 * dan memenuhi ukuran wrapper-nya.
 */
function prepareSvg(raw: string): string {
  return raw
    .replace(/<svg([^>]*)>/, (_match, attrs: string) => {
      const cleaned = attrs
        .replace(/\s(width|height)="[^"]*"/g, '')
        .replace(/\sclass="[^"]*"/g, '');
      return `<svg${cleaned} width="100%" height="100%" class="block">`;
    })
    .replace(/(fill|stroke)="(black|#000000?)"/gi, '$1="currentColor"');
}

interface AssetIconProps {
  svg: string;
  className?: string;
}

/** Ikon SVG dari folder aset yang dirender inline, warnanya mengikuti `text-*` di sekitarnya. */
export function AssetIcon({ svg, className }: AssetIconProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center ${className ?? ''}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

/** Buat komponen ikon dari string SVG, kompatibel dengan prop `icon` di sidebar. */
function createAssetIcon(raw: string) {
  const svg = prepareSvg(raw);
  return function SidebarAssetIcon({ className }: { className?: string }) {
    return <AssetIcon svg={svg} className={className} />;
  };
}

export const DashboardIcon = createAssetIcon(dashboardRaw);
export const TicketIcon = createAssetIcon(ticketRaw);
export const ReportIcon = createAssetIcon(reportRaw);
export const ProfileIcon = createAssetIcon(profileRaw);
export const FeedbackIcon = createAssetIcon(commentRaw);
export const StaffIcon = createAssetIcon(usersRaw);
