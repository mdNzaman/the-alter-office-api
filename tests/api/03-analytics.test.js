'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

const setup = require('../setup/setup');
const analyticsSql = './tests/setup/data/api-tests/04-analytics.sql';

const config = require('app/configs/config');

const utilsService = require('app/services/utils');

const BASE_URL = `http://${config.SERVER_IP}:${config.SERVER_PORT}`;

const data = {
  analytics: {
    options: {
      url: BASE_URL + '/api/analytics',
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

    let analyticsDataQuery = fs.readFileSync(analyticsSql).toString();
    await config.knex.raw(analyticsDataQuery);

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

  test(`${++seq}. Should allow to view the over all analytics.`, async () => {
    return;
  });

  test(`${++seq}. Should allow to view analaytics by alias.`, async () => {
    return;
  });

  test(`${++seq}. Should allow to view analytics by topic.`, async () => {
    return;
  });

  console.log();
  return;
});
