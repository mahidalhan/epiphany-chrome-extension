# Phase 4: Flowprints 3D Visualization - Implementation Plan

> **Status**: Ready to Start
> **Estimated Time**: 3-4 hours
> **Prerequisites**: ✅ Phase 3 Complete - `FlowprintsCard` and `FlowprintsPlaceholder` exist
>
> **Change Log**:
> - Initial plan created based on architecture research and @shadergradient/react API analysis
> - Confirmed React 19 + R3F v9 compatibility
> - Added @react-spring/three for smooth color transitions
> - **2024-12-13**: Updated after Phase 3 completion - verified existing components and type structure
> - **2024-12-13**: **BULLETPROOF UPDATE** - Verified against Figma design node `140-249`:
>   - ⚠️ **FIX**: BrainStateChip must be LEFT-ALIGNED (currently center-justified)
>   - ✅ **VERIFIED**: Canvas dimensions 360×300px with black bg + #333 border + 8px radius
>   - ✅ **VERIFIED**: ShaderGradientCanvas has built-in lazy loading props (`lazyLoad`, `threshold`, `rootMargin`)
>   - ➕ **ADDED**: Figma reference image shows pointillistic sphere with purple/orange/blue gradient
>   - ➕ **ADDED**: Must use `lightType="env"` for soft ambient lighting matching Figma

## Overview

Replace the Phase 3 `FlowprintsPlaceholder` (static 360×300px gradient image) with an animated 3D gradient blob using React Three Fiber + `@shadergradient/react`. The visualization responds to brain state changes with smooth color transitions, creating a "living" neural activity indicator.

**Key Insight**: The `@shadergradient/react` library provides pre-built animated gradient meshes that match the Figma design aesthetic, eliminating the need for custom GLSL shader code.

---

## Important: MVP vs Final Architecture

> **Reference**: `docs/product.md` sections 2.4 (Flowprints) and 2.5 (Brain State Controller)

### Product Vision (When Headset Connected)

The product has **two separate data flows** that work together:

| Component | Data Source | Purpose |
|-----------|-------------|---------|
| **Brain State Controller** | User selection | User **chooses** desired mode (Creative/Focus/Recovery) → headset delivers stimulation |
| **Flowprints + BrainStateChip** | EEG detection | Shows **actual** detected brain activity from headset |

```
User selects mode → Headset stimulates → EEG detects actual activity → UI reflects reality
```

The chip text ("Left Brain Engaged") should reflect **what the EEG actually detects**, which may differ from the user's selected mode (e.g., user selected Creative but brain hasn't shifted yet).

### Phase 4 Scope (MVP - No Headset)

Since Phase 4 has **no EEG data available**, we use a **static placeholder**:

- **Flowprints 3D colors**: Based on user-selected mode (for visual demo)
- **BrainStateChip**: Shows static "Left Brain Engaged" (from mock data)
- **StateDescription + Tip**: Static content (from mock data)

**No mapping from user mode → chip in Phase 4.** The chip remains static until Phase 8 when real EEG data drives the UI.

### Future Phases

| Phase | BrainStateChip Data Source |
|-------|---------------------------|
| Phase 4 | Static mock data (`mockBrainState.activeHemisphere = 'left'`) |
| Phase 7 | Simulated EEG seed data (for testing transitions) |
| Phase 8 | Real EEG from headset via WebBluetooth |

This means in Phase 4:
- ✅ 3D blob colors change based on user mode selection
- ❌ BrainStateChip does NOT change (stays "Left Brain Engaged")
- ❌ StateDescription does NOT change (stays static)

These will become dynamic when real EEG data is available.

---

## Figma Design Reference

**Node**: `140-249` in `hCpeskt8LU7iZBF1Lq8Ky6`

### Visual Requirements from Figma

