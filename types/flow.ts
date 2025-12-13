/**
 * Flow State Types
 *
 * Core types for flow state tracking and visualization.
 * Used across Flow Score Card, Flow Entries, and Session components.
 */

/** Flow mental states detected by the EEG headphones */
export type FlowState = 'creative' | 'focus' | 'recovery';

/** Color mapping for flow states (from Figma design) */
export const FLOW_STATE_COLORS: Record<FlowState, string> = {
  creative: '#9b38ff', // Purple
  focus: '#86b4df', // Blue
  recovery: '#64d65e', // Green
};

/** Display labels for flow states */
export const FLOW_STATE_LABELS: Record<FlowState, string> = {
  creative: 'Creative Flow',
  focus: 'Deep Focus',
  recovery: 'Active Recovery',
};

/** Flow score data for the circular gauge */
export interface FlowScoreData {
  /** Current flow score (0-100) */
  score: number;
  /** Trend compared to yesterday (-100 to +100) */
  trend?: number;
  /** Time when score was last calculated */
  lastUpdated?: Date;
}

/** Individual flow entry in the session timeline */
export interface FlowEntry {
  /** Unique identifier */
  id: string;
  /** Type of flow state */
  state: FlowState;
  /** Title displayed in the entry */
  title: string;
  /** Description of what happened during this state */
  description: string;
  /** Start time of this flow state */
  startTime: Date;
  /** End time (undefined if currently active) */
  endTime?: Date;
  /** Progress percentage for the progress bar (0-100) */
  progress: number;
  /** Whether this is the currently active state */
  isActive?: boolean;
}

/** Brain hemisphere engagement state */
export type BrainHemisphere = 'left' | 'right' | 'balanced';

/** Brain state chip data */
export interface BrainState {
  /** Which hemisphere is more active */
  activeHemisphere: BrainHemisphere;
  /** Description paragraphs for the state */
  description: string[];
  /** Contextual tip for the user */
  tip: string;
}

/** Display labels for brain hemisphere states */
export const BRAIN_HEMISPHERE_LABELS: Record<BrainHemisphere, string> = {
  left: 'Left Brain Engaged',
  right: 'Right Brain Engaged',
  balanced: 'Balanced Engagement',
};
