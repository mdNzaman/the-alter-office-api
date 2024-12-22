'use strict';

const express = require('express');
const router = express.Router();

const controller = require('app/controllers/analytics');

router.get('/overall', controller.getAllAnaltyics);
router.get('/:alias', controller.getAnaltyics);
router.get('/topic/:topic', controller.getAnaltyics);

module.exports = router;