| Element | Figma Spec | Implementation Notes |
|---------|------------|----------------------|
| Canvas container | 360×300px, black bg, #333 border, 8px radius | Match exactly with Tailwind |
| 3D blob position | Centered in canvas, ~240px sphere diameter | Use `cameraZoom` and `cDistance` to fill ~80% of canvas |
| Blob aesthetic | Pointillistic/particle sphere with organic movement | Use `type="sphere"`, `wireframe={false}`, high `uDensity` |
| Color palette (Focus) | Purple (#9b38ff) + Orange (#ff6b35) + Blue (#86b4df) | Primary gradient colors |
| Lighting | Soft ambient, no harsh shadows | `lightType="env"`, `envPreset="city"`, `brightness={0.8}` |
| Animation | Slow, organic undulation | `uSpeed={0.2-0.4}`, `uFrequency={4-6}` |

### Layout Corrections for Phase 3 Components

| Component | Current | Figma Shows | Fix Required |
|-----------|---------|-------------|--------------|
| BrainStateChip | `justify-center` | LEFT-aligned | Remove center wrapper in FlowprintsCard |
| StateDescription | Centered | LEFT-aligned | Already correct ✅ |
| TipSection | Full-width | Full-width | Already correct ✅ |

---

## Current State (Phase 3 Complete ✅)

Phase 3 created these components in `components/flowprints/`:
- ✅ `FlowprintsCard.tsx` - Card container (648px height) - accepts `BrainState` interface prop
- ✅ `FlowprintsPlaceholder.tsx` - Static 360×300px canvas with CSS gradient placeholder
- ✅ `FlowprintsHeader.tsx` - Title + subtitle + lightbulb icon
- ✅ `BrainStateChip.tsx` - "Left/Right Brain Engaged" golden pill
- ✅ `StateDescription.tsx` - 3-paragraph explanation text
- ✅ `TipSection.tsx` - Divider + tip text

**Storage Layer** (in `stores/view.ts`):
- ✅ `brainState` storage item defined (`'creative' | 'focus' | 'recovery'`)
- ✅ `BRAIN_STATE_CONFIG` with colors: creative=#9b38ff, focus=#007bff, recovery=#64d65e
- ⚠️ NOT YET WIRED to FlowprintsCard (uses static mock data currently)

**Type Naming Note**:
- `BrainState` (stores/view.ts) = `'creative' | 'focus' | 'recovery'` - **USE THIS FOR 3D COLORS**
- `BrainState` (types/flow.ts) = interface `{ activeHemisphere, description[], tip }` - for UI display
- `FlowState` (types/flow.ts) = same as stores BrainState, with `FLOW_STATE_COLORS`

Phase 4 replaces `FlowprintsPlaceholder` with live 3D visualization and wires up storage.

---

## Technology Stack

### Dependencies to Install

```bash
bun add three @react-three/fiber @react-spring/three @shadergradient/react
bun add -D @types/three
```

### Version Compatibility Matrix

| Package | Version | React 19 | Notes |
|---------|---------|----------|-------|
| `three` | ^0.170.0 | ✅ | Core 3D engine |
| `@react-three/fiber` | ^9.0.0 | ✅ | R3F v9 required for React 19 |
| `@react-spring/three` | ^9.7.0 | ✅ | Smooth color interpolation |
| `@shadergradient/react` | ^2.0.0 | ✅ | Pre-built gradient blob |
| `@types/three` | ^0.170.0 | - | TypeScript definitions |

**Important**: R3F v9.x is required for React 19 compatibility. v8.x will NOT work.

### Bundle Size Budget

| Package | Size (gzipped) | Loading |
|---------|----------------|---------|
| `three` (tree-shaken) | ~50KB | Lazy |
| `@react-three/fiber` | ~20KB | Lazy |
| `@react-spring/three` | ~15KB | Lazy |
| `@shadergradient/react` | ~10KB | Lazy |
| App code | ~5KB | Lazy |
| **Total** | **~100KB** | Lazy-loaded |

*Note: Original estimate was ~190KB but tree-shaking significantly reduces Three.js bundle.*

---

## File Structure After Phase 4

```
components/flowprints/
├── FlowprintsCard.tsx              # (Phase 3) Card container - UPDATE to use storage
├── FlowprintsHeader.tsx            # (Phase 3) Title + lightbulb icon
├── FlowprintsPlaceholder.tsx       # (Phase 3) KEEP as WebGL fallback
├── FlowprintsCanvas.tsx            # NEW - Lazy-loaded R3F canvas wrapper
├── ShaderGradientScene.tsx         # NEW - ShaderGradient with spring animations
├── BrainStateChip.tsx              # (Phase 3) Golden pill indicator
├── StateDescription.tsx            # (Phase 3) 3-paragraph text
├── TipSection.tsx                  # (Phase 3) Divider + tip
└── index.ts                        # (Phase 3) Barrel exports - UPDATE for lazy canvas

lib/
├── hooks/
│   ├── useWxtStorage.ts            # (Phase 2) Existing storage hook ✅
│   └── useBrainStateColors.ts      # NEW - Maps brain state → gradient colors
└── utils/
    └── webgl-detect.ts             # NEW - WebGL capability detection

stores/
└── view.ts                         # (Phase 2) Already has brainState + BRAIN_STATE_CONFIG ✅

types/
├── flow.ts                         # (Phase 3) FlowState, FlowEntry, BrainState interface ✅
└── brain-state.ts                  # NEW - 3D-specific color configs (extends stores/view.ts)
```

**Note**: We DON'T need a separate BrainState type - we'll use `BrainState` from `stores/view.ts` for the 3D visualization and extend `BRAIN_STATE_CONFIG` with 3D-specific properties.

---

## Task Breakdown

### Phase 4.0: Dependencies (~10 min)

| Task | Description |
|------|-------------|
| Install runtime deps | `bun add three @react-three/fiber @react-spring/three @shadergradient/react` |
| Install dev deps | `bun add -D @types/three` |
| Verify installation | Check for peer dependency warnings, resolve if needed |
| Test import | Create minimal test to verify R3F + React 19 works |

**Peer dependency note**: If warnings appear, add to `package.json`:
```json
{
  "overrides": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

### Phase 4.1: Type Definitions (~10 min)

| Task | File | Description |
|------|------|-------------|
| 3D Color config | `types/brain-state.ts` | Interface for 3D gradient colors (color1, color2, color3, uSpeed, etc.) |
| Extend BRAIN_STATE_CONFIG | `stores/view.ts` | Add 3D properties OR create separate 3D config |

**Note**: `BrainState` type already exists in `stores/view.ts` as `'creative' | 'focus' | 'recovery'`. We just need the 3D-specific color config.

### Phase 4.2: Brain State Colors Hook (~25 min)

| Task | File | Description |
|------|------|-------------|
| Color palettes | `lib/hooks/useBrainStateColors.ts` | Define 3 colors per state |
| Spring animation | `lib/hooks/useBrainStateColors.ts` | Use `@react-spring/three` for transitions |
| Speed per state | `lib/hooks/useBrainStateColors.ts` | Vary `uSpeed` by brain state |

### Phase 4.3: WebGL Detection Utility (~15 min)

| Task | File | Description |
|------|------|-------------|
| Detect WebGL | `lib/utils/webgl-detect.ts` | Check for WebGL 1/2 support |
| Context test | `lib/utils/webgl-detect.ts` | Test canvas context creation |
| Export helper | `lib/utils/webgl-detect.ts` | `isWebGLSupported()` function |

### Phase 4.4: ShaderGradient Scene Component (~45 min)

| Task | File | Description |
|------|------|-------------|
| Create component | `components/flowprints/ShaderGradientScene.tsx` | Inner scene with gradient |
| Configure props | Same | Set shape, animation, camera settings |
| Wire spring colors | Same | Connect animated color values |
| Add low-power mode | Same | Reduce speed/density when enabled |

### Phase 4.5: Canvas Wrapper Component (~30 min)

| Task | File | Description |
|------|------|-------------|
| Create wrapper | `components/flowprints/FlowprintsCanvas.tsx` | Outer component with Suspense |
| ShaderGradientCanvas | Same | Use library's canvas (handles R3F setup) |
| Dimensions | Same | 360×300px with overflow hidden + rounded |
| Error boundary | Same | Catch WebGL errors, show fallback |
| Visibility detection | Same | Pause when tab hidden |

### Phase 4.6: Lazy Loading Setup (~10 min) — **SIMPLIFIED**

| Task | File | Description |
|------|------|-------------|
| ~~Lazy import~~ | ~~`components/flowprints/index.ts`~~ | **NOT NEEDED** - ShaderGradientCanvas has built-in lazy loading |
| ~~Preload logic~~ | ~~`entrypoints/newtab/App.tsx`~~ | **NOT NEEDED** - Library uses Intersection Observer |
| Export update | `components/flowprints/index.ts` | Export FlowprintsCanvas (regular export, not lazy) |
| Configure lazyLoad | `components/flowprints/FlowprintsCanvas.tsx` | Use `lazyLoad={true}` on ShaderGradientCanvas |

**IMPORTANT**: The `@shadergradient/react` library has **built-in lazy loading** via Intersection Observer:
- Set `lazyLoad={true}` on `<ShaderGradientCanvas>`
- Set `threshold={0.1}` for 10% visibility trigger
- Set `rootMargin="100px"` for pre-loading buffer
- **No `React.lazy()` or `Suspense` needed** for the 3D canvas itself

This simplifies the implementation significantly compared to the original plan.

### Phase 4.7: Integration (~30 min)

| Task | File | Description |
|------|------|-------------|
| Update FlowprintsCard | `components/flowprints/FlowprintsCard.tsx` | Add conditional render: Canvas vs Placeholder |
| Connect brainState storage | Same | Use `useWxtStorage(brainState)` from `stores/view.ts` for 3D colors only |
| ~~Map storage → UI state~~ | ~~Same~~ | **NOT NEEDED** - chip stays static (see MVP scope above) |
| ~~Sync chip + description~~ | ~~Same~~ | **NOT NEEDED** - waits for EEG data in Phase 8 |
| **FIX: Left-align chip** | Same | Remove `justify-center` wrapper from BrainStateChip |
| Test 3D transitions | Manual | Verify 3D blob color changes when user mode changes |

**Phase 4 Data Flow (Simplified)**:
- `useWxtStorage(brainState)` → passes to `FlowprintsCanvas` → 3D blob colors change
- `mockBrainState` (static) → passes to chip/description → UI stays static

**No mapping function needed.** The chip/description remain static until Phase 8 when real EEG data arrives.

#### BrainStateChip Alignment Fix (From Figma Verification)

**Current code** (FlowprintsCard.tsx line 40-42):
```tsx
{/* Brain State Chip */}
<div className="flex justify-center">
  <BrainStateChip hemisphere={brainState.activeHemisphere} />
</div>
```

**Fixed code** (matches Figma left-alignment):
```tsx
{/* Brain State Chip - LEFT-ALIGNED per Figma */}
<BrainStateChip hemisphere={brainState.activeHemisphere} />
```

Simply remove the centering wrapper div. The chip should start from the left edge of the card content area.

### Phase 4.8: Performance & Polish (~30 min)

| Task | Description |
|------|-------------|
| Bundle analysis | Run `bun run build` and check chunk sizes |
| Frame rate test | Verify 30-60fps on mid-range hardware |
| Memory profiling | Check GPU memory usage stays reasonable |
| Battery test | Test low-power mode reduces CPU/GPU usage |
| Cross-browser | Test Chrome, Edge, Firefox, Safari |

---

## Component Specifications

### ShaderGradientScene Props

```typescript
interface ShaderGradientSceneProps {
  brainState: BrainState;
  lowPowerMode?: boolean;
}
```

### ShaderGradient Configuration

The `@shadergradient/react` library exposes `<ShaderGradient>` with these key props:

```tsx
<ShaderGradient
  // === Shape ===
  type="sphere"              // 'sphere' | 'waterPlane' | 'plane'
  wireframe={false}          // Show wireframe mesh
  shader="defaults"          // Shader preset

  // === Animation ===
  animate="on"               // 'on' | 'off'
  uTime={0}                  // Initial time offset
  uSpeed={0.3}               // Animation speed (0-1)
  uStrength={0.3}            // Distortion strength (0-1)
  uDensity={0.8}             // Mesh density (0-2)
  uFrequency={5.5}           // Wave frequency (0-10)
  uAmplitude={3.2}           // Wave amplitude (0-10)

  // === Colors (hex strings) ===
  color1="#9b38ff"           // Primary color
  color2="#ff6ec7"           // Secondary color
  color3="#7b2cbf"           // Tertiary color

  // === Position & Rotation ===
  positionX={0}
  positionY={0}
  positionZ={0}
  rotationX={0}
  rotationY={130}
  rotationZ={70}

  // === Camera ===
  cAzimuthAngle={270}        // Horizontal camera angle
  cPolarAngle={180}          // Vertical camera angle
  cDistance={0.5}            // Camera distance
  cameraZoom={15}            // Zoom level

  // === Lighting & Effects ===
  lightType="env"            // 'env' | '3d'
  brightness={0.8}           // Light brightness (0-1)
  envPreset="city"           // Environment map preset
  grain="on"                 // Film grain effect
  reflection={0.4}           // Surface reflection (0-1)

  // === Advanced ===
  toggleAxis={false}         // Debug: show axes
  zoomOut={false}            // Pull camera back
  hoverState=""              // Hover interaction state
  enableTransition={false}   // Built-in transitions (we use react-spring instead)
/>
```

### ShaderGradientCanvas Configuration (Built-in Features)

**IMPORTANT**: The library's canvas has built-in lazy loading and performance features:

```tsx
<ShaderGradientCanvas
  // === Sizing ===
  style={{ width: '100%', height: '100%' }}
  pixelDensity={1}           // Device pixel ratio (0.5 for low-power)
  fov={45}                   // Camera field of view

  // === Built-in Lazy Loading (USE THIS instead of custom React.lazy) ===
  lazyLoad={true}            // Intersection Observer-based lazy loading
  threshold={0.1}            // Visibility threshold (0-1)
  rootMargin="200px"         // Pre-load buffer distance

  // === WebGL Options ===
  preserveDrawingBuffer={false}  // Set true for Safari screenshot support
  powerPreference="default"      // 'default' | 'high-performance' | 'low-power'

  // === Pointer Events ===
  pointerEvents="none"       // Disable pointer events (pass-through clicks)

  // === Callbacks ===
  onCreated={({ gl }) => {}} // Access WebGL context after creation
/>
```

**Implication for Phase 4**: We can simplify lazy loading by using `lazyLoad={true}` on ShaderGradientCanvas instead of wrapping with `React.lazy()`. This is more efficient because:
1. Library handles Intersection Observer internally
2. No separate Suspense boundary needed
3. Automatic threshold-based loading

### FlowprintsCanvas Wrapper

```tsx
// components/flowprints/FlowprintsCanvas.tsx
import { ShaderGradientCanvas } from '@shadergradient/react';
import type { BrainState } from '@/stores/view';

interface FlowprintsCanvasProps {
  /** Brain state for 3D color mapping */
  brainState: BrainState;
  /** Reduce animation speed and pixel density */
  lowPowerMode?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function FlowprintsCanvas({ brainState, lowPowerMode, className }: FlowprintsCanvasProps) {
  const isVisible = usePageVisibility();

  // Early return if WebGL not supported
  if (!isWebGLSupported()) {
    return <FlowprintsPlaceholder />;
  }

  return (
    <ErrorBoundary fallback={<FlowprintsPlaceholder />}>
      {/* Container matches Figma: 360×300px, black bg, #333 border, 8px radius */}
      <div className={cn(
        "w-[360px] h-[300px] rounded-lg overflow-hidden",
        "bg-black border border-[#333]",
        "mx-auto", // Center in card (parent handles alignment)
        className
      )}>
        <ShaderGradientCanvas
          style={{ width: '100%', height: '100%' }}
          pixelDensity={lowPowerMode ? 0.5 : 1}
          fov={45}
          pointerEvents="none"
          // Built-in lazy loading - NO need for React.lazy()
          lazyLoad={true}
          threshold={0.1}
          rootMargin="100px"
          // Safari support
          preserveDrawingBuffer={false}
          powerPreference={lowPowerMode ? 'low-power' : 'default'}
        >
          <ShaderGradientScene
            brainState={brainState}
            lowPowerMode={lowPowerMode}
            isVisible={isVisible}
          />
        </ShaderGradientCanvas>
      </div>
    </ErrorBoundary>
  );
}
```

---

## Color Configuration Per Brain State

> **Figma Reference**: The design shows a Focus mode blob with purple/orange/blue gradient. The pointillistic sphere aesthetic suggests high `uDensity` and moderate `uFrequency`.

### Creative Mode (Purple/Magenta)
High creativity, right-brain engaged, artistic thinking.

```typescript
const CREATIVE_COLORS = {
  // Colors: Vibrant purple to magenta spectrum
  color1: '#9b38ff',  // Vibrant purple (design token)
  color2: '#ff6ec7',  // Hot pink accent
  color3: '#7b2cbf',  // Deep violet

  // Animation: Dynamic, energetic movement
  uSpeed: 0.4,        // Faster, more dynamic
  uStrength: 0.4,     // Higher distortion
  uDensity: 1.2,      // Dense mesh for rich detail
  uFrequency: 6.0,    // More wave variation
  uAmplitude: 3.5,    // Larger waves

  // Camera: Slightly dynamic angle
  rotationY: 140,
  rotationZ: 75,
};
```

### Focus Mode (Blue) — **DEFAULT STATE**
Deep concentration, left-brain engaged, analytical thinking.

> **NOTE**: This is the DEFAULT state and matches the Figma reference image most closely.

```typescript
const FOCUS_COLORS = {
  // Colors: Purple/Orange/Blue tri-gradient (matches Figma screenshot)
  color1: '#9b38ff',  // Purple (top-left in Figma)
  color2: '#ff6b35',  // Orange (center-right in Figma)
  color3: '#86b4df',  // Light blue (bottom in Figma)

  // Animation: Calm, steady movement
  uSpeed: 0.25,       // Slower, calmer movement
  uStrength: 0.3,     // Moderate distortion
  uDensity: 1.4,      // High density for pointillistic look
  uFrequency: 5.0,    // Moderate wave frequency
  uAmplitude: 3.2,    // Standard amplitude

  // Camera: Centered, balanced view (matches Figma)
  rotationY: 130,
  rotationZ: 70,
};
```

### Recovery Mode (Green/Yellow)
Rest and recovery, balanced brain activity, regeneration.

```typescript
const RECOVERY_COLORS = {
  // Colors: Calming green to yellow spectrum
  color1: '#64d65e',  // Primary green (design token)
  color2: '#a8e063',  // Light lime
  color3: '#d4fc79',  // Yellow-green glow

  // Animation: Slowest, most relaxing
  uSpeed: 0.15,       // Slowest, most relaxed
  uStrength: 0.2,     // Minimal distortion
  uDensity: 1.0,      // Standard density
  uFrequency: 3.5,    // Very gentle waves
  uAmplitude: 2.5,    // Smaller waves

  // Camera: Stable, grounded view
  rotationY: 120,
  rotationZ: 65,
};
```

### Complete 3D Config Type Definition

```typescript
// types/brain-state-3d.ts
import type { BrainState } from '@/stores/view';

export interface BrainState3DConfig {
  // Gradient colors
  color1: string;
  color2: string;
  color3: string;

  // Animation parameters
  uSpeed: number;
  uStrength: number;
  uDensity: number;
  uFrequency: number;
  uAmplitude: number;

  // Camera/rotation
  rotationY: number;
  rotationZ: number;
}

export const BRAIN_STATE_3D_CONFIGS: Record<BrainState, BrainState3DConfig> = {
  creative: CREATIVE_COLORS,
  focus: FOCUS_COLORS,
  recovery: RECOVERY_COLORS,
};
```

### Color Transition with React Spring

```typescript
// lib/hooks/useBrainStateColors.ts
import { useSpring } from '@react-spring/three';
import { Color } from 'three';

export function useBrainStateColors(brainState: BrainState) {
  const config = BRAIN_STATE_CONFIGS[brainState];

  const springs = useSpring({
    color1: config.color1,
    color2: config.color2,
    color3: config.color3,
    uSpeed: config.uSpeed,
    uStrength: config.uStrength,
    uFrequency: config.uFrequency,
    config: {
      mass: 1,
      tension: 80,
      friction: 20,
      duration: 1500, // 1.5s transition
    },
  });

  return springs;
}
```

---

## Loading Sequence Timeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│  User opens New Tab                                                      │
├─────────────────────────────────────────────────────────────────────────┤
│  +0ms     → Minimal View renders (Phase 2)                               │
│  +50ms    → Minimal View interactive                                     │
│  +100ms   → requestIdleCallback fires                                    │
│  +150ms   → Dashboard chunk preload starts (background)                  │
│  +300ms   → Dashboard + 3D chunk fully loaded (in memory)                │
│                                                                          │
│  [User stays on Minimal View - everything preloaded]                     │
│                                                                          │
├─────────────────────────────────────────────────────────────────────────┤
│  User clicks "Go to Dashboard"                                           │
├─────────────────────────────────────────────────────────────────────────┤
│  +0ms     → View state changes, Dashboard mounts                         │
│  +16ms    → Dashboard skeleton visible (FlowprintsPlaceholder shows)     │
│  +50ms    → Static UI components render                                  │
│  +100ms   → FlowprintsCanvas Suspense resolves                           │
│  +150ms   → ShaderGradientCanvas mounts                                  │
│  +200ms   → WebGL context created                                        │
│  +250ms   → Shader compilation                                           │
│  +300ms   → First 3D frame renders ✓                                     │
│  +350ms   → Animation loop stable at 60fps                               │
│                                                                          │
│  Total perceived transition: ~300ms (feels instant)                      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Performance Optimizations

### 1. Adaptive Pixel Density

```tsx
<ShaderGradientCanvas
  pixelDensity={lowPowerMode ? 0.5 : 1}  // Half resolution in low-power
  // Or use device pixel ratio detection:
  // pixelDensity={Math.min(window.devicePixelRatio, 2)}
/>
```

### 2. Frame Rate Limiting

```typescript
// In ShaderGradientScene
const targetFPS = lowPowerMode ? 30 : 60;
const frameInterval = 1000 / targetFPS;

useFrame((state, delta) => {
  // Skip frames if needed for low-power mode
  if (lowPowerMode && delta < frameInterval / 1000) {
    return;
  }
  // ... animation logic
});
```

### 3. Visibility Detection (Pause When Hidden)

```typescript
// In FlowprintsCanvas
import { useEffect, useState } from 'react';

function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    const handler = () => setIsVisible(!document.hidden);
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  return isVisible;
}

// Usage
const isVisible = usePageVisibility();
<ShaderGradient animate={isVisible ? 'on' : 'off'} />
```

### 4. Lazy Loading with Preload

```typescript
// entrypoints/newtab/App.tsx
const FlowprintsCanvas = React.lazy(() =>
  import('../components/flowprints/FlowprintsCanvas')
);

// Preload on idle (after Minimal View renders)
useEffect(() => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      import('../components/flowprints/FlowprintsCanvas');
    });
  }
}, []);
```

### 5. Memory Management

- Canvas size fixed at 360×300px (not full-screen)
- Single WebGL context (no multiple canvases)
- No post-processing effects (grain is shader-based)
- Dispose resources on unmount

---

## Error Handling Strategy

### WebGL Detection

```typescript
// lib/utils/webgl-detect.ts
export function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    return !!gl;
  } catch {
    return false;
  }
}

