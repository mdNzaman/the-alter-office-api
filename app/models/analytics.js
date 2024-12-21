'use strict';

const config = require('app/configs/config');

const utilsService = require('app/services/utils');
const wrapperService = require('app/services/wrapper');

const createAnalytics = async (params) => {
  if (!params.userId || !params.urlId || !params.ipAddress || !params.userAgent || !params.osType || !params.deviceType) {
    throw new Error('input_missing');
  }

  let _insert = {};
  _insert.user_id = params.userId;
  _insert.url_alias_id = params.urlId;
  _insert.ip_address = params.ipAddress;
  _insert.user_agent = params.userAgent;
  _insert.os_type = params.osType;
  _insert.device_type = params.deviceType;

  params.customAlias ? (_insert.alias = params.customAlias) : null, params.topic ? (_insert.topic = params.topic) : null;

  let createAnalyticsQuery = config.knex.insert(_insert).into('analytics');

  let result = await createAnalyticsQuery;

  return result[0];
};

const getAllAnaltyics = async (params) => {
  if (!params.userId) {
    throw new Error('input_missing');
  }

  let getAllAnalyticsQuery = config.knex
    .select('a.id')
    .select('a.user_id as user_id')
    .select('a.url_alias_id')
    .select('a.ip_address')
    .select('a.user_agent')
    .select('a.os_type')
    .select('a.device_type')
    .select('a.created_at')
    .select('ua.long_url')
    .select('ua.alias')
    .select('ua.topic')
    .from('analytics as a')
    .join('url_alias as ua', {'ua.id': 'a.url_alias_id'})
    .orderBy('a.created_at', 'desc');

  params.userId ? getAllAnalyticsQuery.where('ua.user_id', params.userId) : null;
  params.alias ? getAllAnalyticsQuery.where('ua.alias', params.alias) : null;
  params.topic ? getAllAnalyticsQuery.where('ua.topic', params.topic) : null;

  params.hasOwnProperty('active') ? getAllAnalyticsQuery.where('p.active', 1) : null;

  let results = await getAllAnalyticsQuery;

  if (!results || results.lengths === 0) {
    results = [];
  }

  results = _collateAnalytics(results);

  return utilsService.sanitizeSqlResult(results);
};

const getAnaltyics = async (params) => {
  if (!params.userId) {
    throw new Error('input_missing');
  }

  let analyticsParams = {};
  analyticsParams.userId = params.userId;
  params.alias ? (analyticsParams.alias = params.alias) : null;
  params.topic ? (analyticsParams.topic = params.topic) : null;
  params.hasOwnProperty('active') ? (analyticsParams.active = params.active) : null;

  let results = await getAllAnaltyics(analyticsParams);

  if (!results || results.length === 0) {
    return null;
  }

  return results[0];
};

const _collateAnalytics = (analytics) => {
  const result = {
    totalUrls: 0,
    totalClicks: 0,
    uniqueClicks: 0,
    clicksByDate: [],
    urls: [],
    osType: [],
    deviceType: []
  };

  result.totalUrls = Array.from(new Set(analytics.map((analytic) => analytic.url_alias_id))).length;
  result.totalClicks = analytics.length;
  result.uniqueClicks = Array.from(new Set(analytics.map((analytic) => analytic.ip_address))).length;
  let dates = Array.from(new Set(analytics.map((date) => date.created_at)));
  let topics = Array.from(new Set(analytics.map((topic) => topic.topic)));
  let osTypes = Array.from(new Set(analytics.map((osType) => osType.os_type)));
  let deviceTypes = Array.from(new Set(analytics.map((deviceType) => deviceType.device_type)));

  dates.forEach((date) => {
    let _clickCount = analytics.filter((data) => data.created_at === date).length;
    let _clicksByDate = {};
    _clicksByDate.date = date;
    _clicksByDate.clickCount = _clickCount;

    result.clicksByDate.push(_clicksByDate);
  });

  topics.forEach((topic) => {
    let _topics = analytics.filter((analytic) => analytic.topic === topic);
    let alias = Array.from(new Set(_topics.map((t) => t.alias)));

    alias.forEach((a) => {
      let _alias = _topics.filter((t) => t.alias === a);
      let _url = {};
      _url.shortUrl = a;
      _url.totalClicks = _alias.length;
      _url.uniqueClicks = Array.from(new Set(_alias.map((a) => a.ip_address))).length;

      result.urls.push(_url);
    });
  });

  osTypes.map((osType) => {
    let _osTypeCount = analytics.filter((data) => data.os_type === osType);
    let _osType = {};
    _osType.osName = osType;
    _osType.uniqueClicks = Array.from(new Set(_osTypeCount.map((osType) => osType.ipAddress))).length;
    _osType.uniqueUsers = Array.from(new Set(_osTypeCount.map((osType) => osType.user_id))).length;

    result.osType.push(_osType);
  });

  deviceTypes.map((deviceType) => {
    let _deviceTypeCount = analytics.filter((data) => data.device_type === deviceType);
    let _deviceType = {};
    _deviceType.deviceName = deviceType;
    _deviceType.uniqueClicks = Array.from(new Set(_deviceTypeCount.map((deviceType) => deviceType.ipAddress))).length;
    _deviceType.uniqueUsers = Array.from(new Set(_deviceTypeCount.map((deviceType) => deviceType.user_id))).length;

    result.deviceType.push(_deviceType);
  });

  result.clicksByDate.length > 7 ? (result.clicksByDate = result.clicksByDate.slice(0, 7)) : null;

  return result;
};

module.exports = {
  createAnalytics: wrapperService.wrap(createAnalytics),
  getAllAnaltyics: wrapperService.wrap(getAllAnaltyics),
  getAnaltyics: wrapperService.wrap(getAnaltyics)
};
