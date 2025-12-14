import { storage } from '@wxt-dev/storage';

/**
 * View mode determines which view is displayed in the new tab page.
 * - 'minimal': Quick-load view with search, logo, and brain state toggle
 * - 'dashboard': Full dashboard with flow metrics, timeline, and 3D visualization
 */
export const viewMode = storage.defineItem<'minimal' | 'dashboard'>(
  'local:viewMode',
  { fallback: 'minimal' }
);

/**
 * Brain states represent user-selected cognitive modes.
 * The headset delivers targeted neurostimulation based on the selected mode.
 *
 * - 'creative': Purple (#9b38ff) - Enhanced divergent thinking
 * - 'focus': Blue (#86b4df) - Deep concentration mode
 * - 'recovery': Green (#64d65e) - Relaxation and recovery
 */
export const BRAIN_STATES = ['creative', 'focus', 'recovery'] as const;
export type BrainState = (typeof BRAIN_STATES)[number];

export const brainState = storage.defineItem<BrainState>(
  'local:brainState',
  { fallback: 'focus' }
);

/**
 * Flow session active flag.
 * Defines session boundaries: user starts/stops “Flow Mode”.
 */
export const flowSessionActive = storage.defineItem<boolean>(
  'local:flowSessionActive',
  { fallback: false }
);

/**
 * Cycle to the next brain state in the sequence:
 * Creative → Focus → Recovery → Creative
 */
export function getNextBrainState(current: BrainState): BrainState {
  const idx = BRAIN_STATES.indexOf(current);
  const nextIdx = (idx + 1) % BRAIN_STATES.length;
  // Safe assertion: nextIdx is always 0, 1, or 2 (valid indices)
  return BRAIN_STATES[nextIdx]!;
}

/**
 * Brain state configuration for UI rendering
 */
export const BRAIN_STATE_CONFIG: Record<
  BrainState,
  {
    label: string;
    color: string;
    bgClass: string;
  }
> = {
  creative: {
    label: 'Creative Mode',
    color: '#9b38ff',
    bgClass: 'bg-[#9b38ff]',
  },
  focus: {
    label: 'Focus Mode',
    color: '#86b4df',
    bgClass: 'bg-[#86b4df]',
  },
  recovery: {
    label: 'Recovery Mode',
    color: '#64d65e',
    bgClass: 'bg-[#64d65e]',
  },
};
