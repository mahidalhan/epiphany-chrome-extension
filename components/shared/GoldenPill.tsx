import { type ReactNode } from 'react';

interface GoldenPillProps {
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * GoldenPill - Reusable golden gradient pill component.
 *
 * Used for:
 * - Brain State Chip ("Left/Right Brain Engaged")
 * - Mode ON badge
 *
 * Design specs from Figma (complex multi-stop gradient):
 * - Direction: 0deg (bottom to top)
 * - Stops:
 *   - 15%: rgba(173, 119, 40, 1)
 *   - 82.812%: rgba(255, 242, 219, 1)
 *   - 90%: rgba(250, 242, 227, 1)
 *   - 97.917%: rgba(251, 245, 209, 1)
 *   - 99.99%: rgba(189, 154, 75, 1)
 *   - 100%: rgba(236, 216, 163, 1)
 * - Border radius: 1000px (fully rounded)
 * - Padding: px-[12px] py-[6px]
 */
export function GoldenPill({ children, className = '' }: GoldenPillProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[1000px] text-black font-semibold text-sm ${className}`}
      style={{
        backgroundImage: `linear-gradient(
          0deg,
          rgba(173, 119, 40, 1) 15%,
          rgba(255, 242, 219, 1) 82.812%,
          rgba(250, 242, 227, 1) 90%,
          rgba(251, 245, 209, 1) 97.917%,
          rgba(189, 154, 75, 1) 99.99%,
          rgba(236, 216, 163, 1) 100%
        )`,
      }}
    >
      {children}
    </div>
  );
}

export default GoldenPill;
