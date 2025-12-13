/**
 * DistractionRow - Row showing distraction time and app icons.
 *
 * Design specs from Figma:
 * - Container: justify-between
 * - Left: "Distracted for 2 hours" (Manrope SemiBold 14px, rgba(255,255,255,0.6))
 * - Right: Overlapping app icons (distraction sources)
 *   - Icon size: 12x12px (smaller than share bar)
 *   - Overlap: -8px margin
 *   - Apps shown: X, Instagram, YouTube
 */

import { OverlappingIcons } from '@/components/shared/OverlappingIcons';
import type { DistractionSource } from '@/types/summary';

// SVG imports - all optimized with SVGO
import XIcon from '@/assets/icons/distractions/x.svg?react';
import InstagramIcon from '@/assets/icons/distractions/instagram.svg?react';
import YouTubeIcon from '@/assets/icons/distractions/youtube.svg?react';

interface DistractionRowProps {
  /** Total distraction duration (formatted string) */
  duration: string;
  /** List of distraction sources */
  sources: DistractionSource[];
}

export function DistractionRow({ duration, sources }: DistractionRowProps) {
  // Convert distraction sources to icon format
  const icons = sources.map((source) => {
    let iconElement: React.ReactNode;

    switch (source.iconKey) {
      case 'x':
        iconElement = <XIcon className="w-3 h-3" />;
        break;
      case 'instagram':
        iconElement = <InstagramIcon className="w-3 h-3" />;
        break;
      case 'youtube':
        iconElement = <YouTubeIcon className="w-3 h-3" />;
        break;
      default:
        // Fallback for unknown sources - colored circle with initial
        iconElement = (
          <div
            className="w-3 h-3 rounded-full flex items-center justify-center text-[5px] font-bold text-white bg-gray-600"
          >
            {source.name.charAt(0)}
          </div>
        );
    }

    return {
      key: source.id,
      icon: iconElement,
      alt: source.name,
    };
  });

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-semibold text-text-secondary font-manrope">
        Distracted for {duration}
      </span>
      <OverlappingIcons icons={icons} size={12} overlap={8} />
    </div>
  );
}

export default DistractionRow;
