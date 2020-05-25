
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
                url: 'http://localhost:3000',
                name: 'Pryv.io',
                description: 'Self hosted',
                available: true
              }
            }
          }
        }
      }
    }
  }
}

function getCoreForHosting(
  hosting: string, callback: HostForHostingCallback
) {
  callback(null, 'http://localhost:3000');
}

function postToAdmin(
  host: ServerConfig, path: string, expectedStatus: number,
  jsonData: any, callback: PostToAdminCallback,
) {
  console.log('XXXXX POST to Admin', host, path, expectedStatus, jsonData);
}

exports.postToAdmin = postToAdmin;
exports.getHostings = getHostings;
exports.getCoreForHosting = getCoreForHosting;