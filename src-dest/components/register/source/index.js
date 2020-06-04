var logger = require('winston');
var database = require('./storage/database');
var config = require('./config');
logger['default'].transports.console.level = 'info';

const headPath = require('components/api-server/src/routes/Paths').Register;

class mockExpress {
  constructor(expressApp) {
    this.app = expressApp; 
  }

  use(fn) {
    this.app.use(fn);
  }

  get(path, callback) {
    this.app.get(headPath + path, callback);
  }

  post(path, callback) {
    this.app.post(headPath + path, callback);
  }
}

module.exports = async (expressApp, application) => {
  config.loadSettings(application.settings);
  database.setReference('storage', application.storageLayer);
  database.setReference('systemAPI', application.systemAPI);
  
  const app = new mockExpress(expressApp);
  // public API routes
  require('./routes/email')(app);
  require('./routes/service')(app);
  require('./routes/users')(app);
  require('./routes/access')(app);
  require('./middleware/app-errors')(app);
}