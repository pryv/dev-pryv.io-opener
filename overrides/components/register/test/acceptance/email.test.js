/**
 * @license
 * Copyright (C) Pryv https://pryv.com
 * This file is part of Pryv.io and released under BSD-Clause-3 License
 * Refer to LICENSE file
 */
/* global describe, it, before, after */

const { databaseFixture } = require('test-helpers');
const {
  produceMongoConnection,
  context
} = require('api-server/test/test-helpers');
const regPath = require('api-server/src/routes/Paths').Register;

const cuid = require('cuid');

const chai = require('chai');
const assert = chai.assert;

describe('register /email', function () {
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

  describe('GET /:email/check_email', function () {
    it('[RET1] should return item-already-exists if email exists ', async function () {

      const res = await server
        .request()
        .get(regPath + '/' + email + '/check_email')
        .set('Accept', 'application/json');
      assert.equal(res.status, 200);
      const body = res.body;
      assert.exists(res.body.exists);
      assert.equal(res.body.exists, true);
    });

    it('[RER1] should return false if email does not exists ', async function () {
      const wrongEmail = cuid().substr(5) + '@toto.com';
      const res = await server
        .request()
        .get(regPath + '/' + wrongEmail + '/check_email')
        .set('Accept', 'application/json');
      assert.equal(res.status, 200);
      assert.equal(res.body.exists, false);
    });
  });

  describe('POST /email/check', function () {
    const callPath = regPath + '/email/check';
    it('[REZ7] should return 410 gone resource', async function () {
      const res = await server.request().post(callPath).send({ email });
      assert.equal(res.status, 410);
    });
  });

  const calls = ['uid', 'username'];
  for (let i = 0; i < calls.length; i++) {
    const call = calls[i];
    describe('GET /:email/' + call, function () {
      it(
        '[RET' + (i + 1) * 2 + '] should return uid from email if it exists',
        async function () {
          const res = await server
            .request()
            .get(regPath + '/' + email + '/' + call)
            .set('Accept', 'application/json');
          assert.equal(res.status, 200);
          assert.equal(res.body[call], username);
        }
      );

      it(
        '[RET' +
          (i + 1) * 2 +
          1 +
          '] should not return uid from email if it exists',
        async function () {
          const wrongEmail = cuid() + '@toto.com';
          const res = await server
            .request()
            .get(regPath + '/' + wrongEmail + '/' + call)
            .set('Accept', 'application/json');
          assert.equal(res.status, 404);
          assert.equal(res.body.id, 'UNKNOWN_EMAIL');
        }
      );
    });
  }
});
