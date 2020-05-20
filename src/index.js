const path = require('path');

const mkdirp = require('mkdirp');

const srcDir = path.resolve(__dirname, '../../service-core/');
const destDir = path.resolve(__dirname, '../dest/');

const rsync = require('./lib/rsync');
const sed = require('./lib/sed')(destDir);

const tasks = [{
    target: './components', 
    excludes: ['hfs-server', 'pryvuser-cli', 'tprpc', 'webhooks'],
    patterns: ['-node_modules/']
  }, 
  {
    target: './scripts',
    patterns: ['-comp*', '-test*']
  },
  {
    target: './babel.config.json'
  },
  {
    target: './package.json',
    sed: ['hfs', 'metdata', 'webhooks', 'gnat', 'influx', 'jsdoc', 'test-root', 'cover', 'flow-coverage', 'tag-tests', 'test-results', 'tprpc', 'jaeger', 'pryvuser-cli']
  },
  {
    target: './.flowconfig',
    sed: ['jaeger', 'tprpc', 'metadata', 'hfs-server', 'flow-coverage']
  }
];




(async () => {
  // root files
  await rsync(
    { target: './src-dest/*' , noDelete: true}, 
    path.resolve(__dirname, '..'),
    destDir);

  // --- initial copy
  for (let i = 0; i < tasks.length; i++) {
    await rsync(tasks[i], srcDir, destDir);
    if (tasks[i].sed) {
      sed(tasks[i])
    }
  }
  // --- sedding some files

  console.log('done');
})();
