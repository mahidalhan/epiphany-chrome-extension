import { type ReactNode } from 'react';

interface DashboardLayoutProps {
  /** Content for the left column (Flow Score, Device, Flow Summary cards) */
  leftColumn: ReactNode;
  /** Content for the center column (Flowprints card - 648px height) */
  centerColumn: ReactNode;
  /** Content for the right column (Mode Banner, Flow Session cards) */
  rightColumn: ReactNode;
}

/**
 * DashboardLayout - 3-column flex grid for the main dashboard view.
 *
 * Layout specifications from Figma:
 * - 3 equal-width columns (flex: 1 each)
 * - 24px gap between columns
 * - Each column has 24px internal gap between cards
 * - Columns use flex-col for vertical stacking
 */
export function DashboardLayout({
  leftColumn,
  centerColumn,
  rightColumn,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-primary noise-overlay p-6">
      <div className="flex gap-6 max-w-[1400px] mx-auto">
        {/* Column 1 - Left Panel */}
        <div className="flex-1 flex flex-col gap-6">{leftColumn}</div>

        {/* Column 2 - Center Panel (Flowprints) */}
        <div className="flex-1 flex flex-col">{centerColumn}</div>

        {/* Column 3 - Right Panel */}
        <div className="flex-1 flex flex-col gap-6">{rightColumn}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;
