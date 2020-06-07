
const { databaseFixture } = require('components/test-helpers');
const { produceMongoConnection, context } = require('components/api-server/test/test-helpers');
const regPath = require('components/api-server/src/routes/Paths').Register;

const cuid = require('cuid');

const chai = require('chai');
const assert = chai.assert;


describe('register /admin', function () {
  let user;

  let mongoFixtures;
  before(async function () {
    mongoFixtures = databaseFixture(await produceMongoConnection());
  });
  after(() => {
    mongoFixtures.clean();
  });


  let username;
  before(() => {
    username = cuid().substr(5);
    email = username + '@pryv.io';
  });

  before(async () => {
    server = await context.spawn();
  });
  after(() => {
    server.stop();
  });

  before(async function () {
    user = await mongoFixtures.user(username, {
      email: email,
      created: Date.now() / 1000
    });
  });

  it('/admin/users ', async function () {
    const res = await server.request()
      .get(regPath + '/admin/users')
      .set('Authorization', 'CHANGE-ME-ADMIN-KEY')
      .set('Accept', 'application/json');
    assert.equal(res.status, 200);
    assert.exists(res.body.users);
    assert.isAbove(res.body.users.length, 1);
    for (const user of res.body.users) {
      assert.exists(user.username);
      assert.exists(user.email);
    }
  });


});