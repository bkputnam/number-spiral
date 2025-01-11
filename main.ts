/**
 * Describes a triangle covering approx 1/4 of the total spiral area. Triangles
 * are delimited by diagonal lines that intersect at the '0' cell.
 *
 * Cells on the diagonal lines may often be considered to be a part of the
 * QuadTri on either side.
 */
enum QuadTri {
  RIGHT = "right",
  LOWER = "lower",
  LEFT = "left",
  UPPER = "upper",
}

/**
 * STARTING_NUMS are the middle numbers from layerIndex=1.
 *
 *  6 *7* 8
 * *5* 0 *1*
 *  4 *3* 2
 */
const STARTING_NUMS = {
  [QuadTri.RIGHT]: 1,
  [QuadTri.LOWER]: 3,
  [QuadTri.LEFT]: 5,
  [QuadTri.UPPER]: 7,
};

function midpointValue(quadtri: QuadTri, layerIndex: number): number {
  const startingNum = STARTING_NUMS[quadtri];
  const n = layerIndex; // Use a shorter variable name for convenience.
  return startingNum * n + 4 * n * (n - 1);
}

/**
 * DIAG_STARTING_NUMS are the diagonal numbers from layerIndex=1. Each diagonal
 * is counter-clockwise from the QuadTri that identifies it.
 *
 * *6* 7 *8*
 *  5  0  1
 * *4* 3 *2*
 */
const DIAG_STARTING_NUMS = {
  [QuadTri.RIGHT]: 8,
  [QuadTri.LOWER]: 2,
  [QuadTri.LEFT]: 4,
  [QuadTri.UPPER]: 6,
};

function diagonalValue(quadtri: QuadTri, layerIndex: number): number {
  const startingNum = DIAG_STARTING_NUMS[quadtri];
  const n = layerIndex; // shorthand
  return 4 * n * (n - 1) + startingNum * n;
}

/**
 * Computes how many layers you need in each direction to store a spiral with
 * maxNum numbers in it.
 *
 * @param maxNum The number of numbers in the spiral
 * @returns
 */
function howManyLayers(maxNum: number): { [key in QuadTri]: number } {
  // Because each new layer starts in the RIGHT direction, all layer counts
  // will be equal to either `rightLayerCount` or `rightLayerCount - 1`.
  const k = STARTING_NUMS[QuadTri.RIGHT]; // 1
  const s = Math.sqrt(k * k - 10 * k + 16 * maxNum + 9);
  const rightLayerCount = Math.floor((1 / 8) * (s - k + 5));

  const result: Partial<{ [key in QuadTri]: number }> = {
    [QuadTri.RIGHT]: rightLayerCount,
  };

  // For every QuadTri except for RIGHT, we'll add a new layer when the maxVal
  // is greater than or equal to the diagonal at the start of that line.
  //
  // RIGHT is different because it's always the first side of a new layer, which
  // means that we would have to go 1 past the diagonal to start a new layer.
  // But the number of layers for RIGHT is computed directly before this, so
  // that nuance doesn't matter here.
  for (const dir of [QuadTri.LOWER, QuadTri.LEFT, QuadTri.UPPER]) {
    result[dir] =
      maxNum >= diagonalValue(dir, rightLayerCount)
        ? rightLayerCount
        : rightLayerCount - 1;
  }
  return result as { [key in QuadTri]: number };
}

for (let i = 0; i < 26; i++) {
  console.log(`${i}: ` + JSON.stringify(howManyLayers(i)));
}
