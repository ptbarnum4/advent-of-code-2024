const fs = require('fs/promises');
const path = require('path');

/** @returns {Promise<number[][]>} */
const getParsedData = async (file = 'data.txt') => {
  const data = await fs.readFile(path.resolve(__dirname, file), 'utf8');
  return data.split(/\r?\n/).map(row => row.split(' ').map(v => parseInt(v)));
};

const getDirection = (a, b) => {
  if (a > b) {
    return -1;
  }
  if (a < b) {
    return 1;
  }
  return 0;
};
/**  @param {number[]} row */
const checkSafeRow = row => {
  const maxThreshold = 3;
  const initialDirection = getDirection(row[0], row[1]);

  for (let a = 0, b = 1; b < row.length; a++, b++) {
    const leftNum = row[a];
    const rightNum = row[b];
    const diff = Math.abs(leftNum - rightNum);
    const dir = getDirection(leftNum, rightNum);

    if (dir !== initialDirection || diff > maxThreshold || diff < 1) {
      return false;
    }
  }
  return true;
};

/**  @param {number[]} row */
const checkSafeDampenerRow = row => {
  if (checkSafeRow(row)) {
    return true;
  }

  for (let i = 0; i < row.length; i++) {
    const r = [...row]
    r.splice(i, 1);
    // console.log(r)
    if (checkSafeRow(r)) {
      return true;
    }
  }
  return false;
};

const day2 = async () => {
  const rows = await getParsedData( );
  const safeRows = rows.filter(n => checkSafeRow(n));
  console.log(`Prompt 1: ${safeRows.length}`);

  const dampenerSafeRows = rows.filter(n => checkSafeDampenerRow(n));
  // console.log(dampenerSafeRows);
  console.log(`Prompt 2: ${dampenerSafeRows.length}`);

};

module.exports = day2;
