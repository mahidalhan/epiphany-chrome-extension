/**
 * SearchBar - A pill-shaped search input with voice and AI assistant icons.
 *
 * Design Specs (from Figma node 9:302):
 * - Background: rgba(28,31,36,0.8)
 * - Border: 1px solid rgba(255,255,255,0.2)
 * - Border radius: 60px (pill shape)
 * - Padding: 8px all sides
 * - Width: 568px (fixed), Height: 40px
 * - Layout: Two groups with justify-between
 * - Voice icon: Waveform bars (not microphone)
 * - AI icon: Filled circle with inner dot (not sun)
 *
 * Phase 2: Placeholder only (no search functionality)
 */
export function SearchBar() {
  return (
    <div
      className="flex items-center justify-between rounded-[60px] p-2 w-[568px] h-10"
      style={{
        backgroundColor: 'rgba(28, 31, 36, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      {/* Left group: Search icon + placeholder text */}
      <div className="flex items-center gap-2">
        <SearchIcon className="h-6 w-6 text-[#555] shrink-0" />
        <span className="text-base text-[#555] tracking-[0.32px] font-normal">
          Search Anything
        </span>
      </div>

      {/* Right group: Voice waveform + AI circle icons */}
      <div className="flex items-center gap-1">
        <button
          disabled
          className="text-[#555] cursor-not-allowed"
          aria-label="Voice search (coming soon)"
        >
          <VoiceWaveformIcon className="h-6 w-6" />
        </button>
        <button
          disabled
          className="text-[#007bff] cursor-not-allowed"
          aria-label="AI assistant (coming soon)"
        >
          <AICircleIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

/**
 * Voice waveform icon - matches Figma SF Symbol 􀙫
 * Three vertical bars representing audio waveform
 */
function VoiceWaveformIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      {/* Three waveform bars */}
      <rect x="4" y="8" width="2" height="8" rx="1" />
      <rect x="11" y="4" width="2" height="16" rx="1" />
      <rect x="18" y="6" width="2" height="12" rx="1" />
    </svg>
  );
}

/**
 * AI assistant circle icon - matches Figma SF Symbol 􀁷
 * Filled circle with inner dot (like a record button)
 */
function AICircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      {/* Outer circle (stroke) */}
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
      {/* Inner filled dot */}
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

export default SearchBar;
