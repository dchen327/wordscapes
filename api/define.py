import json
from http.server import BaseHTTPRequestHandler
from PyDictionary import PyDictionary


class handler(BaseHTTPRequestHandler):
    ''' Parses stored crossword from file and returns a JSON '''

    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()

        content_len = int(self.headers.get('Content-Length'))
        params = json.loads(self.rfile.read(content_len))
        definitions = handler.define_word(params['word'])
        self.wfile.write(json.dumps(definitions).encode())

    @staticmethod
    def define_word(word):
        dictionary = PyDictionary()
        definitions = dictionary.meaning(word, disable_errors=True)
        if definitions is None:
            return {'definitions': []}
        all_defs = []
        for pos in definitions:
            all_defs.extend(
                f'({pos.lower()}) {definition}' for definition in definitions[pos]
            )
        return {'definitions': all_defs}


if __name__ == '__main__':
    print(handler.define_word('basket'))
