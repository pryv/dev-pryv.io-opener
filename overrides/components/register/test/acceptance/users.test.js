/* global describe, it, before, after */

require('test-helpers/src/api-server-tests-config');
const { databaseFixture } = require('test-helpers');
const {
  produceMongoConnection,
  context
} = require('api-server/test/test-helpers');
const regPath = require('api-server/src/routes/Paths').Register;

const cuid = require('cuid');

const chai = require('chai');
const assert = chai.assert;

describe('register /users', function () {
  let server, email;

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
    await mongoFixtures.user(username, {
      email
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
        language: 'fr',
        insurancenumber: '198263986123'
      };
      const res = await server
        .request()
        .post(regPath + '/user')
        .send(userData);
      assert.equal(res.status, 201);
      assert.equal(res.body.username, userData.username);
      const apiEndpoint = res.body.apiEndpoint;
      const url = new URL(apiEndpoint);
      const apiEndpointNoToken = apiEndpoint
        .replace(url.username, '')
        .replace('@', '');
      assert.equal(
        apiEndpointNoToken,
        'http://127.0.0.1:3000/' + res.body.username + '/'
      );
    });
  });

  describe('username', function () {
    it('[REU7] POST /username/check', async function () {
      const res = await server
        .request()
        .post(regPath + '/username/check')
        .send({ username })
        .set('Accept', 'application/json');
      assert.equal(res.status, 410);
    });

    it('[REU9] GET/:username/check_username ', async function () {
      const res = await server
        .request()
        .get(regPath + '/' + username + '/check_username')
        .set('Accept', 'application/json');
      assert.equal(res.status, 409);
      const body = res.body;
      assert.exists(body.error);
      assert.equal(body.error.id, 'item-already-exists');
      assert.isTrue(body.error.message.includes(username));
    });

    it('[REU6] GET/:username/check_username', async function () {
      const res = await server
        .request()
        .get(regPath + '/' + cuid().substr(5) + '/check_username')
        .set('Accept', 'application/json');
      assert.equal(res.status, 200);
      const body = res.body;
      assert.exists(body);
      assert.isFalse(body.reserved);
    });
  });
});
