const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');

const srcDir = path.resolve(__dirname, '../service-core/');
const destDir = path.resolve(__dirname, '../dest/');

const rsync = require('./lib/rsync');
const sed = require('./lib/sed')(destDir);
const json = require('./lib/json')(destDir);

const OPEN_TAG = '-open';

function execShellCommand(cmd) {
  const exec = require('child_process').exec;
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

let version = null;


function loadTasks() {
  return [{
    target: './components',
    excludes: [
      'hfs-server', 'pryvuser-cli', 'tprpc', 'webhooks', 'metadata', // components
      'business/src/series', 'business/src/series.js', 'series/repository.test.js', // series
      'api-server/config/test.json', // replaced by src-dest
      'register' // protects components/register from being deleted because we rsync --delete
    ],
    patterns: ['-node_modules/', '-*influx*', '-*series*', '-webhook*', '-*nats*']
  },
  {
    target: './scripts',
    excludes: ['compile-proxy-config.js', 'components-checkdeps.js', 'components-version.js'],
    patterns: ['-test*']
  },
  {
    target: './test',
    excludes: ['acceptance/high-frequency.test.js']
  },
  {
    target: './babel.config.json'
  },
  {
    target: './package.json',
    json: {
      merge: {
        "name": "open-pryv.io",
        "version": version,
        "private": true,
        "license": "BSD-3-clause",
        "repository": {
          "url": "git://github.com/pryv/service-open-pryv.git"
        },
        "scripts": {
          "api": "NODE_ENV=production ./dist/components/api-server/bin/server --config ./config.json",
          "mail": "yarn --cwd ./service-mail start",
          "setup": "yarn install --ignore-optionals ; bash ./scripts/setup-dev-env.bash",
          "proxy": "./node_modules/rec-la/bin/proxy.js localhost:3000",
          "pryv": "yarn database >> ./var-pryv/logs/mongodb.log & yarn mail >> ./var-pryv/logs/mail.log & yarn api",
          "local": "yarn database >> ./var-pryv/logs/mongodb.log & yarn mail >> ./var-pryv/logs/mail.log & yarn proxy & NODE_ENV=production ./dist/components/api-server/bin/server --config ./configs/rec-la.json",
        },
        "dependencies": {
          "pryv": "^2.0.2",
          "rec-la": "latest"
        },
        "pre-commit": ""
      }
    },
    sed: ['hfs', 'metadata', 'webhooks', 'gnat', 'influx', 'jsdoc', 'test-root', 'cover', 'flow-coverage', 'tag-tests', 'test-results', 'tprpc', 'jaeger', 'pryvuser-cli', 'metadata', 'nats', 'reporting']
  },
  {
    target: './.flowconfig',
    sed: ['jaeger', 'tprpc', 'metadata', 'hfs-server', 'flow-coverage']
  }
  ];
};




module.exports = async () => {

  version = await execShellCommand('git --git-dir=' + srcDir + '/.git describe');
  // remove the intermediate commit index
  if (version.indexOf('-') >= 0) {
    version = version.substr(0, version.lastIndexOf('-'));
  }
  version = version.split("\n")[0];
  version = version + OPEN_TAG;
  console.log('VERSION ', version)
  fs.writeFileSync(path.resolve(__dirname, '../src-dest/.api-version'), version);


  tasks = loadTasks();

  // --- initial copy
  for (let i = 0; i < tasks.length; i++) {
    await rsync(tasks[i], srcDir, destDir);
    if (tasks[i].json) {
      json(tasks[i]);
    }
    if (tasks[i].sed) {
      sed(tasks[i])
    }
  }

};
