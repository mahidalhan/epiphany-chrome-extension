# Why Bundle Fonts & Icons in Chrome Extensions

## The Core Difference

**Websites** optimize for first visit - smallest initial download, so CDN caching helps.

**Extensions** optimize for every use after install - install size is invisible, but load time on every new tab matters.

## Fonts: Bundle `.woff2` Files

| Approach | First Load | Repeat Loads | Offline |
|----------|------------|--------------|---------|
| Bundled | Instant | Instant | Works |
| CDN | 50-100ms | Cached | Fails |

CDN fonts require two network requests (CSS then font file), CSP whitelist config, and create FOUT (Flash of Unstyled Text) on first load.

Bundled fonts load from extension's local files - no network, no latency, no failure modes.

## Icons: Use SVGs, Not Icon Fonts

| Approach | Bundle Size | Cross-Platform |
|----------|-------------|----------------|
| SVGs (tree-shaken) | ~200 bytes/icon | Works everywhere |
| Icon font | 50-100kb+ | Works everywhere |
| SF Pro symbols | 0kb | macOS only |

SF Pro is a system font only on Apple devices. Windows/Linux/ChromeOS render those Unicode symbols as empty boxes.

## Why the Install Size Doesn't Matter

Users accept multi-MB extension downloads. Adding 80-100kb for fonts is invisible at install time but saves 50-100ms + eliminates failure modes on every tab open.

Your new tab opens 20-50 times daily. Instant loads compound.

## Implementation

```bash
bun add @fontsource/manrope @fontsource/inter
```

```tsx
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/600.css';
import '@fontsource/inter/500.css';
```

For icons: Export from Figma as SVG.
