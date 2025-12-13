/**
 * Session Types
 *
 * Types for flow session tracking and timeline visualization.
 * Used in Flow Session Card and Timeline components.
 */

import type { FlowEntry } from './flow';

/** Flow mode status */
export type FlowMode = 'focus' | 'creative' | 'recovery' | 'off';

/** Mode banner data */
export interface FlowModeData {
  /** Currently active mode */
  mode: FlowMode;
  /** Whether the mode is active */
  isActive: boolean;
  /** Whether notifications are muted */
  notificationsMuted: boolean;
  /** List of blocked website categories */
  blockedWebsites?: string[];
}

/** Session data for the Flow Session Card */
export interface SessionData {
  /** Current time (for display) */
  currentTime: string;
  /** Total time in flow today (formatted string) */
  flowDuration: string;
  /** Flow entries for the session */
  entries: FlowEntry[];
}

/** Timeline data point for the chart */
export interface TimelinePoint {
  /** Timestamp in milliseconds */
  timestamp: number;
  /** Mental state value (0-100 scale) */
  value: number;
  /** Flow state at this point */
  state: 'creative' | 'focus' | 'recovery' | 'idle';
}

/** Timeline chart data */
export interface TimelineData {
  /** Array of data points */
  points: TimelinePoint[];
  /** Start time of the timeline */
  startTime: Date;
  /** End time of the timeline */
  endTime: Date;
  /** X-axis labels (hours) */
  xLabels: string[];
}

/** Mode display labels */
export const FLOW_MODE_LABELS: Record<FlowMode, string> = {
  focus: 'Focus Mode',
  creative: 'Creative Mode',
  recovery: 'Recovery Mode',
  off: 'Mode Off',
};
