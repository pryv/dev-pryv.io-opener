const prepend = require('prepend-file');
const fs = require('fs');
const path = require('path');
const ignores = ['node_modules', '.git'];

const license = fs.readFileSync(path.resolve(__dirname, 'LICENSE.txt'), 'utf-8');
const fileSpecs = {
  js : {
    header: '/**\n * @copyright',
    lines: ' * ',
    trailer: '\n */\n'
  }
}

let count = 0;

// -- prepare specs files
for (const key of Object.keys(fileSpecs)) {
  const spec = fileSpecs[key];
  spec.headerBuffer = Buffer.from(spec.header, 'utf-8');
  spec.headerLength = spec.headerBuffer.length;
  spec.license = spec.header + license.split('\n').join('\n' + spec.lines) + spec.trailer;
};


function getFileSpec(fullPath) {
  const key = fullPath.substr(fullPath.lastIndexOf('.') + 1);
  return fileSpecs[key];
}

function ignore(fullPath) {
  for (const i of ignores) {
    if (fullPath.indexOf(i) >= 0) return true;
  }
  return false;
}

/**
 * Called for each matched file
 * @param {String} fullPath a file Path
 * @param {Object} spec the Specifications from fileSpecs matching this file
 */
async function handleMatchingFile(fullPath, spec) {
  const cleaned = await checkFileHeaderAndClean(fullPath, spec);
  //console.log('-' + fullPath, match);
  prepend.sync(fullPath, spec.license);
  count++;
}

/**
 * Software entrypoint
 * Loop recursively in the directory
 * - ignore files or dir matching one of the ignore items
 * - call handleMatchingFile each time a file matching a fileSpec is found
 * @param {String} dir 
 */
async function loop(dir) {
  //console.log('>' + dir);
  const files = await fs.promises.readdir(dir);
  for (const file of files) {
    const fullPath = path.resolve(dir, file);
    if (ignore(fullPath)) continue;
    const stat = await fs.promises.stat(fullPath);
    if (stat.isDirectory()) {
      await loop(fullPath); // recurse
    } else if (stat.isFile()) {
      const spec = getFileSpec(fullPath);
      if (spec) await handleMatchingFile(fullPath, spec);
    } else {
      console.log(stat);
      throw new Error();
    }
  }
}


/**
 * Check the firts "n" bytes of a file to see if it matches the header
 * If yes clean the file up to the end
 * @param {string} fullPath 
 * @param {Object} spec 
 */
async function checkFileHeaderAndClean(fullPath, spec) {
  const fd = fs.openSync(fullPath, 'r');
  const buffer = Buffer.alloc(spec.headerLength);
  fs.readSync(fd, buffer, 0, spec.headerLength, 0);
  //console.log(buffer, buffer.toString('utf-8'), spec.headerLength);
  fs.closeSync(fd);
  if (!buffer.equals(spec.headerBuffer)) return false; // does not match return
  // header found read all file and rewrite without header
  const fileContent = fs.readFileSync(fullPath, 'utf8');
  const trailerPos = fileContent.indexOf(spec.trailer);
  console.log('Updated >> ' + fullPath);
  fs.writeFileSync(fullPath, fileContent.substr(fileContent.indexOf(spec.trailer) + spec.trailer.length));
  return true;
}

(async () => {
  const start = Date.now();
  await loop('./dest');
  console.log('Added license to ' + count + ' files in ' + Math.round((Date.now() - start) / 10) / 100 + ' s');
})();
