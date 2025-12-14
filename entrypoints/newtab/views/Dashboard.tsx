/**
 * Dashboard - Main dashboard view with 3-column layout.
 *
 * Phase 5: Components now read from Zustand stores directly.
 * - Column 1: Flow Score, Device Card, Flow Summary
 * - Column 2: Flowprints 3D visualization
 * - Column 3: Mode Banner, Flow Session with entries
 *
 * State Architecture:
 * - FlowScoreCard → useFlowStore
 * - DeviceCard → useDeviceStore
 * - FlowSessionCard → useActivityStore + useFlowStore
 * - FlowprintsCard → reads brain state from WXT Storage
 */

import { ArrowLeft } from 'lucide-react';
import { viewMode } from '@/stores/view';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BrainStateIndicator } from '@/components/brain-state/BrainStateIndicator';

// Column 1 Components
import { FlowScoreCard } from '@/components/flow-score';
import { DeviceCard } from '@/components/device-card';
import { FlowSummaryCard } from '@/components/flow-summary';

// Column 2 Components
import { FlowprintsCard } from '@/components/flowprints';

// Column 3 Components
import { ModeBannerCard, FlowSessionCard } from '@/components/session';

// Mock Data (only for components not yet wired to stores)
import { mockBrainState } from '@/lib/mock/static-data';

export function Dashboard() {
  const handleShare = () => {
    // Share functionality will be implemented in a later phase
    console.log('Share button clicked');
  };

  // Navigate back to minimal view - call storage directly to avoid duplicate watcher
  const handleBack = () => {
    viewMode.setValue('minimal');
  };

  return (
    <div className="relative">
      {/* Back Navigation */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 z-10 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors duration-150"
        aria-label="Back to minimal view"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Mode toggle (TargetMode) */}
      <div className="absolute top-6 right-6 z-10">
        <BrainStateIndicator />
      </div>

      <DashboardLayout
        leftColumn={<LeftColumn onShare={handleShare} />}
        centerColumn={<CenterColumn />}
        rightColumn={<RightColumn />}
      />
    </div>
  );
}

/**
 * LeftColumn - Flow Score, Device, and Flow Summary cards.
 * FlowScoreCard and DeviceCard read from Zustand stores directly.
 */
interface LeftColumnProps {
  onShare?: () => void;
}

function LeftColumn({ onShare }: LeftColumnProps) {
  return (
    <>
      <FlowScoreCard onShare={onShare} />
      <DeviceCard />
      <FlowSummaryCard />
    </>
  );
}

/**
 * CenterColumn - Flowprints 3D visualization.
 * R3F implementation comes in Phase 4.
 */
function CenterColumn() {
  return <FlowprintsCard brainState={mockBrainState} />;
}

/**
 * RightColumn - Mode Banner and Flow Session cards.
 * FlowSessionCard reads from useActivityStore + useFlowStore directly.
 */
function RightColumn() {
  return (
    <>
      <ModeBannerCard />
      <FlowSessionCard />
    </>
  );
}

export default Dashboard;
