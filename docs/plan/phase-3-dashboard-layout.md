# Phase 3: Dashboard Layout & Static UI - Implementation Plan

> **Last Updated**: Based on final Figma design (node 140:187)
>
> **Change Log**:
> - Updated from draft design (9:388) to final design (140:187)
> - Added **Flow Summary Card** - third card in Column 1 with tooltip beak
> - Added green highlight box color `#3b653f`
> - Added distraction icons (X, Reddit, YouTube) at 12×12px
> - Expanded component structure with shared components
> - Updated time estimate from 5-6hrs to 7-8hrs
> - **Bundled fonts**: Use `@fontsource/manrope` + `@fontsource/inter` (no CDN)
> - **Bundled SVG icons**: Export from Figma, store in `assets/icons/` (no SF Pro - macOS only)

## Overview

Build the complete 3-column dashboard layout with all static UI components. The 3D visualization (Flowprints) will be a placeholder canvas that gets implemented in Phase 4.

**Key Discovery**: The final design has **3 cards in Column 1** (Flow Score, Device, Flow Summary), not 2 as in the draft.

---

## Current State (Phase 2 Complete)

- ✅ MinimalView with Logo, SearchBar, DashboardButton
- ✅ Lazy loading infrastructure (`React.lazy()` + `requestIdleCallback`)
- ✅ WXT Storage for `viewMode` and `brainState`
- ✅ Design tokens in `assets/main.css`
- ✅ `Dashboard.tsx` placeholder exists (just has "Back to Search" button)

---

## Task Breakdown

### 0. Fonts & Icons Setup (~20 min)

| Task | Description |
|------|-------------|
| Install fonts | `bun add @fontsource/manrope @fontsource/inter` |
| Import fonts | Add imports to `entrypoints/newtab/main.tsx` |
| Configure SVG imports | Ensure `vite-plugin-svgr` or WXT's built-in SVG handling works |
| Export UI icons | Export 5 UI icons from Figma to `assets/icons/ui/` |

**Font imports**:
```tsx
// entrypoints/newtab/main.tsx
import '@fontsource/manrope/400.css';  // Regular
import '@fontsource/manrope/500.css';  // Medium
import '@fontsource/manrope/600.css';  // SemiBold
import '@fontsource/manrope/700.css';  // Bold
import '@fontsource/inter/500.css';    // Medium (charts)
```

### 1. Layout Foundation (~30 min)

| Task | File | Description |
|------|------|-------------|
| DashboardLayout | `components/layout/DashboardLayout.tsx` | 3-column responsive grid container |
| Card | `components/card/Card.tsx` | Reusable card wrapper with design tokens |
| Update Dashboard | `entrypoints/newtab/views/Dashboard.tsx` | Integrate new layout structure |

### 2. Column 1 - Left Panel (~2.5 hrs)

| Component | File | Description |
|-----------|------|-------------|
| FlowScoreCard | `components/flow-score/FlowScoreCard.tsx` | Card containing gauge + share section |
| FlowScoreGauge | `components/flow-score/FlowScoreGauge.tsx` | Circular gauge (0-100) with SVG concentric rings |
| ShareBar | `components/flow-score/ShareBar.tsx` | Overlapping social icons (LinkedIn, X, Instagram, Reddit, Threads) |
| ShareCTA | `components/flow-score/ShareCTA.tsx` | Blue "Share your score" button + subtext |
| DeviceCard | `components/device-card/DeviceCard.tsx` | Headphone info + image with gradient fade |
| FlowSummaryCard | `components/flow-summary/FlowSummaryCard.tsx` | Tooltip-style card with beak |
| FlowSummaryHighlight | `components/flow-summary/FlowSummaryHighlight.tsx` | Green box with flow state message |
| FlowSummaryReminder | `components/flow-summary/FlowSummaryReminder.tsx` | Pending reminder with bold highlights |
| DistractionRow | `components/flow-summary/DistractionRow.tsx` | Distraction time + app icons |
| OverlappingIcons | `components/shared/OverlappingIcons.tsx` | Reusable overlapping circle icons |

### 3. Column 2 - Center Panel / Flowprints (~1 hr)

