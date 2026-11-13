import { forwardRef } from 'react';
import type { LucideProps } from 'lucide-react';

/**
 * SlantedTicket icon — exact 45-degree angled ticket icon with cutouts
 * matching the design reference from the sidebar & ticket features.
 */
export const SlantedTicket = forwardRef<SVGSVGElement, LucideProps>(
  ({ className = '', size = 24, strokeWidth = 2, color = 'currentColor', ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-ticket ${className}`}
      {...props}
    >
      <g transform="rotate(-45 12 12)">
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        <path d="M13 5v2" />
        <path d="M13 17v2" />
        <path d="M13 11v2" />
      </g>
    </svg>
  )
);

SlantedTicket.displayName = 'SlantedTicket';

export default SlantedTicket;
