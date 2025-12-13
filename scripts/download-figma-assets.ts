#!/usr/bin/env bun
/**
 * Figma Asset Downloader Script
 *
 * Downloads SVG/PNG assets from Figma and saves them to the assets/icons directory.
 * Uses the Figma REST API directly for proper SVG export support.
 *
 * Usage:
 *   1. Set FIGMA_ACCESS_TOKEN environment variable (get from Figma > Settings > Personal Access Tokens)
 *   2. Run: bun scripts/download-figma-assets.ts
 *
 * The script will:
 *   - Export SVGs optimized for React (with currentColor support)
 *   - Create directory structure automatically
 *   - Log progress and any errors
 */

const FIGMA_FILE_KEY = 'hCpeskt8LU7iZBF1Lq8Ky6';
const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;

if (!FIGMA_ACCESS_TOKEN) {
  console.error('❌ Error: FIGMA_ACCESS_TOKEN environment variable is required');
  console.error('   Get your token from: Figma > Settings > Personal Access Tokens');
  console.error('   Then run: FIGMA_ACCESS_TOKEN=your_token bun scripts/download-figma-assets.ts');
  process.exit(1);
}

// Asset definitions based on phase-3-dashboard-layout.md
// Format: { nodeId, outputPath, format, scale? }
const ASSETS_TO_DOWNLOAD = [
  // Social brand icons (14×14px) - from Share Bar
  { nodeId: '140:202', outputPath: 'assets/icons/social/linkedin.svg', format: 'svg', name: 'LinkedIn' },
  { nodeId: '140:204', outputPath: 'assets/icons/social/x.svg', format: 'svg', name: 'X (Twitter)' },
  { nodeId: '140:206', outputPath: 'assets/icons/social/instagram.svg', format: 'svg', name: 'Instagram' },
  { nodeId: '140:208', outputPath: 'assets/icons/social/reddit.svg', format: 'svg', name: 'Reddit' },
  { nodeId: '140:210', outputPath: 'assets/icons/social/threads.svg', format: 'svg', name: 'Threads' },

  // Distraction brand icons (12×12px) - from Flow Summary Card
  { nodeId: '140:244', outputPath: 'assets/icons/distractions/x.svg', format: 'svg', name: 'X (distraction)' },
  { nodeId: '140:246', outputPath: 'assets/icons/distractions/reddit.svg', format: 'svg', name: 'Reddit (distraction)' },
  { nodeId: '140:248', outputPath: 'assets/icons/distractions/youtube.svg', format: 'svg', name: 'YouTube' },

  // Flow state icons (14.4×14.4px) - from Flow Entries
  { nodeId: '140:331', outputPath: 'assets/icons/flow-states/creative.svg', format: 'svg', name: 'Creative Flow' },
  { nodeId: '140:350', outputPath: 'assets/icons/flow-states/focus.svg', format: 'svg', name: 'Deep Focus' },
  { nodeId: '140:370', outputPath: 'assets/icons/flow-states/recovery.svg', format: 'svg', name: 'Active Recovery' },

  // Misc assets
  { nodeId: '140:255', outputPath: 'assets/icons/misc/lightbulb.svg', format: 'svg', name: 'Lightbulb' },
  { nodeId: '140:229', outputPath: 'assets/icons/misc/headphones.png', format: 'png', scale: 2, name: 'Headphones' },

  // Timeline chart placeholder (export the whole chart frame)
  { nodeId: '140:292', outputPath: 'assets/icons/misc/timeline-placeholder.png', format: 'png', scale: 2, name: 'Timeline Chart' },
];

interface FigmaExportResponse {
  err: string | null;
  images: Record<string, string>;
}

