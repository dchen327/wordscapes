from http.server import BaseHTTPRequestHandler
import json


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()

        crossword_info = handler.parse_file()
        self.wfile.write(json.dumps(crossword_info).encode())
        return

    def parse_file():
        with open('api/puzzle.txt') as f:
            num_words = int(f.readline())
            words = {}  # word -> (r, c, is_horiz)
            for _ in range(num_words):
                word, r, c, is_horiz = f.readline().split()
                words[word] = (int(r), int(c), bool(is_horiz))
            print(words)
            r, c = map(int, f.readline().split())
            crossword = [f.readline().split() for _ in range(r)]
        return {'words': words, 'crossword': crossword}


if __name__ == '__main__':
    handler.parse_file()
