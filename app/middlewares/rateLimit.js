const rateLimit = require('express-rate-limit');

const createUrlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    code: 'rate-limit',
    error: true,
    message: 'Too many requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  createUrlLimiter: createUrlLimiter
};
