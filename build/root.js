/**
 * @license
 * Copyright (C) Pryv https://pryv.com
 * This file is part of Pryv.io and released under BSD-Clause-3 License
 * Refer to LICENSE file
 */
const fs = require('fs');
const path = require('path');
const rsync = require('./lib/rsync');
const destDir = path.resolve(__dirname, '../dest/');

module.exports = async () => {
  // root files
  await rsync(
    { target: './overrides/*', noDelete: true, rsyncUseDestDir: true },
    path.resolve(__dirname, '..'),
    destDir);
  await rsync(
    { target: './overrides/.??*', noDelete: true, rsyncUseDestDir: true },
    path.resolve(__dirname, '..'),
    destDir);

  // rename .gitignore
  const gitignorePath = path.resolve(destDir, '.gitignore');
  fs.renameSync(gitignorePath + '.REMOVE_THIS_EXTENSION', gitignorePath);

  console.log('done');
};
