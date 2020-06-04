const path = require('path');
const fs = require('fs')
const _ = require('lodash');

module.exports = function (destDir) {
  return function (task) {
    const fileDest = path.resolve(destDir, task.target);
    const jsonStringContent = fs.readFileSync(fileDest, {encoding: 'utf8'} );
    let dest = JSON.parse(jsonStringContent);
    if (task.json.merge) {
       dest = _.merge(dest, task.json.merge);
    }
    fs.writeFileSync(fileDest, JSON.stringify(dest, null, 2));
  }
}