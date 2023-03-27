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
      'api-server/config/test.json', // replaced by overrides
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
    target: './justfile'
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
        version: version,
        private: true,
        license: 'BSD-3-clause',
        repository: {
          url: 'git://github.com/pryv/service-open-pryv.git'
        },
        scripts: {
          api: 'LOGS=info NODE_ENV=production ./components/api-server/bin/server --config ./config.yml',
          mail: 'cd service-mail ; ./bin/server',
          database: 'scripts/start-mongo',
          proxy: './node_modules/rec-la/bin/proxy.js localhost:3000',
          proxied: './node_modules/rec-la/bin/proxy.js localhost:3000 & LOGS=info NODE_ENV=production ./components/api-server/bin/server --config ./configs/rec-la.yml',
          pryv: 'npm run database >> ./var-pryv/logs/mongodb.log & npm run mail >> ./var-pryv/logs/mail.log & npm run api',
          local: 'npm run database >> ./var-pryv/logs/mongodb.log & npm run mail >> ./var-pryv/logs/mail.log & npm run proxy & NODE_ENV=production ./dist/components/api-server/bin/server --config ./configs/rec-la.yml'
        },
        dependencies: {
          pryv: '^2.0.2',
          'rec-la': 'latest'
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
