const fs = require('fs/promises');
const path = require('path');

/**
 * @typedef {string[]} GridRow
 * @typedef {GridRow[]} Grid
 * @typedef {{ row: number; col: number }} Coords
 * @typedef {{ row: -1|0|1; col: -1|0|1 }} Direction
 */

const directionMap = {
  up: { row: -1, col: 0 },
  right: { row: 0, col: 1 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 }
};

const directionOrder = /**@type {const} */ (['up', 'right', 'down', 'left']);

/** @returns {Promise<Grid>} */
const getParsedData = async (file = 'data.txt') => {
  const data = await fs.readFile(path.resolve(__dirname, file), 'utf8');
  return data.split(/\r?\n/).map(r => r.split(''));
};

/** @param {Grid} grid @returns {string}  */
const gridToString = grid => grid.map(row => row.join('')).join('\n');

/**
 *
 * @param {Grid} grid
 * @returns {{ row: number; col: number }}
 */
const findStart = grid => {
  const coords = { row: 0, col: 0 };
  for (let r = 0; r < grid.length; r++) {
    const row = grid[r];
    for (let c = 0; c < row.length; c++) {
      const col = row[c];
      if (col === '^') {
        return { row: r, col: c };
      }
    }
  }
  return coords;
};

/**
 *
 * @param {Grid} grid
 * @param {Coords} position
 * @param {(typeof directionOrder)[number]} directionName
 */
const walk = (grid, position, directionName) => {
  const direction = directionMap[directionName];
  const nextPos = {
    row: position.row + direction.row,
    col: position.col + direction.col
  };

  const nextChar = grid[nextPos.row]?.[nextPos.col];
  if (!nextChar) {
    grid[position.row][position.col] = 'X';
    return;
  }

  if (nextChar === '#') {
    const dirIndex = directionOrder.indexOf(directionName);
    const nextDir = directionOrder[dirIndex + 1] ?? 'up';
    return walk(grid, position, nextDir);
  }

  grid[position.row][position.col] = 'X';

  return walk(grid, nextPos, directionName);
};

/**
 * @param {Grid} grid
 * @returns {number}
 */
const countPath = grid => {
  return grid.reduce(
    (total, row) => total + row.filter(v => v === 'X').length,
    0
  );
};

const day6 = async () => {
  const grid = await getParsedData();
  // const grid = await getParsedData('example.txt');
  const startPosition = findStart(grid);

  walk(grid, startPosition, 'up');

  console.log('Prompt 1: ', countPath(grid));
};

module.exports = day6;
