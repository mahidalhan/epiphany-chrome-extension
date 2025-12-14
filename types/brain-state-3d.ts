/**
 * 3D Configuration for Brain State Visualization
 *
 * Defines the ShaderGradient parameters for each brain state.
 * These values control the animated 3D blob appearance in Flowprints.
 */

import type { BrainState } from '@/stores/view';

/**
 * Configuration interface for ShaderGradient 3D visualization.
 * Each brain state has unique colors and animation parameters.
 */
export interface BrainState3DConfig {
  // Gradient colors (hex strings)
  color1: string;
  color2: string;
  color3: string;

  // Animation parameters
  uSpeed: number; // Animation speed (0-1)
  uStrength: number; // Distortion strength (0-1)
  uDensity: number; // Mesh density (0-2)
  uFrequency: number; // Wave frequency (0-10)
  uAmplitude: number; // Wave amplitude (0-10)

  // Camera/rotation
  rotationY: number;
  rotationZ: number;
}

/**
 * Creative Mode (Purple/Magenta)
 * High creativity, right-brain engaged, artistic thinking.
 * Dynamic, energetic movement with vibrant purple spectrum.
 */
const CREATIVE_CONFIG: BrainState3DConfig = {
  color1: '#9b38ff', // Vibrant purple (design token)
  color2: '#ff6ec7', // Hot pink accent
  color3: '#7b2cbf', // Deep violet

  uSpeed: 0.4, // Faster, more dynamic
  uStrength: 0.4, // Higher distortion
  uDensity: 1.2, // Dense mesh for rich detail
  uFrequency: 6.0, // More wave variation
  uAmplitude: 3.5, // Larger waves

  rotationY: 140,
  rotationZ: 75,
};

/**
 * Focus Mode (Purple/Orange/Blue) - DEFAULT STATE
 * Deep concentration, left-brain engaged, analytical thinking.
 * Calm, steady movement matching Figma reference.
 */
const FOCUS_CONFIG: BrainState3DConfig = {
  color1: '#9b38ff', // Purple (top-left in Figma)
  color2: '#ff6b35', // Orange (center-right in Figma)
  color3: '#86b4df', // Light blue (bottom in Figma)

  uSpeed: 0.25, // Slower, calmer movement
  uStrength: 0.3, // Moderate distortion
  uDensity: 1.4, // High density for pointillistic look
  uFrequency: 5.0, // Moderate wave frequency
  uAmplitude: 3.2, // Standard amplitude

  rotationY: 130,
  rotationZ: 70,
};

/**
 * Recovery Mode (Green/Yellow)
 * Rest and recovery, balanced brain activity, regeneration.
 * Slowest, most relaxing animation with calming green spectrum.
 */
const RECOVERY_CONFIG: BrainState3DConfig = {
  color1: '#64d65e', // Primary green (design token)
  color2: '#a8e063', // Light lime
  color3: '#d4fc79', // Yellow-green glow

  uSpeed: 0.15, // Slowest, most relaxed
  uStrength: 0.2, // Minimal distortion
  uDensity: 1.0, // Standard density
  uFrequency: 3.5, // Very gentle waves
  uAmplitude: 2.5, // Smaller waves

  rotationY: 120,
  rotationZ: 65,
};

/**
 * Complete 3D configuration mapping for all brain states.
 * Used by useBrainStateColors hook for spring animations.
 */
export const BRAIN_STATE_3D_CONFIGS: Record<BrainState, BrainState3DConfig> = {
  creative: CREATIVE_CONFIG,
  focus: FOCUS_CONFIG,
  recovery: RECOVERY_CONFIG,
};
