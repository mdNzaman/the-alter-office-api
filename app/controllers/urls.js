'use strict';

const defaultUserAgent = require('default-user-agent');

const urlsService = require('app/services/urls');

const wrapperService = require('app/services/wrapper');

const createShortUrl = async (req, res, next) => {
  if (!req.body.long_url) {
    throw new Error('input_missing');
  }

  let shortUrlParams = {};
  shortUrlParams.userId = req._user.id;
  shortUrlParams.longUrl = req.body.long_url;
  req.body.alias ? (shortUrlParams.alias = req.body.alias) : null;
  req.body.topic ? (shortUrlParams.topic = req.body.topic) : null;

  let result = await urlsService.createShortUrl(shortUrlParams);

  return res.json(result);
};

const redirectToLongUrl = async (req, res, next) => {
  if (!req.params.alias) {
    throw new Error('input_missing');
  }
  let shortUrlParams = {};
  shortUrlParams.userId = req._user.id;
  shortUrlParams.alias = req.params.alias;
  shortUrlParams.ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  shortUrlParams.userAgent = req.headers['user-agent'] ? req.headers['user-agent'] : defaultUserAgent();

  let result = await urlsService.redirectToLongUrl(shortUrlParams);

  return res.json(result);
  // res.redirect(result.data.url.long_url);
};

module.exports = {
  createShortUrl: wrapperService.wrap(createShortUrl),
  redirectToLongUrl: wrapperService.wrap(redirectToLongUrl)
};
