/* global describe, it, before, after */

require('test-helpers/src/api-server-tests-config');
const { context } = require('api-server/test/test-helpers');
const regPath = require('api-server/src/routes/Paths').Register;

const cuid = require('cuid');

const chai = require('chai');
const assert = chai.assert;

let server;

describe('access', function () {
  this.timeout(1000000);
  before(async () => {
    server = await context.spawn();
  });
  after(() => {
    server.stop();
  });

  it('[RE5T] POST /access', async () => {
    const res = await requestAccess();
    assert.equal(res.status, 'NEED_SIGNIN');
    await new Promise(resolve => setTimeout(resolve, 10000));
  });

  it('[RE6T] POST /access/invitationtoken/check', async () => {
    const res = await server.request()
      .post(regPath + '/access/invitationtoken/check')
      .send({ invitationToken: cuid() });
    assert.equal(res.status, 200);
    assert.equal(res.text, 'true');
  });

  describe(' GET / POST access/:key', () => {
    let key = null;
    before(async () => {
      key = (await requestAccess()).key;
    });

    it('[RE8T] GET /access/:key', async () => {
      const res = await server.request()
        .get(regPath + '/access/' + key)
        .set('Accept', 'application/json');

      assert.equal(res.status, 201);
      assert.equal(res.body.status, 'NEED_SIGNIN');
    });

    it('[RE9T] POST /access/:key', async () => {
      const accessACCEPTED = {
        status: 'ACCEPTED',
        apiEndPoint: 'http://dummy/dummy',
        username: 'dummy',
        token: cuid()
      };
      const res = await server.request()
        .post(regPath + '/access/' + key)
        .send(accessACCEPTED)
        .set('Accept', 'application/json');
      assert.equal(res.status, 200);
      assert.equal(res.body.status, 'ACCEPTED');
    });
  });
});

async function requestAccess () {
  const accessRequestData = {
    requestingAppId: 'test-app-id',
    requestedPermissions: [
      {
        streamId: 'diary',
        level: 'read',
        defaultName: 'Journal'
      }
    ],
    languageCode: 'fr'
  };
  const res = await server.request()
    .post(regPath + '/access/')
    .send(accessRequestData)
    .set('Accept', 'application/json');
  assert.equal(res.status, 201);
  return res.body;
}
