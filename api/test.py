# %%
with open('wordnik.txt') as f:
    words = [line.strip('\"') for line in f.read().splitlines()]
    words = [word for word in words if 3 <= len(word) <= 9]
    print(len(words))
    print(words[:100])
