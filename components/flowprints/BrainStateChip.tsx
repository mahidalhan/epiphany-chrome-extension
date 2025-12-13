/**
 * BrainStateChip - Golden gradient pill showing brain hemisphere engagement.
 *
 * Design specs from Figma:
 * - Uses GoldenPill component
 * - Text: "Left Brain Engaged" or "Right Brain Engaged" or "Balanced Engagement"
 *
 * This is a semantic wrapper around GoldenPill for brain state display.
 */

import { GoldenPill } from '@/components/shared/GoldenPill';
import type { BrainHemisphere } from '@/types/flow';
import { BRAIN_HEMISPHERE_LABELS } from '@/types/flow';

interface BrainStateChipProps {
  /** Active brain hemisphere */
  hemisphere: BrainHemisphere;
  /** Additional CSS classes */
  className?: string;
}

export function BrainStateChip({ hemisphere, className = '' }: BrainStateChipProps) {
  return (
    <GoldenPill className={className}>{BRAIN_HEMISPHERE_LABELS[hemisphere]}</GoldenPill>
  );
}

export default BrainStateChip;
