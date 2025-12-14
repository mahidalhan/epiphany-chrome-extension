/**
 * Epiphany Background Service Worker
 *
 * Phase 1: Empty placeholder
 * Phase 5: Message passing skeleton between newtab and background
 * Phase 6: Browser activity tracking (tabs, idle detection)
 * Phase 8: Bluetooth/EEG data processing
 */

import { isMessage, isMessageType, type Message, type MessageResponse } from '@/lib/messaging';
import { classifyUrl, type ActivityCategory } from '@/lib/classification/classifyUrl';
import { addActivityEvent, cleanupOldActivityEvents, type ActivityEventType } from '@/lib/db/activityDb';
import type { FlowState } from '@/types/flow';
import { FlowSimulator } from '@/lib/mock/simulator';
import type { FlowSummaryData } from '@/types/summary';

export default defineBackground(() => {
  console.log('[Epiphany] Background service worker initialized');

  // Phase 6: Retention cleanup (30-day default)
  cleanupOldActivityEvents().catch((error) => {
    console.warn('[Background] Activity DB cleanup failed:', error);
  });

  // ==========================================================================
  // Phase 5: Message Listener
  // ==========================================================================

  chrome.runtime.onMessage.addListener(
    (
      message: unknown,
      _sender: chrome.runtime.MessageSender,
      sendResponse: (response: MessageResponse) => void
    ) => {
      // Validate message structure
      if (!isMessage(message)) {
        console.warn('[Background] Invalid message received:', message);
        sendResponse({ success: false, error: 'Invalid message format' });
        return false;
      }

      console.log(`[Background] Received ${message.type}:`, message.payload);

      // Handle message by type
      handleMessage(message)
        .then(sendResponse)
        .catch((error) => {
          console.error(`[Background] Error handling ${message.type}:`, error);
          sendResponse({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        });

      // Return true to indicate async response
      return true;
    }
  );

  // ==========================================================================
  // Phase 6: Browser Activity Tracking
  // ==========================================================================

  startActivityTracking();

  // Phase 8: EEG data processing from Web Worker
  // Will process 256Hz data stream from BLE connection
});

// =============================================================================
// Message Handlers
// =============================================================================

/**
 * Route messages to appropriate handlers.
 * Skeleton implementation - handlers will be expanded in later phases.
 */
async function handleMessage(message: Message): Promise<MessageResponse> {
  // System messages
  if (isMessageType(message, 'PING')) {
    return { success: true, data: { timestamp: Date.now() } };
  }

  // Flow state messages (Phase 7 will add real processing)
  if (isMessageType(message, 'FLOW_SCORE_UPDATE')) {
    // TODO Phase 7: Update flow score, calculate trends
    return { success: true };
  }

  if (isMessageType(message, 'BRAIN_STATE_CHANGE')) {
    targetMode = message.payload.state;
    return { success: true };
  }

  // Session messages (Phase 7)
  if (isMessageType(message, 'SESSION_START')) {
    sessionActive = true;
    startDevSimulator();
    return { success: true };
  }
  if (isMessageType(message, 'SESSION_END')) {
    sessionActive = false;
    stopDevSimulator();
    return { success: true };
  }

  // Activity messages (Phase 6)
  if (isMessageType(message, 'ACTIVITY_LOG')) {
    // Allow UI/content contexts to forward activity logs to background.
    // Background is the source of truth for DB writes.
    await addActivityEvent({
      tsStart: message.payload.timestamp,
      category: message.payload.category,
      url: message.payload.url,
      hostname: safeHostname(message.payload.url) ?? undefined,
      eventType: 'tab_active',
      sessionActive,
    });
    return { success: true };
  }

  // Device messages (Phase 8)
  if (isMessageType(message, 'DEVICE_CONNECT')) {
    // TODO Phase 8: Initiate BLE connection
    return { success: true };
  }

  // Unknown message type
  console.warn(`[Background] Unhandled message type: ${message.type}`);
  return { success: false, error: `Unhandled message type: ${message.type}` };
}

// =============================================================================
// Phase 6: Activity Tracking Implementation
// =============================================================================

type Segment = {
  tabId: number;
  windowId: number;
  url: string;
  category: ActivityCategory;
  startTs: number;
};

let currentSegment: Segment | null = null;
let idleSegmentStart: number | null = null;
let sessionActive = false;
let targetMode: FlowState = 'focus';

// Phase 7 (DEV-only): one-person simulator
let simulator: FlowSimulator | null = null;
let simulatorIntervalId: number | null = null;
let simulatedBatteryPct = 87;
let lastFlowAiCallTs = 0;
const FLOW_AI_SUMMARY_URL = 'http://localhost:4111/v1/flow-ai/summary';

function safeHostname(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return null;
  }
}

function getTab(tabId: number): Promise<chrome.tabs.Tab> {
  return new Promise((resolve, reject) => {
    chrome.tabs.get(tabId, (tab) => {
      const err = chrome.runtime.lastError;
      if (err) reject(err);
      else resolve(tab);
    });
  });
}

function getLastFocusedWindow(): Promise<chrome.windows.Window> {
  return new Promise((resolve, reject) => {
    chrome.windows.getLastFocused({ populate: false }, (win) => {
      const err = chrome.runtime.lastError;
      if (err) reject(err);
      else resolve(win);
    });
  });
}

async function finalizeSegment(endTs: number, eventType: ActivityEventType): Promise<void> {
  if (!currentSegment) return;
  const durationMs = Math.max(0, endTs - currentSegment.startTs);

  await addActivityEvent({
    tsStart: currentSegment.startTs,
    tsEnd: endTs,
    durationMs,
    url: currentSegment.url,
    hostname: safeHostname(currentSegment.url) ?? undefined,
    category: currentSegment.category,
    tabId: currentSegment.tabId,
    windowId: currentSegment.windowId,
    eventType,
    sessionActive,
  });

  // Lightweight broadcast for dashboards (optional)
  chrome.runtime.sendMessage({
    type: 'ACTIVITY_LOG',
    payload: { url: currentSegment.url, category: currentSegment.category, timestamp: endTs },
    timestamp: Date.now(),
    source: 'background',
  } satisfies Message<'ACTIVITY_LOG'>);

  currentSegment = null;
}

async function startSegmentFromTab(tab: chrome.tabs.Tab, startTs: number): Promise<void> {
  const url = tab.url ?? '';
  const category = url ? classifyUrl(url) : 'unknown';

  currentSegment = {
    tabId: tab.id ?? -1,
    windowId: tab.windowId ?? -1,
    url,
    category,
    startTs,
  };
}

function startActivityTracking(): void {
  // Tab switching
  chrome.tabs.onActivated.addListener((activeInfo) => {
    const now = Date.now();
    void (async () => {
      await finalizeSegment(now, 'tab_active');
      const tab = await getTab(activeInfo.tabId);
      await startSegmentFromTab(tab, now);
    })();
  });

  // URL changes within the active tab
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!changeInfo.url) return;
    if (!tab.active) return;

    const now = Date.now();
    void (async () => {
      await finalizeSegment(now, 'tab_nav');
      await startSegmentFromTab({ ...tab, id: tabId, url: changeInfo.url }, now);
    })();
  });

  // Tab closed
  chrome.tabs.onRemoved.addListener((tabId) => {
    if (!currentSegment || currentSegment.tabId !== tabId) return;
    const now = Date.now();
    void finalizeSegment(now, 'tab_closed');
  });

  // Idle detection
  chrome.idle.onStateChanged.addListener((state) => {
    const now = Date.now();
    void (async () => {
      if (state === 'active') {
        // Close idle segment if we were idle
        if (idleSegmentStart !== null) {
          await addActivityEvent({
            tsStart: idleSegmentStart,
            tsEnd: now,
            durationMs: Math.max(0, now - idleSegmentStart),
            category: 'unknown',
            eventType: 'idle',
            sessionActive,
          });
          idleSegmentStart = null;
        }

        // Resume by capturing currently focused active tab, if available
        try {
          const win = await getLastFocusedWindow();
          if (!win.id) return;
          chrome.tabs.query({ active: true, windowId: win.id }, (tabs) => {
            const err = chrome.runtime.lastError;
            if (err) return;
            const t = tabs[0];
            if (!t) return;
            void (async () => {
              await finalizeSegment(now, 'window_blur');
              await startSegmentFromTab(t, now);
            })();
          });
        } catch {
          // ignore
        }
      } else {
        // idle or locked
        await finalizeSegment(now, 'window_blur');
        idleSegmentStart = now;
      }
    })();
  });
}

