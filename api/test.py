from icecream import ic
import pandas as pd

# df = pd.read_csv('wordscapes.csv')
# df = df.loc[df['count'] > 400000]
# df = df.reset_index(drop=True)
# print(df.info())

# df['word'].to_csv('wordscapes.txt', header=None, index=None)

with open('wordscapes.txt') as f:
    words = f.read().splitlines()
    print(sum(len(word) == 8 for word in words))
