interface ProgressBarProps {
  /** Progress percentage (0-100) */
  value: number;
  /** Fill color (Tailwind bg class or hex color) */
  color: string;
  /** Additional CSS classes for the container */
  className?: string;
}

/**
 * ProgressBar - Configurable color progress bar component.
 *
 * Used in Flow Entry Items to show session progress.
 *
 * Design specs from Figma:
 * - Container: h-[44px] (includes padding)
 * - Track: h-[6px], rounded-[3px], bg-[rgba(120,120,120,0.2)]
 * - Fill: Same height, rounded-[3px], color matches flow state
 * - Horizontal padding: 16px on each side
 *
 * Flow state colors:
 * - Creative: #9b38ff (purple)
 * - Focus: #86b4df (blue)
 * - Recovery: #64d65e (green)
 */
export function ProgressBar({
  value,
  color,
  className = '',
}: ProgressBarProps) {
  // Clamp value between 0 and 100
  const clampedValue = Math.max(0, Math.min(100, value));

  // Determine if color is a Tailwind class or hex value
  const isHexColor = color.startsWith('#');
  const fillStyle = isHexColor
    ? { backgroundColor: color, width: `${clampedValue}%` }
    : { width: `${clampedValue}%` };

  const fillClasses = isHexColor ? '' : color;

  return (
    <div className={`h-11 flex items-center px-4 ${className}`}>
      {/* Track */}
      <div className="w-full h-1.5 rounded-[3px] bg-[rgba(120,120,120,0.2)]">
        {/* Fill - will-change for GPU-accelerated width animation */}
        <div
          className={`h-full rounded-[3px] transition-[width] duration-300 ease-out ${fillClasses}`}
          style={{ ...fillStyle, willChange: 'width' }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
