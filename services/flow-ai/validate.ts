import type { FlowAiSummaryResponse } from './prompt';

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function parseFlowAiSummaryResponse(text: string): FlowAiSummaryResponse | null {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return null;
  }

  if (!isObject(json)) return null;
  if (!('flowSummary' in json)) return null;
  const flowSummary = (json as any).flowSummary;
  if (!isObject(flowSummary)) return null;

  // Minimal structural checks (keep lightweight; strict validation later).
  if (typeof flowSummary.flowDuration !== 'string') return null;
  if (typeof flowSummary.flowHours !== 'number') return null;
  if (typeof flowSummary.flowMinutes !== 'number') return null;
  if (typeof flowSummary.distractionDuration !== 'string') return null;
  if (!Array.isArray(flowSummary.distractionSources)) return null;

  return json as FlowAiSummaryResponse;
}

