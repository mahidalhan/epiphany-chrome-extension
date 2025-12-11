# Epiphany Chrome Extension - Architecture Research

## Research Date: December 2025

This document captures the technology research and weighted analysis for the Epiphany browser extension architecture.

---

## 1. Layer Separation (First Principles)

The architecture consists of 4 distinct layers that should NOT be conflated:

| Layer | Purpose | Options Evaluated |
|-------|---------|-------------------|
| **Runtime/Package Manager** | Executes JS, installs deps | Bun, Node+npm, Node+pnpm |
| **Bundler** | Compiles/bundles code | Bun bundler, Vite, esbuild |
| **Extension Framework** | MV3 manifest, HMR, structure | WXT, Plasmo, CRXJS, Manual |
| **UI Framework** | Components, rendering | React, Preact, Solid, Vanilla |

---

## 2. Layer 1: Runtime & Package Manager

### Raw Performance Benchmarks (2025)

| Metric | Bun | pnpm | npm | Yarn |
|--------|-----|------|-----|------|
| Cold install (no cache) | ~2.5s | ~8s | ~15s | ~12s |
| With cache + lockfile | ~0.3s | ~1.2s | ~3s | ~2s |
| TypeScript execution | Native | Needs ts-node | Needs ts-node | Needs ts-node |
| Memory usage | Lower | Low | Medium | Medium |

### Weighted Analysis

| Criteria | Weight | Bun | Node+pnpm | Node+npm |
|----------|--------|-----|-----------|----------|
| Install speed | 25% | **10** | 7 | 4 |
| Script execution | 20% | **10** | 6 | 6 |
| Native TS support | 15% | **10** | 3 | 3 |
| Ecosystem maturity | 20% | 7 | **9** | **10** |
| Edge case compatibility | 15% | 6 | **9** | **10** |
| Disk efficiency | 5% | 8 | **10** | 5 |
| **WEIGHTED TOTAL** | 100% | **8.55** | 7.30 | 6.35 |

### Decision: **Bun**

---

## 3. Layer 2: Bundler

### Raw Performance Benchmarks (2025)

| Metric | Bun Bundler | esbuild | Vite (dev) | Vite (prod) |
|--------|-------------|---------|------------|-------------|
| Cold build (medium project) | ~50ms | ~80ms | N/A | ~800ms |
| HMR update | ~15ms | ~20ms | ~10ms | N/A |
| Production bundle | ~60ms | ~100ms | N/A | ~1s |
| Tree shaking | Good | Excellent | Excellent | Excellent |
| Code splitting | Basic | Good | Excellent | Excellent |

### Extension-Specific Requirements

For browser extensions, we need:
1. Multiple entry points (popup, newtab, background, content scripts)
2. Manifest V3 generation from code
3. Hot reload across all contexts
4. Cross-browser output (Chrome, Firefox, Safari)

### Weighted Analysis

| Criteria | Weight | Bun Bundler | esbuild | Vite |
|----------|--------|-------------|---------|------|
| Raw speed | 20% | **10** | 9 | 7 |
| Multi-entry support | 15% | 6 | 7 | **10** |
| Extension-specific plugins | 25% | 2 | 4 | **10** |
| HMR quality | 15% | 5 | 3 | **10** |
| Production optimization | 15% | 7 | 8 | **9** |
| Code splitting | 10% | 5 | 7 | **10** |
| **WEIGHTED TOTAL** | 100% | 5.55 | 5.95 | **9.25** |

### Decision: **Vite** (via WXT framework, running on Bun runtime)

**Key Insight**: Bun's bundler is faster in raw speed, but lacks the extension-specific plugin ecosystem. Vite's value comes from plugins (WXT, CRXJS) that handle manifest generation, multi-entry points, and context-aware HMR.

---

## 4. Layer 3: Extension Framework

### Feature Comparison

| Feature | WXT | Plasmo | CRXJS | Manual |
|---------|-----|--------|-------|--------|
| Manifest generation | Auto from files | Auto from files | Auto from manifest.json | Manual |
| MV3 support | Native | Native | Native | Manual |
| Cross-browser | Chrome/Firefox/Safari/Edge | Chrome/Firefox/Edge | Chrome only | Manual |
| HMR (all contexts) | Built-in | Built-in | Built-in | Manual |
| TypeScript | First-class | First-class | First-class | Manual |
| React module | `@wxt-dev/module-react` | Built-in | Works | Manual |
| Maintenance (2025) | Active (market leader) | Active | **Deprecated March 2025** | N/A |

