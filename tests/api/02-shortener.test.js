'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

const setup = require('../setup/setup');
const shortensSql = './tests/setup/data/api-tests/04-shortener.sql';

const config = require('app/configs/config');

const utilsService = require('app/services/utils');

const BASE_URL = `http://${config.SERVER_IP}:${config.SERVER_PORT}`;

const data = {
  shortens: {
    options: {
      url: BASE_URL + '/api/shorten',
      method: null,
      json: true,
      headers: {
        'Content-Type': 'application/json',
        'x-auth': 'test.token.user',
        'x-origin': 1,
        'x-platform': 1,
        'x-device-id': 'test.device',
        'x-version': 1
      },
      qs: {},
      body: {}
    }
  }
};

let seq = 0;

test.describe('04. SHORTEN', async () => {
  test.before(async () => {
    await setup.setup();

    let shortensDataQuery = fs.readFileSync(shortensSql).toString();
    await config.knex.raw(shortensDataQuery);

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

  test(`${++seq}. Should not allow creation of alias without long URL.`, async () => {
    return;
  });

  test(`${++seq}. Should allow creation of alias with long URL.`, async () => {
    return;
  });

  test(`${++seq}. Should allow alias to redirect to the long URL.`, async () => {
    return;
  });

  console.log();
  return;
});
