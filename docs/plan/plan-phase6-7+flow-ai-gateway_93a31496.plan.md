---
name: plan-phase6-7+flow-ai-gateway
overview: Complete Phase 6–7 (activity tracking + session controls + scoring + one-person simulation) and add a Flow AI layer via a local Mastra+OpenAI gateway (Bun) that the extension calls; later swap the gateway base URL to a deployed endpoint without changing extension logic.
todos: []
---

## Open questions

- None.

## Task checklist

### Phase6_activityTracking

- ☑ Add `host_permissions: ["<all_urls>"] `to `wxt.config.ts`
- ☑ Add URL categorization (`work|leisure|communication|unknown`) + unit tests
- ☑ Add IndexedDB (Dexie) for activity + 30-day retention cleanup
- ☑ Implement background tracker: tab activation + tab URL updates + idle detection → DB writes

### Phase7_session+scoring+simulation

- ☑ Add `flowSessionActive` storage + wire Start/End Session UI in `ModeBannerCard`
- ☑ Treat `brainState` as TargetMode; on change send message to background
- ☑ Implement pure Flow Score engine (dataset baseline + context switching/idle/distraction adjustments) + unit tests
- ☑ DEV-only simulator in background that emits metrics/score every 5–10s and drives timeline + entries
- ☑ Add New Tab runtime listener to apply background updates into stores safely
- ☑ Replace timeline placeholder with uPlot-driven chart

### Phase7_flowAiLayer(MastraGateway)

- ☑ Add local Bun “Epiphany AI gateway” service using Mastra + OpenAI
- ☑ Define stable HTTP contract: `/v1/flow-ai/summary`
- ☑ Extension background calls gateway, then emits `FLOW_SUMMARY_UPDATE` to UI
- ☑ Add prompt builder + response validation + unit tests (pure, no network)

### Deferred_distractionPopupNudge (not via AI)

- ☐ Add a local distraction popup/toast in the Dashboard UI (no AI call)
- ☐ Background emits `DISTRACTION_NUDGE` based on activity thresholds (tab switching, leisure during session, idle)

---

## Phase6_activityTracking

### Affected files

- [`wxt.config.ts`](/Users/mahidalhan/code/epiphany-chrome-extension/wxt.config.ts)
- [`entrypoints/background/index.ts`](/Users/mahidalhan/code/epiphany-chrome-extension/entrypoints/background/index.ts)
- New: `lib/classification/classifyUrl.ts`
- New: `lib/db/activityDb.ts`
- New tests: `lib/classification/classifyUrl.test.ts`

### File-level changes

- `wxt.config.ts`
- Add `manifest.host_permissions: ["<all_urls>"]` (we already agreed).
- `lib/classification/classifyUrl.ts`
- Export `classifyUrl(url: string): Category` and rule lists.
- `lib/db/activityDb.ts`
- Dexie schema: `activityEvents` table (timestamp, url, hostname, category, eventType, tabId/windowId, durationMs, sessionActive).
- Export pure helper `isExpired(ts, now)` used for retention.
- `entrypoints/background/index.ts`
- Listen to `tabs.onActivated`, `tabs.onUpdated` (url/status), `idle.onStateChanged`.
- Normalize into activity events + persist.

### Unit tests

- `classifyUrl.test.ts`: table-driven domain → category.
- `retention` helper test: cutoff behavior.

---

## Phase7_session+scoring+simulation

### Affected files

- [`stores/view.ts`](/Users/mahidalhan/code/epiphany-chrome-extension/stores/view.ts)
- [`components/session/ModeBannerCard.tsx`](/Users/mahidalhan/code/epiphany-chrome-extension/components/session/ModeBannerCard.tsx)
- [`components/brain-state/BrainStateIndicator.tsx`](/Users/mahidalhan/code/epiphany-chrome-extension/components/brain-state/BrainStateIndicator.tsx)
- [`entrypoints/newtab/views/Dashboard.tsx`](/Users/mahidalhan/code/epiphany-chrome-extension/entrypoints/newtab/views/Dashboard.tsx)
- [`lib/messaging/types.ts`](/Users/mahidalhan/code/epiphany-chrome-extension/lib/messaging/types.ts)
- [`entrypoints/background/index.ts`](/Users/mahidalhan/code/epiphany-chrome-extension/entrypoints/background/index.ts)
- New: `lib/scoring/flowScore.ts`
- New: `lib/mock/flowstateDataset.ts`
- New: `lib/mock/simulator.ts`
- New: `components/timeline/TimelineChart.tsx`

### File-level changes

