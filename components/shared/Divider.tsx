interface DividerProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Divider - Horizontal divider line component.
 *
 * Design specs from Figma:
 * - Height: 1px
 * - Color: rgba(255,255,255,0.2)
 * - Full width of container
 */
export function Divider({ className = '' }: DividerProps) {
  return <div className={`w-full h-px bg-border-default ${className}`} />;
}

export default Divider;
