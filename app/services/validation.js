'use strict';

const wrapperService = require('app/services/wrapper');

module.exports = {
  validateProvider: wrapperService.wrap(validateProvider)
};
