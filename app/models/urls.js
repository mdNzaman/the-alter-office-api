'use strict';

const config = require('app/configs/config');

const utilsService = require('app/services/utils');
const wrapperService = require('app/services/wrapper');

const createShortUrl = async (params) => {
  if (!params.userId || !params.longUrl) {
    throw new Error('input_missing');
  }

  let _insert = {};
  _insert.user_id = params.userId;
  _insert.long_url = params.longUrl;
  params.alias ? (_insert.alias = params.alias) : null;
  params.topic ? (_insert.topic = params.topic) : null;

  console.log(_insert);

  let createShortUrlQuery = config.knex.insert(_insert).into('url_alias');

  let result = await createShortUrlQuery;

  return result[0];
};

const getShortUrls = async (params) => {
  if (!params.userId && !params.urlId && !params.longUrl && !params.alias) {
    throw new Error('input_missing');
  }

  let getShortUrlQuery = config.knex.select('u.id').select('u.user_id as user_id').select('u.long_url').select('u.alias').select('u.topic').select('u.created_at').from('url_alias as u');

  params.urlId ? getShortUrlQuery.where('u.id', params.urlId) : null;
  params.userId ? getShortUrlQuery.where('u.user_id', params.userId) : null;
  params.hasOwnProperty('longUrl') ? getShortUrlQuery.where('u.long_url', params.longUrl) : null;
  params.hasOwnProperty('alias') ? getShortUrlQuery.where('u.alias', params.alias) : null;
  params.hasOwnProperty('active') ? getShortUrlQuery.where('u.active', 1) : null;

  let results = await getShortUrlQuery;

  if (!results || results.lengths === 0) {
    results = [];
  }

  return utilsService.sanitizeSqlResult(results);
};

const getShortUrl = async (params) => {
  if (!params.urlId && !params.userId && !params.longUrl && !params.alias) {
    throw new Error('input_missing');
  }

  let urlParams = {};
  params.urlId ? (urlParams.urlId = params.urlId) : null;
  params.userId ? (urlParams.userId = params.userId) : null;
  params.alias ? (urlParams.alias = params.alias) : null;
  params.hasOwnProperty('active') ? (urlParams.active = params.active) : null;

  console.log(urlParams);

  let results = await getShortUrls(urlParams);

  if (!results || results.length === 0) {
    return null;
  }

  return results[0];
};

module.exports = {
  createShortUrl: wrapperService.wrap(createShortUrl),
  getShortUrls: wrapperService.wrap(getShortUrls),
  getShortUrl: wrapperService.wrap(getShortUrl)
};
