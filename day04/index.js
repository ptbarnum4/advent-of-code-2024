const fs = require('fs/promises');
const path = require('path');

/** @returns {Promise<string[][]>} */
const getParsedData = async (file = 'data.txt') => {
  const data = await fs.readFile(path.resolve(__dirname, file), 'utf8');
  return data.split(/\r?\n/).map(r => r.split(''));
};

const XMAS = ['X', 'M', 'A', 'S'];

/**
 * @param {string[][]} grid
 * @param {number} r
 * @param {number} c
 */
const countXMASAtPosition = (grid, r, c) => {
  let total = 0;

  /**
   *
   * @param {-1|0|1} ro
   * @param {-1|0|1} co
   */
  const checkDir = (ro, co) => {
    const toDir = XMAS.reduce((word, l, i) => {
      const row = grid[r + i * ro];
      if (!row) return '';

      const letter = row[c + i * co];
      if (!letter || letter !== l) {
        return '';
      }

      return word + letter;
    }, '');
    if (toDir === 'XMAS') {
      total++;
    }
  };

  checkDir(0, 1); // Left to Right
  checkDir(0, -1); // Right to Left
  checkDir(1, 0); // Top to Bottom
  checkDir(-1, 0); // Bottom to Top
  checkDir(-1, -1); // Bottom-Right to Top-Left
  checkDir(1, 1); // Top-Left to Bottom-Right
  checkDir(-1, 1); // Bottom-Left to Top-Right
  checkDir(1, -1); // Top-Right to Bottom-Left

  return total;
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
};

module.exports = day4;
