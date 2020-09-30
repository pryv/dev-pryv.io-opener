const serviceCore = require('./service-core');
const serviceMail = require('./service-mail');
const root = require('./root');
(async () => { 
  await serviceCore();
  await serviceMail();
  await root();
})();
