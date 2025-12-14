/**
 * Message Types for Chrome Runtime Messaging
 *
 * Typed message definitions for communication between:
 * - newtab ↔ background worker
 * - popup ↔ background worker
 *
 * Skeleton implementation for Phase 5.
 * Full message handling comes in Phase 6 (activity tracking) and Phase 8 (BLE).
 */

import type { FlowState } from '@/types/flow';
import type { ConnectionStatus, BatteryInfo } from '@/types/device';
import type { TimelinePoint } from '@/types/session';
import type { FlowSummaryData } from '@/types/summary';

// =============================================================================
// Message Types
// =============================================================================

/**
 * All possible message types in the system.
 * Each type corresponds to a specific action or data update.
 */
export type MessageType =
  // Flow state messages
  | 'FLOW_SCORE_UPDATE'
  | 'BRAIN_STATE_CHANGE'
  | 'FLOW_ENTRY_ADD'
  // Session messages (Phase 7)
  | 'SESSION_START'
  | 'SESSION_END'
  // Flow AI messages (Phase 7)
  | 'FLOW_SUMMARY_UPDATE'
  // Device messages (Phase 8)
  | 'DEVICE_STATUS_UPDATE'
  | 'DEVICE_BATTERY_UPDATE'
  | 'DEVICE_CONNECT'
  | 'DEVICE_DISCONNECT'
  // Activity messages (Phase 6)
  | 'ACTIVITY_LOG'
  | 'TIMELINE_UPDATE'
  // System messages
  | 'PING'
  | 'PONG';

// =============================================================================
// Message Payloads
// =============================================================================

/**
 * Payload type mapping for each message type.
 * Ensures type safety when sending/receiving messages.
 */
export interface MessagePayloads {
  // Flow state
  FLOW_SCORE_UPDATE: {
    score: number;
    trend?: number;
  };
  BRAIN_STATE_CHANGE: {
    state: FlowState;
  };
  FLOW_ENTRY_ADD: {
    id: string;
    state: FlowState;
    title: string;
    description: string;
    startTime: number; // timestamp
  };

  // Session (Phase 7)
  SESSION_START: Record<string, never>;
  SESSION_END: Record<string, never>;
  FLOW_SUMMARY_UPDATE: {
    summary: FlowSummaryData;
  };

  // Device (Phase 8)
  DEVICE_STATUS_UPDATE: {
    status: ConnectionStatus;
  };
  DEVICE_BATTERY_UPDATE: {
    battery: BatteryInfo;
  };
  DEVICE_CONNECT: {
    deviceId: string;
  };
  DEVICE_DISCONNECT: Record<string, never>; // empty payload

  // Activity (Phase 6)
  ACTIVITY_LOG: {
    url: string;
    category: 'work' | 'leisure' | 'communication' | 'unknown';
    timestamp: number;
  };
  TIMELINE_UPDATE: {
    point: TimelinePoint;
  };

  // System
  PING: Record<string, never>;
  PONG: {
    timestamp: number;
  };
}

// =============================================================================
// Message Interface
// =============================================================================

/**
 * Typed message structure for chrome.runtime.sendMessage
 */
export interface Message<T extends MessageType = MessageType> {
  /** Message type identifier */
  type: T;
  /** Typed payload based on message type */
  payload: MessagePayloads[T];
  /** Message timestamp */
  timestamp: number;
  /** Optional source context */
  source?: 'newtab' | 'popup' | 'background' | 'content';
}

// =============================================================================
// Response Types
// =============================================================================

/**
 * Standard response format for message handlers
 */
export interface MessageResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// =============================================================================
// Type Guards
// =============================================================================

/**
 * Type guard to check if a value is a valid Message
 */
export function isMessage(value: unknown): value is Message {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    'payload' in value &&
    'timestamp' in value
  );
}

/**
 * Type guard for specific message types
 */
export function isMessageType<T extends MessageType>(
  message: Message,
  type: T
): message is Message<T> {
  return message.type === type;
}
