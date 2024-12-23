'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const setup = require('../setup/setup');

const config = require('app/configs/config');

const BASE_URL = `http://${config.SERVER_IP}:${config.SERVER_PORT}`;

const utilsService = require('app/services/utils');

const data = {
  pingApi: {
    options: {
      url: BASE_URL + '/ping',
      method: 'GET',
      json: true,
      headers: {},
      qs: {},
      body: {}
    }
  }
};

test.describe('1. PING', async () => {
  test.before(async () => {
    let result = await setup.setup();

    return;
  });

  test.after(async () => {
    await setup.teardown();

    return;
  });

  test.beforeEach(async () => {
    assert.equal(process.env.NODE_ENV, 'test');

    return;
  });

  test('Ping route should be reachable.', async () => {
    let options = JSON.parse(JSON.stringify(data.pingApi.options));

    options = utilsService.prepareFetchOptions(options);
    let response = await (await fetch(options.url, options)).text();

    assert.equal(response, 'pong');

    return;
  });

  console.log();
  return;
});
