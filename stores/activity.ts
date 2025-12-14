/**
 * Activity Store
 *
 * Zustand store for activity tracking and timeline data.
 * Skeleton implementation for Phase 5 - full tracking comes in Phase 6.
 * Initialized with mock data for visual development.
 */

import { create } from 'zustand';
import type { TimelinePoint, TimelineData } from '@/types/session';
import { mockTimeline, mockSession } from '@/lib/mock/static-data';

// =============================================================================
// Activity Store Types
// =============================================================================

interface FlowDuration {
  hours: number;
  minutes: number;
}

interface ActivityStoreState {
  /** Timeline data points for chart */
  timeline: TimelinePoint[];
  /** Timeline metadata */
  timelineStart: Date;
  timelineEnd: Date;
  timelineLabels: string[];
  /** Total flow duration today */
  flowDuration: FlowDuration;
  /** Current time display string */
  currentTime: string;
}

interface ActivityStoreActions {
  /** Add a new timeline point */
  addTimelinePoint: (point: TimelinePoint) => void;
  /** Set timeline data (from background worker) */
  setTimeline: (data: TimelineData) => void;
  /** Update flow duration */
  setFlowDuration: (duration: FlowDuration) => void;
  /** Update current time display */
  setCurrentTime: (time: string) => void;
  /** Reset timeline (for new day) */
  resetTimeline: () => void;
}

export type ActivityStore = ActivityStoreState & ActivityStoreActions;

// =============================================================================
// Parse Duration Helper
// =============================================================================

function parseFlowDuration(durationStr: string): FlowDuration {
  // Parse "8h 30m in flow" format
  const hourMatch = durationStr.match(/(\d+)h/);
  const minMatch = durationStr.match(/(\d+)m/);
  return {
    hours: hourMatch?.[1] ? parseInt(hourMatch[1], 10) : 0,
    minutes: minMatch?.[1] ? parseInt(minMatch[1], 10) : 0,
  };
}

// =============================================================================
// Initial State (from mock data)
// =============================================================================

const initialState: ActivityStoreState = {
  timeline: mockTimeline.points,
  timelineStart: mockTimeline.startTime,
  timelineEnd: mockTimeline.endTime,
  timelineLabels: mockTimeline.xLabels,
  flowDuration: parseFlowDuration(mockSession.flowDuration),
  currentTime: mockSession.currentTime,
};

// =============================================================================
// Store Creation
// =============================================================================

export const useActivityStore = create<ActivityStore>()((set) => ({
  ...initialState,

  addTimelinePoint: (point) =>
    set((state) => ({
      timeline: [...state.timeline, point].sort((a, b) => a.timestamp - b.timestamp),
    })),

  setTimeline: (data) =>
    set({
      timeline: data.points,
      timelineStart: data.startTime,
      timelineEnd: data.endTime,
      timelineLabels: data.xLabels,
    }),

  setFlowDuration: (duration) =>
    set({ flowDuration: duration }),

  setCurrentTime: (time) =>
    set({ currentTime: time }),

  resetTimeline: () =>
    set({
      timeline: [],
      flowDuration: { hours: 0, minutes: 0 },
    }),
}));

// =============================================================================
// Selectors
// =============================================================================

export const selectTimeline = (state: ActivityStore): TimelineData => ({
  points: state.timeline,
  startTime: state.timelineStart,
  endTime: state.timelineEnd,
  xLabels: state.timelineLabels,
});

export const selectFlowDuration = (state: ActivityStore): FlowDuration =>
  state.flowDuration;

export const selectFlowDurationFormatted = (state: ActivityStore): string => {
  const { hours, minutes } = state.flowDuration;
  if (hours === 0 && minutes === 0) return '0m in flow';
  if (hours === 0) return `${minutes}m in flow`;
  if (minutes === 0) return `${hours}h in flow`;
  return `${hours}h ${minutes}m in flow`;
};

export const selectCurrentTime = (state: ActivityStore): string =>
  state.currentTime;
