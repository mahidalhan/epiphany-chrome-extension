/**
 * SessionHeader - Flow session card header with title, time, and duration.
 *
 * Design specs from Figma:
 * - Container: justify-between
 * - Left: "Today's Flow Session" (Manrope SemiBold 16px, white)
 * - Right: gap-[4px]
 *   - Current time: Manrope Medium 12px, rgba(255,255,255,0.6)
 *   - Dot separator: 8x8px circle (using a smaller dot)
 *   - Duration: Manrope Medium 12px, rgba(255,255,255,0.6)
 */

interface SessionHeaderProps {
  /** Title text */
  title?: string;
  /** Current time (formatted string) */
  currentTime: string;
  /** Flow duration (formatted string) */
  flowDuration: string;
}

export function SessionHeader({
  title = "Today's Flow Session",
  currentTime,
  flowDuration,
}: SessionHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-base font-semibold text-white font-manrope">{title}</h3>
      <div className="flex items-center gap-1 text-xs text-text-secondary font-medium font-manrope">
        <span>{currentTime}</span>
        <span className="w-1 h-1 rounded-full bg-current" />
        <span>{flowDuration}</span>
      </div>
    </div>
  );
}

export default SessionHeader;
