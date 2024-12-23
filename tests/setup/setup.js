'use strict';
process.env.NODE_ENV = 'test';

const fs = require('fs');

const config = require('app/configs/config');

const dbSetup = './docs/db/sql-init.sql';
const dbTeardown = './tests/setup/data/teardown.sql';

const setup = async () => {
  let dbSetupSql = fs.readFileSync(dbSetup).toString();
  dbSetupSql = dbSetupSql.replace('IF EXISTS the_alter_office', 'IF EXISTS the_alter_office_test');
  dbSetupSql = dbSetupSql.replace('DATABASE the_alter_office', 'DATABASE the_alter_office_test');
  dbSetupSql = dbSetupSql.replace('USE the_alter_office', 'USE the_alter_office_test');

  let result = await config.knex.raw(dbSetupSql);

  return result;
};

const teardown = async () => {
  let teardownSql = fs.readFileSync(dbTeardown).toString();
  teardownSql = teardownSql.replace(/the_alter_office/g, 'the_alter_office_test');

  let result = await config.knex.raw(teardownSql);

  console.log(result);

  return result;
};

module.exports = {
  setup: setup,
  teardown: teardown
};
