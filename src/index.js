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
