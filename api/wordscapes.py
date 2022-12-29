import random
import itertools
import os
import shutil
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
    for word_len in range(3, 9):
        subwords.extend(word for word in words_by_len[word_len] if contains(
            Counter(word), main_ct))

    return subwords


def gen_crossword(puzzle_words: List[str], output_file: str):
    ''' Generates a crossword from the provided puzzle words.
        Place words into crossword, trying to maximize metric for 'goodness'
        - Start by randomly placing the main word (longest)
        - At each step:
            - Pick random set of crosswords
            - Pick a random word and try to insert 
        - Store a crossword as a grid and the used dictionary
        - Returns None if no crossword can be generated with at least 6 words,
            otherwise returns a generated crossword
    '''
    R, C = 10, 10
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
    no_3_letters = [word for word in puzzle_words if len(word) > 3]
    # prioritize adding longer words
    word_weights = [len(word) - 2.5 for word in no_3_letters]

    words = list(np.random.choice(no_3_letters, size=min(
        len(no_3_letters), 50), replace=False, p=word_weights/np.sum(word_weights)))

    # add max 3 random 3-letter words
    three_letters = [word for word in puzzle_words if len(word) == 3]
    words.extend(random.choices(three_letters, k=min(3, len(three_letters))))

    # 12-16 words (random 11-15 + start word)
    for num_words in range(random.randint(11, 15)):
        new_crosswords = []
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

        if new_crosswords:
            crosswords = new_crosswords
        else:
            break

    if num_words < 6:  # crossword too small
        return None

    for grid, used in random.choices(crosswords, k=1):
        # print_grid(grid)
        with open(output_file, 'w') as f:
            # write used words to file
            f.write(str(len(used)) + '\n')
            for word in used:
                word_info = used[word]
                f.write(
                    f'{word.upper()} {word_info.r} {word_info.c} {word_info.horiz}\n')

            # write grid to file
            f.write(f'{R} {C}\n')
            print_grid(grid, file=f, caps=True)

            # bonus words
            bonus_words = set(puzzle_words) - set(used.keys())
            f.write(str(len(bonus_words)) + '\n')
            for word in bonus_words:
                f.write(word.upper() + '\n')

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


def print_grid(grid, file=None, caps=False):
    for row in grid:
        if caps:
            print(' '.join(row).upper(), file=file)
        else:
            print(' '.join(row), file=file)
    # print()


def setup():
    with open('clean_words.txt') as f:
        words = f.read().splitlines()
        words_by_len = defaultdict(list)
        for word in words:
            words_by_len[len(word)].append(word)

        num_crosswords = 100  # will try to generate this many, might be fewer

        main_words = random.choices(
            words_by_len[8] + words_by_len[7], k=2*num_crosswords)

        # clear any previous puzzles
        if os.path.exists('levels'):
            shutil.rmtree('levels')
        # make puzzles directory
        os.makedirs('levels')

        # level_num = 1
        # while level_num <= num_crosswords:
        #     main_word = main_words.pop()
        #     puzzle_words = gen_puzzle_words(words_by_len, main_word)
        #     output_file = f'levels/level_{level_num}.txt'
        #     if gen_crossword(
        #             puzzle_words, output_file) is not None:
        #         print(f'Crossword #{level_num}: {main_word}')
        #         level_num += 1

        main_word = random.choice(words_by_len[8])
        main_word = 'readings'
        l = []
        l2 = []
        for word in random.choices(words_by_len[8] + words_by_len[7], k=1000):
            puzzle_words = gen_puzzle_words(words_by_len, word)
            l.append(len(puzzle_words))
            no_3_ls = [c for c in puzzle_words if len(c) > 3]
            l2.append(len(no_3_ls))

        import pandas as pd
        print(pd.Series(l).describe(
            percentiles=[.25, .5, .6, .7, .8, .9, .95, .99]))
        print(pd.Series(l2).describe(
            percentiles=[.25, .5, .6, .7, .8, .9, .95, .99]))
        # puzzle_words = gen_puzzle_words(words_by_len, main_word)
        # gen_crossword(puzzle_words, 'puzzle.txt')


if __name__ == '__main__':
    setup()
