/**
 * TimelinePlaceholder - Static chart placeholder for Phase 5 uPlot implementation.
 *
 * Design specs from Figma:
 * - Container: 377x157px, bg-black, border border-white/20, rounded-[12px], p-[20px]
 * - X-axis labels: 9:00 to 16:00 (Inter Medium 7.3px, #b8b8b8, tracking-[-0.219px])
 * - Y-axis label: "Mental State" (rotated 270deg, Inter Medium 7.3px, #b8b8b8)
 * - Chart area: Gradient fill area chart (placeholder image for Phase 3)
 *
 * This component will be replaced with a uPlot chart in Phase 5.
 */

interface TimelinePlaceholderProps {
  /** X-axis labels (hours) */
  xLabels?: string[];
  /** Width in pixels */
  width?: number;
  /** Height in pixels */
  height?: number;
}

export function TimelinePlaceholder({
  xLabels = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
  width = 377,
  height = 157,
}: TimelinePlaceholderProps) {
  return (
    <div
      className="bg-black border border-white/20 rounded-xl p-5 relative overflow-hidden"
      style={{ width: '100%', height }}
    >
      {/* Y-axis label (rotated) */}
      <div
        className="absolute left-1 top-1/2 text-[7.3px] text-text-muted font-inter font-medium"
        style={{
          transform: 'translateY(-50%) rotate(-90deg)',
          transformOrigin: 'center',
          letterSpacing: '-0.219px',
        }}
      >
        Mental State
      </div>

      {/* Chart area placeholder */}
      <div className="ml-6 mr-2 h-[calc(100%-24px)] relative">
        {/* Gradient area chart placeholder */}
        <svg className="w-full h-full" viewBox="0 0 300 93" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(155, 56, 255, 0.4)" />
              <stop offset="50%" stopColor="rgba(134, 180, 223, 0.3)" />
              <stop offset="100%" stopColor="rgba(100, 214, 94, 0.1)" />
            </linearGradient>
          </defs>
          {/* Area fill */}
          <path
            d="M0 70 Q30 50 60 55 Q90 60 120 30 Q150 10 180 25 Q210 40 240 20 Q270 5 300 15 L300 93 L0 93 Z"
            fill="url(#chartGradient)"
          />
          {/* Line */}
          <path
            d="M0 70 Q30 50 60 55 Q90 60 120 30 Q150 10 180 25 Q210 40 240 20 Q270 5 300 15"
            fill="none"
            stroke="rgba(155, 56, 255, 0.8)"
            strokeWidth="2"
          />
        </svg>

        {/* Phase indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[10px] text-text-secondary/60 font-manrope bg-black/50 px-2 py-1 rounded">
            uPlot Chart - Phase 5
          </p>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-1 ml-6 mr-2">
        {xLabels.map((label) => (
          <span
            key={label}
            className="text-[7.3px] text-text-muted font-inter font-medium"
            style={{ letterSpacing: '-0.219px' }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default TimelinePlaceholder;
