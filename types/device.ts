/**
 * Device Types
 *
 * Types for Epiphany headphone device status and connection.
 * Used in Device Card component.
 */

/** Device connection status */
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'pairing';

/** Battery information */
export interface BatteryInfo {
  /** Battery percentage (0-100) */
  percentage: number;
  /** Whether the device is currently charging */
  isCharging?: boolean;
  /** Estimated time remaining in minutes (if discharging) */
  estimatedMinutes?: number;
}

/** Device state for the Epiphany headphones */
export interface DeviceState {
  /** Device name */
  name: string;
  /** Current connection status */
  status: ConnectionStatus;
  /** Battery information (only available when connected) */
  battery?: BatteryInfo;
  /** Last time the device was seen */
  lastSeen?: Date;
  /** Firmware version */
  firmwareVersion?: string;
}

/** Status display configuration */
export const CONNECTION_STATUS_CONFIG: Record<
  ConnectionStatus,
  { label: string; color: string }
> = {
  connected: { label: 'Connected', color: '#16dd62' },
  disconnected: { label: 'Disconnected', color: '#ff4d4d' },
  connecting: { label: 'Connecting...', color: '#f0ad4e' },
  pairing: { label: 'Pairing...', color: '#2E93FF' },
};
