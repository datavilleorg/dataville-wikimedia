// Fetch one Wikipedia article through Dataville, with its provenance.
//
//   DATAVILLE_API_KEY=dataville_... node examples/quickstart.mjs "Nvidia"
//
// Node 18+, no dependencies. Runs without a key too, at anonymous rate limits.

const API = "https://api.dataville.com";
const title = process.argv[2] ?? "Nvidia";

const res = await fetch(`${API}/wiki/${encodeURIComponent(title)}`, {
  headers: process.env.DATAVILLE_API_KEY
    ? { Authorization: `Bearer ${process.env.DATAVILLE_API_KEY}` }
    : {},
});
const body = await res.json();
if (!res.ok) {
  // Dataville error messages are written for people: show them as-is.
  console.error(body.data.error);
  process.exit(1);
}

const { data: article } = body;
const meta = article.metadata;

console.log(article.title);
console.log(`${(meta.abstract ?? "").slice(0, 300)}…\n`);
console.log("Source:       ", meta.url);
console.log("Wikidata:     ", meta.main_entity?.identifier);
console.log("Last edited:  ", article.last_updated);
console.log("Categories:   ", (meta.categories ?? []).length);
console.log("Attribution:  ", article.attribution.attribution);
