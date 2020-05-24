const path = require('path');
const rsync = require('./lib/rsync')
const destDir = path.resolve(__dirname, '../dest/');


module.exports = async () => { 
  // root files
  await rsync(
    { target: './src-dest/*', noDelete: true },
    path.resolve(__dirname, '..'),
    destDir);
  await rsync(
    { target: './src-dest/.??*', noDelete: true },
    path.resolve(__dirname, '..'),
    destDir);

  console.log('done');
}