import {
  TrackedEntity,
  EditEvent,
  RiskFlag,
  ArticlePayload,
  ArticleResult,
  DatavilleWikiResponse,
  DatavilleErrorResponse,
  WikipediaStats,
  SectionType,
  RiskLevel,
} from '@/types/wikipedia';

export const TRACKED_ENTITIES: TrackedEntity[] = [
  {
    name: 'Apple Inc.',
    wiki_title: 'Apple_Inc.',
    category: 'Technology',
    infobox: {
      founded: 'April 1, 1976',
      founders: 'Steve Jobs, Steve Wozniak, Ronald Wayne',
      ceo: 'Tim Cook',
      headquarters: 'Cupertino, California, U.S.',
      revenue: 'US$383 billion (2023)',
      employees: '161,000+ (2023)',
    },
    categories: ['Technology companies', 'Consumer electronics companies', 'Antitrust cases', 'App Store controversies', 'Companies in Cupertino, California'],
    risk_categories: [
      { category: 'Antitrust cases', level: 'high' },
      { category: 'App Store controversies', level: 'medium' },
    ],
    related: ['iPhone', 'MacBook', 'iPad', 'iOS', 'macOS', 'App Store'],
    monitored_sections: ['product_description', 'controversies', 'executive_roster'],
  },
  {
    name: 'Alphabet Inc.',
    wiki_title: 'Alphabet_Inc.',
    category: 'Technology',
    infobox: {
      founded: 'October 2, 2015',
      founders: 'Larry Page, Sergey Brin',
      ceo: 'Sundar Pichai',
      headquarters: 'Mountain View, California, U.S.',
      revenue: 'US$307 billion (2023)',
      employees: '182,000+ (2023)',
    },
    categories: ['Technology companies', 'Antitrust cases', 'Privacy controversies', 'Data breach incidents', 'Companies in Mountain View'],
    risk_categories: [
      { category: 'Antitrust cases', level: 'high' },
      { category: 'Privacy controversies', level: 'high' },
      { category: 'Data breach incidents', level: 'medium' },
    ],
    related: ['Google Search', 'YouTube', 'Google Cloud', 'Android', 'DeepMind'],
    monitored_sections: ['controversies', 'executive_roster', 'product_description'],
  },
  {
    name: 'Microsoft',
    wiki_title: 'Microsoft',
    category: 'Technology',
    infobox: {
      founded: 'April 4, 1975',
      founders: 'Bill Gates, Paul Allen',
      ceo: 'Satya Nadella',
      headquarters: 'Redmond, Washington, U.S.',
      revenue: 'US$212 billion (2023)',
      employees: '220,000+ (2023)',
    },
    categories: ['Technology companies', 'Antitrust cases', 'Software companies', 'Companies in Redmond, Washington'],
    risk_categories: [
      { category: 'Antitrust cases', level: 'medium' },
    ],
    related: ['Windows', 'Azure', 'Office 365', 'LinkedIn', 'GitHub'],
    monitored_sections: ['controversies', 'executive_roster', 'product_description'],
  },
  {
    name: 'Amazon',
    wiki_title: 'Amazon_(company)',
    category: 'E-commerce',
    infobox: {
      founded: 'July 5, 1994',
      founder: 'Jeff Bezos',
      ceo: 'Andy Jassy',
      headquarters: 'Seattle, Washington, U.S.',
      revenue: 'US$554 billion (2023)',
      employees: '1,525,000+ (2023)',
    },
    categories: ['E-commerce companies', 'Labor disputes', 'Antitrust cases', 'Amazon controversies', 'Companies in Seattle'],
    risk_categories: [
      { category: 'Labor disputes', level: 'high' },
      { category: 'Antitrust cases', level: 'medium' },
    ],
    related: ['AWS', 'Alexa (Amazon)', 'Prime Video', 'Whole Foods Market', 'Ring (company)'],
    monitored_sections: ['controversies', 'executive_roster'],
  },
  {
    name: 'Meta Platforms',
    wiki_title: 'Meta_Platforms',
    category: 'Social Media',
    infobox: {
      founded: 'February 4, 2004',
      founder: 'Mark Zuckerberg',
      ceo: 'Mark Zuckerberg',
      headquarters: 'Menlo Park, California, U.S.',
      revenue: 'US$134 billion (2023)',
      employees: '67,317 (2023)',
    },
    categories: ['Social media companies', 'Privacy controversies', 'Antitrust cases', 'Data breach incidents', 'Facebook controversies'],
    risk_categories: [
      { category: 'Privacy controversies', level: 'high' },
      { category: 'Data breach incidents', level: 'high' },
      { category: 'Antitrust cases', level: 'medium' },
    ],
    related: ['Facebook', 'Instagram', 'WhatsApp', 'Threads', 'Meta Quest'],
    monitored_sections: ['controversies', 'executive_roster', 'founding_year'],
  },
  {
    name: 'Tesla',
    wiki_title: 'Tesla,_Inc.',
    category: 'Automotive / EV',
    infobox: {
      founded: 'July 1, 2003',
      founders: 'Martin Eberhard, Marc Tarpenning, Elon Musk',
      ceo: 'Elon Musk',
      headquarters: 'Austin, Texas, U.S.',
      revenue: 'US$97.7 billion (2023)',
      employees: '127,855 (2023)',
    },
    categories: ['Electric vehicle manufacturers', 'SEC investigations', 'Tesla controversies', 'Companies in Austin, Texas'],
    risk_categories: [
      { category: 'SEC investigations', level: 'high' },
      { category: 'Tesla controversies', level: 'medium' },
    ],
    related: ['Model S', 'Model 3', 'Model Y', 'Cybertruck', 'Tesla Autopilot'],
    monitored_sections: ['controversies', 'executive_roster'],
  },
  {
    name: 'OpenAI',
    wiki_title: 'OpenAI',
    category: 'AI',
    infobox: {
      founded: 'December 11, 2015',
      founders: 'Sam Altman, Elon Musk, Greg Brockman, Ilya Sutskever',
      ceo: 'Sam Altman',
      headquarters: 'San Francisco, California, U.S.',
      type: 'Capped-profit corporation',
    },
    categories: ['Artificial intelligence companies', 'AI safety organizations', 'Companies in San Francisco'],
    risk_categories: [],
    related: ['ChatGPT', 'GPT-4', 'DALL-E', 'Sora (text-to-video model)', 'Microsoft'],
    monitored_sections: ['product_description', 'executive_roster', 'founding_year'],
  },
  {
    name: 'Nvidia',
    wiki_title: 'Nvidia',
    category: 'Semiconductors',
    infobox: {
      founded: 'April 5, 1993',
      founders: 'Jensen Huang, Chris Malachowsky, Curtis Priem',
      ceo: 'Jensen Huang',
      headquarters: 'Santa Clara, California, U.S.',
      revenue: 'US$60.9 billion (2024)',
      employees: '32,142 (2024)',
    },
    categories: ['Semiconductor companies', 'Export controls', 'Antitrust cases', 'Companies in Santa Clara'],
    risk_categories: [
      { category: 'Export controls', level: 'high' },
      { category: 'Antitrust cases', level: 'low' },
    ],
    related: ['GeForce', 'CUDA', 'A100', 'H100', 'DGX systems'],
    monitored_sections: ['product_description', 'controversies'],
  },
  {
    name: 'Uber',
    wiki_title: 'Uber',
    category: 'Ridesharing',
    infobox: {
      founded: 'March 2009',
      founders: 'Travis Kalanick, Garrett Camp',
      ceo: 'Dara Khosrowshahi',
      headquarters: 'San Francisco, California, U.S.',
      revenue: 'US$37.3 billion (2023)',
      employees: '32,700 (2023)',
    },
    categories: ['Transportation network companies', 'Labor disputes', 'Regulatory issues', 'Uber controversies'],
    risk_categories: [
      { category: 'Labor disputes', level: 'high' },
      { category: 'Regulatory issues', level: 'medium' },
    ],
    related: ['Uber Eats', 'Lyft', 'Grab', 'Didi', 'Uber Freight'],
    monitored_sections: ['controversies', 'executive_roster'],
  },
  {
    name: 'Airbnb',
    wiki_title: 'Airbnb',
    category: 'Hospitality',
    infobox: {
      founded: 'August 2008',
      founders: 'Brian Chesky, Joe Gebbia, Nathan Blecharczyk',
      ceo: 'Brian Chesky',
      headquarters: 'San Francisco, California, U.S.',
      revenue: 'US$9.9 billion (2023)',
      employees: '6,907 (2023)',
    },
    categories: ['Hospitality companies', 'Regulatory issues', 'Airbnb controversies', 'Companies in San Francisco'],
    risk_categories: [
      { category: 'Regulatory issues', level: 'medium' },
    ],
    related: ['Vrbo', 'Booking.com', 'Expedia', 'Short-term rental'],
    monitored_sections: ['controversies', 'executive_roster', 'founding_year'],
  },
  {
    name: 'Salesforce',
    wiki_title: 'Salesforce',
    category: 'SaaS',
    infobox: {
      founded: 'February 3, 1999',
      founders: 'Marc Benioff, Parker Harris, Dave Moellenhoff, Frank Dominguez',
      ceo: 'Marc Benioff',
      headquarters: 'San Francisco, California, U.S.',
      revenue: 'US$34.9 billion (2024)',
      employees: '72,682 (2024)',
    },
    categories: ['SaaS companies', 'CRM software', 'Companies in San Francisco'],
    risk_categories: [],
    related: ['Slack', 'Tableau', 'MuleSoft', 'Heroku', 'CRM'],
    monitored_sections: ['product_description', 'executive_roster'],
  },
  {
    name: 'Netflix',
    wiki_title: 'Netflix',
    category: 'Streaming',
    infobox: {
      founded: 'August 29, 1997',
      founders: 'Reed Hastings, Marc Randolph',
      ceo: 'Greg Peters, Ted Sarandos',
      headquarters: 'Los Gatos, California, U.S.',
      revenue: 'US$33.7 billion (2023)',
      employees: '13,000+ (2023)',
    },
    categories: ['Streaming media companies', 'Entertainment companies', 'Companies in Los Gatos'],
    risk_categories: [],
    related: ['Hulu', 'Disney+', 'Amazon Prime Video', 'Squid Game', 'Stranger Things'],
    monitored_sections: ['product_description', 'executive_roster'],
  },
];

