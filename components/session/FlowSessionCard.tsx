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
 */

import { Card } from '@/components/card/Card';
import { SessionHeader } from './SessionHeader';
import { TimelinePlaceholder } from '@/components/timeline/TimelinePlaceholder';
import { FlowEntriesList } from '@/components/flow-entries/FlowEntriesList';
import type { SessionData } from '@/types/session';

interface FlowSessionCardProps {
  /** Session data */
  data: SessionData;
}

export function FlowSessionCard({ data }: FlowSessionCardProps) {
  return (
    <Card className="flex-1 overflow-clip">
      <div className="flex flex-col gap-5">
        {/* Header */}
        <SessionHeader
          currentTime={data.currentTime}
          flowDuration={data.flowDuration}
        />

        {/* Timeline Chart Placeholder */}
        <TimelinePlaceholder />

        {/* Flow Entries */}
        <FlowEntriesList entries={data.entries} />
      </div>
    </Card>
  );
}

export default FlowSessionCard;
