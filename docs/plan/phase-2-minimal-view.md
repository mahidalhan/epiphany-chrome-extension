# Phase 2: New Tab - Minimal View Implementation Plan

## Overview
Build the instant-loading Minimal View (<50ms first paint) with a dynamic brain state toggle.

**Status:** Complete
**Target:** Minimal View with Search Bar, Logo, and Dashboard CTA

> **Note:** Brain State toggle removed from Minimal View. Will be added to Chrome toolbar badge/popup in post-v1 enhancement.

---

## Design References (Figma)

| Component | Node ID | Screenshot |
|-----------|---------|------------|
| Search Bar | `9:302` | Dark pill, 60px radius, search + voice + AI icons |
| Dashboard Button | `9:309` | Golden gradient border, orange glow, chevron icon |
| Brain State Pill | `9:274` | Blue `#007bff` pill, icon + "Focus Mode" text |

---

## Architecture Decision: Brain State Mode

### Question: Who determines the mode - headset or user?

**Option 1: Headset Auto-Detects (Passive)**
- EEG reads brainwaves → classifies state
- UI displays detected state
- Cons: Noisy data, 60-75% accuracy, no stimulation benefit

**Option 2: User Selects → Headset Assists (Active)** ✅ CHOSEN
- User clicks mode they want
- Headset delivers targeted neurostimulation
- EEG confirms effectiveness (feedback loop)
- Aligns with product.md 2.5: "Allow user to manually select or accept AI-suggested modes"

**Decision:** User-driven mode selection with headset assistance.

---

## Components to Create

### 1. SearchBar (`components/search-bar/SearchBar.tsx`)

**Design Specs:**
- Background: `rgba(28,31,36,0.8)`
- Border: `1px solid rgba(255,255,255,0.2)`
- Border radius: `60px` (pill shape)
- Padding: `8px` all sides
- Width: `568px` (fixed, not max-width)
- Height: `40px`
- Layout: Two groups with `justify-between`

**Elements:**
- Left group: Search icon (gray `#555`, 24px) + placeholder "Search Anything" (16px, `tracking-[0.32px]`)
- Right group: Voice waveform icon (`#555`, 24px) + AI circle icon (`#007bff`, 24px)

**Icons (SVG, cross-platform):**
- Voice: Three vertical waveform bars (replaces SF Symbol `􀙫`)
- AI: Circle with inner dot (replaces SF Symbol `􀁷`)

**Behavior:**
- Placeholder text only for Phase 2 (search functionality in later phase)

---

### 2. DashboardButton (`components/cta-button/DashboardButton.tsx`)

**Design Specs:**
- Background: `linear-gradient(to bottom, #000000, #262626)`
- Border: `2px solid #fcf6d1` (golden)
- Border radius: `1000px` (full pill)
- Box shadow: `0px 0px 40px 8px rgba(255,153,0,0.2)` (orange glow)
- Padding: `8px 20px`
- `whitespace-nowrap` to prevent text wrapping

**Elements:**
- Chevron down icon (24px, white/80 opacity)
- Text: "Go to Dashboard" (`rgba(255,255,255,0.54)`, Manrope SemiBold 16px)
- Gap between icon and text: `12px` (`gap-3`)

**Behavior:**
- Click → switch `currentView` to `'dashboard'`
- Hover: scale up slightly, text brightens

---

### 3. BrainStateIndicator (`components/brain-state/BrainStateIndicator.tsx`)

> **Status:** Component exists but removed from MinimalView. Reserved for future Chrome toolbar popup (post-v1).

**Design Specs (3 states):**

| State | Background | Text |
|-------|------------|------|
| Creative Mode | `#9b38ff` (purple) | "Creative Mode" |
| Focus Mode | `#007bff` (blue) | "Focus Mode" |
| Recovery Mode | `#64d65e` (green) | "Recovery Mode" |

- Border radius: `40px`
- Padding: `4px 8px`
- Font: Manrope Medium 12px, white

**Elements:**
- Small icon (14px) - brain icon
- Mode name text

**Behavior:**
- Click → cycles to next state (Creative → Focus → Recovery → Creative)
- CSS transitions for smooth color change
- State persisted to `chrome.storage.local`

---

### 4. EpiphanyLogo (`components/logo/EpiphanyLogo.tsx`)

**Design Specs:**
- Size: `102×102px` (from Figma node `9:312`)
- Centered above search bar
- SVG asset: `assets/icons/epiphany-logo.svg`
- Color: `#8E9093` (gray)

