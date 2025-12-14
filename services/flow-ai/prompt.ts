import type { FlowState } from '@/types/flow';
import type { FlowSummaryData } from '@/types/summary';

export interface FlowAiSummaryRequest {
  sessionActive: boolean;
  targetMode: FlowState;
  observedState: FlowState;
  score: number;
  direction: string;
  insight: string;
  suggestedNextTask: string;
  activity: {
    tabSwitchesPerMin: number;
    windowMs: number;
    leisureMs: number;
    communicationMs: number;
    idleMs: number;
  };
}

export interface FlowAiSummaryResponse {
  flowSummary: FlowSummaryData;
  suggestedMode?: FlowState;
  rationale?: string;
}

export const FLOW_AI_SYSTEM_INSTRUCTIONS = [
  'You are Epiphany Flow AI for a browser extension.',
  'Your job is to generate a concise flow summary + optionally suggest a mode.',
  'Output MUST be valid JSON only (no markdown, no backticks).',
  'Do not include extra keys.',
  'Keep text short and concrete.',
].join(' ');

export function buildFlowAiUserPrompt(input: FlowAiSummaryRequest): string {
  const leisureMin = Math.round(input.activity.leisureMs / 60000);
  const commMin = Math.round(input.activity.communicationMs / 60000);
  const idleMin = Math.round(input.activity.idleMs / 60000);

  return [
    'Generate a JSON response with this TypeScript shape:',
    '{',
    '  "flowSummary": {',
    '    "flowDuration": string,',
    '    "flowHours": number,',
    '    "flowMinutes": number,',
    '    "currentTask"?: string,',
    '    "taskDuration"?: string,',
    '    "distractionDuration": string,',
    '    "distractionSources": Array<{ id: string; name: string; iconKey: "x"|"reddit"|"youtube"|"instagram"|"tiktok"|"other"; timeSpentMinutes: number }>,',
    '    "reminder"?: { fileName: string; scheduledTime: string; isPending: boolean }',
    '  },',
    '  "suggestedMode"?: "creative"|"focus"|"recovery",',
    '  "rationale"?: string',
    '}',
    '',
    'Context:',
    JSON.stringify(
      {
        sessionActive: input.sessionActive,
        targetMode: input.targetMode,
        observedState: input.observedState,
        score: input.score,
        direction: input.direction,
        insight: input.insight,
        suggestedNextTask: input.suggestedNextTask,
        tabSwitchesPerMin: input.activity.tabSwitchesPerMin,
        leisureMinutes: leisureMin,
        communicationMinutes: commMin,
        idleMinutes: idleMin,
      },
      null,
      2
    ),
    '',
    'Copywriting structure for the main highlight (implicitly inside flowSummary fields):',
    '1) Acknowledge current state (human)',
    '2) Explain what it’s good for (meaning)',
    '3) Give one actionable suggestion (direction)',
    '',
    'Use the direction + suggestedNextTask for the suggestion.',
  ].join('\n');
}

