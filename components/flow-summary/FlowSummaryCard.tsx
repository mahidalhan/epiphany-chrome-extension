/**
 * FlowSummaryCard - Tooltip-style card with flow summary, reminder, and distractions.
 *
 * Design specs from Figma:
 * - Container: bg-[#181818], border border-white/20, rounded-[8px], p-[12px], gap-[8px]
 * - Tooltip Beak: Triangular pointer at bottom-left
 *   - Size: 8x8px square rotated 45deg
 *   - Position: bottom-[-6.31px], left-[calc(50%-188.33px)]
 *   - Fill: #181818 with white stroke
 * - Title: "Your Flow Summary" (Manrope SemiBold 20px, white)
 *
 * Sections:
 * 1. FlowSummaryHighlight - Green box with flow state message
 * 2. FlowSummaryReminder - Pending reminder text
 * 3. Divider
 * 4. DistractionRow - Distraction time + app icons
 */

import { Card } from '@/components/card/Card';
import { Divider } from '@/components/shared/Divider';
import { FlowSummaryHighlight } from './FlowSummaryHighlight';
import { FlowSummaryReminder } from './FlowSummaryReminder';
import { DistractionRow } from './DistractionRow';
import { selectSummary, useSummaryStore } from '@/stores/summary';

export function FlowSummaryCard() {
  const data = useSummaryStore(selectSummary);

  return (
    <Card variant="tooltip">
      <div className="flex flex-col gap-2">
        {/* Title */}
        <h3 className="text-xl font-semibold text-white font-manrope">
          Your Flow Summary
        </h3>

        {/* Green Highlight Box */}
        <FlowSummaryHighlight
          flowHours={data.flowHours}
          flowMinutes={data.flowMinutes}
          currentTask={data.currentTask}
          taskDuration={data.taskDuration}
        />

        {/* Reminder Section (if present) */}
        {data.reminder && <FlowSummaryReminder reminder={data.reminder} />}

        {/* Divider */}
        <Divider className="my-2" />

        {/* Distraction Row */}
        <DistractionRow
          duration={data.distractionDuration}
          sources={data.distractionSources}
        />
      </div>
    </Card>
  );
}

export default FlowSummaryCard;
