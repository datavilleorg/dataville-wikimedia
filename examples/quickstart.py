"""Fetch one Wikipedia article through Dataville, with its provenance.

    DATAVILLE_API_KEY=dataville_... python examples/quickstart.py "Nvidia"

Standard library only. Runs without a key too, at anonymous rate limits.
"""
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

API = "https://api.dataville.com"


def get_article(title: str) -> dict:
    req = urllib.request.Request(f"{API}/wiki/{urllib.parse.quote(title)}")
    key = os.environ.get("DATAVILLE_API_KEY")
    if key:
        req.add_header("Authorization", f"Bearer {key}")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.load(resp)["data"]
    except urllib.error.HTTPError as err:
        # Dataville error messages are written for people: show them as-is.
        sys.exit(json.load(err)["data"]["error"])


article = get_article(sys.argv[1] if len(sys.argv) > 1 else "Nvidia")
meta = article["metadata"]

print(article["title"])
print((meta.get("abstract") or "")[:300] + "…\n")
print("Source:       ", meta["url"])
print("Wikidata:     ", (meta.get("main_entity") or {}).get("identifier"))
print("Last edited:  ", article["last_updated"])
print("Categories:   ", len(meta.get("categories") or []))
print("Attribution:  ", article["attribution"]["attribution"])
