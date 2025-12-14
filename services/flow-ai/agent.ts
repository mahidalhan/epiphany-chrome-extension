import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import { FLOW_AI_SYSTEM_INSTRUCTIONS } from './prompt';

/**
 * Local Mastra agent (runs in Bun) for Flow AI.
 * Keep this server-side so we never ship OpenAI keys in the extension.
 */
export const flowAiAgent = new Agent({
  name: 'epiphany-flow-ai',
  instructions: FLOW_AI_SYSTEM_INSTRUCTIONS,
  model: openai('gpt-4o-mini'),
});

