const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');

const srcDir = path.resolve(__dirname, '../service-core/');
const destDir = path.resolve(__dirname, '../dest/');

const rsync = require('./lib/rsync');
const sed = require('./lib/sed')(destDir);
const json = require('./lib/json')(destDir);

let version = fs.readFileSync(path.resolve(__dirname, '../src-dest/.api-version'), 'utf8');
version = version.split("\n")[0];

const tasks = [{
    target: './components', 
    excludes: [
      'hfs-server', 'pryvuser-cli', 'tprpc', 'webhooks', 'metadata', // components
      'business/src/series', 'business/src/series.js', 'series/repository.test.js', // series
      'api-server/config/test.json', // replaced by src-dest
      'register' // protects components/register from being deleted
    ],
    patterns: ['-node_modules/','-*influx*', '-*series*','-webhook*', '-*nats*']
  }, 
  {
    target: './scripts',
    excludes: ['compile-proxy-config.js', 'components-checkdeps.js', 'components-version.js'],
    patterns: ['-test*']
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
        "private": false,
        "repository": {
          "url": "git://github.com/pryv/service-open-pryv.git"
        },
        "scripts": {
          "api": "NODE_ENV=production ./dist/components/api-server/bin/server --config ./config.json",
          "mail": "yarn --cwd ./service-mail start",
          "proxy": "./node_modules/rec-la/bin/proxy.js localhost:3000"
        },
        "dependencies": {
          "pryv": "^2.0.2",
          "rec-la": "^0.1.12"
        }
      }
    },
    sed: ['hfs', 'metdata', 'webhooks', 'gnat', 'influx', 'jsdoc', 'test-root', 'cover', 'flow-coverage', 'tag-tests', 'test-results', 'tprpc', 'jaeger', 'pryvuser-cli', 'metadata', 'nats']
  },
  {
    target: './.flowconfig',
    sed: ['jaeger', 'tprpc', 'metadata', 'hfs-server', 'flow-coverage']
  }
];




module.exports = async () => {


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
