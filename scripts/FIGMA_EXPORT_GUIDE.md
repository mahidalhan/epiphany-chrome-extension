# Figma SVG Export Guide

The Figma MCP doesn't directly export SVGs - it returns rasterized image URLs. For clean, scalable SVGs, use one of these methods:

## Method 1: Manual Export from Figma (Recommended for SVGs)

### Step-by-step:
1. Open the Figma file: https://www.figma.com/design/hCpeskt8LU7iZBF1Lq8Ky6/Browser-CoPilot?node-id=140-187
2. Select each node below
3. Right-click → **Copy/Paste as** → **Copy as SVG**
4. Paste into the corresponding file

### Nodes to Export

#### Social Icons (14×14px) → `assets/icons/social/`

| Icon | Node ID | Figma Link | Output File |
|------|---------|------------|-------------|
| LinkedIn | `140:202` | [Open](https://www.figma.com/design/hCpeskt8LU7iZBF1Lq8Ky6?node-id=140-202) | `linkedin.svg` |
| X (Twitter) | `140:204` | [Open](https://www.figma.com/design/hCpeskt8LU7iZBF1Lq8Ky6?node-id=140-204) | `x.svg` |
| Instagram | `140:206` | [Open](https://www.figma.com/design/hCpeskt8LU7iZBF1Lq8Ky6?node-id=140-206) | `instagram.svg` |
| Reddit | `140:208` | [Open](https://www.figma.com/design/hCpeskt8LU7iZBF1Lq8Ky6?node-id=140-208) | `reddit.svg` |
| Threads | `140:210` | [Open](https://www.figma.com/design/hCpeskt8LU7iZBF1Lq8Ky6?node-id=140-210) | `threads.svg` |

#### Distraction Icons (12×12px) → `assets/icons/distractions/`

| Icon | Node ID | Figma Link | Output File |
|------|---------|------------|-------------|
| X | `140:244` | [Open](https://www.figma.com/design/hCpeskt8LU7iZBF1Lq8Ky6?node-id=140-244) | `x.svg` |
| Reddit | `140:246` | [Open](https://www.figma.com/design/hCpeskt8LU7iZBF1Lq8Ky6?node-id=140-246) | `reddit.svg` |
| YouTube | `140:248` | [Open](https://www.figma.com/design/hCpeskt8LU7iZBF1Lq8Ky6?node-id=140-248) | `youtube.svg` |

#### Flow State Icons (14.4×14.4px) → `assets/icons/flow-states/`

| Icon | Node ID | Figma Link | Output File |
|------|---------|------------|-------------|
| Creative | `140:331` | [Open](https://www.figma.com/design/hCpeskt8LU7iZBF1Lq8Ky6?node-id=140-331) | `creative.svg` |
| Focus | `140:350` | [Open](https://www.figma.com/design/hCpeskt8LU7iZBF1Lq8Ky6?node-id=140-350) | `focus.svg` |
| Recovery | `140:370` | [Open](https://www.figma.com/design/hCpeskt8LU7iZBF1Lq8Ky6?node-id=140-370) | `recovery.svg` |

#### Misc Assets → `assets/icons/misc/`

| Asset | Node ID | Figma Link | Output File | Format |
|-------|---------|------------|-------------|--------|
| Lightbulb | `140:255` | [Open](https://www.figma.com/design/hCpeskt8LU7iZBF1Lq8Ky6?node-id=140-255) | `lightbulb.svg` | SVG |
| Headphones | `140:229` | [Open](https://www.figma.com/design/hCpeskt8LU7iZBF1Lq8Ky6?node-id=140-229) | `headphones.png` | PNG @2x |
| Timeline Chart | `140:292` | [Open](https://www.figma.com/design/hCpeskt8LU7iZBF1Lq8Ky6?node-id=140-292) | `timeline-placeholder.png` | PNG @2x |

---

## Method 2: Figma REST API Script (for PNGs/batch export)

Run the automated script for PNG exports:

```bash
# Get a Personal Access Token from Figma > Settings > Personal Access Tokens
FIGMA_ACCESS_TOKEN=your_token_here bun scripts/download-figma-assets.ts
```

**Note**: The REST API exports work well for PNGs but SVGs may include extra metadata. Manual export produces cleaner SVGs.

---

## Method 3: Figma Plugin - SVG Export

Install the "SVG Export" plugin in Figma for batch SVG export with optimization options.

---

## SVG Optimization Tips

After exporting, optimize SVGs for React:

1. **Remove unnecessary attributes**: `xmlns:xlink`, `xml:space`, comments
2. **Use currentColor for fills** (if icon should inherit text color):
   ```svg
   <!-- Before -->
   <path fill="#ffffff" .../>

   <!-- After -->
   <path fill="currentColor" .../>
   ```
3. **Run through SVGO** (optional):
   ```bash
   bunx svgo assets/icons/**/*.svg --multipass
   ```

---

## Import Pattern in React

With `vite-plugin-svgr` configured:

```tsx
// Import as React component
import LinkedInIcon from '@/assets/icons/social/linkedin.svg?react';

// Usage with Tailwind
<LinkedInIcon className="w-3.5 h-3.5 text-white" />
```
