'use strict';

const express = require('express');
const router = express.Router();

const controller = require('app/controllers/urls');

const rateLimitMiddleware = require('app/middlewares/rateLimit');

router.post('/', rateLimitMiddleware.createUrlLimiter, controller.createShortUrl);
router.get('/:alias', controller.redirectToLongUrl);

module.exports = router;
