const fs = require('fs/promises');
const path = require('path');

/**
 * - Evaluate operators left to right
 * - a + b * c => ab * c => total
 * Example: 2 + 4 * 7 => 6 * 7 => 35
 * @typedef {'+'|'*'} Operator
 * @typedef {{
 *   total: number;
 *   numbers: number[];
 *   symbols: Operator[][];
 * }} Equation
 *
 */

const SYMBOLS = /** @type {Operator[]} */ (['*', '+']);

/**
 * @param {number} length
 * @param {Operator[]} used
 * @returns {Operator[][]}
 */
const getAllSymbolCombos = (length, used = []) => {
  if (used.length === length) {
    return [used];
  }
  return SYMBOLS.flatMap(symbol =>
    getAllSymbolCombos(length, [...used, symbol])
  );
};

const getSymbolCombos = (() => {
  /** @type {Map<number, Operator[][]>} */
  const combosMap = new Map();

  /**
   * @param {number} length
   * @returns {Operator[][]}
   */
  return length => {
    const combos = combosMap.get(length);
    if (combos) {
      return combos;
    }
    const newCombos = getAllSymbolCombos(length);
    combosMap.set(length, newCombos);

    return newCombos;
  };
})();

/** @returns {Promise<Equation[]>} */
const getParsedData = async (file = 'data.txt') => {
  const data = await fs.readFile(path.resolve(__dirname, file), 'utf8');
  return data.split(/\r?\n/).map(row => {
    const [totalStr, numsStr] = row.split(': ');
    const total = parseInt(totalStr);
    const numbers = numsStr.split(' ').map(v => parseInt(v.trim()));

    return {
      total,
      numbers,
      symbols: getSymbolCombos(numbers.length - 1)
    };
  });
};

/**
 *
 * @param {number[]} numbers
 * @param {Operator[]} symbols
 */
const calculate = (numbers, symbols) => {
  let total = numbers[0];

  for (let i = 0; i < numbers.length - 1; i++) {
    const symbol = symbols[i];
    const right = numbers[i + 1];

    if (symbol === '*') {
      total *= right;
    } else {
      total += right;
    }
  }
  return total;
};

/** @param {Equation} eq */
const testEq = eq => {
  for (let i = 0; i < eq.symbols.length; i++) {
    const symbols = eq.symbols[i];
    const total = calculate(eq.numbers, symbols);
    if (total === eq.total) {
      return { ...eq, symbols: [...symbols], valid: true };
    }
  }
  return { ...eq, valid: false };
};

const day7 = async () => {
  // const equations = await getParsedData('example.txt');
  const equations = await getParsedData();

  const validEqSum = equations
    .map(eq => testEq(eq))
    .filter(e => e.valid)
    .reduce((total, q) => total + q.total, 0);

  console.log('Prompt 1:', validEqSum);
  // Prompt 1: 4_998_764_814_652
};

module.exports = day7;
