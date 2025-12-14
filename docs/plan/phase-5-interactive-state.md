# Phase 5: Interactive Components & State

## Task Checklist

### Phase 5.1: Zustand Store Infrastructure
- [x] Create `stores/flow.ts` with useFlowStore + chrome.storage.local persistence
- [x] Create `stores/device.ts` with useDeviceStore
- [x] Create `stores/activity.ts` with useActivityStore skeleton
- [x] Create `stores/index.ts` barrel export

### Phase 5.2: Wire Stores to Components
- [x] Connect FlowScoreCard to useFlowStore
- [x] Connect FlowEntriesList to useFlowStore.entries
- [x] Connect DeviceCard to useDeviceStore
- [x] Connect FlowSessionCard to useActivityStore + useFlowStore
- [x] Update Dashboard.tsx to remove mock data props

### Phase 5.3: Animation Enhancements
- [x] Add `will-change` optimization to FlowScoreGauge
- [x] Add `will-change` optimization to ProgressBar
- [x] Add active entry pulse animation (CSS keyframes)
- [x] Create `useAnimatedNumber` hook for score counter

### Phase 5.4: Message Passing Skeleton
- [x] Create `lib/messaging/types.ts` with typed message definitions
- [x] Create `lib/messaging/sender.ts` with sendMessage helper
- [x] Update background worker with basic message listener

---

## Summary of Changes

### New Files Created
- `stores/flow.ts` - Zustand store with chrome.storage.local persistence
- `stores/device.ts` - Zustand store for device state
- `stores/activity.ts` - Zustand store for activity/timeline
- `stores/index.ts` - Barrel export
- `lib/hooks/useAnimatedNumber.ts` - Animated counter hook
- `lib/messaging/types.ts` - Message type definitions
- `lib/messaging/sender.ts` - Message send utilities
- `lib/messaging/index.ts` - Barrel export

### Modified Files
- `components/flow-score/FlowScoreCard.tsx` - Uses useFlowStore
- `components/flow-score/FlowScoreGauge.tsx` - Animated counter, will-change
- `components/device-card/DeviceCard.tsx` - Uses useDeviceStore
- `components/flow-entries/FlowEntriesList.tsx` - Uses useFlowStore
- `components/flow-entries/FlowEntryItem.tsx` - Active pulse animation
- `components/session/FlowSessionCard.tsx` - Uses useActivityStore
- `components/shared/ProgressBar.tsx` - will-change optimization
- `entrypoints/newtab/views/Dashboard.tsx` - Removed prop drilling
- `entrypoints/background/index.ts` - Message listener
- `assets/main.css` - pulse-glow animation

---

## Architecture Notes

### Store Coexistence Pattern
- **WXT Storage**: Persisted user preferences (viewMode, brainState)
- **Zustand Stores**: Runtime state
  - `useFlowStore`: Score persisted, entries transient
  - `useDeviceStore`: In-memory only (BLE data in Phase 8)
  - `useActivityStore`: In-memory only (IndexedDB in Phase 6)

### Animation Strategy
- CSS transitions for continuous properties (width, stroke-dashoffset)
- `will-change` for GPU acceleration on animated elements
- `requestAnimationFrame` for JS-driven number animations
- CSS keyframes for decorative effects (pulse-glow)

### Message Passing
- Typed message interface with discriminated unions
- Type guards for runtime validation
- Skeleton handlers ready for Phase 6/7/8 implementation


## Bug: Dashboard Flash Issue (RESOLVED)

**Symptom**: Dashboard renders for ~0.2s then goes blank with error "Maximum update depth exceeded".

**Root Cause**: Multiple infinite re-render loops caused by:
1. **ShaderGradientScene**: `setConfig(getConfig())` called every frame, creating new object references that triggered React state updates
2. **Zustand selectors**: Object-returning selectors (`selectDeviceState`, `selectTimeline`) created new object references on every render, causing Zustand to re-subscribe and trigger re-renders

**Fixes Applied**:
1. **ShaderGradientScene.tsx**: Added value comparison before updating state - only update config when values actually change
2. **DeviceCard.tsx**: Replaced `selectDeviceState` (object selector) with individual property selectors (`selectName`, `selectStatus`, `selectBattery`)
3. **FlowSessionCard.tsx**: Replaced `selectTimeline` (object selector) with individual property selectors (`selectTimelinePoints`, `selectTimelineLabels`)
4. **FlowScoreCard.tsx**: Created stable `selectScore` selector outside component
5. **FlowEntriesList.tsx**: Using stable `selectFlowEntries` selector from stores
6. **App.tsx**: Added `DashboardErrorBoundary` to catch and display render errors gracefully

**Key Learnings**:
- Zustand selectors that return objects create new references on every call, triggering re-renders
- Use individual property selectors or `shallow` comparison for object-returning selectors
- `useFrame` hooks must compare values before updating state to prevent infinite loops

New bug detected-
- the 3d blog is not visible at all, it is blank.


