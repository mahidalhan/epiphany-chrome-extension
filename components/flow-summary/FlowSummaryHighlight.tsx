/**
 * FlowSummaryHighlight - Green highlight box showing flow state message.
 *
 * Design specs from Figma:
 * - Container: bg-[#3b653f], rounded-[8px], p-[8px]
 * - Text: Manrope Regular 12px, rgba(255,255,255,0.6)
 * - Dynamic highlights in SemiBold white
 *
 * Example: "You are in flow state since 4 hours and 22 minutes today.
 * Great spirit, You were able to work on the [any presentation] for 2 hours
 * without getting distracted."
 */

interface FlowSummaryHighlightProps {
  /** Hours in flow state */
  flowHours: number;
  /** Minutes in flow state */
  flowMinutes: number;
  /** Current task name (optional) */
  currentTask?: string;
  /** Duration on current task (optional) */
  taskDuration?: string;
}

export function FlowSummaryHighlight({
  flowHours,
  flowMinutes,
  currentTask,
  taskDuration,
}: FlowSummaryHighlightProps) {
  const flowDuration = `${flowHours} hours and ${flowMinutes} minutes`;

  return (
    <div className="bg-[#3b653f] rounded-lg p-2">
      <p className="text-xs text-text-secondary font-manrope leading-relaxed">
        You are in flow state since{' '}
        <span className="font-semibold text-white">{flowDuration}</span> today.
        {currentTask && taskDuration && (
          <>
            {' '}
            Great spirit, You were able to work on the{' '}
            <span className="font-semibold text-white">[{currentTask}]</span> for{' '}
            {taskDuration} without getting distracted.
          </>
        )}
      </p>
    </div>
  );
}

export default FlowSummaryHighlight;
