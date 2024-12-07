const fs = require('fs/promises');
const path = require('path');

/**
 * @typedef {`${number}|${number}`[]} OrderRules
 * @typedef {number[][]} PageNumbers
 */

const getParsedData = async (file = 'data.txt') => {
  const data = await fs.readFile(path.resolve(__dirname, file), 'utf8');

  /** @type {OrderRules} */
  const orderRules = [];

  /** @type { number[][]} */
  const pageNumbers = [];

  data.split(/\r?\n/).forEach(n => {
    if (!n) return;
    n.includes('|')
      ? orderRules.push(/**@type {OrderRules[number]} */ (n))
      : pageNumbers.push(n.split(',').map(v => parseInt(v)));
  });

  return { orderRules, pageNumbers };
};
/**
 * @param {number[]} arr
 * @param {number} a
 * @param {number} b
 */
const swapNums = (arr, a, b) => {
  const av = arr[a];
  const bv = arr[b];

  arr[a] = bv;
  arr[b] = av;

  return arr;
};

/**
 * @param {OrderRules} orderRules
 * @param {PageNumbers[number]} pageNumbers
 * @returns {number}
 */
const findValidMiddleNum = (orderRules, pageNumbers) => {
  const newRow = [...pageNumbers];
  const isValidRow = pageNumbers.every((page, i) => {
    for (let j = 0; j < i; j++) {
      if (j === i) return true;

      const nextPage = newRow[j];

      const hasInvalidOrder = orderRules.includes(
        /** @type {OrderRules[number]} */ (`${page}|${nextPage}`)
      );
      if (hasInvalidOrder) {
        return false;
      }
    }

    return true;
  });

  if (!isValidRow) {
    // console.log('Not Valid:', newRow)
    return 0;
  }
  // console.log('Valid:', newRow)

  return newRow[Math.floor(newRow.length / 2)];
};

const fixRow = (orderRules, row) => {
  for (let i = 0; i < row.length; i++) {
    const a = row[i];
    for (let j = i + 1; j < row.length; j++) {
      const b = row[j];
      const matchStr = `${b}|${a}`;
      const hasMatch = orderRules.includes(matchStr);
      if (hasMatch) {
        swapNums(row, i, j);
      }
    }
  }

  const validMiddleNum = findValidMiddleNum(orderRules, row);
  return !validMiddleNum ? fixRow(orderRules, [...row]) : validMiddleNum;
};

const day5 = async () => {
  const { pageNumbers, orderRules } = await getParsedData();

  const prompt1Total = pageNumbers.reduce(
    (total, pageNumberRow) =>
      total + findValidMiddleNum(orderRules, pageNumberRow),
    0
  );

  console.log('Prompt 1: ', prompt1Total);
  // Prompt 1: 6505

  const prompt2Total = pageNumbers
    .filter(pageNumberRow => !findValidMiddleNum(orderRules, pageNumberRow))
    .map(row => fixRow(orderRules, [...row]))
    .reduce((total, n) => total + n, 0);

  console.log('Prompt 2: ', prompt2Total);
  // Prompt 2: 6897
};

module.exports = day5;
