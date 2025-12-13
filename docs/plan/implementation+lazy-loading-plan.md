# Epiphany Chrome Extension - Implementation Plan

## Overview

Based on Figma designs and product requirements, this extension consists of:
- **New Tab Minimal View**: Landing page with search bar and dashboard navigation
- **New Tab Dashboard**: 3-column layout with Flow Score, Flowprints 3D visualization, and Flow Session tracking
- **Browser Toolbar**: Mode indicator pill (Focus/Creative Mode)

---

## Performance Strategy: Progressive Loading

### Why This Matters
New tab pages must load instantly (<100ms perceived) or users will disable the extension. Our dashboard includes heavy 3D visualization (~190kb), so we use **progressive loading** to achieve instant perceived performance.

### Load Time Targets

| Metric | Target | Achieved By |
|--------|--------|-------------|
| First Paint | <50ms | Minimal View loads first |
| Minimal Interactive | <80ms | No heavy dependencies |
| Dashboard Interactive | <400ms | Lazy-loaded after minimal |
| 3D Visualization | <600ms | Loaded last, with skeleton |

### Bundle Size Budget

| Component | Budget (gzipped) | Actual |
|-----------|------------------|--------|
| Minimal View (critical) | <30kb | TBD |
| Dashboard Shell | <50kb | TBD |
| Charts (uPlot) | <15kb | TBD |
| 3D Viz (R3F + Three) | <200kb | TBD |
| **Total** | <300kb | TBD |

### Progressive Loading Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1: Instant (~50ms)                                       │
│  ─────────────────────────                                      │
│  • Minimal View HTML/CSS (inlined critical CSS)                 │
│  • Logo SVG (inline)                                            │
│  • Search bar (pure CSS)                                        │
│  • "Go to Dashboard" button                                     │
│  • Zustand core (~2kb)                                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 2: Background Preload (while user on Minimal View)       │
│  ─────────────────────────────────────────────────────────────  │
│  • React.lazy() Dashboard component                             │
│  • uPlot chart library                                          │
│  • Dashboard UI components                                      │
│  • Prefetch 3D assets                                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 3: On Dashboard Click (~200ms transition)                │
│  ───────────────────────────────────────────────────────────    │
│  • Show dashboard skeleton immediately                          │
│  • Hydrate charts with data                                     │
│  • Mount 3D canvas (shows loading shimmer)                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 4: 3D Visualization (~400ms after dashboard)             │
│  ─────────────────────────────────────────────────────────────  │
│  • Three.js scene initialization                                │
│  • Shader compilation                                           │
│  • First frame render                                           │
│  • Animation loop starts                                        │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation Details

#### Code Splitting Strategy
```typescript
// entrypoints/newtab/App.tsx
const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Flowprints3D = React.lazy(() => import('../components/flowprints/Canvas'));

// Preload on idle
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    import('./views/Dashboard');
  });
}
```

#### Critical CSS Inlining
- Minimal View styles inlined in HTML `<style>` tag
- Dashboard styles loaded async via `<link rel="preload">`

#### 3D Fallback Strategy
```typescript
// Show static gradient image while WebGL initializes
<Suspense fallback={<FlowprintsFallback />}>
  <Flowprints3D />
</Suspense>
```

### User Perception Timeline

```
User opens new tab:
├─ 0ms    → White flash (unavoidable)
├─ 20ms   → Background color painted
├─ 50ms   → Minimal View fully rendered ✓ USER SEES CONTENT
├─ 80ms   → Interactive (can click, type)
│
│  [User stays on Minimal View - background loading happens]
│
├─ 300ms  → Dashboard code fully loaded (in background)
├─ 500ms  → 3D assets prefetched
│
│  [User clicks "Go to Dashboard"]
│
├─ +0ms   → Skeleton UI appears instantly
├─ +100ms → Charts rendered with data
├─ +200ms → Dashboard fully interactive ✓
├─ +400ms → 3D visualization animating ✓
```

---

## Phase 1: Foundation & Project Setup ✅ COMPLETE

### Status: Complete
- [x] WXT + Vite + Bun configured
- [x] React 19 + TypeScript + Zustand installed
- [x] Tailwind v4 with design tokens
- [x] Directory structure created
- [x] New tab entry point working
- [x] Background service worker placeholder
- [x] Dev server verified (31.19 KB total bundle)

### Deliverables
- WXT + Vite project with **Bun** runtime
- React 18 + TypeScript + Zustand state management
- **Pure Tailwind CSS** (no component library - for minimal bundle size)
- Extension structure:
  - `entrypoints/newtab/` - New Tab page
  - `entrypoints/background/` - Service worker
  - `entrypoints/popup/` (optional)
- Dark theme design tokens:
  - Background: `#181818`, `#000`
  - Borders: `rgba(255,255,255,0.2)`
  - Text: `#fff`, `rgba(255,255,255,0.6)`, `#b8b8b8`
- Fonts: Manrope (primary), Inter (charts), SF Pro (icons)
- Noise texture background asset

