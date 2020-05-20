const { execSync } = require('child_process');
const path = require('path');

module.exports = function (destDir) {
  return function (task) {
    const dest = path.resolve(destDir, task.target);
    for (let i = 0; i < task.sed.length; i++) {
      const command = "sed -i.bak '/" + task.sed[i] + "/d' " + dest;
      execSync(command);
      execSync('rm -f ' + dest + '.bak');
    }
  }
}