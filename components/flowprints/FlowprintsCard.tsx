/**
 * FlowprintsCard - Center column card containing 3D visualization and brain state info.
 *
 * Design specs from Figma:
 * - Card height: 648px
 * - Gap between sections: 24px
 *
 * Sections:
 * 1. FlowprintsHeader - Title + subtitle + lightbulb icon
 * 2. FlowprintsCanvas - 360x300px animated 3D gradient blob (Phase 4)
 * 3. BrainStateChip - Golden gradient pill (LEFT-aligned per Figma)
 * 4. StateDescription - 3-paragraph explanation
 * 5. TipSection - Divider + tip text
 *
 * Data Flow (Phase 4 MVP):
 * - 3D colors: Driven by storage brainState (user-selected mode)
 * - Chip/Description: Static mock data (until Phase 8 when EEG is available)
 */

import { Card } from '@/components/card/Card';
import { useWxtStorage } from '@/lib/hooks/useWxtStorage';
import { brainState as brainStateStorage, type BrainState as StorageBrainState } from '@/stores/view';
import type { BrainState } from '@/types/flow';

import { BrainStateChip } from './BrainStateChip';
import { FlowprintsCanvas } from './FlowprintsCanvas';
import { FlowprintsHeader } from './FlowprintsHeader';
import { StateDescription } from './StateDescription';
import { TipSection } from './TipSection';

interface FlowprintsCardProps {
  /**
   * Brain state data for UI display (chip, description, tip).
   * In Phase 4, this comes from static mock data.
   * In Phase 8+, this will come from EEG detection.
   */
  brainState: BrainState;
}

export function FlowprintsCard({ brainState }: FlowprintsCardProps) {
  // Get storage brain state for 3D visualization colors
  // This is the user-selected mode (creative/focus/recovery)
  const [storageBrainState] = useWxtStorage(brainStateStorage);

  // Default to 'focus' while loading
  const canvasBrainState: StorageBrainState = storageBrainState ?? 'focus';

  return (
    <Card height="648px">
      <div className="flex flex-col gap-6 h-full">
        {/* Header */}
        <FlowprintsHeader />

        {/* 3D Canvas - colors driven by user-selected mode */}
        <FlowprintsCanvas brainState={canvasBrainState} />

        {/* Brain State Chip - LEFT-ALIGNED per Figma */}
        <BrainStateChip hemisphere={brainState.activeHemisphere} />

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
