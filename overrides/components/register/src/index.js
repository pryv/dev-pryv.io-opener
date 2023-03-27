const database = require('./storage/database');
const config = require('./config');

const headPath = require('api-server/src/routes/Paths').Register;

class ExpressMock {
  constructor(expressApp) {
    this.app = expressApp;
  }

  use(fn) {
    this.app.use(headPath, fn);
  }

  get(path, cb1, cb2) {
    if (cb2) {
      return this.app.get(headPath + path, cb1, cb2);
    }
    this.app.get(headPath + path, cb1);
  }

  post(path, cb1, cb2) {
    if (cb2) {
      return this.app.post(headPath + path, cb1, cb2);
    }
    this.app.post(headPath + path, cb1);
  }
}

module.exports = async (expressApp) => {
  await config.loadSettings();
  await database.init();

  const app = new ExpressMock(expressApp);
  // public API routes
  require('./routes/email')(app);
  require('./routes/service')(app);
  require('./routes/access')(app);
  require('./routes/admin')(app);
  require('./routes/server')(app);
  require('./middleware/app-errors')(app);

  // register all reg routes
  expressApp.all(headPath + '/*', function (req, res, next) {
    res
      .status(404)
      .send({ id: 'unkown-route', message: 'Unknown route: ' + req.path });
  });
};
