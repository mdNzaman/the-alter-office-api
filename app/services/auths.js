'use strict';

const defaultUserAgent = require('default-user-agent');
const passport = require('passport');

const config = require('app/configs/config');
const status = require('app/configs/status');

const utilsService = require('app/services/utils');
const wrapperService = require('app/services/wrapper');

const authsModel = require('app/models/auths');
const usersModel = require('app/models/users');

const createAuthenticationRequest = async (params) => {
  if (!params.state) {
    throw new Error('input_missing');
  }

  let authenticationRequestParams = {};
  authenticationRequestParams.reference = utilsService.generateUUID();
  authenticationRequestParams.state = params.state;
  authenticationRequestParams.verified = 0;
  authenticationRequestParams.expiry = new Date(new Date().setMinutes(new Date().getMinutes() + 5)).toISOString();
  authenticationRequestParams.identifier = params.identifier;

  let authenticationRequestId = await authsModel.createAuthenticationRequest(authenticationRequestParams);

  authenticationRequestParams = {};
  authenticationRequestParams.authenticationRequestId = authenticationRequestId;

  (await authsModel.getAuthenticationRequests(authenticationRequestParams))[0];

  let oauthMiddleware = passport.authenticate('google', {scope: config.OAUTH['GOOGLE'].SCOPE});
  return oauthMiddleware;
};

const verifyGoogleAuthentication = async (params) => {
  return passport.authenticate('google', {session: false});
};

const socialLogin = async (params) => {
  if (!params.profileId || !params.firstName || !params.lastName || !params.email) {
    throw new Error('input_missing');
  }

  let userParams = {};
  userParams.email = params.email;

  let user = await usersModel.getUser(userParams);

  if (!user) {
    let userParams = {};
    userParams.email = params.email;

    let userId = await usersModel.createUser(userParams);
    if (!userId) {
      throw new Error(result);
    }

    userParams = {};
    userParams.userId = userId;
    user = await usersModel.getUser(userParams);
  }

  let deviceParams = {};
  deviceParams.identifier = params.identifier ? params.identifier : 'default.device';

  let device = await authsModel.getDevice(deviceParams);

  if (!device) {
    let deviceParams = {};
    deviceParams.identifier = params.identifier ? params.identifier : 'default.device';
    deviceParams.originId = params.originId ? params.originId : 1;
    deviceParams.platformId = params.platformId ? params.platformId : 1;
    deviceParams.appVersion = params.appVersion ? params.appVersion : 1;
    deviceParams.userAgent = params.userAgent ? params.userAgent : defaultUserAgent();

    await authsModel.createDevice(deviceParams);

    deviceParams = {};
    deviceParams.identifier = params.identifier ? params.identifier : 'default.device';
    deviceParams.originId = params.originId ? params.originId : 1;
    deviceParams.platformId = params.platformId ? params.platformId : 1;
    deviceParams.appVersion = params.appVersion ? params.appVersion : 1;

    device = await authsModel.getDevice(deviceParams);
  }

  let sessionParams = {};
  sessionParams.userId = user.id;
  sessionParams.deviceId = device.id;
  sessionParams.token = utilsService.generateUUID();
  sessionParams.expiry = utilsService.addDays(new Date(), config.AUTH.SESSION_EXPIRY_EXTEND_DAYS).toISOString().slice(0, 19).replace('T', ' ');

  let sessionId = await authsModel.createSession(sessionParams);
  let session = await authsModel.getSession(sessionParams);

  let response = status.getStatus('success');
  response.data = {};
  response.data.user = user;
  response.data.session = session;

  return response;
};

const validateSession = async (params) => {
  if (!params.originId || !params.platformId || !params.version || !params.token || !params.userAgent) {
    throw new Error('input_missing');
  }

  let sessionParams = {};
  sessionParams.token = params.token;

  let session = await authsModel.getSession(sessionParams);

  if (!session.active || new Date(session.expiry) < new Date()) {
    throw new Error('authn_fail');
  }

  sessionParams = {};
  sessionParams.token = params.token;
  sessionParams.version = params.version;
  sessionParams.userAgent = params.userAgent;
  sessionParams.expiry = utilsService.addDays(new Date(), config.AUTH.SESSION_EXPIRY_EXTEND_DAYS).toISOString().slice(0, 19).replace('T', ' ');

  await authsModel.updateSession(sessionParams);

  let response = status.getStatus('success');
  response.data = {};
  response.data.user = {};
  response.data.user.id = session.user_id;
  response.data.user.email = session.email;
  response.data.user.session = {};
  response.data.user.session.token = session.token;
  response.data.user.session.expiry = session.expiry;

  return response;
};

module.exports = {
  createAuthenticationRequest: wrapperService.wrap(createAuthenticationRequest),
  verifyGoogleAuthentication: wrapperService.wrap(verifyGoogleAuthentication),
  socialLogin: wrapperService.wrap(socialLogin),
  validateSession: wrapperService.wrap(validateSession)
};
