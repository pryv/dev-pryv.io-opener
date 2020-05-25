
const headPath = require('../../api-server/src/routes/Paths').Reg;

const publichost = 'http://localhost:3000';

const config = {
  domain: 'fake.io',
  'dns:domain': 'fake.io',
  'service': {
    'access': publichost + headPath + '/access/',
    'api': publichost + '/{username}/',
    'register': publichost + headPath 
  },
  appList: []
}

module.exports = {
  get: function(key) {
    return config[key];
  },
}