const rateLimitMap = new Map();

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_PER_MINUTE, 10) || 600;

  let clientRecord = rateLimitMap.get(ip);
  if (!clientRecord || (now - clientRecord.startTime) > windowMs) {
    clientRecord = { startTime: now, count: 1 };
    rateLimitMap.set(ip, clientRecord);
  } else {
    clientRecord.count++;
  }

  if (clientRecord.count > maxRequests) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please throttle your agent execution calls.'
    });
  }

  res.setHeader('X-RateLimit-Limit', maxRequests);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - clientRecord.count));
  next();
};

module.exports = rateLimiter;
