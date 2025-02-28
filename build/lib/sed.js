/**
 * @license
 * Copyright (C) Pryv https://pryv.com
 * This file is part of Pryv.io and released under BSD-Clause-3 License
 * Refer to LICENSE file
 */
const { execSync } = require('child_process');
const path = require('path');

module.exports = function (destDir) {
  return function (task) {
    const dest = path.resolve(destDir, task.target);
    for (let i = 0; i < task.sed.length; i++) {
      const command = "sed -i.bak '/" + task.sed[i] + "/d' " + dest;
      execSync(command);
    }
    if (task.sedReplace) {
      for (let i = 0; i < task.sedReplace.length; i++) {
        const replaceBy = task.sedReplace[i][1].split('/').join('\\/'); // to escape / slashes
        const command = "sed -i.bak 's/.*" + task.sedReplace[i][0] + '.*/' + replaceBy + "'/ " + dest;
        execSync(command);
      }
    }
    console.log('sed: ' + dest);
    execSync('rm -f ' + dest + '.bak');
  };
};
