/**
 * @license
 * Copyright (C) Pryv https://pryv.com
 * This file is part of Pryv.io and released under BSD-Clause-3 License
 * Refer to LICENSE file
 */
const path = require('path');
const fs = require('fs');

const srcDir = path.resolve(__dirname, '../service-core/');
const destDir = path.resolve(__dirname, '../dest/');

const rsync = require('./lib/rsync');
const sed = require('./lib/sed')(destDir);
const json = require('./lib/json')(destDir);

const OPEN_TAG = '-open';

function execShellCommand (cmd) {
  const exec = require('child_process').exec;
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout || stderr);
    });
  });
}

let version = null;

function loadTasks () {
  return [{
    target: './components',
    excludes: [
      'hfs-server', 'pryvuser-cli', 'tprpc', 'webhooks', 'metadata', 'audit', // components
      'business/src/series', 'business/src/series.js', 'series/repository.test.js', // series
      'register' // protects components/register from being deleted because we rsync --delete
    ],
    patterns: ['-node_modules/', '-*influx*', '-*series*', '-webhook*', '-*nats*']
  },
  {
    target: './scripts',
    excludes: ['compile-proxy-config.js', 'components-checkdeps.js', 'components-version.js', 
    'setup-ci', 'setup-infux', 'setup-nats-server', 'setup-private-libs', 'tag-tests'],
    patterns: ['-test*']
  },
  {
    target: './test',
    excludes: ['acceptance/high-frequency.test.js']
  },
  {
    target: './justfile'
  },
  {
    target: './ferretDB'
  },
  {
    target: './README-DBs.md'
  },
  {
    target: './.mocharc.js'
  },
  {
    target: './package-lock.json'
  },
  {
    target: './package.json',
    json: {
      merge: {
        name: 'open-pryv.io',
        version,
        private: true,
        license: 'BSD-3-clause',
        repository: {
          url: 'git://github.com/pryv/service-open-pryv.git'
        },
        scripts: {
          'setup-dev-env': 'scripts/setup-dev-env',
          api: 'LOGS=info NODE_ENV=production ./components/api-server/bin/server --config ./configs/api.yml',
          mail: 'cd service-mail ; ./bin/server',
          database: 'DEVELOPMENT=true scripts/start-mongo',
          pryv: 'npm run database >> ./var-pryv/logs/mongodb.log & npm run mail >> ./var-pryv/logs/mail.log & npm run api',
          apibackloop: 'LOGS=info NODE_ENV=production ./components/api-server/bin/server --config ./configs/api-backloop.yml',
          },
        dependencies: {
          pryv: '^2.0.2',
          'backloop.dev': 'latest'
        },
        'pre-commit': ''
      }
    },
    sed: ['hfs', 'metadata', 'webhooks', 'gnat', 'influx', 'jsdoc', 'test-root', 'cover', 'flow-coverage', 'tag-tests', 'test-results', 'tprpc', 'pryvuser-cli', 'metadata', 'nats', 'reporting']
  },
  {
    target: './components/api-server/package.json',
    sed: ['reporting']
  }
  ];
}

module.exports = async () => {
  version = await execShellCommand('git --git-dir=' + srcDir + '/.git describe');
  // remove the intermediate commit index
  if (version.indexOf('-') >= 0) {
    version = version.substr(0, version.lastIndexOf('-'));
  }
  version = version.split('\n')[0];
  version = version + OPEN_TAG;
  console.log('VERSION ', version);
  fs.writeFileSync(path.resolve(__dirname, '../overrides/.api-version'), version);

  const tasks = loadTasks();

  // --- initial copy
  for (let i = 0; i < tasks.length; i++) {
    await rsync(tasks[i], srcDir, destDir);
    if (tasks[i].json) {
      json(tasks[i]);
    }
    if (tasks[i].sed) {
      sed(tasks[i]);
    }
  }
};
