import type { FlowState } from '@/types/flow';

export interface HardwareMetricsSnapshot {
  /**
   * Hardware / model-provided baseline 0–100.
   * In Phase 7 sim, this is driven by the dataset anchor points.
   */
  flowScoreBase: number;

  /** 0–1: higher means more stable flow */
  flowStability: number;
  /** 0–1: higher means longer attention span */
  attentionSpan: number;
  /** 0–1: higher means more context switching */
  contextSwitchRate: number;
  /** 0–1: higher means more fatigue */
  mentalFatigue: number;
  /** 0–1: higher means more cognitive load */
  cognitiveLoad: number;
  /** 0–1: higher means more novelty/creativity signal */
  noveltySignal: number;
  /** 0–1: higher means stronger need for recovery */
  recoveryNeed: number;

  /** Observed dominant state (from hardware/sim). */
  observedState: FlowState;
}

export interface ActivitySignals {
  /** Rolling tab switches per minute (context switching proxy). */
  tabSwitchesPerMin: number;
  /** Rolling window duration for this sample (ms). */
  windowMs: number;
  /** Rolling leisure time in window (ms). */
  leisureMs: number;
  /** Rolling communication time in window (ms). */
  communicationMs: number;
  /** Rolling idle/locked time in window (ms). */
  idleMs: number;
}

export interface FlowScoreBreakdown {
  baseline: number;
  bonusAttention: number;
  bonusAlignment: number;
  penaltyContextSwitching: number;
  penaltyLeisure: number;
  penaltyIdle: number;
  penaltyFatigue: number;
}

export interface FlowScoreResult {
  score: number;
  trend: number;
  breakdown: FlowScoreBreakdown;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function clamp01(n: number): number {
  return clamp(n, 0, 1);
}

/**
 * Phase 7 scoring:
 * - Treat the dataset/hardware `flowScoreBase` as the baseline.
 * - Adjust based on observed “how much actual focus” signals:
 *   - context switching (tabs/min + contextSwitchRate)
 *   - leisure/comm time while in session
 *   - idle time while in session
 * - Add a small bonus when observed state aligns with the user-selected target mode.
 *
 * This is intentionally simple + deterministic so we can tune weights later.
 */
export function computeFlowScore(params: {
  metrics: HardwareMetricsSnapshot;
  activity: ActivitySignals;
  targetMode: FlowState;
  previousScore?: number;
}): FlowScoreResult {
  const baseline = clamp(params.metrics.flowScoreBase, 0, 100);

  // Bonuses
  const bonusAttention = clamp01(params.metrics.attentionSpan) * 5;
  const alignment = params.metrics.observedState === params.targetMode ? 1 : 0;
  const bonusAlignment = alignment * clamp01(params.metrics.flowStability) * 5;

  // Penalties
  // Tab switches/min: after ~10/min, treat as max penalty.
  const penaltyContextSwitching =
    clamp01(params.activity.tabSwitchesPerMin / 10) * 8 +
    clamp01(params.metrics.contextSwitchRate) * 6;

  const windowMs = Math.max(1, params.activity.windowMs);
  const leisureRatio = clamp01(params.activity.leisureMs / windowMs);
  const commRatio = clamp01(params.activity.communicationMs / windowMs);
  const idleRatio = clamp01(params.activity.idleMs / windowMs);

  // Leisure is more harmful than communication; both reduce “actual focus”.
  const penaltyLeisure = leisureRatio * 15 + commRatio * 6;
  const penaltyIdle = idleRatio * 20;
  const penaltyFatigue = clamp01(params.metrics.mentalFatigue) * 10;

  const raw =
    baseline +
    bonusAttention +
    bonusAlignment -
    penaltyContextSwitching -
    penaltyLeisure -
    penaltyIdle -
    penaltyFatigue;

  const score = clamp(raw, 0, 100);
  const trend = params.previousScore === undefined ? 0 : clamp(score - params.previousScore, -100, 100);

  return {
    score,
    trend,
    breakdown: {
      baseline,
      bonusAttention,
      bonusAlignment,
      penaltyContextSwitching,
      penaltyLeisure,
      penaltyIdle,
      penaltyFatigue,
    },
  };
}

