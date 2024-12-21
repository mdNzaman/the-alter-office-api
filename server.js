'use strict';

// Include core libraries
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

!fs.existsSync(`${__dirname}/node_modules/app`) ? fs.symlinkSync(`${__dirname}/app`, `${__dirname}/node_modules/app`) : null;
const healthchecks = require('app/services/healthchecks');

const app = express();

// Include config files
const config = require('app/configs/config');
const status = require('app/configs/status');
const loggerConfig = require('app/configs/logger');

const isDeveloping = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

app.disable('x-powered-by');

// Catch 404s
app.use((req, res, next) => {
  res.statusCode = 404;
  res.json(status.getStatus('url_missing'));
});

// Global error handler
app.use((err, req, res, next) => {
  if (err) {
    console.log(new Date().toISOString(), err);
  }

  if (err.hasOwnProperty('error')) {
    res.json(err);
  } else {
    let err = status.getStatus('generic_fail');
    res.json(err);
  }
});

app.listen(config.SERVER_PORT, config.SERVER_IP, () => {
  console.log(`########## Environment: ${process.env.NODE_ENV} ##########`);
  console.log(`${new Date()}: Server running on port ${config.SERVER_PORT}...`);
});
