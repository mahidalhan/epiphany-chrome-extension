/**
 * ShareCTA - Share your score call-to-action button.
 *
 * Design specs from Figma:
 * - Button: bg-[#0059FF], rounded-[36px], px-[20px] py-[8px]
 * - Button text: "Share your score" (Manrope Bold 14px)
 * - Subtext: 12px, rgba(255,255,255,0.6), centered, max-width 153px
 */

interface ShareCTAProps {
  /** Click handler for the share button */
  onShare?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export function ShareCTA({ onShare, className = '' }: ShareCTAProps) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <button
        onClick={onShare}
        className="px-5 py-2 bg-[#0059FF] rounded-[36px] text-white font-bold text-sm font-manrope hover:bg-[#0047CC] transition-colors duration-150"
      >
        Share your score
      </button>
      <p
        className="text-xs text-text-secondary text-center font-manrope"
        style={{ maxWidth: 153 }}
      >
        Let your friends know about your productivity
      </p>
    </div>
  );
}

export default ShareCTA;
