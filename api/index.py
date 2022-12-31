from http.server import BaseHTTPRequestHandler
from collections import defaultdict
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
            # pos -> words that the letter is a part of
            # pos is (r, c) -> num_cols * r + c (flattened)
            pos_to_words = defaultdict(list)
            for word, (r, c, is_horiz) in words.items():
                for _ in word:
                    pos_to_words[len(crossword[0]) * r + c].append(word)
                    if is_horiz:
                        c += 1
                    else:
                        r += 1

        return {'words': words, 'bonus': bonus, 'grid': crossword, 'posToWords': pos_to_words}


if __name__ == '__main__':
    print(handler.parse_file(15))
