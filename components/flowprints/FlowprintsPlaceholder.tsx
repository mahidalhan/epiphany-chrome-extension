/**
 * FlowprintsPlaceholder - 3D canvas placeholder for Phase 4 R3F implementation.
 *
 * Design specs from Figma:
 * - Size: 360x300px
 * - Background: black (#000)
 * - Border: 1px solid #333
 * - Border radius: 8px
 *
 * This component will be replaced with a React Three Fiber canvas
 * containing @shadergradient/react in Phase 4.
 */

interface FlowprintsPlaceholderProps {
  /** Width in pixels */
  width?: number;
  /** Height in pixels */
  height?: number;
}

export function FlowprintsPlaceholder({
  width = 360,
  height = 300,
}: FlowprintsPlaceholderProps) {
  return (
    <div
      className="bg-black border border-[#333] rounded-lg flex items-center justify-center mx-auto overflow-hidden"
      style={{ width, height }}
    >
      {/* Gradient blob placeholder */}
      <div className="relative w-full h-full">
        {/* Animated gradient placeholder to simulate 3D blob */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: `
              radial-gradient(ellipse at 30% 40%, rgba(155, 56, 255, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 60%, rgba(134, 180, 223, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(100, 214, 94, 0.2) 0%, transparent 60%)
            `,
          }}
        />

        {/* Phase indicator text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xs text-text-secondary font-manrope">
            3D Canvas - Phase 4
          </p>
          <p className="text-[10px] text-text-secondary/60 font-manrope mt-1">
            React Three Fiber + ShaderGradient
          </p>
        </div>
      </div>
    </div>
  );
}

export default FlowprintsPlaceholder;