### Technical Notes
- Use WXT for Chrome extension framework (handles manifest, hot reload)
- Zustand for lightweight state (no Redux boilerplate)
- **No component library** - pure Tailwind for minimal bundle
- Configure Vite for optimal code splitting (separate chunks for Dashboard, 3D)

---

## Phase 2: New Tab - Minimal View

### Deliverables
- Epiphany logo (headphone + neural SVG icon)
- Search bar with:
  - Placeholder: "Search Anything"
  - Voice input icon
  - AI assistant icon
- "Go to Dashboard" button with golden glow effect
- Dark gradient background with noise overlay
- View state toggle (minimal ↔ dashboard)

### Design Specs
- Logo: Centered, ~100px width
- Search bar: ~568px width, rounded corners, dark border
- CTA button: Golden gradient border, semi-transparent background
- Background: Radial gradient from center, noise texture overlay

---

## Phase 3: Dashboard Layout & Static UI

### Column 1 (Left)
| Component | Description |
|-----------|-------------|
| Flow Score | Circular gauge (0-100), concentric rings, "85 pts" display |
| Share Bar | Social icons (LinkedIn, X, Instagram, Reddit, Threads) |
| Share CTA | "Share your score" button with upload icon |
| Device Card | Headphone image, "Epiphany Headphones", connection status, battery % |
| Flow Summary | Tooltip with AI-generated summary, reminders, distraction tracking |
| Logo Footer | "epiphany" branding |

### Column 2 (Center)
| Component | Description |
|-----------|-------------|
| Flowprints Header | "Flowprints" title, "Live neural visualization" subtitle, lightbulb icon |
| 3D Visualization | 360×300 canvas area (placeholder in this phase) |
| Brain State Chip | "Left Brain Engaged" / "Right Brain Engaged" pill |
| State Description | 3-4 lines explaining current brain state |
| Tip Section | Contextual advice with divider |

### Column 3 (Right)
| Component | Description |
|-----------|-------------|
| Mode Banner | Golden gradient pill: "_____ Mode ON" |
| Status Text | "All Browser notifications are muted", "Certain websites are blocked" |
| Session Header | "Today's Flow Session" + time + "Xh Xm in flow" |
| Timeline Chart | Area chart showing mental state over time (9:00-16:00) |
| Flow Entries | Creative Flow / Deep Focus / Active Recovery with progress bars |

### Design Specs
- Cards: `#181818` background, `rgba(255,255,255,0.2)` border, 12px radius
- Golden gradient: `linear-gradient(rgba(255,240,218,1), rgba(148,100,30,1), ...)`
- Flow state colors:
  - Creative: `#9b38ff` (purple)
  - Deep Focus: `#86b4df` (blue)
  - Recovery: `#64d65e` (green)

---

## Phase 4: Flowprints 3D Visualization

### Deliverables
- React Three Fiber integration
- @shadergradient/react for animated gradient mesh
- Particle/blob animation responding to brain state
- Color transitions between states:
  - Creative: Purple/magenta hues
  - Analytical: Blue hues
  - Recovery: Green/yellow hues
- Dynamic text: "Left Brain Engaged" / "Right Brain Engaged"
- Low-power mode toggle (reduced framerate for battery)

### Technical Notes
- Use R3F for declarative Three.js
- @shadergradient provides pre-built animated gradients
- Consider `drei` helpers for camera controls, performance
- Implement frame rate limiting for low-power mode

---

## Phase 5: Interactive Components & State

### Deliverables
- Flow Score ring animation (animated fill 0-100)
- Progress bar animations for flow entries
- Mode toggle functionality (Focus ↔ Creative ↔ Recovery)
- Zustand stores:
  - `useFlowStore` - score, state, entries
  - `useDeviceStore` - connection, battery, mode
  - `useActivityStore` - tabs, distractions, timeline
- View toggle: minimal ↔ dashboard (persisted)
- Message passing: newtab ↔ background worker

### Technical Notes
- **CSS transitions only** (no Framer Motion - saves ~15kb)
- Chrome runtime messaging for cross-context communication
- Persist view preference in `chrome.storage.local`
- Use `will-change` and `transform` for GPU-accelerated animations

---

## Phase 6: Browser Activity Tracking

### Deliverables
- Tab switching detection via `chrome.tabs.onActivated`
- URL classification engine:
  - Work: docs, github, notion, figma, etc.
  - Leisure: youtube, netflix, reddit, twitter, etc.
  - Communication: slack, discord, gmail, etc.
- Idle detection via `chrome.idle.queryState`
- Activity logging with timestamps
- Distraction event capture (time spent on leisure during focus)
- 30-day IndexedDB retention with cleanup

### Permissions Required
```json
{
  "permissions": ["tabs", "idle", "storage"],
  "host_permissions": ["<all_urls>"]
}
```

### Technical Notes
- Use Dexie.js for IndexedDB abstraction
- Implement configurable URL classification rules
- Background worker handles all tracking logic

---

## Phase 7: Seed Dataset Integration *(2nd last)*

### Deliverables
- Mock EEG data generator:
  - 256Hz sample rate simulation
  - Alpha, beta, theta, gamma band values
  - Realistic noise patterns
- Device telemetry simulation:
  - Battery percentage (87%, decreasing over time)
  - Connection state (connected/disconnected)
  - Signal quality indicators
