import { describe, expect, test } from 'bun:test';
import { classifyUrl } from './classifyUrl';

describe('classifyUrl', () => {
  test('classifies work domains (exact + subdomains)', () => {
    expect(classifyUrl('https://github.com/mastra-ai/mastra')).toBe('work');
    expect(classifyUrl('https://docs.google.com/document/d/123')).toBe('work');
    expect(classifyUrl('https://developer.mozilla.org/en-US/docs/Web/API')).toBe('work');
    expect(classifyUrl('https://subdomain.notion.so/page')).toBe('work');
  });

  test('classifies communication domains', () => {
    expect(classifyUrl('https://mail.google.com/mail/u/0/#inbox')).toBe('communication');
    expect(classifyUrl('https://app.slack.com/client/T123/C456')).toBe('communication');
    expect(classifyUrl('https://discord.com/channels/1/2')).toBe('communication');
  });

  test('classifies leisure domains', () => {
    expect(classifyUrl('https://www.youtube.com/watch?v=abc')).toBe('leisure');
    expect(classifyUrl('https://youtu.be/abc')).toBe('leisure');
    expect(classifyUrl('https://reddit.com/r/chrome_extensions')).toBe('leisure');
    expect(classifyUrl('https://x.com/home')).toBe('leisure');
  });

  test('returns unknown for invalid urls or unrecognized hosts', () => {
    expect(classifyUrl('not a url')).toBe('unknown');
    expect(classifyUrl('https://example.com')).toBe('unknown');
  });
});

