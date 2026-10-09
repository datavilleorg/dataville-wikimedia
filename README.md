# dataville-wikimedia

A standalone Next.js demo showing how to build a **Wikipedia knowledge base tracker** — structured, webhook-style edit events from tracked Wikipedia articles, ready to wire into a RAG pipeline or competitor intelligence feed.

Live demo: [app.dataville.com/use-cases/wikipedia-tracker](https://app.dataville.com/use-cases/wikipedia-tracker)

---

## What it does

Monitors a curated list of companies on English Wikipedia and surfaces structured events whenever an article is edited. Each event carries:

- **Section type** — founding year, products, controversies, executive roster
- **Edit metadata** — editor, bytes changed, revision IDs, change summary
- **KB refresh signal** — whether the edit warrants a knowledge base refresh
- **Risk flags** — entities linked to categories like antitrust, SEC investigations, labor disputes, export controls

The edit stream is simulated client-side (random intervals, realistic payloads). Article summaries and categories are fetched live from the [Wikimedia REST API](https://en.wikipedia.org/api/rest_v1/).

---

## Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [Wikimedia REST API](https://en.wikipedia.org/api/rest_v1/) — no API key required

---

## Getting started

```bash
git clone https://github.com/datavilleorg/dataville-wikimedia.git
cd dataville-wikimedia
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Customizing tracked entities

All tracked companies are defined in [`src/lib/wikipediaData.ts`](src/lib/wikipediaData.ts). Each entry follows this shape:

```ts
{
  name: 'Nvidia',
  wiki_title: 'Nvidia',          // must match the Wikipedia article title
  category: 'Semiconductors',
  infobox: { founded: '...', ceo: '...', ... },
  categories: ['Semiconductor companies', 'Export controls', ...],
  risk_categories: [
    { category: 'Export controls', level: 'high' },
  ],
  related: ['GeForce', 'CUDA', 'H100', ...],
  monitored_sections: ['product_description', 'controversies'],
}
```

`wiki_title` must match the URL slug of the Wikipedia article (e.g. `Amazon_(company)` for `https://en.wikipedia.org/wiki/Amazon_(company)`).

`monitored_sections` controls which section types generate edit events. Options: `founding_year`, `product_description`, `controversies`, `executive_roster`, `other`.

---

## Payload shape

The Article Payload panel shows the exact JSON response shape from the Dataville Wikipedia API:

```json
{
  "title": "Apple Inc.",
  "summary": "Apple Inc. is an American multinational...",
  "categories": ["Technology companies", "Antitrust cases", ...],
  "infobox": {
    "founded": "April 1, 1976",
    "ceo": "Tim Cook",
    ...
  },
  "related": ["iPhone", "macOS", "App Store"],
  "language": "en",
  "last_edited": "2024-11-15T12:34:56Z",
  "query_cost_credits": 1,
  "attribution": "CC BY-SA 4.0 - Wikipedia contributors",
  "source_url": "https://en.wikipedia.org/wiki/Apple_Inc."
}
```

Edit events follow this shape:

```json
{
  "event_id": "wiki-a3f9b1c2",
  "event_type": "article.edited",
  "timestamp": "2024-11-15T12:34:56Z",
  "article": {
    "title": "Apple Inc.",
    "entity_name": "Apple Inc.",
    "wiki_url": "https://en.wikipedia.org/wiki/Apple_Inc.",
    "revision_id": 1187654321,
    "prev_revision_id": 1187654320
  },
  "edit": {
    "section": "Controversies",
    "section_type": "controversies",
    "change_summary": "Updated ongoing regulatory investigation details",
    "editor": "WikiWatcher42",
    "is_bot": false,
    "bytes_changed": 214
  },
  "signals": ["controversy_update", "legal_dispute_flag", "risk_signal"],
  "kb_refresh_recommended": true
}
```

---

## Data attribution

Article summaries and metadata are fetched from the **Wikimedia REST API** and are licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) by Wikipedia contributors. Edit events displayed in the stream are simulated and do not represent actual Wikipedia edits.

---

## License

MIT — see [LICENSE](LICENSE).

---

Built by [Dataville](https://app.dataville.com).