export function getWebGLInfo(): { version: number; renderer: string } | null {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return null;

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    return {
      version: gl instanceof WebGL2RenderingContext ? 2 : 1,
      renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown',
    };
  } catch {
    return null;
  }
}
```

### Graceful Fallback

```tsx
// components/flowprints/FlowprintsCanvas.tsx
import { ErrorBoundary } from 'react-error-boundary';
import { isWebGLSupported } from '@/lib/utils/webgl-detect';
import { FlowprintsPlaceholder } from './FlowprintsPlaceholder';

export function FlowprintsCanvas({ brainState, ...props }) {
  // Early return if WebGL not supported
  if (!isWebGLSupported()) {
    return <FlowprintsPlaceholder brainState={brainState} />;
  }

  return (
    <ErrorBoundary
      fallback={<FlowprintsPlaceholder brainState={brainState} />}
      onError={(error) => {
        console.error('WebGL Error:', error);
        // Optionally report to analytics
      }}
    >
      <ShaderGradientCanvas {...props}>
        <ShaderGradientScene brainState={brainState} />
      </ShaderGradientCanvas>
    </ErrorBoundary>
  );
}
```

### Context Lost Recovery

```tsx
<ShaderGradientCanvas
  onCreated={({ gl }) => {
    gl.domElement.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      console.warn('WebGL context lost, attempting recovery...');
    });

    gl.domElement.addEventListener('webglcontextrestored', () => {
      console.log('WebGL context restored');
      // Re-initialize scene if needed
    });
  }}
