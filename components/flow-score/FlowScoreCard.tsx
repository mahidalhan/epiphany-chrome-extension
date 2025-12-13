/**
 * FlowScoreCard - Card container for the flow score gauge and share section.
 *
 * Design specs from Figma:
 * - Standard card styling (12px radius, 20px padding)
 * - Gap: 32px between gauge and share section
 * - Contains: FlowScoreGauge, ShareBar, ShareCTA
 */

import { Card } from '@/components/card/Card';
import { FlowScoreGauge } from './FlowScoreGauge';
import { ShareBar } from './ShareBar';
import { ShareCTA } from './ShareCTA';
import type { FlowScoreData } from '@/types/flow';

interface FlowScoreCardProps {
  /** Flow score data */
  data: FlowScoreData;
  /** Share button click handler */
  onShare?: () => void;
}

export function FlowScoreCard({ data, onShare }: FlowScoreCardProps) {
  return (
    <Card>
      <div className="flex flex-col items-center gap-8">
        {/* Circular Gauge */}
        <FlowScoreGauge score={data.score} />

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
