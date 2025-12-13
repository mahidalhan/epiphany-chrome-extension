/**
 * TipSection - Contextual advice with divider.
 *
 * Design specs from Figma:
 * - Divider: Full-width, 1px, rgba(255,255,255,0.2)
 * - "Tip:" label: Manrope SemiBold 12px, white
 * - Tip content: Manrope Light 12px, 80% white opacity
 */

import { Divider } from '@/components/shared/Divider';

interface TipSectionProps {
  /** Tip content text */
  tip: string;
  /** Additional CSS classes */
  className?: string;
}

export function TipSection({ tip, className = '' }: TipSectionProps) {
  return (
    <div className={className}>
      <Divider className="mb-4" />
      <p className="text-xs font-manrope">
        <span className="font-semibold text-white">Tip:</span>{' '}
        <span className="font-light text-white/80">{tip}</span>
      </p>
    </div>
  );
}

export default TipSection;
