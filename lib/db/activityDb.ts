import Dexie, { type Table } from 'dexie';
import type { ActivityCategory } from '@/lib/classification/classifyUrl';

export type ActivityEventType =
  | 'tab_active'
  | 'tab_nav'
  | 'tab_closed'
  | 'window_blur'
  | 'idle';

export interface ActivityEvent {
  id?: number;
  tsStart: number;
  tsEnd?: number;
  durationMs?: number;
  url?: string;
  hostname?: string;
  category: ActivityCategory;
  tabId?: number;
  windowId?: number;
  eventType: ActivityEventType;
  sessionActive: boolean;
}

class EpiphanyDb extends Dexie {
  activityEvents!: Table<ActivityEvent, number>;

  constructor() {
    super('epiphany');

    // Keep schema minimal and query-friendly:
    // - We primarily query by tsStart for retention and rolling windows
    // - category/sessionActive are useful for aggregates
    this.version(1).stores({
      activityEvents:
        '++id, tsStart, tsEnd, category, eventType, sessionActive, hostname, tabId, windowId',
    });
  }
}

export const epiphanyDb = new EpiphanyDb();

export function retentionCutoffMs(days: number, now: number): number {
  return now - days * 24 * 60 * 60 * 1000;
}

export async function addActivityEvent(event: ActivityEvent): Promise<number> {
  return epiphanyDb.activityEvents.add(event);
}

export async function cleanupOldActivityEvents(
  now: number = Date.now(),
  retentionDays: number = 30
): Promise<void> {
  const cutoff = retentionCutoffMs(retentionDays, now);
  await epiphanyDb.activityEvents.where('tsStart').below(cutoff).delete();
}