const SECTION_LABELS: Record<SectionType, string> = {
  founding_year: 'Founding Year',
  product_description: 'Products & Services',
  controversies: 'Controversies',
  executive_roster: 'Executive Team',
  other: 'General Content',
};

const EDIT_SUMMARIES: Record<SectionType, string[]> = {
  founding_year: [
    'Corrected founding date per primary source',
    'Updated establishment year with citation',
    'Fixed infobox founding year discrepancy',
    'Added archived source for founding date',
  ],
  product_description: [
    'Updated product lineup for current year',
    'Added recently launched product details',
    'Revised service description to match official docs',
    'Updated pricing information in product section',
    'Expanded product features based on press release',
    'Removed discontinued product references',
  ],
  controversies: [
    'Added citation needed tag to unsourced claim',
    'Updated ongoing regulatory investigation details',
    'Documented newly filed lawsuit',
    'Expanded antitrust case timeline',
    'Added settlement outcome details',
    'Updated regulatory fine amount',
    'Noted appeal filed in legal dispute',
    'Added congressional testimony reference',
  ],
  executive_roster: [
    'Noted CEO transition announcement',
    'Added newly appointed board member',
    'Updated executive departure information',
    'Revised CFO appointment details',
    'Added new C-suite appointment',
    'Noted board member resignation',
    'Updated executive compensation reference',
  ],
  other: [
    'Fixed formatting in article',
    'Added missing wikilink',
    'Updated revenue figures with annual report source',
    'Standardized citation format',
    'Corrected typo in company description',
    'Updated employee count from latest report',
  ],
};