/>
```

---

## Integration Points

### With WXT Storage (stores/view.ts)

```typescript
// Already exists from Phase 2
import { storage } from 'wxt/storage';

export const brainState = storage.defineItem<BrainState>('local:brainState', {
  defaultValue: 'focus',
});

// In FlowprintsCard.tsx
import { useWxtStorage } from '@/lib/hooks/useWxtStorage';
import { brainState } from '@/stores/view';

function FlowprintsCard() {
  const [state] = useWxtStorage(brainState);

  return (
    <Card>
      <FlowprintsHeader />
      <Suspense fallback={<FlowprintsPlaceholder brainState={state} />}>
        <FlowprintsCanvas brainState={state} />
      </Suspense>
      <BrainStateChip state={state} />
      <StateDescription state={state} />
      <TipSection state={state} />
    </Card>
  );
}
```

### With Phase 5 (CSS Transitions)

Phase 5 will add CSS transitions to:
- `BrainStateChip` - Smooth text/color change
- `StateDescription` - Fade between descriptions
- `TipSection` - Context-aware tips per state

The 3D visualization will already be smoothly transitioning via `@react-spring/three`.

### With Phase 7 (Seed Dataset)

Phase 7 will provide:
- Simulated EEG data driving state changes
- More frequent state transitions for testing
- Edge cases (rapid switching, long sessions)

### With Phase 8 (Bluetooth)

Phase 8 will provide:
- Real EEG data from headset
- `brainState` updates based on actual neural activity
- Connection status affecting visualization (disconnected = paused?)

---

## Testing Checklist

### Functional Tests
- [ ] Canvas renders on first dashboard visit
- [ ] Colors match brain state (Creative=purple, Focus=blue, Recovery=green)
- [ ] State transitions animate smoothly (no jarring color jumps)
- [ ] Fallback shows when WebGL unavailable
- [ ] Canvas pauses when tab hidden
- [ ] Low-power mode reduces animation speed

### Performance Tests
- [ ] Bundle size < 200KB gzipped (total 3D chunk)
- [ ] First 3D frame < 400ms after dashboard click
- [ ] Stable 60fps on mid-range laptop (MacBook Air M1)
- [ ] Stable 30fps on low-end devices with low-power mode
- [ ] No memory leaks after repeated view switches
- [ ] GPU memory < 50MB

### Cross-Browser Tests
- [ ] Chrome 120+ ✓
- [ ] Edge 120+ ✓
- [ ] Firefox 120+ ✓
- [ ] Safari 17+ ✓ (may need `preserveDrawingBuffer: true`)

### Edge Cases
- [ ] Rapid state switching (spam clicks)
- [ ] WebGL context lost/restored
- [ ] Window resize during animation
- [ ] Browser zoom levels (100%, 125%, 150%)
- [ ] Multiple new tabs opened simultaneously

---

## Dependencies on Other Phases

| Phase | What We Need | What We Provide |
|-------|--------------|-----------------|
| Phase 2 | WXT Storage hook, viewMode state | - |
| Phase 3 | FlowprintsCard, FlowprintsPlaceholder, Card component | - |
| Phase 4 | - | 3D canvas, color hook, WebGL utils |
| Phase 5 | - | Smooth 3D transitions (CSS for rest) |
| Phase 7 | - | Accepts brainState prop (data source agnostic) |
| Phase 8 | - | Accepts brainState prop (data source agnostic) |

---

## Future Enhancements (Out of Scope)

These are NOT part of Phase 4 but could be added later:

1. **Interactive blob** - Respond to mouse/touch (using R3F's `onPointerMove`)
2. **Audio reactivity** - Pulse with ambient sound or music
3. **Particle effects** - Add floating particles around blob
4. **Multiple blobs** - Show left/right brain as separate visualizations
5. **Screenshot export** - Capture current visualization as image
6. **Custom themes** - User-selectable color palettes

---

## Notes

- **React 19 Confirmed**: R3F v9.x officially supports React 19
- **No SSR**: `@shadergradient/react` only works in browser (which is fine for extension)
- **Safari Quirks**: May need `preserveDrawingBuffer: true` for canvas screenshots
- **Mobile/Touch**: Not a concern for Chrome extension (desktop only)
- **Bundle Size**: Actual size may be smaller than estimate due to tree-shaking

---

## Key Integration Points (Post Phase 3)

### Existing Files to Modify

| File | Changes Needed |
|------|----------------|
| `components/flowprints/FlowprintsCard.tsx` | Add `useWxtStorage(brainState)`, conditional render Canvas vs Placeholder |
| `components/flowprints/index.ts` | Add lazy export for `FlowprintsCanvas` |
| `entrypoints/newtab/App.tsx` | Optional: add nested 3D preload (Dashboard preload exists) |

### Existing Files to Reference (No Changes)

| File | What It Provides |
|------|------------------|
| `stores/view.ts` | `brainState` storage, `BrainState` type, `BRAIN_STATE_CONFIG` |
| `lib/hooks/useWxtStorage.ts` | Storage hook pattern to copy |
| `components/flowprints/FlowprintsPlaceholder.tsx` | Fallback component (keep as-is) |
| `types/flow.ts` | `BrainState` interface for UI (activeHemisphere, description, tip) |

### Type Mapping Required

The FlowprintsCard receives `BrainState` interface but storage provides string:

```typescript
// Storage (stores/view.ts)
type StorageBrainState = 'creative' | 'focus' | 'recovery';

