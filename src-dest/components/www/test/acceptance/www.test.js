
const { context } = require('components/api-server/test/test-helpers');
const wwwPath = require('components/api-server/src/routes/Paths').WWW;

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

describe('www', function () {

  before(async () => {
    server = await context.spawn();
  });
  after(() => {
    server.stop();
  });

  it('[WWA1] GET / should receive an html page ', async function () {
    const res = await server.request()
      .get(wwwPath + '/');
    assert.equal(res.status, 200);
    const firstLine = res.text.split('\n')[0];
    assert.equal(firstLine, '<HTML>'); // todo
  });
});