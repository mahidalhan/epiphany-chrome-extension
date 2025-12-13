/**
 * FlowScoreGauge - Circular gauge displaying the flow score (0-100).
 *
 * Design specs from Figma:
 * - Container: 120x120px
 * - Concentric rings: outer red (#d03131), inner blue (#6da6da)
 * - Score display: "85" in #2E93FF, "pts" in rgba(46,147,255,0.6)
 *
 * SVG Implementation:
 * - Uses stroke-dasharray and stroke-dashoffset for partial circle rendering
 * - Rings start from top (rotated -90deg)
 */

interface FlowScoreGaugeProps {
  /** Flow score value (0-100) */
  score: number;
  /** Size of the gauge container in pixels */
  size?: number;
}

export function FlowScoreGauge({ score, size = 120 }: FlowScoreGaugeProps) {
  // Clamp score between 0 and 100
  const clampedScore = Math.max(0, Math.min(100, score));

  // SVG viewBox configuration
  const viewBoxSize = 120;
  const center = viewBoxSize / 2;

  // Ring configuration (from Figma)
  const outerRing = {
    radius: 52,
    strokeWidth: 8,
    color: '#d03131', // Red
    progress: clampedScore,
  };

  const innerRing = {
    radius: 40,
    strokeWidth: 6,
    color: '#6da6da', // Blue
    progress: Math.min(clampedScore + 15, 100), // Slightly ahead of outer
  };

  // Calculate circumference and offset for each ring
  const calculateDashProps = (radius: number, progress: number) => {
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (circumference * progress) / 100;
    return { circumference, offset };
  };

  const outerDash = calculateDashProps(outerRing.radius, outerRing.progress);
  const innerDash = calculateDashProps(innerRing.radius, innerRing.progress);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        className="w-full h-full"
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Background tracks (subtle) */}
        <circle
          cx={center}
          cy={center}
          r={outerRing.radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={outerRing.strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={innerRing.radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={innerRing.strokeWidth}
        />

        {/* Inner ring (blue) - drawn first so outer overlaps */}
        <circle
          cx={center}
          cy={center}
          r={innerRing.radius}
          fill="none"
          stroke={innerRing.color}
          strokeWidth={innerRing.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={innerDash.circumference}
          strokeDashoffset={innerDash.offset}
          className="transition-all duration-500"
        />

        {/* Outer ring (red) */}
        <circle
          cx={center}
          cy={center}
          r={outerRing.radius}
          fill="none"
          stroke={outerRing.color}
          strokeWidth={outerRing.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={outerDash.circumference}
          strokeDashoffset={outerDash.offset}
          className="transition-all duration-500"
        />
      </svg>

      {/* Score display (centered) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <span className="text-[28.5px] font-semibold text-[#2E93FF] font-manrope">
            {clampedScore}
          </span>
          <span className="text-[11.88px] font-semibold text-[rgba(46,147,255,0.6)] font-manrope">
            pts
          </span>
        </div>
      </div>
    </div>
  );
}

export default FlowScoreGauge;
