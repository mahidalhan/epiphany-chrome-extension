import type { FlowState } from '@/types/flow';
import type { TimelinePoint } from '@/types/session';
import { computeFlowScore, type ActivitySignals, type HardwareMetricsSnapshot } from '@/lib/scoring/flowScore';
import { FLOWSTATE_ANCHORS, type FlowstateAnchor } from './flowstateDataset';

export interface SimulatorConfig {
  seed: number;
  /** How long to spend (ms) interpolating across one anchor before moving to next. */
  anchorDurationMs: number;
}

export interface SimulatorTick {
  now: number;
  targetMode: FlowState;
}

export interface SimulatorOutput {
  metrics: HardwareMetricsSnapshot;
  activity: ActivitySignals;
  score: number;
  trend: number;
  timelinePoint: TimelinePoint;
  /**
   * Emits when observed state transitions. UI can end the previous entry locally.
   */
  entryStart?: {
    id: string;
    state: FlowState;
    title: string;
    description: string;
    startTime: number;
  };
  anchor: FlowstateAnchor;
}

type Rng = {
  nextFloat: () => number;
  nextInt: (maxExclusive: number) => number;
};

function makeRng(seed: number): Rng {
  // Deterministic LCG (good enough for UI simulation).
  let s = (seed >>> 0) || 1;
  const nextFloat = () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
  return {
    nextFloat,
    nextInt: (maxExclusive) => Math.floor(nextFloat() * (maxExclusive <= 1 ? 1 : maxExclusive)),
  };
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function mapStability(label: FlowstateAnchor['flowStability']): number {
  if (label === 'very_high') return 0.95;
  if (label === 'high') return 0.8;
  if (label === 'medium') return 0.6;
  return 0.3;
}

function mapAttention(label: FlowstateAnchor['attentionSpan']): number {
  if (label === 'very_long') return 0.95;
  if (label === 'long') return 0.8;
  if (label === 'medium') return 0.55;
  return 0.25;
}

function mapContextSwitching(label: FlowstateAnchor['contextSwitching']): number {
  if (label === 'very_low') return 0.1;
  if (label === 'low') return 0.2;
  if (label === 'medium') return 0.5;
  if (label === 'high') return 0.85;
  return 0.95;
}

function mapFatigue(label: FlowstateAnchor['mentalFatigue']): number {
  if (label === 'very_low') return 0.1;
  if (label === 'low') return 0.2;
  if (label === 'medium') return 0.55;
  if (label === 'high') return 0.8;
  return 0.95;
}

function inferSignals(anchor: FlowstateAnchor): Pick<
  HardwareMetricsSnapshot,
  'cognitiveLoad' | 'noveltySignal' | 'recoveryNeed'
> {
  if (anchor.observedState === 'creative') {
    return { cognitiveLoad: 0.35, noveltySignal: 0.85, recoveryNeed: 0.2 };
  }
  if (anchor.observedState === 'focus') {
    return { cognitiveLoad: 0.8, noveltySignal: 0.25, recoveryNeed: 0.25 };
  }
  return { cognitiveLoad: 0.25, noveltySignal: 0.2, recoveryNeed: 0.85 };
}

export class FlowSimulator {
  private rng: Rng;
  private anchors: FlowstateAnchor[];
  private anchorIdx = 0;
  private anchorStartTs = 0;
  private lastObservedState: FlowState | null = null;
  private prevScore: number | undefined;
  private lastModeChangeTs = 0;
  private lastTargetMode: FlowState | null = null;

  constructor(private config: SimulatorConfig, anchors: FlowstateAnchor[] = FLOWSTATE_ANCHORS) {
    this.rng = makeRng(config.seed);
    this.anchors = anchors;
  }

  tick(input: SimulatorTick): SimulatorOutput {
    if (this.anchorStartTs === 0) this.anchorStartTs = input.now;

    if (this.lastTargetMode && this.lastTargetMode !== input.targetMode) {
      this.lastModeChangeTs = input.now;
    }
    this.lastTargetMode = input.targetMode;

    // Advance anchor based on elapsed time.
    const elapsed = input.now - this.anchorStartTs;
    if (elapsed >= this.config.anchorDurationMs) {
      this.anchorIdx = (this.anchorIdx + 1) % this.anchors.length;
      this.anchorStartTs = input.now;
    }

    const anchor = this.anchors[this.anchorIdx]!;

    // Observed state tries to align to target mode over time.
    const sinceModeChange = input.now - this.lastModeChangeTs;
    const alignProb = clamp01(0.65 + clamp01(sinceModeChange / 90_000) * 0.25); // 0.65 → 0.90
    const observedState: FlowState =
      this.rng.nextFloat() < alignProb ? input.targetMode : anchor.observedState;

    const inferred = inferSignals(anchor);

    // Add small noise to metrics for “live” feel.
    const noise = () => (this.rng.nextFloat() - 0.5) * 0.08; // ±0.04

    const metrics: HardwareMetricsSnapshot = {
      flowScoreBase: anchor.flowScoreBase + (this.rng.nextFloat() - 0.5) * 4, // ±2 pts
      flowStability: clamp01(mapStability(anchor.flowStability) + noise()),
      attentionSpan: clamp01(mapAttention(anchor.attentionSpan) + noise()),
      contextSwitchRate: clamp01(mapContextSwitching(anchor.contextSwitching) + noise()),
      mentalFatigue: clamp01(mapFatigue(anchor.mentalFatigue) + noise()),
      cognitiveLoad: clamp01(inferred.cognitiveLoad + noise()),
      noveltySignal: clamp01(inferred.noveltySignal + noise()),
      recoveryNeed: clamp01(inferred.recoveryNeed + noise()),
      observedState,
    };

    // Simulated activity signals (rolling 60s window).
    const windowMs = 60_000;
    const tabSwitchesPerMin =
      Math.max(0, Math.round(metrics.contextSwitchRate * 10 + (this.rng.nextFloat() - 0.5) * 2));

    const leisureRatio = clamp01(
      (observedState === 'focus' ? 0.02 : observedState === 'creative' ? 0.06 : 0.12) +
        (this.rng.nextFloat() - 0.5) * 0.04
    );
    const commRatio = clamp01(0.03 + (this.rng.nextFloat() - 0.5) * 0.03);
    const idleRatio = clamp01((observedState === 'recovery' ? 0.12 : 0.03) + (this.rng.nextFloat() - 0.5) * 0.04);

    const activity: ActivitySignals = {
      tabSwitchesPerMin,
      windowMs,
      leisureMs: Math.round(windowMs * leisureRatio),
      communicationMs: Math.round(windowMs * commRatio),
      idleMs: Math.round(windowMs * idleRatio),
    };

    const scoreResult = computeFlowScore({
      metrics,
      activity,
      targetMode: input.targetMode,
      previousScore: this.prevScore,
    });
    this.prevScore = scoreResult.score;

    const timelinePoint: TimelinePoint = {
      timestamp: input.now,
      value: Math.round(scoreResult.score),
      state: observedState,
    };

    let entryStart: SimulatorOutput['entryStart'] | undefined;
    if (this.lastObservedState !== observedState) {
      this.lastObservedState = observedState;
      entryStart = {
        id: `${input.now}-${observedState}`,
        state: observedState,
        title:
          observedState === 'focus'
            ? 'Deep Focus'
            : observedState === 'creative'
              ? 'Creative Flow'
              : 'Active Recovery',
        description:
          observedState === anchor.observedState
            ? `${anchor.brainStateDirection} — ${anchor.suggestedNextTask}`
            : `Aligning to ${input.targetMode} mode`,
        startTime: input.now,
      };
    }

    return {
      metrics,
      activity,
      score: scoreResult.score,
      trend: scoreResult.trend,
      timelinePoint,
      entryStart,
      anchor,
    };
  }
}

