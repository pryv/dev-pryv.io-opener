
/**
 * Eventually prepare fileSpecs (can be called multiple times)
 * @param {Object} fileSpecs 
 * @param {String} license - content of the license
 * @return {Function} the action to apply;
 */
async function prepare(spec, license) {
  return function (fullPath) {
    console.log('JSON Handler >> ' + fullPath);
  };
}


module.exports = {
  prepare: prepare,
  key: 'json'
}