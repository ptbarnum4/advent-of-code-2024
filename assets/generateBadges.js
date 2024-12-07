const fsSync = require('fs');
const fs = require('fs/promises');
const path = require('path');

const colors = {
  complete: '#32FF7D',
  incomplete: '#FF5A46',
  partial: '#FFE164'
};

const dirPath = path.resolve(__dirname, 'badges');

const statuses = /**@type {const} */ (['complete', 'incomplete', 'partial']);

/**
 * @param {number} n
 * @returns
 */
const createSVG = n => {
  /**
   * @param {'complete'|'incomplete'|'partial'} status
   * @returns {Promise<void>}
   */
  return async status => {
    const color = colors[status];
    const svg = `<svg viewBox="0 0 125 50" xmlns="http://www.w3.org/2000/svg" fill="${color}">\n  <text font-family="'Trebuchet MS', sans-serif" font-weight="700" y="45" x="10" font-size="32px">\n    Day ${n}\n  </text>\n</svg>`;

    const statusDirPath = path.resolve(dirPath, status);
    if (!fsSync.existsSync(statusDirPath)) {
      await fs.mkdir(statusDirPath);
    }
    await fs.writeFile(path.resolve(dirPath, status, `day${n}.svg`), svg);
  };
};

const main = async () => {
  for (let i = 1; i <= 25; i++) {
    await Promise.all(statuses.map(createSVG(i)));
  }
};

main();