### Weighted Analysis

| Criteria | Weight | WXT | Plasmo | Manual+Bun |
|----------|--------|-----|--------|------------|
| MV3 correctness | 20% | **10** | **10** | 6 |
| Cross-browser | 15% | **10** | 8 | 4 |
| HMR quality | 15% | **10** | **10** | 2 |
| Dev velocity | 20% | **10** | 9 | 3 |
| Long-term maintenance | 15% | **10** | 8 | **10** |
| Flexibility/escape hatch | 15% | 8 | 6 | **10** |
| **WEIGHTED TOTAL** | 100% | **9.70** | 8.50 | 5.30 |

### Decision: **WXT**

**Key Insight**: WXT explicitly supports Bun as the runtime:
```bash
bunx wxt@latest init   # Bootstrap with Bun
bun run dev            # Dev server via Bun
bun run build          # Production build via Bun
```

---

## 5. Layer 4: UI Framework

### First Principles: What Does a Chrome Extension UI Need?

Before comparing frameworks, identify the actual requirements:

| Requirement | Why It Matters |
|-------------|----------------|
| **Bundle size** | Extensions load on every new tab/popup - affects perceived speed |
| **Reactivity model** | EEG data streams at 256Hz - need efficient state updates |
| **Extension compatibility** | CSP restrictions, multiple contexts (popup/background/content) |
| **Component ecosystem** | UI components for settings, charts, dashboards |
| **TypeScript support** | Complex EEG data types benefit from strong typing |
| **Memory footprint** | Extensions persist in memory |

### Raw Performance Data (2025)

| Metric | React 18 | Vue 3 | Preact 10 | Solid.js |
|--------|----------|-------|-----------|----------|
| Bundle size (gzip) | ~45kB | ~17kB | ~3kB | ~7kB |
| Initial parse time | ~15ms | ~8ms | ~3ms | ~5ms |
| Memory footprint | Higher | Lower | Lower | Lowest |
| Reactivity model | Virtual DOM | Proxy (fine-grained) | Virtual DOM | Signals (fine-grained) |
| Re-render behavior | Full subtree (needs memo) | Auto-tracked deps | Full subtree | Auto-tracked deps |

### Reactivity Analysis for High-Frequency Data (EEG @ 256Hz)

**Vue 3 / Solid.js (Fine-grained reactivity):**
```
Proxy-based / Signal-based reactivity
- Only re-renders components that READ the changed value
- No manual optimization needed
- signal.value = x → only subscribers update
```

**React 18 (Virtual DOM):**
```
Virtual DOM + Concurrent features
- Re-renders entire subtree by default
- Requires useMemo, useCallback, memo() to optimize
- Can batch updates with startTransition
```

For streaming EEG data, fine-grained reactivity (Vue/Solid) is architecturally better suited. React requires explicit optimization to avoid wasteful re-renders.

### Critical Finding: React Three Fiber Compatibility

**React Three Fiber (R3F) does NOT work with Vue, Preact, or Solid.**

- R3F uses React's internal reconciler APIs (`react-reconciler`)
- `preact/compat` alias doesn't work for R3F's deep React integration
- Vue has TroisJS (Three.js wrapper) but no R3F equivalent
- No `preact-three-fiber` or `solid-three-fiber` equivalents exist

**This is a HARD BLOCKER for non-React frameworks if 3D Flowprints are required.**

### Scenario A: UI Framework WITHOUT 3D Constraint

If Flowprints didn't require 3D visualization, which framework wins on pure merit?

| Criteria | Weight | React 18 | Vue 3 | Preact | Solid.js |
|----------|--------|----------|-------|--------|----------|
| Bundle size | 20% | 4 | 8 | **10** | 9 |
| Reactivity efficiency | 25% | 6 | **9** | 6 | **9** |
| Extension compat | 15% | 9 | 9 | 9 | 8 |
| Component ecosystem | 15% | **10** | 8 | 6 | 4 |
| TypeScript | 10% | 9 | 9 | 8 | 9 |
| Memory footprint | 15% | 6 | 8 | 8 | **9** |
| **WEIGHTED TOTAL** | 100% | 6.95 | **8.35** | 7.45 | 7.75 |

