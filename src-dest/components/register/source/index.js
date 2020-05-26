var logger = require('winston');
var database = require('./storage/database');
logger['default'].transports.console.level = 'info';

const headPath = require('../../api-server/src/routes/Paths').Reg;

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
  database.setReference('storage', application.storageLayer);
  const app = new mockExpress(expressApp);
  // public API routes
  require('./routes/email')(app);
  require('./routes/service')(app);
  require('./routes/users')(app);
  require('./routes/access')(app);
  require('./middleware/app-errors')(app);
}