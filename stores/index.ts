/**
 * Stores Barrel Export
 *
 * Central export for all Zustand stores.
 *
 * Store Architecture:
 * - WXT Storage (view.ts): Persisted user preferences (viewMode, brainState)
 * - Zustand Stores: Runtime state with optional chrome.storage.local persistence
 *   - flow.ts: Flow score (persisted), entries (transient)
 *   - device.ts: Device state (transient, from BLE in Phase 8)
 *   - activity.ts: Timeline data (transient, Phase 6 adds tracking)
 */

// WXT Storage items (persisted preferences)
export {
  viewMode,
  brainState,
  BRAIN_STATES,
  BRAIN_STATE_CONFIG,
  getNextBrainState,
  type BrainState,
} from './view';

// Zustand stores
export {
  useFlowStore,
  selectFlowScore,
  selectFlowEntries,
  selectActiveEntry,
  selectHasHydrated,
} from './flow';

export {
  useDeviceStore,
  selectDeviceState,
  selectIsConnected,
  selectBatteryPercentage,
} from './device';

export {
  useActivityStore,
  selectTimeline,
  selectFlowDuration,
  selectFlowDurationFormatted,
  selectCurrentTime,
} from './activity';

export { useSummaryStore, selectSummary } from './summary';
