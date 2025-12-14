import { ShaderGradientCanvas } from '@shadergradient/react';
import { Component, type ReactNode } from 'react';

import { usePageVisibility } from '@/lib/hooks/usePageVisibility';
import { isWebGLSupported } from '@/lib/utils/webgl-detect';
import type { BrainState } from '@/stores/view';

import { FlowprintsPlaceholder } from './FlowprintsPlaceholder';
import { ShaderGradientScene } from './ShaderGradientScene';

interface FlowprintsCanvasProps {
  /** Brain state for 3D color mapping */
  brainState: BrainState;
  /** Reduce animation speed and pixel density */
  lowPowerMode?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Error boundary for WebGL failures.
 * Falls back to static placeholder on context loss or shader errors.
 */
interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error): void {
    console.error('WebGL Error:', error);
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * Flowprints 3D Canvas Wrapper
 *
 * Renders the animated 3D gradient blob visualization.
 * Features:
 * - WebGL capability detection with graceful fallback
 * - Error boundary for runtime WebGL failures
 * - Built-in lazy loading via Intersection Observer
 * - Visibility-based animation pause (saves battery when tab hidden)
 *
 * Canvas dimensions: 360x300px matching Figma spec.
 */
export function FlowprintsCanvas({
  brainState,
  lowPowerMode = false,
  className = '',
}: FlowprintsCanvasProps) {
  const isVisible = usePageVisibility();

  // Early return if WebGL not supported
  if (!isWebGLSupported()) {
    return <FlowprintsPlaceholder />;
  }

  return (
    <WebGLErrorBoundary fallback={<FlowprintsPlaceholder />}>
      {/* Container: 360x300px, black bg, #333 border, 8px radius per Figma */}
      <div
        className={`
          w-[360px] h-[300px]
          rounded-lg overflow-hidden
          bg-black border border-[#333]
          mx-auto
          ${className}
        `}
      >
        <ShaderGradientCanvas
          style={{ width: '100%', height: '100%' }}
          pixelDensity={lowPowerMode ? 0.5 : 1}
          fov={45}
          pointerEvents="none"
          // Built-in lazy loading via Intersection Observer
          lazyLoad={true}
          threshold={0.1}
          rootMargin="100px"
          // Safari compatibility
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
    </WebGLErrorBoundary>
  );
}
