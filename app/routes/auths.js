'use strict';

const express = require('express');
const router = express.Router();

const controller = require('app/controllers/auths');

router.get('/google', controller.createSocialAuthenticationRequest);
router.get('/verify/google', controller.verifyGoogleAuthentication, controller.postVerifyGoogleAuthentication);

module.exports = router;
