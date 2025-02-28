/**
 * @license
 * Copyright (C) Pryv https://pryv.com
 * This file is part of Pryv.io and released under BSD-Clause-3 License
 * Refer to LICENSE file
 */
const serviceCore = require('./service-core');
const serviceMail = require('./service-mail');
const serviceRegister = require('./service-register');
const root = require('./root');
(async () => {
  await serviceCore();
  await serviceRegister();
  await serviceMail();
  await root();
})();