- `stores/view.ts`
- Add WXT storage item: `flowSessionActive` boolean (session boundary).
- `ModeBannerCard.tsx` (**where session start/stop lives**)
- Replace `mockFlowMode` usage with `flowSessionActive` + `brainState`.
- Add Start/End Session button and send `SESSION_START` / `SESSION_END`.
- `BrainStateIndicator.tsx`
- On mode cycle, also send `BRAIN_STATE_CHANGE` to background (TargetMode).
- `lib/messaging/types.ts`
- Add `SESSION_START`, `SESSION_END`.
- Extend payloads for simulator outputs: `FLOW_SUMMARY_UPDATE` and (if needed) richer `ACTIVITY_LOG`.
- `lib/scoring/flowScore.ts` (pure)
- Input: dataset metrics + recent activity stats + targetMode + observedState.
- Output: `{ score: number; trend?: number; breakdown?: ... }`.
- Rule: dataset `flow_score` is baseline; apply small penalties for context switching + idle + leisure-on-session; small bonus for alignment.
- `lib/mock/flowstateDataset.ts`
- Encode the 5 snapshots from `docs/product/flowstate-dataset.md` (single subject).
- `lib/mock/simulator.ts`
- Deterministic generator (seeded) producing per-tick “hardware-like metrics” + observed brain state.
- `entrypoints/background/index.ts`
- Maintain background session state (sessionActive + targetMode).
- If `import.meta.env.DEV && sessionActive`: run simulator tick loop.
- Each tick: compute flow score via `flowScore.ts`, emit `FLOW_SCORE_UPDATE`, `TIMELINE_UPDATE`, and `FLOW_ENTRY_ADD` on state transitions.
- `entrypoints/newtab/...` runtime listener
- Apply background updates to stores via `useXStore.getState()` setters to avoid selector loops.
- Timeline chart
- Add `uplot` dependency and implement `TimelineChart` used by `FlowSessionCard`.

### Unit tests

- `lib/scoring/flowScore.test.ts`: clamp/penalty/alignment table-driven.
- `lib/mock/simulator.test.ts`: deterministic sequences from a fixed seed (no timers).

---

## Phase7_flowAiLayer (Mastra + OpenAI via local gateway)

### Architecture (best practice for extensions)

- **Do not store OpenAI keys in the extension.**
- Run a **local Bun gateway** during development that holds `OPENAI_API_KEY` in env and exposes HTTP endpoints.
- Extension background calls the gateway; gateway calls OpenAI via Mastra; background forwards results to UI via typed messages.
- When ready to deploy, keep the **same HTTP contract**, just change the base URL to the deployed gateway.

### Affected files

- New: `services/flow-ai/` (Bun service)
- `services/flow-ai/server.ts`
- `services/flow-ai/agent.ts`
- `services/flow-ai/prompt.ts`
- `services/flow-ai/validate.ts`
- `services/flow-ai/*.test.ts` (pure tests)
- [`package.json`](/Users/mahidalhan/code/epiphany-chrome-extension/package.json) (add scripts + deps)
- [`entrypoints/background/index.ts`](/Users/mahidalhan/code/epiphany-chrome-extension/entrypoints/background/index.ts) (fetch Flow AI summary)
- [`lib/messaging/types.ts`](/Users/mahidalhan/code/epiphany-chrome-extension/lib/messaging/types.ts)
- (Optional) New: `stores/summary.ts` to replace `mockFlowSummary`

### Contract

- `POST /v1/flow-ai/summary`
- request: `{ sessionActive, targetMode, observedState, score, recentActivityStats, recentMetricsSnapshot }`
- response: `{ flowSummary: FlowSummaryData, suggestedMode?: 'creative'|'focus'|'recovery', rationale?: string }`

### Mastra usage (gateway)

- Use Mastra Agent + OpenAI provider (`@ai-sdk/openai`) for generation.
- Keep prompts deterministic and short; enforce JSON schema-like output via validation.

### Extension integration

- Background tick loop calls gateway every N seconds (e.g. 30–60s) or on state transitions.
- Background emits `FLOW_SUMMARY_UPDATE` with the validated `FlowSummaryData`.
- Dashboard replaces `mockFlowSummary` with store-backed summary.

### Unit tests

- `services/flow-ai/prompt.test.ts`: prompt construction given inputs.
- `services/flow-ai/validate.test.ts`: response parsing/validation (reject malformed outputs).

---

## Deferred_distractionPopupNudge (local popup, not via AI)

### Affected files

- [`entrypoints/background/index.ts`](/Users/mahidalhan/code/epiphany-chrome-extension/entrypoints/background/index.ts)
- [`lib/messaging/types.ts`](/Users/mahidalhan/code/epiphany-chrome-extension/lib/messaging/types.ts)
- New: `lib/nudges/distractionNudge.ts` (pure threshold logic)
- New: `components/distraction/DistractionPopup.tsx` (or `components/shared/Toast.tsx`)
- (Optional) New: `stores/nudges.ts` (queue + dismissal timestamps)

### File-level changes

- `lib/nudges/distractionNudge.ts`
- Export a pure function like `getDistractionNudge(stats, now)` returning either `null` or `{ severity, reason, topSources }`.
- Threshold inputs come from Phase 6 signals:
- tab switches/minute (context switching)
- leisure/communication time while `flowSessionActive`
- idle/locked during session
- `lib/messaging/types.ts`
- Add `DISTRACTION_NUDGE` message with payload `{ severity: 'low'|'med'|'high'; title: string; body: string; sources?: ... }`.
- Add `NUDGE_DISMISSED` (optional) so UI can silence repeated popups for a cooldown window.
- `entrypoints/background/index.ts`
- When sessionActive, periodically compute recent activity stats (rolling window) and decide whether to emit `DISTRACTION_NUDGE`.
- Never route this nudge through the Mastra gateway (local-only popup).
- UI component + store
- Add a lightweight popup/toast that subscribes to the runtime message stream and displays when `DISTRACTION_NUDGE` arrives.

### Unit tests

- `lib/nudges/distractionNudge.test.ts`: table-driven threshold tests (no browser APIs).

## Notes

- This plan keeps the Minimal View fast: all tracking + scoring + AI calls happen in background/gateway, and UI only renders from stores.