import { flowAiAgent } from './agent';
import { buildFlowAiUserPrompt, type FlowAiSummaryRequest } from './prompt';
import { parseFlowAiSummaryResponse } from './validate';

function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
      'access-control-allow-headers': 'content-type',
      ...(init?.headers ?? {}),
    },
  });
}

function isFlowAiSummaryRequest(value: unknown): value is FlowAiSummaryRequest {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as any;
  return (
    typeof v.sessionActive === 'boolean' &&
    typeof v.targetMode === 'string' &&
    typeof v.observedState === 'string' &&
    typeof v.score === 'number' &&
    typeof v.direction === 'string' &&
    typeof v.insight === 'string' &&
    typeof v.suggestedNextTask === 'string' &&
    typeof v.activity === 'object' &&
    v.activity !== null
  );
}

const port = Number(process.env.FLOW_AI_PORT ?? 4111);

Bun.serve({
  port,
  fetch: async (req) => {
    const url = new URL(req.url);

    if (req.method === 'OPTIONS') return jsonResponse({ ok: true });

    if (url.pathname === '/health') {
      return jsonResponse({ ok: true });
    }

    if (url.pathname === '/v1/flow-ai/summary') {
      if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, { status: 405 });

      const body = await req.json().catch(() => null);
      if (!isFlowAiSummaryRequest(body)) {
        return jsonResponse({ error: 'Invalid request' }, { status: 400 });
      }

      const prompt = buildFlowAiUserPrompt(body);

      // Mastra agent call (OpenAI key must be provided via env in this service).
      const result = await (flowAiAgent as any).generate(prompt);
      const text: string =
        typeof result === 'string'
          ? result
          : typeof result?.text === 'string'
            ? result.text
            : JSON.stringify(result);

      const parsed = parseFlowAiSummaryResponse(text);
      if (!parsed) {
        return jsonResponse({ error: 'Invalid model response', raw: text }, { status: 502 });
      }

      return jsonResponse(parsed);
    }

    return jsonResponse({ error: 'Not found' }, { status: 404 });
  },
});

console.log(`[flow-ai] listening on http://localhost:${port}`);