// UI Interface (types/flow.ts)
interface BrainState {
  activeHemisphere: 'left' | 'right' | 'balanced';
  description: string[];
  tip: string;
}

// MAPPING NEEDED (create in lib/utils/brain-state-mapping.ts)
function storageToBrainState(state: StorageBrainState): BrainState {
  const mapping = {
    creative: {
      activeHemisphere: 'right',
      description: ['Creative mode description...'],
      tip: 'Creative tip...',
    },
    focus: {
      activeHemisphere: 'left',
      description: ['Focus mode description...'],
      tip: 'Focus tip...',
    },
    recovery: {
      activeHemisphere: 'balanced',
      description: ['Recovery mode description...'],
      tip: 'Recovery tip...',
    },
  };
  return mapping[state];
}
```

### Current Dashboard Data Flow

```
Dashboard.tsx
  └── uses mockBrainState from lib/mock/static-data.ts
      └── FlowprintsCard(brainState)
          └── FlowprintsPlaceholder (static CSS gradient)

After Phase 4:

Dashboard.tsx
  └── useWxtStorage(brainState) from stores/view.ts
      └── FlowprintsCard(storageToBrainState(state), storageState)
          ├── FlowprintsCanvas(storageState) → ShaderGradientScene (3D colors)
          └── BrainStateChip, StateDescription (UI from mapped state)
