const fs = require('fs/promises');
const path = require('path');

/** @returns {Promise<string[]>} */
const getParsedData = async (file = 'data.txt') => {
  const data = await fs.readFile(path.resolve(__dirname, file), 'utf8');
  return data.split(/\r?\n/);
};

/**
 * @param {string} str
 * @returns {number[][]}
 */
const parseMulStatements = str => {
  return Array.from(str.matchAll(/mul\(\d{1,3},\d{1,3}\)/gi)).map(([mul]) =>
    mul
      .slice(4, -1)
      .split(',')
      .map(v => parseInt(v))
  );
};
/**
 * @param {string} str
 * @returns {number[][]}
 */
const parseMulStatementsWithConditions = str => {
  let isStopped = false;
  return Array.from(str.matchAll(/mul\(\d{1,3},\d{1,3}\)|don\'t\(\)|do\(\)/gi))
    .map(([mul]) => {
      if (mul.includes("don't")) {
        isStopped = true;
        return 'STOP';
      }
      if (mul.includes('do')) {
        isStopped = false;
        return 'START';
      }
      if (isStopped) {
        return null;
      }
      return mul
        .slice(4, -1)
        .split(',')
        .map(v => parseInt(v));
    })
    .filter(v => Array.isArray(v));
};

/**
 * @param {number[]} nums
 * @returns {number}
 */
const add = nums => nums.reduce((total, num) => num + total, 0);

const day3 = async () => {
  const lines = await getParsedData();
  const mulStatements = parseMulStatements(lines.join(''));
  const total1 = add(mulStatements.map(([a, b]) => a * b));
  console.log(`Prompt 1: ${total1}`);
  // Prompt 1: 196_826_776

  const mulStatementsWithConditions = parseMulStatementsWithConditions(
    lines.join('')
  );

  const total2 = add(mulStatementsWithConditions.map(([a, b]) => a * b));
  console.log(`Prompt 2: ${total2}`);
  // Prompt 2: 106_780_429
};

module.exports = day3;