**Winner without 3D constraint: Vue 3** (+1.4 points over React)

Vue wins on metrics that matter most for a real-time data extension: smaller bundle, better reactivity for streaming data, lower memory.

### Scenario B: UI Framework WITH 3D Flowprints (Current Requirement)

| Criteria | Weight | React 18 | Vue 3 | Preact | Solid.js |
|----------|--------|----------|-------|--------|----------|
| Bundle size | 15% | 4 | 8 | **10** | 9 |
| Runtime performance | 15% | 7 | 8 | 8 | **10** |
| 3D/WebGL integration (R3F) | **25%** | **10** | 3 | **0** | 3 |
| State management options | 10% | 9 | 9 | **10** | 8 |
| Extension framework support | 15% | **10** | 9 | 6 | 5 |
| Component ecosystem | 10% | **10** | 8 | 6 | 4 |
| Developer familiarity | 10% | **10** | 9 | 8 | 5 |
| **WEIGHTED TOTAL** | 100% | **8.35** | 7.25 | 5.90 | 6.05 |

**Winner with 3D constraint: React 18** (+1.1 points over Vue)

### The 3D Ecosystem Asymmetry

The question isn't "React vs Vue for 3D" - it's whether pre-built tools exist:

| Framework | Pre-built Gradient Blobs | Custom Shader Effort |
|-----------|-------------------------|---------------------|
| React (R3F) | ✅ @shadergradient/react, lamina, drei | Low |
| Vue (TroisJS) | ❌ None found | High (150-300 LOC GLSL) |
| Vue (OGL) | ❌ None | High |
| Vanilla Three.js | ⚠️ Some examples | Medium |

React wins due to **ecosystem asymmetry** - the Three.js community consolidated around React bindings.

### Decision Tree

```
┌─────────────────────────────────────────────────────────────┐
│  UI FRAMEWORK DECISION TREE                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Need 3D animated gradient blobs?                           │
│      │                                                      │
│      ├── NO  → Vue 3 + OGL/uPlot (smaller, better DX)      │
│      │                                                      │
│      └── YES → Have GLSL expertise?                         │
│                   │                                         │
│                   ├── YES → Vue 3 + OGL (smallest bundle)  │
│                   │                                         │
│                   └── NO  → React 18 + R3F (best tooling)  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Decision: **React 18**

**Rationale**: Flowprints 3D visualization is core to the product. React Three Fiber + @shadergradient/react matches the Figma design exactly.

**When Vue would win**:
- No 3D visualization required
- Team has GLSL/shader expertise for custom implementation
- Bundle size under 100KB is a hard requirement
- Content scripts injected into every page

**When Preact would win**:
- Content scripts injected into every page (bundle size critical)
- No 3D requirements
- Performance-critical SPAs targeting slow networks

---

## 6. Supporting Libraries

### State Management

| Library | Bundle | Extension Contexts | Verdict |
|---------|--------|-------------------|---------|
| **Zustand** | 1.1kB | Works well | **Selected** |
| Jotai | 2.4kB | Works well | Good alternative |
| Redux Toolkit | 11kB | Needs webext-redux | Overkill |

### 3D Visualization (Flowprints)

| Option | Bundle | Integration | Verdict |
|--------|--------|-------------|---------|
| **React Three Fiber** | +20kB | Declarative React | **Selected** |
| **@shadergradient/react** | +15kB | Pre-built blob shader | **Selected** |
| Raw Three.js | 150kB | Imperative | Backup |

### Timeline Chart

| Library | Bundle | Timeline Component | Verdict |
|---------|--------|-------------------|---------|
| **Unovis** | 45kB | Native Timeline | **Selected** |
| Recharts | 84kB | Area/Line only | Good backup |
| Victory | 90kB | Line + labels | Alternative |

### Styling

| Framework | Features | Verdict |
|-----------|----------|---------|
| **Tailwind CSS** | Utility-first, purged | **Selected** |
| **shadcn/ui** | Pre-built dark components | **Selected** |

---

## 7. Final Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 4: UI Framework                                      │
│  └── React 18 + TypeScript                                  │
│      └── React Three Fiber + @shadergradient/react (3D)     │
│      └── Unovis (Timeline charts)                           │
│      └── Zustand (State management)                         │
│      └── Tailwind CSS + shadcn/ui (Styling)                 │
├─────────────────────────────────────────────────────────────┤
│  LAYER 3: Extension Framework                               │
│  └── WXT (file-based routing, MV3, cross-browser)           │
│      └── @wxt-dev/module-react                              │
├─────────────────────────────────────────────────────────────┤
│  LAYER 2: Bundler                                           │
│  └── Vite (via WXT, extension plugins)                      │
├─────────────────────────────────────────────────────────────┤
│  LAYER 1: Runtime + Package Manager                         │
│  └── Bun (fast install, native TS, script execution)        │
└─────────────────────────────────────────────────────────────┘
```