const SIGNALS_BY_SECTION: Record<SectionType, string[]> = {
  founding_year: ['founding_year_change', 'infobox_update'],
  product_description: ['product_description_change', 'kb_refresh_recommended'],
  controversies: ['controversy_update', 'legal_dispute_flag', 'risk_signal'],
  executive_roster: ['executive_change', 'leadership_update', 'kb_refresh_recommended'],
  other: ['minor_content_update'],
};

const FAKE_EDITORS = [
  'WikiContrib2847', 'DataBot3.0', 'EncycloEditor', 'FactChecker99',
  'WikiWatcher42', 'NeutralPOV_Bot', 'CitationPolice', 'TechWikiEditor',
  'CorpWatchBot', 'EditorPrime', 'WikipediaGuard', 'SourceVerifier',
];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateEventId(): string {
  return 'wiki-' + Math.random().toString(36).substring(2, 10);
}

function generateRevisionId(): number {
  return Math.floor(1_100_000_000 + Math.random() * 100_000_000);
}

export function generateEditEvent(entity: TrackedEntity, timestamp?: Date): EditEvent {
  const sectionType = randomChoice(entity.monitored_sections);
  const section = SECTION_LABELS[sectionType];
  const change_summary = randomChoice(EDIT_SUMMARIES[sectionType]);
  const signals = [...SIGNALS_BY_SECTION[sectionType]];
  const is_bot = Math.random() < 0.3;
  const bytes_changed = Math.round((Math.random() - 0.3) * 600);
  const kb_refresh_recommended = ['controversies', 'product_description', 'executive_roster'].includes(sectionType);
  const ts = timestamp || new Date();
  const revisionId = generateRevisionId();

  return {
    event_id: generateEventId(),
    event_type: 'article.edited',
    timestamp: ts.toISOString(),
    article: {
      title: entity.wiki_title.replace(/_/g, ' '),
      entity_name: entity.name,
      wiki_url: `https://en.wikipedia.org/wiki/${entity.wiki_title}`,
      revision_id: revisionId,
      prev_revision_id: revisionId - 1,
    },
    edit: {
      section,
      section_type: sectionType,
      change_summary,
      editor: is_bot ? `${randomChoice(FAKE_EDITORS)}_Bot` : randomChoice(FAKE_EDITORS),
      is_bot,
      bytes_changed,
    },
    signals,
    kb_refresh_recommended,
  };
}

