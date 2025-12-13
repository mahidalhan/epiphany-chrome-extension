import { useWxtStorage } from '@/lib/hooks/useWxtStorage';
import { viewMode } from '@/stores/view';

/**
 * Dashboard - Placeholder for the full dashboard view (Phase 3+).
 *
 * This component will eventually contain:
 * - Flow score circular gauge
 * - Flowprints 3D visualization (R3F + shadergradient)
 * - Timeline chart (uPlot)
 * - Device status card
 * - AI flow summary
 */
export function Dashboard() {
  const [, setView] = useWxtStorage(viewMode);

  return (
    <div className="min-h-screen bg-bg-primary noise-overlay">
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
        <p className="text-text-secondary">Coming in Phase 3</p>

        <button
          onClick={() => setView('minimal')}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors duration-150"
        >
          Back to Minimal View
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
