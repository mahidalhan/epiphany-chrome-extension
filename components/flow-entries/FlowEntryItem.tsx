/**
 * FlowEntryItem - Single flow entry row with icon, text, time, and progress bar.
 *
 * Design specs from Figma:
 * - Entry Container: rounded-[12px], overflow-clip
 * - Entry Header Row: justify-between, gap-[8px]
 * - Icon: rounded-[48px], p-[4.8px]
 *   - Creative: Purple gradient linear-gradient(90deg, #9b38ff 0%, #9b38ff 100%)
 *   - Focus: Solid #86b4df
 *   - Recovery: Solid #64d65e
 *   - Inner icon: 14.4x14.4px (SVG)
 * - Text Column: gap-[4px]
 *   - Title: Manrope SemiBold 14px, #b8b8b8
 *   - Description: Manrope Regular 12px, rgba(255,255,255,0.6)
 * - Time: Manrope Medium 12px, rgba(255,255,255,0.54)
 *   - Active entry shows: "2:30 PM" + "~Now"
 *   - Past entries show: "1:30 PM" or "11:30 AM"
 * - Progress Bar: Height 44px container
 */

import { ProgressBar } from '@/components/shared/ProgressBar';
import type { FlowEntry, FlowState } from '@/types/flow';
import { FLOW_STATE_COLORS } from '@/types/flow';

// SVG imports for flow state icons
import CreativeFlowIcon from '@/assets/icons/flow-states/creative-flow.svg?react';
import DeepFocusIcon from '@/assets/icons/flow-states/deep-focus.svg?react';
import ActiveRecoveryIcon from '@/assets/icons/flow-states/active-recovery.svg?react';

/** Map flow states to their icon components */
const FLOW_STATE_ICONS: Record<FlowState, React.FC<React.SVGProps<SVGSVGElement>>> = {
  creative: CreativeFlowIcon,
  focus: DeepFocusIcon,
  recovery: ActiveRecoveryIcon,
};

interface FlowEntryItemProps {
  /** Flow entry data */
  entry: FlowEntry;
}

export function FlowEntryItem({ entry }: FlowEntryItemProps) {
  const color = FLOW_STATE_COLORS[entry.state];
  const IconComponent = FLOW_STATE_ICONS[entry.state];

  // Format time to display (e.g., "2:30 PM")
  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

  // Determine icon background style
  const iconBgStyle =
    entry.state === 'creative'
      ? { background: `linear-gradient(90deg, ${color} 0%, ${color} 100%)` }
      : { backgroundColor: color };

  // Active entry gets a subtle glow animation
  const activeClasses = entry.isActive
    ? 'animate-pulse-glow ring-1 ring-white/10'
    : '';

  return (
    <div className={`rounded-xl overflow-hidden transition-shadow duration-300 ${activeClasses}`}>
      {/* Header Row */}
      <div className="flex justify-between items-start gap-2 px-4 py-2">
        {/* Icon and Text */}
        <div className="flex items-center gap-2">
          {/* State Icon - 24x24 container, 4.8px padding, 14.4px inner icon */}
          <div
            className={`size-6 rounded-full p-[4.8px] text-bg-secondary ${entry.isActive ? 'animate-pulse' : ''}`}
            style={iconBgStyle}
          >
            <IconComponent className="size-[14.4px]" />
          </div>

          {/* Text Column */}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-text-muted font-manrope">
              {entry.title}
            </span>
            <span className="text-xs text-text-secondary font-manrope">
              {entry.description}
            </span>
          </div>
        </div>

        {/* Time */}
        <div className="text-xs text-[rgba(255,255,255,0.54)] font-medium font-manrope text-right">
          <div>{formatTime(entry.startTime)}</div>
          {entry.isActive && <div>~Now</div>}
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar value={entry.progress} color={color} />
    </div>
  );
}

export default FlowEntryItem;
