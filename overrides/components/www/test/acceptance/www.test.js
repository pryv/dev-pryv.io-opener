/**
 * @license
 * Copyright (C) Pryv https://pryv.com
 * This file is part of Pryv.io and released under BSD-Clause-3 License
 * Refer to LICENSE file
 */
/* global describe, it, before, after */

require('test-helpers/src/api-server-tests-config');
const { context } = require('api-server/test/test-helpers');
const wwwPath = require('api-server/src/routes/Paths').WWW;

const chai = require('chai');
const assert = chai.assert;

describe('www', function () {
  let server;

  before(async () => {
    server = await context.spawn();
  });
  after(() => {
    server.stop();
  });

  it('[WWA1] GET / should receive an html page ', async function () {
    const res = await server.request().get(wwwPath + '/');
    assert.equal(res.status, 200);
    const firstLine = res.text.split('\n')[0];
    assert(
      firstLine.startsWith('<!DOCTYPE html>'),
      'Should start with <!DOCTYPE html>'
    );
  });
});
