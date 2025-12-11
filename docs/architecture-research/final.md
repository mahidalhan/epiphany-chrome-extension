# Epiphany Extension - Final Technology Stack

## Settled Layers

| Layer | Technology | Status |
|-------|------------|--------|
| 1 - Runtime/Package Manager | **Bun** | ✅ SETTLED |
| 2 - Bundler | **Vite** (via WXT) | ✅ SETTLED |
| 3 - Extension Framework | **WXT** | ✅ SETTLED |
| 4 - UI Framework | **React 18** | ✅ SETTLED |
| 5 - 3D Framework | **React Three Fiber** | ✅ SETTLED |
| 6 - Signal Processing | **pffft.wasm** | ✅ SETTLED |

---

## Layer 4 & 5 Analysis (December 2025)

### First Principles: What Does the UI Need?

| Requirement | Why It Matters |
|-------------|----------------|
| **Bundle size** | Extensions load on every new tab/popup |
| **Reactivity model** | EEG data streams at 256Hz - need efficient updates |
| **3D integration** | Flowprints requires animated gradient blobs |
| **Extension compatibility** | CSP restrictions, multiple contexts |
| **Component ecosystem** | UI components for settings, dashboards |

### The Core Constraint

**React Three Fiber (R3F) does NOT work with Vue, Preact, or Solid.**

R3F uses React's internal reconciler API (`react-reconciler`). Non-React frameworks cannot implement this:
- Vue has TroisJS but no R3F equivalent or pre-built gradient components
- Preact's `preact/compat` doesn't support R3F's deep React integration
- Solid.js has no Three.js reconciler

This is a hard technical blocker confirmed in:
- github.com/preactjs/preact/issues/2538
- docs.pmnd.rs/react-three-fiber (React requirement)

### Without 3D Constraint: Vue 3 Would Win

If Flowprints didn't require 3D visualization, Vue 3 wins on pure technical merit:

| Criteria | Weight | React 18 | Vue 3 | Preact | Solid.js |
|----------|--------|----------|-------|--------|----------|
| Bundle size | 20% | 4 | 8 | **10** | 9 |
| Reactivity efficiency | 25% | 6 | **9** | 6 | **9** |
| Extension compat | 15% | 9 | 9 | 9 | 8 |
| Component ecosystem | 15% | **10** | 8 | 6 | 4 |
| TypeScript | 10% | 9 | 9 | 8 | 9 |
| Memory footprint | 15% | 6 | 8 | 8 | **9** |
| **WEIGHTED TOTAL** | 100% | 6.95 | **8.35** | 7.45 | 7.75 |

**Vue wins by +1.4 points** due to:
- Fine-grained proxy-based reactivity (better for 256Hz EEG streams)
- Smaller bundle (17KB vs 45KB)
- Lower memory footprint
- No manual optimization needed (no useMemo/useCallback)

### With 3D Constraint: React 18 Wins

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

**React wins by +1.1 points** due to R3F ecosystem.

### The 3D Ecosystem Asymmetry

| Framework | Pre-built Gradient Blobs | Custom Shader Effort |
|-----------|-------------------------|---------------------|
| React (R3F) | ✅ @shadergradient/react, lamina, drei | Low |
| Vue (TroisJS) | ❌ None found | High (150-300 LOC GLSL) |
| Vue (OGL) | ❌ None | High |
| Vanilla Three.js | ⚠️ Some examples | Medium |

React wins not because it's "better" but because the Three.js community consolidated around React bindings.

### Decision: Layer 4 (UI Framework)

**Winner: React 18**

### Decision: Layer 5 (3D Framework)

**Winner: React Three Fiber + @shadergradient/react**

| Criteria | Weight | R3F | Three.js | OGL | Custom WebGL |
|----------|--------|-----|----------|-----|--------------|
| Bundle size | 15% | 5 | 4 | 8 | 10 |
| Dev speed | 25% | **10** | 6 | 5 | 3 |
| Visual quality | 20% | **10** | 10 | 9 | 10 |
| Low-power mode | 10% | 7 | 8 | 9 | 10 |
| Maintenance | 15% | 9 | 8 | 6 | 4 |
| Flexibility | 15% | 5 | 10 | 10 | 10 |
| **TOTAL** | 100% | **7.90** | 7.60 | 7.35 | 6.65 |

**Rationale**: @shadergradient/react provides pre-built animated gradient blobs matching Figma design. R3F's declarative model makes EEG-to-visual mapping trivial.

### Decision Tree

```
┌─────────────────────────────────────────────────────────────┐
│  UI + 3D FRAMEWORK DECISION TREE                            │
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

### When Vue Would Have Won

Vue 3 would be the better choice IF:
- No 3D visualization required, OR
- Team has GLSL/shader expertise for custom implementation, OR
- Bundle size under 100KB is a hard requirement

### When Preact Would Have Won

Preact would be the better choice IF:
- No 3D visualization required, AND
- Content scripts injected into every page (bundle size critical), OR
- Extension popup startup under 50ms was critical

Since Flowprints 3D is core to the product and design fidelity matters, React + R3F is the correct choice.

---

## Final Stack Summary

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 5: 3D Framework                                      │
│  └── React Three Fiber + @shadergradient/react              │
├─────────────────────────────────────────────────────────────┤
│  LAYER 4: UI Framework                                      │
│  └── React 18 + TypeScript                                  │
│      └── Zustand (state management)                         │
│      └── Tailwind CSS + shadcn/ui                           │
├─────────────────────────────────────────────────────────────┤
│  LAYER 3: Extension Framework                               │
│  └── WXT + @wxt-dev/module-react                            │
├─────────────────────────────────────────────────────────────┤
│  LAYER 2: Bundler                                           │
│  └── Vite (via WXT)                                         │
├─────────────────────────────────────────────────────────────┤
│  LAYER 1: Runtime + Package Manager                         │
│  └── Bun                                                    │
└─────────────────────────────────────────────────────────────┘
```

### Bundle Size Estimate

| Component | Size (gzipped) |
|-----------|----------------|
| React 18 | ~45KB |
| React Three Fiber | ~20KB |
| @shadergradient | ~15KB |
| Three.js (peer dep) | ~50KB tree-shaken |
| Zustand | ~1KB |
| App code | ~20KB |
| **Total** | **~150KB** |

This is acceptable for a new tab/popup extension with 3D visualization.




