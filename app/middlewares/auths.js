'use strict';

const defaultUserAgent = require('default-user-agent');

const authsService = require('app/services/auths');
const wrapperService = require('app/services/wrapper');

const middleware = async (req, res, next) => {
  let skip = false;

  // if (!req.headers['x-identifier'] || !req.headers['x-origin'] || !req.headers['x-platform'] || !req.headers['x-version']) {
  //   throw new Error('headers_missing');
  // }

  let whitelistedRoutes = [
    {
      methods: ['GET'],
      uri: /\/auths\/google$/
    },

    {
      methods: ['GET'],
      uri: /\/api\/auths\/verify\/google$/
    }
  ];

  whitelistedRoutes.map((route) => {
    if (route.uri.test(req.originalUrl.split('?')[0]) && route.methods.includes(req.method)) {
      skip = true;
    }
  });

  if (skip) {
    return next();
  }

  if (!req.headers['x-auth']) {
    throw new Error('headers_missing');
  }

  let authParams = {};
  authParams.originId = parseInt(req.headers['x-origin']);
  authParams.platformId = parseInt(req.headers['x-platform']);
  authParams.identifier = req.headers['x-identifier'];
  authParams.version = parseInt(req.headers['x-version']);
  authParams.token = req.headers['x-auth'];
  authParams.userAgent = req.headers['user-agent'] ? req.headers['user-agent'] : defaultUserAgent();

  let result = await authsService.validateSession(authParams);
  if (!result || result.code !== 'success') {
    throw new Error('authn_fail');
  }

  req._user = {};
  req._user.id = parseInt(result.data.user.id);
  req._user.email = parseInt(result.data.user.email);

  return next();
};

module.exports = wrapperService.wrap(middleware);
