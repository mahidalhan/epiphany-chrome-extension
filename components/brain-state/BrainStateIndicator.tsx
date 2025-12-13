import { useWxtStorage } from '@/lib/hooks/useWxtStorage';
import {
  brainState,
  getNextBrainState,
  BRAIN_STATE_CONFIG,
} from '@/stores/view';

/**
 * BrainStateIndicator - A clickable pill that displays and toggles the current brain state.
 *
 * Design: Small pill in top-right corner with icon + text
 * Behavior: Click to cycle through Creative → Focus → Recovery → Creative
 * Persistence: State saved to chrome.storage.local via WXT Storage
 */
export function BrainStateIndicator() {
  const [state, setState] = useWxtStorage(brainState);

  // Handle loading state (storage may not be immediately available)
  if (state === null) {
    return null;
  }

  const config = BRAIN_STATE_CONFIG[state];

  const handleClick = () => {
    setState(getNextBrainState(state));
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 rounded-[40px] px-2 py-1 transition-colors duration-200"
      style={{ backgroundColor: config.color }}
      aria-label={`Current mode: ${config.label}. Click to change.`}
    >
      <BrainIcon className="h-3.5 w-3.5 text-white" />
      <span className="text-xs font-medium text-white whitespace-nowrap">
        {config.label}
      </span>
    </button>
  );
}

/**
 * Simple brain/neural icon for the indicator
 */
function BrainIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Simplified brain shape */}
      <path d="M12 4.5a4.5 4.5 0 0 0-4.5 4.5c0 1.5.5 2.5 1.5 3.5-1 1-1.5 2-1.5 3.5a4.5 4.5 0 0 0 4.5 4.5" />
      <path d="M12 4.5a4.5 4.5 0 0 1 4.5 4.5c0 1.5-.5 2.5-1.5 3.5 1 1 1.5 2 1.5 3.5a4.5 4.5 0 0 1-4.5 4.5" />
      <path d="M12 4.5v16" />
      <path d="M8 9h8" />
      <path d="M8 15h8" />
    </svg>
  );
}

export default BrainStateIndicator;
