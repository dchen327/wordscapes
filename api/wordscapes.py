import random
import itertools
from collections import Counter, defaultdict, namedtuple, deque
from copy import deepcopy
from typing import Counter, List, Dict
from icecream import ic

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
        for word in words_by_len[word_len]:
            if contains(Counter(word), main_ct):
                subwords.append(word)

    return subwords


def gen_crossword(puzzle_words: List[str]):
    ''' Generates a crossword from the provided puzzle words.
        Place words into crossword, trying to maximize metric for 'goodness'
        - Start with word in middle horizontally
        - Add new words by metric
            - Look at existing words, check common letters, check if can insert
            - TODO: NamedTuple for word: (word, r, c, horiz)
            - TODO: store size used so far (update top left, bottom right)
        - Store a crossword as a grid and the metric
    '''
    R, C = 15, 20
    grid = [['-'] * C for _ in range(R)]

    while len(start_word := random.choice(puzzle_words)) < 5:
        pass
    word_info = WordInfo(start_word, R // 2, C // 2 -
                         len(start_word) // 2, True)
    insert_word(grid, word_info)
    used = {start_word: word_info}
    print_grid(grid)

    crosswords = deque([(grid, used)])

    for num_words in range(2):
        for _ in range(len(crosswords)):
            grid, used = crosswords.popleft()
            new_word = random.choice(puzzle_words)
            if new_word not in used:
                for word in used:
                    for i in range(len(word)):
                        for j in range(len(new_word)):
                            if word[i] == new_word[j]:
                                # Check if can insert new_word at (i, j)
                                _, r, c, horiz = used[word]
                                # Start of word -> position of common letter -> start of new_word
                                word_info = WordInfo(
                                    new_word, r + (1 - horiz) * i - horiz * j, c + horiz * i - (1 - horiz) * i, not horiz)
                                if can_insert(grid, word_info):
                                    new_grid = deepcopy(grid)
                                    insert_word(new_grid, word_info)
                                    new_used = deepcopy(used)
                                    new_used[new_word] = word_info
                                    print_grid(new_grid)
                                    crosswords.append((new_grid, new_used))

    for grid, used in crosswords:
        print_grid(grid)


def can_insert(grid: List[List[str]], word_info: WordInfo):
    ''' Returns True if word can be inserted into grid at position (r, c) '''
    word, r, c, horiz = word_info
    R, C = len(grid), len(grid[0])
    # Check if word fits in grid (start and end points)
    if not (0 <= r < R and 0 <= c < C):
        return False
    if not (0 <= r + (1 - horiz) * len(word) <= R and 0 <= c + horiz * len(word) <= C):
        return False

    # Check if word overlaps with existing letters
    for i, char in enumerate(word):
        if grid[r + (1 - horiz) * i][c + horiz * i] != '-' and grid[r + (1 - horiz) * i][c + horiz * i] != char:
            return False

    return True


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

    return ((bottom_right[0] - top_left[0]) * (bottom_right[1] - top_left[1]))


def print_grid(grid):
    for row in grid:
        print(' '.join(row))
    print()


def setup():
    with open('wordscapes.txt') as f:
        words = f.read().splitlines()
        words_by_len = defaultdict(list)
        for word in words:
            words_by_len[len(word)].append(word)

        # main_word = random.choice(words_by_len[8])
        main_word = 'arranges'
        puzzle_words = gen_puzzle_words(words_by_len, main_word)
        gen_crossword(puzzle_words)


if __name__ == '__main__':
    setup()
