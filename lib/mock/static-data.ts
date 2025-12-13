/**
 * Static Mock Data
 *
 * Hardcoded values for Phase 3 visual development.
 * These will be replaced with dynamic seed data generators in Phase 7.
 *
 * NOTE: This is NOT the Phase 7 seed dataset - just static props for visual development.
 */

import type { FlowScoreData, FlowEntry, BrainState } from '@/types/flow';
import type { DeviceState } from '@/types/device';
import type { SessionData, FlowModeData, TimelineData } from '@/types/session';
import type { FlowSummaryData } from '@/types/summary';

// =============================================================================
// Flow Score Data
// =============================================================================

export const mockFlowScore: FlowScoreData = {
  score: 85,
  trend: 12,
  lastUpdated: new Date(),
};

// =============================================================================
// Device Data
// =============================================================================

export const mockDevice: DeviceState = {
  name: 'Epiphany Headphones',
  status: 'connected',
  battery: {
    percentage: 87,
    isCharging: false,
    estimatedMinutes: 240,
  },
  firmwareVersion: '2.1.0',
};

// =============================================================================
// Flow Summary Data
// =============================================================================

export const mockFlowSummary: FlowSummaryData = {
  flowDuration: '4 hours and 22 minutes',
  flowHours: 4,
  flowMinutes: 22,
  currentTask: 'any presentation',
  taskDuration: '2 hours',
  distractionDuration: '2 hours',
  distractionSources: [
    { id: '1', name: 'X (Twitter)', iconKey: 'x', timeSpentMinutes: 45 },
    { id: '2', name: 'Instagram', iconKey: 'instagram', timeSpentMinutes: 35 },
    { id: '3', name: 'YouTube', iconKey: 'youtube', timeSpentMinutes: 40 },
  ],
  reminder: {
    fileName: 'Some file Name',
    scheduledTime: '00:00 hrs',
    isPending: true,
  },
};

// =============================================================================
// Brain State Data
// =============================================================================

export const mockBrainState: BrainState = {
  activeHemisphere: 'left',
  description: [
    'Your left hemisphere is currently more active, indicating analytical and logical processing.',
    'This is optimal for tasks requiring detail orientation and systematic thinking.',
    'You may find it easier to focus on structured tasks, coding, or data analysis right now.',
  ],
  tip: 'Take short breaks to activate your right hemisphere for creative insights.',
};

// =============================================================================
// Flow Mode Data
// =============================================================================

export const mockFlowMode: FlowModeData = {
  mode: 'focus',
  isActive: true,
  notificationsMuted: true,
  blockedWebsites: ['Social Media', 'News', 'Entertainment'],
};

// =============================================================================
// Flow Session Data
// =============================================================================

const now = new Date();
const twoThirtyPM = new Date(now);
twoThirtyPM.setHours(14, 30, 0, 0);

const oneThirtyPM = new Date(now);
oneThirtyPM.setHours(13, 30, 0, 0);

const elevenThirtyAM = new Date(now);
elevenThirtyAM.setHours(11, 30, 0, 0);

export const mockFlowEntries: FlowEntry[] = [
  {
    id: '1',
    state: 'creative',
    title: 'Creative Flow',
    description: 'High creativity Spike detected- breakthrough moment',
    startTime: twoThirtyPM,
    endTime: undefined,
    progress: 77,
    isActive: true,
  },
  {
    id: '2',
    state: 'focus',
    title: 'Deep Focus',
    description: 'Entered deep focus state for 2.5 hours',
    startTime: oneThirtyPM,
    endTime: twoThirtyPM,
    progress: 100,
    isActive: false,
  },
  {
    id: '3',
    state: 'recovery',
    title: 'Active Recovery',
    description: 'You were recovering your energy after working hard.',
    startTime: elevenThirtyAM,
    endTime: oneThirtyPM,
    progress: 100,
    isActive: false,
  },
];

export const mockSession: SessionData = {
  currentTime: '15:40',
  flowDuration: '8h 30m in flow',
  entries: mockFlowEntries,
};

// =============================================================================
// Timeline Data (Placeholder for Phase 5)
// =============================================================================

export const mockTimeline: TimelineData = {
  points: [], // Will be populated in Phase 5
  startTime: new Date(now.setHours(9, 0, 0, 0)),
  endTime: new Date(now.setHours(16, 0, 0, 0)),
  xLabels: ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
};

// =============================================================================
// Social Share Icons (for ShareBar)
// =============================================================================

export const socialPlatforms = [
  { key: 'linkedin', name: 'LinkedIn' },
  { key: 'x', name: 'X (Twitter)' },
  { key: 'instagram', name: 'Instagram' },
  { key: 'reddit', name: 'Reddit' },
  { key: 'threads', name: 'Threads' },
] as const;

export type SocialPlatform = (typeof socialPlatforms)[number]['key'];
