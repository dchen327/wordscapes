from http.server import BaseHTTPRequestHandler
import json


class handler(BaseHTTPRequestHandler):
    ''' Parses stored crossword from file and returns a JSON '''

    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()

        content_len = int(self.headers.get('Content-Length'))
        params = json.loads(self.rfile.read(content_len))
        crossword_info = handler.parse_file(params['levelNum'])
        self.wfile.write(json.dumps(crossword_info).encode())

    @staticmethod
    def parse_file(level_num):
        level_file = f'api/levels/level_{level_num}.txt'
        with open(level_file) as f:
            num_words = int(f.readline())
            words = {}  # word -> (r, c, is_horiz)
            for _ in range(num_words):
                word, r, c, is_horiz = f.readline().split()
                words[word] = (int(r), int(c), is_horiz == 'True')
            r, c = map(int, f.readline().split())
            crossword = [f.readline().split() for _ in range(r)]
            num_bonus = int(f.readline())
            bonus = [f.readline().strip() for _ in range(num_bonus)]
        return {'words': words, 'bonus': bonus, 'grid': crossword}


if __name__ == '__main__':
    handler.parse_file(15)
