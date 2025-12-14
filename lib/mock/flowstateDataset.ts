import type { FlowState } from '@/types/flow';

export type FlowStabilityLabel = 'low' | 'medium' | 'high' | 'very_high';
export type AttentionSpanLabel = 'short' | 'medium' | 'long' | 'very_long';
export type ContextSwitchLabel = 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
export type MentalFatigueLabel = 'low' | 'medium' | 'high' | 'very_low' | 'very_high';

export interface FlowstateAnchor {
  flowScoreBase: number;
  observedState: FlowState;
  brainStateDirection: string;
  brainStateInsight: string;

  flowStability: FlowStabilityLabel;
  attentionSpan: AttentionSpanLabel;
  contextSwitching: ContextSwitchLabel;
  mentalFatigue: MentalFatigueLabel;

  howToUseThisState: string[];
  whatToAvoid: string[];
  suggestedNextTask: string;
}

/**
 * One-person seed dataset derived from `docs/product/flowstate-dataset.md`.
 * We keep this small + hand-tuned for Phase 7 simulation.
 */
export const FLOWSTATE_ANCHORS: FlowstateAnchor[] = [
  {
    flowScoreBase: 88,
    observedState: 'focus', // dominant_brain_state: analytical
    brainStateDirection: 'problem-solving',
    brainStateInsight: 'Your brain is optimized for logic, sequencing, and decision-making.',
    flowStability: 'high',
    attentionSpan: 'long',
    contextSwitching: 'low',
    mentalFatigue: 'low',
    howToUseThisState: [
      'Work on tasks with clear inputs and outputs',
      'Make decisions that require comparison or evaluation',
      'Finish partially completed analytical tasks',
    ],
    whatToAvoid: ['Open-ended brainstorming', 'Emotional or ambiguous conversations'],
    suggestedNextTask: 'Finalize financial review or debug a system issue',
  },
  {
    flowScoreBase: 76,
    observedState: 'creative',
    brainStateDirection: 'idea generation',
    brainStateInsight: 'Your brain is forming novel connections and exploring possibilities.',
    flowStability: 'medium',
    attentionSpan: 'medium',
    contextSwitching: 'medium',
    mentalFatigue: 'low',
    howToUseThisState: [
      'Generate ideas without judging them',
      'Explore new directions or concepts',
      'Write freely without editing',
    ],
    whatToAvoid: ['Editing or refining', 'Highly structured tasks'],
    suggestedNextTask: 'Brainstorm ideas for a new feature or draft a LinkedIn post',
  },
  {
    flowScoreBase: 55,
    observedState: 'recovery',
    brainStateDirection: 'cognitive reset',
    brainStateInsight: 'Your brain needs reduced load to restore focus and energy.',
    flowStability: 'low',
    attentionSpan: 'short',
    contextSwitching: 'high',
    mentalFatigue: 'medium',
    howToUseThisState: [
      'Do low-effort or routine tasks',
      'Allow mental space with light movement',
      'Prepare your environment for the next focus block',
    ],
    whatToAvoid: ['Deep work', 'Decision-heavy tasks'],
    suggestedNextTask: 'Organize workspace or take a short walk',
  },
  {
    flowScoreBase: 93,
    observedState: 'creative',
    brainStateDirection: 'creative execution',
    brainStateInsight: 'Your brain is not just generating ideas but actively building them.',
    flowStability: 'very_high',
    attentionSpan: 'very_long',
    contextSwitching: 'very_low',
    mentalFatigue: 'very_low',
    howToUseThisState: [
      'Create or design something end-to-end',
      'Write long-form content',
      'Build core product or strategy elements',
    ],
    whatToAvoid: ['Interruptions', 'Switching tasks'],
    suggestedNextTask: 'Create a product spec or write a long-form article',
  },
  {
    flowScoreBase: 69,
    observedState: 'focus', // dominant_brain_state: analytical
    brainStateDirection: 'planning',
    brainStateInsight: 'Your brain is well-suited for structuring and prioritization.',
    flowStability: 'medium',
    attentionSpan: 'medium',
    contextSwitching: 'low',
    mentalFatigue: 'medium',
    howToUseThisState: ['Break projects into steps', 'Plan timelines or workflows', 'Review and prioritize tasks'],
    whatToAvoid: ['Creative exploration', 'High-pressure execution'],
    suggestedNextTask: 'Plan the next sprint or outline a document',
  },
];

