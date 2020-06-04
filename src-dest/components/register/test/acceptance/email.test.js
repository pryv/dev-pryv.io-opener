
const { databaseFixture } = require('components/test-helpers');
const { produceMongoConnection, context } = require('components/api-server/test/test-helpers');
const regPath = require('components/api-server/src/routes/Paths').Register;

const cuid = require('cuid');

const chai = require('chai');
const assert = chai.assert;

describe('register /email', function () {
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

  describe('GET /:email/check_email', function () {
    it('[RET1] should return true if email exists ', async function () {
      const res = await server.request()
        .get(regPath + '/' + email + '/check_email')
        .set('Accept', 'application/json');
      assert.equal(res.status, 200);
      assert.equal(res.body.exists, true);
    });

    it('[RER1] should return false if email does not exists ', async function () {
      const wrongEmail = cuid().substr(5) + '@toto.com';
      const res = await server.request()
        .get(regPath + '/' + wrongEmail + '/check_email')
        .set('Accept', 'application/json');
      assert.equal(res.status, 200);
      assert.equal(res.body.exists, false);
    });
  });

  describe('POST /email/check', function () {
    const callPath = regPath + '/email/check'
    it('[REZ7] should return false in txt if email exists ', async function () {
      const res = await server.request()
        .post(callPath)
        .send({ email: email });
      assert.equal(res.status, 200);
      assert.equal(res.text, 'false');
    });

    it('[REZ8] should return true in txt  if email exists ', async function () {
      const wrongEmail = cuid() + '@toto.com';
      const res = await server.request()
        .post(callPath)
        .send({ email: wrongEmail });
      assert.equal(res.status, 200);
      assert.equal(res.text, 'true');
    });
  });

  const calls = ['uid', 'username'];
  for (let i = 0; i < calls.length; i++) {
    const call = calls[i];
    describe('GET /:email/' + call, function () {

      it('[RET' + (i + 1) * 2 + '] should return uid from email if it exists', async function () {
        const res = await server.request()
          .get(regPath + '/' + email + '/' + call)
          .set('Accept', 'application/json');
        assert.equal(res.status, 200);
        assert.equal(res.body[call], username);
      });

      it('[RET' + (i + 1) * 2 + 1 + '] should not return uid from email if it exists', async function () {
        const wrongEmail = cuid() + '@toto.com';
        const res = await server.request()
          .get(regPath + '/' + wrongEmail + '/' + call)
          .set('Accept', 'application/json');
        assert.equal(res.status, 404);
        assert.equal(res.body.id, 'UNKNOWN_EMAIL');
      });
    });
  }
});