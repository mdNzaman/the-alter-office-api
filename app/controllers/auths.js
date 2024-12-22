'use strict';

const passport = require('passport');

const config = require('app/configs/config');

const authsService = require('app/services/auths');
const wrapperService = require('app/services/wrapper');

const createSocialAuthenticationRequest = async (req, res, next) => {
  if (!req.query.state) {
    throw new Error('input_missing');
  }

  let authenticationRequestParams = {};
  authenticationRequestParams.state = req.query.state;

  let middleware = await authsService.createAuthenticationRequest(authenticationRequestParams);

  return middleware(req, res, next);
};

const verifyGoogleAuthentication = async (req, res, next) => {
  let authenticationParams = {};
  req.query.state ? (authenticationParams.state = req.query.state) : null;

  let middleware = await authsService.verifyGoogleAuthentication(authenticationParams);

  return middleware(req, res, next);
};

const postVerifyGoogleAuthentication = async (req, res, next) => {
  let authenticationParams = {};
  authenticationParams.profileId = req.user.id;
  authenticationParams.email = req.user.emails[0].value;
  authenticationParams.firstName = req.user.name.givenName;
  authenticationParams.lastName = req.user.name.familyName;

  let result = await authsService.socialLogin(authenticationParams);

  return res.json(result);
  // return res.redirect(`${config.UI.DEPLOY_URL}/auths/verify`);
};

module.exports = {
  createSocialAuthenticationRequest: wrapperService.wrap(createSocialAuthenticationRequest),
  verifyGoogleAuthentication: wrapperService.wrap(verifyGoogleAuthentication),
  postVerifyGoogleAuthentication: wrapperService.wrap(postVerifyGoogleAuthentication)
};
