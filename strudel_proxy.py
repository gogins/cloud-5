#!/usr/bin/env python3
import argparse
import os
import urllib.request
import urllib.error
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

UPSTREAM = "https://strudel.cc"  # override with --upstream if needed

def add_cors(handler):
    handler.send_header("Access-Control-Allow-Origin", "*")
    handler.send_header("Access-Control-Allow-Headers", "*")
    handler.send_header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")

class StrudelProxy(SimpleHTTPRequestHandler):
    # Accept both folder and file forms
    PROXY_PATHS = (
        "/repl", "/repl/", "/repl.js",
        "/samples", "/samples/",
    )

    # Always add CORS to all responses (local + proxied)
    def end_headers(self):
        add_cors(self)
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        add_cors(self)
        super().end_headers()

    def _should_proxy(self, path: str) -> bool:
        # proxy if path equals or startswith any declared prefix
        for p in self.PROXY_PATHS:
            if path == p or path.startswith(p):
                return True
        return False

    def _proxy_upstream(self, method="GET"):
        upstream_url = UPSTREAM.rstrip("/") + self.path
        print(f"→ PROXY {method} {self.path}  ==>  {upstream_url}")

        req = urllib.request.Request(upstream_url, method=method)
        # Forward a few useful headers
        for h in ["Range", "Accept", "Accept-Encoding", "If-None-Match", "If-Modified-Since", "User-Agent"]:
            v = self.headers.get(h)
            if v:
                req.add_header(h, v)

        try:
            with urllib.request.urlopen(req) as resp:
                status = resp.getcode()
                headers = resp.headers

                print(f"   ← {status} {upstream_url}")
                self.send_response(status)

                # Pass-through common headers
                for k in [
                    "Content-Type", "Content-Length", "Accept-Ranges", "Content-Range",
                    "ETag", "Last-Modified", "Cache-Control", "Content-Encoding", "Vary"
                ]:
                    v = headers.get(k)
                    if v:
                        self.send_header(k, v)

                add_cors(self)
                super().end_headers()

                # Stream body
                while True:
                    chunk = resp.read(64 * 1024)
                    if not chunk:
                        break
                    self.wfile.write(chunk)

        except urllib.error.HTTPError as e:
            body = e.read() if hasattr(e, "read") else b""
            print(f"   ← {e.code} {upstream_url}")
            self.send_response(e.code)
            self.send_header("Content-Type", e.headers.get("Content-Type", "text/plain"))
            self.send_header("Content-Length", str(len(body)))
            add_cors(self)
            super().end_headers()
            if body:
                self.wfile.write(body)
        except Exception as ex:
            msg = f"Upstream fetch error: {ex}".encode("utf-8")
            print(f"   ← 502 {upstream_url} ({ex})")
            self.send_response(502)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Content-Length", str(len(msg)))
            add_cors(self)
            super().end_headers()
            self.wfile.write(msg)

    def do_HEAD(self):
        if self._should_proxy(self.path):
            return self._proxy_upstream(method="HEAD")
        return super().do_HEAD()

    def do_GET(self):
        if self._should_proxy(self.path):
            return self._proxy_upstream(method="GET")
        return super().do_GET()

def main():
    ap = argparse.ArgumentParser(description="Local file server + Strudel proxy")
    ap.add_argument("--port", type=int, default=8000)
    ap.add_argument("--upstream", default="https://strudel.cc",
                    help="Base upstream for /repl/* and /samples/*")
    ap.add_argument("--dir", default=".", help="Local doc root")
    args = ap.parse_args()

    global UPSTREAM
    UPSTREAM = args.upstream

    os.chdir(args.dir)
    server = ThreadingHTTPServer(("127.0.0.1", args.port), StrudelProxy)
    print(f"Serving {os.getcwd()} at http://127.0.0.1:{args.port}")
    print(f"Proxying /repl*, /samples*  →  {UPSTREAM}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nBye")

if __name__ == "__main__":
    main()
