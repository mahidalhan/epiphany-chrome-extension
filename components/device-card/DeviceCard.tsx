/**
 * DeviceCard - Epiphany headphones status card with image.
 *
 * Design specs from Figma:
 * - Container: Standard card styling, gap-[32px] between content and image
 * - Headphone Icon: Lucide Headphones (19px, white) for label
 * - Label: "Epiphany Headphones" (Manrope Regular 12px, white)
 * - Status Row: gap-[4px]
 *   - Green dot: 6x6px circle (#16dd62)
 *   - "Connected" text: Manrope Regular 14px, #16dd62
 * - Battery Row: gap-[4px], color #767676
 *   - Lucide Battery icon (16px)
 *   - "87% battery": Manrope Light 12px
 * - Headphone Image: 120x123px container with gradient fade overlay
 */

import { Headphones, Battery } from 'lucide-react';
import { Card } from '@/components/card/Card';
import type { DeviceState } from '@/types/device';
import { CONNECTION_STATUS_CONFIG } from '@/types/device';

// SVG import for headphone illustration
import HeadphoneImage from '@/assets/icons/misc/headphone.svg?react';

interface DeviceCardProps {
  /** Device state data */
  data: DeviceState;
}

export function DeviceCard({ data }: DeviceCardProps) {
  const statusConfig = CONNECTION_STATUS_CONFIG[data.status];
  const isConnected = data.status === 'connected';

  return (
    <Card>
      <div className="flex items-center justify-between gap-8">
        {/* Device Info */}
        <div className="flex flex-col gap-2">
          {/* Device Label */}
          <div className="flex items-center gap-2">
            <Headphones className="w-[19px] h-[19px] text-white" />
            <span className="text-xs text-white font-manrope">{data.name}</span>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-1">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: statusConfig.color }}
            />
            <span
              className="text-sm font-manrope"
              style={{ color: statusConfig.color }}
            >
              {statusConfig.label}
            </span>
          </div>

          {/* Battery Status (only when connected) */}
          {isConnected && data.battery && (
            <div className="flex items-center gap-1 text-[#767676]">
              <Battery className="w-4 h-4" />
              <span className="text-xs font-light font-manrope">
                {data.battery.percentage}% battery
              </span>
            </div>
          )}
        </div>

        {/* Headphone Image with Gradient Fade */}
        <div className="relative w-[120px] h-[123px] overflow-hidden">
          {/* Headphone SVG illustration */}
          <HeadphoneImage className="absolute inset-0 w-full h-full object-contain" />

          {/* Gradient overlay (fades image into card background) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to left, rgba(24,24,24,0) 0%, rgba(24,24,24,1) 100%)',
            }}
          />
        </div>
      </div>
    </Card>
  );
}

export default DeviceCard;
