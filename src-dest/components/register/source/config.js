
const headPath = require('../../api-server/src/routes/Paths').Reg;

const config = {
  'auth:authorizedKeys': {
    'CHANGE-ME-SYSTEM-KEY': { roles: ['system'] },
    'CHANGE-ME-ADMIN-KEY': { roles: ['admin'] },
  },
  'dns:domain': 'fake.io',
  'appList': []
}

module.exports = {
  get: function(key) {
    return config[key];
  },
  loadSettings: function(settings) {
    config.service = settings.get('service').obj();
    config.singleCoreUrl = settings.get('singleCoreUrl').str();
    config['access:trustedAuthUrls'] = [config.singleCoreUrl];
    config['access:defaultAuthUrl'] = [config.singleCoreUrl + '/www/access/access.html'];
  }
}