import { SearchBar } from '@/components/search-bar/SearchBar';
import { DashboardButton } from '@/components/cta-button/DashboardButton';
import { EpiphanyLogo } from '@/components/logo/EpiphanyLogo';

/**
 * MinimalView - The instant-loading new tab view (<50ms first paint).
 *
 * Layout (from Figma 9:240):
 * ┌─────────────────────────────────────────────────┐
 * │                                                 │
 * │                                                 │
 * │              [EpiphanyLogo]                     │
 * │                   ↓                             │
 * │              [SearchBar]                        │
 * │                                                 │
 * │                                                 │
 * │           [DashboardButton]        (near bottom)│
 * └─────────────────────────────────────────────────┘
 *
 * Brain State toggle moved to Chrome toolbar (post-v1 enhancement)
 * Background: Dark gradient with noise overlay (from main.css .noise-overlay)
 */
export function MinimalView() {
  return (
    <div className="min-h-screen bg-bg-primary noise-overlay relative">
      {/* Main Content - Logo and Search centered */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 pb-32">
        {/* Logo */}
        <EpiphanyLogo />

        {/* Gap between logo and search - matches Figma ~55px */}
        <div className="h-14" />

        {/* Search Bar */}
        <SearchBar />
      </div>

      {/* Dashboard CTA - Fixed near bottom */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
        <DashboardButton />
      </div>
    </div>
  );
}

export default MinimalView;
