import { type ReactNode } from 'react';

type CardVariant = 'standard' | 'tooltip';

interface CardProps {
  children: ReactNode;
  /** Card style variant: 'standard' (12px radius, 20px padding) or 'tooltip' (8px radius, 12px padding with beak) */
  variant?: CardVariant;
  /** Additional CSS classes */
  className?: string;
  /** Fixed height for the card (e.g., "648px" for Flowprints card) */
  height?: string;
}

/**
 * Card - Reusable card wrapper component.
 *
 * Design specifications from Figma:
 * - Standard: bg-[#181818], border-white/20, rounded-[12px], p-[20px]
 * - Tooltip: bg-[#181818], border-white/20, rounded-[8px], p-[12px], with triangular beak
 */
export function Card({
  children,
  variant = 'standard',
  className = '',
  height,
}: CardProps) {
  const baseStyles = 'bg-bg-card border border-border-default';

  const variantStyles = {
    standard: 'rounded-[12px] p-5',
    tooltip: 'rounded-[8px] p-3 relative',
  };

  const heightStyle = height ? { height } : {};

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={heightStyle}
    >
      {children}
      {variant === 'tooltip' && <TooltipBeak />}
    </div>
  );
}

/**
 * TooltipBeak - Triangular pointer for tooltip-style cards.
 *
 * Positioned at bottom-left of the card.
 * Size: 8x8px square rotated 45deg
 */
function TooltipBeak() {
  return (
    <div
      className="absolute w-2 h-2 bg-bg-card border-b border-r border-border-default rotate-45"
      style={{
        bottom: '-5px',
        left: 'calc(50% - 4px)',
      }}
    />
  );
}

export default Card;
