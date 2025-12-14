import { describe, expect, test } from 'bun:test';
import { buildFlowAiUserPrompt } from './prompt';

describe('buildFlowAiUserPrompt', () => {
  test('includes key context fields', () => {
    const prompt = buildFlowAiUserPrompt({
      sessionActive: true,
      targetMode: 'focus',
      observedState: 'focus',
      score: 87,
      direction: 'problem-solving',
      insight: 'test insight',
      suggestedNextTask: 'test next task',
      activity: { tabSwitchesPerMin: 3, windowMs: 60_000, leisureMs: 1_000, communicationMs: 2_000, idleMs: 0 },
    });

    expect(prompt).toContain('targetMode');
    expect(prompt).toContain('observedState');
    expect(prompt).toContain('tabSwitchesPerMin');
    expect(prompt).toContain('suggestedNextTask');
  });
});

