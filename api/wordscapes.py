import random
import itertools
from collections import Counter, defaultdict, namedtuple
from copy import deepcopy
from typing import Counter, List, Dict
from icecream import ic
import numpy as np


WordInfo = namedtuple('WordInfo', ['word', 'r', 'c', 'horiz'])


def contains(counter_1: Counter[int], counter_2: Counter[int]) -> bool:
    ''' If c1 and c2 are counters for two words, returns True
        if word_1 can be made from word_2. '''
    return all(counter_1[c] <= counter_2[c] for c in counter_1)


def gen_puzzle_words(words_by_len: Dict, main_word: str) -> List[str]:
    ''' Generate a list of words sorted by increasing length, all of
        which are subwords of the provided main word
    '''
    main_ct = Counter(main_word)
    subwords = []
    for word_len in range(4, 9):
        subwords.extend(word for word in words_by_len[word_len] if contains(
            Counter(word), main_ct))

    return subwords


def gen_crossword(puzzle_words: List[str]):
    ''' Generates a crossword from the provided puzzle words.
        Place words into crossword, trying to maximize metric for 'goodness'
        - Start by randomly placing the main word (longest)
        - At each step:
            - Pick random set of crosswords
            - Pick a random word and try to insert 
        - Store a crossword as a grid and the used dictionary
    '''
    R, C = 10, 15
    grid = [['-'] * C for _ in range(R)]

    start_word = puzzle_words[-1]  # longest word
    word_info = WordInfo(start_word, random.randrange(
        0, R), random.randrange(0, C), random.choice([True, False]))
    while not can_insert(grid, word_info):
        word_info = WordInfo(start_word, random.randrange(
            0, R), random.randrange(0, C), random.choice([True, False]))
    insert_word(grid, word_info)
    used = {start_word: word_info}

    crosswords = [(grid, used)]
    new_crosswords = []
    beam_width = 20

    del puzzle_words[-1]  # remove longest word
    word_weights = [len(word) - 1 for word in puzzle_words]

    words = random.choices(puzzle_words, weights=word_weights, k=50)
    words = np.random.choice(puzzle_words, size=min(
        len(puzzle_words), 50), replace=False, p=word_weights/np.sum(word_weights))
    for num_words in range(25):
        new_crosswords = []
        print(num_words, len(crosswords))
        for grid, used in random.choices(crosswords, k=beam_width):
            unused_words = tuple(set(words) - set(used.keys()))
            if not unused_words:
                continue
            new_word = random.choice(unused_words)

            for word in used:
                if not set(word) & set(new_word):
                    continue
                for i in range(len(word)):
                    for j in range(len(new_word)):
                        if word[i] == new_word[j]:
                            # Check if can insert new_word at (i, j)
                            _, r, c, horiz = used[word]
                            # Start of word -> position of common letter -> start of new_word
                            word_info = WordInfo(
                                new_word, r + (1 - horiz) * i - horiz * j, c + horiz * i - (1 - horiz) * j, not horiz)
                            if can_insert(grid, word_info):
                                new_grid = deepcopy(grid)
                                insert_word(new_grid, word_info)
                                new_used = deepcopy(used)
                                new_used[new_word] = word_info
                                if is_valid(new_grid, new_used):
                                    new_crosswords.append(
                                        (new_grid, new_used))

        if len(new_crosswords) > 0:
            crosswords = new_crosswords
        else:
            break

    for grid, used in random.choices(crosswords, k=5):
        print(list(used.keys()))
        print_grid(grid)

    return random.choice(crosswords)


def can_insert(grid: List[List[str]], word_info: WordInfo):
    ''' Returns True if word can be inserted into grid at position (r, c)
        - fit in the grid
        - don't overlap with existing words
        - don't create any new words, and ensures all existing words are still there
    '''
    word, r, c, horiz = word_info
    R, C = len(grid), len(grid[0])
    # Check if word fits in grid (start and end points)
    if not 0 <= r < R or not 0 <= c < C:
        return False
    if not 0 <= r + (1 - horiz) * len(word) <= R or not 0 <= c + horiz * len(word) <= C:
        return False

    # Check if word perfectly overlaps with the existing grid
    return any(grid[r + (1 - horiz) * i][c + horiz * i] != word[i] for i in range(len(word)))


def is_valid(grid: List[List[str]], used: Dict[str, WordInfo]) -> bool:
    ''' Returns True if the crossword is valid '''
    R, C = len(grid), len(grid[0])
    # Don't create any new words (check rows and columns)
    np_grid = np.array(grid)
    used_words = set(used.keys())
    words_in_grid = set()
    for i in range(R):
        words = ''.join(np_grid[i, :]).split('-')
        # ignore '' and single char words (we're worried about creating 2+ letter words)
        words = [word for word in words if len(word) > 1]
        words_in_grid.update(words)

    for i in range(C):
        words = ''.join(np_grid[:, i]).split('-')
        words = [word for word in words if len(word) > 1]
        words_in_grid.update(words)

    return used_words == words_in_grid


def insert_word(grid: List[List[str]], word_info: WordInfo):
    ''' Insert word into position (r, c) horiz if horiz else vert '''
    word, r, c, horiz = word_info
    for i, char in enumerate(word):
        grid[r + (1 - horiz) * i][c + horiz * i] = char


def crossword_metric(grid: List[List[str]]) -> int:
    ''' A metric for how "good" a given crossword grid is
        - Try to minimize size (rows and columns used)
    '''
    top_left, bottom_right = (), ()
    R, C = len(grid), len(grid[0])
    for i, j in itertools.product(range(R), range(C)):
        if grid[i][j] != '-':
            top_left = (i, j)
            break

    for i, j in itertools.product(range(R), range(C)):
        if grid[-i-1][-j-1] != '-':
            bottom_right = (R - i - 1, C - j - 1)
            break

    return random.random() + ((bottom_right[0] - top_left[0]) * (bottom_right[1] - top_left[1]))


def print_grid(grid):
    for row in grid:
        print(' '.join(row))
    print()


def setup():
    with open('wordscapes.txt') as f:
        words = f.read().splitlines()[:10000]
        words_by_len = defaultdict(list)
        for word in words:
            words_by_len[len(word)].append(word)

        main_word = random.choice(words_by_len[8])
        puzzle_words = gen_puzzle_words(words_by_len, main_word)
        gen_crossword(puzzle_words)


if __name__ == '__main__':
    setup()
