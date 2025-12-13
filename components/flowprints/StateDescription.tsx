/**
 * StateDescription - Brain state explanation text (3 paragraphs).
 *
 * Design specs from Figma:
 * - Text: 12px, rgba(255,255,255,0.6)
 * - Width: 360px
 * - Multiple paragraphs with spacing
 */

interface StateDescriptionProps {
  /** Array of description paragraphs */
  paragraphs: string[];
  /** Additional CSS classes */
  className?: string;
}

export function StateDescription({ paragraphs, className = '' }: StateDescriptionProps) {
  return (
    <div className={`w-[360px] mx-auto ${className}`}>
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className="text-xs text-text-secondary font-manrope leading-relaxed mb-2 last:mb-0"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export default StateDescription;
