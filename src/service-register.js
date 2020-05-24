const path = require('path');

const mkdirp = require('mkdirp');

const srcDir = path.resolve(__dirname, '../../service-register/');
const destDir = path.resolve(__dirname, '../dest/components/register');

mkdirp.sync(destDir);

const rsync = require('./lib/rsync');
const sed = require('./lib/sed')(destDir);

const tasks = [{
    target: './source',
    excludes: ['dataservers', 'service-info', 'dns', 'invitations', 'database',
        'app.js', 'server.js', 'config.js',
        'route/index.js', 'route/service.js'],
    patterns: ['-*dns*']
  },
  {
    target: './package.json'
  },
];




module.exports = async () => {


  // --- initial copy
  for (let i = 0; i < tasks.length; i++) {
    await rsync(tasks[i], srcDir, destDir);
    if (tasks[i].sed) {
      sed(tasks[i])
    }
  }

  console.log('done');
};
