const home = require('../config').get('service').home;
const publicUrl = require('../config').get('publicUrl');
/** @returns {{ regions: { region1: { name: string; zones: { zone1: { name: string; hostings: { hosting1: { url: any; name: string; description: string; available: boolean; availableCore: any; }; }; }; }; }; }; }} */
function getHostings() {
  return {
    regions: {
      region1: {
        name: 'region1',
        zones: {
          zone1: {
            name: 'zone1',
            hostings: {
              hosting1: {
                url: home,
                name: 'Pryv.io',
                description: 'Self hosted',
                available: true,
                availableCore: publicUrl
              }
            }
          }
        }
      }
    }
  };
}
/** @param {string} hosting
 * @param {HostForHostingCallback} callback
 * @returns {void}
 */
function getCoreForHosting(hosting, callback) {
  callback(null, 'http://localhost:3000');
}
exports.getHostings = getHostings;
exports.getCoreForHosting = getCoreForHosting;
