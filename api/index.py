from http.server import BaseHTTPRequestHandler
import json


class handler(BaseHTTPRequestHandler):
    ''' Parses stored crossword from file and returns a JSON '''

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()

        crossword_info = handler.parse_file()
        self.wfile.write(json.dumps(crossword_info).encode())
        return

    @staticmethod
    def parse_file():
        with open('api/puzzle.txt') as f:
            num_words = int(f.readline())
            words = {}  # word -> (r, c, is_horiz)
            for _ in range(num_words):
                word, r, c, is_horiz = f.readline().split()
                words[word] = (int(r), int(c), is_horiz == 'True')
            r, c = map(int, f.readline().split())
            crossword = [f.readline().split() for _ in range(r)]
            # replace all non-hyphens with underscore
            crossword = [[c if c == '-' else '_' for c in row]
                         for row in crossword]
        return {'words': words, 'grid': crossword}


if __name__ == '__main__':
    handler.parse_file()
