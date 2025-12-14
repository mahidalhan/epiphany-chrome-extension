/**
 * Device Store
 *
 * Zustand store for Epiphany headphone device state.
 * In-memory only (no persistence) - device state comes from BLE in Phase 8.
 * Initialized with mock data for visual development.
 */

import { create } from 'zustand';
import type { DeviceState, ConnectionStatus, BatteryInfo } from '@/types/device';
import { mockDevice } from '@/lib/mock/static-data';

// =============================================================================
// Device Store Types
// =============================================================================

interface DeviceStoreState extends DeviceState {
  /** Last time battery was polled */
  lastBatteryPoll: number | null;
}

interface DeviceStoreActions {
  /** Update connection status */
  setStatus: (status: ConnectionStatus) => void;
  /** Update battery information */
  setBattery: (battery: BatteryInfo) => void;
  /** Update device name */
  setName: (name: string) => void;
  /** Mark device as disconnected */
  disconnect: () => void;
  /** Full device state update (from BLE) */
  updateDevice: (device: Partial<DeviceState>) => void;
}

export type DeviceStore = DeviceStoreState & DeviceStoreActions;

// =============================================================================
// Initial State (from mock data)
// =============================================================================

const initialState: DeviceStoreState = {
  name: mockDevice.name,
  status: mockDevice.status,
  battery: mockDevice.battery,
  lastSeen: new Date(),
  firmwareVersion: mockDevice.firmwareVersion,
  lastBatteryPoll: Date.now(),
};

// =============================================================================
// Store Creation
// =============================================================================

export const useDeviceStore = create<DeviceStore>()((set) => ({
  ...initialState,

  setStatus: (status) =>
    set({
      status,
      lastSeen: status === 'connected' ? new Date() : undefined,
    }),

  setBattery: (battery) =>
    set({
      battery,
      lastBatteryPoll: Date.now(),
    }),

  setName: (name) =>
    set({ name }),

  disconnect: () =>
    set({
      status: 'disconnected',
      battery: undefined,
    }),

  updateDevice: (device) =>
    set((state) => ({
      ...state,
      ...device,
      lastSeen: device.status === 'connected' ? new Date() : state.lastSeen,
    })),
}));

// =============================================================================
// Selectors
// =============================================================================

export const selectDeviceState = (state: DeviceStore): DeviceState => ({
  name: state.name,
  status: state.status,
  battery: state.battery,
  lastSeen: state.lastSeen,
  firmwareVersion: state.firmwareVersion,
});

export const selectIsConnected = (state: DeviceStore): boolean =>
  state.status === 'connected';

export const selectBatteryPercentage = (state: DeviceStore): number | null =>
  state.battery?.percentage ?? null;
