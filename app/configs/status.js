'use strict';

const getStatus = (code) => {
  let status = null;

  switch (code) {
    case 'success':
      status = {
        code: code,
        error: false,
        message: 'Successful'
      };
      break;

    case 'url_missing':
      status = {
        code: code,
        error: true,
        message: 'URL not found'
      };
      break;

    case 'headers_missing':
      status = {
        code: code,
        error: true,
        message: 'Mandatory headers missing.'
      };
      break;

    case 'input_missing':
      status = {
        code: code,
        error: true,
        message: 'Mandatory inputs missing.'
      };
      break;

    case 'authn_fail':
      status = {
        code: code,
        error: true,
        message: 'Authentication failed.'
      };
      break;

    case 'authr_fail':
      status = {
        code: code,
        error: true,
        message: 'Authorisation failed.'
      };
      break;

    case 'url_already_exists':
      status = {
        code: code,
        error: true,
        message: 'URL already exists.'
      };
      break;

    case 'alias_duplicate':
      status = {
        code: code,
        error: true,
        message: 'Alias duplicate.'
      };
      break;

    case 'generic_fail':
    default:
      status = {
        code: 'generic_fail',
        error: true,
        message: 'Generic failure: Something went wrong.'
      };
      break;
  }

  return status;
};

module.exports = {
  getStatus: getStatus
};
