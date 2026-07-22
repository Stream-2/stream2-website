import functools
import os
import sys
import http.server


class PrettyURLHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        full = super().translate_path(path)
        if not os.path.exists(full) and not os.path.splitext(full)[1]:
            candidate = full + ".html"
            if os.path.exists(candidate):
                return candidate
        return full

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1])
    directory = sys.argv[2]
    handler = functools.partial(PrettyURLHandler, directory=directory)
    with http.server.ThreadingHTTPServer(("", port), handler) as httpd:
        httpd.serve_forever()
