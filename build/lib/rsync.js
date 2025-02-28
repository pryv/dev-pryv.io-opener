/**
 * @license
 * Copyright (C) Pryv https://pryv.com
 * This file is part of Pryv.io and released under BSD-Clause-3 License
 * Refer to LICENSE file
 */
const Rsync = require('rsync');
const path = require('path');
const mkdirp = require('mkdirp');

module.exports = async function rsync (task, srcDir, destDir) {
  const src = path.resolve(srcDir, task.target);
  let dest = path.resolve(destDir);
  if (!task.rsyncUseDestDir) {
    dest = path.dirname(path.resolve(destDir, task.target));
  }
  console.log(src + ' >>>> ' + dest);
  mkdirp(dest);
  const r = new Rsync()
    .set('a')
    // .progress()
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
};
