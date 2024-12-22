'use strict';

const status = require('app/configs/status');

const wrapperService = require('app/services/wrapper');

const urlsModel = require('app/models/urls');
const analyticsModel = require('app/models/analytics');

const getAllAnaltyics = async (params) => {
  if (!params.userId) {
    throw new Error('input_missing');
  }

  let analyticsParams = {};
  analyticsParams.userId = params.userId;

  let analytics = await analyticsModel.getAllAnaltyics(analyticsParams);

  if (analytics) {
    delete analytics.urls;
  }

  let response = status.getStatus('success');
  response.data = {};
  response.data.analytics = {};
  response.data.analytics = analytics;

  return response;
};

const getAnaltyics = async (params) => {
  if (!params.userId || (!params.alias && !params.topic)) {
    throw new Error('input_missing');
  }

  if (params.alias) {
    let analyticsParams = {};
    analyticsParams.userId = params.userId;
    analyticsParams.alias = params.alias;

    let alias = await urlsModel.getShortUrls(analyticsParams);

    if (alias && alias.length === 0) {
      throw new Error('alias_invalid');
    }
  }

  if (params.topic) {
    let analyticsParams = {};
    analyticsParams.userId = params.userId;
    analyticsParams.topic = params.topic;

    let topic = await urlsModel.getShortUrls(analyticsParams);

    if (topic && topic.length === 0) {
      throw new Error('topic_invalid');
    }
  }

  let analyticsParams = {};
  analyticsParams.userId = params.userId;
  params.alias ? (analyticsParams.alias = params.alias) : null;
  params.topic ? (analyticsParams.topic = params.topic) : null;

  let analytics = await analyticsModel.getAnaltyics(analyticsParams);

  if (analytics && params.alias) {
    delete analytics.totalUrls;
    delete analytics.urls;
  }

  if (analytics && params.topic) {
    delete analytics.totalUrls;
    delete analytics.osType;
    delete analytics.deviceType;
  }

  let response = status.getStatus('success');
  response.data = {};
  response.data.analytics = {};
  response.data.analytics = analytics;

  return response;
};

module.exports = {
  getAnaltyics: wrapperService.wrap(getAnaltyics),
  getAllAnaltyics: wrapperService.wrap(getAllAnaltyics)
};
