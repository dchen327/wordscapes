# Wordscapes++
## TODO:
- start by randomly inserting longest word (random start, random direction)
can insert bug:
m e m o - t r e o -
o - a - r - o - - m
o - r o o m m a t e
r - t - m - e - - t
e - - - a t o m - a

rome, then romeo (passes, because no new words created)
but must not remove old words

can insert: words can overwrite prev?
ic| used: {'clin': WordInfo(word='clin', r=0, c=0, horiz=False),
           'ieee': WordInfo(word='ieee', r=0, c=3, horiz=False),
           'lens': WordInfo(word='lens', r=0, c=7, horiz=False),
           'licensee': WordInfo(word='licensee', r=1, c=0, horiz=True),
           'nice': WordInfo(word='nice', r=3, c=0, horiz=True),
           'nile': WordInfo(word='nile', r=3, c=0, horiz=True),
           'seen': WordInfo(word='seen', r=0, c=7, horiz=False)}
['licensee', 'lens', 'clin', 'nice', 'ieee', 'nile', 'seen']
c - - i - - - s
l i c e n s e e
i - - e - - - e
n i l e - - - n