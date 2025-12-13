import { type ReactNode, type ComponentType, type SVGProps } from 'react';

interface IconItem {
  /** Unique key for the icon */
  key: string;
  /** React component for the icon (Lucide or SVG import) */
  icon: ComponentType<SVGProps<SVGSVGElement>> | ReactNode;
  /** Alt text for accessibility */
  alt?: string;
}

interface OverlappingIconsProps {
  /** Array of icons to display */
  icons: IconItem[];
  /** Size of each icon container in pixels */
  size?: number;
  /** Overlap amount in pixels (negative margin) */
  overlap?: number;
  /** Additional CSS classes for the container */
  className?: string;
}

/**
 * OverlappingIcons - Reusable component for displaying overlapping circular icons.
 *
 * Used in:
 * - ShareBar: Social icons (LinkedIn, X, Instagram, Reddit, Threads) at 14×14px
 * - DistractionRow: App icons (X, Reddit, YouTube) at 12×12px
 *
 * Design specs from Figma:
 * - Each icon: bg-[#181818], border-[0.5px] border-white/20, rounded-full, p-[6px]
 * - Overlap: -8px margin-right
 */
export function OverlappingIcons({
  icons,
  size = 14,
  overlap = 8,
  className = '',
}: OverlappingIconsProps) {
  return (
    <div className={`flex items-center ${className}`}>
      {icons.map((item, index) => {
        const IconComponent = item.icon;
        const isReactElement =
          typeof IconComponent !== 'function' &&
          typeof IconComponent !== 'string';

        return (
          <div
            key={item.key}
            className="flex items-center justify-center rounded-full bg-bg-card border-[0.5px] border-white/20 p-1.5"
            style={{
              marginRight: index < icons.length - 1 ? `-${overlap}px` : 0,
              // Ensure proper stacking order (later icons on top)
              zIndex: icons.length - index,
            }}
            title={item.alt}
          >
            {isReactElement ? (
              IconComponent
            ) : (
              <IconComponent
                className="text-white"
                style={{ width: size, height: size }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default OverlappingIcons;
