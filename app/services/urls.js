'use strict';

const UAParser = require('ua-parser-js');

const config = require('app/configs/config');
const status = require('app/configs/status');

const utilsService = require('app/services/utils');
const wrapperService = require('app/services/wrapper');

const analyticsModel = require('app/models/analytics');
const urlsModel = require('app/models/urls');

const createShortUrl = async (params) => {
  if (!params.userId || !params.longUrl) {
    throw new Error('input_missing');
  }

  // apply rate limiting

  let urlParams = {};
  urlParams.longUrl = params.longUrl;

  let urlExist = await urlsModel.getShortUrls(urlParams);

  if (urlExist && urlExist.length > 0) {
    throw new Error('url_already_exists');
  }

  if (params.alias) {
    urlParams = {};
    urlParams.alias = params.alias;

    let aliasExist = await urlsModel.getShortUrls(urlParams);

    if (aliasExist && aliasExist.length > 0) {
      throw new Error('alias_duplicate');
    }
  }

  urlParams = {};
  urlParams.userId = params.userId;
  urlParams.longUrl = params.longUrl;
  urlParams.alias = params.alias ? params.alias : utilsService.generateUUID(5);
  params.topic ? (urlParams.topic = params.topic) : null;

  let urlId = await urlsModel.createShortUrl(urlParams);

  urlParams = {};
  urlParams.urlId = urlId;

  let url = await urlsModel.getShortUrl(urlParams);

  const shortUrl = `${config.HEALTHCHECKS.DEPLOY_BASE_URL}/${url.alias}`;

  let response = status.getStatus('success');
  response.data = {};
  response.data.short_url = {};
  response.data.short_url.short_url = shortUrl;
  response.data.short_url.created_at = url.created_at;

  return response;
};

const redirectToLongUrl = async (params) => {
  if (!params.userId || !params.alias || !params.ipAddress || !params.userAgent) {
    throw new Error('input_missing');
  }

  let urlParams = {};
  urlParams.alias = params.alias;
  urlParams.active = 1;

  let url = await urlsModel.getShortUrl(urlParams);

  if (!url) {
    throw new Error('authr_fail');
  }

  let userAgent = new UAParser('Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0').getResult();

  console.log(userAgent);

  const analyticsParams = {};
  analyticsParams.userId = params.userId;
  analyticsParams.urlId = url.id;
  analyticsParams.ipAddress = params.ipAddress;
  analyticsParams.userAgent = params.userAgent;
  analyticsParams.osType = userAgent.os.name ? userAgent.os.name : 'macOS';
  analyticsParams.deviceType = userAgent.device.type ? userAgent.device.type : 'Desktop';

  console.log(analyticsParams);

  let res = await analyticsModel.createAnalytics(analyticsParams);

  console.log(res);
  const shortUrl = `${config.HEALTHCHECKS.DEPLOY_BASE_URL}/${url.alias}`;

  let response = status.getStatus('success');
  response.data = {};
  response.data.short_url = {};
  response.data.short_url.short_url = shortUrl;
  response.data.short_url.created_at = url.created_at;

  return response;
};

module.exports = {
  createShortUrl: wrapperService.wrap(createShortUrl),
  redirectToLongUrl: wrapperService.wrap(redirectToLongUrl)
};
