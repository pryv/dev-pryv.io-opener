require('components/test-helpers/src/boiler-init');
const { databaseFixture } = require('components/test-helpers');
const { produceMongoConnection, context } = require('components/api-server/test/test-helpers');
const regPath = require('components/api-server/src/routes/Paths').Register;

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
    it('REU1 Post user', async function () {
      const userData = {
        appid: 'pryv-test',
        hosting: 'dummy',
        username: cuid().substr(5),
        password: cuid(),
        email: cuid().substr(5) + '@pryv.io',
        referer: 'tests',
        language: 'fr'
      }
      const res = await server.request()
        .post(regPath + '/user')
        .send(userData);
      assert.equal(res.status, 200);
      assert.equal(res.body.username, userData.username);
      assert.equal(res.body.server, res.body.username + '.open-pryv.io');
      assert.equal(res.body.apiEndpoint, 'http://localhost:3000/' + res.body.username + '/');
    });
  });

  describe('username', function () {
    it('[REU7] POST /username/check', async function () {
      const res = await server.request()
        .post(regPath + '/username/check')
        .send({ username: username })
        .set('Accept', 'application/json');;
      assert.equal(res.status, 200);
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