'use strict';

const config = require('app/configs/config');

const utilsService = require('app/services/utils');
const wrapperService = require('app/services/wrapper');

const createUser = async (params) => {
  if (!params.email) {
    throw new Error('input_missing');
  }

  let _insert = {
    email: params.email
  };

  let createUserQuery = config.knex.insert(_insert).into('users');

  let result = await createUserQuery;

  return result[0];
};

const getUsers = async (params) => {
  if (!params.userId && !params.email) {
    throw new Error('input_missing');
  }

  let getUsersQuery = config.knex.select('u.id').select('u.email').select('u.active').from('users as u');

  params.userId ? getUsersQuery.where('u.id', params.userId) : null;
  params.email ? getUsersQuery.where('u.email', params.email) : null;
  params.hasOwnProperty('active') ? getUsersQuery.where('u.active', params.active) : null;

  let result = await getUsersQuery;

  return utilsService.sanitizeSqlResult(result);
};

const getUser = async (params) => {
  if (!params.userId && !params.email) {
    throw new Error('input_missing');
  }

  let userParams = {};
  params.userId ? (userParams.userId = params.userId) : null;
  params.email ? (userParams.email = params.email) : null;
  params.hasOwnProperty('active') ? (userParams.active = params.active) : null;

  let result = await getUsers(userParams);

  if (!result || result.length === 0) {
    return null;
  }

  return utilsService.sanitizeSqlResult(result[0]);
};

module.exports = {
  createUser: wrapperService.wrap(createUser),
  getUsers: wrapperService.wrap(getUsers),
  getUser: wrapperService.wrap(getUser)
};
