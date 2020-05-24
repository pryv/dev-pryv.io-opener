var logger = require('winston');
var database = require('./storage/database');
logger['default'].transports.console.level = 'info';

const headPath = '/reg';

class fakeExpress {
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
  const app = new fakeExpress(expressApp);

  console.log('XXXXX register loaded');
  // public API routes
  require('./routes/email')(app);
  /** 
  require('./routes/server')(app);

  // private API  routes
  require('./routes/users')(app);
  require('./routes/admin')(app);

  //access
  require('./routes/access')(app);

  //records
  require('./routes/records')(app);
  */
  //error management (evolution)
  require('./middleware/app-errors')(app);
}