- Flow Score calculation algorithm:
  - Input: EEG bands, activity data, time in state
  - Output: 0-100 score with breakdown
- Mental State chart data:
  - Hourly data points (9:00-16:00)
  - State transitions with timestamps
- Flow Summary AI text templates:
  - "You are in flow state since X hours..."
  - Pending reminder formatting
  - Distraction summary
- Full UI validation with synthetic data streams

### Technical Notes
- Create `src/lib/mock/` directory for generators
- Use `setInterval` to simulate real-time data
- Ensure all UI components render correctly with mock data
- Test edge cases: 0% battery, disconnected, no flow time

---

## Phase 8: Bluetooth Headset Connection *(last)*

### Deliverables
- WebBluetooth API integration
- BLE pairing flow:
  - Device discovery ("Epiphany Headphones")
  - User consent dialog
  - Connection establishment
- Real EEG streaming pipeline:
  - GATT service/characteristic subscription
  - Data parsing (256Hz packets)
  - Buffer management
- Stimulation commands:
  - Mode switching (Creative/Focus/Recovery)
  - Intensity control
  - Start/stop commands
- Connection state management:
  - Auto-reconnect on disconnect
  - Connection quality indicator
- Battery polling (periodic read)
- Error handling:
  - Bluetooth not available
  - Device not found
  - Connection lost
  - Low battery alerts

### Permissions Required
```json
{
  "permissions": ["bluetooth"]
}
```

### Technical Notes
- WebBluetooth only works in secure contexts (HTTPS/extension)
- Implement exponential backoff for reconnection
- Create abstraction layer over raw BLE for testability
- Consider Web Workers for EEG data processing

---

## Architecture Summary

```
epiphany-chrome-extension/
├── entrypoints/
│   ├── newtab/           # New Tab page (minimal + dashboard)
│   ├── background/       # Service worker (tracking, BLE, state)
│   └── popup/            # (optional) Quick actions popup
├── components/
│   ├── flow-score/       # Circular gauge
│   ├── flowprints/       # 3D visualization
│   ├── device-card/      # Headphone status
│   ├── flow-summary/     # AI tooltip
│   ├── timeline/         # Session chart
│   └── flow-entries/     # State list items
├── stores/
│   ├── flow.ts           # Flow state management
│   ├── device.ts         # Device state management
│   └── activity.ts       # Activity tracking state
├── lib/
│   ├── bluetooth/        # WebBluetooth abstraction
│   ├── eeg/              # Signal processing
│   ├── mock/             # Seed data generators
│   └── classification/   # URL categorization
└── assets/
    ├── fonts/
    ├── icons/
    └── textures/         # Noise overlay
```

---

## Timeline Estimate

| Phase | Estimated Duration |
|-------|-------------------|
| Phase 1 | 1-2 days |
| Phase 2 | 1 day |
| Phase 3 | 2-3 days |
| Phase 4 | 2-3 days |
| Phase 5 | 1-2 days |
| Phase 6 | 2 days |
| Phase 7 | 2 days |
| Phase 8 | 3-4 days |
| **Total** | **~15-19 days** |

---

## Dependencies

### Core (Critical Path - ~35kb gzipped)
| Package | Size (gzip) | Purpose |
|---------|-------------|---------|
| `wxt` | build-only | Extension framework |
| `react` + `react-dom` | ~32kb | UI library |
| `typescript` | build-only | Type safety |
| `zustand` | ~2kb | State management |
| `tailwindcss` | build-only | Styling (purged CSS ~5kb) |

### 3D Visualization (Lazy-loaded - ~190kb gzipped)
| Package | Size (gzip) | Purpose |
|---------|-------------|---------|
| `three` | ~150kb | 3D engine |
| `@react-three/fiber` | ~35kb | React Three.js renderer |
| `@react-three/drei` | ~10kb* | R3F helpers (*tree-shaken) |

### Charts (Lazy-loaded - ~10kb gzipped)
| Package | Size (gzip) | Purpose |
|---------|-------------|---------|
| `uplot` | ~10kb | Lightweight timeline chart |

### Data & Storage (~8kb gzipped)
| Package | Size (gzip) | Purpose |
|---------|-------------|---------|
| `dexie` | ~8kb | IndexedDB wrapper |

### NOT Using (Bundle Savings)
| Removed | Saved | Alternative |
|---------|-------|-------------|
| ~~`@shadcn/ui`~~ | ~50kb+ | Pure Tailwind components |
| ~~`framer-motion`~~ | ~15kb | CSS transitions |
| ~~`recharts`~~ | ~70kb | uPlot (~10kb) |
| ~~`@radix-ui/*`~~ | ~30kb | Hand-rolled tooltips/modals |

### Total Bundle Estimate
```
Critical Path (Minimal View):     ~35kb gzipped
Dashboard (lazy):                 ~25kb gzipped
Charts (lazy):                    ~10kb gzipped
3D Visualization (lazy):          ~190kb gzipped
─────────────────────────────────────────────────
Total (all loaded):               ~260kb gzipped
Perceived load (Minimal only):    ~35kb → <50ms
```