```

---

## Task Checklist Summary

### Phase 4.0: Dependencies
- [ ] Run `bun add three @react-three/fiber @react-spring/three @shadergradient/react`
- [ ] Run `bun add -D @types/three`
- [ ] Check for peer dependency warnings (may need React 19 overrides)
- [ ] Create minimal test import to verify R3F v9 + React 19 works
- [ ] Run `bun run build` to verify no bundler errors

### Phase 4.1: Type Definitions
- [ ] Create `types/brain-state.ts` with `BrainState3DConfig` interface
- [ ] Define `BRAIN_STATE_3D_CONFIGS` constant with color1/color2/color3/uSpeed/uStrength/uFrequency per state
- [ ] Keep separate from existing `BRAIN_STATE_CONFIG` in stores/view.ts (which is for UI, not 3D)

### Phase 4.2: Brain State Colors Hook
- [ ] Create `lib/hooks/useBrainStateColors.ts`
- [ ] Import `useSpring` from `@react-spring/three`
- [ ] Define color palettes matching `BRAIN_STATE_3D_CONFIGS`
- [ ] Implement spring animation with 1.5s transition duration
- [ ] Export hook for use in ShaderGradientScene

### Phase 4.3: WebGL Detection
- [ ] Create `lib/utils/webgl-detect.ts`
- [ ] Implement `isWebGLSupported()` function (check WebGL 1 + 2)
- [ ] Implement `getWebGLInfo()` for debugging (version, renderer)
- [ ] Handle try/catch for browsers that block canvas

### Phase 4.4: ShaderGradient Scene
- [ ] Create `components/flowprints/ShaderGradientScene.tsx`
- [ ] Configure ShaderGradient props: type="sphere", animate="on", shape settings
- [ ] Wire up animated colors from useBrainStateColors
- [ ] Implement lowPowerMode prop (reduce uSpeed, pixelDensity)

### Phase 4.5: Canvas Wrapper
- [ ] Create `components/flowprints/FlowprintsCanvas.tsx`
- [ ] Use `<ShaderGradientCanvas>` from @shadergradient/react (handles R3F setup)
- [ ] Set dimensions: 360×300px with overflow-hidden + rounded-lg
- [ ] Add ErrorBoundary with FlowprintsPlaceholder as fallback
- [ ] Implement `usePageVisibility()` hook for pause/resume
- [ ] Add early return for `!isWebGLSupported()` → show placeholder

### Phase 4.6: Lazy Loading — **SIMPLIFIED**
- [ ] ~~Update `components/flowprints/index.ts` with lazy export~~ **NOT NEEDED**
- [ ] ~~Configure Suspense fallback in FlowprintsCard~~ **NOT NEEDED**
- [ ] Configure `lazyLoad={true}` on ShaderGradientCanvas
- [ ] Configure `threshold={0.1}` and `rootMargin="100px"` for pre-loading

### Phase 4.7: Integration
- [ ] Update `FlowprintsCard.tsx` to use `useWxtStorage(brainState)` from stores/view.ts
- [ ] Create mapping: storage `BrainState` → mock data `BrainState` interface
- [ ] Replace `<FlowprintsPlaceholder>` with `<FlowprintsCanvas>` (no Suspense needed - library handles lazy loading)
- [ ] Pass storage brainState to FlowprintsCanvas for 3D color
- [ ] **FIX: Remove `justify-center` wrapper from BrainStateChip** (Figma shows left-aligned)
- [ ] Test all three state transitions (creative/focus/recovery)

### Phase 4.8: Testing & Polish
- [ ] Run `bun run build` and check final chunk sizes (target <200KB gzipped for 3D)
- [ ] Profile frame rate (target 60fps on M1 MacBook Air)
- [ ] Check GPU memory usage (<50MB)
- [ ] Test cross-browser: Chrome, Edge, Firefox, Safari
- [ ] Test WebGL fallback (disable WebGL in browser, verify placeholder shows)
- [ ] Test visibility detection (switch tabs, verify animation pauses)
- [ ] Document any Safari-specific workarounds (preserveDrawingBuffer, etc.)

---

## Potential Issues & Mitigations

### 1. React Spring + ShaderGradient Integration

**Risk**: `@react-spring/three` animates values, but ShaderGradient expects static props.

**Mitigation**: The ShaderGradient component accepts props directly - we'll use `useSpring` with `to` values and spread the animated values onto the component:

```tsx
// ✅ Correct approach
const { color1, color2, color3 } = useSpring({ color1: config.color1, ... });
// Use .get() to extract current values for non-animated component
<ShaderGradient color1={color1.get()} color2={color2.get()} color3={color3.get()} />

