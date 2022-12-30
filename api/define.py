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
        definition = dictionary.meaning(word, disable_errors=True)
        if definition is None:
            return {'definitions': []}
        all_defs = []
        for pos in definition:
            all_defs.extend(
                f'({pos.lower()}) {defn}' for defn in definition[pos]
            )
        return {'definitions': all_defs}

    @staticmethod
    def define_words(words):
        dictionary = PyDictionary(*words)
        definitions = {word: [] for word in words}
        for word in words:
            definition = dictionary.meaning(word, disable_errors=True)
            if definition is None:
                continue
            for pos in definition:
                definitions[word].extend(
                    f'({pos.lower()}) {defn}' for defn in definition[pos]
                )

        return {'definitions': definitions}


if __name__ == '__main__':
    # print(handler.define_word('basket'))
    words = ['polygon', 'subst', 'cat', 'ajdslk']
    print(handler.define_words(words))
