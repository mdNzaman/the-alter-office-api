'use strict';

const crypto = require('crypto');
const https = require('https');

const config = require('app/configs/config');

const sanitizeSqlResult = (result) => {
  return JSON.parse(JSON.stringify(result));
};

const addDays = (date, numberOfDays) => {
  return new Date(date.setDate(date.getDate() + numberOfDays));
};

const createHierarchy = (input) => {
  let length = input.length;
  let result = [];

  for (let i = input.length - 1; i >= 0; i--) {
    if (input[i].parent_id) {
      let _index = input.indexOf(input.filter((inp) => inp.id === input[i].parent_id)[0]);

      if (!input[_index].hasOwnProperty('children')) {
        input[_index].children = [];
      }

      input[_index].children.push(input[i]);
      input.splice(i, 1);
    }
  }

  return input;
};

const sortByDesc = (key) => {
  return (array1, array2) => (array1[key] < array2[key] ? 1 : array2[key] < array1[key] ? -1 : 0);
};

const getMD5Hash = (input) => {
  return crypto.createHash('md5').update(input).digest('hex');
};

const generateUUID = (length) => {
  const uuid = crypto.randomUUID().replace(/-/g, '');
  if (length && length > 0 && length <= uuid.length) {
    return uuid.substring(0, length);
  } else {
    return uuid;
  }
};

const prepareFetchOptions = (options) => {
  if (options.method.toUpperCase() === 'GET') {
    delete options.body;
    options.qs && Object.keys(options.qs).length ? (options.url += '?' + new URLSearchParams(options.qs)) : null;
  }

  options.json ? delete options.json : null;
  options.headers ? (options.headers['Content-Type'] = 'application/json') : null;
  options.body ? (options.body = JSON.stringify(options.body)) : null;

  config.IPV6 ? (options.agent = new https.Agent({family: 6})) : null;

  return options;
};

module.exports = {
  sanitizeSqlResult: sanitizeSqlResult,
  addDays: addDays,
  createHierarchy: createHierarchy,
  sortByDesc: sortByDesc,
  getMD5Hash: getMD5Hash,
  generateUUID: generateUUID,
  prepareFetchOptions: prepareFetchOptions
};
