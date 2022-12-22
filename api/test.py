# %%
with open('wordnik.txt') as f:
    wordnik = [line.strip('\"') for line in f.read().splitlines()]
    wordnik = set([word for word in wordnik if 3 <= len(word) <= 9])
    print(len(wordnik))

with open('wordscapes_txt.txt') as f:
    words = f.read().splitlines()
    words = [word for word in words if word in wordnik]
    print(words[:-100])
# %%
# write all words to clean_words.txt
with open('clean_words.txt', 'w') as f:
    for word in words:
        f.write(word + '\n')
