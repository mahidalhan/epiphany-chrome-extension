/**
 * FlowSummaryReminder - Pending reminder text with bold highlights.
 *
 * Design specs from Figma:
 * - Container: px-0 py-[4px]
 * - Text: Manrope Regular 12px, rgba(255,255,255,0.6)
 * - File name: SemiBold white
 * - Time: Bold white
 *
 * Example: "Your [Some file Name] is pending. You asked me to remind you at [00:00 hrs]"
 */

import type { Reminder } from '@/types/summary';

interface FlowSummaryReminderProps {
  /** Reminder data */
  reminder: Reminder;
}

export function FlowSummaryReminder({ reminder }: FlowSummaryReminderProps) {
  if (!reminder.isPending) {
    return null;
  }

  return (
    <div className="py-1">
      <p className="text-xs text-text-secondary font-manrope leading-relaxed">
        Your <span className="font-semibold text-white">[{reminder.fileName}]</span> is
        pending. You asked me to remind you at{' '}
        <span className="font-bold text-white">[{reminder.scheduledTime}]</span>
      </p>
    </div>
  );
}

export default FlowSummaryReminder;