---

### 5. MinimalView (`entrypoints/newtab/views/MinimalView.tsx`)

**Layout:**
```
┌─────────────────────────────────────────────────┐
│                                                 │
│                                                 │
│              [EpiphanyLogo]                     │
│                   ↓ (56px gap)                  │
│              [SearchBar]                        │
│                                                 │
│                                                 │
│           [DashboardButton]        (bottom-20)  │
└─────────────────────────────────────────────────┘
```

**Positioning:**
- Logo + SearchBar: Vertically centered with `pb-32` offset
- Gap between Logo and SearchBar: `56px` (`h-14`)
- DashboardButton: Absolute positioned, `bottom-20` (80px from bottom), horizontally centered

**Background:**
- Dark gradient with noise overlay (already in CSS as `.noise-overlay`)

---

## State Management

### WXT Storage (`stores/view.ts`)

Using WXT's native storage instead of Zustand (see Architecture Decisions below).

```typescript
import { storage } from 'wxt/storage';

// Persisted to chrome.storage.local, syncs across all extension contexts
export const viewMode = storage.defineItem<'minimal' | 'dashboard'>(
  'local:viewMode',
  { defaultValue: 'minimal' }
);

export const brainState = storage.defineItem<'creative' | 'focus' | 'recovery'>(
  'local:brainState',
  { defaultValue: 'focus' }
);

// Helper for cycling brain states
export const BRAIN_STATES = ['creative', 'focus', 'recovery'] as const;
export type BrainState = typeof BRAIN_STATES[number];

export function getNextBrainState(current: BrainState): BrainState {
  const idx = BRAIN_STATES.indexOf(current);
  return BRAIN_STATES[(idx + 1) % BRAIN_STATES.length];
}
```

### Usage in Components

```typescript
import { useStorage } from '@wxt-dev/react';
import { brainState, getNextBrainState } from '@/stores/view';

function BrainStateIndicator() {
  const [state, setState] = useStorage(brainState);

  return (
    <button onClick={() => setState(getNextBrainState(state!))}>
      {state} Mode
    </button>
  );
}
```

---

## Files to Modify

### App.tsx (`entrypoints/newtab/App.tsx`)

- Import `MinimalView` (and lazy `Dashboard` placeholder)
- Use `useViewStore` to determine which view to render
- Set up `requestIdleCallback` for Dashboard preloading

---

## Assets Needed

| Asset | Path | Status |
|-------|------|--------|
| Epiphany Logo SVG | `assets/icons/epiphany-logo.svg` | ✅ Added |
| Search Icon | Inline SVG in component | ✅ Implemented |
| Voice Waveform Icon | Inline SVG in component | ✅ Implemented |
| AI Circle Icon | Inline SVG in component | ✅ Implemented |
| Chevron Icon | Inline SVG in component | ✅ Implemented |

> **Note:** Icons are implemented as inline SVG components rather than external files for better bundle optimization and to avoid SF Pro font dependency (macOS only).

---

## Implementation Order

- [x] Create component folder structure
- [x] Create view store with WXT Storage (`stores/view.ts`)
- [x] Build BrainStateIndicator component (clickable toggle)
- [x] Build SearchBar component
- [x] Build DashboardButton component
- [x] Build EpiphanyLogo component (placeholder)
- [x] Assemble MinimalView layout
- [x] Update App.tsx with view switching
- [x] Create `useWxtStorage` React hook (`lib/hooks/useWxtStorage.ts`)
- [x] Test and verify performance (<50ms first paint) - **Build: 158ms, 31.19kb total**

---

## Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| First Paint | <50ms | Inline critical CSS, minimal JS |
| Interactive | <80ms | No heavy dependencies in critical path |
| Bundle Size | <30kb gzipped | Pure Tailwind, no component libraries |

---

## Technical Notes

- **No Framer Motion** - CSS transitions only (`transition-colors duration-200`)
- **Inline critical CSS** - Minimal View styles in HTML `<style>` tag if needed
- **requestIdleCallback** - Preload Dashboard while user views Minimal
- **chrome.storage.local** - Persist view and brain state preferences
- **SVG icons over SF Pro** - SF Pro symbols (`􀙫`, `􀁷`) are macOS-only; using cross-platform SVG equivalents
- **Fixed width for SearchBar** - Use `w-[568px]` not `max-w-[568px]` to ensure consistent sizing
- **whitespace-nowrap** - Prevents text wrapping in buttons on narrow viewports
- **Type declarations** - `types/assets.d.ts` added for SVG imports in TypeScript


