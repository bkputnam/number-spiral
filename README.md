# number-spiral

Prints numbers 0-n (inclusive) in a spiral like this:

```
// printSpiral(18) should produce:
    6  7  8  9
18  5  0  1 10
17  4  3  2 11
16 15 14 13 12
```

This is a solution to an interview problem proposed by Peter Yee from The Trade
Desk. I thought of a better solution after the interview and decided to explore
it here. In particular, the solution I gave in the interview used O(n^2) memory,
and this should use O(n) (or O(1) if you get rid of the caching).

## To Run

```
tsc
node main.js
```

or run `tsc -w` in the background, and then run `node main.js` as needed.
