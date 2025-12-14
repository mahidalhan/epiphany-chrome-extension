import { describe, expect, test } from 'bun:test';
import { parseFlowAiSummaryResponse } from './validate';

describe('parseFlowAiSummaryResponse', () => {
  test('accepts a minimally valid JSON payload', () => {
    const ok = parseFlowAiSummaryResponse(
      JSON.stringify({
        flowSummary: {
          flowDuration: '1h 0m',
          flowHours: 1,
          flowMinutes: 0,
          distractionDuration: '0m',
          distractionSources: [],
        },
      })
    );
    expect(ok).not.toBeNull();
  });

  test('rejects non-JSON', () => {
    expect(parseFlowAiSummaryResponse('not json')).toBeNull();
  });
});

