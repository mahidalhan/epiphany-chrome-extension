import { create } from 'zustand';
import type { FlowSummaryData } from '@/types/summary';
import { mockFlowSummary } from '@/lib/mock/static-data';

interface SummaryStoreState {
  summary: FlowSummaryData;
}

interface SummaryStoreActions {
  setSummary: (summary: FlowSummaryData) => void;
}

export type SummaryStore = SummaryStoreState & SummaryStoreActions;

export const useSummaryStore = create<SummaryStore>()((set) => ({
  summary: mockFlowSummary,
  setSummary: (summary) => set({ summary }),
}));

export const selectSummary = (state: SummaryStore) => state.summary;

