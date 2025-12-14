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
 *
 * State: Reads from useDeviceStore (Zustand)
 */

import { Headphones, Battery } from 'lucide-react';
import { Card } from '@/components/card/Card';
import { CONNECTION_STATUS_CONFIG } from '@/types/device';
import { useDeviceStore } from '@/stores';
import type { DeviceStore } from '@/stores/device';

// Stable selectors outside component to prevent re-subscription loops
const selectName = (state: DeviceStore) => state.name;
const selectStatus = (state: DeviceStore) => state.status;
const selectBattery = (state: DeviceStore) => state.battery;

export function DeviceCard() {
  const name = useDeviceStore(selectName);
  const status = useDeviceStore(selectStatus);
  const battery = useDeviceStore(selectBattery);
  const device = { name, status, battery };
  const statusConfig = CONNECTION_STATUS_CONFIG[device.status];
  const isConnected = device.status === 'connected';

  return (
    <Card>
      <div className="flex items-center justify-between gap-8">
        {/* Device Info */}
        <div className="flex flex-col gap-2">
          {/* Device Label */}
          <div className="flex items-center gap-2">
            <Headphones className="w-[19px] h-[19px] text-white" />
            <span className="text-xs text-white font-manrope">{device.name}</span>
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
          {isConnected && device.battery && (
            <div className="flex items-center gap-1 text-[#767676]">
              <Battery className="w-4 h-4" />
              <span className="text-xs font-light font-manrope">
                {device.battery.percentage}% battery
              </span>
            </div>
          )}
        </div>

        {/* Headphone Image Placeholder with Gradient Fade */}
        <div className="relative w-[120px] h-[123px] overflow-hidden rounded-lg">
          {/* Placeholder gradient (actual headphone image will come from design assets) */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
            }}
          />
          {/* Headphone icon placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Headphones className="w-12 h-12 text-white/20" />
          </div>
          {/* Gradient overlay (fades into card background) */}
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
