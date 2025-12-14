/**
 * FlowSessionCard - Card containing session header, timeline chart, and flow entries.
 *
 * Design specs from Figma:
 * - Container: Standard card, overflow-clip
 * - Internal Gap: gap-[20px] between sections
 *
 * Sections:
 * 1. SessionHeader - Title + time + duration
 * 2. TimelinePlaceholder - Static chart (uPlot in Phase 5)
 * 3. FlowEntriesList - Flow entry items with progress bars
 *
 * State: Reads from useActivityStore (timeline, duration)
 *        FlowEntriesList reads its own entries from useFlowStore
 */

import { Card } from '@/components/card/Card';
import { SessionHeader } from './SessionHeader';
import { TimelineChart } from '@/components/timeline/TimelineChart';
import { FlowEntriesList } from '@/components/flow-entries/FlowEntriesList';
import { useActivityStore, selectFlowDurationFormatted, selectCurrentTime } from '@/stores';
import type { ActivityStore } from '@/stores/activity';

// Stable selectors outside component to prevent re-subscription loops
const selectTimelinePoints = (state: ActivityStore) => state.timeline;
const selectTimelineLabels = (state: ActivityStore) => state.timelineLabels;

export function FlowSessionCard() {
  const currentTime = useActivityStore(selectCurrentTime);
  const flowDuration = useActivityStore(selectFlowDurationFormatted);
  const timelinePoints = useActivityStore(selectTimelinePoints);
  const timelineLabels = useActivityStore(selectTimelineLabels);

  return (
    <Card className="flex-1 overflow-clip">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <SessionHeader
          currentTime={currentTime}
          flowDuration={flowDuration}
        />

        {/* Timeline Chart */}
        <TimelineChart points={timelinePoints} xLabels={timelineLabels} />

        {/* Flow Entries (reads from useFlowStore internally) */}
        <FlowEntriesList />
      </div>
    </Card>
  );
}

export default FlowSessionCard;
