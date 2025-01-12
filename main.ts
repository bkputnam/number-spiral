/**
 * Describes a triangle covering approx 1/4 of the total spiral area. Triangles
 * are delimited by diagonal lines that intersect at the '0' cell.
 *
 * Cells on the diagonal lines may often be considered to be a part of the
 * Region on either side.
 */
enum Region {
  RIGHT = "right",
  TOP = "top",
  LEFT = "left",
  BOTTOM = "bottom",
}

/**
 * STARTING_NUMS are the middle numbers from layerIndex=1.
 *
 *  6 *7* 8
 * *5* 0 *1*
 *  4 *3* 2
 */
const STARTING_NUMS = {
  [Region.RIGHT]: 1,
  [Region.BOTTOM]: 3,
  [Region.LEFT]: 5,
  [Region.TOP]: 7,
};

/**
 * Computes the value of a midpoint cell.
 *
 * A midpoint cell is a cell that's either directly up, down, left or right of
 * the '0' cell. It represents the midpoint of a line of consequtive numbers,
 * and other cells in the same line of consequtive numbers are computed via
 * offsets from this value.
 */
function midpointValue(region: Region, layerIndex: number): number {
  const startingNum = STARTING_NUMS[region];
  const n = layerIndex; // Use a shorter variable name for convenience.
  return startingNum * n + 4 * n * (n - 1);
}

/**
 * DIAG_STARTING_NUMS are the diagonal numbers from layerIndex=1. Each diagonal
 * is counter-clockwise from the Region that identifies it.
 *
 * *6* 7 *8*
 *  5  0  1
 * *4* 3 *2*
 */
const DIAG_STARTING_NUMS = {
  [Region.RIGHT]: 8,
  [Region.TOP]: 6,
  [Region.LEFT]: 4,
  [Region.BOTTOM]: 2,
};

/**
 * Computes the value of a diagonal cell.
 *
 * These cells are on one of the 4 diagonal rays originating at the '0' cell.
 * The diagonal rays are identified by Region - each Region produces the
 * diagonal line on its counter-clockwise edge. For example Region.RIGHT denotes
 * the upper-right diagonal ray.
 */
function diagonalValue(region: Region, layerIndex: number): number {
  const startingNum = DIAG_STARTING_NUMS[region];
  const n = layerIndex; // shorthand
  return 4 * n * (n - 1) + startingNum * n;
}

/**
 * Computes how many layers you need in each Region to store a spiral with
 * maxNum numbers in it.
 *
 * @param maxNum The number of numbers in the spiral
 * @returns
 */
function layersPerRegion(maxNum: number): { [key in Region]: number } {
  // Because each new layer starts in the RIGHT direction, all layer counts
  // will be equal to either `rightLayerCount` or `rightLayerCount - 1`.
  const k = STARTING_NUMS[Region.RIGHT]; // 1
  const s = Math.sqrt(k * k - 10 * k + 16 * maxNum + 9);
  const rightLayerCount = Math.floor((1 / 8) * (s - k + 5));

  const result: Partial<{ [key in Region]: number }> = {
    [Region.RIGHT]: rightLayerCount,
  };

  // For every Region except for RIGHT, we'll add a new layer when the maxVal
  // is greater than or equal to the diagonal at the start of that line.
  //
  // RIGHT is different because it's always the first side of a new layer, which
  // means that we would have to go 1 past the diagonal to start a new layer.
  // But the number of layers for RIGHT is computed directly before this, so
  // that nuance doesn't matter here.
  for (const dir of [Region.TOP, Region.LEFT, Region.BOTTOM]) {
    result[dir] =
      maxNum >= diagonalValue(dir, rightLayerCount)
        ? rightLayerCount
        : rightLayerCount - 1;
  }
  return result as { [key in Region]: number };
}

/**
 * Given relative coordinates, return which Region those coordinates are in.
 *
 * Relative coordinates are offset from the usual absolute row/col coordinates
 * such that [0, 0] lands on the '0' cell. Negative indices are common.
 */
function whichRegion(relativeRow: number, relativeCol: number): Region {
  if (Math.abs(relativeRow) >= Math.abs(relativeCol)) {
    return relativeRow < 0 ? Region.TOP : Region.BOTTOM;
  } else {
    return relativeCol < 0 ? Region.LEFT : Region.RIGHT;
  }
}

// A dumb way to avoid printing cells with value > maxVal
function formatStr(val: number, maxVal: number): string {
  if (val > maxVal) {
    return "";
  }
  return String(val);
}

function printSpiral(maxNum: number): void {
  const shape = layersPerRegion(maxNum);
  const width = shape[Region.LEFT] + shape[Region.RIGHT] + 1;
  const height = shape[Region.BOTTOM] + shape[Region.TOP] + 1;

  // Offsets to get to the '0' row and column
  const centerCol = shape[Region.LEFT];
  const centerRow = shape[Region.TOP];

  const row = new Array(width);
  for (let absoluteRow = 0; absoluteRow < height; absoluteRow++) {
    // The relative coordinate system shifts everything so that [0, 0] is the
    // '0' cell.
    const relativeRow = absoluteRow - centerRow;

    // Every row has 3 parts: left of the left diagonal, center, and right of
    // the right diagonal. In some rows, some of the parts may have zero width,
    // but the total width will always be `width`. These indices partition the
    // row into those three regions. Note that the central region may belong to
    // either Region.TOP or Region.BOTTOM and that will affect some
    // calculations. Indices are in absolute coordinates.
    const leftDiagonalIndex = centerCol - Math.abs(relativeRow);
    const rightDiagonalIndex = centerCol + Math.abs(relativeRow);
    const centerRegion = relativeRow < 0 ? Region.TOP : Region.BOTTOM;

    // Start by filling in the part left of the left diagonal. Compute values
    // by finding the closest midpoint value, and then adding/subtracting an
    // offset based on the relative row/col. Note that for cells on a diagonal
    // there are two equally close midpoint values - it doesn't matter which you
    // start with.
    for (let leftIndex = 0; leftIndex < leftDiagonalIndex; leftIndex++) {
      const centerRowVal = midpointValue(Region.LEFT, centerCol - leftIndex);
      row[leftIndex] = centerRowVal - relativeRow;
    }

    // Fill in the central region
    const rowMidpointValue = midpointValue(centerRegion, Math.abs(relativeRow));
    for (
      let centerIndex = leftDiagonalIndex;
      centerIndex <= rightDiagonalIndex;
      centerIndex++
    ) {
      const relativeCol = centerIndex - centerCol;
      // In the TOP region, values increase left to right, so we want to add the
      // offset to the midpoint value. In the BOTTOM region values decrease left
      // to right, and so we subtract the same offset.
      const addOrSubtract = centerRegion === Region.TOP ? 1 : -1;
      row[centerIndex] = rowMidpointValue + addOrSubtract * relativeCol;
    }

    // Fill in right of the right diagonal
    for (
      let rightIndex = rightDiagonalIndex + 1;
      rightIndex < width;
      rightIndex++
    ) {
      const colMidpiontValue = midpointValue(
        Region.RIGHT,
        rightIndex - centerCol
      );
      row[rightIndex] = colMidpiontValue + relativeRow;
    }

    console.log(row.map((num) => formatStr(num, maxNum)).join("\t"));
  }
}

// printSpiral(8);
// console.log();
// printSpiral(9);
printSpiral(18);