| Component | File | Description |
|-----------|------|-------------|
| FlowprintsHeader | `components/flowprints/FlowprintsHeader.tsx` | Title + subtitle + lightbulb icon |
| FlowprintsPlaceholder | `components/flowprints/FlowprintsPlaceholder.tsx` | 360×300 gradient placeholder (R3F comes in Phase 4) |
| BrainStateChip | `components/flowprints/BrainStateChip.tsx` | "Left/Right Brain Engaged" pill |
| StateDescription | `components/flowprints/StateDescription.tsx` | Brain state explanation text |
| TipSection | `components/flowprints/TipSection.tsx` | Contextual advice with divider |

### 4. Column 3 - Right Panel / Flow Session (~2 hrs)

| Component | File | Description |
|-----------|------|-------------|
| ModeBannerCard | `components/session/ModeBannerCard.tsx` | Card with golden mode pill + status text |
| GoldenPill | `components/shared/GoldenPill.tsx` | Reusable golden gradient pill (used in Mode + Brain State) |
| FlowSessionCard | `components/session/FlowSessionCard.tsx` | Card containing header, chart, entries |
| SessionHeader | `components/session/SessionHeader.tsx` | "Today's Flow Session" + time + duration |
| TimelinePlaceholder | `components/timeline/TimelinePlaceholder.tsx` | Static chart image placeholder (uPlot in Phase 5) |
| FlowEntriesList | `components/flow-entries/FlowEntriesList.tsx` | Container for flow entry items |
| FlowEntryItem | `components/flow-entries/FlowEntryItem.tsx` | Single entry: icon, text, time, progress bar |
| ProgressBar | `components/shared/ProgressBar.tsx` | Reusable progress bar with configurable color |

### 5. Type Definitions (~20 min)

| File | Types |
|------|-------|
| `types/flow.ts` | `FlowState`, `FlowEntry`, `FlowScoreData` |
| `types/device.ts` | `DeviceState`, `ConnectionStatus`, `BatteryInfo` |
| `types/session.ts` | `SessionData`, `TimelinePoint`, `FlowMode` |

### 6. Static Mock Data (~15 min)

| File | Purpose |
|------|---------|
| `lib/mock/static-data.ts` | Hardcoded values for all UI components (NOT the Phase 7 seed dataset - just static props for visual development) |

### 7. Back Navigation (~10 min)

- Add "Back to Search" or home icon to dashboard header
- Wire up to `viewMode.setValue('minimal')`

---

## File Structure After Phase 3

```
components/
├── card/
│   └── Card.tsx                    # Reusable card wrapper (standard + tooltip variants)
├── layout/
│   └── DashboardLayout.tsx         # 3-column flex grid
├── shared/
│   ├── OverlappingIcons.tsx        # Reusable overlapping circle icons
│   ├── GoldenPill.tsx              # Golden gradient pill (Mode + Brain State)
│   ├── ProgressBar.tsx             # Configurable color progress bar
│   └── Divider.tsx                 # Horizontal divider line
├── flow-score/
│   ├── FlowScoreCard.tsx           # Card container
│   ├── FlowScoreGauge.tsx          # SVG circular gauge with rings
│   ├── ShareBar.tsx                # Overlapping social icons
│   └── ShareCTA.tsx                # Blue share button + subtext
├── device-card/
│   └── DeviceCard.tsx              # Headphone info + faded image
├── flow-summary/
│   ├── FlowSummaryCard.tsx         # Tooltip card with beak
│   ├── FlowSummaryHighlight.tsx    # Green highlight box
│   ├── FlowSummaryReminder.tsx     # Reminder with bold highlights
│   └── DistractionRow.tsx          # Distraction time + app icons
├── flowprints/
│   ├── FlowprintsCard.tsx          # Center column card container
│   ├── FlowprintsHeader.tsx        # Title + subtitle + lightbulb
│   ├── FlowprintsPlaceholder.tsx   # 360×300 canvas placeholder
│   ├── BrainStateChip.tsx          # "Left/Right Brain Engaged"
│   ├── StateDescription.tsx        # 3-paragraph explanation
│   └── TipSection.tsx              # Divider + tip text
├── session/
│   ├── ModeBannerCard.tsx          # Mode pill + status messages
│   ├── FlowSessionCard.tsx         # Session card container
│   └── SessionHeader.tsx           # Title + time + duration
├── timeline/
│   └── TimelinePlaceholder.tsx     # Static chart image
└── flow-entries/
    ├── FlowEntriesList.tsx         # Container with gap
    └── FlowEntryItem.tsx           # Icon + text + time + progress

entrypoints/newtab/views/
└── Dashboard.tsx                   # 3-column layout integration

lib/mock/
└── static-data.ts                  # All static display values

types/
├── flow.ts                         # FlowState, FlowEntry, FlowScore
├── device.ts                       # DeviceState, ConnectionStatus
├── session.ts                      # SessionData, TimelinePoint
└── summary.ts                      # FlowSummary, Reminder, Distraction

assets/icons/
├── social/                         # LinkedIn, X, Instagram, Reddit, Threads (14×14px SVGs)
├── flow-states/                    # Creative, Focus, Recovery icons (14.4×14.4px SVGs)
├── distractions/                   # X, Reddit, YouTube (12×12px SVGs)
├── ui/                             # Headphones, Battery, Share, Bolt, Info (SVGs)
└── misc/                           # Lightbulb (43×52px), headphones image (120×123px PNG)
```

