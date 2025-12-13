/**
 * Dashboard - Main dashboard view with 3-column layout.
 *
 * Phase 3 implements static UI components:
 * - Column 1: Flow Score, Device Card, Flow Summary
 * - Column 2: Flowprints visualization (placeholder)
 * - Column 3: Mode Banner, Flow Session with entries
 *
 * Dynamic data and interactivity come in later phases.
 */

import { ArrowLeft } from 'lucide-react';
import { useWxtStorage } from '@/lib/hooks/useWxtStorage';
import { viewMode } from '@/stores/view';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

// Column 1 Components
import { FlowScoreCard } from '@/components/flow-score';
import { DeviceCard } from '@/components/device-card';
import { FlowSummaryCard } from '@/components/flow-summary';

// Column 2 Components
import { FlowprintsCard } from '@/components/flowprints';

// Column 3 Components
import { ModeBannerCard, FlowSessionCard } from '@/components/session';

// Mock Data
import {
  mockFlowScore,
  mockDevice,
  mockFlowSummary,
  mockBrainState,
  mockFlowMode,
  mockSession,
} from '@/lib/mock/static-data';

export function Dashboard() {
  const [, setView] = useWxtStorage(viewMode);

  const handleShare = () => {
    // Share functionality will be implemented in a later phase
    console.log('Share button clicked');
  };

  return (
    <div className="relative">
      {/* Back Navigation */}
      <button
        onClick={() => setView('minimal')}
        className="absolute top-6 left-6 z-10 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors duration-150"
        aria-label="Back to minimal view"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back</span>
      </button>

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
 */
interface LeftColumnProps {
  onShare?: () => void;
}

function LeftColumn({ onShare }: LeftColumnProps) {
  return (
    <>
      <FlowScoreCard data={mockFlowScore} onShare={onShare} />
      <DeviceCard data={mockDevice} />
      <FlowSummaryCard data={mockFlowSummary} />
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
 */
function RightColumn() {
  return (
    <>
      <ModeBannerCard data={mockFlowMode} />
      <FlowSessionCard data={mockSession} />
    </>
  );
}

export default Dashboard;
