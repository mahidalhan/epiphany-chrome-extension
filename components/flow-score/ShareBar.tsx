/**
 * ShareBar - Row of overlapping social media icons.
 *
 * Design specs from Figma:
 * - Icons: LinkedIn, X, Instagram, Reddit, WhatsApp (14x14px)
 * - Each icon: bg-[#181818], border-[0.5px] border-white/20, rounded-full, p-[6px]
 * - Overlap: -8px margin-right between icons
 */

import { OverlappingIcons } from '@/components/shared/OverlappingIcons';

// SVG imports - all optimized with SVGO
import LinkedInIcon from '@/assets/icons/social/linkedin.svg?react';
import XIcon from '@/assets/icons/social/x.svg?react';
import InstagramIcon from '@/assets/icons/social/instagram.svg?react';
import RedditIcon from '@/assets/icons/social/reddit.svg?react';
import WhatsAppIcon from '@/assets/icons/social/whatsapp.svg?react';

interface ShareBarProps {
  /** Additional CSS classes */
  className?: string;
}

export function ShareBar({ className = '' }: ShareBarProps) {
  const icons = [
    {
      key: 'linkedin',
      icon: <LinkedInIcon className="w-3.5 h-3.5" />,
      alt: 'Share on LinkedIn',
    },
    {
      key: 'x',
      icon: <XIcon className="w-3.5 h-3.5" />,
      alt: 'Share on X',
    },
    {
      key: 'instagram',
      icon: <InstagramIcon className="w-3.5 h-3.5" />,
      alt: 'Share on Instagram',
    },
    {
      key: 'reddit',
      icon: <RedditIcon className="w-3.5 h-3.5" />,
      alt: 'Share on Reddit',
    },
    {
      key: 'whatsapp',
      icon: <WhatsAppIcon className="w-3.5 h-3.5" />,
      alt: 'Share on WhatsApp',
    },
  ];

  return (
    <OverlappingIcons
      icons={icons}
      size={14}
      overlap={8}
      className={`justify-center ${className}`}
    />
  );
}

export default ShareBar;
