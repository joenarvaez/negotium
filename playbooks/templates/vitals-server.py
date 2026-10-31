# Receives Health Connect syncs from the HC Webhook app and appends each one to vitals.jsonl.
# Standard library only. Auth is the x-api-key header set in the app.
import hmac
import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

KEY = os.environ["VITALS_WEBHOOK_KEY"]
OUT = "/data/vitals.jsonl"


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.reply(200 if self.path == "/health" else 404)

    def do_POST(self):
        path, _, query = self.path.partition("?")
        if path != "/vitals":
            return self.reply(404)
        if not hmac.compare_digest(self.headers.get("x-api-key", ""), KEY):
            return self.reply(401)
        body = self.rfile.read(int(self.headers.get("Content-Length", 0)))
        try:
            payload = json.loads(body)
        except ValueError:
            return self.reply(400)
        # Reason: the playbook's verify posts with dry_run so it doesn't pollute the data.
        if query != "dry_run":
            with open(OUT, "a") as f:
                f.write(json.dumps(payload) + "\n")
        self.reply(204)

    def reply(self, code):
        self.send_response(code)
        self.end_headers()


ThreadingHTTPServer(("0.0.0.0", 8095), Handler).serve_forever()
