
const { databaseFixture } = require('components/test-helpers');
const { produceMongoConnection, context } = require('components/api-server/test/test-helpers');
const regPath = require('components/api-server/src/routes/Paths').Reg;

const cuid = require('cuid');

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

describe('register /users', function () {
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
      email: email
    });
  });

  describe('POST /user', function () {
    it.skip('REU1 Post user', async function () {

    });
  });

  describe('username', function () {
    it('[REU7] POST /username/check', async function () {
      const res = await server.request()
        .post(regPath + '/username/check')
        .send({ username: username });
      console.log(res.text);
      assert.equal(res.status, 200);
      assert.equal(res.text, 'false');
    });

    it('[REU8] POST /username/check', async function () {
      const res = await server.request()
        .post(regPath + '/username/check')
        .send({ username: cuid().substr(5) });
      assert.equal(res.status, 200);
      assert.equal(res.text, 'true');
    });


    it('[REU9] GET/:username/check_username ', async function () {
      const res = await server.request()
        .get(regPath + '/' + username + '/check_username')
        .set('Accept', 'application/json');
      assert.equal(res.status, 200);
      expect(res.body).to.eql({ reserved: true });
    });

    it('[REU6] GET/:username/check_username', async function () {
      const res = await server.request()
        .get(regPath + '/' + cuid().substr(5) + '/check_username')
        .set('Accept', 'application/json');
      assert.equal(res.status, 200);
      expect(res.body).to.eql({ reserved: null });
    });
  });

});