/**
 * @license
 * Copyright (C) Pryv https://pryv.com
 * This file is part of Pryv.io and released under BSD-Clause-3 License
 * Refer to LICENSE file
 */
const path = require('path');

const mkdirp = require('mkdirp');

const srcDir = path.resolve(__dirname, '../service-mail/');
const destDir = path.resolve(__dirname, '../dest/service-mail');

mkdirp.sync(destDir);

const rsync = require('./lib/rsync');
const sed = require('./lib/sed')(destDir);

const tasks = [{
  target: './',
  excludes: [
    'app.js', 'build', 'config/development-config.yml', 'test', '.gitignore', 'Jenkinsfile', 'CHANGELOG.md', // root
    'templates/welcome-email', // set by overrides
    'package.json', './README.md' // sed will manage them
  ],
  patterns: ['-node_modules/']
},
{
  target: './package.json',
  sed: ['chai', 'mocha', 'node-foreman', 'eslint']
},
{
  target: './README.md',
  sed: ['Run the tests ']
}];

module.exports = async () => {
  // --- initial copy
  for (let i = 0; i < tasks.length; i++) {
    await rsync(tasks[i], srcDir, destDir);
    if (tasks[i].sed) {
      sed(tasks[i]);
    }
  }

  console.log('done');
};
