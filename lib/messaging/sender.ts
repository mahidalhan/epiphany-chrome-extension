/**
 * Message Sender Utilities
 *
 * Type-safe wrappers for chrome.runtime.sendMessage.
 * Provides consistent message structure and error handling.
 *
 * Skeleton implementation for Phase 5.
 */

import type { MessageType, MessagePayloads, Message, MessageResponse } from './types';

// =============================================================================
// Send Message to Background
// =============================================================================

/**
 * Send a typed message to the background worker.
 *
 * @param type - Message type
 * @param payload - Typed payload for the message type
 * @returns Promise resolving to the response
 *
 * @example
 * await sendMessage('FLOW_SCORE_UPDATE', { score: 85, trend: 5 });
 */
export async function sendMessage<T extends MessageType>(
  type: T,
  payload: MessagePayloads[T]
): Promise<MessageResponse> {
  const message: Message<T> = {
    type,
    payload,
    timestamp: Date.now(),
    source: 'newtab', // Default source, can be overridden
  };

  try {
    const response = await chrome.runtime.sendMessage(message);
    return response ?? { success: true };
  } catch (error) {
    console.error(`[Messaging] Failed to send ${type}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// =============================================================================
// Convenience Methods
// =============================================================================

/**
 * Send a flow score update
 */
export async function sendFlowScoreUpdate(
  score: number,
  trend?: number
): Promise<MessageResponse> {
  return sendMessage('FLOW_SCORE_UPDATE', { score, trend });
}

/**
 * Send a brain state change
 */
export async function sendBrainStateChange(
  state: MessagePayloads['BRAIN_STATE_CHANGE']['state']
): Promise<MessageResponse> {
  return sendMessage('BRAIN_STATE_CHANGE', { state });
}

export async function sendSessionStart(): Promise<MessageResponse> {
  return sendMessage('SESSION_START', {});
}

export async function sendSessionEnd(): Promise<MessageResponse> {
  return sendMessage('SESSION_END', {});
}

/**
 * Ping the background worker to check if it's alive
 */
export async function pingBackground(): Promise<boolean> {
  const response = await sendMessage('PING', {});
  return response.success;
}

// =============================================================================
// Exports
// =============================================================================

export { sendMessage as default };
