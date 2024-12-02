const fs = require('fs/promises');
const path = require('path');

/** @returns {Promise<number[][]>} */
const getParsedData = async (file = 'data.txt') => {
  const data = await fs.readFile(path.resolve(__dirname, file), 'utf8');
  return data.split(/\r?\n/).map(row => row.split(' ').map(v => parseInt(v)));
};

/**
 * Determine if direction is ascending, descending, or same number (0)
 * @param {number} a - first number
 * @param {number} b - second number
 * @returns {-1|0|1}
 */
const getDirection = (a, b) => (a > b ? -1 : a < b ? 1 : 0);

/**  @param {number[]} row */
const checkSafeRow = row => {
  const max = 3;
  const min = 1;

  const [firstNum, secondNum] = row;
  const initialDirection = getDirection(firstNum, secondNum);

  for (let a = 0, b = 1; b < row.length; a++, b++) {
    const leftNum = row[a];
    const rightNum = row[b];
    const diff = Math.abs(leftNum - rightNum);
    const direction = getDirection(leftNum, rightNum);

    const isOutOfRange = diff < min || diff > max;
    const isWrongDirection = direction !== initialDirection;

    if (isOutOfRange || isWrongDirection) {
      // Row is unsafe
      return false;
    }
  }

  // Did not hit above, row is safe
  return true;
};

/**
 * @param {number[]} row
 * @returns {boolean} - `true` if row is safe
 */
const checkSafeDampenerRow = row => {
  if (checkSafeRow(row)) {
    // If row is safe, save the time and return true
    return true;
  }

  // Remove element at each index and check for safety
  for (let i = 0; i < row.length; i++) {
    // Prevent mutation of initial array
    const r = [...row];

    // Let's remove the current element
    r.splice(i, 1);

    if (checkSafeRow(r)) {
      // If the row is safe with one element removed, skip remaining iterations
      return true;
    }
  }

  // Safe row was not found
  return false;
};

const day2 = async () => {
  const rows = await getParsedData();

  // Part 1: Find safe rows
  const safeRows = rows.filter(n => checkSafeRow(n));
  console.log(`Prompt 1: ${safeRows.length}`);
  // Prompt 1: 483

  // Part 2: Find safe rows with dampener which forgives one bad element
  const dampenerSafeRows = rows.filter(n => checkSafeDampenerRow(n));
  console.log(`Prompt 2: ${dampenerSafeRows.length}`);
  // Prompt 2: 528
};

module.exports = day2;