export function generateInitialEditEvents(count = 15): EditEvent[] {
  const events: EditEvent[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const entity = randomChoice(TRACKED_ENTITIES);
    const msAgo = Math.floor(Math.random() * 2 * 60 * 60 * 1000);
    const timestamp = new Date(now - msAgo);
    events.push(generateEditEvent(entity, timestamp));
  }

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function extractRiskFlags(): RiskFlag[] {
  const flags: RiskFlag[] = [];
  for (const entity of TRACKED_ENTITIES) {
    for (const risk of entity.risk_categories) {
      flags.push({
        entity_name: entity.name,
        wiki_title: entity.wiki_title,
        risk_category: risk.category,
        risk_level: risk.level,
        article_url: `https://en.wikipedia.org/wiki/${entity.wiki_title}`,
      });
    }
  }
  const order: Record<RiskLevel, number> = { high: 0, medium: 1, low: 2 };
  return flags.sort((a, b) => order[a.risk_level] - order[b.risk_level]);
}

const FALLBACK_ERROR =
  "Couldn't load this article from Dataville. Try again in a moment; if it keeps happening, contact support@dataville.com.";

const articleCache: Record<string, ArticlePayload> = {};

/**
 * Fetches one article through this app's /api/wiki route, which calls
 * https://api.dataville.com/wiki/{title} server-side. On failure, returns the
 * Dataville API's own error message, which is written for end users.
 */
export async function fetchDatavilleArticle(wikiTitle: string): Promise<ArticleResult> {
  if (articleCache[wikiTitle]) return { payload: articleCache[wikiTitle] };

  try {
    const res = await fetch(`/api/wiki/${encodeURIComponent(wikiTitle.replace(/_/g, ' '))}`);
    const json: DatavilleWikiResponse | DatavilleErrorResponse = await res.json();
    if (!res.ok || json.status !== 'success') {
      const message = (json as DatavilleErrorResponse).data?.error;
      return { error: message || FALLBACK_ERROR };
    }
    const payload = (json as DatavilleWikiResponse).data;
    articleCache[wikiTitle] = payload;
    return { payload };
  } catch {
    return { error: FALLBACK_ERROR };
  }
}

export function generateStats(editEvents: EditEvent[], riskFlags: RiskFlag[]): WikipediaStats {
  return {
    entities_monitored: TRACKED_ENTITIES.length,
    edits_detected_24h: editEvents.length,
    risk_flags_active: riskFlags.length,
    kb_refreshes_triggered: editEvents.filter(e => e.kb_refresh_recommended).length,
    last_event_at: editEvents.length > 0 ? editEvents[0].timestamp : null,
  };
}
