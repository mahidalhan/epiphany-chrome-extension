import { useSpring } from '@react-spring/three';
import type { BrainState } from '@/stores/view';
import { BRAIN_STATE_3D_CONFIGS, type BrainState3DConfig } from '@/types/brain-state-3d';

/**
 * Animated 3D configuration values for brain state transitions.
 *
 * Uses @react-spring/three to smoothly interpolate between
 * brain state configurations over 1.5 seconds.
 */
export interface AnimatedBrainStateConfig {
  color1: string;
  color2: string;
  color3: string;
  uSpeed: number;
  uStrength: number;
  uDensity: number;
  uFrequency: number;
  uAmplitude: number;
  rotationY: number;
  rotationZ: number;
}

/**
 * Hook for animating brain state 3D configuration.
 *
 * Provides smooth spring transitions between brain states for the
 * ShaderGradient visualization. Colors and animation parameters
 * interpolate over 1.5 seconds.
 *
 * @param brainState - Current brain state from storage
 * @returns Animated spring values and getter function
 *
 * @example
 * ```tsx
 * const { springs, getConfig } = useBrainStateColors(brainState);
 * const config = getConfig();
 * <ShaderGradient color1={config.color1} uSpeed={config.uSpeed} />
 * ```
 */
export function useBrainStateColors(brainState: BrainState) {
  const config = BRAIN_STATE_3D_CONFIGS[brainState];

  const springs = useSpring({
    // Colors
    color1: config.color1,
    color2: config.color2,
    color3: config.color3,

    // Animation parameters
    uSpeed: config.uSpeed,
    uStrength: config.uStrength,
    uDensity: config.uDensity,
    uFrequency: config.uFrequency,
    uAmplitude: config.uAmplitude,

    // Rotation
    rotationY: config.rotationY,
    rotationZ: config.rotationZ,

    config: {
      mass: 1,
      tension: 80,
      friction: 20,
      // 1.5s smooth transition
      duration: 1500,
    },
  });

  /**
   * Get current interpolated config values.
   * Call this in render or useFrame to get latest animated values.
   */
  const getConfig = (): AnimatedBrainStateConfig => ({
    color1: springs.color1.get(),
    color2: springs.color2.get(),
    color3: springs.color3.get(),
    uSpeed: springs.uSpeed.get(),
    uStrength: springs.uStrength.get(),
    uDensity: springs.uDensity.get(),
    uFrequency: springs.uFrequency.get(),
    uAmplitude: springs.uAmplitude.get(),
    rotationY: springs.rotationY.get(),
    rotationZ: springs.rotationZ.get(),
  });

  return { springs, getConfig };
}
