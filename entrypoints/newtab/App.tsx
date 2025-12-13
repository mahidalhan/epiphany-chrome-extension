import { Suspense, lazy, useEffect } from 'react';
import { useWxtStorage } from '@/lib/hooks/useWxtStorage';
import { viewMode } from '@/stores/view';

// Eager load MinimalView for instant first paint (<50ms target)
import MinimalView from './views/MinimalView';

// Lazy load Dashboard - only fetched when needed
const Dashboard = lazy(() => import('./views/Dashboard'));

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
    <Suspense fallback={<LoadingSkeleton />}>
      <Dashboard />
    </Suspense>
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
