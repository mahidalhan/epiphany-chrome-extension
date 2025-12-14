/**
 * FlowScoreCard - Card container for the flow score gauge and share section.
 *
 * Design specs from Figma:
 * - Standard card styling (12px radius, 20px padding)
 * - Gap: 32px between gauge and share section
 * - Contains: FlowScoreGauge, ShareBar, ShareCTA
 *
 * State: Reads from useFlowStore (Zustand)
 */

import { Card } from '@/components/card/Card';
import { FlowScoreGauge } from './FlowScoreGauge';
import { ShareBar } from './ShareBar';
import { ShareCTA } from './ShareCTA';
import { useFlowStore } from '@/stores';

interface FlowScoreCardProps {
  /** Share button click handler */
  onShare?: () => void;
}

// Stable selector outside component to prevent re-subscription loops
// Using a simple function that returns the score property
const selectScore = (state: { score: number }) => state.score;

export function FlowScoreCard({ onShare }: FlowScoreCardProps) {
  const score = useFlowStore(selectScore);

  return (
    <Card>
      <div className="flex flex-col items-center gap-8">
        {/* Circular Gauge */}
        <FlowScoreGauge score={score} />

        {/* Share Section */}
        <div className="flex flex-col items-center gap-4">
          <ShareBar />
          <ShareCTA onShare={onShare} />
        </div>
      </div>
    </Card>
  );
}

export default FlowScoreCard;
