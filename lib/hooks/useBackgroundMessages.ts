import { useEffect } from 'react';
import { isMessage, isMessageType } from '@/lib/messaging';
import { useFlowStore } from '@/stores/flow';
import { useActivityStore } from '@/stores/activity';
import { useDeviceStore } from '@/stores/device';
import { useSummaryStore } from '@/stores/summary';

/**
 * Subscribe to background runtime messages and apply them to stores.
 * This keeps UI components simple: they just render from Zustand/WXT storage.
 */
export function useBackgroundMessages() {
  useEffect(() => {
    const listener: Parameters<typeof chrome.runtime.onMessage.addListener>[0] = (
      message
    ) => {
      if (!isMessage(message)) return;

      if (isMessageType(message, 'FLOW_SCORE_UPDATE')) {
        useFlowStore.getState().setScore(message.payload.score, message.payload.trend);
        return;
      }

      if (isMessageType(message, 'TIMELINE_UPDATE')) {
        useActivityStore.getState().addTimelinePoint(message.payload.point);
        return;
      }

      if (isMessageType(message, 'FLOW_ENTRY_ADD')) {
        const flow = useFlowStore.getState();
        const prevActive = flow.entries.find((e) => e.isActive);
        if (prevActive) {
          flow.updateEntry(prevActive.id, {
            isActive: false,
            endTime: new Date(message.payload.startTime),
            progress: 100,
          });
        }

        flow.addEntry({
          id: message.payload.id,
          state: message.payload.state,
          title: message.payload.title,
          description: message.payload.description,
          startTime: new Date(message.payload.startTime),
          endTime: undefined,
          progress: 0,
          isActive: true,
        });
        return;
      }

      if (isMessageType(message, 'DEVICE_BATTERY_UPDATE')) {
        useDeviceStore.getState().setBattery(message.payload.battery);
        return;
      }

      if (isMessageType(message, 'FLOW_SUMMARY_UPDATE')) {
        useSummaryStore.getState().setSummary(message.payload.summary);
        return;
      }
    };

    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, []);
}

