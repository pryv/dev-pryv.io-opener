
const headPath = require('../../api-server/src/routes/Paths').Reg;

const publichost = 'http://localhost:3000';

const config = {
  'auth:authorizedKeys': {
    'CHANGE-ME-SYSTEM-KEY': { roles: ['system'] },
    'CHANGE-ME-ADMIN-KEY': { roles: ['admin'] },
  },
  'dns:domain': 'fake.io',
  'service': { // change this
    'access': publichost + headPath + '/access/',
    'api': publichost + '/{username}/',
    'register': publichost + headPath 
  },
  'appList': [],
  'access:trustedAuthUrls': ['https://l.rec.la'],
  'access:defaultAuthUrl': publichost + '/ac'
}

module.exports = {
  get: function(key) {
    return config[key];
  },
}