/**
 * @license
 * Copyright (C) Pryv https://pryv.com
 * This file is part of Pryv.io and released under BSD-Clause-3 License
 * Refer to LICENSE file
 */
const wwwPath = require('../../api-server/src/routes/Paths').WWW;
const { getConfig } = require('@pryv/boiler');

const config = {
  'auth:authorizedKeys': {},
  'dns:domain': 'open-pryv.io',
  appList: [],
  'dnsLess:isActive': true
};

module.exports = {
  get: function (key) {
    return config[key];
  },
  loadSettings: async function () {
    const settings = await getConfig();
    config.service = settings.get('service');
    let settingPublicUrl = settings.get('dnsLess:publicUrl');
    if (settingPublicUrl.slice(-1) !== '/') {
      settingPublicUrl += '/';
    }
    const pathPublicUrl = settingPublicUrl.slice(0, -1);
    config.publicUrl = settingPublicUrl;
    config['access:trustedAuthUrls'] = [settingPublicUrl];
    config['access:defaultAuthUrl'] = [
      pathPublicUrl + wwwPath + '/access/access.html'
    ];

    // load admin keys
    config.adminKey = settings.get('auth:adminAccessKey');
    if (config.adminKey) {
      config['auth:authorizedKeys'][config.adminKey] = { roles: ['admin'] };
    }
  }
};
