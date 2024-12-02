const fs = require('fs/promises');
const path = require('path');

/** @returns {Promise<{ left: number; right: number }[]>} */
const getParsedData = async (file = 'data.txt') => {
  const data = await fs.readFile(path.resolve(__dirname, file), 'utf8');
  return data.split(/\r?\n/).map(s => {
    const [left, right] = s
      .split(' ')
      .filter(v => !!v)
      .map(v => parseInt(v.trim()));
    return { left, right };
  });
};

/**
 * @param { { left: number; right: number }[]} groups
 * @returns {{ leftGroup: number[], rightGroup: number[] }}
 */
const sortGroups = groups => {
  const leftGroup = groups.map(({ left }) => left).sort((a, b) => a - b);
  const rightGroup = groups.map(({ right }) => right).sort((a, b) => a - b);
  return { leftGroup, rightGroup };
};

const calculateDistances = ({ leftGroup, rightGroup }) => {
  return leftGroup.map((v1, i) => Math.abs(v1 - rightGroup[i]));
};

/**
 * @param {number[]} arr
 * @returns {number} - Sum of array
 */
const add = arr => arr.reduce((total, val) => total + val, 0);

/** @param { { left: number; right: number }[]} groups  */
const findSimilarityScore = groups => {
  return groups.map(
    ({ left }) =>
      groups.reduce((max, { right }) => (left === right ? max + 1 : max), 0) *
      left
  );
};

const day1 = async () => {
  const lines = await getParsedData();
  const part1Total = add(calculateDistances(sortGroups(lines)));
  console.log(`Part 1: ${part1Total}`);
  // Part 1: 1882714

  const part2Total = add(findSimilarityScore(lines));
  console.log(`Part 2: ${part2Total}`);
  // Part 2: 19437052
};

module.exports = day1;
