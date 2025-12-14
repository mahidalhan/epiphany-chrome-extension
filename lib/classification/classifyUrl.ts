export type ActivityCategory = 'work' | 'leisure' | 'communication' | 'unknown';

/**
 * Minimal, configurable domain-based URL classifier for Phase 6.
 * Keep this deterministic and editable (no ML).
 */
export const CATEGORY_RULES: Record<ActivityCategory, string[]> = {
  work: [
    'github.com',
    'gitlab.com',
    'bitbucket.org',
    'notion.so',
    'figma.com',
    'docs.google.com',
    'drive.google.com',
    'calendar.google.com',
    'developer.mozilla.org',
    'stackoverflow.com',
  ],
  communication: [
    'mail.google.com',
    'gmail.com',
    'outlook.office.com',
    'discord.com',
    'slack.com',
    'teams.microsoft.com',
    'meet.google.com',
  ],
  leisure: [
    'youtube.com',
    'youtu.be',
    'netflix.com',
    'reddit.com',
    'x.com',
    'twitter.com',
    'tiktok.com',
    'instagram.com',
    'twitch.tv',
  ],
  unknown: [],
};

function getHostname(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return null;
  }
}

function hostnameMatchesRule(hostname: string, ruleHostname: string): boolean {
  // Match exact domain OR subdomain of a rule domain.
  return hostname === ruleHostname || hostname.endsWith(`.${ruleHostname}`);
}

export function classifyUrl(url: string): ActivityCategory {
  const hostname = getHostname(url);
  if (!hostname) return 'unknown';

  for (const ruleHostname of CATEGORY_RULES.work) {
    if (hostnameMatchesRule(hostname, ruleHostname)) return 'work';
  }

  for (const ruleHostname of CATEGORY_RULES.communication) {
    if (hostnameMatchesRule(hostname, ruleHostname)) return 'communication';
  }

  for (const ruleHostname of CATEGORY_RULES.leisure) {
    if (hostnameMatchesRule(hostname, ruleHostname)) return 'leisure';
  }

  return 'unknown';
}