---

## Architecture Decisions

### 1. Brain State Toggle on Minimal View

**Deviation from product.md:**

| Document | Location | Reference |
|----------|----------|-----------|
| product.md (2.5) | "Button group or pill selector **below Flowprints**" | Lines 155-158 |
| product.md (4.1) | "subtle glow + quick state indicator" (passive) | Lines 239-240 |
| **Our Decision** | **Clickable toggle on Minimal View** | — |

**Rationale:**
- Quick mode switching without navigating to Dashboard
- Users can start focus session immediately on new tab
- Small pill is unobtrusive - doesn't clutter minimal design
- Dashboard will also have full Brain State Controller (Phase 3)

---

### 2. State Persistence: WXT Storage (Not Zustand)

**Decision:** Use WXT's native `storage.defineItem()` instead of Zustand for persisted state.

**Why not Zustand + chrome.storage adapter?**

```
┌─────────────────────────────────────────────────────────────┐
│  Problem: Chrome extensions have isolated JS contexts       │
│                                                             │
│  New Tab ──localStorage──╳──── Background Worker            │
│     │                              │                        │
│     └── Can't share state via localStorage! ───┘            │
└─────────────────────────────────────────────────────────────┘
```

Zustand's default `persist` uses `localStorage` which is context-specific. You'd need a custom adapter + manual sync listeners - essentially rebuilding what WXT already provides.

**WXT Storage advantages:**

| Factor | Zustand + Adapter | WXT Storage |
|--------|-------------------|-------------|
| Bundle impact | +2kb (zustand-chrome-storage) | **0kb** (included) |
| Cross-context sync | Manual setup | **Built-in** |
| React hooks | Need wrapper | **`useStorage()` included** |
| Extra dependencies | Yes | **No** |

**Implementation:**

```typescript
// stores/view.ts
import { storage } from 'wxt/storage';

export const viewMode = storage.defineItem<'minimal' | 'dashboard'>(
  'local:viewMode',
  { defaultValue: 'minimal' }
);

export const brainState = storage.defineItem<'creative' | 'focus' | 'recovery'>(
  'local:brainState',
  { defaultValue: 'focus' }
);
```

```typescript
// In React component
import { useStorage } from '@wxt-dev/react';
import { brainState } from '@/stores/view';

function BrainStateIndicator() {
  const [state, setState] = useStorage(brainState);

  const cycle = () => {
    const states = ['creative', 'focus', 'recovery'] as const;
    const next = states[(states.indexOf(state!) + 1) % 3];
    setState(next);
  };

  return <button onClick={cycle}>{state} Mode</button>;
}
```

**When to use Zustand (Phase 7-8):**
- Real-time EEG data buffering (high-frequency, non-persisted)
- Complex derived state (computed flow scores)
- Transient UI state that doesn't need persistence

---

## Future Enhancement: Chrome Toolbar Brain State (Post-v1)

The Figma design shows the Brain State indicator in Chrome's address bar area (node `9:274`). This cannot be implemented directly in the address bar (Chrome doesn't allow extensions to modify native toolbar UI), but can be achieved via the extension icon:

**Approach:**
1. **Badge on extension icon** - Shows current mode with colored background
   - Focus: "F" with blue `#007bff` background
   - Creative: "C" with purple `#9b38ff` background
   - Recovery: "R" with green `#64d65e` background

2. **Popup selector** - Click extension icon to open mode selector
   - Radio buttons for each mode
   - Syncs with `chrome.storage.local` (same as WXT Storage)

**Implementation (when ready):**
```typescript
// In background service worker
import { brainState } from '@/stores/view';

// Listen for state changes and update badge
brainState.watch((state) => {
  const badges = {
    focus: { text: 'F', color: '#007bff' },
    creative: { text: 'C', color: '#9b38ff' },
    recovery: { text: 'R', color: '#64d65e' },
  };
  const badge = badges[state];
  chrome.action.setBadgeText({ text: badge.text });
  chrome.action.setBadgeBackgroundColor({ color: badge.color });
});
```

**Files to create (post-v1):**
- `entrypoints/popup/index.html` - Popup HTML
- `entrypoints/popup/main.tsx` - React entry
- `entrypoints/popup/Popup.tsx` - Mode selector UI