function startDevSimulator(): void {
  if (!import.meta.env.DEV) return;
  if (simulatorIntervalId !== null) return;

  simulator = simulator ?? new FlowSimulator({ seed: 42, anchorDurationMs: 45_000 });
  simulatedBatteryPct = 87;

  simulatorIntervalId = setInterval(() => {
    if (!sessionActive || !simulator) return;

    const now = Date.now();
    const out = simulator.tick({ now, targetMode });

    chrome.runtime.sendMessage({
      type: 'FLOW_SCORE_UPDATE',
      payload: { score: Math.round(out.score), trend: Math.round(out.trend) },
      timestamp: now,
      source: 'background',
    } satisfies Message<'FLOW_SCORE_UPDATE'>);

    chrome.runtime.sendMessage({
      type: 'TIMELINE_UPDATE',
      payload: { point: out.timelinePoint },
      timestamp: now,
      source: 'background',
    } satisfies Message<'TIMELINE_UPDATE'>);

    if (out.entryStart) {
      chrome.runtime.sendMessage({
        type: 'FLOW_ENTRY_ADD',
        payload: out.entryStart,
        timestamp: now,
        source: 'background',
      } satisfies Message<'FLOW_ENTRY_ADD'>);
    }

    // Flow AI summary (DEV-only gateway) - throttle to at most once per 30s
    if (import.meta.env.DEV && now - lastFlowAiCallTs > 30_000) {
      lastFlowAiCallTs = now;
      void requestFlowSummary({
        sessionActive,
        targetMode,
        observedState: out.metrics.observedState,
        score: Math.round(out.score),
        direction: out.anchor.brainStateDirection,
        insight: out.anchor.brainStateInsight,
        suggestedNextTask: out.anchor.suggestedNextTask,
        activity: out.activity,
      });
    }

    // Slow battery drain, 1% about every ~30s.
    if (now % 30_000 < 8_000) {
      simulatedBatteryPct = Math.max(0, simulatedBatteryPct - 1);
      chrome.runtime.sendMessage({
        type: 'DEVICE_BATTERY_UPDATE',
        payload: {
          battery: {
            percentage: simulatedBatteryPct,
            isCharging: false,
            estimatedMinutes: simulatedBatteryPct * 3,
          },
        },
        timestamp: now,
        source: 'background',
      } satisfies Message<'DEVICE_BATTERY_UPDATE'>);
    }
  }, 8_000) as unknown as number;
}

function stopDevSimulator(): void {
  if (simulatorIntervalId === null) return;
  clearInterval(simulatorIntervalId);
  simulatorIntervalId = null;
}

async function requestFlowSummary(input: {
  sessionActive: boolean;
  targetMode: FlowState;
  observedState: FlowState;
  score: number;
  direction: string;
  insight: string;
  suggestedNextTask: string;
  activity: {
    tabSwitchesPerMin: number;
    windowMs: number;
    leisureMs: number;
    communicationMs: number;
    idleMs: number;
  };
}): Promise<void> {
  try {
    const res = await fetch(FLOW_AI_SUMMARY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      return;
    }

    const json = (await res.json()) as { flowSummary?: FlowSummaryData };
    if (!json.flowSummary) return;

    chrome.runtime.sendMessage({
      type: 'FLOW_SUMMARY_UPDATE',
      payload: { summary: json.flowSummary },
      timestamp: Date.now(),
      source: 'background',
    } satisfies Message<'FLOW_SUMMARY_UPDATE'>);
  } catch {
    // Gateway not running (common during dev) - ignore.
  }
}
