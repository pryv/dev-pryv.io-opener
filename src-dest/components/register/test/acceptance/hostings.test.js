
const { context } = require('components/api-server/test/test-helpers');
const regPath = require('components/api-server/src/routes/Paths').Reg;

const cuid = require('cuid');

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

describe('service', function () {

  before(async () => {
    server = await context.spawn();
  });
  after(() => {
    server.stop();
  });

  it('[REA1] GET /service/info should receive service info data ', async function () {
    const res = await server.request()
      .get(regPath + '/service/info')
      .set('Accept', 'application/json');
    assert.equal(res.status, 200);
    assert.equal(res.body.exists, true); // todo
  });

  it('[REA2] GET /apps should receive empty array ', async function () {
    const res = await server.request()
      .get(regPath + '/apps')
      .set('Accept', 'application/json');
    assert.equal(res.status, 200);
    expect(res.body).to.eql({ apps: [] });
  });

  it('[REA3] GET /apps/:appid should receive an dummy message ', async function () {
    const res = await server.request()
      .get(regPath + '/apps/toto')
      .set('Accept', 'application/json');
    assert.equal(res.status, 200);
    expect(res.body).to.eql({ app: { id: 'toto' } });
  });

  it('[REA4] GET /hostings should receive an hosting compatible message ', async function () {
    const res = await server.request()
      .get(regPath + '/hostings')
      .set('Accept', 'application/json');
    assert.equal(res.status, 200);
    expect(res.body).to.eql({ app: { id: 'toto' } }); // todo
  });

});