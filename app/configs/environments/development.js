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
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'GOOGLE_CLIENT_ID',
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || 'GOOGLE_CLIENT_SECRET',
    CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
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
