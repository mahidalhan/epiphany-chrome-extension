/**
 * ModeBannerCard - Card with golden mode pill and status messages.
 *
 * Design specs from Figma:
 * - Mode Pill: Golden gradient, rounded-[1000px], Lucide Zap + "___ Mode ON"
 * - Status Lines: 12px, rgba(255,255,255,0.6)
 *   - "All Browser notifications are muted"
 *   - "Certain websites are blocked." + info icon (underline dotted)
 */

import { Zap, Info } from 'lucide-react';
import { Card } from '@/components/card/Card';
import { GoldenPill } from '@/components/shared/GoldenPill';
import type { FlowModeData } from '@/types/session';
import { FLOW_MODE_LABELS } from '@/types/session';

interface ModeBannerCardProps {
  /** Flow mode data */
  data: FlowModeData;
}

export function ModeBannerCard({ data }: ModeBannerCardProps) {
  if (!data.isActive || data.mode === 'off') {
    return null;
  }

  return (
    <Card>
      <div className="flex flex-col gap-3">
        {/* Mode Pill */}
        <GoldenPill>
          <Zap className="w-3.5 h-3.5" />
          <span>{FLOW_MODE_LABELS[data.mode]} ON</span>
        </GoldenPill>

        {/* Status Messages */}
        <div className="flex flex-col gap-1 text-xs text-text-secondary font-manrope">
          {data.notificationsMuted && <p>All Browser notifications are muted</p>}
          {data.blockedWebsites && data.blockedWebsites.length > 0 && (
            <p className="flex items-center gap-1">
              <span className="underline decoration-dotted cursor-help">
                Certain websites are blocked.
              </span>
              <Info className="w-3.5 h-3.5 text-white/60" />
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

export default ModeBannerCard;
