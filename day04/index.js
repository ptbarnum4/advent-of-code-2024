const fs = require('fs/promises');
const path = require('path');

/** @returns {Promise<string[][]>} */
const getParsedData = async (file = 'data.txt') => {
  const data = await fs.readFile(path.resolve(__dirname, file), 'utf8');
  return data.split(/\r?\n/).map(r => r.split(''));
};

const XMAS = /** @type {const} */ (['X', 'M', 'A', 'S']);

/**
 * @typedef {string[][]} Grid
 * @typedef {-1 | 0 | 1} Direction
 */

/** @type {(grid: string[][], rowIndex: number, colIndex: number) => number} */
const countXMASAtPosition = (grid, r, c) => {
  let total = 0;

  /**
   * @param {Direction} ro
   * @param {Direction} co
   */
  const checkDir = (ro, co) => {
    const toDir = XMAS.reduce((word, l, i) => {
      const row = grid[r + i * ro];
      const letter = row?.[c + i * co];
      if (!letter || letter !== l) return '';
      return word + letter;
    }, '');
    if (toDir === 'XMAS') total++;
  };

  /** @type {Direction[]}  */
  const directions = [-1, 0, 1];

  directions.forEach(row => directions.forEach(col => checkDir(row, col)));

  return total;
};

/**
 * @param {string[][]} grid
 * @param {number} r
 * @param {number} c
 */
const countCrossMASAtPosition = (grid, r, c) => {
  const center = grid[r][c];
  if (center !== 'A') {
    return 0;
  }

  const isTop = r === 0;
  const isLeft = c === 0;
  const isBottom = r === grid.length - 1;
  const isRight = c === grid[0].length - 1;
  if (isTop || isLeft || isBottom || isRight) {
    return 0;
  }
  const topRow = grid[r - 1];
  const bottomRow = grid[r + 1];
  const leftIndex = c - 1;
  const rightIndex = c + 1;

  const NW = topRow[leftIndex];
  const SW = bottomRow[leftIndex];
  const NE = topRow[rightIndex];
  const SE = bottomRow[rightIndex];

  /** @param {string[]} letters */
  const hasRequiredLetters = letters => {
    return ['M', 'S'].every(l => letters.includes(l));
  };

  if (!hasRequiredLetters([NW, SE]) || !hasRequiredLetters([SW, NE])) {
    return 0;
  }
  return 1;
};

const day4 = async () => {
  // const grid = await getParsedData('example.txt');
  const grid = await getParsedData();

  const prompt1Total = grid.reduce((total, row, r) => {
    row.forEach((col, c) => (total += countXMASAtPosition(grid, r, c)));
    return total;
  }, 0);

  console.log('Prompt 1: ', prompt1Total);
  // Prompt 1: 2654

  const prompt2Total = grid.reduce((total, row, r) => {
    row.forEach((_col, c) => (total += countCrossMASAtPosition(grid, r, c)));
    return total;
  }, 0);

  console.log('Prompt 2: ', prompt2Total);
  // Prompt 2: 1990
};

module.exports = day4;
