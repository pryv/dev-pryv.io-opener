const Rsync = require('rsync');
const path = require('path');
const mkdirp = require('mkdirp');

module.exports = async function rsync(task, srcDir, destDir) {
  const src = path.resolve(srcDir, task.target);
  const dest = path.resolve(destDir);
  console.log(destDir, dest);
  mkdirp(dest);
  const r = new Rsync()
    .set('a')
    .progress()
    .source(src)
    .destination(dest);

  if (!task.noDelete) r.delete();
  if (task.excludes) r.exclude(task.excludes);
  if (task.patterns) r.patterns(task.patterns);
    
  await new Promise((resolve, reject) => {
    r.execute(function (error, code, cmd) {
      if (error) return reject(error);
      resolve(code);
    }, function (data) {
      process.stdout.write(data);
    }, function (data) {
      process.stderr.write(data);
    });
  });
}
