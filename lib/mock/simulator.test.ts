import { describe, expect, test } from 'bun:test';
import { FlowSimulator } from './simulator';

describe('FlowSimulator', () => {
  test('is deterministic for a fixed seed', () => {
    const sim1 = new FlowSimulator({ seed: 123, anchorDurationMs: 30_000 });
    const sim2 = new FlowSimulator({ seed: 123, anchorDurationMs: 30_000 });

    const a1 = sim1.tick({ now: 1_000, targetMode: 'focus' });
    const a2 = sim2.tick({ now: 1_000, targetMode: 'focus' });
    expect(Math.round(a1.score)).toBe(Math.round(a2.score));
    expect(a1.timelinePoint.state).toBe(a2.timelinePoint.state);

    const b1 = sim1.tick({ now: 6_000, targetMode: 'focus' });
    const b2 = sim2.tick({ now: 6_000, targetMode: 'focus' });
    expect(Math.round(b1.score)).toBe(Math.round(b2.score));
    expect(b1.timelinePoint.state).toBe(b2.timelinePoint.state);
  });
});

