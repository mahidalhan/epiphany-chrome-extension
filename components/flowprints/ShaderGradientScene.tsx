import { useFrame } from '@react-three/fiber';
import { ShaderGradient } from '@shadergradient/react';
import { useState } from 'react';

import { useBrainStateColors } from '@/lib/hooks/useBrainStateColors';
import type { BrainState } from '@/stores/view';

interface ShaderGradientSceneProps {
  /** Brain state for 3D color mapping */
  brainState: BrainState;
  /** Reduce animation speed and density for battery savings */
  lowPowerMode?: boolean;
  /** Whether the page is visible (pause animation when hidden) */
  isVisible?: boolean;
}

/**
 * Inner 3D scene component for the ShaderGradient visualization.
 *
 * This component renders inside ShaderGradientCanvas and handles:
 * - Spring-animated color transitions between brain states
 * - Low-power mode for reduced CPU/GPU usage
 * - Visibility-based animation pause
 *
 * The ShaderGradient uses a sphere mesh with pointillistic/particle
 * aesthetics matching the Figma design.
 */
export function ShaderGradientScene({
  brainState,
  lowPowerMode = false,
  isVisible = true,
}: ShaderGradientSceneProps) {
  const { getConfig } = useBrainStateColors(brainState);
  const [config, setConfig] = useState(() => getConfig());

  // Update config on each frame to get latest spring values
  // The infinite loop issue was from Zustand selectors, not this component
  // So updating every frame here is safe and necessary for smooth animation
  useFrame(() => {
    if (isVisible) {
      setConfig(getConfig());
    }
  });

  // Adjust parameters for low-power mode
  const speed = lowPowerMode ? config.uSpeed * 0.5 : config.uSpeed;
  const density = lowPowerMode ? Math.max(0.8, config.uDensity * 0.7) : config.uDensity;

  return (
    <ShaderGradient
      // Shape configuration - sphere for organic blob
      type="sphere"
      animate={isVisible ? 'on' : 'off'}
      wireframe={false}

      // Colors from spring animation
      color1={config.color1}
      color2={config.color2}
      color3={config.color3}

      // Animation parameters
      uSpeed={speed}
      uStrength={config.uStrength}
      uDensity={density}
      uFrequency={config.uFrequency}
      uAmplitude={config.uAmplitude}

      // Position (centered)
      positionX={0}
      positionY={0}
      positionZ={0}

      // Rotation from config
      rotationX={0}
      rotationY={config.rotationY}
      rotationZ={config.rotationZ}

      // Camera settings for 360x300 canvas
      cAzimuthAngle={180}
      cPolarAngle={90}
      cDistance={2.5}
      cameraZoom={1}

      // Lighting - soft ambient per Figma
      lightType="env"
      envPreset="city"
      brightness={0.8}
      reflection={0.4}

      // Effects
      grain="on"
    />
  );
}
