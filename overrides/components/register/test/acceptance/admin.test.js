/**
 * @license
 * Copyright (C) Pryv https://pryv.com
 * This file is part of Pryv.io and released under BSD-Clause-3 License
 * Refer to LICENSE file
 */
/* global describe, it, before, after */

require('test-helpers/src/api-server-tests-config');
const { databaseFixture } = require('test-helpers');
const {
  produceMongoConnection,
  context
} = require('api-server/test/test-helpers');
const regPath = require('api-server/src/routes/Paths').Register;

const { getConfig } = require('@pryv/boiler');

const cuid = require('cuid');

const chai = require('chai');
const assert = chai.assert;

describe('register /admin', function () {
  let server, email, adminKey;
  this.timeout(10000);

  let mongoFixtures;
  before(async function () {
    const config = await getConfig();
    adminKey = config.get('auth:adminAccessKey');
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
      email,
      created: Date.now() / 1000
    });
  });

  it('[6TZE] /admin/users ', async function () {
    const res = await server
      .request()
      .get(regPath + '/admin/users')
      .set('Authorization', adminKey)
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