// OR use animated wrapper if ShaderGradient supports it
import { animated } from '@react-spring/three';
const AnimatedShaderGradient = animated(ShaderGradient);
```

**Alternative**: If spring integration proves difficult, use CSS transitions on a color overlay or simply accept instant transitions (the blob's inherent animation may mask the transition).

### 2. Bundle Size Exceeds Budget

**Risk**: Three.js + R3F + shadergradient exceeds 200KB gzipped.

**Mitigation**:
1. Verify tree-shaking is working (`three` should tree-shake to ~50KB)
2. Use dynamic imports for the entire FlowprintsCanvas
3. If still too large, consider `@paper-design/shaders-react` as lighter alternative
4. Accept larger bundle if UX justifies it (lazy-loaded anyway)

### 3. WebGL Context Limits in Chrome Extension

**Risk**: Chrome extensions may have different WebGL context limits.

**Mitigation**:
1. Only render one canvas (current design)
2. Add context lost/restored handlers
3. Test with multiple new tabs open simultaneously
4. Document any extension-specific limitations

### 4. Color Mismatch with Figma

**Risk**: ShaderGradient colors may render differently than Figma static image.

**Mitigation**:
1. Start with exact Figma colors, then tweak in browser
2. Use browser devtools to compare side-by-side
3. Accept that animated 3D will never be pixel-perfect match
4. Document final tuned values for each brain state

### 5. Performance on Low-End Hardware

**Risk**: 60fps not achievable on older machines.

**Mitigation**:
1. Implement `lowPowerMode` prop (reduced pixelDensity, slower uSpeed)
2. Use `powerPreference="low-power"` in WebGL context
3. Add user preference to disable 3D (show placeholder instead)
4. Consider detecting hardware and auto-enabling low-power mode

---

## Quick Reference: Key Files After Phase 4

| File | Purpose | New/Modified |
|------|---------|--------------|
| `types/brain-state-3d.ts` | BrainState3DConfig interface + BRAIN_STATE_3D_CONFIGS | **NEW** |
| `lib/utils/webgl-detect.ts` | isWebGLSupported(), getWebGLInfo() | **NEW** |
| `lib/hooks/useBrainStateColors.ts` | Spring animation hook for 3D colors | **NEW** |
| `lib/hooks/usePageVisibility.ts` | Hook for pause/resume on tab visibility | **NEW** |
| `lib/utils/brain-state-mapping.ts` | storageToBrainState() mapping function | **NEW** |
| `components/flowprints/FlowprintsCanvas.tsx` | Main 3D canvas wrapper | **NEW** |
| `components/flowprints/ShaderGradientScene.tsx` | ShaderGradient with animated props | **NEW** |
| `components/flowprints/FlowprintsCard.tsx` | Wire storage, remove chip centering | **MODIFIED** |
| `components/flowprints/index.ts` | Export FlowprintsCanvas | **MODIFIED** |

---

## Success Criteria

Phase 4 is complete when:

1. ✅ 3D gradient blob renders in Dashboard view
2. ✅ Colors transition smoothly between brain states (creative/focus/recovery)
3. ✅ Animation pauses when tab is hidden
4. ✅ Fallback placeholder shows when WebGL unavailable
5. ✅ BrainStateChip is left-aligned (matching Figma)
6. ✅ Bundle size < 200KB gzipped for 3D chunk
7. ✅ 60fps stable on M1 MacBook Air
8. ✅ Cross-browser: Chrome, Edge, Firefox, Safari
9. ✅ No console errors or warnings
