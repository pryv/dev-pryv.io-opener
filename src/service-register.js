const path = require('path');

const mkdirp = require('mkdirp');

const srcDir = path.resolve(__dirname, '../../service-register/');
const destDir = path.resolve(__dirname, '../dest/components/register');

mkdirp.sync(destDir);

const rsync = require('./lib/rsync');
const sed = require('./lib/sed')(destDir);

const tasks = [{
    target: './source',
    excludes: [
        'app.js', 'server.js', 'config.js', 'dns', '.gitignore', '.npmignore', 'package.json', // root
        'dataservers.js',  // business
        'cross-domain.js', // middelware
        'public/reserved-words.json', // public
        'routes/index.js', 'routes/server.js', 'routes/records.js', 'routes/admin.js', 'routes/users.js', // routes (users.js will be added after)
        'database.js', 'storage/invitations.js', 'storage/reserved-userid.js', 'storage/users.js', // storage
        ],
    patterns: ['-*dns*']
  },
  {
    target: './source/routes/users.js',
    sed: [' START - CLEAN FOR OPENSOURCE/,/ END - CLEAN FOR OPENSOURCE']
  },
  {
    target: './source/storage/users.js',
    sed: [' START - CLEAN FOR OPENSOURCE/,/ END - CLEAN FOR OPENSOURCE']
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
