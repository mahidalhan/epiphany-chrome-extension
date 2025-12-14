import { Suspense, lazy, useEffect, Component, type ReactNode } from 'react';
import { useWxtStorage } from '@/lib/hooks/useWxtStorage';
import { useBackgroundMessages } from '@/lib/hooks/useBackgroundMessages';
import { viewMode } from '@/stores/view';

// Eager load MinimalView for instant first paint (<50ms target)
import MinimalView from './views/MinimalView';

// Lazy load Dashboard - only fetched when needed
const Dashboard = lazy(() => import('./views/Dashboard'));

/**
 * Error Boundary to catch Dashboard render errors
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class DashboardErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error): void {
    console.error('Dashboard Error:', error);
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-primary noise-overlay flex items-center justify-center">
          <div className="text-text-secondary text-sm">
            Dashboard Error: {this.state.error?.message}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Epiphany New Tab - Main Application Component
 *
 * View Switching:
 * - 'minimal': Instant-loading view with search bar, logo, brain state toggle
 * - 'dashboard': Full dashboard with flow metrics (lazy-loaded)
 *
 * Performance Strategy:
 * - MinimalView is eagerly loaded for <50ms first paint
 * - Dashboard is lazy-loaded via React.lazy()
 * - requestIdleCallback preloads Dashboard while user views MinimalView
 */
export default function App() {
  const [currentView] = useWxtStorage(viewMode);
  useBackgroundMessages();

  // Preload Dashboard in background during idle time
  useEffect(() => {
    // Use requestIdleCallback to preload Dashboard without blocking
    const preloadDashboard = () => {
      import('./views/Dashboard');
    };

    if ('requestIdleCallback' in window) {
      const idleId = requestIdleCallback(preloadDashboard, { timeout: 2000 });
      return () => cancelIdleCallback(idleId);
    } else {
      // Fallback for browsers without requestIdleCallback
      const timeoutId = setTimeout(preloadDashboard, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  // Show loading skeleton while storage initializes
  if (currentView === null) {
    return <LoadingSkeleton />;
  }

  return currentView === 'minimal' ? (
    <MinimalView />
  ) : (
    <DashboardErrorBoundary>
      <Suspense fallback={<LoadingSkeleton />}>
        <Dashboard />
      </Suspense>
    </DashboardErrorBoundary>
  );
}

/**
 * Minimal loading skeleton to prevent layout shift
 */
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-bg-primary noise-overlay flex items-center justify-center">
      <div className="text-text-secondary text-sm">Loading...</div>
    </div>
  );
}
