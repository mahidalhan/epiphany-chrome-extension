import { describe, expect, test } from 'bun:test';
import { retentionCutoffMs } from './activityDb';

describe('retentionCutoffMs', () => {
  test('computes cutoff timestamp in ms', () => {
    const now = 1_700_000_000_000;
    expect(retentionCutoffMs(0, now)).toBe(now);
    expect(retentionCutoffMs(1, now)).toBe(now - 24 * 60 * 60 * 1000);
    expect(retentionCutoffMs(30, now)).toBe(now - 30 * 24 * 60 * 60 * 1000);
  });
});

