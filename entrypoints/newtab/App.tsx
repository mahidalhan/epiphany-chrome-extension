/**
 * Epiphany New Tab - Main Application Component
 *
 * Phase 1: Foundation placeholder
 * Phase 2: Will add Minimal View (search bar, logo, CTA)
 * Phase 3: Will add Dashboard with lazy loading
 */

export default function App() {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center noise-overlay">
      {/* Placeholder content - will be replaced with Minimal View in Phase 2 */}
      <div className="text-center">
        {/* Logo placeholder */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">epiphany</h1>
          <p className="text-text-secondary mt-2">Flow State Dashboard</p>
        </div>

        {/* Status indicator */}
        <div className="card p-6 max-w-md">
          <h2 className="text-lg font-semibold mb-4">Phase 1 Complete</h2>
          <ul className="text-left text-text-secondary space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-flow-recovery">✓</span>
              WXT + React 19 configured
            </li>
            <li className="flex items-center gap-2">
              <span className="text-flow-recovery">✓</span>
              Tailwind v4 with design tokens
            </li>
            <li className="flex items-center gap-2">
              <span className="text-flow-recovery">✓</span>
              Zustand state management ready
            </li>
            <li className="flex items-center gap-2">
              <span className="text-flow-recovery">✓</span>
              Code splitting configured
            </li>
          </ul>

          {/* Preview of flow state colors */}
          <div className="mt-6 pt-4 border-t border-border-default">
            <p className="text-xs text-text-muted mb-3">Flow State Colors:</p>
            <div className="flex gap-3 justify-center">
              <span className="px-3 py-1 rounded-full text-xs bg-flow-creative/20 text-flow-creative">
                Creative
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-flow-focus/20 text-flow-focus">
                Deep Focus
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-flow-recovery/20 text-flow-recovery">
                Recovery
              </span>
            </div>
          </div>
        </div>

        {/* Next phase hint */}
        <p className="text-text-muted text-sm mt-8">
          Next: Phase 2 - Minimal View UI
        </p>
      </div>
    </div>
  );
}
