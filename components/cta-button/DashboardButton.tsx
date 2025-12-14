import { viewMode } from '@/stores/view';

/**
 * DashboardButton - Golden CTA button to navigate to the Dashboard view.
 *
 * Design Specs (from Figma node 9:309):
 * - Background: linear-gradient(to bottom, #000000, #262626)
 * - Border: 2px solid #fcf6d1 (golden)
 * - Border radius: 1000px (full pill)
 * - Box shadow: 0px 0px 40px 8px rgba(255,153,0,0.2) (orange glow)
 * - Padding: 8px 20px
 * - Text: rgba(255,255,255,0.54), Manrope SemiBold 16px
 *
 * Note: We call viewMode.setValue() directly instead of using useWxtStorage
 * to avoid creating a duplicate storage watcher that could interfere with
 * the view switching flow in App.tsx.
 */
export function DashboardButton() {
  // Navigate to dashboard - call storage directly to avoid duplicate watcher
  const handleClick = () => {
    viewMode.setValue('dashboard');
  };

  return (
    <button
      onClick={handleClick}
      className="group flex items-center gap-3 rounded-full px-5 py-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
      style={{
        background: 'linear-gradient(to bottom, #000000, #262626)',
        border: '2px solid #fcf6d1',
        boxShadow: '0px 0px 40px 8px rgba(255, 153, 0, 0.2)',
      }}
    >
      <ChevronDownIcon className="h-6 w-6 text-white/80 group-hover:text-white transition-colors duration-150 shrink-0" />
      <span className="text-[rgba(255,255,255,0.54)] group-hover:text-white/80 text-base font-semibold transition-colors duration-150">
        Go to Dashboard
      </span>
    </button>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default DashboardButton;
