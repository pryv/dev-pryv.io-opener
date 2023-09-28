const path = require('path');
const fs = require('fs');

module.exports = function (destDir) {
  return function (task) {
    const fileDest = path.resolve(destDir, task.target);
    const jsonStringContent = fs.readFileSync(fileDest, { encoding: 'utf8' });
    let dest = JSON.parse(jsonStringContent);
    if (task.json.merge) {
      mergeDeep(dest, task.json.merge);
    }
    fs.writeFileSync(fileDest, JSON.stringify(dest, null, 2));
  };
};

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}