/**
 * FlowprintsHeader - Title section with lightbulb icon.
 *
 * Design specs from Figma:
 * - Title: "Flowprints" (Manrope SemiBold 20px, white)
 * - Subtitle: "Live neural visualization" (12px, 60% white)
 * - Lightbulb Icon: 43x52px positioned top-right of header
 */

import LightbulbIcon from '@/assets/icons/misc/lightbulb.svg?react';

interface FlowprintsHeaderProps {
  /** Title text (default: "Flowprints") */
  title?: string;
  /** Subtitle text */
  subtitle?: string;
}

export function FlowprintsHeader({
  title = 'Flowprints',
  subtitle = 'Live neural visualization',
}: FlowprintsHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h2 className="text-xl font-semibold text-white font-manrope">{title}</h2>
        <p className="text-xs text-text-secondary font-manrope">{subtitle}</p>
      </div>

      {/* Lightbulb icon from Figma */}
      <LightbulbIcon className="w-[43px] h-[52px]" />
    </div>
  );
}

export default FlowprintsHeader;
