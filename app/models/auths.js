'use strict';

const config = require('app/configs/config');

const utilsService = require('app/services/utils');
const wrapperService = require('app/services/wrapper');

const getDevice = async (params) => {
  if (!params.deviceId && !params.identifier) {
    throw new Error('input_missing');
  }

  let getDeviceQuery = config.knex.select('d.id').select('d.origin_id').select('d.platform_id').select('d.app_version').select('d.user_agent').from('devices as d');

  params.deviceId ? getDeviceQuery.where('d.id', params.deviceId) : null;
  params.identifier ? getDeviceQuery.where('d.identifier', params.identifier) : null;

  let result = await getDeviceQuery;

  if (!result || result.length === 0) {
    return null;
  }

  return utilsService.sanitizeSqlResult(result[0]);
};

const createDevice = async (params) => {
  if (!params.identifier || !params.originId || !params.platformId || !params.appVersion || !params.userAgent) {
    throw new Error('input_missing');
  }

  let _insert = {
    identifier: params.identifier,
    origin_id: params.originId,
    platform_id: params.platformId,
    app_version: params.appVersion,
    user_agent: params.userAgent
  };

  let createDeviceQuery = config.knex.insert(_insert).into('devices');

  let result = await createDeviceQuery;

  return utilsService.sanitizeSqlResult(result[0]);
};

const updateDevice = async (params) => {
  if (!params.deviceId && !params.identifier) {
    throw new Error('input_missing');
  }

  let _update = {updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')};
  params.version ? (_update['app_version'] = params.version) : null;
  params.userAgent ? (_update['user_agent'] = params.userAgent) : null;

  let updateDeviceQuery = config.knex('devices').update(_update);

  params.deviceId ? updateDeviceQuery.where('id', params.deviceId) : null;
  params.identifier ? updateDeviceQuery.where('identifier', params.identifier) : null;

  let result = await updateDeviceQuery;

  return true;
};

const getSession = async (params) => {
  if (!params.sessionId && !params.token && !params.userId) {
    throw new Error('input_missing');
  }

  let getSessionQuery = config.knex
    .select('s.id')
    .select('u.email')
    .select('s.token')
    .select('s.user_id')
    .select('s.expiry')
    .select('s.active')
    .select('d.id as device_id')
    .select('d.identifier')
    .select('d.origin_id')
    .select('d.platform_id')
    .select('d.app_version')
    .select('d.user_agent')
    .from('sessions as s')
    .join('devices as d', {'d.id': 's.device_id'})
    .join('users as u', {'u.id': 's.user_id'})
    .orderBy('s.id', 'desc');

  params.sessionId ? getSessionQuery.where('s.id', params.sessionId) : null;
  params.token ? getSessionQuery.where('s.token', params.token) : null;
  params.userId ? getSessionQuery.where('s.user_id', params.userId) : null;
  params.deviceId ? getSessionQuery.where('s.device_id', params.deviceId) : null;

  let result = await getSessionQuery;

  if (!result || result.length === 0) {
    return null;
  }

  return utilsService.sanitizeSqlResult(result[0]);
};

const createSession = async (params) => {
  if (!params.token || !params.deviceId || !params.userId) {
    throw new Error('input_missing');
  }

  let _insert = {
    user_id: params.userId,
    device_id: params.deviceId,
    token: params.token,
    expiry: new Date(params.expiry)
  };

  let createSessionQuery = config.knex.insert(_insert).into('sessions');

  let result = (await createSessionQuery)[0];

  return result;
};

const updateSession = async (params) => {
  if (!params.sessionId && !params.token) {
    throw new Error('input_missing');
  }

  let _update = {updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')};
  params.expiry ? (_update['expiry'] = new Date(params.expiry)) : null;
  params.hasOwnProperty('active') ? (_update['active'] = params.active) : null;

  let updateSessionQuery = config.knex('sessions').update(_update);

  params.sessionId ? updateSessionQuery.where('id', params.sessionId) : null;
  params.token ? updateSessionQuery.where('token', params.token) : null;

  let result = await updateSessionQuery;

  return true;
};

module.exports = {
  getDevice: wrapperService.wrap(getDevice),
  createDevice: wrapperService.wrap(createDevice),
  updateDevice: wrapperService.wrap(updateDevice),
  getSession: wrapperService.wrap(getSession),
  createSession: wrapperService.wrap(createSession),
  updateSession: wrapperService.wrap(updateSession)
};