### Summary Table

| Layer | Choice | Why |
|-------|--------|-----|
| Runtime | **Bun** | 3-5x faster installs, native TS |
| Bundler | **Vite (via WXT)** | Extension plugin ecosystem |
| Extension Framework | **WXT** | Best MV3 support, cross-browser, active |
| UI | **React 18** | R3F compatibility for Flowprints |
| State | **Zustand** | Tiny, works across extension contexts |
| 3D | **React Three Fiber** | Declarative Three.js |
| Charts | **Unovis** | Native timeline component |
| Styling | **Tailwind + shadcn/ui** | Fast iteration, dark mode |

---

## 8. Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   DATA SOURCES                              │
├──────────────────┬──────────────────┬───────────────────────┤
│  Demo JSON       │  WebBluetooth    │  Browser Activity     │
│  (mock EEG)      │  (real device)   │  (tab tracking)       │
└────────┬─────────┴────────┬─────────┴─────────┬─────────────┘
         │                  │                   │
         ▼                  ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKGROUND SERVICE WORKER                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐      │
│  │ EEG Processor│  │Flow Scoring │  │ Activity Logger │      │
│  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘      │
│         └────────────────┼──────────────────┘               │
│                          ▼                                  │
│              ┌───────────────────────┐                      │
│              │   Unified State Hub   │                      │
│              │  (chrome.storage +    │                      │
│              │   runtime.sendMessage)│                      │
│              └───────────┬───────────┘                      │
└──────────────────────────┼──────────────────────────────────┘
                           │ chrome.runtime messages
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
   ┌──────────┐     ┌───────────┐     ┌───────────┐
   │ New Tab  │     │  Popup    │     │ Cloud AI  │
   │   UI     │     │   UI      │     │   API     │
   └──────────┘     └───────────┘     └───────────┘
```

---

## 9. Directory Structure (Proposed)

```
src/
├── entrypoints/
│   ├── background/
│   │   └── index.ts           # Service worker
│   ├── newtab/
│   │   ├── index.html
│   │   ├── App.tsx            # Main new tab app
│   │   └── main.tsx
│   └── popup/
│       ├── index.html
│       ├── App.tsx
│       └── main.tsx
├── components/
│   ├── FlowScore/             # Circular meter + share
│   ├── DeviceCard/            # BLE connection status
│   ├── Flowprints/            # 3D neural visualization
│   ├── FlowTimeline/          # Unovis timeline
│   ├── FlowSummary/           # AI summary + brain state
│   └── SearchBar/             # Google search
├── stores/
│   ├── deviceStore.ts         # Zustand - BLE state
│   ├── eegStore.ts            # Zustand - EEG data
│   ├── flowStore.ts           # Zustand - Flow score
│   └── aiStore.ts             # Zustand - AI summaries
├── services/
│   ├── eegService.ts          # EEG data processing
│   ├── bleService.ts          # WebBluetooth
│   ├── demoDataService.ts     # Mock JSON loader
│   ├── aiService.ts           # Cloud LLM API
│   └── storageService.ts      # chrome.storage wrapper
├── types/
│   └── index.ts               # TypeScript interfaces
└── utils/
    └── flowScoring.ts         # Score calculation
```

---

## 10. Research Sources

- pnpm.io/benchmarks (Package manager benchmarks, Nov 2025)
- bun.com/blog (Bun install internals, Sep 2025)
- wxt.dev (WXT documentation, Dec 2025)
- redreamality.com (2025 State of Browser Extension Frameworks)
- dev.to, medium.com (Various Preact vs React comparisons, 2025)
- github.com/preactjs/preact/issues/2538 (R3F + Preact compatibility)
- docs.pmnd.rs/react-three-fiber (R3F documentation)
- unovis.dev (Unovis timeline documentation)
