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
it here. In particular, the solution I gave in the interview used O(n) memory,
and this should use O(sqrt(n)).

## How it works

The old algorithm worked by stepping through all 0-n values, figuring out where
in the 2D data structure it should live, and writing it there. After that the
2D data structure was printed line by line.

In contrast this algorithm jumps straight to printing line-by-line, computing
all of the value on the fly without the use of an auxiliary data structure. It
takes advantage of the fact that values on diagonals and midpoints are
relatively easy to compute, and other values can be computed as simple offsets
from their nearest midpoint value. Diagonals are defined be diagonal lines that
intersect at the '0' cell, and midpoints are halfway between two diagonals. In
this diagram diagonals are denoted as 'D' and midpoints are denoted as 'M'. Note
that because the '0' cell isn't always exactly in the center, the diagonals
don't always hit the corners exactly:

```
// This could be for printSpiral(19)
_   D   M   D   _
M   M   0   M   M
_   D   M   D   _
D   _   M   _   D
```

The formula for midpoint values is:

```
k * layer + 4 * layer * (layer - 1)
```

Where `k` is a constant based on the Region (RIGHT, LEFT, TOP, BOTTOM) and
`layer` is how far from the '0' cell the current cell is.

The `k` constant is just the first value in that row/column of midpoints:

```
6   7   8
5   0   1
4   3   2
```

So for `Region.RIGHT`, `k` is `1`, for `BOTTOM` it's `3`, for `LEFT` it's `5`,
and for `TOP` it's `7`.

The formula for values on diagonal lines is the same, but the values of `k`
become `8`, `2`, `4`, and `6` instead.

Cells other than midpoints and diagonals can be computed by first computing the
value of the nearest midpoint, and then adding or subtracting an offset based on
how far away the current cell is from its neareast midpoint.

For example this row could be computed by first computing the
midpoint value (14) and then computing left and right of the midpoint by adding
and subtracting the distance from the midpoint.

```
// This could be for printSpiral(19)
_   D   M   D   _
M   M   0   M   M
_   D   M   D   _
16  15  14  13  12
```

## To Run

```
tsc
node main.js
```

or run `tsc -w` in the background, and then run `node main.js` as needed.
