# Build with Wikimedia data through Dataville

**Fresh, source-linked Wikipedia data for your applications, without building ingestion, parsing or update infrastructure.**

This repo shows how to use Wikimedia data through [Dataville](https://dataville.com): a 60-second API quickstart, an MCP example for agents, and a runnable app that tracks company articles to refresh a knowledge base.

[Get an API key](https://app.dataville.com/api-keys) · [API docs](https://app.dataville.com) · [Dataville MCP](https://github.com/datavilleorg/dataville-mcp) · [Live demo](https://app.dataville.com/use-cases/wikipedia-tracker)

```
Wikimedia Enterprise ──▶ Dataville ──▶ one JSON response per article ──▶ your app
 (snapshots + hourly      (ingest, keep       (text, abstract, categories,     (knowledge-base refresh,
  update batches)          fresh, attribute)   Wikidata ID, license, source)    monitoring, RAG, agents)
```

> **What's live and what's simulated in the demo app**
>
> | | |
> |---|---|
> | **Live, from the Dataville API** | Article text, abstract, categories, last-edit time, license and attribution, for every tracked company |
> | **Simulated** | The edit event stream. Its events show the payload shape you'd emit from a change-detection job; they are not real Wikipedia edits |
> | **Curated** | The risk categories per company, hand-picked for the demo |
>
> The app calls Dataville server-side from [`src/app/api/wiki/[title]/route.ts`](src/app/api/wiki/%5Btitle%5D/route.ts), so your API key never reaches the browser. It makes no direct calls to Wikimedia.

---

## 60-second quickstart

No key is needed to try it: anonymous use allows 50 requests a day per IP address. A [free API key](https://app.dataville.com/api-keys) raises that; send it as `Authorization: Bearer $DATAVILLE_API_KEY`.

### cURL

```bash
curl "https://api.dataville.com/wiki/Nvidia" \
  -H "Authorization: Bearer $DATAVILLE_API_KEY"
```

### Python (standard library only)

```bash
python examples/quickstart.py "Nvidia"
```

### JavaScript / TypeScript (Node 18+, no dependencies)

```bash
node examples/quickstart.mjs "Nvidia"
```

Both print the same thing:

```
Nvidia
Nvidia Corporation is an American multinational technology company headquartered in Santa Clara, California…

Source:        https://en.wikipedia.org/wiki/Nvidia
Wikidata:      Q182477
Last edited:   2026-10-09T10:18:36.000Z
Categories:    40
Attribution:   Wikipedia contributors — CC-BY-SA-4.0
```

### MCP (Claude, Cursor, VS Code, any MCP client)

Connect your agent to Dataville's hosted MCP server:

```bash
claude mcp add --transport http dataville https://api.dataville.com/mcp \
  --header "Authorization: Bearer $DATAVILLE_API_KEY"
```

Then ask it, for example: *"Using Dataville, look up the Wikipedia article on Nvidia. Summarize what the company does, and cite the article URL and its license."*

The agent calls `search_dataville` with `source: "wikipedia"`. For lists and filters across many articles it uses `query_dataville` (SQL). Setup for other clients: [dataville-mcp](https://github.com/datavilleorg/dataville-mcp).

---

## Why Dataville rather than calling Wikimedia directly?

Wikimedia's public APIs are free and excellent, and for a single page lookup you may not need us. Dataville is for when Wikipedia is an input to a product:

- **No ingestion to run.** Dataville keeps a Wikimedia Enterprise corpus current. It ingests snapshots, applies Wikimedia's hourly update batches, and handles page moves and deletions. You don't download dumps, parse wikitext or schedule refresh jobs.
- **One structured response.** Article text, abstract, categories, Wikidata ID, license and last-edit time come back together. You don't stitch together several endpoints.
- **Provenance and rights included.** Every response includes the article URL, its license and an `attribution` block stating what redistribution requires.
- **SQL over the corpus.** Filter, join and export many articles at once (CSV/Parquet), not just one page at a time.
- **One interface for every source.** The same key, response shape and MCP tools work for [SEC EDGAR](https://github.com/datavilleorg/dataville-sec-edgar), arXiv, US Census and more, so combining datasets needs no extra integration work.

## Trustworthy, not authoritative

Wikimedia is **trustworthy, source-linked knowledge**: it is community-edited, heavily cited and corrected quickly, and every claim traces back to an article you can link to. It is not a primary source. For authoritative facts, pair it with one: for companies, that's SEC EDGAR (see [below](#combine-with-other-dataville-data)). Dataville keeps the source of every record explicit, so your application can say where each claim came from.

## Dataset card

| | |
|---|---|
| **Source** | Wikipedia (English), a Wikimedia Foundation project |
| **Provider** | Wikimedia Enterprise, via Dataville |
| **Coverage** | English Wikipedia articles (`enwiki`) |
| **Freshness** | Enterprise snapshot plus hourly update batches. `last_updated` is the article's last edit on Wikipedia |
| **Provenance** | `metadata.url` (article), `metadata.main_entity` (Wikidata ID), `metadata.served_from` (`snapshot` / `batch` / `on_demand`) |
| **License** | Text under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/); see the `attribution` block in each response |
| **Removed articles** | Deletions are confirmed before an article is withdrawn, because page moves look like deletions at first; withdrawn articles are not served |
| **Access** | REST (`GET /wiki/{title}`), SQL (`POST /api/v1/query`, table `wiki`), CSV/Parquet export, MCP |

## API examples

**1. Get one article.** Use `GET /wiki/{title or topic}`, which returns the closest matching article. Abridged response:

```json
{
  "status": "success",
  "data": {
    "id": "wiki_en_nvidia",
    "title": "Nvidia",
    "body": "Nvidia\n\nAmerican multinational technology company…",
    "source": "wikipedia",
    "language": "en",
    "last_updated": "2026-10-09T10:18:36.000Z",
    "metadata": {
      "url": "https://en.wikipedia.org/wiki/Nvidia",
      "pageid": 39120,
      "abstract": "Nvidia Corporation is an American multinational technology company…",
      "categories": [{ "name": "Category:Semiconductor companies of the United States", "url": "https://en.wikipedia.org/wiki/Category:…" }],
      "main_entity": { "identifier": "Q182477", "url": "https://www.wikidata.org/entity/Q182477" },
      "license": [{ "identifier": "CC-BY-SA-4.0", "url": "https://creativecommons.org/licenses/by-sa/4.0/" }],
      "served_from": "batch"
    },
    "attribution": {
      "source": "Wikimedia",
      "attribution": "Wikipedia contributors — CC-BY-SA-4.0",
      "notice": "This content comes from Wikipedia, a Wikimedia project. If you redistribute it you must credit Wikimedia…",
      "url": "https://en.wikipedia.org/wiki/Nvidia"
    }
  }
}
```

**2. Query many articles with SQL.** This needs an API key. For example, find which tracked companies' articles changed most recently:

```bash
curl -X POST "https://api.dataville.com/api/v1/query" \
  -H "Authorization: Bearer $DATAVILLE_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"sql\": \"SELECT title, url, date_modified FROM wiki WHERE title IN ('Nvidia', 'Netflix', 'OpenAI') ORDER BY date_modified DESC\"}"
```

The response is `{ "rows": [...] }`. Columns include `title`, `abstract`, `url`, `categories`, `main_entity`, `license` and `date_modified`.

**3. Build an application.** The demo app below polls articles for a watchlist of companies and shows the knowledge-base refresh payload you'd build on top.

## What you can build

- **Knowledge-base refresh.** Re-embed or re-index an article in your RAG store when its `last_updated` changes.
- **Entity and company monitoring.** Watch a list of companies, people or products for article changes.
- **Research agents.** Give an agent cited background knowledge through MCP.
- **Contextual enrichment.** Attach descriptions, categories and Wikidata IDs to entities in your own data.
- **Change detection.** Compare article versions over time and flag edits to sections you care about.

---

## Run the demo app

A Next.js app that tracks 12 companies' Wikipedia articles for knowledge-base refresh.

```bash
git clone https://github.com/datavilleorg/dataville-wikimedia.git
cd dataville-wikimedia
npm install
cp .env.example .env.local   # add DATAVILLE_API_KEY (recommended)
npm run dev
```

Each page load looks up 12 articles. Without a key those come out of the 50-a-day anonymous allowance, so add a free key before you demo it.

Open [http://localhost:3000](http://localhost:3000). The app has four panels:

- **Monitored Entities** shows each company's real last-edit time on Wikipedia, from Dataville.
- **Article Payload** shows the unmodified Dataville response for the selected company, with its source link and license.
- **Edit Stream (simulated)** shows example change events in the payload shape below.
- **Risk Flags (curated)** shows hand-picked risk categories per company.

**Stack:** [Next.js 14](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/), and the [Dataville API](https://app.dataville.com).

### Customizing tracked entities

Tracked companies are defined in [`src/lib/wikipediaData.ts`](src/lib/wikipediaData.ts):

```ts
{
  name: 'Nvidia',
  wiki_title: 'Nvidia',          // the Wikipedia article title (URL slug)
  category: 'Semiconductors',
  risk_categories: [{ category: 'Export controls', level: 'high' }],   // curated
  monitored_sections: ['product_description', 'controversies'],       // drives the simulated stream
  // ...
}
```

`wiki_title` must match the article's URL slug, e.g. `Amazon_(company)` for `https://en.wikipedia.org/wiki/Amazon_(company)`.

### Simulated edit event shape

This is the shape of event a change-detection job would emit. **The demo generates these client-side; they are not real edits.**

```json
{
  "event_id": "wiki-a3f9b1c2",
  "event_type": "article.edited",
  "timestamp": "2026-10-09T12:34:56Z",
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

## Combine with other Dataville data

Wikimedia tells you what a company *is*; SEC EDGAR tells you what it has *officially disclosed*. Because both come through the same Dataville interface, one more call combines them:

```bash
curl "https://api.dataville.com/wiki/Nvidia"   # context: history, products, people
curl "https://api.dataville.com/edgar/NVDA"    # authoritative: filings, XBRL financials
```

See [`company-intelligence-agent`](https://github.com/datavilleorg/company-intelligence-agent) for a full example that keeps each claim tagged with its source, and [`dataville-sec-edgar`](https://github.com/datavilleorg/dataville-sec-edgar) for the EDGAR package.

## Attribution

Wikipedia content is © Wikipedia contributors and licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). If you redistribute it, credit Wikimedia and follow the `attribution.notice` in each response, including the share-alike requirement and Wikimedia's [trademark policy](https://foundation.wikimedia.org/wiki/Trademark_policy). This project is not affiliated with or endorsed by the Wikimedia Foundation.

The code in this repo is MIT-licensed; see [LICENSE](LICENSE).

## Start building

**[Get a free API key →](https://app.dataville.com/api-keys)** · [Explore Dataville MCP →](https://github.com/datavilleorg/dataville-mcp) · Questions: support@dataville.com
