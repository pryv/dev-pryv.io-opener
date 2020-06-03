const serviceCore = require('./service-core');
const serviceRegister = require('./service-register');
const serviceMail = require('./service-mail');
const root = require('./root');
(async () => { 
  await serviceCore();
  await serviceRegister();
  await serviceMail();
  await root();
})();