async function getExportUrls(nodeIds: string[], format: 'svg' | 'png', scale = 1): Promise<Record<string, string>> {
  const ids = nodeIds.join(',');
  const url = `https://api.figma.com/v1/images/${FIGMA_FILE_KEY}?ids=${ids}&format=${format}&scale=${scale}`;

  const response = await fetch(url, {
    headers: {
      'X-Figma-Token': FIGMA_ACCESS_TOKEN!,
    },
  });

  if (!response.ok) {
    throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as FigmaExportResponse;

  if (data.err) {
    throw new Error(`Figma export error: ${data.err}`);
  }

  return data.images;
}

async function downloadFile(url: string, outputPath: string): Promise<void> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Download failed: ${response.status} ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();

  // Ensure directory exists
  const dir = outputPath.substring(0, outputPath.lastIndexOf('/'));
  await Bun.write(outputPath, ''); // Create parent dirs

  // For SVGs, optionally process to use currentColor
  if (outputPath.endsWith('.svg')) {
    let svgContent = new TextDecoder().decode(buffer);

    // Replace fill colors with currentColor for flexibility (optional - can be enabled per icon)
    // Uncomment the next line if you want icons to inherit text color:
    // svgContent = svgContent.replace(/fill="[^"]*"/g, 'fill="currentColor"');

    await Bun.write(outputPath, svgContent);
  } else {
    await Bun.write(outputPath, buffer);
  }
}

async function main() {
  console.log('🎨 Figma Asset Downloader');
  console.log('========================\n');

  // Group assets by format for batch API calls
  const svgAssets = ASSETS_TO_DOWNLOAD.filter(a => a.format === 'svg');
  const pngAssets = ASSETS_TO_DOWNLOAD.filter(a => a.format === 'png');

  // Create directories
  const dirs = ['assets/icons/social', 'assets/icons/distractions', 'assets/icons/flow-states', 'assets/icons/misc'];
  for (const dir of dirs) {
    await Bun.$`mkdir -p ${dir}`;
  }
  console.log('📁 Created directories\n');

  // Get SVG export URLs
  if (svgAssets.length > 0) {
    console.log(`📥 Fetching ${svgAssets.length} SVG export URLs...`);
    try {
      const svgNodeIds = svgAssets.map(a => a.nodeId);
      const svgUrls = await getExportUrls(svgNodeIds, 'svg');

      for (const asset of svgAssets) {
        const url = svgUrls[asset.nodeId];
        if (url) {
          console.log(`   ⬇️  ${asset.name} → ${asset.outputPath}`);
          await downloadFile(url, asset.outputPath);
        } else {
          console.log(`   ⚠️  No URL for ${asset.name} (${asset.nodeId})`);
        }
      }
      console.log('');
    } catch (error) {
      console.error('❌ SVG export error:', error);
    }
  }

  // Get PNG export URLs (with scale)
  if (pngAssets.length > 0) {
    console.log(`📥 Fetching ${pngAssets.length} PNG export URLs...`);
    try {
      // Group by scale
      const byScale = pngAssets.reduce((acc, a) => {
        const scale = a.scale || 1;
        if (!acc[scale]) acc[scale] = [];
        acc[scale].push(a);
        return acc;
      }, {} as Record<number, typeof pngAssets>);

      for (const [scale, assets] of Object.entries(byScale)) {
        const nodeIds = assets.map(a => a.nodeId);
        const pngUrls = await getExportUrls(nodeIds, 'png', Number(scale));

        for (const asset of assets) {
          const url = pngUrls[asset.nodeId];
          if (url) {
            console.log(`   ⬇️  ${asset.name} (@${scale}x) → ${asset.outputPath}`);
            await downloadFile(url, asset.outputPath);
          } else {
            console.log(`   ⚠️  No URL for ${asset.name} (${asset.nodeId})`);
          }
        }
      }
      console.log('');
    } catch (error) {
      console.error('❌ PNG export error:', error);
    }
  }

  console.log('✅ Asset download complete!\n');
  console.log('Next steps:');
  console.log('  1. Check assets/icons/ for downloaded files');
  console.log('  2. Verify SVGs render correctly');
  console.log('  3. For icons that should use currentColor, edit the SVG fill attributes');
}

main().catch(console.error);
