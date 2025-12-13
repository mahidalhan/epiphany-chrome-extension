/**
 * FlowprintsCard - Center column card containing 3D visualization and brain state info.
 *
 * Design specs from Figma:
 * - Card height: 648px
 * - Gap between sections: 24px
 *
 * Sections:
 * 1. FlowprintsHeader - Title + subtitle + lightbulb icon
 * 2. FlowprintsPlaceholder - 360x300px canvas (R3F in Phase 4)
 * 3. BrainStateChip - Golden gradient pill
 * 4. StateDescription - 3-paragraph explanation
 * 5. TipSection - Divider + tip text
 */

import { Card } from '@/components/card/Card';
import { FlowprintsHeader } from './FlowprintsHeader';
import { FlowprintsPlaceholder } from './FlowprintsPlaceholder';
import { BrainStateChip } from './BrainStateChip';
import { StateDescription } from './StateDescription';
import { TipSection } from './TipSection';
import type { BrainState } from '@/types/flow';

interface FlowprintsCardProps {
  /** Brain state data */
  brainState: BrainState;
}

export function FlowprintsCard({ brainState }: FlowprintsCardProps) {
  return (
    <Card height="648px">
      <div className="flex flex-col gap-6 h-full">
        {/* Header */}
        <FlowprintsHeader />

        {/* 3D Canvas Placeholder */}
        <FlowprintsPlaceholder />

        {/* Brain State Chip */}
        <div className="flex justify-center">
          <BrainStateChip hemisphere={brainState.activeHemisphere} />
        </div>

        {/* Description */}
        <div className="flex-1">
          <StateDescription paragraphs={brainState.description} />
        </div>

        {/* Tip Section */}
        <TipSection tip={brainState.tip} />
      </div>
    </Card>
  );
}

export default FlowprintsCard;
