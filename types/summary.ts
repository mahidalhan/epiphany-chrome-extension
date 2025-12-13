/**
 * Summary Types
 *
 * Types for the Flow Summary Card with tooltip-style display.
 * Contains flow state summary, reminders, and distraction tracking.
 */

/** Distraction source information */
export interface DistractionSource {
  /** Unique identifier */
  id: string;
  /** Name of the app/website */
  name: string;
  /** Icon key for lookup */
  iconKey: 'x' | 'reddit' | 'youtube' | 'instagram' | 'tiktok' | 'other';
  /** Time spent on this distraction in minutes */
  timeSpentMinutes: number;
}

/** Reminder data */
export interface Reminder {
  /** File or task name */
  fileName: string;
  /** Scheduled reminder time */
  scheduledTime: string;
  /** Whether the reminder is pending */
  isPending: boolean;
}

/** Flow summary data for the tooltip card */
export interface FlowSummaryData {
  /** Total time in flow state today (formatted) */
  flowDuration: string;
  /** Hours component */
  flowHours: number;
  /** Minutes component */
  flowMinutes: number;
  /** Current task/project being worked on */
  currentTask?: string;
  /** Duration on current task (formatted) */
  taskDuration?: string;
  /** Total distraction time today (formatted) */
  distractionDuration: string;
  /** List of distraction sources */
  distractionSources: DistractionSource[];
  /** Pending reminder (if any) */
  reminder?: Reminder;
}

/** Distraction icon size configuration */
export const DISTRACTION_ICON_SIZE = 12; // 12x12px per Figma spec
