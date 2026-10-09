export type SectionType =
  | 'founding_year'
  | 'product_description'
  | 'controversies'
  | 'executive_roster'
  | 'other';

export type RiskLevel = 'high' | 'medium' | 'low';

export interface EditEvent {
  event_id: string;
  event_type: 'article.edited';
  timestamp: string;
  article: {
    title: string;
    entity_name: string;
    wiki_url: string;
    revision_id: number;
    prev_revision_id: number;
  };
  edit: {
    section: string;
    section_type: SectionType;
    change_summary: string;
    editor: string;
    is_bot: boolean;
    bytes_changed: number;
  };
  signals: string[];
  kb_refresh_recommended: boolean;
}

export interface RiskFlag {
  entity_name: string;
  wiki_title: string;
  risk_category: string;
  risk_level: RiskLevel;
  article_url: string;
}

export interface TrackedEntity {
  name: string;
  wiki_title: string;
  category: string;
  infobox: Record<string, string>;
  categories: string[];
  risk_categories: { category: string; level: RiskLevel }[];
  related: string[];
  monitored_sections: SectionType[];
}

// Shape of GET https://api.dataville.com/wiki/{keywords}. Only the fields this
// demo reads are typed strictly; the API returns more (see the payload panel).
export interface WikiLicense {
  identifier: string;
  name: string;
  url: string;
}

export interface WikiAttribution {
  source: string;
  project: string;
  license: WikiLicense;
  attribution: string;
  notice: string;
  terms_of_use: string;
  url: string;
}

export interface ArticlePayload {
  id: string;
  title: string;
  body: string;
  source: string;
  language: string;
  /** When the article was last edited on Wikipedia. */
  last_updated: string;
  entities: string[];
  metadata: {
    url: string;
    pageid: number | null;
    abstract: string | null;
    description: string | null;
    categories: Array<{ name: string; url: string }> | null;
    main_entity: { identifier: string; url: string } | null;
    license: WikiLicense[] | null;
    project: string;
    /** Which Wikimedia Enterprise feed last wrote this copy: 'snapshot', 'batch' or 'on_demand'. */
    served_from: string | null;
    [key: string]: unknown;
  };
  attribution: WikiAttribution;
}

export interface DatavilleWikiResponse {
  status: 'success';
  account_state: string;
  data: ArticlePayload;
}

export interface DatavilleErrorResponse {
  status: string;
  data: { error: string; code: string };
}

export type ArticleResult = { payload: ArticlePayload } | { error: string };

export interface WikipediaStats {
  entities_monitored: number;
  edits_detected_24h: number;
  risk_flags_active: number;
  kb_refreshes_triggered: number;
  last_event_at: string | null;
}
