/**
 * ModeBannerCard - Card with golden mode pill and status messages.
 *
 * Design specs from Figma:
 * - Mode Pill: Golden gradient, rounded-[1000px], Lucide Zap + "___ Mode ON"
 * - Status Lines: 12px, rgba(255,255,255,0.6)
 *   - "All Browser notifications are muted"
 *   - "Certain websites are blocked." + info icon (underline dotted)
 */

import { Info, Play, Square, Zap } from 'lucide-react';
import { Card } from '@/components/card/Card';
import { GoldenPill } from '@/components/shared/GoldenPill';
import { FLOW_MODE_LABELS } from '@/types/session';
import { useWxtStorage } from '@/lib/hooks/useWxtStorage';
import { brainState, flowSessionActive } from '@/stores/view';
import { sendSessionEnd, sendSessionStart } from '@/lib/messaging';

export function ModeBannerCard() {
  const [targetMode] = useWxtStorage(brainState);
  const [sessionActive, setSessionActive] = useWxtStorage(flowSessionActive);

  // While storage loads, avoid rendering a confusing control.
  if (targetMode === null || sessionActive === null) return null;

  const handleStart = async () => {
    await setSessionActive(true);
    await sendSessionStart();
  };

  const handleEnd = async () => {
    await setSessionActive(false);
    await sendSessionEnd();
  };

  return (
    <Card>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          {/* Mode Pill */}
          <GoldenPill>
            <Zap className="w-3.5 h-3.5" />
            <span>
              {FLOW_MODE_LABELS[targetMode]} {sessionActive ? 'ON' : 'OFF'}
            </span>
          </GoldenPill>

          {/* Session controls */}
          {sessionActive ? (
            <button
              onClick={handleEnd}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white px-2.5 py-1.5 text-xs font-manrope transition-colors"
              aria-label="End flow session"
            >
              <Square className="w-3.5 h-3.5" />
              End
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white px-2.5 py-1.5 text-xs font-manrope transition-colors"
              aria-label="Start flow session"
            >
              <Play className="w-3.5 h-3.5" />
              Start
            </button>
          )}
        </div>

        {/* Status Messages */}
        <div className="flex flex-col gap-1 text-xs text-text-secondary font-manrope">
          {/* Placeholder status lines (real controls come in later phases) */}
          {sessionActive && <p>All Browser notifications are muted</p>}
          {sessionActive && (
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
