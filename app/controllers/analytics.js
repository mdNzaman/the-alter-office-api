'use strict';

const analyticsService = require('app/services/analytics');

const wrapperService = require('app/services/wrapper');

const getAllAnaltyics = async (req, res, next) => {
  let analyticsParams = {};
  analyticsParams.userId = req._user.id;

  console.log(analyticsParams);

  let result = await analyticsService.getAllAnaltyics(analyticsParams);

  return res.json(result);
};

const getAnaltyics = async (req, res, next) => {
  if (!req.params.alias && !req.params.topic) {
    throw new Error('input_missing');
  }

  let analyticsParams = {};
  analyticsParams.userId = req._user.id;
  req.params.alias ? (analyticsParams.alias = req.params.alias) : null;
  req.params.topic ? (analyticsParams.topic = req.params.topic) : null;

  let result = await analyticsService.getAnaltyics(analyticsParams);

  return res.json(result);
};

module.exports = {
  getAllAnaltyics: wrapperService.wrap(getAllAnaltyics),
  getAnaltyics: wrapperService.wrap(getAnaltyics)
};
