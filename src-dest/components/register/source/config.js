
const headPath = require('../../api-server/src/routes/Paths').Register;

const config = {
  'auth:authorizedKeys': {
    'CHANGE-ME-SYSTEM-KEY': { roles: ['system'] },
    'CHANGE-ME-ADMIN-KEY': { roles: ['admin'] },
  },
  'dns:domain': 'open-pryv.io',
  'appList': []
}

module.exports = {
  get: function(key) {
    return config[key];
  },
  loadSettings: function(settings) {
    config.service = settings.get('service').obj();
    config.publicUrl = settings.get('dnsLess.publicUrl').str();

    config['access:trustedAuthUrls'] = [config.publicUrl];
    config['access:defaultAuthUrl'] = [config.publicUrl + '/www/access/access.html'];
  }
}