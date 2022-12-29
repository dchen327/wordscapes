# %%
import json
import random
from PyDictionary import PyDictionary
import enchant

# %%
with open('wordnik.txt') as f:
    wordnik = [line.strip('\"') for line in f.read().splitlines()]
    wordnik = set([word for word in wordnik if 3 <= len(word) <= 9])
    print(len(wordnik))
# %%
num_has_meaning = 0
three_ls = [word for word in wordnik if len(word) == 3]
dictionary = PyDictionary()
enchant_dict = enchant.Dict('en_US')

for i, word in enumerate(three_ls):
    if i % 50 == 0:
        print(i)
    definition = dictionary.meaning(word, disable_errors=True)
    if definition is not None:
        num_has_meaning += 1
        # print(word, definition)

print(num_has_meaning)
# %%
num_has_meaning = 0
three_ls = [word for word in wordnik if len(word) == 3]
four_ls = [word for word in wordnik if len(word) == 4]
five_ls = [word for word in wordnik if len(word) == 5]
six_ls = [word for word in wordnik if len(word) == 6]
# dictionary = PyDictionary()
enchant_dict = enchant.Dict('en_US')

for i, word in enumerate(six_ls):
    if i % 50 == 0:
        print(i)
    if enchant_dict.check(word):
        num_has_meaning += 1
        # print(word, definition)

print(num_has_meaning, len(six_ls))
# %%
for word in random.choices(list(wordnik), k=50):
    if not enchant_dict.check(word):
        print(word, dictionary.meaning(word, disable_errors=True))
# %%
with open('wordscapes_txt.txt') as f:
    words = f.read().splitlines()
    words = [word for word in words if word in wordnik]
    print(words[:-100])
# %%
# write all words to clean_words.txt
with open('clean_words.txt', 'w') as f:
    for word in words:
        f.write(word + '\n')

# %%

lst = []
with open('wiktionary.json', 'r', encoding='utf-8') as f:
    line_num = 1
    for line in f:
        lst.append(json.loads(line))
        line_num += 1
        if line_num > 100:
            break

print(lst[0].keys())
