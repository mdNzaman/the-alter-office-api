'use strict';

const express = require('express');
const router = express.Router();

const controller = require('app/controllers/urls');

router.post('/', controller.createShortUrl);
router.get('/:alias', controller.redirectToLongUrl);

module.exports = router;
