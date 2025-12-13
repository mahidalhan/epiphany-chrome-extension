/**
 * SVG Optimization Script
 *
 * This script:
 * 1. Downloads proper vector SVGs for brand icons (current ones have embedded PNGs)
 * 2. Optimizes all SVGs using SVGO
 *
 * Usage: bun run scripts/optimize-svgs.ts
 */

import { optimize } from 'svgo';
import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';

const ASSETS_DIR = join(import.meta.dir, '../assets/icons');

// Simple Icons CDNs - clean vector brand icons
// https://simpleicons.org/
const SIMPLE_ICONS_CDN = 'https://cdn.simpleicons.org';
const JSDELIVR_CDN = 'https://cdn.jsdelivr.net/npm/simple-icons@13/icons';

// Brand icons that need to be replaced (current ones have embedded PNGs)
const BRAND_ICONS: Record<string, { slug: string; color: string }> = {
  // Social icons (share bar)
  'social/instagram.svg': { slug: 'instagram', color: 'E4405F' },
  'social/whatsapp.svg': { slug: 'whatsapp', color: '25D366' },
  'social/reddit.svg': { slug: 'reddit', color: 'FF4500' },
  'social/x.svg': { slug: 'x', color: '000000' },
  'social/linkedin.svg': { slug: 'linkedin', color: '0A66C2' },
  // Distraction icons
  'distractions/instagram.svg': { slug: 'instagram', color: 'E4405F' },
  'distractions/youtube.svg': { slug: 'youtube', color: 'FF0000' },
  'distractions/x.svg': { slug: 'x', color: '000000' },
  // Misplaced reddit in flow-states (cleanup)
  'flow-states/reddit.svg': { slug: 'reddit', color: 'FF4500' },
};

// SVGO configuration for aggressive optimization
const svgoConfig = {
  multipass: true,
  plugins: [
    'preset-default',
    'removeXMLNS',
    'removeDimensions',
    {
      name: 'removeAttrs',
      params: {
        attrs: ['data-name', 'class'],
      },
    },
  ],
};

async function downloadBrandIcon(slug: string, color: string): Promise<string> {
  // Try primary CDN first (supports colors)
  const primaryUrl = `${SIMPLE_ICONS_CDN}/${slug}/${color}`;
  console.log(`  Downloading ${slug} from Simple Icons...`);

  let response = await fetch(primaryUrl);

  // Fallback to jsDelivr (no color support, but more reliable)
  if (!response.ok) {
    console.log(`    Primary CDN failed, trying jsDelivr fallback...`);
    const fallbackUrl = `${JSDELIVR_CDN}/${slug}.svg`;
    response = await fetch(fallbackUrl);

    if (!response.ok) {
      throw new Error(`Failed to download ${slug}: ${response.status}`);
    }

    // jsDelivr returns black icons, we need to add color
    let svg = await response.text();
    // Add fill color to the SVG
    svg = svg.replace('<svg ', `<svg fill="#${color}" `);
    return svg;
  }

  return await response.text();
}

async function optimizeSvg(content: string): Promise<string> {
  const result = optimize(content, svgoConfig);
  return result.data;
}

async function getSvgFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        const subFiles = await getSvgFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile() && extname(entry.name).toLowerCase() === '.svg') {
        files.push(fullPath);
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err);
  }

  return files;
}

async function getRelativePath(fullPath: string): Promise<string> {
  return fullPath.replace(ASSETS_DIR + '/', '');
}

async function main() {
  console.log('SVG Optimization Script\n');
  console.log('='.repeat(50));

  // Step 1: Download and replace brand icons with embedded PNGs
  console.log('\n1. Replacing brand icons (embedded PNGs -> vector SVGs):\n');

  for (const [relativePath, { slug, color }] of Object.entries(BRAND_ICONS)) {
    const fullPath = join(ASSETS_DIR, relativePath);

    try {
      // Check if file exists and has embedded PNG or is too large (>10KB suggests non-vector)
      const existingContent = await readFile(fullPath, 'utf-8').catch(() => null);
      const hasEmbeddedPng = existingContent?.includes('data:image/png;base64');
      const isTooLarge = existingContent && Buffer.byteLength(existingContent) > 10000;

      if (hasEmbeddedPng || !existingContent || isTooLarge) {
        const svgContent = await downloadBrandIcon(slug, color);
        const optimized = await optimizeSvg(svgContent);

        // Ensure directory exists
        const dir = join(ASSETS_DIR, relativePath.split('/')[0]);
        await mkdir(dir, { recursive: true });

        await writeFile(fullPath, optimized);

        const sizeKb = (Buffer.byteLength(optimized) / 1024).toFixed(2);
        const reason = hasEmbeddedPng ? 'embedded PNG' : isTooLarge ? 'too large' : 'missing';
        console.log(`  ✓ ${relativePath} - ${sizeKb}KB (was ${reason})`);
      } else {
        console.log(`  - ${relativePath} - already vector, skipping download`);
      }
    } catch (err) {
      console.error(`  ✗ ${relativePath} - Error:`, err);
    }
  }

  // Step 2: Optimize all existing SVGs
  console.log('\n2. Optimizing all SVG files:\n');

  const svgFiles = await getSvgFiles(ASSETS_DIR);
  let totalSaved = 0;

  for (const filePath of svgFiles) {
    const relativePath = await getRelativePath(filePath);

    // Skip brand icons we just downloaded (already optimized)
    if (Object.keys(BRAND_ICONS).includes(relativePath)) {
      continue;
    }

    try {
      const content = await readFile(filePath, 'utf-8');
      const originalSize = Buffer.byteLength(content);

      // Skip if it has embedded PNG (shouldn't happen after step 1)
      if (content.includes('data:image/png;base64')) {
        console.log(`  ! ${relativePath} - has embedded PNG, skipping`);
        continue;
      }

      const optimized = await optimizeSvg(content);
      const newSize = Buffer.byteLength(optimized);
      const saved = originalSize - newSize;
      totalSaved += saved;

      await writeFile(filePath, optimized);

      const savedKb = (saved / 1024).toFixed(2);
      const newSizeKb = (newSize / 1024).toFixed(2);
      console.log(`  ✓ ${relativePath} - ${newSizeKb}KB (saved ${savedKb}KB)`);
    } catch (err) {
      console.error(`  ✗ ${relativePath} - Error:`, err);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`Total saved: ${(totalSaved / 1024).toFixed(2)}KB`);
  console.log('\nDone!');
}

main().catch(console.error);