---

## Figma Design Specifications

> Source: [Figma Design - FINAL](https://www.figma.com/design/hCpeskt8LU7iZBF1Lq8Ky6/Browser-CoPilot?node-id=140-187&m=dev)

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│  gap: 24px between columns                                               │
├──────────────────┬──────────────────────┬──────────────────────────────┤
│  COLUMN 1        │  COLUMN 2            │  COLUMN 3                    │
│  (flex: 1)       │  (flex: 1)           │  (flex: 1)                   │
│  gap: 24px       │  single card h:648px │  gap: 24px                   │
│                  │                      │                              │
│  ┌────────────┐  │  ┌────────────────┐  │  ┌────────────────────────┐ │
│  │ Flow Score │  │  │   Flowprints   │  │  │     Mode Banner        │ │
│  │   Card     │  │  │     Card       │  │  │        Card            │ │
│  │            │  │  │                │  │  └────────────────────────┘ │
│  │  85pts     │  │  │  Header        │  │                              │
│  │  + Share   │  │  │  3D Canvas     │  │  ┌────────────────────────┐ │
│  └────────────┘  │  │  Brain State   │  │  │   Flow Session Card    │ │
│                  │  │  Description   │  │  │                        │ │
│  ┌────────────┐  │  │  Tip           │  │  │  Session Header        │ │
│  │  Device    │  │  │                │  │  │  Timeline Chart        │ │
│  │   Card     │  │  └────────────────┘  │  │  Flow Entries          │ │
│  └────────────┘  │                      │  │                        │ │
│                  │                      │  └────────────────────────┘ │
│  ┌────────────┐  │                      │                              │
│  │   Flow     │  │                      │                              │
│  │  Summary   │  │                      │                              │
│  │   Card     │  │                      │                              │
│  │  (tooltip) │  │                      │                              │
│  └──────▽─────┘  │                      │                              │
│     ↑ beak      │                      │                              │
└──────────────────┴──────────────────────┴──────────────────────────────┘
```

### Color Palette (from Figma)

| Token | Value | Usage |
|-------|-------|-------|
| `--card-bg` | `#181818` | Card backgrounds |
| `--card-border` | `rgba(255,255,255,0.2)` | Card borders |
| `--canvas-bg` | `#000` | Flowprints canvas background |
| `--canvas-border` | `#333` | Flowprints canvas border |
| `--score-blue` | `#2E93FF` | Flow score number (85pts) |
| `--score-blue-muted` | `rgba(46,147,255,0.6)` | "pts" suffix |
| `--share-button` | `#0059FF` | "Share your score" button |
| `--connected-green` | `#16dd62` | Device connected status |
| `--battery-gray` | `#767676` | Battery percentage text |
| `--text-primary` | `#fff` | Primary text |
| `--text-secondary` | `rgba(255,255,255,0.6)` | Secondary/muted text |
| `--text-muted` | `#b8b8b8` | Chart labels, entry titles |
| `--text-tip` | `rgba(255,255,255,0.8)` | Tip content text |
| `--text-time` | `rgba(255,255,255,0.54)` | Flow entry timestamps |
| `--divider` | `rgba(255,255,255,0.2)` | Horizontal dividers |
| `--flow-summary-highlight` | `#3b653f` | Green highlight box in Flow Summary |
| `--progress-track` | `rgba(120,120,120,0.2)` | Progress bar track background |

### Flow State Colors

| State | Color | Icon BG |
|-------|-------|---------|
| Creative | `#9b38ff` | Purple gradient bg |
| Focus | `#86b4df` | Solid blue bg |
| Recovery | `#64d65e` | Solid green bg |

### Golden Gradient (Complex Multi-Stop)

Used for "Brain State Chip" and "Mode ON" badge:

```css
background-image: linear-gradient(
  0deg,
  rgba(173, 119, 40, 1) 15%,
  rgba(255, 242, 219, 1) 82.812%,
  rgba(250, 242, 227, 1) 90%,
  rgba(251, 245, 209, 1) 97.917%,
  rgba(189, 154, 75, 1) 99.99%,
  rgba(236, 216, 163, 1) 100%
);
```

### Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Flow Score number | Manrope | SemiBold | 28.5px |
| Flow Score "pts" | Manrope | SemiBold | 11.88px |
| Section titles | Manrope | SemiBold | 20px |
| Card titles | Manrope | SemiBold | 16px |
| Entry titles | Manrope | SemiBold | 14px |
| Body text | Manrope | Regular | 12px |
| Tip label | Manrope | SemiBold | 12px |
| Tip content | Manrope | Light | 12px |
| Button text | Manrope | Bold | 14px |
| Chart labels | Inter | Medium | 7.3px |
| SF icons | SF Pro | Regular/Medium | varies |

### Component Specifications

#### Card Wrapper
```
background: #181818
border: 1px solid rgba(255,255,255,0.2)
border-radius: 12px
padding: 20px
```

#### Flow Score Card (Left Column)
- **Circular Gauge**: 120×120px container
  - Concentric rings: outer `#d03131` (red), inner `#6da6da` (blue)
  - Score display: "85" in `#2E93FF`, "pts" in `rgba(46,147,255,0.6)`
- **Social Icons**: Overlapping circles (-8px margin), 14×14px icons
  - Each: `bg-[#181818]`, `border-[0.5px] border-white/20`, `rounded-full`, `p-[6px]`
- **Share Button**: `bg-[#0059FF]`, `rounded-[36px]`, `px-[20px] py-[8px]`
- **Subtext**: 12px, `rgba(255,255,255,0.6)`, centered, max-width 153px

#### Device Card (Left Column)
- **Container**: Same card styling, `gap-[32px]` between content and image
- **Headphone Icon**: SF Symbol `􀺭` (19px, white)
- **Label**: "Epiphany Headphones" (Manrope Regular 12px, white)
- **Status Row**: `gap-[4px]`
  - Green dot: 6×6px circle (`#16dd62`)
  - "Connected" text: Manrope Regular 14px, `#16dd62`
- **Battery Row**: `gap-[4px]`, color `#767676`
  - SF Symbol `􀺸` (16px)
  - "87% battery": Manrope Light 12px
- **Headphone Image**: 120×123px container
  - Image positioned with overflow
  - Gradient overlay: `bg-gradient-to-l from-[rgba(24,24,24,0)] to-[#181818]`

#### Flow Summary Card (Left Column) - TOOLTIP STYLE
- **Container**: `bg-[#181818]`, `border border-white/20`, `rounded-[8px]`, `p-[12px]`, `gap-[8px]`
- **Tooltip Beak**: Triangular pointer at bottom-left
  - Size: 8×8px square rotated 45deg
  - Position: `bottom-[-6.31px]`, `left-[calc(50%-188.33px)]`
  - Fill: `#181818` with white stroke
- **Title**: "Your Flow Summary" (Manrope SemiBold 20px, white)
- **Green Highlight Box**: `bg-[#3b653f]`, `rounded-[8px]`, `p-[8px]`
  - Text: Manrope Regular 12px, `rgba(255,255,255,0.6)`
  - Dynamic highlights in **SemiBold white**: `[any presentation]`
  - Example: "You are in flow state since 4 hours and 22 minutes today. Great spirit, You were able to work on the **[any presentation]** for 2 hours without getting distracted."
- **Reminder Section**: `px-0 py-[4px]`
  - Text: Manrope Regular 12px, `rgba(255,255,255,0.6)`
  - File name: **SemiBold white**
  - Time: **Bold white**
  - Example: "Your **[Some file Name]** is pending. You asked me to remind you at **[00:00 hrs]**"
- **Divider**: 1px line, full width
- **Distraction Row**: `justify-between`
  - Left: "Distracted for 2 hours" (Manrope SemiBold 14px, `rgba(255,255,255,0.6)`)
  - Right: Overlapping app icons (distraction sources)
    - Icon size: **12×12px** (smaller than share bar)
    - Overlap: `-8px` margin
    - Apps shown: X, Reddit, YouTube

#### Flowprints Card (Center Column, Height: 648px)
- **Header**: "Flowprints" (20px semibold) + "Live neural visualization" (12px, 60% white)
- **Lightbulb Icon**: 43×52px positioned top-right of header
- **Canvas**: 360×300px, `bg-black`, `border border-[#333]`, `rounded-[8px]`
- **Brain State Chip**: Golden gradient, `rounded-[1000px]`, `px-[12px] py-[6px]`
- **Description**: 3 paragraphs, 12px, `rgba(255,255,255,0.6)`, width 360px
- **Divider**: Full-width, 1px, `rgba(255,255,255,0.2)`
- **Tip**: "Tip:" semibold + light text at 80% white opacity

#### Mode Banner Card (Right Column)
- **Mode Pill**: Golden gradient, `rounded-[1000px]`, SF Symbol `􀆨` + "_____ Mode ON"
- **Status Lines**: 12px, `rgba(255,255,255,0.6)`
  - "All Browser notifications are muted"
  - "Certain websites are blocked." + info icon (underline dotted)

#### Flow Session Card (Right Column)
- **Container**: Standard card, `overflow-clip`
- **Internal Gap**: `gap-[20px]` between sections
- **Header Row**: `justify-between`
  - Left: "Today's Flow Session" (Manrope SemiBold 16px, white)
  - Right: `gap-[4px]`
    - "15:40" (Manrope Medium 12px, `rgba(255,255,255,0.6)`)
    - Dot separator: 8×8px circle
    - "8h 30m in flow" (Manrope Medium 12px, `rgba(255,255,255,0.6)`)
- **Timeline Chart Container**: 377×157px, `bg-black`, `border border-white/20`, `rounded-[12px]`, `p-[20px]`
  - X-axis labels: 9:00 to 16:00 (Inter Medium 7.3px, `#b8b8b8`, `tracking-[-0.219px]`)
  - Y-axis label: "Mental State" (rotated 270deg, Inter Medium 7.3px, `#b8b8b8`)
  - Chart area: Gradient fill area chart (placeholder image for Phase 3)
- **Flow Entries Container**: `gap-[10px]`

#### Flow Entry Item (×3 in Flow Session)
- **Entry Container**: `rounded-[12px]`, `overflow-clip`
- **Entry Header Row**: `justify-between`, `gap-[8px]`
  - **Icon**: `rounded-[48px]`, `p-[4.8px]`
    - Creative: Purple gradient `linear-gradient(90deg, #9b38ff 0%, #9b38ff 100%)`
    - Focus: Solid `#86b4df`
    - Recovery: Solid `#64d65e`
    - Inner icon: 14.4×14.4px (SVG)
  - **Text Column**: `gap-[4px]`
    - Title: Manrope SemiBold 14px, `#b8b8b8`
    - Description: Manrope Regular 12px, `rgba(255,255,255,0.6)`
  - **Time**: Manrope Medium 12px, `rgba(255,255,255,0.54)`
    - Active entry shows: "2:30 PM" + "~Now"
    - Past entries show: "1:30 PM" or "11:30 AM"
- **Progress Bar**: Height 44px container
  - Track: `h-[6px]`, `rounded-[3px]`, `bg-[rgba(120,120,120,0.2)]`, `left-[16px] right-[16px]`
  - Fill: Same color as icon bg, `rounded-[3px]`
  - Fill percentage: `right-[22.7%]` (example ~77% filled)
- **Divider**: 1px line between entries (not after last)

#### Flow Entry Data (Static Mock)
| Entry | Title | Description | Time | Color |
|-------|-------|-------------|------|-------|
| 1 | Creative Flow | High creativity Spike detected- breakthrough moment | 2:30 PM ~Now | `#9b38ff` |
| 2 | Deep Focus | Entered deep focus state for 2.5 hours | 1:30 PM | `#86b4df` |
| 3 | Active Recovery | You were recovering your energy after working hard. | 11:30 AM | `#64d65e` |

### Spacing

| Element | Value |
|---------|-------|
| Column gap | 24px |
| Column internal gap | 24px (between cards in same column) |
| Card padding (standard) | 20px |
| Card padding (Flow Summary) | 12px |
| Card border-radius (standard) | 12px |
| Card border-radius (Flow Summary) | 8px |
| Card internal gap | Varies: 8px, 12px, 20px, 24px |
| Flow Score Card gap | 32px (between gauge and share section) |
| Device Card gap | 32px (between info and image) |
| Flowprints Card gap | 24px (between sections) |
| Flow Session Card gap | 20px (between sections) |
| Flow Entries gap | 10px (between entry items) |
| Between icon + text | 4px |
| Between title + subtitle | 8px |
| Progress bar horizontal padding | 16px |
| Progress bar height | 6px |
| Progress bar container height | 44px |
| Social icon overlap | -8px margin-right |
| Distraction icon overlap | -8px margin-right |

### Assets Required

| Asset | Size | Source | Usage |
|-------|------|--------|-------|
| LinkedIn icon | 14×14px | Figma export | Share bar |
| X (Twitter) icon | 14×14px | Figma export | Share bar |
| Instagram icon | 15×14px | Figma export | Share bar |
| Reddit icon | 14×14px | Figma export | Share bar |
| Threads icon | 14×14px | Figma export | Share bar |
| Headphone image | 120×123px | Figma export | Device card |
| Lightbulb icon | 43×52px | Figma export | Flowprints header |
| Creative flow icon | 14.4×14.4px | Figma export (SVG) | Flow entry |
| Focus flow icon | 14.4×14.4px | Figma export (SVG) | Flow entry |
| Recovery flow icon | 14.4×14.4px | Figma export (SVG) | Flow entry |
| X icon (small) | 13×12px | Figma export | Distraction icons |
| Reddit icon (small) | 12×12px | Figma export | Distraction icons |
| YouTube icon | 17×12px | Figma export | Distraction icons |
| Timeline chart placeholder | 294×93px | Figma export | Session chart |
| Flow gauge rings | ~120×120px | SVG/Figma | Flow score |

### Bundled SVG Icons (Replaces SF Pro)

SF Pro symbols only render on macOS - Windows/Linux/ChromeOS show empty boxes. All icons are exported from Figma as SVG and bundled in `assets/icons/`.

| Icon | Size | File | Usage |
|------|------|------|-------|
| Headphones | 19×19px | `ui/headphones.svg` | Device card label |
| Battery | 16×16px | `ui/battery.svg` | Battery percentage |
| Upload/Share | 14×14px | `ui/share.svg` | Share button |
| Bolt/Mode | 14×14px | `ui/bolt.svg` | Mode ON badge |
| Info circle | 14×14px | `ui/info.svg` | Blocked websites link |

**Import pattern**:
```tsx
// Vite handles SVG imports as React components
import HeadphonesIcon from '@/assets/icons/ui/headphones.svg?react';

// Usage
<HeadphonesIcon className="w-[19px] h-[19px] text-white" />
```

**Note**: No animations yet - CSS transitions come in Phase 5.

---

## Performance Considerations

- All components are static (no state management needed yet)
- Dashboard is already lazy-loaded from Phase 2
- Target: Dashboard shell <50kb gzipped
- Placeholders for heavy components (3D canvas, charts) keep initial bundle small

---

## Estimated Time

**Total: 7.5-8.5 hours**

| Task | Time |
|------|------|
| **Fonts & Icons Setup** | 20 min |
| Layout Foundation + Shared Components | 45 min |
| Column 1 (Flow Score + Device + Summary) | 2.5 hrs |
| Column 2 (Flowprints) | 1 hr |
| Column 3 (Mode Banner + Session + Entries) | 2 hrs |
| Type Definitions | 30 min |
| Static Mock Data | 20 min |
| Asset Export from Figma (SVGs) | 30 min |
| Back Navigation | 10 min |

---

## Dependencies on Future Phases

| Phase | What Changes |
|-------|--------------|
| **Phase 4** | Replaces `FlowprintsPlaceholder` with R3F + @shadergradient/react |
| **Phase 5** | Replaces `TimelinePlaceholder` with uPlot chart, adds CSS animations |
| **Phase 7** | Replaces static mock data with dynamic seed dataset generators |

---

## Task Checklist

### Phase 3.0: Fonts & Icons Setup (Pre-requisite)
- [ ] Install `@fontsource/manrope` and `@fontsource/inter` via bun
- [ ] Add font CSS imports to `entrypoints/newtab/main.tsx`
- [ ] Update Tailwind config with `fontFamily: { manrope, inter }`
- [ ] Verify SVG import support in WXT/Vite config (`.svg?react` pattern)
- [ ] Export UI icons from Figma: headphones, battery, share, bolt, info
- [ ] Create `assets/icons/ui/` directory structure

### Phase 3.1: Layout Foundation + Shared Components
- [ ] Create `components/layout/DashboardLayout.tsx` - 3-column flex grid
- [ ] Create `components/card/Card.tsx` - Standard + tooltip variants
- [ ] Create `components/shared/OverlappingIcons.tsx` - Reusable overlapping circles
- [ ] Create `components/shared/GoldenPill.tsx` - Golden gradient pill
- [ ] Create `components/shared/ProgressBar.tsx` - Configurable color progress
- [ ] Create `components/shared/Divider.tsx` - Horizontal divider line
- [ ] Update `entrypoints/newtab/views/Dashboard.tsx` - Integrate layout

### Phase 3.2: Column 1 - Flow Score Card
- [ ] Create `components/flow-score/FlowScoreCard.tsx` - Card container
- [ ] Create `components/flow-score/FlowScoreGauge.tsx` - SVG circular gauge
- [ ] Create `components/flow-score/ShareBar.tsx` - Social icons row
- [ ] Create `components/flow-score/ShareCTA.tsx` - Blue share button

### Phase 3.3: Column 1 - Device Card
- [ ] Create `components/device-card/DeviceCard.tsx` - Full card with image

### Phase 3.4: Column 1 - Flow Summary Card (NEW)
- [ ] Create `components/flow-summary/FlowSummaryCard.tsx` - Tooltip with beak
- [ ] Create `components/flow-summary/FlowSummaryHighlight.tsx` - Green box
- [ ] Create `components/flow-summary/FlowSummaryReminder.tsx` - Reminder text
- [ ] Create `components/flow-summary/DistractionRow.tsx` - Distraction info

### Phase 3.5: Column 2 - Flowprints Card
- [ ] Create `components/flowprints/FlowprintsCard.tsx` - Card container (h:648px)
- [ ] Create `components/flowprints/FlowprintsHeader.tsx` - Title + lightbulb
- [ ] Create `components/flowprints/FlowprintsPlaceholder.tsx` - 360×300 canvas
- [ ] Create `components/flowprints/BrainStateChip.tsx` - Uses GoldenPill
- [ ] Create `components/flowprints/StateDescription.tsx` - 3 paragraphs
- [ ] Create `components/flowprints/TipSection.tsx` - Divider + tip

### Phase 3.6: Column 3 - Mode Banner Card
- [ ] Create `components/session/ModeBannerCard.tsx` - Pill + status text

### Phase 3.7: Column 3 - Flow Session Card
- [ ] Create `components/session/FlowSessionCard.tsx` - Card container
- [ ] Create `components/session/SessionHeader.tsx` - Title + time + duration
- [ ] Create `components/timeline/TimelinePlaceholder.tsx` - Static chart image
- [ ] Create `components/flow-entries/FlowEntriesList.tsx` - Entry container
- [ ] Create `components/flow-entries/FlowEntryItem.tsx` - Single entry row

### Phase 3.8: Types & Mock Data
- [ ] Create `types/flow.ts` - FlowState, FlowEntry, FlowScore
- [ ] Create `types/device.ts` - DeviceState, ConnectionStatus
- [ ] Create `types/session.ts` - SessionData, TimelinePoint
- [ ] Create `types/summary.ts` - FlowSummary, Reminder, Distraction
- [ ] Create `lib/mock/static-data.ts` - All hardcoded values

### Phase 3.9: Assets (All Bundled SVGs)
- [ ] Export social icons from Figma (14×14px SVG) → `assets/icons/social/`
- [ ] Export flow state icons from Figma (14.4×14.4px SVG) → `assets/icons/flow-states/`
- [ ] Export distraction icons from Figma (12×12px SVG) → `assets/icons/distractions/`
- [ ] Export headphone image from Figma (120×123px PNG) → `assets/icons/misc/`
- [ ] Export lightbulb icon from Figma (43×52px SVG) → `assets/icons/misc/`
- [ ] Export timeline chart placeholder from Figma → `assets/icons/misc/`
- [ ] Verify all SVGs use `currentColor` for fill (enables Tailwind text color classes)

### Phase 3.10: Navigation & Integration
- [ ] Add back navigation button to dashboard
- [ ] Wire up `viewMode.setValue('minimal')` for back nav
- [ ] Test view switching (minimal ↔ dashboard)
- [ ] Verify lazy loading still works
