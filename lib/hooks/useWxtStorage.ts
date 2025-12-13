import { useState, useEffect, useCallback } from 'react';
import type { WxtStorageItem } from '@wxt-dev/storage';

/**
 * React hook for WXT storage items.
 *
 * Provides reactive state that syncs with chrome.storage.local.
 * Updates automatically when the storage value changes (even from other contexts).
 *
 * @example
 * const [view, setView] = useWxtStorage(viewMode);
 * // view is 'minimal' | 'dashboard' | null (null while loading)
 */
export function useWxtStorage<T>(
  storageItem: WxtStorageItem<T, Record<string, unknown>>
): [T | null, (value: T) => Promise<void>] {
  const [value, setValue] = useState<T | null>(null);

  // Load initial value
  useEffect(() => {
    let mounted = true;

    storageItem.getValue().then((val) => {
      if (mounted) {
        setValue(val);
      }
    });

    // Watch for changes (from this or other contexts)
    const unwatch = storageItem.watch((newValue) => {
      if (mounted) {
        setValue(newValue);
      }
    });

    return () => {
      mounted = false;
      unwatch();
    };
  }, [storageItem]);

  // Setter function
  const setStorageValue = useCallback(
    async (newValue: T) => {
      await storageItem.setValue(newValue);
      // Value will update via the watcher
    },
    [storageItem]
  );

  return [value, setStorageValue];
}

export default useWxtStorage;
