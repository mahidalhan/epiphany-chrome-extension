# Epiphany Chrome Extension

<runtime>
Use **Bun** instead of Node.js for all JavaScript/TypeScript execution.
</runtime>

<tech_stack>
| Layer | Technology | Notes |
|-------|------------|-------|
| Runtime | Bun | Package manager and runtime |
| Bundler | Vite (via WXT) | Code splitting for lazy loading |
| Extension Framework | WXT | `@wxt-dev/module-react` for React integration |
| UI Framework | React 18 + TypeScript | Required for R3F compatibility |
| 3D Framework | React Three Fiber | `@shadergradient/react` for gradient blobs |
| State Management | WXT Storage | `storage.defineItem()` for persisted state (viewMode, brainState). Add Zustand in Phase 7-8 for transient real-time data (EEG buffer, computed scores) - they coexist, not replace. |
| Styling | Tailwind CSS | Pure Tailwind, NO component libraries |
| Charts | uPlot | ~10kb, for timeline visualization |
| Storage | Dexie.js | IndexedDB wrapper for activity data |
</tech_stack>

<architecture_diagram>
```
entrypoints/
├── newtab/           # New Tab page (minimal + dashboard views)
├── background/       # Service worker (tracking, BLE, state sync)
└── popup/            # Optional quick actions

components/
├── flow-score/       # Circular gauge (0-100)
├── flowprints/       # 3D visualization (R3F + shadergradient)
├── device-card/      # Headphone status + battery
├── flow-summary/     # AI tooltip with reminders
├── timeline/         # uPlot session chart
└── flow-entries/     # State list items

stores/
├── flow.ts           # Flow state: score, mental state, entries
├── device.ts         # Device: connection, battery, mode
└── activity.ts       # Activity: tabs, distractions, timeline

lib/
├── bluetooth/        # WebBluetooth abstraction
├── eeg/              # Signal processing (256Hz)
├── mock/             # Seed data generators
└── classification/   # URL categorization (work/leisure/comms)
```
<architecture_diagram>

<performance_budget>
Critical path (Minimal View): <30kb gzipped, <50ms first paint
Dashboard shell: <50kb gzipped
Charts (uPlot): <15kb gzipped
3D Visualization (R3F + Three): <200kb gzipped, lazy-loaded

**Progressive Loading Strategy**:
1. Phase 1 (~50ms): Minimal View with inlined critical CSS
2. Phase 2 (background): Preload Dashboard via `React.lazy()` + `requestIdleCallback`
3. Phase 3 (on click): Dashboard skeleton → charts hydrate
4. Phase 4 (+400ms): 3D visualization initializes
</performance_budget>

<constraints>
- NO component libraries (shadcn, Radix) - use pure Tailwind
- NO Framer Motion - use CSS transitions only (saves ~15kb)
- NO Recharts - use uPlot (~10kb vs ~70kb)
- Use `will-change` and `transform` for GPU-accelerated animations
- R3F is REQUIRED - Vue/Preact/Solid cannot use React Three Fiber
</constraints>

<design_tokens>
Background: `#181818`, `#000`
Borders: `rgba(255,255,255,0.2)`
Text: `#fff`, `rgba(255,255,255,0.6)`, `#b8b8b8`
Golden gradient: `linear-gradient(rgba(255,240,218,1), rgba(148,100,30,1))`

Flow state colors:
- Creative: `#9b38ff` (purple)
- Deep Focus: `#86b4df` (blue)
- Recovery: `#64d65e` (green)

Fonts: Manrope (primary), Inter (charts), SF Pro (icons)
Cards: 12px border-radius, dark border, semi-transparent
</design_tokens>

<mcp_guidance>
Route to appropriate MCP tool based on context. Use `2025:12` for latest results.

| Context | Tool |
|---------|------|
| Library API questions | `mcp__exa__get_code_context_exa` |
| Current information | `mcp__exa__web_search_exa` |
| Code examples | `mcp__exa__get_code_context_exa` |
| Reading external URLs | `mcp__jina__read_url` |
</mcp_guidance>

<workflow>
Before execution, write plans to `docs/` folder.
As you execute the plans, update the task list in the same plan file.
Reference `docs/implementation+lazy-loading-plan.md` for phase details.
Reference `docs/architecture-research/final.md` for technology decisions.
</workflow>
