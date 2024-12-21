'use strict';

const config = require('app/configs/config');

const utilsService = require('app/services/utils');
const wrapperService = require('app/services/wrapper');

const createAnalytics = async (params) => {
  console.log(params);
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
    .from('analytics as a')
    .join('url_alias as ua', {'ua.id': 'a.url_alias_id'});

  params.userId ? getAllAnalyticsQuery.where('ua.user_id', params.userId) : null;
  params.alias ? getAllAnalyticsQuery.where('ua.alias', params.alias) : null;
  params.topic ? getAllAnalyticsQuery.where('ua.topic', params.topic) : null;

  params.hasOwnProperty('active') ? getAllAnalyticsQuery.where('p.active', 1) : null;

  let results = await getAllAnalyticsQuery;

  if (!results || results.lengths === 0) {
    results = [];
  }

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

module.exports = {
  createAnalytics: wrapperService.wrap(createAnalytics),
  getAllAnaltyics: wrapperService.wrap(getAllAnaltyics),
  getAnaltyics: wrapperService.wrap(getAnaltyics)
};
