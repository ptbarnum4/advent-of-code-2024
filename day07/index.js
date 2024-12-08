const fs = require('fs/promises');
const path = require('path');

/**
 * - Evaluate operators left to right
 * - a + b * c => ab * c => total
 * Example: 2 + 4 * 7 => 6 * 7 => 35
 * @typedef {'+' | '*' | '|'} Operator
 * @typedef {{
 *   total: number;
 *   numbers: number[];
 *   symbols: Operator[][];
 *   valid?: boolean
 * }} Equation
 *
 */

const SYMBOLS = /** @type {Operator[]} */ (['*', '+']);
const CONCAT_SYMBOLS = /** @type {Operator[]} */ (['*', '+', '|']);

/** @returns {Promise<Omit<Equation, 'symbols'>[]>} */
const getParsedData = async (file = 'data.txt', symbols = ['+', '*']) => {
  const data = await fs.readFile(path.resolve(__dirname, file), 'utf8');
  return data.split(/\r?\n/).map(row => {
    const [totalStr, numsStr] = row.split(': ');

    return {
      total: parseInt(totalStr),
      numbers: numsStr.split(' ').map(v => parseInt(v.trim()))
    };
  });
};

/**
 * @param {number} length
 * @param {Operator[]} symbols
 * @param {Operator[]} used
 * @returns {Operator[][]}
 */
const getAllSymbolCombos = (length, symbols, used = []) => {
  if (used.length === length) {
    return [used];
  }
  return symbols.flatMap(symbol =>
    getAllSymbolCombos(length, symbols, [...used, symbol])
  );
};

/** @param {Operator[]} symbols */
const createComboMap = symbols => {
  /** @type {Map<number, Operator[][]>} */
  const combosMap = new Map();

  /** @param {number} length */
  return length => {
    const combos = combosMap.get(length);
    if (combos) return combos;

    const newCombos = getAllSymbolCombos(length, symbols);
    combosMap.set(length, newCombos);

    return newCombos;
  };
};

const getSymbolCombos = createComboMap(SYMBOLS);
const getSymbolConcatCombos = createComboMap(CONCAT_SYMBOLS);

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
    } else if (symbol === '|') {
      const str = String(total) + String(right);
      total = parseInt(str);
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

/**
 * @param {Omit<Equation, 'symbols'>[]} equations
 * @param {ReturnType<typeof createComboMap>} cb
 * @returns {Equation[]}
 */
const injectSymbols = (equations, cb) => {
  return equations.map(eq => ({ ...eq, symbols: cb(eq.numbers.length - 1) }));
};

const day7 = async () => {
  const equations = await getParsedData();

  const validEqSum = injectSymbols(equations, getSymbolCombos)
    .map(testEq)
    .filter(e => e.valid)
    .reduce((total, q) => total + q.total, 0);

  console.log('Prompt 1:', validEqSum);
  // Prompt 1: 4_998_764_814_652

  const validEqConcatSum = injectSymbols(equations, getSymbolConcatCombos)
    .map(testEq)
    .filter(e => e.valid)
    .reduce((total, q) => total + q.total, 0);

  console.log('Prompt 2:', validEqConcatSum);
  // Prompt 2: 37_598_910_447_546
};

module.exports = day7;
