/**
 * Flow Store
 *
 * Zustand store for flow state management.
 * - Flow score persists to chrome.storage.local (per product.md requirement)
 * - Flow entries are transient (Phase 7 will add IndexedDB for 30-day history)
 */

import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import type { FlowScoreData, FlowEntry } from '@/types/flow';
import { mockFlowScore, mockFlowEntries } from '@/lib/mock/static-data';

// =============================================================================
// Chrome Storage Adapter for Zustand Persist
// =============================================================================

/**
 * Custom storage adapter for chrome.storage.local
 * Zustand's persist middleware expects a synchronous-looking API,
 * but chrome.storage is async. The middleware handles this gracefully.
 */
const chromeStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const result = await chrome.storage.local.get(name);
    return result[name] ?? null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await chrome.storage.local.set({ [name]: value });
  },
  removeItem: async (name: string): Promise<void> => {
    await chrome.storage.local.remove(name);
  },
};

// =============================================================================
// Flow Store Types
// =============================================================================

interface FlowStoreState {
  /** Current flow score data */
  score: number;
  /** Trend compared to yesterday (-100 to +100) */
  trend: number;
  /** Timestamp of last score update */
  lastUpdated: number;
  /** Flow entries for current session */
  entries: FlowEntry[];
  /** Whether the store has been hydrated from storage */
  _hasHydrated: boolean;
}

interface FlowStoreActions {
  /** Update the flow score */
  setScore: (score: number, trend?: number) => void;
  /** Add a new flow entry */
  addEntry: (entry: FlowEntry) => void;
  /** Update an existing entry by ID */
  updateEntry: (id: string, updates: Partial<FlowEntry>) => void;
  /** Remove an entry by ID */
  removeEntry: (id: string) => void;
  /** Reset entries (for new day) */
  resetEntries: () => void;
  /** Set hydration status */
  setHasHydrated: (state: boolean) => void;
}

type FlowStore = FlowStoreState & FlowStoreActions;

// =============================================================================
// Initial State (from mock data)
// =============================================================================

const initialState: FlowStoreState = {
  score: mockFlowScore.score,
  trend: mockFlowScore.trend ?? 0,
  lastUpdated: Date.now(),
  entries: mockFlowEntries,
  _hasHydrated: false,
};

// =============================================================================
// Store Creation
// =============================================================================

export const useFlowStore = create<FlowStore>()(
  persist(
    (set, _get) => ({
      ...initialState,

      setScore: (score, trend) =>
        set({
          score: Math.max(0, Math.min(100, score)), // Clamp 0-100
          trend: trend ?? 0,
          lastUpdated: Date.now(),
        }),

      addEntry: (entry) =>
        set((state) => ({
          entries: [entry, ...state.entries],
        })),

      updateEntry: (id, updates) =>
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id ? { ...entry, ...updates } : entry
          ),
        })),

      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        })),

      resetEntries: () =>
        set({ entries: [] }),

      setHasHydrated: (state) =>
        set({ _hasHydrated: state }),
    }),
    {
      name: 'epiphany-flow-store',
      storage: createJSONStorage(() => chromeStorage),
      // Only persist score-related data, not entries (Phase 7 will use IndexedDB)
      partialize: (state) => ({
        score: state.score,
        trend: state.trend,
        lastUpdated: state.lastUpdated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// =============================================================================
// Selectors (for fine-grained subscriptions)
// =============================================================================

export const selectFlowScore = (state: FlowStore): FlowScoreData => ({
  score: state.score,
  trend: state.trend,
  lastUpdated: new Date(state.lastUpdated),
});

export const selectFlowEntries = (state: FlowStore): FlowEntry[] => state.entries;

export const selectActiveEntry = (state: FlowStore): FlowEntry | undefined =>
  state.entries.find((entry) => entry.isActive);

export const selectHasHydrated = (state: FlowStore): boolean => state._hasHydrated;
