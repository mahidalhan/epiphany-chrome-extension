import { describe, expect, test } from 'bun:test';
import { computeFlowScore, type ActivitySignals, type HardwareMetricsSnapshot } from './flowScore';

const baseMetrics = (overrides: Partial<HardwareMetricsSnapshot> = {}): HardwareMetricsSnapshot => ({
  flowScoreBase: 80,
  flowStability: 0.8,
  attentionSpan: 0.8,
  contextSwitchRate: 0.2,
  mentalFatigue: 0.2,
  cognitiveLoad: 0.5,
  noveltySignal: 0.5,
  recoveryNeed: 0.2,
  observedState: 'focus',
  ...overrides,
});

const baseActivity = (overrides: Partial<ActivitySignals> = {}): ActivitySignals => ({
  tabSwitchesPerMin: 1,
  windowMs: 60_000,
  leisureMs: 0,
  communicationMs: 0,
  idleMs: 0,
  ...overrides,
});

describe('computeFlowScore', () => {
  test('clamps result to 0-100', () => {
    const hi = computeFlowScore({
      metrics: baseMetrics({ flowScoreBase: 200, attentionSpan: 1, flowStability: 1 }),
      activity: baseActivity(),
      targetMode: 'focus',
    });
    expect(hi.score).toBe(100);

    const lo = computeFlowScore({
      metrics: baseMetrics({ flowScoreBase: -50, mentalFatigue: 1, contextSwitchRate: 1 }),
      activity: baseActivity({ tabSwitchesPerMin: 50, leisureMs: 60_000, idleMs: 60_000 }),
      targetMode: 'focus',
    });
    expect(lo.score).toBe(0);
  });

  test('penalizes context switching (tab switches + contextSwitchRate)', () => {
    const lowSwitch = computeFlowScore({
      metrics: baseMetrics({ contextSwitchRate: 0.1 }),
      activity: baseActivity({ tabSwitchesPerMin: 1 }),
      targetMode: 'focus',
    });
    const highSwitch = computeFlowScore({
      metrics: baseMetrics({ contextSwitchRate: 1 }),
      activity: baseActivity({ tabSwitchesPerMin: 20 }),
      targetMode: 'focus',
    });
    expect(highSwitch.score).toBeLessThan(lowSwitch.score);
  });

  test('bonuses alignment when observedState matches targetMode', () => {
    const aligned = computeFlowScore({
      metrics: baseMetrics({ observedState: 'creative', flowStability: 1 }),
      activity: baseActivity(),
      targetMode: 'creative',
    });
    const misaligned = computeFlowScore({
      metrics: baseMetrics({ observedState: 'creative', flowStability: 1 }),
      activity: baseActivity(),
      targetMode: 'focus',
    });
    expect(aligned.score).toBeGreaterThan(misaligned.score);
  });
});

