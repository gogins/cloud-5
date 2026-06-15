#!/usr/bin/env bash
# Turn cloud-5 dist into a plain static site: no Workbox SPA fallback, no SW registration.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$ROOT/strudel/website/dist"

if [[ ! -d "$DIST" ]]; then
  echo "dist-static-site: $DIST not found; skipping" >&2
  exit 0
fi

# GitHub Pages runs Jekyll unless this file is present; Jekyll would drop _astro/ and
# exclude paths starting with "strudel" if a legacy _config.yml is ever reintroduced.
: > "$DIST/.nojekyll"

# Replace any Workbox service worker with one that clears caches and unregisters itself.
cat > "$DIST/sw.js" <<'SW'
// cloud-5 static site: retire any previously installed PWA service worker.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    try {
      for (const key of await caches.keys()) await caches.delete(key);
    } catch {}
    try {
      await self.registration.unregister();
    } catch {}
    try {
      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clients) client.navigate(client.url);
    } catch {}
  })());
});
SW

echo "// cloud-5 static site: no service worker" > "$DIST/registerSW.js"

while IFS= read -r -d '' file; do
  echo "// cloud-5 static site: PWA disabled" > "$file"
done < <(find "$DIST/_astro" -name 'HeadCommon.astro_astro_type_script_index_1_lang.*.js' -print0 2>/dev/null || true)

rm -f "$DIST/standalone-sw-guard.js"

python3 - "$DIST" <<'PY'
import re
import sys
from pathlib import Path

dist = Path(sys.argv[1])
pwa_script = re.compile(
    r'<script[^>]*HeadCommon\.astro_astro_type_script_index_1[^>]*></script>',
    re.IGNORECASE,
)
register_sw_script = re.compile(r'<script[^>]*registerSW\.js[^>]*></script>', re.IGNORECASE)
manifest_link = re.compile(r'<link[^>]*rel="manifest"[^>]*>', re.IGNORECASE)

for html in dist.rglob("*.html"):
    text = html.read_text(encoding="utf-8")
    updated = pwa_script.sub("", text)
    updated = register_sw_script.sub("", updated)
    updated = manifest_link.sub("", updated)
    if updated != text:
        html.write_text(updated, encoding="utf-8")

print("dist-static-site: neutralized PWA hooks in", dist)
PY

BOOTSTRAP='strudel_repl_bootstrap.js'
REPL_HTML="$DIST/strudel_repl.html"
if [[ -f "$ROOT/$BOOTSTRAP" && -f "$REPL_HTML" ]]; then
  cp -f "$ROOT/$BOOTSTRAP" "$DIST/$BOOTSTRAP"
  python3 - "$REPL_HTML" <<'PY'
import sys
from pathlib import Path

html_path = Path(sys.argv[1])
text = html_path.read_text(encoding="utf-8")
tag = '<script src="/strudel_repl_bootstrap.js"></script>'
if tag not in text:
    needle = "<head>"
    if needle in text:
        text = text.replace(needle, needle + tag, 1)
        html_path.write_text(text, encoding="utf-8")
        print("dist-static-site: injected strudel_repl_bootstrap.js into", html_path.name)
    else:
        print("dist-static-site: no <head> in", html_path.name, file=sys.stderr)
PY
fi
