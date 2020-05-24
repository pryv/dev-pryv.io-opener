const serviceCore = require('./service-core');
const serviceRegister = require('./service-register');
const root = require('./root');
(async () => { 
  await serviceCore();
  await serviceRegister();
  await root();
})();
