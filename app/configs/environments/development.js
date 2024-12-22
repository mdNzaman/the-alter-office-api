'use strict';

const Knex = require('knex');
const os = require('os');

const mysqlConnectionString = {
  host: 'localhost',
  user: 'root',
  password: '123456789',
  database: 'the_alter_office_dev',
  port: 3306
};

const KNEX_CONFIG = {
  client: 'mysql2',
  connection: mysqlConnectionString
};

const knex = Knex(KNEX_CONFIG);

const MORGAN_LOG_PATH = `${os.homedir()}/.the-alter-office-api-logs`;

const HEALTHCHECKS = {
  DEPLOY_BASE_URL: 'http://localhost:3000',
  URL: ''
};

const OAUTH = {
  GOOGLE: {
    CLIENT_ID: '1076163857306-9v3lggevj2s3gvjfp9fg3f85pl4trhtk.apps.googleusercontent.com',
    CLIENT_SECRET: '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',
    CALLBACK_URL: 'http://localhost:3000/api/auths/verify/google', //`${HEALTHCHECKS.DEPLOY_BASE_URL}/api/auths/verify/google`,
    SCOPE: ['profile', 'email']
  }
};

const AUTH = {
  SESSION_EXPIRY_EXTEND_DAYS: 7,
  SECRET_KEY: 'SECRET_KEY'
};

const config = {
  knex: knex,
  MORGAN_LOG_PATH: MORGAN_LOG_PATH,
  HEALTHCHECKS: HEALTHCHECKS,
  OAUTH: OAUTH,
  AUTH: AUTH
};

module.exports = config;
